// src/pages/team/TeamPageEN.jsx
import PageShell from "../../components/PageShell.jsx";
import TeamMemberCard from "../../components/TeamMemberCard.jsx";
import dimi from "../../assets/team/dimi.webp";
import nelly from "../../assets/team/nelly.jpg";
import tonia from "../../assets/team/tonia.jpg";
import michael from "../../assets/team/michael.jpg";


export default function TeamPageEN() {
    return (
        <PageShell>
            <div className="min-h-screen bg-gradient-to-b from-[#F6F1FF] via-white to-[#EAF8FF] dark:from-[#0A0F1A] dark:via-[#111626] dark:to-[#131B2D] py-20 px-4 sm:py-28 sm:px-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/3 w-56 h-56 sm:w-72 sm:h-72 bg-[#8A57FF]/25 dark:bg-[#8A57FF]/15 blur-3xl rounded-full animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-[#4ACBFF]/20 dark:bg-[#4ACBFF]/15 blur-[120px] rounded-full animate-pulse-slower"></div>
                <div className="max-w-7xl mx-auto">
                    {/* <div className="absolute left-1/2 top-0 h-full w-[6px] -translate-x-1/2 pointer-events-none z-0">
                        <div className="w-full h-full bg-gradient-to-b from-indigo-400/0 via-indigo-400/40 to-indigo-400/0 
                                        animate-pulse-slower blur-[2px]"></div>

                        <div className="absolute inset-0 w-[2px] left-1/2 -translate-x-1/2 
                                        bg-gradient-to-b from-[#8a5bff] via-[#5ad2ff] to-[#d946ef] 
                                        opacity-90 animate-flow"></div>
                    </div> */}
                    <div>
                        <div className="w-full mx-auto max-w-5xl mb-12">
                            <div className="h-[3px] w-full bg-gradient-to-r from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2] opacity-60 rounded-full"></div>
                        </div>
                        <div className="text-center mb-16 animate-fadeInUp">

                            <div className="mb-10 flex justify-center">
                                <div className="inline-flex items-center gap-3 px-7 py-3 rounded-full
                                                bg-gradient-to-r from-[#8A57FF]/20 via-[#4ACBFF]/20 to-[#FF67D2]/20
                                                border border-white/20 backdrop-blur-xl
                                                text-white text-xl font-bold tracking-wide shadow-lg
                                                animate-pulse-slow">
                                    <span className="text-2xl">⚡</span>
                                    <span>Web3Edu Core Team</span>
                                </div>
                            </div>

                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-800 dark:text-white drop-shadow-xl">
                                Meet the Web3Edu Team
                            </h1>
                            <div className="mt-6 h-[4px] w-40 mx-auto bg-gradient-to-r
                                            from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2]
                                            blur-[1px] opacity-80 rounded-full animate-flow"></div>
                            <p className="mt-4 text-slate-700 dark:text-slate-300 max-w-3xl mx-auto text-lg sm:text-xl leading-loose">
                                A multidisciplinary team advancing blockchain education through research, decentralization, gamification and hands-on learning — powered by the Besu EduNet ecosystem.
                            </p>
                            <div className="relative mt-10 mb-6">
                                <div className="absolute inset-0 mx-auto w-48 h-48 sm:w-64 sm:h-64 rounded-full
                                                bg-gradient-to-br from-[#8A57FF]/10 via-[#4ACBFF]/10 to-[#FF67D2]/10
                                                blur-3xl animate-pulse-slower"></div>
                            </div>
                        </div>

                        <div className="h-[2px] w-full bg-gradient-to-r from-[#8A57FF]/40 via-[#4ACBFF]/40 to-[#FF67D2]/40 rounded-full my-16"></div>
                        <h2 className="text-3xl font-bold text-center mt-16 mb-10 sm:mt-24 sm:mb-12 text-slate-800 dark:text-slate-200">
                            Vision & Research Directions
                        </h2>
                        <div className="flex flex-col md:flex-row items-center gap-10 sm:gap-14 mb-20 sm:mb-32 text-lg w-full max-w-6xl mx-auto relative z-10 space-y-4 md:space-y-0">
                            <TeamMemberCard
                                mode="horizontal-right"
                                className="animate-fadeInUp h-full"
                                style={{ animationDelay: "0.5s" }}
                                name="Dimitrios G. Kogias"
                                role={`Lead Blockchain Researcher
Web3 Education Architect
Founder`}
                                avatar={dimi}
                                premium={true}
                                badges={["Vision & Strategy", "Network Architecture", "ZKP & Advanced Web3 Systems"]}
                                socials={{
                                    github: "https://github.com/DimiKog",
                                    linkedin: "https://www.linkedin.com/in/dimitris-kogias-b376222a",
                                    discord: "https://discordapp.com/users/758370279919058986"
                                }}
                                bio={`— Leading the vision and research direction of Web3Edu.
— Architecting the full learning → certification → DAO participation pathway.

Dimitris is a blockchain researcher specializing in Web3 educational ecosystems, Besu-based networks, zero-knowledge proofs, and secure decentralized architectures. As the founder and lead architect of Web3Edu, he defines the platform’s strategic direction and designs hands-on learning frameworks that connect academic research with real-world decentralized applications.`}
                            />
                        </div>
                        <div className="w-[4px] h-32 mx-auto bg-gradient-to-b from-transparent via-[#8A57FF]/60 to-transparent animate-pulse-slow rounded-full"></div>

                        <div className="w-full h-px my-12 sm:my-16 bg-gradient-to-r from-transparent via-[#8A57FF]/60 to-transparent animate-pulse"></div>

                        <div className="h-[2px] w-full bg-gradient-to-r from-[#8A57FF]/40 via-[#4ACBFF]/40 to-[#FF67D2]/40 rounded-full my-16"></div>
                        <h2 className="text-3xl font-bold text-center mt-16 mb-10 sm:mt-24 sm:mb-12 text-slate-800 dark:text-slate-200">
                            Academic & Outreach
                        </h2>
                        <div className="flex flex-col md:flex-row items-center gap-10 sm:gap-14 mb-28 text-lg w-full max-w-6xl mx-auto space-y-4 md:space-y-0">
                            <TeamMemberCard
                                mode="horizontal-left"
                                className="animate-fadeInUp h-full"
                                style={{ animationDelay: "0.2s" }}
                                name="Nelly Leligkou"
                                role={`Academic Advisor
Outreach & Engagement Lead
Founder`}
                                avatar={nelly}
                                premium={true}
                                badges={["Academic Strategy", "Institutional Partnerships", "Educational Frameworks"]}
                                socials={{ github: "", linkedin: "https://www.linkedin.com/in/nelly-leligou-635a4510/", discord: "" }}
                                bio={`— Guiding the academic and pedagogical foundations of Web3Edu.
— Strengthening partnerships and aligning learning pathways with academic standards.

Nelly brings extensive academic and research experience in networking, digital ecosystems, and emerging technologies. As Web3Edu’s lead in Academic Strategy and Outreach, she shapes the platform’s pedagogical direction, builds institutional collaborations, and supports the development of robust, high-impact educational experiences.`}
                            />
                        </div>
                        <div className="w-[4px] h-32 mx-auto bg-gradient-to-b from-transparent via-[#8A57FF]/60 to-transparent animate-pulse-slow rounded-full"></div>

                        <div className="w-full h-px my-12 sm:my-16 bg-gradient-to-r from-transparent via-[#8A57FF]/60 to-transparent animate-pulse"></div>

                        <div className="h-[2px] w-full bg-gradient-to-r from-[#8A57FF]/40 via-[#4ACBFF]/40 to-[#FF67D2]/40 rounded-full my-16"></div>
                        <h2 className="text-3xl font-bold text-center mt-16 mb-10 sm:mt-24 sm:mb-12 text-slate-800 dark:text-slate-200">
                            Governance & Community
                        </h2>
                        <div className="flex flex-col md:flex-row-reverse items-center gap-10 sm:gap-14 mb-28 text-lg w-full max-w-6xl mx-auto space-y-4 md:space-y-0">
                            <TeamMemberCard
                                mode="horizontal-right"
                                className="animate-fadeInUp h-full"
                                style={{ animationDelay: "0.3s" }}
                                name="Tonia Damvakeraki"
                                role={`DAO Researcher
Governance & Community Operations Lead
Founder`}
                                avatar={tonia}
                                premium={true}
                                badges={["Decentralized Governance", "Participation Models", "Community Operations"]}
                                socials={{ github: "", linkedin: "https://www.linkedin.com/in/tonia-damvakeraki-1a028a/", discord: "" }}
                                bio={`— Designing responsible governance and participation models for Web3Edu.
— Bridging governance research with real operational practices inside the DAO.

Tonia specializes in decentralized governance and DAO participation systems. She leads Web3Edu’s Governance and DAO Research sector, contributing to the design of sustainable governance mechanisms, community engagement models, and the operational coordination that enables a healthy decentralized ecosystem.`}
                            />
                        </div>
                        <div className="w-[4px] h-32 mx-auto bg-gradient-to-b from-transparent via-[#8A57FF]/60 to-transparent animate-pulse-slow rounded-full"></div>

                        <div className="w-full h-px my-12 sm:my-16 bg-gradient-to-r from-transparent via-[#8A57FF]/60 to-transparent animate-pulse"></div>

                        <div className="h-[2px] w-full bg-gradient-to-r from-[#8A57FF]/40 via-[#4ACBFF]/40 to-[#FF67D2]/40 rounded-full my-16"></div>
                        <h2 className="text-3xl font-bold text-center mt-16 mb-10 sm:mt-24 sm:mb-12 text-slate-800 dark:text-slate-200">
                            Infrastructure & Operations
                        </h2>
                        <div className="flex flex-col md:flex-row items-center gap-10 sm:gap-14 mb-28 text-lg w-full max-w-6xl mx-auto space-y-4 md:space-y-0">
                            <TeamMemberCard
                                mode="horizontal-left"
                                className="animate-fadeInUp h-full"
                                style={{ animationDelay: "0.4s" }}
                                name="Michael Xevgenis"
                                role={`Blockchain Researcher
Network Infrastructure Lead
Founder`}
                                avatar={michael}
                                premium={true}
                                badges={["Infrastructure Engineering", "Decentralized Systems", "Community Support"]}
                                socials={{ github: "", linkedin: "https://www.linkedin.com/in/michael-xevgenis-4b85659a/", discord: "" }}
                                bio={`— Ensuring the reliability and continuity of the Besu EduNet infrastructure.
— Supporting the research backbone powering all Web3Edu applications.

Michael leads Web3Edu’s Infrastructure and Community Operations sector. He supports the technical backbone of the Besu EduNet, contributes to research and development in decentralized systems, and ensures that the platform’s infrastructure, tools, and community layers operate securely and reliably.`}
                            />
                        </div>
                        <div className="w-[4px] h-32 mx-auto bg-gradient-to-b from-transparent via-[#8A57FF]/60 to-transparent animate-pulse-slow rounded-full"></div>

                        <div className="w-full h-px my-12 sm:my-16 bg-gradient-to-r from-transparent via-[#8A57FF]/60 to-transparent animate-pulse"></div>

                        <div className="text-center max-w-3xl mx-auto mt-32 mb-16 text-xl text-slate-700 dark:text-slate-300 leading-relaxed">
                            <h3 className="text-3xl font-bold mb-6">How the Web3Edu Team Works</h3>
                            <p>Academic excellence meets decentralized technology.</p>
                            <p>Each sector collaborates through shared infrastructure powered by the Besu EduNet.</p>
                            <p>Our mission is to bridge education, research, and real-world blockchain applications.</p>
                        </div>

                        <p className="text-center text-slate-600 dark:text-slate-400 text-lg mt-8 mb-8">
                            More team members and collaborators will appear as Web3Edu expands its research and DAO initiatives.
                        </p>

                        <div className="text-center mt-16 mb-16 sm:mt-24 sm:mb-20 opacity-0 animate-fadeInSlow">
                            <a
                                href="/#/join"
                                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2] text-white font-bold shadow-[0_0_25px_rgba(74,203,255,0.22)] hover:opacity-95 transition-all duration-300 flex items-center justify-center gap-2 text-center w-fit mx-auto"
                            >
                                Join the Web3Edu Community →
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
