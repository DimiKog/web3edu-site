import{d as q,r as g,j as e}from"./vendor-react-DIuPT6mD.js";import{u as K,g as H,E as J,G as O,H as z,D as Q,B as Z,I as m,J as Y,v as ee,P as te,K as L,x as R,M as E,N as C,O as D,z as se}from"./index-BtzQKT_-.js";import{u as re}from"./vendor-web3-D-8aQOHL.js";function oe(){const{address:l}=q(),{address:I}=re(),{owner:S,smartAccount:A}=K(),[w,p]=g.useState(!0),[v,u]=g.useState(""),[t,U]=g.useState(null);g.useEffect(()=>{if(window.scrollTo(0,0),!l){u("Μη έγκυρη διεύθυνση."),p(!1);return}const r=H();p(!0),u("");const a=async o=>{const c=await fetch(o);if(!c.ok){const d=await c.json().catch(()=>({}));throw se(c.status,d)}return c.json()};Promise.allSettled([a(`${r}/web3sbt/verify/${l}`),a(J(l,A,I,S))]).then(([o,c])=>{const d=o.status==="fulfilled"?o.value:null,x=c.status==="fulfilled"?c.value:null;if(!d&&!x)throw new Error("Both verify and resolve failed.");const F={...d||{},...x||{},metadata:{...z(d),...z(x)},profile:{...O(d),...O(x)},tokenId:d?.tokenId??d?.token_id??x?.tokenId??x?.token_id??null};F.xp_total=Q(F),U(F),p(!1)}).catch(o=>{if(Z(o)){console.warn("Backend user state temporarily unavailable during verify."),u("Τα δεδομένα προφίλ δεν είναι προσωρινά διαθέσιμα. Δοκιμάστε ξανά."),p(!1);return}console.error("Verify page error:",o),u("Αδυναμία φόρτωσης των δεδομένων SBT."),p(!1)})},[l,A,I,S]);const _=t?.metadata??{},B=t?.profile??{},i={...m(_),...m(m(_)?.metadata)},n={...m(B),...m(m(B)?.metadata)},k=(...r)=>{for(const a of r)if(a!=null&&a!=="")return a;return null},f=r=>{if(typeof r=="number"&&Number.isFinite(r))return r;if(typeof r=="string"){const a=Number.parseFloat(r.replace(/[^\d.-]/g,""));if(Number.isFinite(a))return a}return null},G=(i.founder??n.founder)||!1,b=i.edition??n.edition??(G?"Founder Edition":null),N=f(t?.xp_total)??0,M=Y(N),{tier:s,overallPercent:W}=M,P=k(i.timeline,n.timeline,t?.timeline,t?.metadata?.timeline,t?.profile?.timeline),V=Array.isArray(P)?P.filter(r=>{const a=String(r?.status||"").toLowerCase(),o=f(r?.progress)??0;return r?.type==="lab"&&(r?.completed===!0||r?.done===!0||r?.verified===!0||!!r?.completedAt||["completed","done","claimed","verified"].includes(a)||o>=100)}).length:null,h=k(i.builderChecklist,n.builderChecklist,t?.builderChecklist,t?.metadata?.builderChecklist),X=h?(f(h?.coreLabs?.completed)??0)+(f(h?.daoLabs?.completed)??0)+(h?.proofOfEscape?.done||h?.proofOfEscape?.completed?1:0):null,$=f(k(i.lessonsCompleted,i.lessons_completed,i.completedLessons,i.completed_lessons,n.lessonsCompleted,n.lessons_completed,n.completedLessons,n.completed_lessons,t?.lessonsCompleted,t?.lessons_completed,t?.completedLessons,t?.completed_lessons,t?.metadata?.lessonsCompleted,t?.metadata?.lessons_completed,t?.profile?.lessonsCompleted,t?.profile?.lessons_completed,X,V))??0,j=window.location.href,y=t?.tokenId??null,T=l?ee(l):"";return e.jsx(te,{children:e.jsxs("div",{className:`
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
    `,children:"Δημόσια επαλήθευση ενός Soulbound Web3Edu Identity Token."})]}),w&&e.jsx("p",{className:"relative z-10 text-slate-600 dark:text-slate-200",children:"Φόρτωση ταυτότητας…"}),v&&!w&&e.jsx("p",{className:"relative z-10 text-red-500 dark:text-red-300",children:v}),!w&&!v&&t&&e.jsxs("div",{className:`
        relative z-10 max-w-5xl w-full
        print:p-0 print:shadow-none print:bg-white print:text-black print:border-none
        rounded-3xl border border-white/60 bg-white/95
        shadow-[0_24px_60px_rgba(15,23,42,0.30)] hover:shadow-[0_28px_80px_rgba(15,23,42,0.38)] transition-shadow duration-300
        animate-[fadeIn_0.6s_ease]
        dark:border-teal-200/25
        dark:bg-gradient-to-br dark:from-[#020617] dark:via-[#020617] dark:to-[#020617]
        p-4 sm:p-6 md:p-10
        overflow-hidden
    `,children:[e.jsxs("div",{className:"relative md:hidden block rounded-xl border border-white/20 bg-[#0e1422] p-4 mx-auto w-full shadow-lg",children:[e.jsx("div",{className:"absolute top-2 right-2 w-10 h-10 opacity-70 pointer-events-none",children:e.jsxs("svg",{viewBox:"0 0 120 120",className:"w-full h-full",children:[e.jsxs("defs",{children:[e.jsxs("radialGradient",{id:"mSealInner",cx:"50%",cy:"35%",r:"60%",children:[e.jsx("stop",{offset:"0%",stopColor:"#e5f4ff",stopOpacity:"0.95"}),e.jsx("stop",{offset:"45%",stopColor:"#1f2937",stopOpacity:"0.9"}),e.jsx("stop",{offset:"100%",stopColor:"#020617",stopOpacity:"1"})]}),e.jsxs("linearGradient",{id:"mSealRing",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"#38bdf8"}),e.jsx("stop",{offset:"45%",stopColor:"#6366f1"}),e.jsx("stop",{offset:"100%",stopColor:"#fbbf24"})]}),e.jsx("path",{id:"mSealCirclePath",d:"M60,10 a50,50 0 1,1 0,100 a50,50 0 1,1 0,-100"})]}),e.jsx("circle",{cx:"60",cy:"60",r:"52",fill:"none",stroke:"url(#mSealRing)",strokeWidth:"4",strokeDasharray:"2 5",opacity:"0.9"}),e.jsx("circle",{cx:"60",cy:"60",r:"40",fill:"url(#mSealInner)",stroke:"rgba(255,255,255,0.28)",strokeWidth:"1.5"}),e.jsx("text",{fontSize:"6",letterSpacing:"6",fill:"rgba(0,0,0,0.55)",children:e.jsx("textPath",{href:"#mSealCirclePath",startOffset:"50%",textAnchor:"middle",children:"ΕΠΑΛΗΘΕΥΜΕΝΟ • WEB3EDU • ΕΠΑΛΗΘΕΥΜΕΝΟ • WEB3EDU •"})}),e.jsx("g",{transform:"translate(60 60)",children:e.jsx("path",{d:"M0 -18 L9 -12 V0 C9 7 4.5 14 0 15 C-4.5 14 -9 7 -9 0 V-12 Z",fill:"#38bdf8",opacity:"0.96"})})]})}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-14 h-14 rounded-full flex items-center justify-center",style:L(l,s),children:e.jsx(R,{address:l})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-white/40 uppercase tracking-wider",children:"Ταυτότητα Soulbound"}),e.jsx("p",{className:"text-base font-semibold text-white",children:n?.name??"Ταυτότητα Web3Edu"}),e.jsx("p",{className:"text-[10px] text-white/50 font-mono",children:T})]})]}),e.jsxs("div",{className:"mt-3",children:[e.jsx("p",{className:"text-[10px] text-white/40 uppercase",children:"Επίπεδο"}),e.jsxs("p",{className:"text-sm font-semibold flex items-center gap-1",children:[s==="Explorer"&&e.jsx(E,{}),s==="Builder"&&e.jsx(C,{}),s==="Architect"&&e.jsx(D,{}),s]})]}),e.jsxs("div",{className:"mt-3",children:[e.jsx("p",{className:"text-[10px] text-white/40 uppercase",children:"Πρόοδος XP"}),e.jsx("div",{className:"w-full h-1.5 rounded-full bg-white/10 overflow-hidden",children:e.jsx("div",{className:"h-full bg-gradient-to-r from-[#7F3DF1] to-[#33D6FF]",style:{width:`${W}%`}})})]}),e.jsxs("div",{className:"mt-3",children:[e.jsx("p",{className:"text-[10px] text-white/40 uppercase",children:"Token ID"}),e.jsx("p",{className:"text-xs font-mono",children:y!==null?y:"Κανένα"})]}),e.jsx("div",{className:"mt-4",children:j&&e.jsxs(e.Fragment,{children:[e.jsx("img",{src:`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(j)}&size=100x100`,alt:"QR",className:"rounded-lg border border-white/20 bg-white/5 p-1 mx-auto",loading:"lazy"}),e.jsx("p",{className:"text-center text-[10px] text-white/50 mt-2",children:"Σάρωση για επαλήθευση"})]})})]}),e.jsxs("div",{className:"hidden md:block",children:[e.jsx("div",{className:`
    pointer-events-none absolute inset-0 flex items-center justify-center
    -translate-y-8
`,children:"ΔΗΜΟΣΙΑ ΕΠΑΛΗΘΕΥΣΗ"}),e.jsx("div",{className:"pointer-events-none absolute inset-x-0 top-1/2 h-20 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-40 blur-xl"}),e.jsxs("div",{className:`relative flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-8
                max-w-3xl mx-auto w-full`,children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("div",{className:"relative w-20 h-20 rounded-full flex items-center justify-center shadow-2xl "+(s==="Architect"?"animate-pulse":s==="Builder"?"ring-2 ring-[#33D6FF]/70":"ring-2 ring-[#7F3DF1]/60"),style:L(l,s),children:[e.jsx(R,{address:l}),e.jsxs("span",{className:"absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-black/60 border border-white/40 flex items-center justify-center",children:[s==="Explorer"&&e.jsx(E,{}),s==="Builder"&&e.jsx(C,{}),s==="Architect"&&e.jsx(D,{})]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-white/50",children:"Ταυτότητα Soulbound"}),e.jsx("p",{className:"text-xl font-semibold mt-1 text-slate-900 dark:text-white",children:n.name??"Web3Edu Identity SBT"}),e.jsxs("p",{className:"text-xs text-slate-500 dark:text-white/60 mt-1",children:["Διεύθυνση: ",e.jsx("span",{className:"font-mono",children:T})]}),b&&e.jsx("span",{className:`mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold
                                                           bg-gradient-to-r from-[#7F3DF1] via-[#9A5CFF] to-[#FF6FD8]
                                                           text-white shadow-sm`,children:b})]})]}),s&&e.jsxs("div",{className:"flex flex-col items-center md:items-end gap-2",children:[e.jsxs("span",{className:"px-3 py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md "+(s==="Architect"?"bg-amber-100/90 border-amber-300/70 dark:bg-yellow-300/20 dark:border-yellow-300/40":"bg-slate-100 border-slate-200 dark:bg-white/10 dark:border-white/20"),children:[s==="Explorer"&&e.jsx(E,{}),s==="Builder"&&e.jsx(C,{}),s==="Architect"&&e.jsx(D,{}),s]}),e.jsxs("p",{className:"text-xs text-slate-500 dark:text-white/60",children:["XP: ",N," • Μαθήματα: ",$]})]})]}),e.jsx("div",{className:"mt-6 relative",children:e.jsxs("div",{className:`
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
  `,children:"ΕΠΑΛΗΘΕΥΜΕΝΟ"}),e.jsxs("div",{className:"relative grid grid-cols-1 lg:grid-cols-2 gap-10",children:[e.jsxs("div",{className:"space-y-4 text-sm",children:[e.jsx("p",{className:"font-semibold tracking-wide text-xs text-[#6f31d7] dark:text-[#bfa6ff] uppercase",children:"ΣΤΟΙΧΕΙΑ ΤΑΥΤΟΤΗΤΑΣ"}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-semibold uppercase text-slate-600 dark:text-slate-300",children:"ΟΝΟΜΑ"}),e.jsx("p",{className:"font-semibold text-slate-900 dark:text-white text-2xl",children:n?.name??"Web3Edu Identity SBT"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-semibold uppercase text-slate-600 dark:text-slate-300",children:"ΠΡΟΤΥΠΟ Token"}),e.jsx("p",{className:"font-medium text-base",children:"ERC-721 SBT"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-semibold uppercase text-slate-600 dark:text-slate-300",children:"ΠΟΡΤΟΦΟΛΙ"}),e.jsx("p",{className:"font-mono text-xs break-all",children:l})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-semibold uppercase text-slate-600 dark:text-slate-300",children:"Token ID"}),e.jsx("p",{className:"font-mono text-sm",children:y??"Κανένα"})]}),b&&e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-semibold uppercase text-slate-600 dark:text-slate-300",children:"ΕΚΔΟΣΗ"}),e.jsx("p",{className:"font-medium text-[#7F3DF1] dark:text-[#c4b2ff] text-base",children:b})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-semibold uppercase text-slate-600 dark:text-slate-300mb-1",children:"ΠΡΟΟΔΟΣ XP"}),e.jsx("div",{className:"w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden",children:e.jsx("div",{className:"h-full bg-gradient-to-r from-[#7F3DF1] to-[#33D6FF]",style:{width:`${W}%`}})}),e.jsxs("p",{className:"text-sm mt-1",children:[N," XP"]})]})]}),e.jsxs("div",{className:"relative z-10 flex flex-col items-center gap-6 mt-2 pt-4",children:[e.jsx("div",{className:`
        w-48 h-48 flex items-center justify-center
        drop-shadow-[0_8px_25px_rgba(127,61,241,0.28)]
        transition-transform duration-300 
        hover:scale-[1.04]
    `,children:e.jsxs("svg",{viewBox:"0 0 120 120",className:"w-full h-full drop-shadow-xl",children:[e.jsxs("defs",{children:[e.jsxs("radialGradient",{id:"sealInner",cx:"50%",cy:"35%",r:"60%",children:[e.jsx("stop",{offset:"0%",stopColor:"#e5f4ff",stopOpacity:"0.95"}),e.jsx("stop",{offset:"45%",stopColor:"#1f2937",stopOpacity:"0.9"}),e.jsx("stop",{offset:"100%",stopColor:"#020617",stopOpacity:"1"})]}),e.jsxs("linearGradient",{id:"sealRing",x1:"0%",y1:"0%",x2:"100%",y2:"100%",children:[e.jsx("stop",{offset:"0%",stopColor:"#38bdf8"}),e.jsx("stop",{offset:"45%",stopColor:"#6366f1"}),e.jsx("stop",{offset:"100%",stopColor:"#fbbf24"})]}),e.jsx("path",{id:"sealCirclePath",d:"M60,10 a50,50 0 1,1 0,100 a50,50 0 1,1 0,-100"})]}),e.jsx("circle",{cx:"60",cy:"60",r:"52",fill:"none",stroke:"url(#sealRing)",strokeWidth:"4",strokeDasharray:"2 5",opacity:"0.9"}),e.jsx("circle",{cx:"60",cy:"60",r:"40",fill:"url(#sealInner)",stroke:"rgba(255,255,255,0.28)",strokeWidth:"1.5"}),e.jsx("text",{fontSize:"6",letterSpacing:"6",fill:"rgba(0,0,0,0.45)",children:e.jsx("textPath",{href:"#sealCirclePath",startOffset:"50%",textAnchor:"middle",children:"ΕΠΑΛΗΘΕΥΜΕΝΟ • WEB3EDU • ΕΠΑΛΗΘΕΥΜΕΝΟ • WEB3EDU •"})}),e.jsx("g",{transform:"translate(60 60)",children:e.jsx("path",{d:"M0 -18 L9 -12 V0 C9 7 4.5 14 0 15 C-4.5 14 -9 7 -9 0 V-12 Z",fill:"#38bdf8",opacity:"0.95"})})]})}),j&&e.jsxs("div",{className:"flex flex-col items-center mt-4 space-y-3",children:[e.jsx("img",{src:`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(j)}&size=120x120`,alt:"QR",className:`
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
                                    `,children:"Εκτύπωση Επαλήθευσης"})})]})})]})]})]})})}export{oe as default};
