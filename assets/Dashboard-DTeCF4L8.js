import{u as ve,r as x,j as e}from"./vendor-react-DIuPT6mD.js";import{s as ye,e as Ne,k as Be,l as Ae,g as Ce,o as _e,i as Pe,P as Fe}from"./index-CkmfbD5N.js";import{I as Ee,D as h,F as k,a as q,b as Se,X as Te,c as U,L as Le,d as Re,e as $e}from"./IdentityCard-Cv8ZUjix.js";import{u as De}from"./vendor-web3-ZWswquZB.js";import"./identity-icon-MXImXT_G.js";const G=u=>{if(!u)return 0;const b=Date.parse(u);return Number.isFinite(b)?b:0};function We(){const{address:u,isConnected:b}=De(),p=ve(),[t,W]=x.useState(null),[Y,_]=x.useState(!1),[H,P]=x.useState(!1),j=x.useRef(null),[g,J]=x.useState(null),[F,V]=x.useState(null),E="web3edu-builder-unlock-shown",[K,S]=x.useState(!1),[Me,Q]=x.useState(localStorage.getItem("web3edu-builder-claimed")==="true"),[T,Z]=x.useState(localStorage.getItem(E)==="true"),[ee,L]=x.useState(!1),te=x.useRef(null),re={tier:"Explorer",xp_total:0,xp:0,xpPercent:0,remainingXp:0,nextTierPercent:0,lessonsCompleted:0},ae=t&&typeof t=="object"&&!Array.isArray(t)?t:{},v={...re,...ae},se=(()=>{const r=v||{},a=g||{},l=[...Array.isArray(r.attributes)?r.attributes:[],...Array.isArray(a.attributes)?a.attributes:[]].some(n=>(n?.trait_type||"").toLowerCase()==="founder"&&(n?.value===!0||String(n?.value).toLowerCase()==="true"));return r.founder===!0||a.founder===!0||r.edition==="Founder Edition"||a.edition==="Founder Edition"||r.role==="Founder"||a.role==="Founder"||l})();x.useEffect(()=>{b||p("/join"),window.scrollTo(0,0)},[b,p]);const B=ye(u),ne=r=>{const a=[r?.tokenId,r?.token_id,r?.tokenID,r?.metadata?.tokenId,r?.metadata?.token_id,r?.profile?.tokenId,r?.profile?.token_id,r?.metadata?.metadata?.tokenId,r?.metadata?.metadata?.token_id,r?.profile?.metadata?.tokenId,r?.profile?.metadata?.token_id];for(const s of a)if(s!=null&&s!=="")return s;return null};x.useEffect(()=>{if(!u)return;fetch(`https://web3edu-api.dimikog.org/web3sbt/resolve/${u}`).then(a=>a.ok?a.json():a.json().catch(()=>({})).then(s=>{throw Ne(a.status,s)})).then(a=>{const s=Be(a),l=Ae(a),n=Ce(a),d=_e(n),N={...s,...l};W({...N,tokenId:ne(a),xp_total:n,xp:n,tier:d.tier,xpPercent:d.xpPercent,nextTierPercent:d.nextTierPercent,remainingXp:d.remainingXp});const xe=c=>{if(typeof c=="string")try{return JSON.parse(c)}catch{return null}return c},I=c=>{const fe=[c?.attributes,c?.attribute,c?.attrs,c?.traits,c?.traits_array,c?.traitsArray,c?.attributes_json,c?.attributesJson];for(const we of fe){const w=xe(we);if(Array.isArray(w))return w;if(w&&typeof w=="object")return Object.entries(w).map(([ke,je])=>({trait_type:ke,value:je}))}return[]},pe=I(s),ue=I(l),f=[...pe,...ue],X=l.role||s.role,O=l.specialization||l.speciality||s.specialization||s.speciality,me=f.some(c=>(c.trait_type||"").toLowerCase()==="role"),he=f.some(c=>["specialization","speciality"].includes((c.trait_type||"").toLowerCase()));!me&&X&&f.push({trait_type:"Role",value:X}),!he&&O&&f.push({trait_type:"Specialization",value:O});const ge=l.image&&l.image.trim()!==""?l.image:l.avatar&&l.avatar.trim()!==""?l.avatar:s.image&&s.image.trim()!==""?s.image:s.avatar&&s.avatar.trim()!==""?s.avatar:null,be={...N,xp_total:n,xp:n,tier:d.tier,name:l.name||s.name||B||"Web3Edu Identity",image:ge,attributes:f};J(be),V(new Date)}).catch(a=>{if(Pe(a)){console.warn("Backend user state temporarily unavailable; preserving dashboard state.");return}console.error("Failed to fetch metadata:",a)})},[u,B]),x.useEffect(()=>{if(!t||typeof t.xp_total!="number")return;let r;return j.current==null||t.xp_total>j.current&&(P(!0),r=setTimeout(()=>P(!1),1200)),j.current=t.xp_total,()=>{r&&clearTimeout(r)}},[t]),x.useEffect(()=>{t?.tier&&((t.tier==="Builder"||t.tier==="Architect")&&!T&&(S(!0),Z(!0),localStorage.setItem(E,"true")),te.current=t.tier)},[t?.tier,T]);const A=t?.projects_completed&&typeof t.projects_completed=="object"?t.projects_completed:{},ie=!!A.decrypt01,le=!!A.txinvestigation01,oe=(v?.tier==="Builder"||v?.tier==="Architect"?ie?le?null:{type:"project",slug:"tx-investigation",title:"Project #2 — Transaction Investigation",why:"You completed Project #1. Continue to the next project challenge and identify which transaction contains the real encrypted payload.",estimatedTime:20,xp:120}:{type:"project",slug:"decrypt-message",title:"Project #1 — Find and Decrypt an On-Chain Message",why:"You reached Builder. Start with the first project challenge to practice decoding event data and recovering a hidden message.",estimatedTime:15,xp:50}:null)||{type:"guide",title:"Start Here — Your Web3 Learning Path",slug:"start-here",why:"This short guide explains how Web3Edu works and helps you choose what to learn next.",estimatedTime:5},y=t&&typeof t.recommendedNext=="object"?t.recommendedNext:null,R=y&&(y.title||y.slug),i=R?y:oe,$=!R,D=!!i?.builderRequired,M=i?.slug?.endsWith("-gr")?i.slug.replace(/-gr$/,""):i?.slug,o=t?.builderChecklist||null,de=(()=>{const r=Array.isArray(t?.timeline)?t.timeline:[],a=new Map;r.forEach((n,d)=>{if(!n)return;const N=`${n.type||"unknown"}:${n.id||n.slug||d}`;a.set(N,n)});const s=t?.labs_completed&&typeof t.labs_completed=="object"?t.labs_completed:{};Object.entries(s).forEach(([n,d])=>{a.set(`lab:${n}`,{type:"lab",id:n,title:d?.title||n,xp:d?.xp||0,badge:d?.badge,completedAt:d?.completedAt})});const l=t?.projectLabs&&typeof t.projectLabs=="object"?t.projectLabs:{};return Object.entries(A).forEach(([n,d])=>{a.set(`project:${n}`,{type:"project",id:n,title:d?.badge||n,badge:d?.badge,xp:l?.[n]?.xp||0,completedAt:d?.completedAt})}),[...a.values()].sort((n,d)=>G(d?.completedAt)-G(n?.completedAt))})(),[z,ce]=x.useState(t?.tier&&t.tier!=="Explorer"),C=Array.isArray(t?.eventBadges)?t.eventBadges:[],m=C.some(r=>{if(typeof r=="string")return r.toLowerCase().includes("genesis");const a=String(r?.name||r?.label||r?.en||r?.gr||"").toLowerCase(),s=String(r?.id||r?.slug||"").toLowerCase();return a.includes("genesis")||s.includes("genesis")});return e.jsx(Fe,{children:e.jsxs("div",{className:`
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
                `}),e.jsxs("div",{className:"absolute inset-0 pointer-events-none",children:[e.jsx("div",{className:"absolute top-[18%] left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-purple-600/30 dark:bg-purple-600/20 blur-[130px] rounded-full"}),e.jsx("div",{className:"absolute bottom-[15%] right-[25%] w-[340px] h-[340px] bg-indigo-400/30 dark:bg-indigo-500/20 blur-[140px] rounded-full"})]}),g&&e.jsxs("div",{className:`
            relative z-10 w-full max-w-5xl mx-auto text-center
            mt-4 mb-16 animate-[fadeSlideUp_0.6s_ease-out]
        `,children:[e.jsx("div",{className:"flex justify-center mb-3",children:e.jsxs("div",{className:"relative",children:[e.jsx("img",{src:g.image||"/icons/web3edu-identity.png",alt:"avatar",className:`
                        w-14 h-14 rounded-full object-cover shadow-md 
                        border border-white/20 dark:border-white/10 
                        transition-all duration-700
                        dark:animate-[shine_3.4s_ease-in-out_infinite]
                    `,loading:"lazy"}),e.jsx("div",{className:`
                        absolute inset-0 rounded-full 
                        dark:bg-white/5 blur-md 
                        dark:animate-[shineGlow_3.4s_ease-in-out_infinite]
                    `})]})}),e.jsxs("h2",{className:"text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-3",children:["Welcome back, ",g.name||B," 👋",t?.tier&&e.jsx("span",{className:`
                inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                bg-gradient-to-r from-purple-600/80 to-fuchsia-500/80
                dark:from-purple-500/60 dark:to-fuchsia-400/60
                text-white shadow-md border border-white/10
            `,children:t.tier})]}),F&&e.jsxs("p",{className:"text-xs text-slate-500 dark:text-slate-400 mt-1",children:["🕒 Synced ",Math.max(1,Math.floor((Date.now()-F.getTime())/1e3)),"s ago • Web3Edu Identity"]}),e.jsx("p",{className:"mt-2 text-sm text-slate-600 dark:text-slate-300",children:"Mint your Web3Edu Identity to anchor your learning on-chain."}),e.jsx("div",{className:`
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
            `})]}),K&&e.jsx("div",{className:"relative z-10 w-full max-w-4xl mx-auto mb-10 px-4",children:e.jsxs("div",{className:`
                            rounded-3xl border border-purple-400/40
                            bg-gradient-to-br from-purple-600/20 via-indigo-600/20 to-fuchsia-600/20
                            backdrop-blur-xl shadow-2xl p-8 text-center
                            animate-[xpBurst_1.2s_ease-out]
                        `,children:[e.jsx("h2",{className:"text-2xl font-extrabold text-white mb-3",children:"🏗️ Builder Level Unlocked"}),e.jsxs("p",{className:"text-sm text-slate-200 mb-6",children:["You have completed the core requirements and unlocked",e.jsx("span",{className:"font-semibold text-purple-300",children:" Builder "}),"status. You are now eligible to participate in advanced governance tracks."]}),ee?e.jsxs("div",{className:`
                                        px-6 py-3 rounded-xl
                                        bg-green-600/90 text-white font-semibold
                                        shadow-lg animate-[xpBurst_1.2s_ease-out]
                                        flex flex-col items-center gap-1
                                    `,children:[e.jsx("span",{children:"✅ Builder Badge Claimed"}),e.jsx("span",{className:"text-[11px] opacity-90",children:"Next milestone: Architect Tier"})]}):e.jsx("button",{onClick:()=>{localStorage.setItem("web3edu-builder-claimed","true"),Q(!0),L(!0),setTimeout(()=>{S(!1),L(!1)},1400)},className:`
                                        px-6 py-3 rounded-xl
                                        bg-gradient-to-r from-purple-500 to-indigo-500
                                        text-white font-semibold
                                        hover:scale-105 transition shadow-lg
                                    `,children:"Claim Builder Badge"})]})}),e.jsxs("div",{className:"relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 px-2 md:px-0",children:[e.jsxs("div",{className:"flex flex-col items-center justify-start mt-10 lg:mt-0 relative self-center",children:[e.jsx("div",{className:"absolute -z-10 top-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-purple-500/25 dark:bg-purple-500/20 blur-[200px] rounded-full"}),g&&e.jsx(Ee,{metadata:g,wallet:u,tokenId:v.tokenId})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-8 md:gap-8",children:[se&&e.jsx(h,{title:"Founder Badge",className:`
                                    rounded-2xl border border-fuchsia-300/30 dark:border-fuchsia-700/30
                                    bg-gradient-to-br from-white/95 via-fuchsia-50/70 to-slate-100/90
                                    dark:from-[#110819]/90 dark:via-[#1a0f21]/85 dark:to-[#0c0814]/90
                                    backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                                    hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                                `,icon:e.jsx(k,{className:"w-5 h-5 text-white"}),children:e.jsxs("p",{className:"text-sm text-slate-700 dark:text-slate-300 leading-relaxed",children:["You hold a"," ",e.jsx("span",{className:"font-semibold text-fuchsia-600 dark:text-fuchsia-400",children:"Founder SBT"}),". A special recognition for the core creators of Web3Edu."]})}),e.jsx(h,{title:"Your Wallet",className:`
                                rounded-2xl border border-cyan-300/30 dark:border-cyan-700/30
                                bg-gradient-to-br from-white/95 via-cyan-50/70 to-slate-100/90
                                dark:from-[#071d24]/90 dark:via-[#0a2730]/85 dark:to-[#06151a]/90
                                backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                                hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                            `,icon:e.jsx(q,{className:"w-5 h-5 text-white"}),children:e.jsx("p",{className:"text-sm font-mono text-slate-700 dark:text-slate-300 break-all",children:u??"—"})}),e.jsx(h,{title:"Rank",className:`
                                rounded-2xl border border-purple-300/30 dark:border-purple-700/30
                                bg-gradient-to-br from-white/95 via-purple-50/70 to-slate-100/90
                                dark:from-[#160f2a]/90 dark:via-[#120c23]/85 dark:to-[#0b0816]/90
                                backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                                hover:scale-[1.005] hover:shadow-2xl transition-all duration-500 relative
                            `,icon:e.jsx(Se,{className:"w-5 h-5 text-white"}),children:e.jsxs("div",{className:"flex flex-col items-start gap-3 cursor-pointer",onClick:()=>_(!0),children:[e.jsxs("div",{className:`
                                        inline-flex items-center gap-2 
                                        px-3 py-1 rounded-full
                                        bg-purple-100/70 dark:bg-purple-900/40
                                        border border-purple-300/40 dark:border-purple-600/60
                                    `,children:[e.jsx("span",{className:"inline-flex h-2.5 w-2.5 rounded-full bg-purple-500 dark:bg-purple-400"}),e.jsx("span",{className:"text-[11px] font-semibold tracking-[0.14em] uppercase text-purple-700 dark:text-purple-200",children:"Current Tier"})]}),e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsxs("div",{className:"flex items-baseline gap-2",children:[e.jsx("p",{className:`
                                                text-2xl font-extrabold text-purple-700 dark:text-purple-200
                                                ${t?.tier==="Builder"?"animate-[xpBurst_1.2s_ease-out]":""}
                                            `,children:t?.tier??"Explorer"}),t?.tier&&t.tier!=="Explorer"&&e.jsx("span",{className:"text-[11px] font-medium text-purple-500/90 dark:text-purple-300/90",children:t.tier==="Builder"?"DAO-ready in progress":"DAO governance ready"})]}),t?.tier&&t.tier!=="Architect"&&e.jsx("div",{className:"mt-2 text-xs text-slate-600/90 dark:text-slate-400/90",children:(()=>{const r=t.tier,a=t?.remainingXp??0;let s="Builder";return r==="Builder"&&(s="Architect"),e.jsxs("span",{children:["Next Tier:"," ",e.jsx("span",{className:"font-semibold text-purple-600 dark:text-purple-300",children:s})," ","• ",a," XP remaining"]})})()}),e.jsx("p",{className:"text-xs text-slate-600/90 dark:text-slate-400/90",children:"Earn XP from lessons and quizzes to upgrade your tier."}),e.jsx("p",{className:"mt-2 text-xs text-slate-600/90 dark:text-slate-400/90",children:t?.tier==="Builder"||t?.tier==="Architect"?"DAO governance access unlocked at your current tier.":"Reach Builder tier to unlock DAO governance access."}),e.jsx("div",{className:"mt-2 text-xs font-semibold",children:t?.tier==="Builder"||t?.tier==="Architect"?e.jsx("span",{className:"text-green-600 dark:text-green-400",children:"🟢 Governance Access: Active"}):e.jsx("span",{className:"text-slate-500 dark:text-slate-400",children:"🔒 Governance Access: Locked"})}),t?.tier==="Builder"&&e.jsx("p",{className:"text-[11px] mt-1 text-slate-500 dark:text-slate-400",children:"Architect tier unlocks proposal publishing & advanced governance tools."})]})]})}),e.jsx(h,{title:"Progress",className:`
                            rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                            bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                            dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                            dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                            hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                        `,icon:e.jsx(k,{className:"w-5 h-5 text-white"}),children:e.jsx(Te,{xp:t?.xp_total??0,xpPercent:t?.xpPercent??0,remainingXp:t?.remainingXp??0,nextTierPercent:t?.nextTierPercent??0,tier:t?.tier??"Explorer",xpLeveledUp:H})}),e.jsxs(h,{title:"Quick Actions",className:`
                            rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                            bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                            dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                            dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                            hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                        `,icon:e.jsx(U,{className:"w-5 h-5 text-white"}),children:[e.jsx("p",{className:"text-sm text-slate-700 dark:text-slate-200 mb-4 leading-relaxed",children:"Here you can find the main actions for your Web3Edu identity and learning journey."}),e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx("button",{onClick:()=>p("/sbt-view"),className:"py-3 px-6 rounded-xl bg-gradient-to-r from-[#7F3DF1] to-[#5F2BD8] text-white hover:scale-[1.03] hover:opacity-90 transition font-semibold shadow-md",children:"View My SBT"}),e.jsx("button",{onClick:()=>p("/labs"),className:"py-3 px-6 rounded-xl bg-gradient-to-r from-[#33D6FF] to-[#24A9D0] text-white hover:scale-[1.03] hover:opacity-90 transition font-semibold shadow-md",children:"Continue Learning"}),e.jsx("div",{className:"mt-3",children:e.jsx("button",{onClick:()=>p("/start-here"),className:`
  w-full py-3 px-6 rounded-xl
  bg-gradient-to-r from-indigo-500/80 to-purple-500/80
  text-white
  hover:scale-[1.03] hover:opacity-90
  transition
  font-semibold shadow-md
`,children:"Start Here (guide)"})})]})]}),e.jsxs(h,{title:"Badges",className:`
                        rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                        bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                        dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                        dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                        hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                    `,icon:e.jsx(k,{className:"w-5 h-5 text-white"}),children:[e.jsx("p",{className:"text-sm text-slate-700 dark:text-slate-200 mb-4 leading-relaxed",children:"All your achievements and earned badges will appear here as you progress."}),t?.badges?.length>0||C.length>0?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"flex flex-wrap gap-2",children:[t?.badges?.map((r,a)=>{let s=k;const l=typeof r=="string"?r.toLowerCase():r?.label?.toLowerCase?.()||r?.en?.toLowerCase?.()||r?.gr?.toLowerCase?.()||"";return l.includes("wallet")&&(s=q),l.includes("lesson")&&(s=Re),l.includes("quiz")&&(s=$e),e.jsxs("span",{className:`
                            inline-flex items-center gap-2 
                            px-3 py-1 rounded-full 
                            text-xs font-semibold
                            bg-indigo-200/60 dark:bg-indigo-900/40
                            border border-indigo-300/30 dark:border-indigo-700/30
                            text-slate-900 dark:text-slate-100
                        `,children:[e.jsx(s,{className:"w-4 h-4 text-white/90"}),typeof r=="string"?r:r?.en||r?.gr||r?.label||JSON.stringify(r)]},`badge-${a}-${typeof r=="string"?r:r?.id||"badge"}`)}),C.map((r,a)=>{const s=typeof r=="string"?r:r?.name||"Event Badge",n=String(s).toLowerCase().includes("genesis");return e.jsxs("span",{className:`
                                                        inline-flex items-center gap-2
                                                        px-3 py-1 rounded-full
                                                        text-xs font-semibold
                                                        ${n?"bg-gradient-to-r from-purple-500/80 to-fuchsia-500/80 text-white border border-purple-300/40 shadow-[0_0_10px_rgba(168,85,247,0.6)] animate-[genesisPulse_0.9s_ease-out]":"bg-purple-200/70 dark:bg-purple-900/40 border border-purple-300/40 dark:border-purple-700/40 text-slate-900 dark:text-slate-100"}
                                                    `,children:[e.jsx(k,{className:`w-4 h-4 ${n?"text-yellow-300":"text-white/90"}`}),s]},`event-badge-${a}`)})]}),e.jsx("div",{className:"w-full mt-4",children:e.jsx("button",{disabled:m,onClick:()=>{m||p("/events/genesis")},className:`
                                                w-full py-2 px-4 rounded-lg
                                                text-xs font-semibold transition shadow-md
                                                ${m?"bg-green-500 text-white cursor-default":"bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:scale-[1.02]"}
                                            `,children:m?"Genesis Badge Minted ✓":"Mint Genesis Event Badge"})})]}):e.jsxs(e.Fragment,{children:[e.jsx("p",{className:"text-slate-600 dark:text-slate-300",children:"No badges yet…"}),e.jsx("div",{className:"w-full mt-4",children:e.jsx("button",{disabled:m,onClick:()=>{m||p("/events/genesis")},className:`
                                                w-full py-2 px-4 rounded-lg
                                                text-xs font-semibold transition shadow-md
                                                ${m?"bg-green-500 text-white cursor-default":"bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:scale-[1.02]"}
                                            `,children:m?"Genesis Badge Minted ✓":"Mint Genesis Event Badge"})})]})]})]})]}),i&&e.jsx("div",{className:"relative z-10 w-full max-w-6xl mx-auto mt-6 mb-8 px-2 md:px-0",children:e.jsxs(h,{title:"Recommended Next Module",className:`
                rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                dark:border-white/10 backdrop-blur-xl shadow-xl
                hover:scale-[1.002] hover:shadow-2xl transition-all duration-500
            `,icon:e.jsx(U,{className:"w-5 h-5 text-white"}),children:[o&&e.jsxs("div",{className:`mb-4 rounded-xl border border-purple-300/30 dark:border-purple-700/40 
                                                bg-purple-50/70 dark:bg-purple-900/20 p-4`,children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx("span",{className:"text-xs font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-300",children:"🏗 Builder Path"}),t?.tier==="Explorer"&&e.jsx("button",{onClick:r=>{r.stopPropagation(),ce(a=>!a)},className:"text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline",children:z?"Hide details":"View requirements"}),t?.tier!=="Explorer"&&(o.coreLabs?.done&&o.daoLabs?.done&&o.proofOfEscape?.done&&o.xpRequirement?.done?e.jsx("span",{className:"text-green-600 dark:text-green-400 text-xs font-semibold",children:"✔ Builder Unlocked"}):e.jsx("span",{className:"text-xs text-slate-500 dark:text-slate-400",children:"In Progress"}))]}),z&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs",children:[e.jsxs("div",{children:[o.coreLabs?.done?"✔":"⏳"," Core Labs (",o.coreLabs?.completed,"/",o.coreLabs?.required,")"]}),e.jsxs("div",{children:[o.daoLabs?.done?"✔":"⏳"," DAO Labs (",o.daoLabs?.completed,"/",o.daoLabs?.required,")"]}),e.jsxs("div",{children:[o.proofOfEscape?.done?"✔":"⏳"," Proof of Escape"]}),e.jsxs("div",{children:[o.xpRequirement?.done?"✔":"⏳"," XP (",o.xpRequirement?.current,"/",o.xpRequirement?.required,")"]})]}),(()=>{const a=(o.coreLabs?.done?1:0)+(o.daoLabs?.done?1:0)+(o.proofOfEscape?.done?1:0),s=Math.round(a/3*100);return e.jsxs("div",{className:"mt-4",children:[e.jsxs("div",{className:"flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1",children:[e.jsx("span",{children:"Builder Progress"}),e.jsxs("span",{children:[a,"/",3," requirements"]})]}),e.jsx("div",{className:"w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden",children:e.jsx("div",{className:"h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500",style:{width:`${s}%`}})})]})})()]})]}),e.jsxs("div",{className:"space-y-3 cursor-pointer",onClick:()=>{if(i.type==="guide"&&i.slug){p(`/${i.slug}`);return}if(i.type==="lab"&&M){p(`/labs/${M}`);return}if(i.type==="lesson"&&i.slug){p(`/lessons/${i.slug}`);return}if(i.type==="project"&&i.slug){p(`/projects/${i.slug}`);return}p("/education")},children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("p",{className:"text-xs uppercase tracking-wide text-indigo-600 dark:text-indigo-400 font-semibold",children:$?"Start Here":"Recommended for you"}),D&&e.jsx("span",{className:`
                                            inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold
                                            bg-purple-100/80 dark:bg-purple-900/40
                                            border border-purple-300/40 dark:border-purple-600/60
                                            text-purple-700 dark:text-purple-300
                                        `,children:"🏗 Builder Path"}),D&&e.jsx("span",{className:`
                                            text-[10px] font-medium text-slate-500 dark:text-slate-400
                                        `,children:"Final Builder Requirement"})]}),e.jsx("p",{className:"text-xl font-bold text-slate-900 dark:text-white leading-snug",children:typeof i.title=="object"?i.title.en||i.title.gr:i.title}),i.why&&e.jsxs("div",{className:"mt-1",children:[e.jsx("p",{className:"text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-500 mb-1",children:$?"Suggested next step":"Why this is recommended"}),e.jsx("p",{className:"text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl",children:typeof i.why=="object"?i.why.en||i.why.gr:i.why})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-6 pt-1 text-sm text-slate-600 dark:text-slate-400",children:[i.estimatedTime&&e.jsxs("span",{children:["⏱ ",i.estimatedTime," min"]}),i.xp&&e.jsxs("span",{children:["🏅 +",i.xp," XP"]})]}),e.jsx("div",{className:"pt-2",children:e.jsx("span",{className:"inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400",children:"Continue →"})})]})]})}),e.jsx("div",{className:"relative z-10 w-full max-w-6xl mx-auto mt-12 px-2 md:px-0",children:e.jsx(Le,{timeline:de})}),e.jsx("div",{className:`pointer-events-none fixed top-0 right-0 w-[300px] h-full
                                bg-gradient-to-b from-[#8A57FF]/35 via-[#4ACBFF]/25 to-[#FF67D2]/35
                                blur-[160px] opacity-60`}),Y&&e.jsx("div",{className:"fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50",children:e.jsxs("div",{className:"bg-[#0f0f17] p-6 rounded-2xl w-80 border border-white/10 shadow-xl",children:[e.jsx("h2",{className:"text-xl font-bold mb-3 flex items-center gap-2",children:"Tier Benefits"}),e.jsxs("ul",{className:"text-white/80 text-sm space-y-2",children:[e.jsx("li",{children:"🟣 Explorer — Basic access, community role, progress tracking"}),e.jsx("li",{children:"🔵 Builder — Unlock advanced lessons, early DAO proposals"}),e.jsx("li",{children:"🟡 Architect — Full DAO access, beta features, priority badges"})]}),e.jsx("p",{className:"text-white/70 text-sm mt-4",children:"How to upgrade your tier:"}),e.jsxs("ul",{className:"text-white/80 text-sm space-y-1 mt-1",children:[e.jsx("li",{children:"• Complete lessons and quizzes to earn XP."}),e.jsx("li",{children:"• Return regularly and finish learning paths."}),e.jsx("li",{children:"• Participate in community / DAO activities (future)."})]}),e.jsx("button",{onClick:()=>_(!1),className:"mt-5 w-full py-2 rounded-xl bg-white/10 hover:bg-white/40 transition text-white font-semibold text-sm tracking-wide",children:"Close"})]})})]})})}export{We as default};
