import PageShell from "../components/PageShell.jsx";
import { Link, useLocation } from "react-router-dom";
import { localizeProject, projects } from "../services/projectService";
import { useEffect, useMemo, useState } from "react";
import SectionBadge from "../components/SectionBadge.jsx";
import {
  createBackendError,
  getRoleFromXpTotal,
  getXpTotalFromBackend,
  isUserStateUnavailableError,
} from "../utils/progression.js";

export default function Projects() {
  const { pathname } = useLocation();
  const isGR = pathname.startsWith("/projects-gr");
  const [completedProjects, setCompletedProjects] = useState({});
  const [userTier, setUserTier] = useState("explorer");

  const wallet = useMemo(
    () => localStorage.getItem("web3edu-wallet-address") || "",
    []
  );
  const activeProjects = useMemo(
    () => projects.filter((project) => project.status === "active"),
    []
  );
  const comingSoonProjects = useMemo(
    () => projects.filter((project) => project.status === "coming-soon"),
    []
  );

  useEffect(() => {
    if (!wallet) {
      setCompletedProjects({});
      setUserTier("explorer");
      return;
    }

    const controller = new AbortController();

    fetch(`https://web3edu-api.dimikog.org/web3sbt/resolve/${wallet}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().catch(() => ({})).then((payload) => {
          throw createBackendError(res.status, payload);
        });
      })
      .then((data) => {
        const xpTotal = getXpTotalFromBackend(data);
        setCompletedProjects(data?.metadata?.projectsCompleted || {});
        setUserTier(getRoleFromXpTotal(xpTotal).toLowerCase());
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          if (isUserStateUnavailableError(err)) {
            console.warn("Backend user state temporarily unavailable; preserving project access state.");
            return;
          }
          console.error("Failed to load project completion status", err);
          setUserTier("explorer");
        }
      });

    return () => controller.abort();
  }, [wallet]);

  const content = isGR
    ? {
      ctaPrimary: "/labs-gr",
      ctaSecondary: "/start-here-gr",
      eyebrow: "Challenge Projects",
      title: "Projects",
      description:
        "Τα Projects λειτουργούν ως εκπαιδευτικά hands-on challenges που σας μεταφέρουν από τη θεωρία στην έρευνα πάνω σε πραγματικά blockchain δεδομένα. Κάθε project εστιάζει σε μία πρακτική δεξιότητα και ξεκλειδώνει την επόμενη πρόκληση.",
      primaryLabel: "Εξερεύνηση Labs",
      secondaryLabel: "Διαδρομή Μάθησης",
      cards: [
        {
          title: "On-Chain Έρευνα",
          text: "Εξερευνήστε transactions, logs και payloads για να εντοπίσετε κρυμμένα δεδομένα και να κατανοήσετε τι συμβαίνει πραγματικά στο chain.",
          color: "from-[#FF67D2]/18 via-[#8A57FF]/12 to-transparent",
        },
        {
          title: "Σταδιακή Δυσκολία",
          text: "Ξεκινήστε με πιο προσιτές προκλήσεις Builder και ξεκλειδώστε πιο απαιτητικές αναλύσεις καθώς προχωράτε.",
          color: "from-[#8A57FF]/18 via-[#4ACBFF]/12 to-transparent",
        },
        {
          title: "Αποδείξιμη Πρόοδος",
          text: "Η ολοκλήρωση των challenges καταγράφει την πρόοδό σας και ενισχύει το Web3Edu learning profile σας με XP και badges.",
          color: "from-[#4ACBFF]/18 via-[#FF67D2]/10 to-transparent",
        },
      ],
      sectionTitle: "Εκπαιδευτικά Projects",
      sectionDescription: "Ξεκινήστε με το πρώτο challenge και προχωρήστε σε πιο σύνθετες blockchain investigations.",
      lockedLabel: "Κλειδωμένο",
      lockedProject: "Κλειδωμένο Project",
      lockedHint: "Ξεκλειδώνει μετά την ολοκλήρωση προηγούμενου challenge",
      skillLabel: "Εστίαση",
      viewProject: "Προβολή Project",
      lockedReachBuilder: "🔒 Κλειδωμένο — φτάσε Builder",
    }
    : {
      ctaPrimary: "/labs",
      ctaSecondary: "/start-here",
      eyebrow: "Challenge Projects",
      title: "Projects",
      description:
        "Projects are hands-on investigation challenges designed to move you from theory into hands-on investigation of real blockchain data. Each project emphasizes one practical skill and unlocks the next layer of challenge.",
      primaryLabel: "Explore Labs",
      secondaryLabel: "Learning Path",
      cards: [
        {
          title: "On-Chain Investigation",
          text: "Inspect transactions, logs, and payloads to uncover hidden data and understand what is actually happening on-chain.",
          color: "from-[#FF67D2]/18 via-[#8A57FF]/12 to-transparent",
        },
        {
          title: "Progressive Difficulty",
          text: "Start with approachable Builder-level investigations and unlock deeper, more demanding analysis challenges as you progress.",
          color: "from-[#8A57FF]/18 via-[#4ACBFF]/12 to-transparent",
        },
        {
          title: "Verifiable Progress",
          text: "Completing challenges records your progress and strengthens your Web3Edu learning profile with XP and badges.",
          color: "from-[#4ACBFF]/18 via-[#FF67D2]/10 to-transparent",
        },
      ],
      sectionTitle: "Learning Projects",
      sectionDescription: "Begin with the first challenge and work your way toward more advanced blockchain investigations.",
      lockedLabel: "Locked",
      lockedProject: "Locked Project",
      lockedHint: "Unlocks after completing an earlier challenge",
      skillLabel: "Focus",
      viewProject: "View Project",
      lockedReachBuilder: "🔒 Locked — reach Builder",
    };

  const canViewProject = userTier === "builder" || userTier === "architect";

  return (
    <PageShell>
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#8A57FF]/22 blur-[160px]" />
          <div className="absolute top-1/4 right-[-5rem] h-[24rem] w-[24rem] rounded-full bg-[#4ACBFF]/18 blur-[150px]" />
          <div className="absolute bottom-[12%] left-[-4rem] h-[22rem] w-[22rem] rounded-full bg-[#FF67D2]/14 blur-[135px]" />
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(138,87,255,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(74,203,255,0.35)_1px,transparent_1px)] bg-[size:56px_56px]" />
        </div>

        <main className="relative mx-auto flex max-w-5xl flex-col gap-10 px-4 py-20">
          <section className="relative overflow-hidden rounded-[28px]">
            <div className="absolute -inset-0.5 rounded-[28px] bg-gradient-to-r from-[#FF67D2]/40 via-[#8A57FF]/45 to-[#4ACBFF]/40 blur-sm" />
            <div className="relative rounded-[28px] border border-white/10 bg-gradient-to-br from-[#0A0F1A]/94 via-[#101728]/94 to-[#131D30]/94 p-8 shadow-[0_0_70px_rgba(138,87,255,0.16)] backdrop-blur-xl md:p-12">
              <span className="inline-flex rounded-full border border-[#8A57FF]/40 bg-[#8A57FF]/16 px-4 py-1 text-sm font-semibold text-[#D8C6FF] shadow-[0_0_20px_rgba(138,87,255,0.22)]">
                {content.eyebrow}
              </span>
              <h1 className="mt-6 bg-gradient-to-r from-[#FFFFFF] via-[#FF67D2] to-[#4ACBFF] bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-5xl">
                {content.title}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-white/72 md:text-lg">
                {content.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to={content.ctaPrimary}
                  className="rounded-full bg-gradient-to-r from-[#4ACBFF] via-[#5D8BFF] to-[#8A57FF] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_38px_rgba(74,203,255,0.22)] transition hover:scale-[1.02]"
                >
                  {content.primaryLabel}
                </Link>
                <Link
                  to={content.ctaSecondary}
                  className="rounded-full border border-[#8A57FF]/35 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white/82 transition hover:border-[#FF67D2]/45 hover:bg-[#8A57FF]/10 hover:text-white"
                >
                  {content.secondaryLabel}
                </Link>
              </div>
            </div>
          </section>

          <section className="grid gap-5 md:grid-cols-3">
            {content.cards.map((card) => (
              <ProjectCard
                key={card.title}
                title={card.title}
                text={card.text}
                color={card.color}
              />
            ))}
          </section>

          <section className="mt-6">
            <SectionBadge label={content.sectionTitle} className="mb-4" />
            <h2 className="bg-gradient-to-r from-[#FFFFFF] via-[#B8C8FF] to-[#4ACBFF] bg-clip-text text-3xl font-extrabold tracking-tight text-transparent md:text-4xl">
              {content.sectionTitle}
            </h2>
            <p className="mb-4 text-white/60 text-sm">
              {content.sectionDescription}
            </p>

            <div className="grid gap-5 md:grid-cols-3">
              {activeProjects.map((project, index) => {
                const localizedProject = localizeProject(project, isGR);
                const backendProjectId = localizedProject.backendId || localizedProject.id;
                const isCompleted = Boolean(completedProjects?.[backendProjectId]);
                return (
                  <article
                    key={localizedProject.id}
                    className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#121827]/96 to-[#191E30]/92 p-6 shadow-[0_20px_55px_rgba(2,8,23,0.32)] backdrop-blur-md"
                  >
                    {isCompleted && (
                      <div className="absolute top-4 right-4 z-20">
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/90 px-3 py-1 text-xs font-semibold text-white shadow-lg backdrop-blur transition transform motion-safe:animate-[fadeInScale_300ms_ease-out]">
                          ✓ {isGR ? "Ολοκληρώθηκε" : "Completed"}
                        </span>
                      </div>
                    )}
                    <div
                      className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r ${getGlowByIndex(
                        index
                      )} opacity-70 blur-2xl transition duration-500 group-hover:opacity-100`}
                    />

                    <img
                      src={localizedProject.image}
                      alt={localizedProject.title}
                      className="relative mb-4 h-40 w-full rounded-xl object-cover"
                    />

                    <h3 className="relative text-lg font-semibold text-white">{localizedProject.title}</h3>
                    <p className="relative mt-2 text-sm text-white/72">{localizedProject.description}</p>

                    <div className="relative mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#8A57FF]/35 bg-[#8A57FF]/16 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#D8C6FF]">
                        {isGR ? "Δυσκολία" : "Difficulty"}: {localizedProject.difficulty}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#4ACBFF]/35 bg-[#4ACBFF]/14 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#A8EEFF]">
                        XP: {localizedProject.xp}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/65">
                        {content.skillLabel}: {localizedProject.skills?.[0]}
                      </span>
                    </div>

                    {canViewProject ? (
                      <Link
                        to={isGR ? `/projects-gr/${localizedProject.id}` : `/projects/${localizedProject.id}`}
                        className="relative mt-4 inline-block rounded-full bg-gradient-to-r from-[#4ACBFF] via-[#5D8BFF] to-[#8A57FF] px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(74,203,255,0.2)] transition hover:scale-[1.02]"
                      >
                        {content.viewProject}
                      </Link>
                    ) : (
                      <div className="relative mt-4 inline-flex rounded-full border border-yellow-400/25 bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-200">
                        {content.lockedReachBuilder}
                      </div>
                    )}
                  </article>
                );
              })}

              {comingSoonProjects.map((project) => {
                const localizedProject = localizeProject(project, isGR);
                return (
                  <article
                    key={localizedProject.id}
                    className="group relative overflow-hidden rounded-[28px] border border-dashed border-white/10 bg-gradient-to-br from-[#121827]/60 to-[#191E30]/50 p-6 opacity-60"
                  >
                    <div className="absolute top-4 right-4">
                      <span className="text-xs text-white/50">🔒 {content.lockedLabel}</span>
                    </div>

                    <div className="mb-4 h-40 w-full rounded-xl bg-white/5 flex items-center justify-center text-white/30 text-sm">
                      {content.lockedProject}
                    </div>

                    <h3 className="text-lg font-semibold text-white/70">{localizedProject.title}</h3>
                    <p className="mt-2 text-sm text-white/45">{localizedProject.description}</p>
                    <p className="mt-3 text-sm text-white/45">{content.lockedHint}</p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-xs text-white/50">
                        {localizedProject.difficulty}
                      </span>
                      <span className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-xs text-white/50">
                        XP: {localizedProject.xp}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </PageShell>
  );
}

function ProjectCard({ title, text, color }) {
  return (
    <article className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#121827]/95 to-[#181E2D]/92 p-6 shadow-[0_16px_44px_rgba(15,23,42,0.24)] backdrop-blur-md">
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-r ${color} blur-2xl`} />
      <h2 className="relative text-xl font-semibold text-white">{title}</h2>
      <p className="relative mt-3 text-sm leading-6 text-white/72">{text}</p>
    </article>
  );
}

function getGlowByIndex(index) {
  const glows = [
    "from-[#FF67D2]/20 via-[#8A57FF]/18 to-transparent",
    "from-[#8A57FF]/20 via-[#4ACBFF]/18 to-transparent",
    "from-[#4ACBFF]/20 via-[#FF67D2]/16 to-transparent",
  ];

  return glows[index % glows.length];
}
