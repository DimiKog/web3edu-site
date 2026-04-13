import{u as Se,r as u,j as e}from"./vendor-react-DIuPT6mD.js";import{s as Fe,e as Le,k as Re,l as Te,g as Ie,o as $e,i as De,P as ze}from"./index-BbInCxma.js";import{I as Me,D as w,F as v,a as V,b as Oe,X as Xe,c as Q,L as qe,d as Ue,e as Ge}from"./IdentityCard-Byf--F2U.js";import{p as R}from"./projectService-8Q84jcWp.js";import{u as We}from"./vendor-web3-ZWswquZB.js";import"./identity-icon-MXImXT_G.js";const Z=n=>{if(!n)return 0;const o=Date.parse(n);return Number.isFinite(o)?o:0},ee=n=>R.find(o=>o.id===n)||null,Je={"proof-of-escape":{id:"proof-of-escape",backendId:"proof-of-escape",type:"proof-of-escape",title:"Lab 01 — Proof of Escape",xp:500},poe:{id:"proof-of-escape",backendId:"proof-of-escape",type:"proof-of-escape",title:"Lab 01 — Proof of Escape",xp:500}},Ke=(n,o)=>{const d=[n,o?.id,o?.projectId,o?.project_id,o?.backendId,o?.backend_id,o?.type].filter(Boolean),t=R.find(h=>d.some(f=>f===h.id||f===h.backendId||f===h.type));return t||d.map(h=>Je[String(h).toLowerCase()]).find(Boolean)||null},se=n=>typeof n=="string"?n.replace(/-gr$/,""):null,Ye={lab01:"/labs/wallets-keys","wallets-keys":"/labs/wallets-keys",lab02:"/labs/lab02",lab03:"/labs/lab03",lab04:"/labs/lab04",lab05:"/labs/lab05",lab06:"/labs/lab06",dao01:"/labs/dao-01","dao-01":"/labs/dao-01",dao02:"/labs/dao-02","dao-02":"/labs/dao-02","system-s0":"/labs/system/s0","system/s0":"/labs/system/s0","system-byzantine-generals":"/labs/system/s0","system-s1":"/labs/system/s1","system/s1":"/labs/system/s1","system-s2":"/labs/system/s2","system/s2":"/labs/system/s2","system-s3":"/labs/system/s3","system/s3":"/labs/system/s3","system-s4":"/labs/system/s4","system/s4":"/labs/system/s4","proof-of-escape":"/labs/proof-of-escape"},He=n=>{if(typeof n!="string"||!n.trim())return null;if(n.startsWith("/"))return n;const o=se(n)?.replace(/^labs-gr\//,"")?.replace(/^labs\//,"");return o?Ye[o]||`/labs/${o}`:null},te=(n,o)=>!o||!n||typeof n!="object"?!1:[o.backendId,o.id,o.type].filter(Boolean).some(t=>!!n[t]),Ve=(n,o)=>{const d=n&&typeof n.recommendedNext=="object"?n.recommendedNext:null,t=o&&typeof o.recommendedNext=="object"?o.recommendedNext:null,h=f=>f&&(f.title||f.slug);return h(d)?d:h(t)?t:null},Qe=(n,o)=>{if(!n||n.type!=="project")return!1;const d=se(n.slug);if(!d)return!1;const t=R.find(h=>h.id===d||h.type===d||h.backendId===d);return t?.backendId?!!o?.[t.backendId]:!1};function lt(){const{address:n,isConnected:o}=We(),d=Se(),[t,h]=u.useState(null),[f,T]=u.useState(!1),[re,I]=u.useState(!1),N=u.useRef(null),[j,ae]=u.useState(null),[$,ne]=u.useState(null),D="web3edu-builder-unlock-shown",[oe,z]=u.useState(!1),[Ze,le]=u.useState(localStorage.getItem("web3edu-builder-claimed")==="true"),[M,ie]=u.useState(localStorage.getItem(D)==="true"),[de,O]=u.useState(!1),ce=u.useRef(null),xe={tier:"Explorer",xp_total:0,xp:0,xpPercent:0,remainingXp:0,nextTierPercent:0,lessonsCompleted:0},pe=t&&typeof t=="object"&&!Array.isArray(t)?t:{},B={...xe,...pe},me=(()=>{const s=B||{},r=j||{},x=[...Array.isArray(s.attributes)?s.attributes:[],...Array.isArray(r.attributes)?r.attributes:[]].some(i=>(i?.trait_type||"").toLowerCase()==="founder"&&(i?.value===!0||String(i?.value).toLowerCase()==="true"));return s.founder===!0||r.founder===!0||s.edition==="Founder Edition"||r.edition==="Founder Edition"||s.role==="Founder"||r.role==="Founder"||x})();u.useEffect(()=>{o||d("/join"),window.scrollTo(0,0)},[o,d]);const _=Fe(n),ue=s=>{const r=[s?.tokenId,s?.token_id,s?.tokenID,s?.metadata?.tokenId,s?.metadata?.token_id,s?.profile?.tokenId,s?.profile?.token_id,s?.metadata?.metadata?.tokenId,s?.metadata?.metadata?.token_id,s?.profile?.metadata?.tokenId,s?.profile?.metadata?.token_id];for(const a of r)if(a!=null&&a!=="")return a;return null};u.useEffect(()=>{if(!n)return;fetch(`https://web3edu-api.dimikog.org/web3sbt/resolve/${n}`).then(r=>r.ok?r.json():r.json().catch(()=>({})).then(a=>{throw Le(r.status,a)})).then(r=>{const a=Re(r),x=Te(r),i=Ve(a,x),c=Ie(r),b=$e(c),C={...a,...x};h({...C,tokenId:ue(r),xp_total:c,xp:c,tier:b.tier,xpPercent:b.xpPercent,nextTierPercent:b.nextTierPercent,remainingXp:b.remainingXp,recommendedNext:i});const L=m=>{if(typeof m=="string")try{return JSON.parse(m)}catch{return null}return m},K=m=>{const Pe=[m?.attributes,m?.attribute,m?.attrs,m?.traits,m?.traits_array,m?.traitsArray,m?.attributes_json,m?.attributesJson];for(const Ce of Pe){const y=L(Ce);if(Array.isArray(y))return y;if(y&&typeof y=="object")return Object.entries(y).map(([_e,Ee])=>({trait_type:_e,value:Ee}))}return[]},ke=K(a),ye=K(x),k=[...ke,...ye],Y=x.role||a.role,H=x.specialization||x.speciality||a.specialization||a.speciality,ve=k.some(m=>(m.trait_type||"").toLowerCase()==="role"),Ne=k.some(m=>["specialization","speciality"].includes((m.trait_type||"").toLowerCase()));!ve&&Y&&k.push({trait_type:"Role",value:Y}),!Ne&&H&&k.push({trait_type:"Specialization",value:H});const Be=x.image&&x.image.trim()!==""?x.image:x.avatar&&x.avatar.trim()!==""?x.avatar:a.image&&a.image.trim()!==""?a.image:a.avatar&&a.avatar.trim()!==""?a.avatar:null,Ae={...C,xp_total:c,xp:c,tier:b.tier,name:x.name||a.name||_||"Web3Edu Identity",image:Be,attributes:k};ae(Ae),ne(new Date)}).catch(r=>{if(De(r)){console.warn("Backend user state temporarily unavailable; preserving dashboard state.");return}console.error("Failed to fetch metadata:",r)})},[n,_]),u.useEffect(()=>{if(!t||typeof t.xp_total!="number")return;let s;return N.current==null||t.xp_total>N.current&&(I(!0),s=setTimeout(()=>I(!1),1200)),N.current=t.xp_total,()=>{s&&clearTimeout(s)}},[t]),u.useEffect(()=>{t?.tier&&((t.tier==="Builder"||t.tier==="Architect")&&!M&&(z(!0),ie(!0),localStorage.setItem(D,"true")),ce.current=t.tier)},[t?.tier,M]);const A=t?.projectsCompleted&&typeof t.projectsCompleted=="object"?t.projectsCompleted:t?.projects_completed&&typeof t.projects_completed=="object"?t.projects_completed:{},he=B?.tier==="Builder"||B?.tier==="Architect",E=ee("decrypt-message"),S=ee("tx-investigation"),be=te(A,E),fe=te(A,S),ge=(he?be?fe?null:{type:"project",slug:"tx-investigation",title:`Project #2 — ${S?.title||"Transaction Investigation"}`,why:"You completed Project #1. Continue to the next project challenge and identify which transaction contains the real encrypted payload.",estimatedTime:20,xp:S?.xp??350}:{type:"project",slug:"decrypt-message",title:`Project #1 — ${E?.title||"Find and Decrypt an On-Chain Message"}`,why:"You reached Builder. Start with the first project challenge to practice decoding event data and recovering a hidden message.",estimatedTime:15,xp:E?.xp??200}:null)||{type:"guide",title:"Start Here — Your Web3 Learning Path",slug:"start-here",why:"This short guide explains how Web3Edu works and helps you choose what to learn next.",estimatedTime:5},X=t&&typeof t.recommendedNext=="object"?t.recommendedNext:null,P=Qe(X,A)?null:X,q=P&&(P.title||P.slug),l=q?P:ge,U=!q,G=!!l?.builderRequired,W=He(l?.slug),p=t?.builderChecklist||null,we=(()=>{const s=Array.isArray(t?.timeline)?t.timeline:[],r=new Map;s.forEach((i,c)=>{if(!i)return;const b=`${i.type||"unknown"}:${i.id||i.slug||c}`;r.set(b,i)});const a=t?.labs_completed&&typeof t.labs_completed=="object"?t.labs_completed:{};Object.entries(a).forEach(([i,c])=>{r.set(`lab:${i}`,{type:"lab",id:i,title:c?.title||i,xp:c?.xp||0,badge:c?.badge,completedAt:c?.completedAt})});const x=t?.projectLabs&&typeof t.projectLabs=="object"?t.projectLabs:{};return Object.entries(A).forEach(([i,c])=>{const b=Ke(i,c),C=c?.xp??c?.xpAwarded??c?.xp_awarded??x?.[i]?.xp??b?.xp??0,L=c?.title??b?.title??c?.badge??i;r.set(`project:${i}`,{type:"project",id:i,title:L,badge:c?.badge,xp:C,completedAt:c?.completedAt})}),[...r.values()].sort((i,c)=>Z(c?.completedAt)-Z(i?.completedAt))})(),[J,je]=u.useState(t?.tier&&t.tier!=="Explorer"),F=Array.isArray(t?.eventBadges)?t.eventBadges:[],g=F.some(s=>{if(typeof s=="string")return s.toLowerCase().includes("genesis");const r=String(s?.name||s?.label||s?.en||s?.gr||"").toLowerCase(),a=String(s?.id||s?.slug||"").toLowerCase();return r.includes("genesis")||a.includes("genesis")});return e.jsx(ze,{children:e.jsxs("div",{className:`
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
                `}),e.jsxs("div",{className:"absolute inset-0 pointer-events-none",children:[e.jsx("div",{className:"absolute top-[18%] left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-purple-600/30 dark:bg-purple-600/20 blur-[130px] rounded-full"}),e.jsx("div",{className:"absolute bottom-[15%] right-[25%] w-[340px] h-[340px] bg-indigo-400/30 dark:bg-indigo-500/20 blur-[140px] rounded-full"})]}),j&&e.jsxs("div",{className:`
            relative z-10 w-full max-w-5xl mx-auto text-center
            mt-4 mb-16 animate-[fadeSlideUp_0.6s_ease-out]
        `,children:[e.jsx("div",{className:"flex justify-center mb-3",children:e.jsxs("div",{className:"relative",children:[e.jsx("img",{src:j.image||"/icons/web3edu-identity.png",alt:"avatar",className:`
                        w-14 h-14 rounded-full object-cover shadow-md 
                        border border-white/20 dark:border-white/10 
                        transition-all duration-700
                        dark:animate-[shine_3.4s_ease-in-out_infinite]
                    `,loading:"lazy"}),e.jsx("div",{className:`
                        absolute inset-0 rounded-full 
                        dark:bg-white/5 blur-md 
                        dark:animate-[shineGlow_3.4s_ease-in-out_infinite]
                    `})]})}),e.jsxs("h2",{className:"text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-3",children:["Welcome back, ",j.name||_," 👋",t?.tier&&e.jsx("span",{className:`
                inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                bg-gradient-to-r from-purple-600/80 to-fuchsia-500/80
                dark:from-purple-500/60 dark:to-fuchsia-400/60
                text-white shadow-md border border-white/10
            `,children:t.tier})]}),$&&e.jsxs("p",{className:"text-xs text-slate-500 dark:text-slate-400 mt-1",children:["🕒 Synced ",Math.max(1,Math.floor((Date.now()-$.getTime())/1e3)),"s ago • Web3Edu Identity"]}),e.jsx("p",{className:"mt-2 text-sm text-slate-600 dark:text-slate-300",children:"Mint your Web3Edu Identity to anchor your learning on-chain."}),e.jsx("div",{className:`
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
            `})]}),oe&&e.jsx("div",{className:"relative z-10 w-full max-w-4xl mx-auto mb-10 px-4",children:e.jsxs("div",{className:`
                            rounded-3xl border border-purple-400/40
                            bg-gradient-to-br from-purple-600/20 via-indigo-600/20 to-fuchsia-600/20
                            backdrop-blur-xl shadow-2xl p-8 text-center
                            animate-[xpBurst_1.2s_ease-out]
                        `,children:[e.jsx("h2",{className:"text-2xl font-extrabold text-white mb-3",children:"🏗️ Builder Level Unlocked"}),e.jsxs("p",{className:"text-sm text-slate-200 mb-6",children:["You have completed the core requirements and unlocked",e.jsx("span",{className:"font-semibold text-purple-300",children:" Builder "}),"status. You are now eligible to participate in advanced governance tracks."]}),de?e.jsxs("div",{className:`
                                        px-6 py-3 rounded-xl
                                        bg-green-600/90 text-white font-semibold
                                        shadow-lg animate-[xpBurst_1.2s_ease-out]
                                        flex flex-col items-center gap-1
                                    `,children:[e.jsx("span",{children:"✅ Builder Badge Claimed"}),e.jsx("span",{className:"text-[11px] opacity-90",children:"Next milestone: Architect Tier"})]}):e.jsx("button",{onClick:()=>{localStorage.setItem("web3edu-builder-claimed","true"),le(!0),O(!0),setTimeout(()=>{z(!1),O(!1)},1400)},className:`
                                        px-6 py-3 rounded-xl
                                        bg-gradient-to-r from-purple-500 to-indigo-500
                                        text-white font-semibold
                                        hover:scale-105 transition shadow-lg
                                    `,children:"Claim Builder Badge"})]})}),e.jsxs("div",{className:"relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 px-2 md:px-0",children:[e.jsxs("div",{className:"flex flex-col items-center justify-start mt-10 lg:mt-0 relative self-center",children:[e.jsx("div",{className:"absolute -z-10 top-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-purple-500/25 dark:bg-purple-500/20 blur-[200px] rounded-full"}),j&&e.jsx(Me,{metadata:j,wallet:n,tokenId:B.tokenId})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-8 md:gap-8",children:[me&&e.jsx(w,{title:"Founder Badge",className:`
                                    rounded-2xl border border-fuchsia-300/30 dark:border-fuchsia-700/30
                                    bg-gradient-to-br from-white/95 via-fuchsia-50/70 to-slate-100/90
                                    dark:from-[#110819]/90 dark:via-[#1a0f21]/85 dark:to-[#0c0814]/90
                                    backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                                    hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                                `,icon:e.jsx(v,{className:"w-5 h-5 text-white"}),children:e.jsxs("p",{className:"text-sm text-slate-700 dark:text-slate-300 leading-relaxed",children:["You hold a"," ",e.jsx("span",{className:"font-semibold text-fuchsia-600 dark:text-fuchsia-400",children:"Founder SBT"}),". A special recognition for the core creators of Web3Edu."]})}),e.jsx(w,{title:"Your Wallet",className:`
                                rounded-2xl border border-cyan-300/30 dark:border-cyan-700/30
                                bg-gradient-to-br from-white/95 via-cyan-50/70 to-slate-100/90
                                dark:from-[#071d24]/90 dark:via-[#0a2730]/85 dark:to-[#06151a]/90
                                backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                                hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                            `,icon:e.jsx(V,{className:"w-5 h-5 text-white"}),children:e.jsx("p",{className:"text-sm font-mono text-slate-700 dark:text-slate-300 break-all",children:n??"—"})}),e.jsx(w,{title:"Rank",className:`
                                rounded-2xl border border-purple-300/30 dark:border-purple-700/30
                                bg-gradient-to-br from-white/95 via-purple-50/70 to-slate-100/90
                                dark:from-[#160f2a]/90 dark:via-[#120c23]/85 dark:to-[#0b0816]/90
                                backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                                hover:scale-[1.005] hover:shadow-2xl transition-all duration-500 relative
                            `,icon:e.jsx(Oe,{className:"w-5 h-5 text-white"}),children:e.jsxs("div",{className:"flex flex-col items-start gap-3 cursor-pointer",onClick:()=>T(!0),children:[e.jsxs("div",{className:`
                                        inline-flex items-center gap-2 
                                        px-3 py-1 rounded-full
                                        bg-purple-100/70 dark:bg-purple-900/40
                                        border border-purple-300/40 dark:border-purple-600/60
                                    `,children:[e.jsx("span",{className:"inline-flex h-2.5 w-2.5 rounded-full bg-purple-500 dark:bg-purple-400"}),e.jsx("span",{className:"text-[11px] font-semibold tracking-[0.14em] uppercase text-purple-700 dark:text-purple-200",children:"Current Tier"})]}),e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsxs("div",{className:"flex items-baseline gap-2",children:[e.jsx("p",{className:`
                                                text-2xl font-extrabold text-purple-700 dark:text-purple-200
                                                ${t?.tier==="Builder"?"animate-[xpBurst_1.2s_ease-out]":""}
                                            `,children:t?.tier??"Explorer"}),t?.tier&&t.tier!=="Explorer"&&e.jsx("span",{className:"text-[11px] font-medium text-purple-500/90 dark:text-purple-300/90",children:t.tier==="Builder"?"DAO-ready in progress":"DAO governance ready"})]}),t?.tier&&t.tier!=="Architect"&&e.jsx("div",{className:"mt-2 text-xs text-slate-600/90 dark:text-slate-400/90",children:(()=>{const s=t.tier,r=t?.remainingXp??0;let a="Builder";return s==="Builder"&&(a="Architect"),e.jsxs("span",{children:["Next Tier:"," ",e.jsx("span",{className:"font-semibold text-purple-600 dark:text-purple-300",children:a})," ","• ",r," XP remaining"]})})()}),e.jsx("p",{className:"text-xs text-slate-600/90 dark:text-slate-400/90",children:"Earn XP from lessons and quizzes to upgrade your tier."}),e.jsx("p",{className:"mt-2 text-xs text-slate-600/90 dark:text-slate-400/90",children:t?.tier==="Builder"||t?.tier==="Architect"?"DAO governance access unlocked at your current tier.":"Reach Builder tier to unlock DAO governance access."}),e.jsx("div",{className:"mt-2 text-xs font-semibold",children:t?.tier==="Builder"||t?.tier==="Architect"?e.jsx("span",{className:"text-green-600 dark:text-green-400",children:"🟢 Governance Access: Active"}):e.jsx("span",{className:"text-slate-500 dark:text-slate-400",children:"🔒 Governance Access: Locked"})}),t?.tier==="Builder"&&e.jsx("p",{className:"text-[11px] mt-1 text-slate-500 dark:text-slate-400",children:"Architect tier unlocks proposal publishing & advanced governance tools."})]})]})}),e.jsx(w,{title:"Progress",className:`
                            rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                            bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                            dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                            dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                            hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                        `,icon:e.jsx(v,{className:"w-5 h-5 text-white"}),children:e.jsx(Xe,{xp:t?.xp_total??0,xpPercent:t?.xpPercent??0,remainingXp:t?.remainingXp??0,nextTierPercent:t?.nextTierPercent??0,tier:t?.tier??"Explorer",xpLeveledUp:re})}),e.jsxs(w,{title:"Quick Actions",className:`
                            rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                            bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                            dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                            dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                            hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                        `,icon:e.jsx(Q,{className:"w-5 h-5 text-white"}),children:[e.jsx("p",{className:"text-sm text-slate-700 dark:text-slate-200 mb-4 leading-relaxed",children:"Here you can find the main actions for your Web3Edu identity and learning journey."}),e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx("button",{onClick:()=>d("/sbt-view"),className:"py-3 px-6 rounded-xl bg-gradient-to-r from-[#7F3DF1] to-[#5F2BD8] text-white hover:scale-[1.03] hover:opacity-90 transition font-semibold shadow-md",children:"View My SBT"}),e.jsx("button",{onClick:()=>d("/labs"),className:"py-3 px-6 rounded-xl bg-gradient-to-r from-[#33D6FF] to-[#24A9D0] text-white hover:scale-[1.03] hover:opacity-90 transition font-semibold shadow-md",children:"Continue Learning"}),e.jsx("div",{className:"mt-3",children:e.jsx("button",{onClick:()=>d("/start-here"),className:`
  w-full py-3 px-6 rounded-xl
  bg-gradient-to-r from-indigo-500/80 to-purple-500/80
  text-white
  hover:scale-[1.03] hover:opacity-90
  transition
  font-semibold shadow-md
`,children:"Start Here (guide)"})})]})]}),e.jsxs(w,{title:"Badges",className:`
                        rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                        bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                        dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                        dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                        hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                    `,icon:e.jsx(v,{className:"w-5 h-5 text-white"}),children:[e.jsx("p",{className:"text-sm text-slate-700 dark:text-slate-200 mb-4 leading-relaxed",children:"All your achievements and earned badges will appear here as you progress."}),t?.badges?.length>0||F.length>0?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"flex flex-wrap gap-2",children:[t?.badges?.map((s,r)=>{let a=v;const x=typeof s=="string"?s.toLowerCase():s?.label?.toLowerCase?.()||s?.en?.toLowerCase?.()||s?.gr?.toLowerCase?.()||"";return x.includes("wallet")&&(a=V),x.includes("lesson")&&(a=Ue),x.includes("quiz")&&(a=Ge),e.jsxs("span",{className:`
                            inline-flex items-center gap-2 
                            px-3 py-1 rounded-full 
                            text-xs font-semibold
                            bg-indigo-200/60 dark:bg-indigo-900/40
                            border border-indigo-300/30 dark:border-indigo-700/30
                            text-slate-900 dark:text-slate-100
                        `,children:[e.jsx(a,{className:"w-4 h-4 text-white/90"}),typeof s=="string"?s:s?.en||s?.gr||s?.label||JSON.stringify(s)]},`badge-${r}-${typeof s=="string"?s:s?.id||"badge"}`)}),F.map((s,r)=>{const a=typeof s=="string"?s:s?.name||"Event Badge",i=String(a).toLowerCase().includes("genesis");return e.jsxs("span",{className:`
                                                        inline-flex items-center gap-2
                                                        px-3 py-1 rounded-full
                                                        text-xs font-semibold
                                                        ${i?"bg-gradient-to-r from-purple-500/80 to-fuchsia-500/80 text-white border border-purple-300/40 shadow-[0_0_10px_rgba(168,85,247,0.6)] animate-[genesisPulse_0.9s_ease-out]":"bg-purple-200/70 dark:bg-purple-900/40 border border-purple-300/40 dark:border-purple-700/40 text-slate-900 dark:text-slate-100"}
                                                    `,children:[e.jsx(v,{className:`w-4 h-4 ${i?"text-yellow-300":"text-white/90"}`}),a]},`event-badge-${r}`)})]}),e.jsx("div",{className:"w-full mt-4",children:e.jsx("button",{disabled:g,onClick:()=>{g||d("/events/genesis")},className:`
                                                w-full py-2 px-4 rounded-lg
                                                text-xs font-semibold transition shadow-md
                                                ${g?"bg-green-500 text-white cursor-default":"bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:scale-[1.02]"}
                                            `,children:g?"Genesis Badge Minted ✓":"Mint Genesis Event Badge"})})]}):e.jsxs(e.Fragment,{children:[e.jsx("p",{className:"text-slate-600 dark:text-slate-300",children:"No badges yet…"}),e.jsx("div",{className:"w-full mt-4",children:e.jsx("button",{disabled:g,onClick:()=>{g||d("/events/genesis")},className:`
                                                w-full py-2 px-4 rounded-lg
                                                text-xs font-semibold transition shadow-md
                                                ${g?"bg-green-500 text-white cursor-default":"bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:scale-[1.02]"}
                                            `,children:g?"Genesis Badge Minted ✓":"Mint Genesis Event Badge"})})]})]})]})]}),l&&e.jsx("div",{className:"relative z-10 w-full max-w-6xl mx-auto mt-6 mb-8 px-2 md:px-0",children:e.jsxs(w,{title:"Recommended Next Module",className:`
                rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                dark:border-white/10 backdrop-blur-xl shadow-xl
                hover:scale-[1.002] hover:shadow-2xl transition-all duration-500
            `,icon:e.jsx(Q,{className:"w-5 h-5 text-white"}),children:[p&&e.jsxs("div",{className:`mb-4 rounded-xl border border-purple-300/30 dark:border-purple-700/40 
                                                bg-purple-50/70 dark:bg-purple-900/20 p-4`,children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx("span",{className:"text-xs font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-300",children:"🏗 Builder Path"}),t?.tier==="Explorer"&&e.jsx("button",{onClick:s=>{s.stopPropagation(),je(r=>!r)},className:"text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline",children:J?"Hide details":"View requirements"}),t?.tier!=="Explorer"&&(p.coreLabs?.done&&p.daoLabs?.done&&p.proofOfEscape?.done&&p.xpRequirement?.done?e.jsx("span",{className:"text-green-600 dark:text-green-400 text-xs font-semibold",children:"✔ Builder Unlocked"}):e.jsx("span",{className:"text-xs text-slate-500 dark:text-slate-400",children:"In Progress"}))]}),J&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs",children:[e.jsxs("div",{children:[p.coreLabs?.done?"✔":"⏳"," Core Labs (",p.coreLabs?.completed,"/",p.coreLabs?.required,")"]}),e.jsxs("div",{children:[p.daoLabs?.done?"✔":"⏳"," DAO Labs (",p.daoLabs?.completed,"/",p.daoLabs?.required,")"]}),e.jsxs("div",{children:[p.proofOfEscape?.done?"✔":"⏳"," Proof of Escape"]}),e.jsxs("div",{children:[p.xpRequirement?.done?"✔":"⏳"," XP (",p.xpRequirement?.current,"/",p.xpRequirement?.required,")"]})]}),(()=>{const r=(p.coreLabs?.done?1:0)+(p.daoLabs?.done?1:0)+(p.proofOfEscape?.done?1:0),a=Math.round(r/3*100);return e.jsxs("div",{className:"mt-4",children:[e.jsxs("div",{className:"flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1",children:[e.jsx("span",{children:"Builder Progress"}),e.jsxs("span",{children:[r,"/",3," requirements"]})]}),e.jsx("div",{className:"w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden",children:e.jsx("div",{className:"h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500",style:{width:`${a}%`}})})]})})()]})]}),e.jsxs("div",{className:"space-y-3 cursor-pointer",onClick:()=>{if(l.type==="guide"&&l.slug){d(`/${l.slug}`);return}if(l.type==="lab"&&W){d(W);return}if(l.type==="lesson"&&l.slug){d(`/lessons/${l.slug}`);return}if(l.type==="project"&&l.slug){d(`/projects/${l.slug}`);return}d("/education")},children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("p",{className:"text-xs uppercase tracking-wide text-indigo-600 dark:text-indigo-400 font-semibold",children:U?"Start Here":"Recommended for you"}),G&&e.jsx("span",{className:`
                                            inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold
                                            bg-purple-100/80 dark:bg-purple-900/40
                                            border border-purple-300/40 dark:border-purple-600/60
                                            text-purple-700 dark:text-purple-300
                                        `,children:"🏗 Builder Path"}),G&&e.jsx("span",{className:`
                                            text-[10px] font-medium text-slate-500 dark:text-slate-400
                                        `,children:"Final Builder Requirement"})]}),e.jsx("p",{className:"text-xl font-bold text-slate-900 dark:text-white leading-snug",children:typeof l.title=="object"?l.title.en||l.title.gr:l.title}),l.why&&e.jsxs("div",{className:"mt-1",children:[e.jsx("p",{className:"text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-500 mb-1",children:U?"Suggested next step":"Why this is recommended"}),e.jsx("p",{className:"text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl",children:typeof l.why=="object"?l.why.en||l.why.gr:l.why})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-6 pt-1 text-sm text-slate-600 dark:text-slate-400",children:[l.estimatedTime&&e.jsxs("span",{children:["⏱ ",l.estimatedTime," min"]}),l.xp&&e.jsxs("span",{children:["🏅 +",l.xp," XP"]})]}),e.jsx("div",{className:"pt-2",children:e.jsx("span",{className:"inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400",children:"Continue →"})})]})]})}),e.jsx("div",{className:"relative z-10 w-full max-w-6xl mx-auto mt-12 px-2 md:px-0",children:e.jsx(qe,{timeline:we})}),e.jsx("div",{className:`pointer-events-none fixed top-0 right-0 w-[300px] h-full
                                bg-gradient-to-b from-[#8A57FF]/35 via-[#4ACBFF]/25 to-[#FF67D2]/35
                                blur-[160px] opacity-60`}),f&&e.jsx("div",{className:"fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50",children:e.jsxs("div",{className:"bg-[#0f0f17] p-6 rounded-2xl w-80 border border-white/10 shadow-xl",children:[e.jsx("h2",{className:"text-xl font-bold mb-3 flex items-center gap-2",children:"Tier Benefits"}),e.jsxs("ul",{className:"text-white/80 text-sm space-y-2",children:[e.jsx("li",{children:"🟣 Explorer — Basic access, community role, progress tracking"}),e.jsx("li",{children:"🔵 Builder — Unlock advanced lessons, early DAO proposals"}),e.jsx("li",{children:"🟡 Architect — Full DAO access, beta features, priority badges"})]}),e.jsx("p",{className:"text-white/70 text-sm mt-4",children:"How to upgrade your tier:"}),e.jsxs("ul",{className:"text-white/80 text-sm space-y-1 mt-1",children:[e.jsx("li",{children:"• Complete lessons and quizzes to earn XP."}),e.jsx("li",{children:"• Return regularly and finish learning paths."}),e.jsx("li",{children:"• Participate in community / DAO activities (future)."})]}),e.jsx("button",{onClick:()=>T(!1),className:"mt-5 w-full py-2 rounded-xl bg-white/10 hover:bg-white/40 transition text-white font-semibold text-sm tracking-wide",children:"Close"})]})})]})})}export{lt as default};
