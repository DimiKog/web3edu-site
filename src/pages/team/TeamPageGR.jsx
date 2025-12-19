// src/pages/team/TeamPageGR.jsx
import PageShell from "../../components/PageShell.jsx";
import TeamMemberCard from "../../components/TeamMemberCard.jsx";


import dimi from "../../assets/team/dimi.webp";
import nelly from "../../assets/team/nelly.jpg";
import tonia from "../../assets/team/tonia.jpg";
import michael from "../../assets/team/michael.jpg";

export default function TeamPageGR() {
    return (
        <PageShell>
            <div className="min-h-screen bg-gradient-to-b from-[#F6F1FF] via-white to-[#EAF8FF] dark:from-[#0A0F1A] dark:via-[#111626] dark:to-[#131B2D] py-20 px-4 sm:py-28 sm:px-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/3 w-56 h-56 sm:w-72 sm:h-72 bg-[#8A57FF]/25 dark:bg-[#8A57FF]/15 blur-3xl rounded-full animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-[#4ACBFF]/20 dark:bg-[#4ACBFF]/15 blur-[120px] rounded-full animate-pulse-slower"></div>
                <div className="max-w-7xl mx-auto">
                    <div>
                        <div className="w-full mx-auto max-w-5xl mb-12">
                            <div className="h-[3px] w-full bg-gradient-to-r from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2] opacity-60 rounded-full"></div>
                        </div>
                        <div className="text-center mb-10 sm:mb-16 animate-fadeInUp">
                            <div className="mb-10 flex justify-center">
                                <div className="inline-flex items-center gap-3 px-7 py-3 rounded-full
                                                bg-gradient-to-r from-[#8A57FF]/20 via-[#4ACBFF]/20 to-[#FF67D2]/20
                                                border border-white/20 backdrop-blur-xl
                                                text-white text-xl font-bold tracking-wide shadow-lg
                                                animate-pulse-slow">
                                    <span className="text-2xl">⚡</span>
                                    <span>Πυρήνας Web3Edu</span>
                                </div>
                            </div>

                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-800 dark:text-white drop-shadow-xl">
                                Γνωρίστε την Ομάδα του Web3Edu
                            </h1>
                            <div className="mt-6 h-[4px] w-40 mx-auto bg-gradient-to-r
                                            from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2]
                                            blur-[1px] opacity-80 rounded-full animate-flow"></div>
                            <p className="mt-4 text-slate-700 dark:text-slate-300 max-w-3xl mx-auto text-lg sm:text-xl leading-loose">
                                Μια διεπιστημονική ομάδα που εξελίσσει την εκπαίδευση στο blockchain μέσα από έρευνα,
                                αποκέντρωση, gamification και hands-on μάθηση — αξιοποιώντας το οικοσύστημα Besu EduNet.
                            </p>
                            <div className="relative mt-10 mb-6">
                                <div className="absolute inset-0 mx-auto w-48 h-48 sm:w-64 sm:h-64 rounded-full
                                                bg-gradient-to-br from-[#8A57FF]/10 via-[#4ACBFF]/10 to-[#FF67D2]/10
                                                blur-3xl animate-pulse-slower dark:bg-[#4ACBFF]/15"></div>
                            </div>
                        </div>

                        <div className="my-10 sm:my-14 h-px bg-gradient-to-r from-transparent via-[#8A57FF]/40 to-transparent"></div>

                        <h2 className="text-3xl font-bold text-center mt-32 mb-12 text-slate-800 dark:text-slate-200">
                            Όραμα & Ερευνητικές Κατευθύνσεις
                        </h2>
                        <div className="flex flex-col md:flex-row items-center gap-10 sm:gap-14 mb-20 sm:mb-32 text-lg w-full max-w-6xl mx-auto relative z-10 space-y-4 md:space-y-0">
                            <TeamMemberCard
                                mode="horizontal-right"
                                className="animate-fadeInUp h-full"
                                style={{ animationDelay: "0.5s" }}
                                name="Δημήτριος Γ. Κόγιας"
                                role={`Επικεφαλής Έρευνας Blockchain
Αρχιτέκτονας Εκπαίδευσης Web3
Ιδρυτής`}
                                avatar={dimi}
                                premium={true}
                                badges={[
                                    "Όραμα & Στρατηγική",
                                    "Αρχιτεκτονική Δικτύων",
                                    "ZKP & Προηγμένα Συστήματα Web3"
                                ]}
                                socials={{
                                    github: "https://github.com/DimiKog",
                                    linkedin: "https://www.linkedin.com/in/dimitris-kogias-b376222a",
                                    discord: "https://discordapp.com/users/758370279919058986"
                                }}
                                bio={`— Καθοδηγεί το στρατηγικό όραμα και την ερευνητική κατεύθυνση του Web3Edu.

— Αρχιτεκτονεί την εκπαιδευτική διαδρομή από τη μάθηση → την πιστοποίηση → τη συμμετοχή στο DAO.

Ο Δημήτρης είναι ερευνητής blockchain με ειδίκευση στα εκπαιδευτικά οικοσυστήματα Web3, στα Besu δίκτυα, στα Zero-Knowledge Proofs και στις ασφαλείς αποκεντρωμένες αρχιτεκτονικές. Ως ιδρυτής και lead architect του Web3Edu, σχεδιάζει hands-on μαθησιακά πλαίσια και προηγμένα εκπαιδευτικά εργαλεία που γεφυρώνουν την ακαδημαϊκή έρευνα με τις πραγματικές blockchain εφαρμογές.`}
                            />
                        </div>
                        <div className="w-[4px] h-32 mx-auto bg-gradient-to-b from-transparent via-[#8A57FF]/60 to-transparent animate-pulse-slow rounded-full"></div>

                        <div className="h-[2px] w-full bg-gradient-to-r from-[#8A57FF]/40 via-[#4ACBFF]/40 to-[#FF67D2]/40 rounded-full my-16"></div>

                        <h2 className="text-3xl font-bold text-center mt-32 mb-12 text-slate-800 dark:text-slate-200">
                            Ακαδημαϊκή Στρατηγική & Εξωστρέφεια
                        </h2>
                        <div className="flex flex-col md:flex-row items-center gap-10 mb-20 sm:mb-28 text-lg w-full max-w-6xl mx-auto space-y-4 md:space-y-0">
                            <TeamMemberCard
                                mode="horizontal-left"
                                className="animate-fadeInUp h-full"
                                style={{ animationDelay: "0.2s" }}
                                name="Νέλλη Λελίγκου"
                                role={`Ακαδημαϊκή Σύμβουλος
Υπεύθυνη Εξωστρέφειας & Εμπλοκής
Ιδρύτρια`}
                                avatar={nelly}
                                premium={true}
                                badges={[
                                    "Ακαδημαϊκή Στρατηγική",
                                    "Θεσμικές Συνεργασίες",
                                    "Εκπαιδευτικά Πλαίσια"
                                ]}
                                socials={{ github: "", linkedin: "https://www.linkedin.com/in/nelly-leligou-635a4510/", discord: "" }}
                                bio={`— Καθοδηγεί την ακαδημαϊκή και παιδαγωγική κατεύθυνση του Web3Edu.

— Ενισχύει τις θεσμικές συνεργασίες και ευθυγραμμίζει τα μαθησιακά εργαλεία με τα ακαδημαϊκά πρότυπα.

Η Νέλλη φέρνει βαθιά εμπειρία σε δίκτυα, ψηφιακά οικοσυστήματα και αναδυόμενες τεχνολογίες. Ως επικεφαλής Ακαδημαϊκής Στρατηγικής και Outreach στο Web3Edu, υποστηρίζει την ερευνητική πορεία της πλατφόρμας, δημιουργεί συνέργειες με πανεπιστήμια και ενισχύει την ανάπτυξη εκπαιδευτικών πρωτοβουλιών υψηλού αντικτύπου.`}
                            />
                        </div>
                        <div className="w-[4px] h-32 mx-auto bg-gradient-to-b from-transparent via-[#8A57FF]/60 to-transparent animate-pulse-slow rounded-full"></div>

                        <div className="h-[2px] w-full bg-gradient-to-r from-[#8A57FF]/40 via-[#4ACBFF]/40 to-[#FF67D2]/40 rounded-full my-16"></div>

                        <h2 className="text-3xl font-bold text-center mt-32 mb-12 text-slate-800 dark:text-slate-200">
                            Διακυβέρνηση & Κοινότητα
                        </h2>
                        <div className="flex flex-col md:flex-row-reverse items-center gap-10 mb-20 sm:mb-28 text-lg w-full max-w-6xl mx-auto space-y-4 md:space-y-0">
                            <TeamMemberCard
                                mode="horizontal-right"
                                className="animate-fadeInUp h-full"
                                style={{ animationDelay: "0.3s" }}
                                name="Τόνια Δαμβακεράκη"
                                role={`Ερευνήτρια DAO
Υπεύθυνη Διακυβέρνησης & Κοινοτικής Λειτουργίας
Ιδρύτρια`}
                                avatar={tonia}
                                premium={true}
                                badges={[
                                    "Αποκεντρωμένη Διακυβέρνηση",
                                    "Μοντέλα Συμμετοχής",
                                    "Κοινοτική Οργάνωση"
                                ]}
                                socials={{ github: "", linkedin: "https://www.linkedin.com/in/tonia-damvakeraki-1a028a/", discord: "" }}
                                bio={`— Σχεδιάζει τα αποκεντρωμένα μοντέλα διακυβέρνησης και συμμετοχής του Web3Edu.

— Συνδέει την έρευνα governance με τις πραγματικές λειτουργίες της κοινότητας στο Web3Edu DAO.

Η Τόνια ειδικεύεται στα μοντέλα αποκεντρωμένης διακυβέρνησης και συμμετοχής DAO. Ηγείται του Governance & DAO Research τομέα στο Web3Edu, συμβάλλοντας στη δημιουργία υπεύθυνων μηχανισμών διακυβέρνησης, βιώσιμων μοντέλων συμμετοχής και στον λειτουργικό συντονισμό της κοινότητας.`}
                            />
                        </div>
                        <div className="w-[4px] h-32 mx-auto bg-gradient-to-b from-transparent via-[#8A57FF]/60 to-transparent animate-pulse-slow rounded-full"></div>

                        <div className="h-[2px] w-full bg-gradient-to-r from-[#8A57FF]/40 via-[#4ACBFF]/40 to-[#FF67D2]/40 rounded-full my-16"></div>

                        <h2 className="text-3xl font-bold text-center mt-32 mb-12 text-slate-800 dark:text-slate-200">
                            Υποδομή & Λειτουργίες
                        </h2>
                        <div className="flex flex-col md:flex-row items-center gap-10 mb-20 sm:mb-28 text-lg w-full max-w-6xl mx-auto space-y-4 md:space-y-0">
                            <TeamMemberCard
                                mode="horizontal-left"
                                className="animate-fadeInUp h-full"
                                style={{ animationDelay: "0.4s" }}
                                name="Μιχάλης Ξευγένης"
                                role={`Ερευνητής Blockchain
Υπεύθυνος Υποδομών Δικτύου
Ιδρυτής`}
                                avatar={michael}
                                premium={true}
                                badges={[
                                    "Μηχανική Υποδομών",
                                    "Αποκεντρωμένα Συστήματα",
                                    "Κοινοτική Υποστήριξη"
                                ]}
                                socials={{ github: "", linkedin: "https://www.linkedin.com/in/michael-xevgenis-4b85659a/", discord: "" }}
                                bio={`— Διασφαλίζει την αξιοπιστία και τη λειτουργική συνέχεια του Besu EduNet.

— Υποστηρίζει τη βασική ερευνητική υποδομή που τροφοδοτεί όλες τις αποκεντρωμένες εφαρμογές του Web3Edu.

Ο Μιχάλης ηγείται του τομέα Network Infrastructure & Community Operations στο Web3Edu. Υποστηρίζει το τεχνικό υπόβαθρο του Besu EduNet, συμβάλλει στην έρευνα και ανάπτυξη αποκεντρωμένων συστημάτων και εξασφαλίζει την αξιοπιστία, ασφάλεια και λειτουργική συνέχεια του δικτύου και των κοινοτικών συστημάτων.`}
                            />
                        </div>
                        <div className="w-[4px] h-32 mx-auto bg-gradient-to-b from-transparent via-[#8A57FF]/60 to-transparent animate-pulse-slow rounded-full"></div>

                        <div className="w-full h-px my-12 sm:my-16 bg-gradient-to-r from-transparent via-[#8A57FF]/60 to-transparent animate-pulse"></div>

                        <div className="text-center max-w-3xl mx-auto mt-24 mb-16 text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                            <h3 className="text-3xl font-bold mb-6">Πώς λειτουργεί η ομάδα Web3Edu</h3>
                            <p>Η ακαδημαϊκή αριστεία συναντά την αποκεντρωμένη τεχνολογία.</p>
                            <p>Κάθε τομέας συνεργάζεται μέσω κοινής υποδομής που τροφοδοτείται από το Besu EduNet.</p>
                            <p>Η αποστολή μας είναι να γεφυρώσουμε την εκπαίδευση, την έρευνα και τις πραγματικές blockchain εφαρμογές.</p>
                        </div>

                        <p className="text-center text-slate-700 dark:text-slate-400 text-lg mt-8 mb-8">
                            Περισσότερα μέλη και συνεργάτες θα προστεθούν καθώς το Web3Edu επεκτείνει τα ερευνητικά και DAO εγχειρήματα.
                        </p>

                        <div className="w-20 h-[2px] bg-gradient-to-r from-[#8A57FF]/20 via-[#4ACBFF]/20 to-[#FF67D2]/20 mx-auto mb-8"></div>

                        <div className="text-center mt-16 mb-16 sm:mt-24 sm:mb-20 opacity-0 animate-fadeInSlow">
                            <a
                                href="/#/join"
                                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2] text-white font-bold shadow-[0_0_25px_rgba(74,203,255,0.22)] hover:opacity-95 transition-all duration-300 flex items-center justify-center gap-2 text-center w-fit mx-auto"
                            >
                                Γίνετε μέλος της κοινότητας Web3Edu →
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                {`
            @keyframes flow {
              0% { background-position: 0% 0%; }
              100% { background-position: 0% 200%; }
            }

            .animate-flow {
              background-size: 100% 200%;
              animation: flow 4s linear infinite;
            }

            .animate-pulse-slower {
              animation: pulse 6s ease-in-out infinite;
            }
            `}
            </style>
        </PageShell>
    );
}
