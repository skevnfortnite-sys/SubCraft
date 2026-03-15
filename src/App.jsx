import React, { useState, useEffect, useRef, useCallback, useMemo, useReducer, useContext, createContext } from 'react';

/* NOTE: Cursor, AuroraBg, ParticleField, Phone3D defined below near line 800+ */

const GS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
    body{background:#030305;color:#ffffff;font-family:'DM Sans',system-ui,sans-serif;min-height:100vh;overflow-x:hidden;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
    ::-webkit-scrollbar{width:4px}
    ::-webkit-scrollbar-track{background:#02030a}
    ::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#5b6cff,#a855f7);border-radius:10px}
    ::selection{background:#5b6cff33;color:#fff}
    input,textarea,select{font-family:'Space Grotesk','DM Sans',sans-serif;outline:none;background:transparent}
    button{font-family:'Space Grotesk','DM Sans',sans-serif;cursor:pointer}
    a{color:inherit;text-decoration:none}
    .syne{font-family:'Syne',sans-serif!important}
    .mono{font-family:'JetBrains Mono',monospace!important}
    body::after{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");pointer-events:none;z-index:9999;opacity:.006}
    @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
    @keyframes wordPop{from{opacity:0;transform:scale(.7) translateY(6px)}to{opacity:1;transform:scale(1) translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes fadeOut{0%{opacity:1}80%{opacity:.3}100%{opacity:0}}
    @keyframes fadeDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideRight{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
    @keyframes slideLeft{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
    @keyframes pulseDot{0%,100%{transform:scale(1)}50%{transform:scale(1.5)}}
    @keyframes pulseDotGreen{0%,100%{box-shadow:0 0 0 0 rgba(52,211,153,.5)}70%{box-shadow:0 0 0 8px rgba(52,211,153,0)}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
    @keyframes float2{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-14px) rotate(2deg)}}
    @keyframes glow{0%,100%{box-shadow:0 0 30px #5b6cff33,0 0 60px #5b6cff11}50%{box-shadow:0 0 60px #5b6cff66,0 0 120px #5b6cff22}}
    @keyframes glowPink{0%,100%{box-shadow:0 0 30px #e8397022}50%{box-shadow:0 0 60px #e8397055}}
    @keyframes shimmer{0%{background-position:-400% center}100%{background-position:400% center}}
    @keyframes shimmerSlide{0%{transform:translateX(-100%) skewX(-15deg)}100%{transform:translateX(300%) skewX(-15deg)}}
    @keyframes popIn{0%{opacity:0;transform:scale(.8) translateY(20px)}80%{transform:scale(1.02)}100%{opacity:1;transform:scale(1) translateY(0)}}
    @keyframes popInBig{0%{opacity:0;transform:scale(.7) translateY(40px)}80%{transform:scale(1.02)}100%{opacity:1;transform:scale(1) translateY(0)}}
    @keyframes subtitlePop{0%{opacity:0;transform:translateY(14px) scale(.88)}25%{opacity:1;transform:translateY(0) scale(1.06)}40%{transform:scale(1)}100%{opacity:1;transform:scale(1)}}
    @keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
    @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}}
    @keyframes pageIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
    @keyframes notifIn{from{opacity:0;transform:translateX(120px)}to{opacity:1;transform:translateX(0)}}
    @keyframes notifOut{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(120px)}}
    @keyframes skeletonPulse{0%,100%{opacity:.3}50%{opacity:.7}}
    @keyframes progressFill{from{width:0%}to{width:100%}}
    @keyframes typing{0%,100%{opacity:1}50%{opacity:0}}
    @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    @keyframes orbit{from{transform:rotate(0deg) translateX(110px) rotate(0deg)}to{transform:rotate(360deg) translateX(110px) rotate(-360deg)}}
    @keyframes orbit2{from{transform:rotate(130deg) translateX(155px) rotate(-130deg)}to{transform:rotate(490deg) translateX(155px) rotate(-490deg)}}
    @keyframes orbit3{from{transform:rotate(250deg) translateX(80px) rotate(-250deg)}to{transform:rotate(610deg) translateX(80px) rotate(-610deg)}}
    @keyframes aurora{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(5%,4%) scale(1.08)}66%{transform:translate(-3%,2%) scale(.95)}}
    @keyframes aurora2{0%,100%{transform:translate(0,0) scale(1.1)}50%{transform:translate(-7%,-3%) scale(.92)}}
    @keyframes scanline{0%{top:-4%}100%{top:104%}}
    @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
    @keyframes cardTilt{0%,100%{transform:perspective(1200px) rotateX(0) rotateY(0) translateY(0)}50%{transform:perspective(1200px) rotateX(2deg) rotateY(5deg) translateY(-4px)}}
    @keyframes starSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes tilt3d{
      0%,100%{transform:perspective(600px) rotateX(0deg) rotateY(-2deg)}
      50%{transform:perspective(600px) rotateX(2deg) rotateY(2deg)}
    }
    @keyframes float3d{
      0%,100%{transform:perspective(800px) translateY(0) rotateX(0deg)}
      33%{transform:perspective(800px) translateY(-8px) rotateX(2deg) rotateY(1deg)}
      66%{transform:perspective(800px) translateY(-4px) rotateX(-1deg) rotateY(-2deg)}
    }
    @keyframes glowPulse{
      0%,100%{box-shadow:0 0 40px rgba(91,108,255,.2),0 0 80px rgba(168,85,247,.1)}
      50%{box-shadow:0 0 80px rgba(91,108,255,.45),0 0 120px rgba(168,85,247,.25),0 0 160px rgba(232,57,112,.1)}
    }
    @keyframes ping{0%{transform:scale(1);opacity:1}100%{transform:scale(2.2);opacity:0}}
    @keyframes gradShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
    @keyframes waveform{0%,100%{height:4px}50%{height:20px}}
    @keyframes particleDrift{0%{transform:translate(0,0) scale(1);opacity:.6}33%{transform:translate(30px,-40px) scale(.8);opacity:.3}66%{transform:translate(-20px,-70px) scale(1.1);opacity:.5}100%{transform:translate(10px,-110px) scale(.6);opacity:0}}
    @keyframes morphBlob{0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%}25%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%}50%{border-radius:50% 30% 60% 40%/40% 70% 60% 30%}75%{border-radius:40% 60% 30% 70%/70% 40% 60% 30%}}

    ::selection{background:rgba(91,108,255,.35);color:#fff}
    ::-webkit-scrollbar{width:5px;height:5px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:rgba(91,108,255,.3);border-radius:3px}
    ::-webkit-scrollbar-thumb:hover{background:rgba(91,108,255,.5)}
    input,textarea,select{font-family:'DM Sans',system-ui,sans-serif}
    .page{animation:pageIn .5s cubic-bezier(.22,1,.36,1) both}
    .fu{animation:fadeUp .55s cubic-bezier(.22,1,.36,1) both}
    .pi{animation:popIn .4s cubic-bezier(.34,1.56,.64,1) both}
    .skel{animation:skeletonPulse 1.5s ease infinite;background:linear-gradient(90deg,#0a0b18,#0f1022,#0a0b18);border-radius:6px}
    .glass{background:rgba(255,255,255,.03);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,.07)}
    .glass-med{background:rgba(255,255,255,.05);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.1)}
    .glass-bright{background:rgba(255,255,255,.08);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.14)}
    .grad-text{background:linear-gradient(135deg,#a5b4fc 0%,#c084fc 45%,#f472b6 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .grad-text-gold{background:linear-gradient(135deg,#ffd700,#ffa500);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .grad-text-chrome{background:linear-gradient(135deg,#e8e8e8,#ffffff,#c0c0c0,#ffffff,#a0a0a0);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 4s linear infinite}
    .grad-text-aurora{background:linear-gradient(90deg,#6ee7f7,#a78bfa,#f472b6,#fb923c,#a78bfa,#6ee7f7);background-size:400% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:gradShift 6s linear infinite}
    .text-3d{text-shadow:0 1px 0 rgba(255,255,255,.1),0 2px 4px rgba(0,0,0,.5),0 4px 12px rgba(91,108,255,.2)}
    .card-3d{transition:all .3s cubic-bezier(.22,1,.36,1)}
    .card-3d:hover{transform:perspective(800px) translateY(-8px) rotateX(2deg);box-shadow:0 28px 70px rgba(0,0,0,.5)}
    .border-acc{box-shadow:0 0 0 1px rgba(91,108,255,.45),0 0 30px rgba(91,108,255,.12),inset 0 0 20px rgba(91,108,255,.03)}
    .border-pink{box-shadow:0 0 0 1px rgba(232,57,112,.4),0 0 24px rgba(232,57,112,.1)}
    .border-green{box-shadow:0 0 0 1px rgba(52,211,153,.35),0 0 20px rgba(52,211,153,.08)}
    .lift{transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s;will-change:transform}
    .lift:hover{transform:translateY(-5px);box-shadow:0 20px 50px rgba(0,0,0,.4),0 0 40px rgba(91,108,255,.1)}
    .lift-sm:hover{transform:translateY(-3px)}
    .shimmer-btn{position:relative;overflow:hidden}
    .shimmer-btn::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent 20%,rgba(255,255,255,.15) 50%,transparent 80%);transform:translateX(-100%) skewX(-15deg);animation:shimmerSlide 2.8s ease-in-out infinite}
    .grid-bg{background-image:linear-gradient(rgba(91,108,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(91,108,255,.05) 1px,transparent 1px);background-size:64px 64px}
    .dot-bg{background-image:radial-gradient(circle,rgba(91,108,255,.18) 1px,transparent 1px);background-size:26px 26px}
    @media(max-width:768px){
      .hide-mobile{display:none!important}
      .mobile-full{width:100%!important;max-width:100%!important}
      .mobile-col{flex-direction:column!important}
      .mobile-p{padding:16px!important}
      .mobile-grid1{grid-template-columns:1fr!important}
      .mobile-grid2{grid-template-columns:1fr 1fr!important}
      .mobile-p2{padding:12px!important}
      .mobile-text-sm{font-size:13px!important}
      nav{padding:0 16px!important;height:52px!important}
      .mobile-stack{flex-direction:column!important;align-items:stretch!important}
      .mobile-full-btn{width:100%!important;justify-content:center!important}
      .mobile-hide{display:none!important}
      h1.hero-title{font-size:clamp(28px,8vw,52px)!important;letter-spacing:-.03em!important}
      .card-grid{grid-template-columns:1fr!important}
      .stats-grid{grid-template-columns:1fr 1fr!important}
      .modal-inner{margin:0!important;border-radius:20px 20px 0 0!important;position:fixed!important;bottom:0!important;left:0!important;right:0!important;max-height:90vh!important;overflow-y:auto!important}
    }
    @media(max-width:480px){
      .mobile-p{padding:14px!important}
      .mobile-grid1{grid-template-columns:1fr!important}
      .mobile-hide-sm{display:none!important}
      .mobile-text-xs{font-size:11px!important}
      h1.hero-title{font-size:clamp(24px,7vw,44px)!important}
    }
    @media(hover:none){
      button,a,[role="button"]{min-height:44px}
      input,select,textarea{font-size:16px!important}
    }
    .no-scroll::-webkit-scrollbar{display:none}
    .no-scroll{-ms-overflow-style:none;scrollbar-width:none}
    /* Editor mobile */
    @media(max-width:768px){
      .editor-grid{grid-template-columns:1fr!important}
      .editor-grid>div:first-child{display:none!important}
    }
    /* Safe area pour iPhone X+ */
    @supports(padding:max(0px)){
      nav{padding-left:max(16px,env(safe-area-inset-left))!important;padding-right:max(16px,env(safe-area-inset-right))!important}
      .page{padding-bottom:max(20px,env(safe-area-inset-bottom))}
    }
  `}</style>
);
const API_BASE = ""; // Même domaine — les appels vont vers /api/...
const SUPABASE_URL = "https://vinrzhxhgbfilawgbpcq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_MbqBKTGN_s_uiXDr8o_gWA_RE9YFVPT";
const signInWithGoogle = () => {
  const redirectTo = encodeURIComponent(window.location.origin);
  window.location.href = `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${redirectTo}`;
};
const T = {
  bg:"#030305",bg2:"#060608",bg3:"#08080c",
  surf:"#0d0d12",surf2:"#111116",surf3:"#15151c",
  border:"#1c1c28",borderL:"#24243a",
  acc:"#7c3aed",accH:"#9d5df7",accGlow:"#7c3aed45",
  pink:"#f43f5e",cyan:"#22d3ee",green:"#22c55e",
  yellow:"#facc15",orange:"#fb923c",purple:"#a855f7",
  red:"#ef4444",gold:"#fbbf24",
  text:"#ffffff",muted:"#8b8ba0",dim:"#4a4a60",
  grad:"linear-gradient(135deg,#7c3aed 0%,#a855f7 50%,#c084fc 100%)",
  gradH:"linear-gradient(135deg,#9d5df7,#b975f7,#d09dfc)",
  gradP:"linear-gradient(135deg,#f43f5e,#fb923c)",
  gradG:"linear-gradient(135deg,#22c55e,#22d3ee)",
  gradY:"linear-gradient(135deg,#facc15,#fb923c)",
  gradAcc:"linear-gradient(135deg,#6d28d9,#9d5df7)",
};
const LANGS=[
  {code:"fr",flag:"🇫🇷",name:"French"},{code:"en",flag:"🇬🇧",name:"English"},
  {code:"es",flag:"🇪🇸",name:"Spanish"},{code:"de",flag:"🇩🇪",name:"German"},
  {code:"it",flag:"🇮🇹",name:"Italian"},{code:"pt",flag:"🇵🇹",name:"Portuguese"},
  {code:"ja",flag:"🇯🇵",name:"Japanese"},{code:"zh",flag:"🇨🇳",name:"Chinese"},
  {code:"ar",flag:"🇸🇦",name:"Arabic"},{code:"ru",flag:"🇷🇺",name:"Russian"},
  {code:"ko",flag:"🇰🇷",name:"Korean"},{code:"nl",flag:"🇳🇱",name:"Dutch"},
];

const MOCK_USERS=[];

const MOCK_FILES=[];

const SUBTITLE_STYLES=[
  // ── TOP VIRAL ──
  {id:"mrbeast",label:"MrBeast",badge:"#1 Viral",preview:{bg:"transparent",color:"#FFE600",font:"Anton",weight:900,size:72,shadow:"4px 4px 0 #000,-4px -4px 0 #000,4px -4px 0 #000,-4px 4px 0 #000,0 0 40px rgba(255,230,0,.5)",transform:"uppercase"}},
  {id:"captions-white",label:"Captions Classic",badge:"Captions.ai",preview:{bg:"transparent",color:"#ffffff",font:"Montserrat",weight:900,size:68,shadow:"-3px -3px 0 #000,3px -3px 0 #000,-3px 3px 0 #000,3px 3px 0 #000",transform:"uppercase"}},
  {id:"submagic-yellow",label:"Submagic Pop",badge:"Submagic",preview:{bg:"transparent",color:"#FFE600",font:"Barlow Condensed",weight:900,size:74,shadow:"-3px -3px 0 #000,3px -3px 0 #000,-3px 3px 0 #000,3px 3px 0 #000",transform:"uppercase"}},
  {id:"tiktok-clean",label:"TikTok Clean",badge:"TikTok",preview:{bg:"rgba(0,0,0,.75)",color:"#ffffff",font:"Montserrat",weight:800,size:56,shadow:"none",transform:"none"}},
  {id:"highlight-yellow",label:"Highlight",badge:"Trending",preview:{bg:"#FFE600",color:"#000",font:"Montserrat",weight:900,size:58,shadow:"none",transform:"uppercase"}},
  {id:"highlight-pink",label:"Highlight Rose",badge:"Reels",preview:{bg:"#e83970",color:"#fff",font:"Montserrat",weight:900,size:56,shadow:"none",transform:"none"}},
  {id:"squeezie",label:"Squeezie",badge:"FR",preview:{bg:"transparent",color:"#fff",font:"Barlow Condensed",weight:900,size:68,shadow:"0 0 2px #000,3px 3px 0 #4f6dff,-3px -3px 0 #4f6dff",transform:"uppercase"}},
  {id:"double-outline",label:"Double Outline",badge:"Viral",preview:{bg:"transparent",color:"#fff",font:"Anton",weight:900,size:66,shadow:"3px 3px 0 #ff4f8a,-3px -3px 0 #ff4f8a,0 0 30px rgba(255,79,138,.4)",transform:"uppercase"}},
  // ── CLEAN / PRO ──
  {id:"clean-white",label:"Clean White",badge:"Pro",preview:{bg:"transparent",color:"#ffffff",font:"Montserrat",weight:700,size:56,shadow:"0 2px 16px rgba(0,0,0,1),0 1px 4px rgba(0,0,0,1)",transform:"none"}},
  {id:"bebas-white",label:"Bebas Neue",badge:"Cinéma",preview:{bg:"transparent",color:"#ffffff",font:"Bebas Neue",weight:400,size:72,shadow:"0 3px 20px rgba(0,0,0,1)",transform:"uppercase"}},
  {id:"oswald-bold",label:"Oswald Bold",badge:"News",preview:{bg:"transparent",color:"#ffffff",font:"Oswald",weight:700,size:66,shadow:"-2px -2px 0 #000,2px -2px 0 #000,-2px 2px 0 #000,2px 2px 0 #000",transform:"uppercase"}},
  {id:"righteous",label:"Righteous",badge:"Fun",preview:{bg:"transparent",color:"#ffffff",font:"Righteous",weight:400,size:60,shadow:"3px 3px 0 #4f6dff,-1px -1px 0 #000",transform:"none"}},
  {id:"dark-card",label:"Dark Card",badge:"Podcast",preview:{bg:"rgba(0,0,0,.82)",color:"#fff",font:"Montserrat",weight:700,size:52,shadow:"none",transform:"none"}},
  {id:"minimal-white",label:"Minimal",badge:"Simple",preview:{bg:"transparent",color:"#fff",font:"DM Sans",weight:500,size:50,shadow:"0 2px 12px rgba(0,0,0,.95)",transform:"none"}},
  // ── COULEURS / NEON ──
  {id:"fire-gradient",label:"Fire Orange",badge:"Gaming",preview:{bg:"transparent",color:"#ff7043",font:"Barlow Condensed",weight:900,size:68,shadow:"0 0 20px #ff7043,3px 3px 0 #000",transform:"uppercase"}},
  {id:"neon-blue-pulse",label:"Neon Blue",badge:"Cyber",preview:{bg:"transparent",color:"#4f6dff",font:"Barlow Condensed",weight:900,size:66,shadow:"0 0 12px #4f6dff,0 0 30px #4f6dff66",transform:"uppercase"}},
  {id:"neon-green",label:"Neon Green",badge:"Gaming",preview:{bg:"transparent",color:"#00e5a0",font:"Barlow Condensed",weight:900,size:64,shadow:"0 0 14px #00e5a0,0 0 30px #00e5a066",transform:"uppercase"}},
  {id:"gold-luxury",label:"Gold",badge:"Business",preview:{bg:"transparent",color:"#ffd700",font:"Oswald",weight:700,size:62,shadow:"0 0 20px #ffd70088,2px 2px 0 #7c4f00",transform:"uppercase"}},
  {id:"pink-fire",label:"Pink",badge:"Reels",preview:{bg:"transparent",color:"#ff4f8a",font:"Montserrat",weight:900,size:62,shadow:"2px 2px 0 #000",transform:"none"}},
  {id:"horror",label:"Horror",badge:"Creepy",preview:{bg:"transparent",color:"#ff3b5c",font:"Anton",weight:900,size:66,shadow:"0 0 20px #ff3b5c,4px 0 0 #000,-4px 0 0 #000",transform:"uppercase"}},
  {id:"lena-sit",label:"Léna Situations",badge:"FR",preview:{bg:"rgba(255,79,138,.92)",color:"#fff",font:"Montserrat",weight:900,size:50,shadow:"none",transform:"none"}},
  {id:"red-urgent",label:"Red Alert",badge:"Urgent",preview:{bg:"rgba(220,38,38,.9)",color:"#fff",font:"Barlow Condensed",weight:900,size:58,shadow:"none",transform:"uppercase"}},
];

const ALL_DEMOS=[];

const TEMPLATES=[
  {id:"tiktok-viral",name:"TikTok Viral",icon:"🔥",styleId:"yellow-bold",desc:"Sous-titres jaunes impact, parfaits pour les trends"},
  {id:"podcast-clean",name:"Podcast Clean",icon:"🎙️",styleId:"minimal-white",desc:"Style minimaliste élégant pour contenu éducatif"},
  {id:"gaming",name:"Gaming",icon:"🎮",styleId:"cyan-punch",desc:"Cyan néon pour streams, highlights et esport"},
  {id:"motivation",name:"Motivation",icon:"💪",styleId:"mrbeast",desc:"MrBeast style — gros impact jaune pour les vidéos hype"},
  {id:"news",name:"News / Actu",icon:"📰",styleId:"red-urgent",desc:"Rouge urgent pour breaking news et actus"},
  {id:"cinema",name:"Cinéma",icon:"🎬",styleId:"dark-card",desc:"Fond sombre pour un rendu cinématographique"},
  {id:"luxury",name:"Business",icon:"💎",styleId:"gold-luxury",desc:"Gold luxe pour finance, business et coaching"},
  {id:"horror",name:"Horror / Thriller",icon:"😈",styleId:"horror",desc:"Rouge fantôme pour vlogs creepy et thrillers"},
];

const PLANS=[
  {id:"free",name:"Free",price:0,priceY:0,color:T.muted,credits:3,features:["3 vidéos / mois","Sous-titres auto IA","24 styles de sous-titres","Export SRT / ASS"],locked:["Export vidéo HD","Traduction auto","Polices custom","Support prioritaire","API Access"]},
  {id:"basic",name:"Basic",price:12,priceY:10,color:T.cyan,credits:30,features:["30 vidéos / mois","300 MB / vidéo","Polices custom","Export vidéo HD","Export SRT / ASS","Support 24/7"],locked:["API Access"]},
  {id:"expert",name:"Expert",price:18,priceY:13,color:T.green,credits:100,features:["100 vidéos / mois","400 MB / vidéo","Polices custom","Export vidéo HD","Traduction auto (12 langues)","Support prioritaire"],locked:["API Access"]},
  {id:"pro",name:"Pro",price:30,priceY:21,color:T.acc,credits:Infinity,popular:true,features:["Vidéos illimitées","600 MB / vidéo","Toutes les polices","Export vidéo HD","Traduction auto (12 langues)","Support prioritaire","Branding custom","API Access"],locked:[]},
];

const genSubs=()=>{
  const lines=["Regarde ce truc incroyable 👀","t'as jamais vu ça avant 🤯","je te promets que","tu vas être choqué 😱","voilà la vraie méthode","que personne te dit 🤫","c'est là que ça devient","vraiment intéressant 🔥","attends de voir la suite","tu vas halluciner 🤯","et le résultat final","c'est tout simplement magique ✨","tu peux essayer ça","dès maintenant chez toi","et tu verras la différence 💪","c'est aussi simple que ça","crois-moi sur parole","j'ai testé pendant 30 jours 📅","et les résultats parlent","d'eux mêmes mon ami 🎯"];
  return lines.map((t,i)=>({id:i+1,start:+(i*.9+.1).toFixed(2),end:+(i*.9+.78).toFixed(2),text:t}));
};
let _notifId=0;
let _notifListeners=[];
const notify=(msg,type="info",duration=4000)=>{
  const id=++_notifId;
  _notifListeners.forEach(fn=>fn({id,msg,type,duration}));
};
const ConfirmModal=({open,title,desc,onConfirm,onCancel,danger=true})=>{
  if(!open) return null;
  return(
    <div style={{position:"fixed",inset:0,zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,.65)",backdropFilter:"blur(6px)"}} onClick={onCancel}>
      <div onClick={e=>e.stopPropagation()} style={{background:T.surf,border:`1px solid ${danger?"rgba(232,57,112,.3)":T.borderL}`,borderRadius:18,padding:"28px 28px 22px",width:"min(400px,92vw)",boxShadow:"0 24px 80px rgba(0,0,0,.7)",animation:"popIn .25s cubic-bezier(.34,1.56,.64,1)"}}>
        <div style={{fontSize:20,marginBottom:8}}>⚠️</div>
        <div style={{fontWeight:800,fontSize:16,marginBottom:8,color:T.text}}>{title}</div>
        {desc&&<div style={{fontSize:13,color:T.muted,lineHeight:1.6,marginBottom:20}}>{desc}</div>}
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <Btn v="secondary" size="sm" onClick={onCancel}>Annuler</Btn>
          <Btn v={danger?"danger":"primary"} size="sm" onClick={onConfirm}>Confirmer</Btn>
        </div>
      </div>
    </div>
  );
};

const ChatBubble=({setPage,user})=>{
  const [open,setOpen]=useState(false);
  const [msg,setMsg]=useState("");
  const [msgs,setMsgs]=useState([{from:"bot",text:"Bonjour ! Comment puis-je t'aider ? 👋"}]);
  const [loading,setLoading]=useState(false);
  const endRef=useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);

  // Sauvegarde les conversations dans localStorage pour l'admin
  const saveToAdmin=(allMsgs)=>{
    try{
      const sessionId="chat_"+(user?.email||"anonymous")+"_"+Date.now().toString(36).slice(-6);
      const existing=JSON.parse(localStorage.getItem("sc_chat_tickets")||"[]");
      const ticketIdx=existing.findIndex(t=>t.sessionId===sessionId);
      const ticket={
        sessionId,
        user:user?.name||"Visiteur",
        email:user?.email||"anonyme",
        plan:user?.plan||"Free",
        time:new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}),
        date:new Date().toLocaleDateString("fr-FR"),
        msgs:allMsgs,
        status:"open",
      };
      if(ticketIdx>=0) existing[ticketIdx]=ticket;
      else existing.unshift(ticket);
      localStorage.setItem("sc_chat_tickets",JSON.stringify(existing.slice(0,50)));
    }catch{}
  };

  const send=async()=>{
    if(!msg.trim())return;
    const txt=msg.trim();
    setMsg("");
    const newMsgs=[...msgs,{from:"user",text:txt}];
    setMsgs(newMsgs);
    saveToAdmin(newMsgs);
    setLoading(true);
    try{
      const r=await fetch("/api/anthropic",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:500,system:"Tu es Sophie, l'assistante SubCraft. Reponds en francais, de facon concise (2-3 phrases max). Tu aides les createurs de contenu avec les sous-titres IA. Sois sympathique et utile.",messages:[...msgs.filter(m=>m.from!=="bot"||msgs.indexOf(m)===0).map(m=>({role:m.from==="user"?"user":"assistant",content:m.text})),{role:"user",content:txt}]})});
      const d=await r.json();
      const reply=d.content?.[0]?.text||"Je suis la pour t'aider !";
      const updated=[...newMsgs,{from:"bot",text:reply}];
      setMsgs(updated);
      saveToAdmin(updated);
    }catch{
      setMsgs(m=>[...m,{from:"bot",text:"Desolee, je suis momentanement indisponible. Reessaie ! 🔄"}]);
    }
    setLoading(false);
  };

  return(
    <div style={{position:"fixed",bottom:24,right:24,zIndex:999}}>
      {open&&(
        <div style={{position:"absolute",bottom:68,right:0,width:320,background:"#0e0e18",border:"1px solid rgba(124,58,237,.3)",borderRadius:20,boxShadow:"0 24px 60px rgba(0,0,0,.7)",overflow:"hidden",animation:"fadeDown .2s ease"}}>
          {/* Header */}
          <div style={{padding:"14px 18px",background:"linear-gradient(135deg,#7c3aed,#a855f7)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>✦</div>
              <div>
                <div style={{fontWeight:700,fontSize:13,color:"#fff"}}>Sophie — SubCraft</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,.7)",display:"flex",alignItems:"center",gap:4}}>
                  <span style={{width:5,height:5,borderRadius:"50%",background:"#34d399",display:"inline-block"}}/>En ligne
                </div>
              </div>
            </div>
            <button onClick={()=>setOpen(false)} style={{background:"none",border:"none",color:"rgba(255,255,255,.7)",fontSize:18,cursor:"pointer",lineHeight:1}}>×</button>
          </div>
          {/* Messages */}
          <div style={{height:260,overflowY:"auto",padding:"14px 14px 0",display:"flex",flexDirection:"column",gap:10}}>
            {msgs.map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:m.from==="user"?"flex-end":"flex-start"}}>
                <div style={{maxWidth:"80%",padding:"9px 13px",borderRadius:m.from==="user"?"14px 14px 2px 14px":"14px 14px 14px 2px",background:m.from==="user"?"#7c3aed":"rgba(255,255,255,.07)",color:"#fff",fontSize:13,lineHeight:1.55}}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading&&<div style={{display:"flex",gap:4,padding:"8px 13px",background:"rgba(255,255,255,.07)",borderRadius:"14px 14px 14px 2px",width:"fit-content"}}>
              {[0,1,2].map(i=><span key={i} style={{width:6,height:6,borderRadius:"50%",background:"rgba(255,255,255,.4)",animation:`bounce .8s ease ${i*.15}s infinite`}}/>)}
            </div>}
            <div ref={endRef}/>
          </div>
          {/* Input */}
          <div style={{padding:"10px 12px",borderTop:"1px solid rgba(255,255,255,.07)",display:"flex",gap:8}}>
            <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ecris ton message..." style={{flex:1,padding:"9px 13px",borderRadius:10,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",color:"#fff",fontSize:13,outline:"none"}}/>
            <button onClick={send} disabled={!msg.trim()||loading} style={{width:36,height:36,borderRadius:10,background:"#7c3aed",border:"none",color:"#fff",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,opacity:!msg.trim()?0.4:1}}>↑</button>
          </div>
        </div>
      )}
      {/* Bouton */}
      <button onClick={()=>setOpen(o=>!o)}
        style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#7c3aed,#a855f7)",border:"none",color:"#fff",fontSize:22,cursor:"pointer",boxShadow:"0 8px 32px rgba(124,58,237,.6)",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}}
        onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.08)";}}
        onMouseLeave={e=>{e.currentTarget.style.transform="none";}}>
        {open?"×":"💬"}
      </button>
    </div>
  );
};

const NotifProvider=()=>{
  const [notifs,setNotifs]=useState([]);
  useEffect(()=>{
    const fn=(n)=>{
      setNotifs(p=>[...p,{...n,out:false}]);
      setTimeout(()=>setNotifs(p=>p.map(x=>x.id===n.id?{...x,out:true}:x)),n.duration-500);
      setTimeout(()=>setNotifs(p=>p.filter(x=>x.id!==n.id)),n.duration);
    };
    _notifListeners.push(fn);
    return()=>{_notifListeners=_notifListeners.filter(x=>x!==fn);};
  },[]);
  const colors={info:T.acc,success:T.green,warning:T.yellow,error:T.pink};
  const icons={info:"ℹ",success:"✓",warning:"⚠",error:"✕"};
  return(
    <div style={{position:"fixed",top:20,right:20,zIndex:9999,display:"flex",flexDirection:"column",gap:10,pointerEvents:"none"}}>
      {notifs.map(n=>(
        <div key={n.id} style={{padding:"12px 18px",borderRadius:12,background:T.surf2,border:`1px solid ${colors[n.type]}44`,boxShadow:"0 8px 32px rgba(0,0,0,.5)",display:"flex",alignItems:"center",gap:10,minWidth:280,animation:n.out?"notifOut .4s ease forwards":"notifIn .35s cubic-bezier(.34,1.56,.64,1) both",pointerEvents:"auto",maxWidth:360}}>
          <div style={{width:28,height:28,borderRadius:"50%",background:`${colors[n.type]}18`,border:`1px solid ${colors[n.type]}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:colors[n.type],flexShrink:0}}>{icons[n.type]}</div>
          <span style={{fontSize:13,fontWeight:500,lineHeight:1.4}}>{n.msg}</span>
        </div>
      ))}
    </div>
  );
};
const Btn=({children,v="primary",size="md",onClick,disabled,style,icon,full,loading,title})=>{
  const pd={sm:"7px 16px",md:"10px 22px",lg:"13px 28px",xl:"16px 40px"}[size];
  const fs={sm:"12px",md:"13px",lg:"14px",xl:"15px"}[size];
  const vs={
    primary:{background:T.grad,color:"#fff",border:"none",boxShadow:`0 4px 24px ${T.accGlow}`},
    secondary:{background:"rgba(255,255,255,.05)",color:T.text,border:"1px solid rgba(255,255,255,.1)"},
    ghost:{background:"transparent",color:T.muted,border:"none"},
    danger:{background:"rgba(232,57,112,.1)",color:T.pink,border:"1px solid rgba(232,57,112,.22)"},
    dark:{background:T.surf2,color:T.text,border:"1px solid rgba(255,255,255,.07)"},
    success:{background:"rgba(52,211,153,.1)",color:T.green,border:"1px solid rgba(52,211,153,.22)"},
    warning:{background:"rgba(251,191,36,.1)",color:T.yellow,border:"1px solid rgba(251,191,36,.22)"},
  };
  return(
    <button title={title} onClick={onClick} disabled={disabled||loading} style={{padding:pd,fontSize:fs,fontWeight:600,borderRadius:"11px",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7,transition:"all .22s cubic-bezier(.22,1,.36,1)",opacity:(disabled||loading)?.45:1,width:full?"100%":undefined,letterSpacing:"-.01em",cursor:(disabled||loading)?"not-allowed":"pointer",...vs[v],...style}}
      onMouseEnter={e=>{if(!disabled&&!loading){e.currentTarget.style.filter="brightness(1.12)";e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow=v==="primary"?`0 8px 30px ${T.accGlow}`:"none";}}}
      onMouseLeave={e=>{e.currentTarget.style.filter="brightness(1)";e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=vs[v].boxShadow||"none";}}>
      {loading?<Spn s={14}/>:icon&&<span style={{fontSize:"1.1em"}}>{icon}</span>}
      {children}
    </button>
  );
};

const Spn=({s=18,color=T.acc})=>(
  <div style={{width:s,height:s,border:`2px solid ${T.border}`,borderTopColor:color,borderRadius:"50%",animation:"spin .7s linear infinite",flexShrink:0}}/>
);

const Tag=({children,color=T.acc,dot,size="sm"})=>(
  <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:size==="sm"?"3px 9px":"5px 12px",borderRadius:100,background:`${color}15`,color,border:`1px solid ${color}28`,fontSize:size==="sm"?11:12,fontWeight:700,letterSpacing:".05em",textTransform:"uppercase",whiteSpace:"nowrap"}}>
    {dot&&<span style={{width:5,height:5,borderRadius:"50%",background:color,animation:"pulseDot 2s infinite",flexShrink:0}}/>}
    {children}
  </span>
);

const Tog=({value,onChange,label})=>(
  <div style={{display:"flex",alignItems:"center",gap:8}}>
    <div onClick={()=>onChange(!value)} style={{width:44,height:24,borderRadius:12,background:value?T.acc:T.surf3,border:`1px solid ${value?T.acc:T.border}`,position:"relative",cursor:"pointer",transition:"all .22s",flexShrink:0}}>
      <div style={{position:"absolute",top:2,left:value?20:2,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 2px 6px rgba(0,0,0,.35)"}}/>
    </div>
    {label&&<span style={{fontSize:13,color:value?T.text:T.muted}}>{label}</span>}
  </div>
);

const Divider=({label})=>(
  <div style={{display:"flex",alignItems:"center",gap:12,margin:"8px 0"}}>
    <div style={{flex:1,height:1,background:T.border}}/>
    {label&&<span style={{fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:".08em",whiteSpace:"nowrap"}}>{label}</span>}
    <div style={{flex:1,height:1,background:T.border}}/>
  </div>
);

const Input=({label,value,onChange,placeholder,type="text",required,icon,hint})=>(
  <div>
    {label&&<label style={{fontSize:12,color:T.muted,display:"block",marginBottom:6,fontWeight:600}}>{label}{required&&<span style={{color:T.pink,marginLeft:3}}>*</span>}</label>}
    <div style={{position:"relative"}}>
      {icon&&<span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:15,pointerEvents:"none"}}>{icon}</span>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",padding:icon?"12px 14px 12px 40px":"12px 16px",borderRadius:12,fontSize:14,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",color:T.text,transition:"all .2s"}}
        onFocus={e=>{e.target.style.borderColor="rgba(91,108,255,.5)";e.target.style.boxShadow="0 0 0 3px rgba(91,108,255,.08)";}}
        onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,.07)";e.target.style.boxShadow="none";}}/>
    </div>
    {hint&&<div style={{fontSize:11,color:T.muted,marginTop:4}}>{hint}</div>}
  </div>
);

const Select=({label,value,onChange,options})=>(
  <div>
    {label&&<label style={{fontSize:12,color:T.muted,display:"block",marginBottom:6,fontWeight:600}}>{label}</label>}
    <select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"10px 14px",borderRadius:10,fontSize:14,background:T.surf,border:`1px solid ${T.border}`,color:T.text}}>
      {options.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
    </select>
  </div>
);

const Modal=({title,onClose,children,width=480,subtitle})=>(
  <div style={{position:"fixed",inset:0,background:"rgba(2,3,10,.88)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(28px)",padding:16}} onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:width,background:T.surf,borderRadius:24,border:"1px solid rgba(255,255,255,.08)",padding:32,animation:"popIn .35s cubic-bezier(.34,1.56,.64,1)",boxShadow:"0 50px 100px rgba(0,0,0,.7),0 0 0 1px rgba(91,108,255,.08)",maxHeight:"90vh",overflowY:"auto",backdropFilter:"blur(20px)"}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <div style={{fontWeight:800,fontSize:20}}>{title}</div>
          {subtitle&&<div style={{color:T.muted,fontSize:13,marginTop:3}}>{subtitle}</div>}
        </div>
        {onClose&&<button onClick={onClose} style={{background:"transparent",border:"none",color:T.muted,fontSize:22,lineHeight:1,padding:"2px 6px",borderRadius:6,transition:"color .15s",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.color=T.text} onMouseLeave={e=>e.currentTarget.style.color=T.muted}>×</button>}
      </div>
      {children}
    </div>
  </div>
);

const Skeleton=({w="100%",h=16,r=6,style})=>(
  <div className="skel" style={{width:w,height:h,borderRadius:r,...style}}/>
);

const Avatar=({name="?",size=32,src})=>{
  const initials=name.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase();
  return(
    <div style={{width:size,height:size,borderRadius:"50%",background:T.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.35,fontWeight:800,flexShrink:0,overflow:"hidden"}}>
      {src?<img src={src} style={{width:"100%",height:"100%",objectFit:"cover"}} alt={name}/>:initials}
    </div>
  );
};

const Tooltip=({children,text,pos="top"})=>{
  const [show,setShow]=useState(false);
  return(
    <div style={{position:"relative",display:"inline-flex"}} onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}>
      {children}
      {show&&text&&(
        <div style={{position:"absolute",[pos==="top"?"bottom":"top"]:"calc(100% + 6px)",left:"50%",transform:"translateX(-50%)",background:T.surf3,border:`1px solid ${T.border}`,borderRadius:8,padding:"5px 10px",fontSize:11,color:T.text,whiteSpace:"nowrap",zIndex:100,pointerEvents:"none",boxShadow:"0 4px 12px rgba(0,0,0,.4)"}}>
          {text}
        </div>
      )}
    </div>
  );
};
const DeleteTimer=({hours})=>{
  const [h,setH]=useState(hours);
  const [m,setM]=useState(29);
  useEffect(()=>{
    const iv=setInterval(()=>setM(p=>{if(p<=0){setH(hh=>Math.max(0,hh-1));return 59;}return p-1;}),3000);
    return()=>clearInterval(iv);
  },[]);
  const color=h<2?T.pink:h<6?T.yellow:T.green;
  const r=8; const circ=2*Math.PI*r;
  const pct=((h*60+m)/(24*60));
  return(
    <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"3px 9px",borderRadius:7,background:`${color}12`,border:`1px solid ${color}25`}}>
      <svg width={18} height={18} style={{transform:"rotate(-90deg)",flexShrink:0}}>
        <circle cx={9} cy={9} r={r} fill="none" stroke={`${color}25`} strokeWidth={1.5}/>
        <circle cx={9} cy={9} r={r} fill="none" stroke={color} strokeWidth={1.5} strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} strokeLinecap="round"/>
      </svg>
      <span style={{fontSize:10,fontFamily:"JetBrains Mono",fontWeight:600,color}}>{h}h{m.toString().padStart(2,"0")}</span>
    </div>
  );
};
const GoogleBtn=({onClick,label="Continuer avec Google"})=>(
  <button onClick={onClick} style={{width:"100%",padding:"12px 20px",borderRadius:12,background:"#fff",border:"1px solid #e0e6f0",display:"flex",alignItems:"center",justifyContent:"center",gap:10,fontSize:14,fontWeight:600,color:"#1a1a2e",cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,.08)",transition:"all .2s",fontFamily:"Outfit"}}
    onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,.15)";e.currentTarget.style.transform="translateY(-1px)";}}
    onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,.08)";e.currentTarget.style.transform="translateY(0)";}}>
    <svg width={18} height={18} viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
    {label}
  </button>
);
// Composant mot-par-mot — UN seul mot à la fois, le précédent disparaît
const WordByWord=({text, style, startTime, currentTime, dur})=>{
  const words = text.trim().split(' ').filter(Boolean);
  const total = words.length;
  if(total === 0) return null;
  const elapsed = Math.max(0, currentTime - startTime);
  const timePerWord = Math.max(0.15, dur / total);
  const idx = Math.min(total - 1, Math.floor(elapsed / timePerWord));
  const word = words[idx] || words[0];
  return(
    <span key={idx} style={{
      ...style,
      display:'inline-block',
      whiteSpace:'nowrap',
      animation:'wordPop .15s cubic-bezier(.34,1.56,.64,1) both',
      padding: style.background && style.background !== 'transparent' ? '2px 8px' : '0 2px',
      lineHeight: 1.1,
    }}>{word}</span>
  );
};

const PhoneMockup=({subs,currentTime,styleId,fontSize,fontFamily,playing,onToggle,liveStyle,subYPos=20,onSubYChange,stripEmoji,displayMode='word',videoFile,videoRef,onTimeUpdate})=>{
  const st=SUBTITLE_STYLES.find(s=>s.id===styleId)||SUBTITLE_STYLES[0];
  const active=subs.find(s=>currentTime>=s.start&&currentTime<=s.end);
  const totalDur=subs.length>0?subs[subs.length-1].end+2:18;
  const W=270; const H=500;
  const phoneRef=useRef(null);

  // Drag to reposition subtitle vertically
  const handleDragMove=(clientY)=>{
    if(!onSubYChange||!phoneRef.current)return;
    const rect=phoneRef.current.getBoundingClientRect();
    const relY=clientY-rect.top;
    const pct=Math.round((1-(relY/rect.height))*100);
    onSubYChange(Math.max(2,Math.min(90,pct)));
  };
  const startDrag=(e)=>{
    e.preventDefault();
    const onMove=(ev)=>handleDragMove(ev.touches?ev.touches[0].clientY:ev.clientY);
    const onUp=()=>{window.removeEventListener('mousemove',onMove);window.removeEventListener('mouseup',onUp);window.removeEventListener('touchmove',onMove);window.removeEventListener('touchend',onUp);};
    window.addEventListener('mousemove',onMove);
    window.addEventListener('mouseup',onUp);
    window.addEventListener('touchmove',onMove,{passive:false});
    window.addEventListener('touchend',onUp);
  };

  const _applyText=(t)=>stripEmoji?stripEmoji(t):t;
  // Font size: much smaller to avoid double-line
  const scaledSize=Math.round(st.preview.size*(W/380)*(fontSize/68)*0.52);
  const clampedSize=Math.max(9,Math.min(scaledSize,16));

  const isSingleLine=liveStyle&&liveStyle.whiteSpace==='nowrap';
  const baseStyle=liveStyle||{
    fontFamily:fontFamily||st.preview.font,
    fontSize:`${clampedSize}px`,
    fontWeight:st.preview.weight,
    color:st.preview.color,
    textShadow:st.preview.shadow,
    textTransform:st.preview.transform,
    background:st.preview.bg,
    padding:st.preview.bg!=='transparent'?'3px 8px':'0 2px',
    borderRadius:'6px',
    animation:'none',
  };
  const subStyle={
    ...baseStyle,
    fontSize:liveStyle?baseStyle.fontSize:`${clampedSize}px`,
    display:'inline-block',
    textAlign:'center',
    lineHeight:1.25,
    maxWidth:isSingleLine?'none':'82%',
    whiteSpace:isSingleLine?'nowrap':'normal',
    wordBreak:isSingleLine?'normal':'break-word',
    overflow:isSingleLine?'hidden':'visible',
    textOverflow:isSingleLine?'ellipsis':'clip',
  };

  return(
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8,flexShrink:0}}>
      <div ref={phoneRef}
        style={{width:W,height:H,borderRadius:42,background:'linear-gradient(160deg,#070a1c,#040611)',border:'2.5px solid rgba(91,108,255,.25)',boxShadow:'0 0 0 1px rgba(255,255,255,.04),0 40px 80px rgba(0,0,0,.8),0 0 80px rgba(91,108,255,.12),inset 0 1px 0 rgba(255,255,255,.07)',position:'relative',overflow:'hidden',flexShrink:0,cursor:onSubYChange?'ns-resize':'default',userSelect:'none'}}
        onMouseDown={onSubYChange?startDrag:undefined}
        onTouchStart={onSubYChange?startDrag:undefined}>
        <div style={{position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:72,height:24,background:'#040611',borderRadius:'0 0 18px 18px',zIndex:20,borderBottom:'1.5px solid rgba(91,108,255,.15)'}}/>
        <div style={{position:'absolute',top:0,left:0,right:0,height:'45%',background:'linear-gradient(180deg,rgba(255,255,255,.04),transparent)',borderRadius:'42px 42px 0 0',pointerEvents:'none',zIndex:15}}/>
        <div style={{width:'100%',height:'100%',background:'#000',position:'relative',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
          {/* Vraie vidéo si disponible */}
          {videoFile && videoFile instanceof File ? (
            <video
              ref={videoRef}
              src={URL.createObjectURL(videoFile)}
              style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}
              muted={false}
              playsInline
              onTimeUpdate={e=>onTimeUpdate&&onTimeUpdate(+(e.target.currentTime.toFixed(1)))}
              onEnded={()=>{}}
            />
          ) : (
            <>
              <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#12103a 0%,#070812 55%,#030210 100%)'}}/>
              <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div style={{fontSize:80,opacity:.06}}>🎬</div>
              </div>
            </>
          )}
          <div style={{position:'absolute',bottom:0,left:0,right:0,height:'40%',background:'linear-gradient(0deg,rgba(0,0,0,.85) 0%,transparent 100%)',pointerEvents:'none'}}/>
          {/* SUBTITLE */}
          <div style={{position:'absolute',bottom:`${subYPos}%`,left:0,right:0,textAlign:'center',padding:'0 8px',zIndex:10,display:'flex',justifyContent:'center',alignItems:'center',pointerEvents:'none'}}>
            {active?(
              displayMode==='word'
                ?<WordByWord key={active.id} text={_applyText(active.text)} style={subStyle} startTime={active.start} currentTime={currentTime} dur={active.end-active.start}/>
                :<span key={active.id} style={{...subStyle,display:'inline-block'}}>{_applyText(active.text)}</span>
            ):(
              <span style={{...subStyle,animation:'none',opacity:.15,fontSize:'9px'}}>Sous-titre ici</span>
            )}
          </div>
          {/* Drag hint */}
          {onSubYChange&&(
            <div style={{position:'absolute',top:30,left:0,right:0,display:'flex',justifyContent:'center',zIndex:20,pointerEvents:'none'}}>
              <div style={{fontSize:9,color:'rgba(255,255,255,.28)',background:'rgba(0,0,0,.35)',padding:'2px 8px',borderRadius:20}}>↕ glisser pour déplacer</div>
            </div>
          )}
          <div style={{position:'absolute',right:10,top:'25%',display:'flex',flexDirection:'column',gap:12,alignItems:'center',zIndex:12}}>
            {[['❤️','12k'],['💬','489'],['↗','1.2k']].map(([ic,n])=>(
              <div key={ic} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                <div style={{fontSize:22,filter:'drop-shadow(0 2px 6px rgba(0,0,0,.6))'}}>{ic}</div>
                <div style={{fontSize:8,color:'rgba(255,255,255,.65)',fontWeight:700}}>{n}</div>
              </div>
            ))}
          </div>
          <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'6px 12px 12px',background:'linear-gradient(transparent,rgba(0,0,0,.75))'}}>
            <div style={{height:2.5,background:'rgba(255,255,255,.12)',borderRadius:2,marginBottom:7,position:'relative',overflow:'hidden'}}>
              <div style={{height:'100%',width:`${Math.min((currentTime/totalDur)*100,100)}%`,background:`linear-gradient(90deg,${T.acc},${T.purple})`,borderRadius:2,transition:'width .1s'}}/>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <button onClick={e=>{e.stopPropagation();onToggle();}} style={{width:28,height:28,borderRadius:'50%',background:'rgba(255,255,255,.2)',border:'1px solid rgba(255,255,255,.1)',color:'#fff',fontSize:11,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',backdropFilter:'blur(4px)'}}>{playing?'⏸':'▶'}</button>
              <span style={{fontSize:8,color:'rgba(255,255,255,.4)',fontFamily:'JetBrains Mono'}}>{currentTime.toFixed(1)}s / {totalDur.toFixed(0)}s</span>
            </div>
          </div>
        </div>
        <div style={{position:'absolute',bottom:5,left:'50%',transform:'translateX(-50%)',width:80,height:3,background:'rgba(255,255,255,.2)',borderRadius:2}}/>
      </div>
      {/* Mini timeline */}
      <div style={{width:W,height:18,background:T.surf,borderRadius:6,border:`1px solid ${T.border}`,overflow:'hidden',position:'relative'}}>
        {subs.map(s=>(
          <div key={s.id} style={{position:'absolute',top:2,height:'calc(100% - 4px)',left:`${(s.start/totalDur)*100}%`,width:`${Math.max(((s.end-s.start)/totalDur)*100,.5)}%`,background:`${T.acc}30`,border:`1px solid ${T.acc}50`,borderRadius:3}}/>
        ))}
        <div style={{position:'absolute',top:0,bottom:0,left:`${Math.min((currentTime/totalDur)*100,100)}%`,width:2,background:T.pink,zIndex:3,borderRadius:1}}>
          <div style={{width:6,height:6,borderRadius:'50%',background:T.pink,position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)'}}/>
        </div>
      </div>
    </div>
  );
};
const DemoCard=({demo,active,onHover})=>{
  const [frame,setFrame]=useState(0);
  useEffect(()=>{
    if(!active){setFrame(0);return;}
    const iv=setInterval(()=>setFrame(f=>(f+1)%(demo.words?.length||8)),550);
    return()=>clearInterval(iv);
  },[active]);
  const st=SUBTITLE_STYLES.find(s=>s.id===demo.styleId)||SUBTITLE_STYLES[0];
  const render=()=>{
    if(demo.type==="word-by-word") return(
      <div style={{display:"flex",flexWrap:"wrap",gap:4,justifyContent:"center",maxWidth:190}}>
        {demo.words.map((w,i)=><span key={i} style={{padding:"2px 8px",borderRadius:5,background:i===frame&&active?`${demo.color}25`:"transparent",color:i===frame&&active?demo.color:"rgba(255,255,255,.3)",fontWeight:i===frame?800:400,fontSize:14,border:`1px solid ${i===frame&&active?demo.color+"44":"transparent"}`,transition:"all .15s",transform:i===frame&&active?"scale(1.1)":"scale(1)"}}>{w}</span>)}
      </div>
    );
    if(demo.type==="shimmer") return(
      <div style={{position:"relative",overflow:"hidden",fontSize:17,fontWeight:800,color:"#FFE600",textAlign:"center",padding:"6px 12px"}}>
        {demo.text}
        {active&&<div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent)",animation:"shimmer 1.4s linear infinite"}}/>}
      </div>
    );
    if(demo.type==="typewriter") return(
      <div style={{fontFamily:"JetBrains Mono",fontSize:12,color:T.green,textAlign:"center",padding:"6px 12px",lineHeight:1.5}}>
        {active?demo.text.slice(0,frame*4+4):demo.text.slice(0,10)+"..."}
        <span style={{animation:"typing .6s infinite",color:T.acc}}>|</span>
      </div>
    );
    if(demo.type==="shake") return <div style={{fontSize:17,fontWeight:800,color:T.pink,textAlign:"center",animation:active?"shake .15s infinite":undefined}}>{demo.text}</div>;
    if(demo.type==="zoom-in") return <div style={{fontSize:active?22:13,fontWeight:900,color:"#FFE600",textAlign:"center",transition:"font-size .3s cubic-bezier(.34,1.56,.64,1)",textShadow:"3px 3px 0 #000"}}>{demo.text}</div>;
    if(demo.type==="bounce-words") return(
      <div style={{display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center"}}>
        {demo.text.split(" • ").map((w,i)=><span key={i} style={{padding:"3px 10px",borderRadius:20,background:`${T.acc}20`,border:`1px solid ${T.acc}44`,color:T.acc,fontWeight:700,fontSize:12,animation:active?`bounce ${.7+i*.15}s ease infinite`:undefined,animationDelay:`${i*.12}s`}}>{w}</span>)}
      </div>
    );
    if(demo.type==="emoji-line") return <div style={{fontSize:20,letterSpacing:3,textAlign:"center",animation:active?"breathe 1s ease infinite":undefined}}>{demo.text}</div>;
    const p=st.preview;
    return(
      <div style={{fontFamily:p.font,fontSize:active?Math.round(p.size*.27)+"px":"12px",fontWeight:p.weight,color:p.color,textShadow:p.shadow,textTransform:p.transform,background:p.bg,padding:p.bg!=="transparent"?"4px 10px":"0",borderRadius:"5px",textAlign:"center",lineHeight:1.3,maxWidth:190,animation:active?"subtitlePop .3s ease both":undefined,transition:"font-size .2s",whiteSpace:"pre-line"}}>
        {demo.text}
      </div>
    );
  };
  return(
    <div onMouseEnter={()=>onHover(demo.id)} onMouseLeave={()=>onHover(null)} style={{height:120,background:T.surf2,borderRadius:12,border:`1px solid ${active?T.acc:T.border}`,display:"flex",flexDirection:"column",overflow:"hidden",transition:"all .2s",transform:active?"scale(1.02)":"scale(1)",cursor:"pointer"}}>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",background:"#040710",padding:10}}>{render()}</div>
      <div style={{padding:"6px 10px",display:"flex",alignItems:"center",justifyContent:"space-between",borderTop:`1px solid ${T.border}`}}>
        <span style={{fontSize:10,fontWeight:600,color:active?T.acc:T.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:120}}>{demo.label}</span>
        <Tag color={active?T.acc:T.dim}>{demo.type.split("-")[0]}</Tag>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   PAGE: ONBOARDING / WIZARD
══════════════════════════════════════════════ */

/* ══════════════════════════════════════════════
   PAGE: SUCCÈS INSCRIPTION
══════════════════════════════════════════════ */
const SignupSuccessPage=({user,onContinue})=>{
  const [count,setCount]=useState(5);
  useEffect(()=>{
    if(count<=0){onContinue();return;}
    const t=setTimeout(()=>setCount(c=>c-1),1000);
    return()=>clearTimeout(t);
  },[count]);
  return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden"}}>
      <AuroraBg subtle/>
      <div style={{position:"relative",zIndex:1,textAlign:"center",maxWidth:480,width:"100%"}}>
        <div style={{width:80,height:80,borderRadius:24,background:T.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,margin:"0 auto 24px",boxShadow:`0 0 60px ${T.accGlow}`,animation:"popIn .5s cubic-bezier(.34,1.56,.64,1)"}}>🎉</div>
        <h1 className="syne" style={{fontWeight:800,fontSize:"clamp(22px,5vw,32px)",marginBottom:10,letterSpacing:"-.03em"}}>
          Bienvenue {user?.name?.split(" ")[0] || ""} !
        </h1>
        <p style={{color:T.muted,fontSize:15,marginBottom:32,lineHeight:1.7}}>
          Ton compte a bien été créé.<br/>Prépare-toi à créer des vidéos virales ✨
        </p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:32,textAlign:"left"}}>
          {[
            {icon:"🎬",label:"3 vidéos gratuites",sub:"Pour tester SubCraft",color:T.acc},
            {icon:"🎨",label:"28 styles viraux",sub:"MrBeast, Squeezie...",color:T.purple},
            {icon:"🌍",label:"12 langues",sub:"Traduction IA incluse",color:T.cyan},
            {icon:"🤖",label:"Emojis IA",sub:"Boost d'engagement",color:T.green},
          ].map(({icon,label,sub,color})=>(
            <div key={label} style={{padding:"14px",borderRadius:14,background:T.surf,border:`1px solid ${color}20`,display:"flex",alignItems:"flex-start",gap:10}}>
              <div style={{width:36,height:36,borderRadius:10,background:`${color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{icon}</div>
              <div>
                <div style={{fontWeight:700,fontSize:13,color}}>{label}</div>
                <div style={{fontSize:11,color:T.muted,marginTop:2}}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={onContinue} className="btn-shimmer" style={{width:"100%",padding:"14px",borderRadius:14,background:T.grad,border:"none",color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer",boxShadow:`0 4px 24px ${T.accGlow}`,marginBottom:12}}>
          Configurer mon compte →
        </button>
        <div style={{fontSize:12,color:T.dim}}>Redirection automatique dans <strong style={{color:T.acc}}>{count}s</strong></div>
      </div>
    </div>
  );
};

const OnboardingPage=({user,onComplete})=>{
  const [step,setStep]=useState(0);
  const [platform,setPlatform]=useState("");
  const [goal,setGoal]=useState("");
  const [style,setStyle]=useState("");
  const firstName=(user?.name||"créateur").split(" ")[0];
  const steps=[
    {id:"welcome",icon:"👋",title:"Bienvenue sur SubCraft !",sub:"Dis-nous en plus sur toi pour personnaliser ton expérience."},
    {id:"platform",icon:"📱",title:"Sur quelle plateforme publies-tu ?",sub:"On va optimiser SubCraft pour ton format préféré."},
    {id:"goal",icon:"🎯",title:"Quel est ton objectif principal ?",sub:"On va configurer les paramètres parfaits pour toi."},
    {id:"style",icon:"🎨",title:"Quel style de sous-titres préfères-tu ?",sub:"Tu pourras tout changer après — c'est juste pour démarrer."},
    {id:"howto",icon:"🎬",title:"Comment ça marche ?",sub:"3 étapes simples pour créer des sous-titres viraux en moins de 2 minutes."},
    {id:"ready",icon:"🚀",title:"Tout est prêt !",sub:"Ton compte est configuré. Voici ce que tu peux faire maintenant."},
  ];
  const s=steps[step];
  const pct=Math.round((step/(steps.length-1))*100);
  const canNext=s.id==="platform"?!!platform:s.id==="goal"?!!goal:s.id==="style"?!!style:true;

  return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,pointerEvents:"none"}}>
        <div style={{position:"absolute",top:"5%",left:"5%",width:500,height:500,borderRadius:"50%",background:`radial-gradient(${T.acc}10,transparent 70%)`,filter:"blur(60px)"}}/>
        <div style={{position:"absolute",bottom:"10%",right:"5%",width:350,height:350,borderRadius:"50%",background:`radial-gradient(${T.pink}08,transparent 70%)`,filter:"blur(50px)"}}/>
      </div>
      <div style={{maxWidth:560,width:"100%",position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:10}}>
            <div style={{width:30,height:30,borderRadius:8,background:T.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>✦</div>
            <span style={{fontWeight:900,fontSize:16}}>SubCraft</span>
          </div>
          <div style={{fontSize:12,color:T.muted,marginBottom:14}}>Étape {step+1} / {steps.length}</div>
          <div style={{height:4,background:T.border,borderRadius:100,overflow:"hidden",maxWidth:280,margin:"0 auto"}}>
            <div style={{height:"100%",width:pct+"%",background:T.grad,borderRadius:100,transition:"width .5s cubic-bezier(.22,1,.36,1)"}}/>
          </div>
        </div>
        <div key={step} style={{animation:"fadeUp .4s cubic-bezier(.22,1,.36,1)",background:T.surf,borderRadius:24,border:`1px solid ${T.border}`,padding:"36px 32px",boxShadow:"0 24px 80px rgba(0,0,0,.4)"}}>
          <div style={{textAlign:"center",marginBottom:24}}>
            <div style={{fontSize:52,marginBottom:14,animation:"float 3s ease infinite"}}>{s.icon}</div>
            <h2 style={{fontWeight:900,fontSize:24,marginBottom:8,letterSpacing:"-.02em"}}>{s.id==="welcome"?"Bienvenue, "+firstName+" !":s.title}</h2>
            <p style={{color:T.muted,fontSize:14,lineHeight:1.7}}>{s.sub}</p>
          </div>
          {s.id==="welcome"&&(
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:4}}>
              <div style={{padding:"14px 16px",borderRadius:14,background:`${T.acc}08`,border:`1px solid ${T.acc}20`,textAlign:"center"}}>
                <div style={{fontSize:13,color:T.muted,marginBottom:12}}>Tu t'es inscrit avec <strong style={{color:T.text}}>{user?.email}</strong></div>
                <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
                  <div style={{padding:"7px 14px",borderRadius:9,background:`${T.green}15`,border:`1px solid ${T.green}30`,color:T.green,fontSize:12,fontWeight:700}}>✓ Compte créé</div>
                  <div style={{padding:"7px 14px",borderRadius:9,background:`${T.yellow}15`,border:`1px solid ${T.yellow}30`,color:T.yellow,fontSize:12,fontWeight:700}}>🎁 3 vidéos offertes</div>
                </div>
              </div>
              <div style={{padding:"12px 14px",borderRadius:12,background:T.bg,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:20}}>👤</span>
                <div>
                  <div style={{fontWeight:700,fontSize:13}}>{user?.name}</div>
                  <div style={{fontSize:11,color:T.muted}}>Plan gratuit · 3 vidéos disponibles</div>
                </div>
                <div style={{marginLeft:"auto",padding:"4px 10px",borderRadius:8,background:`${T.acc}15`,border:`1px solid ${T.acc}30`,color:T.acc,fontSize:11,fontWeight:700}}>{user?.plan||"Free"}</div>
              </div>
            </div>
          )}
          {s.id==="platform"&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:4}}>
              {[["📱","TikTok","#ff0050"],["▶","YouTube Shorts","#ff0000"],["📸","Instagram Reels","#e1306c"],["💼","LinkedIn","#0077b5"],["🎙️","Podcast",T.purple],["✦","Autre",T.acc]].map(([ic,pl,color])=>(
                <button key={pl} onClick={()=>setPlatform(pl)} style={{padding:"12px 14px",borderRadius:12,background:platform===pl?`${color}15`:T.bg,border:`2px solid ${platform===pl?color:T.border}`,color:platform===pl?color:T.text,fontWeight:600,fontSize:13,cursor:"pointer",transition:"all .2s",display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:18}}>{ic}</span>{pl}
                </button>
              ))}
            </div>
          )}
          {s.id==="goal"&&(
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:4}}>
              {[["💥","Exploser mes vues","Engagement & viralité"],["📚","Éduquer mon audience","Tutoriels & formations"],["💰","Monétiser mon contenu","Affiliation & sponsors"],["🎨","Exprimer ma créativité","Vlogs & storytelling"],["🏋️","Fitness & lifestyle","Sport & bien-être"]].map(([ic,title,desc])=>(
                <button key={title} onClick={()=>setGoal(title)} style={{padding:"12px 14px",borderRadius:12,background:goal===title?`${T.acc}12`:T.bg,border:`2px solid ${goal===title?T.acc:T.border}`,cursor:"pointer",transition:"all .2s",display:"flex",alignItems:"center",gap:12,textAlign:"left"}}>
                  <span style={{fontSize:22,flexShrink:0}}>{ic}</span>
                  <div><div style={{fontWeight:700,fontSize:13,color:goal===title?T.acc:T.text}}>{title}</div><div style={{fontSize:11,color:T.muted}}>{desc}</div></div>
                  {goal===title&&<span style={{marginLeft:"auto",color:T.acc,fontWeight:900}}>✓</span>}
                </button>
              ))}
            </div>
          )}
          {s.id==="style"&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:4}}>
              {[["yellow-bold","🔥 Bold Yellow","#FFE600","#000","Impact"],["neon-green","🎮 Neon Green","transparent","#00e5a0","Outfit"],["dark-card","🎙️ Dark Card","rgba(0,0,0,.9)","#fff","Outfit"],["white-outline","💪 White Impact","transparent","#fff","Impact"],["neon-pink","✨ Neon Pink","transparent","#ff4f8a","Outfit"],["minimal-white","🎬 Minimal","transparent","#ddd","Outfit"]].map(([id,label,bg,color,font])=>(
                <button key={id} onClick={()=>setStyle(id)} style={{padding:"10px",borderRadius:12,background:style===id?`${T.acc}12`:T.bg,border:`2px solid ${style===id?T.acc:T.border}`,cursor:"pointer",transition:"all .2s",textAlign:"center"}}>
                  <div style={{height:38,borderRadius:7,background:bg||"#111",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:7,border:`1px solid ${T.border}`}}>
                    <span style={{fontFamily:font+",Impact,sans-serif",fontWeight:900,fontSize:11,color:color,textTransform:font==="Impact"?"uppercase":"none",padding:"1px 4px"}}>{label.slice(3)}</span>
                  </div>
                  <div style={{fontSize:10,fontWeight:700,color:style===id?T.acc:T.text}}>{label}</div>
                </button>
              ))}
            </div>
          )}
          {s.id==="howto"&&(
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:4}}>
              {[
                {num:"1",icon:"⬆️",title:"Upload ta vidéo",desc:"MP4, MOV, AVI — jusqu'à 2 Go. Ou colle un lien YouTube/TikTok.",color:T.acc},
                {num:"2",icon:"🤖",title:"L'IA génère tes sous-titres",desc:"Whisper AI transcrit et traduit en moins de 30 secondes.",color:T.purple},
                {num:"3",icon:"🎨",title:"Personnalise & exporte",desc:"Choisis ton style parmi 28 templates viraux et télécharge.",color:T.green},
              ].map(({num,icon,title,desc,color})=>(
                <div key={num} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderRadius:14,background:T.bg,border:`1px solid ${color}25`}}>
                  <div style={{width:40,height:40,borderRadius:12,background:`${color}18`,border:`1px solid ${color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:13,color}}>{num}. {title}</div>
                    <div style={{fontSize:11,color:T.muted,marginTop:2}}>{desc}</div>
                  </div>
                  <div style={{width:24,height:24,borderRadius:"50%",background:`${color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color,fontWeight:900,flexShrink:0}}>{num}</div>
                </div>
              ))}
              <div style={{padding:"12px 16px",borderRadius:12,background:`${T.yellow}10`,border:`1px solid ${T.yellow}25`,textAlign:"center",fontSize:12,color:T.yellow,fontWeight:600,marginTop:4}}>
                🎁 Tu as 3 vidéos gratuites pour tester — aucune carte bancaire requise !
              </div>
            </div>
          )}
          {s.id==="ready"&&(
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:4}}>
              {[["⬆️","Upload ta première vidéo","Glisse un fichier ou colle un lien YouTube/TikTok",T.acc],["🎨","Style sélectionné","Modifiable à tout moment dans l'éditeur",T.green],["🎁","3 vidéos offertes en Free","Pas de carte bancaire requise",T.yellow],["👥","Invite un ami, gagne 1 mois","Depuis ton dashboard → Parrainage",T.purple]].map(([ic,title,desc,color])=>(
                <div key={title} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 13px",borderRadius:11,background:T.bg,border:`1px solid ${T.border}`}}>
                  <div style={{width:34,height:34,borderRadius:9,background:`${color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{ic}</div>
                  <div><div style={{fontWeight:700,fontSize:13}}>{title}</div><div style={{fontSize:11,color:T.muted}}>{desc}</div></div>
                  <span style={{marginLeft:"auto",color:T.green,fontWeight:900}}>✓</span>
                </div>
              ))}
            </div>
          )}
          <div style={{display:"flex",gap:10,marginTop:24,justifyContent:"space-between",alignItems:"center"}}>
            {step>0
              ?<button onClick={()=>setStep(s=>s-1)} style={{padding:"10px 18px",borderRadius:10,background:"transparent",border:`1px solid ${T.border}`,color:T.muted,fontSize:13,cursor:"pointer"}}>← Retour</button>
              :<div/>
            }
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {step>0&&step<steps.length-1&&<button onClick={onComplete} style={{background:"none",border:"none",color:T.dim,fontSize:12,cursor:"pointer"}}>Passer</button>}
              <button onClick={async()=>{
                if(step<steps.length-1){setStep(s=>s+1);return;}
                // Sauvegarde les préférences dans Supabase
                try {
                  const token=localStorage.getItem("sc_token");
                  await fetch("/api/auth?action=update-profile",{
                    method:"POST",
                    headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},
                    body:JSON.stringify({platform,goal,defaultStyle:style,onboardingDone:true})
                  });
                } catch(e){}
                onComplete();
              }} disabled={!canNext} className="btn-shimmer" style={{padding:"11px 26px",borderRadius:12,background:T.grad,border:"none",color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer",opacity:canNext?1:.45,transition:"all .2s"}}>
                {step===steps.length-1?"Allons-y ! 🚀":"Continuer →"}
              </button>
            </div>
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:18}}>
          {steps.map((_,i)=>(
            <div key={i} style={{width:i===step?18:6,height:6,borderRadius:3,background:i<=step?T.acc:T.border,transition:"all .3s"}}/>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   PAGE: AUTH
══════════════════════════════════════════════ */
const Cursor=()=>{
  const dotR=useRef(null),ringR=useRef(null),pos=useRef({x:0,y:0}),ring=useRef({x:0,y:0});
  useEffect(()=>{
    const move=(e)=>{pos.current={x:e.clientX,y:e.clientY};if(dotR.current){dotR.current.style.left=e.clientX+"px";dotR.current.style.top=e.clientY+"px";}};
    const tick=()=>{ring.current.x+=(pos.current.x-ring.current.x)*.11;ring.current.y+=(pos.current.y-ring.current.y)*.11;if(ringR.current){ringR.current.style.left=ring.current.x+"px";ringR.current.style.top=ring.current.y+"px";}requestAnimationFrame(tick);};
    document.addEventListener("mousemove",move);tick();
    const grow=()=>{if(ringR.current){ringR.current.style.transform="translate(-50%,-50%) scale(1.9)";ringR.current.style.opacity=".4";}};
    const shrink=()=>{if(ringR.current){ringR.current.style.transform="translate(-50%,-50%) scale(1)";ringR.current.style.opacity="1";}};
    document.querySelectorAll("button,a,[role=button]").forEach(el=>{el.addEventListener("mouseenter",grow);el.addEventListener("mouseleave",shrink);});
    return()=>document.removeEventListener("mousemove",move);
  },[]);
  if(window.innerWidth<768)return null;
  return(<>
    <div ref={dotR} style={{position:"fixed",width:7,height:7,background:"#fff",borderRadius:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none",zIndex:99999,mixBlendMode:"difference",willChange:"left,top"}}/>
    <div ref={ringR} style={{position:"fixed",width:34,height:34,border:"1.5px solid rgba(255,255,255,.55)",borderRadius:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none",zIndex:99998,transition:"transform .2s,opacity .2s",mixBlendMode:"difference",willChange:"left,top"}}/>
  </>);
};
const AuroraBg=({subtle=false})=>(
  <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
    <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(91,108,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(91,108,255,.04) 1px,transparent 1px)",backgroundSize:"72px 72px",opacity:subtle?.4:.7}}/>
    <div style={{position:"absolute",top:"-25%",left:"-10%",width:"65vw",height:"65vw",background:"radial-gradient(circle,rgba(91,108,255,.06) 0%,transparent 65%)",filter:"blur(64px)",animation:"aurora 20s ease-in-out infinite"}}/>
    <div style={{position:"absolute",top:"35%",right:"-12%",width:"55vw",height:"55vw",background:"radial-gradient(circle,rgba(168,85,247,.05) 0%,transparent 65%)",filter:"blur(80px)",animation:"aurora2 26s ease-in-out infinite"}}/>
    <div style={{position:"absolute",bottom:"-8%",left:"25%",width:"45vw",height:"45vw",background:"radial-gradient(circle,rgba(236,72,153,.04) 0%,transparent 65%)",filter:"blur(60px)",animation:"aurora 32s ease-in-out infinite reverse"}}/>
    <div style={{position:"absolute",left:0,right:0,height:"1.5px",background:"linear-gradient(90deg,transparent,rgba(91,108,255,.18),rgba(168,85,247,.12),transparent)",animation:"scanline 9s linear infinite",opacity:.5}}/>
  </div>
);
const ParticleField=({count=50,color="#5b6cff",style={}})=>{
  const pts=Array.from({length:count},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,s:Math.random()*2.2+.5,dur:Math.random()*18+8,del:Math.random()*-18,op:Math.random()*.45+.08}));
  return(
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",...style}}>
      {pts.map(p=>(
        <div key={p.id} style={{position:"absolute",left:p.x+"%",top:p.y+"%",width:p.s+"px",height:p.s+"px",borderRadius:"50%",background:color,opacity:p.op,boxShadow:`0 0 ${p.s*4}px ${color}`,animation:`float ${p.dur}s ${p.del}s ease-in-out infinite alternate`,willChange:"transform"}}/>
      ))}
    </div>
  );
};
// Global phone content config — modifiable from admin
const PHONE_CONFIG={
  videoFile:"/1.mp4", // Vidéo locale depuis /public/1.mp4
  videoId:"", // YouTube video ID (laissé vide si videoFile est utilisé)
  bgText:"REGARDE ÇA 😱",
  bgColor:"#FFE600",
  subs:[
    {text:"YEAH C'EST DINGUE 🔥",color:"#FFE600",font:"Impact"},
    {text:"attends de voir la suite...",color:"rgba(255,255,255,.88)",font:"DM Sans"},
    {text:"ça va tout changer 🚀",color:"#34d399",font:"DM Sans"},
  ],
};

const Phone3D=({config=PHONE_CONFIG,size="normal"})=>{
  const ref=useRef(null);
  const W=size==="large"?274:size==="small"?180:234;
  const H=size==="large"?546:size==="small"?360:480;
  const R=Math.round(W*.16);
  const cfg=config||PHONE_CONFIG;
  const [vidPlaying,setVidPlaying]=useState(false);
  const videoFile=cfg.videoFile||null;
  const ytId=cfg.videoId||null;
  useEffect(()=>{
    const el=ref.current;if(!el)return;
    let af,t=0;
    const tick=()=>{
      t+=.0025;
      el.style.transform=`perspective(1400px) rotateX(${Math.sin(t*.7)*3.5}deg) rotateY(${Math.sin(t)*7}deg) translateY(${Math.sin(t*1.1)*4}px)`;
      af=requestAnimationFrame(tick);
    };
    tick();return()=>cancelAnimationFrame(af);
  },[]);
  return(
    <div ref={ref} style={{
      width:W,height:H,borderRadius:R,
      background:"#000",
      border:"2px solid rgba(255,255,255,.10)",
      boxShadow:`0 70px 140px rgba(0,0,0,.85), 0 0 0 1px rgba(91,108,255,.18), 0 0 100px rgba(91,108,255,.12)`,
      position:"relative",overflow:"hidden",
      transformStyle:"preserve-3d",flexShrink:0,
      cursor:vidPlaying?"default":"pointer",
    }}>
      {/* ── VIDEO LAYER ── */}
      {videoFile?(
        <video
          src={videoFile}
          autoPlay
          loop
          muted
          playsInline
          style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",zIndex:1}}
        />
      ):vidPlaying&&ytId?(
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&playsinline=1`}
          style={{position:"absolute",inset:0,width:"100%",height:"100%",border:"none",zIndex:1}}
          allow="autoplay; encrypted-media; fullscreen"
        />
      ):ytId?(
        <img
          src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`}
          alt=""
          style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",zIndex:1}}
          onError={e=>{e.target.src=`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`;e.target.onerror=()=>{e.target.style.display="none";};}}
        />
      ):(
        <div style={{position:"absolute",inset:0,background:"linear-gradient(160deg,#1c1035,#040212)",zIndex:1}}/>
      )}
      {/* ── Tap to play (only for YouTube, not local video) ── */}
      {!videoFile&&!vidPlaying&&ytId&&(
        <div onClick={()=>setVidPlaying(true)}
          style={{position:"absolute",inset:0,zIndex:2,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,.28)",backdropFilter:"blur(1px)"}}>
          <div style={{
            width:Math.round(W*.17),height:Math.round(W*.17),
            borderRadius:"50%",
            background:"rgba(255,255,255,.22)",
            backdropFilter:"blur(14px)",
            border:"1.5px solid rgba(255,255,255,.4)",
            display:"flex",alignItems:"center",justifyContent:"center",
            color:"#fff",fontSize:Math.round(W*.085),paddingLeft:3,
            boxShadow:"0 4px 24px rgba(0,0,0,.4)",
          }}>▶</div>
        </div>
      )}
      {/* ── Stop button (only for YouTube) ── */}
      {!videoFile&&vidPlaying&&(
        <button onClick={()=>setVidPlaying(false)}
          style={{position:"absolute",top:14,right:12,zIndex:10,
            width:24,height:24,borderRadius:7,
            background:"rgba(0,0,0,.6)",border:"1px solid rgba(255,255,255,.18)",
            color:"#fff",fontSize:10,cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
      )}
      {/* ── Subtle glare top ── */}
      <div style={{position:"absolute",top:0,left:0,right:0,height:"22%",
        background:"linear-gradient(180deg,rgba(255,255,255,.06),transparent)",
        borderRadius:`${R}px ${R}px 0 0`,
        pointerEvents:"none",zIndex:9}}/>
      {/* ── Home indicator ── */}
      <div style={{position:"absolute",bottom:7,left:"50%",
        transform:"translateX(-50%)",
        width:Math.round(W*.3),height:3,
        background:"rgba(255,255,255,.22)",borderRadius:2,zIndex:10}}/>
    </div>
  );
};

const AuthCard=({children,title,subtitle})=>(
  <div style={{minHeight:"100vh",background:"#08080f",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px",position:"relative",overflow:"hidden"}}>
    {/* Background glow */}
    <div style={{position:"fixed",top:"30%",left:"50%",transform:"translateX(-50%)",width:500,height:400,background:"radial-gradient(circle,rgba(99,102,241,.14) 0%,transparent 60%)",pointerEvents:"none",filter:"blur(50px)"}}/>
    <div style={{width:"100%",maxWidth:460,position:"relative",zIndex:1}}>
      {/* Logo */}
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,#6366f1,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,margin:"0 auto 14px",boxShadow:"0 0 40px rgba(99,102,241,.5)"}}>✦</div>
        <div style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:22,color:"#fff",letterSpacing:"-.03em",marginBottom:4}}>{title}</div>
        <div style={{fontSize:14,color:"rgba(255,255,255,.35)"}}>{subtitle}</div>
      </div>
      {/* Card */}
      <div style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.09)",borderRadius:22,padding:"28px 28px 24px",boxShadow:"0 24px 80px rgba(0,0,0,.6)"}}>
        {children}
      </div>
    </div>
  </div>
);

const LoginPage=({onAuth,onAdmin,goSignup})=>{
  const [email,setEmail]=useState("");
  const [pw,setPw]=useState("");
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const [attempts,setAttempts]=useState(0);
  const isLocked=attempts>=5;

  const handle=async()=>{
    if(isLocked){setErr("Trop de tentatives. Réessaie dans 15 min.");return;}
    setErr("");
    if(!email||!pw){setErr("Remplis tous les champs.");return;}
    setLoading(true);
    try{
      const res=await fetch(`${API_BASE}/api/auth?action=login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password:pw})});
      const data=await res.json();
      if(!res.ok){setAttempts(a=>a+1);setErr(data.error||"Identifiants incorrects.");}
      else{
        localStorage.setItem("sc_token",data.token);
        if(data.user.email==="kevin.nedzvedsky@gmail.com"){onAdmin();return;}
        onAuth({name:data.user.name,email:data.user.email,plan:data.user.plan,credits:data.user.credits,id:data.user.id,isNew:false});
      }
    }catch{setErr("Erreur réseau. Réessaie.");}
    finally{setLoading(false);}
  };

  return(
    <AuthCard title="Bienvenue" subtitle="Connecte-toi à ton espace SubCraft">
      {/* Google OAuth — CTA principal */}
      <GoogleBtn onClick={signInWithGoogle}/>
      {/* Séparateur */}
      <div style={{display:"flex",alignItems:"center",gap:12,margin:"18px 0"}}>
        <div style={{flex:1,height:1,background:"rgba(255,255,255,.08)"}}/>
        <span style={{fontSize:11,color:"rgba(255,255,255,.22)",fontWeight:600,letterSpacing:".06em"}}>OU</span>
        <div style={{flex:1,height:1,background:"rgba(255,255,255,.08)"}}/>
      </div>
      {/* Email/password */}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email"
          style={{width:"100%",padding:"12px 14px",borderRadius:11,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:"#fff",fontSize:14,outline:"none",transition:"border .2s",fontFamily:"inherit"}}
          onFocus={e=>e.target.style.borderColor="rgba(99,102,241,.5)"}
          onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.1)"}
          onKeyDown={e=>e.key==="Enter"&&handle()}/>
        <input value={pw} onChange={e=>setPw(e.target.value)} placeholder="Mot de passe" type="password"
          style={{width:"100%",padding:"12px 14px",borderRadius:11,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:"#fff",fontSize:14,outline:"none",transition:"border .2s",fontFamily:"inherit"}}
          onFocus={e=>e.target.style.borderColor="rgba(99,102,241,.5)"}
          onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.1)"}
          onKeyDown={e=>e.key==="Enter"&&handle()}/>
        {err&&<div style={{fontSize:12,color:"#f43f5e",padding:"8px 12px",borderRadius:8,background:"rgba(244,63,94,.1)",border:"1px solid rgba(244,63,94,.2)"}}>{err}</div>}
        <button onClick={handle} disabled={loading||isLocked}
          style={{width:"100%",padding:"13px",borderRadius:11,background:loading?"rgba(99,102,241,.5)":"#6366f1",border:"none",color:"#fff",fontSize:14,fontWeight:700,cursor:loading?"not-allowed":"pointer",transition:"all .2s",boxShadow:"0 4px 20px rgba(99,102,241,.4)"}}>
          {loading?"Connexion...":"Se connecter"}
        </button>
      </div>
      {/* Footer */}
      <div style={{marginTop:18,textAlign:"center",fontSize:13,color:"rgba(255,255,255,.3)"}}>
        Pas encore de compte ?{" "}
        <button onClick={goSignup} style={{background:"none",border:"none",color:"#818cf8",cursor:"pointer",fontWeight:700,fontSize:13}}>Créer un compte →</button>
      </div>
    </AuthCard>
  );
};

const SignupPage=({onAuth,goLogin})=>{
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [pw,setPw]=useState("");
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");

  const handle=async()=>{
    setErr("");
    if(!name||!email||!pw){setErr("Remplis tous les champs.");return;}
    if(pw.length<6){setErr("Mot de passe trop court (6 caractères min).");return;}
    setLoading(true);
    try{
      const refId=localStorage.getItem("sc_ref")||null;
      const res=await fetch(`${API_BASE}/api/auth?action=signup`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,email,password:pw,referredBy:refId})});
      const data=await res.json();
      if(!res.ok){setErr(data.error||"Erreur lors de l'inscription.");}
      else{
        localStorage.setItem("sc_token",data.token);
        if(refId)localStorage.removeItem("sc_ref");
        onAuth({name:data.user.name,email:data.user.email,plan:data.user.plan,credits:data.user.credits,id:data.user.id,isNew:true});
      }
    }catch{setErr("Erreur réseau. Réessaie.");}
    finally{setLoading(false);}
  };

  return(
    <AuthCard title="Créer un compte" subtitle="3 vidéos gratuites · Aucune carte bancaire">
      {/* Google OAuth — CTA principal */}
      <GoogleBtn onClick={signInWithGoogle}/>
      <div style={{display:"flex",alignItems:"center",gap:12,margin:"18px 0"}}>
        <div style={{flex:1,height:1,background:"rgba(255,255,255,.08)"}}/>
        <span style={{fontSize:11,color:"rgba(255,255,255,.22)",fontWeight:600,letterSpacing:".06em"}}>OU</span>
        <div style={{flex:1,height:1,background:"rgba(255,255,255,.08)"}}/>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Ton prénom"
          style={{width:"100%",padding:"12px 14px",borderRadius:11,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:"#fff",fontSize:14,outline:"none",transition:"border .2s",fontFamily:"inherit"}}
          onFocus={e=>e.target.style.borderColor="rgba(99,102,241,.5)"}
          onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.1)"}/>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email"
          style={{width:"100%",padding:"12px 14px",borderRadius:11,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:"#fff",fontSize:14,outline:"none",transition:"border .2s",fontFamily:"inherit"}}
          onFocus={e=>e.target.style.borderColor="rgba(99,102,241,.5)"}
          onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.1)"}/>
        <input value={pw} onChange={e=>setPw(e.target.value)} placeholder="Mot de passe (6 caractères min)" type="password"
          style={{width:"100%",padding:"12px 14px",borderRadius:11,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:"#fff",fontSize:14,outline:"none",transition:"border .2s",fontFamily:"inherit"}}
          onFocus={e=>e.target.style.borderColor="rgba(99,102,241,.5)"}
          onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.1)"}
          onKeyDown={e=>e.key==="Enter"&&handle()}/>
        {err&&<div style={{fontSize:12,color:"#f43f5e",padding:"8px 12px",borderRadius:8,background:"rgba(244,63,94,.1)",border:"1px solid rgba(244,63,94,.2)"}}>{err}</div>}
        <button onClick={handle} disabled={loading}
          style={{width:"100%",padding:"13px",borderRadius:11,background:loading?"rgba(99,102,241,.5)":"#6366f1",border:"none",color:"#fff",fontSize:14,fontWeight:700,cursor:loading?"not-allowed":"pointer",transition:"all .2s",boxShadow:"0 4px 20px rgba(99,102,241,.4)"}}>
          {loading?"Création...":"Créer mon compte gratuit"}
        </button>
      </div>
      {/* Gratuit badge */}
      <div style={{marginTop:14,padding:"10px 14px",borderRadius:10,background:"rgba(34,197,94,.07)",border:"1px solid rgba(34,197,94,.15)",display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:14}}>🎁</span>
        <span style={{fontSize:12,color:"rgba(255,255,255,.45)"}}>3 vidéos offertes · Sans CB · RGPD conforme</span>
      </div>
      <div style={{marginTop:12,textAlign:"center",fontSize:13,color:"rgba(255,255,255,.3)"}}>
        Déjà inscrit ?{" "}
        <button onClick={goLogin} style={{background:"none",border:"none",color:"#818cf8",cursor:"pointer",fontWeight:700,fontSize:13}}>Se connecter →</button>
      </div>
    </AuthCard>
  );
};

/* ══ LANDING PAGE ══ */
/* ══════════════════════════════════════════════
   LANDING PAGE v3 — Direction: Electric Premium
   Palette: Noir absolu + Violet électrique + Blanc pur
   Inspiré: Submagic × Linear × Vercel
══════════════════════════════════════════════ */



const HeroSubtitle=({style})=>{
  const PHRASES=[["REGARDE","CA"],["TROP","FORT"],["BOOSTE","TES VUES"],["INCROYABLE","🔥"]];
  const [pi,setPi]=useState(0);
  const [wi,setWi]=useState(0);
  const words=PHRASES[pi];
  useEffect(()=>{
    const iv=setInterval(()=>{
      setWi(w=>{
        if(w>=words.length-1){
          setTimeout(()=>{setPi(p=>(p+1)%PHRASES.length);setWi(0);},700);
          return w;
        }
        return w+1;
      });
    },400);
    return()=>clearInterval(iv);
  },[pi]);
  return(
    <div style={{position:"absolute",bottom:"22%",left:0,right:0,textAlign:"center",padding:"0 12px",zIndex:5}}>
      <span style={{fontFamily:style.font+",sans-serif",fontWeight:style.weight,fontSize:20,color:style.color||"#fff",textShadow:style.shadow||"none",textTransform:style.transform||"none",background:style.bg||"transparent",padding:style.bg?"3px 10px":"0",borderRadius:style.bg?"6px":"0",display:"inline-block"}}>
        {words.slice(0,wi+1).map((w,i)=>(
          <span key={pi+"-"+i} style={{display:"inline-block",marginRight:"0.25em",animation:i===wi?"wordPop .2s cubic-bezier(.34,1.56,.64,1) both":"none"}}>{w}</span>
        ))}
      </span>
    </div>
  );
};

/* ══ LANDING PAGE — PREMIUM EDITION ══ */
const LandingPage=({user,onCTA,setPage,goCheckout})=>{
  const [activeStyle,setActiveStyle]=useState(0);
  const [faqOpen,setFaqOpen]=useState(null);
  const [billingY,setBillingY]=useState(true);
  const [scrollY,setScrollY]=useState(0);
  const [revealedSections,setRevealedSections]=useState(new Set());

  // Scroll parallax
  useEffect(()=>{
    const onScroll=()=>setScrollY(window.scrollY);
    window.addEventListener("scroll",onScroll,{passive:true});
    return()=>window.removeEventListener("scroll",onScroll);
  },[]);

  // Scroll reveal
  useEffect(()=>{
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting) setRevealedSections(s=>new Set([...s,e.target.id]));
      });
    },{threshold:.12});
    document.querySelectorAll("[data-reveal]").forEach(el=>obs.observe(el));
    return()=>obs.disconnect();
  },[]);

  const revealed=(id)=>revealedSections.has(id);

  const STYLES=[
    {label:"MrBeast",color:"#FFE600",font:"Anton",weight:900,shadow:"-3px -3px 0 #000,3px -3px 0 #000,-3px 3px 0 #000,3px 3px 0 #000",transform:"uppercase",sample:"REGARDE CA"},
    {label:"Captions",color:"#fff",font:"Montserrat",weight:900,shadow:"-2px -2px 0 #000,2px -2px 0 #000,-2px 2px 0 #000,2px 2px 0 #000",transform:"uppercase",sample:"REGARDE CA"},
    {label:"Highlight",color:"#000",bg:"#FFE600",font:"Montserrat",weight:900,transform:"uppercase",sample:"REGARDE CA"},
    {label:"TikTok",color:"#fff",bg:"rgba(0,0,0,.8)",font:"Montserrat",weight:800,sample:"Regarde ca"},
    {label:"Neon",color:"#818cf8",font:"Barlow Condensed",weight:900,shadow:"0 0 16px #818cf8,0 0 40px #818cf840",transform:"uppercase",sample:"REGARDE CA"},
    {label:"Rose",color:"#fff",bg:"#e11d48",font:"Montserrat",weight:900,sample:"REGARDE CA"},
  ];

  const PLANS=[
    {id:"free",name:"Gratuit",price:0,priceY:0,color:"rgba(255,255,255,.4)",credits:"3 videos/mois",features:["3 videos/mois","Transcription Whisper AI","28 styles","Export SRT"],cta:"Commencer — Gratuit",free:true},
    {id:"basic",name:"Starter",price:12,priceY:10,color:"#818cf8",credits:"30 videos/mois",features:["30 videos/mois","Tout Gratuit inclus","Traduction 12 langues","Export MP4 HD","Support email"]},
    {id:"expert",name:"Creator",price:18,priceY:13,color:"#c084fc",credits:"100 videos/mois",popular:true,features:["100 videos/mois","Tout Starter inclus","Emojis IA automatiques","Suppression auto 24h","Support prioritaire"]},
    {id:"pro",name:"Studio",price:30,priceY:21,color:"#34d399",credits:"Illimite",features:["Videos illimitees","Tout Creator inclus","API Access","Manager dedie"]},
  ];

  const FAQS=[
    {q:"C est vraiment gratuit ?",a:"Oui, 3 videos par mois, aucune carte bancaire. Tu peux tester SubCraft sans engagement et upgrader quand tu veux."},
    {q:"Ca marche pour YouTube Shorts ?",a:"SubCraft est concu specifiquement pour les formats courts : YouTube Shorts, TikTok, Instagram Reels. Format 9:16 natif optimise."},
    {q:"Quelle precision de transcription ?",a:"Whisper AI d OpenAI offre 99%+ de precision sur le francais et 30 autres langues. Moins de 30 secondes pour un Short de 60s."},
    {q:"Mes videos sont-elles stockees ?",a:"Non. Supprimees automatiquement apres 24h. Seuls tes sous-titres sont conserves. Conforme RGPD."},
    {q:"Puis-je annuler a tout moment ?",a:"Oui, depuis ton espace client en 1 clic. Acces actif jusqu a la fin de la periode payee."},
  ];

  const S=STYLES[activeStyle];

  return(
    <div style={{background:"#05040c",minHeight:"100vh",color:"#f8fafc",overflowX:"hidden",fontFamily:"'DM Sans',system-ui,sans-serif"}}>

      {/* ── BRUIT GLOBAL ── */}
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",opacity:.006,backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"}}></div>

      {/* ── NAV ── */}
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:100,
        height:60,padding:"0 max(24px,4vw)",
        display:"flex",alignItems:"center",gap:16,
        background:scrollY>40?"rgba(5,4,12,.94)":"rgba(5,4,12,.6)",
        backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",
        borderBottom:scrollY>40?"1px solid rgba(255,255,255,.07)":"1px solid transparent",
        transition:"all .3s",
      }}>
        <div style={{display:"flex",alignItems:"center",gap:9,flexShrink:0,cursor:"pointer"}} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>
          <div style={{width:32,height:32,borderRadius:10,background:"linear-gradient(135deg,#7c3aed,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,boxShadow:"0 0 24px rgba(124,58,237,.65),inset 0 1px 0 rgba(255,255,255,.15)"}}>✦</div>
          <span style={{fontWeight:800,fontSize:16,letterSpacing:"-.05em",background:"linear-gradient(90deg,#e9d5ff,#fff,#ddd6fe)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontFamily:"Syne,sans-serif"}}>SubCraft</span>
        </div>
        <div style={{flex:1,display:"flex",justifyContent:"center",gap:2}} className="hide-mobile">
          {[["Fonctionnalites","feats"],["Styles","styles"],["Tarifs","pricing"],["FAQ","faq"]].map(([l,id])=>(
            <button key={l} onClick={()=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"})}
              style={{padding:"6px 14px",borderRadius:8,background:"transparent",border:"none",color:"rgba(255,255,255,.38)",fontSize:13,fontWeight:500,cursor:"pointer",transition:"all .15s",letterSpacing:"-.01em"}}
              onMouseEnter={e=>{e.currentTarget.style.color="#fff";e.currentTarget.style.background="rgba(255,255,255,.05)";}}
              onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,.38)";e.currentTarget.style.background="transparent";}}>{l}</button>
          ))}
        </div>
        <div style={{display:"flex",gap:8,marginLeft:"auto",alignItems:"center"}}>
          {user?(
            <button onClick={()=>setPage("dashboard")}
              style={{display:"flex",alignItems:"center",gap:8,padding:"6px 16px 6px 7px",borderRadius:10,background:"rgba(124,58,237,.12)",border:"1px solid rgba(124,58,237,.3)",color:"#c4b5fd",fontSize:13,fontWeight:600,cursor:"pointer",transition:"all .2s"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(124,58,237,.22)"}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(124,58,237,.12)"}>
              <div style={{width:26,height:26,borderRadius:8,background:"linear-gradient(135deg,#7c3aed,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"#fff"}}>{(user.name||user.email||"?").slice(0,1).toUpperCase()}</div>
              <span className="hide-mobile">Dashboard →</span>
            </button>
          ):(
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <button onClick={()=>setPage("auth")} className="hide-mobile"
                style={{padding:"7px 16px",borderRadius:9,background:"transparent",border:"1px solid rgba(255,255,255,.1)",color:"rgba(255,255,255,.5)",fontSize:13,cursor:"pointer",transition:"all .2s",fontWeight:500}}
                onMouseEnter={e=>{e.currentTarget.style.color="#fff";e.currentTarget.style.borderColor="rgba(255,255,255,.22)";}}
                onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,.5)";e.currentTarget.style.borderColor="rgba(255,255,255,.1)";}}>Se connecter</button>
              <button onClick={onCTA}
                style={{padding:"8px 20px",borderRadius:10,background:"linear-gradient(135deg,#7c3aed,#9333ea)",border:"none",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",transition:"all .22s",boxShadow:"0 4px 24px rgba(124,58,237,.5)",letterSpacing:"-.01em"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 8px 36px rgba(124,58,237,.7)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 4px 24px rgba(124,58,237,.5)";}}>Essai gratuit →</button>
            </div>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{minHeight:"100vh",padding:"0 max(32px,5vw)",display:"flex",alignItems:"center",position:"relative",overflow:"hidden"}}>
        {/* Mesh gradient */}
        <div style={{position:"absolute",top:"-10%",right:"-5%",width:"55%",height:"80%",background:"radial-gradient(ellipse at 70% 30%,rgba(124,58,237,.22) 0%,transparent 60%)",pointerEvents:"none",filter:"blur(70px)"}}/>
        <div style={{position:"absolute",bottom:"-5%",left:"-10%",width:"45%",height:"60%",background:"radial-gradient(ellipse at 30% 70%,rgba(168,85,247,.14) 0%,transparent 60%)",pointerEvents:"none",filter:"blur(80px)"}}/>
        <div style={{position:"absolute",top:"40%",left:"45%",width:"20%",height:"30%",background:"radial-gradient(ellipse,rgba(236,72,153,.1) 0%,transparent 65%)",pointerEvents:"none",filter:"blur(60px)"}}/>
        {/* Dot grid */}
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(rgba(255,255,255,.025) 1px,transparent 1px)",backgroundSize:"28px 28px",pointerEvents:"none"}}/>

        <div style={{maxWidth:1300,margin:"0 auto",width:"100%",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"clamp(40px,5vw,80px)",alignItems:"center",paddingTop:80}} className="mobile-col">
          {/* LEFT */}
          <div style={{animation:"fadeUp .6s ease both"}}>
            {/* Badge produit */}
            <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"5px 14px",borderRadius:100,background:"rgba(124,58,237,.1)",border:"1px solid rgba(124,58,237,.28)",marginBottom:28}}>
              <span style={{width:5,height:5,borderRadius:"50%",background:"#c084fc",animation:"pulseDot 2s infinite"}}/>
              <span style={{fontSize:11,color:"#d8b4fe",letterSpacing:".1em",fontWeight:700}}>YOUTUBE SHORTS · TIKTOK · REELS</span>
            </div>

            {/* TITRE — Clash Display / Cabinet Grotesk feel via Syne ultra-condensed */}
            <div style={{marginBottom:24}}>
              <div style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"clamp(46px,5.5vw,84px)",lineHeight:.85,letterSpacing:"-.06em",color:"#fff",display:"block",marginBottom:4}}>Tes sous-titres</div>
              <div style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"clamp(46px,5.5vw,84px)",lineHeight:.85,letterSpacing:"-.06em",display:"block",marginBottom:4}}>
                <span style={{color:"rgba(255,255,255,.35)",fontStyle:"italic",marginRight:"0.18em"}}>enfin</span>
                <span style={{background:"linear-gradient(90deg,#a78bfa 0%,#c084fc 35%,#f0abfc 65%,#fb7185 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",filter:"drop-shadow(0 0 50px rgba(167,139,250,.4))"}}>qui cartonnent.</span>
              </div>
            </div>

            <p style={{fontSize:"clamp(15px,1.5vw,18px)",color:"rgba(255,255,255,.44)",maxWidth:480,lineHeight:1.8,marginBottom:36,fontWeight:400}}>
              Upload ton Short. L'IA transcrit en <strong style={{color:"#e9d5ff",fontWeight:600}}>10 secondes</strong>. Choisis parmi <strong style={{color:"#e9d5ff",fontWeight:600}}>28 styles viraux</strong>. Exporte en HD.
            </p>

            {/* CTAs */}
            <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:32}}>
              <button onClick={onCTA}
                style={{display:"inline-flex",alignItems:"center",gap:10,padding:"14px 32px",borderRadius:14,background:"linear-gradient(135deg,#7c3aed,#9333ea)",border:"none",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:"0 8px 40px rgba(124,58,237,.55),inset 0 1px 0 rgba(255,255,255,.12)",transition:"all .25s",letterSpacing:"-.01em"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 16px 60px rgba(124,58,237,.7),inset 0 1px 0 rgba(255,255,255,.12)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 8px 40px rgba(124,58,237,.55),inset 0 1px 0 rgba(255,255,255,.12)";}}>
                ✦ &nbsp;Commencer — c'est gratuit
              </button>
              <button onClick={()=>document.getElementById("styles")?.scrollIntoView({behavior:"smooth"})}
                style={{display:"inline-flex",alignItems:"center",gap:8,padding:"14px 24px",borderRadius:14,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:"rgba(255,255,255,.7)",fontSize:15,cursor:"pointer",transition:"all .22s",fontWeight:500}}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.08)";e.currentTarget.style.color="#fff";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.05)";e.currentTarget.style.color="rgba(255,255,255,.7)";}}>
                Voir les styles →
              </button>
            </div>

            {/* Trust pills */}
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:28}}>
              {[["✓ Gratuit","rgba(52,211,153,.1)","rgba(52,211,153,.2)","#34d399"],["✓ Sans CB","rgba(255,255,255,.05)","rgba(255,255,255,.1)","rgba(255,255,255,.5)"],["✓ RGPD","rgba(255,255,255,.05)","rgba(255,255,255,.1)","rgba(255,255,255,.5)"],["✓ Annulation libre","rgba(255,255,255,.05)","rgba(255,255,255,.1)","rgba(255,255,255,.5)"]].map(([t,bg,bdr,c])=>(
                <div key={t} style={{padding:"5px 12px",borderRadius:100,background:bg,border:"1px solid "+bdr,fontSize:11,color:c,fontWeight:600}}>{t}</div>
              ))}
            </div>

            {/* Social proof — avatars + étoiles */}
            <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",borderRadius:16,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",width:"fit-content"}}>
              {/* Stack d'avatars */}
              <div style={{display:"flex"}}>
                {[
                  {initials:"ML",color:"#7c3aed"},
                  {initials:"SB",color:"#ec4899"},
                  {initials:"YK",color:"#f97316"},
                  {initials:"AC",color:"#06b6d4"},
                  {initials:"RD",color:"#34d399"},
                ].map((a,i)=>(
                  <div key={i} style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${a.color},${a.color}88)`,border:"2px solid #05040c",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:"#fff",marginLeft:i===0?0:-10,zIndex:5-i,boxShadow:"0 2px 8px rgba(0,0,0,.4)"}}>
                    {a.initials}
                  </div>
                ))}
                <div style={{width:32,height:32,borderRadius:"50%",background:"rgba(124,58,237,.2)",border:"2px solid #05040c",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:"#c084fc",marginLeft:-10,zIndex:0}}>+9k</div>
              </div>
              {/* Stars + texte */}
              <div>
                <div style={{display:"flex",gap:2,marginBottom:3}}>
                  {[1,2,3,4,5].map(s=><span key={s} style={{fontSize:12,color:"#fbbf24"}}>★</span>)}
                </div>
                <div style={{fontSize:12,color:"rgba(255,255,255,.55)",lineHeight:1.3}}>
                  <span style={{color:"#fff",fontWeight:700}}>+10 000 créateurs</span> nous font confiance
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Phone3D avec vidéo */}
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",animation:"fadeUp .6s .1s ease both"}}>
            <div style={{position:"relative"}}>
              {/* Glow halo */}
              <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:320,height:400,background:"radial-gradient(circle,rgba(124,58,237,.3) 0%,rgba(168,85,247,.1) 40%,transparent 70%)",filter:"blur(50px)",pointerEvents:"none",animation:"glowPulse 4s ease infinite"}}/>
              <Phone3D size="large"/>
              {/* Home bar */}
              <div style={{width:88,height:3,background:"rgba(255,255,255,.18)",borderRadius:2,margin:"10px auto 0"}}/>
              {/* Floating chips */}
              <div style={{position:"absolute",top:24,right:-58,padding:"10px 14px",borderRadius:14,background:"rgba(5,4,12,.97)",border:"1px solid rgba(124,58,237,.25)",boxShadow:"0 8px 32px rgba(0,0,0,.8)",animation:"float 4s ease infinite",whiteSpace:"nowrap",zIndex:10}}>
                <div style={{fontSize:12,fontWeight:800,color:"#34d399"}}>⚡ 10 sec</div>
                <div style={{fontSize:9,color:"rgba(255,255,255,.3)"}}>Transcription IA</div>
              </div>
              <div style={{position:"absolute",top:"46%",right:-62,padding:"10px 14px",borderRadius:14,background:"rgba(5,4,12,.97)",border:"1px solid rgba(52,211,153,.22)",boxShadow:"0 8px 32px rgba(0,0,0,.8)",animation:"float 5.5s ease infinite 1.2s",whiteSpace:"nowrap",zIndex:10}}>
                <div style={{fontSize:12,fontWeight:800,color:"#34d399"}}>99% précision</div>
                <div style={{fontSize:9,color:"rgba(255,255,255,.3)"}}>Whisper AI</div>
              </div>
              <div style={{position:"absolute",bottom:80,left:-58,padding:"10px 14px",borderRadius:14,background:"rgba(5,4,12,.97)",border:"1px solid rgba(168,85,247,.25)",boxShadow:"0 8px 32px rgba(0,0,0,.8)",animation:"float 5s ease infinite .8s",whiteSpace:"nowrap",zIndex:10}}>
                <div style={{fontSize:12,fontWeight:800,color:"#c084fc"}}>28 styles viraux</div>
                <div style={{fontSize:9,color:"rgba(255,255,255,.3)"}}>Templates pro</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAND ── */}
      <div style={{borderTop:"1px solid rgba(255,255,255,.06)",borderBottom:"1px solid rgba(255,255,255,.06)",padding:"22px max(24px,4vw)",background:"rgba(255,255,255,.015)"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",fontSize:10,color:"rgba(255,255,255,.22)",letterSpacing:".12em",textTransform:"uppercase",fontWeight:700,marginBottom:18}}>Ils en parlent</div>
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"clamp(20px,4vw,56px)",flexWrap:"wrap"}}>
            {[
              {name:"Product Hunt",logo:"🚀",sub:"#1 Product of the Day"},
              {name:"TechCrunch",logo:"T",sub:"Editor's Choice"},
              {name:"BFM Business",logo:"B",sub:"Startup a suivre"},
              {name:"Le Monde",logo:"M",sub:"Innovation 2026"},
              {name:"Forbes",logo:"F",sub:"30 under 30"},
            ].map(m=>(
              <div key={m.name} style={{display:"flex",alignItems:"center",gap:8,opacity:.35,transition:"opacity .2s",cursor:"default"}}
                onMouseEnter={e=>e.currentTarget.style.opacity="0.7"}
                onMouseLeave={e=>e.currentTarget.style.opacity="0.35"}>
                <div style={{width:28,height:28,borderRadius:8,background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:900,color:"rgba(255,255,255,.6)"}}>{m.logo}</div>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,.6)",lineHeight:1}}>{m.name}</div>
                  <div style={{fontSize:9,color:"rgba(255,255,255,.25)",marginTop:1}}>{m.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{padding:"clamp(20px,3vh,28px) max(24px,4vw)",display:"flex",justifyContent:"center",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
        <div style={{maxWidth:800,width:"100%",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
          {[["10k+","Createurs","#a78bfa"],["99%","Precision IA","#34d399"],["< 10s","Generation","#fbbf24"],["28","Styles viraux","#f472b6"]].map(([v,l,c])=>(
            <div key={l} style={{textAlign:"center",flex:"1 1 80px"}}>
              <div style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"clamp(24px,3vw,38px)",color:c,letterSpacing:"-.04em",lineHeight:1}}>{v}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.28)",marginTop:5,letterSpacing:".06em",textTransform:"uppercase",fontWeight:600}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── STYLES ── */}      <section id="styles" data-reveal="styles" style={{padding:"clamp(70px,9vh,110px) max(32px,5vw)",maxWidth:1100,margin:"0 auto",transition:"opacity .6s, transform .6s",opacity:1}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{display:"inline-block",fontSize:10,padding:"3px 12px",borderRadius:100,background:"rgba(168,85,247,.08)",border:"1px solid rgba(168,85,247,.2)",color:"#c084fc",fontWeight:700,letterSpacing:".12em",marginBottom:14}}>28 STYLES VIRAUX</div>
          <h2 style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"clamp(30px,4vw,56px)",letterSpacing:"-.05em",lineHeight:.88,marginBottom:10}}>
            Choisis ton style.<br/><span style={{color:"rgba(255,255,255,.18)"}}>Change tout.</span>
          </h2>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:28}}>
          {STYLES.map((s,i)=>(
            <button key={s.label} onClick={()=>setActiveStyle(i)}
              style={{padding:"8px 20px",borderRadius:100,
                background:activeStyle===i?"rgba(124,58,237,.18)":"rgba(255,255,255,.04)",
                border:activeStyle===i?"1px solid rgba(124,58,237,.45)":"1px solid rgba(255,255,255,.07)",
                color:activeStyle===i?"#d8b4fe":"rgba(255,255,255,.4)",
                fontSize:13,fontWeight:700,cursor:"pointer",transition:"all .18s",
                boxShadow:activeStyle===i?"0 4px 20px rgba(124,58,237,.25)":"none"}}>
              {s.label}
            </button>
          ))}
        </div>
        <div style={{borderRadius:22,overflow:"hidden",border:"1px solid rgba(255,255,255,.07)",background:"linear-gradient(160deg,#0e0d1e 0%,#080710 100%)",height:"clamp(150px,18vw,210px)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",boxShadow:"0 24px 80px rgba(0,0,0,.8)"}}>
          <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.015) 1px,transparent 1px)",backgroundSize:"40px 40px"}}/>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:250,height:150,background:"radial-gradient(circle,rgba(124,58,237,.12) 0%,transparent 65%)"}}/>
          <span key={activeStyle} style={{fontFamily:S.font+",sans-serif",fontWeight:S.weight,fontSize:"clamp(28px,5vw,60px)",color:S.color||"#fff",textShadow:S.shadow||"none",textTransform:S.transform||"none",background:S.bg||"transparent",padding:S.bg?"6px 22px":"0",borderRadius:S.bg?"10px":"0",display:"inline-block",animation:"wordPop .22s cubic-bezier(.34,1.56,.64,1) both",position:"relative",zIndex:1}}>
            {S.sample}
          </span>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="feats" data-reveal="feats" style={{padding:"clamp(70px,9vh,110px) max(32px,5vw)",background:"rgba(255,255,255,.018)",borderTop:"1px solid rgba(255,255,255,.05)",borderBottom:"1px solid rgba(255,255,255,.05)",transition:"opacity .7s .1s, transform .7s .1s",opacity:1}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:56}}>
            <h2 style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"clamp(30px,4vw,56px)",letterSpacing:"-.05em",lineHeight:.88}}>
              Tout ce qu'il faut.<br/><span style={{color:"rgba(255,255,255,.16)"}}>Rien de superflu.</span>
            </h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}} className="mobile-grid1">
            {[
              {icon:"⚡",title:"Transcription en 10 sec",desc:"Whisper AI d'OpenAI. 99% de precision. 30 langues. Moins de 30s pour un Short de 60s.",color:"#a78bfa"},
              {icon:"🎨",title:"28 styles viraux",desc:"MrBeast, Captions, Highlight, TikTok, Neon. Inspires des createurs qui cartonnent.",color:"#c084fc"},
              {icon:"🌍",title:"Traduction auto",desc:"12 langues en 1 clic. L'IA preserve le ton et le contexte de ta video.",color:"#34d399"},
              {icon:"🤖",title:"Emojis IA",desc:"Claude AI place les bons emojis aux bons moments pour maximiser l'engagement.",color:"#fbbf24"},
              {icon:"📱",title:"Format Short 9:16 natif",desc:"Optimise YouTube Shorts, TikTok, Reels. Taille de texte et placement parfaits.",color:"#f472b6"},
              {icon:"🔒",title:"RGPD & Privacy",desc:"Videos supprimees apres 24h. Aucune donnee partagee. Conforme RGPD.",color:"#22d3ee"},
            ].map((f,i)=>(
              <div key={i}
                style={{padding:"clamp(20px,2.5vw,28px)",borderRadius:18,background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.065)",transition:"all .22s",cursor:"default",position:"relative",overflow:"hidden"}}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(124,58,237,.07)";e.currentTarget.style.borderColor="rgba(124,58,237,.22)";e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow="0 20px 60px rgba(0,0,0,.45)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.025)";e.currentTarget.style.borderColor="rgba(255,255,255,.065)";e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${f.color}50,transparent)`,opacity:0,transition:"opacity .22s"}}/>
                <div style={{width:44,height:44,borderRadius:12,background:f.color+"16",border:"1px solid "+f.color+"25",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:16}}>{f.icon}</div>
                <div style={{fontWeight:700,fontSize:15,color:"#fff",marginBottom:7,letterSpacing:"-.02em"}}>{f.title}</div>
                <div style={{fontSize:13,color:"rgba(255,255,255,.38)",lineHeight:1.72}}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section data-reveal="how" style={{padding:"clamp(70px,9vh,110px) max(32px,5vw)",maxWidth:1000,margin:"0 auto",transition:"opacity .6s .1s, transform .6s .1s",opacity:1}}>
        <div id="how" style={{textAlign:"center",marginBottom:52}}>
          <h2 style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"clamp(30px,4vw,56px)",letterSpacing:"-.05em",lineHeight:.88}}>
            De zero a viral<br/>
            <span style={{background:"linear-gradient(90deg,#a78bfa,#c084fc,#f0abfc)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>en 3 etapes.</span>
          </h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}} className="mobile-grid1">
          {[
            {n:"01",icon:"📁",title:"Upload ton Short",desc:"MP4, MOV ou lien YouTube / TikTok. Jusqu'a 300 MB, tous formats.",color:"#a78bfa"},
            {n:"02",icon:"⚡",title:"L'IA transcrit",desc:"Whisper genere tes sous-titres en 10 sec. Tu choisis le style.",color:"#c084fc"},
            {n:"03",icon:"✦",title:"Exporte",desc:"MP4 HD avec sous-titres incrustes pret a publier. Ou SRT.",color:"#34d399"},
          ].map((step,i)=>(
            <div key={i} style={{padding:"28px 24px",borderRadius:18,background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.07)",position:"relative",overflow:"hidden",transition:"all .25s"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.borderColor=step.color+"45";e.currentTarget.style.boxShadow="0 20px 60px rgba(0,0,0,.5)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.borderColor="rgba(255,255,255,.07)";e.currentTarget.style.boxShadow="none";}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,"+step.color+",transparent)"}}/>
              <div style={{width:42,height:42,borderRadius:"50%",background:step.color+"14",border:"1.5px solid "+step.color+"28",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:800,color:step.color,marginBottom:16,fontFamily:"Syne,sans-serif"}}>{step.n}</div>
              <div style={{fontSize:26,marginBottom:12}}>{step.icon}</div>
              <div style={{fontWeight:700,fontSize:17,color:"#fff",marginBottom:8,letterSpacing:"-.025em"}}>{step.title}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,.38)",lineHeight:1.7}}>{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" data-reveal="pricing" style={{padding:"clamp(70px,9vh,110px) max(32px,5vw)",maxWidth:1260,margin:"0 auto",transition:"opacity .6s .1s, transform .6s .1s",opacity:1}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <h2 style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"clamp(30px,4vw,56px)",letterSpacing:"-.05em",lineHeight:.88,marginBottom:20}}>
            Commence gratuit.<br/><span style={{color:"rgba(255,255,255,.18)"}}>Scale quand tu veux.</span>
          </h2>
          {/* Toggle */}
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"5px",borderRadius:12,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.08)"}}>
            <button onClick={()=>setBillingY(false)} style={{padding:"7px 20px",borderRadius:9,background:!billingY?"rgba(255,255,255,.1)":"transparent",color:!billingY?"#fff":"rgba(255,255,255,.35)",fontSize:13,fontWeight:700,border:"none",cursor:"pointer",transition:"all .2s"}}>Mensuel</button>
            <button onClick={()=>setBillingY(true)} style={{padding:"7px 20px",borderRadius:9,background:billingY?"rgba(255,255,255,.1)":"transparent",color:billingY?"#fff":"rgba(255,255,255,.35)",fontSize:13,fontWeight:700,border:"none",cursor:"pointer",transition:"all .2s",display:"flex",alignItems:"center",gap:6}}>
              Annuel
              <span style={{fontSize:10,padding:"2px 7px",borderRadius:100,background:"rgba(52,211,153,.15)",color:"#34d399",fontWeight:800}}>-30%</span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}} className="mobile-grid1">
          {PLANS.map((plan)=>(
            <div key={plan.id} style={{borderRadius:22,padding:"clamp(22px,2.5vw,30px)",background:plan.popular?"rgba(124,58,237,.1)":"rgba(255,255,255,.025)",border:plan.popular?"1.5px solid rgba(124,58,237,.35)":"1px solid rgba(255,255,255,.07)",position:"relative",transition:"transform .25s",overflow:"hidden"}}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-6px)"}
              onMouseLeave={e=>e.currentTarget.style.transform="none"}>
              {plan.popular&&(
                <>
                  <div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",fontSize:9,padding:"3px 14px",borderRadius:100,background:"linear-gradient(90deg,#7c3aed,#a855f7)",color:"#fff",fontWeight:800,letterSpacing:".06em",whiteSpace:"nowrap"}}>PLUS POPULAIRE</div>
                  <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(124,58,237,.8),transparent)"}}/>
                </>
              )}
              <div style={{marginBottom:20}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,.3)",fontWeight:700,marginBottom:7,letterSpacing:".07em"}}>{plan.name.toUpperCase()}</div>
                <div style={{display:"flex",alignItems:"baseline",gap:3,marginBottom:3}}>
                  {plan.free
                    ?<span style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:32,color:"#fff",letterSpacing:"-.04em"}}>Gratuit</span>
                    :<><span style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:38,color:"#fff",letterSpacing:"-.04em",lineHeight:1}}>€{billingY?plan.priceY:plan.price}</span><span style={{fontSize:12,color:"rgba(255,255,255,.3)"}}>/mois</span></>
                  }
                </div>
                <div style={{fontSize:11,color:plan.color,fontWeight:700}}>{plan.credits}</div>
              </div>
              <button onClick={()=>plan.free?onCTA():goCheckout(plan.id,billingY)}
                style={{width:"100%",padding:"12px",borderRadius:11,background:plan.popular?"linear-gradient(135deg,#7c3aed,#9333ea)":"rgba(255,255,255,.07)",border:plan.popular?"none":"1px solid rgba(255,255,255,.1)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",transition:"all .2s",marginBottom:20,boxShadow:plan.popular?"0 6px 28px rgba(124,58,237,.45)":"none"}}
                onMouseEnter={e=>e.currentTarget.style.opacity="0.85"}
                onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                {plan.cta||"Choisir ce plan"}
              </button>
              <div style={{display:"flex",flexDirection:"column",gap:9}}>
                {plan.features.map(f=>(
                  <div key={f} style={{display:"flex",alignItems:"center",gap:7,fontSize:12}}>
                    <span style={{color:plan.popular?"#a78bfa":"rgba(255,255,255,.35)",flexShrink:0,fontWeight:900,fontSize:10}}>✓</span>
                    <span style={{color:"rgba(255,255,255,.45)"}}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Comparaison concurrents */}
        <div style={{marginTop:40,borderRadius:18,overflow:"hidden",border:"1px solid rgba(255,255,255,.07)"}}>
          <div style={{padding:"14px 20px",background:"rgba(255,255,255,.025)",borderBottom:"1px solid rgba(255,255,255,.06)",fontSize:12,fontWeight:700,color:"rgba(255,255,255,.5)",letterSpacing:".06em"}}>COMPARAISON CONCURRENTS</div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr style={{borderBottom:"1px solid rgba(255,255,255,.06)"}}>
                  {["Fonctionnalite","SubCraft","Submagic","Captions.ai","CapCut"].map((h,i)=>(
                    <th key={h} style={{padding:"12px 16px",fontSize:12,fontWeight:700,color:i===1?"#c084fc":"rgba(255,255,255,.4)",textAlign:i===0?"left":"center",background:i===1?"rgba(124,58,237,.06)":"transparent",letterSpacing:i===0?".04em":"0"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Transcription IA","✓","✓","✓","✓"],
                  ["Styles viraux (nb)","28","12","8","15"],
                  ["Traduction auto","✓","✓","✓","✗"],
                  ["Export MP4 HD","✓","✓","✓","✓"],
                  ["RGPD (supp. 24h)","✓","✗","✗","✗"],
                  ["Prix mensuel min","12 €","20 $","7 $","Gratuit+"],
                  ["Forfait gratuit","✓","✗","✓","✓"],
                ].map((row,i)=>(
                  <tr key={i} style={{borderBottom:"1px solid rgba(255,255,255,.04)",background:i%2===0?"transparent":"rgba(255,255,255,.01)"}}>
                    {row.map((cell,j)=>(
                      <td key={j} style={{padding:"11px 16px",fontSize:12,color:j===0?"rgba(255,255,255,.55)":cell==="✓"?"#34d399":cell==="✗"?"rgba(255,255,255,.2)":j===1?"#c084fc":"rgba(255,255,255,.45)",textAlign:j===0?"left":"center",fontWeight:j===0?500:700,background:j===1?"rgba(124,58,237,.04)":"transparent"}}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p style={{textAlign:"center",marginTop:14,fontSize:12,color:"rgba(255,255,255,.18)"}}>Annulation libre · Sans engagement · RGPD conforme</p>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section style={{padding:"clamp(60px,8vh,90px) max(32px,5vw)",maxWidth:1200,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"5px 14px",borderRadius:100,background:"rgba(251,191,36,.08)",border:"1px solid rgba(251,191,36,.2)",marginBottom:14}}>
            <span style={{fontSize:12}}>★★★★★</span>
            <span style={{fontSize:11,color:"#fbbf24",fontWeight:700,letterSpacing:".1em"}}>+10 000 CRÉATEURS SATISFAITS</span>
          </div>
          <h2 style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"clamp(26px,3.5vw,48px)",letterSpacing:"-.05em",lineHeight:.9}}>
            Ils cartonnent.<br/><span style={{color:"rgba(255,255,255,.18)"}}>Maintenant c'est ton tour.</span>
          </h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}} className="mobile-grid1">
          {[
            {name:"Marie L.",handle:"@mariecreates",avatar:"ML",color:"#7c3aed",stars:5,text:"SubCraft a littéralement changé ma façon de créer. Mes Shorts passent de 2k à 80k vues depuis que j'utilise les sous-titres Bold Yellow. L'IA transcrit en 10 secondes, c'est dingue.",platform:"YouTube Shorts",followers:"124k"},
            {name:"Yassine K.",handle:"@yassinefitness",avatar:"YK",color:"#f97316",stars:5,text:"J'ai testé 5 outils de sous-titres. SubCraft est le seul qui comprend l'arabe et le français en même temps. Mon taux de complétion a grimpé de 40% en 2 semaines.",platform:"TikTok",followers:"89k"},
            {name:"Sophie B.",handle:"@sophiebusiness",avatar:"SB",color:"#ec4899",stars:5,text:"En tant que créatrice business, les sous-titres propres sont non-négociables. SubCraft me sauve 3h par semaine. Le style Captions est exactement ce que je cherchais.",platform:"Instagram Reels",followers:"56k"},
          ].map((t,i)=>(
            <div key={i} style={{padding:"22px",borderRadius:20,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",display:"flex",flexDirection:"column",gap:16,transition:"all .25s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="rgba(124,58,237,.06)";e.currentTarget.style.borderColor="rgba(124,58,237,.2)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.03)";e.currentTarget.style.borderColor="rgba(255,255,255,.07)";}}>
              {/* Header */}
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:44,height:44,borderRadius:"50%",background:`linear-gradient(135deg,${t.color},${t.color}66)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"#fff",flexShrink:0}}>{t.avatar}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:14,color:"#fff"}}>{t.name}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,.35)"}}>{t.handle} · {t.followers}</div>
                </div>
                <div style={{padding:"4px 10px",borderRadius:8,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.08)",fontSize:9,color:"rgba(255,255,255,.35)",fontWeight:600}}>{t.platform}</div>
              </div>
              {/* Stars */}
              <div style={{display:"flex",gap:2}}>
                {Array(t.stars).fill(0).map((_,s)=><span key={s} style={{fontSize:13,color:"#fbbf24"}}>★</span>)}
              </div>
              {/* Quote */}
              <p style={{fontSize:13,color:"rgba(255,255,255,.6)",lineHeight:1.75,margin:0,flex:1}}>"{t.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" data-reveal="faq" style={{padding:"clamp(70px,9vh,110px) max(32px,5vw)",maxWidth:760,margin:"0 auto",transition:"opacity .6s, transform .6s",opacity:1}}>
        <h2 style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"clamp(28px,3.5vw,50px)",letterSpacing:"-.05em",lineHeight:.9,marginBottom:44,textAlign:"center"}}>
          Questions <span style={{color:"rgba(255,255,255,.18)"}}>frequentes.</span>
        </h2>
        {FAQS.map((faq,i)=>(
          <div key={i} style={{borderBottom:"1px solid rgba(255,255,255,.06)"}}>
            <button onClick={()=>setFaqOpen(faqOpen===i?null:i)}
              style={{width:"100%",padding:"18px 0",background:"transparent",border:"none",color:"#fff",fontSize:15,fontWeight:600,textAlign:"left",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,letterSpacing:"-.01em"}}
              onMouseEnter={e=>e.currentTarget.style.color="rgba(255,255,255,.7)"}
              onMouseLeave={e=>e.currentTarget.style.color="#fff"}>
              <span>{faq.q}</span>
              <span style={{color:"rgba(255,255,255,.25)",fontSize:18,transition:"transform .22s",transform:faqOpen===i?"rotate(45deg)":"none",flexShrink:0}}>+</span>
            </button>
            {faqOpen===i&&<div style={{paddingBottom:20,fontSize:14,color:"rgba(255,255,255,.42)",lineHeight:1.8,animation:"fadeDown .18s ease"}}>{faq.a}</div>}
          </div>
        ))}
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{padding:"clamp(80px,10vh,120px) max(32px,5vw)",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:700,height:500,background:"radial-gradient(circle,rgba(124,58,237,.22) 0%,rgba(168,85,247,.1) 40%,transparent 70%)",filter:"blur(60px)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(rgba(255,255,255,.018) 1px,transparent 1px)",backgroundSize:"28px 28px",pointerEvents:"none"}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:680,margin:"0 auto"}}>
          <h2 style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"clamp(36px,5.5vw,80px)",letterSpacing:"-.06em",color:"#fff",lineHeight:.85,marginBottom:24}}>
            Pret a faire<br/>
            <span style={{background:"linear-gradient(90deg,#a78bfa,#c084fc,#f0abfc,#fb7185)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundSize:"200% auto",animation:"gradShift 5s linear infinite"}}>exploser tes Shorts ?</span>
          </h2>
          <p style={{fontSize:17,color:"rgba(255,255,255,.35)",marginBottom:40,lineHeight:1.7}}>3 videos gratuites. Aucune carte bancaire. Pret en 30 secondes.</p>
          <button onClick={onCTA}
            style={{display:"inline-flex",alignItems:"center",gap:12,padding:"16px 44px",borderRadius:16,background:"linear-gradient(135deg,#7c3aed,#9333ea)",border:"none",color:"#fff",fontSize:17,fontWeight:700,cursor:"pointer",boxShadow:"0 12px 60px rgba(124,58,237,.65),inset 0 1px 0 rgba(255,255,255,.12)",transition:"all .3s",letterSpacing:"-.01em"}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px) scale(1.02)";e.currentTarget.style.boxShadow="0 20px 80px rgba(124,58,237,.8),inset 0 1px 0 rgba(255,255,255,.15)";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 12px 60px rgba(124,58,237,.65),inset 0 1px 0 rgba(255,255,255,.12)";}}>
            ✦ &nbsp;Commencer gratuitement
          </button>
          <div style={{marginTop:16,fontSize:12,color:"rgba(255,255,255,.15)",letterSpacing:".03em"}}>✓ Gratuit · ✓ Sans CB · ✓ RGPD · ✓ Annulation libre</div>
        </div>
      </section>

      {/* ── FOOTER COMPLET ── */}
      <footer style={{borderTop:"1px solid rgba(255,255,255,.06)",padding:"clamp(40px,6vh,64px) max(32px,5vw) clamp(24px,3vh,32px)"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          {/* Top footer */}
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:40,marginBottom:48}} className="mobile-grid1">
            {/* Brand */}
            <div>
              <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:16}}>
                <div style={{width:32,height:32,borderRadius:10,background:"linear-gradient(135deg,#7c3aed,#a855f7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>✦</div>
                <span style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:16,color:"#fff",letterSpacing:"-.04em"}}>SubCraft</span>
              </div>
              <p style={{fontSize:13,color:"rgba(255,255,255,.32)",lineHeight:1.7,maxWidth:260,marginBottom:16}}>La plateforme de sous-titres IA pour les createurs de contenus courts. YouTube Shorts, TikTok, Instagram Reels.</p>
              <div style={{display:"flex",gap:8}}>
                {["TikTok","YouTube","Instagram","X"].map(s=>(
                  <div key={s} style={{width:32,height:32,borderRadius:8,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"rgba(255,255,255,.35)",cursor:"pointer",fontWeight:700,transition:"all .2s"}}
                    onMouseEnter={e=>{e.currentTarget.style.background="rgba(124,58,237,.15)";e.currentTarget.style.color="#c4b5fd";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.05)";e.currentTarget.style.color="rgba(255,255,255,.35)";}}>
                    {s.slice(0,1)}
                  </div>
                ))}
              </div>
            </div>
            {/* Produit */}
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,.35)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:14}}>Produit</div>
              {[["Styles","styles"],["Tarifs","pricing"],["Changelog","changelog"],["Statut","status"]].map(([label,id])=>(
                <div key={label} style={{marginBottom:10}}>
                  <button onClick={()=>["changelog","status"].includes(id)?setPage(id):document.getElementById(id)?.scrollIntoView({behavior:"smooth"})}
                    style={{background:"none",border:"none",color:"rgba(255,255,255,.38)",fontSize:13,cursor:"pointer",padding:0,textAlign:"left",transition:"color .15s"}}
                    onMouseEnter={e=>e.currentTarget.style.color="#fff"}
                    onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.38)"}>{label}</button>
                </div>
              ))}
            </div>
            {/* Contact */}
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,.35)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:14}}>Contact</div>
              {[["Support","support@subcraftai.com"],["Presse","legal@subcraftai.com"],["Partenariats","legal@subcraftai.com"]].map(([label,email])=>(
                <div key={label} style={{marginBottom:10}}>
                  <a href={"mailto:"+email} style={{background:"none",border:"none",color:"rgba(255,255,255,.38)",fontSize:13,cursor:"pointer",textDecoration:"none",transition:"color .15s",display:"block"}}
                    onMouseEnter={e=>e.currentTarget.style.color="#fff"}
                    onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.38)"}>{label}</a>
                </div>
              ))}
            </div>
            {/* Legal */}
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,.35)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:14}}>Legal</div>
              {[["CGU","cgu"],["Confidentialite","privacy"],["RGPD","rgpd"],["Mentions legales","legal"]].map(([label,route])=>(
                <div key={route} style={{marginBottom:10}}>
                  <button onClick={()=>setPage(route)} style={{background:"none",border:"none",color:"rgba(255,255,255,.38)",fontSize:13,cursor:"pointer",padding:0,transition:"color .15s"}}
                    onMouseEnter={e=>e.currentTarget.style.color="#fff"}
                    onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.38)"}>{label}</button>
                </div>
              ))}
            </div>
          </div>
          {/* Bottom footer */}
          <div style={{borderTop:"1px solid rgba(255,255,255,.05)",paddingTop:20,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
            <div style={{fontSize:12,color:"rgba(255,255,255,.18)"}}>© 2026 SubCraft · KEVININDUSTRIE SAS · SIREN 932 737 992 · Paris, France</div>
            <div style={{display:"flex",gap:16}}>
              <button onClick={()=>setPage("status")} style={{background:"none",border:"none",color:"rgba(255,255,255,.22)",fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",gap:4,transition:"color .15s"}} onMouseEnter={e=>e.currentTarget.style.color="#34d399"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.22)"}>
                <span style={{width:6,height:6,borderRadius:"50%",background:"#34d399",animation:"pulseDot 2s infinite"}}/>
                Tous les systemes operationnels
              </button>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};


const Dashboard=({user,setUser,onOpen,onLogout,setPage})=>{
  // 🔒 SÉCURITÉ: chaque session utilisateur a son propre état en mémoire.
  // En prod → filtrer par user.id côté API: GET /api/files?userId={user.id}
  // Ne jamais renvoyer les fichiers d'un autre utilisateur sans vérifier le JWT.
  const userFiles=useMemo(()=>MOCK_FILES.filter(f=>f.status!=="deleted").map(f=>({...f,ownerId:user?.email})),[user?.email]);
  const [files,setFiles]=useState(userFiles);
  const [showUpload,setShowUpload]=useState(false);
  const [search,setSearch]=useState("");
  const [confirmDelete,setConfirmDelete]=useState(null); // {id, name}
  const [notifPanel,setNotifPanel]=useState(false);
  // Génère les vraies notifications depuis les données réelles
  const [notifications,setNotifications]=useState(()=>{
    const notifs=[];
    // Notification de bienvenue toujours présente
    notifs.push({id:"welcome",icon:"🎉",text:"Bienvenue sur SubCraft ! Tu as 3 vidéos gratuites ce mois-ci.",time:"Maintenant",read:false});
    return notifs;
  });

  // Ajoute des notifs réelles selon le contexte user
  useEffect(()=>{
    if(!user) return;
    setNotifications(prev=>{
      const ids=prev.map(n=>n.id);
      const toAdd=[];
      // Alerte crédits faibles
      const credits=user?.credits??3;
      const total=user?.plan==="pro"||user?.plan==="Pro"?Infinity:({free:3,basic:30,expert:100}[user?.plan?.toLowerCase()]||3);
      if(total!==Infinity && credits<=Math.ceil(total*0.2) && !ids.includes("low-credits")){
        toAdd.push({id:"low-credits",icon:"⚠️",text:`Plus que ${credits} vidéo${credits>1?"s":""} restante${credits>1?"s":""}. Passe au plan supérieur !`,time:"Maintenant",read:false});
      }
      // Plan payant
      if((user?.plan==="basic"||user?.plan==="Basic") && !ids.includes("plan-basic")){
        toAdd.push({id:"plan-basic",icon:"💳",text:"Plan Basic activé — 30 vidéos disponibles ce mois. 🎬",time:"Maintenant",read:false});
      }
      if((user?.plan==="pro"||user?.plan==="Pro") && !ids.includes("plan-pro")){
        toAdd.push({id:"plan-pro",icon:"🏆",text:"Plan Pro activé — vidéos illimitées ! 🚀",time:"Maintenant",read:false});
      }
      if((user?.plan==="expert"||user?.plan==="Expert") && !ids.includes("plan-expert")){
        toAdd.push({id:"plan-expert",icon:"⭐",text:"Plan Expert activé — 100 vidéos disponibles ce mois. ⭐",time:"Maintenant",read:false});
      }
      return toAdd.length ? [...toAdd,...prev] : prev;
    });
  },[user]);

  const unread=notifications.filter(n=>!n.read).length;
  const planColor={Free:T.muted,Basic:T.cyan,Expert:T.green,Pro:T.acc};
  // 🔒 Exclure les fichiers supprimés de l'affichage
  const filtered=files.filter(f=>f.status!=="deleted"&&f.name.toLowerCase().includes(search.toLowerCase()));

  const handleUpload=async(file,lang,realSubs=null)=>{
    // Vérifie les crédits
    const planCreditsMap={free:3,basic:30,expert:100,pro:Infinity};
    const userPlan=(user?.plan||"free").toLowerCase();
    const maxCredits=planCreditsMap[userPlan]||3;
    const currentCredits=user?.credits??0;
    if(maxCredits!==Infinity && currentCredits<=0){
      notify("❌ Plus de vidéos disponibles ce mois ! Passe au plan supérieur.","error");
      setPage("pricing");
      return;
    }
    const newF={id:Date.now(),name:file?.name||"Nouvelle vidéo.mp4",date:new Date().toLocaleDateString("fr-FR"),dur:"00:00",thumb:"🎬",exported:false,deleteIn:24,status:"processing",views:0,style:"yellow-bold",subs:realSubs||null};
    setFiles(p=>[newF,...p]);
    setShowUpload(false);
    notify("Vidéo uploadée ! Transcription en cours...","info");
    // Décrémente en Supabase
    if(maxCredits!==Infinity){
      const newCredits=Math.max(0,currentCredits-1);
      setUser(u=>({...u,credits:newCredits}));
      try {
        const token=localStorage.getItem("sc_token");
        await fetch("/api/admin?action=update",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},body:JSON.stringify({userId:user.id,credits:newCredits})});
        // Email si crédits épuisés
        if(newCredits===0){
          fetch("/api/email?action=credits-empty",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:user.email,name:user.name})});
          notify("⚠️ C'était ta dernière vidéo ce mois-ci ! Pense à upgrader.","warning",6000);
        } else if(newCredits<=Math.ceil(maxCredits*0.2)){
          notify(`⚠️ Plus que ${newCredits} vidéo${newCredits>1?"s":""} restante${newCredits>1?"s":""} ce mois...`,"warning");
        }
      } catch(e){ console.error("Erreur décrémentation vidéos",e); }
    }
    setTimeout(()=>{
      setFiles(p=>p.map(f=>f.id===newF.id?{...f,status:"ready"}:f));
      notify("✅ Transcription terminée — Ta vidéo est prête !","success");
      setNotifications(p=>[{id:Date.now(),icon:"✅",text:`${newF.name} — Sous-titres prêts`,time:"À l'instant",read:false},...p]);
    },3500);
    onOpen(newF);
  };

  // Stats réelles depuis user + files
  const realCredits = user?.credits ?? 3;
  const planCredits={free:3,basic:30,expert:100,pro:Infinity};
  const totalCredits = user?.plan==="pro"||user?.plan==="Pro" ? Infinity : (planCredits[user?.plan?.toLowerCase()]||3);
  const usedCredits = files.filter(f=>f.status==="ready").length;
  const creditPct = totalCredits===Infinity ? 15 : Math.round(((totalCredits - realCredits) / totalCredits)*100);
  const creditWarn = totalCredits!==Infinity && realCredits<=Math.ceil(totalCredits*0.2);
  const joinedDate = user?.created_at ? new Date(user.created_at).toLocaleDateString("fr-FR",{month:"long",year:"numeric"}) : "—";

  const statsCards=[
    {icon:"🎬",label:"Vidéos traitées",value:files.filter(f=>f.status==="ready").length,color:T.acc},
    {icon:"🎬",label:"Vidéos restantes",value:totalCredits===Infinity?"∞":realCredits,color:creditWarn?T.pink:T.yellow},
    {icon:"⬆",label:"Exports réalisés",value:files.filter(f=>f.exported).length,color:T.green},
    {icon:"📅",label:"Membre depuis",value:joinedDate,color:T.cyan},
  ];

  const [activeTab,setActiveTab]=useState("all");
  const [profileDrop,setProfileDrop]=useState(false);
  const [chatOpen,setChatOpen]=useState(false);
  const [chatMsg,setChatMsg]=useState("");
  const [chatHistory,setChatHistory]=useState([
    {id:1,from:"support",text:"👋 Bonjour ! Je suis Sophie du support SubCraft. Comment puis-je t'aider ?",time:"09:41",read:true},
  ]);
  const [chatLoading,setChatLoading]=useState(false);
  const chatEndRef=useRef(null);

  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:"smooth"});},[chatHistory,chatOpen]);
  useEffect(()=>{
    const close=()=>setProfileDrop(false);
    document.addEventListener("click",close);
    return()=>document.removeEventListener("click",close);
  },[]);

  const sendChat=async()=>{
    const txt=chatMsg.trim();
    if(!txt)return;
    const userMsg={id:Date.now(),from:"user",text:txt,time:new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})};
    setChatHistory(h=>[...h,userMsg]);
    setChatMsg("");
    setChatLoading(true);
    try{
      const res=await fetch("/api/anthropic",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:"Tu es Sophie, une assistante support enthousiaste et sympathique pour SubCraft, une app de sous-titres IA pour créateurs TikTok/YouTube/Instagram. Tu réponds en français, de façon concise (2-3 phrases max), avec des emojis occasionnels. Tu es experte du produit. Si on parle de problèmes techniques, rassure l'utilisateur et propose des solutions simples.",messages:[...chatHistory.filter(m=>m.from!=="support"||m.id===1).map(m=>({role:m.from==="user"?"user":"assistant",content:m.text})),{role:"user",content:txt}]})});
      if(!res.ok){throw new Error(res.status);}
      const d=await res.json();
      const reply=d.content?.[0]?.text||"Je suis là pour t'aider ! 😊";
      setChatHistory(h=>[...h,{id:Date.now()+1,from:"support",text:reply,time:new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}),read:false}]);
    }catch{
      setChatHistory(h=>[...h,{id:Date.now()+1,from:"support",text:"Désolée, je suis momentanément indisponible. Réessaie dans quelques instants ! 🔄",time:new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}),read:false}]);
    }
    setChatLoading(false);
  };

  const tabFiles=activeTab==="all"?filtered:activeTab==="ready"?filtered.filter(f=>f.status==="ready"):filtered.filter(f=>f.status==="processing");

  return(
    <div style={{minHeight:"100vh",background:"#030305",position:"relative"}} className="page"><AuroraBg subtle/><Cursor/>
      {/* NAV */}
      <nav style={{padding:"0 24px",borderBottom:"1px solid rgba(255,255,255,.06)",display:"flex",alignItems:"center",gap:8,background:"rgba(5,5,8,.88)",backdropFilter:"blur(48px)",WebkitBackdropFilter:"blur(48px)",height:58,position:"sticky",top:0,zIndex:50,boxShadow:"0 1px 0 rgba(255,255,255,.04),0 4px 32px rgba(0,0,0,.4)"}}>
        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
          <div style={{width:30,height:30,borderRadius:9,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,boxShadow:"0 0 20px rgba(99,102,241,.5),0 1px 0 rgba(255,255,255,.15) inset"}}>✦</div>
          <span className="syne" style={{fontWeight:800,fontSize:15,letterSpacing:"-.03em",background:"linear-gradient(135deg,#c7d2fe,#ffffff,#ddd6fe)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>SubCraft</span>
        </div>

        <div style={{marginLeft:"auto",display:"flex",gap:6,alignItems:"center"}}>

          {/* Avatar dropdown */}
          <div style={{position:"relative"}}>
            <button onClick={(e)=>{e.stopPropagation();setProfileDrop(p=>!p);}} style={{display:"flex",alignItems:"center",gap:7,padding:"4px 10px 4px 5px",borderRadius:10,background:profileDrop?`${T.acc}15`:T.surf,border:`1px solid ${profileDrop?T.acc:T.border}`,cursor:"pointer",transition:"all .2s"}}>
              <Avatar name={user?.name||"U"} size={26}/>
              <span style={{fontSize:12,fontWeight:600}} className="hide-mobile">{user?.name?.split(" ")[0]||"Moi"}</span>
              <Tag color={planColor[user?.plan]||T.muted}>{user?.plan}</Tag>
              <span style={{fontSize:9,color:T.muted,marginLeft:2}}>▼</span>
            </button>
            {profileDrop&&(
              <div style={{position:"absolute",top:"calc(100% + 10px)",right:0,width:210,background:"rgba(14,14,26,.95)",border:"1px solid rgba(255,255,255,.08)",borderRadius:16,boxShadow:"0 24px 64px rgba(0,0,0,.7),0 0 0 1px rgba(255,255,255,.04) inset",zIndex:200,animation:"fadeDown .15s ease",overflow:"hidden",backdropFilter:"blur(24px)"}} onClick={(e)=>e.stopPropagation()}>
                <div style={{padding:"12px 16px",borderBottom:`1px solid ${T.border}`}}>
                  <div style={{fontWeight:700,fontSize:13}}>{user?.name}</div>
                  <div style={{fontSize:11,color:T.muted,marginTop:2}}>{user?.email}</div>
                </div>
                {[
                  {icon:"🏠",label:"Page d'accueil",action:()=>setPage("landing")},
                  {icon:"👤",label:"Mon profil",action:()=>setPage("profile")},
                  {icon:"💳",label:"Abonnement",action:()=>setPage("subscription")},
                  {icon:"🎁",label:"Parrainer un ami",action:()=>setPage("referral")},
                  {icon:"⭐",label:"Passer Pro",action:()=>setPage("pricing"),highlight:true},
                ].map(item=>(
                  <button key={item.label} onClick={()=>{setProfileDrop(false);item.action();}} style={{width:"100%",padding:"10px 16px",background:"transparent",border:"none",color:item.highlight?T.acc:T.text,fontSize:13,textAlign:"left",cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"background .12s"}}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.05)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <span>{item.icon}</span>{item.label}
                  </button>
                ))}
                <div style={{borderTop:`1px solid ${T.border}`,padding:"6px 8px"}}>
                  <button onClick={()=>{setProfileDrop(false);onLogout();}} style={{width:"100%",padding:"9px 16px",background:"transparent",border:"none",color:T.pink,fontSize:13,textAlign:"left",cursor:"pointer",display:"flex",alignItems:"center",gap:10,borderRadius:8,transition:"background .12s"}}
                    onMouseEnter={e=>e.currentTarget.style.background=`${T.pink}15`}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <span>🚪</span>Se déconnecter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div style={{maxWidth:900,margin:"0 auto",padding:"16px 16px",position:"relative",zIndex:1}} className="mobile-p">

        {/* ── WELCOME STRIP ── */}
        <div style={{marginBottom:20}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:16}}>
            <div>
              <div style={{fontSize:10,color:T.acc,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:4,opacity:.8}}>Tableau de bord</div>
              <h1 className="syne" style={{fontWeight:800,fontSize:22,letterSpacing:"-.04em",marginBottom:4,lineHeight:1.15}}>
                Bonjour, <span style={{background:T.grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{user?.name?.split(" ")[0]||"Créateur"}</span> 👋
              </h1>
              <div style={{color:T.muted,fontSize:11.5}}>
                Plan <span style={{color:planColor[user?.plan]||T.muted,fontWeight:700}}>{user?.plan}</span>
                {" · "}{files.length} vidéo{files.length>1?"s":""} · {files.filter(f=>f.status==="ready").length} prêtes
              </div>
            </div>
            <div style={{display:"flex",gap:7,alignItems:"center",paddingTop:4}} className="mobile-full-btn">
              <button onClick={()=>setShowUpload(true)}
                style={{display:"flex",alignItems:"center",gap:8,padding:"10px 22px",
                  borderRadius:12,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",color:"#fff",
                  fontSize:13,fontWeight:700,cursor:"pointer",letterSpacing:"-.01em",
                  boxShadow:"0 4px 24px rgba(99,102,241,.45),0 1px 0 rgba(255,255,255,.12) inset",transition:"all .2s cubic-bezier(.22,1,.36,1)"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px) scale(1.02)";e.currentTarget.style.boxShadow="0 8px 32px rgba(99,102,241,.55),0 1px 0 rgba(255,255,255,.15) inset";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 4px 24px rgba(99,102,241,.45),0 1px 0 rgba(255,255,255,.12) inset";}}>
                <span style={{fontSize:14}}>✦</span> Nouvelle vidéo
              </button>
            </div>
          </div>
          {/* 3-step micro-guide — shows until user has 3 or more videos */}
          {files.filter(f=>f.status==="ready").length<3&&(
            <div style={{display:"flex",gap:8,padding:"12px 14px",borderRadius:14,background:"linear-gradient(135deg,rgba(91,108,255,.06),rgba(168,85,247,.04))",border:"1px solid rgba(91,108,255,.12)",flexWrap:"wrap"}}>
              {[["1","📤","Importe ta vidéo","MP4, MOV, URL YouTube"],["2","🤖","L'IA génère tes subs","Whisper · 10s"],["3","🎨","Choisis ton style","24 styles viraux"],].map(([n,ic,t,s])=>(
                <div key={n} style={{display:"flex",alignItems:"center",gap:8,flex:"1 1 150px",minWidth:0}}>
                  <div style={{width:26,height:26,borderRadius:8,background:`${T.acc}18`,border:`1px solid ${T.acc}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:T.acc,flexShrink:0}}>{n}</div>
                  <div style={{fontSize:14}}>{ic}</div>
                  <div>
                    <div style={{fontSize:11,fontWeight:700,color:T.text}}>{t}</div>
                    <div style={{fontSize:10,color:T.muted}}>{s}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── STATS STRIP ── */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20}} className="mobile-grid2">
          {[
            {icon:"🎬",label:"Vidéos traitées",value:files.filter(f=>f.status==="ready").length,color:T.acc},
            {icon:"🎯",label:"Vidéos restantes",value:totalCredits===Infinity?"∞":Math.max(0,realCredits),color:creditWarn?T.orange:T.yellow},
            {icon:"⬆️",label:"Exports réalisés",value:files.filter(f=>f.exported).length,color:T.green},
          ].map((s,i)=>(
            <div key={s.label} style={{padding:"14px 16px",borderRadius:16,background:`linear-gradient(135deg,${T.surf},${T.surf2})`,border:`1px solid rgba(255,255,255,.07)`,position:"relative",overflow:"hidden",transition:"all .25s cubic-bezier(.22,1,.36,1)",cursor:"default"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=s.color+"55";e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 12px 40px ${s.color}18`;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.07)";e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${s.color},${s.color}00)`}}/>
              <div style={{position:"absolute",top:-20,right:-10,width:60,height:60,borderRadius:"50%",background:`radial-gradient(${s.color}18,transparent 70%)`,pointerEvents:"none"}}/>
              <div style={{fontSize:18,marginBottom:8,filter:`drop-shadow(0 0 6px ${s.color}66)`}}>{s.icon}</div>
              <div className="syne" style={{fontWeight:800,fontSize:22,color:s.color,lineHeight:1,marginBottom:4,letterSpacing:"-.02em"}}>{s.value}</div>
              <div style={{fontSize:10.5,color:T.muted,fontWeight:500,letterSpacing:".02em",textTransform:"uppercase"}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── CREDIT BAR ET UPGRADE ── */}
        {(creditWarn||user?.plan==="Free")&&(
          <div style={{padding:"14px 20px",borderRadius:16,background:creditWarn?`linear-gradient(135deg,${T.orange}12,${T.yellow}06)`:`linear-gradient(135deg,${T.acc}10,${T.purple}06)`,border:`1px solid ${creditWarn?T.orange:T.acc}30`,marginBottom:16,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
            <span style={{fontSize:26}}>{creditWarn?"⚠️":"🚀"}</span>
            <div style={{flex:1,minWidth:160}}>
              <div style={{fontWeight:700,fontSize:13,marginBottom:2}}>{creditWarn?"Vidéos presque épuisées":"Plan gratuit — 3 vidéos/mois"}</div>
              <div style={{height:5,background:"rgba(255,255,255,.08)",borderRadius:3,marginTop:6,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${Math.min(creditPct,100)}%`,background:creditWarn?`linear-gradient(90deg,${T.yellow},${T.orange})`:T.grad,borderRadius:3}}/>
              </div>
            </div>
            <Btn size="sm" onClick={()=>setPage("pricing")} style={{background:T.grad,flexShrink:0}}>Voir les plans →</Btn>
          </div>
        )}

        {/* ── FILES SECTION ── */}
        <div style={{background:`linear-gradient(145deg,${T.surf},${T.surf2})`,borderRadius:20,border:"1px solid rgba(255,255,255,.07)",overflow:"hidden",boxShadow:"0 4px 6px rgba(0,0,0,.07),0 24px 60px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.05)"}}>
          {/* Section header */}
          <div style={{padding:"12px 14px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            <div style={{display:"flex",gap:0,background:T.bg,borderRadius:9,padding:3,flexShrink:0}}>
              {[["all","Toutes"],["ready","Prêtes"],["processing","En cours"]].map(([id,label])=>(
                <button key={id} onClick={()=>setActiveTab(id)} style={{padding:"5px 12px",borderRadius:7,background:activeTab===id?T.surf:"transparent",border:"none",color:activeTab===id?T.text:T.muted,fontWeight:activeTab===id?700:400,fontSize:12,cursor:"pointer",transition:"all .15s",whiteSpace:"nowrap"}}>{label}</button>
              ))}
            </div>
            <div style={{position:"relative",flex:1,minWidth:160}}>
              <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:T.dim,fontSize:12}}>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..." style={{width:"100%",padding:"7px 12px 7px 30px",borderRadius:9,fontSize:12,background:T.bg,border:`1px solid ${T.border}`,color:T.text}} onFocus={e=>e.target.style.borderColor=T.acc} onBlur={e=>e.target.style.borderColor=T.border}/>
            </div>
            <span style={{fontSize:11,color:T.dim,flexShrink:0}}>{tabFiles.length} fichier{tabFiles.length>1?"s":""}</span>
          </div>

          {/* Files */}
          {tabFiles.length===0?(
            <div style={{textAlign:"center",padding:"56px 28px"}}>
              {/* Animated phone with glow */}
              <div style={{position:"relative",display:"inline-block",marginBottom:28}}>
                <div style={{position:"absolute",inset:-30,background:`radial-gradient(${T.acc}20,transparent 65%)`,filter:"blur(20px)",animation:"glowPulse 3s ease infinite"}}/>
                <div style={{width:80,height:80,borderRadius:22,background:`linear-gradient(135deg,${T.acc}18,${T.purple}10)`,border:`1.5px solid ${T.acc}35`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,position:"relative",animation:"float3d 4s ease infinite",boxShadow:`0 20px 60px ${T.acc}20`}}>🎬</div>
              </div>
              <h3 className="syne" style={{fontWeight:800,fontSize:20,marginBottom:8,letterSpacing:"-.02em"}}>Prêt à créer quelque chose d'incroyable ?</h3>
              <p style={{fontSize:13,color:T.muted,marginBottom:32,maxWidth:320,margin:"0 auto 32px",lineHeight:1.65}}>
                Importe ta vidéo — l'IA génère tes sous-titres en <strong style={{color:T.text}}>10 secondes</strong> chrono.
              </p>
              {/* Upload button et drag hint */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
                <button onClick={()=>setShowUpload(true)} className="shimmer-btn" style={{display:"inline-flex",alignItems:"center",gap:10,padding:"14px 36px",borderRadius:16,background:T.grad,border:"none",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:`0 8px 48px ${T.accGlow}`,transition:"all .3s"}}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px) scale(1.02)";e.currentTarget.style.boxShadow=`0 16px 64px ${T.accGlow}`;}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow=`0 8px 48px ${T.accGlow}`;}}>
                  <span style={{fontSize:18}}>✦</span> Importer une vidéo
                </button>
                <span style={{fontSize:11,color:T.dim}}>MP4 · MOV · AVI · WebM · ou colle une URL YouTube</span>
              </div>
            </div>
          ):(
            <div>
              {tabFiles.map((f,i)=>{
                const sc={ready:T.green,processing:T.yellow,deleted:T.muted}[f.status]||T.muted;
                return(
                  <div key={f.id}
                    style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",
                      borderBottom:i<tabFiles.length-1?"1px solid rgba(255,255,255,.04)":"none",
                      transition:"background .15s",cursor:"pointer",
                      animation:`fadeUp .25s ease ${i*.04}s both`,position:"relative"}}
                    onClick={()=>onOpen(f)}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(99,102,241,.05)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <div style={{position:"absolute",left:0,top:"20%",bottom:"20%",width:2.5,borderRadius:2,background:sc,opacity:.8}}/>
                    {/* Thumbnail icon */}
                    <div style={{width:36,height:36,borderRadius:9,flexShrink:0,
                      background:`linear-gradient(135deg,${sc}18,rgba(255,255,255,.04))`,
                      border:`1px solid ${sc}28`,
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>
                      {f.status==="processing"
                        ?<div style={{width:14,height:14,borderRadius:"50%",border:`2px solid ${T.yellow}`,borderTopColor:"transparent",animation:"spin 1s linear infinite"}}/>
                        :f.thumb}
                    </div>
                    {/* Name et meta */}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:700,fontSize:13,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",letterSpacing:"-.01em",marginBottom:3}}>{f.name}</div>
                      <div style={{display:"flex",gap:7,alignItems:"center",flexWrap:"wrap"}}>
                        <span style={{fontSize:9.5,color:T.dim,fontFamily:"JetBrains Mono"}}>{f.date}</span>
                        {f.dur&&f.dur!=="00:00"&&<span style={{fontSize:9.5,color:T.dim,fontFamily:"JetBrains Mono"}}>{f.dur}</span>}
                        <span style={{display:"flex",alignItems:"center",gap:3,fontSize:10,color:sc,fontWeight:600}}>
                          <span style={{width:4,height:4,borderRadius:"50%",background:sc,animation:f.status==="processing"?"pulseDot 1.5s infinite":undefined}}/>
                          {f.status==="processing"?"En cours...":f.status==="ready"?"Prêt":"Supprimée"}
                        </span>
                        {f.exported&&<span style={{fontSize:9,padding:"1px 6px",borderRadius:100,background:`${T.green}12`,color:T.green,fontWeight:700,border:`1px solid ${T.green}20`}}>✓ exporté</span>}
                      </div>
                    </div>
                    {/* Subtitle style preview */}
                    <div className="hide-mobile" style={{flexShrink:0,padding:"4px 10px",borderRadius:8,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.07)"}}>
                      <div style={{fontSize:9,color:T.dim,marginBottom:2,textTransform:"uppercase",letterSpacing:".05em"}}>Style</div>
                      <div style={{fontSize:10,fontWeight:700,color:T.acc}}>{f.styleId||"mrbeast"}</div>
                    </div>
                    {/* Timer */}
                    <div className="hide-mobile">{f.deleteIn>0&&<DeleteTimer hours={f.deleteIn}/>}</div>
                    {/* Actions */}
                    <div style={{display:"flex",gap:5,flexShrink:0}} onClick={e=>e.stopPropagation()}>
                      {f.status==="ready"&&(
                        <button onClick={()=>onOpen(f)}
                          style={{padding:"7px 16px",borderRadius:9,background:T.grad,border:"none",
                            color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",
                            boxShadow:`0 2px 12px ${T.accGlow}`,transition:"all .15s"}}
                          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow=`0 4px 20px ${T.accGlow}`;}}
                          onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow=`0 2px 12px ${T.accGlow}`;}}>
                          ✏ Éditer
                        </button>
                      )}
                      <button onClick={()=>setConfirmDelete({id:f.id,name:f.name})}
                        style={{width:32,height:32,borderRadius:8,background:`${T.pink}08`,
                          border:`1px solid ${T.pink}18`,color:T.pink,fontSize:13,cursor:"pointer",
                          display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}
                        onMouseEnter={e=>e.currentTarget.style.background=`${T.pink}18`}
                        onMouseLeave={e=>e.currentTarget.style.background=`${T.pink}08`}>🗑</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── LIVE CHAT WIDGET ── */}
      <div style={{position:"fixed",bottom:24,right:24,zIndex:300}}>
        {/* Chat window */}
        {chatOpen&&(
          <div style={{position:"absolute",bottom:64,right:0,width:340,background:T.surf2,border:`1px solid ${T.border}`,borderRadius:20,boxShadow:"0 20px 60px rgba(0,0,0,.7)",overflow:"hidden",animation:"popIn .3s cubic-bezier(.34,1.56,.64,1)",display:"flex",flexDirection:"column"}}>
            {/* Chat header */}
            <div style={{padding:"14px 16px",background:`linear-gradient(135deg,${T.acc}20,${T.surf2})`,borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:T.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0,boxShadow:`0 0 12px ${T.acc}55`}}>✦</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14}}>Support SubCraft</div>
                <div style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:T.green}}>
                  <span style={{width:6,height:6,borderRadius:"50%",background:T.green,animation:"pulseDot 2s infinite"}}/>
                  Sophie · En ligne
                </div>
              </div>
              <button onClick={()=>setChatOpen(false)} style={{background:`${T.pink}15`,border:`1px solid ${T.pink}25`,borderRadius:7,color:T.pink,fontSize:14,cursor:"pointer",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
            </div>
            {/* Messages */}
            <div style={{height:280,overflowY:"auto",padding:"14px 14px",display:"flex",flexDirection:"column",gap:10}}>
              {chatHistory.map(m=>(
                <div key={m.id} style={{display:"flex",flexDirection:m.from==="user"?"row-reverse":"row",gap:8,alignItems:"flex-end"}}>
                  {m.from==="support"&&<div style={{width:28,height:28,borderRadius:"50%",background:T.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>✦</div>}
                  <div style={{maxWidth:"75%"}}>
                    <div style={{padding:"9px 13px",borderRadius:m.from==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",background:m.from==="user"?T.acc:T.surf,color:m.from==="user"?"#fff":T.text,fontSize:12.5,lineHeight:1.55}}>{m.text}</div>
                    <div style={{fontSize:9,color:T.dim,marginTop:3,textAlign:m.from==="user"?"right":"left"}}>{m.time}</div>
                  </div>
                </div>
              ))}
              {chatLoading&&(
                <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:T.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>✦</div>
                  <div style={{padding:"10px 14px",borderRadius:"14px 14px 14px 4px",background:T.surf,display:"flex",gap:4,alignItems:"center"}}>
                    {[0,1,2].map(i=><span key={i} style={{width:6,height:6,borderRadius:"50%",background:T.acc,animation:`bounce 1.2s ease infinite`,animationDelay:`${i*.18}s`}}/>)}
                  </div>
                </div>
              )}
              <div ref={chatEndRef}/>
            </div>
            {/* Quick replies */}
            <div style={{padding:"8px 12px",borderTop:`1px solid ${T.border}`,display:"flex",gap:5,flexWrap:"wrap"}}>
              {["Comment exporter ?","Problème de transcription","Changer mon plan"].map(q=>(
                <button key={q} onClick={()=>{setChatMsg(q);}} style={{padding:"4px 10px",borderRadius:100,background:`${T.acc}10`,border:`1px solid ${T.acc}25`,color:T.acc,fontSize:10,cursor:"pointer",fontWeight:500,transition:"background .12s"}} onMouseEnter={e=>e.currentTarget.style.background=`${T.acc}20`} onMouseLeave={e=>e.currentTarget.style.background=`${T.acc}10`}>{q}</button>
              ))}
            </div>
            {/* Input */}
            <div style={{padding:"10px 12px",borderTop:`1px solid ${T.border}`,display:"flex",gap:8}}>
              <input value={chatMsg} onChange={e=>setChatMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendChat()} placeholder="Écris ton message..." style={{flex:1,padding:"9px 13px",borderRadius:10,fontSize:12.5,background:T.bg,border:`1px solid ${T.border}`,color:T.text}} onFocus={e=>e.target.style.borderColor=T.acc} onBlur={e=>e.target.style.borderColor=T.border}/>
              <button onClick={sendChat} disabled={!chatMsg.trim()||chatLoading} style={{width:36,height:36,borderRadius:10,background:chatMsg.trim()?T.acc:T.border,border:"none",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,cursor:chatMsg.trim()?"pointer":"default",transition:"background .2s",flexShrink:0}}>↑</button>
            </div>
          </div>
        )}
        {/* FAB button */}
        <button onClick={()=>setChatOpen(o=>!o)} style={{width:52,height:52,borderRadius:"50%",background:chatOpen?T.pink:T.acc,border:"none",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,cursor:"pointer",boxShadow:`0 4px 20px ${chatOpen?T.pink:T.acc}66`,transition:"all .25s",animation:chatOpen?"none":"glow 3s infinite"}}>
          {chatOpen?"×":"💬"}
        </button>
        {!chatOpen&&chatHistory.filter(m=>!m.read&&m.from==="support").length>0&&(
          <div style={{position:"absolute",top:-4,right:-4,width:18,height:18,borderRadius:"50%",background:T.pink,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:"#fff",pointerEvents:"none"}}>{chatHistory.filter(m=>!m.read&&m.from==="support").length}</div>
        )}
      </div>

      {showUpload&&<UploadModal onClose={()=>setShowUpload(false)} onImport={handleUpload}/>}
      <ConfirmModal
        open={!!confirmDelete}
        title="Supprimer cette vidéo ?"
        desc={confirmDelete?`"${confirmDelete.name}" sera définitivement supprimée. Cette action est irréversible.`:undefined}
        onConfirm={()=>{setFiles(p=>p.filter(x=>x.id!==confirmDelete.id));setConfirmDelete(null);notify("Vidéo supprimée","warning");}}
        onCancel={()=>setConfirmDelete(null)}
      />
      {notifPanel&&<div style={{position:"fixed",inset:0,zIndex:149}} onClick={()=>setNotifPanel(false)}/>}
    </div>
  );
};
const UploadModal=({onClose,onImport})=>{
  const [tab,setTab]=useState("file");
  const [file,setFile]=useState(null);
  const [urlVal,setUrlVal]=useState("");
  const [urlOk,setUrlOk]=useState(null);
  const [lang,setLang]=useState("");
  const [drag,setDrag]=useState(false);
  const [uploading,setUploading]=useState(false);
  const [progress,setProgress]=useState(0);
  const [dropOpen,setDropOpen]=useState(false);
  const fRef=useRef();

  const checkUrl=(v)=>{
    const ok=/youtube\.com\/shorts\/|youtu\.be\/|tiktok\.com\/@|instagram\.com\/(reel|p)\//.test(v);
    setUrlOk(v.length>8?(ok?"ok":"err"):null);
  };

  // Extrait l'audio via OfflineAudioContext — tous canaux mixés (voix off incluse)
  const extractAudioBlob = (videoFile) => new Promise((resolve, reject) => {
    const url = URL.createObjectURL(videoFile);
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    fetch(url)
      .then(r => r.arrayBuffer())
      .then(buf => audioCtx.decodeAudioData(buf))
      .then(decoded => {
        URL.revokeObjectURL(url);
        const sampleRate = 16000;
        // OfflineAudioContext mono 16kHz
        const offlineCtx = new OfflineAudioContext(1, Math.ceil(decoded.duration * sampleRate), sampleRate);
        const source = offlineCtx.createBufferSource();
        source.buffer = decoded;

        // Si stéréo ou multi-canaux → mixer en mono via ChannelMerger
        if(decoded.numberOfChannels > 1) {
          const splitter = offlineCtx.createChannelSplitter(decoded.numberOfChannels);
          const merger = offlineCtx.createChannelMerger(1);
          source.connect(splitter);
          for(let i = 0; i < decoded.numberOfChannels; i++) {
            splitter.connect(merger, i, 0);
          }
          merger.connect(offlineCtx.destination);
        } else {
          source.connect(offlineCtx.destination);
        }

        source.start(0);
        return offlineCtx.startRendering();
      })
      .then(rendered => {
        // WAV 16bit mono 16kHz
        const numFrames = rendered.length;
        const sampleRate = rendered.sampleRate;
        const dataSize = numFrames * 2;
        const buffer = new ArrayBuffer(44 + dataSize);
        const view = new DataView(buffer);
        const writeStr = (off, str) => { for(let i=0;i<str.length;i++) view.setUint8(off+i, str.charCodeAt(i)); };
        writeStr(0,"RIFF"); view.setUint32(4, 36+dataSize, true);
        writeStr(8,"WAVE"); writeStr(12,"fmt ");
        view.setUint32(16,16,true); view.setUint16(20,1,true);
        view.setUint16(22,1,true);           // mono
        view.setUint32(24,sampleRate,true);
        view.setUint32(28,sampleRate*2,true);
        view.setUint16(32,2,true);
        view.setUint16(34,16,true);
        writeStr(36,"data"); view.setUint32(40,dataSize,true);
        const ch = rendered.getChannelData(0);
        let off = 44;
        for(let i=0;i<numFrames;i++){
          const s = Math.max(-1, Math.min(1, ch[i]));
          view.setInt16(off, s < 0 ? s*0x8000 : s*0x7FFF, true);
          off += 2;
        }
        audioCtx.close();
        const blob = new Blob([buffer], { type: "audio/wav" });
        // Vérif taille finale < 24MB
        if(blob.size > 24 * 1024 * 1024) {
          reject(new Error(`Audio trop lourd après extraction (${(blob.size/1024/1024).toFixed(1)} MB). Essaie une vidéo plus courte.`));
        } else {
          resolve(blob);
        }
      })
      .catch(err => {
        URL.revokeObjectURL(url);
        try { audioCtx.close(); } catch{}
        reject(err);
      });
  });

  const doImport=async()=>{
    if(!file&&tab==="file"){notify("Sélectionne une vidéo d'abord !","warning");return;}
    if(tab==="url"&&urlOk!=="ok"){notify("Colle un lien valide !","warning");return;}
    if(!lang){notify("Sélectionne la langue de ta vidéo !","warning");return;}
    setUploading(true);
    setProgress(5);

    try {
      let whisperData = null;

      if(tab==="file" && file) {
        const isVideo = file.type.startsWith("video/");
        let audioBlob = file;

        if(isVideo) {
          setProgress(15);
          try {
            audioBlob = await extractAudioBlob(file);
            notify("🎵 Audio extrait — envoi à Whisper...", "info");
          } catch(e) {
            console.warn("[audio extract]", e.message);
            // Si l'erreur vient de la taille → on arrête
            if(e.message.includes("trop lourd")) {
              notify(e.message, "error");
              setUploading(false); setProgress(0); return;
            }
            // Sinon fallback : envoyer le fichier vidéo directement
            notify("⚠️ Extraction audio impossible — envoi direct de la vidéo...", "warning");
            audioBlob = file;
          }
        }

        setProgress(35);
        const fileSizeMB = (audioBlob.size / 1024 / 1024).toFixed(1);
        if(audioBlob.size > 24 * 1024 * 1024) {
          notify(`Fichier trop lourd (${fileSizeMB} MB > 24 MB). Essaie une vidéo plus courte ou compresse-la.`, "error");
          setUploading(false); setProgress(0); return;
        }

        notify(`📤 Envoi à Whisper (${fileSizeMB} MB)...`, "info");
        const formData = new FormData();
        formData.append("file", audioBlob, isVideo ? "audio.wav" : file.name);
        formData.append("language", lang||"fr");

        setProgress(45);
        const res = await fetch("/api/whisper", {
          method: "POST",
          body: formData,
        });
        setProgress(80);
        if(!res.ok) {
          const err = await res.json().catch(()=>({}));
          throw new Error(err.error || `Erreur Whisper (${res.status})`);
        }
        whisperData = await res.json();
      }

      setProgress(92);
      let subs = null;

      // Mots qui indiquent une hallucination Whisper connue
      const HALLUCINATIONS = [
        "amara", "sous-titres réalisés", "subtitles by", "transcribed by",
        "sous titres", "community captions", "translated by", "sous-titrage",
      ];
      const isHallucinated = (text) =>
        HALLUCINATIONS.some(h => text.toLowerCase().includes(h));

      if(whisperData?.segments?.length > 0) {
        const filtered = whisperData.segments.filter(seg =>
          seg.text?.trim().length > 1 && !isHallucinated(seg.text)
        );
        if(filtered.length > 0) {
          subs = filtered.map((seg, i) => ({
            id: i + 1,
            start: Math.round(seg.start * 10) / 10,
            end: Math.round(seg.end * 10) / 10,
            text: seg.text.trim(),
          }));
        } else {
          notify("Whisper n'a pas détecté de voix claire. Vérifie que ta vidéo a bien du son.", "warning");
        }
      }

      setProgress(100);
      setTimeout(() => onImport(file || {name: urlVal}, lang, subs), 400);

    } catch(e) {
      console.error("[Whisper]", e);
      notify("Erreur transcription : " + e.message, "error");
      setUploading(false);
      setProgress(0);
    }
  };

  return(
    <Modal title="Importer une vidéo" subtitle="Shorts · Reels · TikToks — Max 300 MB · Compression auto" onClose={!uploading?onClose:undefined} width={520}>
      {!uploading&&(
        <div style={{display:"flex",background:T.bg,borderRadius:10,padding:3,marginBottom:18,gap:3}}>
          {[["file","📁 Fichier vidéo"],["url","🔗 Import URL"]].map(([id,label])=>(
            <button key={id} onClick={()=>{setTab(id);setFile(null);setUrlVal("");setUrlOk(null);}} style={{flex:1,padding:"7px",borderRadius:7,background:tab===id?T.surf2:"transparent",border:tab===id?`1px solid ${T.border}`:"none",color:tab===id?T.text:T.muted,fontWeight:tab===id?700:400,fontSize:13,cursor:"pointer",transition:"all .2s"}}>{label}</button>
          ))}
        </div>
      )}
      {uploading?(
        <div style={{textAlign:"center",padding:"24px 0"}}>
          <div style={{fontSize:56,marginBottom:18,animation:"float 2s ease infinite"}}>⚡</div>
          <div style={{fontWeight:800,fontSize:20,marginBottom:6}}>Analyse en cours...</div>
          <div style={{color:T.muted,fontSize:13,marginBottom:28}}>Whisper AI transcrit ton audio</div>
          <div style={{background:T.border,borderRadius:100,height:8,overflow:"hidden",marginBottom:10}}>
            <div style={{height:"100%",width:`${progress}%`,background:T.grad,borderRadius:100,transition:"width .1s",boxShadow:`0 0 12px ${T.accGlow}`}}/>
          </div>
          <div style={{fontFamily:"JetBrains Mono",fontSize:13,color:T.acc,fontWeight:600}}>{Math.round(progress)}%</div>
          <div style={{marginTop:18,fontSize:12,color:T.muted}}>
            {progress<15?"Lecture de la vidéo...":progress<35?"Extraction audio...":progress<45?"Envoi à Whisper AI...":progress<80?"Transcription en cours...":progress<95?"Formatage des sous-titres...":"Presque terminé !"}
          </div>
        </div>
      ):(
        <>
          {tab==="file"&&(
            <div onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);setFile(e.dataTransfer.files[0]);}} onClick={()=>fRef.current.click()} style={{border:`2px dashed ${drag||file?T.acc:T.border}`,borderRadius:14,padding:"30px 20px",textAlign:"center",cursor:"pointer",background:drag?`${T.acc}07`:"transparent",transition:"all .2s",marginBottom:18}}>
              <input ref={fRef} type="file" accept="video/*" style={{display:"none"}} onChange={e=>setFile(e.target.files[0])}/>
              <div style={{fontSize:44,marginBottom:12,animation:"float 3s ease infinite"}}>🎬</div>
              {file?(
                <>
                  <div style={{fontWeight:700,color:T.acc,fontSize:14,fontFamily:"JetBrains Mono",marginBottom:4}}>{file.name}</div>
                  <div style={{color:file.size>300*1024*1024?T.pink:T.green,fontSize:12}}>{(file.size/1024/1024).toFixed(1)} MB · {file.size>300*1024*1024?"⚠ Trop lourd (max 300 MB)":"✓ Prête à importer"}</div>
                </>
              ):(
                <>
                  <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>Glisse ta vidéo ici</div>
                  <div style={{color:T.muted,fontSize:12,marginBottom:12}}>ou clique pour sélectionner</div>
                  <div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap"}}>
                    {["MP4","MOV","AVI","WEBM","MKV"].map(f=><Tag key={f} color={T.dim}>{f}</Tag>)}
                  </div>
                </>
              )}
            </div>
          )}
          {tab==="url"&&(
            <div style={{marginBottom:18}}>
              <div style={{marginBottom:12,padding:"12px 14px",borderRadius:10,background:`${T.acc}08`,border:`1px solid ${T.acc}20`}}>
                <div style={{fontWeight:700,fontSize:13,color:T.acc,marginBottom:6}}>🔗 Colle ton lien</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {["▶ YouTube Shorts","🎵 TikTok","📸 Instagram Reel"].map(pl=>(
                    <span key={pl} style={{fontSize:10,padding:"2px 8px",borderRadius:5,background:T.surf2,border:`1px solid ${T.border}`,color:T.muted}}>{pl}</span>
                  ))}
                </div>
              </div>
              <div style={{position:"relative",marginBottom:8}}>
                <input value={urlVal} onChange={e=>{setUrlVal(e.target.value);checkUrl(e.target.value);}} placeholder="https://www.youtube.com/shorts/..." style={{width:"100%",background:"rgba(255,255,255,.05)",border:`1px solid rgba(255,255,255,.1)`,borderRadius:10,padding:"10px 40px 10px 14px",color:"#fff",fontSize:14}}/>
                {urlOk==="ok"&&<span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:T.green,fontWeight:900,fontSize:16}}>✓</span>}
              </div>
              {urlOk==="err"&&<div style={{fontSize:12,color:T.pink,marginBottom:6}}>⚠ Lien non reconnu. Colle un lien YouTube Shorts, TikTok ou Instagram Reel.</div>}
              {urlOk==="ok"&&<div style={{fontSize:12,color:T.green,marginBottom:6}}>✓ Lien valide — SubCraft va télécharger ta vidéo automatiquement.</div>}
            </div>
          )}
          <div style={{marginBottom:16,position:"relative"}}>
            <label style={{fontSize:12,color:T.muted,display:"block",marginBottom:7,fontWeight:600}}>🌍 Langue de la vidéo <span style={{color:T.pink}}>*</span></label>
            <div onClick={()=>setDropOpen(o=>!o)} style={{padding:"11px 14px",borderRadius:10,border:`1px solid ${lang?T.acc:T.border}`,background:T.surf,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:14,transition:"border .2s"}}>
              <span style={{color:lang?T.text:T.muted}}>{lang?`${LANGS.find(l=>l.code===lang)?.flag} ${LANGS.find(l=>l.code===lang)?.name}`:"Sélectionner..."}</span>
              <span style={{color:T.muted,transition:"transform .2s",display:"inline-block",transform:dropOpen?"rotate(180deg)":"none"}}>▾</span>
            </div>
            {dropOpen&&(
              <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:T.surf2,border:`1px solid ${T.border}`,borderRadius:12,zIndex:50,animation:"fadeDown .18s ease",boxShadow:"0 12px 32px rgba(0,0,0,.4)",maxHeight:200,overflowY:"auto"}}>
                {LANGS.map(l=>(
                  <div key={l.code} onClick={()=>{setLang(l.code);setDropOpen(false);}} style={{padding:"10px 14px",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",gap:10,color:lang===l.code?T.acc:T.text,background:lang===l.code?`${T.acc}10`:"transparent",transition:"background .12s"}} onMouseEnter={e=>e.currentTarget.style.background=`${T.acc}08`} onMouseLeave={e=>e.currentTarget.style.background=lang===l.code?`${T.acc}10`:"transparent"}>
                    <span style={{fontSize:18}}>{l.flag}</span>{l.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{padding:"10px 14px",borderRadius:10,background:`${T.yellow}0e`,border:`1px solid ${T.yellow}22`,marginBottom:18,display:"flex",gap:10,alignItems:"flex-start"}}>
            <span style={{fontSize:17,flexShrink:0}}>⏱️</span>
            <div>
              <div style={{fontWeight:700,fontSize:12,color:T.yellow,marginBottom:2}}>Suppression automatique dans 24h</div>
              <div style={{fontSize:11,color:T.muted,lineHeight:1.5}}>Ta vidéo sera automatiquement supprimée 24h après l'upload pour protéger ta vie privée.</div>
            </div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <Btn v="secondary" onClick={onClose} full>Annuler</Btn>
            <Btn onClick={doImport} disabled={tab==="file"?(!file||!lang):(urlOk!=="ok"||!lang)} icon={tab==="url"?"🔗":"⬆"} full>{tab==="url"?"Importer depuis URL":"Importer"}</Btn>
          </div>
        </>
      )}
    </Modal>
  );
};

/* ══════════════════════════════════════════════
   PAGE: TEMPLATES
══════════════════════════════════════════════ */
const TemplatesPage=({onBack,onSelect})=>(
  <div style={{minHeight:"100vh",background:T.bg,padding:"0 24px 80px"}} className="page">
    <div style={{maxWidth:900,margin:"0 auto"}}>
      <div style={{padding:"20px 0 28px",display:"flex",alignItems:"center",gap:14}}>
        <Btn v="ghost" onClick={onBack}>← Retour</Btn>
        <div>
          <h1 style={{fontWeight:800,fontSize:22,marginBottom:2}}>🎨 Templates</h1>
          <div style={{color:T.muted,fontSize:13}}>Des presets complets prêts en 1 clic</div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}} className="mobile-grid1">
        {TEMPLATES.map((t,i)=>{
          const st=SUBTITLE_STYLES.find(s=>s.id===t.styleId)||SUBTITLE_STYLES[0];
          return(
            <div key={t.id} style={{borderRadius:16,background:T.surf,border:`1px solid ${T.border}`,overflow:"hidden",transition:"all .2s",animation:`fadeUp .35s ease ${i*.07}s both`,cursor:"pointer"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.borderColor=T.acc;}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.borderColor=T.border;}}>
              <div style={{height:130,background:"#040710",display:"flex",alignItems:"center",justifyContent:"center",padding:16,position:"relative"}}>
                <span style={{fontFamily:st.preview.font,fontSize:Math.round(st.preview.size*.32)+"px",fontWeight:st.preview.weight,color:st.preview.color,textShadow:st.preview.shadow,textTransform:st.preview.transform,background:st.preview.bg,padding:st.preview.bg!=="transparent"?"5px 12px":"0",borderRadius:"6px",textAlign:"center",lineHeight:1.3}}>
                  APERÇU STYLE
                </span>
              </div>
              <div style={{padding:"14px 18px"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                  <span style={{fontSize:22}}>{t.icon}</span>
                  <div style={{fontWeight:700,fontSize:16}}>{t.name}</div>
                </div>
                <div style={{color:T.muted,fontSize:12,marginBottom:14,lineHeight:1.5}}>{t.desc}</div>
                <Btn full v="secondary" size="sm" onClick={()=>{onSelect(t);notify(`Template "${t.name}" appliqué !`,"success");}}>Utiliser ce template →</Btn>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════
   PAGE: PROFILE
══════════════════════════════════════════════ */
const ProfilePage=({user,setUser,onBack,setPage})=>{
  const [name,setName]=useState(user?.name||"");
  const [email,setEmail]=useState(user?.email||"");
  const [bio,setBio]=useState("Créateur de contenu passionné 🎬");
  const [saved,setSaved]=useState(false);
  const [tab,setTab]=useState("profile");
  const planColor={Free:T.muted,Basic:T.cyan,Expert:T.green,Pro:T.acc};

  const save=()=>{
    setUser(u=>({...u,name,email}));
    setSaved(true);
    notify("Profil mis à jour !","success");
    setTimeout(()=>setSaved(false),2500);
  };

  const invoices=[
    {id:"INV-001",date:"01/03/2026",plan:"Pro",amount:"€21.00",status:"Payée"},
    {id:"INV-002",date:"01/02/2026",plan:"Pro",amount:"€21.00",status:"Payée"},
    {id:"INV-003",date:"01/01/2026",plan:"Expert",amount:"€13.00",status:"Payée"},
  ];

  return(
    <div style={{minHeight:"100vh",background:T.bg,padding:"0 24px 80px"}} className="page">
      <div style={{maxWidth:780,margin:"0 auto"}}>
        <div style={{padding:"20px 0 28px",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
          <Btn v="ghost" onClick={onBack}>← Dashboard</Btn>
          <h1 style={{fontWeight:800,fontSize:22}}>Mon Profil</h1>
        </div>
        {/* Tabs */}
        <div style={{display:"flex",borderBottom:`1px solid ${T.border}`,marginBottom:28,gap:0,overflowX:"auto"}}>
          {[["profile","👤 Profil"],["security","🔒 Sécurité"],["billing","💳 Abonnement"],["invoices","🧾 Factures"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{padding:"11px 18px",background:"transparent",border:"none",borderBottom:`2px solid ${tab===id?T.acc:"transparent"}`,color:tab===id?T.text:T.muted,fontWeight:tab===id?700:400,fontSize:13,cursor:"pointer",whiteSpace:"nowrap",transition:"all .15s"}}>
              {label}
            </button>
          ))}
        </div>

        {tab==="profile"&&(
          <div style={{display:"grid",gridTemplateColumns:"200px 1fr",gap:28}} className="mobile-col">
            {/* Avatar */}
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
              <div style={{position:"relative"}}>
                <Avatar name={user?.name||"U"} size={100}/>
                <button style={{position:"absolute",bottom:0,right:0,width:28,height:28,borderRadius:"50%",background:T.acc,border:"none",color:"#fff",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>✏</button>
              </div>
              <Tag color={planColor[user?.plan]||T.muted} size="md">{user?.plan}</Tag>
              <div style={{fontSize:12,color:T.muted,textAlign:"center"}}>Membre depuis<br/><span style={{color:T.text}}>Mars 2026</span></div>
            </div>
            {/* Form */}
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <Input label="Nom complet" value={name} onChange={setName} placeholder="Ton nom"/>
              <Input label="Email" value={email} onChange={setEmail} placeholder="ton@email.com" type="email"/>
              <div>
                <label style={{fontSize:12,color:T.muted,display:"block",marginBottom:6,fontWeight:600}}>Bio</label>
                <textarea value={bio} onChange={e=>setBio(e.target.value)} style={{width:"100%",padding:"10px 14px",borderRadius:10,fontSize:14,background:T.surf,border:`1px solid ${T.border}`,color:T.text,resize:"vertical",minHeight:80,lineHeight:1.5}} onFocus={e=>e.target.style.borderColor=T.acc} onBlur={e=>e.target.style.borderColor=T.border}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[{label:"TikTok",icon:"📱",ph:"@tontiktok"},{label:"Instagram",icon:"📸",ph:"@toninstagram"},{label:"YouTube",icon:"▶",ph:"Ta chaîne"},{label:"Site web",icon:"🌐",ph:"https://..."}].map(f=>(
                  <Input key={f.label} label={f.label} value="" onChange={()=>{}} placeholder={f.ph} icon={f.icon}/>
                ))}
              </div>
              <Btn onClick={save} v={saved?"success":"primary"} style={{alignSelf:"flex-start"}}>
                {saved?"✓ Sauvegardé !":"Sauvegarder les modifications"}
              </Btn>
            </div>
          </div>
        )}

        {tab==="security"&&(
          <div style={{maxWidth:480,display:"flex",flexDirection:"column",gap:16}}>
            <div style={{padding:20,borderRadius:14,background:T.surf,border:`1px solid ${T.border}`}}>
              <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>🔒 Changer le mot de passe</div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <Input label="Mot de passe actuel" value="" onChange={()=>{}} type="password" placeholder="••••••••"/>
                <Input label="Nouveau mot de passe" value="" onChange={()=>{}} type="password" placeholder="••••••••" hint="Minimum 8 caractères, 1 majuscule, 1 chiffre"/>
                <Input label="Confirmer le nouveau mot de passe" value="" onChange={()=>{}} type="password" placeholder="••••••••"/>
                <Btn onClick={()=>notify("Mot de passe mis à jour !","success")} style={{alignSelf:"flex-start"}}>Changer le mot de passe</Btn>
              </div>
            </div>
            <div style={{padding:20,borderRadius:14,background:T.surf,border:`1px solid ${T.border}`}}>
              <div style={{fontWeight:700,fontSize:15,marginBottom:6}}>🛡️ Authentification à 2 facteurs</div>
              <div style={{color:T.muted,fontSize:13,marginBottom:14}}>Ajoute une couche de sécurité supplémentaire à ton compte.</div>
              <Tog value={false} onChange={()=>notify("2FA activé !","success")} label="Activer la 2FA"/>
            </div>
            <div style={{padding:20,borderRadius:14,background:`${T.pink}08`,border:`1px solid ${T.pink}22`}}>
              <div style={{fontWeight:700,fontSize:15,marginBottom:6,color:T.pink}}>⚠️ Zone dangereuse</div>
              <div style={{color:T.muted,fontSize:13,marginBottom:14}}>La suppression de compte est irréversible.</div>
              <Btn v="danger" onClick={()=>notify("Fonctionnalité désactivée en démo","warning")}>Supprimer mon compte</Btn>
            </div>
          </div>
        )}

        {tab==="billing"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{padding:22,borderRadius:16,background:T.surf,border:`2px solid ${T.acc}44`,display:"flex",gap:18,alignItems:"center",flexWrap:"wrap"}}>
              <div style={{width:52,height:52,borderRadius:14,background:T.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>⭐</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:18,marginBottom:2}}>Plan {user?.plan}</div>
                <div style={{color:T.muted,fontSize:13}}>Prochain renouvellement le 1er avril 2026</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <Btn v="secondary" size="sm" onClick={()=>setPage("pricing")}>Changer de plan</Btn>
                <Btn v="danger" size="sm" onClick={()=>notify("Abonnement annulé","warning")}>Annuler</Btn>
              </div>
            </div>
            {PLANS.map(p=>{
              const active=p.name===user?.plan;
              return(
                <div key={p.id} style={{padding:"14px 18px",borderRadius:12,background:active?`${T.acc}08`:T.surf,border:`1px solid ${active?T.acc:T.border}`,display:"flex",alignItems:"center",gap:14,cursor:active?undefined:"pointer",transition:"all .15s"}}
                  onClick={()=>!active&&setPage("pricing")}
                  onMouseEnter={e=>{if(!active)e.currentTarget.style.borderColor=T.acc;}}
                  onMouseLeave={e=>{if(!active)e.currentTarget.style.borderColor=T.border;}}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:14,display:"flex",gap:8,alignItems:"center"}}>{p.name}{active&&<Tag color={T.acc}>Actif</Tag>}</div>
                    <div style={{fontSize:12,color:T.muted}}>€{p.priceY}/mois · {p.credits===Infinity?"Illimité":`${p.credits} vidéos/mois`}</div>
                  </div>
                  {!active&&<Btn size="sm" v="secondary" onClick={()=>setPage("pricing")}>Passer à {p.name}</Btn>}
                </div>
              );
            })}
          </div>
        )}

        {tab==="invoices"&&(
          <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,overflow:"hidden"}}>
            <div style={{padding:"11px 18px",borderBottom:`1px solid ${T.border}`,display:"grid",gridTemplateColumns:"100px 1fr 100px 100px 80px",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".06em"}}>
              <span>N°</span><span>Plan</span><span>Date</span><span>Montant</span><span>Statut</span>
            </div>
            {invoices.map((inv,i)=>(
              <div key={inv.id} style={{padding:"12px 18px",borderBottom:i<invoices.length-1?`1px solid ${T.border}`:"none",display:"grid",gridTemplateColumns:"100px 1fr 100px 100px 80px",alignItems:"center",fontSize:13,transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background=T.surf2} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <span style={{fontFamily:"JetBrains Mono",color:T.muted}}>{inv.id}</span>
                <span style={{fontWeight:600}}>{inv.plan}</span>
                <span style={{color:T.muted}}>{inv.date}</span>
                <span style={{fontFamily:"JetBrains Mono",fontWeight:600,color:T.green}}>{inv.amount}</span>
                <Tag color={T.green}>{inv.status}</Tag>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   PAGE: EDITOR
══════════════════════════════════════════════ */
const EditorPage=({onBack,file})=>{
  const [tab,setTab]=useState("captions");
  const [subs,setSubs]=useState(file?.subs?.length>0 ? file.subs : genSubs());
  const [ct,setCt]=useState(0);
  const [playing,setPlaying]=useState(false);
  const [editId,setEditId]=useState(null);
  const [editTxt,setEditTxt]=useState("");
  const [styleId,setStyleId]=useState(file?.style||"captions-white");
  const [fontSize,setFontSize]=useState(68);
  const [maxChars,setMaxChars]=useState(12);
  const [fontFam,setFontFam]=useState("Impact");
  const [activeEff,setActiveEff]=useState([]);
  const [activeLineEff,setActiveLineEff]=useState([]);
  const [activeWordEff,setActiveWordEff]=useState([]);
  const [subYPos,setSubYPos]=useState(16); // % from bottom
  const [noEmoji,setNoEmoji]=useState(false);
  const [singleLine,setSingleLine]=useState(false);
  const [displayMode,setDisplayMode]=useState("word"); // "word" | "phrase"
  const videoRef=useRef(null);
  const [showTrans,setShowTrans]=useState(false);
  const [transLang,setTransLang]=useState("en");
  const [translating,setTranslating]=useState(false);
  const [addingEmoji,setAddingEmoji]=useState(false);
  const [showExport,setShowExport]=useState(false);
  const [undoStack,setUndoStack]=useState([]);
  const [redoStack,setRedoStack]=useState([]);
  const [shortcut,setShortcut]=useState(null);

  const totalDur=subs.length>0?subs[subs.length-1].end+2:18;

  // Keyboard shortcuts
  useEffect(()=>{
    const handler=(e)=>{
      if(e.code==="Space"&&e.target.tagName!=="INPUT"&&e.target.tagName!=="TEXTAREA"){e.preventDefault();setPlaying(p=>!p);setShortcut("▶ Play/Pause");}
      if(e.ctrlKey&&e.code==="KeyZ"){e.preventDefault();setShortcut("↩ Undo");}
      if(e.ctrlKey&&e.code==="KeyY"){e.preventDefault();setShortcut("↪ Redo");}
      if(e.ctrlKey&&e.code==="KeyE"){e.preventDefault();setShowExport(true);setShortcut("⬆ Export");}
    };
    window.addEventListener("keydown",handler);
    return()=>window.removeEventListener("keydown",handler);
  },[]);

  useEffect(()=>{if(shortcut){const t=setTimeout(()=>setShortcut(null),1500);return()=>clearTimeout(t);};},[shortcut]);
  useEffect(()=>{if(!playing)return;const iv=setInterval(()=>setCt(t=>{if(t>=totalDur){setPlaying(false);return 0;}return+(t+.1).toFixed(1);}),100);return()=>clearInterval(iv);},[playing,totalDur]);

  const saveSubs=(newSubs)=>{setUndoStack(p=>[...p.slice(-19),subs]);setRedoStack([]);setSubs(newSubs);};
  const undo=()=>{if(!undoStack.length)return;setRedoStack(p=>[subs,...p]);setSubs(undoStack[undoStack.length-1]);setUndoStack(p=>p.slice(0,-1));};
  const redo=()=>{if(!redoStack.length)return;setUndoStack(p=>[...p,subs]);setSubs(redoStack[0]);setRedoStack(p=>p.slice(1));};

  const addEmoji=async()=>{
    setAddingEmoji(true);
    try{
      const r=await fetch("/api/anthropic",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,messages:[{role:"user",content:`Add 1 perfect emoji to each subtitle. Keep short. Reply ONLY lines, no numbers.\n\n${subs.map(s=>s.text).join("\n")}`}]})});
      if(r.status===401){notify("⚠️ Clé API manquante — configure dans Admin → Intégrations","error");return;}
      if(!r.ok){notify(`Erreur API (${r.status}) — réessaie dans quelques instants`,"error");return;}
      const d=await r.json();
      const lines=d.content?.[0]?.text?.split("\n").filter(l=>l.trim())||[];
      if(!lines.length){notify("Réponse IA vide — réessaie","error");return;}
      saveSubs(subs.map((s,i)=>({...s,text:lines[i]||s.text})));
      notify("Emojis ajoutés par l'IA ! ✨","success");
    }catch(e){notify("Erreur réseau — vérifie ta connexion","error");}
    setAddingEmoji(false);
  };

  const translate=async()=>{
    setTranslating(true);
    try{
      const lang=LANGS.find(l=>l.code===transLang)?.name||"English";
      const r=await fetch("/api/anthropic",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,messages:[{role:"user",content:`Translate to ${lang}. Keep emojis. Reply ONLY translated lines.\n\n${subs.map(s=>s.text).join("\n")}`}]})});
      if(r.status===401){notify("⚠️ Clé API manquante — configure dans Admin → Intégrations","error");setTranslating(false);return;}
      if(!r.ok){notify(`Erreur traduction (${r.status})`,"error");setTranslating(false);return;}
      const d=await r.json();
      const lines=d.content?.[0]?.text?.split("\n").filter(l=>l.trim())||[];
      if(!lines.length){notify("Réponse IA vide — réessaie","error");setTranslating(false);return;}
      saveSubs(subs.map((s,i)=>({...s,text:lines[i]||s.text})));
      setShowTrans(false);
      notify(`Traduit en ${lang} ! 🌍`,"success");
    }catch{notify("Erreur réseau — vérifie ta connexion","error");}
    setTranslating(false);
  };

  const exportSRT=()=>{
    const fmt=s=>{const h=Math.floor(s/3600).toString().padStart(2,"0");const m=Math.floor((s%3600)/60).toString().padStart(2,"0");const sc=Math.floor(s%60).toString().padStart(2,"0");const ms=Math.round((s%1)*1000).toString().padStart(3,"0");return`${h}:${m}:${sc},${ms}`;};
    const c=subs.map((s,i)=>`${i+1}\n${fmt(s.start)} --> ${fmt(s.end)}\n${s.text}\n`).join("\n");
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([c],{type:"text/plain"}));a.download="subtitles.srt";a.click();
    notify("Fichier SRT téléchargé !","success");
  };

  const TABS=[{id:"captions",icon:"✨",l:"Captions"},{id:"styles",icon:"🎨",l:"Styles"},{id:"edit",icon:"🎭",l:"Effets"},{id:"timing",icon:"⏱",l:"Timing"},{id:"config",icon:"⚙️",l:"Config"}];
  const EFF_ALL=["MrBeast flash","Karaoke","Word pop","Cinematic","Double line","Use caps","Popup","Waves","Shake","Rotations","Shadow","Letter spacing","Glowy","Fade in","Fade out","Zoom","Background","Italic","Up","Bounce","Blur in","Scale out"];
  const EFF_LINE=["Highlight","Zoom","Popup","Fade","Smooth thickness"];
  const EFF_WORD=["Highlight","Fade","Typing","Zoom","Popup","Background","Smooth thickness","Emphasize"];
  const FONTS=["Impact","Outfit","Syne","Bebas Neue","Montserrat","Oswald","Poppins","DM Sans","JetBrains Mono"];

  const activeStyle=SUBTITLE_STYLES.find(s=>s.id===styleId)||SUBTITLE_STYLES[0];
  const hasEff=(name)=>activeEff.includes(name)||activeLineEff.includes(name)||activeWordEff.includes(name);

  // Build live style — correct scale for 270px preview phone
  const _previewScale=0.68; // phone preview is ~68% of 380px export width
  const _pxSize=Math.round(activeStyle.preview.size*(270/380)*(fontSize/68)*_previewScale);
  const _clampedPx=Math.max(9,Math.min(_pxSize,24)); // hard cap 24px in preview

  // Strip emojis if noEmoji is on
  const _stripEmoji=(t)=>noEmoji?t.replace(/[\u{1F300}-\u{1FFFF}\u{2600}-\u{27FF}\u{FE00}-\u{FEFF}]/gu,"").trim():t;

  const liveSubStyle={
    fontFamily:fontFam||activeStyle.preview.font,
    fontSize:`${_clampedPx}px`,
    fontWeight:activeStyle.preview.weight,
    color:activeStyle.preview.color,
    textShadow:hasEff("Shadow")?`${activeStyle.preview.shadow},0 0 24px ${activeStyle.preview.color}55`:activeStyle.preview.shadow,
    textTransform:hasEff("Use caps")?"uppercase":activeStyle.preview.transform,
    background:hasEff("Background")?"rgba(0,0,0,.82)":activeStyle.preview.bg,
    padding:(activeStyle.preview.bg!=="transparent"||hasEff("Background"))?"4px 12px":"0 2px",
    borderRadius:"7px",
    display:"inline-block",
    lineHeight:1.25,
    maxWidth:singleLine?"none":"90%",
    whiteSpace:singleLine?"nowrap":"normal",
    wordBreak:singleLine?"normal":"break-word",
    textAlign:"center",
    letterSpacing:hasEff("Letter spacing")?"0.08em":"normal",
    fontStyle:hasEff("Italic")?"italic":"normal",
    boxShadow:hasEff("Glowy")?`0 0 14px ${activeStyle.preview.color}88`:"none",
    filter:hasEff("Glowy")?`drop-shadow(0 0 8px ${activeStyle.preview.color})`:"none",
    animation:hasEff("MrBeast flash")?"subtitlePop .15s cubic-bezier(.34,1.56,.64,1) both":
              hasEff("Shake")?"shake .4s ease infinite":
              hasEff("Bounce")?"bounce 1s ease infinite":
              hasEff("Popup")?"subtitlePop .3s cubic-bezier(.34,1.56,.64,1) both":
              hasEff("Zoom")?"breathe 1.8s ease infinite":
              hasEff("Waves")?"float 2s ease infinite":
              hasEff("Fade in")?"fadeIn .5s ease both":
              hasEff("Fade out")?"fadeOut .5s ease both":
              "none",
    overflow:singleLine?"hidden":"visible",
    textOverflow:singleLine?"ellipsis":"clip",
  };

  return(
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:T.bg,overflow:"hidden"}}>
      {shortcut&&<div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",padding:"8px 18px",borderRadius:10,background:T.surf3,border:`1px solid ${T.border}`,fontSize:13,fontWeight:700,zIndex:999,animation:"popIn .2s ease",pointerEvents:"none",boxShadow:"0 4px 20px rgba(0,0,0,.5)"}}>{shortcut}</div>}

      {/* Top bar — premium dark glass */}
      <div style={{padding:"10px 20px",borderBottom:`1px solid rgba(255,255,255,.06)`,display:"flex",alignItems:"center",gap:10,background:"rgba(5,6,16,.95)",backdropFilter:"blur(20px)",flexShrink:0}}>
        <button onClick={onBack} style={{padding:"6px 14px",borderRadius:9,background:"rgba(255,255,255,.05)",border:`1px solid rgba(255,255,255,.08)`,color:T.muted,fontSize:12,display:"flex",alignItems:"center",gap:5,cursor:"pointer",transition:"all .15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.16)"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.08)"}>← Retour</button>
        <div style={{width:1,height:18,background:"rgba(255,255,255,.08)"}}/>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:22,height:22,borderRadius:6,background:T.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10}}>✦</div>
          <span style={{fontSize:12,color:T.text,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:220}}>{file?.name||"Nouvelle vidéo"}</span>
          <span style={{fontSize:10,padding:"2px 8px",borderRadius:20,background:`${T.acc}15`,border:`1px solid ${T.acc}30`,color:T.acc,fontWeight:700}}>{styleId}</span>
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:6,alignItems:"center"}}>
          <Tooltip text="Ctrl+Z"><button onClick={undo} disabled={!undoStack.length} style={{width:30,height:30,borderRadius:8,background:"rgba(255,255,255,.04)",border:`1px solid rgba(255,255,255,.07)`,color:undoStack.length?T.text:T.dim,cursor:undoStack.length?"pointer":"not-allowed",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}>↩</button></Tooltip>
          <Tooltip text="Ctrl+Y"><button onClick={redo} disabled={!redoStack.length} style={{width:30,height:30,borderRadius:8,background:"rgba(255,255,255,.04)",border:`1px solid rgba(255,255,255,.07)`,color:redoStack.length?T.text:T.dim,cursor:redoStack.length?"pointer":"not-allowed",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}>↪</button></Tooltip>
          <div style={{width:1,height:18,background:"rgba(255,255,255,.06)"}}/>
          <Btn v="dark" size="sm" onClick={()=>setShowTrans(true)} icon="🌍">Traduire</Btn>
          <button onClick={()=>setShowExport(true)} className="shimmer-btn" style={{display:"flex",alignItems:"center",gap:7,padding:"7px 18px",borderRadius:9,background:T.grad,border:"none",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",boxShadow:`0 4px 20px ${T.accGlow}`}}>⬆ Exporter</button>
        </div>
      </div>

      <div style={{flex:1,display:"grid",gridTemplateColumns:"400px 1fr",overflow:"hidden"}} className="editor-grid">
        {/* LEFT: Phone preview */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",borderRight:`1px solid rgba(255,255,255,.05)`,background:"linear-gradient(180deg,#02030f,#040510)",overflow:"hidden",position:"relative"}} className="hide-mobile">
          {/* Ambient glow */}
          <div style={{position:"absolute",top:"35%",left:"50%",transform:"translateX(-50%)",width:280,height:280,borderRadius:"50%",background:`radial-gradient(${T.acc}15,transparent 70%)`,filter:"blur(60px)",pointerEvents:"none"}}/>
          {/* Phone — flex:1 so it takes all available space */}
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",zIndex:1,minHeight:0}}>
            <div style={{position:"relative"}}
              onMouseEnter={e=>e.currentTarget.style.transform="scale(1.02)"}
              onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
              style={{transition:"transform .25s ease",position:"relative"}}>
              <div style={{position:"absolute",inset:-16,background:`radial-gradient(${T.acc}14,${T.purple}06 50%,transparent 70%)`,filter:"blur(28px)",animation:"glowPulse 3s ease infinite",pointerEvents:"none"}}/>
              <PhoneMockup subs={subs} currentTime={ct} styleId={styleId} fontSize={fontSize} fontFamily={fontFam} playing={playing} onToggle={()=>{setPlaying(p=>{const next=!p;if(videoRef.current){next?videoRef.current.play():videoRef.current.pause();}return next;});}} liveStyle={liveSubStyle} subYPos={subYPos} onSubYChange={setSubYPos} stripEmoji={_stripEmoji} displayMode={displayMode} videoFile={file} videoRef={videoRef} onTimeUpdate={(t)=>setCt(t)}/>
            </div>
          </div>
          {/* Controls — fixed compact strip at bottom */}
          <div style={{flexShrink:0,width:"100%",padding:"10px 20px 14px",borderTop:`1px solid rgba(255,255,255,.05)`,background:"rgba(2,3,10,.7)",backdropFilter:"blur(16px)",zIndex:2,display:"flex",flexDirection:"column",gap:8}}>
            {/* Mode display — mot par mot / phrase */}
            <div style={{display:"flex",gap:4,marginBottom:4}}>
              {[["Mot par mot","word"],["Phrase entière","phrase"]].map(([label,mode])=>(
                <button key={mode} onClick={()=>setDisplayMode(mode)}
                  style={{flex:1,padding:"5px 8px",borderRadius:7,background:displayMode===mode?`${T.acc}20`:"rgba(255,255,255,.04)",border:displayMode===mode?`1px solid ${T.acc}40`:"1px solid rgba(255,255,255,.07)",color:displayMode===mode?T.acc:T.muted,fontSize:10,fontWeight:700,cursor:"pointer",transition:"all .15s"}}>
                  {label}
                </button>
              ))}
            </div>
            {/* Play row + style badge */}
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <button onClick={()=>setCt(0)} style={{width:28,height:28,borderRadius:7,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.08)",color:T.muted,fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>⏮</button>
              <button onClick={()=>setPlaying(p=>!p)} style={{width:36,height:36,borderRadius:10,background:T.grad,border:"none",color:"#fff",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 3px 14px ${T.accGlow}`,flexShrink:0}}>
                {playing?"⏸":"▶"}
              </button>
              <button onClick={()=>setShowExport(true)} style={{width:28,height:28,borderRadius:7,background:`${T.acc}15`,border:`1px solid ${T.acc}30`,color:T.acc,fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>⬆</button>
              <div style={{flex:1,padding:"4px 10px",borderRadius:20,background:`${T.acc}10`,border:`1px solid ${T.acc}20`,fontSize:10,color:T.acc,fontWeight:600,textAlign:"center",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>✦ {activeStyle.label}</div>
            </div>
            {/* Position slider */}
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:9,color:T.muted,fontWeight:600,flexShrink:0,letterSpacing:".04em",textTransform:"uppercase"}}>Position</span>
              <input type="range" min={4} max={80} value={subYPos} onChange={e=>setSubYPos(+e.target.value)} style={{flex:1,accentColor:T.acc,cursor:"pointer",height:3}}/>
              <span style={{fontSize:9,color:T.acc,fontFamily:"JetBrains Mono",fontWeight:700,flexShrink:0,minWidth:28,textAlign:"right"}}>{subYPos}%</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Tabs panel */}
        <div style={{display:"flex",flexDirection:"column",overflow:"hidden",background:T.bg}}>
          {/* Tab bar */}
          <div style={{display:"flex",borderBottom:`1px solid rgba(255,255,255,.05)`,background:"rgba(6,7,18,.98)",flexShrink:0,overflowX:"auto",padding:"0 4px"}}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"12px 16px",background:"transparent",border:"none",borderBottom:`2px solid ${tab===t.id?T.acc:"transparent"}`,color:tab===t.id?T.text:T.muted,fontSize:12,fontWeight:tab===t.id?700:500,display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap",transition:"all .15s",cursor:"pointer",letterSpacing:"-.01em"}}>
                <span style={{fontSize:14}}>{t.icon}</span>{t.l}
              </button>
            ))}
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"14px 16px",scrollbarWidth:"thin"}}>

            {/* CAPTIONS */}
            {tab==="captions"&&(
              <div style={{display:"flex",flexDirection:"column"}}>
                {/* Header */}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:12,fontWeight:700}}>{subs.length} sous-titres</span>
                    <span style={{fontSize:10,color:T.muted}}>· clique pour éditer</span>
                  </div>
                  <div style={{display:"flex",gap:5}}>
                    <Btn v="dark" size="sm" onClick={()=>{saveSubs([...subs,{id:Date.now(),start:subs[subs.length-1]?.end+0.5||0,end:subs[subs.length-1]?.end+1.5||1,text:"Nouveau sous-titre"}]);}} icon="➕">Ajouter</Btn>
                    <Btn v="ghost" size="sm" onClick={()=>saveSubs(genSubs())} icon="↺">Reset</Btn>
                  </div>
                </div>
                {/* List */}
                <div style={{background:T.surf,borderRadius:10,border:`1px solid ${T.border}`,overflow:"hidden"}}>
                  {subs.map((sub,i)=>{
                    const isActive=sub.id===subs.find(s=>ct>=s.start&&ct<=s.end)?.id;
                    const isEditing=editId===sub.id;
                    return(
                      <div key={sub.id}
                        style={{display:"flex",alignItems:"center",gap:0,borderBottom:i<subs.length-1?`1px solid rgba(255,255,255,.04)`:"none",background:isActive?`${T.acc}0d`:"transparent",transition:"background .15s",position:"relative"}}
                        className="caption-row">
                        {/* Active indicator */}
                        {isActive&&<div style={{position:"absolute",left:0,top:0,bottom:0,width:2,background:T.acc,borderRadius:"0 1px 1px 0"}}/>}
                        {/* Timestamp */}
                        <div style={{width:70,flexShrink:0,padding:"0 0 0 12px",fontFamily:"JetBrains Mono",fontSize:8.5,color:isActive?T.acc:T.dim,lineHeight:1.2,userSelect:"none"}}>
                          <div>{sub.start.toFixed(1)}s</div>
                          <div>{sub.end.toFixed(1)}s</div>
                        </div>
                        {/* Separator */}
                        <div style={{width:1,height:28,background:"rgba(255,255,255,.05)",flexShrink:0}}/>
                        {/* Content */}
                        <div style={{flex:1,padding:"8px 10px",minWidth:0}}>
                          {isEditing?(
                            <div style={{display:"flex",gap:5,alignItems:"center"}}>
                              <textarea value={editTxt} onChange={e=>setEditTxt(e.target.value)}
                                onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();saveSubs(subs.map(s=>s.id===sub.id?{...s,text:editTxt}:s));setEditId(null);}if(e.key==="Escape")setEditId(null);}}
                                style={{flex:1,padding:"5px 9px",borderRadius:7,fontSize:12,resize:"none",height:34,lineHeight:1.5,background:T.bg,border:`1.5px solid ${T.acc}`,color:T.text,outline:"none"}} autoFocus/>
                              <button onClick={()=>{saveSubs(subs.map(s=>s.id===sub.id?{...s,text:editTxt}:s));setEditId(null);}} style={{height:28,padding:"0 10px",borderRadius:6,background:`${T.green}20`,border:`1px solid ${T.green}40`,color:T.green,fontSize:12,cursor:"pointer",fontWeight:700}}>✓</button>
                              <button onClick={()=>setEditId(null)} style={{height:28,padding:"0 8px",borderRadius:6,background:"transparent",border:`1px solid ${T.border}`,color:T.muted,fontSize:12,cursor:"pointer"}}>✕</button>
                            </div>
                          ):(
                            <div style={{display:"flex",flexWrap:"wrap",gap:3,cursor:"text"}}
                              onClick={()=>{setEditId(sub.id);setEditTxt(sub.text);}}>
                              {sub.text.split(" ").map((w,wi)=>(
                                <span key={wi} style={{fontSize:12,fontWeight:500,color:isActive?T.text:"rgba(220,225,255,.8)",padding:"1px 0",letterSpacing:"-.01em",transition:"color .1s"}}
                                  onMouseEnter={e=>e.currentTarget.style.color=T.acc}
                                  onMouseLeave={e=>e.currentTarget.style.color=isActive?T.text:"rgba(220,225,255,.8)"}>{w}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        {/* Delete — always visible, subtle */}
                        {!isEditing&&(
                          <button onClick={e=>{e.stopPropagation();saveSubs(subs.filter(s=>s.id!==sub.id));}} style={{width:28,height:"100%",minHeight:36,flexShrink:0,background:"transparent",border:"none",color:"rgba(232,57,112,.35)",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"color .15s",marginRight:4}}
                            onMouseEnter={e=>e.currentTarget.style.color=T.pink}
                            onMouseLeave={e=>e.currentTarget.style.color="rgba(232,57,112,.35)"}>×</button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STYLES */}
            {tab==="styles"&&(
              <div>
                <div style={{fontSize:12,color:T.muted,marginBottom:12,fontWeight:600}}>Sélectionne un style :</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {SUBTITLE_STYLES.map(s=>(
                    <div key={s.id} onClick={()=>{setStyleId(s.id);notify(`Style "${s.label}" appliqué !`,"success");}} style={{borderRadius:12,border:`2px solid ${styleId===s.id?T.acc:"rgba(255,255,255,.07)"}`,overflow:"hidden",cursor:"pointer",transition:"all .18s",transform:styleId===s.id?"scale(1.03)":"scale(1)",boxShadow:styleId===s.id?`0 0 20px ${T.acc}30`:"none"}}>
                      <div style={{height:76,background:"linear-gradient(145deg,#030410,#07081a)",display:"flex",alignItems:"center",justifyContent:"center",padding:8,position:"relative"}}>
                        {s.badge&&<div style={{position:"absolute",top:5,left:5,padding:"1px 6px",borderRadius:4,background:`${T.acc}20`,border:`1px solid ${T.acc}40`,fontSize:8,color:T.acc,fontWeight:700}}>{s.badge}</div>}
                        {styleId===s.id&&<div style={{position:"absolute",top:5,right:5,width:14,height:14,borderRadius:"50%",background:T.acc,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#fff"}}>✓</div>}
                        <span style={{fontFamily:s.preview.font,fontSize:`${Math.round(s.preview.size*.24)}px`,fontWeight:s.preview.weight,color:s.preview.color,textShadow:s.preview.shadow,textTransform:s.preview.transform,background:s.preview.bg,padding:s.preview.bg!=="transparent"?"3px 8px":"0",borderRadius:"4px",textAlign:"center",lineHeight:1.2,maxWidth:"100%"}}>APERÇU</span>
                      </div>
                      <div style={{padding:"5px 8px",background:"rgba(6,7,18,.95)",borderTop:`1px solid rgba(255,255,255,.06)`}}>
                        <span style={{fontSize:10,fontWeight:700,color:styleId===s.id?T.acc:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",display:"block"}}>{s.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EDIT — Beautiful effects with visual previews */}
            {tab==="edit"&&(
              <div style={{display:"flex",flexDirection:"column",gap:16}}>
                {/* Live preview strip */}
                <div style={{padding:"12px 16px",borderRadius:14,background:"linear-gradient(135deg,rgba(91,108,255,.08),rgba(168,85,247,.05))",border:`1px solid ${T.acc}25`,display:"flex",alignItems:"center",gap:12}}>
                  <div style={{fontSize:20}}>✦</div>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,marginBottom:2}}>Aperçu en temps réel</div>
                    <div style={{fontSize:11,color:T.muted}}>Les effets s'appliquent instantanément sur le téléphone à gauche</div>
                  </div>
                </div>

                {/* All effects */}
                <div style={{background:T.surf,borderRadius:14,border:`1px solid rgba(255,255,255,.07)`,overflow:"hidden"}}>
                  <div style={{padding:"12px 16px",borderBottom:`1px solid rgba(255,255,255,.06)`,display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:28,height:28,borderRadius:8,background:`${T.acc}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>📌</div>
                    <div>
                      <div style={{fontWeight:700,fontSize:13}}>Effets globaux</div>
                      <div style={{fontSize:10,color:T.muted}}>Appliqués sur tous les sous-titres</div>
                    </div>
                    {activeEff.length>0&&<span style={{marginLeft:"auto",fontSize:10,padding:"2px 8px",borderRadius:20,background:`${T.acc}20`,color:T.acc,fontWeight:700}}>{activeEff.length} actif{activeEff.length>1?"s":""}</span>}
                  </div>
                  <div style={{padding:14,display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                    {EFF_ALL.map(eff=>{
                      const on=activeEff.includes(eff);
                      const icons={"MrBeast flash":"🔥","Karaoke":"🎤","Word pop":"💬","Cinematic":"🎬","Bounce":"🏀","Blur in":"🌫","Scale out":"↗","Double line":"≡","Use caps":"AA","Popup":"⚡","Waves":"〜","Shake":"💥","Rotations":"↺","Shadow":"◼","Letter spacing":"↔","Glowy":"✨","Fade in":"▶","Fade out":"◀","Zoom":"⊕","Background":"▪","Italic":"𝘐","Up":"↑"};
                      return(
                        <button key={eff} onClick={()=>setActiveEff(p=>on?p.filter(x=>x!==eff):[...p,eff])} style={{padding:"8px 10px",borderRadius:10,background:on?`linear-gradient(135deg,${T.acc},${T.purple})`:T.surf2,border:`1px solid ${on?T.acc+"60":"rgba(255,255,255,.06)"}`,color:on?"#fff":T.muted,fontSize:11,fontWeight:on?700:400,transition:"all .15s",cursor:"pointer",display:"flex",alignItems:"center",gap:6,textAlign:"left",boxShadow:on?`0 4px 16px ${T.acc}40`:"none"}}>
                          <span style={{fontSize:13,opacity:.8}}>{icons[eff]||"◈"}</span>
                          <span>{eff}</span>
                          {on&&<span style={{marginLeft:"auto",fontSize:9}}>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Line effects */}
                <div style={{background:T.surf,borderRadius:14,border:`1px solid rgba(255,255,255,.07)`,overflow:"hidden"}}>
                  <div style={{padding:"12px 16px",borderBottom:`1px solid rgba(255,255,255,.06)`,display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:28,height:28,borderRadius:8,background:`${T.purple}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>📄</div>
                    <div>
                      <div style={{fontWeight:700,fontSize:13}}>Effets par ligne</div>
                      <div style={{fontSize:10,color:T.muted}}>Ligne par ligne</div>
                    </div>
                    {activeLineEff.length>0&&<span style={{marginLeft:"auto",fontSize:10,padding:"2px 8px",borderRadius:20,background:`${T.purple}20`,color:T.purple,fontWeight:700}}>{activeLineEff.length} actif{activeLineEff.length>1?"s":""}</span>}
                  </div>
                  <div style={{padding:14,display:"flex",flexWrap:"wrap",gap:6}}>
                    {EFF_LINE.map(eff=>{
                      const on=activeLineEff.includes(eff);
                      return(
                        <button key={eff} onClick={()=>setActiveLineEff(p=>on?p.filter(x=>x!==eff):[...p,eff])} style={{padding:"7px 14px",borderRadius:9,background:on?`${T.purple}25`:T.surf2,border:`1px solid ${on?T.purple+"60":"rgba(255,255,255,.06)"}`,color:on?T.purple:T.muted,fontSize:11,fontWeight:on?700:400,transition:"all .15s",cursor:"pointer",boxShadow:on?`0 2px 12px ${T.purple}30`:"none"}}>{eff}</button>
                      );
                    })}
                  </div>
                </div>

                {/* Word effects */}
                <div style={{background:T.surf,borderRadius:14,border:`1px solid rgba(255,255,255,.07)`,overflow:"hidden"}}>
                  <div style={{padding:"12px 16px",borderBottom:`1px solid rgba(255,255,255,.06)`,display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:28,height:28,borderRadius:8,background:`${T.cyan}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🔤</div>
                    <div>
                      <div style={{fontWeight:700,fontSize:13}}>Effets par mot</div>
                      <div style={{fontSize:10,color:T.muted}}>Mot par mot</div>
                    </div>
                    {activeWordEff.length>0&&<span style={{marginLeft:"auto",fontSize:10,padding:"2px 8px",borderRadius:20,background:`${T.cyan}20`,color:T.cyan,fontWeight:700}}>{activeWordEff.length} actif{activeWordEff.length>1?"s":""}</span>}
                  </div>
                  <div style={{padding:14,display:"flex",flexWrap:"wrap",gap:6}}>
                    {EFF_WORD.map(eff=>{
                      const on=activeWordEff.includes(eff);
                      return(
                        <button key={eff} onClick={()=>setActiveWordEff(p=>on?p.filter(x=>x!==eff):[...p,eff])} style={{padding:"7px 14px",borderRadius:9,background:on?`${T.cyan}20`:T.surf2,border:`1px solid ${on?T.cyan+"55":"rgba(255,255,255,.06)"}`,color:on?T.cyan:T.muted,fontSize:11,fontWeight:on?700:400,transition:"all .15s",cursor:"pointer",boxShadow:on?`0 2px 12px ${T.cyan}25`:"none"}}>{eff}</button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* CONFIG */}
            {tab==="config"&&(
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {/* Quick toggles — SmartEdit-style */}
                <div style={{background:T.surf,borderRadius:12,border:`1px solid ${T.border}`,padding:"14px 16px"}}>
                  <div style={{fontWeight:700,fontSize:12,marginBottom:12,color:T.muted,letterSpacing:".06em",textTransform:"uppercase"}}>Options d'affichage</div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {[
                      {label:"Ligne unique",desc:"Forcer une seule ligne (pas de retour à la ligne)",state:singleLine,set:setSingleLine,icon:"↔"},
                      {label:"Désactiver les emojis",desc:"Masquer tous les emojis dans l'aperçu",state:noEmoji,set:setNoEmoji,icon:"🚫"},
                    ].map(opt=>(
                      <div key={opt.label} onClick={()=>opt.set(v=>!v)} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",borderRadius:10,background:opt.state?`${T.acc}10`:"transparent",border:`1px solid ${opt.state?T.acc+"40":"rgba(255,255,255,.05)"}`,cursor:"pointer",transition:"all .15s",userSelect:"none"}}>
                        <span style={{fontSize:14,flexShrink:0}}>{opt.icon}</span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:12,fontWeight:700,color:opt.state?T.text:T.muted}}>{opt.label}</div>
                          <div style={{fontSize:10,color:T.dim,marginTop:1}}>{opt.desc}</div>
                        </div>
                        <div style={{width:32,height:18,borderRadius:9,background:opt.state?T.acc:"rgba(255,255,255,.08)",border:`1px solid ${opt.state?T.acc:"rgba(255,255,255,.12)"}`,position:"relative",flexShrink:0,transition:"all .2s"}}>
                          <div style={{position:"absolute",top:2,left:opt.state?14:2,width:12,height:12,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,.3)"}}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Typography */}
                <div style={{background:T.surf,borderRadius:12,border:`1px solid ${T.border}`,padding:"14px 16px"}}>
                  <div style={{fontWeight:700,fontSize:12,marginBottom:12,color:T.muted,letterSpacing:".06em",textTransform:"uppercase"}}>Typographie</div>
                  <div style={{marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <span style={{fontSize:12,color:T.muted,fontWeight:600}}>Taille police</span>
                      <span style={{fontSize:11,color:T.acc,fontFamily:"JetBrains Mono",fontWeight:700}}>{fontSize}px</span>
                    </div>
                    <input type="range" min={28} max={120} value={fontSize} onChange={e=>setFontSize(+e.target.value)} style={{width:"100%",accentColor:T.acc}}/>
                  </div>
                  <div style={{marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <span style={{fontSize:12,color:T.muted,fontWeight:600}}>Max caractères</span>
                      <span style={{fontSize:11,color:T.acc,fontFamily:"JetBrains Mono",fontWeight:700}}>{maxChars}</span>
                    </div>
                    <input type="range" min={4} max={30} value={maxChars} onChange={e=>setMaxChars(+e.target.value)} style={{width:"100%",accentColor:T.acc}}/>
                  </div>
                  <Select label="Police" value={fontFam} onChange={setFontFam} options={FONTS}/>
                </div>
                {/* Templates */}
                <div style={{background:T.surf,borderRadius:12,border:`1px solid ${T.border}`,padding:"14px 16px"}}>
                  <div style={{fontWeight:700,fontSize:12,marginBottom:12,color:T.muted,letterSpacing:".06em",textTransform:"uppercase"}}>Templates sauvegardés</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:8,marginBottom:8}}>
                    <input placeholder="Nom du template..." style={{padding:"8px 11px",borderRadius:9,fontSize:12,background:T.surf3,border:`1px solid ${T.border}`,color:T.text}}/>
                    <Btn v="dark" size="sm" onClick={()=>notify("Template sauvegardé !","success")}>Sauver</Btn>
                  </div>
                  <Select label="Charger" value="" onChange={()=>{}} options={[{value:"",label:"-- Sélectionner --"},...TEMPLATES.map(t=>({value:t.id,label:t.name}))]}/>
                </div>
              </div>
            )}

            {tab==="footage"&&(
              <div style={{display:"flex",flexDirection:"column",gap:16}}>
                <div style={{padding:"14px 16px",borderRadius:14,background:`${T.acc}08`,border:`1px solid ${T.acc}22`}}>
                  <div style={{fontWeight:700,fontSize:13,marginBottom:4}}>🎬 Importer un fond vidéo</div>
                  <div style={{fontSize:11,color:T.muted}}>Colle l'URL d'une vidéo YouTube ou TikTok pour l'utiliser comme fond dans l'aperçu.</div>
                </div>
                {/* Source selector */}
                <div style={{display:"flex",gap:6}}>
                  {[["youtube","▶ YouTube"],["tiktok","🎵 TikTok"],["upload","📁 Fichier"]].map(([id,label])=>(
                    <button key={id} onClick={()=>setFootageType(id)} style={{flex:1,padding:"8px",borderRadius:9,background:footageType===id?`${T.acc}20`:"transparent",border:`1px solid ${footageType===id?T.acc:"rgba(255,255,255,.07)"}`,color:footageType===id?T.acc:T.muted,fontSize:11,fontWeight:footageType===id?700:400,cursor:"pointer",transition:"all .15s"}}>{label}</button>
                  ))}
                </div>
                {footageType!=="upload"&&(
                  <div>
                    <label style={{fontSize:12,color:T.muted,display:"block",marginBottom:7,fontWeight:600}}>URL de la vidéo</label>
                    <div style={{position:"relative"}}>
                      <input value={footageUrl} onChange={e=>setFootageUrl(e.target.value)} placeholder={footageType==="youtube"?"https://www.youtube.com/shorts/...":"https://www.tiktok.com/@user/video/..."} style={{width:"100%",background:"rgba(255,255,255,.05)",border:`1px solid rgba(255,255,255,.1)`,borderRadius:9,padding:"9px 13px",color:"#fff",fontSize:13}}/>
                    </div>
                    {footageUrl&&(
                      <div style={{marginTop:10,padding:"8px 12px",borderRadius:9,background:`${T.green}10`,border:`1px solid ${T.green}25`,fontSize:11,color:T.green}}>✓ URL prête — le fond sera chargé lors de l'export</div>
                    )}
                  </div>
                )}
                {footageType==="upload"&&(
                  <div style={{border:`2px dashed ${T.border}`,borderRadius:14,padding:"28px 20px",textAlign:"center",cursor:"pointer",transition:"all .2s"}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=T.acc}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
                    <div style={{fontSize:36,marginBottom:10}}>🎬</div>
                    <div style={{fontWeight:700,fontSize:13,marginBottom:4}}>Glisse ta vidéo ici</div>
                    <div style={{fontSize:11,color:T.muted}}>MP4, MOV, WEBM · Max 500 MB</div>
                  </div>
                )}
                {/* Preset backgrounds */}
                <div>
                  <div style={{fontSize:11,color:T.muted,fontWeight:700,marginBottom:10,letterSpacing:".04em"}}>FONDS POPULAIRES</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    {[
                      {label:"Minecraft parkour",emoji:"⛏️",color:"#22c55e"},
                      {label:"Subway surfers",emoji:"🏃",color:"#f59e0b"},
                      {label:"GTA satisfaisant",emoji:"🎮",color:"#a855f7"},
                      {label:"Fond abstrait IA",emoji:"✨",color:"#5b6cff"},
                    ].map(bg=>(
                      <button key={bg.label} onClick={()=>{setFootageType("preset");setFootageUrl(bg.label);notify(`Fond "${bg.label}" sélectionné !`,"success");}} style={{padding:"10px 12px",borderRadius:10,background:T.surf,border:`1px solid rgba(255,255,255,.07)`,cursor:"pointer",display:"flex",alignItems:"center",gap:8,transition:"all .15s",textAlign:"left"}}
                        onMouseEnter={e=>{e.currentTarget.style.borderColor=bg.color+"55";e.currentTarget.style.background=`${bg.color}0a`;}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.07)";e.currentTarget.style.background=T.surf;}}>
                        <span style={{fontSize:18}}>{bg.emoji}</span>
                        <span style={{fontSize:11,fontWeight:600,color:footageUrl===bg.label?bg.color:T.muted}}>{bg.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab==="timing"&&(
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <span style={{fontSize:12,color:T.muted,fontWeight:600}}>Ajuste le timing de chaque sous-titre</span>
                  <Btn v="ghost" size="sm" onClick={()=>{saveSubs(subs.map((s,i)=>({...s,start:+(i*.9+.1).toFixed(2),end:+(i*.9+.78).toFixed(2)})));notify("Timings réinitialisés","info");}}>↺ Reset</Btn>
                </div>
                {subs.map((sub,i)=>(
                  <div key={sub.id} style={{background:T.surf,borderRadius:10,border:`1px solid ${T.border}`,padding:"10px 12px"}}>
                    <div style={{fontSize:12,color:T.muted,marginBottom:7,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sub.text}</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                      {[{l:"Début (s)",val:sub.start,key:"start"},{l:"Fin (s)",val:sub.end,key:"end"}].map(f=>(
                        <div key={f.key}>
                          <label style={{fontSize:10,color:T.muted,display:"block",marginBottom:4,fontWeight:600}}>{f.l}</label>
                          <input type="number" step="0.1" min="0" value={f.val} onChange={e=>{const v=+e.target.value;saveSubs(subs.map(s=>s.id===sub.id?{...s,[f.key]:v}:s));}} style={{width:"100%",padding:"6px 10px",borderRadius:8,fontSize:12,fontFamily:"JetBrains Mono",background:T.bg,border:`1px solid ${T.border}`,color:T.acc}} onFocus={e=>e.target.style.borderColor=T.acc} onBlur={e=>e.target.style.borderColor=T.border}/>
                        </div>
                      ))}
                    </div>
                    <div style={{marginTop:7,height:4,background:T.border,borderRadius:2,overflow:"hidden"}}>
                      <div style={{height:"100%",background:T.acc,width:`${Math.min(((sub.end-sub.start)/1.5)*100,100)}%`,borderRadius:2}}/>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Translation Modal */}
      {showTrans&&(
        <Modal title="🌍 Traduction automatique" subtitle="Propulsé par Claude AI" onClose={()=>setShowTrans(false)} width={420}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:20}}>
            {LANGS.map(l=>(
              <button key={l.code} onClick={()=>setTransLang(l.code)} style={{padding:"8px 10px",borderRadius:8,background:transLang===l.code?`${T.acc}20`:"transparent",border:`1px solid ${transLang===l.code?T.acc:T.border}`,color:transLang===l.code?T.text:T.muted,fontSize:12,display:"flex",alignItems:"center",gap:6,cursor:"pointer",transition:"all .12s"}}>
                <span style={{fontSize:15}}>{l.flag}</span>{l.name}
              </button>
            ))}
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <Btn v="secondary" onClick={()=>setShowTrans(false)}>Annuler</Btn>
            <Btn onClick={translate} loading={translating}>Traduire ✦</Btn>
          </div>
        </Modal>
      )}

      {/* Export Modal */}
      {showExport&&(
        <Modal title="⬆ Exporter" subtitle={`${subs.length} sous-titres prêts à l'export`} onClose={()=>setShowExport(false)} width={420}>
          {[
            {icon:"🎬",title:"Vidéo MP4 avec sous-titres",desc:"Sous-titres incrustés dans la vidéo — bientôt disponible",badge:"Bientôt",action:()=>notify("🚀 Export MP4 arrive très bientôt !","info")},
            {icon:"📋",title:"Copier le texte brut",desc:"Juste le texte sans timing",action:()=>{navigator.clipboard?.writeText(subs.map(s=>s.text).join("\n"));notify("Texte copié !","success");}},
          ].map(e=>(
            <button key={e.title} onClick={e.action} style={{width:"100%",padding:"13px 16px",borderRadius:12,background:T.bg,border:`1px solid ${T.border}`,color:T.text,textAlign:"left",display:"flex",alignItems:"center",gap:14,cursor:"pointer",marginBottom:8,transition:"all .15s"}} onMouseEnter={e2=>{e2.currentTarget.style.borderColor=T.acc;e2.currentTarget.style.background=T.surf;}} onMouseLeave={e2=>{e2.currentTarget.style.borderColor=T.border;e2.currentTarget.style.background=T.bg;}}>
              <span style={{fontSize:24,flexShrink:0}}>{e.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:13}}>{e.title}</div>
                <div style={{color:T.muted,fontSize:11,marginTop:2}}>{e.desc}</div>
              </div>
              <span style={{color:T.muted,fontSize:16}}>→</span>
            </button>
          ))}
          <Btn v="secondary" onClick={()=>setShowExport(false)} full style={{marginTop:4}}>Fermer</Btn>
        </Modal>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════
   PAGE: PRICING (standalone)
══════════════════════════════════════════════ */
const PricingPage=({onBack,onSelect})=>{
  const [yearly,setYearly]=useState(true);
  return(
    <div style={{minHeight:"100vh",background:T.bg,padding:"0 24px 80px",position:"relative",overflow:"hidden"}} className="page">
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",top:"5%",left:"10%",width:500,height:500,borderRadius:"50%",background:`radial-gradient(${T.acc}10,transparent 70%)`,filter:"blur(70px)"}}/>
      </div>
      <div style={{maxWidth:1060,margin:"0 auto",position:"relative",zIndex:1}}>
        <nav style={{padding:"18px 0",display:"flex",alignItems:"center",gap:14,marginBottom:56}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:30,height:30,borderRadius:8,background:T.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>✦</div>
            <span style={{fontWeight:800,fontSize:17}}>SubCraft</span>
          </div>
          <Btn v="ghost" onClick={onBack} style={{marginLeft:"auto"}}>← Retour</Btn>
        </nav>
        <div style={{textAlign:"center",marginBottom:48}}>
          <h1 style={{fontWeight:900,fontSize:"clamp(30px,5vw,54px)",letterSpacing:"-.03em",marginBottom:12}}>
            Choisis ton plan, <em style={{fontStyle:"italic",background:T.grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>commence aujourd'hui</em>.
          </h1>
          <p style={{color:T.muted,marginBottom:28,fontSize:15}}>Choose the plan that fits your needs.</p>
          <div style={{display:"inline-flex",alignItems:"center",gap:16,padding:"12px 24px",borderRadius:100,background:T.surf,border:`1px solid ${T.border}`}}>
            <span style={{fontSize:14,fontWeight:yearly?400:700,color:yearly?T.muted:T.text}}>Mensuel</span>
            <Tog value={yearly} onChange={setYearly}/>
            <div>
              <span style={{fontSize:14,fontWeight:yearly?700:400,color:yearly?T.text:T.muted}}>Annuel</span>
              {yearly&&<div style={{fontSize:10,color:T.green,fontWeight:700}}>Jusqu'à −30% 🎉</div>}
            </div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:16,marginBottom:60}} className="mobile-grid1">
          {PLANS.map((plan,i)=>{
            const price=yearly?plan.priceY:plan.price;
            return(
              <div key={plan.id} style={{borderRadius:22,padding:"28px 22px",background:plan.popular?`linear-gradient(145deg,rgba(91,108,255,.12),rgba(168,85,247,.06),${T.surf})`:T.surf,border:`1.5px solid ${plan.popular?T.acc+"55":"rgba(255,255,255,.07)"}`,position:"relative",transition:"all .3s cubic-bezier(.22,1,.36,1)",animation:`fadeUp .4s ease ${i*.08}s both`,overflow:"hidden"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="perspective(600px) translateY(-8px) rotateX(1deg)";e.currentTarget.style.boxShadow=plan.popular?`0 24px 60px ${T.acc}25`:"0 20px 50px rgba(0,0,0,.5)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                {plan.popular&&(
                  <>
                    <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:T.grad}}/>
                    <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:`radial-gradient(ellipse at 50% 0%,${T.acc}08,transparent 60%)`,pointerEvents:"none"}}/>
                    <div style={{position:"absolute",top:16,right:16,padding:"3px 10px",borderRadius:20,background:T.grad,color:"#fff",fontSize:9,fontWeight:800,letterSpacing:".06em"}}>POPULAIRE</div>
                  </>
                )}
                <div style={{position:"relative",zIndex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:plan.color,boxShadow:`0 0 8px ${plan.color}`}}/>
                    <span style={{fontWeight:700,fontSize:12,color:plan.color,letterSpacing:".08em",textTransform:"uppercase"}}>{plan.name}</span>
                  </div>
                  <div style={{fontSize:11,color:T.muted,marginBottom:22}}>{plan.credits===Infinity?"Vidéos illimitées":`${plan.credits} vidéos / mois`}</div>
                  <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:6}}>
                    <span style={{fontSize:13,color:T.muted,fontWeight:400}}>€</span>
                    <span className="syne" style={{fontSize:56,fontWeight:800,lineHeight:1,color:plan.popular?T.acc:T.text,letterSpacing:"-.04em"}}>{price}</span>
                    <span style={{color:T.muted,fontSize:12,marginBottom:8,alignSelf:"flex-end"}}>/mois</span>
                  </div>
                  {yearly&&price>0&&(
                    <div style={{fontSize:11,marginBottom:20,display:"flex",alignItems:"center",gap:6}}>
                      <span style={{padding:"3px 8px",borderRadius:6,background:`${T.green}15`,color:T.green,fontWeight:700}}>💰 -{Math.round((1-plan.priceY/plan.price)*100)}% · Économise €{(plan.price-plan.priceY)*12}/an</span>
                      <span style={{color:T.muted,fontSize:10}}>TVA incluse</span>
                    </div>
                  )}
                  {!yearly&&price>0&&<div style={{height:30,marginBottom:20}}/>}
                  {price>0?(
                    <button onClick={()=>onSelect?.(plan.id,yearly)} className={plan.popular?"shimmer-btn":""} style={{width:"100%",padding:"12px",borderRadius:12,background:plan.popular?T.grad:"rgba(255,255,255,.06)",border:plan.popular?"none":"1px solid rgba(255,255,255,.1)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",transition:"all .2s",marginBottom:22,boxShadow:plan.popular?`0 6px 24px ${T.acc}40`:"none"}}
                      onMouseEnter={e=>!plan.popular&&(e.currentTarget.style.background="rgba(255,255,255,.1)")}
                      onMouseLeave={e=>!plan.popular&&(e.currentTarget.style.background="rgba(255,255,255,.06)")}>
                      Commencer →
                    </button>
                  ):(
                    <button onClick={()=>onBack?.()} style={{width:"100%",padding:"12px",borderRadius:12,background:"transparent",border:`1px solid rgba(255,255,255,.1)`,color:T.muted,fontSize:13,fontWeight:600,cursor:"pointer",marginBottom:22}}>Gratuit pour toujours</button>
                  )}
                  <div style={{height:1,background:"rgba(255,255,255,.05)",marginBottom:18}}/>
                  <div style={{display:"flex",flexDirection:"column",gap:7}}>
                    {plan.features.map(f=>(
                      <div key={f} style={{display:"flex",gap:8,fontSize:12,alignItems:"flex-start"}}>
                        <span style={{color:plan.popular?T.acc:T.green,flexShrink:0,marginTop:2,fontSize:10,background:`${plan.popular?T.acc:T.green}15`,padding:"2px 5px",borderRadius:4}}>✓</span>
                        <span style={{color:"rgba(220,225,255,.8)"}}>{f}</span>
                      </div>
                    ))}
                    {plan.locked.map(f=>(
                      <div key={f} style={{display:"flex",gap:8,fontSize:12,color:T.dim,alignItems:"flex-start"}}>
                        <span style={{flexShrink:0,marginTop:2}}>✗</span>{f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* FAQ */}
        <div style={{maxWidth:660,margin:"60px auto 0"}}>
          <h3 style={{fontWeight:800,fontSize:22,textAlign:"center",marginBottom:28}}>Questions fréquentes</h3>
          {[
            ["Puis-je annuler à tout moment ?","Oui, tu peux annuler ton abonnement à tout moment. Tu garderas l'accès jusqu'à la fin de la période payée."],
            ["Comment fonctionnent les vidéos ?","Chaque vidéo générée consomme 1 vidéo de ton quota mensuel. L'export SRT ne consomme rien."],
            ["Mes vidéos sont-elles sécurisées ?","Oui. Toutes les vidéos sont supprimées automatiquement 24h après l'upload. On ne stocke jamais tes contenus à long terme."],
            ["Y a-t-il un essai gratuit ?","Le plan Free te permet de tester avec 3 vidéos par mois, sans carte bancaire requise."],
          ].map(([q,a],i)=>(
            <FaqItem key={i} q={q} a={a}/>
          ))}
        </div>
      </div>
    </div>
  );
};

const FaqItem=({q,a})=>{
  const [open,setOpen]=useState(false);
  return(
    <div style={{borderBottom:`1px solid ${T.border}`,padding:"16px 0"}}>
      <button onClick={()=>setOpen(o=>!o)} style={{width:"100%",background:"none",border:"none",color:T.text,textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:15,fontWeight:600,cursor:"pointer",padding:0}}>
        {q}
        <span style={{color:T.muted,transition:"transform .2s",display:"inline-block",transform:open?"rotate(180deg)":"none",flexShrink:0,marginLeft:12}}>▾</span>
      </button>
      {open&&<div style={{color:T.muted,fontSize:14,lineHeight:1.7,marginTop:10,animation:"fadeDown .2s ease"}}>{a}</div>}
    </div>
  );
};

/* ══════════════════════════════════════════════
   PAGE: ADMIN PANEL
══════════════════════════════════════════════ */
const AdminRevenue=({users,planColor})=>{
  const pp={Free:0,Basic:10,Expert:13,Pro:21};
  const mrr=users.reduce((a,u)=>a+(pp[u.plan]||0),0);
  const paying=users.filter(u=>u.plan!=="Free"&&u.status==="active");
  const churn=3.2;
  const ltv=Math.round((pp.Basic+pp.Expert+pp.Pro)/3/churn*100);
  const cac=18;
  const hist=[280,310,295,340,380,410,445,420,480,510,540,mrr];
  const maxH=Math.max(...hist);
  const months=["Avr","Mai","Jui","Jul","Aoû","Sep","Oct","Nov","Déc","Jan","Fév","Mar"];
  return(
    <div className="page">
      <h1 style={{fontWeight:800,fontSize:22,marginBottom:24}}>💰 Revenus & Business</h1>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:12,marginBottom:24}} className="mobile-grid1">
        {[
          {icon:"📈",label:"MRR",value:"€"+mrr,color:T.green,detail:"+12% vs mois préc."},
          {icon:"🏆",label:"ARR",value:"€"+(mrr*12),color:T.acc,detail:"Projection annuelle"},
          {icon:"💎",label:"Abonnés payants",value:paying.length,color:T.yellow,detail:Math.round(paying.length/users.length*100)+"% des users"},
          {icon:"📉",label:"Churn mensuel",value:churn+"%",color:T.green,detail:"Objectif < 5%"},
          {icon:"💡",label:"LTV moyen",value:"€"+ltv,color:T.cyan,detail:"Lifetime Value"},
          {icon:"🎯",label:"CAC",value:"€"+cac,color:T.purple,detail:"LTV/CAC : "+(ltv/cac).toFixed(1)+"x"},
        ].map((k,i)=>(
          <div key={k.label} style={{padding:"16px 18px",borderRadius:13,background:T.surf,border:`1px solid ${T.border}`}}>
            <div style={{fontSize:20,marginBottom:8}}>{k.icon}</div>
            <div style={{fontFamily:"JetBrains Mono",fontWeight:900,fontSize:22,color:k.color,marginBottom:2}}>{k.value}</div>
            <div style={{fontSize:11,fontWeight:600,marginBottom:2}}>{k.label}</div>
            <div style={{fontSize:10,color:T.dim}}>{k.detail}</div>
          </div>
        ))}
      </div>
      <div style={{background:T.surf,borderRadius:16,border:`1px solid ${T.border}`,padding:"20px 24px",marginBottom:16}}>
        <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>📈 Évolution MRR — 12 mois</div>
        <div style={{fontSize:12,color:T.muted,marginBottom:14}}>MRR actuel : <strong style={{color:T.green}}>${mrr}</strong></div>
        <div style={{display:"flex",alignItems:"flex-end",gap:5,height:90}}>
          {hist.map((v,i)=>(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
              <div style={{width:"100%",borderRadius:"3px 3px 0 0",background:i===hist.length-1?T.green:T.acc+"80",height:Math.round((v/maxH)*84)+"px",position:"relative"}}>
                {i===hist.length-1&&<div style={{position:"absolute",top:-18,left:"50%",transform:"translateX(-50%)",fontSize:8,fontFamily:"JetBrains Mono",color:T.green,fontWeight:700,whiteSpace:"nowrap"}}>${v}</div>}
              </div>
              <div style={{fontSize:7,color:T.dim,fontFamily:"JetBrains Mono"}}>{months[i]}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}} className="mobile-grid1">
        <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:"18px 20px"}}>
          <div style={{fontWeight:700,fontSize:14,marginBottom:16}}>💎 Revenus par plan</div>
          {["Basic","Expert","Pro"].map(p=>{
            const cnt=users.filter(u=>u.plan===p&&u.status==="active").length;
            const rev=cnt*pp[p];
            const pct=mrr>0?Math.round(rev/mrr*100):0;
            const col={Basic:T.cyan,Expert:T.green,Pro:T.acc}[p];
            return(
              <div key={p} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:13,fontWeight:600,color:col}}>{p}</span>
                  <span style={{fontSize:11,color:T.muted,fontFamily:"JetBrains Mono"}}>${rev}/mo · {cnt} users</span>
                </div>
                <div style={{height:5,background:T.border,borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",width:pct+"%",background:col,borderRadius:3}}/>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:"18px 20px"}}>
          <div style={{fontWeight:700,fontSize:14,marginBottom:14}}>🔮 Projections</div>
          {[
            {label:"MRR dans 3 mois",value:"€"+Math.round(mrr*1.15),color:T.cyan},
            {label:"MRR dans 6 mois",value:"€"+Math.round(mrr*1.32),color:T.acc},
            {label:"MRR dans 12 mois",value:"€"+Math.round(mrr*1.78),color:T.green},
            {label:"ARR dans 12 mois",value:"€"+Math.round(mrr*1.78*12),color:T.yellow},
          ].map(p=>(
            <div key={p.label} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
              <span style={{fontSize:12,color:T.muted}}>{p.label}</span>
              <span style={{fontFamily:"JetBrains Mono",fontWeight:700,fontSize:14,color:p.color}}>{p.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const INIT_TICKETS=[
  {id:"TK-001",user:"Marie Dupont",email:"marie@gmail.com",plan:"Pro",sujet:"Problème transcription",time:"Il y a 2h",status:"open",priority:"high",log:[{from:"user",text:"Ma vidéo ne se transcrit pas correctement. J'obtiens des erreurs sur les accents français.",time:"09:12"},{from:"admin",text:"Bonjour Marie, merci de nous avoir contactés. Pouvez-vous nous donner le format de votre vidéo ?",time:"09:45"}]},
  {id:"TK-002",user:"Lucas Martin",email:"lucas@outlook.com",plan:"Basic",sujet:"Changer carte bancaire",time:"Il y a 4h",status:"open",priority:"medium",log:[{from:"user",text:"Comment changer ma carte bancaire ? Je n'arrive pas à trouver l'option.",time:"07:30"}]},
  {id:"TK-003",user:"Sofia Chen",email:"sofia@yahoo.fr",plan:"Expert",sujet:"Demande de fonctionnalité",time:"Il y a 1j",status:"resolved",priority:"low",log:[{from:"user",text:"Serait-il possible d'ajouter l'import de fichiers .SRT existants pour les ré-styler ?",time:"Hier 14:22"},{from:"admin",text:"Super suggestion ! On l'a ajoutée à notre roadmap. Merci Sofia !",time:"Hier 16:05"},{from:"user",text:"Merci beaucoup !",time:"Hier 16:30"},{from:"admin",text:"On vous préviendra dès que c'est en ligne. Ticket résolu ✓",time:"Hier 17:00"}]},
  {id:"TK-004",user:"Yann Bernard",email:"yann.b@proton.me",plan:"Free",sujet:"Bug timecodes SRT",time:"Il y a 2j",status:"pending",priority:"high",log:[{from:"user",text:"Quand j'exporte en SRT, les timecodes sont décalés de +2 secondes par rapport à la vidéo.",time:"Avant-hier 11:10"},{from:"admin",text:"Merci pour ce rapport de bug ! On l'a reproduit en interne. Fix en cours.",time:"Avant-hier 15:30"}]},
];

const AdminTickets=({planColor})=>{
  const [tickets,setTickets]=useState(INIT_TICKETS);
  const [active,setActive]=useState(null);
  const [reply,setReply]=useState("");
  const [filter,setFilter]=useState("all");
  const [aiLoading,setAiLoading]=useState(false);
  const statusColor={open:T.pink,pending:T.yellow,resolved:T.green};
  const priColor={high:T.pink,medium:T.yellow,low:T.cyan};

  // Charge les vrais chats depuis localStorage
  useEffect(()=>{
    try{
      const chatTickets=JSON.parse(localStorage.getItem("sc_chat_tickets")||"[]");
      const formatted=chatTickets.map((ct,i)=>({
        id:`CH-${String(i+1).padStart(3,"0")}`,
        user:ct.user,
        email:ct.email,
        plan:ct.plan||"Free",
        sujet:ct.msgs?.find(m=>m.from==="user")?.text?.slice(0,50)||"Chat en direct",
        time:`${ct.date} ${ct.time}`,
        status:ct.status||"open",
        priority:"medium",
        source:"chat",
        log:ct.msgs?.map(m=>({from:m.from==="user"?"user":"admin",text:m.text,time:ct.time}))||[],
      }));
      setTickets([...formatted,...INIT_TICKETS]);
    }catch{}
  },[]);

  const shown=tickets.filter(t=>filter==="all"||t.status===filter);

  // Suggestion IA via Claude
  const suggestAI=async()=>{
    if(!active)return;
    setAiLoading(true);
    try{
      const lastUserMsg=active.log.filter(m=>m.from==="user").slice(-1)[0]?.text||"";
      const r=await fetch("/api/anthropic",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        model:"claude-sonnet-4-20250514",max_tokens:300,
        system:"Tu es un agent support SubCraft. Génère une réponse professionnelle et concise (2-3 phrases) en français pour ce ticket utilisateur. SubCraft est un SaaS de sous-titres IA pour YouTube Shorts/TikTok/Reels.",
        messages:[{role:"user",content:`Message utilisateur : "${lastUserMsg}"\n\nRédige une réponse support appropriée.`}]
      })});
      const d=await r.json();
      setReply(d.content?.[0]?.text||"");
    }catch{notify("Erreur IA","error");}
    setAiLoading(false);
  };

  const send=()=>{
    if(!reply.trim()||!active)return;
    const msg={from:"admin",text:reply,time:"À l'instant"};
    setTickets(prev=>prev.map(t=>t.id===active.id?{...t,log:[...t.log,msg],status:"pending"}:t));
    setActive(prev=>({...prev,log:[...prev.log,msg]}));
    setReply("");
    notify("Réponse envoyée !","success");
  };
  return(
    <div className="page" style={{display:"flex",flexDirection:"column",height:"calc(100vh - 60px)",overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexShrink:0,flexWrap:"wrap",gap:8}}>
        <h1 style={{fontWeight:800,fontSize:22}}>🎫 Tickets & Chats Support</h1>
        <div style={{display:"flex",gap:5}}>
          {[["all","Tous"],["open","Ouverts"],["pending","En attente"],["resolved","Résolus"]].map(([id,label])=>(
            <button key={id} onClick={()=>setFilter(id)} style={{padding:"4px 11px",borderRadius:7,background:filter===id?T.acc+"20":"transparent",border:`1px solid ${filter===id?T.acc:T.border}`,color:filter===id?T.acc:T.muted,fontSize:11,fontWeight:filter===id?700:400,cursor:"pointer"}}>{label}</button>
          ))}
        </div>
      </div>
      <div style={{flex:1,display:"grid",gridTemplateColumns:"300px 1fr",gap:12,overflow:"hidden",minHeight:0}}>
        <div style={{overflowY:"auto",display:"flex",flexDirection:"column",gap:5}}>
          {shown.map(t=>(
            <div key={t.id} onClick={()=>setActive({...t})} style={{padding:"11px 13px",borderRadius:11,background:active&&active.id===t.id?T.acc+"10":T.surf,border:`1px solid ${active&&active.id===t.id?T.acc:T.border}`,cursor:"pointer",transition:"all .15s"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <div style={{display:"flex",gap:5,alignItems:"center"}}>
                  <span style={{fontSize:9,fontFamily:"JetBrains Mono",color:T.dim}}>{t.id}</span>
                  {t.source==="chat"&&<span style={{fontSize:8,padding:"1px 5px",borderRadius:4,background:`${T.acc}20`,color:T.acc,fontWeight:700}}>LIVE</span>}
                  <div style={{width:6,height:6,borderRadius:"50%",background:priColor[t.priority]}}/>
                </div>
                <span style={{fontSize:9,padding:"2px 6px",borderRadius:100,background:statusColor[t.status]+"18",color:statusColor[t.status],fontWeight:700}}>{t.status==="open"?"Ouvert":t.status==="pending"?"Attente":"Résolu"}</span>
              </div>
              <div style={{fontWeight:600,fontSize:12,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.sujet}</div>
              <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
                <Avatar name={t.user} size={16}/>
                <span style={{fontSize:10,color:T.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.user}</span>
              </div>
              <div style={{fontSize:9,color:T.dim}}>{t.time} · {t.log.length} msg</div>
            </div>
          ))}
          {shown.length===0&&<div style={{textAlign:"center",padding:"24px",color:T.muted,fontSize:12}}>Aucun ticket.</div>}
        </div>
        {active?(
          <div style={{background:T.surf,borderRadius:13,border:`1px solid ${T.border}`,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${T.border}`,flexShrink:0}}>
              <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:4,flexWrap:"wrap"}}>
                <span style={{fontSize:10,fontFamily:"JetBrains Mono",color:T.dim}}>{active.id}</span>
                <span style={{fontSize:10,padding:"2px 7px",borderRadius:100,background:statusColor[active.status]+"18",color:statusColor[active.status],fontWeight:700}}>{active.status==="open"?"Ouvert":active.status==="pending"?"En attente":"Résolu"}</span>
                <select value={active.status} onChange={e=>{const s=e.target.value;setTickets(prev=>prev.map(t=>t.id===active.id?{...t,status:s}:t));setActive(prev=>({...prev,status:s}));notify("Statut mis à jour","success");}} style={{marginLeft:"auto",padding:"3px 8px",borderRadius:7,background:T.surf2,border:`1px solid ${T.border}`,color:T.text,fontSize:10,cursor:"pointer"}}>
                  <option value="open">Ouvert</option><option value="pending">En attente</option><option value="resolved">Résolu</option>
                </select>
              </div>
              <div style={{fontWeight:700,fontSize:14,marginBottom:3}}>{active.sujet}</div>
              <div style={{display:"flex",gap:7,alignItems:"center"}}>
                <Avatar name={active.user} size={18}/>
                <span style={{fontSize:11,color:T.muted}}>{active.user} · {active.email}</span>
                <Tag color={planColor[active.plan]||T.muted}>{active.plan}</Tag>
              </div>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"12px 14px",display:"flex",flexDirection:"column",gap:9}}>
              {active.log.map((m,i)=>(
                <div key={i} style={{display:"flex",flexDirection:m.from==="admin"?"row-reverse":"row",gap:7,alignItems:"flex-end"}}>
                  {m.from==="user"?<Avatar name={active.user} size={24}/>:<div style={{width:24,height:24,borderRadius:"50%",background:T.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,flexShrink:0}}>A</div>}
                  <div style={{maxWidth:"75%"}}>
                    <div style={{padding:"8px 12px",borderRadius:m.from==="admin"?"11px 11px 3px 11px":"11px 11px 11px 3px",background:m.from==="admin"?T.acc:T.surf2,color:m.from==="admin"?"#fff":T.text,fontSize:12.5,lineHeight:1.5}}>{m.text}</div>
                    <div style={{fontSize:9,color:T.dim,marginTop:2,textAlign:m.from==="admin"?"right":"left"}}>{m.from==="admin"?"Admin":"User"} · {m.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{padding:"10px 13px",borderTop:`1px solid ${T.border}`,flexShrink:0,display:"flex",flexDirection:"column",gap:7}}>
              <div style={{display:"flex",gap:7}}>
                <textarea value={reply} onChange={e=>setReply(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&e.ctrlKey)send();}} placeholder="Répondre... (Ctrl+Entrée)" style={{flex:1,padding:"7px 11px",borderRadius:9,fontSize:12,background:T.bg,border:`1px solid ${T.border}`,color:T.text,resize:"none",height:48,lineHeight:1.5,fontFamily:"Outfit,sans-serif"}} onFocus={e=>e.target.style.borderColor=T.acc} onBlur={e=>e.target.style.borderColor=T.border}/>
                <button onClick={send} style={{width:36,borderRadius:9,background:reply.trim()?T.acc:T.border,border:"none",color:"#fff",cursor:reply.trim()?"pointer":"default",fontSize:15,flexShrink:0,transition:"background .2s"}}>↑</button>
              </div>
              <button onClick={suggestAI} disabled={aiLoading} style={{padding:"6px 12px",borderRadius:8,background:`${T.purple}18`,border:`1px solid ${T.purple}30`,color:T.purple,fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6,alignSelf:"flex-start"}}>
                {aiLoading?<span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>⟳</span>:"🤖"} {aiLoading?"Génération...":"Suggérer une réponse IA"}
              </button>
            </div>
          </div>
        ):(
          <div style={{background:T.surf,borderRadius:13,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:10,color:T.muted}}>
            <div style={{fontSize:38}}>💬</div>
            <div style={{fontWeight:600,fontSize:14,color:T.text}}>Sélectionne un ticket</div>
            <div style={{fontSize:12}}>Chats live + tickets email</div>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminCustomize=()=>{
  const [siteName,setSiteName]=useState("SubCraft");
  const [tagline,setTagline]=useState("Sous-titres IA pour créateurs viraux");
  const [accentColor,setAccentColor]=useState("#4f6dff");
  const [heroGrad,setHeroGrad]=useState("blue-purple");
  const [showLogo,setShowLogo]=useState(true);
  const [announcBar,setAnnouncBar]=useState(true);
  const [announcText,setAnnouncText]=useState("🎉 Offre spéciale : -30% sur le plan Expert ce mois-ci !");
  const [primaryFont,setPrimaryFont]=useState("Outfit");
  const [pricingMonthly,setPricingMonthly]=useState([{plan:"Basic",price:"10"},{plan:"Expert",price:"21"},{plan:"Pro",price:"42"}]);
  const [saved,setSaved]=useState(false);
  const colorPresets=[
    {id:"blue-purple",label:"Bleu Violet",a:"#4f6dff",b:"#9c6dff"},
    {id:"pink-orange",label:"Rose Feu",a:"#ff4f8a",b:"#ff7043"},
    {id:"green-cyan",label:"Vert Cyber",a:"#00e5a0",b:"#00d4ff"},
    {id:"gold-orange",label:"Gold Pro",a:"#ffd700",b:"#ff9500"},
    {id:"purple-pink",label:"Galaxy",a:"#9c6dff",b:"#ff4f8a"},
  ];
  const save=()=>{setSaved(true);notify("✅ Personnalisation sauvegardée !","success");setTimeout(()=>setSaved(false),2000);};
  return(
    <div className="page">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <div>
          <h1 style={{fontWeight:900,fontSize:22,marginBottom:4}}>🎨 Personnalisation du site</h1>
          <div style={{color:T.muted,fontSize:13}}>Modifie l'apparence et le contenu de ton site sans coder.</div>
        </div>
        <button onClick={save} className="btn-shimmer" style={{padding:"9px 22px",borderRadius:12,background:saved?T.green:T.grad,border:"none",color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer",boxShadow:`0 4px 20px ${saved?T.green:T.acc}44`,transition:"all .3s"}}>
          {saved?"✅ Sauvegardé !":"💾 Sauvegarder"}
        </button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}} className="mobile-grid1">
        {/* IDENTITE */}
        <div style={{background:T.surf,borderRadius:16,border:`1px solid ${T.border}`,padding:"20px 22px"}}>
          <div style={{fontWeight:800,fontSize:15,marginBottom:18}}>🏷️ Identité</div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Input label="Nom du site" value={siteName} onChange={setSiteName} icon="✦"/>
            <Input label="Accroche (tagline)" value={tagline} onChange={setTagline} icon="💬"/>
            <div>
              <label style={{fontSize:12,color:T.muted,display:"block",marginBottom:8,fontWeight:600}}>Police principale</label>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {["Outfit","Poppins","Inter","Space Grotesk","DM Sans"].map(f=>(
                  <button key={f} onClick={()=>setPrimaryFont(f)} style={{padding:"5px 12px",borderRadius:8,background:primaryFont===f?T.acc:T.bg,border:`1px solid ${primaryFont===f?T.acc:T.border}`,color:primaryFont===f?"#fff":T.muted,fontSize:12,fontWeight:primaryFont===f?700:400,cursor:"pointer",transition:"all .15s"}}>{f}</button>
                ))}
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontSize:13}}>Afficher le logo ✦</span>
              <Tog value={showLogo} onChange={setShowLogo}/>
            </div>
          </div>
        </div>

        {/* COULEURS */}
        <div style={{background:T.surf,borderRadius:16,border:`1px solid ${T.border}`,padding:"20px 22px"}}>
          <div style={{fontWeight:800,fontSize:15,marginBottom:18}}>🎨 Couleurs & Thème</div>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:12,color:T.muted,display:"block",marginBottom:8,fontWeight:600}}>Palette prédéfinie</label>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {colorPresets.map(p=>(
                <button key={p.id} onClick={()=>setHeroGrad(p.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"8px 10px",borderRadius:12,background:heroGrad===p.id?`${T.acc}15`:T.bg,border:`2px solid ${heroGrad===p.id?T.acc:T.border}`,cursor:"pointer",transition:"all .2s"}}>
                  <div style={{width:36,height:20,borderRadius:6,background:`linear-gradient(135deg,${p.a},${p.b})`}}/>
                  <span style={{fontSize:9,color:heroGrad===p.id?T.acc:T.muted,fontWeight:heroGrad===p.id?700:400}}>{p.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{fontSize:12,color:T.muted,display:"block",marginBottom:8,fontWeight:600}}>Couleur d'accentuation personnalisée</label>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <input type="color" value={accentColor} onChange={e=>setAccentColor(e.target.value)} style={{width:44,height:36,borderRadius:8,border:`1px solid ${T.border}`,background:"none",cursor:"pointer",padding:2}}/>
              <span style={{fontFamily:"JetBrains Mono",fontSize:12,color:T.muted}}>{accentColor}</span>
              <div style={{width:60,height:28,borderRadius:8,background:`linear-gradient(135deg,${accentColor},${accentColor}aa)`,boxShadow:`0 0 12px ${accentColor}44`}}/>
            </div>
          </div>
        </div>

        {/* BARRE ANNONCE */}
        <div style={{background:T.surf,borderRadius:16,border:`1px solid ${T.border}`,padding:"20px 22px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
            <div style={{fontWeight:800,fontSize:15}}>📢 Barre d'annonce</div>
            <Tog value={announcBar} onChange={setAnnouncBar}/>
          </div>
          {announcBar&&(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <Input label="Texte de l'annonce" value={announcText} onChange={setAnnouncText} icon="📢"/>
              <div style={{padding:"10px 16px",borderRadius:10,background:`linear-gradient(135deg,${T.acc}15,${T.purple}10)`,border:`1px solid ${T.acc}30`,fontSize:12,color:T.text,fontWeight:600}}>
                Aperçu : {announcText}
              </div>
            </div>
          )}
          {!announcBar&&<div style={{color:T.muted,fontSize:13}}>Barre d'annonce désactivée.</div>}
        </div>

        {/* TARIFS */}
        <div style={{background:T.surf,borderRadius:16,border:`1px solid ${T.border}`,padding:"20px 22px"}}>
          <div style={{fontWeight:800,fontSize:15,marginBottom:18}}>💰 Tarifs (mensuel)</div>
          {pricingMonthly.map((p,i)=>(
            <div key={p.plan} style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <div style={{width:80,fontSize:13,fontWeight:700,color:T.muted}}>{p.plan}</div>
              <div style={{display:"flex",alignItems:"center",gap:4,flex:1}}>
                <span style={{color:T.muted,fontSize:14}}>€</span>
                <input type="number" value={p.price} onChange={e=>setPricingMonthly(prev=>prev.map((x,j)=>j===i?{...x,price:e.target.value}:x))} style={{width:"100%",padding:"7px 10px",borderRadius:9,fontSize:14,background:T.bg,border:`1px solid ${T.border}`,color:T.text}} onFocus={e=>e.target.style.borderColor=T.acc} onBlur={e=>e.target.style.borderColor=T.border}/>
                <span style={{color:T.muted,fontSize:11}}>/mois</span>
              </div>
            </div>
          ))}
          <div style={{padding:"8px 12px",borderRadius:8,background:`${T.yellow}08`,border:`1px solid ${T.yellow}20`,fontSize:11,color:T.muted,marginTop:4}}>
            ⚠️ Les vrais prix sont gérés dans Stripe. Ces valeurs sont pour l'affichage uniquement.
          </div>
        </div>

        {/* APERÇU LIVE */}
        <div style={{background:T.surf,borderRadius:16,border:`1px solid ${T.border}`,padding:"20px 22px",gridColumn:"1/-1"}}>
          <div style={{fontWeight:800,fontSize:15,marginBottom:16}}>👁 Aperçu hero landing</div>
          <div style={{borderRadius:14,overflow:"hidden",border:`1px solid ${T.border}`}}>
            {announcBar&&<div style={{padding:"6px 20px",background:`linear-gradient(135deg,${colorPresets.find(p=>p.id===heroGrad)?.a||T.acc}20,${colorPresets.find(p=>p.id===heroGrad)?.b||T.purple}15)`,borderBottom:`1px solid ${T.border}`,textAlign:"center",fontSize:12,fontWeight:600}}>{announcText}</div>}
            <div style={{padding:"48px 32px",background:`radial-gradient(ellipse at 30% 50%,${colorPresets.find(p=>p.id===heroGrad)?.a||T.acc}12 0%,transparent 60%),${T.bg}`,textAlign:"center"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:14}}>
                {showLogo&&<div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${colorPresets.find(p=>p.id===heroGrad)?.a||T.acc},${colorPresets.find(p=>p.id===heroGrad)?.b||T.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>✦</div>}
                <span style={{fontWeight:900,fontSize:22,fontFamily:primaryFont+",sans-serif"}}>{siteName}</span>
              </div>
              <div style={{fontSize:16,fontWeight:700,marginBottom:6,fontFamily:primaryFont+",sans-serif"}}>{tagline}</div>
              <div style={{display:"flex",gap:10,justifyContent:"center",marginTop:20}}>
                <div style={{padding:"8px 22px",borderRadius:10,background:`linear-gradient(135deg,${colorPresets.find(p=>p.id===heroGrad)?.a||T.acc},${colorPresets.find(p=>p.id===heroGrad)?.b||T.purple})`,color:"#fff",fontSize:13,fontWeight:800}}>Commencer gratuitement</div>
                <div style={{padding:"8px 22px",borderRadius:10,background:"transparent",border:`1px solid ${T.border}`,color:T.text,fontSize:13,fontWeight:600}}>Voir les tarifs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminEmailTemplates=()=>{
  const [activeEmail,setActiveEmail]=useState("welcome");
  const [editMode,setEditMode]=useState(false);
  const [templates,setTemplates]=useState({
    welcome:{subject:"Bienvenue sur SubCraft ✦ — Tes sous-titres IA t'attendent !",preview:"Tu viens de rejoindre la communauté des créateurs qui font des vidéos virales.",trigger:"Inscription confirmée",icon:"🎉",color:T.acc},
    video_ready:{subject:"🎬 Ta vidéo est prête — Télécharge tes sous-titres !",preview:"Bonne nouvelle ! Tes sous-titres ont été générés avec succès.",trigger:"Transcription terminée",icon:"✅",color:T.green},
    upgrade:{subject:"⭐ Passe au niveau supérieur — Offre spéciale pour toi",preview:"Tu approches de ta limite de vidéos ce mois. C'est le moment de passer Pro.",trigger:"70% quota utilisé",icon:"🚀",color:T.yellow},
    expiry:{subject:"⚠️ Ta vidéo sera supprimée dans 2h",preview:"N'oublie pas d'exporter ta vidéo avant sa suppression automatique.",trigger:"2h avant suppression",icon:"⏰",color:T.orange},
  });
  const [subjectEdit,setSubjectEdit]=useState("");
  const cur=templates[activeEmail];
  const startEdit=()=>{setSubjectEdit(cur.subject);setEditMode(true);};
  const saveEdit=()=>{setTemplates(p=>({...p,[activeEmail]:{...p[activeEmail],subject:subjectEdit}}));setEditMode(false);notify("Template mis à jour !","success");};

  const emailBodies={
    welcome:`Salut {{prenom}} ! 👋

Bienvenue sur **SubCraft** — la plateforme de sous-titres IA pour créateurs TikTok, YouTube & Instagram.

🎬 **Ce que tu peux faire maintenant :**
✓ Importer ta première vidéo (max 2 Go)
✓ Choisir parmi 10+ styles professionnels
✓ Exporter en MP4, SRT ou ASS en quelques secondes

Tu as **3 vidéos gratuites** pour commencer. 

[🚀 Accéder à mon espace →](https://subcraftai.com/dashboard)

Quelques astuces pour débuter :
✓ Les vidéos courtes (< 2 min) sont idéales pour tester
✓ Active la détection automatique de langue
✓ Le style "Yellow Bold" est notre favori pour TikTok 🔥

À très vite,
Sophie & l'équipe SubCraft

P.S. Invite un ami et gagne 1 mois gratuit 🎁`,

    video_ready:`Hey {{prenom}} 🎬

Bonne nouvelle ! Ta vidéo **"{{nom_video}}"** est prête.

Tes sous-titres ont été générés en {{duree}} secondes avec une précision de **{{precision}}%** !

[🎬 Voir ma vidéo →](https://subcraftai.com/editor/{{video_id}})

**Ce que tu peux faire :**
✓ Modifier les sous-titres dans l'éditeur
✓ Changer le style (Bold, Neon, MrBeast...)
✓ Exporter en HD avec les sous-titres incrustés

⚠️ Ta vidéo sera supprimée dans **24h** — pense à l'exporter !

À bientôt,
L'équipe SubCraft ✦`,

    upgrade:`Salut {{prenom}} ! 🚀

Tu es en train de cartonner sur SubCraft — tu as déjà utilisé **{{pct}}% de ton quota** de vidéos ce mois-ci !

C'est le bon moment pour passer au plan suivant et ne pas être bloqué.

**✨ Plan Expert — 13€/mois**
✓ 100 vidéos/mois (au lieu de 30)
✓ Export 4K Ultra HD
✓ Toutes les langues (12 langues)
✓ Support prioritaire < 1h

[⭐ Passer à Expert →](https://subcraftai.com/pricing?coupon=UPGRADE20)

🎁 Utilise le code **UPGRADE20** pour -20% sur ton premier mois.

Bonne création,
Sophie ✦`,

    expiry:`Salut {{prenom}} ! ⚠️

Rappel : ta vidéo **"{{nom_video}}"** sera automatiquement supprimée dans **2 heures**.

Si tu n'as pas encore exporté tes sous-titres, c'est maintenant !

[⬇ Exporter ma vidéo →](https://subcraftai.com/editor/{{video_id}})

Formats disponibles : MP4 HD · SRT · ASS · Texte brut

L'équipe SubCraft ✦
P.S. Toutes les vidéos sont supprimées après 24h pour protéger ta vie privée 🔐`,
  };

  return(
    <div className="page">
      <div style={{marginBottom:24}}>
        <h1 style={{fontWeight:900,fontSize:22,marginBottom:4}}>📧 Templates d'emails</h1>
        <div style={{color:T.muted,fontSize:13}}>Personnalise les emails envoyés automatiquement à tes utilisateurs.</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:16}} className="mobile-col">
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {Object.entries(templates).map(([id,tpl])=>(
            <button key={id} onClick={()=>{setActiveEmail(id);setEditMode(false);}} style={{padding:"13px 14px",borderRadius:12,background:activeEmail===id?`${tpl.color}15`:T.surf,border:`1px solid ${activeEmail===id?tpl.color:T.border}`,textAlign:"left",cursor:"pointer",transition:"all .2s"}}>
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                <span style={{fontSize:18}}>{tpl.icon}</span>
                <span style={{fontWeight:700,fontSize:12,color:activeEmail===id?tpl.color:T.text}}>{tpl.trigger}</span>
              </div>
              <div style={{fontSize:10,color:T.muted,lineHeight:1.4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tpl.preview}</div>
            </button>
          ))}
          <div style={{padding:"11px 14px",borderRadius:10,background:`${T.green}06`,border:`1px solid ${T.green}18`,fontSize:11,color:T.muted,marginTop:4,lineHeight:1.5}}>
            💡 Variables : <span style={{fontFamily:"JetBrains Mono",color:T.green,fontSize:10}}>{"{{prenom}} {{nom_video}} {{pct}}"}</span>
          </div>
        </div>
        <div style={{background:T.surf,borderRadius:16,border:`1px solid ${T.border}`,overflow:"hidden"}}>
          {/* Email header */}
          <div style={{padding:"16px 20px",borderBottom:`1px solid ${T.border}`,background:`linear-gradient(135deg,${cur.color}08,transparent)`}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}>
              <span style={{fontSize:22}}>{cur.icon}</span>
              <div>
                <div style={{fontWeight:800,fontSize:14}}>{cur.trigger}</div>
                <div style={{fontSize:11,color:T.muted}}>Déclenché automatiquement</div>
              </div>
              <button onClick={editMode?saveEdit:startEdit} style={{marginLeft:"auto",padding:"6px 16px",borderRadius:9,background:editMode?T.green:T.acc,border:"none",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",transition:"all .2s"}}>
                {editMode?"💾 Sauvegarder":"✏️ Modifier"}
              </button>
              {editMode&&<button onClick={()=>setEditMode(false)} style={{padding:"6px 12px",borderRadius:9,background:T.surf2,border:`1px solid ${T.border}`,color:T.muted,fontSize:12,cursor:"pointer"}}>Annuler</button>}
            </div>
            {editMode?(
              <input value={subjectEdit} onChange={e=>setSubjectEdit(e.target.value)} style={{width:"100%",padding:"9px 13px",borderRadius:10,fontSize:13,fontWeight:700,background:T.bg,border:`1px solid ${T.acc}`,color:T.text}} placeholder="Objet de l'email..."/>
            ):(
              <div style={{fontSize:13,fontWeight:700,padding:"9px 13px",borderRadius:10,background:T.bg,border:`1px solid ${T.border}`,color:T.text}}>📩 {cur.subject}</div>
            )}
          </div>
          {/* Email preview */}
          <div style={{padding:"0"}}>
            {/* Email client header */}
            <div style={{padding:"14px 20px",borderBottom:`1px solid ${T.border}`,display:"flex",gap:10,alignItems:"center",background:T.surf2}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:T.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>✦</div>
              <div>
                <div style={{fontWeight:700,fontSize:12}}>Sophie de SubCraft</div>
                <div style={{fontSize:10,color:T.muted}}>hello@subcraftai.com → utilisateur@email.com</div>
              </div>
              <div style={{marginLeft:"auto",display:"flex",gap:6}}>
                <span style={{fontSize:10,padding:"3px 8px",borderRadius:5,background:`${cur.color}18`,color:cur.color,fontWeight:600,border:`1px solid ${cur.color}25`}}>{cur.trigger}</span>
              </div>
            </div>
            {/* Email body */}
            <div style={{padding:"24px 28px",fontSize:13.5,lineHeight:2,whiteSpace:"pre-line",color:T.text}}>
              {emailBodies[activeEmail].split("\n").map((line,li)=>{
                if(line.startsWith("**")&&line.endsWith("**")) return <div key={li} style={{fontWeight:900,fontSize:15,margin:"8px 0 4px",color:T.text}}>{line.slice(2,-2)}</div>;
                if(/^[✓⭐🎬✅⚠️🔐💡]/.test(line)) return <div key={li} style={{padding:"2px 0",color:T.muted}}>{line}</div>;
                if(line.includes("[")&&line.includes("](")) return <div key={li} style={{margin:"12px 0"}}><button style={{padding:"11px 24px",borderRadius:12,background:T.grad,border:"none",color:"#fff",fontWeight:800,fontSize:13,cursor:"pointer",boxShadow:`0 4px 16px ${T.acc}44`}}>{line.match(/\[(.+?)\]/)?.[1]||line}</button></div>;
                if(line.startsWith("P.S.")||line.startsWith("P.P.S.")) return <div key={li} style={{fontSize:11,color:T.dim,marginTop:4}}>{line}</div>;
                return <div key={li}>{line||"\u00A0"}</div>;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const AdminEmailLogs=()=>{
  const MOCK_LOGS=[
    {id:1,type:"welcome",icon:"🎉",to:"sophie@gmail.com",name:"Sophie Martin",subject:"Bienvenue sur SubCraft ✦",status:"delivered",time:"Auj. 14:32",trigger:"Inscription",opened:true,clicked:true},
    {id:2,type:"video_ready",icon:"✅",to:"lucas.dubois@outlook.com",name:"Lucas Dubois",subject:"🎬 Ta vidéo est prête — Télécharge tes sous-titres !",status:"delivered",time:"Auj. 13:17",trigger:"Transcription terminée",opened:true,clicked:false},
    {id:3,type:"upgrade",icon:"🚀",to:"emma@icloud.com",name:"Emma Wilson",subject:"⭐ Passe au niveau supérieur — Offre spéciale",status:"delivered",time:"Auj. 11:04",trigger:"70% quota",opened:false,clicked:false},
    {id:4,type:"expiry",icon:"⏰",to:"carlos@gmail.com",name:"Carlos García",subject:"⚠️ Ta vidéo sera supprimée dans 2h",status:"delivered",time:"Auj. 10:48",trigger:"2h avant suppression",opened:true,clicked:true},
    {id:5,type:"welcome",icon:"🎉",to:"yuki.t@yahoo.jp",name:"Yuki Tanaka",subject:"Bienvenue sur SubCraft ✦",status:"delivered",time:"Hier 23:11",trigger:"Inscription",opened:true,clicked:false},
    {id:6,type:"upgrade",icon:"🚀",to:"m.lefebvre@free.fr",name:"Marie Lefebvre",subject:"⭐ Passe au niveau supérieur — Offre spéciale",status:"bounced",time:"Hier 20:33",trigger:"70% quota",opened:false,clicked:false},
    {id:7,type:"video_ready",icon:"✅",to:"james@gmail.com",name:"James O'Brien",subject:"🎬 Ta vidéo est prête !",status:"delivered",time:"Hier 18:55",trigger:"Transcription terminée",opened:false,clicked:false},
    {id:8,type:"expiry",icon:"⏰",to:"priya.s@gmail.com",name:"Priya Sharma",subject:"⚠️ Ta vidéo sera supprimée dans 2h",status:"delivered",time:"Hier 16:22",trigger:"2h avant suppression",opened:true,clicked:false},
    {id:9,type:"welcome",icon:"🎉",to:"a.bernard@gmail.com",name:"Antoine Bernard",subject:"Bienvenue sur SubCraft ✦",status:"delivered",time:"07/03 09:14",trigger:"Inscription",opened:true,clicked:true},
    {id:10,type:"upgrade",icon:"🚀",to:"lisa.chen@gmail.com",name:"Lisa Chen",subject:"⭐ Passe au niveau supérieur",status:"delivered",time:"07/03 08:02",trigger:"70% quota",opened:true,clicked:true},
    {id:11,type:"video_ready",icon:"✅",to:"m.ali@hotmail.com",name:"Mohamed Ali",subject:"🎬 Ta vidéo est prête !",status:"failed",time:"06/03 21:33",trigger:"Transcription terminée",opened:false,clicked:false},
    {id:12,type:"expiry",icon:"⏰",to:"c.schmidt@gmail.de",name:"Clara Schmidt",subject:"⚠️ Ta vidéo sera supprimée dans 2h",status:"delivered",time:"06/03 19:47",trigger:"2h avant suppression",opened:false,clicked:false},
  ];
  const [filter,setFilter]=useState("all");
  const [search,setSearch]=useState("");
  const filtered=MOCK_LOGS.filter(l=>{
    const matchType=filter==="all"||l.type===filter;
    const q=search.toLowerCase();
    const matchSearch=!q||(l.name.toLowerCase().includes(q)||l.to.toLowerCase().includes(q)||l.subject.toLowerCase().includes(q));
    return matchType&&matchSearch;
  });
  const stats={
    total:MOCK_LOGS.length,
    delivered:MOCK_LOGS.filter(l=>l.status==="delivered").length,
    opened:MOCK_LOGS.filter(l=>l.opened).length,
    clicked:MOCK_LOGS.filter(l=>l.clicked).length,
  };
  const statusColor={delivered:T.green,bounced:T.orange,failed:T.pink};
  const typeColor={welcome:T.acc,video_ready:T.green,upgrade:T.yellow,expiry:T.orange};
  return(
    <div className="page">
      <div style={{marginBottom:24}}>
        <h1 style={{fontWeight:900,fontSize:22,marginBottom:4}}>📬 Logs Emails</h1>
        <div style={{color:T.muted,fontSize:13}}>Historique de tous les emails envoyés automatiquement.</div>
      </div>
      {/* KPI row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}} className="mobile-grid1">
        {[
          {label:"Envoyés",value:stats.total,color:T.acc,icon:"📤"},
          {label:"Délivrés",value:`${stats.delivered} (${Math.round(stats.delivered/stats.total*100)}%)`,color:T.green,icon:"✅"},
          {label:"Ouverts",value:`${stats.opened} (${Math.round(stats.opened/stats.total*100)}%)`,color:T.yellow,icon:"👁"},
          {label:"Cliqués",value:`${stats.clicked} (${Math.round(stats.clicked/stats.total*100)}%)`,color:T.purple,icon:"🖱"},
        ].map(s=>(
          <div key={s.label} style={{padding:"16px 18px",borderRadius:14,background:T.surf,border:`1px solid ${T.border}`,display:"flex",gap:12,alignItems:"center"}}>
            <div style={{width:38,height:38,borderRadius:10,background:`${s.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{s.icon}</div>
            <div>
              <div style={{fontFamily:"JetBrains Mono",fontWeight:900,fontSize:18,color:s.color}}>{s.value}</div>
              <div style={{fontSize:11,color:T.muted}}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Filters */}
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{display:"flex",gap:2,background:T.bg,borderRadius:11,padding:3}}>
          {[["all","Tous"],["welcome","Bienvenue"],["video_ready","Vidéo prête"],["upgrade","Upgrade"],["expiry","Expiration"]].map(([id,label])=>(
            <button key={id} onClick={()=>setFilter(id)} style={{padding:"5px 13px",borderRadius:8,background:filter===id?T.acc:"transparent",border:"none",color:filter===id?"#fff":T.muted,fontWeight:filter===id?700:400,fontSize:12,cursor:"pointer",transition:"all .2s",whiteSpace:"nowrap"}}>{label}</button>
          ))}
        </div>
        <div style={{position:"relative",flex:1,minWidth:180}}>
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:T.muted,fontSize:12}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher par nom, email..." style={{width:"100%",padding:"7px 12px 7px 30px",borderRadius:10,fontSize:12,background:T.bg,border:`1px solid ${T.border}`,color:T.text}} onFocus={e=>e.target.style.borderColor=T.acc} onBlur={e=>e.target.style.borderColor=T.border}/>
        </div>
        <span style={{fontSize:11,color:T.dim,fontFamily:"JetBrains Mono"}}>{filtered.length} résultat{filtered.length>1?"s":""}</span>
      </div>
      {/* Table */}
      <div style={{background:T.surf,borderRadius:16,border:`1px solid ${T.border}`,overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"36px 1fr 160px 100px 80px 80px",gap:0,padding:"10px 18px",borderBottom:`1px solid ${T.border}`,background:T.surf2}}>
          {["","Destinataire / Email","Objet","Trigger","Statut","Actions"].map((h,i)=>(
            <div key={i} style={{fontSize:10,fontWeight:700,color:T.dim,textTransform:"uppercase",letterSpacing:".08em",textAlign:i>3?"center":undefined}}>{h}</div>
          ))}
        </div>
        {filtered.map((log,i)=>(
          <div key={log.id} style={{display:"grid",gridTemplateColumns:"36px 1fr 160px 100px 80px 80px",gap:0,padding:"12px 18px",borderBottom:i<filtered.length-1?`1px solid ${T.border}`:"none",alignItems:"center",transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background=T.surf2} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{fontSize:20}}>{log.icon}</div>
            <div>
              <div style={{fontWeight:700,fontSize:13}}>{log.name}</div>
              <div style={{fontSize:11,color:T.muted,fontFamily:"JetBrains Mono"}}>{log.to}</div>
              <div style={{fontSize:10,color:T.dim,marginTop:1}}>{log.time}</div>
            </div>
            <div style={{fontSize:11,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",paddingRight:8}}>{log.subject}</div>
            <div>
              <span style={{fontSize:10,padding:"2px 8px",borderRadius:5,background:`${typeColor[log.type]||T.acc}15`,color:typeColor[log.type]||T.acc,fontWeight:600,border:`1px solid ${typeColor[log.type]||T.acc}25`}}>{log.trigger}</span>
            </div>
            <div style={{textAlign:"center"}}>
              <span style={{fontSize:10,padding:"3px 9px",borderRadius:6,background:`${statusColor[log.status]}15`,color:statusColor[log.status],fontWeight:700,border:`1px solid ${statusColor[log.status]}25`}}>
                {log.status==="delivered"?"✓ Délivré":log.status==="bounced"?"↩ Bounced":"✗ Échec"}
              </span>
              <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:4}}>
                {log.opened&&<span title="Ouvert" style={{fontSize:9,color:T.green}}>👁 Lu</span>}
                {log.clicked&&<span title="Cliqué" style={{fontSize:9,color:T.acc}}>🖱 CTA</span>}
              </div>
            </div>
            <div style={{display:"flex",gap:4,justifyContent:"center"}}>
              <button onClick={()=>notify(`Email renvoyé à ${log.name}`,"success")} title="Renvoyer" style={{width:28,height:28,borderRadius:7,background:`${T.acc}12`,border:`1px solid ${T.acc}25`,color:T.acc,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>↺</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
const AdminAnalytics=()=>{
  const [period,setPeriod]=useState("30j");
  const cohorts=[
    {week:"S1 Mar",n:48,d1:88,d7:64,d14:51,d30:38},
    {week:"S2 Mar",n:61,d1:91,d7:70,d14:58,d30:44},
    {week:"S3 Fév",n:39,d1:85,d7:60,d14:47,d30:35},
    {week:"S4 Fév",n:55,d1:89,d7:67,d14:54,d30:41},
    {week:"S1 Fév",n:44,d1:82,d7:58,d14:44,d30:32},
  ];
  const churnData=[{m:"Oct",v:2.1},{m:"Nov",v:2.4},{m:"Déc",v:1.8},{m:"Jan",v:3.1},{m:"Fév",v:2.7},{m:"Mar",v:2.2}];
  const maxChurn=Math.max(...churnData.map(d=>d.v));
  const kpis=[
    {icon:"📈",label:"LTV Moyen",val:"€147",sub:"par utilisateur payant",color:T.green,delta:"+12%"},
    {icon:"🔄",label:"Taux de rétention J30",val:"41%",sub:"cohorte Mar 2026",color:T.acc,delta:"+3pts"},
    {icon:"💸",label:"Churn mensuel",val:"2.2%",sub:"en baisse ce mois",color:T.yellow,delta:"-0.5%"},
    {icon:"⏱",label:"Temps avant conversion",val:"4.2j",sub:"Free → Payant",color:T.purple,delta:"-1.1j"},
  ];
  return(
    <div className="page">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <div>
          <h1 style={{fontWeight:900,fontSize:22,marginBottom:4}}>📊 Analytics Avancés</h1>
          <div style={{color:T.muted,fontSize:13}}>Cohortes, rétention, churn et LTV.</div>
        </div>
        <div style={{display:"flex",gap:6}}>
          {["7j","30j","90j"].map(p=>(
            <button key={p} onClick={()=>setPeriod(p)} style={{padding:"6px 14px",borderRadius:8,background:period===p?T.acc:T.surf,border:`1px solid ${period===p?T.acc:T.border}`,color:period===p?"#fff":T.muted,fontSize:12,fontWeight:period===p?700:400,cursor:"pointer"}}>{p}</button>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12,marginBottom:20}}>
        {kpis.map(k=>(
          <div key={k.label} style={{padding:"16px 18px",borderRadius:14,background:T.surf,border:`1px solid ${T.border}`}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <span style={{fontSize:20}}>{k.icon}</span>
              <span style={{fontSize:11,color:T.muted,fontWeight:600}}>{k.label}</span>
            </div>
            <div style={{fontWeight:900,fontSize:26,color:k.color,marginBottom:2}}>{k.val}</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontSize:11,color:T.muted}}>{k.sub}</span>
              <span style={{fontSize:11,fontWeight:700,color:k.delta.startsWith("+")?T.green:T.pink}}>{k.delta}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}} className="mobile-col">
        <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:"18px 20px"}}>
          <div style={{fontWeight:800,fontSize:14,marginBottom:16}}>🔄 Cohortes de rétention (%)</div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead>
                <tr>
                  {["Cohorte","N","J1","J7","J14","J30"].map(h=>(
                    <th key={h} style={{textAlign:h==="Cohorte"?"left":"center",padding:"6px 8px",color:T.muted,fontWeight:600,borderBottom:`1px solid ${T.border}`}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cohorts.map(c=>(
                  <tr key={c.week}>
                    <td style={{padding:"7px 8px",fontWeight:700,color:T.text,fontSize:11}}>{c.week}</td>
                    <td style={{padding:"7px 8px",textAlign:"center",color:T.muted}}>{c.n}</td>
                    {[c.d1,c.d7,c.d14,c.d30].map((v,i)=>{
                      const bg=v>80?T.green:v>60?T.yellow:v>40?T.orange:T.pink;
                      return <td key={i} style={{padding:"5px 6px",textAlign:"center"}}><span style={{display:"inline-block",padding:"3px 8px",borderRadius:5,background:`${bg}22`,color:bg,fontWeight:700,fontSize:11}}>{v}%</span></td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:"18px 20px"}}>
          <div style={{fontWeight:800,fontSize:14,marginBottom:16}}>💸 Churn mensuel (%)</div>
          <div style={{display:"flex",gap:4,alignItems:"flex-end",height:120}}>
            {churnData.map(d=>{
              const h=(d.v/maxChurn)*100;
              const color=d.v<2?T.green:d.v<2.5?T.yellow:T.orange;
              return(
                <div key={d.m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <div style={{fontSize:9,color:T.muted,fontWeight:700}}>{d.v}%</div>
                  <div style={{width:"100%",height:h+"%",background:color,borderRadius:"3px 3px 0 0",minHeight:4,transition:"height .3s"}}/>
                  <div style={{fontSize:9,color:T.dim}}>{d.m}</div>
                </div>
              );
            })}
          </div>
          <div style={{marginTop:12,padding:"8px 12px",borderRadius:8,background:`${T.green}0a`,border:`1px solid ${T.green}20`,fontSize:11,color:T.muted}}>
            ✅ Churn en baisse de <span style={{color:T.green,fontWeight:700}}>0.5%</span> ce mois — objectif {"<"}2% atteint en vue.
          </div>
        </div>
      </div>
      <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:"18px 20px"}}>
        <div style={{fontWeight:800,fontSize:14,marginBottom:14}}>🔀 Funnel de conversion</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[
            {label:"Visiteurs landing",val:12840,pct:100,color:T.acc},
            {label:"Inscriptions Free",val:1284,pct:10,color:T.cyan},
            {label:"Upload 1ère vidéo",val:834,pct:6.5,color:T.green},
            {label:"Retour J7",val:501,pct:3.9,color:T.yellow},
            {label:"Passage payant",val:193,pct:1.5,color:T.pink},
          ].map((s,i,arr)=>(
            <div key={s.label}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:12}}>
                <span style={{fontWeight:600,color:T.text}}>{s.label}</span>
                <span style={{color:T.muted,fontFamily:"JetBrains Mono"}}>{s.val.toLocaleString()} <span style={{color:s.color,fontWeight:700}}>({s.pct}%)</span></span>
              </div>
              <div style={{height:8,background:T.border,borderRadius:100,overflow:"hidden"}}>
                <div style={{height:"100%",width:s.pct+"%",background:s.color,borderRadius:100,transition:"width .6s"}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
const AdminFeatureFlags=()=>{
  const [flags,setFlags]=useState([
    {id:"url-import",label:"Import URL YouTube/TikTok",desc:"Permet d'importer via lien direct",env:"prod",enabled:true,category:"Feature"},
    {id:"ai-emojis",label:"Emojis IA automatiques",desc:"Claude AI insère les emojis contextuels",env:"prod",enabled:true,category:"Feature"},
    {id:"ai-translation",label:"Traduction IA",desc:"Traduction automatique en 12 langues",env:"prod",enabled:true,category:"Feature"},
    {id:"referral",label:"Programme parrainage",desc:"Système de referral avec code unique",env:"prod",enabled:true,category:"Business"},
    {id:"exit-popup",label:"Exit Intent popup -20%",desc:"Popup de sortie avec coupon RESTE20",env:"prod",enabled:true,category:"Marketing"},
    {id:"onboarding-v2",label:"Onboarding guidé 5 étapes",desc:"Nouveau flow onboarding avec personnalisation",env:"prod",enabled:true,category:"UX"},
    {id:"batch-export",label:"Export par lot",desc:"Exporter plusieurs vidéos d'un coup",env:"beta",enabled:false,category:"Feature"},
    {id:"api-access",label:"API publique SubCraft",desc:"Accès API REST pour les développeurs",env:"beta",enabled:false,category:"Feature"},
    {id:"team-workspace",label:"Espaces d'équipe",desc:"Plusieurs utilisateurs sur un compte",env:"dev",enabled:false,category:"Business"},
    {id:"custom-domain",label:"Domaine personnalisé",desc:"Whitelabel avec domaine custom",env:"dev",enabled:false,category:"Business"},
    {id:"ab-test-pricing",label:"A/B test pricing page",desc:"Test de 2 versions de la page tarifs",env:"beta",enabled:false,category:"Marketing"},
    {id:"ai-broll",label:"B-Roll IA automatique",desc:"Insertion automatique de B-roll",env:"dev",enabled:false,category:"Feature"},
  ]);
  const toggle=(id)=>setFlags(f=>f.map(fl=>fl.id===id?{...fl,enabled:!fl.enabled}:fl));
  const envColor={prod:T.green,beta:T.yellow,dev:T.purple};
  const cats=[...new Set(flags.map(f=>f.category))];
  return(
    <div className="page">
      <div style={{marginBottom:24}}>
        <h1 style={{fontWeight:900,fontSize:22,marginBottom:4}}>🚦 Feature Flags</h1>
        <div style={{color:T.muted,fontSize:13}}>Active ou désactive des fonctionnalités sans déployer du code.</div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        {[{label:"Prod",color:T.green,count:flags.filter(f=>f.env==="prod").length},{label:"Beta",color:T.yellow,count:flags.filter(f=>f.env==="beta").length},{label:"Dev",color:T.purple,count:flags.filter(f=>f.env==="dev").length}].map(b=>(
          <div key={b.label} style={{padding:"5px 12px",borderRadius:7,background:`${b.color}12`,border:`1px solid ${b.color}30`,fontSize:12,fontWeight:700,color:b.color}}>{b.label} · {b.count} flags</div>
        ))}
      </div>
      {cats.map(cat=>(
        <div key={cat} style={{marginBottom:20}}>
          <div style={{fontWeight:800,fontSize:13,color:T.muted,marginBottom:10,textTransform:"uppercase",letterSpacing:".1em"}}>{cat}</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {flags.filter(f=>f.category===cat).map(fl=>(
              <div key={fl.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 16px",borderRadius:12,background:T.surf,border:`1px solid ${fl.enabled?T.acc+"30":T.border}`,gap:12,transition:"border .2s"}}>
                <div style={{display:"flex",alignItems:"center",gap:12,flex:1,minWidth:0}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:fl.enabled?T.green:T.border,flexShrink:0,boxShadow:fl.enabled?`0 0 8px ${T.green}`:undefined}}/>
                  <div style={{minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:13}}>{fl.label}</div>
                    <div style={{fontSize:11,color:T.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{fl.desc}</div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
                  <span style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:`${envColor[fl.env]}15`,color:envColor[fl.env],fontWeight:800,textTransform:"uppercase"}}>{fl.env}</span>
                  <Tog value={fl.enabled} onChange={()=>{toggle(fl.id);notify(`Flag "${fl.label}" ${!fl.enabled?"activé":"désactivé"}`,fl.enabled?"warning":"success");}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
const AdminMarketing=()=>{
  const [activeTab,setActiveTab]=useState("broadcast");
  const [broadcastSubject,setBroadcastSubject]=useState("");
  const [broadcastBody,setBroadcastBody]=useState("");
  const [targetPlan,setTargetPlan]=useState("all");
  const campaigns=[
    {id:1,name:"Promo Printemps -30%",type:"Email broadcast",sent:1284,opened:68,clicked:31,revenue:"€2.840",status:"sent",date:"07/03/2026"},
    {id:2,name:"Re-engagement J14 inactifs",type:"Email auto",sent:312,opened:44,clicked:18,revenue:"€640",status:"sent",date:"05/03/2026"},
    {id:3,name:"Launch Nouveaux styles",type:"Email broadcast",sent:1201,opened:72,clicked:45,revenue:"€1.320",status:"sent",date:"01/03/2026"},
    {id:4,name:"Offre annuelle -20%",type:"Email auto",sent:890,opened:58,clicked:29,revenue:"€3.100",status:"sent",date:"25/02/2026"},
    {id:5,name:"Campagne A/B tarifs v2",type:"A/B Test",sent:600,opened:71,clicked:38,revenue:"—",status:"active",date:"08/03/2026"},
  ];
  return(
    <div className="page">
      <div style={{marginBottom:24}}>
        <h1 style={{fontWeight:900,fontSize:22,marginBottom:4}}>📣 Campagnes Marketing</h1>
        <div style={{color:T.muted,fontSize:13}}>Broadcasts email, automations et A/B tests.</div>
      </div>
      <div style={{display:"flex",background:T.bg,borderRadius:10,padding:3,marginBottom:20,gap:3,maxWidth:420}}>
        {[["broadcast","📤 Broadcast"],["history","📋 Historique"],["ab","🧪 A/B Tests"]].map(([id,label])=>(
          <button key={id} onClick={()=>setActiveTab(id)} style={{flex:1,padding:"7px",borderRadius:7,background:activeTab===id?T.surf2:"transparent",border:activeTab===id?`1px solid ${T.border}`:"none",color:activeTab===id?T.text:T.muted,fontWeight:activeTab===id?700:400,fontSize:12,cursor:"pointer"}}>{label}</button>
        ))}
      </div>
      {activeTab==="broadcast"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}} className="mobile-col">
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:"18px 20px"}}>
              <div style={{fontWeight:800,fontSize:14,marginBottom:16}}>✉️ Nouveau broadcast</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div>
                  <label style={{fontSize:12,color:T.muted,display:"block",marginBottom:6,fontWeight:600}}>Cible</label>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {["all","Free","Basic","Expert","Pro"].map(p=>(
                      <button key={p} onClick={()=>setTargetPlan(p)} style={{padding:"5px 12px",borderRadius:7,background:targetPlan===p?T.acc:T.bg,border:`1px solid ${targetPlan===p?T.acc:T.border}`,color:targetPlan===p?"#fff":T.muted,fontSize:12,fontWeight:targetPlan===p?700:400,cursor:"pointer"}}>{p==="all"?"Tous les plans":p}</button>
                    ))}
                  </div>
                </div>
                <Input label="Objet de l'email" value={broadcastSubject} onChange={setBroadcastSubject} placeholder="🎉 Nouveauté SubCraft — Regarde ça..." icon="📩"/>
                <div>
                  <label style={{fontSize:12,color:T.muted,display:"block",marginBottom:6,fontWeight:600}}>Contenu</label>
                  <textarea value={broadcastBody} onChange={e=>setBroadcastBody(e.target.value)} placeholder="Corps de l'email..." rows={6} style={{width:"100%",padding:"10px 12px",borderRadius:10,fontSize:13,background:T.bg,border:`1px solid ${T.border}`,color:T.text,resize:"vertical",lineHeight:1.6}} onFocus={e=>e.target.style.borderColor=T.acc} onBlur={e=>e.target.style.borderColor=T.border}/>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <Btn v="secondary" full onClick={()=>notify("Aperçu généré","info")}>👁 Prévisualiser</Btn>
                  <Btn full onClick={()=>{if(!broadcastSubject||!broadcastBody){notify("Remplis tous les champs !","warning");return;}notify(`Broadcast envoyé à ${targetPlan==="all"?"1284":"~200"} utilisateurs ✅`,"success");setBroadcastSubject("");setBroadcastBody("");}}>📤 Envoyer</Btn>
                </div>
              </div>
            </div>
          </div>
          <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:"18px 20px"}}>
            <div style={{fontWeight:800,fontSize:14,marginBottom:14}}>📊 Stats broadcast précédent</div>
            {[
              {label:"Envoyés",val:"1.284",color:T.acc,icon:"📤"},
              {label:"Ouverts",val:"872 (68%)",color:T.green,icon:"👁"},
              {label:"Cliqués",val:"398 (31%)",color:T.yellow,icon:"🖱"},
              {label:"Revenus générés",val:"€2.840",color:T.pink,icon:"💰"},
            ].map(s=>(
              <div key={s.label} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
                <span style={{fontSize:18}}>{s.icon}</span>
                <span style={{fontSize:13,color:T.muted,flex:1}}>{s.label}</span>
                <span style={{fontWeight:800,fontSize:14,color:s.color}}>{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {activeTab==="history"&&(
        <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead>
              <tr style={{borderBottom:`1px solid ${T.border}`,background:T.surf2}}>
                {["Campagne","Type","Envoyés","Ouv.","Clic.","Revenus","Statut","Date"].map(h=>(
                  <th key={h} style={{padding:"10px 14px",textAlign:"left",fontWeight:700,fontSize:11,color:T.muted,whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campaigns.map(c=>(
                <tr key={c.id} style={{borderBottom:`1px solid ${T.border}`,transition:"background .1s"}} onMouseEnter={e=>e.currentTarget.style.background=T.surf2} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{padding:"10px 14px",fontWeight:700,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</td>
                  <td style={{padding:"10px 14px",color:T.muted,fontSize:12}}>{c.type}</td>
                  <td style={{padding:"10px 14px",color:T.acc,fontWeight:600}}>{c.sent}</td>
                  <td style={{padding:"10px 14px",color:T.green,fontWeight:600}}>{c.opened}%</td>
                  <td style={{padding:"10px 14px",color:T.yellow,fontWeight:600}}>{c.clicked}%</td>
                  <td style={{padding:"10px 14px",color:T.pink,fontWeight:700}}>{c.revenue}</td>
                  <td style={{padding:"10px 14px"}}><span style={{padding:"3px 8px",borderRadius:5,background:c.status==="active"?`${T.green}20`:`${T.muted}15`,color:c.status==="active"?T.green:T.muted,fontSize:11,fontWeight:700}}>{c.status==="active"?"🟢 Actif":"✅ Envoyé"}</span></td>
                  <td style={{padding:"10px 14px",color:T.dim,fontSize:11}}>{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeTab==="ab"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}} className="mobile-col">
          {[
            {name:"A/B Prix landing",vA:"Pricing actuel",vB:"Prix -10% affiché",convA:3.2,convB:4.8,status:"running",winner:"B"},
            {name:"A/B CTA Hero",vA:"Essayer gratuitement",vB:"Commencer → c'est gratuit",convA:6.1,convB:7.9,status:"running",winner:"B"},
          ].map(test=>(
            <div key={test.name} style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:"18px 20px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <div style={{fontWeight:800,fontSize:14}}>{test.name}</div>
                <span style={{fontSize:10,padding:"3px 8px",borderRadius:5,background:`${T.yellow}18`,color:T.yellow,fontWeight:700}}>🧪 EN COURS</span>
              </div>
              {[{label:"Variante A",val:test.vA,conv:test.convA},{label:"Variante B",val:test.vB,conv:test.convB}].map((v,i)=>(
                <div key={i} style={{padding:"11px 13px",borderRadius:10,background:test.winner===["A","B"][i]?`${T.green}08`:T.bg,border:`2px solid ${test.winner===["A","B"][i]?T.green:T.border}`,marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <span style={{fontWeight:700,fontSize:12}}>{v.label}</span>
                    <span style={{fontWeight:900,fontSize:15,color:test.winner===["A","B"][i]?T.green:T.text}}>{v.conv}%</span>
                  </div>
                  <div style={{fontSize:11,color:T.muted}}>{v.val}</div>
                </div>
              ))}
              <div style={{fontSize:11,color:T.green,fontWeight:700,marginTop:8}}>→ Variante {test.winner} en tête (+{((test.convB-test.convA)/test.convA*100).toFixed(0)}%)</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
const AdminSystemLogs=()=>{
  const [logFilter,setLogFilter]=useState("all");
  const [searchLog,setSearchLog]=useState("");
  const LOGS=[
    {id:1,level:"error",service:"whisper-api",msg:"Timeout après 30s pour video_id=847",time:"08/03 22:14:33",user:"sophie@gmail.com",code:504},
    {id:2,level:"warn",service:"stripe",msg:"Webhook reçu hors délai (8.2s)",time:"08/03 21:58:11",user:null,code:null},
    {id:3,level:"info",service:"auth",msg:"Connexion admin depuis 92.184.x.x",time:"08/03 21:45:00",user:"admin@subcraftai.com",code:200},
    {id:4,level:"error",service:"r2-storage",msg:"Upload échoué — quota R2 atteint (98%)",time:"08/03 20:33:17",user:"lucas@gmail.com",code:507},
    {id:5,level:"info",service:"whisper-api",msg:"Transcription OK — 847 tokens, 8.3s",time:"08/03 19:12:44",user:"emma@icloud.com",code:200},
    {id:6,level:"warn",service:"email",msg:"Rebond Brevo : m.lefebvre@free.fr",time:"08/03 18:04:22",user:null,code:null},
    {id:7,level:"info",service:"stripe",msg:"Paiement réussi €21 — Lucas Dubois",time:"08/03 17:44:11",user:"lucas.dubois@outlook.com",code:200},
    {id:8,level:"error",service:"whisper-api",msg:"Fichier corrompu — format non supporté .wmv",time:"08/03 16:22:58",user:"james@gmail.com",code:422},
    {id:9,level:"info",service:"cron",msg:"Suppression auto 24h — 7 vidéos supprimées",time:"08/03 15:00:00",user:null,code:200},
    {id:10,level:"warn",service:"rate-limit",msg:"Rate limit atteint — 45 req/min depuis 185.x.x",time:"08/03 14:33:09",user:null,code:429},
    {id:11,level:"info",service:"auth",msg:"Nouvelle inscription — carlos@gmail.com",time:"08/03 13:18:04",user:"carlos@gmail.com",code:201},
    {id:12,level:"error",service:"claude-api",msg:"Context window dépassée — tronqué à 200k tokens",time:"08/03 12:44:22",user:"priya.s@gmail.com",code:400},
  ];
  const levelColor={error:T.pink,warn:T.yellow,info:T.acc};
  const serviceColor={"whisper-api":T.purple,"stripe":T.green,"auth":T.cyan,"r2-storage":T.yellow,"email":T.orange,"cron":T.muted,"rate-limit":T.pink,"claude-api":T.acc};
  const filtered=LOGS.filter(l=>{
    if(logFilter!=="all"&&l.level!==logFilter)return false;
    if(searchLog&&!l.msg.toLowerCase().includes(searchLog.toLowerCase())&&!(l.user||"").toLowerCase().includes(searchLog.toLowerCase())&&!l.service.includes(searchLog.toLowerCase()))return false;
    return true;
  });
  const counts={error:LOGS.filter(l=>l.level==="error").length,warn:LOGS.filter(l=>l.level==="warn").length,info:LOGS.filter(l=>l.level==="info").length};
  return(
    <div className="page">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <div>
          <h1 style={{fontWeight:900,fontSize:22,marginBottom:4}}>🖥️ Logs Système</h1>
          <div style={{color:T.muted,fontSize:13}}>Erreurs, warnings et événements critiques.</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          {[{id:"all",label:"Tous",color:T.muted},{id:"error",label:`❌ Errors (${counts.error})`,color:T.pink},{id:"warn",label:`⚠️ Warns (${counts.warn})`,color:T.yellow},{id:"info",label:`ℹ️ Info (${counts.info})`,color:T.acc}].map(f=>(
            <button key={f.id} onClick={()=>setLogFilter(f.id)} style={{padding:"5px 12px",borderRadius:8,background:logFilter===f.id?`${f.color}20`:T.surf,border:`1px solid ${logFilter===f.id?f.color:T.border}`,color:logFilter===f.id?f.color:T.muted,fontSize:11,fontWeight:700,cursor:"pointer"}}>{f.label}</button>
          ))}
        </div>
      </div>
      <div style={{marginBottom:12}}>
        <input value={searchLog} onChange={e=>setSearchLog(e.target.value)} placeholder="🔍 Filtrer par service, message, utilisateur..." style={{width:"100%",padding:"9px 14px",borderRadius:10,background:T.surf,border:`1px solid ${T.border}`,color:T.text,fontSize:13}} onFocus={e=>e.target.style.borderColor=T.acc} onBlur={e=>e.target.style.borderColor=T.border}/>
      </div>
      <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,overflow:"hidden"}}>
        {filtered.map((log,i)=>(
          <div key={log.id} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"11px 16px",borderBottom:i<filtered.length-1?`1px solid ${T.border}`:"none",transition:"background .1s"}} onMouseEnter={e=>e.currentTarget.style.background=T.surf2} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <span style={{fontSize:10,padding:"2px 6px",borderRadius:4,background:`${levelColor[log.level]}20`,color:levelColor[log.level],fontWeight:800,textTransform:"uppercase",flexShrink:0,marginTop:1}}>{log.level}</span>
            <span style={{fontSize:10,padding:"2px 6px",borderRadius:4,background:`${serviceColor[log.service]||T.muted}15`,color:serviceColor[log.service]||T.muted,fontWeight:700,flexShrink:0,marginTop:1}}>{log.service}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontFamily:"JetBrains Mono",color:T.text,wordBreak:"break-all"}}>{log.msg}</div>
              {log.user&&<div style={{fontSize:10,color:T.dim,marginTop:2}}>{log.user}</div>}
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontSize:10,color:T.dim,fontFamily:"JetBrains Mono"}}>{log.time}</div>
              {log.code&&<div style={{fontSize:10,fontWeight:700,color:log.code>=400?T.pink:T.green,marginTop:1}}>{log.code}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
const AdminQueue=()=>{
  const [jobs,setJobs]=useState([
    {id:"job_8841",file:"vlog_tokyo_ep3.mp4",user:"Sophie Martin",size:"124 MB",lang:"Français",style:"Yellow Bold",status:"processing",progress:67,eta:"~8s",started:"22:14:11"},
    {id:"job_8840",file:"tutorial_nextjs15.mp4",user:"Lucas Dubois",size:"89 MB",lang:"English",style:"White Outline",status:"processing",progress:31,eta:"~22s",started:"22:14:22"},
    {id:"job_8839",file:"recette_ramen.mp4",user:"Emma Wilson",size:"56 MB",lang:"Français",style:"Dark Card",status:"queued",progress:0,eta:"~40s",started:"22:14:45"},
    {id:"job_8838",file:"motivation_short.mp4",user:"Yuki Tanaka",size:"33 MB",lang:"Japanese",style:"Neon Green",status:"queued",progress:0,eta:"~55s",started:"22:14:51"},
    {id:"job_8837",file:"gym_tips_ep7.mp4",user:"Antoine Bernard",size:"71 MB",lang:"Français",style:"MrBeast",status:"done",progress:100,eta:"—",started:"22:13:55"},
    {id:"job_8836",file:"finance_crash.mp4",user:"Lisa Chen",size:"95 MB",lang:"Chinese",style:"Gold Luxury",status:"done",progress:100,eta:"—",started:"22:13:40"},
    {id:"job_8835",file:"gaming_highlight.mp4",user:"Carlos García",size:"210 MB",lang:"Spanish",style:"Cyan Punch",status:"failed",progress:0,eta:"—",started:"22:12:18"},
  ]);
  const statusColor={processing:T.acc,queued:T.muted,done:T.green,failed:T.pink};
  const statusLabel={processing:"⚡ En cours",queued:"⏳ En attente",done:"✅ Terminé",failed:"❌ Échoué"};
  const stats={processing:jobs.filter(j=>j.status==="processing").length,queued:jobs.filter(j=>j.status==="queued").length,done:jobs.filter(j=>j.status==="done").length,failed:jobs.filter(j=>j.status==="failed").length};
  return(
    <div className="page">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <div>
          <h1 style={{fontWeight:900,fontSize:22,marginBottom:4}}>⚡ File de traitement</h1>
          <div style={{color:T.muted,fontSize:13}}>Jobs Whisper en temps réel.</div>
        </div>
        <button onClick={()=>notify("File actualisée","success")} style={{padding:"7px 16px",borderRadius:9,background:T.surf,border:`1px solid ${T.border}`,color:T.text,fontSize:12,fontWeight:700,cursor:"pointer"}}>🔄 Actualiser</button>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
        {[{label:"⚡ En cours",val:stats.processing,color:T.acc},{label:"⏳ En attente",val:stats.queued,color:T.muted},{label:"✅ Terminés",val:stats.done,color:T.green},{label:"❌ Échoués",val:stats.failed,color:T.pink}].map(s=>(
          <div key={s.label} style={{padding:"8px 14px",borderRadius:9,background:T.surf,border:`1px solid ${T.border}`,display:"flex",gap:8,alignItems:"center"}}>
            <span style={{fontWeight:900,fontSize:18,color:s.color}}>{s.val}</span>
            <span style={{fontSize:12,color:T.muted}}>{s.label}</span>
          </div>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {jobs.map(job=>(
          <div key={job.id} style={{background:T.surf,borderRadius:12,border:`1px solid ${job.status==="processing"?T.acc+"40":T.border}`,padding:"13px 16px",transition:"border .2s"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
              <span style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:`${statusColor[job.status]}18`,color:statusColor[job.status],fontWeight:800,flexShrink:0}}>{statusLabel[job.status]}</span>
              <div style={{flex:1,minWidth:120}}>
                <div style={{fontWeight:700,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{job.file}</div>
                <div style={{fontSize:11,color:T.muted}}>{job.user} · {job.size} · {job.lang} · {job.style}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:11,fontFamily:"JetBrains Mono",color:T.dim}}>{job.id}</div>
                <div style={{fontSize:10,color:T.dim}}>Démarré {job.started}</div>
              </div>
            </div>
            {job.status==="processing"&&(
              <div style={{marginTop:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:11}}>
                  <span style={{color:T.acc,fontWeight:700}}>{job.progress}%</span>
                  <span style={{color:T.muted}}>ETA {job.eta}</span>
                </div>
                <div style={{height:5,background:T.border,borderRadius:100,overflow:"hidden"}}>
                  <div style={{height:"100%",width:job.progress+"%",background:T.grad,borderRadius:100,boxShadow:`0 0 8px ${T.accGlow}`}}/>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
const AdminApiKeys=()=>{
  const SERVICES=[
    {
      id:"openai",name:"OpenAI Whisper",icon:"🎙️",color:T.purple,
      envVar:"OPENAI_API_KEY",prefix:"sk-proj-",placeholder:"sk-proj-••••••••••••••••••••••••••••••••••••••••",
      usage:"Transcription automatique des vidéos (Whisper v3)",cost:"~$0.006/min",free:false,
      docUrl:"https://platform.openai.com/api-keys",
      steps:[
        {n:1,title:"Créer un compte OpenAI",desc:"Va sur platform.openai.com et crée un compte gratuit.",action:"Ouvrir OpenAI Platform",url:"https://platform.openai.com/signup"},
        {n:2,title:"Ajouter un moyen de paiement",desc:"Dashboard → Billing → Add payment method. Mets €5-10 de crédit pour commencer."},
        {n:3,title:"Créer la clé API",desc:"Dashboard → API Keys → Create new secret key. Nomme-la \"SubCraft Production\"."},
        {n:4,title:"Copier et coller ici",desc:"⚠️ La clé n'est affichée qu'une seule fois ! Copie-la immédiatement et colle-la dans le champ ci-dessous."},
      ],
      fields:[{key:"apiKey",label:"Secret Key",placeholder:"sk-proj-...",icon:"🔑",required:true}],
    },
    {
      id:"anthropic",name:"Anthropic Claude",icon:"🤖",color:T.acc,
      envVar:"ANTHROPIC_API_KEY",prefix:"sk-ant-",placeholder:"sk-ant-api03-••••••••••••••••••••••••••••",
      usage:"Emojis IA, analyse contenu, suggestions virales",cost:"~$0.003/req",free:false,
      docUrl:"https://console.anthropic.com/settings/keys",
      steps:[
        {n:1,title:"Créer un compte Anthropic",desc:"Va sur console.anthropic.com et crée un compte.",action:"Ouvrir Anthropic Console",url:"https://console.anthropic.com"},
        {n:2,title:"Accéder aux clés API",desc:"Settings → API Keys → Create Key. Nomme-la \"SubCraft\"."},
        {n:3,title:"Ajouter du crédit",desc:"Settings → Billing → Add credits. $5 suffisent pour démarrer (~1600 requêtes)."},
        {n:4,title:"Copier la clé",desc:"Copie ta clé (commence par sk-ant-) et colle-la ci-dessous."},
      ],
      fields:[{key:"apiKey",label:"API Key",placeholder:"sk-ant-api03-...",icon:"🔑",required:true}],
    },
    {
      id:"stripe",name:"Stripe Paiements",icon:"💳",color:T.green,
      envVar:"STRIPE_SECRET_KEY",prefix:"sk_live_",placeholder:"sk_live_••••••••••••••••••••••••••••••••••••••••",
      usage:"Paiements, abonnements, webhooks",cost:"1.5% + €0.25/tx",free:true,
      docUrl:"https://dashboard.stripe.com/apikeys",
      steps:[
        {n:1,title:"Créer un compte Stripe",desc:"Va sur stripe.com/fr et crée ton compte. Gratuit, tu paies uniquement sur les transactions.",action:"Ouvrir Stripe",url:"https://dashboard.stripe.com/register"},
        {n:2,title:"Activer ton compte",desc:"Complète les infos de ton entreprise (SIRET, RIB) pour activer les paiements en live."},
        {n:3,title:"Récupérer les clés",desc:"Developers → API Keys. Tu vois la Publishable key et la Secret key. Utilise les clés LIVE (pas test) en production."},
        {n:4,title:"Configurer le webhook",desc:"Developers → Webhooks → Add endpoint. URL: https://votre-domaine.com/api/stripe/webhook — sélectionne tous les events payment_intent et checkout.session."},
        {n:5,title:"Copier les clés",desc:"Copie la Secret key (sk_live_...) et le webhook signing secret (whsec_...) ci-dessous."},
      ],
      fields:[
        {key:"secretKey",label:"Secret Key (live)",placeholder:"sk_live_...",icon:"🔑",required:true},
        {key:"webhookSecret",label:"Webhook Secret",placeholder:"whsec_...",icon:"🪝",required:false},
        {key:"publicKey",label:"Publishable Key",placeholder:"pk_live_...",icon:"🌐",required:true},
      ],
    },
    {
      id:"brevo",name:"Brevo (Emails)",icon:"📧",color:T.yellow,
      envVar:"BREVO_API_KEY",prefix:"xkeysib-",placeholder:"xkeysib-••••••••••••••••••••••••••••••••••••••••",
      usage:"Emails transactionnels (bienvenue, vidéo prête, upgrade)",cost:"Gratuit jusqu'à 300/j",free:true,
      docUrl:"https://app.brevo.com/settings/keys/api",
      steps:[
        {n:1,title:"Créer un compte Brevo",desc:"Va sur brevo.com et crée un compte gratuit (300 emails/jour offerts).",action:"Ouvrir Brevo",url:"https://www.brevo.com/fr/"},
        {n:2,title:"Vérifier ton domaine",desc:"Settings → Senders & Domains → Add a domain. Ajoute tes DNS TXT/DKIM pour améliorer la délivrabilité."},
        {n:3,title:"Créer la clé API",desc:"Settings → API Keys → Generate a new API key. Nomme-la \"SubCraft\" et sélectionne tous les accès."},
        {n:4,title:"Configurer le domaine d'envoi",desc:"L'expéditeur doit être noreply@ton-domaine.com pour éviter le spam."},
        {n:5,title:"Copier la clé",desc:"Copie ta clé API (commence par xkeysib-) et colle-la ci-dessous."},
      ],
      fields:[
        {key:"apiKey",label:"API Key",placeholder:"xkeysib-...",icon:"🔑",required:true},
        {key:"fromEmail",label:"Email expéditeur",placeholder:"noreply@subcraftai.com",icon:"📮",required:true},
        {key:"fromName",label:"Nom expéditeur",placeholder:"SubCraft",icon:"🏷️",required:false},
      ],
    },
    {
      id:"cloudflare",name:"Cloudflare R2 (Stockage)",icon:"☁️",color:T.orange,
      envVar:"CF_R2_ACCESS_KEY",prefix:"",placeholder:"••••••••••••••••••••••••••••••••",
      usage:"Stockage vidéos et fichiers (S3-compatible, pas de frais sortants)",cost:"~$0.015/GB/mois",free:false,
      docUrl:"https://dash.cloudflare.com/?to=/:account/r2",
      steps:[
        {n:1,title:"Créer un compte Cloudflare",desc:"Va sur cloudflare.com. La création est gratuite.",action:"Ouvrir Cloudflare",url:"https://dash.cloudflare.com/sign-up"},
        {n:2,title:"Activer R2 Storage",desc:"Dashboard → R2 Object Storage → Purchase R2. Première facture seulement après 10 GB."},
        {n:3,title:"Créer un bucket",desc:"R2 → Create bucket. Nomme-le \"subcraft-videos\". Région: Automatic."},
        {n:4,title:"Créer un token R2",desc:"R2 → Manage R2 API Tokens → Create API token. Permissions: Object Read & Write sur ton bucket uniquement."},
        {n:5,title:"Récupérer l'Account ID",desc:"Le Account ID est visible dans le sidebar de ton dashboard Cloudflare (format 32 caractères hexadécimaux)."},
        {n:6,title:"Copier les identifiants",desc:"Copie l'Access Key ID, la Secret Access Key, et ton Account ID ci-dessous."},
      ],
      fields:[
        {key:"accessKeyId",label:"Access Key ID",placeholder:"abc123...",icon:"🆔",required:true},
        {key:"secretKey",label:"Secret Access Key",placeholder:"••••••••••••••••••••••••••",icon:"🔑",required:true},
        {key:"accountId",label:"Account ID",placeholder:"a1b2c3d4...(32 chars)",icon:"🏢",required:true},
        {key:"bucketName",label:"Nom du bucket",placeholder:"subcraft-videos",icon:"🪣",required:true},
      ],
    },
    {
      id:"supabase",name:"Supabase (Base de données)",icon:"🗄️",color:T.cyan,
      envVar:"SUPABASE_URL",prefix:"https://",placeholder:"https://••••••••••••••••.supabase.co",
      usage:"Auth Google, base de données PostgreSQL, utilisateurs",cost:"Gratuit jusqu'à 500 MB",free:true,
      docUrl:"https://supabase.com/dashboard/project/_/settings/api",
      steps:[
        {n:1,title:"Créer un compte Supabase",desc:"Va sur supabase.com et connecte-toi avec GitHub. Gratuit jusqu'à 2 projets.",action:"Ouvrir Supabase",url:"https://supabase.com/dashboard"},
        {n:2,title:"Créer un projet",desc:"New Project → choisis un nom (\"subcraft\"), un mot de passe DB fort, et la région EU West (Paris)."},
        {n:3,title:"Récupérer l'URL et la clé",desc:"Settings → API → Project URL et Project API keys. Utilise la anon/public key pour le frontend et la service_role key pour le backend."},
        {n:4,title:"Activer Google OAuth (optionnel)",desc:"Authentication → Providers → Google → Activer. Crée des credentials Google OAuth sur console.cloud.google.com."},
        {n:5,title:"Copier les identifiants",desc:"Copie l'URL du projet et les deux clés (anon + service_role) ci-dessous."},
      ],
      fields:[
        {key:"url",label:"Project URL",placeholder:"https://xxxx.supabase.co",icon:"🌐",required:true},
        {key:"anonKey",label:"Anon/Public Key",placeholder:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",icon:"🔓",required:true},
        {key:"serviceKey",label:"Service Role Key (secret)",placeholder:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",icon:"🔑",required:true},
      ],
    },
  ];

  const [selectedService,setSelectedService]=useState("openai");
  const [tab,setTab]=useState("config"); // config | doc
  const [showKeys,setShowKeys]=useState({});
  const [saved,setSaved]=useState({});
  const [testing,setTesting]=useState(null);
  const [testResult,setTestResult]=useState({});
  const [values,setValues]=useState({}); // {serviceId: {fieldKey: value}}
  const [envCopied,setEnvCopied]=useState(false);

  const svc=SERVICES.find(s=>s.id===selectedService);

  const setValue=(svcId,fieldKey,val)=>setValues(p=>({...p,[svcId]:{...(p[svcId]||{}),[fieldKey]:val}}));
  const getVal=(svcId,fieldKey)=>values[svcId]?.[fieldKey]||"";

  const maskKey=(v)=>{
    if(!v||v.length<8)return v;
    return v.slice(0,6)+"•".repeat(Math.max(v.length-10,8))+v.slice(-4);
  };

  const saveService=(id)=>{
    setSaved(p=>({...p,[id]:true}));
    notify(`Clés ${SERVICES.find(s=>s.id===id)?.name} sauvegardées ✅`,"success");
    setTimeout(()=>setSaved(p=>({...p,[id]:false})),3000);
  };

  const testConnection=(id)=>{
    setTesting(id);
    setTestResult(p=>({...p,[id]:null}));
    setTimeout(()=>{
      const hasKeys=Object.values(values[id]||{}).some(v=>v&&v.length>4);
      const ok=hasKeys;
      setTestResult(p=>({...p,[id]:ok?"success":"empty"}));
      setTesting(null);
      notify(ok?"Connexion réussie ✅":"Aucune clé renseignée — ajoutez vos clés d'abord","warning");
    },1800);
  };

  const isConfigured=(id)=>Object.values(values[id]||{}).some(v=>v&&v.length>4);

  const generateEnvFile=()=>{
    const lines=["# SubCraft — Variables d'environnement","# Généré depuis le panel Admin SubCraft","# ⚠️  NE JAMAIS COMMITTER CE FICHIER (.gitignore)",""];
    SERVICES.forEach(s=>{
      lines.push(`# ${s.name} — ${s.usage}`);
      (s.fields||[]).forEach(f=>{
        const v=getVal(s.id,f.key);
        const envKey=s.envVar+(f.key==="apiKey"||f.key==="secretKey"?"":("_"+f.key.replace(/([A-Z])/g,"_$1").toUpperCase()));
        lines.push(`${envKey}=${v||"REMPLACER_PAR_VOTRE_CLE"}`);
      });
      lines.push("");
    });
    return lines.join("\n");
  };

  const copyEnvFile=()=>{
    navigator.clipboard?.writeText(generateEnvFile());
    setEnvCopied(true);
    notify("Fichier .env copié !","success");
    setTimeout(()=>setEnvCopied(false),3000);
  };

  return(
    <div className="page" style={{maxWidth:"100%"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <div>
          <h1 style={{fontWeight:900,fontSize:22,marginBottom:4}}>🔑 Configuration API</h1>
          <div style={{color:T.muted,fontSize:13}}>Renseigne tes clés API pour connecter tous les services. Zéro code requis.</div>
        </div>
        <button onClick={copyEnvFile} style={{display:"flex",alignItems:"center",gap:7,padding:"8px 16px",borderRadius:10,background:envCopied?T.green:T.surf2,border:`1px solid ${envCopied?T.green:T.border}`,color:envCopied?"#fff":T.muted,fontSize:12,fontWeight:700,cursor:"pointer",transition:"all .3s"}}>
          {envCopied?"✅ .env copié !":"📄 Exporter .env"}
        </button>
      </div>

      {/* Security banner */}
      <div style={{padding:"10px 14px",borderRadius:10,background:`${T.yellow}08`,border:`1px solid ${T.yellow}25`,fontSize:12,color:T.muted,marginBottom:18,display:"flex",gap:8,alignItems:"center"}}>
        <span>🔒</span>
        <span>Tes clés sont stockées localement dans le navigateur (localStorage). Pour la production, utilise des <strong style={{color:T.text}}>variables d'environnement</strong> sur Railway/Vercel. Ne partage jamais tes clés.</span>
      </div>

      {/* Status bar */}
      <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap"}}>
        {SERVICES.map(s=>(
          <button key={s.id} onClick={()=>{setSelectedService(s.id);setTab("config");}} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:8,background:selectedService===s.id?`${s.color}15`:T.surf,border:`1px solid ${selectedService===s.id?s.color:T.border}`,color:selectedService===s.id?s.color:T.muted,fontSize:12,fontWeight:selectedService===s.id?800:500,cursor:"pointer",transition:"all .15s"}}>
            <span style={{fontSize:14}}>{s.icon}</span>
            <span>{s.name.split(" ")[0]}</span>
            <span style={{width:7,height:7,borderRadius:"50%",background:isConfigured(s.id)?T.green:T.border,flexShrink:0,boxShadow:isConfigured(s.id)?`0 0 6px ${T.green}88`:undefined}}/>
          </button>
        ))}
      </div>

      {/* Main layout */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,alignItems:"start"}} className="mobile-col">

        {/* LEFT: Config form */}
        <div style={{background:T.surf,borderRadius:16,border:`1px solid ${svc.color}30`,overflow:"hidden"}}>
          {/* Service header */}
          <div style={{padding:"16px 20px",borderBottom:`1px solid ${T.border}`,background:`${svc.color}08`,display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:44,height:44,borderRadius:12,background:`${svc.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{svc.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:900,fontSize:16}}>{svc.name}</div>
              <div style={{fontSize:11,color:T.muted,marginTop:1}}>{svc.usage}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontSize:11,fontWeight:700,color:svc.free?T.green:T.yellow}}>{svc.cost}</div>
              {svc.free&&<div style={{fontSize:9,color:T.green,fontWeight:600}}>Plan gratuit dispo</div>}
            </div>
          </div>

          {/* Tabs */}
          <div style={{display:"flex",background:T.bg,borderBottom:`1px solid ${T.border}`}}>
            {[["config","⚙️ Configuration"],["doc","📖 Documentation"]].map(([id,label])=>(
              <button key={id} onClick={()=>setTab(id)} style={{flex:1,padding:"10px",background:tab===id?T.surf:"transparent",borderBottom:tab===id?`2px solid ${svc.color}`:"2px solid transparent",color:tab===id?svc.color:T.muted,fontWeight:tab===id?800:400,fontSize:12,cursor:"pointer",border:"none",borderBottom:tab===id?`2px solid ${svc.color}`:"2px solid transparent",transition:"all .2s"}}>{label}</button>
            ))}
          </div>

          {tab==="config"&&(
            <div style={{padding:"18px 20px"}}>
              <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:16}}>
                {svc.fields.map(field=>(
                  <div key={field.key}>
                    <label style={{fontSize:11,color:T.muted,display:"flex",alignItems:"center",gap:5,marginBottom:7,fontWeight:700}}>
                      <span>{field.icon}</span>{field.label}
                      {field.required&&<span style={{color:T.pink,fontSize:9,fontWeight:800}}>REQUIS</span>}
                    </label>
                    <div style={{position:"relative"}}>
                      <input
                        type={showKeys[`${svc.id}_${field.key}`]?"text":"password"}
                        value={getVal(svc.id,field.key)}
                        onChange={e=>setValue(svc.id,field.key,e.target.value)}
                        placeholder={field.placeholder}
                        style={{width:"100%",padding:"10px 80px 10px 12px",borderRadius:10,background:T.bg,border:`1px solid ${getVal(svc.id,field.key)?svc.color+"50":T.border}`,color:T.text,fontSize:12,fontFamily:getVal(svc.id,field.key)?"JetBrains Mono":"inherit",transition:"border .2s",boxSizing:"border-box"}}
                        onFocus={e=>e.target.style.borderColor=svc.color}
                        onBlur={e=>e.target.style.borderColor=getVal(svc.id,field.key)?svc.color+"50":T.border}
                      />
                      <div style={{position:"absolute",right:6,top:"50%",transform:"translateY(-50%)",display:"flex",gap:4}}>
                        <button onClick={()=>setShowKeys(p=>({...p,[`${svc.id}_${field.key}`]:!p[`${svc.id}_${field.key}`]}))} style={{padding:"3px 7px",borderRadius:5,background:T.surf,border:`1px solid ${T.border}`,color:T.muted,fontSize:10,cursor:"pointer"}}>
                          {showKeys[`${svc.id}_${field.key}`]?"🙈":"👁"}
                        </button>
                        {getVal(svc.id,field.key)&&(
                          <button onClick={()=>{navigator.clipboard?.writeText(getVal(svc.id,field.key));notify("Clé copiée","success");}} style={{padding:"3px 7px",borderRadius:5,background:T.surf,border:`1px solid ${T.border}`,color:T.muted,fontSize:10,cursor:"pointer"}}>📋</button>
                        )}
                      </div>
                    </div>
                    {getVal(svc.id,field.key)&&(
                      <div style={{fontSize:10,color:T.green,marginTop:3,fontFamily:"JetBrains Mono",display:"flex",alignItems:"center",gap:4}}>
                        <span>✓</span> {maskKey(getVal(svc.id,field.key))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Test result */}
              {testResult[svc.id]&&(
                <div style={{padding:"8px 12px",borderRadius:8,background:testResult[svc.id]==="success"?`${T.green}10`:`${T.yellow}10`,border:`1px solid ${testResult[svc.id]==="success"?T.green:T.yellow}25`,fontSize:12,color:testResult[svc.id]==="success"?T.green:T.yellow,fontWeight:700,marginBottom:12}}>
                  {testResult[svc.id]==="success"?"✅ Connexion validée !":"⚠️ Renseigne d'abord les clés requises"}
                </div>
              )}

              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>testConnection(svc.id)} disabled={testing===svc.id} style={{flex:1,padding:"9px",borderRadius:9,background:T.bg,border:`1px solid ${T.border}`,color:T.muted,fontSize:12,fontWeight:700,cursor:"pointer",transition:"all .2s"}}>
                  {testing===svc.id?"⏳ Test...":"🔌 Tester la connexion"}
                </button>
                <button onClick={()=>saveService(svc.id)} style={{flex:2,padding:"9px",borderRadius:9,background:saved[svc.id]?T.green:`${svc.color}`,border:"none",color:"#fff",fontSize:12,fontWeight:800,cursor:"pointer",transition:"all .3s",boxShadow:saved[svc.id]?undefined:`0 0 20px ${svc.color}40`}}>
                  {saved[svc.id]?"✅ Sauvegardé !":"💾 Sauvegarder"}
                </button>
              </div>
            </div>
          )}

          {tab==="doc"&&(
            <div style={{padding:"18px 20px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div style={{fontWeight:800,fontSize:13}}>Guide d'obtention de la clé</div>
                <a href={svc.docUrl} target="_blank" rel="noreferrer" style={{fontSize:11,color:svc.color,fontWeight:700,textDecoration:"none",padding:"4px 10px",borderRadius:6,background:`${svc.color}12`,border:`1px solid ${svc.color}25`}}>🔗 Ouvrir le dashboard →</a>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {svc.steps.map((step,i)=>(
                  <div key={step.n} style={{display:"flex",gap:12,padding:"11px 13px",borderRadius:11,background:T.bg,border:`1px solid ${T.border}`,transition:"border .2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=`${svc.color}40`} onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
                    <div style={{width:24,height:24,borderRadius:"50%",background:`${svc.color}20`,border:`2px solid ${svc.color}50`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:svc.color,flexShrink:0,marginTop:1}}>{step.n}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:800,fontSize:12,marginBottom:3}}>{step.title}</div>
                      <div style={{fontSize:11,color:T.muted,lineHeight:1.6}}>{step.desc}</div>
                      {step.action&&step.url&&(
                        <a href={step.url} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,marginTop:6,padding:"4px 10px",borderRadius:6,background:`${svc.color}15`,border:`1px solid ${svc.color}30`,color:svc.color,fontSize:11,fontWeight:700,textDecoration:"none"}}>
                          {step.action} ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{marginTop:14,padding:"10px 13px",borderRadius:10,background:`${T.green}0a`,border:`1px solid ${T.green}20`,fontSize:11,color:T.muted,lineHeight:1.6}}>
                💡 <strong style={{color:T.text}}>Astuce :</strong> Une fois ta clé obtenue, clique sur <strong style={{color:T.text}}>⚙️ Configuration</strong> en haut pour la coller directement.
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Overview all services */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {/* Summary */}
          <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:"16px 18px"}}>
            <div style={{fontWeight:800,fontSize:13,marginBottom:12}}>📡 État de tous les services</div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {SERVICES.map(s=>(
                <div key={s.id} onClick={()=>{setSelectedService(s.id);setTab("config");}} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 11px",borderRadius:9,background:selectedService===s.id?`${s.color}0a`:T.bg,border:`1px solid ${selectedService===s.id?s.color+"30":T.border}`,cursor:"pointer",transition:"all .15s"}}>
                  <span style={{fontSize:18,flexShrink:0}}>{s.icon}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.name}</div>
                    <div style={{fontSize:10,color:T.muted}}>{s.cost} {s.free&&<span style={{color:T.green}}>· gratuit</span>}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                    {isConfigured(s.id)
                      ?<span style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:`${T.green}15`,color:T.green,fontWeight:800}}>✅ Configuré</span>
                      :<span style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:`${T.muted}12`,color:T.muted,fontWeight:700}}>⏳ Manquant</span>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* .env preview */}
          <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:"16px 18px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <div style={{fontWeight:800,fontSize:13}}>📄 Aperçu fichier .env</div>
              <button onClick={copyEnvFile} style={{fontSize:11,padding:"4px 10px",borderRadius:6,background:envCopied?T.green:T.bg,border:`1px solid ${envCopied?T.green:T.border}`,color:envCopied?"#fff":T.muted,fontWeight:700,cursor:"pointer",transition:"all .3s"}}>
                {envCopied?"✅ Copié":"📋 Copier"}
              </button>
            </div>
            <div style={{background:T.bg,borderRadius:9,border:`1px solid ${T.border}`,padding:"12px",fontFamily:"JetBrains Mono",fontSize:10,color:T.muted,maxHeight:200,overflowY:"auto",lineHeight:1.7}}>
              {SERVICES.map(s=>(
                <div key={s.id}>
                  <span style={{color:T.dim}}># {s.name}</span><br/>
                  {(s.fields||[]).map(f=>{
                    const v=getVal(s.id,f.key);
                    const envKey=s.envVar+(f.key==="apiKey"||f.key==="secretKey"?"":("_"+f.key.replace(/([A-Z])/g,"_$1").toUpperCase()));
                    return <div key={f.key}><span style={{color:T.acc}}>{envKey}</span>=<span style={{color:v?T.green:T.pink}}>{v?maskKey(v):"REMPLACER"}</span></div>;
                  })}
                  <br/>
                </div>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:"16px 18px"}}>
            <div style={{fontWeight:800,fontSize:13,marginBottom:12}}>🚀 Progression du setup</div>
            {(()=>{
              const configured=SERVICES.filter(s=>isConfigured(s.id)).length;
              const pct=Math.round((configured/SERVICES.length)*100);
              return(
                <>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:12}}>
                    <span style={{color:T.muted}}>{configured}/{SERVICES.length} services configurés</span>
                    <span style={{fontWeight:800,color:pct===100?T.green:T.acc}}>{pct}%</span>
                  </div>
                  <div style={{height:8,background:T.border,borderRadius:100,overflow:"hidden",marginBottom:12}}>
                    <div style={{height:"100%",width:pct+"%",background:pct===100?T.green:T.grad,borderRadius:100,transition:"width .5s",boxShadow:pct>0?`0 0 12px ${T.accGlow}`:undefined}}/>
                  </div>
                  {pct===100
                    ?<div style={{fontSize:12,color:T.green,fontWeight:700,textAlign:"center"}}>🎉 Tous les services sont configurés ! SubCraft est prêt pour la production.</div>
                    :<div style={{fontSize:11,color:T.muted}}>Il te reste <strong style={{color:T.text}}>{SERVICES.length-configured} service{SERVICES.length-configured>1?"s":""}</strong> à configurer avant le lancement.</div>
                  }
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};
const AdminStorage=()=>{
  const usageR2=47.2,maxR2=50;
  const pctR2=Math.round((usageR2/maxR2)*100);
  const bandwidth=[
    {d:"L",v:2.1},{d:"M",v:3.4},{d:"M",v:2.8},{d:"J",v:4.1},{d:"V",v:5.2},{d:"S",v:3.9},{d:"D",v:2.7}
  ];
  const maxBW=Math.max(...bandwidth.map(b=>b.v));
  const services=[
    {name:"Cloudflare R2 Storage",icon:"☁️",used:`${usageR2} GB`,total:`${maxR2} GB`,pct:pctR2,color:pctR2>90?T.pink:pctR2>75?T.orange:T.green,cost:"€4.70/mois"},
    {name:"Whisper API (OpenAI)",icon:"🎙️",used:"42.840 min",total:"—",pct:null,color:T.purple,cost:"€28.40/mois"},
    {name:"Claude AI (Anthropic)",icon:"🤖",used:"1.847 req",total:"—",pct:null,color:T.acc,cost:"€12.30/mois"},
    {name:"Railway (serveur)",icon:"🚂",used:"2.1 GB RAM",total:"4 GB",pct:52,color:T.cyan,cost:"€5/mois"},
    {name:"Vercel (frontend)",icon:"▲",used:"142k req",total:"—",pct:null,color:T.muted,cost:"€0/mois"},
  ];
  return(
    <div className="page">
      <div style={{marginBottom:24}}>
        <h1 style={{fontWeight:900,fontSize:22,marginBottom:4}}>💾 Stockage & Infrastructure</h1>
        <div style={{color:T.muted,fontSize:13}}>Utilisation des ressources cloud et coûts mensuels.</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12,marginBottom:20}}>
        {[
          {icon:"💰",label:"Coût total infra",val:"€50.40",sub:"ce mois",color:T.yellow},
          {icon:"☁️",label:"Stockage R2",val:pctR2+"%",sub:`${usageR2}/${maxR2} GB`,color:pctR2>90?T.pink:T.green},
          {icon:"🎬",label:"Vidéos traitées",val:"284",sub:"ce mois",color:T.acc},
          {icon:"🗑",label:"Auto-supprimées",val:"271",sub:"en 24h RGPD",color:T.green},
        ].map(k=>(
          <div key={k.label} style={{padding:"14px 16px",borderRadius:13,background:T.surf,border:`1px solid ${T.border}`}}>
            <div style={{fontSize:22,marginBottom:8}}>{k.icon}</div>
            <div style={{fontWeight:900,fontSize:22,color:k.color}}>{k.val}</div>
            <div style={{fontWeight:700,fontSize:12,marginBottom:2}}>{k.label}</div>
            <div style={{fontSize:11,color:T.muted}}>{k.sub}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}} className="mobile-col">
        <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:"18px 20px"}}>
          <div style={{fontWeight:800,fontSize:14,marginBottom:16}}>📡 Services actifs</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {services.map(s=>(
              <div key={s.name}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:s.pct!==null?6:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:16}}>{s.icon}</span>
                    <div>
                      <div style={{fontWeight:700,fontSize:12}}>{s.name}</div>
                      <div style={{fontSize:10,color:T.muted}}>{s.used}{s.total!=="—"?` / ${s.total}`:""}</div>
                    </div>
                  </div>
                  <span style={{fontSize:11,color:T.green,fontWeight:700}}>{s.cost}</span>
                </div>
                {s.pct!==null&&(
                  <div style={{height:4,background:T.border,borderRadius:100,overflow:"hidden"}}>
                    <div style={{height:"100%",width:s.pct+"%",background:s.color,borderRadius:100,transition:"width .5s"}}/>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:"18px 20px"}}>
          <div style={{fontWeight:800,fontSize:14,marginBottom:16}}>📶 Bande passante (GB/j)</div>
          <div style={{display:"flex",gap:4,alignItems:"flex-end",height:100,marginBottom:8}}>
            {bandwidth.map((b,i)=>{
              const h=(b.v/maxBW)*100;
              return(
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                  <span style={{fontSize:9,color:T.muted}}>{b.v}</span>
                  <div style={{width:"100%",height:h+"%",background:T.grad,borderRadius:"3px 3px 0 0",minHeight:4}}/>
                  <span style={{fontSize:9,color:T.dim}}>{b.d}</span>
                </div>
              );
            })}
          </div>
          {pctR2>90&&(
            <div style={{padding:"8px 12px",borderRadius:8,background:`${T.pink}0d`,border:`1px solid ${T.pink}25`,fontSize:11,color:T.pink,fontWeight:700}}>
              🚨 R2 à {pctR2}% — Action requise dans {"<"}3 jours
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const AdminSearch=()=>{
  const [q,setQ]=useState("");
  const [cat,setCat]=useState("all");
  const allResults=[
    {type:"user",icon:"👤",title:"Sophie Martin",sub:"Pro · sophie@gmail.com · 47 vidéos",color:T.acc},
    {type:"user",icon:"👤",title:"Lucas Dubois",sub:"Expert · lucas@outlook.com · 23 vidéos",color:T.acc},
    {type:"video",icon:"🎬",title:"Vlog Paris Ep.12",sub:"Sophie Martin · Exporté · 07/03/2026",color:T.green},
    {type:"video",icon:"🎬",title:"Tutorial React Hooks",sub:"Lucas Dubois · Exporté · 07/03/2026",color:T.green},
    {type:"transaction",icon:"💳",title:"Paiement €21 — Expert",sub:"Lucas Dubois · 08/03/2026 · Stripe",color:T.yellow},
    {type:"transaction",icon:"💳",title:"Paiement €42 — Pro",sub:"Sophie Martin · 01/03/2026 · Stripe",color:T.yellow},
    {type:"coupon",icon:"🎟️",title:"RESTE20 (−20%)",sub:"12 utilisations · Expire 31/03/2026",color:T.purple},
    {type:"email",icon:"📧",title:"Bienvenue sur SubCraft ✦",sub:"sophie@gmail.com · Ouvert · Auj. 14:32",color:T.pink},
  ];
  const cats=["all","user","video","transaction","coupon","email"];
  const filtered=allResults.filter(r=>{
    if(cat!=="all"&&r.type!==cat)return false;
    if(!q)return true;
    return r.title.toLowerCase().includes(q.toLowerCase())||r.sub.toLowerCase().includes(q.toLowerCase());
  });
  return(
    <div className="page">
      <div style={{marginBottom:24}}>
        <h1 style={{fontWeight:900,fontSize:22,marginBottom:4}}>🔍 Recherche Globale</h1>
        <div style={{color:T.muted,fontSize:13}}>Recherche unifiée : utilisateurs, vidéos, paiements, emails.</div>
      </div>
      <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="🔍 Rechercher un utilisateur, une vidéo, une transaction..." style={{width:"100%",padding:"13px 16px",borderRadius:12,background:T.surf,border:`2px solid ${q?T.acc:T.border}`,color:T.text,fontSize:15,marginBottom:14,transition:"border .2s",fontWeight:500}} onFocus={e=>e.target.style.borderColor=T.acc} onBlur={e=>{if(!q)e.target.style.borderColor=T.border;}}/>
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {cats.map(c=>(
          <button key={c} onClick={()=>setCat(c)} style={{padding:"5px 12px",borderRadius:7,background:cat===c?T.acc:T.surf,border:`1px solid ${cat===c?T.acc:T.border}`,color:cat===c?"#fff":T.muted,fontSize:12,fontWeight:cat===c?700:400,cursor:"pointer",transition:"all .15s"}}>{c==="all"?"Tout":c==="user"?"👤 Users":c==="video"?"🎬 Vidéos":c==="transaction"?"💳 Paiements":c==="coupon"?"🎟️ Coupons":"📧 Emails"}</button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:7}}>
        {filtered.length===0&&<div style={{textAlign:"center",padding:"48px 24px",color:T.muted,fontSize:14}}>Aucun résultat pour "{q}"</div>}
        {filtered.map((r,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 15px",borderRadius:11,background:T.surf,border:`1px solid ${T.border}`,cursor:"pointer",transition:"all .15s"}} onMouseEnter={e=>{e.currentTarget.style.background=T.surf2;e.currentTarget.style.borderColor=r.color+"40";}} onMouseLeave={e=>{e.currentTarget.style.background=T.surf;e.currentTarget.style.borderColor=T.border;}}>
            <div style={{width:36,height:36,borderRadius:9,background:`${r.color}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{r.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:14}}>{r.title}</div>
              <div style={{fontSize:11,color:T.muted}}>{r.sub}</div>
            </div>
            <span style={{fontSize:10,padding:"2px 7px",borderRadius:4,background:`${r.color}15`,color:r.color,fontWeight:700}}>{r.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
const AdminLeaderboard=()=>{
  const users=[
    {rank:1,name:"Antoine Bernard",avatar:"AB",country:"🇫🇷",plan:"Pro",videos:156,exports:148,views:"2.4M",revenue:"€0",trend:"+12"},
    {rank:2,name:"Yuki Tanaka",avatar:"YT",country:"🇯🇵",plan:"Pro",videos:89,exports:85,views:"1.8M",revenue:"€0",trend:"+8"},
    {rank:3,name:"Sophie Martin",avatar:"SM",country:"🇫🇷",plan:"Pro",videos:47,exports:44,views:"890K",revenue:"€0",trend:"+5"},
    {rank:4,name:"Marie Lefebvre",avatar:"ML",country:"🇫🇷",plan:"Expert",videos:31,exports:28,views:"512K",revenue:"€0",trend:"+3"},
    {rank:5,name:"Lisa Chen",avatar:"LC",country:"🇨🇳",plan:"Expert",videos:44,exports:40,views:"730K",revenue:"€0",trend:"+6"},
    {rank:6,name:"Lucas Dubois",avatar:"LD",country:"🇫🇷",plan:"Expert",videos:23,exports:21,views:"310K",revenue:"€0",trend:"+2"},
    {rank:7,name:"Emma Wilson",avatar:"EW",country:"🇬🇧",plan:"Basic",videos:8,exports:7,views:"94K",revenue:"€0",trend:"+1"},
  ];
  const medals=["🥇","🥈","🥉"];
  return(
    <div className="page">
      <div style={{marginBottom:24}}>
        <h1 style={{fontWeight:900,fontSize:22,marginBottom:4}}>🏆 Leaderboard Créateurs</h1>
        <div style={{color:T.muted,fontSize:13}}>Top utilisateurs par volume de vidéos produites.</div>
      </div>
      <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"40px 1fr 80px 80px 90px 70px 60px",borderBottom:`1px solid ${T.border}`,background:T.surf2}}>
          {["#","Créateur","Vidéos","Exports","Vues","Plan","7j"].map(h=>(
            <div key={h} style={{padding:"10px 12px",fontSize:11,fontWeight:700,color:T.muted}}>{h}</div>
          ))}
        </div>
        {users.map((u,i)=>(
          <div key={u.rank} style={{display:"grid",gridTemplateColumns:"40px 1fr 80px 80px 90px 70px 60px",borderBottom:i<users.length-1?`1px solid ${T.border}`:"none",transition:"background .1s"}} onMouseEnter={e=>e.currentTarget.style.background=T.surf2} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{padding:"12px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{medals[i]||u.rank}</div>
            <div style={{padding:"10px 12px",display:"flex",alignItems:"center",gap:9}}>
              <div style={{width:30,height:30,borderRadius:"50%",background:T.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:"#fff",flexShrink:0}}>{u.avatar}</div>
              <div>
                <div style={{fontWeight:700,fontSize:13}}>{u.name} {u.country}</div>
              </div>
            </div>
            <div style={{padding:"12px",display:"flex",alignItems:"center",fontWeight:700,color:T.acc}}>{u.videos}</div>
            <div style={{padding:"12px",display:"flex",alignItems:"center",color:T.muted,fontSize:13}}>{u.exports}</div>
            <div style={{padding:"12px",display:"flex",alignItems:"center",color:T.green,fontSize:13,fontWeight:600}}>{u.views}</div>
            <div style={{padding:"12px",display:"flex",alignItems:"center"}}>
              <span style={{fontSize:10,padding:"2px 7px",borderRadius:5,background:`${u.plan==="Pro"?T.acc:u.plan==="Expert"?T.green:T.muted}15`,color:u.plan==="Pro"?T.acc:u.plan==="Expert"?T.green:T.muted,fontWeight:700}}>{u.plan}</span>
            </div>
            <div style={{padding:"12px",display:"flex",alignItems:"center",color:T.green,fontSize:13,fontWeight:700}}>+{u.trend}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
const AdminSEO=()=>{
  const [tab,setTab]=useState("meta");
  const [saved,setSaved]=useState(false);
  const [metaTitle,setMetaTitle]=useState("SubCraft — Sous-titres IA pour créateurs viraux");
  const [metaDesc,setMetaDesc]=useState("Génère des sous-titres professionnels en 10 secondes avec Whisper AI. 24 styles, TikTok, YouTube Shorts, Instagram Reels. Essai gratuit.");
  const [ogImage,setOgImage]=useState("https://subcraftai.com/og-image.png");
  const [posts,setPosts]=useState([
    {id:1,title:"Comment faire des sous-titres viraux en 2026",status:"published",views:3842,date:"05/03/2026",slug:"sous-titres-viraux-2026"},
    {id:2,title:"MrBeast style : reproduire ses sous-titres jaunes",status:"published",views:2109,date:"01/03/2026",slug:"mrbeast-style-sous-titres"},
    {id:3,title:"TikTok vs YouTube Shorts : quel format choisir ?",status:"published",views:1580,date:"25/02/2026",slug:"tiktok-vs-youtube-shorts"},
    {id:4,title:"5 erreurs de sous-titres qui tuent ton engagement",status:"draft",views:0,date:"—",slug:"erreurs-sous-titres"},
    {id:5,title:"Guide complet : exporter en SRT, ASS et MP4",status:"draft",views:0,date:"—",slug:"guide-export-srt-ass-mp4"},
  ]);
  const [newPost,setNewPost]=useState({title:"",slug:"",content:""});
  const [addPost,setAddPost]=useState(false);
  const save=()=>{setSaved(true);notify("SEO sauvegardé ✅","success");setTimeout(()=>setSaved(false),2000);};
  const titleLen=metaTitle.length, descLen=metaDesc.length;
  return(
    <div className="page">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <div>
          <h1 style={{fontWeight:900,fontSize:22,marginBottom:4}}>🌍 SEO & Contenu</h1>
          <div style={{color:T.muted,fontSize:13}}>Meta tags, blog, Open Graph et score SEO.</div>
        </div>
        <button onClick={save} className="btn-shimmer" style={{padding:"8px 20px",borderRadius:10,background:saved?T.green:T.grad,border:"none",color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer",transition:"all .3s"}}>{saved?"✅ Sauvegardé":"💾 Sauvegarder"}</button>
      </div>
      <div style={{display:"flex",background:T.bg,borderRadius:10,padding:3,marginBottom:20,gap:3,maxWidth:480}}>
        {[["meta","🏷️ Meta Tags"],["og","📸 Open Graph"],["blog","📝 Blog & Articles"],["score","📊 Score SEO"]].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{flex:1,padding:"7px 6px",borderRadius:7,background:tab===id?T.surf2:"transparent",border:tab===id?`1px solid ${T.border}`:"none",color:tab===id?T.text:T.muted,fontWeight:tab===id?700:400,fontSize:11,cursor:"pointer",transition:"all .2s"}}>{label}</button>
        ))}
      </div>
      {tab==="meta"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}} className="mobile-col">
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:"18px 20px"}}>
              <div style={{fontWeight:800,fontSize:14,marginBottom:16}}>🏷️ Balises Meta</div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <label style={{fontSize:12,color:T.muted,fontWeight:600}}>Title</label>
                    <span style={{fontSize:11,color:titleLen>60?T.pink:titleLen>50?T.yellow:T.green,fontWeight:700}}>{titleLen}/60</span>
                  </div>
                  <input value={metaTitle} onChange={e=>setMetaTitle(e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:9,background:T.bg,border:`1px solid ${T.border}`,color:T.text,fontSize:13}} onFocus={e=>e.target.style.borderColor=T.acc} onBlur={e=>e.target.style.borderColor=T.border}/>
                </div>
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <label style={{fontSize:12,color:T.muted,fontWeight:600}}>Meta Description</label>
                    <span style={{fontSize:11,color:descLen>160?T.pink:descLen>140?T.yellow:T.green,fontWeight:700}}>{descLen}/160</span>
                  </div>
                  <textarea value={metaDesc} onChange={e=>setMetaDesc(e.target.value)} rows={4} style={{width:"100%",padding:"9px 12px",borderRadius:9,background:T.bg,border:`1px solid ${T.border}`,color:T.text,fontSize:13,resize:"vertical",lineHeight:1.6}} onFocus={e=>e.target.style.borderColor=T.acc} onBlur={e=>e.target.style.borderColor=T.border}/>
                </div>
                <Input label="Canonical URL" value="https://subcraftai.com" onChange={()=>{}} icon="🔗"/>
                <Input label="Robots" value="index, follow" onChange={()=>{}} icon="🤖"/>
              </div>
            </div>
          </div>
          <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:"18px 20px"}}>
            <div style={{fontWeight:800,fontSize:14,marginBottom:16}}>👁 Aperçu Google</div>
            <div style={{padding:"14px 16px",borderRadius:10,background:"#fff",marginBottom:14}}>
              <div style={{color:"#1a0dab",fontSize:17,fontWeight:400,fontFamily:"arial,sans-serif",marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{metaTitle}</div>
              <div style={{color:"#006621",fontSize:13,fontFamily:"arial,sans-serif",marginBottom:4}}>subcraftai.com</div>
              <div style={{color:"#545454",fontSize:13,fontFamily:"arial,sans-serif",lineHeight:1.5,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{metaDesc}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[
                {label:"Title",ok:titleLen<=60&&titleLen>=30,msg:titleLen>60?"Trop long (max 60 car.)":titleLen<30?"Trop court":"Longueur idéale"},
                {label:"Description",ok:descLen<=160&&descLen>=80,msg:descLen>160?"Trop longue (max 160)":descLen<80?"Trop courte":"Longueur idéale"},
              ].map(c=>(
                <div key={c.label} style={{display:"flex",alignItems:"center",gap:8,fontSize:12}}>
                  <span style={{color:c.ok?T.green:T.yellow,fontWeight:900}}>{c.ok?"✓":"⚠"}</span>
                  <span style={{color:T.muted}}>{c.label} : </span>
                  <span style={{color:c.ok?T.green:T.yellow,fontWeight:600}}>{c.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {tab==="og"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}} className="mobile-col">
          <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:"18px 20px"}}>
            <div style={{fontWeight:800,fontSize:14,marginBottom:16}}>📸 Open Graph / Twitter Card</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <Input label="og:title" value={metaTitle} onChange={setMetaTitle} icon="📝"/>
              <Input label="og:description" value={metaDesc.slice(0,100)+"..."} onChange={()=>{}} icon="📄"/>
              <Input label="og:image URL" value={ogImage} onChange={setOgImage} icon="🖼️"/>
              <div>
                <label style={{fontSize:12,color:T.muted,display:"block",marginBottom:6,fontWeight:600}}>og:type</label>
                <div style={{display:"flex",gap:6}}>
                  {["website","article","product"].map(t=>(
                    <button key={t} style={{padding:"5px 12px",borderRadius:7,background:t==="website"?T.acc:T.bg,border:`1px solid ${t==="website"?T.acc:T.border}`,color:t==="website"?"#fff":T.muted,fontSize:12,cursor:"pointer"}}>{t}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:"18px 20px"}}>
            <div style={{fontWeight:800,fontSize:14,marginBottom:14}}>👁 Aperçu partage</div>
            <div style={{borderRadius:10,overflow:"hidden",border:`1px solid ${T.border}`}}>
              <div style={{height:140,background:`linear-gradient(135deg,${T.acc}30,${T.purple}20)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40}}>✦</div>
              <div style={{padding:"10px 12px",background:"#f0f2f5"}}>
                <div style={{fontSize:11,color:"#606770",fontFamily:"Helvetica,sans-serif",marginBottom:2}}>subcraftai.com</div>
                <div style={{fontWeight:700,fontSize:14,color:"#050505",fontFamily:"Helvetica,sans-serif",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{metaTitle.slice(0,60)}</div>
                <div style={{fontSize:12,color:"#606770",fontFamily:"Helvetica,sans-serif",marginTop:2,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{metaDesc.slice(0,120)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      {tab==="blog"&&(
        <div>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}>
            <Btn onClick={()=>setAddPost(true)} icon="✏️">Nouvel article</Btn>
          </div>
          <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead>
                <tr style={{background:T.surf2,borderBottom:`1px solid ${T.border}`}}>
                  {["Titre","Statut","Vues","Date","Actions"].map(h=>(
                    <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:T.muted}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map(p=>(
                  <tr key={p.id} style={{borderBottom:`1px solid ${T.border}`,transition:"background .1s"}} onMouseEnter={e=>e.currentTarget.style.background=T.surf2} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{padding:"11px 14px"}}>
                      <div style={{fontWeight:700,fontSize:13}}>{p.title}</div>
                      <div style={{fontSize:10,color:T.dim,fontFamily:"JetBrains Mono"}}>/{p.slug}</div>
                    </td>
                    <td style={{padding:"11px 14px"}}><span style={{fontSize:10,padding:"2px 8px",borderRadius:5,background:p.status==="published"?`${T.green}18`:`${T.muted}15`,color:p.status==="published"?T.green:T.muted,fontWeight:700}}>{p.status==="published"?"✅ Publié":"📝 Brouillon"}</span></td>
                    <td style={{padding:"11px 14px",fontWeight:700,color:T.acc}}>{p.views>0?p.views.toLocaleString():"—"}</td>
                    <td style={{padding:"11px 14px",color:T.dim,fontSize:11}}>{p.date}</td>
                    <td style={{padding:"11px 14px"}}>
                      <div style={{display:"flex",gap:6}}>
                        <button onClick={()=>notify("Éditeur ouvert","info")} style={{padding:"4px 9px",borderRadius:6,background:T.bg,border:`1px solid ${T.border}`,color:T.muted,fontSize:11,cursor:"pointer"}}>✏️</button>
                        <button onClick={()=>{setPosts(prev=>prev.map(x=>x.id===p.id?{...x,status:x.status==="published"?"draft":"published"}:x));notify(p.status==="published"?"Article dépublié":"Article publié",p.status==="published"?"warning":"success");}} style={{padding:"4px 9px",borderRadius:6,background:T.bg,border:`1px solid ${T.border}`,color:T.muted,fontSize:11,cursor:"pointer"}}>{p.status==="published"?"⏸":"▶"}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {addPost&&(
            <Modal title="✏️ Nouvel article" onClose={()=>setAddPost(false)} width={540}>
              <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
                <Input label="Titre" value={newPost.title} onChange={v=>{setNewPost(p=>({...p,title:v,slug:v.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/,"")}));}} placeholder="Comment faire des sous-titres viraux..." icon="📝"/>
                <Input label="Slug URL" value={newPost.slug} onChange={v=>setNewPost(p=>({...p,slug:v}))} placeholder="sous-titres-viraux" icon="🔗"/>
                <div>
                  <label style={{fontSize:12,color:T.muted,display:"block",marginBottom:6,fontWeight:600}}>Contenu</label>
                  <textarea value={newPost.content} onChange={e=>setNewPost(p=>({...p,content:e.target.value}))} placeholder="Corps de l'article..." rows={5} style={{width:"100%",padding:"9px 12px",borderRadius:9,background:T.surf,border:`1px solid ${T.border}`,color:T.text,fontSize:13,resize:"vertical",lineHeight:1.6}}/>
                </div>
              </div>
              <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                <Btn v="secondary" onClick={()=>setAddPost(false)}>Annuler</Btn>
                <Btn v="secondary" onClick={()=>{if(!newPost.title)return;setPosts(p=>[...p,{id:Date.now(),title:newPost.title,slug:newPost.slug,status:"draft",views:0,date:"—"}]);setAddPost(false);setNewPost({title:"",slug:"",content:""});notify("Brouillon créé","success");}}>Brouillon</Btn>
                <Btn onClick={()=>{if(!newPost.title)return;setPosts(p=>[...p,{id:Date.now(),title:newPost.title,slug:newPost.slug,status:"published",views:0,date:new Date().toLocaleDateString("fr-FR")}]);setAddPost(false);setNewPost({title:"",slug:"",content:""});notify("Article publié !","success");}}>▶ Publier</Btn>
              </div>
            </Modal>
          )}
        </div>
      )}
      {tab==="score"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}} className="mobile-col">
          <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:"18px 20px"}}>
            <div style={{fontWeight:800,fontSize:14,marginBottom:16}}>📊 Score SEO Global</div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}}>
              <div style={{position:"relative",width:120,height:120}}>
                <svg viewBox="0 0 120 120" style={{position:"absolute",inset:0}}>
                  <circle cx="60" cy="60" r="50" fill="none" stroke={T.border} strokeWidth="10"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke={T.green} strokeWidth="10" strokeDasharray={`${2*Math.PI*50*78/100} ${2*Math.PI*50*(1-78/100)}`} strokeLinecap="round" strokeDashoffset={2*Math.PI*50*0.25} style={{transition:"stroke-dasharray .8s"}}/>
                </svg>
                <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontWeight:900,fontSize:28,color:T.green}}>78</span>
                  <span style={{fontSize:10,color:T.muted}}>/100</span>
                </div>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {[
                {label:"Meta title",score:95,ok:true},
                {label:"Meta description",score:88,ok:true},
                {label:"Open Graph",score:90,ok:true},
                {label:"Vitesse page",score:72,ok:true},
                {label:"Mobile-friendly",score:85,ok:true},
                {label:"Backlinks",score:34,ok:false},
                {label:"Articles de blog",score:60,ok:true},
                {label:"Schema.org",score:0,ok:false},
              ].map(item=>(
                <div key={item.label}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3,fontSize:12}}>
                    <span style={{color:T.text}}>{item.ok?"✅":"⚠️"} {item.label}</span>
                    <span style={{fontWeight:700,color:item.score>70?T.green:item.score>40?T.yellow:T.pink}}>{item.score}</span>
                  </div>
                  <div style={{height:4,background:T.border,borderRadius:100,overflow:"hidden"}}>
                    <div style={{height:"100%",width:item.score+"%",background:item.score>70?T.green:item.score>40?T.yellow:T.pink,borderRadius:100}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:"18px 20px"}}>
            <div style={{fontWeight:800,fontSize:14,marginBottom:14}}>🎯 Actions prioritaires</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[
                {prio:"HIGH",label:"Ajouter Schema.org JSON-LD",desc:"Structured data pour rich snippets Google",icon:"📋",color:T.pink},
                {prio:"HIGH",label:"Obtenir 5 backlinks de qualité",desc:"DA >40 — blogs tech, ProductHunt",icon:"🔗",color:T.pink},
                {prio:"MED",label:"Améliorer Largest Contentful Paint",desc:"Hero image trop lourde — optimiser à <2.5s",icon:"⚡",color:T.yellow},
                {prio:"MED",label:"Publier 3 articles blog/mois",desc:"Mots-clés : sous-titres TikTok, whisper AI",icon:"✍️",color:T.yellow},
                {prio:"LOW",label:"Ajouter sitemap.xml",desc:"Soumis sur Google Search Console",icon:"🗺️",color:T.green},
              ].map(a=>(
                <div key={a.label} style={{display:"flex",gap:10,padding:"10px 12px",borderRadius:10,background:T.bg,border:`1px solid ${T.border}`}}>
                  <span style={{fontSize:18,flexShrink:0}}>{a.icon}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2}}>
                      <span style={{fontWeight:700,fontSize:12}}>{a.label}</span>
                      <span style={{fontSize:9,padding:"1px 5px",borderRadius:3,background:`${a.color}18`,color:a.color,fontWeight:800}}>{a.prio}</span>
                    </div>
                    <div style={{fontSize:11,color:T.muted}}>{a.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const AdminLiveChat=()=>{
  const [activeConv,setActiveConv]=useState(1);
  const [replyText,setReplyText]=useState("");
  const [convs,setConvs]=useState([
    {id:1,user:"Sophie Martin",avatar:"SM",plan:"Pro",status:"waiting",unread:2,lastMsg:"J'ai un problème avec l'export MP4...",time:"Il y a 2min",msgs:[
      {from:"user",text:"Salut ! J'ai un problème avec l'export MP4 de ma dernière vidéo.",time:"22:10"},
      {from:"user",text:"Ça dit 'Export échoué' mais la transcription s'est bien passée.",time:"22:11"},
    ]},
    {id:2,user:"Lucas Dubois",avatar:"LD",plan:"Expert",status:"active",unread:0,lastMsg:"Merci beaucoup c'est résolu !",time:"Il y a 15min",msgs:[
      {from:"user",text:"Comment changer le style de sous-titres après export ?",time:"21:55"},
      {from:"admin",text:"Pas possible après export, tu dois re-générer depuis l'éditeur 😊",time:"21:57"},
      {from:"user",text:"Merci beaucoup c'est résolu !",time:"21:58"},
    ]},
    {id:3,user:"Carlos García",avatar:"CG",plan:"Free",status:"waiting",unread:1,lastMsg:"Comment passer au plan payant ?",time:"Il y a 32min",msgs:[
      {from:"user",text:"Comment passer au plan payant depuis mon téléphone ?",time:"21:41"},
    ]},
    {id:4,user:"Priya Sharma",avatar:"PS",plan:"Free",status:"closed",unread:0,lastMsg:"Ticket fermé",time:"Hier",msgs:[
      {from:"user",text:"Je n'arrive pas à me connecter avec Google.",time:"20:30"},
      {from:"admin",text:"Essaie de vider le cache de ton navigateur et réessaie 🙏",time:"20:35"},
      {from:"user",text:"Ça marche ! Merci.",time:"20:38"},
      {from:"admin",text:"Super ! N'hésite pas si tu as d'autres questions 😊",time:"20:39"},
    ]},
  ]);
  const curConv=convs.find(c=>c.id===activeConv);
  const statusColor={waiting:T.yellow,active:T.green,closed:T.muted};
  const statusLabel={waiting:"⏳ En attente",active:"🟢 Actif",closed:"✅ Fermé"};
  const quickReplies=["Bonjour ! Comment puis-je vous aider ? 😊","Je comprends votre problème, je vais vérifier ça.","Pourriez-vous me donner l'ID de votre vidéo ?","Le problème est résolu de notre côté, réessayez !","Je transmets ça à l'équipe technique, délai 24h."];
  const sendReply=(text)=>{
    if(!text.trim())return;
    setConvs(prev=>prev.map(c=>c.id===activeConv?{...c,msgs:[...c.msgs,{from:"admin",text,time:new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}],lastMsg:text,status:"active"}:c));
    setReplyText("");
  };
  return(
    <div className="page" style={{height:"calc(100vh - 40px)",display:"flex",flexDirection:"column"}}>
      <div style={{marginBottom:16,flexShrink:0}}>
        <h1 style={{fontWeight:900,fontSize:22,marginBottom:4}}>💬 Live Chat Support</h1>
        <div style={{color:T.muted,fontSize:13}}>Conversations en temps réel avec tes utilisateurs.</div>
      </div>
      <div style={{display:"flex",gap:0,flex:1,minHeight:0,borderRadius:16,border:`1px solid ${T.border}`,overflow:"hidden"}}>
        {/* Sidebar conversations */}
        <div style={{width:260,background:T.surf2,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",flexShrink:0}}>
          <div style={{padding:"12px 14px",borderBottom:`1px solid ${T.border}`,display:"flex",gap:6,flexWrap:"wrap"}}>
            {[{label:"Tous",n:convs.length},{label:"⏳ Attente",n:convs.filter(c=>c.status==="waiting").length},{label:"🟢 Actifs",n:convs.filter(c=>c.status==="active").length}].map(f=>(
              <span key={f.label} style={{fontSize:10,padding:"3px 8px",borderRadius:5,background:T.surf,border:`1px solid ${T.border}`,color:T.muted,fontWeight:600}}>{f.label} ({f.n})</span>
            ))}
          </div>
          <div style={{flex:1,overflowY:"auto"}}>
            {convs.map(c=>(
              <div key={c.id} onClick={()=>{setActiveConv(c.id);setConvs(p=>p.map(x=>x.id===c.id?{...x,unread:0}:x));}} style={{padding:"12px 14px",borderBottom:`1px solid ${T.border}`,cursor:"pointer",background:activeConv===c.id?`${T.acc}10`:"transparent",borderLeft:activeConv===c.id?`3px solid ${T.acc}`:"3px solid transparent",transition:"all .15s"}}>
                <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:5}}>
                  <div style={{width:30,height:30,borderRadius:"50%",background:T.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:"#fff",flexShrink:0}}>{c.avatar}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:4}}>
                      <span style={{fontWeight:700,fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.user}</span>
                      {c.unread>0&&<span style={{width:16,height:16,borderRadius:"50%",background:T.pink,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:900,color:"#fff",flexShrink:0}}>{c.unread}</span>}
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:5}}>
                      <span style={{fontSize:9,color:statusColor[c.status],fontWeight:700}}>{statusLabel[c.status]}</span>
                      <span style={{fontSize:9,color:T.dim}}>·</span>
                      <span style={{fontSize:9,padding:"1px 5px",borderRadius:3,background:`${T.acc}15`,color:T.acc,fontWeight:700}}>{c.plan}</span>
                    </div>
                  </div>
                </div>
                <div style={{fontSize:11,color:T.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",paddingLeft:39}}>{c.lastMsg}</div>
                <div style={{fontSize:9,color:T.dim,paddingLeft:39,marginTop:2}}>{c.time}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Chat area */}
        <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
          {curConv&&(
            <>
              <div style={{padding:"12px 16px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:12,background:T.surf,flexShrink:0}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:T.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:900,color:"#fff"}}>{curConv.avatar}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:800,fontSize:14}}>{curConv.user}</div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <span style={{fontSize:10,color:statusColor[curConv.status],fontWeight:700}}>{statusLabel[curConv.status]}</span>
                    <span style={{fontSize:10,color:T.dim}}>·</span>
                    <span style={{fontSize:10,color:T.muted}}>Plan {curConv.plan}</span>
                  </div>
                </div>
                <button onClick={()=>{setConvs(p=>p.map(c=>c.id===activeConv?{...c,status:"closed",lastMsg:"Ticket fermé"}:c));notify("Ticket fermé","success");}} style={{padding:"5px 12px",borderRadius:7,background:T.bg,border:`1px solid ${T.border}`,color:T.muted,fontSize:11,fontWeight:700,cursor:"pointer"}}>✅ Fermer</button>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:10}}>
                {curConv.msgs.map((m,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:m.from==="admin"?"flex-end":"flex-start"}}>
                    <div style={{maxWidth:"75%"}}>
                      <div style={{padding:"9px 13px",borderRadius:m.from==="admin"?"14px 14px 4px 14px":"14px 14px 14px 4px",background:m.from==="admin"?T.acc:T.surf2,color:m.from==="admin"?"#fff":T.text,fontSize:13,lineHeight:1.5}}>{m.text}</div>
                      <div style={{fontSize:9,color:T.dim,marginTop:3,textAlign:m.from==="admin"?"right":"left"}}>{m.from==="admin"?"Vous":"Client"} · {m.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{borderTop:`1px solid ${T.border}`,padding:"12px",flexShrink:0,background:T.surf}}>
                <div style={{display:"flex",gap:5,marginBottom:8,flexWrap:"wrap"}}>
                  {quickReplies.slice(0,3).map((qr,i)=>(
                    <button key={i} onClick={()=>setReplyText(qr)} style={{fontSize:10,padding:"3px 9px",borderRadius:5,background:T.bg,border:`1px solid ${T.border}`,color:T.muted,cursor:"pointer",whiteSpace:"nowrap",maxWidth:180,overflow:"hidden",textOverflow:"ellipsis"}}>⚡ {qr.slice(0,30)}...</button>
                  ))}
                </div>
                <div style={{display:"flex",gap:8}}>
                  <input value={replyText} onChange={e=>setReplyText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendReply(replyText);}}} placeholder="Répondre..." style={{flex:1,padding:"9px 12px",borderRadius:9,background:T.bg,border:`1px solid ${T.border}`,color:T.text,fontSize:13}} onFocus={e=>e.target.style.borderColor=T.acc} onBlur={e=>e.target.style.borderColor=T.border}/>
                  <button onClick={()=>sendReply(replyText)} disabled={!replyText.trim()} style={{padding:"9px 16px",borderRadius:9,background:replyText.trim()?T.acc:T.border,border:"none",color:"#fff",fontSize:13,fontWeight:700,cursor:replyText.trim()?"pointer":"default",transition:"all .2s"}}>↗</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
const AdminReports=()=>{
  const [generating,setGenerating]=useState(null);
  const [sent,setSent]=useState([]);
  const reports=[
    {id:"weekly",icon:"📅",title:"Rapport hebdomadaire",desc:"Résumé MRR, nouveaux users, churn, top vidéos — envoyé chaque lundi à 9h",freq:"Lundi 9h00",nextSend:"Lundi 10/03 · 09:00",recipients:"admin@subcraftai.com",lastSent:"03/03/2026",enabled:true},
    {id:"monthly",icon:"📆",title:"Rapport mensuel",desc:"Rapport complet : revenus, cohortes, LTV, NPS, top créateurs",freq:"1er du mois",nextSend:"01/04/2026 · 09:00",recipients:"admin@subcraftai.com, founder@subcraftai.com",lastSent:"01/03/2026",enabled:true},
    {id:"revenue",icon:"💰",title:"Rapport revenus Stripe",desc:"Détail transactions, MRR, ARR, failing payments",freq:"Quotidien 8h",nextSend:"Demain · 08:00",recipients:"admin@subcraftai.com",lastSent:"Aujourd'hui",enabled:false},
    {id:"errors",icon:"🔴",title:"Rapport erreurs système",desc:"Erreurs Whisper, R2, Stripe + taux d'échec sur 24h",freq:"Quotidien 7h",nextSend:"Demain · 07:00",recipients:"admin@subcraftai.com",lastSent:"Aujourd'hui",enabled:true},
  ];
  const generate=(id)=>{
    setGenerating(id);
    setTimeout(()=>{setGenerating(null);setSent(p=>[...p,id]);notify("Rapport généré et envoyé par email ✅","success");},2200);
  };
  const preview=[
    {label:"MRR",val:"€2.418",delta:"+8.2%",color:T.green},
    {label:"Nouveaux users",val:"61",delta:"+12%",color:T.acc},
    {label:"Churn",val:"2.2%",delta:"-0.5pt",color:T.green},
    {label:"Vidéos traitées",val:"284",delta:"+18%",color:T.purple},
    {label:"Taux conversion",val:"1.5%",delta:"+0.3pt",color:T.yellow},
    {label:"NPS Score",val:"72",delta:"+4",color:T.cyan},
  ];
  return(
    <div className="page">
      <div style={{marginBottom:24}}>
        <h1 style={{fontWeight:900,fontSize:22,marginBottom:4}}>📋 Rapports Automatiques</h1>
        <div style={{color:T.muted,fontSize:13}}>Génération et envoi automatique de rapports par email.</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}} className="mobile-col">
        <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:"18px 20px"}}>
          <div style={{fontWeight:800,fontSize:14,marginBottom:14}}>📊 Aperçu rapport hebdo</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {preview.map(p=>(
              <div key={p.label} style={{padding:"10px 12px",borderRadius:9,background:T.bg,border:`1px solid ${T.border}`}}>
                <div style={{fontSize:10,color:T.muted,marginBottom:3}}>{p.label}</div>
                <div style={{fontWeight:900,fontSize:18,color:p.color}}>{p.val}</div>
                <div style={{fontSize:10,fontWeight:700,color:p.delta.startsWith("+")?T.green:p.delta.startsWith("-")&&p.label!=="Churn"?T.pink:T.green}}>{p.delta} vs sem. préc.</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:"18px 20px"}}>
          <div style={{fontWeight:800,fontSize:14,marginBottom:14}}>⚙️ Paramètres d'envoi</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <Input label="Email destinataire principal" value="admin@subcraftai.com" onChange={()=>{}} icon="📧"/>
            <Input label="CC (optionnel)" value="founder@subcraftai.com" onChange={()=>{}} icon="📧"/>
            <div>
              <label style={{fontSize:12,color:T.muted,display:"block",marginBottom:6,fontWeight:600}}>Fuseau horaire</label>
              <div style={{padding:"9px 12px",borderRadius:9,background:T.bg,border:`1px solid ${T.border}`,fontSize:13,color:T.muted}}>🌍 Europe/Paris (UTC+1)</div>
            </div>
            <Btn onClick={()=>notify("Paramètres sauvegardés","success")} full>💾 Sauvegarder</Btn>
          </div>
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {reports.map(r=>(
          <div key={r.id} style={{background:T.surf,borderRadius:13,border:`1px solid ${T.border}`,padding:"16px 18px",display:"flex",alignItems:"flex-start",gap:14,flexWrap:"wrap"}}>
            <div style={{width:40,height:40,borderRadius:10,background:`${T.acc}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{r.icon}</div>
            <div style={{flex:1,minWidth:200}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                <span style={{fontWeight:800,fontSize:14}}>{r.title}</span>
                <span style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:r.enabled?`${T.green}15`:`${T.muted}12`,color:r.enabled?T.green:T.muted,fontWeight:800}}>{r.enabled?"🟢 Actif":"⏸ Inactif"}</span>
              </div>
              <div style={{fontSize:12,color:T.muted,marginBottom:6,lineHeight:1.5}}>{r.desc}</div>
              <div style={{display:"flex",gap:14,flexWrap:"wrap",fontSize:11,color:T.dim}}>
                <span>🔄 {r.freq}</span>
                <span>⏭ {r.nextSend}</span>
                <span>📧 {r.recipients}</span>
                <span>✅ Dernier : {r.lastSent}</span>
              </div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
              <Tog value={r.enabled} onChange={()=>notify(`Rapport ${r.enabled?"désactivé":"activé"}`,r.enabled?"warning":"success")}/>
              <button onClick={()=>generate(r.id)} disabled={!!generating} style={{padding:"6px 14px",borderRadius:8,background:sent.includes(r.id)?T.green:T.acc,border:"none",color:"#fff",fontSize:11,fontWeight:800,cursor:generating?"wait":"pointer",transition:"all .3s",minWidth:100}}>
                {generating===r.id?"⏳ Génération...":sent.includes(r.id)?"✅ Envoyé":"📤 Envoyer maintenant"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   ADMIN: LANDING PAGE EDITOR
══════════════════════════════════════════════ */
const AdminLandingEditor=()=>{
  const [activeSection,setActiveSection]=useState("hero");
  const [saved,setSaved]=useState(false);

  // HERO
  const [heroLine1,setHeroLine1]=useState("Des sous-titres");
  const [heroLine2,setHeroLine2]=useState("qui explosent");
  const [heroLine3,setHeroLine3]=useState("tes vues 🚀");
  const [heroDesc,setHeroDesc]=useState("Upload ta vidéo — l'IA transcrit en 10 secondes. Choisis parmi 24 styles pro. Exporte en 1 clic.");
  const [heroCTA,setHeroCTA]=useState("Générer mes sous-titres — Gratuit");
  const [heroStats,setHeroStats]=useState([
    {label:"Créateurs actifs",val:"10k+"},
    {label:"Précision Whisper",val:"99%"},
    {label:"Génération",val:"< 10s"},
    {label:"Styles",val:"24"},
  ]);

  // PHONE 3D
  const [phoneBg,setPhoneBg]=useState("REGARDE ÇA 😱");
  const [phoneVideoId,setPhoneVideoId]=useState("dQw4w9WgXcQ");
  const [phoneVideoUrl,setPhoneVideoUrl]=useState("");
  const [phoneSubs,setPhoneSubs]=useState([
    {text:"YEAH CEST FOU 🔥",color:"#FFE600",font:"Impact"},
    {text:"attends de voir la suite...",color:"rgba(255,255,255,.9)",font:"DM Sans"},
    {text:"ça va tout changer 🚀",color:"#34d399",font:"DM Sans"},
  ]);

  // TESTIMONIALS
  const [testimonials,setTestimonials]=useState([
    {name:"Sophie M.",role:"TikToker · 890k abonnés",text:"J'ai multiplié mes vues par 3 en 2 semaines. Les styles MrBeast et Squeezie sont parfaits.",color:"#5b6cff"},
    {name:"Lucas D.",role:"YouTubeur · 210k abonnés",text:"La transcription en 10 secondes c'est dingue. Avant je passais 2h par vidéo, maintenant 5 minutes.",color:"#a855f7"},
    {name:"Emma W.",role:"Créatrice Reels · 450k",text:"L'interface est magnifique et les styles vraiment pro. Mes Reels ont explosé depuis SubCraft.",color:"#e83970"},
  ]);

  // FAQ
  const [faqs,setFaqs]=useState([
    {q:"SubCraft est-il vraiment gratuit ?",a:"Oui — plan gratuit avec 3 vidéos/mois, aucune carte bancaire requise."},
    {q:"Puis-je importer depuis YouTube ou TikTok ?",a:"Oui ! Colle simplement l'URL — SubCraft télécharge et traite automatiquement."},
    {q:"Combien de temps prend la transcription ?",a:"Moins de 10 secondes pour une vidéo de 60s. Moins de 90s pour des vidéos longues."},
    {q:"Mes vidéos sont-elles sécurisées ?",a:"Toutes les vidéos sont supprimées automatiquement après 24h (RGPD)."},
    {q:"Puis-je annuler à tout moment ?",a:"Oui, sans engagement. L'accès reste actif jusqu'à la fin de la période."},
  ]);

  // HOW IT WORKS
  const [steps,setSteps]=useState([
    {icon:"📁",title:"Upload ta vidéo",desc:"Glisse-dépose ton MP4, MOV ou colle un lien YouTube / TikTok."},
    {icon:"🤖",title:"L'IA transcrit",desc:"Whisper génère tes sous-titres en 10 secondes avec une précision de 99%."},
    {icon:"✦",title:"Exporte en 1 clic",desc:"Choisis ton style, peaufine, puis exporte ton MP4 HD avec sous-titres incrustés."},
  ]);

  // FOOTER / BRAND
  const [brandName,setBrandName]=useState("SubCraft");
  const [brandTagline,setBrandTagline]=useState("Des sous-titres IA pour créateurs viraux.");
  const [supportEmail,setSupportEmail]=useState("support@subcraftai.com");

  const save=()=>{setSaved(true);notify("✅ Site mis à jour !","success");setTimeout(()=>setSaved(false),2500);};

  const SECTIONS=[
    {id:"hero",icon:"🎯",label:"Hero"},
    {id:"phone",icon:"📱",label:"Téléphone 3D"},
    {id:"steps",icon:"📋",label:"Comment ça marche"},
    {id:"testimonials",icon:"💬",label:"Avis clients"},
    {id:"faq",icon:"❓",label:"FAQ"},
    {id:"brand",icon:"✦",label:"Marque & Footer"},
  ];

  const TA=({value,onChange,rows=3})=>(
    <textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows}
      style={{width:"100%",padding:"10px 14px",borderRadius:10,fontSize:13,background:T.bg,border:`1px solid ${T.border}`,color:T.text,resize:"vertical",lineHeight:1.6,fontFamily:"DM Sans,sans-serif"}}/>
  );

  const PhonePreview=()=>{
    const cfg={videoId:phoneVideoId||"dQw4w9WgXcQ",bgText:phoneBg,bgColor:phoneSubs[0]?.color||"#FFE600",subs:phoneSubs};
    return <Phone3D config={cfg} size="normal"/>;
  };

  return(
    <div className="page" style={{maxWidth:1100}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <div>
          <h1 style={{fontWeight:800,fontSize:22,marginBottom:4}}>🖥️ Éditeur du site</h1>
          <p style={{color:T.muted,fontSize:13}}>Modifie toutes les pages sans coder</p>
        </div>
        <Btn onClick={save} style={{background:T.grad}} icon="💾">{saved?"✅ Sauvegardé !":"Sauvegarder tout"}</Btn>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"200px 1fr 200px",gap:20,alignItems:"start"}}>
        {/* Section nav */}
        <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:10,position:"sticky",top:20}}>
          {SECTIONS.map(s=>(
            <button key={s.id} onClick={()=>setActiveSection(s.id)} style={{width:"100%",padding:"9px 12px",borderRadius:10,background:activeSection===s.id?`${T.acc}15`:"transparent",border:"none",color:activeSection===s.id?T.acc:T.muted,fontSize:13,fontWeight:activeSection===s.id?700:400,cursor:"pointer",display:"flex",alignItems:"center",gap:9,marginBottom:2,textAlign:"left",transition:"all .15s"}}>
              <span>{s.icon}</span>{s.label}
            </button>
          ))}
        </div>

        {/* Main editor */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>

          {activeSection==="hero"&&(
            <div style={{background:T.surf,borderRadius:16,border:`1px solid ${T.border}`,padding:22}}>
              <div style={{fontWeight:700,fontSize:15,marginBottom:20,display:"flex",alignItems:"center",gap:8}}>🎯 Section Hero — Page d'accueil</div>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <Input label="Titre ligne 1 (blanc)" value={heroLine1} onChange={setHeroLine1}/>
                <Input label="Titre ligne 2 (gradient violet→rose)" value={heroLine2} onChange={setHeroLine2}/>
                <Input label="Titre ligne 3 (blanc)" value={heroLine3} onChange={setHeroLine3}/>
                <div>
                  <label style={{fontSize:12,color:T.muted,display:"block",marginBottom:6,fontWeight:600}}>Description sous le titre</label>
                  <TA value={heroDesc} onChange={setHeroDesc}/>
                </div>
                <Input label="Texte bouton CTA principal" value={heroCTA} onChange={setHeroCTA} icon="✦"/>
                <div>
                  <label style={{fontSize:12,color:T.muted,display:"block",marginBottom:10,fontWeight:600}}>📊 Chiffres clés (barre hero)</label>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    {heroStats.map((s,i)=>(
                      <div key={i} style={{padding:"10px 12px",borderRadius:10,background:T.bg,border:`1px solid ${T.border}`}}>
                        <input value={s.label} onChange={e=>setHeroStats(p=>p.map((x,j)=>j===i?{...x,label:e.target.value}:x))}
                          style={{width:"100%",background:"none",border:"none",color:T.muted,fontSize:10,marginBottom:4}}/>
                        <input value={s.val} onChange={e=>setHeroStats(p=>p.map((x,j)=>j===i?{...x,val:e.target.value}:x))}
                          style={{width:"100%",background:"none",border:"none",color:T.acc,fontWeight:800,fontSize:18,fontFamily:"JetBrains Mono"}}/>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection==="phone"&&(
            <div style={{background:T.surf,borderRadius:16,border:`1px solid ${T.border}`,padding:22}}>
              <div style={{fontWeight:700,fontSize:15,marginBottom:20}}>📱 Téléphone 3D — démo hero</div>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {/* YouTube video embed */}
                <div style={{padding:"14px",borderRadius:12,background:"rgba(255,0,0,.05)",border:"1px solid rgba(255,80,80,.25)"}}>
                  <div style={{fontWeight:700,fontSize:13,color:"#ff6060",marginBottom:4}}>🎬 Vidéo de fond (YouTube)</div>
                  <div style={{fontSize:11,color:T.muted,marginBottom:10}}>Colle l'URL ou l'ID YouTube — visible dans l'aperçu en cliquant ▶</div>
                  <input value={phoneVideoUrl} onChange={e=>{
                    setPhoneVideoUrl(e.target.value);
                    const raw=e.target.value.trim();
                    const m=raw.match(/(?:youtu\.be\/|v=|embed\/)([a-zA-Z0-9_-]{11})/);
                    if(m)setPhoneVideoId(m[1]);
                    else if(/^[a-zA-Z0-9_-]{11}$/.test(raw))setPhoneVideoId(raw);
                  }} placeholder="Ex: https://youtu.be/dQw4w9WgXcQ ou dQw4w9WgXcQ"
                  style={{width:"100%",padding:"9px 12px",borderRadius:9,fontSize:12,background:T.bg,border:"1px solid rgba(255,80,80,.3)",color:T.text,fontFamily:"JetBrains Mono",marginBottom:8}}/>
                  {phoneVideoId&&<div style={{fontSize:11,color:T.green,marginBottom:8}}>✓ ID vidéo: <strong>{phoneVideoId}</strong></div>}
                  <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                    <span style={{fontSize:11,color:T.muted,alignSelf:"center"}}>Raccourcis :</span>
                    {[["MrBeast","pRpeEdMmmQ0"],["Squeezie","5bvn6JCbvqI"],["Short viral 1","K4TOrB4pPCA"],["Short viral 2","J8GGJ7VD3zM"]].map(([label,id])=>(
                      <button key={id} onClick={()=>{setPhoneVideoId(id);setPhoneVideoUrl(id);notify(`🎬 Vidéo "${label}" chargée !`,"success");}} style={{padding:"4px 10px",borderRadius:7,background:phoneVideoId===id?"rgba(255,80,80,.2)":"transparent",border:`1px solid ${phoneVideoId===id?"rgba(255,80,80,.5)":"rgba(255,80,80,.2)"}`,color:phoneVideoId===id?"#ff6060":T.muted,fontSize:11,cursor:"pointer",fontWeight:phoneVideoId===id?700:400,transition:"all .15s"}}>{label}</button>
                    ))}
                  </div>
                </div>
                <Input label="Texte dans la vidéo (fond)" value={phoneBg} onChange={setPhoneBg} placeholder="REGARDE ÇA 😱"/>
                {phoneSubs.map((s,i)=>(
                  <div key={i} style={{padding:"14px",borderRadius:12,background:T.bg,border:`1px solid ${T.border}`}}>
                    <div style={{fontWeight:600,fontSize:12,color:T.muted,marginBottom:10}}>Sous-titre {i+1}{i===0?" (style MrBeast)":""}</div>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      <Input label="Texte" value={s.text} onChange={v=>setPhoneSubs(p=>p.map((x,j)=>j===i?{...x,text:v}:x))}/>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <label style={{fontSize:12,color:T.muted,minWidth:60}}>Couleur</label>
                        <input type="color" value={s.color.startsWith("rgba")?"#ffffff":s.color}
                          onChange={e=>setPhoneSubs(p=>p.map((x,j)=>j===i?{...x,color:e.target.value}:x))}
                          style={{width:32,height:28,borderRadius:6,border:`1px solid ${T.border}`,background:"none",cursor:"pointer",padding:2}}/>
                        <input value={s.color} onChange={e=>setPhoneSubs(p=>p.map((x,j)=>j===i?{...x,color:e.target.value}:x))}
                          style={{flex:1,padding:"6px 10px",borderRadius:8,fontSize:11,background:T.bg,border:`1px solid ${T.border}`,color:T.text,fontFamily:"JetBrains Mono"}}/>
                      </div>
                      <div>
                        <label style={{fontSize:12,color:T.muted,display:"block",marginBottom:4,fontWeight:600}}>Police</label>
                        <select value={s.font} onChange={e=>setPhoneSubs(p=>p.map((x,j)=>j===i?{...x,font:e.target.value}:x))}
                          style={{width:"100%",padding:"7px 10px",borderRadius:8,background:T.bg,border:`1px solid ${T.border}`,color:T.text,fontSize:13}}>
                          {["Impact","DM Sans","Syne","Bebas Neue","Montserrat","Oswald","Poppins"].map(f=><option key={f}>{f}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection==="steps"&&(
            <div style={{background:T.surf,borderRadius:16,border:`1px solid ${T.border}`,padding:22}}>
              <div style={{fontWeight:700,fontSize:15,marginBottom:20}}>📋 Comment ça marche — 3 étapes</div>
              {steps.map((s,i)=>(
                <div key={i} style={{padding:"14px",borderRadius:12,background:T.bg,border:`1px solid ${T.border}`,marginBottom:12}}>
                  <div style={{fontWeight:600,fontSize:12,color:T.muted,marginBottom:10}}>Étape {i+1}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <input value={s.icon} onChange={e=>setSteps(p=>p.map((x,j)=>j===i?{...x,icon:e.target.value}:x))}
                        style={{width:44,padding:"6px",borderRadius:8,background:T.surf,border:`1px solid ${T.border}`,color:T.text,fontSize:18,textAlign:"center"}}/>
                      <input value={s.title} onChange={e=>setSteps(p=>p.map((x,j)=>j===i?{...x,title:e.target.value}:x))}
                        style={{flex:1,padding:"8px 12px",borderRadius:8,background:T.surf,border:`1px solid ${T.border}`,color:T.text,fontSize:14,fontWeight:700}}/>
                    </div>
                    <TA value={s.desc} onChange={v=>setSteps(p=>p.map((x,j)=>j===i?{...x,desc:v}:x))} rows={2}/>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection==="testimonials"&&(
            <div style={{background:T.surf,borderRadius:16,border:`1px solid ${T.border}`,padding:22}}>
              <div style={{fontWeight:700,fontSize:15,marginBottom:20}}>💬 Avis clients</div>
              {testimonials.map((t,i)=>(
                <div key={i} style={{padding:"14px",borderRadius:12,background:T.bg,border:`1px solid ${T.border}`,marginBottom:12}}>
                  <div style={{fontWeight:600,fontSize:12,color:T.muted,marginBottom:10}}>Avis {i+1}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                      <Input label="Nom" value={t.name} onChange={v=>setTestimonials(p=>p.map((x,j)=>j===i?{...x,name:v}:x))}/>
                      <Input label="Rôle / Titre" value={t.role} onChange={v=>setTestimonials(p=>p.map((x,j)=>j===i?{...x,role:v}:x))}/>
                    </div>
                    <div>
                      <label style={{fontSize:12,color:T.muted,display:"block",marginBottom:4,fontWeight:600}}>Témoignage</label>
                      <TA value={t.text} onChange={v=>setTestimonials(p=>p.map((x,j)=>j===i?{...x,text:v}:x))} rows={2}/>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <label style={{fontSize:12,color:T.muted,minWidth:60}}>Couleur</label>
                      <input type="color" value={t.color} onChange={e=>setTestimonials(p=>p.map((x,j)=>j===i?{...x,color:e.target.value}:x))}
                        style={{width:32,height:28,borderRadius:6,border:`1px solid ${T.border}`,cursor:"pointer",padding:2}}/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection==="faq"&&(
            <div style={{background:T.surf,borderRadius:16,border:`1px solid ${T.border}`,padding:22}}>
              <div style={{fontWeight:700,fontSize:15,marginBottom:20}}>❓ Questions fréquentes</div>
              {faqs.map((f,i)=>(
                <div key={i} style={{padding:"14px",borderRadius:12,background:T.bg,border:`1px solid ${T.border}`,marginBottom:10}}>
                  <div style={{fontWeight:600,fontSize:11,color:T.muted,marginBottom:8}}>FAQ {i+1}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    <Input label="Question" value={f.q} onChange={v=>setFaqs(p=>p.map((x,j)=>j===i?{...x,q:v}:x))}/>
                    <div>
                      <label style={{fontSize:12,color:T.muted,display:"block",marginBottom:4,fontWeight:600}}>Réponse</label>
                      <TA value={f.a} onChange={v=>setFaqs(p=>p.map((x,j)=>j===i?{...x,a:v}:x))} rows={2}/>
                    </div>
                  </div>
                </div>
              ))}
              <Btn v="secondary" size="sm" icon="+" onClick={()=>setFaqs(p=>[...p,{q:"Nouvelle question ?",a:"Réponse ici."}])}>Ajouter une FAQ</Btn>
            </div>
          )}

          {activeSection==="brand"&&(
            <div style={{background:T.surf,borderRadius:16,border:`1px solid ${T.border}`,padding:22}}>
              <div style={{fontWeight:700,fontSize:15,marginBottom:20}}>✦ Marque & Footer</div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <Input label="Nom de la marque" value={brandName} onChange={setBrandName}/>
                <Input label="Tagline footer" value={brandTagline} onChange={setBrandTagline}/>
                <Input label="Email support" value={supportEmail} onChange={setSupportEmail} type="email"/>
                <div style={{padding:"14px",borderRadius:12,background:T.bg,border:`1px solid ${T.border}`}}>
                  <div style={{fontWeight:600,fontSize:12,color:T.muted,marginBottom:8}}>Liens footer</div>
                  {[["CGU","cgu"],["Confidentialité","privacy"],["Mentions légales","legal"],["RGPD","rgpd"]].map(([label,id])=>(
                    <div key={id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${T.border}`,fontSize:12}}>
                      <span style={{color:T.muted}}>{label}</span>
                      <Tag color={T.green}>✓ Actif</Tag>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Live preview */}
        <div style={{position:"sticky",top:20,display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
          <div style={{fontSize:10,color:T.muted,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase"}}>Aperçu live</div>
          <PhonePreview/>
          <div style={{padding:"10px 12px",borderRadius:10,background:`${T.green}10`,border:`1px solid ${T.green}25`,width:"100%",fontSize:10,color:T.green,textAlign:"center",lineHeight:1.5}}>
            ✓ Modifications enregistrées après avoir cliqué "Sauvegarder tout"
          </div>
          <div style={{background:T.surf,borderRadius:12,border:`1px solid ${T.border}`,padding:12,width:"100%",fontSize:11}}>
            <div style={{color:T.muted,marginBottom:6,fontSize:10,fontWeight:700}}>HERO APERÇU :</div>
            <div style={{fontWeight:800,fontSize:12,lineHeight:1.5}}>{heroLine1}<br/>
              <span style={{background:"linear-gradient(135deg,#5b6cff,#a855f7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{heroLine2}</span><br/>
              {heroLine3}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ADMIN_EMAIL = "kevin.nedzvedsky@gmail.com";

const AdminPanel=({onExit})=>{
  // Sécurité : vérifie l'email dans le token JWT local
  const token = localStorage.getItem("sc_token");
  const adminOk = (() => {
    if(!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const email = payload.email || payload.user_metadata?.email || "";
      return email === ADMIN_EMAIL;
    } catch { return false; }
  })();

  if(!adminOk) return(
    <div style={{minHeight:"100vh",background:"#030305",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <div style={{fontSize:48}}>🔒</div>
      <div className="syne" style={{fontWeight:800,fontSize:22,color:"#fff"}}>Accès refusé</div>
      <div style={{color:"rgba(255,255,255,.4)",fontSize:14,textAlign:"center",maxWidth:300}}>Connecte-toi avec ton compte Google admin pour accéder à ce panneau.</div>
      <button onClick={onExit} style={{padding:"10px 24px",borderRadius:10,background:"#7c3aed",border:"none",color:"#fff",cursor:"pointer",fontWeight:600,marginTop:8}}>Se connecter</button>
    </div>
  );

  const [users,setUsers]=useState([]);
  const [loadingUsers,setLoadingUsers]=useState(true);
  const [view,setView]=useState("dashboard");
  const [search,setSearch]=useState("");
  const [filterPlan,setFilterPlan]=useState("all");
  const [editUser,setEditUser]=useState(null);
  const [showAdd,setShowAdd]=useState(false);
  const [newUser,setNewUser]=useState({name:"",email:"",plan:"Free",credits:5});
  const [coupon,setCoupon]=useState({code:"",discount:20,uses:0});
  const [confirmDeleteUser,setConfirmDeleteUser]=useState(null);

  // Charge les vrais utilisateurs + stats depuis Supabase
  const [statsLastUpdate, setStatsLastUpdate] = useState(null);
  const [realStats, setRealStats] = useState({mrr:0,arr:0,total:0,paying:0});
  useEffect(()=>{
    const loadAll = async () => {
      try {
        // Charge users
        const res = await fetch("/api/admin?action=users");
        const data = await res.json();
        if(data.users) {
          setUsers(data.users.map(u=>({
            id: u.id,
            name: u.name || u.email?.split("@")[0] || "Inconnu",
            email: u.email,
            plan: u.plan ? (u.plan.charAt(0).toUpperCase() + u.plan.slice(1)) : "Free",
            credits: u.credits ?? 3,
            joined: u.created_at ? new Date(u.created_at).toLocaleDateString("fr-FR") : "—",
            status: u.status || "active",
            videos: 0,
            country: "🌍",
            avatar: (u.name||u.email||"U").slice(0,2).toUpperCase(),
            lastSeen: u.created_at ? new Date(u.created_at).toLocaleDateString("fr-FR") : "—",
          })));
        }
        // Charge stats réelles
        const sres = await fetch("/api/admin?action=stats");
        const sdata = await sres.json();
        if(sdata.mrr !== undefined) {
          setRealStats({
            mrr: sdata.mrr,
            arr: sdata.arr,
            total: sdata.total_users,
            paying: sdata.paying_users,
          });
        }
        setStatsLastUpdate(new Date());
      } catch(e) {
        console.error("Erreur chargement admin:", e);
      } finally {
        setLoadingUsers(false);
      }
    };
    loadAll();
  },[]);

  const [analyticsRange,setAnalyticsRange]=useState(30);

  const planColor={Free:T.muted,Basic:T.cyan,Expert:T.green,Pro:T.acc};
  const statusColor={active:T.green,trial:T.yellow,suspended:T.pink};

  const filtered=users.filter(u=>{
    const q=search.toLowerCase();
    return(u.name.toLowerCase().includes(q)||u.email.toLowerCase().includes(q))&&(filterPlan==="all"||u.plan===filterPlan);
  });

  const totalMRR = realStats.mrr || users.reduce((a,u)=>a+({Free:0,Basic:12,Expert:18,Pro:30}[u.plan]||0),0);

  // Generate sparkline data for charts
  const genData=(base,noise,len)=>Array.from({length:len},(_,i)=>Math.max(0,Math.round(base+Math.sin(i*.4)*noise*.5+Math.random()*noise+(i/len)*base*.3)));

  const visitData30=genData(420,120,30);
  const visitData7=visitData30.slice(-7);
  const visitData90=genData(380,150,90);
  const visitData99=genData(375,155,99);

  const getRangeData=()=>({
    7:visitData7,
    30:visitData30,
    90:visitData90,
    99:visitData99,
  }[analyticsRange]||visitData30);

  const rangeData=getRangeData();
  const totalVisits=rangeData.reduce((a,v)=>a+v,0);
  const avgVisits=Math.round(totalVisits/rangeData.length);
  const maxVisits=Math.max(...rangeData);
  const prevTotal=Math.round(totalVisits*.82);
  const growthPct=Math.round(((totalVisits-prevTotal)/prevTotal)*100);

  const signupData30=genData(12,6,30);
  const convData30=genData(3,2,30);
  const revenueData30=genData(280,80,30);

  const MiniChart=({data,color,height=44,filled=true})=>{
    const max=Math.max(...data,1);
    const w=100/data.length;
    return(
      <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" style={{display:"block"}}>
        {filled&&(
          <defs>
            <linearGradient id={`g${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity=".3"/>
              <stop offset="100%" stopColor={color} stopOpacity="0"/>
            </linearGradient>
          </defs>
        )}
        {filled&&(
          <path d={`M0,${height} ${data.map((v,i)=>`L${i*w+w/2},${height-((v/max)*(height-4))}`).join(" ")} L100,${height} Z`}
            fill={`url(#g${color.replace("#","")})`}/>
        )}
        <path d={`M${data.map((v,i)=>`${i*w+w/2},${height-((v/max)*(height-4))}`).join(" L")}`}
          fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        {data.map((v,i)=>(
          <circle key={i} cx={i*w+w/2} cy={height-((v/max)*(height-4))} r="1.5" fill={color} opacity=".5"/>
        ))}
      </svg>
    );
  };

  const BarChart=({data,color,height=80})=>{
    const max=Math.max(...data,1);
    const w=100/data.length;
    return(
      <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" style={{display:"block"}}>
        {data.map((v,i)=>(
          <rect key={i} x={i*w+w*.15} y={height-((v/max)*(height-2))} width={w*.7} height={(v/max)*(height-2)} rx="1.5" fill={color} opacity={.7+.3*(v/max)}/>
        ))}
      </svg>
    );
  };

  const NAV=[
    {id:"dashboard",icon:"📊",label:"Dashboard"},
    {id:"users",icon:"👥",label:"Utilisateurs"},
    {id:"revenue",icon:"💰",label:"Revenus"},
    {id:"tickets",icon:"🎫",label:"Support & Chats"},
    {id:"api-keys",icon:"🔑",label:"Clés API"},
    {id:"coupons",icon:"🎟️",label:"Coupons"},
    {id:"security",icon:"🔒",label:"Sécurité"},
    {id:"settings",icon:"⚙️",label:"Paramètres"},
  ];

  return(
    <div style={{minHeight:"100vh",display:"flex",background:"#010208",position:"relative"}}>
      <AuroraBg subtle/>
      {/* SIDEBAR — premium dark */}
      <div style={{width:226,background:"rgba(5,6,16,.97)",backdropFilter:"blur(40px)",borderRight:"1px solid rgba(255,255,255,.05)",display:"flex",flexDirection:"column",flexShrink:0,position:"sticky",top:0,height:"100vh",zIndex:10,overflow:"hidden"}} className="hide-mobile">
        {/* Logo area */}
        <div style={{padding:"20px 18px 16px",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:10,background:T.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,boxShadow:`0 0 20px ${T.accGlow}`}}>✦</div>
            <div>
              <div className="syne" style={{fontWeight:800,fontSize:14,letterSpacing:"-.02em"}}>SubCraft</div>
              <div style={{fontSize:9,color:T.green,fontWeight:700,letterSpacing:".06em"}}>ADMIN · v4.6</div>
            </div>
          </div>
        </div>
        {/* Nav groups */}
        <div style={{flex:1,overflowY:"auto",padding:"10px 10px",scrollbarWidth:"none"}}>
          {[
            {group:"Principal",items:NAV.slice(0,4)},
            {group:"Système",items:NAV.slice(4)},
          ].map(g=>(
            <div key={g.group} style={{marginBottom:16}}>
              <div style={{fontSize:9,fontWeight:700,color:T.dim,letterSpacing:".1em",padding:"0 8px 6px",textTransform:"uppercase"}}>{g.group}</div>
              {g.items.map(n=>{
                const active=view===n.id;
                return(
                  <button key={n.id} onClick={()=>setView(n.id)}
                    style={{padding:"8px 10px",borderRadius:9,background:active?`linear-gradient(135deg,${T.acc}18,${T.purple}0a)`:"transparent",border:`1px solid ${active?T.acc+"30":"transparent"}`,color:active?T.text:T.muted,fontSize:12,fontWeight:active?700:400,cursor:"pointer",display:"flex",alignItems:"center",gap:9,marginBottom:2,textAlign:"left",width:"100%",transition:"all .15s",boxShadow:active?`0 2px 12px ${T.acc}18`:"none"}}
                    onMouseEnter={e=>{if(!active){e.currentTarget.style.background=`${T.acc}0a`;e.currentTarget.style.color=T.text;}}}
                    onMouseLeave={e=>{if(!active){e.currentTarget.style.background="transparent";e.currentTarget.style.color=T.muted;}}}>
                    <span style={{fontSize:14,opacity:active?1:.6}}>{n.icon}</span>
                    <span>{n.label}</span>
                    {active&&<div style={{marginLeft:"auto",width:4,height:4,borderRadius:"50%",background:T.acc}}/>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        {/* Bottom actions */}
        <div style={{padding:"12px 10px",borderTop:"1px solid rgba(255,255,255,.05)"}}>
          <button onClick={onExit} style={{width:"100%",padding:"9px 12px",borderRadius:9,background:"rgba(232,57,112,.08)",border:"1px solid rgba(232,57,112,.18)",color:T.pink,fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:7,transition:"all .15s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(232,57,112,.15)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(232,57,112,.08)"}>
            <span>←</span> Quitter l'admin
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{flex:1,overflowY:"auto",minWidth:0}}>
        {/* Top bar */}
        <div style={{padding:"14px 28px",borderBottom:"1px solid rgba(255,255,255,.04)",background:"rgba(5,6,16,.85)",backdropFilter:"blur(20px)",display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:9}}>
          <div style={{flex:1}}>
            <div className="syne" style={{fontWeight:700,fontSize:16,letterSpacing:"-.02em"}}>{NAV.find(n=>n.id===view)?.icon} {NAV.find(n=>n.id===view)?.label||"Dashboard"}</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:8,background:`${T.green}10`,border:`1px solid ${T.green}22`,fontSize:11,color:T.green,fontWeight:600}}>
              <span style={{width:5,height:5,borderRadius:"50%",background:T.green,animation:"pulseDotGreen 2s infinite"}}/>
              Système OK
            </div>
            <div style={{width:30,height:30,borderRadius:8,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,cursor:"pointer"}}>🔔</div>
          </div>
        </div>
        <div style={{padding:28}}>

        {/* ── SECURITY VIEW ── */}
        {view==="security"&&(
          <div className="page">
            <div style={{marginBottom:24}}>
              <div style={{fontSize:11,color:T.muted,fontWeight:600,letterSpacing:".06em",textTransform:"uppercase",marginBottom:4}}>RAPPORT</div>
              <h1 className="syne" style={{fontWeight:800,fontSize:22,letterSpacing:"-.03em"}}>Sécurité & Isolation des données</h1>
            </div>
            <div style={{display:"grid",gap:12}}>
              {[
                {ok:true, title:"Isolation des vidéos par utilisateur",desc:"En production : chaque requête API doit inclure le JWT dans l'Authorization header. Le backend filtre par userId issu du token — jamais par paramètre URL. Ex: SELECT * FROM files WHERE user_id = $jwt.sub"},
                {ok:false,title:"Credentials admin en dur ⚠️",desc:"Identifiants obfusqués côté client (btoa). En production : utiliser bcrypt + vérification serveur + OAuth2. Ne jamais laisser de credentials en clair dans le code."},
                {ok:true, title:"Pas de partage de sessions",desc:"Chaque client React a son propre state isolé en mémoire. Aucun fichier n'est partagé entre sessions côté frontend."},
                {ok:false,title:"Pas de rate limiting ⚠️",desc:"L'API Anthropic et le endpoint d'upload doivent avoir un rate limit par userId (ex: 30 req/min via Redis). À implémenter avec express-rate-limit ou Cloudflare."},
                {ok:false,title:"JWT non implémenté ⚠️",desc:"Pour la prod : utiliser JSON Web Tokens (HS256 minimum, RS256 idéal). Stocker le refresh token en httpOnly cookie, l'access token en mémoire JS uniquement — jamais en localStorage."},
                {ok:true, title:"HTTPS obligatoire",desc:"Netlify/Vercel servent en HTTPS par défaut. S'assurer que HTTP redirige vers HTTPS (HSTS)."},
                {ok:false,title:"Clés API exposées côté client ⚠️",desc:"Les clés Anthropic/Stripe ne doivent jamais être dans le code frontend. Les passer par un backend proxy (ex: /api/generate) qui vérifie le JWT avant d'appeler l'API externe."},
                {ok:true, title:"Validation des uploads",desc:"En prod : valider le type MIME serveur-side, limiter la taille (MAX_FILE_SIZE), scanner les fichiers avec ClamAV ou équivalent avant traitement."},
              ].map((item,i)=>(
                <div key={i} style={{padding:"16px 18px",borderRadius:14,background:`linear-gradient(135deg,${item.ok?T.green:T.orange}08,rgba(255,255,255,.02))`,border:`1px solid ${item.ok?T.green:T.orange}22`,display:"flex",gap:14,alignItems:"flex-start"}}>
                  <div style={{width:28,height:28,borderRadius:8,background:item.ok?`${T.green}20`:`${T.orange}20`,border:`1px solid ${item.ok?T.green:T.orange}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>
                    {item.ok?"✓":"⚠"}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:13,color:item.ok?T.green:T.orange,marginBottom:5}}>{item.title}</div>
                    <div style={{fontSize:11,color:T.muted,lineHeight:1.65,fontFamily:"JetBrains Mono"}}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ANALYTICS */}
        {view==="analytics"&&(
          <div className="page">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,flexWrap:"wrap",gap:12}}>
              <h1 style={{fontWeight:800,fontSize:22}}>📈 Statistiques</h1>
              {/* Range selector */}
              <div style={{display:"flex",gap:4,background:T.surf,borderRadius:10,padding:4,border:`1px solid ${T.border}`}}>
                {[7,30,90,99].map(r=>(
                  <button key={r} onClick={()=>setAnalyticsRange(r)} style={{padding:"6px 14px",borderRadius:7,background:analyticsRange===r?T.acc:"transparent",border:"none",color:analyticsRange===r?"#fff":T.muted,fontWeight:analyticsRange===r?700:400,fontSize:12,cursor:"pointer",transition:"all .15s",fontFamily:"JetBrains Mono"}}>
                    {r}J
                  </button>
                ))}
              </div>
            </div>

            {/* KPI row */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12,marginBottom:20}} className="mobile-grid1">
              {[
                {icon:"👁",label:"Visites totales",value:totalVisits.toLocaleString("fr"),sub:`+${growthPct}% vs période préc.`,color:T.acc,trend:growthPct>=0},
                {icon:"📅",label:"Visites / jour moy.",value:avgVisits.toLocaleString("fr"),sub:"Moyenne sur la période",color:T.cyan,trend:true},
                {icon:"🔥",label:"Pic journalier",value:maxVisits.toLocaleString("fr"),sub:`Jour ${rangeData.indexOf(maxVisits)+1}`,color:T.orange,trend:true},
                {icon:"📝",label:"Inscriptions",value:signupData30.slice(-analyticsRange).reduce((a,v)=>a+v,0),sub:"Nouveaux comptes",color:T.green,trend:true},
                {icon:"💰",label:"Revenus (€)",value:"$"+revenueData30.slice(-Math.min(analyticsRange,30)).reduce((a,v)=>a+v,0).toLocaleString("fr"),sub:"Paiements traités",color:T.yellow,trend:true},
                {icon:"🎯",label:"Taux conversion",value:`${(convData30.slice(-Math.min(analyticsRange,30)).reduce((a,v)=>a+v,0)/Math.max(signupData30.slice(-Math.min(analyticsRange,30)).reduce((a,v)=>a+v,0),1)*100).toFixed(1)}%`,sub:"Trial → Payant",color:T.purple,trend:true},
              ].map((k,i)=>(
                <div key={k.label} style={{padding:"16px 18px",borderRadius:13,background:T.surf,border:`1px solid ${T.border}`,animation:`fadeUp .35s ease ${i*.05}s both`,position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:-10,right:-10,width:50,height:50,borderRadius:"50%",background:`${k.color}10`}}/>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <span style={{fontSize:20}}>{k.icon}</span>
                    <span style={{fontSize:10,color:k.trend?T.green:T.pink,fontWeight:700,background:`${k.trend?T.green:T.pink}10`,padding:"2px 7px",borderRadius:100}}>{k.trend?"↑":"↓"}</span>
                  </div>
                  <div style={{fontFamily:"JetBrains Mono",fontWeight:900,fontSize:22,color:k.color,marginBottom:3}}>{k.value}</div>
                  <div style={{fontSize:11,fontWeight:600,color:T.text,marginBottom:2}}>{k.label}</div>
                  <div style={{fontSize:10,color:T.dim}}>{k.sub}</div>
                </div>
              ))}
            </div>

            {/* Main visits chart */}
            <div style={{background:T.surf,borderRadius:16,border:`1px solid ${T.border}`,padding:"20px 22px",marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
                <div>
                  <div style={{fontWeight:700,fontSize:15,marginBottom:3}}>👁 Visites — {analyticsRange} derniers jours</div>
                  <div style={{fontSize:12,color:T.muted}}>Total : <strong style={{color:T.acc,fontFamily:"JetBrains Mono"}}>{totalVisits.toLocaleString("fr")}</strong> · Moyenne : <strong style={{color:T.text,fontFamily:"JetBrains Mono"}}>{avgVisits}/jour</strong></div>
                </div>
                <div style={{display:"flex",gap:14,fontSize:11,color:T.muted}}>
                  <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:10,height:2,background:T.acc,display:"inline-block",borderRadius:1}}/> Visites</span>
                </div>
              </div>
              <MiniChart data={rangeData} color={T.acc} height={100}/>
              {/* X axis labels */}
              <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
                {[0,Math.floor(rangeData.length/4),Math.floor(rangeData.length/2),Math.floor(3*rangeData.length/4),rangeData.length-1].map(i=>(
                  <span key={i} style={{fontSize:9,color:T.dim,fontFamily:"JetBrains Mono"}}>J-{rangeData.length-1-i}</span>
                ))}
              </div>
            </div>

            {/* Row of 3 small charts */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}} className="mobile-grid1">
              {[
                {title:"📝 Inscriptions / jour",data:signupData30.slice(-Math.min(analyticsRange,30)),color:T.green,type:"bar"},
                {title:"💰 Revenu / jour ($)",data:revenueData30.slice(-Math.min(analyticsRange,30)),color:T.yellow,type:"line"},
                {title:"🎯 Conversions / jour",data:convData30.slice(-Math.min(analyticsRange,30)),color:T.purple,type:"bar"},
              ].map(c=>(
                <div key={c.title} style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:"16px 18px"}}>
                  <div style={{fontWeight:600,fontSize:12,marginBottom:12,color:T.muted}}>{c.title}</div>
                  <div style={{fontFamily:"JetBrains Mono",fontWeight:800,fontSize:20,color:c.color,marginBottom:10}}>{c.data.reduce((a,v)=>a+v,0).toLocaleString("fr")}</div>
                  {c.type==="bar"?<BarChart data={c.data} color={c.color} height={60}/>:<MiniChart data={c.data} color={c.color} height={60}/>}
                </div>
              ))}
            </div>

            {/* Traffic sources et top pages */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}} className="mobile-grid1">
              {/* Sources */}
              <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:"18px 20px"}}>
                <div style={{fontWeight:700,fontSize:14,marginBottom:16}}>🌐 Sources de trafic</div>
                {[
                  {src:"Recherche organique",pct:38,color:T.acc},
                  {src:"Réseaux sociaux",pct:27,color:T.pink},
                  {src:"Direct / Bookmark",pct:18,color:T.cyan},
                  {src:"Parrainage",pct:11,color:T.green},
                  {src:"Email",pct:6,color:T.yellow},
                ].map(s=>(
                  <div key={s.src} style={{marginBottom:11}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:12,color:T.muted}}>{s.src}</span>
                      <span style={{fontSize:11,fontFamily:"JetBrains Mono",fontWeight:700,color:s.color}}>{s.pct}%</span>
                    </div>
                    <div style={{height:5,background:T.border,borderRadius:3,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${s.pct}%`,background:s.color,borderRadius:3,transition:"width .7s"}}/>
                    </div>
                  </div>
                ))}
              </div>
              {/* Top pages */}
              <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:"18px 20px"}}>
                <div style={{fontWeight:700,fontSize:14,marginBottom:16}}>📄 Pages les plus visitées</div>
                {[
                  {page:"Landing page",visits:Math.round(totalVisits*.42),bounce:"38%"},
                  {page:"Pricing",visits:Math.round(totalVisits*.21),bounce:"24%"},
                  {page:"Dashboard",visits:Math.round(totalVisits*.18),bounce:"12%"},
                  {page:"Auth / Login",visits:Math.round(totalVisits*.11),bounce:"55%"},
                  {page:"Support",visits:Math.round(totalVisits*.08),bounce:"61%"},
                ].map((p,i)=>(
                  <div key={p.page} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:i<4?`1px solid ${T.border}`:"none"}}>
                    <span style={{fontSize:10,color:T.dim,fontFamily:"JetBrains Mono",width:14,flexShrink:0}}>{i+1}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.page}</div>
                      <div style={{fontSize:10,color:T.muted}}>Rebond : {p.bounce}</div>
                    </div>
                    <span style={{fontSize:11,fontFamily:"JetBrains Mono",fontWeight:700,color:T.acc,flexShrink:0}}>{p.visits.toLocaleString("fr")}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Geographic et devices */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}} className="mobile-grid1">
              <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:"18px 20px"}}>
                <div style={{fontWeight:700,fontSize:14,marginBottom:16}}>🌍 Pays top visiteurs</div>
                {[
                  {country:"🇫🇷 France",pct:44},
                  {country:"🇧🇪 Belgique",pct:12},
                  {country:"🇨🇦 Canada",pct:10},
                  {country:"🇨🇭 Suisse",pct:8},
                  {country:"🇩🇿 Algérie",pct:6},
                  {country:"🌐 Autres",pct:20},
                ].map(c=>(
                  <div key={c.country} style={{display:"flex",alignItems:"center",gap:10,marginBottom:9}}>
                    <span style={{fontSize:13,width:100,flexShrink:0}}>{c.country}</span>
                    <div style={{flex:1,height:5,background:T.border,borderRadius:3,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${c.pct}%`,background:T.acc,borderRadius:3,opacity:.7+.3*(c.pct/44)}}/>
                    </div>
                    <span style={{fontSize:10,fontFamily:"JetBrains Mono",color:T.muted,width:28,textAlign:"right",flexShrink:0}}>{c.pct}%</span>
                  </div>
                ))}
              </div>
              <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:"18px 20px"}}>
                <div style={{fontWeight:700,fontSize:14,marginBottom:16}}>📱 Appareils</div>
                {[
                  {device:"📱 Mobile",pct:61,color:T.pink},
                  {device:"💻 Desktop",pct:31,color:T.acc},
                  {device:"🖥 Tablette",pct:8,color:T.cyan},
                ].map(d=>(
                  <div key={d.device} style={{marginBottom:16}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <span style={{fontSize:14}}>{d.device}</span>
                      <span style={{fontFamily:"JetBrains Mono",fontWeight:800,fontSize:16,color:d.color}}>{d.pct}%</span>
                    </div>
                    <div style={{height:8,background:T.border,borderRadius:4,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${d.pct}%`,background:d.color,borderRadius:4,boxShadow:`0 0 8px ${d.color}44`}}/>
                    </div>
                  </div>
                ))}
                <div style={{marginTop:20,padding:"12px 14px",borderRadius:10,background:`${T.green}08`,border:`1px solid ${T.green}18`}}>
                  <div style={{fontSize:12,color:T.green,fontWeight:700,marginBottom:3}}>✓ Mobile-first validé</div>
                  <div style={{fontSize:11,color:T.muted}}>61% de tes visiteurs sont sur mobile — ton design est optimisé.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DASHBOARD */}
        {view==="dashboard"&&(
          <div className="page">
            {/* Header */}
            <div style={{marginBottom:28}}>
              <div style={{fontSize:11,color:T.muted,fontWeight:600,letterSpacing:".06em",textTransform:"uppercase",marginBottom:4}}>APERÇU GÉNÉRAL</div>
              <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                <h1 className="syne" style={{fontWeight:800,fontSize:22,letterSpacing:"-.03em"}}>Dashboard SubCraft</h1>
                <div style={{display:"flex",gap:6,alignItems:"center",fontSize:11,color:T.muted}}>
                  <span style={{width:6,height:6,borderRadius:"50%",background:T.green,animation:"pulseDotGreen 2s infinite"}}/>
                  {statsLastUpdate ? `Mis à jour à ${statsLastUpdate.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}` : 'Chargement...'}
                </div>
              </div>
            </div>
            {/* KPI cards */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))",gap:10,marginBottom:24}} className="mobile-grid1">
              {(()=>{
                const total = realStats.total || users.length;
                const paying = realStats.paying || users.filter(u=>u.plan!=="Free").length;
                const proCount = users.filter(u=>u.plan==="Pro").length;
                const suspended = users.filter(u=>u.status==="suspended").length;
                const free = users.filter(u=>u.plan==="Free").length;
                const convRate = total>0?Math.round((paying/total)*100):0;
                return [
                  {icon:"👥",label:"Utilisateurs total",value:total,color:T.acc,trend:`${paying} payants`,sub:`${convRate}% conversion`},
                  {icon:"💰",label:"MRR",value:`€${totalMRR}`,color:T.green,trend:`ARR €${totalMRR*12}`,sub:"revenus mensuels"},
                  {icon:"⭐",label:"Plan Pro",value:proCount,color:T.purple,trend:`${total>0?Math.round(proCount/total*100):0}%`,sub:"des utilisateurs"},
                  {icon:"🆓",label:"Plan Free",value:free,color:T.muted,trend:`${total>0?Math.round(free/total*100):0}%`,sub:"à convertir"},
                  {icon:"🔴",label:"Suspendus",value:suspended,color:T.pink,trend:suspended>0?"⚠️ Vérifier":"✅ OK",sub:"comptes bloqués"},
                  {icon:"📈",label:"Taux payant",value:`${convRate}%`,color:T.cyan,trend:`${paying}/${total}`,sub:"users convertis"},
                ];
              })().map((s,i)=>(
                <div key={s.label} style={{padding:"16px 14px",borderRadius:14,background:`linear-gradient(145deg,${T.surf},${T.surf2})`,border:"1px solid rgba(255,255,255,.06)",position:"relative",overflow:"hidden",transition:"all .22s",cursor:"default",animation:`fadeUp .3s ease ${i*.04}s both`}}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.borderColor=s.color+"40";e.currentTarget.style.boxShadow=`0 10px 30px ${s.color}18`;}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.borderColor="rgba(255,255,255,.06)";e.currentTarget.style.boxShadow="none";}}>
                  <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${s.color}70,transparent)`}}/>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <span style={{fontSize:18}}>{s.icon}</span>
                    <span style={{fontSize:9,padding:"2px 6px",borderRadius:5,background:`${s.color}18`,color:s.color,fontWeight:700}}>{s.trend}</span>
                  </div>
                  <div className="syne" style={{fontWeight:800,fontSize:24,color:s.color,letterSpacing:"-.02em",lineHeight:1}}>{s.value}</div>
                  <div style={{fontSize:11,fontWeight:600,color:T.text,marginTop:5}}>{s.label}</div>
                  <div style={{fontSize:10,color:T.muted,marginTop:2}}>{s.sub}</div>
                </div>
              ))}
            </div>
            {/* Charts et activity */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}} className="mobile-grid1">
              <div style={{background:`linear-gradient(145deg,${T.surf},${T.surf2})`,borderRadius:16,border:"1px solid rgba(255,255,255,.06)",padding:18}}>
                <div style={{fontWeight:700,fontSize:13,marginBottom:4}}>Répartition des plans</div>
                <div style={{fontSize:11,color:T.muted,marginBottom:16}}>Distribution des abonnés</div>
                {["Free","Basic","Expert","Pro"].map(p=>{
                  const c=users.filter(u=>u.plan===p).length;
                  const pct=Math.round(c/users.length*100);
                  const col={Free:T.muted,Basic:T.cyan,Expert:T.green,Pro:T.acc}[p];
                  return(
                    <div key={p} style={{marginBottom:14}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                        <span style={{fontSize:12,fontWeight:600,color:col}}>{p}</span>
                        <span style={{fontSize:10,color:T.muted,fontFamily:"JetBrains Mono"}}>{c} · <span style={{color:col}}>{pct}%</span></span>
                      </div>
                      <div style={{height:4,background:"rgba(255,255,255,.05)",borderRadius:100,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${col},${col}99)`,borderRadius:100,transition:"width .8s"}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{background:`linear-gradient(145deg,${T.surf},${T.surf2})`,borderRadius:16,border:"1px solid rgba(255,255,255,.06)",padding:18}}>
                <div style={{fontWeight:700,fontSize:13,marginBottom:4}}>Activité récente</div>
                <div style={{fontSize:11,color:T.muted,marginBottom:14}}>Dernières connexions</div>
                {users.slice(0,6).map((u,i)=>(
                  <div key={u.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<5?"1px solid rgba(255,255,255,.04)":"none"}}>
                    <Avatar name={u.name} size={28}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{u.name}</div>
                      <div style={{fontSize:10,color:T.dim}}>{u.lastSeen}</div>
                    </div>
                    <Tag color={{Free:T.muted,Basic:T.cyan,Expert:T.green,Pro:T.acc}[u.plan]||T.muted}>{u.plan}</Tag>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* REVENUE */}
        {view==="revenue"&&<AdminRevenue users={users} planColor={planColor}/>}

        {/* TICKETS */}
        {view==="tickets"&&<AdminTickets planColor={planColor}/>}

        {/* USERS */}
        {view==="users"&&(
          <div className="page">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
              <div>
                <div style={{fontSize:11,color:T.muted,fontWeight:600,letterSpacing:".06em",textTransform:"uppercase",marginBottom:4}}>GESTION</div>
                <h1 className="syne" style={{fontWeight:800,fontSize:22,letterSpacing:"-.03em"}}>
                  Utilisateurs <span style={{fontSize:13,color:T.muted,fontWeight:400}}>· {filtered.length}/{users.length}</span>
                </h1>
              </div>
              <div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center"}}>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",fontSize:11,color:T.muted}}>🔍</span>
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Nom, email..." style={{paddingLeft:28,padding:"7px 12px 7px 28px",borderRadius:9,fontSize:12,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",color:T.text,width:180,outline:"none"}}
                    onFocus={e=>e.target.style.borderColor=T.acc} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.08)"}/>
                </div>
                <div style={{display:"flex",gap:2,background:"rgba(255,255,255,.03)",borderRadius:9,padding:"3px",border:"1px solid rgba(255,255,255,.06)"}}>
                  {["all","Free","Basic","Expert","Pro"].map(p=>(
                    <button key={p} onClick={()=>setFilterPlan(p)} style={{padding:"5px 10px",borderRadius:7,background:filterPlan===p?T.acc:"transparent",border:"none",color:filterPlan===p?"#fff":T.muted,fontSize:11,fontWeight:filterPlan===p?700:400,cursor:"pointer",transition:"all .12s"}}>{p==="all"?"Tous":p}</button>
                  ))}
                </div>
                <button onClick={()=>setShowAdd(true)} style={{padding:"7px 14px",borderRadius:9,background:T.grad,border:"none",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5,boxShadow:`0 2px 12px ${T.accGlow}`}}>
                  ➕ Ajouter
                </button>
              </div>
            </div>
            <div style={{background:"linear-gradient(145deg,rgba(12,13,26,.98),rgba(8,9,20,.98))",borderRadius:16,border:"1px solid rgba(255,255,255,.06)",overflow:"hidden",boxShadow:"0 8px 40px rgba(0,0,0,.3)"}}>
              <div style={{display:"grid",gridTemplateColumns:"28px 1fr 180px 90px 80px 80px 90px 120px",padding:"10px 16px",borderBottom:"1px solid rgba(255,255,255,.06)",fontSize:9.5,fontWeight:700,color:T.dim,textTransform:"uppercase",letterSpacing:".08em",gap:8,background:"rgba(255,255,255,.018)"}}>
                <span>#</span><span>Utilisateur</span><span>Email</span><span>Plan</span><span>Vidéos restantes</span><span>Vidéos</span><span>Statut</span><span>Actions</span>
              </div>
              {filtered.map((u,i)=>(
                <div key={u.id} style={{display:"grid",gridTemplateColumns:"28px 1fr 180px 90px 80px 80px 90px 120px",alignItems:"center",padding:"10px 16px",borderBottom:i<filtered.length-1?"1px solid rgba(255,255,255,.04)":"none",transition:"background .12s",gap:8}}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(91,108,255,.04)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <span style={{fontSize:10,color:T.dim,fontFamily:"JetBrains Mono"}}>{i+1}</span>
                  <div style={{display:"flex",alignItems:"center",gap:8,minWidth:0}}>
                    <Avatar name={u.name} size={28}/>
                    <div style={{minWidth:0}}>
                      <div style={{fontWeight:600,fontSize:12,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{u.country} {u.name}</div>
                      <div style={{fontSize:10,color:T.muted}}>{u.joined}</div>
                    </div>
                  </div>
                  <span style={{fontSize:11,color:T.muted,fontFamily:"JetBrains Mono",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.email}</span>
                  <select value={u.plan} onChange={async e=>{
                    const newPlan=e.target.value;
                    setUsers(p=>p.map(x=>x.id===u.id?{...x,plan:newPlan}:x));
                    try {
                      await fetch("/api/admin?action=update",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:u.id,plan:newPlan.toLowerCase()})});
                      notify(`✅ Plan → ${newPlan}`,"success");
                    } catch(e){notify("Erreur API","error");}
                  }} style={{padding:"3px 6px",borderRadius:6,background:`${planColor[u.plan]||T.muted}15`,border:`1px solid ${planColor[u.plan]||T.muted}30`,color:planColor[u.plan]||T.muted,fontSize:11,fontWeight:700,cursor:"pointer"}}>
                    {["Free","Basic","Expert","Pro"].map(p=><option key={p}>{p}</option>)}
                  </select>
                  <input type="number" defaultValue={u.credits>=999999?9999:u.credits} min={0} max={9999}
                    style={{width:52,padding:"2px 5px",borderRadius:6,background:`${T.acc}10`,border:`1px solid ${T.acc}25`,color:u.credits>=999999?T.green:u.credits<5?T.pink:T.text,fontSize:11,fontFamily:"JetBrains Mono",fontWeight:700,textAlign:"center"}}
                    onBlur={async e=>{
                      const val=+e.target.value;
                      setUsers(p=>p.map(x=>x.id===u.id?{...x,credits:val}:x));
                      try {
                        await fetch("/api/admin?action=update",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:u.id,credits:val})});
                        notify(`✅ Vidéos restantes → ${val}`,"success");
                      } catch(e){notify("Erreur API","error");}
                    }}
                  />
                  <span style={{fontSize:11,color:T.muted}}>{u.videos}</span>
                  <select value={u.status} onChange={async e=>{
                    const newStatus=e.target.value;
                    setUsers(p=>p.map(x=>x.id===u.id?{...x,status:newStatus}:x));
                    try {
                      await fetch("/api/admin?action=update",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:u.id,status:newStatus,plan:newStatus==="suspended"?"free":u.plan.toLowerCase()})});
                      notify(`✅ Statut → ${newStatus}`,"success");
                    } catch(e){notify("Erreur API","error");}
                  }} style={{padding:"3px 6px",borderRadius:6,background:`${statusColor[u.status]||T.muted}15`,border:`1px solid ${statusColor[u.status]||T.muted}30`,color:statusColor[u.status]||T.muted,fontSize:11,fontWeight:700,cursor:"pointer"}}>
                    <option value="active">✓ Actif</option>
                    <option value="trial">⏳ Trial</option>
                    <option value="suspended">🔴 Suspendu</option>
                  </select>
                  <div style={{display:"flex",gap:4}}>
                    <button onClick={()=>setEditUser({...u})} style={{padding:"4px 8px",borderRadius:6,background:`${T.acc}15`,border:`1px solid ${T.acc}30`,color:T.acc,fontSize:10,cursor:"pointer",fontWeight:600}} title="Modifier">✏️</button>
                    <button onClick={async()=>{
                      const newStatus = u.status==="suspended"?"active":"suspended";
                      const newPlan = newStatus==="suspended"?"free":u.plan.toLowerCase();
                      try {
                        await fetch("/api/admin?action=update",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:u.id,status:newStatus,plan:newPlan})});
                        setUsers(p=>p.map(x=>x.id===u.id?{...x,status:newStatus,plan:newStatus==="suspended"?"Free":x.plan}:x));
                        notify(newStatus==="suspended"?`🚫 ${u.name} banni`:`✅ ${u.name} réactivé`, newStatus==="suspended"?"warning":"success");
                      } catch(e){notify("Erreur","error");}
                    }} style={{padding:"4px 8px",borderRadius:6,background:u.status==="suspended"?`${T.green}15`:`${T.pink}15`,border:u.status==="suspended"?`1px solid ${T.green}30`:`1px solid ${T.pink}30`,color:u.status==="suspended"?T.green:T.pink,fontSize:10,cursor:"pointer",fontWeight:600}} title={u.status==="suspended"?"Réactiver":"Bannir"}>
                      {u.status==="suspended"?"✅":"🚫"}
                    </button>
                    <button onClick={()=>notify(`Email envoyé à ${u.email}`,"success")} style={{padding:"4px 8px",borderRadius:6,background:`${T.cyan}15`,border:`1px solid ${T.cyan}30`,color:T.cyan,fontSize:10,cursor:"pointer",fontWeight:600}} title="Envoyer email">📧</button>
                    <button onClick={()=>setConfirmDeleteUser(u)} style={{padding:"4px 8px",borderRadius:6,background:`${T.pink}15`,border:`1px solid ${T.pink}30`,color:T.pink,fontSize:10,cursor:"pointer",fontWeight:600}} title="Supprimer">🗑</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COUPONS */}
        {view==="coupons"&&(
          <div className="page">
            <h1 style={{fontWeight:800,fontSize:22,marginBottom:24}}>🎟️ Codes Promo</h1>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}} className="mobile-grid1">
              <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:20}}>
                <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>Créer un coupon</div>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <Input label="Code promo" value={coupon.code} onChange={v=>setCoupon(c=>({...c,code:v.toUpperCase()}))} placeholder="SUMMER30"/>
                  <div>
                    <label style={{fontSize:12,color:T.muted,display:"block",marginBottom:6,fontWeight:600}}>Réduction : {coupon.discount}%</label>
                    <input type="range" min={5} max={100} step={5} value={coupon.discount} onChange={e=>setCoupon(c=>({...c,discount:+e.target.value}))} style={{width:"100%",accentColor:T.acc}}/>
                  </div>
                  <Btn onClick={()=>notify(`Coupon ${coupon.code} créé (-${coupon.discount}%) !`,"success")} icon="➕">Créer le coupon</Btn>
                </div>
              </div>
              <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:20}}>
                <div style={{fontWeight:700,fontSize:15,marginBottom:14}}>Coupons actifs</div>
                {[{code:"BETA50",discount:50,uses:23,exp:"31/03/2026"},{code:"WELCOME20",discount:20,uses:156,exp:"Illimité"},{code:"CREATOR30",discount:30,uses:8,exp:"15/04/2026"}].map(c=>(
                  <div key={c.code} style={{padding:"10px 14px",borderRadius:10,background:T.surf2,border:`1px solid ${T.border}`,marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div>
                      <div style={{fontFamily:"JetBrains Mono",fontWeight:700,fontSize:13,color:T.acc}}>{c.code}</div>
                      <div style={{fontSize:11,color:T.muted}}>-{c.discount}% · {c.uses} utilisations · exp. {c.exp}</div>
                    </div>
                    <button onClick={()=>notify(`Coupon ${c.code} supprimé`,"warning")} style={{background:"transparent",border:"none",color:T.pink,cursor:"pointer",fontSize:14}}>🗑</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view==="landing-editor"&&<AdminLandingEditor/>}
        {view==="customize"&&<AdminCustomize/>}
        {view==="email-templates"&&<AdminEmailTemplates/>}
        {view==="email-logs"&&<AdminEmailLogs/>}
        {view==="analytics-adv"&&<AdminAnalytics/>}
        {view==="flags"&&<AdminFeatureFlags/>}
        {view==="marketing"&&<AdminMarketing/>}
        {view==="system-logs"&&<AdminSystemLogs/>}
        {view==="queue"&&<AdminQueue/>}
        {view==="api-keys"&&<AdminApiKeys/>}
        {view==="storage"&&<AdminStorage/>}
        {view==="search"&&<AdminSearch/>}
        {view==="leaderboard"&&<AdminLeaderboard/>}
        {view==="seo"&&<AdminSEO/>}
        {view==="live-chat"&&<AdminLiveChat/>}
        {view==="reports"&&<AdminReports/>}

        {/* SETTINGS */}
        {view==="settings"&&(
          <div className="page" style={{maxWidth:600}}>
            <h1 style={{fontWeight:800,fontSize:22,marginBottom:24}}>⚙️ Paramètres</h1>
            {[
              {title:"🔔 Notifications email",items:[["Nouvel utilisateur inscrit",true],["Paiement reçu",true],["Utilisateur suspendu",false],["Rapport hebdomadaire",true]]},
              {title:"🛡️ Sécurité",items:[["2FA Admin actif",true],["Logs d'accès",true],["Rate limiting API",true]]},
            ].map(section=>(
              <div key={section.title} style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:20,marginBottom:14}}>
                <div style={{fontWeight:700,fontSize:15,marginBottom:14}}>{section.title}</div>
                {section.items.map(([label,val])=>(
                  <div key={label} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                    <span style={{fontSize:13}}>{label}</span>
                    <Tog value={val} onChange={()=>notify(`Paramètre mis à jour`,"success")}/>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit user modal */}
      {editUser&&(
        <Modal title="✏️ Modifier l'utilisateur" onClose={()=>setEditUser(null)} width={440}>
          <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:20}}>
            <Input label="Nom" value={editUser.name} onChange={v=>setEditUser(p=>({...p,name:v}))}/>
            <Input label="Email" value={editUser.email} onChange={v=>setEditUser(p=>({...p,email:v}))} type="email"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <Select label="Plan" value={editUser.plan} onChange={v=>setEditUser(p=>({...p,plan:v}))} options={["Free","Basic","Expert","Pro"]}/>
              <div>
                <label style={{fontSize:12,color:T.muted,display:"block",marginBottom:6,fontWeight:600}}>Vidéos restantes</label>
                <input type="number" value={editUser.credits===Infinity?9999:editUser.credits} onChange={e=>setEditUser(p=>({...p,credits:+e.target.value>=9999?Infinity:+e.target.value}))} style={{width:"100%",padding:"10px 12px",borderRadius:10,fontSize:14,background:T.surf,border:`1px solid ${T.border}`,color:T.text}}/>
              </div>
            </div>
            <Select label="Statut" value={editUser.status} onChange={v=>setEditUser(p=>({...p,status:v}))} options={[{value:"active",label:"Actif"},{value:"trial",label:"Trial"},{value:"suspended",label:"Suspendu"}]}/>
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <Btn v="secondary" onClick={()=>setEditUser(null)}>Annuler</Btn>
            <Btn onClick={async()=>{
              try {
                const res = await fetch("/api/admin?action=update", {
                  method: "POST",
                  headers: {"Content-Type":"application/json"},
                  body: JSON.stringify({
                    userId: editUser.id,
                    plan: editUser.plan.toLowerCase(),
                    credits: editUser.credits===Infinity?999999:editUser.credits,
                    status: editUser.status,
                    name: editUser.name,
                  })
                });
                const data = await res.json();
                if(data.updated) {
                  setUsers(p=>p.map(u=>u.id===editUser.id?editUser:u));
                  setEditUser(null);
                  notify("Utilisateur mis à jour !","success");
                } else {
                  notify("Erreur: "+(data.error||"inconnue"),"error");
                }
              } catch(e) { notify("Erreur réseau","error"); }
            }}>Sauvegarder</Btn>
          </div>
        </Modal>
      )}

      {/* Add user modal */}
      {showAdd&&(
        <Modal title="➕ Nouvel utilisateur" onClose={()=>setShowAdd(false)} width={420}>
          <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:20}}>
            <Input label="Nom complet" value={newUser.name} onChange={v=>setNewUser(p=>({...p,name:v}))} placeholder="Prénom Nom" required/>
            <Input label="Email" value={newUser.email} onChange={v=>setNewUser(p=>({...p,email:v}))} placeholder="email@example.com" type="email" required/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <Select label="Plan" value={newUser.plan} onChange={v=>setNewUser(p=>({...p,plan:v}))} options={["Free","Basic","Expert","Pro"]}/>
              <div>
                <label style={{fontSize:12,color:T.muted,display:"block",marginBottom:6,fontWeight:600}}>Vidéos restantes</label>
                <input type="number" value={newUser.credits} onChange={e=>setNewUser(p=>({...p,credits:+e.target.value}))} style={{width:"100%",padding:"10px 12px",borderRadius:10,fontSize:14,background:T.surf,border:`1px solid ${T.border}`,color:T.text}}/>
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <Btn v="secondary" onClick={()=>setShowAdd(false)}>Annuler</Btn>
            <Btn onClick={()=>{
              if(!newUser.name||!newUser.email){notify("Remplis tous les champs !","warning");return;}
              setUsers(p=>[...p,{...newUser,id:Date.now(),joined:new Date().toLocaleDateString("fr-FR"),status:"trial",videos:0,country:"🌍",avatar:newUser.name.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase(),lastSeen:"À l'instant"}]);
              setNewUser({name:"",email:"",plan:"Free",credits:5});
              setShowAdd(false);
              notify("Utilisateur créé !","success");
            }} icon="➕">Créer</Btn>
          </div>
        </Modal>
      )}
      <ConfirmModal
        open={!!confirmDeleteUser}
        title={`Supprimer ${confirmDeleteUser?.name} ?`}
        desc="Cet utilisateur et toutes ses vidéos seront définitivement supprimés. Action irréversible."
        onConfirm={async()=>{
          try {
            const res = await fetch("/api/admin?action=delete", {
              method: "POST",
              headers: {"Content-Type":"application/json"},
              body: JSON.stringify({userId: confirmDeleteUser.id})
            });
            const data = await res.json();
            if(data.deleted) {
              setUsers(p=>p.filter(x=>x.id!==confirmDeleteUser.id));
              setConfirmDeleteUser(null);
              notify("Utilisateur supprimé","warning");
            } else {
              notify("Erreur suppression","error");
            }
          } catch(e) { notify("Erreur réseau","error"); }
        }}
        onCancel={()=>setConfirmDeleteUser(null)}
      />
      </div>
      </div>
  );
};

/* ══════════════════════════════════════════════
   PAGE: 404
══════════════════════════════════════════════ */
const NotFound=({onHome})=>{
  const [count,setCount]=useState(8);
  useEffect(()=>{
    if(count<=0){onHome();return;}
    const t=setTimeout(()=>setCount(c=>c-1),1000);
    return()=>clearTimeout(t);
  },[count]);
  return(
  <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",textAlign:"center",padding:24,position:"relative",overflow:"hidden"}}>
    <AuroraBg subtle/>
    <div style={{position:"relative",zIndex:1}}>
      <div style={{fontFamily:"JetBrains Mono",fontSize:"clamp(80px,18vw,140px)",fontWeight:900,lineHeight:1,background:`linear-gradient(135deg,${T.acc},${T.pink})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:8}}>404</div>
      <div style={{fontWeight:800,fontSize:"clamp(18px,4vw,26px)",marginBottom:12}}>Page introuvable</div>
      <div style={{color:T.muted,fontSize:15,marginBottom:8,maxWidth:400}}>Cette page n'existe pas ou a été supprimée.</div>
      <div style={{color:T.dim,fontSize:13,marginBottom:36}}>Redirection automatique dans <strong style={{color:T.acc}}>{count}s</strong>...</div>
      <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:40}}>
        <Btn onClick={onHome} icon="🏠">Accueil</Btn>
        <Btn v="secondary" onClick={()=>window.history.back()}>← Retour</Btn>
      </div>
      <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",maxWidth:400,margin:"0 auto"}}>
        {[["📊","Dashboard","dashboard"],["💳","Tarifs","pricing"],["🎬","Templates","templates"],["❓","Support","support"]].map(([ic,label,page])=>(
          <button key={page} onClick={()=>{window.location.hash=page;onHome();}} style={{padding:"8px 14px",borderRadius:10,background:`${T.acc}10`,border:`1px solid ${T.acc}20`,color:T.acc,fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
            {ic} {label}
          </button>
        ))}
      </div>
    </div>
  </div>
  );
};

/* ══════════════════════════════════════════════
   PAGE: SUPPORT / CONTACT
══════════════════════════════════════════════ */
const FAQ_DATA=[
  {q:"Comment importer ma vidéo ?",a:"Clique sur '+ Nouvelle vidéo' dans ton dashboard, puis glisse-dépose ton fichier MP4, MOV ou AVI. Taille max : 2 Go. Tu peux aussi coller un lien URL.",cat:"⚡ Démarrage"},
  {q:"Quelles langues sont supportées ?",a:"SubCraft supporte 12 langues : Français, Anglais, Espagnol, Allemand, Italien, Portugais, Japonais, Coréen, Chinois, Arabe, Russe et Néerlandais. Détection automatique.",cat:"⚡ Démarrage"},
  {q:"Combien de temps prend la transcription ?",a:"En moyenne moins de 10 secondes pour une vidéo de 60s. Pour des vidéos plus longues (5–10 min), comptez 30 à 90 secondes selon la qualité audio.",cat:"⚡ Démarrage"},
  {q:"Puis-je personnaliser les polices ?",a:"Oui ! L'éditeur te permet de choisir parmi 8 polices, d'ajuster la taille, la couleur, et d'activer des effets comme Shadow, Outline, Highlight, et plus encore.",cat:"🎨 Styles"},
  {q:"Quels formats d'export sont disponibles ?",a:"Tu peux exporter en : MP4 HD avec sous-titres incrustés, fichier .SRT universel, fichier .ASS avec animations, ou texte brut.",cat:"🎨 Styles"},
  {q:"Puis-je annuler à tout moment ?",a:"Oui, sans engagement. Tu peux annuler depuis ton espace Profil → Abonnement. Ton accès reste actif jusqu'à la fin de la période payée.",cat:"💳 Facturation"},
  {q:"Comment fonctionne le système de crédits ?",a:"Chaque vidéo traitée consomme 1 crédit. Les crédits se renouvellent le 1er de chaque mois. Les crédits non utilisés ne s'accumulent pas.",cat:"💳 Facturation"},
  {q:"Mes vidéos sont-elles supprimées après traitement ?",a:"Oui — conformément au RGPD, toutes les vidéos sont automatiquement supprimées de nos serveurs après 24h. Seuls les fichiers de sous-titres sont conservés.",cat:"🔧 Technique"},
  {q:"SubCraft fonctionne-t-il sur mobile ?",a:"L'interface est responsive. Pour une expérience optimale de l'éditeur avancé, nous recommandons un écran ≥ 768px.",cat:"🔧 Technique"},
];

const SupportPage=({onBack})=>{
  const [faqOpen,setFaqOpen]=useState(null);
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [sujet,setSujet]=useState("");
  const [msg,setMsg]=useState("");
  const [sent,setSent]=useState(false);
  return(
    <div style={{minHeight:"100vh",background:T.bg,padding:"0 24px 80px"}} className="page">
      <div style={{maxWidth:720,margin:"0 auto"}}>
        <div style={{padding:"20px 0 28px",display:"flex",alignItems:"center",gap:14}}>
          <Btn v="ghost" onClick={onBack}>← Retour</Btn>
          <h1 style={{fontWeight:800,fontSize:22}}>Support & Centre d'aide</h1>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:32}} className="mobile-grid1">
          {[
            {icon:"💬",title:"Chat en direct",desc:"Répons < 5 min",color:T.acc},
            {icon:"📧",title:"Email",desc:"Réponse sous 24h",color:T.cyan},
            {icon:"📚",title:"Documentation",desc:"Guides détaillés",color:T.green},
            {icon:"🎥",title:"Tutoriels",desc:"Vidéos pas-à-pas",color:T.pink},
          ].map(c=>(
            <div key={c.title} onClick={()=>notify(`${c.title} — bientôt disponible !`,"info")} style={{padding:"16px 14px",borderRadius:14,background:T.surf,border:`1px solid ${T.border}`,textAlign:"center",cursor:"pointer",transition:"all .2s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=c.color;e.currentTarget.style.transform="translateY(-3px)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="none";}}>
              <div style={{fontSize:28,marginBottom:8}}>{c.icon}</div>
              <div style={{fontWeight:700,fontSize:13,marginBottom:4}}>{c.title}</div>
              <div style={{color:T.muted,fontSize:11}}>{c.desc}</div>
            </div>
          ))}
        </div>
        <div style={{marginBottom:32}}>
          <div style={{fontWeight:800,fontSize:18,marginBottom:16}}>❓ Foire aux questions</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {FAQ_DATA.map((faq,i)=>(
              <div key={i} style={{borderRadius:12,background:T.surf,border:`1px solid ${faqOpen===i?T.acc:T.border}`,overflow:"hidden",transition:"border-color .2s"}}>
                <button onClick={()=>setFaqOpen(faqOpen===i?null:i)} style={{width:"100%",padding:"13px 16px",background:"none",border:"none",color:T.text,textAlign:"left",cursor:"pointer",display:"flex",alignItems:"center",gap:10,justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:11,color:T.muted,flexShrink:0}}>{faq.cat}</span>
                    <span style={{fontWeight:600,fontSize:13}}>{faq.q}</span>
                  </div>
                  <span style={{color:faqOpen===i?T.acc:T.muted,fontSize:18,flexShrink:0,lineHeight:1}}>{faqOpen===i?"−":"+"}</span>
                </button>
                {faqOpen===i&&<div style={{padding:"0 16px 14px 16px",fontSize:13,color:T.muted,lineHeight:1.7}}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
        <div style={{background:T.surf,borderRadius:16,border:`1px solid ${T.border}`,padding:28}}>
          <div style={{fontWeight:700,fontSize:17,marginBottom:6}}>✉️ Envoyer un message</div>
          <div style={{color:T.muted,fontSize:13,marginBottom:20}}>Notre équipe te répond sous 24h !</div>
          {sent?(
            <div style={{textAlign:"center",padding:"32px 0"}}>
              <div style={{fontSize:48,marginBottom:12}}>✅</div>
              <div style={{fontWeight:700,fontSize:17,marginBottom:6}}>Message envoyé !</div>
              <div style={{color:T.muted,fontSize:13,marginBottom:20}}>On te répond sous 24h à {email||"ton email"}.</div>
              <Btn v="secondary" onClick={()=>setSent(false)}>Envoyer un autre message</Btn>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}} className="mobile-col">
                <Input label="Ton nom" value={name} onChange={setName} placeholder="Prénom Nom"/>
                <Input label="Email" value={email} onChange={setEmail} placeholder="ton@email.com" type="email"/>
              </div>
              <Select label="Sujet" value={sujet} onChange={setSujet} options={["Problème technique","Question facturation","Demande de fonctionnalité","Bug à signaler","Autre"]}/>
              <div>
                <label style={{fontSize:12,color:T.muted,display:"block",marginBottom:6,fontWeight:600}}>Message *</label>
                <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Décris ton problème en détail..." style={{width:"100%",padding:"11px 14px",borderRadius:10,fontSize:13,background:T.surf3,border:`1px solid ${T.border}`,color:T.text,resize:"vertical",minHeight:110,lineHeight:1.6,fontFamily:"Outfit,sans-serif"}} onFocus={e=>e.target.style.borderColor=T.acc} onBlur={e=>e.target.style.borderColor=T.border}/>
              </div>
              <Btn onClick={()=>{if(!msg.trim()){notify("Écris ton message d'abord !","warning");return;}setSent(true);}} style={{alignSelf:"flex-start"}}>Envoyer le message →</Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   PAGE: CHECKOUT
══════════════════════════════════════════════ */
const CheckoutPage=({plan,yearly,onBack,onSuccess,user})=>{
  const [step,setStep]=useState("details"); // details | processing | done
  const [cardNum,setCardNum]=useState("");
  const [expiry,setExpiry]=useState("");
  const [cvc,setCvc]=useState("");
  const [cardName,setCardName]=useState(user?.name||"");
  const [email,setEmail]=useState(user?.email||"");
  const [coupon,setCoupon]=useState("");
  const [couponApplied,setCouponApplied]=useState(null);
  const [couponData,setCouponData]=useState(null);
  const [paypal,setPaypal]=useState(false);
  const [errors,setErrors]=useState({});
  const [saveCard,setSaveCard]=useState(true);
  const [progress,setProgress]=useState(0);

  const selectedPlan=PLANS.find(p=>p.id===plan)||PLANS[2];
  const basePrice=yearly?selectedPlan.priceY:selectedPlan.price;
  const discount=couponApplied?Math.round(basePrice*(couponApplied/100)):0;
  const finalPrice=basePrice-discount;
  const savings=yearly?(selectedPlan.price-selectedPlan.priceY)*12:0;

  // Validation coupon via API Supabase
  const COUPONS={BETA50:50,WELCOME20:20,CREATOR30:30,SUMMER25:25}; // fallback offline

  const fmtCard=(v)=>{
    const d=v.replace(/\D/g,"").slice(0,16);
    return d.replace(/(.{4})/g,"$1 ").trim();
  };
  const fmtExpiry=(v)=>{
    const d=v.replace(/\D/g,"").slice(0,4);
    return d.length>2?d.slice(0,2)+"/"+d.slice(2):d;
  };

  const validate=()=>{
    const e={};
    if(!paypal){
      if(cardNum.replace(/\s/g,"").length<16) e.cardNum="Numéro invalide (16 chiffres)";
      if(expiry.length<5) e.expiry="Date invalide (MM/AA)";
      if(cvc.length<3) e.cvc="CVC invalide";
      if(!cardName.trim()) e.cardName="Nom requis";
    }
    if(!email||!email.includes("@")) e.email="Email invalide";
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const applyCoupon=()=>{
    const disc=COUPONS[coupon.toUpperCase()];
    if(disc){setCouponApplied(disc);notify(`Coupon appliqué ! -${disc}%`,"success");}
    else{notify("Code invalide","error");}
  };

  const pay=async()=>{
    if(!email||!email.includes("@")){setErrors({email:"Email invalide"});return;}
    setStep("processing");
    try {
      const token = localStorage.getItem("sc_token");
      const res = await fetch("/api/stripe?action=create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? {"Authorization": `Bearer ${token}`} : {})
        },
        body: JSON.stringify({
          planId: selectedPlan.id,
          yearly,
          userId: user?.id || "guest",
          email: email || user?.email,
          successUrl: window.location.origin + "/?payment=success&plan=" + selectedPlan.id,
          cancelUrl: window.location.origin + "/?payment=cancel",
        })
      });
      const data = await res.json();
      if(data.url) {
        window.location.href = data.url; // Redirige vers Stripe Checkout
      } else {
        notify("Erreur: " + (data.error || "Impossible de créer la session"), "error");
        setStep("details");
      }
    } catch(e) {
      notify("Erreur réseau. Réessaie.", "error");
      setStep("details");
    }
  };

  const CardBrand=()=>{
    const n=cardNum.replace(/\s/g,"");
    if(n.startsWith("4")) return <span style={{color:"#1a56db",fontWeight:800,fontSize:12}}>VISA</span>;
    if(n.startsWith("5")) return <span style={{color:"#eb001b",fontWeight:800,fontSize:12}}>MC</span>;
    if(n.startsWith("3")) return <span style={{color:"#2e77bc",fontWeight:800,fontSize:12}}>AMEX</span>;
    return <span style={{fontSize:15}}>💳</span>;
  };

  if(step==="processing") return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",textAlign:"center",padding:24}}>
      <div style={{marginBottom:32,position:"relative"}}>
        <svg width={100} height={100} viewBox="0 0 100 100">
          <circle cx={50} cy={50} r={42} fill="none" stroke={T.border} strokeWidth={4}/>
          <circle cx={50} cy={50} r={42} fill="none" stroke={T.acc} strokeWidth={4}
            strokeDasharray={`${2*Math.PI*42}`}
            strokeDashoffset={`${2*Math.PI*42*(1-progress/100)}`}
            strokeLinecap="round" style={{transform:"rotate(-90deg)",transformOrigin:"50% 50%",transition:"stroke-dashoffset .1s"}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"JetBrains Mono",fontWeight:800,fontSize:20,color:T.acc}}>{progress}%</div>
      </div>
      <div style={{fontWeight:800,fontSize:24,marginBottom:8}}>Traitement en cours...</div>
      <div style={{color:T.muted,fontSize:14,maxWidth:300}}>
        {progress<30?"Vérification de tes informations..."
         :progress<60?"Sécurisation du paiement..."
         :progress<85?"Activation de ton abonnement..."
         :"Finalisation..."}
      </div>
      <div style={{marginTop:24,display:"flex",alignItems:"center",gap:8,color:T.dim,fontSize:12}}>
        <span>🔒</span> Paiement sécurisé par Stripe · TLS 1.3
      </div>
    </div>
  );

  if(step==="done") return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",textAlign:"center",padding:24}} className="page">
      <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
        {Array.from({length:18}).map((_,i)=>(
          <div key={i} style={{position:"absolute",width:8,height:8,borderRadius:"50%",background:[T.acc,T.pink,T.green,T.yellow,T.cyan][i%5],left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,animation:`float ${2+Math.random()*3}s ease infinite`,animationDelay:`${Math.random()*2}s`,opacity:.6}}/>
        ))}
      </div>
      <div style={{position:"relative",zIndex:1}}>
        <div style={{width:90,height:90,borderRadius:"50%",background:`${T.green}18`,border:`3px solid ${T.green}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:42,margin:"0 auto 24px",animation:"popIn .5s cubic-bezier(.34,1.56,.64,1)"}}>✓</div>
        <div style={{fontWeight:900,fontSize:30,marginBottom:10}}>Paiement réussi ! 🎉</div>
        <div style={{color:T.muted,fontSize:15,marginBottom:8}}>Bienvenue dans le plan <span style={{color:T.acc,fontWeight:700}}>{selectedPlan.name}</span></div>
        <div style={{color:T.muted,fontSize:14,marginBottom:32}}>Un email de confirmation a été envoyé à <span style={{color:T.text}}>{email}</span></div>
        <div style={{background:T.surf,borderRadius:16,border:`1px solid ${T.border}`,padding:"20px 28px",maxWidth:340,margin:"0 auto 32px",textAlign:"left"}}>
          <div style={{fontSize:12,color:T.muted,marginBottom:10,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em"}}>Récapitulatif</div>
          {[
            ["Plan",`${selectedPlan.name} ${yearly?"Annuel":"Mensuel"}`],
            ["Montant",yearly?`€${finalPrice*12}/an (TVA incluse)`:`€${finalPrice}/mois (TVA incluse)`],
            ["Vidéos restantes",selectedPlan.credits===Infinity?"Illimité":`${selectedPlan.credits}/mois`],
            ["Prochain renouvellement",yearly?"1er Mars 2027":"1er Avril 2026"],
          ].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:13}}>
              <span style={{color:T.muted}}>{k}</span>
              <span style={{fontWeight:600}}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <Btn onClick={()=>onSuccess(selectedPlan.id)} style={{background:T.grad}} size="lg">Commencer à créer →</Btn>
          <Btn v="secondary" onClick={()=>notify("Facture envoyée par email !","success")}>📄 Télécharger la facture</Btn>
        </div>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:T.bg}} className="page">
      {/* Header */}
      <div style={{padding:"14px 32px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:12,background:T.bg2}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:28,height:28,borderRadius:8,background:T.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>✦</div>
          <span style={{fontWeight:800,fontSize:16}}>SubCraft</span>
        </div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8,color:T.muted,fontSize:12}}>
          <span>🔒</span> Paiement sécurisé SSL · Stripe
        </div>
      </div>

      <div style={{maxWidth:960,margin:"0 auto",padding:"36px 24px",display:"grid",gridTemplateColumns:"1fr 380px",gap:32,alignItems:"start"}} className="mobile-col mobile-grid1">
        {/* Left: Form */}
        <div>
          <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",color:T.muted,fontSize:13,cursor:"pointer",marginBottom:24}}>← Changer de plan</button>
          <h1 style={{fontWeight:800,fontSize:24,marginBottom:6}}>Finaliser ton abonnement</h1>
          <div style={{color:T.muted,fontSize:14,marginBottom:28}}>Tu es à 1 étape de débloquer tout SubCraft.</div>

          {/* Steps indicator */}
          <div style={{display:"flex",gap:8,marginBottom:28}}>
            {["Coordonnées","Paiement","Confirmation"].map((s,i)=>(
              <div key={s} style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:24,height:24,borderRadius:"50%",background:i===0?T.acc:T.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:i===0?"#fff":T.muted}}>{i+1}</div>
                <span style={{fontSize:12,color:i===0?T.text:T.muted,fontWeight:i===0?600:400}}>{s}</span>
                {i<2&&<span style={{color:T.dim}}>›</span>}
              </div>
            ))}
          </div>

          {/* Email */}
          <div style={{marginBottom:20}}>
            <div style={{fontWeight:700,fontSize:14,marginBottom:14}}>📧 Coordonnées</div>
            <Input label="Email de facturation" value={email} onChange={setEmail} placeholder="ton@email.com" type="email" required
              hint={errors.email&&<span style={{color:T.pink}}>{errors.email}</span>}/>
          </div>

          {/* Payment method tabs */}
          <div style={{marginBottom:20}}>
            <div style={{fontWeight:700,fontSize:14,marginBottom:14}}>💳 Mode de paiement</div>
            <div style={{display:"flex",gap:8,marginBottom:18}}>
              {[
                {id:false,icon:"💳",label:"Carte bancaire"},
                {id:true,icon:"🅿️",label:"PayPal"},
              ].map(m=>(
                <button key={m.label} onClick={()=>setPaypal(m.id)} style={{flex:1,padding:"12px 14px",borderRadius:12,background:paypal===m.id?`${T.acc}15`:T.surf,border:`2px solid ${paypal===m.id?T.acc:T.border}`,color:paypal===m.id?T.text:T.muted,fontWeight:600,fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",gap:8,cursor:"pointer",transition:"all .15s"}}>
                  {m.icon} {m.label}
                </button>
              ))}
            </div>

            {!paypal?(
              <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:20,display:"flex",flexDirection:"column",gap:14}}>
                {/* Card number */}
                <div>
                  <label style={{fontSize:12,color:T.muted,display:"block",marginBottom:6,fontWeight:600}}>Numéro de carte <span style={{color:T.pink}}>*</span></label>
                  <div style={{position:"relative"}}>
                    <input value={cardNum} onChange={e=>setCardNum(fmtCard(e.target.value))} placeholder="0000 0000 0000 0000" maxLength={19} style={{width:"100%",padding:"11px 52px 11px 14px",borderRadius:10,fontSize:15,fontFamily:"JetBrains Mono",background:T.bg,border:`1px solid ${errors.cardNum?T.pink:T.border}`,color:T.text,letterSpacing:".08em"}}
                      onFocus={e=>e.target.style.borderColor=T.acc}
                      onBlur={e=>e.target.style.borderColor=errors.cardNum?T.pink:T.border}/>
                    <div style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)"}}><CardBrand/></div>
                  </div>
                  {errors.cardNum&&<div style={{fontSize:11,color:T.pink,marginTop:4}}>{errors.cardNum}</div>}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div>
                    <label style={{fontSize:12,color:T.muted,display:"block",marginBottom:6,fontWeight:600}}>Date d'expiration <span style={{color:T.pink}}>*</span></label>
                    <input value={expiry} onChange={e=>setExpiry(fmtExpiry(e.target.value))} placeholder="MM/AA" maxLength={5} style={{width:"100%",padding:"11px 14px",borderRadius:10,fontSize:14,fontFamily:"JetBrains Mono",background:T.bg,border:`1px solid ${errors.expiry?T.pink:T.border}`,color:T.text}}
                      onFocus={e=>e.target.style.borderColor=T.acc}
                      onBlur={e=>e.target.style.borderColor=errors.expiry?T.pink:T.border}/>
                    {errors.expiry&&<div style={{fontSize:11,color:T.pink,marginTop:4}}>{errors.expiry}</div>}
                  </div>
                  <div>
                    <label style={{fontSize:12,color:T.muted,display:"block",marginBottom:6,fontWeight:600}}>
                      CVC <span style={{color:T.pink}}>*</span>
                      <Tooltip text="3 chiffres au dos de ta carte"><span style={{marginLeft:5,cursor:"help",color:T.dim}}>ⓘ</span></Tooltip>
                    </label>
                    <input value={cvc} onChange={e=>setCvc(e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="•••" maxLength={4} style={{width:"100%",padding:"11px 14px",borderRadius:10,fontSize:14,fontFamily:"JetBrains Mono",background:T.bg,border:`1px solid ${errors.cvc?T.pink:T.border}`,color:T.text}}
                      onFocus={e=>e.target.style.borderColor=T.acc}
                      onBlur={e=>e.target.style.borderColor=errors.cvc?T.pink:T.border}/>
                    {errors.cvc&&<div style={{fontSize:11,color:T.pink,marginTop:4}}>{errors.cvc}</div>}
                  </div>
                </div>
                <div>
                  <label style={{fontSize:12,color:T.muted,display:"block",marginBottom:6,fontWeight:600}}>Nom sur la carte <span style={{color:T.pink}}>*</span></label>
                  <input value={cardName} onChange={e=>setCardName(e.target.value)} placeholder="PRÉNOM NOM" style={{width:"100%",padding:"11px 14px",borderRadius:10,fontSize:14,background:T.bg,border:`1px solid ${errors.cardName?T.pink:T.border}`,color:T.text,textTransform:"uppercase"}}
                    onFocus={e=>e.target.style.borderColor=T.acc}
                    onBlur={e=>e.target.style.borderColor=errors.cardName?T.pink:T.border}/>
                </div>
                <Tog value={saveCard} onChange={setSaveCard} label="Sauvegarder la carte pour les prochains paiements"/>
              </div>
            ):(
              <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:28,textAlign:"center"}}>
                <div style={{fontSize:52,marginBottom:14}}>🅿️</div>
                <div style={{fontWeight:700,fontSize:16,marginBottom:8}}>Paiement via PayPal</div>
                <div style={{color:T.muted,fontSize:13,marginBottom:18}}>Tu seras redirigé vers PayPal pour finaliser ton paiement de façon sécurisée.</div>
                <div style={{padding:"8px 14px",borderRadius:8,background:`${T.yellow}10`,border:`1px solid ${T.yellow}25`,fontSize:11,color:T.yellow}}>⚡ PayPal disponible dans la version production avec l'intégration Braintree</div>
              </div>
            )}
          </div>

          {/* Coupon */}
          <div style={{marginBottom:28}}>
            <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>🎟️ Code promo</div>
            <div style={{display:"flex",gap:8}}>
              <input value={coupon} onChange={e=>setCoupon(e.target.value.toUpperCase())} placeholder="Ex: BETA50" style={{flex:1,padding:"10px 14px",borderRadius:10,fontSize:14,fontFamily:"JetBrains Mono",background:T.surf,border:`1px solid ${couponApplied?T.green:T.border}`,color:T.text,letterSpacing:".05em"}}
                onFocus={e=>e.target.style.borderColor=T.acc}
                onBlur={e=>e.target.style.borderColor=couponApplied?T.green:T.border}/>
              <Btn v={couponApplied?"success":"dark"} onClick={applyCoupon} disabled={!!couponApplied||couponChecking}>
                {couponChecking?"...":couponApplied?`-${couponApplied}% ✓`:"Appliquer"}
              </Btn>
            </div>
            <div style={{fontSize:11,color:T.muted,marginTop:6}}>Codes disponibles en démo : BETA50 · WELCOME20 · CREATOR30 · SUMMER25</div>
          </div>

          {/* Pay button */}
          <Btn full size="lg" onClick={pay} style={{background:T.grad,animation:"glow 3s infinite",fontSize:16,padding:"16px 24px"}}>
            🔒 Payer €{yearly?(finalPrice*12).toFixed(2):finalPrice.toFixed(2)} / {yearly?"an":"mois"} →
          </Btn>
          <div style={{textAlign:"center",marginTop:14,fontSize:11,color:T.dim,display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <span>🔒 SSL 256-bit</span><span>·</span><span>💳 Stripe sécurisé</span><span>·</span><span>↩ Annulation facile</span><span>·</span><span>📋 CGU & Politique de remboursement</span>
          </div>
        </div>

        {/* Right: Order summary */}
        <div style={{background:T.surf,borderRadius:18,border:`1px solid ${T.border}`,padding:24,position:"sticky",top:20}}>
          <div style={{fontWeight:700,fontSize:15,marginBottom:20}}>Récapitulatif de commande</div>
          {/* Plan badge */}
          <div style={{background:`${T.acc}12`,borderRadius:14,border:`1px solid ${T.acc}25`,padding:"16px 18px",marginBottom:18}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:42,height:42,borderRadius:12,background:T.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>⭐</div>
              <div>
                <div style={{fontWeight:800,fontSize:16}}>{selectedPlan.name}</div>
                <div style={{fontSize:12,color:T.muted}}>{yearly?"Facturation annuelle":"Facturation mensuelle"}</div>
              </div>
            </div>
          </div>
          {/* Price breakdown */}
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
              <span style={{color:T.muted}}>Plan {selectedPlan.name}</span>
              <span>€{basePrice}/mois{yearly?" (×12)":""}</span>
            </div>
            {yearly&&savings>0&&(
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
                <span style={{color:T.green}}>🎉 Réduction annuelle (-30%)</span>
                <span style={{color:T.green}}>-€{(selectedPlan.price-selectedPlan.priceY).toFixed(2)}/mois</span>
              </div>
            )}
            {couponApplied&&(
              <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
                <span style={{color:T.green}}>🎟️ Coupon -{couponApplied}%</span>
                <span style={{color:T.green}}>-€{discount.toFixed(2)}</span>
              </div>
            )}
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
              <span style={{color:T.green}}>✓ TVA incluse</span>
              <span style={{color:T.green}}>—</span>
            </div>
          </div>
          <div style={{height:1,background:T.border,marginBottom:14}}/>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}>
            <span style={{fontWeight:700,fontSize:15}}>Total {yearly?"annuel":"mensuel"}</span>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"JetBrains Mono",fontWeight:900,fontSize:22,color:T.acc}}>€{yearly?(finalPrice*12).toFixed(2):finalPrice.toFixed(2)}</div>
              <div style={{fontSize:10,color:T.muted}}>/{yearly?"an":"mois"} TVA incluse</div>
              {yearly&&<div style={{fontSize:11,color:T.green,marginTop:2}}>💰 Tu économises €{(savings*12).toFixed(0)}/an</div>}
            </div>
          </div>
          {/* What you get */}
          <div style={{marginBottom:18}}>
            <div style={{fontSize:11,fontWeight:700,color:T.muted,marginBottom:10,textTransform:"uppercase",letterSpacing:".07em"}}>Ce que tu débloque</div>
            {selectedPlan.features.map(f=>(
              <div key={f} style={{display:"flex",gap:8,fontSize:12,marginBottom:6,alignItems:"flex-start"}}>
                <span style={{color:T.green,flexShrink:0}}>✓</span>{f}
              </div>
            ))}
          </div>
          {/* Guarantee */}
          <div style={{padding:"12px 14px",borderRadius:12,background:`${T.green}08`,border:`1px solid ${T.green}18`,display:"flex",gap:10,alignItems:"flex-start"}}>
            <span style={{fontSize:20,flexShrink:0}}>🛡️</span>
            <div>
              <div style={{fontWeight:700,fontSize:12,color:T.green}}>Satisfait ou remboursé 7 jours</div>
              <div style={{fontSize:11,color:T.muted,marginTop:2}}>Si tu n'es pas satisfait dans les 7 premiers jours, on te rembourse intégralement.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   PAGE: PAYMENT FAILED
══════════════════════════════════════════════ */
const PaymentFailed=({onRetry,onBack})=>(
  <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",textAlign:"center",padding:24}} className="page">
    <div style={{width:90,height:90,borderRadius:"50%",background:`${T.pink}15`,border:`3px solid ${T.pink}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,margin:"0 auto 24px",animation:"shake .4s ease"}}>✕</div>
    <div style={{fontWeight:900,fontSize:28,marginBottom:10}}>Paiement refusé</div>
    <div style={{color:T.muted,fontSize:15,marginBottom:32,maxWidth:360}}>
      Ton paiement n'a pas pu être traité. Vérifie les informations de ta carte et réessaie.
    </div>
    <div style={{background:T.surf,borderRadius:16,border:`1px solid ${T.border}`,padding:20,marginBottom:28,maxWidth:360,textAlign:"left"}}>
      <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>Causes fréquentes :</div>
      {["Fonds insuffisants sur le compte","Numéro de carte incorrect","Date d'expiration dépassée","Paiement bloqué par ta banque (contact-les)"].map(r=>(
        <div key={r} style={{display:"flex",gap:8,fontSize:13,color:T.muted,marginBottom:8,alignItems:"flex-start"}}>
          <span style={{color:T.pink,flexShrink:0}}>·</span>{r}
        </div>
      ))}
    </div>
    <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center"}}>
      <Btn onClick={onRetry} style={{background:T.grad}} size="lg">↺ Réessayer</Btn>
      <Btn v="secondary" onClick={onBack}>Changer de méthode</Btn>
    </div>
    <div style={{marginTop:20,fontSize:12,color:T.dim}}>
      Besoin d'aide ? <span style={{color:T.acc,cursor:"pointer"}}>Contacter le support</span>
    </div>
  </div>
);

/* ══════════════════════════════════════════════
   PAGE: SUBSCRIPTION MANAGEMENT
══════════════════════════════════════════════ */
const SubscriptionPage=({user,setUser,onBack})=>{
  const [tab,setTab]=useState("overview");
  const [cancelFlow,setCancelFlow]=useState(false);
  const [cancelStep,setCancelStep]=useState(0);
  const [cancelReason,setCancelReason]=useState("");
  const [loadingPortal,setLoadingPortal]=useState(false);
  const [loadingUpgrade,setLoadingUpgrade]=useState(null);
  const planColor={Free:T.muted,Basic:T.cyan,Expert:T.green,Pro:T.acc};

  const openPortal = async () => {
    setLoadingPortal(true);
    try {
      const token = localStorage.getItem("sc_token");
      const res = await fetch("/api/stripe?action=portal", {
        method: "POST",
        headers: {"Content-Type":"application/json", ...(token?{"Authorization":`Bearer ${token}`}:{})},
        body: JSON.stringify({
          customerId: user?.stripe_customer_id,
          returnUrl: window.location.origin + "/?page=subscription",
        })
      });
      const data = await res.json();
      if(data.url) {
        window.location.href = data.url;
      } else {
        notify("Erreur portail Stripe: " + (data.error||"inconnue"), "error");
      }
    } catch(e) { notify("Erreur réseau", "error"); }
    setLoadingPortal(false);
  };

  const upgradePlan = async (planId, yearly=false) => {
    if(planId === "free") { notify("Tu es déjà sur le plan gratuit ou inférieur", "info"); return; }
    setLoadingUpgrade(planId);
    try {
      const token = localStorage.getItem("sc_token");
      const res = await fetch("/api/stripe?action=create-checkout", {
        method: "POST",
        headers: {"Content-Type":"application/json", ...(token?{"Authorization":`Bearer ${token}`}:{})},
        body: JSON.stringify({
          planId, yearly,
          userId: user?.id,
          email: user?.email,
          successUrl: window.location.origin + "/?payment=success&plan=" + planId,
          cancelUrl: window.location.origin + "/?page=subscription",
        })
      });
      const data = await res.json();
      if(data.url) { window.location.href = data.url; }
      else { notify("Erreur: " + (data.error||"inconnue"), "error"); }
    } catch(e) { notify("Erreur réseau", "error"); }
    setLoadingUpgrade(null);
  };

  const currentPlan=PLANS.find(p=>p.name===user?.plan)||PLANS[0];
  const usage={videos:{used:23,total:currentPlan.credits===Infinity?Infinity:currentPlan.credits},storage:{used:1.2,total:currentPlan.id==="pro"?6:currentPlan.id==="expert"?4:currentPlan.id==="basic"?3:0.5},exports:{used:14,total:currentPlan.credits===Infinity?Infinity:30}};

  const cancelReasons=["Trop cher","Je n'utilise plus le service","Je passe à un concurrent","Je manque de fonctionnalités","Problème technique","Autre raison"];

  const invoices=[
    {id:"INV-2026-003",date:"01/03/2026",amount:"€21.00",status:"Payée",plan:"Pro Mensuel"},
    {id:"INV-2026-002",date:"01/02/2026",amount:"€21.00",status:"Payée",plan:"Pro Mensuel"},
    {id:"INV-2026-001",date:"01/01/2026",amount:"€13.00",status:"Payée",plan:"Expert Mensuel"},
    {id:"INV-2025-012",date:"01/12/2025",amount:"€13.00",status:"Payée",plan:"Expert Mensuel"},
  ];

  return(
    <div style={{minHeight:"100vh",background:T.bg,padding:"0 24px 80px"}} className="page">
      <div style={{maxWidth:820,margin:"0 auto"}}>
        <div style={{padding:"20px 0 28px",display:"flex",alignItems:"center",gap:14}}>
          <Btn v="ghost" onClick={onBack}>← Retour</Btn>
          <h1 style={{fontWeight:800,fontSize:22}}>💳 Mon Abonnement</h1>
        </div>

        {/* Plan actuel banner */}
        <div style={{background:`linear-gradient(135deg,${T.acc}18,${T.surf})`,borderRadius:18,border:`2px solid ${T.acc}33`,padding:"24px 28px",marginBottom:24,display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
          <div style={{width:56,height:56,borderRadius:16,background:T.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0,animation:"glow 3s infinite"}}>⭐</div>
          <div style={{flex:1}}>
            <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
              <span style={{fontWeight:900,fontSize:22}}>Plan {currentPlan.name}</span>
              <Tag color={T.green} dot>Actif</Tag>
            </div>
            <div style={{color:T.muted,fontSize:13,marginTop:4}}>
              {currentPlan.credits===Infinity?"Vidéos illimitées":`${currentPlan.credits} vidéos/mois`} · Prochain renouvellement le <strong style={{color:T.text}}>1er Avril 2026</strong>
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <Btn v="secondary" size="sm" onClick={()=>setTab("change")}>Changer de plan</Btn>
            {user?.stripe_customer_id
              ? <Btn v="danger" size="sm" onClick={openPortal} loading={loadingPortal}>{loadingPortal?"Chargement...":"Gérer / Annuler"}</Btn>
              : <Btn v="danger" size="sm" onClick={()=>setCancelFlow(true)}>Annuler</Btn>
            }
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",borderBottom:`1px solid ${T.border}`,marginBottom:24,gap:0,overflowX:"auto"}}>
          {[["overview","📊 Vue d'ensemble"],["change","⬆ Changer"],["billing","💳 Facturation"],["invoices","🧾 Factures"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{padding:"11px 18px",background:"transparent",border:"none",borderBottom:`2px solid ${tab===id?T.acc:"transparent"}`,color:tab===id?T.text:T.muted,fontWeight:tab===id?700:400,fontSize:13,cursor:"pointer",whiteSpace:"nowrap",transition:"color .15s"}}>
              {label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab==="overview"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:24}} className="mobile-grid1">
              {[
                {label:"Vidéos utilisées",used:usage.videos.used,total:usage.videos.total,color:T.acc,icon:"🎬"},
                {label:"Stockage utilisé",used:usage.storage.used,total:usage.storage.total,unit:"GB",color:T.cyan,icon:"💾"},
                {label:"Exports réalisés",used:usage.exports.used,total:usage.exports.total,color:T.green,icon:"⬆"},
              ].map(u=>{
                const pct=u.total===Infinity?20:Math.round((u.used/u.total)*100);
                const warn=pct>80;
                return(
                  <div key={u.label} style={{background:T.surf,borderRadius:14,border:`1px solid ${warn?T.orange:T.border}`,padding:"18px 20px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                      <span style={{fontSize:11,color:T.muted,fontWeight:600}}>{u.icon} {u.label}</span>
                      {warn&&<Tag color={T.orange}>Bientôt plein</Tag>}
                    </div>
                    <div style={{fontFamily:"JetBrains Mono",fontWeight:800,fontSize:22,color:warn?T.orange:u.color,marginBottom:6}}>
                      {u.used}{u.unit||""} <span style={{fontSize:14,color:T.muted,fontWeight:400}}>/ {u.total===Infinity?"∞":u.total+""+(u.unit||"")}</span>
                    </div>
                    <div style={{height:5,background:T.border,borderRadius:3,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${pct}%`,background:warn?T.orange:u.color,borderRadius:3,transition:"width .6s"}}/>
                    </div>
                    {u.total!==Infinity&&<div style={{fontSize:10,color:T.muted,marginTop:5}}>{u.total-u.used}{u.unit||""} restant(s)</div>}
                  </div>
                );
              })}
            </div>
            <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:20}}>
              <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>Historique d'utilisation</div>
              {["Janvier","Février","Mars"].map((m,i)=>{
                const vals=[18,25,23];
                const pct=Math.round((vals[i]/(currentPlan.credits===Infinity?30:currentPlan.credits))*100);
                return(
                  <div key={m} style={{display:"grid",gridTemplateColumns:"80px 1fr 60px",gap:14,alignItems:"center",marginBottom:12}}>
                    <span style={{fontSize:12,color:T.muted}}>{m} 2026</span>
                    <div style={{height:8,background:T.border,borderRadius:4,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${Math.min(pct,100)}%`,background:T.acc,borderRadius:4}}/>
                    </div>
                    <span style={{fontSize:11,fontFamily:"JetBrains Mono",color:T.text,textAlign:"right"}}>{vals[i]} vidéos</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CHANGE PLAN */}
        {tab==="change"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12}} className="mobile-grid1">
              {PLANS.map(plan=>{
                const isActive=plan.name===user?.plan;
                const isUpgrade=PLANS.findIndex(p=>p.id===plan.id)>PLANS.findIndex(p=>p.name===user?.plan);
                const isDowngrade=PLANS.findIndex(p=>p.id===plan.id)<PLANS.findIndex(p=>p.name===user?.plan);
                return(
                  <div key={plan.id} style={{borderRadius:16,padding:"22px 18px",background:isActive?`${T.acc}10`:T.surf,border:`2px solid ${isActive?T.acc:T.border}`,position:"relative",transition:"all .2s",cursor:isActive?"default":"pointer"}}
                    onMouseEnter={e=>{if(!isActive){e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.borderColor=T.acc;}}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.borderColor=isActive?T.acc:T.border;}}>
                    {isActive&&<div style={{position:"absolute",top:-11,left:"50%",transform:"translateX(-50%)",padding:"3px 12px",borderRadius:100,background:T.acc,color:"#fff",fontSize:10,fontWeight:700,whiteSpace:"nowrap"}}>Plan actuel</div>}
                    <div style={{fontWeight:800,fontSize:16,marginBottom:2}}>{plan.name}</div>
                    <div style={{fontFamily:"JetBrains Mono",fontWeight:900,fontSize:28,color:isActive?T.acc:T.text,marginBottom:4}}>€{plan.priceY}<span style={{fontSize:12,fontWeight:400,color:T.muted}}>/mois</span></div>
                    <div style={{fontSize:11,color:T.muted,marginBottom:16}}>{plan.credits===Infinity?"Illimité":`${plan.credits} vidéos/mois`}</div>
                    {!isActive&&(
                      plan.id==="free"
                      ? <Btn full size="sm" v="secondary" onClick={openPortal} loading={loadingPortal}>
                          ⬇ Rétrograder (portail)
                        </Btn>
                      : <Btn full size="sm" v={isUpgrade?"primary":"secondary"} onClick={()=>upgradePlan(plan.id,false)} loading={loadingUpgrade===plan.id}>
                          {loadingUpgrade===plan.id?"Chargement...":isUpgrade?"⬆ Passer à ce plan":"⬇ Rétrograder"}
                        </Btn>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{marginTop:18,padding:"12px 16px",borderRadius:10,background:`${T.acc}08`,border:`1px solid ${T.acc}18`,fontSize:12,color:T.muted}}>
              ℹ️ Les changements de plan prennent effet immédiatement. Les vidéos non utilisées ne sont pas remboursées sur ta prochaine facture.
            </div>
          </div>
        )}

        {/* BILLING */}
        {tab==="billing"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:22}}>
              <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>💳 Méthode de paiement</div>
              <div style={{display:"flex",alignItems:"center",gap:16,padding:"14px 18px",borderRadius:12,background:T.bg,border:`1px solid ${T.border}`,marginBottom:14}}>
                <div style={{width:48,height:32,borderRadius:6,background:"linear-gradient(135deg,#1a56db,#0046b8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#fff"}}>VISA</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"JetBrains Mono",fontSize:14,fontWeight:600}}>•••• •••• •••• 4242</div>
                  <div style={{fontSize:11,color:T.muted}}>Expire 12/27 · Sophie Martin</div>
                </div>
                <Tag color={T.green}>Par défaut</Tag>
              </div>
              <div style={{display:"flex",gap:8}}>
                <Btn v="dark" size="sm" onClick={()=>notify("Modification de carte","info")}>Modifier la carte</Btn>
                <Btn v="ghost" size="sm" onClick={()=>notify("Nouvelle carte ajoutée","success")}>➕ Ajouter une carte</Btn>
              </div>
            </div>
            <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:22}}>
              <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>📧 Email de facturation</div>
              <div style={{display:"flex",gap:10}}>
                <input defaultValue={user?.email||"ton@email.com"} style={{flex:1,padding:"10px 14px",borderRadius:10,fontSize:14,background:T.bg,border:`1px solid ${T.border}`,color:T.text}}/>
                <Btn v="dark" size="sm" onClick={()=>notify("Email de facturation mis à jour","success")}>Sauver</Btn>
              </div>
            </div>
            <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:22}}>
              <div style={{fontWeight:700,fontSize:15,marginBottom:6}}>🏢 Informations de facturation</div>
              <div style={{color:T.muted,fontSize:13,marginBottom:14}}>Pour les factures professionnelles (TVA intracommunautaire, adresse, etc.)</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}} className="mobile-grid1">
                {[["Entreprise / Nom","Ex: SubCraft SAS"],["N° TVA (optionnel)","FR12345678901"],["Adresse","12 rue des Créateurs"],["Code postal / Ville","75001 Paris"]].map(([l,p])=>(
                  <Input key={l} label={l} value="" onChange={()=>{}} placeholder={p}/>
                ))}
              </div>
              <Btn v="dark" size="sm" onClick={()=>notify("Informations sauvegardées !","success")} style={{marginTop:14}}>Sauvegarder</Btn>
            </div>
          </div>
        )}

        {/* INVOICES */}
        {tab==="invoices"&&(
          <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,overflow:"hidden"}}>
            <div style={{padding:"11px 20px",borderBottom:`1px solid ${T.border}`,display:"grid",gridTemplateColumns:"140px 1fr 100px 100px 80px",fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".06em",gap:8}}>
              <span>Référence</span><span>Plan</span><span>Date</span><span>Montant</span><span>Statut</span>
            </div>
            {invoices.map((inv,i)=>(
              <div key={inv.id} style={{padding:"13px 20px",borderBottom:i<invoices.length-1?`1px solid ${T.border}`:"none",display:"grid",gridTemplateColumns:"140px 1fr 100px 100px 80px",alignItems:"center",fontSize:13,gap:8,transition:"background .12s",cursor:"pointer"}}
                onMouseEnter={e=>e.currentTarget.style.background=T.surf2}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                onClick={()=>notify(`Facture ${inv.id} téléchargée !`,"success")}>
                <span style={{fontFamily:"JetBrains Mono",fontSize:11,color:T.muted}}>{inv.id}</span>
                <span style={{fontWeight:600}}>{inv.plan}</span>
                <span style={{color:T.muted}}>{inv.date}</span>
                <span style={{fontFamily:"JetBrains Mono",fontWeight:700,color:T.green}}>{inv.amount}</span>
                <Tag color={T.green} size="sm">{inv.status}</Tag>
              </div>
            ))}
            <div style={{padding:"12px 20px",borderTop:`1px solid ${T.border}`,display:"flex",justifyContent:"flex-end"}}>
              <Btn v="ghost" size="sm" onClick={()=>notify("Toutes les factures téléchargées !","success")}>⬇ Tout télécharger</Btn>
            </div>
          </div>
        )}
      </div>

      {/* Cancel flow modal */}
      {cancelFlow&&(
        <Modal title="Annuler mon abonnement" subtitle="On est triste de te voir partir 😢" onClose={()=>{setCancelFlow(false);setCancelStep(0);}} width={480}>
          {cancelStep===0&&(
            <>
              <div style={{padding:"16px",borderRadius:12,background:`${T.yellow}08`,border:`1px solid ${T.yellow}20`,marginBottom:20}}>
                <div style={{fontWeight:700,fontSize:14,color:T.yellow,marginBottom:6}}>⚠️ Ce que tu vas perdre</div>
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  {["Accès aux {n} vidéos restantes ce mois".replace("{n}","7"),"Tous tes projets en cours","Les styles et templates sauvegardés","L'accès prioritaire au support"].map(l=>(
                    <div key={l} style={{display:"flex",gap:8,fontSize:12,color:T.muted}}><span style={{color:T.pink}}>✕</span>{l}</div>
                  ))}
                </div>
              </div>
              <div style={{fontWeight:600,fontSize:14,marginBottom:12}}>Pourquoi souhaites-tu annuler ?</div>
              <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:20}}>
                {cancelReasons.map(r=>(
                  <button key={r} onClick={()=>setCancelReason(r)} style={{padding:"10px 14px",borderRadius:10,background:cancelReason===r?`${T.acc}15`:T.bg,border:`1px solid ${cancelReason===r?T.acc:T.border}`,color:cancelReason===r?T.text:T.muted,textAlign:"left",fontSize:13,cursor:"pointer",transition:"all .12s"}}>
                    {cancelReason===r?"◉":"○"} {r}
                  </button>
                ))}
              </div>
              <div style={{display:"flex",gap:8}}>
                <Btn v="secondary" onClick={()=>setCancelFlow(false)} full>Non, je reste !</Btn>
                <Btn v="danger" onClick={()=>cancelReason&&setCancelStep(1)} disabled={!cancelReason} full>Continuer →</Btn>
              </div>
            </>
          )}
          {cancelStep===1&&(
            <>
              <div style={{textAlign:"center",padding:"20px 0"}}>
                <div style={{fontSize:52,marginBottom:16,animation:"float 3s ease infinite"}}>🎁</div>
                <div style={{fontWeight:800,fontSize:20,marginBottom:10}}>Attend ! On a une offre pour toi</div>
                <div style={{color:T.muted,fontSize:14,marginBottom:24}}>Au lieu d'annuler, bénéficie de <strong style={{color:T.acc}}>50% de réduction</strong> pendant 2 mois.</div>
                <div style={{background:`${T.acc}10`,borderRadius:14,border:`1px solid ${T.acc}25`,padding:"16px 20px",marginBottom:24}}>
                  <div style={{fontFamily:"JetBrains Mono",fontWeight:900,fontSize:32,color:T.acc}}>-50%</div>
                  <div style={{fontSize:13,color:T.muted}}>pendant 2 mois · Puis prix normal</div>
                </div>
                <div style={{display:"flex",gap:10,flexDirection:"column"}}>
                  <Btn full onClick={()=>{setCancelFlow(false);notify("Réduction de 50% appliquée sur 2 mois ! 🎉","success");}}>🎉 Accepter l'offre</Btn>
                  <button onClick={()=>setCancelStep(2)} style={{background:"none",border:"none",color:T.muted,fontSize:12,cursor:"pointer"}}>Non merci, annuler quand même</button>
                </div>
              </div>
            </>
          )}
          {cancelStep===2&&(
            <>
              <div style={{textAlign:"center",padding:"10px 0 20px"}}>
                <div style={{fontSize:52,marginBottom:16}}>😢</div>
                <div style={{fontWeight:800,fontSize:20,marginBottom:10}}>Confirmation d'annulation</div>
                <div style={{color:T.muted,fontSize:14,marginBottom:20}}>Ton accès reste actif jusqu'au <strong style={{color:T.text}}>1er Avril 2026</strong>.</div>
                <div style={{padding:"12px 16px",borderRadius:10,background:`${T.pink}08`,border:`1px solid ${T.pink}20`,fontSize:12,color:T.muted,marginBottom:24}}>
                  Tu peux te réabonner à tout moment depuis ton profil.
                </div>
                <div style={{display:"flex",gap:10}}>
                  <Btn v="secondary" onClick={()=>{setCancelFlow(false);setCancelStep(0);}} full>← Annuler</Btn>
                  <Btn v="danger" onClick={async()=>{
                    if(user?.stripe_customer_id) {
                      setCancelFlow(false); setCancelStep(0);
                      await openPortal();
                    } else {
                      setCancelFlow(false); setCancelStep(0);
                      setUser(u=>({...u,plan:"Free"}));
                      notify("Abonnement annulé. À bientôt 😢","warning");
                    }
                  }} full>Confirmer l'annulation</Btn>
                </div>
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════
   PAGE: CGU / MENTIONS LÉGALES
══════════════════════════════════════════════ */
const LegalPage=({type,onBack,setPage})=>{
  const pages={
    cgu:{
      title:"Conditions Générales d'Utilisation",emoji:"📋",
      sections:[
        {title:"1. Objet",content:"Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme SubCraft, éditée par KEVININDUSTRIE, société par actions simplifiée au capital de 500€, immatriculée au RCS de Paris sous le numéro 932 737 992 (SIRET : 932 737 992 00010), dont le siège social est situé au 60 rue François Ier, 75008 Paris, France. Directeur de la publication : Kevin Nedzvedsky."},
        {title:"2. Acceptation des CGU",content:"L'accès et l'utilisation de la plateforme SubCraft impliquent l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, vous devez cesser immédiatement d'utiliser la plateforme."},
        {title:"3. Description du service",content:"SubCraft est une plateforme SaaS (Software as a Service) de génération automatique de sous-titres pour vidéos courtes. Elle utilise des technologies d'intelligence artificielle (Whisper AI, Claude AI) pour transcrire, traduire et styliser des sous-titres destinés aux plateformes de contenus courts (TikTok, Instagram Reels, YouTube Shorts)."},
        {title:"4. Inscription et compte utilisateur",content:"L'utilisation des fonctionnalités complètes nécessite la création d'un compte. L'utilisateur s'engage à fournir des informations exactes et à maintenir la confidentialité de ses identifiants. Tout usage frauduleux du compte est de la responsabilité exclusive de l'utilisateur."},
        {title:"5. Propriété intellectuelle",content:"Les contenus générés par SubCraft (sous-titres, styles, effets) restent la propriété de l'utilisateur. SubCraft conserve les droits sur sa technologie, ses interfaces et ses algorithmes. L'utilisation de la plateforme ne confère aucun droit sur les éléments constitutifs du service."},
        {title:"6. Données personnelles",content:"SubCraft traite vos données conformément au RGPD. Pour plus d'informations, consultez notre Politique de Confidentialité. Les vidéos uploadées sont supprimées automatiquement 24 heures après l'upload."},
        {title:"7. Responsabilité",content:"SubCraft s'engage à fournir le service avec le plus grand soin mais ne peut garantir une disponibilité à 100%. La responsabilité de SubCraft est limitée au montant des sommes versées par l'utilisateur au cours des 3 derniers mois."},
        {title:"8. Résiliation",content:"L'utilisateur peut résilier son compte à tout moment depuis son espace profil. SubCraft se réserve le droit de suspendre ou supprimer un compte en cas de violation des présentes CGU."},
        {title:"9. Droit applicable",content:"Les présentes CGU sont soumises au droit français. Tout litige sera soumis aux tribunaux compétents de Paris."},
        {title:"10. Contact",content:"Pour toute question relative aux présentes CGU : legal@subcraftai.com · KEVININDUSTRIE · 60 rue François Ier · 75008 Paris · France"},
      ]
    },
    privacy:{
      title:"Politique de Confidentialité",emoji:"🛡️",
      sections:[
        {title:"1. Responsable du traitement",content:"KEVININDUSTRIE, 60 rue François Ier, 75008 Paris. N° TVA : FR86932737992. DPO : privacy@subcraftai.com"},
        {title:"2. Données collectées",content:"Nous collectons : (a) Données d'identification : nom, email, mot de passe chiffré. (b) Données de paiement : traitées exclusivement par Stripe, SubCraft ne stocke aucune donnée bancaire. (c) Données d'usage : vidéos uploadées (supprimées sous 24h), sous-titres générés, préférences de style. (d) Données techniques : adresse IP, navigateur, système d'exploitation pour la sécurité."},
        {title:"3. Finalités du traitement",content:"Vos données sont traitées pour : fourniture du service, gestion de votre compte, facturation, amélioration du service, support client, envoi de communications marketing (avec votre consentement)."},
        {title:"4. Base légale",content:"Nos traitements sont fondés sur : l'exécution du contrat (service), l'intérêt légitime (sécurité, amélioration), le consentement (marketing), l'obligation légale (comptabilité)."},
        {title:"5. Durée de conservation",content:"Vidéos : 24 heures. Sous-titres générés : durée du compte. Données de compte : jusqu'à la suppression du compte + 3 ans. Données de facturation : 10 ans (obligation légale)."},
        {title:"6. Vos droits (RGPD)",content:"Vous disposez des droits d'accès, rectification, effacement (droit à l'oubli), portabilité, limitation et opposition. Pour exercer vos droits : privacy@subcraftai.com. Délai de réponse : 30 jours."},
        {title:"7. Cookies",content:"Nous utilisons des cookies techniques (nécessaires au fonctionnement), analytiques (Plausible Analytics, sans données personnelles) et de préférences. Consultez notre politique cookies pour plus de détails."},
        {title:"8. Transferts hors UE",content:"Certains sous-traitants (OpenAI/Whisper, Anthropic/Claude, Stripe) traitent des données aux États-Unis dans le cadre du Data Privacy Framework EU-US."},
      ]
    },
    cookies:{
      title:"Politique de Cookies",emoji:"🍪",
      sections:[
        {title:"Qu'est-ce qu'un cookie ?",content:"Un cookie est un petit fichier texte déposé sur votre appareil lors de la visite d'un site web. Il permet de mémoriser des informations sur votre session de navigation."},
        {title:"Cookies strictement nécessaires",content:"Ces cookies sont indispensables au fonctionnement du site. Ils permettent notamment : la gestion de votre session connectée, la mémorisation de vos préférences d'interface, la sécurité (protection CSRF). Ces cookies ne peuvent pas être désactivés."},
        {title:"Cookies analytiques",content:"Nous utilisons Plausible Analytics, un outil RGPD-compliant qui ne dépose aucun cookie et ne collecte aucune donnée personnelle identifiable. Il mesure uniquement des statistiques agrégées (pages vues, durée de session)."},
        {title:"Cookies de préférences",content:"Ces cookies mémorisent vos préférences : langue d'interface, thème (sombre/clair), plan de facturation sélectionné (mensuel/annuel). Durée : 1 an."},
        {title:"Cookies tiers",content:"Stripe dépose des cookies pour la sécurité des paiements. Ces cookies sont nécessaires au traitement sécurisé de vos transactions."},
        {title:"Gérer vos préférences",content:"Vous pouvez modifier vos préférences cookies à tout moment via le bouton 'Gérer les cookies' en bas de page, ou depuis les paramètres de votre navigateur. Notez que désactiver certains cookies peut altérer votre expérience."},
      ]
    },
    legal:{
      title:"Mentions Légales",emoji:"⚖️",
      sections:[
        {title:"Éditeur du site",content:"KEVININDUSTRIE · SAS au capital de 500€ · RCS Paris 932 737 992 · SIRET : 932 737 992 00010 · N° TVA : FR86932737992 · Code NAF : 5911B · Siège social : 60 rue François Ier, 75008 Paris · Directeur : Kevin Nedzvedsky"},
        {title:"Direction de la publication",content:"Directeur de la publication : [Nom du fondateur] · Contact : hello@subcraftai.com"},
        {title:"Hébergement",content:"Vercel Inc. · 340 Pine Street Suite 1200, San Francisco, CA 94104, USA · vercel.com · Données stockées en Europe (région EU Frankfurt)"},
        {title:"Propriété intellectuelle",content:"L'ensemble du contenu de ce site (textes, images, logos, code source) est protégé par le droit d'auteur et appartient à KEVININDUSTRIE ou à ses partenaires. Toute reproduction sans autorisation est interdite."},
        {title:"Vidéos restantes",content:"Technologies utilisées : React (Meta), Whisper AI (OpenAI), Claude AI (Anthropic), Stripe (paiements), Cloudflare R2 (stockage)."},
      ]
    },
    rgpd:{
      title:"Vos droits RGPD",emoji:"🔐",
      sections:[
        {title:"Le RGPD, c'est quoi ?",content:"Le Règlement Général sur la Protection des Données (RGPD) est un texte réglementaire européen qui encadre le traitement des données de façon égalitaire sur tout le territoire de l'Union Européenne. Il est entré en application le 25 mai 2018."},
        {title:"Droit d'accès",content:"Vous pouvez demander à tout moment une copie de l'ensemble des données personnelles que nous détenons vous concernant. Délai de réponse : 30 jours. Contact : privacy@subcraftai.com"},
        {title:"Droit de rectification",content:"Vous pouvez corriger ou compléter vos données personnelles directement depuis votre espace profil, ou en nous contactant."},
        {title:"Droit à l'effacement (droit à l'oubli)",content:"Vous pouvez demander la suppression de vos données personnelles, sous réserve des obligations légales de conservation (ex : données de facturation conservées 10 ans)."},
        {title:"Droit à la portabilité",content:"Vous pouvez demander à recevoir vos données dans un format structuré et lisible par machine (JSON, CSV)."},
        {title:"Droit d'opposition",content:"Vous pouvez vous opposer au traitement de vos données à des fins de prospection commerciale à tout moment."},
        {title:"Exercer vos droits",content:"Par email : privacy@subcraftai.com (réponse sous 30 jours) · Par courrier : KEVININDUSTRIE · DPO · 60 rue François Ier · 75008 Paris · Vous pouvez également introduire une réclamation auprès de la CNIL : cnil.fr"},
      ]
    },
  };
  const p=pages[type]||pages.cgu;
  return(
    <div style={{minHeight:"100vh",background:T.bg,padding:"0 24px 80px"}} className="page">
      <div style={{maxWidth:760,margin:"0 auto"}}>
        <div style={{padding:"22px 0 32px",display:"flex",alignItems:"center",gap:12}}>
          <Btn v="ghost" onClick={onBack}>← Retour</Btn>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:26}}>{p.emoji}</span>
              <h1 style={{fontWeight:800,fontSize:22}}>{p.title}</h1>
            </div>
            <div style={{color:T.muted,fontSize:12,marginTop:4}}>Dernière mise à jour : 1er Mars 2026</div>
          </div>
        </div>
        {/* Nav between legal pages */}
        <div style={{display:"flex",gap:6,marginBottom:28,flexWrap:"wrap"}}>
          {[["cgu","📋 CGU"],["privacy","🛡️ Confidentialité"],["cookies","🍪 Cookies"],["legal","⚖️ Mentions légales"],["rgpd","🔐 RGPD"]].map(([id,label])=>(
            <button key={id} onClick={()=>setPage(id)} style={{padding:"6px 14px",borderRadius:8,background:type===id?`${T.acc}18`:"transparent",border:`1px solid ${type===id?T.acc:T.border}`,color:type===id?T.acc:T.muted,fontSize:12,fontWeight:type===id?700:400,cursor:"pointer",transition:"all .15s"}}>{label}</button>
          ))}
        </div>
        <div style={{background:T.surf,borderRadius:16,border:`1px solid ${T.border}`,padding:"28px 32px"}}>
          {p.sections.map((s,i)=>(
            <div key={s.title} style={{marginBottom:i<p.sections.length-1?28:0,paddingBottom:i<p.sections.length-1?28:0,borderBottom:i<p.sections.length-1?`1px solid ${T.border}`:"none"}}>
              <h3 style={{fontWeight:700,fontSize:16,marginBottom:10,color:T.acc}}>{s.title}</h3>
              <p style={{color:T.muted,fontSize:14,lineHeight:1.8}}>{s.content}</p>
            </div>
          ))}
        </div>
        <div style={{marginTop:20,padding:"14px 18px",borderRadius:12,background:`${T.acc}08`,border:`1px solid ${T.acc}18`,fontSize:12,color:T.muted,display:"flex",gap:10,alignItems:"flex-start"}}>
          <span style={{flexShrink:0}}>📧</span>
          Pour toute question : <span style={{color:T.acc,cursor:"pointer"}}>legal@subcraftai.com</span> · Réponse sous 48h ouvrées.
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   COMPONENT: COOKIE BANNER
══════════════════════════════════════════════ */
const CookieBanner=({onAccept,onDecline,setPage})=>{
  const [show,setShow]=useState(true);
  const [expanded,setExpanded]=useState(false);
  const [prefs,setPrefs]=useState({necessary:true,analytics:true,marketing:false});
  if(!show)return null;
  const accept=(all)=>{
    setShow(false);
    if(all)onAccept({...prefs,analytics:true,marketing:true});
    else onAccept(prefs);
    notify("Préférences cookies sauvegardées ✓","success");
  };
  return(
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:1000,padding:"0 16px 16px",pointerEvents:"none"}}>
      <div style={{maxWidth:860,margin:"0 auto",pointerEvents:"auto",background:T.surf2,border:`1px solid ${T.border}`,borderRadius:18,padding:"20px 24px",boxShadow:"0 -8px 48px rgba(0,0,0,.5)",animation:"fadeUp .4s cubic-bezier(.22,1,.36,1)"}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:16,flexWrap:"wrap"}}>
          <div style={{fontSize:28,flexShrink:0}}>🍪</div>
          <div style={{flex:1,minWidth:250}}>
            <div style={{fontWeight:700,fontSize:15,marginBottom:6}}>Nous utilisons des cookies</div>
            <div style={{color:T.muted,fontSize:13,lineHeight:1.6,marginBottom:expanded?14:0}}>
              SubCraft utilise des cookies pour améliorer ton expérience et analyser l'audience.{" "}
              <button onClick={()=>setPage("cookies")} style={{background:"none",border:"none",color:T.acc,cursor:"pointer",fontSize:13,padding:0}}>En savoir plus</button>
            </div>
            {expanded&&(
              <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:12,animation:"fadeDown .2s ease"}}>
                {[
                  {id:"necessary",label:"Cookies nécessaires",desc:"Indispensables au fonctionnement du site",locked:true},
                  {id:"analytics",label:"Cookies analytiques",desc:"Statistiques anonymes (Plausible Analytics)",locked:false},
                  {id:"marketing",label:"Cookies marketing",desc:"Publicités personnalisées (désactivés par défaut)",locked:false},
                ].map(c=>(
                  <div key={c.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:10,background:T.bg,border:`1px solid ${T.border}`}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:600}}>{c.label}</div>
                      <div style={{fontSize:11,color:T.muted}}>{c.desc}</div>
                    </div>
                    {c.locked?<Tag color={T.muted}>Requis</Tag>:<Tog value={prefs[c.id]} onChange={v=>setPrefs(p=>({...p,[c.id]:v}))}/>}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",flexShrink:0}}>
            <button onClick={()=>setExpanded(e=>!e)} style={{padding:"9px 16px",borderRadius:10,background:"transparent",border:`1px solid ${T.border}`,color:T.muted,fontSize:13,cursor:"pointer",fontWeight:500}}>{expanded?"Réduire":"Personnaliser"}</button>
            <button onClick={()=>{setShow(false);onDecline();}} style={{padding:"9px 16px",borderRadius:10,background:"transparent",border:`1px solid ${T.border}`,color:T.muted,fontSize:13,cursor:"pointer",fontWeight:500}}>Refuser</button>
            <Btn onClick={()=>accept(true)} style={{background:T.grad}}>Tout accepter</Btn>
            {expanded&&<Btn v="secondary" onClick={()=>accept(false)} size="sm">Sauver mes choix</Btn>}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   PAGE: CHANGELOG
══════════════════════════════════════════════ */
const ChangelogPage=({onBack})=>{
  const logs=[
    {version:"v4.0",date:"Mars 2026",tag:"Majeure",color:T.acc,items:["Nouveau système de notifications en temps réel","Pages de paiement complètes (Stripe)","Gestion d'abonnement + tunnel d'annulation avec offre de rétention","Page profil avec onglets sécurité / facturation / factures","Templates prédéfinis (TikTok, Podcast, Gaming, etc.)","Undo/Redo dans l'éditeur + raccourcis clavier","Onboarding wizard 5 étapes pour les nouveaux utilisateurs","Comparatif concurrents dans la landing page","Programme de parrainage","Politique RGPD complète + banner cookies"]},
    {version:"v3.0",date:"Février 2026",tag:"Majeure",color:T.purple,items:["Éditeur de sous-titres entièrement repensé","Aperçu en temps réel sur téléphone mockup","30 styles de sous-titres animés","Intégration Claude AI pour emojis automatiques","Traduction automatique en 12 langues","Export SRT/ASS fonctionnel","Admin panel complet (gestion utilisateurs, stats, coupons)"]},
    {version:"v2.1",date:"Janvier 2026",tag:"Mineure",color:T.green,items:["Amélioration des performances de transcription","Correction du bug de synchronisation des timecodes","Ajout du support MP4/MOV/AVI/WEBM","Interface de sélection de style repensée"]},
    {version:"v2.0",date:"Décembre 2025",tag:"Majeure",color:T.cyan,items:["Refonte complète de l'interface","Dashboard My Files avec timer de suppression","Modal d'upload avec drag & drop","Intégration Whisper AI pour la transcription","10 styles professionnels"]},
    {version:"v1.0",date:"Novembre 2025",tag:"Lancement",color:T.yellow,items:["🎉 Lancement de SubCraft Beta","Transcription basique","3 styles de sous-titres","Export SRT simple"]},
  ];
  const tagColor={Majeure:T.acc,Mineure:T.green,Lancement:T.yellow,Correctif:T.orange};
  return(
    <div style={{minHeight:"100vh",background:T.bg,padding:"0 24px 80px"}} className="page">
      <div style={{maxWidth:700,margin:"0 auto"}}>
        <div style={{padding:"22px 0 32px",display:"flex",alignItems:"center",gap:12}}>
          <Btn v="ghost" onClick={onBack}>← Retour</Btn>
          <div>
            <h1 style={{fontWeight:800,fontSize:22}}>📝 Changelog</h1>
            <div style={{color:T.muted,fontSize:13,marginTop:2}}>Toutes les nouveautés de SubCraft</div>
          </div>
        </div>
        <div style={{position:"relative"}}>
          <div style={{position:"absolute",left:19,top:0,bottom:0,width:2,background:`linear-gradient(${T.acc},${T.purple},${T.green},${T.cyan},${T.yellow})`,opacity:.3,borderRadius:2}}/>
          {logs.map((log,i)=>(
            <div key={log.version} style={{paddingLeft:52,marginBottom:36,position:"relative",animation:`fadeUp .4s ease ${i*.08}s both`}}>
              <div style={{position:"absolute",left:10,top:4,width:20,height:20,borderRadius:"50%",background:log.color,border:`3px solid ${T.bg}`,boxShadow:`0 0 12px ${log.color}66`}}/>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,flexWrap:"wrap"}}>
                <span style={{fontFamily:"JetBrains Mono",fontWeight:900,fontSize:18,color:log.color}}>{log.version}</span>
                <Tag color={tagColor[log.tag]||T.muted}>{log.tag}</Tag>
                <span style={{fontSize:12,color:T.muted}}>{log.date}</span>
              </div>
              <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:"16px 20px"}}>
                {log.items.map((item,ii)=>(
                  <div key={ii} style={{display:"flex",gap:9,fontSize:13,color:ii===0&&log.tag==="Lancement"?T.yellow:T.text,marginBottom:ii<log.items.length-1?8:0,lineHeight:1.5}}>
                    <span style={{color:log.color,flexShrink:0,marginTop:1}}>→</span>{item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{padding:"16px 20px",borderRadius:14,background:`${T.acc}08`,border:`1px solid ${T.acc}18`,display:"flex",gap:12,alignItems:"center"}}>
          <span style={{fontSize:20}}>🔔</span>
          <div>
            <div style={{fontWeight:600,fontSize:14,marginBottom:3}}>Recevoir les mises à jour</div>
            <div style={{fontSize:12,color:T.muted}}>Active les notifications dans ton profil pour être averti à chaque nouvelle version.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   PAGE: STATUS
══════════════════════════════════════════════ */
const StatusPage=({onBack})=>{
  const SERVICES=[
    {id:"whisper",name:"Transcription Whisper AI",group:"IA",icon:"🎤",uptime:99.98,pingBase:142,status:"operational",desc:"OpenAI Whisper API"},
    {id:"claude",name:"Claude AI (Traduction & Emojis)",group:"IA",icon:"🤖",uptime:99.91,pingBase:210,status:"operational",desc:"Anthropic Claude API"},
    {id:"auth",name:"Authentification",group:"Core",icon:"🔐",uptime:100,pingBase:45,status:"operational",desc:"Supabase Auth"},
    {id:"db",name:"Base de données",group:"Core",icon:"🗄",uptime:99.99,pingBase:28,status:"operational",desc:"Supabase PostgreSQL"},
    {id:"stripe",name:"Paiements Stripe",group:"Billing",icon:"💳",uptime:99.99,pingBase:92,status:"operational",desc:"Stripe API v2"},
    {id:"email",name:"Emails transactionnels",group:"Core",icon:"📧",uptime:99.95,pingBase:65,status:"operational",desc:"Brevo SMTP"},
    {id:"cdn",name:"CDN & Hébergement",group:"Infrastructure",icon:"🌍",uptime:99.99,pingBase:18,status:"operational",desc:"Vercel Edge Network"},
    {id:"storage",name:"Stockage vidéos",group:"Infrastructure",icon:"📦",uptime:99.97,pingBase:55,status:"operational",desc:"Cloudflare R2"},
    {id:"export",name:"Export MP4",group:"Core",icon:"🎬",uptime:98.2,pingBase:480,status:"degraded",desc:"FFmpeg WebAssembly"},
  ];

  const INCIDENTS=[
    {date:"5 Mars 2026",title:"Latence élevée — Export MP4",severity:"warning",resolved:false,
     updates:[
       {time:"15:42","msg":"Problème identifié — FFmpeg WASM dépasse la limite mémoire sur certains navigateurs."},
       {time:"15:10","msg":"Investigations en cours sur l'export vidéo."},
     ]},
    {date:"28 Fév 2026",title:"Indisponibilité partielle — API Claude",severity:"incident",resolved:true,
     updates:[
       {time:"14:55","msg":"Résolu. Basculement automatique vers la région backup réussi."},
       {time:"14:32","msg":"Incident détecté — erreurs 503 sur l'API Anthropic."},
     ]},
    {date:"15 Fév 2026",title:"Maintenance planifiée — Migration EU",severity:"maintenance",resolved:true,
     updates:[
       {time:"03:45","msg":"Terminé avec succès. Latences réduites de 35%."},
       {time:"02:00","msg":"Début de la migration vers EU Frankfurt."},
     ]},
  ];

  const [pings,setPings]=useState(()=>Object.fromEntries(SERVICES.map(s=>[s.id,s.pingBase])));
  const [lastUpdate,setLastUpdate]=useState(new Date());
  const [checking,setChecking]=useState(false);
  const [expandedInc,setExpandedInc]=useState(null);
  const [activeGroup,setActiveGroup]=useState("Tous");

  // Simule des pings live
  useEffect(()=>{
    const iv=setInterval(()=>{
      setPings(p=>Object.fromEntries(Object.entries(p).map(([k,v])=>[k,Math.max(10,Math.round(v+(Math.random()-.5)*20))])));
      setLastUpdate(new Date());
    },5000);
    return()=>clearInterval(iv);
  },[]);

  const checkNow=()=>{
    setChecking(true);
    setTimeout(()=>{
      setPings(()=>Object.fromEntries(SERVICES.map(s=>[s.id,Math.max(10,s.pingBase+Math.round((Math.random()-.4)*30))])));
      setLastUpdate(new Date());
      setChecking(false);
    },1800);
  };

  const statusCfg={
    operational:{label:"Opérationnel",color:"#22c55e",bg:"rgba(34,197,94,.1)"},
    degraded:{label:"Dégradé",color:"#f59e0b",bg:"rgba(245,158,11,.1)"},
    down:{label:"Indisponible",color:"#f43f5e",bg:"rgba(244,63,94,.1)"},
  };
  const sevCfg={
    warning:{color:"#f59e0b",bg:"rgba(245,158,11,.08)",label:"Avertissement",icon:"⚠"},
    incident:{color:"#f43f5e",bg:"rgba(244,63,94,.08)",label:"Incident",icon:"✕"},
    maintenance:{color:"#7c3aed",bg:"rgba(124,58,237,.08)",label:"Maintenance",icon:"⚙"},
  };

  const groups=["Tous",...[...new Set(SERVICES.map(s=>s.group))]];
  const filtered=activeGroup==="Tous"?SERVICES:SERVICES.filter(s=>s.group===activeGroup);
  const allOk=SERVICES.every(s=>s.status==="operational");
  const globalUptime=(SERVICES.reduce((a,s)=>a+s.uptime,0)/SERVICES.length).toFixed(2);
  const avgPing=Math.round(Object.values(pings).reduce((a,v)=>a+v,0)/Object.values(pings).length);

  // Génère les barres d'uptime 90j stables (seed par service)
  const getUptimeBars=(svc)=>Array.from({length:60},(_,i)=>{
    const seed=(svc.id.charCodeAt(0)*31+i*17)%100;
    if(svc.uptime>99.9) return seed<3?75+seed*5:100;
    if(svc.uptime>99) return seed<8?60+seed*3:100;
    return seed<15?50+seed*2:100;
  });

  return(
    <div style={{minHeight:"100vh",background:"#030305",position:"relative"}} className="page">
      <AuroraBg subtle/>
      <div style={{maxWidth:860,margin:"0 auto",padding:"0 20px 100px",position:"relative",zIndex:1}}>

        {/* HEADER */}
        <div style={{padding:"28px 0 32px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <button onClick={onBack} style={{width:34,height:34,borderRadius:9,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.08)",color:T.muted,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.1)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.06)"}>←</button>
            <div>
              <div style={{fontSize:10,color:"#7c3aed",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",marginBottom:3}}>Infrastructure</div>
              <h1 className="syne" style={{fontWeight:800,fontSize:24,letterSpacing:"-.03em",color:"#fff",lineHeight:1}}>Statut des services</h1>
            </div>
          </div>
          <button onClick={checkNow} disabled={checking} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 18px",borderRadius:10,background:checking?"rgba(124,58,237,.2)":"rgba(124,58,237,.15)",border:"1px solid rgba(124,58,237,.3)",color:"#a78bfa",fontSize:13,fontWeight:600,cursor:checking?"not-allowed":"pointer",transition:"all .2s"}}>
            <span style={{display:"inline-block",animation:checking?"spin 1s linear infinite":"none",fontSize:14}}>↻</span>
            {checking?"Vérification...":"Actualiser"}
          </button>
        </div>

        {/* GLOBAL STATUS BANNER */}
        <div style={{padding:"22px 28px",borderRadius:20,background:allOk?"rgba(34,197,94,.06)":"rgba(245,158,11,.06)",border:`1px solid ${allOk?"rgba(34,197,94,.2)":"rgba(245,158,11,.2)"}`,marginBottom:28,display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:14,flex:1,minWidth:200}}>
            <div style={{width:48,height:48,borderRadius:14,background:allOk?"rgba(34,197,94,.15)":"rgba(245,158,11,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
              {allOk?"✓":"⚠"}
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:17,color:allOk?"#22c55e":"#f59e0b",marginBottom:3}}>
                {allOk?"Tous les systèmes opérationnels":"Dégradation partielle détectée"}
              </div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.35)"}}>
                Dernière vérification : {lastUpdate.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:24,flexShrink:0}}>
            {[
              {label:"Uptime 90j",val:globalUptime+"%",color:"#22c55e"},
              {label:"Latence moy.",val:avgPing+"ms",color:"#7c3aed"},
              {label:"Services",val:`${SERVICES.filter(s=>s.status==="operational").length}/${SERVICES.length}`,color:"#22d3ee"},
            ].map(({label,val,color})=>(
              <div key={label} style={{textAlign:"center"}}>
                <div className="syne" style={{fontWeight:800,fontSize:20,color,lineHeight:1}}>{val}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,.3)",marginTop:3,letterSpacing:".04em"}}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* GROUP FILTER */}
        <div style={{display:"flex",gap:4,marginBottom:16,flexWrap:"wrap"}}>
          {groups.map(g=>(
            <button key={g} onClick={()=>setActiveGroup(g)} style={{padding:"5px 14px",borderRadius:100,background:activeGroup===g?"rgba(124,58,237,.2)":"rgba(255,255,255,.04)",border:activeGroup===g?"1px solid rgba(124,58,237,.4)":"1px solid rgba(255,255,255,.06)",color:activeGroup===g?"#a78bfa":"rgba(255,255,255,.4)",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .15s"}}>
              {g}
            </button>
          ))}
        </div>

        {/* SERVICES TABLE */}
        <div style={{borderRadius:20,border:"1px solid rgba(255,255,255,.07)",overflow:"hidden",marginBottom:28,background:"rgba(255,255,255,.02)"}}>
          {/* Header */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 80px 90px 130px",gap:0,padding:"10px 20px",borderBottom:"1px solid rgba(255,255,255,.06)",background:"rgba(255,255,255,.03)"}}>
            {["Service","Ping","Uptime","Statut"].map(h=>(
              <div key={h} style={{fontSize:10,color:"rgba(255,255,255,.3)",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase"}}>{h}</div>
            ))}
          </div>
          {filtered.map((svc,i)=>{
            const cfg=statusCfg[svc.status];
            const ping=pings[svc.id];
            const pingColor=ping<100?"#22c55e":ping<300?"#f59e0b":"#f43f5e";
            return(
              <div key={svc.id} style={{display:"grid",gridTemplateColumns:"1fr 80px 90px 130px",gap:0,padding:"14px 20px",borderBottom:i<filtered.length-1?"1px solid rgba(255,255,255,.05)":"none",transition:"background .12s",alignItems:"center"}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.03)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:18}}>{svc.icon}</span>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:"#fff"}}>{svc.name}</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,.25)",marginTop:1}}>{svc.desc}</div>
                  </div>
                </div>
                <div style={{fontFamily:"JetBrains Mono",fontSize:12,color:pingColor,fontWeight:600}}>{ping}ms</div>
                <div style={{fontFamily:"JetBrains Mono",fontSize:12,color:"rgba(255,255,255,.5)"}}>{svc.uptime}%</div>
                <div style={{display:"flex",alignItems:"center",gap:6,padding:"4px 10px",borderRadius:100,background:cfg.bg,border:`1px solid ${cfg.color}30`,width:"fit-content"}}>
                  <span style={{width:6,height:6,borderRadius:"50%",background:cfg.color,flexShrink:0,animation:svc.status==="operational"?"pulseDot 2.5s ease infinite":"none"}}/>
                  <span style={{fontSize:11,color:cfg.color,fontWeight:700,whiteSpace:"nowrap"}}>{cfg.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* UPTIME SPARKLINES */}
        <div style={{borderRadius:20,border:"1px solid rgba(255,255,255,.07)",overflow:"hidden",marginBottom:28,background:"rgba(255,255,255,.02)"}}>
          <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,.06)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontWeight:700,fontSize:14,color:"#fff"}}>Historique d'uptime</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.3)",marginTop:2}}>90 derniers jours · chaque barre = 1 jour et demi</div>
            </div>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              {[["#22c55e","100%"],["#f59e0b","<99%"],["#f43f5e","Incident"]].map(([c,l])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{width:8,height:8,borderRadius:2,background:c,flexShrink:0}}/>
                  <span style={{fontSize:10,color:"rgba(255,255,255,.3)"}}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          {SERVICES.map((svc,si)=>{
            const bars=getUptimeBars(svc);
            return(
              <div key={svc.id} style={{padding:"10px 20px",borderBottom:si<SERVICES.length-1?"1px solid rgba(255,255,255,.04)":"none",display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:180,flexShrink:0,display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:14}}>{svc.icon}</span>
                  <span style={{fontSize:12,color:"rgba(255,255,255,.5)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{svc.name.split("(")[0].trim()}</span>
                </div>
                <div style={{flex:1,display:"flex",gap:2,alignItems:"flex-end",height:24}}>
                  {bars.map((h,i)=>{
                    const color=h===100?"#22c55e":h>70?"#f59e0b":"#f43f5e";
                    return <div key={i} style={{flex:1,height:`${h}%`,background:color,borderRadius:2,minWidth:2,opacity:.8}} title={`Jour ${i+1} : ${h}%`}/>;
                  })}
                </div>
                <div style={{fontFamily:"JetBrains Mono",fontSize:11,color:"#22c55e",fontWeight:700,width:52,textAlign:"right",flexShrink:0}}>{svc.uptime}%</div>
              </div>
            );
          })}
        </div>

        {/* INCIDENTS */}
        <div style={{borderRadius:20,border:"1px solid rgba(255,255,255,.07)",overflow:"hidden",background:"rgba(255,255,255,.02)"}}>
          <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
            <div style={{fontWeight:700,fontSize:14,color:"#fff"}}>Historique des incidents</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.3)",marginTop:2}}>30 derniers jours</div>
          </div>
          {INCIDENTS.map((inc,i)=>{
            const sc=sevCfg[inc.severity];
            const isOpen=expandedInc===i;
            return(
              <div key={i} style={{borderBottom:i<INCIDENTS.length-1?"1px solid rgba(255,255,255,.05)":"none"}}>
                <div style={{padding:"16px 20px",cursor:"pointer",transition:"background .12s"}}
                  onClick={()=>setExpandedInc(isOpen?null:i)}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.03)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                    <div style={{width:32,height:32,borderRadius:9,background:sc.bg,border:`1px solid ${sc.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:sc.color,flexShrink:0}}>{sc.icon}</div>
                    <div style={{flex:1,minWidth:160}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:3}}>
                        <span style={{fontWeight:700,fontSize:13,color:"#fff"}}>{inc.title}</span>
                        <span style={{fontSize:10,padding:"2px 8px",borderRadius:100,background:sc.bg,color:sc.color,fontWeight:700,border:`1px solid ${sc.color}30`}}>{sc.label}</span>
                        {inc.resolved
                          ?<span style={{fontSize:10,padding:"2px 8px",borderRadius:100,background:"rgba(34,197,94,.1)",color:"#22c55e",fontWeight:700,border:"1px solid rgba(34,197,94,.25)"}}>✓ Résolu</span>
                          :<span style={{fontSize:10,padding:"2px 8px",borderRadius:100,background:"rgba(245,158,11,.1)",color:"#f59e0b",fontWeight:700,border:"1px solid rgba(245,158,11,.25)",animation:"pulseDot 2s infinite"}}>En cours</span>
                        }
                      </div>
                      <div style={{fontSize:11,color:"rgba(255,255,255,.3)"}}>{inc.date}</div>
                    </div>
                    <span style={{fontSize:14,color:"rgba(255,255,255,.3)",transition:"transform .2s",transform:isOpen?"rotate(180deg)":"none"}}>▾</span>
                  </div>
                </div>
                {isOpen&&(
                  <div style={{padding:"0 20px 16px 64px",animation:"fadeDown .18s ease"}}>
                    {inc.updates.map((u,j)=>(
                      <div key={j} style={{display:"flex",gap:12,padding:"8px 0",borderTop:j>0?"1px solid rgba(255,255,255,.04)":"none",alignItems:"flex-start"}}>
                        <span style={{fontFamily:"JetBrains Mono",fontSize:10,color:"rgba(255,255,255,.3)",flexShrink:0,paddingTop:2}}>{u.time}</span>
                        <span style={{fontSize:12,color:"rgba(255,255,255,.5)",lineHeight:1.6}}>{u.msg}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div style={{textAlign:"center",marginTop:32,fontSize:11,color:"rgba(255,255,255,.2)"}}>
          SubCraft Status · Mis à jour automatiquement toutes les 5 secondes · <span style={{color:"#7c3aed",cursor:"pointer"}} onClick={()=>window.open("mailto:support@subcraftai.com")}>support@subcraftai.com</span>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   PAGE: REFERRAL / PARRAINAGE
══════════════════════════════════════════════ */
const ReferralPage=({user,onBack})=>{
  const [copied,setCopied]=useState(false);
  const [tab,setTab]=useState("share");
  const refCode=user?.id ? user.id.slice(0,8) : (user?.email?.split("@")[0]?.slice(0,8)||"CREATOR");
  const refLink=`${window.location.origin}/?ref=${user?.id||refCode}`;
  const [invited,setInvited]=useState("");
  const referrals=[
    {name:"Lucas D.",email:"l***@gmail.com",date:"28/02/2026",status:"Inscrit",reward:"1 mois gratuit",paid:true},
    {name:"Emma W.",email:"e***@icloud.com",date:"15/02/2026",status:"Abonné Pro",reward:"1 mois gratuit",paid:true},
    {name:"Carlos G.",email:"c***@gmail.com",date:"05/03/2026",status:"Trial",reward:"En attente",paid:false},
  ];
  const totalEarned=referrals.filter(r=>r.paid).length;

  const copyLink=()=>{
    navigator.clipboard?.writeText(refLink);
    setCopied(true);
    setTimeout(()=>setCopied(false),2500);
    notify("Lien copié ! Partage-le 🚀","success");
  };

  return(
    <div style={{minHeight:"100vh",background:T.bg,padding:"0 24px 80px"}} className="page">
      <div style={{maxWidth:760,margin:"0 auto"}}>
        <div style={{padding:"22px 0 28px",display:"flex",alignItems:"center",gap:12}}>
          <Btn v="ghost" onClick={onBack}>← Retour</Btn>
          <h1 style={{fontWeight:800,fontSize:22}}>🎁 Programme de parrainage</h1>
        </div>
        {/* KPI cards */}
        <div style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap"}}>
          {[
            {icon:"💰",val:"1 mois gratuit",label:"par ami abonné",color:T.green},
            {icon:"🎁",val:"-20%",label:"réduction pour ton ami",color:T.yellow},
            {icon:"♾️",val:"Illimité",label:"parrainages possibles",color:T.acc},
            {icon:"⚡",val:"Instantané",label:"quota mis à jour auto",color:T.purple},
          ].map(s=>(
            <div key={s.label} style={{flex:"1 1 130px",padding:"12px 14px",borderRadius:12,background:T.surf,border:`1px solid ${s.color}25`,display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:32,height:32,borderRadius:8,background:`${s.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{s.icon}</div>
              <div><div style={{fontWeight:900,fontSize:15,color:s.color}}>{s.val}</div><div style={{fontSize:10,color:T.muted}}>{s.label}</div></div>
            </div>
          ))}
        </div>
        {/* Hero banner */}
        <div style={{borderRadius:20,background:`linear-gradient(135deg,${T.acc}20,${T.purple}10)`,border:`1px solid ${T.acc}30`,padding:"28px 32px",marginBottom:24,textAlign:"center",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-20,right:-20,width:120,height:120,borderRadius:"50%",background:`${T.acc}10`,pointerEvents:"none"}}/>
          <div style={{fontSize:52,marginBottom:14,animation:"float 3s ease infinite"}}>🎁</div>
          <h2 style={{fontWeight:900,fontSize:26,marginBottom:10}}>Invite tes amis, gagne des mois gratuits</h2>
          <div style={{color:T.muted,fontSize:15,marginBottom:24,maxWidth:420,margin:"0 auto 24px"}}>Pour chaque ami qui s'abonne à un plan payant, <strong style={{color:T.acc}}>tu gagnes 1 mois gratuit</strong> et lui aussi !</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,maxWidth:480,margin:"0 auto",textAlign:"center"}}>
            {[["🔗","Tu partages","ton lien unique"],["✅","Ton ami","s'abonne"],["🎉","Vous gagnez","chacun 1 mois"]].map(([ic,t,d])=>(
              <div key={t} style={{padding:"14px 10px",borderRadius:12,background:"rgba(255,255,255,.04)",border:`1px solid ${T.border}`}}>
                <div style={{fontSize:24,marginBottom:6}}>{ic}</div>
                <div style={{fontWeight:700,fontSize:12}}>{t}</div>
                <div style={{fontSize:11,color:T.muted}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:24}} className="mobile-grid1">
          {[
            {icon:"👥",label:"Amis invités",value:referrals.length,color:T.acc},
            {icon:"🎉",label:"Mois gagnés",value:totalEarned,color:T.green},
            {icon:"⏳",label:"En attente",value:referrals.filter(r=>!r.paid).length,color:T.yellow},
          ].map(s=>(
            <div key={s.label} style={{padding:"18px 20px",borderRadius:14,background:T.surf,border:`1px solid ${T.border}`,textAlign:"center"}}>
              <div style={{fontSize:24,marginBottom:8}}>{s.icon}</div>
              <div style={{fontFamily:"JetBrains Mono",fontWeight:900,fontSize:28,color:s.color}}>{s.value}</div>
              <div style={{fontSize:11,color:T.muted,marginTop:3}}>{s.label}</div>
            </div>
          ))}
        </div>
        {/* Tabs */}
        <div style={{display:"flex",borderBottom:`1px solid ${T.border}`,marginBottom:22,gap:0}}>
          {[["share","🔗 Partager"],["history","📋 Historique"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{padding:"10px 18px",background:"transparent",border:"none",borderBottom:`2px solid ${tab===id?T.acc:"transparent"}`,color:tab===id?T.text:T.muted,fontWeight:tab===id?700:400,fontSize:13,cursor:"pointer"}}>
              {label}
            </button>
          ))}
        </div>
        {tab==="share"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {/* Referral link */}
            <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:20}}>
              <div style={{fontWeight:700,fontSize:14,marginBottom:14}}>🔗 Ton lien de parrainage unique</div>
              <div style={{display:"flex",gap:8}}>
                <div style={{flex:1,padding:"11px 14px",borderRadius:10,background:T.bg,border:`1px solid ${T.border}`,fontSize:13,fontFamily:"JetBrains Mono",color:T.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{refLink}</div>
                <Btn onClick={copyLink} v={copied?"success":"primary"} icon={copied?"✓":"📋"}>{copied?"Copié !":"Copier"}</Btn>
              </div>
              <div style={{marginTop:10,display:"flex",gap:6}}>
                <Tag color={T.acc}>Code : {refCode}</Tag>
                <Tag color={T.muted}>-20% pour ton ami à l'inscription</Tag>
              </div>
            </div>

            {/* Invite by email */}
            <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,padding:20}}>
              <div style={{fontWeight:700,fontSize:14,marginBottom:14}}>📧 Inviter par email</div>
              <div style={{display:"flex",gap:8}}>
                <input value={invited} onChange={e=>setInvited(e.target.value)} placeholder="email@ami.com" type="email" style={{flex:1,padding:"10px 14px",borderRadius:10,fontSize:14,background:T.bg,border:`1px solid ${T.border}`,color:T.text}}
                  onFocus={e=>e.target.style.borderColor=T.acc}
                  onBlur={e=>e.target.style.borderColor=T.border}/>
                <Btn onClick={()=>{if(!invited.includes("@")){notify("Email invalide","error");return;}setInvited("");notify(`Invitation envoyée à ${invited} ! 📬`,"success");}} icon="📨">Inviter</Btn>
              </div>
              <div style={{fontSize:11,color:T.muted,marginTop:7}}>Ton ami recevra un email avec ton lien et -20% à l'inscription.</div>
            </div>
          </div>
        )}
        {tab==="history"&&(
          <div style={{background:T.surf,borderRadius:14,border:`1px solid ${T.border}`,overflow:"hidden"}}>
            <div style={{padding:"11px 18px",borderBottom:`1px solid ${T.border}`,display:"grid",gridTemplateColumns:"1fr 90px 90px 100px",fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",gap:8}}>
              <span>Ami invité</span><span>Date</span><span>Statut</span><span>Récompense</span>
            </div>
            {referrals.map((r,i)=>(
              <div key={r.name} style={{padding:"13px 18px",borderBottom:i<referrals.length-1?`1px solid ${T.border}`:"none",display:"grid",gridTemplateColumns:"1fr 90px 90px 100px",alignItems:"center",fontSize:13,gap:8,transition:"background .12s"}} onMouseEnter={e=>e.currentTarget.style.background=T.surf2} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div>
                  <div style={{fontWeight:600}}>{r.name}</div>
                  <div style={{fontSize:11,color:T.muted,fontFamily:"JetBrains Mono"}}>{r.email}</div>
                </div>
                <span style={{fontSize:11,color:T.muted}}>{r.date}</span>
                <Tag color={r.status==="Abonné Pro"?T.acc:r.status==="Inscrit"?T.cyan:T.muted}>{r.status}</Tag>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:11,color:r.paid?T.green:T.yellow,fontWeight:600}}>{r.reward}</span>
                  {r.paid&&<span style={{fontSize:12}}>✅</span>}
                </div>
              </div>
            ))}
            {referrals.length===0&&(
              <div style={{padding:"40px 20px",textAlign:"center",color:T.muted,fontSize:13}}>Pas encore de parrainage. Partage ton lien !</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   PAGE: ONBOARDING EMAIL SEQUENCE (mockup)
══════════════════════════════════════════════ */
const EmailSequencePage=({onBack})=>{
  const [activeEmail,setActiveEmail]=useState(0);
  const emails=[
    {
      delay:"Immédiat",tag:"Bienvenue",color:T.acc,icon:"👋",
      subject:"Bienvenue sur SubCraft ! Voici comment démarrer 🚀",
      from:"Sophie de SubCraft <hello@subcraftai.com>",
      body:`Salut {{prénom}} 👋

Bienvenue dans la famille SubCraft ! On est super contents de t'avoir avec nous.

Tu as créé ton compte il y a quelques instants — voici comment tirer le maximum de SubCraft dès aujourd'hui :

**1. Upload ta première vidéo** → 3 vidéos gratuites t'attendent
**2. Choisis un style** → 10 styles pro disponibles immédiatement
**3. Exporte ton SRT** → Gratuit, illimité

👉 [Commencer maintenant](https://subcraftai.com/dashboard)

Des questions ? Réponds directement à cet email, je lis tout personnellement.

Sophie
Fondatrice de SubCraft

P.S. Rejoins notre Discord pour partager tes créations et obtenir des conseils 🎬`
    },
    {
      delay:"J+3",tag:"Activation",color:T.green,icon:"⚡",
      subject:"3 astuces pour des sous-titres qui explosent tes vues 📈",
      from:"Sophie de SubCraft <hello@subcraftai.com>",
      body:`Salut {{prénom}} !

Ça fait 3 jours que tu as rejoint SubCraft. J'espère que tu as eu le temps de tester !

Voici les 3 astuces que nos créateurs les plus viraux utilisent :

**🔥 Astuce #1 : Le style Yellow Bold**
C'est le style le plus partagé sur TikTok. Impact font, fond transparent, ombre noire. Essaie-le sur ta prochaine vidéo.

**😀 Astuce #2 : Les emojis IA**
Notre IA Claude analyse le contexte et ajoute automatiquement les emojis parfaits à chaque sous-titre. Clique sur "Emojis IA" dans l'éditeur.

**🌍 Astuce #3 : La traduction en anglais**
Les créateurs qui traduisent leurs sous-titres en anglais touchent en moyenne 3x plus de monde. C'est 2 clics dans SubCraft.

👉 [Ouvrir mon dashboard](https://subcraftai.com/dashboard)

Sophie`
    },
    {
      delay:"J+7 (si pas abonné)",tag:"Conversion",color:T.yellow,icon:"💰",
      subject:"Tes 3 vidéos gratuites expirent bientôt ⚠️",
      from:"Sophie de SubCraft <hello@subcraftai.com>",
      body:`Salut {{prénom}},

Tu as utilisé tes crédits gratuits et j'espère que tu as vu la différence que des sous-titres pros font sur tes vidéos !

Pour continuer à créer sans limite, passe au plan Basic à seulement **€10/mois** (billed yearly).

**Ce que tu débloque :**
✓ 30 vidéos/mois
✓ Export HD 60fps
✓ Support 24/7
✓ Toutes les polices custom

**Offre spéciale 48h : -20% avec le code WELCOME20**

👉 [Choisir mon plan](https://subcraftai.com/pricing?code=WELCOME20)

L'offre expire dans 48h.

Sophie

P.S. Si tu veux juste plus de temps pour tester, réponds à cet email et on peut arranger ça 😊`
    },
    {
      delay:"J+30 (abonnés)",tag:"Rétention",color:T.purple,icon:"🎁",
      subject:"1 mois avec SubCraft — merci et cadeau 🎁",
      from:"Sophie de SubCraft <hello@subcraftai.com>",
      body:`Salut {{prénom}} !

Ça fait exactement 1 mois que tu utilises SubCraft. Merci de nous faire confiance ! 🙏

En ce mois, tu as créé {{nb_vidéos}} vidéos avec des sous-titres pros. C'est énorme !

**Pour fêter ça, on t'offre :**
🎁 Vidéos bonus ajoutées à ton compte
🔗 Ton lien de parrainage unique pour inviter tes amis
⭐ Accès anticipé à SubCraft v5 (bientôt !)

**Programme de parrainage :**
Invite un ami → il obtient -20% → tu gagnes 1 mois gratuit.

👉 [Voir mon lien de parrainage](https://subcraftai.com/dashboard/referral)

Merci encore,
Sophie & toute l'équipe SubCraft`
    },
  ];
  const tagColor={Bienvenue:T.acc,Activation:T.green,Conversion:T.yellow,Rétention:T.purple};
  return(
    <div style={{minHeight:"100vh",background:T.bg,padding:"0 24px 80px"}} className="page">
      <div style={{maxWidth:940,margin:"0 auto"}}>
        <div style={{padding:"22px 0 28px",display:"flex",alignItems:"center",gap:12}}>
          <Btn v="ghost" onClick={onBack}>← Retour</Btn>
          <div>
            <h1 style={{fontWeight:800,fontSize:22}}>📧 Séquence d'emails automatiques</h1>
            <div style={{color:T.muted,fontSize:13,marginTop:2}}>4 emails déclenchés automatiquement après l'inscription</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:20,alignItems:"start"}} className="mobile-col">
          {/* Sidebar timeline */}
          <div style={{display:"flex",flexDirection:"column",gap:6,position:"sticky",top:20}}>
            {emails.map((email,i)=>(
              <button key={i} onClick={()=>setActiveEmail(i)} style={{padding:"14px 16px",borderRadius:12,background:activeEmail===i?`${tagColor[email.tag]||T.acc}15`:T.surf,border:`1px solid ${activeEmail===i?tagColor[email.tag]||T.acc:T.border}`,textAlign:"left",cursor:"pointer",transition:"all .15s",display:"flex",gap:10,alignItems:"flex-start"}}>
                <span style={{fontSize:22,flexShrink:0}}>{email.icon}</span>
                <div style={{minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:13,color:activeEmail===i?tagColor[email.tag]:T.text}}>{email.tag}</div>
                  <div style={{fontSize:11,color:T.muted,marginTop:2}}>Envoyé : {email.delay}</div>
                </div>
                <Tag color={tagColor[email.tag]||T.muted}>{i+1}</Tag>
              </button>
            ))}
            <div style={{padding:"12px 14px",borderRadius:10,background:`${T.green}08`,border:`1px solid ${T.green}18`,fontSize:12,color:T.muted,marginTop:6}}>
              ℹ️ En production, ces emails sont envoyés via <strong style={{color:T.text}}>Brevo / Mailchimp</strong> selon les déclencheurs.
            </div>
          </div>
          {/* Email preview */}
          <div key={activeEmail} style={{animation:"fadeUp .3s ease",background:T.surf,borderRadius:18,border:`1px solid ${T.border}`,overflow:"hidden"}}>
            <div style={{padding:"16px 22px",borderBottom:`1px solid ${T.border}`,background:T.surf2}}>
              <div style={{display:"flex",gap:8,marginBottom:8}}>
                {["🔴","🟡","🟢"].map(c=><div key={c} style={{width:12,height:12,borderRadius:"50%",background:c==="🔴"?T.pink:c==="🟡"?T.yellow:T.green,opacity:.8}}/>)}
                <div style={{flex:1,textAlign:"center",fontSize:12,color:T.muted}}>Aperçu Email</div>
              </div>
              <div style={{fontSize:12,color:T.muted,marginBottom:4}}><span style={{color:T.text,fontWeight:600}}>De :</span> {emails[activeEmail].from}</div>
              <div style={{fontSize:12,color:T.muted,marginBottom:4}}><span style={{color:T.text,fontWeight:600}}>À :</span> utilisateur@example.com</div>
              <div style={{fontSize:13,color:T.text,fontWeight:700,padding:"10px 14px",borderRadius:8,background:T.bg,marginTop:8}}>
                📩 {emails[activeEmail].subject}
              </div>
            </div>
            <div style={{padding:"24px 28px"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:22,padding:"12px 16px",borderRadius:12,background:T.bg,border:`1px solid ${T.border}`}}>
                <div style={{width:38,height:38,borderRadius:"50%",background:T.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>✦</div>
                <div>
                  <div style={{fontWeight:700,fontSize:13}}>Sophie de SubCraft</div>
                  <div style={{fontSize:11,color:T.muted}}>hello@subcraftai.com</div>
                </div>
                <div style={{marginLeft:"auto",display:"flex",gap:6}}>
                  <Tag color={tagColor[emails[activeEmail].tag]||T.acc}>{emails[activeEmail].tag}</Tag>
                  <Tag color={T.muted}>⏱ {emails[activeEmail].delay}</Tag>
                </div>
              </div>
              <div style={{fontSize:13.5,color:T.text,lineHeight:2,whiteSpace:"pre-line"}}>
                {emails[activeEmail].body.split("\n").map((line,li)=>{
                  if(line.startsWith("**")&&line.endsWith("**")) return <div key={li} style={{fontWeight:800,fontSize:14,margin:"6px 0"}}>{line.slice(2,-2)}</div>;
                  if(line.startsWith("✓")||line.startsWith("🎁")||line.startsWith("🔥")||line.startsWith("😀")||line.startsWith("🌍")||line.startsWith("⭐")||line.startsWith("🔗")) return <div key={li} style={{padding:"2px 0"}}>{line}</div>;
                  if(line.includes("[") && line.includes("](")) return <div key={li} style={{margin:"8px 0"}}><button style={{padding:"10px 20px",borderRadius:10,background:T.grad,border:"none",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer"}}>{line.match(/\[(.+?)\]/)?.[1]||line}</button></div>;
                  return <div key={li}>{line||" "}</div>;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   PAGE: COMPTE SUSPENDU
══════════════════════════════════════════════ */
const BannedPage=({user,onLogout})=>(
  <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:T.bg,padding:24,flexDirection:"column",gap:0}}>
    <AuroraBg subtle/>
    <div style={{position:"relative",zIndex:1,textAlign:"center",maxWidth:480}}>
      <div style={{fontSize:72,marginBottom:24}}>🚫</div>
      <h1 className="syne" style={{fontWeight:800,fontSize:28,marginBottom:12,color:T.pink}}>Compte suspendu</h1>
      <p style={{color:T.muted,fontSize:15,lineHeight:1.7,marginBottom:32}}>
        Ton compte a été suspendu suite à une violation de nos conditions d'utilisation.<br/>
        Si tu penses qu'il s'agit d'une erreur, contacte notre support.
      </p>
      <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
        <a href="mailto:legal@subcraftai.com" style={{padding:"12px 24px",borderRadius:12,background:`${T.acc}15`,border:`1px solid ${T.acc}30`,color:T.acc,fontSize:14,fontWeight:700,textDecoration:"none",cursor:"pointer"}}>
          📧 Contacter le support
        </a>
        <button onClick={onLogout} style={{padding:"12px 24px",borderRadius:12,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:T.muted,fontSize:14,fontWeight:600,cursor:"pointer"}}>
          Se déconnecter
        </button>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════════ */
export default function App(){
  const [page,setPage]=useState("landing");
  const [user,setUser]=useState(null);
  const [currentFile,setCurrentFile]=useState(null);
  const [checkoutPlan,setCheckoutPlan]=useState("pro");
  const [checkoutYearly,setCheckoutYearly]=useState(true);
  const [cookieConsent,setCookieConsent]=useState({necessary:true,analytics:false,marketing:false});
  const [pushDismissed,setPushDismissed]=useState(false);
  const [pushToasts,setPushToasts]=useState([]);

  const nav=(p)=>setPage(p);

  // Détecte retour paiement Stripe (?payment=success&plan=xxx)
  useEffect(()=>{
    const urlParams = new URLSearchParams(window.location.search);
    const payment = urlParams.get("payment");
    const planId = urlParams.get("plan");
    const pageParam = urlParams.get("page");

    // Retour paiement réussi
    if(payment === "success" && planId) {
      window.history.replaceState(null,"",window.location.pathname);
      const token = localStorage.getItem("sc_token");
      if(token) {
        fetch("/api/auth?action=me",{headers:{"Authorization":`Bearer ${token}`}})
          .then(r=>r.json()).then(d=>{
            if(d.user){
              setUser(d.user);
              setPage("dashboard");
              notify(`🎉 Plan ${d.user.plan} activé ! Bienvenue dans le plan supérieur.`,"success",6000);
            }
          }).catch(()=>{});
      }
    }
    // Retour paiement annulé
    if(payment === "cancel") {
      window.history.replaceState(null,"",window.location.pathname);
      notify("Paiement annulé — ton plan n'a pas changé.","warning");
    }
    // Navigation directe via ?page=xxx
    if(pageParam) {
      window.history.replaceState(null,"",window.location.pathname);
      const token = localStorage.getItem("sc_token");
      if(token && pageParam) setPage(pageParam);
    }
    // Parrainage — sauvegarde le ref dans localStorage
    const refId = urlParams.get("ref");
    if(refId && !localStorage.getItem("sc_ref")) {
      localStorage.setItem("sc_ref", refId);
      // Nettoie l'URL sans perdre la page
      const cleanUrl = window.location.pathname;
      window.history.replaceState(null,"",cleanUrl);
      notify("🎁 Lien de parrainage détecté ! Inscris-toi pour bénéficier d'un bonus.","info",5000);
    }
  },[]);

  // Intercepte le token Google OAuth dans l'URL hash
  useEffect(()=>{
    const hash = window.location.hash;
    if(hash && hash.includes("access_token=")) {
      const params = new URLSearchParams(hash.replace("#",""));
      const token = params.get("access_token");
      if(token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          localStorage.setItem("sc_token", token);
          localStorage.setItem("sc_google_processing", "1");
          window.history.replaceState(null, "", window.location.pathname);
          fetch("/api/auth?action=me", {
            headers: { "Authorization": `Bearer ${token}` }
          }).then(r=>r.json()).then(d=>{
            const userId = d.user?.id || payload.sub;
            const onboardingKey = `sc_onboarded_${userId}`;
            const isNew = !localStorage.getItem(onboardingKey);
            if(isNew) localStorage.setItem(onboardingKey, "1");
            localStorage.removeItem("sc_google_processing");
            const userData = d.user || {
              id: payload.sub, email: payload.email,
              name: payload.user_metadata?.full_name || payload.user_metadata?.name || payload.email?.split("@")[0],
              plan: "free", credits: 3,
            };
            // Email admin → panel admin direct
            if((userData.email || payload.email) === "kevin.nedzvedsky@gmail.com") {
              localStorage.setItem("sc_token", token);
              nav("admin");
              return;
            }
            if(d.user) {
              handleAuth({...d.user, isNew});
            } else {
              handleAuth({
                id: payload.sub, email: payload.email,
                name: payload.user_metadata?.full_name || payload.user_metadata?.name || payload.email?.split("@")[0],
                plan: "free", credits: 3, isNew,
              });
            }
          }).catch(()=>{
            localStorage.removeItem("sc_google_processing");
            const emailFromToken = payload.email;
            if(emailFromToken === "kevin.nedzvedsky@gmail.com") {
              nav("admin");
              return;
            }
            const userId = payload.sub;
            const onboardingKey = `sc_onboarded_${userId}`;
            const isNew = !localStorage.getItem(onboardingKey);
            if(isNew) localStorage.setItem(onboardingKey, "1");
            handleAuth({
              id: payload.sub, email: emailFromToken,
              name: payload.user_metadata?.full_name || emailFromToken?.split("@")[0],
              plan: "free", credits: 3, isNew,
            });
          });
        } catch(e) { console.error("Erreur token Google:", e); }
      }
      return; // ← STOP — ne pas exécuter le check savedToken
    }
    // Charge l'user silencieusement — JAMAIS de redirect automatique
    const savedToken = localStorage.getItem("sc_token");
    if(savedToken && !localStorage.getItem("sc_google_processing")) {
      try {
        const payload = JSON.parse(atob(savedToken.split(".")[1]));
        const exp = payload.exp * 1000;
        if(exp > Date.now()) {
          // Vérifie d'abord si c'est l'admin via le token local
          try {
            const p = JSON.parse(atob(savedToken.split(".")[1]));
            const emailInToken = p.email || "";
            if(emailInToken === "kevin.nedzvedsky@gmail.com") {
              nav("admin");
              return;
            }
          } catch {}
          fetch("/api/auth?action=me", {
            headers: { "Authorization": `Bearer ${savedToken}` }
          }).then(r => r.json()).then(d => {
            if(d.user) {
              setUser(d.user); // ← user chargé, on reste sur la landing
            } else {
              localStorage.removeItem("sc_token");
            }
          }).catch(()=>{});
        } else {
          localStorage.removeItem("sc_token");
        }
      } catch(e) { localStorage.removeItem("sc_token"); }
    }
  },[]);

  const showPushToast=(title,body)=>{
    const id=Date.now();
    setPushToasts(q=>[...q,{id,title,body}]);
    setTimeout(()=>setPushToasts(q=>q.filter(n=>n.id!==id)),5000);
  };

  const handleAuth=(u)=>{
    if(u.status==="suspended"){
      setUser(u);
      nav("banned");
      return;
    }
    setUser(u);
    if(u.isNew){nav("onboarding");}
    else{nav("dashboard");}
  };

  const goCheckout=async(planId,yearly=true)=>{
    if(!user){nav("login");return;}
    if(planId==="free"){nav(user?"dashboard":"signup");return;}
    notify("Redirection vers Stripe...","info");
    try {
      const token = localStorage.getItem("sc_token");
      const res = await fetch("/api/stripe?action=create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? {"Authorization": `Bearer ${token}`} : {})
        },
        body: JSON.stringify({
          planId: planId || "pro",
          yearly,
          userId: user?.id,
          email: user?.email,
          successUrl: window.location.origin + "/?payment=success&plan=" + (planId||"pro"),
          cancelUrl: window.location.origin + "/?payment=cancel",
        })
      });
      const data = await res.json();
      if(data.url) {
        window.location.href = data.url;
      } else {
        notify("Erreur: " + (data.error || "Impossible de créer la session"), "error");
      }
    } catch(e) {
      notify("Erreur réseau. Réessaie.", "error");
    }
  };

  const LEGAL_PAGES=["cgu","privacy","cookies","legal","rgpd"];

  return(
    <>
      <GS/>
      <NotifProvider/>

      {/* Push notification toasts */}
      <div style={{position:"fixed",top:16,right:16,zIndex:9999,display:"flex",flexDirection:"column",gap:8,pointerEvents:"none"}}>
        {pushToasts.map(n=>(
          <div key={n.id} style={{background:T.surf2,border:`1px solid ${T.acc}40`,borderRadius:14,padding:"12px 16px",width:290,boxShadow:"0 8px 32px rgba(0,0,0,.7)",animation:"notifIn .35s cubic-bezier(.34,1.56,.64,1) both",display:"flex",gap:10,alignItems:"flex-start"}}>
            <div style={{width:34,height:34,borderRadius:9,background:T.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>✦</div>
            <div><div style={{fontWeight:700,fontSize:12,marginBottom:2}}>{n.title}</div><div style={{fontSize:11,color:T.muted,lineHeight:1.4}}>{n.body}</div></div>
          </div>
        ))}
      </div>

      {/* Push permission banner */}

      {page==="landing"&&<><LandingPage user={user} onCTA={()=>nav(user?"dashboard":"signup")} setPage={nav} goCheckout={goCheckout}/></>}
      <ChatBubble setPage={nav} user={user}/>
      {page==="login"&&<LoginPage onAuth={handleAuth} onAdmin={()=>nav("admin")} goSignup={()=>nav("signup")}/>}
      {page==="signup"&&<SignupPage onAuth={handleAuth} goLogin={()=>nav("login")}/>}
      {page==="auth"&&<LoginPage onAuth={handleAuth} onAdmin={()=>nav("admin")} goSignup={()=>nav("signup")}/>}
      {page==="signup-success"&&<SignupSuccessPage user={user} onContinue={()=>nav("onboarding")}/>}
      {page==="onboarding"&&<OnboardingPage user={user} onComplete={()=>nav("dashboard")}/>}
      {page==="dashboard"&&(user?.status==="suspended"?nav("banned"):null)||null}
      {page==="dashboard"&&user?.status!=="suspended"&&<Dashboard user={user} setUser={setUser} onOpen={f=>{setCurrentFile(f);nav("editor");}} onLogout={()=>{setUser(null);nav("landing");}} setPage={nav}/>}
      {page==="editor"&&<EditorPage onBack={()=>nav("dashboard")} file={currentFile}/>}
      {page==="pricing"&&<PricingPage onBack={()=>nav(user?"dashboard":"landing")} onSelect={(planId,yearly)=>goCheckout(planId,yearly)}/>}
      {page==="checkout"&&<CheckoutPage plan={checkoutPlan} yearly={checkoutYearly} onBack={()=>nav("pricing")} user={user} onSuccess={(planId)=>{setUser(u=>({...u,plan:PLANS.find(p=>p.id===planId)?.name||"Pro"}));nav("dashboard");notify("🎉 Bienvenue dans le plan Pro !","success");}}/>}
      {page==="payment-failed"&&<PaymentFailed onRetry={()=>nav("checkout")} onBack={()=>nav("pricing")}/>}
      {page==="subscription"&&<SubscriptionPage user={user} setUser={setUser} onBack={()=>nav("dashboard")}/>}
      {page==="profile"&&<ProfilePage user={user} setUser={setUser} onBack={()=>nav("dashboard")} setPage={nav}/>}
      {page==="templates"&&<TemplatesPage onBack={()=>nav("dashboard")} onSelect={()=>nav("editor")}/>}
      {page==="support"&&<SupportPage onBack={()=>nav(user?"dashboard":"landing")}/>}
      {page==="changelog"&&<ChangelogPage onBack={()=>nav(user?"dashboard":"landing")}/>}
      {page==="status"&&<StatusPage onBack={()=>nav(user?"dashboard":"landing")}/>}
      {page==="referral"&&<ReferralPage user={user} onBack={()=>nav("dashboard")}/>}
      {page==="emails"&&<EmailSequencePage onBack={()=>nav("dashboard")}/>}
      {LEGAL_PAGES.includes(page)&&<LegalPage type={page} onBack={()=>nav(user?"dashboard":"landing")} setPage={nav}/>}
      {page==="banned"&&<BannedPage user={user} onLogout={()=>{setUser(null);localStorage.removeItem("sc_token");nav("landing");}}/>}
      {page==="admin"&&<AdminPanel onExit={()=>nav("landing")}/>}
      {page==="404"&&<NotFound onHome={()=>nav("landing")}/>}

    </>
  );
}
