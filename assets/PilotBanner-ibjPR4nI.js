import{j as e,r as m,l as C}from"./react-vendor-C3nCzrQE.js";import{d as S}from"./ui-vendor-CsLUdq9X.js";import{i as v}from"./identity-icon-DIFp2Mb1.js";function B({title:t,icon:i,status:a,statusLabel:s,children:o,className:n=""}){return e.jsxs("div",{className:`
            relative rounded-3xl p-6
            border border-indigo-300/40 dark:border-indigo-700/30
            bg-gradient-to-br from-white/90 via-indigo-50/75 to-slate-100/85
            dark:from-[#0E1426]/85 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
            dark:border-white/10
            backdrop-blur-xl
            shadow-xl
            transition-all duration-500 ease-out
            hover:scale-[1.01] hover:shadow-2xl
            opacity-0 animate-fadeInSlow
            break-words whitespace-normal
            ${n}
        `,children:[a==="completed"&&e.jsx("div",{className:"absolute top-4 right-4 z-20",children:e.jsxs("span",{className:`inline-flex items-center gap-1 px-3 py-1 rounded-full
                        bg-green-500/90 text-white text-xs font-semibold
                        shadow-lg backdrop-blur`,children:["✓ ",s||"Completed"]})}),e.jsxs("div",{className:"flex items-center gap-3 mb-4 text-slate-900 dark:text-slate-100",children:[i&&e.jsx("div",{className:`w-7 h-7 flex items-center justify-center rounded-lg 
                                    bg-gradient-to-br from-[#8A57FF] via-[#4ACBFF] to-[#FF67D2] shadow-md`,children:i}),e.jsx("h2",{className:"text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-wide tracking-tight break-words whitespace-normal",children:t})]}),e.jsx("div",{className:"text-slate-800 dark:text-slate-100 break-words whitespace-normal",children:o})]})}const I=({tier:t,xp:i,xpPercent:a,remainingXp:s,nextTierPercent:o,leveledUp:n,lang:l="en"})=>{const x=["Explorer","Builder","Architect"].indexOf(t),r=x===-1?0:x,u=o??0,h=100/3,f=r>=2?100:r*h+u/100*h;return e.jsxs("div",{className:"w-full p-6 rounded-3xl bg-gradient-to-br from-white/90 via-indigo-50/40 to-slate-100/60 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 shadow-[0_8px_24px_rgba(15,23,42,0.18)] backdrop-blur-md transition-all text-center",children:[e.jsx("h3",{className:"text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 text-center",children:l==="gr"?"Πρόοδος XP":"XP Progress"}),e.jsx("div",{className:`
            inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold mb-4
            bg-gradient-to-r from-[#8A57FF]/30 via-[#4ACBFF]/30 to-[#FF67D2]/30 dark:from-[#8A57FF]/20 dark:via-[#4ACBFF]/20 dark:to-[#FF67D2]/20 border border-white/30 backdrop-blur-md
            ring-2 ring-[#8A57FF]/50 dark:ring-[#8A57FF]/70
            shadow-[0_0_14px_rgba(138,87,255,0.55)]
            animate-[pulseGlow_2.4s_ease-in-out_infinite]
            mx-auto justify-center
        `,children:e.jsx("span",{className:"text-slate-900 dark:text-white",children:l==="gr"?t==="Explorer"?"Εξερευνητής":t==="Builder"?"Δημιουργός":t==="Architect"?"Αρχιτέκτονας":"Εξερευνητής":t||"Explorer"})}),e.jsx("p",{className:"text-slate-900 dark:text-slate-100 font-bold text-xl mb-1",children:l==="gr"?`${i} Μόρια XP`:`${i} XP`}),e.jsx("p",{className:"text-xs font-semibold text-[#8A57FF] dark:text-[#B799FF]",children:l==="gr"?`${a??0}% προς το επόμενο επίπεδο`:`${a??0}% toward next tier`}),e.jsx("p",{className:"text-[12px] text-slate-700 dark:text-slate-300 mt-1 leading-relaxed",children:l==="gr"?t==="Explorer"?"Χτίζεις τα θεμέλια της ταυτότητάς σου στο Web3.":t==="Builder"?"Σχεδιάζεις και εφαρμόζεις μηχανισμούς διακυβέρνησης.":t==="Architect"?"Καθορίζεις τους κανόνες και την αρχιτεκτονική του DAO.":"Ξεκινάς το ταξίδι σου στο Web3.":t==="Explorer"?"You are building your Web3 identity foundations.":t==="Builder"?"You design and apply governance mechanisms.":t==="Architect"?"You define DAO architecture and systemic rules.":"You are beginning your Web3 journey."}),e.jsx("div",{className:"w-full h-2 bg-slate-300/70 dark:bg-white/20 rounded-full overflow-hidden mt-2",children:e.jsxs("div",{className:"relative h-full transition-all duration-700 ease-out",style:{width:`${f}%`},children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-r from-[#7F3DF1] to-[#33D6FF]"}),e.jsx("div",{className:"absolute inset-0 bg-white/30 blur-[2px] opacity-50"})]})}),e.jsxs("div",{className:"relative w-full flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1 px-1",children:[e.jsx("span",{children:l==="gr"?"Εξερευνητής":"Explorer"}),e.jsx("span",{children:l==="gr"?"Δημιουργός":"Builder"}),e.jsx("span",{children:l==="gr"?"Αρχιτέκτονας":"Architect"})]}),e.jsx("p",{className:"text-sm font-medium text-[#4ACBFF] dark:text-[#7FD8FF] mt-3",children:s>0?l==="gr"?`Απομένουν ${s} Μόρια XP για να ξεκλειδώσεις το επόμενο επίπεδο.`:`${s} XP remaining to unlock the next tier.`:l==="gr"?"Έχεις ξεκλειδώσει το ανώτατο επίπεδο.":"You have unlocked the highest tier."})]})},D=({timeline:t=[],lang:i="en"})=>{const[a,s]=m.useState("all"),o={en:{title:"📈 Learning Timeline",all:"All",lab:"Labs",lesson:"Lessons",quiz:"Quizzes",project:"Projects",empty:"No activity recorded yet."},gr:{title:"📈 Χρονολόγιο Μάθησης",all:"Όλα",lab:"Εργαστήρια",lesson:"Μαθήματα",quiz:"Κουίζ",project:"Projects",empty:"Δεν έχει καταγραφεί δραστηριότητα ακόμη."}},n=o[i]||o.en,l=[{id:"all",label:n.all},{id:"lab",label:n.lab},{id:"lesson",label:n.lesson},{id:"quiz",label:n.quiz},{id:"project",label:n.project}],p=a==="all"?t:t.filter(r=>r.type===a),x=r=>{if(!r)return"—";try{return new Date(r).toLocaleString(i==="gr"?"el-GR":"en-US")}catch{return r}};return e.jsxs("div",{className:`rounded-2xl border border-slate-200/70 dark:border-slate-700/60
                        bg-white/80 dark:bg-slate-900/60 p-6 shadow-sm`,children:[e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4",children:[e.jsx("h3",{className:"text-xl font-semibold",children:n.title}),e.jsx("div",{className:"flex gap-2",children:l.map(r=>e.jsx("button",{onClick:()=>s(r.id),className:`px-3 py-1.5 rounded-full text-sm font-medium transition
                                ${a===r.id?"bg-indigo-600 text-white":"bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"}`,children:r.label},r.id))})]}),p.length===0?e.jsx("p",{className:"text-sm text-slate-500 dark:text-slate-400",children:n.empty}):e.jsx("ul",{className:"space-y-6",children:p.map((r,u)=>e.jsxs("li",{className:"flex gap-4",children:[e.jsxs("div",{className:"flex-shrink-0 mt-1",children:[r.type==="lab"&&e.jsx("span",{children:"🧪"}),r.type==="lesson"&&e.jsx("span",{children:"📘"}),r.type==="quiz"&&e.jsx("span",{children:"📝"}),r.type==="project"&&e.jsx("span",{children:"🧾"})]}),e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"flex items-center justify-between gap-4",children:[e.jsx("h4",{className:"font-semibold",children:typeof r.title=="string"?r.title:r.title?.[i]||r.title?.en}),e.jsx("span",{className:"text-xs text-slate-500",children:x(r.completedAt)})]}),e.jsxs("div",{className:"flex items-center gap-3 mt-1 text-sm text-slate-600 dark:text-slate-300",children:[r.xp?e.jsxs("span",{children:["+",r.xp," XP"]}):null,r.badge?e.jsxs("span",{className:`px-2 py-0.5 rounded-full text-xs
                                                         bg-indigo-100 text-indigo-700
                                                         dark:bg-indigo-900/40 dark:text-indigo-300`,children:["🏅 ",r.badge]}):null]})]})]},`${r.type}-${r.id}-${u}`))})]})};function R({metadata:t,tokenId:i,wallet:a,lang:s="en"}){const{name:o,image:n,attributes:l=[],role:p,specialization:x,speciality:r,avatar:u,pfp:h}=t||{},f=l.find(d=>(d.trait_type||"").toLowerCase()==="role")?.value||p,w=l.find(d=>["specialization","speciality"].includes((d.trait_type||"").toLowerCase()))?.value||x||r,k=l.find(d=>(d.trait_type||"").toLowerCase()==="founder")?.value===!0,c=n||u||h,y=a?`${a.slice(0,6)}...${a.slice(-4)}`:"",[N,F]=m.useState(!1),[b,_]=m.useState(!1);m.useEffect(()=>F(!0),[]);const j=t?.tier||"Explorer",A=j==="Architect"?"shadow-[0_0_25px_rgba(255,215,0,0.35)]":j==="Builder"?"shadow-[0_0_22px_rgba(0,200,255,0.25)]":"shadow-[0_0_18px_rgba(168,85,247,0.20)]";return e.jsx("div",{className:`
            relative mx-auto max-w-md
            rounded-3xl p-[2px]
            bg-gradient-to-r from-purple-700 via-purple-500 to-purple-700
            shadow-[0_0_12px_rgba(88,28,135,0.22)]
            transition-all duration-500 ${A}
            ${N?"opacity-100 translate-x-0":"opacity-0 -translate-x-6"}
            my-10
        `,children:e.jsxs("div",{className:`
                    bg-white dark:bg-gray-900
                    rounded-3xl p-6
                    shadow-xl backdrop-blur-xl
                    border border-gray-800/40 dark:border-gray-600/30
                `,children:[e.jsx("div",{className:"text-center mb-3",children:e.jsx("span",{className:`
                            text-xs tracking-widest font-semibold
                            text-purple-400 uppercase
                        `,children:s==="gr"?"◆ Ταυτότητα Web3Edu ◆":"◆ Web3Edu Identity ◆"})}),e.jsxs("div",{className:"flex flex-col items-center mt-2",children:[(()=>{let d=v;return c&&(typeof c=="string"&&c.startsWith("ipfs://")?d=`https://gateway.pinata.cloud/ipfs/${c.replace("ipfs://","")}`:typeof c=="string"&&c.includes("/ipfs/")?d=`https://gateway.pinata.cloud/ipfs/${c.split("/ipfs/")[1]}`:d=c),e.jsx("img",{src:d,alt:s==="gr"?"Avatar Ιδρυτή":"Founder Avatar",className:`
                                    w-32 h-32 rounded-full object-cover
                                    ring-[2.5px] ring-purple-500/40
                                    shadow-[0_0_4px_rgba(168,85,247,0.18)]
                                    transition-all duration-500
                                    hover:shadow-[0_0_8px_rgba(168,85,247,0.28)]
                                `,onError:g=>{g.target.src=v}})})(),k&&e.jsx("div",{className:`
                                mt-4 relative inline-flex items-center
                                px-6 py-2 rounded-lg
                                bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600
                                border border-fuchsia-300/60
                                shadow-[0_3px_10px_rgba(236,72,153,0.25)]
                                before:content-[''] before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2
                                before:w-3 before:h-3 before:bg-gradient-to-br before:from-fuchsia-500 before:to-purple-500
                                before:rotate-45 before:rounded-sm
                                after:content-[''] after:absolute after:-right-3 after:top-1/2 after:-translate-y-1/2
                                after:w-3 after:h-3 after:bg-gradient-to-br after:from-indigo-500 after:to-purple-500
                                after:rotate-45 after:rounded-sm
                            `,children:e.jsxs("span",{className:"text-white font-bold tracking-wide flex items-center gap-2",children:["✨ ",s==="gr"?"Έκδοση Ιδρυτή":"Founder Edition"," ✨"]})}),e.jsx("h2",{className:`
                            mt-3 text-[1.9rem] font-bold tracking-wide
                            text-gray-900 dark:text-white
                        `,children:o||t?.name||t?.displayName||a||"Web3Edu Identity"}),e.jsxs("div",{className:"mt-3 flex flex-wrap justify-center gap-2",children:[t?.xp!==void 0&&e.jsxs("span",{className:"px-3 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-semibold",children:["XP: ",t.xp]}),t?.tier&&e.jsx("span",{className:"px-3 py-1 text-xs rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-semibold",children:s==="gr"?`Επίπεδο: ${t.tier}`:`Tier: ${t.tier}`}),t?.edition&&e.jsx("span",{className:"px-3 py-1 text-xs rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-700 dark:text-fuchsia-300 font-semibold",children:t.edition})]})]}),e.jsxs("div",{className:"mt-7 space-y-3 text-center",children:[e.jsxs("div",{className:"text-gray-700 dark:text-gray-300 text-sm",children:[e.jsx("strong",{className:"text-purple-500",children:s==="gr"?"Ρόλος:":"Role:"})," ",f||"—"]}),e.jsxs("div",{className:"text-gray-700 dark:text-gray-300 text-sm",children:[e.jsx("strong",{className:"text-purple-500",children:s==="gr"?"Ειδίκευση:":"Specialization:"})," ",w||"—"]}),e.jsxs("div",{className:"text-gray-700 dark:text-gray-300 text-sm",children:[e.jsx("strong",{className:"text-purple-500",children:s==="gr"?"Πορτοφόλι:":"Wallet:"})," ",y]}),e.jsxs("div",{className:"text-gray-700 dark:text-gray-300 text-sm",children:[e.jsx("strong",{className:"text-purple-500",children:s==="gr"?"ID Διακριτικού:":"Token ID:"})," #",i]}),e.jsx("a",{href:`https://blockexplorer.dimikog.org/token/0xdde6a59445538ea146a17dd8745e7ea5288b1a31/instance/${i}`,target:"_blank",rel:"noopener noreferrer",className:`
                            text-purple-600 dark:text-purple-400 
                            underline text-sm hover:text-purple-300 
                            transition-all
                        `,children:s==="gr"?"Προβολή στο Blockscout →":"View on Blockscout →"}),e.jsx("div",{className:"mt-4 flex justify-center",children:e.jsx("button",{onClick:()=>_(!b),className:`
                                px-5 py-1.5 rounded-full text-sm font-semibold
                                bg-gradient-to-r from-purple-700 to-fuchsia-600
                                text-white shadow-md hover:shadow-lg
                                transition-all duration-300 hover:scale-105
                            `,children:b?s==="gr"?"Απόκρυψη QR":"Hide QR":s==="gr"?"Εμφάνιση QR":"Show QR"})}),b&&e.jsx("div",{className:`
                                mt-4 p-4 rounded-2xl 
                                bg-gray-100 dark:bg-gray-800
                                shadow-inner border border-purple-400/25
                                flex justify-center
                                transition-all duration-500
                                animate-[slideDownFade_0.45s_ease-out]
                            `,children:e.jsx(S,{value:`https://web3edu.dimikog.org/verify/${a}`,size:128,bgColor:"transparent",fgColor:"#a855f7"})})]}),e.jsxs("div",{className:`
                    mt-6 flex items-center justify-center gap-2 
                    text-gray-600 dark:text-gray-400
                    text-sm
                `,children:[e.jsx(C,{className:"w-5 h-5 text-purple-400"}),e.jsx("span",{children:s==="gr"?"Soulbound • Μη μεταβιβάσιμο":"Soulbound • Non Transferable"})]})]})})}function T({lang:t="en"}){const[i,a]=m.useState(()=>{try{return localStorage.getItem("web3edu-pilot-banner-collapsed")==="true"}catch{return!1}}),s=()=>{a(!0);try{localStorage.setItem("web3edu-pilot-banner-collapsed","true")}catch{}};return e.jsx("div",{className:"relative z-10 w-full max-w-6xl mx-auto mb-8 px-2 md:px-0 animate-[fadeSlideUp_0.5s_ease-out]",children:i?e.jsxs("div",{className:`flex items-center justify-between gap-4
          px-4 py-2 rounded-xl
          bg-fuchsia-100/70 dark:bg-fuchsia-900/30
          border border-fuchsia-300/40 dark:border-fuchsia-700/40`,children:[e.jsxs("span",{className:"font-semibold text-sm text-fuchsia-700 dark:text-fuchsia-300",children:["🚀 ",t==="gr"?"Πιλοτικός Χρήστης":"Pilot User"]}),e.jsx("a",{href:"https://teams.microsoft.com/l/team/19%3Apwj5b5f8p7xMSvMQLth7ewFU5-aSEeowtClTZHt9Zqg1%40thread.tacv2/conversations?groupId=e5ff2c9e-34e6-4d42-9246-88b9de4fd760&tenantId=0c8943ee-c370-4bb3-ba51-321f406f32ec",target:"_blank",rel:"noreferrer",className:"text-sm font-semibold text-fuchsia-600 dark:text-fuchsia-400 hover:underline",children:t==="gr"?"Συζήτηση μαθήματος →":"Course discussion →"})]}):e.jsxs("div",{className:`relative overflow-hidden rounded-2xl
          border border-fuchsia-300/30 dark:border-fuchsia-700/30
          bg-gradient-to-br
            from-white/95 via-fuchsia-50/70 to-slate-100/90
            dark:from-[#16081f]/90 dark:via-[#1a0f21]/85 dark:to-[#0c0814]/90
          backdrop-blur-xl shadow-xl`,children:[e.jsxs("div",{className:"absolute inset-0 pointer-events-none",children:[e.jsx("div",{className:"absolute -top-20 -left-20 w-64 h-64 bg-fuchsia-500/25 blur-[120px]"}),e.jsx("div",{className:"absolute -bottom-24 right-10 w-72 h-72 bg-purple-500/20 blur-[140px]"})]}),e.jsxs("div",{className:"relative p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6",children:[e.jsxs("div",{className:"flex items-start gap-4",children:[e.jsx("div",{className:`flex-shrink-0 w-12 h-12 rounded-xl
                bg-gradient-to-br from-fuchsia-500 to-purple-500
                flex items-center justify-center shadow-md`,children:e.jsx("span",{className:"text-2xl",children:"🚀"})}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("h3",{className:"text-lg font-bold text-slate-900 dark:text-white",children:t==="gr"?"Είσαι Πιλοτικός Χρήστης":"You’re a Pilot User"}),e.jsx("p",{className:"text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl",children:t==="gr"?"Συμμετέχεις στην πιλοτική φάση του Web3Edu. Τα σχόλια και οι παρατηρήσεις σου βοηθούν άμεσα στη βελτίωση της πλατφόρμας.":"You are participating in the pilot phase of Web3Edu. Your feedback directly helps shape and improve the platform."}),e.jsx("a",{href:"https://teams.microsoft.com/l/team/19%3Apwj5b5f8p7xMSvMQLth7ewFU5-aSEeowtClTZHt9Zqg1%40thread.tacv2/conversations?groupId=e5ff2c9e-34e6-4d42-9246-88b9de4fd760&tenantId=0c8943ee-c370-4bb3-ba51-321f406f32ec",target:"_blank",rel:"noreferrer",className:`inline-flex items-center gap-2 text-sm font-semibold
                    text-fuchsia-600 dark:text-fuchsia-400
                    hover:underline mt-1`,children:t==="gr"?"💬 Συμμετοχή στη συζήτηση του μαθήματος (Microsoft Teams)":"💬 Join the course discussion (Microsoft Teams)"})]})]}),e.jsx("button",{onClick:s,className:`self-start md:self-center
                px-4 py-2 rounded-xl text-sm font-semibold
                bg-white/60 dark:bg-white/10
                border border-slate-300/40 dark:border-white/10
                text-slate-700 dark:text-slate-200
                hover:bg-white/80 dark:hover:bg-white/20
                transition`,children:t==="gr"?"Εντάξει":"Got it"})]})]})})}export{B as D,R as I,D as L,T as P,I as X};
