import PageShell from "../../components/PageShell.jsx";
import SectionBadge from "../../components/SectionBadge.jsx";

export default function DaoPreview() {
    return (
        <PageShell>
            <div className="relative min-h-screen">
                {/* Animated background layers */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* Primary glow orbs */}
                    <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#8A57FF]/25 blur-[160px] animate-pulse-glow" />
                    <div className="absolute top-1/4 -right-20 h-[400px] w-[400px] rounded-full bg-[#4ACBFF]/20 blur-[140px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-2/3 -left-20 h-[350px] w-[350px] rounded-full bg-[#FF67D2]/15 blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

                    {/* Floating particles */}
                    <div className="absolute top-20 left-[15%] w-2 h-2 rounded-full bg-[#8A57FF]/60 animate-float" style={{ animationDelay: '0s' }} />
                    <div className="absolute top-40 right-[20%] w-3 h-3 rounded-full bg-[#4ACBFF]/50 animate-float" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-[60%] left-[10%] w-2 h-2 rounded-full bg-[#FF67D2]/50 animate-float" style={{ animationDelay: '2s' }} />
                    <div className="absolute top-[45%] right-[12%] w-1.5 h-1.5 rounded-full bg-[#8A57FF]/70 animate-float" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute top-[80%] left-[25%] w-2.5 h-2.5 rounded-full bg-[#4ACBFF]/40 animate-float" style={{ animationDelay: '1.5s' }} />

                    {/* Subtle grid texture */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(138,87,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(138,87,255,0.5)_1px,transparent_1px)] bg-[size:60px_60px]" />
                </div>

                <main className="relative max-w-4xl mx-auto px-4 py-20">

                    {/* Badge with glow */}
                    <div className="opacity-0 animate-fade-up">
                        <SectionBadge label="DAO Governance" className="mb-6" />
                    </div>

                    {/* Title with gradient */}
                    <h1 className="opacity-0 animate-fade-up-delay-1 text-4xl md:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] text-transparent bg-clip-text drop-shadow-[0_0_30px_rgba(138,87,255,0.3)]">
                        Web3Edu DAO — Governance
                    </h1>

                    {/* Hero Card - floating with shimmer border */}
                    <div className="opacity-0 animate-fade-up-delay-2 relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] rounded-2xl opacity-30 group-hover:opacity-50 blur-sm transition-opacity duration-500" />
                        <div className="relative rounded-2xl bg-gradient-to-br from-[#0A0F1A]/90 via-[#111626]/90 to-[#131B2D]/90
                            border border-white/10 backdrop-blur-xl shadow-[0_0_60px_rgba(138,87,255,0.2)]
                            p-8 mb-14 animate-float" style={{ animationDuration: '8s' }}>
                            <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-medium">
                                A governance layer for <span className="bg-gradient-to-r from-[#FF67D2] to-[#8A57FF] text-transparent bg-clip-text font-bold">learning</span>, not just voting.
                            </p>
                        </div>
                    </div>

                    {/* Intro Section */}
                    <section className="opacity-0 animate-fade-up-delay-3 relative group rounded-3xl bg-gradient-to-br from-[#0A0F1A]/80 via-[#111626]/80 to-[#131B2D]/80 border border-[#8A57FF]/20 backdrop-blur-xl shadow-[0_0_40px_rgba(138,87,255,0.1)] p-8 mt-16 transition-all duration-500 hover:border-[#8A57FF]/40 hover:shadow-[0_0_60px_rgba(138,87,255,0.2)]">
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#8A57FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative space-y-4 text-white/80 leading-relaxed">
                            <p>
                                The Web3Edu DAO is designed to support the evolution of Web3 education
                                through collaboration, contribution, and shared decision-making —
                                <span className="text-[#4ACBFF]"> not speculation or hype</span>.
                            </p>
                            <p>
                                This page outlines the governance vision behind Web3Edu.
                                <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-xs bg-[#8A57FF]/20 text-[#CBB2FF] border border-[#8A57FF]/30">
                                    DAO not yet live
                                </span>
                            </p>
                        </div>
                    </section>

                    {/* What is DAO */}
                    <section className="opacity-0 animate-fade-up-delay-4 relative group rounded-3xl bg-gradient-to-br from-[#0A0F1A]/80 via-[#111626]/80 to-[#131B2D]/80 border border-[#8A57FF]/20 backdrop-blur-xl shadow-[0_0_40px_rgba(138,87,255,0.1)] p-8 mt-16 transition-all duration-500 hover:border-[#8A57FF]/40 hover:shadow-[0_0_60px_rgba(138,87,255,0.2)]">
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#4ACBFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8A57FF]/30 to-[#4ACBFF]/20 border border-[#8A57FF]/30 shadow-[0_0_20px_rgba(138,87,255,0.3)]">
                                    <span className="text-2xl">🎯</span>
                                </div>
                                <h2 className="text-2xl font-bold text-white">What is the Web3Edu DAO?</h2>
                            </div>
                            <div className="h-1 w-24 bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] rounded-full" />

                            <div className="space-y-4 text-white/80 leading-relaxed">
                                <p>
                                    The Web3Edu DAO is a <span className="text-[#FF67D2] font-medium">coordination and governance layer</span> that connects
                                    learners, educators, and contributors around a shared educational mission.
                                </p>
                                <p>
                                    Rather than treating governance as an add-on, Web3Edu integrates it
                                    as a natural extension of learning — from understanding concepts,
                                    to applying them, to <span className="text-[#4ACBFF] font-medium">shaping what comes next</span>.
                                </p>
                                <p className="p-4 rounded-xl bg-[#8A57FF]/10 border border-[#8A57FF]/20">
                                    Participation is earned through <span className="text-[#8A57FF] font-semibold">learning and contribution</span>,
                                    not token ownership alone.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Capabilities */}
                    <section className="relative group rounded-3xl bg-gradient-to-br from-[#0A0F1A]/80 via-[#111626]/80 to-[#131B2D]/80 border border-[#8A57FF]/20 backdrop-blur-xl shadow-[0_0_40px_rgba(138,87,255,0.1)] p-8 mt-16 transition-all duration-500 hover:border-[#8A57FF]/40 hover:shadow-[0_0_60px_rgba(138,87,255,0.2)]">
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#FF67D2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4ACBFF]/30 to-[#8A57FF]/20 border border-[#4ACBFF]/30 shadow-[0_0_20px_rgba(74,203,255,0.3)]">
                                    <span className="text-2xl">🧭</span>
                                </div>
                                <h2 className="text-2xl font-bold text-white">What DAO members will be able to do</h2>
                            </div>
                            <div className="h-1 w-24 bg-gradient-to-r from-[#4ACBFF] via-[#8A57FF] to-[#FF67D2] rounded-full" />

                            <ul className="space-y-4">
                                {[
                                    { icon: "💡", text: "Propose new labs, projects, and learning modules", color: "#FF67D2" },
                                    { icon: "📚", text: "Contribute to curriculum evolution and platform design", color: "#8A57FF" },
                                    { icon: "🗳️", text: "Vote on priorities, experiments, and research directions", color: "#4ACBFF" },
                                    { icon: "🤝", text: "Participate in collaborative Web3 education initiatives", color: "#FF67D2" },
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300 group/item">
                                        <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 text-lg group-hover/item:scale-110 transition-transform duration-300">
                                            {item.icon}
                                        </span>
                                        <span className="text-white/80 pt-2 group-hover/item:text-white transition-colors duration-300">
                                            {item.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <p className="text-white/60 text-sm italic mt-4">
                                All governance mechanisms will be introduced progressively and transparently.
                            </p>
                        </div>
                    </section>

                    {/* Who will participate */}
                    <section className="relative group rounded-3xl bg-gradient-to-br from-[#0A0F1A]/80 via-[#111626]/80 to-[#131B2D]/80 border border-[#8A57FF]/20 backdrop-blur-xl shadow-[0_0_40px_rgba(138,87,255,0.1)] p-8 mt-16 transition-all duration-500 hover:border-[#8A57FF]/40 hover:shadow-[0_0_60px_rgba(138,87,255,0.2)]">
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#8A57FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF67D2]/30 to-[#8A57FF]/20 border border-[#FF67D2]/30 shadow-[0_0_20px_rgba(255,103,210,0.3)]">
                                    <span className="text-2xl">👥</span>
                                </div>
                                <h2 className="text-2xl font-bold text-white">Who will participate</h2>
                            </div>
                            <div className="h-1 w-24 bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] rounded-full" />

                            <div className="space-y-4 text-white/80 leading-relaxed">
                                <p>
                                    DAO access will be unlocked <span className="text-[#4ACBFF] font-medium">gradually</span>. Initial participation will
                                    be limited to learners who have demonstrated sustained engagement
                                    and contribution within the Web3Edu ecosystem.
                                </p>
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-[#8A57FF]/10 to-[#4ACBFF]/10 border border-[#8A57FF]/20">
                                    <span className="text-2xl">🌱</span>
                                    <p className="text-white/90">
                                        Broader participation models will be introduced as the platform evolves.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Status - Special highlighted section */}
                    <section className="relative mt-16 overflow-hidden">
                        {/* Animated border glow */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] rounded-3xl opacity-40 blur-sm animate-border-pulse" />

                        <div className="relative rounded-3xl bg-gradient-to-br from-[#0A0F1A] via-[#111626] to-[#131B2D] border border-white/10 p-8">
                            {/* Inner glow effect */}
                            <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_top,rgba(138,87,255,0.15),transparent_60%)]" />
                            <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_bottom,rgba(74,203,255,0.1),transparent_60%)]" />

                            <div className="relative space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-yellow-400/30 rounded-2xl blur-lg animate-pulse" />
                                        <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border border-yellow-400/40">
                                            <span className="text-3xl">🚧</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Current Status</h2>
                                        <span className="inline-flex items-center mt-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 animate-pulse">
                                            Under Development
                                        </span>
                                    </div>
                                </div>

                                <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 via-[#8A57FF] to-[#4ACBFF] rounded-full" />

                                <div className="space-y-3 text-white/80 leading-relaxed">
                                    <p className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                                        DAO functionality is under active design and development.
                                    </p>
                                    <p className="text-white/60">
                                        This page outlines intent and direction. It does not yet represent
                                        a live governance system.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Closing Quote */}
                    <div className="mt-20 mb-8">
                        <div className="mx-auto h-px w-32 bg-gradient-to-r from-transparent via-[#8A57FF] to-transparent opacity-60" />
                        <div className="mt-8 text-center">
                            <blockquote className="text-lg md:text-xl text-slate-600 dark:text-white/70 italic leading-relaxed max-w-2xl mx-auto">
                                "The Web3Edu DAO is intentionally built slowly — because{' '}
                                <span className="bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] text-transparent bg-clip-text font-medium not-italic">
                                    governance is part of the learning journey
                                </span>{' '}
                                itself."
                            </blockquote>
                        </div>
                        <div className="mt-6 mx-auto h-px w-32 bg-gradient-to-r from-transparent via-[#4ACBFF] to-transparent opacity-60" />
                    </div>

                </main>
            </div>
        </PageShell>
    );
}
