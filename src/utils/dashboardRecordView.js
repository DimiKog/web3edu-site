/**
 * Dashboard v2 — historical Record metrics (presentation only).
 * Does not compute Learning Journey tiers from XP.
 */

/**
 * Detect Genesis from metadata eventBadges (same heuristic as Dashboard pages).
 * @param {Record<string, unknown>|null|undefined} metadata
 * @returns {boolean}
 */
export function hasGenesisBadgeInMetadata(metadata) {
  const eventBadges = Array.isArray(metadata?.eventBadges) ? metadata.eventBadges : [];
  return eventBadges.some((b) => {
    if (typeof b === "string") {
      return b.toLowerCase().includes("genesis");
    }
    const name = String(b?.name || b?.label || b?.en || b?.gr || "").toLowerCase();
    const id = String(b?.id || b?.slug || "").toLowerCase();
    return name.includes("genesis") || id.includes("genesis");
  });
}

/**
 * @param {Record<string, unknown>|null|undefined} metadata
 */
export function getDashboardRecordMetrics(metadata) {
  const safe = metadata && typeof metadata === "object" ? metadata : {};
  const xpRaw = safe.xp_total ?? safe.xp ?? 0;
  const xp = typeof xpRaw === "number" && Number.isFinite(xpRaw) ? Math.max(0, xpRaw) : 0;

  const labsObj =
    (safe.labs_completed && typeof safe.labs_completed === "object"
      ? safe.labs_completed
      : null) ||
    (safe.labs && typeof safe.labs === "object" ? safe.labs : null) ||
    {};
  const labsCompleted = Object.keys(labsObj).length;

  const projectsObj =
    (safe.projectsCompleted && typeof safe.projectsCompleted === "object"
      ? safe.projectsCompleted
      : null) ||
    (safe.projects_completed && typeof safe.projects_completed === "object"
      ? safe.projects_completed
      : null) ||
    {};
  const projectsCount = Object.keys(projectsObj).length;

  const badges = Array.isArray(safe.badges) ? safe.badges : [];
  const eventBadges = Array.isArray(safe.eventBadges) ? safe.eventBadges : [];
  const badgesCount = badges.length + eventBadges.length;

  const poeKeys = ["proof-of-escape", "poe", "poe01"];
  const hasPoe = poeKeys.some(
    (key) => Boolean(projectsObj[key]) || Boolean(labsObj[key])
  );

  return {
    xp,
    labsCompleted,
    projectsCount,
    badgesCount,
    hasPoe,
    hasGenesis: hasGenesisBadgeInMetadata(safe),
  };
}

/**
 * Resolve the v2 passed-assessment bucket from metadata/state mirrors.
 * @param {unknown} source
 * @returns {Record<string, unknown>|null}
 */
export function getModuleAssessmentsV2Bucket(source) {
  if (!source || typeof source !== "object") return null;
  const root =
    source.moduleAssessments ??
    source.module_assessments ??
    (source.v2 ? source : null);
  if (!root || typeof root !== "object") return null;
  const bucket = root.v2 && typeof root.v2 === "object" ? root.v2 : null;
  return bucket;
}

/**
 * Build timeline entries for passed LM assessments only (read-only projection).
 * Uses persisted completedAt + xpAwarded; never infers from XP totals.
 *
 * @param {unknown} moduleAssessmentsSource
 * @param {"en"|"gr"} [lang]
 * @returns {Array<{type:string,id:string,title:object,xp:number,completedAt:string}>}
 */
export function getPassedAssessmentTimelineEntries(
  moduleAssessmentsSource,
  lang = "en"
) {
  const bucket = getModuleAssessmentsV2Bucket(moduleAssessmentsSource);
  if (!bucket) return [];

  const isGR = lang === "gr";
  const entries = [];

  for (const [moduleId, record] of Object.entries(bucket)) {
    if (!moduleId || !record || typeof record !== "object") continue;
    if (record.passed !== true) continue;
    const completedAt =
      typeof record.completedAt === "string" ? record.completedAt.trim() : "";
    if (!completedAt) continue;
    const xpRaw = Number(record.xpAwarded);
    const xp = Number.isFinite(xpRaw) && xpRaw > 0 ? Math.trunc(xpRaw) : 0;

    entries.push({
      type: "assessment",
      id: moduleId,
      title: {
        en: `${moduleId} — Assessment completed`,
        gr: `${moduleId} — Ολοκλήρωση αξιολόγησης`,
      },
      xp,
      completedAt,
    });
  }

  // Prefer localized string when merging into Dashboard (timeline supports objects too)
  return entries.map((entry) => ({
    ...entry,
    title: isGR ? entry.title.gr : entry.title.en,
  }));
}

/**
 * Compact Learning Timeline metrics from the enriched timeline feed
 * (not Record xp_total).
 * @param {unknown[]} timeline
 */
export function getTimelineCompactStats(timeline) {
  const stats = {
    labs: 0,
    projects: 0,
    assessments: 0,
    lessons: 0,
    quizzes: 0,
    activities: 0,
    timelineXp: 0,
  };
  if (!Array.isArray(timeline)) return stats;

  for (const item of timeline) {
    if (!item || typeof item !== "object") continue;
    stats.activities += 1;
    const type = item.type;
    if (type === "lab") stats.labs += 1;
    else if (type === "project") stats.projects += 1;
    else if (type === "assessment") stats.assessments += 1;
    else if (type === "lesson") stats.lessons += 1;
    else if (type === "quiz") stats.quizzes += 1;
    const xp = Number(item.xp);
    if (Number.isFinite(xp) && xp > 0) stats.timelineXp += xp;
  }

  return stats;
}
