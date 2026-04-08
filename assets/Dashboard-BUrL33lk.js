import{u as Se,r as u,j as e}from"./vendor-react-DIuPT6mD.js";import{s as Ee,e as Re,k as Le,l as Te,g as $e,o as Ie,i as De,P as ze}from"./index-DgmN8Nrp.js";import{I as Me,D as f,F as v,a as J,b as Oe,X as Xe,c as K,L as qe,d as Ue,e as Ge}from"./IdentityCard-7WTx9eiN.js";import{p as ee}from"./projectService-8Q84jcWp.js";import{u as We}from"./vendor-web3-ZWswquZB.js";import"./identity-icon-MXImXT_G.js";const V=n=>{if(!n)return 0;const o=Date.parse(n);return Number.isFinite(o)?o:0},Q=n=>ee.find(o=>o.id===n)||null,te=n=>typeof n=="string"?n.replace(/-gr$/,""):null,Ye={lab01:"/labs/wallets-keys","wallets-keys":"/labs/wallets-keys",lab02:"/labs/lab02",lab03:"/labs/lab03",lab04:"/labs/lab04",lab05:"/labs/lab05",lab06:"/labs/lab06",dao01:"/labs/dao-01","dao-01":"/labs/dao-01",dao02:"/labs/dao-02","dao-02":"/labs/dao-02","system-s0":"/labs/system/s0","system/s0":"/labs/system/s0","system-byzantine-generals":"/labs/system/s0","system-s1":"/labs/system/s1","system/s1":"/labs/system/s1","system-s2":"/labs/system/s2","system/s2":"/labs/system/s2","proof-of-escape":"/labs/proof-of-escape"},He=n=>{if(typeof n!="string"||!n.trim())return null;if(n.startsWith("/"))return n;const o=te(n)?.replace(/^labs-gr\//,"")?.replace(/^labs\//,"");return o?Ye[o]||`/labs/${o}`:null},Z=(n,o)=>!o||!n||typeof n!="object"?!1:[o.backendId,o.id,o.type].filter(Boolean).some(t=>!!n[t]),Je=(n,o)=>{const c=n&&typeof n.recommendedNext=="object"?n.recommendedNext:null,t=o&&typeof o.recommendedNext=="object"?o.recommendedNext:null,h=k=>k&&(k.title||k.slug);return h(c)?c:h(t)?t:null},Ke=(n,o)=>{if(!n||n.type!=="project")return!1;const c=te(n.slug);if(!c)return!1;const t=ee.find(h=>h.id===c||h.type===c||h.backendId===c);return t?.backendId?!!o?.[t.backendId]:!1};function nt(){const{address:n,isConnected:o}=We(),c=Se(),[t,h]=u.useState(null),[k,E]=u.useState(!1),[re,R]=u.useState(!1),N=u.useRef(null),[w,se]=u.useState(null),[L,ae]=u.useState(null),T="web3edu-builder-unlock-shown",[ne,$]=u.useState(!1),[Ve,le]=u.useState(localStorage.getItem("web3edu-builder-claimed")==="true"),[I,ie]=u.useState(localStorage.getItem(T)==="true"),[oe,D]=u.useState(!1),de=u.useRef(null),ce={tier:"Explorer",xp_total:0,xp:0,xpPercent:0,remainingXp:0,nextTierPercent:0,lessonsCompleted:0},xe=t&&typeof t=="object"&&!Array.isArray(t)?t:{},B={...ce,...xe},me=(()=>{const r=B||{},s=w||{},d=[...Array.isArray(r.attributes)?r.attributes:[],...Array.isArray(s.attributes)?s.attributes:[]].some(i=>(i?.trait_type||"").toLowerCase()==="founder"&&(i?.value===!0||String(i?.value).toLowerCase()==="true"));return r.founder===!0||s.founder===!0||r.edition==="Founder Edition"||s.edition==="Founder Edition"||r.role==="Founder"||s.role==="Founder"||d})();u.useEffect(()=>{o||c("/join"),window.scrollTo(0,0)},[o,c]);const P=Ee(n),pe=r=>{const s=[r?.tokenId,r?.token_id,r?.tokenID,r?.metadata?.tokenId,r?.metadata?.token_id,r?.profile?.tokenId,r?.profile?.token_id,r?.metadata?.metadata?.tokenId,r?.metadata?.metadata?.token_id,r?.profile?.metadata?.tokenId,r?.profile?.metadata?.token_id];for(const a of s)if(a!=null&&a!=="")return a;return null};u.useEffect(()=>{if(!n)return;fetch(`https://web3edu-api.dimikog.org/web3sbt/resolve/${n}`).then(s=>s.ok?s.json():s.json().catch(()=>({})).then(a=>{throw Re(s.status,a)})).then(s=>{const a=Le(s),d=Te(s),i=Je(a,d),m=$e(s),g=Ie(m),G={...a,...d};h({...G,tokenId:pe(s),xp_total:m,xp:m,tier:g.tier,xpPercent:g.xpPercent,nextTierPercent:g.nextTierPercent,remainingXp:g.remainingXp,recommendedNext:i});const ke=p=>{if(typeof p=="string")try{return JSON.parse(p)}catch{return null}return p},W=p=>{const Ce=[p?.attributes,p?.attribute,p?.attrs,p?.traits,p?.traits_array,p?.traitsArray,p?.attributes_json,p?.attributesJson];for(const Pe of Ce){const y=ke(Pe);if(Array.isArray(y))return y;if(y&&typeof y=="object")return Object.entries(y).map(([_e,Fe])=>({trait_type:_e,value:Fe}))}return[]},je=W(a),ye=W(d),j=[...je,...ye],Y=d.role||a.role,H=d.specialization||d.speciality||a.specialization||a.speciality,ve=j.some(p=>(p.trait_type||"").toLowerCase()==="role"),Ne=j.some(p=>["specialization","speciality"].includes((p.trait_type||"").toLowerCase()));!ve&&Y&&j.push({trait_type:"Role",value:Y}),!Ne&&H&&j.push({trait_type:"Specialization",value:H});const Be=d.image&&d.image.trim()!==""?d.image:d.avatar&&d.avatar.trim()!==""?d.avatar:a.image&&a.image.trim()!==""?a.image:a.avatar&&a.avatar.trim()!==""?a.avatar:null,Ae={...G,xp_total:m,xp:m,tier:g.tier,name:d.name||a.name||P||"Web3Edu Identity",image:Be,attributes:j};se(Ae),ae(new Date)}).catch(s=>{if(De(s)){console.warn("Backend user state temporarily unavailable; preserving dashboard state.");return}console.error("Failed to fetch metadata:",s)})},[n,P]),u.useEffect(()=>{if(!t||typeof t.xp_total!="number")return;let r;return N.current==null||t.xp_total>N.current&&(R(!0),r=setTimeout(()=>R(!1),1200)),N.current=t.xp_total,()=>{r&&clearTimeout(r)}},[t]),u.useEffect(()=>{t?.tier&&((t.tier==="Builder"||t.tier==="Architect")&&!I&&($(!0),ie(!0),localStorage.setItem(T,"true")),de.current=t.tier)},[t?.tier,I]);const A=t?.projectsCompleted&&typeof t.projectsCompleted=="object"?t.projectsCompleted:t?.projects_completed&&typeof t.projects_completed=="object"?t.projects_completed:{},ue=B?.tier==="Builder"||B?.tier==="Architect",_=Q("decrypt-message"),F=Q("tx-investigation"),he=Z(A,_),be=Z(A,F),ge=(ue?he?be?null:{type:"project",slug:"tx-investigation",title:`Project #2 — ${F?.title||"Transaction Investigation"}`,why:"You completed Project #1. Continue to the next project challenge and identify which transaction contains the real encrypted payload.",estimatedTime:20,xp:F?.xp??350}:{type:"project",slug:"decrypt-message",title:`Project #1 — ${_?.title||"Find and Decrypt an On-Chain Message"}`,why:"You reached Builder. Start with the first project challenge to practice decoding event data and recovering a hidden message.",estimatedTime:15,xp:_?.xp??200}:null)||{type:"guide",title:"Start Here — Your Web3 Learning Path",slug:"start-here",why:"This short guide explains how Web3Edu works and helps you choose what to learn next.",estimatedTime:5},z=t&&typeof t.recommendedNext=="object"?t.recommendedNext:null,C=Ke(z,A)?null:z,M=C&&(C.title||C.slug),l=M?C:ge,O=!M,X=!!l?.builderRequired,q=He(l?.slug),x=t?.builderChecklist||null,fe=(()=>{const r=Array.isArray(t?.timeline)?t.timeline:[],s=new Map;r.forEach((i,m)=>{if(!i)return;const g=`${i.type||"unknown"}:${i.id||i.slug||m}`;s.set(g,i)});const a=t?.labs_completed&&typeof t.labs_completed=="object"?t.labs_completed:{};Object.entries(a).forEach(([i,m])=>{s.set(`lab:${i}`,{type:"lab",id:i,title:m?.title||i,xp:m?.xp||0,badge:m?.badge,completedAt:m?.completedAt})});const d=t?.projectLabs&&typeof t.projectLabs=="object"?t.projectLabs:{};return Object.entries(A).forEach(([i,m])=>{s.set(`project:${i}`,{type:"project",id:i,title:m?.badge||i,badge:m?.badge,xp:d?.[i]?.xp||0,completedAt:m?.completedAt})}),[...s.values()].sort((i,m)=>V(m?.completedAt)-V(i?.completedAt))})(),[U,we]=u.useState(t?.tier&&t.tier!=="Explorer"),S=Array.isArray(t?.eventBadges)?t.eventBadges:[],b=S.some(r=>{if(typeof r=="string")return r.toLowerCase().includes("genesis");const s=String(r?.name||r?.label||r?.en||r?.gr||"").toLowerCase(),a=String(r?.id||r?.slug||"").toLowerCase();return s.includes("genesis")||a.includes("genesis")});return e.jsx(ze,{children:e.jsxs("div",{className:`
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
                `}),e.jsxs("div",{className:"absolute inset-0 pointer-events-none",children:[e.jsx("div",{className:"absolute top-[18%] left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-purple-600/30 dark:bg-purple-600/20 blur-[130px] rounded-full"}),e.jsx("div",{className:"absolute bottom-[15%] right-[25%] w-[340px] h-[340px] bg-indigo-400/30 dark:bg-indigo-500/20 blur-[140px] rounded-full"})]}),w&&e.jsxs("div",{className:`
            relative z-10 w-full max-w-5xl mx-auto text-center
            mt-4 mb-16 animate-[fadeSlideUp_0.6s_ease-out]
        `,children:[e.jsx("div",{className:"flex justify-center mb-3",children:e.jsxs("div",{className:"relative",children:[e.jsx("img",{src:w.image||"/icons/web3edu-identity.png",alt:"avatar",className:`
                        w-14 h-14 rounded-full object-cover shadow-md 
                        border border-white/20 dark:border-white/10 
                        transition-all duration-700
                        dark:animate-[shine_3.4s_ease-in-out_infinite]
                    `,loading:"lazy"}),e.jsx("div",{className:`
                        absolute inset-0 rounded-full 
                        dark:bg-white/5 blur-md 
                        dark:animate-[shineGlow_3.4s_ease-in-out_infinite]
                    `})]})}),e.jsxs("h2",{className:"text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-3",children:["Welcome back, ",w.name||P," 👋",t?.tier&&e.jsx("span",{className:`
                inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                bg-gradient-to-r from-purple-600/80 to-fuchsia-500/80
                dark:from-purple-500/60 dark:to-fuchsia-400/60
                text-white shadow-md border border-white/10
            `,children:t.tier})]}),L&&e.jsxs("p",{className:"text-xs text-slate-500 dark:text-slate-400 mt-1",children:["🕒 Synced ",Math.max(1,Math.floor((Date.now()-L.getTime())/1e3)),"s ago • Web3Edu Identity"]}),e.jsx("p",{className:"mt-2 text-sm text-slate-600 dark:text-slate-300",children:"Mint your Web3Edu Identity to anchor your learning on-chain."}),e.jsx("div",{className:`
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
            `})]}),ne&&e.jsx("div",{className:"relative z-10 w-full max-w-4xl mx-auto mb-10 px-4",children:e.jsxs("div",{className:`
                            rounded-3xl border border-purple-400/40
                            bg-gradient-to-br from-purple-600/20 via-indigo-600/20 to-fuchsia-600/20
                            backdrop-blur-xl shadow-2xl p-8 text-center
                            animate-[xpBurst_1.2s_ease-out]
                        `,children:[e.jsx("h2",{className:"text-2xl font-extrabold text-white mb-3",children:"🏗️ Builder Level Unlocked"}),e.jsxs("p",{className:"text-sm text-slate-200 mb-6",children:["You have completed the core requirements and unlocked",e.jsx("span",{className:"font-semibold text-purple-300",children:" Builder "}),"status. You are now eligible to participate in advanced governance tracks."]}),oe?e.jsxs("div",{className:`
                                        px-6 py-3 rounded-xl
                                        bg-green-600/90 text-white font-semibold
                                        shadow-lg animate-[xpBurst_1.2s_ease-out]
                                        flex flex-col items-center gap-1
                                    `,children:[e.jsx("span",{children:"✅ Builder Badge Claimed"}),e.jsx("span",{className:"text-[11px] opacity-90",children:"Next milestone: Architect Tier"})]}):e.jsx("button",{onClick:()=>{localStorage.setItem("web3edu-builder-claimed","true"),le(!0),D(!0),setTimeout(()=>{$(!1),D(!1)},1400)},className:`
                                        px-6 py-3 rounded-xl
                                        bg-gradient-to-r from-purple-500 to-indigo-500
                                        text-white font-semibold
                                        hover:scale-105 transition shadow-lg
                                    `,children:"Claim Builder Badge"})]})}),e.jsxs("div",{className:"relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 px-2 md:px-0",children:[e.jsxs("div",{className:"flex flex-col items-center justify-start mt-10 lg:mt-0 relative self-center",children:[e.jsx("div",{className:"absolute -z-10 top-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-purple-500/25 dark:bg-purple-500/20 blur-[200px] rounded-full"}),w&&e.jsx(Me,{metadata:w,wallet:n,tokenId:B.tokenId})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-8 md:gap-8",children:[me&&e.jsx(f,{title:"Founder Badge",className:`
                                    rounded-2xl border border-fuchsia-300/30 dark:border-fuchsia-700/30
                                    bg-gradient-to-br from-white/95 via-fuchsia-50/70 to-slate-100/90
                                    dark:from-[#110819]/90 dark:via-[#1a0f21]/85 dark:to-[#0c0814]/90
                                    backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                                    hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                                `,icon:e.jsx(v,{className:"w-5 h-5 text-white"}),children:e.jsxs("p",{className:"text-sm text-slate-700 dark:text-slate-300 leading-relaxed",children:["You hold a"," ",e.jsx("span",{className:"font-semibold text-fuchsia-600 dark:text-fuchsia-400",children:"Founder SBT"}),". A special recognition for the core creators of Web3Edu."]})}),e.jsx(f,{title:"Your Wallet",className:`
                                rounded-2xl border border-cyan-300/30 dark:border-cyan-700/30
                                bg-gradient-to-br from-white/95 via-cyan-50/70 to-slate-100/90
                                dark:from-[#071d24]/90 dark:via-[#0a2730]/85 dark:to-[#06151a]/90
                                backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                                hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                            `,icon:e.jsx(J,{className:"w-5 h-5 text-white"}),children:e.jsx("p",{className:"text-sm font-mono text-slate-700 dark:text-slate-300 break-all",children:n??"—"})}),e.jsx(f,{title:"Rank",className:`
                                rounded-2xl border border-purple-300/30 dark:border-purple-700/30
                                bg-gradient-to-br from-white/95 via-purple-50/70 to-slate-100/90
                                dark:from-[#160f2a]/90 dark:via-[#120c23]/85 dark:to-[#0b0816]/90
                                backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                                hover:scale-[1.005] hover:shadow-2xl transition-all duration-500 relative
                            `,icon:e.jsx(Oe,{className:"w-5 h-5 text-white"}),children:e.jsxs("div",{className:"flex flex-col items-start gap-3 cursor-pointer",onClick:()=>E(!0),children:[e.jsxs("div",{className:`
                                        inline-flex items-center gap-2 
                                        px-3 py-1 rounded-full
                                        bg-purple-100/70 dark:bg-purple-900/40
                                        border border-purple-300/40 dark:border-purple-600/60
                                    `,children:[e.jsx("span",{className:"inline-flex h-2.5 w-2.5 rounded-full bg-purple-500 dark:bg-purple-400"}),e.jsx("span",{className:"text-[11px] font-semibold tracking-[0.14em] uppercase text-purple-700 dark:text-purple-200",children:"Current Tier"})]}),e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsxs("div",{className:"flex items-baseline gap-2",children:[e.jsx("p",{className:`
                                                text-2xl font-extrabold text-purple-700 dark:text-purple-200
                                                ${t?.tier==="Builder"?"animate-[xpBurst_1.2s_ease-out]":""}
                                            `,children:t?.tier??"Explorer"}),t?.tier&&t.tier!=="Explorer"&&e.jsx("span",{className:"text-[11px] font-medium text-purple-500/90 dark:text-purple-300/90",children:t.tier==="Builder"?"DAO-ready in progress":"DAO governance ready"})]}),t?.tier&&t.tier!=="Architect"&&e.jsx("div",{className:"mt-2 text-xs text-slate-600/90 dark:text-slate-400/90",children:(()=>{const r=t.tier,s=t?.remainingXp??0;let a="Builder";return r==="Builder"&&(a="Architect"),e.jsxs("span",{children:["Next Tier:"," ",e.jsx("span",{className:"font-semibold text-purple-600 dark:text-purple-300",children:a})," ","• ",s," XP remaining"]})})()}),e.jsx("p",{className:"text-xs text-slate-600/90 dark:text-slate-400/90",children:"Earn XP from lessons and quizzes to upgrade your tier."}),e.jsx("p",{className:"mt-2 text-xs text-slate-600/90 dark:text-slate-400/90",children:t?.tier==="Builder"||t?.tier==="Architect"?"DAO governance access unlocked at your current tier.":"Reach Builder tier to unlock DAO governance access."}),e.jsx("div",{className:"mt-2 text-xs font-semibold",children:t?.tier==="Builder"||t?.tier==="Architect"?e.jsx("span",{className:"text-green-600 dark:text-green-400",children:"🟢 Governance Access: Active"}):e.jsx("span",{className:"text-slate-500 dark:text-slate-400",children:"🔒 Governance Access: Locked"})}),t?.tier==="Builder"&&e.jsx("p",{className:"text-[11px] mt-1 text-slate-500 dark:text-slate-400",children:"Architect tier unlocks proposal publishing & advanced governance tools."})]})]})}),e.jsx(f,{title:"Progress",className:`
                            rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                            bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                            dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                            dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                            hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                        `,icon:e.jsx(v,{className:"w-5 h-5 text-white"}),children:e.jsx(Xe,{xp:t?.xp_total??0,xpPercent:t?.xpPercent??0,remainingXp:t?.remainingXp??0,nextTierPercent:t?.nextTierPercent??0,tier:t?.tier??"Explorer",xpLeveledUp:re})}),e.jsxs(f,{title:"Quick Actions",className:`
                            rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                            bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                            dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                            dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                            hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                        `,icon:e.jsx(K,{className:"w-5 h-5 text-white"}),children:[e.jsx("p",{className:"text-sm text-slate-700 dark:text-slate-200 mb-4 leading-relaxed",children:"Here you can find the main actions for your Web3Edu identity and learning journey."}),e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx("button",{onClick:()=>c("/sbt-view"),className:"py-3 px-6 rounded-xl bg-gradient-to-r from-[#7F3DF1] to-[#5F2BD8] text-white hover:scale-[1.03] hover:opacity-90 transition font-semibold shadow-md",children:"View My SBT"}),e.jsx("button",{onClick:()=>c("/labs"),className:"py-3 px-6 rounded-xl bg-gradient-to-r from-[#33D6FF] to-[#24A9D0] text-white hover:scale-[1.03] hover:opacity-90 transition font-semibold shadow-md",children:"Continue Learning"}),e.jsx("div",{className:"mt-3",children:e.jsx("button",{onClick:()=>c("/start-here"),className:`
  w-full py-3 px-6 rounded-xl
  bg-gradient-to-r from-indigo-500/80 to-purple-500/80
  text-white
  hover:scale-[1.03] hover:opacity-90
  transition
  font-semibold shadow-md
`,children:"Start Here (guide)"})})]})]}),e.jsxs(f,{title:"Badges",className:`
                        rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                        bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                        dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                        dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                        hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                    `,icon:e.jsx(v,{className:"w-5 h-5 text-white"}),children:[e.jsx("p",{className:"text-sm text-slate-700 dark:text-slate-200 mb-4 leading-relaxed",children:"All your achievements and earned badges will appear here as you progress."}),t?.badges?.length>0||S.length>0?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"flex flex-wrap gap-2",children:[t?.badges?.map((r,s)=>{let a=v;const d=typeof r=="string"?r.toLowerCase():r?.label?.toLowerCase?.()||r?.en?.toLowerCase?.()||r?.gr?.toLowerCase?.()||"";return d.includes("wallet")&&(a=J),d.includes("lesson")&&(a=Ue),d.includes("quiz")&&(a=Ge),e.jsxs("span",{className:`
                            inline-flex items-center gap-2 
                            px-3 py-1 rounded-full 
                            text-xs font-semibold
                            bg-indigo-200/60 dark:bg-indigo-900/40
                            border border-indigo-300/30 dark:border-indigo-700/30
                            text-slate-900 dark:text-slate-100
                        `,children:[e.jsx(a,{className:"w-4 h-4 text-white/90"}),typeof r=="string"?r:r?.en||r?.gr||r?.label||JSON.stringify(r)]},`badge-${s}-${typeof r=="string"?r:r?.id||"badge"}`)}),S.map((r,s)=>{const a=typeof r=="string"?r:r?.name||"Event Badge",i=String(a).toLowerCase().includes("genesis");return e.jsxs("span",{className:`
                                                        inline-flex items-center gap-2
                                                        px-3 py-1 rounded-full
                                                        text-xs font-semibold
                                                        ${i?"bg-gradient-to-r from-purple-500/80 to-fuchsia-500/80 text-white border border-purple-300/40 shadow-[0_0_10px_rgba(168,85,247,0.6)] animate-[genesisPulse_0.9s_ease-out]":"bg-purple-200/70 dark:bg-purple-900/40 border border-purple-300/40 dark:border-purple-700/40 text-slate-900 dark:text-slate-100"}
                                                    `,children:[e.jsx(v,{className:`w-4 h-4 ${i?"text-yellow-300":"text-white/90"}`}),a]},`event-badge-${s}`)})]}),e.jsx("div",{className:"w-full mt-4",children:e.jsx("button",{disabled:b,onClick:()=>{b||c("/events/genesis")},className:`
                                                w-full py-2 px-4 rounded-lg
                                                text-xs font-semibold transition shadow-md
                                                ${b?"bg-green-500 text-white cursor-default":"bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:scale-[1.02]"}
                                            `,children:b?"Genesis Badge Minted ✓":"Mint Genesis Event Badge"})})]}):e.jsxs(e.Fragment,{children:[e.jsx("p",{className:"text-slate-600 dark:text-slate-300",children:"No badges yet…"}),e.jsx("div",{className:"w-full mt-4",children:e.jsx("button",{disabled:b,onClick:()=>{b||c("/events/genesis")},className:`
                                                w-full py-2 px-4 rounded-lg
                                                text-xs font-semibold transition shadow-md
                                                ${b?"bg-green-500 text-white cursor-default":"bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:scale-[1.02]"}
                                            `,children:b?"Genesis Badge Minted ✓":"Mint Genesis Event Badge"})})]})]})]})]}),l&&e.jsx("div",{className:"relative z-10 w-full max-w-6xl mx-auto mt-6 mb-8 px-2 md:px-0",children:e.jsxs(f,{title:"Recommended Next Module",className:`
                rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                dark:border-white/10 backdrop-blur-xl shadow-xl
                hover:scale-[1.002] hover:shadow-2xl transition-all duration-500
            `,icon:e.jsx(K,{className:"w-5 h-5 text-white"}),children:[x&&e.jsxs("div",{className:`mb-4 rounded-xl border border-purple-300/30 dark:border-purple-700/40 
                                                bg-purple-50/70 dark:bg-purple-900/20 p-4`,children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx("span",{className:"text-xs font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-300",children:"🏗 Builder Path"}),t?.tier==="Explorer"&&e.jsx("button",{onClick:r=>{r.stopPropagation(),we(s=>!s)},className:"text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline",children:U?"Hide details":"View requirements"}),t?.tier!=="Explorer"&&(x.coreLabs?.done&&x.daoLabs?.done&&x.proofOfEscape?.done&&x.xpRequirement?.done?e.jsx("span",{className:"text-green-600 dark:text-green-400 text-xs font-semibold",children:"✔ Builder Unlocked"}):e.jsx("span",{className:"text-xs text-slate-500 dark:text-slate-400",children:"In Progress"}))]}),U&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs",children:[e.jsxs("div",{children:[x.coreLabs?.done?"✔":"⏳"," Core Labs (",x.coreLabs?.completed,"/",x.coreLabs?.required,")"]}),e.jsxs("div",{children:[x.daoLabs?.done?"✔":"⏳"," DAO Labs (",x.daoLabs?.completed,"/",x.daoLabs?.required,")"]}),e.jsxs("div",{children:[x.proofOfEscape?.done?"✔":"⏳"," Proof of Escape"]}),e.jsxs("div",{children:[x.xpRequirement?.done?"✔":"⏳"," XP (",x.xpRequirement?.current,"/",x.xpRequirement?.required,")"]})]}),(()=>{const s=(x.coreLabs?.done?1:0)+(x.daoLabs?.done?1:0)+(x.proofOfEscape?.done?1:0),a=Math.round(s/3*100);return e.jsxs("div",{className:"mt-4",children:[e.jsxs("div",{className:"flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1",children:[e.jsx("span",{children:"Builder Progress"}),e.jsxs("span",{children:[s,"/",3," requirements"]})]}),e.jsx("div",{className:"w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden",children:e.jsx("div",{className:"h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500",style:{width:`${a}%`}})})]})})()]})]}),e.jsxs("div",{className:"space-y-3 cursor-pointer",onClick:()=>{if(l.type==="guide"&&l.slug){c(`/${l.slug}`);return}if(l.type==="lab"&&q){c(q);return}if(l.type==="lesson"&&l.slug){c(`/lessons/${l.slug}`);return}if(l.type==="project"&&l.slug){c(`/projects/${l.slug}`);return}c("/education")},children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("p",{className:"text-xs uppercase tracking-wide text-indigo-600 dark:text-indigo-400 font-semibold",children:O?"Start Here":"Recommended for you"}),X&&e.jsx("span",{className:`
                                            inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold
                                            bg-purple-100/80 dark:bg-purple-900/40
                                            border border-purple-300/40 dark:border-purple-600/60
                                            text-purple-700 dark:text-purple-300
                                        `,children:"🏗 Builder Path"}),X&&e.jsx("span",{className:`
                                            text-[10px] font-medium text-slate-500 dark:text-slate-400
                                        `,children:"Final Builder Requirement"})]}),e.jsx("p",{className:"text-xl font-bold text-slate-900 dark:text-white leading-snug",children:typeof l.title=="object"?l.title.en||l.title.gr:l.title}),l.why&&e.jsxs("div",{className:"mt-1",children:[e.jsx("p",{className:"text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-500 mb-1",children:O?"Suggested next step":"Why this is recommended"}),e.jsx("p",{className:"text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl",children:typeof l.why=="object"?l.why.en||l.why.gr:l.why})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-6 pt-1 text-sm text-slate-600 dark:text-slate-400",children:[l.estimatedTime&&e.jsxs("span",{children:["⏱ ",l.estimatedTime," min"]}),l.xp&&e.jsxs("span",{children:["🏅 +",l.xp," XP"]})]}),e.jsx("div",{className:"pt-2",children:e.jsx("span",{className:"inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400",children:"Continue →"})})]})]})}),e.jsx("div",{className:"relative z-10 w-full max-w-6xl mx-auto mt-12 px-2 md:px-0",children:e.jsx(qe,{timeline:fe})}),e.jsx("div",{className:`pointer-events-none fixed top-0 right-0 w-[300px] h-full
                                bg-gradient-to-b from-[#8A57FF]/35 via-[#4ACBFF]/25 to-[#FF67D2]/35
                                blur-[160px] opacity-60`}),k&&e.jsx("div",{className:"fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50",children:e.jsxs("div",{className:"bg-[#0f0f17] p-6 rounded-2xl w-80 border border-white/10 shadow-xl",children:[e.jsx("h2",{className:"text-xl font-bold mb-3 flex items-center gap-2",children:"Tier Benefits"}),e.jsxs("ul",{className:"text-white/80 text-sm space-y-2",children:[e.jsx("li",{children:"🟣 Explorer — Basic access, community role, progress tracking"}),e.jsx("li",{children:"🔵 Builder — Unlock advanced lessons, early DAO proposals"}),e.jsx("li",{children:"🟡 Architect — Full DAO access, beta features, priority badges"})]}),e.jsx("p",{className:"text-white/70 text-sm mt-4",children:"How to upgrade your tier:"}),e.jsxs("ul",{className:"text-white/80 text-sm space-y-1 mt-1",children:[e.jsx("li",{children:"• Complete lessons and quizzes to earn XP."}),e.jsx("li",{children:"• Return regularly and finish learning paths."}),e.jsx("li",{children:"• Participate in community / DAO activities (future)."})]}),e.jsx("button",{onClick:()=>E(!1),className:"mt-5 w-full py-2 rounded-xl bg-white/10 hover:bg-white/40 transition text-white font-semibold text-sm tracking-wide",children:"Close"})]})})]})})}export{nt as default};
