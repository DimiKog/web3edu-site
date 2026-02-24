import{u as ce,r as d,j as e}from"./vendor-react-XZtyZRd7.js";import{s as xe,P as me}from"./index-CV0KsBrl.js";import{I as ue,D as x,F as w,a as I,b as pe,X as he,c as z,L as fe,d as be,e as ge}from"./IdentityCard-53DPjz3n.js";import{u as we}from"./vendor-web3-Dys35WFk.js";import"./identity-icon-MXImXT_G.js";function Be(){const{address:m,isConnected:j}=we(),c=ce(),[t,q]=d.useState(null),[$,v]=d.useState(!1),[O,N]=d.useState(!1),b=d.useRef(null),[u,X]=d.useState(null),[y,M]=d.useState(null),[W,B]=d.useState(!1),[A,U]=d.useState(localStorage.getItem("web3edu-builder-claimed")==="true"),[H,C]=d.useState(!1),J=d.useRef(null),G={tier:"Explorer",xp:0,xpPercent:0,remainingXp:0,nextTierPercent:0,lessonsCompleted:0},Y=t&&typeof t=="object"&&!Array.isArray(t)?t:{},F={...G,...Y},V=(()=>{const r=F||{},a=u||{},l=[...Array.isArray(r.attributes)?r.attributes:[],...Array.isArray(a.attributes)?a.attributes:[]].some(p=>(p?.trait_type||"").toLowerCase()==="founder"&&(p?.value===!0||String(p?.value).toLowerCase()==="true"));return r.founder===!0||a.founder===!0||r.edition==="Founder Edition"||a.edition==="Founder Edition"||r.role==="Founder"||a.role==="Founder"||l})();d.useEffect(()=>{j||c("/join"),window.scrollTo(0,0)},[j,c]);const k=xe(m),K=r=>{const a=[r?.tokenId,r?.token_id,r?.tokenID,r?.metadata?.tokenId,r?.metadata?.token_id,r?.profile?.tokenId,r?.profile?.token_id,r?.metadata?.metadata?.tokenId,r?.metadata?.metadata?.token_id,r?.profile?.metadata?.tokenId,r?.profile?.metadata?.token_id];for(const s of a)if(s!=null&&s!=="")return s;return null};d.useEffect(()=>{if(!m)return;fetch(`https://web3edu-api.dimikog.org/web3sbt/resolve/${m}`).then(a=>{if(!a.ok)throw new Error(`HTTP ${a.status}`);return a.json()}).then(a=>{const s=a?.metadata?.metadata&&typeof a.metadata.metadata=="object"?a.metadata.metadata:a?.metadata&&typeof a.metadata=="object"?a.metadata:{},l=a?.profile?.metadata&&typeof a.profile.metadata=="object"?a.profile.metadata:a?.profile&&typeof a.profile=="object"?a.profile:{};q({...s,tokenId:K(a)});const p=o=>{if(typeof o=="string")try{return JSON.parse(o)}catch{return null}return o},R=o=>{const ne=[o?.attributes,o?.attribute,o?.attrs,o?.traits,o?.traits_array,o?.traitsArray,o?.attributes_json,o?.attributesJson];for(const le of ne){const f=p(le);if(Array.isArray(f))return f;if(f&&typeof f=="object")return Object.entries(f).map(([oe,de])=>({trait_type:oe,value:de}))}return[]},ee=R(s),te=R(l),h=[...ee,...te],T=l.role||s.role,D=l.specialization||l.speciality||s.specialization||s.speciality,re=h.some(o=>(o.trait_type||"").toLowerCase()==="role"),ae=h.some(o=>["specialization","speciality"].includes((o.trait_type||"").toLowerCase()));!re&&T&&h.push({trait_type:"Role",value:T}),!ae&&D&&h.push({trait_type:"Specialization",value:D});const se=l.image&&l.image.trim()!==""?l.image:l.avatar&&l.avatar.trim()!==""?l.avatar:s.image&&s.image.trim()!==""?s.image:s.avatar&&s.avatar.trim()!==""?s.avatar:null,ie={...s,...l,name:l.name||s.name||k||"Web3Edu Identity",image:se,attributes:h};X(ie),M(new Date)}).catch(a=>{console.error("Failed to fetch metadata:",a)})},[m,k]),d.useEffect(()=>{if(!t||typeof t.xp!="number")return;let r;return b.current==null||t.xp>b.current&&(N(!0),r=setTimeout(()=>N(!1),1200)),b.current=t.xp,()=>{r&&clearTimeout(r)}},[t]),d.useEffect(()=>{const r=t?.tier;if(r)try{localStorage.setItem("web3edu-tier",r)}catch(a){console.error("Failed to persist tier in localStorage:",a)}},[t?.tier]),d.useEffect(()=>{t?.tier&&(t.tier==="Builder"&&!A&&B(!0),J.current=t.tier)},[t?.tier,A]);const Q={type:"guide",title:"Start Here — Your Web3 Learning Path",slug:"start-here",why:"This short guide explains how Web3Edu works and helps you choose what to learn next.",estimatedTime:5},g=t&&typeof t.recommendedNext=="object"?t.recommendedNext:null,E=g&&(g.title||g.slug),i=E?g:Q,P=!E,S=!!i?.builderRequired,_=i?.slug?.endsWith("-gr")?i.slug.replace(/-gr$/,""):i?.slug,n=t?.builderChecklist||null,[L,Z]=d.useState(t?.tier&&t.tier!=="Explorer");return e.jsx(me,{children:e.jsxs("div",{className:`
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
                `}),e.jsxs("div",{className:"absolute inset-0 pointer-events-none",children:[e.jsx("div",{className:"absolute top-[18%] left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-purple-600/30 dark:bg-purple-600/20 blur-[130px] rounded-full"}),e.jsx("div",{className:"absolute bottom-[15%] right-[25%] w-[340px] h-[340px] bg-indigo-400/30 dark:bg-indigo-500/20 blur-[140px] rounded-full"})]}),u&&e.jsxs("div",{className:`
            relative z-10 w-full max-w-5xl mx-auto text-center
            mt-4 mb-16 animate-[fadeSlideUp_0.6s_ease-out]
        `,children:[e.jsx("div",{className:"flex justify-center mb-3",children:e.jsxs("div",{className:"relative",children:[e.jsx("img",{src:u.image||"/icons/web3edu-identity.png",alt:"avatar",className:`
                        w-14 h-14 rounded-full object-cover shadow-md 
                        border border-white/20 dark:border-white/10 
                        transition-all duration-700
                        dark:animate-[shine_3.4s_ease-in-out_infinite]
                    `,loading:"lazy"}),e.jsx("div",{className:`
                        absolute inset-0 rounded-full 
                        dark:bg-white/5 blur-md 
                        dark:animate-[shineGlow_3.4s_ease-in-out_infinite]
                    `})]})}),e.jsxs("h2",{className:"text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-3",children:["Welcome back, ",u.name||k," 👋",t?.tier&&e.jsx("span",{className:`
                inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                bg-gradient-to-r from-purple-600/80 to-fuchsia-500/80
                dark:from-purple-500/60 dark:to-fuchsia-400/60
                text-white shadow-md border border-white/10
            `,children:t.tier})]}),y&&e.jsxs("p",{className:"text-xs text-slate-500 dark:text-slate-400 mt-1",children:["🕒 Synced ",Math.max(1,Math.floor((Date.now()-y.getTime())/1e3)),"s ago • Web3Edu Identity"]}),e.jsx("p",{className:"mt-2 text-sm text-slate-600 dark:text-slate-300",children:"Mint your Web3Edu Identity to anchor your learning on-chain."}),e.jsx("div",{className:`
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
            `})]}),W&&e.jsx("div",{className:"relative z-10 w-full max-w-4xl mx-auto mb-10 px-4",children:e.jsxs("div",{className:`
                            rounded-3xl border border-purple-400/40
                            bg-gradient-to-br from-purple-600/20 via-indigo-600/20 to-fuchsia-600/20
                            backdrop-blur-xl shadow-2xl p-8 text-center
                            animate-[xpBurst_1.2s_ease-out]
                        `,children:[e.jsx("h2",{className:"text-2xl font-extrabold text-white mb-3",children:"🏗️ Builder Level Unlocked"}),e.jsxs("p",{className:"text-sm text-slate-200 mb-6",children:["You have completed the core requirements and unlocked",e.jsx("span",{className:"font-semibold text-purple-300",children:" Builder "}),"status. You are now eligible to participate in advanced governance tracks."]}),H?e.jsxs("div",{className:`
                                        px-6 py-3 rounded-xl
                                        bg-green-600/90 text-white font-semibold
                                        shadow-lg animate-[xpBurst_1.2s_ease-out]
                                        flex flex-col items-center gap-1
                                    `,children:[e.jsx("span",{children:"✅ Builder Badge Claimed"}),e.jsx("span",{className:"text-[11px] opacity-90",children:"Next milestone: Architect Tier"})]}):e.jsx("button",{onClick:()=>{localStorage.setItem("web3edu-builder-claimed","true"),U(!0),C(!0),setTimeout(()=>{B(!1),C(!1)},1400)},className:`
                                        px-6 py-3 rounded-xl
                                        bg-gradient-to-r from-purple-500 to-indigo-500
                                        text-white font-semibold
                                        hover:scale-105 transition shadow-lg
                                    `,children:"Claim Builder Badge"})]})}),e.jsxs("div",{className:"relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 px-2 md:px-0",children:[e.jsxs("div",{className:"flex flex-col items-center justify-start mt-10 lg:mt-0 relative self-center",children:[e.jsx("div",{className:"absolute -z-10 top-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-purple-500/25 dark:bg-purple-500/20 blur-[200px] rounded-full"}),u&&e.jsx(ue,{metadata:u,wallet:m,tokenId:F.tokenId})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-8 md:gap-8",children:[V&&e.jsx(x,{title:"Founder Badge",className:`
                                    rounded-2xl border border-fuchsia-300/30 dark:border-fuchsia-700/30
                                    bg-gradient-to-br from-white/95 via-fuchsia-50/70 to-slate-100/90
                                    dark:from-[#110819]/90 dark:via-[#1a0f21]/85 dark:to-[#0c0814]/90
                                    backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                                    hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                                `,icon:e.jsx(w,{className:"w-5 h-5 text-white"}),children:e.jsxs("p",{className:"text-sm text-slate-700 dark:text-slate-300 leading-relaxed",children:["You hold a"," ",e.jsx("span",{className:"font-semibold text-fuchsia-600 dark:text-fuchsia-400",children:"Founder SBT"}),". A special recognition for the core creators of Web3Edu."]})}),e.jsx(x,{title:"Your Wallet",className:`
                                rounded-2xl border border-cyan-300/30 dark:border-cyan-700/30
                                bg-gradient-to-br from-white/95 via-cyan-50/70 to-slate-100/90
                                dark:from-[#071d24]/90 dark:via-[#0a2730]/85 dark:to-[#06151a]/90
                                backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                                hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                            `,icon:e.jsx(I,{className:"w-5 h-5 text-white"}),children:e.jsx("p",{className:"text-sm font-mono text-slate-700 dark:text-slate-300 break-all",children:m??"—"})}),e.jsx(x,{title:"Rank",className:`
                                rounded-2xl border border-purple-300/30 dark:border-purple-700/30
                                bg-gradient-to-br from-white/95 via-purple-50/70 to-slate-100/90
                                dark:from-[#160f2a]/90 dark:via-[#120c23]/85 dark:to-[#0b0816]/90
                                backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                                hover:scale-[1.005] hover:shadow-2xl transition-all duration-500 relative
                            `,icon:e.jsx(pe,{className:"w-5 h-5 text-white"}),children:e.jsxs("div",{className:"flex flex-col items-start gap-3 cursor-pointer",onClick:()=>v(!0),children:[e.jsxs("div",{className:`
                                        inline-flex items-center gap-2 
                                        px-3 py-1 rounded-full
                                        bg-purple-100/70 dark:bg-purple-900/40
                                        border border-purple-300/40 dark:border-purple-600/60
                                    `,children:[e.jsx("span",{className:"inline-flex h-2.5 w-2.5 rounded-full bg-purple-500 dark:bg-purple-400"}),e.jsx("span",{className:"text-[11px] font-semibold tracking-[0.14em] uppercase text-purple-700 dark:text-purple-200",children:"Current Tier"})]}),e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsxs("div",{className:"flex items-baseline gap-2",children:[e.jsx("p",{className:`
                                                text-2xl font-extrabold text-purple-700 dark:text-purple-200
                                                ${t?.tier==="Builder"?"animate-[xpBurst_1.2s_ease-out]":""}
                                            `,children:t?.tier??"Explorer"}),t?.tier&&t.tier!=="Explorer"&&e.jsx("span",{className:"text-[11px] font-medium text-purple-500/90 dark:text-purple-300/90",children:t.tier==="Builder"?"DAO-ready in progress":"DAO governance ready"})]}),t?.tier&&t.tier!=="Architect"&&e.jsx("div",{className:"mt-2 text-xs text-slate-600/90 dark:text-slate-400/90",children:(()=>{const r=t.tier,a=t?.remainingXp??0;let s="Builder";return r==="Builder"&&(s="Architect"),e.jsxs("span",{children:["Next Tier:"," ",e.jsx("span",{className:"font-semibold text-purple-600 dark:text-purple-300",children:s})," ","• ",a," XP remaining"]})})()}),e.jsx("p",{className:"text-xs text-slate-600/90 dark:text-slate-400/90",children:"Earn XP from lessons and quizzes to upgrade your tier."}),e.jsx("p",{className:"mt-2 text-xs text-slate-600/90 dark:text-slate-400/90",children:t?.tier==="Builder"||t?.tier==="Architect"?"DAO governance access unlocked at your current tier.":"Reach Builder tier to unlock DAO governance access."}),e.jsx("div",{className:"mt-2 text-xs font-semibold",children:t?.tier==="Builder"||t?.tier==="Architect"?e.jsx("span",{className:"text-green-600 dark:text-green-400",children:"🟢 Governance Access: Active"}):e.jsx("span",{className:"text-slate-500 dark:text-slate-400",children:"🔒 Governance Access: Locked"})}),t?.tier==="Builder"&&e.jsx("p",{className:"text-[11px] mt-1 text-slate-500 dark:text-slate-400",children:"Architect tier unlocks proposal publishing & advanced governance tools."})]})]})}),e.jsx(x,{title:"Progress",className:`
                            rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                            bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                            dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                            dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                            hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                        `,icon:e.jsx(w,{className:"w-5 h-5 text-white"}),children:e.jsx(he,{xp:t?.xp??0,xpPercent:t?.xpPercent??0,remainingXp:t?.remainingXp??0,nextTierPercent:t?.nextTierPercent??0,tier:t?.tier??"Explorer",xpLeveledUp:O})}),e.jsxs(x,{title:"Quick Actions",className:`
                            rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                            bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                            dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                            dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                            hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                        `,icon:e.jsx(z,{className:"w-5 h-5 text-white"}),children:[e.jsx("p",{className:"text-sm text-slate-700 dark:text-slate-200 mb-4 leading-relaxed",children:"Here you can find the main actions for your Web3Edu identity and learning journey."}),e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx("button",{onClick:()=>c("/sbt-view"),className:"py-3 px-6 rounded-xl bg-gradient-to-r from-[#7F3DF1] to-[#5F2BD8] text-white hover:scale-[1.03] hover:opacity-90 transition font-semibold shadow-md",children:"View My SBT"}),e.jsx("button",{onClick:()=>c("/labs"),className:"py-3 px-6 rounded-xl bg-gradient-to-r from-[#33D6FF] to-[#24A9D0] text-white hover:scale-[1.03] hover:opacity-90 transition font-semibold shadow-md",children:"Continue Learning"}),e.jsx("div",{className:"mt-3",children:e.jsx("button",{onClick:()=>c("/start-here"),className:`
  w-full py-3 px-6 rounded-xl
  bg-gradient-to-r from-indigo-500/80 to-purple-500/80
  text-white
  hover:scale-[1.03] hover:opacity-90
  transition
  font-semibold shadow-md
`,children:"Start Here (guide)"})})]})]}),e.jsxs(x,{title:"Badges",className:`
                        rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                        bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                        dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                        dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                        hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                    `,icon:e.jsx(w,{className:"w-5 h-5 text-white"}),children:[e.jsx("p",{className:"text-sm text-slate-700 dark:text-slate-200 mb-4 leading-relaxed",children:"All your achievements and earned badges will appear here as you progress."}),t&&t.badges?.length>0?e.jsx("div",{className:"flex flex-wrap gap-2",children:t.badges.map((r,a)=>{let s=w;const l=typeof r=="string"?r.toLowerCase():r?.label?.toLowerCase?.()||r?.en?.toLowerCase?.()||r?.gr?.toLowerCase?.()||"";return l.includes("wallet")&&(s=I),l.includes("lesson")&&(s=be),l.includes("quiz")&&(s=ge),e.jsxs("span",{className:`
                                                inline-flex items-center gap-2 
                                                px-3 py-1 rounded-full 
                                                text-xs font-semibold
                                                bg-indigo-200/60 dark:bg-indigo-900/40
                                                border border-indigo-300/30 dark:border-indigo-700/30
                                                text-slate-900 dark:text-slate-100
                                            `,children:[e.jsx(s,{className:"w-4 h-4 text-white/90"}),typeof r=="string"?r:r?.en||r?.gr||r?.label||JSON.stringify(r)]},`${a}-${typeof r=="string"?r:r?.id||"badge"}`)})}):e.jsx("p",{className:"text-slate-600 dark:text-slate-300",children:"No badges yet…"})]})]})]}),i&&e.jsx("div",{className:"relative z-10 w-full max-w-6xl mx-auto mt-6 mb-8 px-2 md:px-0",children:e.jsxs(x,{title:"Recommended Next Module",className:`
                rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                dark:border-white/10 backdrop-blur-xl shadow-xl
                hover:scale-[1.002] hover:shadow-2xl transition-all duration-500
            `,icon:e.jsx(z,{className:"w-5 h-5 text-white"}),children:[n&&e.jsxs("div",{className:`mb-4 rounded-xl border border-purple-300/30 dark:border-purple-700/40 
                                                bg-purple-50/70 dark:bg-purple-900/20 p-4`,children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx("span",{className:"text-xs font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-300",children:"🏗 Builder Path"}),t?.tier==="Explorer"&&e.jsx("button",{onClick:r=>{r.stopPropagation(),Z(a=>!a)},className:"text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline",children:L?"Hide details":"View requirements"}),t?.tier!=="Explorer"&&(n.coreLabs?.done&&n.daoLabs?.done&&n.proofOfEscape?.done&&n.xpRequirement?.done?e.jsx("span",{className:"text-green-600 dark:text-green-400 text-xs font-semibold",children:"✔ Builder Unlocked"}):e.jsx("span",{className:"text-xs text-slate-500 dark:text-slate-400",children:"In Progress"}))]}),L&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs",children:[e.jsxs("div",{children:[n.coreLabs?.done?"✔":"⏳"," Core Labs (",n.coreLabs?.completed,"/",n.coreLabs?.required,")"]}),e.jsxs("div",{children:[n.daoLabs?.done?"✔":"⏳"," DAO Labs (",n.daoLabs?.completed,"/",n.daoLabs?.required,")"]}),e.jsxs("div",{children:[n.proofOfEscape?.done?"✔":"⏳"," Proof of Escape"]}),e.jsxs("div",{children:[n.xpRequirement?.done?"✔":"⏳"," XP (",n.xpRequirement?.current,"/",n.xpRequirement?.required,")"]})]}),(()=>{const a=(n.coreLabs?.done?1:0)+(n.daoLabs?.done?1:0)+(n.proofOfEscape?.done?1:0),s=Math.round(a/3*100);return e.jsxs("div",{className:"mt-4",children:[e.jsxs("div",{className:"flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1",children:[e.jsx("span",{children:"Builder Progress"}),e.jsxs("span",{children:[a,"/",3," requirements"]})]}),e.jsx("div",{className:"w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden",children:e.jsx("div",{className:"h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500",style:{width:`${s}%`}})})]})})()]})]}),e.jsxs("div",{className:"space-y-3 cursor-pointer",onClick:()=>{if(i.type==="guide"&&i.slug){c(`/${i.slug}`);return}if(i.type==="lab"&&_){c(`/labs/${_}`);return}if(i.type==="lesson"&&i.slug){c(`/lessons/${i.slug}`);return}c("/education")},children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("p",{className:"text-xs uppercase tracking-wide text-indigo-600 dark:text-indigo-400 font-semibold",children:P?"Start Here":"Recommended for you"}),S&&e.jsx("span",{className:`
                                            inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold
                                            bg-purple-100/80 dark:bg-purple-900/40
                                            border border-purple-300/40 dark:border-purple-600/60
                                            text-purple-700 dark:text-purple-300
                                        `,children:"🏗 Builder Path"}),S&&e.jsx("span",{className:`
                                            text-[10px] font-medium text-slate-500 dark:text-slate-400
                                        `,children:"Final Builder Requirement"})]}),e.jsx("p",{className:"text-xl font-bold text-slate-900 dark:text-white leading-snug",children:typeof i.title=="object"?i.title.en||i.title.gr:i.title}),i.why&&e.jsxs("div",{className:"mt-1",children:[e.jsx("p",{className:"text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-500 mb-1",children:P?"Suggested next step":"Why this is recommended"}),e.jsx("p",{className:"text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl",children:typeof i.why=="object"?i.why.en||i.why.gr:i.why})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-6 pt-1 text-sm text-slate-600 dark:text-slate-400",children:[i.estimatedTime&&e.jsxs("span",{children:["⏱ ",i.estimatedTime," min"]}),i.xp&&e.jsxs("span",{children:["🏅 +",i.xp," XP"]})]}),e.jsx("div",{className:"pt-2",children:e.jsx("span",{className:"inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400",children:"Continue →"})})]})]})}),e.jsx("div",{className:"relative z-10 w-full max-w-6xl mx-auto mt-12 px-2 md:px-0",children:e.jsx(fe,{timeline:t?.timeline||[]})}),e.jsx("div",{className:`pointer-events-none fixed top-0 right-0 w-[300px] h-full
                                bg-gradient-to-b from-[#8A57FF]/35 via-[#4ACBFF]/25 to-[#FF67D2]/35
                                blur-[160px] opacity-60`}),$&&e.jsx("div",{className:"fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50",children:e.jsxs("div",{className:"bg-[#0f0f17] p-6 rounded-2xl w-80 border border-white/10 shadow-xl",children:[e.jsx("h2",{className:"text-xl font-bold mb-3 flex items-center gap-2",children:"Tier Benefits"}),e.jsxs("ul",{className:"text-white/80 text-sm space-y-2",children:[e.jsx("li",{children:"🟣 Explorer — Basic access, community role, progress tracking"}),e.jsx("li",{children:"🔵 Builder — Unlock advanced lessons, early DAO proposals"}),e.jsx("li",{children:"🟡 Architect — Full DAO access, beta features, priority badges"})]}),e.jsx("p",{className:"text-white/70 text-sm mt-4",children:"How to upgrade your tier:"}),e.jsxs("ul",{className:"text-white/80 text-sm space-y-1 mt-1",children:[e.jsx("li",{children:"• Complete lessons and quizzes to earn XP."}),e.jsx("li",{children:"• Return regularly and finish learning paths."}),e.jsx("li",{children:"• Participate in community / DAO activities (future)."})]}),e.jsx("button",{onClick:()=>v(!1),className:"mt-5 w-full py-2 rounded-xl bg-white/10 hover:bg-white/40 transition text-white font-semibold text-sm tracking-wide",children:"Close"})]})})]})})}export{Be as default};
