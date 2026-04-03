import{u as ke,r as x,j as e}from"./vendor-react-DIuPT6mD.js";import{s as je,e as ve,k as Ne,l as ye,g as Be,o as Ae,i as _e,P as Le}from"./index-Ble26waH.js";import{I as Ce,D as g,F as v,a as M,b as Ee,X as Fe,c as q,L as Pe,d as Se,e as Te}from"./IdentityCard-DCelXMQi.js";import{u as De}from"./vendor-web3-ZWswquZB.js";import"./identity-icon-MXImXT_G.js";const U=u=>{if(!u)return 0;const w=Date.parse(u);return Number.isFinite(w)?w:0};function Ge(){const{address:u,isConnected:w}=De(),m=ke(),[t,W]=x.useState(null),[J,_]=x.useState(!1),[K,L]=x.useState(!1),N=x.useRef(null),[f,V]=x.useState(null),[C,H]=x.useState(null),E="web3edu-builder-unlock-shown",[Q,F]=x.useState(!1),[Re,Y]=x.useState(localStorage.getItem("web3edu-builder-claimed")==="true"),[P,Z]=x.useState(localStorage.getItem(E)==="true"),[ee,S]=x.useState(!1),te=x.useRef(null),re={tier:"Explorer",xp_total:0,xp:0,xpPercent:0,remainingXp:0,nextTierPercent:0,lessonsCompleted:0},ae=t&&typeof t=="object"&&!Array.isArray(t)?t:{},T={...re,...ae},se=(()=>{const r=T||{},a=f||{},i=[...Array.isArray(r.attributes)?r.attributes:[],...Array.isArray(a.attributes)?a.attributes:[]].some(p=>(p?.trait_type||"").toLowerCase()==="founder"&&(p?.value===!0||String(p?.value).toLowerCase()==="true"));return r.founder===!0||a.founder===!0||r.edition==="Founder Edition"||a.edition==="Founder Edition"||r.role==="Founder"||a.role==="Founder"||i})();x.useEffect(()=>{w||m("/join-gr"),window.scrollTo(0,0)},[w,m]);const B=je(u),le=r=>{const a=[r?.tokenId,r?.token_id,r?.tokenID,r?.metadata?.tokenId,r?.metadata?.token_id,r?.profile?.tokenId,r?.profile?.token_id,r?.metadata?.metadata?.tokenId,r?.metadata?.metadata?.token_id,r?.profile?.metadata?.tokenId,r?.profile?.metadata?.token_id];for(const s of a)if(s!=null&&s!=="")return s;return null};x.useEffect(()=>{if(!u)return;fetch(`https://web3edu-api.dimikog.org/web3sbt/resolve/${u}`).then(a=>a.ok?a.json():a.json().catch(()=>({})).then(s=>{throw ve(a.status,s)})).then(a=>{const s=Ne(a),i=ye(a),p=Be(a),l=Ae(p);console.log("XP from backend:",p);const d={...s,...i};W({...d,tokenId:le(a),xp_total:p,xp:p,tier:l.tier,xpPercent:l.xpPercent,nextTierPercent:l.nextTierPercent,remainingXp:l.remainingXp});const b=c=>{if(typeof c=="string")try{return JSON.parse(c)}catch{return null}return c},I=c=>{const be=[c?.attributes,c?.attribute,c?.attrs,c?.traits,c?.traits_array,c?.traitsArray,c?.attributes_json,c?.attributesJson];for(const ge of be){const j=b(ge);if(Array.isArray(j))return j;if(j&&typeof j=="object")return Object.entries(j).map(([fe,we])=>({trait_type:fe,value:we}))}return[]},ce=I(s),xe=I(i),k=[...ce,...xe],z=i.role||s.role,G=i.specialization||i.speciality||s.specialization||s.speciality,pe=k.some(c=>(c.trait_type||"").toLowerCase()==="role"),me=k.some(c=>["specialization","speciality"].includes((c.trait_type||"").toLowerCase()));!pe&&z&&k.push({trait_type:"Role",value:z}),!me&&G&&k.push({trait_type:"Specialization",value:G});const ue=i.image&&i.image.trim()!==""?i.image:i.avatar&&i.avatar.trim()!==""?i.avatar:s.image&&s.image.trim()!==""?s.image:s.avatar&&s.avatar.trim()!==""?s.avatar:null,he={...d,xp_total:p,xp:p,tier:l.tier,name:i.name||s.name||B||"Web3Edu Identity",image:ue,attributes:k};V(he),H(new Date)}).catch(a=>{if(_e(a)){console.warn("Backend user state temporarily unavailable; preserving dashboard state.");return}console.error("Failed to fetch metadata:",a)})},[u,B]),x.useEffect(()=>{if(!t||typeof t.xp_total!="number")return;let r;return N.current==null||t.xp_total>N.current&&(L(!0),r=setTimeout(()=>L(!1),1200)),N.current=t.xp_total,()=>{r&&clearTimeout(r)}},[t]),x.useEffect(()=>{t?.tier&&((t.tier==="Builder"||t.tier==="Architect")&&!P&&(F(!0),Z(!0),localStorage.setItem(E,"true")),te.current=t.tier)},[t?.tier,P]);const ne={type:"guide",title:"Ξεκίνα εδώ — Οδηγός Web3Edu",slug:"start-here-gr",why:"Αυτός ο σύντομος οδηγός εξηγεί πώς λειτουργεί το Web3Edu και σε βοηθά να επιλέξεις το επόμενο βήμα.",estimatedTime:5},y=t&&typeof t.recommendedNext=="object"?t.recommendedNext:null,D=y&&(y.title||y.slug),n=D?y:ne,R=!D,$=!!n?.builderRequired,O=n?.slug?.endsWith("-gr")?n.slug.replace(/-gr$/,""):n?.slug,ie={lab01:"Lab 01 — Πορτοφόλια & Web3 Ταυτότητες","wallets-keys":"Lab 01 — Πορτοφόλια & Web3 Ταυτότητες",lab02:"Lab 02 — Κρυπτογραφημένα Μηνύματα",lab03:"Lab 03 — Υπογραφή Μηνυμάτων & Ιδιοκτησία",lab04:"Lab 04 — Συναλλαγές & Gas",lab05:"Lab 05 — Έξυπνα Συμβόλαια & Κατάσταση",lab06:"Lab 06 — Συναίνεση & Οριστικότητα",dao01:"DAO Lab 01 — Διακυβέρνηση & Ψηφοφορία","dao-01":"DAO Lab 01 — Διακυβέρνηση & Ψηφοφορία",dao02:"DAO Lab 02 — Μοντέλα Διακυβέρνησης & Δυναμικές Ισχύος","dao-02":"DAO Lab 02 — Μοντέλα Διακυβέρνησης & Δυναμικές Ισχύος","proof-of-escape":"Lab 01 — Proof of Escape",poe:"Lab 01 — Proof of Escape"},oe=(()=>{const r=Array.isArray(t?.timeline)?t.timeline:[],a=new Map;r.forEach((l,d)=>{if(!l)return;const b=`${l.type||"unknown"}:${l.id||l.slug||d}`;a.set(b,l)});const s=t?.labs_completed&&typeof t.labs_completed=="object"?t.labs_completed:{};Object.entries(s).forEach(([l,d])=>{a.set(`lab:${l}`,{type:"lab",id:l,title:d?.title||l,xp:d?.xp||0,badge:d?.badge,completedAt:d?.completedAt})});const i=t?.projects_completed&&typeof t.projects_completed=="object"?t.projects_completed:{},p=t?.projectLabs&&typeof t.projectLabs=="object"?t.projectLabs:{};return Object.entries(i).forEach(([l,d])=>{a.set(`project:${l}`,{type:"project",id:l,title:d?.badge||l,badge:d?.badge,xp:p?.[l]?.xp||0,completedAt:d?.completedAt})}),[...a.values()].sort((l,d)=>U(d?.completedAt)-U(l?.completedAt)).map(l=>{if(!l||l.type!=="lab")return l;const d=String(l.id||l.slug||"").toLowerCase(),b=ie[d];return b?typeof l.title=="object"&&l.title!==null?{...l,title:{...l.title,gr:l.title.gr||b}}:{...l,title:b}:l})})(),o=t?.builderChecklist||null,[X,de]=x.useState(t?.tier&&t.tier!=="Explorer"),A=Array.isArray(t?.eventBadges)?t.eventBadges:[],h=A.some(r=>{if(typeof r=="string")return r.toLowerCase().includes("genesis");const a=String(r?.name||r?.label||r?.en||r?.gr||"").toLowerCase(),s=String(r?.id||r?.slug||"").toLowerCase();return a.includes("genesis")||s.includes("genesis")});return e.jsx(Le,{children:e.jsxs("div",{className:`
                    min-h-screen flex flex-col items-center px-6 py-20
                    bg-transparent dark:bg-transparent
                    text-slate-900 dark:text-slate-100
                    relative overflow-hidden transition-colors duration-500
                `,children:[e.jsx("style",{children:`
                  @keyframes pulseGlow {
                    0% { box-shadow: 0 0 4px rgba(51,214,255,0.2); }
                    50% { box-shadow: 0 0 18px rgba(51,214,255,0.55); }
                    100% { box-shadow: 0 0 4px rgba(51,214,255,0.2); }
                  }

                  @keyframes xpBurst {
                    0%   { transform: scale(1);   filter: drop-shadow(0 0 0px rgba(138,87,255,0)); }
                    40%  { transform: scale(1.08); filter: drop-shadow(0 0 18px rgba(138,87,255,0.6)); }
                    100% { transform: scale(1);   filter: drop-shadow(0 0 0px rgba(138,87,255,0)); }
                  }

                  @keyframes lessonPulse {
                    0%   { transform: scale(1);   filter: drop-shadow(0 0 0px rgba(138,87,255,0)); }
                    40%  { transform: scale(1.15); filter: drop-shadow(0 0 15px rgba(138,87,255,0.8)); }
                    100% { transform: scale(1);   filter: drop-shadow(0 0 0px rgba(138,87,255,0)); }
                  }

                  @keyframes genesisPulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 rgba(168,85,247,0); }
                    40% { transform: scale(1.08); box-shadow: 0 0 18px rgba(168,85,247,0.7); }
                    100% { transform: scale(1); box-shadow: 0 0 0 rgba(168,85,247,0); }
                  }
                `}),e.jsxs("div",{className:"absolute inset-0 pointer-events-none",children:[e.jsx("div",{className:"absolute top-[18%] left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-purple-600/30 dark:bg-purple-600/20 blur-[130px] rounded-full"}),e.jsx("div",{className:"absolute bottom-[15%] right-[25%] w-[340px] h-[340px] bg-indigo-400/30 dark:bg-indigo-500/20 blur-[140px] rounded-full"})]}),f&&e.jsxs("div",{className:`
            relative z-10 w-full max-w-5xl mx-auto text-center
            mt-4 mb-16 animate-[fadeSlideUp_0.6s_ease-out]
        `,children:[e.jsx("div",{className:"flex justify-center mb-3",children:e.jsxs("div",{className:"relative",children:[e.jsx("img",{src:f.image||"/icons/web3edu-identity.png",alt:"avatar",className:`
                        w-14 h-14 rounded-full object-cover shadow-md 
                        border border-white/20 dark:border-white/10 
                        transition-all duration-700
                        dark:animate-[shine_3.4s_ease-in-out_infinite]
                    `,loading:"lazy"}),e.jsx("div",{className:`
                        absolute inset-0 rounded-full 
                        dark:bg-white/5 blur-md 
                        dark:animate-[shineGlow_3.4s_ease-in-out_infinite]
                    `})]})}),e.jsxs("h2",{className:"text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-3",children:["Καλώς ήρθες πάλι, ",f.name||B," 👋",t?.tier&&e.jsx("span",{className:`
                inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                bg-gradient-to-r from-purple-600/80 to-fuchsia-500/80
                dark:from-purple-500/60 dark:to-fuchsia-400/60
                text-white shadow-md border border-white/10
            `,children:t.tier})]}),C&&e.jsxs("p",{className:"text-xs text-slate-500 dark:text-slate-400 mt-1",children:["🕒 Συγχρονίστηκε πριν ",Math.max(1,Math.floor((Date.now()-C.getTime())/1e3))," δευτ • Ταυτότητα Web3Edu"]}),e.jsx("p",{className:"mt-2 text-sm text-slate-600 dark:text-slate-300",children:"Κάνε mint την Ταυτότητα Web3Edu για να αποθηκεύσεις τη μάθησή σου on-chain."}),e.jsx("div",{className:`
                w-20 h-1 mx-auto mt-3 rounded-full
                bg-gradient-to-r from-[#8A57FF]/50 via-[#4ACBFF]/40 to-[#FF67D2]/50
                shadow-[0_0_12px_rgba(138,87,255,0.45)]
            `}),e.jsx("style",{children:`
                @keyframes shine {
                    0% { filter: brightness(1); }
                    50% { filter: brightness(1.4); }
                    100% { filter: brightness(1); }
                }

                @keyframes shineGlow {
                    0% { opacity: 0.25; }
                    50% { opacity: 0.45; }
                    100% { opacity: 0.25; }
                }
            `})]}),Q&&e.jsx("div",{className:"relative z-10 w-full max-w-4xl mx-auto mb-10 px-4",children:e.jsxs("div",{className:`
                            rounded-3xl border border-purple-400/40
                            bg-gradient-to-br from-purple-600/20 via-indigo-600/20 to-fuchsia-600/20
                            backdrop-blur-xl shadow-2xl p-8 text-center
                            animate-[xpBurst_1.2s_ease-out]
                        `,children:[e.jsx("h2",{className:"text-2xl font-extrabold text-white mb-3",children:"🏗️ Ξεκλειδώθηκε το επίπεδο Builder"}),e.jsxs("p",{className:"text-sm text-slate-200 mb-6",children:["Ολοκλήρωσες τις βασικές απαιτήσεις και ξεκλείδωσες το επίπεδο",e.jsx("span",{className:"font-semibold text-purple-300",children:" Builder "}),". Πλέον μπορείς να συμμετέχεις σε προχωρημένες διαδρομές διακυβέρνησης."]}),ee?e.jsxs("div",{className:`
                                        px-6 py-3 rounded-xl
                                        bg-green-600/90 text-white font-semibold
                                        shadow-lg animate-[xpBurst_1.2s_ease-out]
                                        flex flex-col items-center gap-1
                                    `,children:[e.jsx("span",{children:"✅ Το Builder Badge κατοχυρώθηκε"}),e.jsx("span",{className:"text-[11px] opacity-90",children:"Επόμενος στόχος: Βαθμίδα Architect"})]}):e.jsx("button",{onClick:()=>{localStorage.setItem("web3edu-builder-claimed","true"),Y(!0),S(!0),setTimeout(()=>{F(!1),S(!1)},1400)},className:`
                                        px-6 py-3 rounded-xl
                                        bg-gradient-to-r from-purple-500 to-indigo-500
                                        text-white font-semibold
                                        hover:scale-105 transition shadow-lg
                                    `,children:"Διεκδίκησε το Builder Badge"})]})}),e.jsxs("div",{className:"relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 px-2 md:px-0",children:[e.jsxs("div",{className:"flex flex-col items-center justify-start mt-10 lg:mt-0 relative self-center",children:[e.jsx("div",{className:"absolute -z-10 top-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-purple-500/25 dark:bg-purple-500/20 blur-[200px] rounded-full"}),f&&e.jsx(Ce,{metadata:f,wallet:u,tokenId:T.tokenId})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-8 md:gap-8",children:[se&&e.jsx(g,{title:"Σήμα Ιδρυτή",className:`
                                    rounded-2xl border border-fuchsia-300/30 dark:border-fuchsia-700/30
                                    bg-gradient-to-br from-white/95 via-fuchsia-50/70 to-slate-100/90
                                    dark:from-[#110819]/90 dark:via-[#1a0f21]/85 dark:to-[#0c0814]/90
                                    backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                                    hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                                `,icon:e.jsx(v,{className:"w-5 h-5 text-white"}),children:e.jsxs("p",{className:"text-sm text-slate-700 dark:text-slate-300 leading-relaxed",children:["Κατέχεις ένα"," ",e.jsx("span",{className:"font-semibold text-fuchsia-600 dark:text-fuchsia-400",children:"Founder SBT"}),". Μια ειδική αναγνώριση για τους βασικούς δημιουργούς του Web3Edu."]})}),e.jsx(g,{title:"Το πορτοφόλι σου",className:`
                                rounded-2xl border border-cyan-300/30 dark:border-cyan-700/30
                                bg-gradient-to-br from-white/95 via-cyan-50/70 to-slate-100/90
                                dark:from-[#071d24]/90 dark:via-[#0a2730]/85 dark:to-[#06151a]/90
                                backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                                hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                            `,icon:e.jsx(M,{className:"w-5 h-5 text-white"}),children:e.jsx("p",{className:"text-sm font-mono text-slate-700 dark:text-slate-300 break-all",children:u??"—"})}),e.jsx(g,{title:"Βαθμίδα",className:`
                                rounded-2xl border border-purple-300/30 dark:border-purple-700/30
                                bg-gradient-to-br from-white/95 via-purple-50/70 to-slate-100/90
                                dark:from-[#160f2a]/90 dark:via-[#120c23]/85 dark:to-[#0b0816]/90
                                backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                                hover:scale-[1.005] hover:shadow-2xl transition-all duration-500 relative
                            `,icon:e.jsx(Ee,{className:"w-5 h-5 text-white"}),children:e.jsxs("div",{className:"flex flex-col items-start gap-3 cursor-pointer",onClick:()=>_(!0),children:[e.jsxs("div",{className:`
                                        inline-flex items-center gap-2 
                                        px-3 py-1 rounded-full
                                        bg-purple-100/70 dark:bg-purple-900/40
                                        border border-purple-300/40 dark:border-purple-600/60
                                    `,children:[e.jsx("span",{className:"inline-flex h-2.5 w-2.5 rounded-full bg-purple-500 dark:bg-purple-400"}),e.jsx("span",{className:"text-[11px] font-semibold tracking-[0.14em] uppercase text-purple-700 dark:text-purple-200",children:"Τρέχουσα βαθμίδα"})]}),e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsxs("div",{className:"flex items-baseline gap-2",children:[e.jsx("p",{className:`
                                                text-2xl font-extrabold text-purple-700 dark:text-purple-200
                                                ${t?.tier==="Builder"?"animate-[xpBurst_1.2s_ease-out]":""}
                                            `,children:t?.tier??"Explorer"}),t?.tier&&t.tier!=="Explorer"&&e.jsx("span",{className:"text-[11px] font-medium text-purple-500/90 dark:text-purple-300/90",children:t.tier==="Builder"?"Σε πορεία για DAO":"Έτοιμος για διακυβέρνηση DAO"})]}),t?.tier&&t.tier!=="Architect"&&e.jsx("div",{className:"mt-2 text-xs text-slate-600/90 dark:text-slate-400/90",children:(()=>{const r=t.tier,a=t?.remainingXp??0;let s="Builder";return r==="Builder"&&(s="Architect"),e.jsxs("span",{children:["Επόμενη βαθμίδα:"," ",e.jsx("span",{className:"font-semibold text-purple-600 dark:text-purple-300",children:s})," ","• απομένουν ",a," XP"]})})()}),e.jsx("p",{className:"text-xs text-slate-600/90 dark:text-slate-400/90",children:"Κέρδισε XP από μαθήματα και κουίζ για να αναβαθμίσεις τη βαθμίδα σου."}),e.jsx("p",{className:"mt-2 text-xs text-slate-600/90 dark:text-slate-400/90",children:t?.tier==="Builder"||t?.tier==="Architect"?"Η πρόσβαση στη διακυβέρνηση DAO είναι ξεκλειδωμένη στη βαθμίδα σου.":"Φτάσε τη βαθμίδα Builder για να ξεκλειδώσεις πρόσβαση στη διακυβέρνηση DAO."}),e.jsx("div",{className:"mt-2 text-xs font-semibold",children:t?.tier==="Builder"||t?.tier==="Architect"?e.jsx("span",{className:"text-green-600 dark:text-green-400",children:"🟢 Πρόσβαση Διακυβέρνησης: Ενεργή"}):e.jsx("span",{className:"text-slate-500 dark:text-slate-400",children:"🔒 Πρόσβαση Διακυβέρνησης: Κλειδωμένη"})}),t?.tier==="Builder"&&e.jsx("p",{className:"text-[11px] mt-1 text-slate-500 dark:text-slate-400",children:"Η βαθμίδα Architect ξεκλειδώνει δημοσίευση προτάσεων και προχωρημένα εργαλεία διακυβέρνησης."})]})]})}),e.jsx(g,{title:"Πρόοδος",className:`
                            rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                            bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                            dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                            dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                            hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                        `,icon:e.jsx(v,{className:"w-5 h-5 text-white"}),children:e.jsx(Fe,{xp:t?.xp_total??0,xpPercent:t?.xpPercent??0,remainingXp:t?.remainingXp??0,nextTierPercent:t?.nextTierPercent??0,tier:t?.tier??"Explorer",xpLeveledUp:K,lang:"gr"})}),e.jsxs(g,{title:"Ενέργειες",className:`
                            rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                            bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                            dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                            dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                            hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                        `,icon:e.jsx(q,{className:"w-5 h-5 text-white"}),children:[e.jsx("p",{className:"text-sm text-slate-700 dark:text-slate-200 mb-4 leading-relaxed",children:"Εδώ θα βρεις τις βασικές ενέργειες για την ταυτότητα και το ταξίδι μάθησής σου στο Web3Edu."}),e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx("button",{onClick:()=>m("/sbt-view"),className:"py-3 px-6 rounded-xl bg-gradient-to-r from-[#7F3DF1] to-[#5F2BD8] text-white hover:scale-[1.03] hover:opacity-90 transition font-semibold shadow-md",children:"Δες το SBT μου"}),e.jsx("button",{onClick:()=>m("/labs-gr"),className:"py-3 px-6 rounded-xl bg-gradient-to-r from-[#33D6FF] to-[#24A9D0] text-white hover:scale-[1.03] hover:opacity-90 transition font-semibold shadow-md",children:"Ξεκίνησε τα μαθήματα"}),e.jsx("div",{className:"mt-3",children:e.jsx("button",{onClick:()=>m("/start-here-gr"),className:`
  w-full py-3 px-6 rounded-xl
  bg-gradient-to-r from-indigo-500/80 to-purple-500/80
  text-white
  hover:scale-[1.03] hover:opacity-90
  transition
  font-semibold shadow-md
`,children:"Ξεκίνα εδώ (οδηγός)"})})]})]}),e.jsxs(g,{title:"Σήματα",className:`
                            rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                            bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                            dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                            dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                            hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                        `,icon:e.jsx(v,{className:"w-5 h-5 text-white"}),children:[e.jsx("p",{className:"text-sm text-slate-700 dark:text-slate-200 mb-4 leading-relaxed",children:"Όλες οι διακρίσεις και τα σήματα που κερδίζεις θα εμφανίζονται εδώ καθώς προχωράς."}),t?.badges?.length>0||A.length>0?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"flex flex-wrap gap-2",children:[t?.badges?.map((r,a)=>{let s=v;const i=typeof r=="string"?r.toLowerCase():r?.label?.toLowerCase?.()||r?.en?.toLowerCase?.()||r?.gr?.toLowerCase?.()||"";return i.includes("wallet")&&(s=M),i.includes("lesson")&&(s=Se),i.includes("quiz")&&(s=Te),e.jsxs("span",{className:`
                                                        inline-flex items-center gap-2 
                                                        px-3 py-1 rounded-full 
                                                        text-xs font-semibold
                                                        bg-indigo-200/60 dark:bg-indigo-900/40
                                                        border border-indigo-300/30 dark:border-indigo-700/30
                                                        text-slate-900 dark:text-slate-100
                                                    `,children:[e.jsx(s,{className:"w-4 h-4 text-white/90"}),typeof r=="string"?r:r?.gr||r?.en||r?.label||JSON.stringify(r)]},`badge-${a}-${typeof r=="string"?r:r?.id||"badge"}`)}),A.map((r,a)=>{const s=typeof r=="string"?r:r?.name||"Σήμα Εκδήλωσης",p=String(s).toLowerCase().includes("genesis");return e.jsxs("span",{className:`
                                                        inline-flex items-center gap-2
                                                        px-3 py-1 rounded-full
                                                        text-xs font-semibold
                                                        ${p?"bg-gradient-to-r from-purple-500/80 to-fuchsia-500/80 text-white border border-purple-300/40 shadow-[0_0_10px_rgba(168,85,247,0.6)] animate-[genesisPulse_0.9s_ease-out]":"bg-purple-200/70 dark:bg-purple-900/40 border border-purple-300/40 dark:border-purple-700/40 text-slate-900 dark:text-slate-100"}
                                                    `,children:[e.jsx(v,{className:`w-4 h-4 ${p?"text-yellow-300":"text-white/90"}`}),s]},`event-badge-${a}`)})]}),e.jsx("div",{className:"w-full mt-4",children:e.jsx("button",{disabled:h,onClick:()=>{h||m("/events/genesis")},className:`
                                                w-full py-2 px-4 rounded-lg
                                                text-xs font-semibold transition shadow-md
                                                ${h?"bg-green-500 text-white cursor-default":"bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:scale-[1.02]"}
                                            `,children:h?"Το Genesis Badge έγινε mint ✓":"Κάνε mint το Genesis Event Badge"})})]}):e.jsxs(e.Fragment,{children:[e.jsx("p",{className:"text-slate-600 dark:text-slate-300",children:"Δεν υπάρχουν σήματα ακόμη…"}),e.jsx("div",{className:"w-full mt-4",children:e.jsx("button",{disabled:h,onClick:()=>{h||m("/events/genesis")},className:`
                                                w-full py-2 px-4 rounded-lg
                                                text-xs font-semibold transition shadow-md
                                                ${h?"bg-green-500 text-white cursor-default":"bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:scale-[1.02]"}
                                            `,children:h?"Το Genesis Badge έγινε mint ✓":"Κάνε mint το Genesis Event Badge"})})]})]})]})]}),n&&e.jsx("div",{className:"relative z-10 w-full max-w-6xl mx-auto mt-6 mb-8 px-2 md:px-0",children:e.jsxs(g,{title:"Προτεινόμενο επόμενο βήμα",className:`
                rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                dark:border-white/10 backdrop-blur-xl shadow-xl
                hover:scale-[1.002] hover:shadow-2xl transition-all duration-500
            `,icon:e.jsx(q,{className:"w-5 h-5 text-white"}),children:[o&&e.jsxs("div",{className:`mb-4 rounded-xl border border-purple-300/30 dark:border-purple-700/40 
                                                bg-purple-50/70 dark:bg-purple-900/20 p-4`,children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx("span",{className:"text-xs font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-300",children:"🏗 Διαδρομή Builder"}),t?.tier==="Explorer"&&e.jsx("button",{onClick:r=>{r.stopPropagation(),de(a=>!a)},className:"text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline",children:X?"Απόκρυψη λεπτομερειών":"Δες απαιτήσεις"}),t?.tier!=="Explorer"&&(o.coreLabs?.done&&o.daoLabs?.done&&o.proofOfEscape?.done&&o.xpRequirement?.done?e.jsx("span",{className:"text-green-600 dark:text-green-400 text-xs font-semibold",children:"✔ Builder Ξεκλειδώθηκε"}):e.jsx("span",{className:"text-xs text-slate-500 dark:text-slate-400",children:"Σε εξέλιξη"}))]}),X&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs",children:[e.jsxs("div",{children:[o.coreLabs?.done?"✔":"⏳"," Core Labs (",o.coreLabs?.completed,"/",o.coreLabs?.required,")"]}),e.jsxs("div",{children:[o.daoLabs?.done?"✔":"⏳"," DAO Labs (",o.daoLabs?.completed,"/",o.daoLabs?.required,")"]}),e.jsxs("div",{children:[o.proofOfEscape?.done?"✔":"⏳"," Proof of Escape"]}),e.jsxs("div",{children:[o.xpRequirement?.done?"✔":"⏳"," XP (",o.xpRequirement?.current,"/",o.xpRequirement?.required,")"]})]}),(()=>{const a=(o.coreLabs?.done?1:0)+(o.daoLabs?.done?1:0)+(o.proofOfEscape?.done?1:0),s=Math.round(a/3*100);return e.jsxs("div",{className:"mt-4",children:[e.jsxs("div",{className:"flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1",children:[e.jsx("span",{children:"Πρόοδος Builder"}),e.jsxs("span",{children:[a,"/",3," απαιτήσεις"]})]}),e.jsx("div",{className:"w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden",children:e.jsx("div",{className:"h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500",style:{width:`${s}%`}})})]})})()]})]}),e.jsxs("div",{className:"space-y-3 cursor-pointer",onClick:()=>{if(n.type==="guide"&&n.slug){m(`/${n.slug}`);return}if(n.type==="lab"&&O){m(`/labs-gr/${O}`);return}if(n.type==="lesson"&&n.slug){m(`/lessons/${n.slug}`);return}m("/education-gr")},children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("p",{className:"text-xs uppercase tracking-wide text-indigo-600 dark:text-indigo-400 font-semibold",children:R?"Ξεκίνα από εδώ":"Προτείνεται για εσένα"}),$&&e.jsx("span",{className:`
                                            inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold
                                            bg-purple-100/80 dark:bg-purple-900/40
                                            border border-purple-300/40 dark:border-purple-600/60
                                            text-purple-700 dark:text-purple-300
                                        `,children:"🏗 Διαδρομή Builder"}),$&&e.jsx("span",{className:`
                                            text-[10px] font-medium text-slate-500 dark:text-slate-400
                                        `,children:"Τελική απαίτηση Builder"})]}),e.jsx("p",{className:"text-xl font-bold text-slate-900 dark:text-white leading-snug",children:typeof n.title=="object"?n.title.gr||n.title.en:n.title}),n.why&&e.jsxs("div",{className:"mt-1",children:[e.jsx("p",{className:"text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-500 mb-1",children:R?"Προτεινόμενο πρώτο βήμα":"Γιατί προτείνεται"}),e.jsx("p",{className:"text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl",children:typeof n.why=="object"?n.why.gr||n.why.en:n.why})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-6 pt-1 text-sm text-slate-600 dark:text-slate-400",children:[n.estimatedTime&&e.jsxs("span",{children:["⏱ ",n.estimatedTime," λεπτά"]}),n.xp&&e.jsxs("span",{children:["🏅 +",n.xp," XP"]})]}),e.jsx("div",{className:"pt-2",children:e.jsx("span",{className:"inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400",children:"Συνέχισε →"})})]})]})}),e.jsx("div",{className:"relative z-10 w-full max-w-6xl mx-auto mt-12 px-2 md:px-0",children:e.jsx(Pe,{timeline:oe,lang:"gr"})}),e.jsx("div",{className:`pointer-events-none fixed top-0 right-0 w-[300px] h-full
                                bg-gradient-to-b from-[#8A57FF]/35 via-[#4ACBFF]/25 to-[#FF67D2]/35
                                blur-[160px] opacity-60`}),J&&e.jsx("div",{className:"fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50",children:e.jsxs("div",{className:"bg-[#0f0f17] p-6 rounded-2xl w-80 border border-white/10 shadow-xl",children:[e.jsx("h2",{className:"text-xl font-bold mb-3 flex items-center gap-2",children:"Οφέλη βαθμίδας"}),e.jsxs("ul",{className:"text-white/80 text-sm space-y-2",children:[e.jsx("li",{children:"🟣 Explorer — Βασική πρόσβαση, ρόλος στην κοινότητα, παρακολούθηση προόδου"}),e.jsx("li",{children:"🔵 Builder — Ξεκλείδωσε προχωρημένα μαθήματα, πρώιμες προτάσεις DAO"}),e.jsx("li",{children:"🟡 Architect — Πλήρης πρόσβαση DAO, beta δυνατότητες, προτεραιότητα σε σήματα"})]}),e.jsx("p",{className:"text-white/70 text-sm mt-4",children:"Πώς να αναβαθμίσεις τη βαθμίδα σου:"}),e.jsxs("ul",{className:"text-white/80 text-sm space-y-1 mt-1",children:[e.jsx("li",{children:"• Ολοκλήρωσε μαθήματα και κουίζ για να κερδίσεις XP."}),e.jsx("li",{children:"• Επεστρέφε τακτικά και ολοκλήρωσε τις διαδρομές μάθησης."}),e.jsx("li",{children:"• Συμμετέχεις σε δράσεις της κοινότητας / DAO (μελλοντικά)."})]}),e.jsx("button",{onClick:()=>_(!1),className:"mt-5 w-full py-2 rounded-xl bg-white/10 hover:bg-white/40 transition text-white font-semibold text-sm tracking-wide",children:"Κλείσιμο"})]})})]})})}export{Ge as default};
