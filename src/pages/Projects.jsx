import PageShell from "../components/PageShell.jsx";
import { Link, useLocation } from "react-router-dom";
import { localizeProject, projects } from "../services/projectService";
import { useEffect, useMemo, useState } from "react";
import SectionBadge from "../components/SectionBadge.jsx";
import { useIdentity } from "../context/IdentityContext.jsx";
import { useResolvedIdentityContext } from "../context/ResolvedIdentityContext.jsx";

export default function Projects() {
  const { pathname } = useLocation();
  const isGR = pathname.startsWith("/projects-gr");
  const { owner, smartAccount } = useIdentity();
  const { metadata } = useResolvedIdentityContext();
  const [completedProjects, setCompletedProjects] = useState({});
  const [userTier, setUserTier] = useState("explorer");

  const wallet = useMemo(
    () => localStorage.getItem("web3edu-wallet-address") || "",
    []
  );
  const identityAddress = smartAccount ?? owner ?? (wallet || null);
  const activeProjects = useMemo(
    () => projects.filter((project) => project.status === "active"),
    []
  );
  const comingSoonProjects = useMemo(
    () => projects.filter((project) => project.status === "coming-soon"),
    []
  );

  useEffect(() => {
    if (!identityAddress || !metadata) {
      if (!identityAddress) {
        setCompletedProjects({});
        setUserTier("explorer");
      }
      return;
    }

    setCompletedProjects(
      metadata.projectsCompleted ||
        metadata.projects_completed ||
        {}
    );
    setUserTier((metadata.tier || "Explorer").toLowerCase());
  }, [identityAddress, metadata]);

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
      <div className="relative min-h-screen overflow-hidden text-slate-900 dark:text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#8A57FF]/12 blur-[160px] dark:bg-[#8A57FF]/22" />
          <div className="absolute top-1/4 right-[-5rem] h-[24rem] w-[24rem] rounded-full bg-[#4ACBFF]/10 blur-[150px] dark:bg-[#4ACBFF]/18" />
          <div className="absolute bottom-[12%] left-[-4rem] h-[22rem] w-[22rem] rounded-full bg-[#FF67D2]/8 blur-[135px] dark:bg-[#FF67D2]/14" />
          <div className="absolute inset-0 bg-[size:56px_56px] bg-[linear-gradient(rgba(100,116,139,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(100,116,139,0.06)_1px,transparent_1px)] opacity-[0.28] dark:bg-[linear-gradient(rgba(138,87,255,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(74,203,255,0.35)_1px,transparent_1px)] dark:opacity-[0.03]" />
        </div>

        <main className="relative mx-auto flex max-w-5xl flex-col gap-10 px-4 py-20">
          <section className="relative overflow-hidden rounded-[28px]">
            <div className="absolute -inset-0.5 rounded-[28px] bg-gradient-to-r from-fuchsia-400/25 via-indigo-400/30 to-cyan-400/25 blur-sm dark:from-[#FF67D2]/40 dark:via-[#8A57FF]/45 dark:to-[#4ACBFF]/40" />
            <div className="relative rounded-[28px] border border-slate-200/90 bg-gradient-to-br from-white via-indigo-50/35 to-slate-50 p-8 shadow-lg shadow-slate-200/40 backdrop-blur-xl dark:border-white/10 dark:from-[#0A0F1A]/94 dark:via-[#101728]/94 dark:to-[#131D30]/94 dark:shadow-[0_0_70px_rgba(138,87,255,0.16)] md:p-12">
              <span className="inline-flex rounded-full border border-indigo-300/80 bg-indigo-100/90 px-4 py-1 text-sm font-semibold text-indigo-900 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-950/85 dark:text-indigo-100 dark:shadow-[0_0_20px_rgba(138,87,255,0.22)]">
                {content.eyebrow}
              </span>
              <h1 className="mt-6 bg-gradient-to-r from-slate-900 via-indigo-800 to-cyan-800 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent dark:from-[#FFFFFF] dark:via-[#FF67D2] dark:to-[#4ACBFF] md:text-5xl">
                {content.title}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 md:text-lg dark:text-slate-300">
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
                  className="rounded-full border border-indigo-300/80 bg-white px-5 py-3 text-sm font-semibold text-indigo-900 shadow-sm transition hover:border-fuchsia-400/50 hover:bg-indigo-50 dark:border-[#8A57FF]/35 dark:bg-white/[0.04] dark:text-white/82 dark:shadow-none dark:hover:border-[#FF67D2]/45 dark:hover:bg-[#8A57FF]/10 dark:hover:text-white"
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
            <h2 className="bg-gradient-to-r from-slate-900 via-indigo-800 to-cyan-800 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent dark:from-[#FFFFFF] dark:via-[#B8C8FF] dark:to-[#4ACBFF] md:text-4xl">
              {content.sectionTitle}
            </h2>
            <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
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
                    className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-6 shadow-md shadow-slate-200/50 backdrop-blur-md dark:border-white/10 dark:from-[#121827] dark:via-[#151c2e] dark:to-[#191E30] dark:shadow-[0_20px_55px_rgba(2,8,23,0.32)]"
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

                    <h3 className="relative text-lg font-semibold text-slate-900 dark:text-white">{localizedProject.title}</h3>
                    <p className="relative mt-2 text-sm text-slate-600 dark:text-slate-300">{localizedProject.description}</p>

                    <div className="relative mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-900 dark:border-indigo-500/40 dark:bg-indigo-950/75 dark:text-indigo-100">
                        {isGR ? "Δυσκολία" : "Difficulty"}: {localizedProject.difficulty}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-900 dark:border-cyan-500/40 dark:bg-cyan-950/75 dark:text-cyan-100">
                        XP: {localizedProject.xp}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
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
                      <div className="relative mt-4 inline-flex rounded-full border border-amber-300/70 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-950 dark:border-yellow-400/25 dark:bg-yellow-400/10 dark:text-yellow-200">
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
                    className="group relative overflow-hidden rounded-[28px] border border-dashed border-slate-300/90 bg-gradient-to-br from-slate-50 to-slate-100/90 p-6 opacity-95 dark:border-white/10 dark:from-[#121827]/90 dark:to-[#191E30]/75 dark:opacity-60"
                  >
                    <div className="absolute top-4 right-4">
                      <span className="text-xs text-slate-500 dark:text-slate-400">🔒 {content.lockedLabel}</span>
                    </div>

                    <div className="mb-4 flex h-40 w-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-100 text-sm text-slate-400 dark:border-transparent dark:bg-white/5 dark:text-white/30">
                      {content.lockedProject}
                    </div>

                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">{localizedProject.title}</h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{localizedProject.description}</p>
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{content.lockedHint}</p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-300">
                        {localizedProject.difficulty}
                      </span>
                      <span className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-300">
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
    <article className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-6 shadow-md shadow-slate-200/40 backdrop-blur-md dark:border-white/10 dark:from-[#121827] dark:via-[#151c2e] dark:to-[#181E2D] dark:shadow-[0_16px_44px_rgba(15,23,42,0.24)]">
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-r ${color} blur-2xl opacity-60 dark:opacity-100`} />
      <h2 className="relative text-xl font-semibold text-slate-900 dark:text-white">{title}</h2>
      <p className="relative mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
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
