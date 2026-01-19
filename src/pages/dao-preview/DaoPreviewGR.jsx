import PageShell from "../../components/PageShell.jsx";
import SectionBadge from "../../components/SectionBadge.jsx";

export default function DaoPreviewGR() {
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
                        <SectionBadge label="Διακυβέρνηση DAO" className="mb-6" />
                    </div>

                    {/* Title with gradient */}
                    <h1 className="opacity-0 animate-fade-up-delay-1 text-4xl md:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] text-transparent bg-clip-text drop-shadow-[0_0_30px_rgba(138,87,255,0.3)]">
                        Web3Edu DAO — Διακυβέρνηση
                    </h1>

                    {/* Hero Card - floating with shimmer border */}
                    <div className="opacity-0 animate-fade-up-delay-2 relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] rounded-2xl opacity-30 group-hover:opacity-50 blur-sm transition-opacity duration-500" />
                        <div className="relative rounded-2xl bg-gradient-to-br from-[#0A0F1A]/90 via-[#111626]/90 to-[#131B2D]/90
                            border border-white/10 backdrop-blur-xl shadow-[0_0_60px_rgba(138,87,255,0.2)]
                            p-8 mb-14 animate-float" style={{ animationDuration: '8s' }}>
                            <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-medium">
                                Ένα επίπεδο διακυβέρνησης για τη <span className="bg-gradient-to-r from-[#FF67D2] to-[#8A57FF] text-transparent bg-clip-text font-bold">μάθηση</span>, όχι απλώς για ψηφοφορίες.
                            </p>
                        </div>
                    </div>

                    {/* Intro Section */}
                    <section className="opacity-0 animate-fade-up-delay-3 relative group rounded-3xl bg-gradient-to-br from-[#0A0F1A]/80 via-[#111626]/80 to-[#131B2D]/80 border border-[#8A57FF]/20 backdrop-blur-xl shadow-[0_0_40px_rgba(138,87,255,0.1)] p-8 mt-16 transition-all duration-500 hover:border-[#8A57FF]/40 hover:shadow-[0_0_60px_rgba(138,87,255,0.2)]">
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#8A57FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative space-y-4 text-white/80 leading-relaxed">
                            <p>
                                Το Web3Edu DAO έχει σχεδιαστεί για να υποστηρίζει την εξέλιξη της εκπαίδευσης στο Web3
                                μέσω συνεργασίας, συνεισφοράς και κοινής λήψης αποφάσεων —
                                <span className="text-[#4ACBFF]"> όχι κερδοσκοπία ή hype</span>.
                            </p>
                            <p>
                                Αυτή η σελίδα παρουσιάζει το όραμα διακυβέρνησης πίσω από το Web3Edu.
                                <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-xs bg-[#8A57FF]/20 text-[#CBB2FF] border border-[#8A57FF]/30">
                                    DAO μη ενεργό ακόμη
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
                                <h2 className="text-2xl font-bold text-white">Τι είναι το Web3Edu DAO;</h2>
                            </div>
                            <div className="h-1 w-24 bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] rounded-full" />

                            <div className="space-y-4 text-white/80 leading-relaxed">
                                <p>
                                    Το Web3Edu DAO είναι ένα <span className="text-[#FF67D2] font-medium">επίπεδο συντονισμού και διακυβέρνησης</span> που συνδέει
                                    μαθητές, εκπαιδευτικούς και συνεισφέροντες γύρω από μια κοινή εκπαιδευτική αποστολή.
                                </p>
                                <p>
                                    Η διακυβέρνηση δεν αντιμετωπίζεται ως προσθήκη, αλλά ως φυσική συνέχεια της μάθησης —
                                    από την κατανόηση των εννοιών, στην εφαρμογή τους,
                                    και τελικά στη <span className="text-[#4ACBFF] font-medium">διαμόρφωση του τι ακολουθεί</span>.
                                </p>
                                <p className="p-4 rounded-xl bg-[#8A57FF]/10 border border-[#8A57FF]/20">
                                    Η συμμετοχή κερδίζεται μέσω <span className="text-[#8A57FF] font-semibold">μάθησης και συνεισφοράς</span>,
                                    όχι μόνο μέσω κατοχής token.
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
                                <h2 className="text-2xl font-bold text-white">Τι θα μπορούν να κάνουν τα μέλη του DAO</h2>
                            </div>
                            <div className="h-1 w-24 bg-gradient-to-r from-[#4ACBFF] via-[#8A57FF] to-[#FF67D2] rounded-full" />

                            <ul className="space-y-4">
                                {[
                                    { icon: "💡", text: "Να προτείνουν νέα εργαστήρια, έργα και μαθησιακές ενότητες", color: "#FF67D2" },
                                    { icon: "📚", text: "Να συμβάλλουν στην εξέλιξη του προγράμματος σπουδών και του σχεδιασμού της πλατφόρμας", color: "#8A57FF" },
                                    { icon: "🗳️", text: "Να ψηφίζουν για προτεραιότητες, πειράματα και ερευνητικές κατευθύνσεις", color: "#4ACBFF" },
                                    { icon: "🤝", text: "Να συμμετέχουν σε συνεργατικές πρωτοβουλίες εκπαίδευσης Web3", color: "#FF67D2" },
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
                                Οι μηχανισμοί διακυβέρνησης θα εισαχθούν σταδιακά και με διαφάνεια.
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
                                <h2 className="text-2xl font-bold text-white">Ποιοι θα συμμετέχουν</h2>
                            </div>
                            <div className="h-1 w-24 bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] rounded-full" />

                            <div className="space-y-4 text-white/80 leading-relaxed">
                                <p>
                                    Η πρόσβαση στο DAO θα ξεκλειδώνεται <span className="text-[#4ACBFF] font-medium">σταδιακά</span>. Αρχικά θα περιορίζεται
                                    σε μαθητές με αποδεδειγμένη ενεργή συμμετοχή και συνεισφορά στο οικοσύστημα Web3Edu.
                                </p>
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-[#8A57FF]/10 to-[#4ACBFF]/10 border border-[#8A57FF]/20">
                                    <span className="text-2xl">🌱</span>
                                    <p className="text-white/90">
                                        Νέα μοντέλα συμμετοχής θα εισαχθούν καθώς η πλατφόρμα εξελίσσεται.
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
                                        <h2 className="text-2xl font-bold text-white">Τρέχουσα Κατάσταση</h2>
                                        <span className="inline-flex items-center mt-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 animate-pulse">
                                            Υπό Ανάπτυξη
                                        </span>
                                    </div>
                                </div>

                                <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 via-[#8A57FF] to-[#4ACBFF] rounded-full" />

                                <div className="space-y-3 text-white/80 leading-relaxed">
                                    <p className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                                        Η λειτουργικότητα του DAO βρίσκεται σε ενεργό σχεδιασμό και ανάπτυξη.
                                    </p>
                                    <p className="text-white/60">
                                        Αυτή η σελίδα περιγράφει την πρόθεση και την κατεύθυνση. Δεν αντιπροσωπεύει ακόμη
                                        ένα ζωντανό σύστημα διακυβέρνησης.
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
                                «Το Web3Edu DAO χτίζεται σκόπιμα αργά — γιατί η{' '}
                                <span className="bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] text-transparent bg-clip-text font-medium not-italic">
                                    διακυβέρνηση είναι μέρος της μαθησιακής διαδρομής
                                </span>{' '}
                                από μόνη της.»
                            </blockquote>
                        </div>
                        <div className="mt-6 mx-auto h-px w-32 bg-gradient-to-r from-transparent via-[#4ACBFF] to-transparent opacity-60" />
                    </div>

                </main>
            </div>
        </PageShell>
    );
}
