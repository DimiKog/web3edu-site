import PageShell from "../components/PageShell.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const StartHereGR = () => {
    const navigate = useNavigate();
    const [showSetupDetails, setShowSetupDetails] = useState(false);

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
                    {/* HERO / INTRO */}
                    <section className="opacity-0 animate-fade-up">
                        <div className="flex items-center justify-center mb-8">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#8A57FF]/40 to-[#4ACBFF]/40 rounded-full blur-2xl opacity-40" />
                                <svg
                                    className="w-20 h-20 text-[#8A57FF] relative"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-center bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] text-transparent bg-clip-text drop-shadow-[0_0_30px_rgba(138,87,255,0.3)]">
                            Ξεκινήστε από εδώ
                        </h1>

                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] rounded-2xl opacity-25 group-hover:opacity-45 blur-sm transition-opacity duration-500" />
                            <div className="relative rounded-2xl bg-gradient-to-br from-[#0A0F1A]/90 via-[#111626]/90 to-[#131B2D]/90 border border-white/10 backdrop-blur-xl shadow-[0_0_60px_rgba(138,87,255,0.2)] p-8">
                                <p className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed text-white/90 text-center">
                                    Το Web3Edu είναι ένα πειραματικό μαθησιακό περιβάλλον όπου το Web3 δεν εξηγείται — βιώνεται.
                                </p>
                                <p className="max-w-3xl mx-auto mt-4 text-base text-white/70 text-center">
                                    Δεν διαβάζετε για πορτοφόλια, blockchains ή ταυτότητα. Τα χρησιμοποιείτε, βήμα-βήμα, πάνω σε πραγματική υποδομή.
                                </p>
                                <p className="max-w-3xl mx-auto mt-4 text-base text-white/80 text-center font-medium">
                                    Αυτή η σελίδα σας λέει ακριβώς πώς να ξεκινήσετε.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* QUICK SETUP - MINIMAL VERSION */}
                    <StartCard
                        title="Γρήγορη Ρύθμιση (3 λεπτά)"
                        color="#4ACBFF"
                        icon={
                            <svg className="w-6 h-6 text-[#4ACBFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        }
                    >
                        <div className="space-y-6">
                            {/* Simple Checklist */}
                            <div className="grid md:grid-cols-3 gap-4">
                                <SetupStep number="1" title="Εγκατάσταση MetaMask">
                                    Επέκταση browser (Chrome, Brave, Firefox)
                                </SetupStep>
                                <SetupStep number="2" title="Σύνδεση πορτοφολιού">
                                    Πατήστε "Σύνδεση Πορτοφολιού" όταν ζητηθεί
                                </SetupStep>
                                <SetupStep number="3" title="Έγκριση δικτύου">
                                    Αποδεχτείτε το Besu Edu‑Net όταν σας ζητηθεί
                                </SetupStep>
                            </div>

                            {/* Quick Tips */}
                            <div className="rounded-xl border border-[#4ACBFF]/20 bg-[#4ACBFF]/5 p-4">
                                <p className="text-sm text-white/70 flex items-start gap-2">
                                    <svg className="w-5 h-5 text-[#4ACBFF] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>
                                        <strong>Δεν χρειάζεται πραγματικό ETH ή πραγματικά χρήματα</strong> — αυτό είναι εκπαιδευτικό δίκτυο.
                                        Χρησιμοποιείται το δοκιμαστικό token <strong>EDU‑D</strong>, το οποίο δεν έχει καμία χρηματική αξία.
                                        Το πορτοφόλι σας λειτουργεί ως μαθησιακή ταυτότητα. <strong>Μη μοιράζεστε ποτέ το private key σας.</strong>
                                    </span>
                                </p>
                            </div>
                            {/* Network Check Callout - ENHANCED */}
                            <div className="relative group/netcheck">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8A57FF]/30 to-[#4ACBFF]/30 rounded-xl opacity-50 group-hover/netcheck:opacity-75 blur transition-opacity duration-300" />
                                <div className="relative rounded-xl border border-[#8A57FF]/30 bg-[#8A57FF]/10 p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8A57FF]/40 to-[#4ACBFF]/40 border border-[#8A57FF]/50 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="font-semibold text-white text-sm">Επαληθεύστε τη ρύθμισή σας</h4>
                                                <span className="px-2 py-0.5 rounded-full bg-[#4ACBFF]/20 text-[#4ACBFF] text-xs font-medium border border-[#4ACBFF]/30">
                                                    Προτείνεται
                                                </span>
                                            </div>
                                            <p className="text-sm text-white/80 mb-3">
                                                Δεν είστε σίγουροι ότι όλα έχουν ρυθμιστεί σωστά; Τρέξτε έναν γρήγορο έλεγχο για να επιβεβαιώσετε το MetaMask, τη σύνδεση δικτύου και το υπόλοιπο του πορτοφολιού σας.
                                            </p>
                                            <NetworkCheckButton
                                                variant="primary"
                                                icon={true}
                                            >
                                                Εκτέλεση Network Check
                                            </NetworkCheckButton>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Expandable Detailed Guide */}
                            <div className="border-t border-white/10 pt-6">
                                <button
                                    onClick={() => setShowSetupDetails(!showSetupDetails)}
                                    className="flex items-center gap-2 text-[#4ACBFF] hover:text-[#4ACBFF]/80 transition-colors font-medium group"
                                >
                                    <svg
                                        className={`w-5 h-5 transition-transform duration-300 ${showSetupDetails ? 'rotate-90' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                    <span className="group-hover:underline">
                                        {showSetupDetails ? 'Απόκρυψη' : 'Εμφάνιση'} λεπτομερούς οδηγού ρύθμισης & αντιμετώπισης προβλημάτων
                                    </span>
                                </button>

                                {/* Collapsible Detailed Content */}
                                {showSetupDetails && (
                                    <div className="mt-6 space-y-6 animate-fade-in">
                                        {/* Detailed Steps */}
                                        <div className="space-y-4">
                                            <DetailedStep
                                                title="Βήμα 1 — Εγκατάσταση MetaMask"
                                                icon="1️⃣"
                                            >
                                                <p>Εγκαταστήστε το MetaMask ως επέκταση browser από το <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-[#4ACBFF] hover:underline">metamask.io</a>.</p>
                                                <p>Δημιουργήστε νέο πορτοφόλι ή εισάγετε ένα υπάρχον. <strong>Αποθηκεύστε τη φράση ανάκτησης εκτός διαδικτύου</strong> — ποτέ ως screenshot ή ψηφιακό αρχείο.</p>
                                                <p className="text-sm text-white/60">Υποστηριζόμενοι browsers: Chrome, Brave, Firefox, Edge</p>
                                            </DetailedStep>

                                            <DetailedStep
                                                title="Βήμα 2 — Σύνδεση πορτοφολιού"
                                                icon="2️⃣"
                                            >
                                                <p>Όταν ανοίξετε το Web3Edu, θα δείτε ένα κουμπί <strong>"Σύνδεση Πορτοφολιού"</strong> πάνω δεξιά.</p>
                                                <p>Πατήστε το και εγκρίνετε τη σύνδεση στο MetaMask. Αυτό δημιουργεί τη μαθησιακή σας ταυτότητα.</p>
                                                <p className="text-sm text-white/60">Η διεύθυνσή σας εμφανίζεται, αλλά παραμένει ψευδωνυμική.</p>
                                            </DetailedStep>

                                            <DetailedStep
                                                title="Βήμα 3 — Έγκριση Besu Edu‑Net"
                                                icon="3️⃣"
                                            >
                                                <p>Κατά το πρώτο σας εργαστήριο, το MetaMask θα ζητήσει να προσθέσει νέο δίκτυο: <strong>Web3Edu Besu Edu‑Net</strong>.</p>
                                                <p>Πατήστε "Approve" — έτσι συνδέεστε στο εκπαιδευτικό μας blockchain.</p>
                                                <p className="text-sm text-white/60">Το δίκτυο αυτό δεν χρησιμοποιεί πραγματικό ETH. Όλες οι συναλλαγές είναι μόνο για μάθηση.</p>
                                            </DetailedStep>

                                            <DetailedStep
                                                title="Βήμα 4 — Είστε έτοιμοι!"
                                                icon="✅"
                                            >
                                                <p>Αφού συνδεθείτε, πηγαίνετε στη σελίδα Labs και ξεκινήστε με το <strong>Lab 01 — Wallets & Web3 Identity</strong>.</p>
                                                <p>Κάθε εργαστήριο βασίζεται στο προηγούμενο, οπότε ακολουθήστε τη σειρά τους.</p>
                                            </DetailedStep>
                                        </div>

                                        {/* Troubleshooting */}
                                        <div className="rounded-xl border border-[#FF67D2]/30 bg-[#FF67D2]/5 p-6">
                                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                                <svg className="w-5 h-5 text-[#FF67D2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                Συχνά προβλήματα
                                            </h4>
                                            <div className="space-y-3 text-sm text-white/70">
                                                <TroubleshootItem
                                                    issue="Το MetaMask δεν συνδέεται"
                                                    solution="Δοκιμάστε ανανέωση σελίδας ή αποσύνδεση/επανασύνδεση από τις Connected Sites ρυθμίσεις του MetaMask."
                                                />
                                                <TroubleshootItem
                                                    issue="Το δίκτυο δεν εμφανίζεται"
                                                    solution="Βεβαιωθείτε ότι πατήσατε 'Approve' όταν σας ζητήθηκε. Μπορείτε να το προσθέσετε χειροκίνητα: Settings → Networks → Add Network."
                                                />
                                                <TroubleshootItem
                                                    issue="Οι συναλλαγές αποτυγχάνουν"
                                                    solution="Βεβαιωθείτε ότι είστε στο Besu Edu‑Net μέσα στο MetaMask (ελέγξτε το dropdown δικτύου)."
                                                />
                                                <TroubleshootItem
                                                    issue="Λάθος δίκτυο επιλεγμένο"
                                                    solution="Πατήστε το dropdown δικτύου στο MetaMask και επιλέξτε 'Web3Edu Besu Edu‑Net'."
                                                />
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-[#FF67D2]/20">
                                                <p className="text-sm text-white/70 mb-3">
                                                    <strong>Ακόμα κολλημένοι;</strong> Χρησιμοποιήστε το διαγνωστικό εργαλείο μας για να εντοπίσετε το πρόβλημα:
                                                </p>
                                                <NetworkCheckButton variant="troubleshoot" icon={true}>
                                                    Διάγνωση Ρύθμισης
                                                </NetworkCheckButton>
                                            </div>
                                        </div>

                                        {/* Mini FAQ */}
                                        <div className="rounded-xl border border-[#8A57FF]/30 bg-[#8A57FF]/5 p-6">
                                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                                <svg className="w-5 h-5 text-[#8A57FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Γρήγορο FAQ
                                            </h4>
                                            <div className="space-y-3 text-sm">
                                                <FAQItem
                                                    question="Χρειάζομαι πραγματικό ETH;"
                                                    answer="Όχι. Το Besu Edu‑Net είναι απομονωμένο εκπαιδευτικό blockchain. Δεν υπάρχει πραγματικό χρήμα."
                                                />
                                                <FAQItem
                                                    question="Είναι ασφαλές το πορτοφόλι μου;"
                                                    answer="Ναι — όσο δεν μοιράζεστε ποτέ το private key ή τη φράση ανάκτησης. Το Web3Edu δεν θα τη ζητήσει ποτέ."
                                                />
                                                <FAQItem
                                                    question="Μπορώ να χρησιμοποιήσω άλλο πορτοφόλι;"
                                                    answer="Το MetaMask απαιτείται για την καλύτερη εμπειρία. Άλλα Web3 πορτοφόλια ίσως λειτουργούν, αλλά δεν υποστηρίζονται επίσημα."
                                                />
                                                <FAQItem
                                                    question="Τι γίνεται αν χάσω την πρόσβαση στο πορτοφόλι μου;"
                                                    answer="Μπορείτε να δημιουργήσετε νέο πορτοφόλι και να ξεκινήσετε από την αρχή. Η πρόοδός σας συνδέεται με τη διεύθυνση πορτοφολιού."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </StartCard>

                    {/* WHO THIS IS FOR */}
                    <StartCard
                        title="Για ποιον είναι (v1)"
                        color="#8A57FF"
                        icon={
                            <svg className="w-6 h-6 text-[#8A57FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        }
                    >
                        <p className="text-lg text-white/90 mb-6">
                            Προς το παρόν, το Web3Edu είναι σχεδιασμένο για <strong>φοιτητές και αρχάριους μαθητές</strong>.
                        </p>

                        <div className="space-y-3">
                            <ListItem icon="✓" color="#8A57FF">
                                Περίεργοι για το Web3 πέρα από το hype
                            </ListItem>
                            <ListItem icon="✓" color="#8A57FF">
                                Πρόθυμοι να πειραματιστείτε και να «σπάσετε» πράγματα με ασφάλεια
                            </ListItem>
                            <ListItem icon="✓" color="#8A57FF">
                                Ενδιαφέρεστε να κατανοήσετε πώς λειτουργούν πραγματικά τα πράγματα
                            </ListItem>
                        </div>

                        <p className="mt-6 text-sm text-white/60 italic">
                            Οι διαδρομές για Εκπαιδευτικούς και Builders θα προστεθούν αργότερα. Για την v1, εστιάζουμε στο να κάνουμε ένα πράγμα καλά.
                        </p>
                    </StartCard>

                    {/* HOW WEB3EDU WORKS */}
                    <StartCard
                        title="Πώς λειτουργεί το Web3Edu"
                        color="#4ACBFF"
                        icon={
                            <svg className="w-6 h-6 text-[#4ACBFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        }
                    >
                        <p className="text-lg text-white/90 mb-6">
                            Το Web3Edu είναι χτισμένο γύρω από <strong>hands-on εργαστήρια</strong>.
                        </p>

                        <div className="grid md:grid-cols-3 gap-4">
                            <FeatureBox
                                icon="🎯"
                                title="Μία έννοια ανά εργαστήριο"
                                description="Κάθε εργαστήριο εστιάζει σε μία ιδέα Web3"
                            />
                            <FeatureBox
                                icon="🛠️"
                                title="Μόνο πραγματικά εργαλεία"
                                description="Χωρίς προσομοιώσεις — αλληλεπιδράτε με πραγματική υποδομή"
                            />
                            <FeatureBox
                                icon="✅"
                                title="Επαληθεύσιμη πρόοδος"
                                description="Η μάθησή σας αφήνει on-chain απόδειξη"
                            />
                        </div>

                        <p className="mt-6 text-base text-white/70 text-center italic">
                            Δεν υπάρχουν κουίζ, διαφάνειες ή ψεύτικα demos. Η πρόοδος κερδίζεται με την πράξη.
                        </p>
                    </StartCard>

                    {/* WHERE TO START */}
                    <StartCard
                        title="Από πού πρέπει να ξεκινήσετε"
                        color="#FF67D2"
                        icon={
                            <svg className="w-6 h-6 text-[#FF67D2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        }
                    >
                        <div className="rounded-2xl border border-[#FF67D2]/30 bg-[#FF67D2]/5 p-6">
                            <h3 className="text-xl font-semibold text-white mb-3">Βασικά Εργαστήρια</h3>
                            <p className="text-base text-white/80 mb-4">
                                Πρέπει να ξεκινήσετε με τα <strong>Βασικά Εργαστήρια</strong>.
                            </p>
                            <div className="space-y-2 text-sm text-white/70">
                                <p>• Αυτά τα εργαστήρια είναι ταξινομημένα σκόπιμα. Κάθε ένα βασίζεται στο προηγούμενο.</p>
                                <p>• <strong>Μην παραλείψετε βήματα.</strong> Το σύστημα υποθέτει ότι τα έχετε ολοκληρώσει με τη σειρά τους.</p>
                                <p>• Ξεκινήστε με το Lab 01 και προχωρήστε έως το Lab 06.</p>
                            </div>
                        </div>
                    </StartCard>

                    {/* PROOF OF ESCAPE */}
                    <StartCard
                        title="Τι είναι το Proof of Escape (και τι δεν είναι)"
                        color="#4ACBFF"
                        icon={
                            <svg className="w-6 h-6 text-[#4ACBFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        }
                    >
                        <div className="flex items-start gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-[#4ACBFF]/20 text-[#4ACBFF] text-sm font-medium border border-[#4ACBFF]/30">
                                Εφαρμοσμένο Εργαστήριο
                            </span>
                        </div>
                        <p className="text-lg text-white/90 mb-4">
                            Το Proof of Escape είναι ένα <strong>Εφαρμοσμένο Εργαστήριο</strong>.
                        </p>
                        <div className="space-y-3 text-base text-white/70">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span>Δεν είναι εισαγωγή</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span>Δεν είναι tutorial</span>
                            </div>
                        </div>
                        <p className="mt-4 text-base text-white/80">
                            Θα πρέπει να το δοκιμάσετε <strong>αφού ολοκληρώσετε τα βασικά εργαστήρια</strong>, ως τρόπο να εφαρμόσετε όσα μάθατε και να επιβεβαιώσετε την κατανόησή σας on-chain.
                        </p>
                    </StartCard>

                    {/* PROGRESS TRACKING */}
                    <StartCard
                        title="Πώς παρακολουθείται η πρόοδος"
                        color="#8A57FF"
                        icon={
                            <svg className="w-6 h-6 text-[#8A57FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        }
                    >
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
                                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-[#8A57FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Τοπική Πρόοδος
                                </h3>
                                <p className="text-sm text-white/70">
                                    Καταγράφεται τοπικά για να καθοδηγεί το μαθησιακό σας ταξίδι μέσα από τα εργαστήρια
                                </p>
                            </div>
                            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
                                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-[#8A57FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    On-chain Απόδειξη
                                </h3>
                                <p className="text-sm text-white/70">
                                    Επαληθεύσιμη απόδειξη που καταγράφεται στο blockchain όταν είναι κατάλληλο
                                </p>
                            </div>
                        </div>
                        <p className="mt-6 text-sm text-white/60 text-center italic">
                            Τα βασικά εργαστήρια εστιάζουν στην εξέλιξη της μάθησης. Τα εφαρμοσμένα εργαστήρια εστιάζουν στην απόδειξη και την εμπειρία. Αυτά είναι συμπληρωματικά, όχι ανταγωνιστικά.
                        </p>
                    </StartCard>

                    {/* WHAT THIS IS NOT */}
                    <StartCard
                        title="Τι δεν είναι το Web3Edu"
                        color="#FF67D2"
                        icon={
                            <svg className="w-6 h-6 text-[#FF67D2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                        }
                    >
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 rounded-lg p-4 border border-white/10 bg-white/[0.02]">
                                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span className="text-base text-white/70">Πλατφόρμα μαθημάτων</span>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg p-4 border border-white/10 bg-white/[0.02]">
                                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span className="text-base text-white/70">Εργοστάσιο πιστοποιητικών</span>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg p-4 border border-white/10 bg-white/[0.02]">
                                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span className="text-base text-white/70">Marketing funnel</span>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg p-4 border border-white/10 bg-white/[0.02]">
                                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span className="text-base text-white/70">Μια προσομοίωση</span>
                            </div>
                        </div>
                    </StartCard>

                    {/* HOW TO USE IT - CTA */}
                    <StartCard
                        title="Πώς να χρησιμοποιήσετε αυτή την πλατφόρμα"
                        color="#8A57FF"
                        icon={
                            <svg className="w-6 h-6 text-[#8A57FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        }
                    >
                        <div className="rounded-2xl p-8 border border-white/10 bg-white/[0.03]">
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                <div className="flex-1 space-y-4">
                                    <p className="text-lg text-white/80 font-medium">
                                        Πάρτε τον χρόνο σας. Διαβάστε προσεκτικά. Πειραματιστείτε ελεύθερα.
                                    </p>
                                    <p className="text-base text-white/60">
                                        Αν κάτι χαλάσει, αυτό είναι μέρος του μαθήματος.<br />
                                        Μπορείτε να πειραματιστείτε με ασφάλεια — αυτό το περιβάλλον είναι απομονωμένο και σχεδιασμένο για μάθηση.<br />
                                        Όταν τελειώσετε ένα εργαστήριο, αφήστε feedback — το Web3Edu εξελίσσεται μαζί με τους μαθητές του.
                                    </p>

                                    {/* Final Network Check Reminder */}
                                    <p className="text-sm text-white/50 italic flex items-center gap-2">
                                        <svg className="w-4 h-4 text-[#4ACBFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>
                                            Δεν είστε σίγουροι ότι το πορτοφόλι σας είναι έτοιμο;{" "}
                                            <NetworkCheckButton variant="inline">
                                                Κάντε έναν γρήγορο έλεγχο
                                            </NetworkCheckButton>
                                            {" "}πριν ξεκινήσετε τα εργαστήρια.
                                        </span>
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <button
                                        onClick={() => navigate("/labs")}
                                        className="px-8 py-4 bg-gradient-to-r from-[#FF67D2] via-[#8A57FF] to-[#4ACBFF] text-white font-semibold rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(138,87,255,0.4)] transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                                    >
                                        <span>Μετάβαση στα Εργαστήρια</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </StartCard>
                </main>
            </div>
        </PageShell>
    );
};

export default StartHereGR;

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function StartCard({ title, icon, color = "#8A57FF", children }) {
    return (
        <section className="relative group rounded-3xl bg-gradient-to-br from-[#0A0F1A]/80 via-[#111626]/80 to-[#131B2D]/80 border border-[#8A57FF]/20 backdrop-blur-xl shadow-[0_0_40px_rgba(138,87,255,0.1)] p-8 transition-all duration-500 hover:border-[#8A57FF]/40 hover:shadow-[0_0_60px_rgba(138,87,255,0.2)]">
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(to bottom right, ${color}12, transparent)` }} />

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
                        {icon}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-semibold text-white">{title}</h2>
                </div>

                <div className="h-1 w-24 rounded-full mb-6" style={{ background: `linear-gradient(to right, ${color}, #8A57FF, #4ACBFF)` }} />

                <div className="text-white/80 leading-relaxed">
                    {children}
                </div>
            </div>
        </section>
    );
}

function SetupStep({ number, title, children }) {
    return (
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4ACBFF]/20 to-[#8A57FF]/20 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
            <div className="relative rounded-xl border border-white/10 bg-white/[0.02] p-5 h-full transition-all duration-300 group-hover:border-[#4ACBFF]/30">
                <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#4ACBFF]/30 to-[#8A57FF]/30 border border-[#4ACBFF]/40 text-white font-bold text-sm">
                        {number}
                    </div>
                    <h3 className="font-semibold text-white text-sm">{title}</h3>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">{children}</p>
            </div>
        </div>
    );
}

function DetailedStep({ title, icon, children }) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <span className="text-lg">{icon}</span>
                {title}
            </h4>
            <div className="space-y-2 text-sm text-white/70">
                {children}
            </div>
        </div>
    );
}

function TroubleshootItem({ issue, solution }) {
    return (
        <div className="border-l-2 border-[#FF67D2]/30 pl-3">
            <p className="font-medium text-white/80">{issue}</p>
            <p className="text-white/60 mt-1">{solution}</p>
        </div>
    );
}

function FAQItem({ question, answer }) {
    return (
        <div className="border-l-2 border-[#8A57FF]/30 pl-3">
            <p className="font-medium text-white/80">{question}</p>
            <p className="text-white/60 mt-1">{answer}</p>
        </div>
    );
}

function ListItem({ icon, color, children }) {
    return (
        <div className="flex items-start gap-3 text-base text-white/80">
            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm" style={{ backgroundColor: `${color}20`, color }}>
                {icon}
            </span>
            <span>{children}</span>
        </div>
    );
}

function FeatureBox({ icon, title, description }) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 text-center">
            <div className="text-3xl mb-3">{icon}</div>
            <h4 className="font-semibold text-white mb-2 text-sm">{title}</h4>
            <p className="text-xs text-white/60">{description}</p>
        </div>
    );
}

// ============================================================================
// NETWORK CHECK BUTTON COMPONENT - REUSABLE
// ============================================================================

function NetworkCheckButton({ variant = "primary", icon = false, children = "Network Check" }) {
    const navigate = useNavigate();

    const variants = {
        primary: {
            className: "inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#8A57FF] to-[#4ACBFF] hover:from-[#8A57FF]/90 hover:to-[#4ACBFF]/90 text-white text-sm font-semibold rounded-lg shadow-lg shadow-[#8A57FF]/20 hover:shadow-[#8A57FF]/30 transition-all transform hover:-translate-y-0.5"
        },
        troubleshoot: {
            className: "inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF67D2]/80 to-[#8A57FF]/80 hover:from-[#FF67D2] hover:to-[#8A57FF] text-white text-sm font-medium rounded-lg transition-all"
        },
        inline: {
            className: "inline-flex items-center gap-1 text-[#4ACBFF] hover:text-[#4ACBFF]/80 font-medium hover:underline transition-colors"
        }
    };

    const { className } = variants[variant];

    return (
        <button
            onClick={() => navigate("/network-check-gr")}
            className={className}
        >
            {icon && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )}
            <span>{children}</span>
        </button>
    );
}
