(function(){
  var CHAT_URL="https://visa-chat.rabehfly.workers.dev";
  var FACE='<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="5" y="8" width="22" height="18" rx="7" fill="#fff" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="17" r="2.4" fill="currentColor"/><circle cx="20" cy="17" r="2.4" fill="currentColor"/><path d="M12 22c2.5 1.6 5.5 1.6 8 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16 8V4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="3.5" r="1.6" fill="currentColor"/></svg>';
  var HELLOS=["Bonjour","Hello","مرحبا","Bienvenue","Welcome","أهلاً"];
  var T={
    fr:{hi:"Bonjour ! Je suis l'assistant Visa Checker. Pose-moi ta question sur ton dossier de visa. Je ne remplace pas le consulat et je ne peux pas promettre un visa.",ph:"Pose ta question…",send:"Envoyer",on:"En ligne",dest:"Destination choisie : {c}.",err:"Erreur, réessaie.",net:"Connexion impossible, réessaie.",payb:"Acheter un accès",payw:"Vérification du paiement…",payok:"Paiement confirmé ! Ton code : {c}. Garde-le : il est déjà activé.",payp:"Paiement non confirmé pour l'instant. Si tu viens de payer, réessaie dans un instant.",payr:"Vérifier à nouveau",paye:"Le paiement n'est pas disponible pour le moment. Réessaie plus tard.",payf:"Le paiement a été annulé ou a échoué. Tu peux réessayer.",ivk:"Entre ton code d'accès à l'entraînement (reçu après paiement).",ivb:"Code invalide. Vérifie-le et réessaie.",ivl:"Tu as utilisé tous les messages de ce code.",ivc:"Entraînement entretien",ivi:"Entraînement à l'entretien : je joue le rôle du consulat et je te pose des questions une par une. Réponds avec ta vraie situation, je te dirai ce qui est clair ou flou. N'écris pas ton numéro de passeport. Je ne garantis pas le visa.\nPour commencer, décris ta situation en 2 lignes : destination, motif, dates, métier, qui paie.",ivn:["Question suivante","Question suivante."],ive:["Résumé final","Fais maintenant le résumé final."],ivm:"Fin de l'entraînement (limite atteinte). Recharge la page pour recommencer.",chips:[["Quels documents ?","Quels documents dois-je préparer pour mon visa ?"],["Visa refusé","Mon visa a été refusé, que faire ?"],["Billet et hôtel","Comment justifier mon billet d'avion et ma réservation d'hôtel ?"]]},
    en:{hi:"Hello! I'm the Visa Checker assistant. Ask me about your visa file. I don't replace the consulate and I can't promise a visa.",ph:"Ask your question…",send:"Send",on:"Online",dest:"Chosen destination: {c}.",err:"Error, please try again.",net:"Connection failed, please try again.",payb:"Buy access",payw:"Checking your payment…",payok:"Payment confirmed! Your code: {c}. Keep it: it is already active.",payp:"Payment not confirmed yet. If you have just paid, try again in a moment.",payr:"Check again",paye:"Payment is not available right now. Please try again later.",payf:"The payment was cancelled or failed. You can try again.",ivk:"Enter your practice access code (received after payment).",ivb:"Invalid code. Check it and try again.",ivl:"You have used all the messages for this code.",ivc:"Interview practice",ivi:"Interview practice: I play the consulate and ask you questions one at a time. Answer with your real situation and I'll tell you what is clear or vague. Don't write your passport number. I don't guarantee a visa.\nTo start, describe your situation in 2 lines: destination, purpose, dates, job, who pays.",ivn:["Next question","Next question."],ive:["Final summary","Now give me the final summary."],ivm:"Practice over (limit reached). Reload the page to start again.",chips:[["Which documents?","Which documents should I prepare for my visa?"],["Visa refused","My visa was refused, what should I do?"],["Ticket and hotel","How do I justify my flight ticket and hotel booking?"]]},
    ar:{hi:"مرحباً! أنا مساعد Visa Checker. اسألني عن ملف التأشيرة. لا أحل محل القنصلية ولا أستطيع ضمان التأشيرة.",ph:"اكتب سؤالك…",send:"إرسال",on:"متصل",dest:"الوجهة المختارة: {c}.",err:"خطأ، حاول مرة أخرى.",net:"تعذر الاتصال، حاول مرة أخرى.",payb:"شراء الوصول",payw:"جارٍ التحقق من الدفع…",payok:"تم تأكيد الدفع! رمزك: {c}. احتفظ به: وهو مفعّل بالفعل.",payp:"لم يتم تأكيد الدفع بعد. إذا دفعت للتو فحاول مرة أخرى بعد قليل.",payr:"تحقق مجدداً",paye:"الدفع غير متاح حاليا. حاول لاحقاً.",payf:"تم إلغاء الدفع أو فشل. يمكنك المحاولة مرة أخرى.",ivk:"أدخل رمز الدخول إلى التدريب (تحصل عليه بعد الدفع).",ivb:"الرمز غير صحيح. تحقق منه وحاول مجدداً.",ivl:"لقد استعملت كل رسائل هذا الرمز.",ivc:"تدريب على المقابلة",ivi:"تدريب على المقابلة: ألعب دور القنصلية وأطرح عليك الأسئلة واحداً تلو الآخر. أجب بوضعك الحقيقي وسأخبرك بما هو واضح وما هو غامض. لا تكتب رقم جواز سفرك. لا أضمن التأشيرة.\nللبدء، صف وضعك في سطرين: الوجهة، الغرض، التواريخ، المهنة، ومن يتحمّل التكاليف.",ivn:["السؤال التالي","السؤال التالي."],ive:["الملخص النهائي","أعطني الآن الملخص النهائي."],ivm:"انتهى التدريب (بلغت الحد الأقصى). أعد تحميل الصفحة للبدء من جديد.",chips:[["ما هي الوثائق؟","ما هي الوثائق التي يجب أن أحضّرها لتأشيرتي؟"],["تأشيرة مرفوضة","تم رفض تأشيرتي، ماذا أفعل؟"],["التذكرة والفندق","كيف أثبت تذكرة الطائرة وحجز الفندق؟"]]}
  };
  function L(){var l=(document.documentElement.lang||"fr").slice(0,2);return T[l]||T.fr;}
  var $=function(i){return document.getElementById(i)};
  var box=$("vc-box"),msgs=$("vc-msgs"),inp=$("vc-in"),sendBtn=$("vc-send"),chips=$("vc-chips"),hello=$("vc-hello"),
      hist=[],busy=false,last=0,mode="",ivStarted=false,ivCount=0,ivCode="",greet=null,timer=null,hi=0,
      still=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  $("vc-btn").innerHTML=FACE;document.querySelector(".vc-av").innerHTML=FACE;
  function add(t,c){var d=document.createElement("div");d.className="vc-m "+c;d.textContent=t;msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;return d;}
  function labels(){
    var l=L();inp.placeholder=l.ph;sendBtn.textContent=l.send;$("vc-on").textContent=l.on;
    if(greet&&!hist.length&&mode!=="interview"){var c=window.__vcCtx&&window.__vcCtx();greet.textContent=l.hi+(c?"\n"+l.dest.replace("{c}",c.name):"");}
    chips.innerHTML="";
    if(!hist.length&&mode!=="interview"){l.chips.forEach(function(c){var b=document.createElement("button");b.type="button";b.className="vc-chip";b.textContent=c[0];b.onclick=function(){send(c[1])};chips.appendChild(b);});var ib=document.createElement("button");ib.type="button";ib.className="vc-chip";ib.textContent=l.ivc;ib.onclick=startIv;chips.appendChild(ib);}
  }
  function startIv(){
    var l=L();mode="interview";ivStarted=false;ivCount=0;ivCode="";stopHello();chips.innerHTML="";var sv="";try{sv=localStorage.getItem("vc-iv-code")||""}catch(e){}
    if(sv){verifySaved(sv)}else{add(l.ivk,"vc-a");payChip();inp.focus();}
  }
  function ivChips(){
    if(mode!=="interview")return;var l=L();chips.innerHTML="";
    [l.ivn,l.ive].forEach(function(c){var b=document.createElement("button");b.type="button";b.className="vc-chip";b.textContent=c[0];b.onclick=function(){send(c[1])};chips.appendChild(b);});
  }
  function tick(){hello.textContent=HELLOS[hi++%HELLOS.length];}
  function startHello(){
    if(still){hello.textContent=HELLOS.slice(0,3).join(" · ");return;}
    tick();clearInterval(timer);timer=setInterval(tick,2200);
  }
  function stopHello(){clearInterval(timer);hello.hidden=true;}
  greet=add(L().hi,"vc-a");labels();
  $("vc-btn").onclick=function(){
    var open=box.style.display==="flex";box.style.display=open?"none":"flex";
    if(open){clearInterval(timer);return;}
    labels();if(!hist.length){hello.hidden=false;startHello();}inp.focus();
  };
  function api(p){return fetch(CHAT_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(p)}).then(function(r){return r.json();});}
  function openBox(){if(box.style.display!=="flex")$("vc-btn").click();}
  function chip(label,fn){var b=document.createElement("button");b.type="button";b.className="vc-chip";b.textContent=label;b.onclick=fn;chips.appendChild(b);}
  function payChip(){chips.innerHTML="";chip(L().payb,startPay);}
  function verifySaved(sv){
    var l=L();
    api({mode:"interview",check:true,code:sv}).then(function(j){
      if(j&&j.ok){ivCode=sv;add(l.ivi,"vc-a");}
      else{try{localStorage.removeItem("vc-iv-code")}catch(e){}add(l.ivk,"vc-a");payChip();}
    }).catch(function(){add(l.ivk,"vc-a");payChip();});
  }
  function startPay(){
    var l=L(),w;chips.innerHTML="";w=add("…","vc-a");busy=true;
    api({action:"pay_create"}).then(function(j){
      if(j&&j.payUrl){try{localStorage.setItem("vc-pay-ref",j.ref)}catch(e){}location.href=j.payUrl;}
      else{w.textContent=l.paye;}
    }).catch(function(){w.textContent=l.net;}).then(function(){busy=false;});
  }
  function payCheck(manual){
    var l=L(),ref="";try{ref=localStorage.getItem("vc-pay-ref")||""}catch(e){}
    if(!ref)return;
    var w=manual?add(l.payw,"vc-a"):null;
    api({action:"pay_check",ref:ref}).then(function(j){
      if(j&&j.paid&&j.code){
        try{localStorage.removeItem("vc-pay-ref");localStorage.setItem("vc-iv-code",j.code)}catch(e){}
        openBox();mode="interview";ivCode=j.code;stopHello();chips.innerHTML="";
        add(l.payok.replace("{c}",j.code),"vc-a");add(l.ivi,"vc-a");
      }else if(manual&&w){w.textContent=l.payp;chips.innerHTML="";chip(l.payr,function(){payCheck(true)});}
    }).catch(function(){if(manual&&w)w.textContent=l.net;});
  }
  function onReturn(){
    var q=location.search||"",ref="";try{ref=localStorage.getItem("vc-pay-ref")||""}catch(e){}
    if(/[?&]pay=fail/.test(q)){try{localStorage.removeItem("vc-pay-ref")}catch(e){}openBox();mode="interview";stopHello();add(L().payf,"vc-a");payChip();return;}
    if(!ref)return;
    if(/[?&]pay=/.test(q)){openBox();mode="interview";stopHello();payCheck(true);}else{payCheck(false);}
  }
  function checkCode(c){
    var l=L();last=Date.now();busy=true;inp.value="";add("••••••","vc-u");
    var w=add("…","vc-a");
    fetch(CHAT_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mode:"interview",check:true,code:c})})
      .then(function(r){return r.json();})
      .then(function(j){if(j&&j.ok){ivCode=c;try{localStorage.setItem("vc-iv-code",c)}catch(e){}w.textContent=l.ivi;}else if(j&&j.error==="limit"){w.textContent=l.ivl;}else{w.textContent=l.ivb;}})
      .catch(function(){w.textContent=l.net;})
      .then(function(){busy=false;});
  }
  function send(text){
    var t=(typeof text==="string"?text:inp.value).trim();
    if(!t||busy||Date.now()-last<2000)return;
    var l0=L();
    if(mode==="interview"&&!ivCode){checkCode(t);return;}
    if(mode==="interview"){if(ivCount>=30){add(l0.ivm,"vc-a");chips.innerHTML="";return;}ivCount++;}
    last=Date.now();busy=true;inp.value="";
    stopHello();chips.innerHTML="";
    add(t,"vc-u");hist.push({role:"user",text:t});
    var w=add("…","vc-a"),l=L();
    fetch(CHAT_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify((function(){var c=window.__vcCtx&&window.__vcCtx();return{messages:hist,mode:mode,code:ivCode,country:c?c.id:"",countryName:c?c.fr:"",ready:c?c.ready:false}})())})
      .then(function(r){return r.json();})
      .then(function(j){
        if(j.error==="code"){ivCode="";try{localStorage.removeItem("vc-iv-code")}catch(e){}hist.pop();w.textContent=l.ivb+" "+l.ivk;return;}
        if(j.error==="limit"){hist.pop();w.textContent=l.ivl;return;}
        w.textContent=j.reply||l.err;hist.push({role:"assistant",text:w.textContent});ivChips();})
      .catch(function(){w.textContent=l.net;hist.pop();})
      .then(function(){busy=false;});
  }
  onReturn();
  window.__vcInterview=function(){if(box.style.display!=="flex")$("vc-btn").click();startIv();};
  sendBtn.onclick=function(){send()};
  inp.addEventListener("keydown",function(e){if(e.key==="Enter")send();});
})();
