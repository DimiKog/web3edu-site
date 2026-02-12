import{k as F,u as D,r as x,j as e}from"./react-vendor-C3nCzrQE.js";import{s as C,P as S,g as v,c as N,E as f,B as b,e as u}from"./index-oI7KmkbM.js";import"./ui-vendor-CsLUdq9X.js";import"./web3-vendor-DxqyInks.js";function _(){const{address:s}=F();D();const[c,i]=x.useState(!0),[m,p]=x.useState(""),[l,k]=x.useState(null);x.useEffect(()=>{if(window.scrollTo(0,0),!s){p("Invalid address."),i(!1);return}const I="https://web3edu-api.dimikog.org";i(!0),p(""),fetch(`${I}/web3sbt/verify/${s}`).then(a=>{if(!a.ok)throw new Error(`HTTP ${a.status}`);return a.json()}).then(a=>{k(a),i(!1)}).catch(a=>{console.error("Verify page error:",a),p("Could not load SBT data."),i(!1)})},[s]);const r=l?.metadata??{},n=l?.profile??{},y=(r.founder??n.founder)||!1,d=r.edition??n.edition??(y?"Founder Edition":null),t=r.tier??n.tier??"Explorer",j=r.xpPercent??0;r.remainingXp;const E=r.lessonsCompleted??0,g=r.badges??[];Array.isArray(g)&&[...g];const o=`https://web3edu.dimikog.org/#/verify/${s}`,h=l?.tokenId??null,w=s?C(s):"";return e.jsx(S,{children:e.jsxs("div",{className:`
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
    `,children:[e.jsx("div",{className:"absolute top-0 left-0 w-full text-center py-2 bg-blue-900/40 text-[#e1e8ff] text-xs tracking-widest z-20 border-b border-blue-700/40",children:"VERIFICATION MODE"}),e.jsxs("div",{className:"absolute inset-0 pointer-events-none",children:[e.jsx("div",{className:"absolute top-[15%] left-[35%] w-[420px] h-[420px] bg-[#7F3DF1]/15 blur-[180px] rounded-full"}),e.jsx("div",{className:"absolute bottom-[10%] right-[20%] w-[360px] h-[360px] bg-[#33D6FF]/12 blur-[160px] rounded-full"})]}),e.jsxs("div",{className:"relative z-10 mb-10 text-center max-w-3xl",children:[e.jsx("div",{className:`
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
`,children:"Web3Edu Identity Verification"}),e.jsx("p",{className:`
        mt-3 
        text-[#4a4a63] dark:text-slate-300
        text-sm sm:text-base 
        tracking-wide
    `,children:"Public verification of a Soulbound Web3Edu Identity Token."})]}),c&&e.jsx("p",{className:"relative z-10 text-slate-600 dark:text-slate-200",children:"Loading identity…"}),m&&!c&&e.jsx("p",{className:"relative z-10 text-red-500 dark:text-red-300",children:m}),!c&&!m&&l&&e.jsxs("div",{className:`
        relative z-10 max-w-5xl w-full
        print:p-0 print:shadow-none print:bg-white print:text-black print:border-none
        rounded-3xl border border-white/60 bg-white/95
        shadow-[0_24px_60px_rgba(15,23,42,0.30)] hover:shadow-[0_28px_80px_rgba(15,23,42,0.38)] transition-shadow duration-300
        animate-[fadeIn_0.6s_ease]
        dark:border-teal-200/25
        dark:bg-gradient-to-br dark:from-[#020617] dark:via-[#020617] dark:to-[#020617]
        p-4 sm:p-6 md:p-10
        overflow-hidden
    `,children:[e.jsxs("div",{className:"relative md:hidden block rounded-xl border border-white/20 bg-[#0e1422] p-4 mx-auto w-full shadow-lg",children:[e.jsx("div",{className:"absolute top-2 right-2 w-10 h-10 opacity-70 pointer-events-none",children:e.jsxs("svg",{viewBox:"0 0 120 120",className:"w-full h-full",children:[e.jsxs("defs",{children:[e.jsxs("radialGradient",{id:"mSealInner",cx:"50%",cy:"35%",r:"60%",children:[e.jsx("stop",{offset:"0%",stopColor:"#e5f4ff",stopOpacity:"0.95"}),e.jsx("stop",{offset:"45%",stopColor:"#1f2937",stopOpacity:"0.9"}),e.jsx("stop",{offset:"100%",stopColor:"#020617",stopOpacity:"1"})]}),e.jsxs("linearGradient",{id:"mSealRing",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"#38bdf8"}),e.jsx("stop",{offset:"45%",stopColor:"#6366f1"}),e.jsx("stop",{offset:"100%",stopColor:"#fbbf24"})]}),e.jsx("path",{id:"mSealCirclePath",d:"M60,10 a50,50 0 1,1 0,100 a50,50 0 1,1 0,-100"})]}),e.jsx("circle",{cx:"60",cy:"60",r:"52",fill:"none",stroke:"url(#mSealRing)",strokeWidth:"4",strokeDasharray:"2 5",opacity:"0.9"}),e.jsx("circle",{cx:"60",cy:"60",r:"40",fill:"url(#mSealInner)",stroke:"rgba(255,255,255,0.28)",strokeWidth:"1.5"}),e.jsx("text",{fontSize:"6",letterSpacing:"6",fill:"rgba(0,0,0,0.55)",children:e.jsx("textPath",{href:"#mSealCirclePath",startOffset:"50%",textAnchor:"middle",children:"VERIFIED • WEB3EDU • VERIFIED • WEB3EDU •"})}),e.jsx("g",{transform:"translate(60 60)",children:e.jsx("path",{d:"M0 -18 L9 -12 V0 C9 7 4.5 14 0 15 C-4.5 14 -9 7 -9 0 V-12 Z",fill:"#38bdf8",opacity:"0.96"})})]})}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-14 h-14 rounded-full flex items-center justify-center",style:v(s,t),children:e.jsx(N,{address:s})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-white/40 uppercase tracking-wider",children:"Soulbound Identity"}),e.jsx("p",{className:"text-base font-semibold text-white",children:n?.name??"Web3Edu Identity"}),e.jsx("p",{className:"text-[10px] text-white/50 font-mono",children:w})]})]}),e.jsxs("div",{className:"mt-3",children:[e.jsx("p",{className:"text-[10px] text-white/40 uppercase",children:"Tier"}),e.jsxs("p",{className:"text-sm font-semibold flex items-center gap-1",children:[t==="Explorer"&&e.jsx(f,{}),t==="Builder"&&e.jsx(b,{}),t==="Architect"&&e.jsx(u,{}),t]})]}),e.jsxs("div",{className:"mt-3",children:[e.jsx("p",{className:"text-[10px] text-white/40 uppercase",children:"XP Progress"}),e.jsx("div",{className:"w-full h-1.5 rounded-full bg-white/10 overflow-hidden",children:e.jsx("div",{className:"h-full bg-gradient-to-r from-[#7F3DF1] to-[#33D6FF]",style:{width:`${j}%`}})})]}),e.jsxs("div",{className:"mt-3",children:[e.jsx("p",{className:"text-[10px] text-white/40 uppercase",children:"Token ID"}),e.jsx("p",{className:"text-xs font-mono",children:h!==null?h:"None"})]}),e.jsx("div",{className:"mt-4",children:o&&e.jsxs(e.Fragment,{children:[e.jsx("img",{src:`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(o)}&size=100x100`,alt:"QR",className:"rounded-lg border border-white/20 bg-white/5 p-1 mx-auto"}),e.jsx("p",{className:"text-center text-[10px] text-white/50 mt-2",children:"Scan to verify"})]})})]}),e.jsxs("div",{className:"hidden md:block",children:[e.jsx("div",{className:`
    pointer-events-none absolute inset-0 flex items-center justify-center
    -translate-y-8             /* NEW */
`,children:"PUBLIC VERIFICATION"}),e.jsx("div",{className:"pointer-events-none absolute inset-x-0 top-1/2 h-20 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-40 blur-xl"}),e.jsxs("div",{className:`relative flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-8
                max-w-3xl mx-auto w-full`,children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("div",{className:"relative w-20 h-20 rounded-full flex items-center justify-center shadow-2xl "+(t==="Architect"?"animate-pulse":t==="Builder"?"ring-2 ring-[#33D6FF]/70":"ring-2 ring-[#7F3DF1]/60"),style:v(s,t),children:[e.jsx(N,{address:s}),e.jsxs("span",{className:"absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-black/60 border border-white/40 flex items-center justify-center",children:[t==="Explorer"&&e.jsx(f,{}),t==="Builder"&&e.jsx(b,{}),t==="Architect"&&e.jsx(u,{})]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-white/50",children:"Soulbound Identity"}),e.jsx("p",{className:"text-xl font-semibold mt-1 text-slate-900 dark:text-white",children:n.name??"Web3Edu Identity SBT"}),e.jsxs("p",{className:"text-xs text-slate-500 dark:text-white/60 mt-1",children:["Wallet: ",e.jsx("span",{className:"font-mono",children:w})]}),d&&e.jsx("span",{className:`mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold
                                                           bg-gradient-to-r from-[#7F3DF1] via-[#9A5CFF] to-[#FF6FD8]
                                                           text-white shadow-sm`,children:d})]})]}),t&&e.jsxs("div",{className:"flex flex-col items-center md:items-end gap-2",children:[e.jsxs("span",{className:"px-3 py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md "+(t==="Architect"?"bg-amber-100/90 border-amber-300/70 dark:bg-yellow-300/20 dark:border-yellow-300/40":"bg-slate-100 border-slate-200 dark:bg-white/10 dark:border-white/20"),children:[t==="Explorer"&&e.jsx(f,{}),t==="Builder"&&e.jsx(b,{}),t==="Architect"&&e.jsx(u,{}),t]}),e.jsxs("p",{className:"text-xs text-slate-500 dark:text-white/60",children:["XP: ",r.xp??0," • Lessons: ",E]})]})]}),e.jsx("div",{className:"mt-6 relative",children:e.jsxs("div",{className:`
    relative rounded-3xl 
    border border-slate-300/30 
    bg-gradient-to-br
    max-w-4xl mx-auto w-full           /* NEW */
    text-slate-800 dark:text-slate-200
    px-10 py-10 
    shadow-[0_18px_50px_rgba(15,23,42,0.45)]
`,children:[e.jsx("div",{className:`
      pointer-events-none absolute inset-x-0 top-4
      flex items-center justify-center select-none
      text-[48px] font-extrabold tracking-widest
      text-[#7F3DF1]/15
      dark:text-[#7F3DF1]/12
  `,children:"VERIFIED"}),e.jsxs("div",{className:"relative grid grid-cols-1 lg:grid-cols-2 gap-10",children:[e.jsxs("div",{className:"space-y-4 text-sm",children:[e.jsx("p",{className:"font-semibold tracking-wide text-xs text-[#6f31d7] dark:text-[#bfa6ff] uppercase",children:"Identity details"}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-semibold uppercase text-slate-600 dark:text-slate-300",children:"Name"}),e.jsx("p",{className:"font-semibold text-slate-900 dark:text-white text-2xl",children:n?.name??"Web3Edu Identity SBT"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-semibold uppercase text-slate-600 dark:text-slate-300",children:"Token Standard"}),e.jsx("p",{className:"font-medium text-base",children:"ERC-721 SBT"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-semibold uppercase text-slate-600 dark:text-slate-300",children:"Wallet"}),e.jsx("p",{className:"font-mono text-xs break-all",children:s})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-semibold uppercase text-slate-600 dark:text-slate-300",children:"Token ID"}),e.jsx("p",{className:"font-mono text-sm",children:h??"None"})]}),d&&e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-semibold uppercase text-slate-600 dark:text-slate-300",children:"Edition"}),e.jsx("p",{className:"font-medium text-[#7F3DF1] dark:text-[#c4b2ff] text-base",children:d})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-semibold uppercase text-slate-600 dark:text-slate-300mb-1",children:"XP Progress"}),e.jsx("div",{className:"w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden",children:e.jsx("div",{className:"h-full bg-gradient-to-r from-[#7F3DF1] to-[#33D6FF]",style:{width:`${j}%`}})}),e.jsxs("p",{className:"text-sm mt-1",children:[l.profile?.xp??0," XP"]})]})]}),e.jsxs("div",{className:"relative z-10 flex flex-col items-center gap-6 mt-2 pt-4",children:[e.jsx("div",{className:`
        w-48 h-48 flex items-center justify-center
        drop-shadow-[0_8px_25px_rgba(127,61,241,0.28)]
        transition-transform duration-300 
        hover:scale-[1.04]
    `,children:e.jsxs("svg",{viewBox:"0 0 120 120",className:"w-full h-full drop-shadow-xl",children:[e.jsxs("defs",{children:[e.jsxs("radialGradient",{id:"sealInner",cx:"50%",cy:"35%",r:"60%",children:[e.jsx("stop",{offset:"0%",stopColor:"#e5f4ff",stopOpacity:"0.95"}),e.jsx("stop",{offset:"45%",stopColor:"#1f2937",stopOpacity:"0.9"}),e.jsx("stop",{offset:"100%",stopColor:"#020617",stopOpacity:"1"})]}),e.jsxs("linearGradient",{id:"sealRing",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"#38bdf8"}),e.jsx("stop",{offset:"45%",stopColor:"#6366f1"}),e.jsx("stop",{offset:"100%",stopColor:"#fbbf24"})]}),e.jsx("path",{id:"sealCirclePath",d:"M60,10 a50,50 0 1,1 0,100 a50,50 0 1,1 0,-100"})]}),e.jsx("circle",{cx:"60",cy:"60",r:"52",fill:"none",stroke:"url(#sealRing)",strokeWidth:"4",strokeDasharray:"2 5",opacity:"0.9"}),e.jsx("circle",{cx:"60",cy:"60",r:"40",fill:"url(#sealInner)",stroke:"rgba(255,255,255,0.28)",strokeWidth:"1.5"}),e.jsx("text",{fontSize:"6",letterSpacing:"6",fill:"rgba(0,0,0,0.45)",children:e.jsx("textPath",{href:"#sealCirclePath",startOffset:"50%",textAnchor:"middle",children:"VERIFIED • WEB3EDU • VERIFIED • WEB3EDU •"})}),e.jsx("g",{transform:"translate(60 60)",children:e.jsx("path",{d:"M0 -18 L9 -12 V0 C9 7 4.5 14 0 15 C-4.5 14 -9 7 -9 0 V-12 Z",fill:"#38bdf8",opacity:"0.95"})})]})}),o&&e.jsxs("div",{className:"flex flex-col items-center mt-4 space-y-3",children:[e.jsx("img",{src:`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(o)}&size=120x120`,alt:"QR",className:`
                    rounded-2xl 
                    border border-slate-300/40 dark:border-white/10 
                    bg-white/90 dark:bg-white/5 
                    p-4 
                    shadow-[0_20px_40px_rgba(0,0,0,0.25)]
                    backdrop-blur-md
                    transition-transform duration-300 
                    hover:scale-[1.06] hover:brightness-110
                `}),e.jsxs("p",{className:"text-[11px] text-slate-500 dark:text-slate-400 leading-tight text-center",children:["Issued in Web3Edu Edu-Net",e.jsx("br",{}),"as a Soulbound Token"]})]})]})]}),e.jsxs("div",{className:"mt-10 text-center text-sm text-slate-500 dark:text-slate-400 tracking-wide",children:[e.jsxs("p",{children:["Verified at: ",new Date().toISOString()]}),e.jsx("p",{children:"Chain: Web3Edu Edu-Net (424242)"}),e.jsx("p",{children:"Contract: 0xdDE6A59445538eA146a17Dd8745e7eA5288b1a31"})]}),e.jsx("div",{className:"mt-4 flex justify-center print:hidden",children:e.jsx("button",{onClick:()=>window.print(),className:`
                                        px-4 py-2 text-xs rounded-lg
                                        bg-gradient-to-r from-[#7F3DF1] to-[#33D6FF]
                                        text-white font-medium
                                        shadow-lg hover:shadow-xl hover:brightness-110
                                        transition
                                        active:scale-95 transition-transform
                                    `,children:"Print Verification"})})]})})]})]})]})})}export{_ as default};
