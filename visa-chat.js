(function(){
  var CHAT_URL="https://visa-chat.rabehfly.workers.dev";
  var FACE='<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="5" y="8" width="22" height="18" rx="7" fill="#fff" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="17" r="2.4" fill="currentColor"/><circle cx="20" cy="17" r="2.4" fill="currentColor"/><path d="M12 22c2.5 1.6 5.5 1.6 8 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16 8V4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="3.5" r="1.6" fill="currentColor"/></svg>';
  var HELLOS=["Bonjour","Hello","مرحبا","Bienvenue","Welcome","أهلاً"];
  var T={
    fr:{hi:"Bonjour ! Je suis l'assistant Visa Checker. Pose-moi ta question sur ton dossier de visa. Je ne remplace pas le consulat et je ne peux pas promettre un visa.",ph:"Pose ta question…",send:"Envoyer",on:"En ligne",dest:"Destination choisie : {c}.",err:"Erreur, réessaie.",net:"Connexion impossible, réessaie.",chips:[["Quels documents ?","Quels documents dois-je préparer pour mon visa ?"],["Visa refusé","Mon visa a été refusé, que faire ?"],["Billet et hôtel","Comment justifier mon billet d'avion et ma réservation d'hôtel ?"]]},
    en:{hi:"Hello! I'm the Visa Checker assistant. Ask me about your visa file. I don't replace the consulate and I can't promise a visa.",ph:"Ask your question…",send:"Send",on:"Online",dest:"Chosen destination: {c}.",err:"Error, please try again.",net:"Connection failed, please try again.",chips:[["Which documents?","Which documents should I prepare for my visa?"],["Visa refused","My visa was refused, what should I do?"],["Ticket and hotel","How do I justify my flight ticket and hotel booking?"]]},
    ar:{hi:"مرحباً! أنا مساعد Visa Checker. اسألني عن ملف التأشيرة. لا أحل محل القنصلية ولا أستطيع ضمان التأشيرة.",ph:"اكتب سؤالك…",send:"إرسال",on:"متصل",dest:"الوجهة المختارة: {c}.",err:"خطأ، حاول مرة أخرى.",net:"تعذر الاتصال، حاول مرة أخرى.",chips:[["ما هي الوثائق؟","ما هي الوثائق التي يجب أن أحضّرها لتأشيرتي؟"],["تأشيرة مرفوضة","تم رفض تأشيرتي، ماذا أفعل؟"],["التذكرة والفندق","كيف أثبت تذكرة الطائرة وحجز الفندق؟"]]}
  };
  function L(){var l=(document.documentElement.lang||"fr").slice(0,2);return T[l]||T.fr;}
  var $=function(i){return document.getElementById(i)};
  var box=$("vc-box"),msgs=$("vc-msgs"),inp=$("vc-in"),sendBtn=$("vc-send"),chips=$("vc-chips"),hello=$("vc-hello"),
      hist=[],busy=false,last=0,greet=null,timer=null,hi=0,
      still=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  $("vc-btn").innerHTML=FACE;document.querySelector(".vc-av").innerHTML=FACE;
  function add(t,c){var d=document.createElement("div");d.className="vc-m "+c;d.textContent=t;msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;return d;}
  function labels(){
    var l=L();inp.placeholder=l.ph;sendBtn.textContent=l.send;$("vc-on").textContent=l.on;
    if(greet&&!hist.length){var c=window.__vcCtx&&window.__vcCtx();greet.textContent=l.hi+(c?"\n"+l.dest.replace("{c}",c.name):"");}
    chips.innerHTML="";
    if(!hist.length)l.chips.forEach(function(c){var b=document.createElement("button");b.type="button";b.className="vc-chip";b.textContent=c[0];b.onclick=function(){send(c[1])};chips.appendChild(b);});
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
  function send(text){
    var t=(typeof text==="string"?text:inp.value).trim();
    if(!t||busy||Date.now()-last<2000)return;
    last=Date.now();busy=true;inp.value="";
    stopHello();chips.innerHTML="";
    add(t,"vc-u");hist.push({role:"user",text:t});
    var w=add("…","vc-a"),l=L();
    fetch(CHAT_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify((function(){var c=window.__vcCtx&&window.__vcCtx();return{messages:hist,country:c?c.id:"",countryName:c?c.fr:"",ready:c?c.ready:false}})())})
      .then(function(r){return r.json();})
      .then(function(j){w.textContent=j.reply||l.err;hist.push({role:"assistant",text:w.textContent});})
      .catch(function(){w.textContent=l.net;hist.pop();})
      .then(function(){busy=false;});
  }
  sendBtn.onclick=function(){send()};
  inp.addEventListener("keydown",function(e){if(e.key==="Enter")send();});
})();
