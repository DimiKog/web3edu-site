import{u as ue,r as d,j as e}from"./vendor-react-XZtyZRd7.js";import{s as he,P as be}from"./index-Rnn1tWvM.js";import{I as fe,D as p,F as g,a as O,b as ge,X as we,c as z,L as je,d as ke,e as ve}from"./IdentityCard-53DPjz3n.js";import{u as Ne}from"./vendor-web3-Dys35WFk.js";import"./identity-icon-MXImXT_G.js";function Ee(){const{address:u,isConnected:N}=Ne(),c=ue(),[r,X]=d.useState(null),[G,y]=d.useState(!1),[q,B]=d.useState(!1),w=d.useRef(null),[h,W]=d.useState(null),[A,M]=d.useState(null),[J,L]=d.useState(!1),[C,U]=d.useState(localStorage.getItem("web3edu-builder-claimed")==="true"),[K,E]=d.useState(!1),V=d.useRef(null),H={tier:"Explorer",xp:0,xpPercent:0,remainingXp:0,nextTierPercent:0,lessonsCompleted:0},Q=r&&typeof r=="object"&&!Array.isArray(r)?r:{},F={...H,...Q},Y=(()=>{const t=F||{},a=h||{},i=[...Array.isArray(t.attributes)?t.attributes:[],...Array.isArray(a.attributes)?a.attributes:[]].some(m=>(m?.trait_type||"").toLowerCase()==="founder"&&(m?.value===!0||String(m?.value).toLowerCase()==="true"));return t.founder===!0||a.founder===!0||t.edition==="Founder Edition"||a.edition==="Founder Edition"||t.role==="Founder"||a.role==="Founder"||i})();d.useEffect(()=>{N||c("/join-gr"),window.scrollTo(0,0)},[N,c]);const k=he(u),Z=t=>{const a=[t?.tokenId,t?.token_id,t?.tokenID,t?.metadata?.tokenId,t?.metadata?.token_id,t?.profile?.tokenId,t?.profile?.token_id,t?.metadata?.metadata?.tokenId,t?.metadata?.metadata?.token_id,t?.profile?.metadata?.tokenId,t?.profile?.metadata?.token_id];for(const s of a)if(s!=null&&s!=="")return s;return null};d.useEffect(()=>{if(!u)return;fetch(`https://web3edu-api.dimikog.org/web3sbt/resolve/${u}`).then(a=>{if(!a.ok)throw new Error(`HTTP ${a.status}`);return a.json()}).then(a=>{const s=a?.metadata?.metadata&&typeof a.metadata.metadata=="object"?a.metadata.metadata:a?.metadata&&typeof a.metadata=="object"?a.metadata:{},i=a?.profile?.metadata&&typeof a.profile.metadata=="object"?a.profile.metadata:a?.profile&&typeof a.profile=="object"?a.profile:{};X({...s,tokenId:Z(a)});const m=o=>{if(typeof o=="string")try{return JSON.parse(o)}catch{return null}return o},R=o=>{const ce=[o?.attributes,o?.attribute,o?.attrs,o?.traits,o?.traits_array,o?.traitsArray,o?.attributes_json,o?.attributesJson];for(const xe of ce){const f=m(xe);if(Array.isArray(f))return f;if(f&&typeof f=="object")return Object.entries(f).map(([me,pe])=>({trait_type:me,value:pe}))}return[]},se=R(s),le=R(i),b=[...se,...le],I=i.role||s.role,$=i.specialization||i.speciality||s.specialization||s.speciality,ie=b.some(o=>(o.trait_type||"").toLowerCase()==="role"),ne=b.some(o=>["specialization","speciality"].includes((o.trait_type||"").toLowerCase()));!ie&&I&&b.push({trait_type:"Role",value:I}),!ne&&$&&b.push({trait_type:"Specialization",value:$});const oe=i.image&&i.image.trim()!==""?i.image:i.avatar&&i.avatar.trim()!==""?i.avatar:s.image&&s.image.trim()!==""?s.image:s.avatar&&s.avatar.trim()!==""?s.avatar:null,de={...s,...i,name:i.name||s.name||k||"Web3Edu Identity",image:oe,attributes:b};W(de),M(new Date)}).catch(a=>{console.error("Failed to fetch metadata:",a)})},[u,k]),d.useEffect(()=>{if(!r||typeof r.xp!="number")return;let t;return w.current==null||r.xp>w.current&&(B(!0),t=setTimeout(()=>B(!1),1200)),w.current=r.xp,()=>{t&&clearTimeout(t)}},[r]),d.useEffect(()=>{const t=r?.tier;if(t)try{localStorage.setItem("web3edu-tier",t)}catch(a){console.error("Failed to persist tier in localStorage:",a)}},[r?.tier]),d.useEffect(()=>{r?.tier&&(r.tier==="Builder"&&!C&&L(!0),V.current=r.tier)},[r?.tier,C]);const ee={type:"guide",title:"Ξεκίνα εδώ — Οδηγός Web3Edu",slug:"start-here-gr",why:"Αυτός ο σύντομος οδηγός εξηγεί πώς λειτουργεί το Web3Edu και σε βοηθά να επιλέξεις το επόμενο βήμα.",estimatedTime:5},j=r&&typeof r.recommendedNext=="object"?r.recommendedNext:null,_=j&&(j.title||j.slug),l=_?j:ee,S=!_,P=!!l?.builderRequired,T=l?.slug?.endsWith("-gr")?l.slug.replace(/-gr$/,""):l?.slug,te={lab01:"Lab 01 — Πορτοφόλια & Web3 Ταυτότητες","wallets-keys":"Lab 01 — Πορτοφόλια & Web3 Ταυτότητες",lab02:"Lab 02 — Κρυπτογραφημένα Μηνύματα",lab03:"Lab 03 — Υπογραφή Μηνυμάτων & Ιδιοκτησία",lab04:"Lab 04 — Συναλλαγές & Gas",lab05:"Lab 05 — Έξυπνα Συμβόλαια & Κατάσταση",lab06:"Lab 06 — Συναίνεση & Οριστικότητα",dao01:"DAO Lab 01 — Διακυβέρνηση & Ψηφοφορία","dao-01":"DAO Lab 01 — Διακυβέρνηση & Ψηφοφορία",dao02:"DAO Lab 02 — Μοντέλα Διακυβέρνησης & Δυναμικές Ισχύος","dao-02":"DAO Lab 02 — Μοντέλα Διακυβέρνησης & Δυναμικές Ισχύος","proof-of-escape":"Lab 01 — Proof of Escape",poe:"Lab 01 — Proof of Escape"},re=(r?.timeline||[]).map(t=>{if(!t||t.type!=="lab")return t;const a=String(t.id||t.slug||"").toLowerCase(),s=te[a];return s?typeof t.title=="object"&&t.title!==null?{...t,title:{...t.title,gr:t.title.gr||s}}:{...t,title:s}:t}),n=r?.builderChecklist||null,[D,ae]=d.useState(r?.tier&&r.tier!=="Explorer"),v=Array.isArray(r?.eventBadges)?r.eventBadges:[],x=v.some(t=>{if(typeof t=="string")return t.toLowerCase().includes("genesis");const a=String(t?.name||t?.label||t?.en||t?.gr||"").toLowerCase(),s=String(t?.id||t?.slug||"").toLowerCase();return a.includes("genesis")||s.includes("genesis")});return e.jsx(be,{children:e.jsxs("div",{className:`
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
                `}),e.jsxs("div",{className:"absolute inset-0 pointer-events-none",children:[e.jsx("div",{className:"absolute top-[18%] left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-purple-600/30 dark:bg-purple-600/20 blur-[130px] rounded-full"}),e.jsx("div",{className:"absolute bottom-[15%] right-[25%] w-[340px] h-[340px] bg-indigo-400/30 dark:bg-indigo-500/20 blur-[140px] rounded-full"})]}),h&&e.jsxs("div",{className:`
            relative z-10 w-full max-w-5xl mx-auto text-center
            mt-4 mb-16 animate-[fadeSlideUp_0.6s_ease-out]
        `,children:[e.jsx("div",{className:"flex justify-center mb-3",children:e.jsxs("div",{className:"relative",children:[e.jsx("img",{src:h.image||"/icons/web3edu-identity.png",alt:"avatar",className:`
                        w-14 h-14 rounded-full object-cover shadow-md 
                        border border-white/20 dark:border-white/10 
                        transition-all duration-700
                        dark:animate-[shine_3.4s_ease-in-out_infinite]
                    `,loading:"lazy"}),e.jsx("div",{className:`
                        absolute inset-0 rounded-full 
                        dark:bg-white/5 blur-md 
                        dark:animate-[shineGlow_3.4s_ease-in-out_infinite]
                    `})]})}),e.jsxs("h2",{className:"text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-3",children:["Καλώς ήρθες πάλι, ",h.name||k," 👋",r?.tier&&e.jsx("span",{className:`
                inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                bg-gradient-to-r from-purple-600/80 to-fuchsia-500/80
                dark:from-purple-500/60 dark:to-fuchsia-400/60
                text-white shadow-md border border-white/10
            `,children:r.tier})]}),A&&e.jsxs("p",{className:"text-xs text-slate-500 dark:text-slate-400 mt-1",children:["🕒 Συγχρονίστηκε πριν ",Math.max(1,Math.floor((Date.now()-A.getTime())/1e3))," δευτ • Ταυτότητα Web3Edu"]}),e.jsx("p",{className:"mt-2 text-sm text-slate-600 dark:text-slate-300",children:"Κάνε mint την Ταυτότητα Web3Edu για να αποθηκεύσεις τη μάθησή σου on-chain."}),e.jsx("div",{className:`
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
            `})]}),J&&e.jsx("div",{className:"relative z-10 w-full max-w-4xl mx-auto mb-10 px-4",children:e.jsxs("div",{className:`
                            rounded-3xl border border-purple-400/40
                            bg-gradient-to-br from-purple-600/20 via-indigo-600/20 to-fuchsia-600/20
                            backdrop-blur-xl shadow-2xl p-8 text-center
                            animate-[xpBurst_1.2s_ease-out]
                        `,children:[e.jsx("h2",{className:"text-2xl font-extrabold text-white mb-3",children:"🏗️ Ξεκλειδώθηκε το επίπεδο Builder"}),e.jsxs("p",{className:"text-sm text-slate-200 mb-6",children:["Ολοκλήρωσες τις βασικές απαιτήσεις και ξεκλείδωσες το επίπεδο",e.jsx("span",{className:"font-semibold text-purple-300",children:" Builder "}),". Πλέον μπορείς να συμμετέχεις σε προχωρημένες διαδρομές διακυβέρνησης."]}),K?e.jsxs("div",{className:`
                                        px-6 py-3 rounded-xl
                                        bg-green-600/90 text-white font-semibold
                                        shadow-lg animate-[xpBurst_1.2s_ease-out]
                                        flex flex-col items-center gap-1
                                    `,children:[e.jsx("span",{children:"✅ Το Builder Badge κατοχυρώθηκε"}),e.jsx("span",{className:"text-[11px] opacity-90",children:"Επόμενος στόχος: Βαθμίδα Architect"})]}):e.jsx("button",{onClick:()=>{localStorage.setItem("web3edu-builder-claimed","true"),U(!0),E(!0),setTimeout(()=>{L(!1),E(!1)},1400)},className:`
                                        px-6 py-3 rounded-xl
                                        bg-gradient-to-r from-purple-500 to-indigo-500
                                        text-white font-semibold
                                        hover:scale-105 transition shadow-lg
                                    `,children:"Διεκδίκησε το Builder Badge"})]})}),e.jsxs("div",{className:"relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 px-2 md:px-0",children:[e.jsxs("div",{className:"flex flex-col items-center justify-start mt-10 lg:mt-0 relative self-center",children:[e.jsx("div",{className:"absolute -z-10 top-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-purple-500/25 dark:bg-purple-500/20 blur-[200px] rounded-full"}),h&&e.jsx(fe,{metadata:h,wallet:u,tokenId:F.tokenId})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-8 md:gap-8",children:[Y&&e.jsx(p,{title:"Σήμα Ιδρυτή",className:`
                                    rounded-2xl border border-fuchsia-300/30 dark:border-fuchsia-700/30
                                    bg-gradient-to-br from-white/95 via-fuchsia-50/70 to-slate-100/90
                                    dark:from-[#110819]/90 dark:via-[#1a0f21]/85 dark:to-[#0c0814]/90
                                    backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                                    hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                                `,icon:e.jsx(g,{className:"w-5 h-5 text-white"}),children:e.jsxs("p",{className:"text-sm text-slate-700 dark:text-slate-300 leading-relaxed",children:["Κατέχεις ένα"," ",e.jsx("span",{className:"font-semibold text-fuchsia-600 dark:text-fuchsia-400",children:"Founder SBT"}),". Μια ειδική αναγνώριση για τους βασικούς δημιουργούς του Web3Edu."]})}),e.jsx(p,{title:"Το πορτοφόλι σου",className:`
                                rounded-2xl border border-cyan-300/30 dark:border-cyan-700/30
                                bg-gradient-to-br from-white/95 via-cyan-50/70 to-slate-100/90
                                dark:from-[#071d24]/90 dark:via-[#0a2730]/85 dark:to-[#06151a]/90
                                backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                                hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                            `,icon:e.jsx(O,{className:"w-5 h-5 text-white"}),children:e.jsx("p",{className:"text-sm font-mono text-slate-700 dark:text-slate-300 break-all",children:u??"—"})}),e.jsx(p,{title:"Βαθμίδα",className:`
                                rounded-2xl border border-purple-300/30 dark:border-purple-700/30
                                bg-gradient-to-br from-white/95 via-purple-50/70 to-slate-100/90
                                dark:from-[#160f2a]/90 dark:via-[#120c23]/85 dark:to-[#0b0816]/90
                                backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                                hover:scale-[1.005] hover:shadow-2xl transition-all duration-500 relative
                            `,icon:e.jsx(ge,{className:"w-5 h-5 text-white"}),children:e.jsxs("div",{className:"flex flex-col items-start gap-3 cursor-pointer",onClick:()=>y(!0),children:[e.jsxs("div",{className:`
                                        inline-flex items-center gap-2 
                                        px-3 py-1 rounded-full
                                        bg-purple-100/70 dark:bg-purple-900/40
                                        border border-purple-300/40 dark:border-purple-600/60
                                    `,children:[e.jsx("span",{className:"inline-flex h-2.5 w-2.5 rounded-full bg-purple-500 dark:bg-purple-400"}),e.jsx("span",{className:"text-[11px] font-semibold tracking-[0.14em] uppercase text-purple-700 dark:text-purple-200",children:"Τρέχουσα βαθμίδα"})]}),e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsxs("div",{className:"flex items-baseline gap-2",children:[e.jsx("p",{className:`
                                                text-2xl font-extrabold text-purple-700 dark:text-purple-200
                                                ${r?.tier==="Builder"?"animate-[xpBurst_1.2s_ease-out]":""}
                                            `,children:r?.tier??"Explorer"}),r?.tier&&r.tier!=="Explorer"&&e.jsx("span",{className:"text-[11px] font-medium text-purple-500/90 dark:text-purple-300/90",children:r.tier==="Builder"?"Σε πορεία για DAO":"Έτοιμος για διακυβέρνηση DAO"})]}),r?.tier&&r.tier!=="Architect"&&e.jsx("div",{className:"mt-2 text-xs text-slate-600/90 dark:text-slate-400/90",children:(()=>{const t=r.tier,a=r?.remainingXp??0;let s="Builder";return t==="Builder"&&(s="Architect"),e.jsxs("span",{children:["Επόμενη βαθμίδα:"," ",e.jsx("span",{className:"font-semibold text-purple-600 dark:text-purple-300",children:s})," ","• απομένουν ",a," XP"]})})()}),e.jsx("p",{className:"text-xs text-slate-600/90 dark:text-slate-400/90",children:"Κέρδισε XP από μαθήματα και κουίζ για να αναβαθμίσεις τη βαθμίδα σου."}),e.jsx("p",{className:"mt-2 text-xs text-slate-600/90 dark:text-slate-400/90",children:r?.tier==="Builder"||r?.tier==="Architect"?"Η πρόσβαση στη διακυβέρνηση DAO είναι ξεκλειδωμένη στη βαθμίδα σου.":"Φτάσε τη βαθμίδα Builder για να ξεκλειδώσεις πρόσβαση στη διακυβέρνηση DAO."}),e.jsx("div",{className:"mt-2 text-xs font-semibold",children:r?.tier==="Builder"||r?.tier==="Architect"?e.jsx("span",{className:"text-green-600 dark:text-green-400",children:"🟢 Πρόσβαση Διακυβέρνησης: Ενεργή"}):e.jsx("span",{className:"text-slate-500 dark:text-slate-400",children:"🔒 Πρόσβαση Διακυβέρνησης: Κλειδωμένη"})}),r?.tier==="Builder"&&e.jsx("p",{className:"text-[11px] mt-1 text-slate-500 dark:text-slate-400",children:"Η βαθμίδα Architect ξεκλειδώνει δημοσίευση προτάσεων και προχωρημένα εργαλεία διακυβέρνησης."})]})]})}),e.jsx(p,{title:"Πρόοδος",className:`
                            rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                            bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                            dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                            dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                            hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                        `,icon:e.jsx(g,{className:"w-5 h-5 text-white"}),children:e.jsx(we,{xp:r?.xp??0,xpPercent:r?.xpPercent??0,remainingXp:r?.remainingXp??0,nextTierPercent:r?.nextTierPercent??0,tier:r?.tier??"Explorer",xpLeveledUp:q,lang:"gr"})}),e.jsxs(p,{title:"Ενέργειες",className:`
                            rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                            bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                            dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                            dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                            hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                        `,icon:e.jsx(z,{className:"w-5 h-5 text-white"}),children:[e.jsx("p",{className:"text-sm text-slate-700 dark:text-slate-200 mb-4 leading-relaxed",children:"Εδώ θα βρεις τις βασικές ενέργειες για την ταυτότητα και το ταξίδι μάθησής σου στο Web3Edu."}),e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx("button",{onClick:()=>c("/sbt-view"),className:"py-3 px-6 rounded-xl bg-gradient-to-r from-[#7F3DF1] to-[#5F2BD8] text-white hover:scale-[1.03] hover:opacity-90 transition font-semibold shadow-md",children:"Δες το SBT μου"}),e.jsx("button",{onClick:()=>c("/labs-gr"),className:"py-3 px-6 rounded-xl bg-gradient-to-r from-[#33D6FF] to-[#24A9D0] text-white hover:scale-[1.03] hover:opacity-90 transition font-semibold shadow-md",children:"Ξεκίνησε τα μαθήματα"}),e.jsx("div",{className:"mt-3",children:e.jsx("button",{onClick:()=>c("/start-here-gr"),className:`
  w-full py-3 px-6 rounded-xl
  bg-gradient-to-r from-indigo-500/80 to-purple-500/80
  text-white
  hover:scale-[1.03] hover:opacity-90
  transition
  font-semibold shadow-md
`,children:"Ξεκίνα εδώ (οδηγός)"})})]})]}),e.jsxs(p,{title:"Σήματα",className:`
                            rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                            bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                            dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                            dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                            hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                        `,icon:e.jsx(g,{className:"w-5 h-5 text-white"}),children:[e.jsx("p",{className:"text-sm text-slate-700 dark:text-slate-200 mb-4 leading-relaxed",children:"Όλες οι διακρίσεις και τα σήματα που κερδίζεις θα εμφανίζονται εδώ καθώς προχωράς."}),r?.badges?.length>0||v.length>0?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"flex flex-wrap gap-2",children:[r?.badges?.map((t,a)=>{let s=g;const i=typeof t=="string"?t.toLowerCase():t?.label?.toLowerCase?.()||t?.en?.toLowerCase?.()||t?.gr?.toLowerCase?.()||"";return i.includes("wallet")&&(s=O),i.includes("lesson")&&(s=ke),i.includes("quiz")&&(s=ve),e.jsxs("span",{className:`
                                                        inline-flex items-center gap-2 
                                                        px-3 py-1 rounded-full 
                                                        text-xs font-semibold
                                                        bg-indigo-200/60 dark:bg-indigo-900/40
                                                        border border-indigo-300/30 dark:border-indigo-700/30
                                                        text-slate-900 dark:text-slate-100
                                                    `,children:[e.jsx(s,{className:"w-4 h-4 text-white/90"}),typeof t=="string"?t:t?.gr||t?.en||t?.label||JSON.stringify(t)]},`badge-${a}-${typeof t=="string"?t:t?.id||"badge"}`)}),v.map((t,a)=>{const s=typeof t=="string"?t:t?.name||"Σήμα Εκδήλωσης",m=String(s).toLowerCase().includes("genesis");return e.jsxs("span",{className:`
                                                        inline-flex items-center gap-2
                                                        px-3 py-1 rounded-full
                                                        text-xs font-semibold
                                                        ${m?"bg-gradient-to-r from-purple-500/80 to-fuchsia-500/80 text-white border border-purple-300/40 shadow-[0_0_10px_rgba(168,85,247,0.6)] animate-[genesisPulse_0.9s_ease-out]":"bg-purple-200/70 dark:bg-purple-900/40 border border-purple-300/40 dark:border-purple-700/40 text-slate-900 dark:text-slate-100"}
                                                    `,children:[e.jsx(g,{className:`w-4 h-4 ${m?"text-yellow-300":"text-white/90"}`}),s]},`event-badge-${a}`)})]}),e.jsx("div",{className:"w-full mt-4",children:e.jsx("button",{disabled:x,onClick:()=>{x||c("/events/genesis")},className:`
                                                w-full py-2 px-4 rounded-lg
                                                text-xs font-semibold transition shadow-md
                                                ${x?"bg-green-500 text-white cursor-default":"bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:scale-[1.02]"}
                                            `,children:x?"Το Genesis Badge έγινε mint ✓":"Κάνε mint το Genesis Event Badge"})})]}):e.jsxs(e.Fragment,{children:[e.jsx("p",{className:"text-slate-600 dark:text-slate-300",children:"Δεν υπάρχουν σήματα ακόμη…"}),e.jsx("div",{className:"w-full mt-4",children:e.jsx("button",{disabled:x,onClick:()=>{x||c("/events/genesis")},className:`
                                                w-full py-2 px-4 rounded-lg
                                                text-xs font-semibold transition shadow-md
                                                ${x?"bg-green-500 text-white cursor-default":"bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:scale-[1.02]"}
                                            `,children:x?"Το Genesis Badge έγινε mint ✓":"Κάνε mint το Genesis Event Badge"})})]})]})]})]}),l&&e.jsx("div",{className:"relative z-10 w-full max-w-6xl mx-auto mt-6 mb-8 px-2 md:px-0",children:e.jsxs(p,{title:"Προτεινόμενο επόμενο βήμα",className:`
                rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                dark:border-white/10 backdrop-blur-xl shadow-xl
                hover:scale-[1.002] hover:shadow-2xl transition-all duration-500
            `,icon:e.jsx(z,{className:"w-5 h-5 text-white"}),children:[n&&e.jsxs("div",{className:`mb-4 rounded-xl border border-purple-300/30 dark:border-purple-700/40 
                                                bg-purple-50/70 dark:bg-purple-900/20 p-4`,children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx("span",{className:"text-xs font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-300",children:"🏗 Διαδρομή Builder"}),r?.tier==="Explorer"&&e.jsx("button",{onClick:t=>{t.stopPropagation(),ae(a=>!a)},className:"text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline",children:D?"Απόκρυψη λεπτομερειών":"Δες απαιτήσεις"}),r?.tier!=="Explorer"&&(n.coreLabs?.done&&n.daoLabs?.done&&n.proofOfEscape?.done&&n.xpRequirement?.done?e.jsx("span",{className:"text-green-600 dark:text-green-400 text-xs font-semibold",children:"✔ Builder Ξεκλειδώθηκε"}):e.jsx("span",{className:"text-xs text-slate-500 dark:text-slate-400",children:"Σε εξέλιξη"}))]}),D&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs",children:[e.jsxs("div",{children:[n.coreLabs?.done?"✔":"⏳"," Core Labs (",n.coreLabs?.completed,"/",n.coreLabs?.required,")"]}),e.jsxs("div",{children:[n.daoLabs?.done?"✔":"⏳"," DAO Labs (",n.daoLabs?.completed,"/",n.daoLabs?.required,")"]}),e.jsxs("div",{children:[n.proofOfEscape?.done?"✔":"⏳"," Proof of Escape"]}),e.jsxs("div",{children:[n.xpRequirement?.done?"✔":"⏳"," XP (",n.xpRequirement?.current,"/",n.xpRequirement?.required,")"]})]}),(()=>{const a=(n.coreLabs?.done?1:0)+(n.daoLabs?.done?1:0)+(n.proofOfEscape?.done?1:0),s=Math.round(a/3*100);return e.jsxs("div",{className:"mt-4",children:[e.jsxs("div",{className:"flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1",children:[e.jsx("span",{children:"Πρόοδος Builder"}),e.jsxs("span",{children:[a,"/",3," απαιτήσεις"]})]}),e.jsx("div",{className:"w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden",children:e.jsx("div",{className:"h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500",style:{width:`${s}%`}})})]})})()]})]}),e.jsxs("div",{className:"space-y-3 cursor-pointer",onClick:()=>{if(l.type==="guide"&&l.slug){c(`/${l.slug}`);return}if(l.type==="lab"&&T){c(`/labs-gr/${T}`);return}if(l.type==="lesson"&&l.slug){c(`/lessons/${l.slug}`);return}c("/education-gr")},children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("p",{className:"text-xs uppercase tracking-wide text-indigo-600 dark:text-indigo-400 font-semibold",children:S?"Ξεκίνα από εδώ":"Προτείνεται για εσένα"}),P&&e.jsx("span",{className:`
                                            inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold
                                            bg-purple-100/80 dark:bg-purple-900/40
                                            border border-purple-300/40 dark:border-purple-600/60
                                            text-purple-700 dark:text-purple-300
                                        `,children:"🏗 Διαδρομή Builder"}),P&&e.jsx("span",{className:`
                                            text-[10px] font-medium text-slate-500 dark:text-slate-400
                                        `,children:"Τελική απαίτηση Builder"})]}),e.jsx("p",{className:"text-xl font-bold text-slate-900 dark:text-white leading-snug",children:typeof l.title=="object"?l.title.gr||l.title.en:l.title}),l.why&&e.jsxs("div",{className:"mt-1",children:[e.jsx("p",{className:"text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-500 mb-1",children:S?"Προτεινόμενο πρώτο βήμα":"Γιατί προτείνεται"}),e.jsx("p",{className:"text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl",children:typeof l.why=="object"?l.why.gr||l.why.en:l.why})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-6 pt-1 text-sm text-slate-600 dark:text-slate-400",children:[l.estimatedTime&&e.jsxs("span",{children:["⏱ ",l.estimatedTime," λεπτά"]}),l.xp&&e.jsxs("span",{children:["🏅 +",l.xp," XP"]})]}),e.jsx("div",{className:"pt-2",children:e.jsx("span",{className:"inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400",children:"Συνέχισε →"})})]})]})}),e.jsx("div",{className:"relative z-10 w-full max-w-6xl mx-auto mt-12 px-2 md:px-0",children:e.jsx(je,{timeline:re,lang:"gr"})}),e.jsx("div",{className:`pointer-events-none fixed top-0 right-0 w-[300px] h-full
                                bg-gradient-to-b from-[#8A57FF]/35 via-[#4ACBFF]/25 to-[#FF67D2]/35
                                blur-[160px] opacity-60`}),G&&e.jsx("div",{className:"fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50",children:e.jsxs("div",{className:"bg-[#0f0f17] p-6 rounded-2xl w-80 border border-white/10 shadow-xl",children:[e.jsx("h2",{className:"text-xl font-bold mb-3 flex items-center gap-2",children:"Οφέλη βαθμίδας"}),e.jsxs("ul",{className:"text-white/80 text-sm space-y-2",children:[e.jsx("li",{children:"🟣 Explorer — Βασική πρόσβαση, ρόλος στην κοινότητα, παρακολούθηση προόδου"}),e.jsx("li",{children:"🔵 Builder — Ξεκλείδωσε προχωρημένα μαθήματα, πρώιμες προτάσεις DAO"}),e.jsx("li",{children:"🟡 Architect — Πλήρης πρόσβαση DAO, beta δυνατότητες, προτεραιότητα σε σήματα"})]}),e.jsx("p",{className:"text-white/70 text-sm mt-4",children:"Πώς να αναβαθμίσεις τη βαθμίδα σου:"}),e.jsxs("ul",{className:"text-white/80 text-sm space-y-1 mt-1",children:[e.jsx("li",{children:"• Ολοκλήρωσε μαθήματα και κουίζ για να κερδίσεις XP."}),e.jsx("li",{children:"• Επεστρέφε τακτικά και ολοκλήρωσε τις διαδρομές μάθησης."}),e.jsx("li",{children:"• Συμμετέχεις σε δράσεις της κοινότητας / DAO (μελλοντικά)."})]}),e.jsx("button",{onClick:()=>y(!1),className:"mt-5 w-full py-2 rounded-xl bg-white/10 hover:bg-white/40 transition text-white font-semibold text-sm tracking-wide",children:"Κλείσιμο"})]})})]})})}export{Ee as default};
