// src/pages/team/TeamPageEN.jsx
import PageShell from "../../components/PageShell.jsx";
import TeamMemberCard from "../../components/TeamMemberCard.jsx";
import Footer from "../../components/Footer.jsx";
import dimi from "../../assets/team/dimi.webp";
import nelly from "../../assets/team/nelly.jpg";
import tonia from "../../assets/team/tonia.jpg";
import michael from "../../assets/team/michael.jpg";


export default function TeamPageEN() {
    return (
        <PageShell>
            <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-200 dark:from-slate-950 dark:via-black dark:to-slate-950 py-28 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/3 w-72 h-72 bg-indigo-400/30 dark:bg-indigo-700/20 blur-3xl rounded-full animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-400/20 dark:bg-violet-800/20 blur-[120px] rounded-full animate-pulse-slower"></div>
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
                            <div className="h-[3px] w-full bg-gradient-to-r from-[#7C3AED] via-[#4F46E5] to-[#0EA5E9] opacity-60 rounded-full"></div>
                        </div>
                        <div className="text-center mb-16 animate-fadeInUp">

                            <div className="mb-10 flex justify-center">
                                <div className="inline-flex items-center gap-3 px-7 py-3 rounded-full
                                                bg-gradient-to-r from-[#7C3AED]/20 via-[#4F46E5]/20 to-[#0EA5E9]/20
                                                border border-white/20 backdrop-blur-xl
                                                text-white text-xl font-bold tracking-wide shadow-lg
                                                animate-pulse-slow">
                                    <span className="text-2xl">⚡</span>
                                    <span>Web3Edu Core Team</span>
                                </div>
                            </div>

                            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white drop-shadow-xl">
                                Meet the Web3Edu Team
                            </h1>
                            <div className="mt-6 h-[4px] w-40 mx-auto bg-gradient-to-r
                                            from-[#7C3AED] via-[#4F46E5] to-[#0EA5E9]
                                            blur-[1px] opacity-80 rounded-full animate-flow"></div>
                            <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-2xl leading-relaxed">
                                A multidisciplinary team advancing blockchain education through research, decentralization,
                                gamification and hands-on learning — powered by the Besu EduNet ecosystem.
                            </p>
                            <div className="relative mt-10 mb-6">
                                <div className="absolute inset-0 mx-auto w-64 h-64 rounded-full
                                                bg-gradient-to-br from-[#7C3AED]/10 via-[#4F46E5]/10 to-[#0EA5E9]/10
                                                blur-3xl animate-pulse-slower"></div>
                            </div>
                        </div>

                        <div className="my-14 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"></div>

                        <h2 className="text-3xl font-bold text-center mt-24 mb-12 text-slate-800 dark:text-slate-200">
                            Vision & Research Directions
                        </h2>
                        <div className="flex flex-col md:flex-row items-center gap-14 mb-32 text-lg w-full max-w-6xl mx-auto relative z-10">
                            <TeamMemberCard
                                mode="horizontal-right"
                                className="animate-fadeInUp h-full"
                                style={{ animationDelay: "0.5s" }}
                                name="Dimitrios G. Kogias"
                                role={`Founder
Lead Blockchain Researcher
Web3 Education Architect`}
                                avatar={dimi}
                                premium={true}
                                badges={["Founder", "Vision", "Lead Researcher", "Architect"]}
                                socials={{
                                    github: "https://github.com/DimiKog",
                                    linkedin: "https://www.linkedin.com/in/dimitris-kogias-b376222a",
                                    discord: "https://discordapp.com/users/758370279919058986"
                                }}
                                bio={`— Leading the strategic vision and research direction of Web3Edu.
— Architecting the platform’s educational journey from learning → certification → DAO participation.

Dimitris is a blockchain researcher specializing in Web3 educational ecosystems, Besu-based networks, Zero-Knowledge Proofs, and secure decentralized architectures. As the founder and lead architect of Web3Edu, he leads the strategic direction of the platform and designs hands-on learning frameworks and advanced instructional tools that connect academic research with real-world blockchain applications.`}
                            />
                        </div>
                        <div className="w-[4px] h-32 mx-auto bg-gradient-to-b from-transparent via-indigo-400/60 to-transparent animate-pulse-slow rounded-full"></div>

                        <div className="w-full h-px my-16 bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent animate-pulse"></div>

                        <h2 className="text-3xl font-bold text-center mt-24 mb-12 text-slate-800 dark:text-slate-200">
                            Academic & Outreach
                        </h2>
                        <div className="flex flex-col md:flex-row items-center gap-10 mb-28 text-lg w-full max-w-6xl mx-auto">
                            <TeamMemberCard
                                mode="horizontal-left"
                                className="animate-fadeInUp h-full"
                                style={{ animationDelay: "0.2s" }}
                                name="Nelly Leligkou"
                                role={`Founder 
                                    Academic Advisor
Outreach & Engagement (Lead)
Research & Strategy`}
                                avatar={nelly}
                                premium={true}
                                badges={["Founder", "Academic Advisor", "Engagement", "Strategy"]}
                                socials={{ github: "#", linkedin: "https://www.linkedin.com/in/nelly-leligou-635a4510/", discord: "#" }}
                                bio={`— Guiding the academic and pedagogical direction of Web3Edu.
— Strengthens institutional partnerships and aligns our learning frameworks with academic standards.

Nelly brings extensive academic and research experience in networking, digital ecosystems, and emerging technologies. As the lead for Academic Strategy and Outreach at Web3Edu, she guides the platform’s research direction, strengthens institutional partnerships, and supports the development of high‑impact educational initiatives.`}
                            />
                        </div>
                        <div className="w-[4px] h-32 mx-auto bg-gradient-to-b from-transparent via-indigo-400/60 to-transparent animate-pulse-slow rounded-full"></div>

                        <div className="w-full h-px my-16 bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent animate-pulse"></div>

                        <h2 className="text-3xl font-bold text-center mt-24 mb-12 text-slate-800 dark:text-slate-200">
                            Governance & Community
                        </h2>
                        <div className="flex flex-col md:flex-row-reverse items-center gap-10 mb-28 text-lg w-full max-w-6xl mx-auto">
                            <TeamMemberCard
                                mode="horizontal-right"
                                className="animate-fadeInUp h-full"
                                style={{ animationDelay: "0.3s" }}
                                name="Tonia Damvakeraki"
                                role={`Founder
                                    DAO Researcher
Governance & Community Manager (Operations Lead)`}
                                avatar={tonia}
                                premium={true}
                                badges={["Founder", "DAO Research", "Governance", "Community"]}
                                socials={{ github: "#", linkedin: "https://www.linkedin.com/in/tonia-damvakeraki-1a028a/", discord: "#" }}
                                bio={`— Designing decentralized governance and participation models for Web3Edu.
— Connects governance research with real community operations inside the Web3Edu DAO.

Tonia specializes in decentralized governance and DAO participation models. She leads the Governance and DAO Research sector at Web3Edu, contributing to the design of responsible governance mechanisms, sustainable participation models, and the operational coordination of the Web3Edu community.`}
                            />
                        </div>
                        <div className="w-[4px] h-32 mx-auto bg-gradient-to-b from-transparent via-indigo-400/60 to-transparent animate-pulse-slow rounded-full"></div>

                        <div className="w-full h-px my-16 bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent animate-pulse"></div>

                        <h2 className="text-3xl font-bold text-center mt-24 mb-12 text-slate-800 dark:text-slate-200">
                            Infrastructure & Operations
                        </h2>
                        <div className="flex flex-col md:flex-row items-center gap-10 mb-28 text-lg w-full max-w-6xl mx-auto">
                            <TeamMemberCard
                                mode="horizontal-left"
                                className="animate-fadeInUp h-full"
                                style={{ animationDelay: "0.4s" }}
                                name="Michael Xevgenis"
                                role={`Founder
                                    Blockchain Researcher
Technical Infrastructure
Community Manager (Lead)`}
                                avatar={michael}
                                premium={true}
                                badges={["Founder", "Infrastructure", "Research", "Community Lead"]}
                                socials={{ github: "#", linkedin: "https://www.linkedin.com/in/michael-xevgenis-4b85659a/", discord: "#" }}
                                bio={`— Ensuring the reliability and operational continuity of the Besu EduNet.
— Supports the research backbone enabling all Web3Edu decentralized applications.

Michael leads the Network Infrastructure and Community Operations sector at Web3Edu. He supports the technical backbone of the Besu EduNet, contributes to research and development of decentralized systems, and ensures the reliability, security, and operational continuity of the network and community systems.`}
                            />
                        </div>
                        <div className="w-[4px] h-32 mx-auto bg-gradient-to-b from-transparent via-indigo-400/60 to-transparent animate-pulse-slow rounded-full"></div>

                        <div className="w-full h-px my-16 bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent animate-pulse"></div>

                        <div className="w-full h-px my-16 bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent animate-pulse"></div>

                        <div className="text-center max-w-3xl mx-auto mt-24 mb-16 text-xl text-slate-700 dark:text-slate-300 leading-relaxed">
                            <h3 className="text-3xl font-bold mb-6">How the Web3Edu Team Works</h3>
                            <p>Academic excellence meets decentralized technology.</p>
                            <p>Each sector collaborates through shared infrastructure powered by the Besu EduNet.</p>
                            <p>Our mission is to bridge education, research, and real-world blockchain applications.</p>
                        </div>

                        <p className="text-center text-slate-500 dark:text-slate-400 text-lg mt-8 mb-8">
                            More team members and collaborators will appear as Web3Edu expands its research and DAO initiatives.
                        </p>

                        <div className="text-center mt-24 mb-20 opacity-0 animate-fadeInSlow">
                            <a
                                href="/#/join"
                                className="px-7 py-3 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white font-semibold shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
                            >
                                Join the Web3Edu Community →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
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
