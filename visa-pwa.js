/* PWA : enregistrement du Service Worker + bannière d'installation (Android/Chrome : invite native ; iOS : mode d'emploi) */
(function(){
  var T={
    fr:{it:"Installer Visa Checker",id:"Accès rapide depuis l'écran d'accueil, même sans connexion.",ig:"Installer",x:"Plus tard",
        ios:"Sur iPhone : touchez Partager, puis « Sur l'écran d'accueil ».",ios1:"Touchez le bouton Partager",ios2:"Choisissez « Sur l'écran d'accueil »",ios3:"Touchez Ajouter",ok:"Compris",
        ut:"Nouvelle version disponible",ud:"Rechargez pour profiter des dernières mises à jour.",ug:"Mettre à jour"},
    en:{it:"Install Visa Checker",id:"Quick access from your home screen, even offline.",ig:"Install",x:"Later",
        ios:"On iPhone: tap Share, then “Add to Home Screen”.",ios1:"Tap the Share button",ios2:"Choose “Add to Home Screen”",ios3:"Tap Add",ok:"Got it",
        ut:"New version available",ud:"Reload to get the latest updates.",ug:"Update"},
    ar:{it:"ثبّت Visa Checker",id:"وصول سريع من الشاشة الرئيسية، حتى دون اتصال.",ig:"تثبيت",x:"لاحقًا",
        ios:"على الآيفون: اضغط مشاركة ثم «إضافة إلى الشاشة الرئيسية».",ios1:"اضغط على زر المشاركة",ios2:"اختر «إضافة إلى الشاشة الرئيسية»",ios3:"اضغط إضافة",ok:"حسنًا",
        ut:"إصدار جديد متاح",ud:"أعد التحميل للحصول على آخر التحديثات.",ug:"تحديث"}
  };
  var SNOOZE="vc-pwa-snooze",DAYS=14,box=document.getElementById("pwa"),
      el=function(i){return document.getElementById(i)},mode=null,deferred=null,waiting=null;
  function lang(){var l=document.documentElement.lang;return T[l]?l:"fr"}
  function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
  function standalone(){return matchMedia("(display-mode: standalone)").matches||navigator.standalone===true}
  function ios(){return /iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1)}
  function snoozed(){var t=+store(SNOOZE);return t&&Date.now()-t<DAYS*864e5}
  function paint(){
    if(!mode)return;var t=T[lang()],s=el("pwa-s");
    el("pwa-x").setAttribute("aria-label",t.x);el("pwa-x").textContent="×";
    if(mode==="update"){el("pwa-t").textContent=t.ut;el("pwa-d").textContent=t.ud;el("pwa-go").textContent=t.ug;s.hidden=true}
    else if(mode==="ios"){el("pwa-t").textContent=t.it;el("pwa-d").textContent="";el("pwa-go").textContent=t.ok;
      s.innerHTML="<li>"+t.ios1+"</li><li>"+t.ios2+"</li><li>"+t.ios3+"</li>";s.hidden=false}
    else{el("pwa-t").textContent=t.it;el("pwa-d").textContent=t.id;el("pwa-go").textContent=t.ig;s.hidden=true}
  }
  function show(m){mode=m;paint();box.hidden=false;box.classList.add("on");requestAnimationFrame(function(){requestAnimationFrame(function(){box.classList.add("in")})})}
  function hide(){box.classList.remove("in");setTimeout(function(){box.classList.remove("on");box.hidden=true;mode=null},300)}
  new MutationObserver(paint).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});

  /* 1. Invite d'installation (Chrome, Edge, Samsung Internet, Android) : affichée après 8 s d'usage, jamais si refusée récemment */
  window.addEventListener("beforeinstallprompt",function(e){
    e.preventDefault();deferred=e;
    if(standalone()||snoozed())return;
    setTimeout(function(){if(deferred&&!mode)show("install")},8000);
  });
  window.addEventListener("appinstalled",function(){deferred=null;if(mode)hide();store(SNOOZE,String(Date.now()))});
  /* iOS Safari ne propose pas d'invite native : on affiche le mode d'emploi */
  if(ios()&&!standalone()&&!snoozed())setTimeout(function(){if(!mode)show("ios")},8000);

  el("pwa-go").onclick=function(){
    if(mode==="update"&&waiting){waiting.postMessage({type:"SKIP_WAITING"});return}
    if(mode==="install"&&deferred){var d=deferred;deferred=null;hide();d.prompt();d.userChoice.then(function(r){if(r.outcome!=="accepted")store(SNOOZE,String(Date.now()))});return}
    store(SNOOZE,String(Date.now()));hide();
  };
  el("pwa-x").onclick=function(){if(mode!=="update")store(SNOOZE,String(Date.now()));hide()};
  box.addEventListener("keydown",function(e){if(e.key==="Escape")el("pwa-x").click()});

  /* 2. Service Worker (https ou localhost uniquement) */
  if("serviceWorker" in navigator&&/^https?:$/.test(location.protocol)){
    window.addEventListener("load",function(){
      navigator.serviceWorker.register("sw.js",{scope:"./"}).then(function(reg){
        function watch(w){w.addEventListener("statechange",function(){if(w.state==="installed"&&navigator.serviceWorker.controller){waiting=w;show("update")}})}
        if(reg.waiting&&navigator.serviceWorker.controller){waiting=reg.waiting;show("update")}
        reg.addEventListener("updatefound",function(){watch(reg.installing)});
        setInterval(function(){reg.update().catch(function(){})},3600e3);
      }).catch(function(){});
      var reloaded=false,had=!!navigator.serviceWorker.controller;
      navigator.serviceWorker.addEventListener("controllerchange",function(){if(reloaded||!had)return;reloaded=true;location.reload()});
    });
  }
})();
