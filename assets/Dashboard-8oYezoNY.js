import{u as ue,r as d,j as e}from"./vendor-react-XZtyZRd7.js";import{s as me,P as pe}from"./index-Rnn1tWvM.js";import{I as he,D as m,F as b,a as z,b as ge,X as fe,c as q,L as be,d as we,e as ke}from"./IdentityCard-53DPjz3n.js";import{u as je}from"./vendor-web3-Dys35WFk.js";import"./identity-icon-MXImXT_G.js";function Ae(){const{address:p,isConnected:N}=je(),c=ue(),[r,M]=d.useState(null),[O,y]=d.useState(!1),[X,B]=d.useState(!1),w=d.useRef(null),[h,G]=d.useState(null),[C,W]=d.useState(null),[U,A]=d.useState(!1),[F,H]=d.useState(localStorage.getItem("web3edu-builder-claimed")==="true"),[J,E]=d.useState(!1),Y=d.useRef(null),V={tier:"Explorer",xp:0,xpPercent:0,remainingXp:0,nextTierPercent:0,lessonsCompleted:0},K=r&&typeof r=="object"&&!Array.isArray(r)?r:{},S={...V,...K},Q=(()=>{const t=S||{},s=h||{},n=[...Array.isArray(t.attributes)?t.attributes:[],...Array.isArray(s.attributes)?s.attributes:[]].some(u=>(u?.trait_type||"").toLowerCase()==="founder"&&(u?.value===!0||String(u?.value).toLowerCase()==="true"));return t.founder===!0||s.founder===!0||t.edition==="Founder Edition"||s.edition==="Founder Edition"||t.role==="Founder"||s.role==="Founder"||n})();d.useEffect(()=>{N||c("/join"),window.scrollTo(0,0)},[N,c]);const j=me(p),Z=t=>{const s=[t?.tokenId,t?.token_id,t?.tokenID,t?.metadata?.tokenId,t?.metadata?.token_id,t?.profile?.tokenId,t?.profile?.token_id,t?.metadata?.metadata?.tokenId,t?.metadata?.metadata?.token_id,t?.profile?.metadata?.tokenId,t?.profile?.metadata?.token_id];for(const a of s)if(a!=null&&a!=="")return a;return null};d.useEffect(()=>{if(!p)return;fetch(`https://web3edu-api.dimikog.org/web3sbt/resolve/${p}`).then(s=>{if(!s.ok)throw new Error(`HTTP ${s.status}`);return s.json()}).then(s=>{const a=s?.metadata?.metadata&&typeof s.metadata.metadata=="object"?s.metadata.metadata:s?.metadata&&typeof s.metadata=="object"?s.metadata:{},n=s?.profile?.metadata&&typeof s.profile.metadata=="object"?s.profile.metadata:s?.profile&&typeof s.profile=="object"?s.profile:{};M({...a,tokenId:Z(s)});const u=o=>{if(typeof o=="string")try{return JSON.parse(o)}catch{return null}return o},D=o=>{const oe=[o?.attributes,o?.attribute,o?.attrs,o?.traits,o?.traits_array,o?.traitsArray,o?.attributes_json,o?.attributesJson];for(const de of oe){const f=u(de);if(Array.isArray(f))return f;if(f&&typeof f=="object")return Object.entries(f).map(([ce,xe])=>({trait_type:ce,value:xe}))}return[]},re=D(a),se=D(n),g=[...re,...se],I=n.role||a.role,$=n.specialization||n.speciality||a.specialization||a.speciality,ae=g.some(o=>(o.trait_type||"").toLowerCase()==="role"),ie=g.some(o=>["specialization","speciality"].includes((o.trait_type||"").toLowerCase()));!ae&&I&&g.push({trait_type:"Role",value:I}),!ie&&$&&g.push({trait_type:"Specialization",value:$});const ne=n.image&&n.image.trim()!==""?n.image:n.avatar&&n.avatar.trim()!==""?n.avatar:a.image&&a.image.trim()!==""?a.image:a.avatar&&a.avatar.trim()!==""?a.avatar:null,le={...a,...n,name:n.name||a.name||j||"Web3Edu Identity",image:ne,attributes:g};G(le),W(new Date)}).catch(s=>{console.error("Failed to fetch metadata:",s)})},[p,j]),d.useEffect(()=>{if(!r||typeof r.xp!="number")return;let t;return w.current==null||r.xp>w.current&&(B(!0),t=setTimeout(()=>B(!1),1200)),w.current=r.xp,()=>{t&&clearTimeout(t)}},[r]),d.useEffect(()=>{const t=r?.tier;if(t)try{localStorage.setItem("web3edu-tier",t)}catch(s){console.error("Failed to persist tier in localStorage:",s)}},[r?.tier]),d.useEffect(()=>{r?.tier&&(r.tier==="Builder"&&!F&&A(!0),Y.current=r.tier)},[r?.tier,F]);const ee={type:"guide",title:"Start Here — Your Web3 Learning Path",slug:"start-here",why:"This short guide explains how Web3Edu works and helps you choose what to learn next.",estimatedTime:5},k=r&&typeof r.recommendedNext=="object"?r.recommendedNext:null,_=k&&(k.title||k.slug),i=_?k:ee,P=!_,L=!!i?.builderRequired,R=i?.slug?.endsWith("-gr")?i.slug.replace(/-gr$/,""):i?.slug,l=r?.builderChecklist||null,[T,te]=d.useState(r?.tier&&r.tier!=="Explorer"),v=Array.isArray(r?.eventBadges)?r.eventBadges:[],x=v.some(t=>{if(typeof t=="string")return t.toLowerCase().includes("genesis");const s=String(t?.name||t?.label||t?.en||t?.gr||"").toLowerCase(),a=String(t?.id||t?.slug||"").toLowerCase();return s.includes("genesis")||a.includes("genesis")});return e.jsx(pe,{children:e.jsxs("div",{className:`
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
                    `})]})}),e.jsxs("h2",{className:"text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-3",children:["Welcome back, ",h.name||j," 👋",r?.tier&&e.jsx("span",{className:`
                inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                bg-gradient-to-r from-purple-600/80 to-fuchsia-500/80
                dark:from-purple-500/60 dark:to-fuchsia-400/60
                text-white shadow-md border border-white/10
            `,children:r.tier})]}),C&&e.jsxs("p",{className:"text-xs text-slate-500 dark:text-slate-400 mt-1",children:["🕒 Synced ",Math.max(1,Math.floor((Date.now()-C.getTime())/1e3)),"s ago • Web3Edu Identity"]}),e.jsx("p",{className:"mt-2 text-sm text-slate-600 dark:text-slate-300",children:"Mint your Web3Edu Identity to anchor your learning on-chain."}),e.jsx("div",{className:`
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
            `})]}),U&&e.jsx("div",{className:"relative z-10 w-full max-w-4xl mx-auto mb-10 px-4",children:e.jsxs("div",{className:`
                            rounded-3xl border border-purple-400/40
                            bg-gradient-to-br from-purple-600/20 via-indigo-600/20 to-fuchsia-600/20
                            backdrop-blur-xl shadow-2xl p-8 text-center
                            animate-[xpBurst_1.2s_ease-out]
                        `,children:[e.jsx("h2",{className:"text-2xl font-extrabold text-white mb-3",children:"🏗️ Builder Level Unlocked"}),e.jsxs("p",{className:"text-sm text-slate-200 mb-6",children:["You have completed the core requirements and unlocked",e.jsx("span",{className:"font-semibold text-purple-300",children:" Builder "}),"status. You are now eligible to participate in advanced governance tracks."]}),J?e.jsxs("div",{className:`
                                        px-6 py-3 rounded-xl
                                        bg-green-600/90 text-white font-semibold
                                        shadow-lg animate-[xpBurst_1.2s_ease-out]
                                        flex flex-col items-center gap-1
                                    `,children:[e.jsx("span",{children:"✅ Builder Badge Claimed"}),e.jsx("span",{className:"text-[11px] opacity-90",children:"Next milestone: Architect Tier"})]}):e.jsx("button",{onClick:()=>{localStorage.setItem("web3edu-builder-claimed","true"),H(!0),E(!0),setTimeout(()=>{A(!1),E(!1)},1400)},className:`
                                        px-6 py-3 rounded-xl
                                        bg-gradient-to-r from-purple-500 to-indigo-500
                                        text-white font-semibold
                                        hover:scale-105 transition shadow-lg
                                    `,children:"Claim Builder Badge"})]})}),e.jsxs("div",{className:"relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 px-2 md:px-0",children:[e.jsxs("div",{className:"flex flex-col items-center justify-start mt-10 lg:mt-0 relative self-center",children:[e.jsx("div",{className:"absolute -z-10 top-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-purple-500/25 dark:bg-purple-500/20 blur-[200px] rounded-full"}),h&&e.jsx(he,{metadata:h,wallet:p,tokenId:S.tokenId})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-8 md:gap-8",children:[Q&&e.jsx(m,{title:"Founder Badge",className:`
                                    rounded-2xl border border-fuchsia-300/30 dark:border-fuchsia-700/30
                                    bg-gradient-to-br from-white/95 via-fuchsia-50/70 to-slate-100/90
                                    dark:from-[#110819]/90 dark:via-[#1a0f21]/85 dark:to-[#0c0814]/90
                                    backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                                    hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                                `,icon:e.jsx(b,{className:"w-5 h-5 text-white"}),children:e.jsxs("p",{className:"text-sm text-slate-700 dark:text-slate-300 leading-relaxed",children:["You hold a"," ",e.jsx("span",{className:"font-semibold text-fuchsia-600 dark:text-fuchsia-400",children:"Founder SBT"}),". A special recognition for the core creators of Web3Edu."]})}),e.jsx(m,{title:"Your Wallet",className:`
                                rounded-2xl border border-cyan-300/30 dark:border-cyan-700/30
                                bg-gradient-to-br from-white/95 via-cyan-50/70 to-slate-100/90
                                dark:from-[#071d24]/90 dark:via-[#0a2730]/85 dark:to-[#06151a]/90
                                backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                                hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                            `,icon:e.jsx(z,{className:"w-5 h-5 text-white"}),children:e.jsx("p",{className:"text-sm font-mono text-slate-700 dark:text-slate-300 break-all",children:p??"—"})}),e.jsx(m,{title:"Rank",className:`
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
                                    `,children:[e.jsx("span",{className:"inline-flex h-2.5 w-2.5 rounded-full bg-purple-500 dark:bg-purple-400"}),e.jsx("span",{className:"text-[11px] font-semibold tracking-[0.14em] uppercase text-purple-700 dark:text-purple-200",children:"Current Tier"})]}),e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsxs("div",{className:"flex items-baseline gap-2",children:[e.jsx("p",{className:`
                                                text-2xl font-extrabold text-purple-700 dark:text-purple-200
                                                ${r?.tier==="Builder"?"animate-[xpBurst_1.2s_ease-out]":""}
                                            `,children:r?.tier??"Explorer"}),r?.tier&&r.tier!=="Explorer"&&e.jsx("span",{className:"text-[11px] font-medium text-purple-500/90 dark:text-purple-300/90",children:r.tier==="Builder"?"DAO-ready in progress":"DAO governance ready"})]}),r?.tier&&r.tier!=="Architect"&&e.jsx("div",{className:"mt-2 text-xs text-slate-600/90 dark:text-slate-400/90",children:(()=>{const t=r.tier,s=r?.remainingXp??0;let a="Builder";return t==="Builder"&&(a="Architect"),e.jsxs("span",{children:["Next Tier:"," ",e.jsx("span",{className:"font-semibold text-purple-600 dark:text-purple-300",children:a})," ","• ",s," XP remaining"]})})()}),e.jsx("p",{className:"text-xs text-slate-600/90 dark:text-slate-400/90",children:"Earn XP from lessons and quizzes to upgrade your tier."}),e.jsx("p",{className:"mt-2 text-xs text-slate-600/90 dark:text-slate-400/90",children:r?.tier==="Builder"||r?.tier==="Architect"?"DAO governance access unlocked at your current tier.":"Reach Builder tier to unlock DAO governance access."}),e.jsx("div",{className:"mt-2 text-xs font-semibold",children:r?.tier==="Builder"||r?.tier==="Architect"?e.jsx("span",{className:"text-green-600 dark:text-green-400",children:"🟢 Governance Access: Active"}):e.jsx("span",{className:"text-slate-500 dark:text-slate-400",children:"🔒 Governance Access: Locked"})}),r?.tier==="Builder"&&e.jsx("p",{className:"text-[11px] mt-1 text-slate-500 dark:text-slate-400",children:"Architect tier unlocks proposal publishing & advanced governance tools."})]})]})}),e.jsx(m,{title:"Progress",className:`
                            rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                            bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                            dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                            dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                            hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                        `,icon:e.jsx(b,{className:"w-5 h-5 text-white"}),children:e.jsx(fe,{xp:r?.xp??0,xpPercent:r?.xpPercent??0,remainingXp:r?.remainingXp??0,nextTierPercent:r?.nextTierPercent??0,tier:r?.tier??"Explorer",xpLeveledUp:X})}),e.jsxs(m,{title:"Quick Actions",className:`
                            rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                            bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                            dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                            dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                            hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                        `,icon:e.jsx(q,{className:"w-5 h-5 text-white"}),children:[e.jsx("p",{className:"text-sm text-slate-700 dark:text-slate-200 mb-4 leading-relaxed",children:"Here you can find the main actions for your Web3Edu identity and learning journey."}),e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx("button",{onClick:()=>c("/sbt-view"),className:"py-3 px-6 rounded-xl bg-gradient-to-r from-[#7F3DF1] to-[#5F2BD8] text-white hover:scale-[1.03] hover:opacity-90 transition font-semibold shadow-md",children:"View My SBT"}),e.jsx("button",{onClick:()=>c("/labs"),className:"py-3 px-6 rounded-xl bg-gradient-to-r from-[#33D6FF] to-[#24A9D0] text-white hover:scale-[1.03] hover:opacity-90 transition font-semibold shadow-md",children:"Continue Learning"}),e.jsx("div",{className:"mt-3",children:e.jsx("button",{onClick:()=>c("/start-here"),className:`
  w-full py-3 px-6 rounded-xl
  bg-gradient-to-r from-indigo-500/80 to-purple-500/80
  text-white
  hover:scale-[1.03] hover:opacity-90
  transition
  font-semibold shadow-md
`,children:"Start Here (guide)"})})]})]}),e.jsxs(m,{title:"Badges",className:`
                        rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                        bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                        dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                        dark:border-white/10 backdrop-blur-xl shadow-xl text-slate-900 dark:text-slate-100
                        hover:scale-[1.005] hover:shadow-2xl transition-all duration-500
                    `,icon:e.jsx(b,{className:"w-5 h-5 text-white"}),children:[e.jsx("p",{className:"text-sm text-slate-700 dark:text-slate-200 mb-4 leading-relaxed",children:"All your achievements and earned badges will appear here as you progress."}),r?.badges?.length>0||v.length>0?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"flex flex-wrap gap-2",children:[r?.badges?.map((t,s)=>{let a=b;const n=typeof t=="string"?t.toLowerCase():t?.label?.toLowerCase?.()||t?.en?.toLowerCase?.()||t?.gr?.toLowerCase?.()||"";return n.includes("wallet")&&(a=z),n.includes("lesson")&&(a=we),n.includes("quiz")&&(a=ke),e.jsxs("span",{className:`
                            inline-flex items-center gap-2 
                            px-3 py-1 rounded-full 
                            text-xs font-semibold
                            bg-indigo-200/60 dark:bg-indigo-900/40
                            border border-indigo-300/30 dark:border-indigo-700/30
                            text-slate-900 dark:text-slate-100
                        `,children:[e.jsx(a,{className:"w-4 h-4 text-white/90"}),typeof t=="string"?t:t?.en||t?.gr||t?.label||JSON.stringify(t)]},`badge-${s}-${typeof t=="string"?t:t?.id||"badge"}`)}),v.map((t,s)=>{const a=typeof t=="string"?t:t?.name||"Event Badge",u=String(a).toLowerCase().includes("genesis");return e.jsxs("span",{className:`
                                                        inline-flex items-center gap-2
                                                        px-3 py-1 rounded-full
                                                        text-xs font-semibold
                                                        ${u?"bg-gradient-to-r from-purple-500/80 to-fuchsia-500/80 text-white border border-purple-300/40 shadow-[0_0_10px_rgba(168,85,247,0.6)] animate-[genesisPulse_0.9s_ease-out]":"bg-purple-200/70 dark:bg-purple-900/40 border border-purple-300/40 dark:border-purple-700/40 text-slate-900 dark:text-slate-100"}
                                                    `,children:[e.jsx(b,{className:`w-4 h-4 ${u?"text-yellow-300":"text-white/90"}`}),a]},`event-badge-${s}`)})]}),e.jsx("div",{className:"w-full mt-4",children:e.jsx("button",{disabled:x,onClick:()=>{x||c("/events/genesis")},className:`
                                                w-full py-2 px-4 rounded-lg
                                                text-xs font-semibold transition shadow-md
                                                ${x?"bg-green-500 text-white cursor-default":"bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:scale-[1.02]"}
                                            `,children:x?"Genesis Badge Minted ✓":"Mint Genesis Event Badge"})})]}):e.jsxs(e.Fragment,{children:[e.jsx("p",{className:"text-slate-600 dark:text-slate-300",children:"No badges yet…"}),e.jsx("div",{className:"w-full mt-4",children:e.jsx("button",{disabled:x,onClick:()=>{x||c("/events/genesis")},className:`
                                                w-full py-2 px-4 rounded-lg
                                                text-xs font-semibold transition shadow-md
                                                ${x?"bg-green-500 text-white cursor-default":"bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:scale-[1.02]"}
                                            `,children:x?"Genesis Badge Minted ✓":"Mint Genesis Event Badge"})})]})]})]})]}),i&&e.jsx("div",{className:"relative z-10 w-full max-w-6xl mx-auto mt-6 mb-8 px-2 md:px-0",children:e.jsxs(m,{title:"Recommended Next Module",className:`
                rounded-2xl border border-indigo-300/30 dark:border-indigo-700/30
                bg-gradient-to-br from-white/95 via-indigo-50/75 to-slate-100/90
                dark:from-[#0E1426]/90 dark:via-[#0B1020]/85 dark:to-[#070C18]/90
                dark:border-white/10 backdrop-blur-xl shadow-xl
                hover:scale-[1.002] hover:shadow-2xl transition-all duration-500
            `,icon:e.jsx(q,{className:"w-5 h-5 text-white"}),children:[l&&e.jsxs("div",{className:`mb-4 rounded-xl border border-purple-300/30 dark:border-purple-700/40 
                                                bg-purple-50/70 dark:bg-purple-900/20 p-4`,children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx("span",{className:"text-xs font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-300",children:"🏗 Builder Path"}),r?.tier==="Explorer"&&e.jsx("button",{onClick:t=>{t.stopPropagation(),te(s=>!s)},className:"text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline",children:T?"Hide details":"View requirements"}),r?.tier!=="Explorer"&&(l.coreLabs?.done&&l.daoLabs?.done&&l.proofOfEscape?.done&&l.xpRequirement?.done?e.jsx("span",{className:"text-green-600 dark:text-green-400 text-xs font-semibold",children:"✔ Builder Unlocked"}):e.jsx("span",{className:"text-xs text-slate-500 dark:text-slate-400",children:"In Progress"}))]}),T&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs",children:[e.jsxs("div",{children:[l.coreLabs?.done?"✔":"⏳"," Core Labs (",l.coreLabs?.completed,"/",l.coreLabs?.required,")"]}),e.jsxs("div",{children:[l.daoLabs?.done?"✔":"⏳"," DAO Labs (",l.daoLabs?.completed,"/",l.daoLabs?.required,")"]}),e.jsxs("div",{children:[l.proofOfEscape?.done?"✔":"⏳"," Proof of Escape"]}),e.jsxs("div",{children:[l.xpRequirement?.done?"✔":"⏳"," XP (",l.xpRequirement?.current,"/",l.xpRequirement?.required,")"]})]}),(()=>{const s=(l.coreLabs?.done?1:0)+(l.daoLabs?.done?1:0)+(l.proofOfEscape?.done?1:0),a=Math.round(s/3*100);return e.jsxs("div",{className:"mt-4",children:[e.jsxs("div",{className:"flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1",children:[e.jsx("span",{children:"Builder Progress"}),e.jsxs("span",{children:[s,"/",3," requirements"]})]}),e.jsx("div",{className:"w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden",children:e.jsx("div",{className:"h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500",style:{width:`${a}%`}})})]})})()]})]}),e.jsxs("div",{className:"space-y-3 cursor-pointer",onClick:()=>{if(i.type==="guide"&&i.slug){c(`/${i.slug}`);return}if(i.type==="lab"&&R){c(`/labs/${R}`);return}if(i.type==="lesson"&&i.slug){c(`/lessons/${i.slug}`);return}c("/education")},children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("p",{className:"text-xs uppercase tracking-wide text-indigo-600 dark:text-indigo-400 font-semibold",children:P?"Start Here":"Recommended for you"}),L&&e.jsx("span",{className:`
                                            inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold
                                            bg-purple-100/80 dark:bg-purple-900/40
                                            border border-purple-300/40 dark:border-purple-600/60
                                            text-purple-700 dark:text-purple-300
                                        `,children:"🏗 Builder Path"}),L&&e.jsx("span",{className:`
                                            text-[10px] font-medium text-slate-500 dark:text-slate-400
                                        `,children:"Final Builder Requirement"})]}),e.jsx("p",{className:"text-xl font-bold text-slate-900 dark:text-white leading-snug",children:typeof i.title=="object"?i.title.en||i.title.gr:i.title}),i.why&&e.jsxs("div",{className:"mt-1",children:[e.jsx("p",{className:"text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-500 mb-1",children:P?"Suggested next step":"Why this is recommended"}),e.jsx("p",{className:"text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl",children:typeof i.why=="object"?i.why.en||i.why.gr:i.why})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-6 pt-1 text-sm text-slate-600 dark:text-slate-400",children:[i.estimatedTime&&e.jsxs("span",{children:["⏱ ",i.estimatedTime," min"]}),i.xp&&e.jsxs("span",{children:["🏅 +",i.xp," XP"]})]}),e.jsx("div",{className:"pt-2",children:e.jsx("span",{className:"inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400",children:"Continue →"})})]})]})}),e.jsx("div",{className:"relative z-10 w-full max-w-6xl mx-auto mt-12 px-2 md:px-0",children:e.jsx(be,{timeline:r?.timeline||[]})}),e.jsx("div",{className:`pointer-events-none fixed top-0 right-0 w-[300px] h-full
                                bg-gradient-to-b from-[#8A57FF]/35 via-[#4ACBFF]/25 to-[#FF67D2]/35
                                blur-[160px] opacity-60`}),O&&e.jsx("div",{className:"fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50",children:e.jsxs("div",{className:"bg-[#0f0f17] p-6 rounded-2xl w-80 border border-white/10 shadow-xl",children:[e.jsx("h2",{className:"text-xl font-bold mb-3 flex items-center gap-2",children:"Tier Benefits"}),e.jsxs("ul",{className:"text-white/80 text-sm space-y-2",children:[e.jsx("li",{children:"🟣 Explorer — Basic access, community role, progress tracking"}),e.jsx("li",{children:"🔵 Builder — Unlock advanced lessons, early DAO proposals"}),e.jsx("li",{children:"🟡 Architect — Full DAO access, beta features, priority badges"})]}),e.jsx("p",{className:"text-white/70 text-sm mt-4",children:"How to upgrade your tier:"}),e.jsxs("ul",{className:"text-white/80 text-sm space-y-1 mt-1",children:[e.jsx("li",{children:"• Complete lessons and quizzes to earn XP."}),e.jsx("li",{children:"• Return regularly and finish learning paths."}),e.jsx("li",{children:"• Participate in community / DAO activities (future)."})]}),e.jsx("button",{onClick:()=>y(!1),className:"mt-5 w-full py-2 rounded-xl bg-white/10 hover:bg-white/40 transition text-white font-semibold text-sm tracking-wide",children:"Close"})]})})]})})}export{Ae as default};
