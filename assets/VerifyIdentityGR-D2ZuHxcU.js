import{d as H,r as y,j as e}from"./vendor-react-XZtyZRd7.js";import{s as K,P as Q,g as X,h as z,E as P,B as I,i as S}from"./index-CV0KsBrl.js";function Y(){const{address:i}=H(),[_,j]=y.useState(!0),[F,E]=y.useState(""),[t,L]=y.useState(null);y.useEffect(()=>{if(window.scrollTo(0,0),!i){E("Μη έγκυρη διεύθυνση."),j(!1);return}const n="https://web3edu-api.dimikog.org";j(!0),E("");const o=async d=>{const f=await fetch(d);if(!f.ok)throw new Error(`HTTP ${f.status}`);return f.json()};Promise.allSettled([o(`${n}/web3sbt/verify/${i}`),o(`${n}/web3sbt/resolve/${i}`)]).then(([d,f])=>{const h=d.status==="fulfilled"?d.value:null,u=f.status==="fulfilled"?f.value:null;if(!h&&!u)throw new Error("Both verify and resolve failed.");const W=l=>l?.metadata?.metadata&&typeof l.metadata.metadata=="object"?l.metadata.metadata:l?.metadata&&typeof l.metadata=="object"?l.metadata:{},M=l=>l?.profile?.metadata&&typeof l.profile.metadata=="object"?l.profile.metadata:l?.profile&&typeof l.profile=="object"?l.profile:{},q={...h||{},...u||{},metadata:{...W(h),...W(u)},profile:{...M(h),...M(u)},tokenId:h?.tokenId??h?.token_id??u?.tokenId??u?.token_id??null};L(q),j(!1)}).catch(d=>{console.error("Verify page error:",d),E("Αδυναμία φόρτωσης των δεδομένων SBT."),j(!1)})},[i]);const g=t?.metadata??{},w=t?.profile??{},r=g?.metadata&&typeof g.metadata=="object"?g.metadata:g,s=w?.metadata&&typeof w.metadata=="object"?w.metadata:w,p=(...n)=>{for(const o of n)if(o!=null&&o!=="")return o;return null},c=n=>{if(typeof n=="number"&&Number.isFinite(n))return n;if(typeof n=="string"){const o=Number.parseFloat(n.replace(/[^\d.-]/g,""));if(Number.isFinite(o))return o}return null},O=(r.founder??s.founder)||!1,v=r.edition??s.edition??(O?"Founder Edition":null),a=r.tier??s.tier??"Explorer",x=c(p(r.xp,r.xp_total,r.totalXp,r.total_xp,s.xp,s.xp_total,s.totalXp,s.total_xp,t?.xp,t?.xp_total,t?.totalXp,t?.total_xp,t?.metadata?.xp,t?.metadata?.xp_total,t?.metadata?.totalXp,t?.metadata?.total_xp,t?.profile?.xp,t?.profile?.xp_total,t?.profile?.totalXp,t?.profile?.total_xp))??0,k=c(p(r.xpPercent,r.xp_percent,r.progress,r.progressPercent,r.progress_percent,r.nextTierPercent,r.next_tier_percent,r.completionPercent,r.completion_percent,s.xpPercent,s.xp_percent,s.progress,s.progressPercent,s.progress_percent,s.nextTierPercent,s.next_tier_percent,s.completionPercent,s.completion_percent,t?.xpPercent,t?.xp_percent,t?.progress,t?.progressPercent,t?.progress_percent,t?.nextTierPercent,t?.next_tier_percent,t?.completionPercent,t?.completion_percent))??0,C=c(p(r.remainingXp,r.remaining_xp,s.remainingXp,s.remaining_xp,t?.remainingXp,t?.remaining_xp,t?.metadata?.remainingXp,t?.metadata?.remaining_xp)),R=k>0&&k<=1?k*100:k;let m=Math.max(0,Math.min(100,R));m<=0&&x>0&&(C!==null&&C>=0?m=Math.max(1,Math.min(100,x/(x+C)*100)):(m=Math.max(1,Math.min(100,x/6e3*100)),a==="Architect"&&(m=Math.max(m,85))));const U=Math.max(0,Math.min(100,x/7e3*100)),A=Math.max(m,U),B=p(r.timeline,s.timeline,t?.timeline,t?.metadata?.timeline,t?.profile?.timeline),$=Array.isArray(B)?B.filter(n=>{const o=String(n?.status||"").toLowerCase(),d=c(n?.progress)??0;return n?.type==="lab"&&(n?.completed===!0||n?.done===!0||n?.verified===!0||!!n?.completedAt||["completed","done","claimed","verified"].includes(o)||d>=100)}).length:null,b=p(r.builderChecklist,s.builderChecklist,t?.builderChecklist,t?.metadata?.builderChecklist),G=b?(c(b?.coreLabs?.completed)??0)+(c(b?.daoLabs?.completed)??0)+(b?.proofOfEscape?.done||b?.proofOfEscape?.completed?1:0):null,V=c(p(r.lessonsCompleted,r.lessons_completed,r.completedLessons,r.completed_lessons,s.lessonsCompleted,s.lessons_completed,s.completedLessons,s.completed_lessons,t?.lessonsCompleted,t?.lessons_completed,t?.completedLessons,t?.completed_lessons,t?.metadata?.lessonsCompleted,t?.metadata?.lessons_completed,t?.profile?.lessonsCompleted,t?.profile?.lessons_completed,G,$))??0,N=window.location.href,D=t?.tokenId??null,T=i?K(i):"";return e.jsx(Q,{children:e.jsxs("div",{className:`
        min-h-screen 
        flex flex-col items-center 
        px-4 sm:px-6 py-20
        relative

        /* OFFICIAL WEB3EDU LIGHT GRADIENT */
        bg-gradient-to-br 
            from-[#f5f0ff]
            via-[#f0f3ff]
            to-[#eaf1ff]
        text-[#1e1e2d]

        /* OFFICIAL WEB3EDU DARK GRADIENT */
        dark:bg-gradient-to-br
            dark:from-[#070b18]
            dark:via-[#0b0f22]
            dark:to-[#060912]
        dark:text-white

        transition-colors duration-300
    `,children:[e.jsx("div",{className:"absolute top-0 left-0 w-full text-center py-2 bg-blue-900/40 text-[#e1e8ff] text-xs tracking-widest z-20 border-b border-blue-700/40",children:"ΛΕΙΤΟΥΡΓΙΑ ΕΠΑΛΗΘΕΥΣΗΣ"}),e.jsxs("div",{className:"absolute inset-0 pointer-events-none",children:[e.jsx("div",{className:"absolute top-[15%] left-[35%] w-[420px] h-[420px] bg-[#7F3DF1]/15 blur-[180px] rounded-full"}),e.jsx("div",{className:"absolute bottom-[10%] right-[20%] w-[360px] h-[360px] bg-[#33D6FF]/12 blur-[160px] rounded-full"})]}),e.jsxs("div",{className:"relative z-10 mb-10 text-center max-w-3xl",children:[e.jsx("div",{className:`
        absolute inset-0 
        bg-white/50 dark:bg-white/5 
        backdrop-blur-sm 
        rounded-2xl 
        -z-10 
    `}),e.jsx("h1",{className:`
    text-4xl sm:text-5xl 
    font-extrabold 
    tracking-tight 
    text-[#6f31d7]               /* Web3Edu purple */
    dark:text-[#9f80ff]          /* Softer purple in dark */
    drop-shadow-sm
`,children:"Επαλήθευση Ταυτότητας Web3Edu"}),e.jsx("p",{className:`
        mt-3 
        text-[#4a4a63] dark:text-slate-300
        text-sm sm:text-base 
        tracking-wide
    `,children:"Δημόσια επαλήθευση ενός Soulbound Web3Edu Identity Token."})]}),_&&e.jsx("p",{className:"relative z-10 text-slate-600 dark:text-slate-200",children:"Φόρτωση ταυτότητας…"}),F&&!_&&e.jsx("p",{className:"relative z-10 text-red-500 dark:text-red-300",children:F}),!_&&!F&&t&&e.jsxs("div",{className:`
        relative z-10 max-w-5xl w-full
        print:p-0 print:shadow-none print:bg-white print:text-black print:border-none
        rounded-3xl border border-white/60 bg-white/95
        shadow-[0_24px_60px_rgba(15,23,42,0.30)] hover:shadow-[0_28px_80px_rgba(15,23,42,0.38)] transition-shadow duration-300
        animate-[fadeIn_0.6s_ease]
        dark:border-teal-200/25
        dark:bg-gradient-to-br dark:from-[#020617] dark:via-[#020617] dark:to-[#020617]
        p-4 sm:p-6 md:p-10
        overflow-hidden
    `,children:[e.jsxs("div",{className:"relative md:hidden block rounded-xl border border-white/20 bg-[#0e1422] p-4 mx-auto w-full shadow-lg",children:[e.jsx("div",{className:"absolute top-2 right-2 w-10 h-10 opacity-70 pointer-events-none",children:e.jsxs("svg",{viewBox:"0 0 120 120",className:"w-full h-full",children:[e.jsxs("defs",{children:[e.jsxs("radialGradient",{id:"mSealInner",cx:"50%",cy:"35%",r:"60%",children:[e.jsx("stop",{offset:"0%",stopColor:"#e5f4ff",stopOpacity:"0.95"}),e.jsx("stop",{offset:"45%",stopColor:"#1f2937",stopOpacity:"0.9"}),e.jsx("stop",{offset:"100%",stopColor:"#020617",stopOpacity:"1"})]}),e.jsxs("linearGradient",{id:"mSealRing",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"#38bdf8"}),e.jsx("stop",{offset:"45%",stopColor:"#6366f1"}),e.jsx("stop",{offset:"100%",stopColor:"#fbbf24"})]}),e.jsx("path",{id:"mSealCirclePath",d:"M60,10 a50,50 0 1,1 0,100 a50,50 0 1,1 0,-100"})]}),e.jsx("circle",{cx:"60",cy:"60",r:"52",fill:"none",stroke:"url(#mSealRing)",strokeWidth:"4",strokeDasharray:"2 5",opacity:"0.9"}),e.jsx("circle",{cx:"60",cy:"60",r:"40",fill:"url(#mSealInner)",stroke:"rgba(255,255,255,0.28)",strokeWidth:"1.5"}),e.jsx("text",{fontSize:"6",letterSpacing:"6",fill:"rgba(0,0,0,0.55)",children:e.jsx("textPath",{href:"#mSealCirclePath",startOffset:"50%",textAnchor:"middle",children:"ΕΠΑΛΗΘΕΥΜΕΝΟ • WEB3EDU • ΕΠΑΛΗΘΕΥΜΕΝΟ • WEB3EDU •"})}),e.jsx("g",{transform:"translate(60 60)",children:e.jsx("path",{d:"M0 -18 L9 -12 V0 C9 7 4.5 14 0 15 C-4.5 14 -9 7 -9 0 V-12 Z",fill:"#38bdf8",opacity:"0.96"})})]})}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-14 h-14 rounded-full flex items-center justify-center",style:X(i,a),children:e.jsx(z,{address:i})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-white/40 uppercase tracking-wider",children:"Ταυτότητα Soulbound"}),e.jsx("p",{className:"text-base font-semibold text-white",children:s?.name??"Ταυτότητα Web3Edu"}),e.jsx("p",{className:"text-[10px] text-white/50 font-mono",children:T})]})]}),e.jsxs("div",{className:"mt-3",children:[e.jsx("p",{className:"text-[10px] text-white/40 uppercase",children:"Επίπεδο"}),e.jsxs("p",{className:"text-sm font-semibold flex items-center gap-1",children:[a==="Explorer"&&e.jsx(P,{}),a==="Builder"&&e.jsx(I,{}),a==="Architect"&&e.jsx(S,{}),a]})]}),e.jsxs("div",{className:"mt-3",children:[e.jsx("p",{className:"text-[10px] text-white/40 uppercase",children:"Πρόοδος XP"}),e.jsx("div",{className:"w-full h-1.5 rounded-full bg-white/10 overflow-hidden",children:e.jsx("div",{className:"h-full bg-gradient-to-r from-[#7F3DF1] to-[#33D6FF]",style:{width:`${A}%`}})})]}),e.jsxs("div",{className:"mt-3",children:[e.jsx("p",{className:"text-[10px] text-white/40 uppercase",children:"Token ID"}),e.jsx("p",{className:"text-xs font-mono",children:D!==null?D:"Κανένα"})]}),e.jsx("div",{className:"mt-4",children:N&&e.jsxs(e.Fragment,{children:[e.jsx("img",{src:`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(N)}&size=100x100`,alt:"QR",className:"rounded-lg border border-white/20 bg-white/5 p-1 mx-auto",loading:"lazy"}),e.jsx("p",{className:"text-center text-[10px] text-white/50 mt-2",children:"Σάρωση για επαλήθευση"})]})})]}),e.jsxs("div",{className:"hidden md:block",children:[e.jsx("div",{className:`
    pointer-events-none absolute inset-0 flex items-center justify-center
    -translate-y-8
`,children:"ΔΗΜΟΣΙΑ ΕΠΑΛΗΘΕΥΣΗ"}),e.jsx("div",{className:"pointer-events-none absolute inset-x-0 top-1/2 h-20 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-40 blur-xl"}),e.jsxs("div",{className:`relative flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-8
                max-w-3xl mx-auto w-full`,children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("div",{className:"relative w-20 h-20 rounded-full flex items-center justify-center shadow-2xl "+(a==="Architect"?"animate-pulse":a==="Builder"?"ring-2 ring-[#33D6FF]/70":"ring-2 ring-[#7F3DF1]/60"),style:X(i,a),children:[e.jsx(z,{address:i}),e.jsxs("span",{className:"absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-black/60 border border-white/40 flex items-center justify-center",children:[a==="Explorer"&&e.jsx(P,{}),a==="Builder"&&e.jsx(I,{}),a==="Architect"&&e.jsx(S,{})]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-white/50",children:"Ταυτότητα Soulbound"}),e.jsx("p",{className:"text-xl font-semibold mt-1 text-slate-900 dark:text-white",children:s.name??"Web3Edu Identity SBT"}),e.jsxs("p",{className:"text-xs text-slate-500 dark:text-white/60 mt-1",children:["Διεύθυνση: ",e.jsx("span",{className:"font-mono",children:T})]}),v&&e.jsx("span",{className:`mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold
                                                           bg-gradient-to-r from-[#7F3DF1] via-[#9A5CFF] to-[#FF6FD8]
                                                           text-white shadow-sm`,children:v})]})]}),a&&e.jsxs("div",{className:"flex flex-col items-center md:items-end gap-2",children:[e.jsxs("span",{className:"px-3 py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md "+(a==="Architect"?"bg-amber-100/90 border-amber-300/70 dark:bg-yellow-300/20 dark:border-yellow-300/40":"bg-slate-100 border-slate-200 dark:bg-white/10 dark:border-white/20"),children:[a==="Explorer"&&e.jsx(P,{}),a==="Builder"&&e.jsx(I,{}),a==="Architect"&&e.jsx(S,{}),a]}),e.jsxs("p",{className:"text-xs text-slate-500 dark:text-white/60",children:["XP: ",x," • Μαθήματα: ",V]})]})]}),e.jsx("div",{className:"mt-6 relative",children:e.jsxs("div",{className:`
    relative rounded-3xl 
    border border-slate-300/30 
    bg-gradient-to-br
    max-w-4xl mx-auto w-full
    text-slate-800 dark:text-slate-200
    px-10 py-10 
    shadow-[0_18px_50px_rgba(15,23,42,0.45)]
`,children:[e.jsx("div",{className:`
      pointer-events-none absolute inset-x-0 top-4
      flex items-center justify-center select-none
      text-[48px] font-extrabold tracking-widest
      text-[#7F3DF1]/15
      dark:text-[#7F3DF1]/12
  `,children:"ΕΠΑΛΗΘΕΥΜΕΝΟ"}),e.jsxs("div",{className:"relative grid grid-cols-1 lg:grid-cols-2 gap-10",children:[e.jsxs("div",{className:"space-y-4 text-sm",children:[e.jsx("p",{className:"font-semibold tracking-wide text-xs text-[#6f31d7] dark:text-[#bfa6ff] uppercase",children:"ΣΤΟΙΧΕΙΑ ΤΑΥΤΟΤΗΤΑΣ"}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-semibold uppercase text-slate-600 dark:text-slate-300",children:"ΟΝΟΜΑ"}),e.jsx("p",{className:"font-semibold text-slate-900 dark:text-white text-2xl",children:s?.name??"Web3Edu Identity SBT"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-semibold uppercase text-slate-600 dark:text-slate-300",children:"ΠΡΟΤΥΠΟ Token"}),e.jsx("p",{className:"font-medium text-base",children:"ERC-721 SBT"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-semibold uppercase text-slate-600 dark:text-slate-300",children:"ΠΟΡΤΟΦΟΛΙ"}),e.jsx("p",{className:"font-mono text-xs break-all",children:i})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-semibold uppercase text-slate-600 dark:text-slate-300",children:"Token ID"}),e.jsx("p",{className:"font-mono text-sm",children:D??"Κανένα"})]}),v&&e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-semibold uppercase text-slate-600 dark:text-slate-300",children:"ΕΚΔΟΣΗ"}),e.jsx("p",{className:"font-medium text-[#7F3DF1] dark:text-[#c4b2ff] text-base",children:v})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-semibold uppercase text-slate-600 dark:text-slate-300mb-1",children:"ΠΡΟΟΔΟΣ XP"}),e.jsx("div",{className:"w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden",children:e.jsx("div",{className:"h-full bg-gradient-to-r from-[#7F3DF1] to-[#33D6FF]",style:{width:`${A}%`}})}),e.jsxs("p",{className:"text-sm mt-1",children:[x," XP"]})]})]}),e.jsxs("div",{className:"relative z-10 flex flex-col items-center gap-6 mt-2 pt-4",children:[e.jsx("div",{className:`
        w-48 h-48 flex items-center justify-center
        drop-shadow-[0_8px_25px_rgba(127,61,241,0.28)]
        transition-transform duration-300 
        hover:scale-[1.04]
    `,children:e.jsxs("svg",{viewBox:"0 0 120 120",className:"w-full h-full drop-shadow-xl",children:[e.jsxs("defs",{children:[e.jsxs("radialGradient",{id:"sealInner",cx:"50%",cy:"35%",r:"60%",children:[e.jsx("stop",{offset:"0%",stopColor:"#e5f4ff",stopOpacity:"0.95"}),e.jsx("stop",{offset:"45%",stopColor:"#1f2937",stopOpacity:"0.9"}),e.jsx("stop",{offset:"100%",stopColor:"#020617",stopOpacity:"1"})]}),e.jsxs("linearGradient",{id:"sealRing",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"#38bdf8"}),e.jsx("stop",{offset:"45%",stopColor:"#6366f1"}),e.jsx("stop",{offset:"100%",stopColor:"#fbbf24"})]}),e.jsx("path",{id:"sealCirclePath",d:"M60,10 a50,50 0 1,1 0,100 a50,50 0 1,1 0,-100"})]}),e.jsx("circle",{cx:"60",cy:"60",r:"52",fill:"none",stroke:"url(#sealRing)",strokeWidth:"4",strokeDasharray:"2 5",opacity:"0.9"}),e.jsx("circle",{cx:"60",cy:"60",r:"40",fill:"url(#sealInner)",stroke:"rgba(255,255,255,0.28)",strokeWidth:"1.5"}),e.jsx("text",{fontSize:"6",letterSpacing:"6",fill:"rgba(0,0,0,0.45)",children:e.jsx("textPath",{href:"#sealCirclePath",startOffset:"50%",textAnchor:"middle",children:"ΕΠΑΛΗΘΕΥΜΕΝΟ • WEB3EDU • ΕΠΑΛΗΘΕΥΜΕΝΟ • WEB3EDU •"})}),e.jsx("g",{transform:"translate(60 60)",children:e.jsx("path",{d:"M0 -18 L9 -12 V0 C9 7 4.5 14 0 15 C-4.5 14 -9 7 -9 0 V-12 Z",fill:"#38bdf8",opacity:"0.95"})})]})}),N&&e.jsxs("div",{className:"flex flex-col items-center mt-4 space-y-3",children:[e.jsx("img",{src:`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(N)}&size=120x120`,alt:"QR",className:`
                    rounded-2xl 
                    border border-slate-300/40 dark:border-white/10 
                    bg-white/90 dark:bg-white/5 
                    p-4 
                    shadow-[0_20px_40px_rgba(0,0,0,0.25)]
                    backdrop-blur-md
                    transition-transform duration-300 
                    hover:scale-[1.06] hover:brightness-110
                `,loading:"lazy"}),e.jsxs("p",{className:"text-[11px] text-slate-500 dark:text-slate-400 leading-tight text-center",children:["Εκδόθηκε στο Web3Edu Edu-Net",e.jsx("br",{}),"ως Soulbound Token"]})]})]})]}),e.jsxs("div",{className:"mt-10 text-center text-sm text-slate-500 dark:text-slate-400 tracking-wide",children:[e.jsxs("p",{children:["Επαληθεύτηκε στις: ",new Date().toISOString()]}),e.jsx("p",{children:"Δίκτυο: Web3Edu Edu-Net (424242)"}),e.jsx("p",{children:"Συμβόλαιο: 0xdDE6A59445538eA146a17Dd8745e7eA5288b1a31"})]}),e.jsx("div",{className:"mt-4 flex justify-center print:hidden",children:e.jsx("button",{onClick:()=>window.print(),className:`
                                        px-4 py-2 text-xs rounded-lg
                                        bg-gradient-to-r from-[#7F3DF1] to-[#33D6FF]
                                        text-white font-medium
                                        shadow-lg hover:shadow-xl hover:brightness-110
                                        transition
                                        active:scale-95 transition-transform
                                    `,children:"Εκτύπωση Επαλήθευσης"})})]})})]})]})]})})}export{Y as default};
