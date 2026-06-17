import{j as e}from"./vendor-react-CTtygi22.js";import{Y as g,Z as w,_ as F}from"./index-3uwFq_AR.js";function N({name:o,role:m,avatar:c,badges:d=[],socials:l={},bio:n="",quote:i="",mode:p="horizontal",className:h="",style:f={}}){const r=p==="horizontal",b={"*":"from-[#8A57FF]/40 via-[#4ACBFF]/40 to-[#FF67D2]/40 dark:from-[#8A57FF]/20 dark:via-[#4ACBFF]/20 dark:to-[#FF67D2]/20"},x={"*":"bg-[#8A57FF] text-[#8A57FF] dark:text-[#4ACBFF]"},u=b["*"];return e.jsxs("div",{className:`
                group rounded-3xl p-[2px] 
                bg-gradient-to-br ${u} 
                shadow-xl transition-all duration-500 w-full mx-auto ${h}
                hover:shadow-[0_0_45px_rgba(138,87,255,0.45)]
                hover:-translate-y-1
            `,style:f,children:[e.jsxs("div",{className:`
                  flex flex-col gap-8 md:flex-row md:items-center md:gap-10
                  p-6 sm:p-8 pb-12 sm:pb-16 md:pb-20 rounded-3xl bg-white/90 dark:bg-slate-900/70 backdrop-blur-2xl 
                  border border-white/40 shadow-xl w-full h-full md:min-h-[420px]
                  transition-all duration-300
                  group-hover:shadow-[0_0_45px_rgba(138,87,255,0.35)]
               `,children:[e.jsxs("div",{className:`${r?"flex flex-col items-center w-full md:w-auto":"flex flex-col items-center w-full"}`,children:[e.jsx("img",{src:c,alt:o,className:`
                            h-40 w-40 sm:h-48 sm:w-48 md:h-56 md:w-56 lg:h-64 lg:w-64
                            rounded-3xl object-cover 
                            shadow-[0_0_35px_rgba(138,87,255,0.45)] 
                            ring-4 ring-[#8A57FF]/40 dark:ring-[#8A57FF]/60
                            animate-avatarGlow
                        `,loading:"lazy"}),e.jsxs("div",{className:`flex gap-3 mt-3 justify-center ${r?"":"mb-2"}`,children:[e.jsx("a",{href:l.github||"#",target:"_blank",rel:"noopener noreferrer",className:`${l.github?"text-slate-800 hover:text-[#8A57FF] dark:text-slate-200 dark:hover:text-[#4ACBFF] hover:bg-slate-900/5 dark:hover:bg-white/10":"opacity-30 cursor-not-allowed text-slate-500 dark:text-slate-600"} transition-colors rounded-full p-2`,children:e.jsx(g,{size:22})}),e.jsx("a",{href:l.linkedin||"#",target:"_blank",rel:"noopener noreferrer",className:`${l.linkedin?"text-slate-800 hover:text-[#8A57FF] dark:text-slate-200 dark:hover:text-[#4ACBFF] hover:bg-slate-900/5 dark:hover:bg-white/10":"opacity-30 cursor-not-allowed text-slate-500 dark:text-slate-600"} transition-colors rounded-full p-2`,children:e.jsx(w,{size:22})}),e.jsx("a",{href:l.discord||"#",target:"_blank",rel:"noopener noreferrer",className:`${l.discord?"text-slate-800 hover:text-[#8A57FF] dark:text-slate-200 dark:hover:text-[#4ACBFF] hover:bg-slate-900/5 dark:hover:bg-white/10":"opacity-30 cursor-not-allowed text-slate-500 dark:text-slate-600"} transition-colors rounded-full p-2`,children:e.jsx(F,{size:22})})]}),e.jsx("div",{className:"mt-4 text-center text-slate-800 dark:text-slate-200 space-y-1",children:m.split(`
`).map((a,t)=>t===0?e.jsx("p",{className:"font-bold text-lg md:text-xl leading-tight",children:a},t):e.jsx("p",{className:"text-sm md:text-base text-slate-600 dark:text-slate-400 leading-snug",children:a},t))})]}),e.jsxs("div",{className:`
                        w-full flex flex-col items-center text-center mt-4 md:mt-0
                        ${r?"md:flex-1 md:items-start md:text-left md:pl-6":"md:items-start md:text-left"}
                    `,children:[e.jsx("h3",{className:`
                            font-bold text-slate-800 dark:text-white tracking-tight mb-2
                            ${r?"text-3xl sm:text-4xl md:text-5xl":"text-3xl sm:text-4xl"}
                        `,children:o}),d.length>0&&e.jsx("div",{className:`flex flex-wrap gap-2 mb-3 justify-center ${r?"md:justify-start":""}`,children:d.map((a,t)=>e.jsx("span",{className:"px-3 py-1 text-sm md:text-base font-semibold rounded-full bg-[#EDE8FF] text-[#8A57FF] dark:bg-[#1a1630] dark:text-[#C9B8FF] border border-[#8A57FF]/30",children:a},t))}),n&&e.jsx("div",{className:"text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed w-full max-w-full md:max-w-[600px] space-y-3",children:n.split(`
`).map((a,t)=>{const s=a.trim();return s.startsWith("—")||s.startsWith("-")||s.startsWith("•")||s.match(/^(\*\s+)/)?e.jsxs("div",{className:"flex items-start gap-3 text-left w-full",children:[e.jsx("div",{className:`
                                                    mt-1 h-2 w-2 rounded-full 
                                                    ${x["*"].split(" ")[0]}
                                                    animate-bulletShine
                                                `}),e.jsx("p",{className:`
                                                    leading-snug font-medium
                                                    ${x["*"].replace(/^bg-[^\s]+ /,"")}
                                                `,children:s.replace(/^[-—•*]\s*/,"")})]},t):e.jsx("p",{className:"leading-relaxed",children:a},t)})}),i&&r&&e.jsxs("p",{className:"mt-4 italic text-lg text-slate-700 dark:text-slate-300 leading-relaxed border-l-4 border-[#8A57FF]/40 dark:border-[#8A57FF]/60 pl-4 max-w-[680px]",children:["“",i,"”"]})]})]}),e.jsx("div",{className:"w-full h-[4px] mt-4 rounded-full neon-separator"}),e.jsx("style",{children:`
            @keyframes avatarGlow {
                0% { box-shadow: 0 0 25px rgba(138,87,255,0.35); }
                50% { box-shadow: 0 0 55px rgba(138,87,255,0.55); }
                100% { box-shadow: 0 0 25px rgba(138,87,255,0.35); }
            }
            .animate-avatarGlow {
                animation: avatarGlow 3.5s ease-in-out infinite;
            }
            @keyframes neonPulse {
                0% { opacity: 0.4; filter: blur(2px); }
                50% { opacity: 1; filter: blur(4px); }
                100% { opacity: 0.4; filter: blur(2px); }
            }
            .neon-separator {
                background: linear-gradient(90deg, rgba(138,87,255,1), rgba(74,203,255,1), rgba(255,103,210,1));
                animation: neonPulse 2.6s ease-in-out infinite;
            }
            @keyframes bulletShine {
              0% { transform: scale(1); filter: drop-shadow(0 0 2px currentColor); }
              50% { transform: scale(1.25); filter: drop-shadow(0 0 6px currentColor); }
              100% { transform: scale(1); filter: drop-shadow(0 0 2px currentColor); }
            }
            .animate-bulletShine {
              animation: bulletShine 2.4s ease-in-out infinite;
            }
            `})]})}const v="/assets/dimi-C62EL5k8.webp",y="/assets/nelly-CPwVJMy_.jpg",C="/assets/tonia-CCikPjrK.webp",E="data:image/webp;base64,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";export{N as T,v as d,E as m,y as n,C as t};
