var v=Object.defineProperty;var w=(t,a,r)=>a in t?v(t,a,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[a]=r;var f=(t,a,r)=>(w(t,typeof a!="symbol"?a+"":a,r),r);import{j as e,i as S,s as N,a as A,H as B,M as L,G as C,W as M,A as O,F as E,L as _}from"./pages-d4bf7c9a.js";import{a as z,r as g,c as y,L as u,O as P,u as R,B as I,d as W,e as d,b as F}from"./react-vendor-7e64a64e.js";import"./components-ea165bfd.js";import"./utils-f5112557.js";import"./chart-vendor-2e7fb795.js";import"./ui-vendor-2ef6b736.js";(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const l of n.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function r(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(s){if(s.ep)return;s.ep=!0;const n=r(s);fetch(s.href,n)}})();var m={},x=z;m.createRoot=x.createRoot,m.hydrateRoot=x.hydrateRoot;const b="jc_ui_motion_v1";class ${constructor(){f(this,"settings");this.settings=this.loadFromStorage(),this.updateReducedMotion(),typeof window<"u"&&window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change",()=>this.updateReducedMotion())}loadFromStorage(){try{if(typeof localStorage>"u")return this.getDefaultSettings();const a=localStorage.getItem(b);if(a){const r=JSON.parse(a);return{background:r.background||"auto",reducedMotion:!1,staticBackground:r.staticBackground||!1}}}catch(a){console.warn("Failed to load motion settings from storage:",a)}return this.getDefaultSettings()}getDefaultSettings(){return{background:"auto",reducedMotion:!1,staticBackground:!1}}updateReducedMotion(){typeof window<"u"&&window.matchMedia&&(this.settings.reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches)}saveToStorage(){try{if(typeof localStorage>"u")return;const a={background:this.settings.background,staticBackground:this.settings.staticBackground};localStorage.setItem(b,JSON.stringify(a))}catch(a){console.warn("Failed to save motion settings to storage:",a)}}getSettings(){return{...this.settings}}setBackgroundPreference(a){this.settings.background=a,this.saveToStorage()}setStaticBackground(a){this.settings.staticBackground=a,this.saveToStorage()}shouldAnimate(){return!(this.settings.staticBackground||this.settings.background==="auto"&&this.settings.reducedMotion||this.settings.background==="off")}shouldAnimateBackground(){return this.shouldAnimate()}}const o=new $;function q({className:t=""}){const[a,r]=g.useState(o.getSettings()),[i,s]=g.useState(!1);g.useEffect(()=>{const c=setInterval(()=>{r(o.getSettings())},100);return()=>clearInterval(c)},[]);const n=c=>{o.setBackgroundPreference(c),r(o.getSettings())},l=()=>{o.setStaticBackground(!a.staticBackground),r(o.getSettings())};return e.jsxs("div",{className:`relative ${t}`,children:[e.jsx("button",{onClick:()=>s(!i),className:"p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors","aria-label":"Motion settings",children:e.jsxs("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:[e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"})]})}),i&&e.jsxs("div",{className:"absolute right-0 top-full mt-2 w-64 p-4 bg-jc-surface border border-white/10 rounded-xl shadow-lg z-50",children:[e.jsx("h3",{className:"text-h3 text-primary mb-3",children:"Motion Settings"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-small text-secondary mb-2",children:"Background Animation"}),e.jsx("div",{className:"space-y-2",children:[{value:"auto",label:"Auto (respect system)"},{value:"on",label:"Always on"},{value:"off",label:"Always off"}].map(c=>e.jsxs("label",{className:"flex items-center space-x-2",children:[e.jsx("input",{type:"radio",name:"background",value:c.value,checked:a.background===c.value,onChange:()=>n(c.value),className:"text-jc-cyan focus:ring-jc-cyan"}),e.jsx("span",{className:"text-small text-primary",children:c.label})]},c.value))})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"flex items-center space-x-2",children:[e.jsx("input",{type:"checkbox",checked:a.staticBackground,onChange:l,className:"text-jc-cyan focus:ring-jc-cyan"}),e.jsx("span",{className:"text-small text-primary",children:"Static background"})]}),e.jsx("p",{className:"text-meta text-muted mt-1",children:"Override all animations with a static background"})]}),e.jsx("div",{className:"pt-2 border-t border-white/10",children:e.jsxs("p",{className:"text-meta text-muted",children:["System reduced motion: ",a.reducedMotion?"Enabled":"Disabled"]})})]})]})]})}function T(){const t=S(),{pathname:a}=y();return e.jsx("header",{className:"sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/30 border-b border-white/5",children:e.jsxs("div",{className:"max-w-6xl mx-auto px-4 h-14 flex items-center gap-3",children:[e.jsx(u,{to:"/",className:"font-bold text-lg",children:"JohnnyCloud"}),e.jsxs("nav",{className:"ml-4 hidden md:flex items-center gap-3 text-sm",children:[e.jsx(u,{to:"/",className:"jc-chip",children:"Home"}),e.jsx(u,{to:"/metrics",className:"jc-chip",children:"Metrics"}),e.jsx(u,{to:"/guardrails",className:"jc-chip",children:"Guardrails"}),e.jsx(u,{to:"/why-aws",className:"jc-chip",children:"Why AWS"}),e.jsx(u,{to:"/about",className:"jc-chip",children:"About"}),e.jsx(u,{to:"/faq",className:"jc-chip",children:"FAQ"})]}),e.jsxs("div",{className:"ml-auto flex items-center gap-2",children:[e.jsx(q,{}),t?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"px-2 py-1 rounded-xl bg-white/10 text-xs",children:"Signed in"}),e.jsx("button",{onClick:N,className:"jc-btn-outline",children:"Sign out"})]}):!t&&a!=="/login"&&e.jsx("button",{onClick:A,className:"jc-chip",children:"Login"})]})]})})}function G({className:t=""}){const a=o.shouldAnimateBackground();return e.jsx("div",{className:`fixed inset-0 pointer-events-none z-[-3] ${t}`,style:{background:`
          radial-gradient(circle at 25% 25%, rgba(0,230,255,0.08) 1px, transparent 1px),
          radial-gradient(circle at 75% 75%, rgba(236,93,254,0.06) 1px, transparent 1px),
          linear-gradient(180deg, #0B1220 0%, #0B1320 50%, #0B1020 100%)
        `,backgroundSize:"40px 40px, 60px 60px, 100% 100%",backgroundPosition:"0 0, 20px 20px, 0 0",animation:a?"parallax-drift 30s linear infinite":"none"}})}if(typeof document<"u"){const t=document.createElement("style");t.textContent=`
    @keyframes parallax-drift {
      0% { 
        background-position: 0 0, 20px 20px, 0 0; 
      }
      100% { 
        background-position: 40px 40px, 0 0, 0 0; 
      }
    }
  `,document.head.appendChild(t)}function D({className:t="",isVoiceActive:a=!1}){const r=o.shouldAnimateBackground();return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:`fixed inset-0 pointer-events-none z-[-2] ${t}`,style:{background:`
            linear-gradient(45deg, transparent 30%, rgba(0,230,255,0.08) 50%, transparent 70%),
            linear-gradient(-45deg, transparent 20%, rgba(236,93,254,0.06) 40%, transparent 60%)
          `,backgroundSize:"200% 200%, 300% 300%",backgroundPosition:"0% 0%, 100% 100%",animation:r?"aurora-drift 25s ease-in-out infinite":"none"}}),a&&e.jsx("div",{className:"fixed inset-0 pointer-events-none z-[-1]",style:{background:`
              radial-gradient(circle at 50% 40%, rgba(0,230,255,0.12) 0%, transparent 50%),
              radial-gradient(circle at 50% 40%, rgba(236,93,254,0.08) 0%, transparent 40%)
            `,animation:r?"voice-halo 3s ease-in-out infinite":"none"}})]})}if(typeof document<"u"){const t=document.createElement("style");t.textContent=`
    @keyframes aurora-drift {
      0%, 100% { 
        background-position: 0% 0%, 100% 100%; 
      }
      50% { 
        background-position: 100% 100%, 0% 0%; 
      }
    }
    
    @keyframes voice-halo {
      0%, 100% { 
        opacity: 0.6; 
        transform: scale(1);
      }
      50% { 
        opacity: 1; 
        transform: scale(1.05);
      }
    }
  `,document.head.appendChild(t)}function H({className:t=""}){const a=o.shouldAnimateBackground();return e.jsx("div",{className:`fixed inset-0 pointer-events-none z-[-2] ${t}`,style:{background:`
          radial-gradient(ellipse 100% 50% at 20% 50%, rgba(124,255,178,0.08) 0%, transparent 50%),
          radial-gradient(ellipse 80% 40% at 80% 30%, rgba(0,230,255,0.06) 0%, transparent 50%),
          radial-gradient(ellipse 120% 60% at 50% 80%, rgba(236,93,254,0.05) 0%, transparent 50%)
        `,backgroundSize:"200% 200%, 150% 150%, 180% 180%",backgroundPosition:"0% 0%, 100% 100%, 50% 50%",animation:a?"cost-waves 35s ease-in-out infinite":"none"}})}if(typeof document<"u"){const t=document.createElement("style");t.textContent=`
    @keyframes cost-waves {
      0%, 100% { 
        background-position: 0% 0%, 100% 100%, 50% 50%; 
      }
      33% { 
        background-position: 100% 50%, 0% 50%, 25% 75%; 
      }
      66% { 
        background-position: 50% 100%, 50% 0%, 75% 25%; 
      }
    }
  `,document.head.appendChild(t)}function Q({className:t="",showShieldRipple:a=!1}){const r=o.shouldAnimateBackground();return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:`fixed inset-0 pointer-events-none z-[-2] ${t}`,style:{background:`
            radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,230,255,0.06) 45%, transparent 50%),
            radial-gradient(circle at 50% 50%, transparent 30%, rgba(0,230,255,0.04) 35%, transparent 40%),
            radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,230,255,0.03) 25%, transparent 30%)
          `,backgroundSize:"100% 100%, 100% 100%, 100% 100%",backgroundPosition:"0 0, 0 0, 0 0",animation:r?"radar-sweep 28s linear infinite":"none"}}),a&&e.jsx("div",{className:"fixed inset-0 pointer-events-none z-[-1]",style:{background:`
              radial-gradient(circle at 50% 50%, rgba(59,130,246,0.15) 0%, transparent 70%)
            `,animation:r?"shield-ripple 2s ease-out forwards":"none"}})]})}if(typeof document<"u"){const t=document.createElement("style");t.textContent=`
    @keyframes radar-sweep {
      0% { 
        background: 
          radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,230,255,0.06) 45%, transparent 50%),
          radial-gradient(circle at 50% 50%, transparent 30%, rgba(0,230,255,0.04) 35%, transparent 40%),
          radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,230,255,0.03) 25%, transparent 30%);
      }
      100% { 
        background: 
          radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,230,255,0.06) 45%, transparent 50%),
          radial-gradient(circle at 50% 50%, transparent 30%, rgba(0,230,255,0.04) 35%, transparent 40%),
          radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,230,255,0.03) 25%, transparent 30%);
      }
    }
    
    @keyframes shield-ripple {
      0% { 
        opacity: 0; 
        transform: scale(0.8);
      }
      50% { 
        opacity: 1; 
        transform: scale(1.2);
      }
      100% { 
        opacity: 0; 
        transform: scale(1.5);
      }
    }
  `,document.head.appendChild(t)}function J({className:t=""}){const a=o.shouldAnimateBackground();return e.jsx("div",{className:`fixed inset-0 pointer-events-none z-[-2] ${t}`,style:{background:`
          linear-gradient(90deg, transparent 0%, rgba(0,230,255,0.06) 20%, transparent 40%),
          linear-gradient(0deg, transparent 0%, rgba(236,93,254,0.05) 30%, transparent 60%),
          linear-gradient(45deg, transparent 0%, rgba(124,255,178,0.04) 25%, transparent 50%)
        `,backgroundSize:"200% 200%, 150% 150%, 180% 180%",backgroundPosition:"0% 0%, 100% 100%, 50% 50%",animation:a?"isobar-morph 32s ease-in-out infinite":"none"}})}if(typeof document<"u"){const t=document.createElement("style");t.textContent=`
    @keyframes isobar-morph {
      0%, 100% { 
        background-position: 0% 0%, 100% 100%, 50% 50%; 
        opacity: 0.8;
      }
      25% { 
        background-position: 25% 25%, 75% 75%, 25% 75%; 
        opacity: 1;
      }
      50% { 
        background-position: 50% 50%, 50% 50%, 50% 50%; 
        opacity: 0.9;
      }
      75% { 
        background-position: 75% 75%, 25% 25%, 75% 25%; 
        opacity: 1;
      }
    }
  `,document.head.appendChild(t)}function K({className:t=""}){const a=o.shouldAnimateBackground();return e.jsx("div",{className:`fixed inset-0 pointer-events-none z-[-2] ${t}`,style:{background:`
          linear-gradient(90deg, transparent 0%, rgba(0,230,255,0.04) 1px, transparent 2px),
          linear-gradient(0deg, transparent 0%, rgba(236,93,254,0.03) 1px, transparent 2px)
        `,backgroundSize:"20px 20px, 30px 30px",backgroundPosition:"0 0, 10px 10px",animation:a?"digital-rain 40s linear infinite":"none"}})}if(typeof document<"u"){const t=document.createElement("style");t.textContent=`
    @keyframes digital-rain {
      0% { 
        background-position: 0 0, 10px 10px; 
      }
      100% { 
        background-position: 20px 20px, 30px 30px; 
      }
    }
  `,document.head.appendChild(t)}function U({isVoiceActive:t=!1,showShieldRipple:a=!1}){const r=y(),[i,s]=g.useState("");return g.useEffect(()=>{const n=r.pathname;n==="/"||n.startsWith("/home")?s("home"):n.startsWith("/metrics")?s("metrics"):n.startsWith("/guardrails")?s("guardrails"):n.startsWith("/why-aws")?s("whyaws"):n.startsWith("/faq")||n.startsWith("/about")?s("faq-about"):s("default")},[r.pathname]),g.useEffect(()=>{const n=()=>{document.hidden?document.body.classList.add("animations-paused"):document.body.classList.remove("animations-paused")};return document.addEventListener("visibilitychange",n),()=>document.removeEventListener("visibilitychange",n)},[]),e.jsxs(e.Fragment,{children:[e.jsx(G,{}),i==="home"&&e.jsx(D,{isVoiceActive:t}),i==="metrics"&&e.jsx(H,{}),i==="guardrails"&&e.jsx(Q,{showShieldRipple:a}),i==="whyaws"&&e.jsx(J,{}),i==="faq-about"&&e.jsx(K,{})]})}function V(){return e.jsxs("div",{className:"min-h-dvh relative",children:[e.jsx(U,{}),e.jsx(T,{}),e.jsx("main",{className:"relative mx-auto max-w-6xl px-4 py-8 md:py-10 lg:py-12",children:e.jsx(P,{})})]})}function Y(){const t=R();return g.useEffect(()=>{(async()=>{const a=new URLSearchParams(window.location.search),r=a.get("code"),i=a.get("state")||"/",s=sessionStorage.getItem("pkce_verifier")||"";if(!r||!s){t("/login",{replace:!0});return}const n="us-east-1csm5oddde.auth.us-east-1.amazoncognito.com",l="4oc76981p9te4uegc85r0mnjg7",c="https://d1zhi8uis2cnfs.cloudfront.net/auth/callback",k=n.startsWith("http")?`${n}/oauth2/token`:`https://${n}/oauth2/token`,j=new URLSearchParams({grant_type:"authorization_code",client_id:l,code:r,code_verifier:s,redirect_uri:c});try{const h=await fetch(k,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:j.toString()});if(!h.ok){t("/login",{replace:!0});return}const p=await h.json();p.id_token&&localStorage.setItem("id_token",p.id_token),p.access_token&&localStorage.setItem("access_token",p.access_token),p.refresh_token&&localStorage.setItem("refresh_token",p.refresh_token),sessionStorage.removeItem("pkce_verifier"),t(i,{replace:!0})}catch{t("/login",{replace:!0})}})()},[t]),e.jsx("div",{className:"min-h-screen flex items-center justify-center bg-jc-bg",children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"}),e.jsx("p",{className:"text-slate-300",children:"Completing sign in..."})]})})}function X(){return e.jsx(I,{future:{v7_startTransition:!0,v7_relativeSplatPath:!0},children:e.jsxs(W,{children:[e.jsxs(d,{element:e.jsx(V,{}),children:[e.jsx(d,{path:"/",element:e.jsx(B,{})}),e.jsx(d,{path:"/metrics",element:e.jsx(L,{})}),e.jsx(d,{path:"/guardrails",element:e.jsx(C,{})}),e.jsx(d,{path:"/why-aws",element:e.jsx(M,{})}),e.jsx(d,{path:"/about",element:e.jsx(O,{})}),e.jsx(d,{path:"/faq",element:e.jsx(E,{})})]}),e.jsx(d,{path:"/login",element:e.jsx(_,{})}),e.jsx(d,{path:"/auth/callback",element:e.jsx(Y,{})})]})})}m.createRoot(document.getElementById("root")).render(e.jsx(F.StrictMode,{children:e.jsx(X,{})}));
