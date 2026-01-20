import PageShell from "../../components/PageShell";
import SectionBadge from "../../components/SectionBadge";
import { Link } from "react-router-dom";
import {
    Landmark,
    Users,
    GitBranch,
    Layers,
    Settings,
    AlertCircle,
    ArrowRight
} from "lucide-react";

export default function DaoGovernanceGR() {
    return (
        <PageShell>
            <div className="relative min-h-screen">
                {/* Animated background layers */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* Primary glow orbs */}
                    <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#8A57FF]/25 blur-[160px] animate-pulse-glow" />
                    <div className="absolute top-1/4 -right-20 h-[400px] w-[400px] rounded-full bg-[#4ACBFF]/20 blur-[140px] animate-pulse-glow" style={{ animationDelay: "1s" }} />
                    <div className="absolute top-2/3 -left-20 h-[350px] w-[350px] rounded-full bg-[#FF67D2]/15 blur-[120px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
                    <div className="absolute top-[85%] right-[10%] h-[300px] w-[300px] rounded-full bg-[#8A57FF]/20 blur-[120px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

                    {/* Floating particles */}
                    <div className="absolute top-20 left-[15%] w-2 h-2 rounded-full bg-[#8A57FF]/60 animate-float" style={{ animationDelay: "0s" }} />
                    <div className="absolute top-40 right-[20%] w-3 h-3 rounded-full bg-[#4ACBFF]/50 animate-float" style={{ animationDelay: "1s" }} />
                    <div className="absolute top-[60%] left-[10%] w-2 h-2 rounded-full bg-[#FF67D2]/50 animate-float" style={{ animationDelay: "2s" }} />
                    <div className="absolute top-[45%] right-[12%] w-1.5 h-1.5 rounded-full bg-[#8A57FF]/70 animate-float" style={{ animationDelay: "0.5s" }} />
                    <div className="absolute top-[80%] left-[25%] w-2.5 h-2.5 rounded-full bg-[#4ACBFF]/40 animate-float" style={{ animationDelay: "1.5s" }} />

                    {/* Subtle grid texture */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(138,87,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(138,87,255,0.5)_1px,transparent_1px)] bg-[size:60px_60px]" />
                </div>

                <main className="relative max-w-4xl mx-auto px-4 py-20 space-y-12">

                    {/* HERO */}
                    <div className="opacity-0 animate-fade-up">
                        <SectionBadge label="Μοντέλο Διακυβέρνησης" className="mb-6" />
                    </div>

                    <h1 className="opacity-0 animate-fade-up-delay-1 text-4xl md:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] text-transparent bg-clip-text drop-shadow-[0_0_30px_rgba(138,87,255,0.3)]">
                        Web3Edu DAO — Μοντέλο Διακυβέρνησης
                    </h1>

                    {/* Hero Card */}
                    <div className="opacity-0 animate-fade-up-delay-2 relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] rounded-2xl opacity-30 group-hover:opacity-50 blur-sm transition-opacity duration-500" />
                        <div className="relative rounded-2xl bg-gradient-to-br from-[#0A0F1A]/90 via-[#111626]/90 to-[#131B2D]/90
                            border border-white/10 backdrop-blur-xl shadow-[0_0_60px_rgba(138,87,255,0.2)]
                            p-8 mb-8 animate-float" style={{ animationDuration: "8s" }}>
                            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                                Πώς οι αποφάσεις <span className="bg-gradient-to-r from-[#4ACBFF] to-[#8A57FF] text-transparent bg-clip-text font-bold">προτείνονται</span>, <span className="bg-gradient-to-r from-[#8A57FF] to-[#FF67D2] text-transparent bg-clip-text font-bold">συζητούνται</span>, και <span className="bg-gradient-to-r from-[#FF67D2] to-[#4ACBFF] text-transparent bg-clip-text font-bold">διαμορφώνονται</span> στο οικοσύστημα Web3Edu.
                            </p>
                            <p className="mt-3 text-white/60 text-sm">
                                Αυτή η σελίδα τεκμηριώνει τη δομή διακυβέρνησης πριν την ενεργοποίηση on-chain.
                            </p>
                        </div>
                    </div>

                    {/* SECTION 1 — PRINCIPLES */}
                    <GovernanceCard
                        icon={Landmark}
                        title="Αρχές Διακυβέρνησης"
                        color="#8A57FF"
                        delay="3"
                    >
                        <ul className="space-y-4">
                            {[
                                { label: "Εκπαιδευτική προτεραιότητα", desc: "Η διακυβέρνηση είναι μέρος της μάθησης.", color: "#FF67D2" },
                                { label: "Προοδευτική", desc: "Η επιρροή αυξάνεται με τη συνεισφορά.", color: "#8A57FF" },
                                { label: "Διαφανής", desc: "Οι κανόνες και οι αποφάσεις είναι ορατοί.", color: "#4ACBFF" },
                                { label: "Μη κερδοσκοπική", desc: "Δεν υπάρχουν οικονομικά κίνητρα.", color: "#FF67D2" },
                                { label: "Credential-based", desc: "Η συμμετοχή και η επιρροή κερδίζονται μέσω μαθησιακής προόδου και επαληθευμένης συνεισφοράς, όχι μέσω κατοχής tokens.", color: "#4ACBFF" },
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: item.color }} />
                                    <span>
                                        <strong className="text-white">{item.label}:</strong>{" "}
                                        <span className="text-white/70">{item.desc}</span>
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <p className="mt-6 p-4 rounded-xl bg-[#8A57FF]/10 border border-[#8A57FF]/20 text-white/90">
                            Το DAO συντονίζει τη μάθηση — δεν αποσπά αξία.
                        </p>
                        <p className="mt-3 text-sm text-white/70">
                            Όλη η δραστηριότητα διακυβέρνησης λειτουργεί σε εκπαιδευτικό πλαίσιο. Δεν χρησιμοποιούνται
                            πραγματικά οικονομικά περιουσιακά στοιχεία. Οποιαδήποτε on-chain αλληλεπίδραση βασίζεται σε
                            δοκιμαστικά διαπιστευτήρια και tokens μάθησης (π.χ. EDU‑D) που εκδίδονται αποκλειστικά για
                            πειραματισμό και ανάπτυξη δεξιοτήτων.
                        </p>
                    </GovernanceCard>

                    {/* SECTION 2 — ROLES */}
                    <GovernanceCard
                        icon={Users}
                        title="Ρόλοι Συμμετοχής"
                        color="#4ACBFF"
                        delay="4"
                    >
                        <div className="grid md:grid-cols-3 gap-4">
                            <RoleBlock
                                title="Explorer"
                                emoji="🔭"
                                desc="Παρατηρεί προτάσεις και συζητήσεις."
                                extra="Ξεκλειδώνεται μέσω foundational labs."
                                color="#4ACBFF"
                            />
                            <RoleBlock
                                title="Builder"
                                emoji="🛠️"
                                desc="Υποβάλλει προτάσεις και δομημένο feedback."
                                extra="Ξεκλειδώνεται μέσω advanced labs και applied projects."
                                color="#8A57FF"
                            />
                            <RoleBlock
                                title="Architect"
                                emoji="🏛️"
                                desc="Καθοδηγεί τη διακυβέρνηση και τον σχεδιασμό μάθησης."
                                extra="Ρόλος βάσει προσφοράς ή πρόσκλησης."
                                color="#FF67D2"
                            />
                        </div>

                        <p className="mt-6 text-sm text-white/50 italic">
                            Οι ρόλοι είναι μη μεταβιβάσιμοι και συνδέονται με τη μαθησιακή ταυτότητα.
                        </p>
                    </GovernanceCard>

                    {/* SECTION 3 — PROPOSALS */}
                    <GovernanceCard
                        icon={GitBranch}
                        title="Κύκλος Ζωής Προτάσεων"
                        color="#FF67D2"
                    >
                        <ol className="space-y-3">
                            {[
                                "Δημιουργία ιδέας από labs, feedback ή ανάγκες κοινότητας",
                                "Ανοιχτή συζήτηση και βελτίωση",
                                "Δομημένη διατύπωση πρότασης",
                                "Παράθυρο κοινοτικής αξιολόγησης",
                                "Φάση απόφασης (μελλοντικά on-chain)",
                                "Εκτέλεση και αναστοχασμός",
                            ].map((step, i) => (
                                <li key={i} className="flex items-start gap-4 group/step">
                                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-[#FF67D2]/20 to-[#8A57FF]/10 border border-[#FF67D2]/30 text-sm font-bold text-[#FF67D2] group-hover/step:scale-110 transition-transform duration-300">
                                        {i + 1}
                                    </span>
                                    <span className="text-white/80 pt-1 group-hover/step:text-white transition-colors duration-300">
                                        {step}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </GovernanceCard>

                    {/* SECTION 4 — SCOPE */}
                    <GovernanceCard
                        icon={Layers}
                        title="Τι Μπορεί να Διακυβερνηθεί"
                        color="#8A57FF"
                    >
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-4 rounded-xl bg-[#4ACBFF]/10 border border-[#4ACBFF]/20">
                                <h4 className="font-bold text-[#4ACBFF] mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#4ACBFF]" />
                                    On-chain
                                </h4>
                                <ul className="space-y-2 text-white/80">
                                    <li>• Νέα εργαστήρια και μαθησιακές διαδρομές</li>
                                    <li>• Ενημερώσεις προγράμματος σπουδών</li>
                                    <li>• Λογική XP και προόδου</li>
                                    <li>• Πιλοτική έρευνα και πειράματα</li>
                                </ul>
                            </div>

                            <div className="p-4 rounded-xl bg-[#FF67D2]/10 border border-[#FF67D2]/20">
                                <h4 className="font-bold text-[#FF67D2] mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#FF67D2]" />
                                    Off-chain
                                </h4>
                                <ul className="space-y-2 text-white/80">
                                    <li>• Οικονομικά περιουσιακά στοιχεία</li>
                                    <li>• Κερδοσκοπικά tokens</li>
                                    <li>• Ιδιοκτησία δεδομένων χρηστών</li>
                                </ul>
                            </div>
                        </div>
                    </GovernanceCard>

                    {/* SECTION 5 — INFRASTRUCTURE */}
                    <GovernanceCard
                        icon={Settings}
                        title="Υποδομή Διακυβέρνησης"
                        color="#4ACBFF"
                    >
                        <p className="text-white/80">
                            Το Web3Edu συνδυάζει <span className="text-[#4ACBFF] font-medium">off-chain συζήτηση</span> με <span className="text-[#8A57FF] font-medium">on-chain επαλήθευση</span>.
                        </p>
                        <p className="mt-4 p-4 rounded-xl bg-[#4ACBFF]/10 border border-[#4ACBFF]/20 text-white/90">
                            Τα on-chain στοιχεία χρησιμοποιούνται για να επιδείξουν πραγματικούς μηχανισμούς διακυβέρνησης
                            (ταυτότητα, προτάσεις, attestations) χωρίς να εκθέτουν τους μαθητές σε οικονομικό ρίσκο.
                        </p>

                        <div className="mt-6 grid md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="text-2xl">💬</span>
                                <div>
                                    <p className="font-medium text-white">Off-chain</p>
                                    <p className="text-sm text-white/60">Συζήτηση, μάθηση, επανάληψη</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="text-2xl">⛓️</span>
                                <div>
                                    <p className="font-medium text-white">On-chain</p>
                                    <p className="text-sm text-white/60">Ταυτότητα, αποδείξεις, τελικές αποφάσεις</p>
                                </div>
                            </div>
                        </div>

                        <p className="mt-6 text-white/70">
                            Αυτή η υβριδική προσέγγιση διατηρεί τη διακυβέρνηση προσβάσιμη, ελέγξιμη
                            και τεχνικά ουσιαστική.
                        </p>
                    </GovernanceCard>

                    {/* SECTION 6 — STATUS */}
                    <section className="relative mt-16 overflow-hidden">
                        {/* Animated border glow */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 via-[#8A57FF] to-[#4ACBFF] rounded-3xl opacity-40 blur-sm animate-border-pulse" />

                        <div className="relative rounded-3xl bg-gradient-to-br from-[#0A0F1A] via-[#111626] to-[#131B2D] border border-white/10 p-8">
                            {/* Inner glow effect */}
                            <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_top,rgba(234,179,8,0.1),transparent_60%)]" />
                            <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_bottom,rgba(138,87,255,0.1),transparent_60%)]" />

                            <div className="relative space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-yellow-400/30 rounded-2xl blur-lg animate-pulse" />
                                        <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border border-yellow-400/40">
                                            <AlertCircle className="w-7 h-7 text-yellow-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Κατάσταση Διακυβέρνησης</h2>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
                                                Προγραμματισμένο
                                            </span>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#8A57FF]/20 text-[#CBB2FF] border border-[#8A57FF]/30">
                                                Τεκμηριωμένο
                                            </span>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#4ACBFF]/20 text-[#4ACBFF] border border-[#4ACBFF]/30 animate-pulse">
                                                Μη Ενεργό Ακόμη
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 via-[#8A57FF] to-[#4ACBFF] rounded-full" />

                                <p className="text-white/80">
                                    Η διακυβέρνηση εισάγεται σκόπιμα σε φάσεις. Η τρέχουσα εστίαση είναι στη σταθερότητα
                                    της μάθησης, τη συλλογή feedback και την κατανόηση της διακυβέρνησης πριν
                                    ενεργοποιηθούν δεσμευτικές on-chain αποφάσεις.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* FOOTER CTA */}
                    <div className="mt-16">
                        <div className="mx-auto h-px w-32 bg-gradient-to-r from-transparent via-[#8A57FF] to-transparent opacity-60" />
                        <div className="mt-8 text-center">
                            <p className="text-slate-800 dark:text-white/70 italic mb-6">
                                "Η διακυβέρνηση στο Web3Edu ξεκινά με την{" "}
                                <span className="bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] text-transparent bg-clip-text font-medium not-italic">
                                    κατανόηση
                                </span>{" "}
                                — όχι με την ψήφο."
                            </p>

                            <Link
                                to="/dao-preview-gr"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FF67D2]/20 via-[#8A57FF]/20 to-[#4ACBFF]/20 border border-[#8A57FF]/30 text-white font-semibold hover:border-[#8A57FF]/60 hover:shadow-[0_0_30px_rgba(138,87,255,0.3)] transition-all duration-300"
                            >
                                Εξερευνήστε το DAO
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="mt-8 mx-auto h-px w-32 bg-gradient-to-r from-transparent via-[#4ACBFF] to-transparent opacity-60" />
                    </div>

                </main>
            </div>
        </PageShell>
    );
}

/* ================================= */
/* COMPONENTS */
/* ================================= */

function GovernanceCard({ icon: Icon, title, children, color = "#8A57FF" }) {
    return (
        <section className="relative group rounded-3xl bg-gradient-to-br from-[#0A0F1A]/80 via-[#111626]/80 to-[#131B2D]/80 border border-[#8A57FF]/20 backdrop-blur-xl shadow-[0_0_40px_rgba(138,87,255,0.1)] p-8 transition-all duration-500 hover:border-[#8A57FF]/40 hover:shadow-[0_0_60px_rgba(138,87,255,0.2)]">
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(to bottom right, ${color}08, transparent)` }} />

            <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                    <div
                        className="flex items-center justify-center w-12 h-12 rounded-2xl border shadow-lg"
                        style={{
                            background: `linear-gradient(to bottom right, ${color}30, ${color}10)`,
                            borderColor: `${color}40`,
                            boxShadow: `0 0 20px ${color}30`
                        }}
                    >
                        <Icon className="w-6 h-6" style={{ color }} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                </div>

                <div className="h-1 w-24 rounded-full mb-6" style={{ background: `linear-gradient(to right, ${color}, #8A57FF, #4ACBFF)` }} />

                <div className="text-white/80 leading-relaxed">
                    {children}
                </div>
            </div>
        </section>
    );
}

function RoleBlock({ title, emoji, desc, extra, color }) {
    return (
        <div className="group/role relative rounded-2xl p-5 bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/[0.04]">
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover/role:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(to bottom right, ${color}10, transparent)` }} />

            <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl group-hover/role:scale-110 transition-transform duration-300">{emoji}</span>
                    <h4 className="font-bold text-white">{title}</h4>
                </div>
                <p className="text-sm text-white/70 mb-2">{desc}</p>
                <p className="text-xs px-2 py-1 rounded-full inline-block border" style={{ color, borderColor: `${color}40`, backgroundColor: `${color}10` }}>
                    {extra}
                </p>
            </div>
        </div>
    );
}
