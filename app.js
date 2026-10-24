/* app.js : logique de Visa Checker (état S, rendu render(), événements, stockage local, module d'analyse IA).
   Dépend de data.js (chargé avant) : les données sont importées ci-dessous depuis window.VC.data. */
(function(){
var D=window.VC&&window.VC.data;
if(!D){document.body.insertAdjacentHTML("afterbegin",'<p style="padding:16px;font:16px sans-serif">data.js introuvable : rechargez la page (Ctrl+F5). / data.js not found: reload the page.</p>');return}
var SUPPORT=D.SUPPORT,
    KEY=D.KEY,
    UI=D.UI,
    PAY_URL2=D.PAY_URL2,
    SITE=D.SITE,
    PACK=D.PACK,
    GOVS=D.GOVS,
    TOWNS=D.TOWNS,
    PROF=D.PROF,
    ITEMS=D.ITEMS,
    FORMN=D.FORMN,
    MAIN=D.MAIN,
    PX=D.PX,
    COUNTRIES=D.COUNTRIES,
    FLAGS=D.FLAGS,
    PHOTO=D.PHOTO,
    PARTNERS=D.PARTNERS,
    INTL=D.INTL,
    RT=D.RT,
    STP=D.STP,
    WORLD=D.WORLD,
    SVCFR=D.SVCFR,
    CHFR=D.CHFR,
    NS=D.NS,
    REQUEST_URL=D.REQUEST_URL,
    ICONS=D.ICONS,
    SPT=D.SPT,
    PAY_URL=D.PAY_URL,
    FX=D.FX,
    EV=D.EV,
    EVT=D.EVT,
    EVICON=D.EVICON,
    EVARROW=D.EVARROW,
    HOMEL=D.HOMEL,
    RITEMS=D.RITEMS,
    ORDER=D.ORDER,
    SKIPL=D.SKIPL,
    LGL=D.LGL,
    MOTIFS=D.MOTIFS,
    AI_URL=D.AI_URL,
    VERIFY_URL=D.VERIFY_URL;

/* Stockage local sécurisé : toute lecture/écriture est protégée par try/catch (navigation privée, stockage bloqué ou plein).
   Si le stockage est inutilisable, l'état reste en mémoire pour la session au lieu de planter. */
var Store=(function(){
  var mem={},ok=false;
  try{var t="__vc_test__";window.localStorage.setItem(t,"1");window.localStorage.removeItem(t);ok=true}catch(e){ok=false}
  return {
    get:function(key){try{if(ok){var v=window.localStorage.getItem(key);if(v!==null)return v}}catch(e){}return Object.prototype.hasOwnProperty.call(mem,key)?mem[key]:null},
    set:function(key,val){mem[key]=String(val);try{if(ok)window.localStorage.setItem(key,String(val))}catch(e){}},
    remove:function(key){delete mem[key];try{if(ok)window.localStorage.removeItem(key)}catch(e){}},
    clearSession:function(){try{window.sessionStorage.clear()}catch(e){}}
  };
})();
var S={lang:"fr",step:0,mode:"check",motive:"other",country:"fr",gov:"",paid:false,pack:false,purpose:"tourism",status:"employee",party:"alone",stay:"hotel",pay:"self",done:{}};
try{var raw=Store.get(KEY);if(raw){var o=JSON.parse(raw);for(var k in o){S[k]=o[k]}}}catch(e){}
if(!UI[S.lang])S.lang="fr";
var WIPED=false;
function save(){if(WIPED)return;try{Store.set(KEY,JSON.stringify(S))}catch(e){}}
var $=function(id){return document.getElementById(id)};
function chips(q,label){
  var t=UI[S.lang],h='<div class="q"><div class="q-label">'+label+'</div><div class="chips" role="group" aria-label="'+label+'">';
  Object.keys(t[q]).forEach(function(v){h+='<button type="button" class="chip" data-q="'+q+'" data-v="'+v+'" aria-pressed="'+(S[q]===v)+'">'+t[q][v]+'</button>'});
  return h+'</div></div>';
}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function renderRefus(t){
  var L=S.lang,h='<h2>'+t.rfTitle+'</h2><p class="rf-sub">'+t.rfSub+'</p>';
  h+='<div class="book"><p>'+t.rfWarn+'</p></div>';
  if(!S.pack){
    h+='<ul class="inc">'+t.rfInc.map(function(x){return '<li>'+x+'</li>'}).join("")+'</ul>';
    h+='<div><div class="price">'+t.rfPrice+'</div><p class="rf-sub">'+t.rfPriceSub+'</p></div>';
    h+=PAY_URL2?'<a class="pay" href="'+PAY_URL2+'" target="_blank" rel="noopener">'+t.rfPay+'</a>':'<span class="pay off" aria-disabled="true">'+t.payWait+'</span>';
    h+='<div class="q"><label class="q-label" for="code2">'+t.codeLabel+'</label><div class="code-row"><input class="sel" id="code2" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" enterkeyhint="go" aria-describedby="err2"><button type="button" class="reset" id="unlock2">'+t.unlock+'</button></div><span class="ag-err" id="err2" role="alert"></span></div>'+supportHtml(t,"pack")+'';
  }else{
    h+='<div class="act"><button type="button" class="pay wide" data-print="1">'+t.pdfBtn+'</button><p class="rf-sub">'+t.pdfHint+'</p>'+(SITE.email?'<a class="reset" href="mailto:'+SITE.email+'?subject='+encodeURIComponent("Visa Checker - Pack recours")+'">'+t.pdfMail+'</a>':'')+'</div>';
    h+='<div id="aiBox" class="ai"></div>';
    h+='<h2>'+t.rfAdvTitle+'</h2><ol class="adv">'+t.adv.map(function(x){return '<li>'+x+'</li>'}).join("")+'</ol>';
    h+='<h2>'+t.rfLetTitle+'</h2><p class="rf-sub">'+t.rfNote+'</p>';
    PACK.forEach(function(p){
      h+='<details class="lt"><summary>'+p.t[L]+'</summary><div class="lt-body"><pre class="letter" id="pk-'+p.id+'">'+esc(p.body)+'</pre><button type="button" class="cp" data-copy="'+p.id+'">'+t.copy+'</button></div></details>';
    });
  }
  h+='<p class="ag-note">'+t.rfNoGuar+'</p>';
  $("refus").innerHTML=h;
  if(S.pack)renderAI();
}
function copyLetter(btn){
  var t=UI[S.lang],pre=$("pk-"+btn.dataset.copy);
  function pick(){var r=document.createRange();r.selectNodeContents(pre);var s=window.getSelection();s.removeAllRanges();s.addRange(r);btn.textContent=t.selected}
  function ok(){btn.textContent=t.copied;setTimeout(function(){btn.textContent=t.copy},1800)}
  try{navigator.clipboard.writeText(pre.textContent).then(ok,pick)}catch(e){pick()}
}
GOVS.forEach(function(g){var x=TOWNS[g.id];g.h=x?{fr:x[0],en:x[0],ar:x[1]}:null});
var ITEM0={};
function applyCountry(t){
  var cur=curC(),P=PROF[cur.id],L=S.lang,i;
  ["fv","appt","fee"].forEach(function(id){for(i=0;i<ITEMS.length;i++){if(ITEMS[i].id===id){if(!ITEM0[id])ITEM0[id]={fr:ITEMS[i].fr,en:ITEMS[i].en,ar:ITEMS[i].ar}}}});
  var by={};ITEMS.forEach(function(it){by[it.id]=it});
  if(cur.id==="fr"||!P){["fv","appt","fee"].forEach(function(id){if(ITEM0[id]&&by[id]){by[id].fr=ITEM0[id].fr;by[id].en=ITEM0[id].en;by[id].ar=ITEM0[id].ar}});return t}
  var n=cur.n,fn=FORMN[P.form]||FORMN.d,prov=P.prov;
  by.fv.fr=["Formulaire de demande de visa Schengen ("+n.fr+"), rempli, imprimé et signé",fn.fr+MAIN.fr];
  by.fv.en=["Schengen visa application form ("+n.en+"), completed, printed and signed",fn.en+MAIN.en];
  by.fv.ar=["استمارة طلب تأشيرة شنغن ("+n.ar+")، مملوءة ومطبوعة وموقّعة",fn.ar+MAIN.ar];
  by.appt.fr=[prov?"Rendez-vous au centre de dépôt ("+prov+") et confirmation imprimée":"Rendez-vous ou dépôt selon la procédure de l'ambassade, et confirmation imprimée","Réservez vous-même sur le site officiel, un rendez-vous par personne. Présence en personne et empreintes digitales. Demande jusqu'à 6 mois avant le départ et au moins 15 jours avant."];
  by.appt.en=[prov?"Appointment at the application centre ("+prov+") and printed confirmation":"Appointment or submission following the embassy's procedure, and printed confirmation","Book it yourself on the official website, one appointment per person. You must attend in person and give fingerprints. Apply up to 6 months before departure and at least 15 days before."];
  by.appt.ar=[prov?"موعد في مركز الإيداع ("+prov+") وتأكيد مطبوع":"موعد أو إيداع حسب إجراءات السفارة وتأكيد مطبوع","احجز بنفسك على الموقع الرسمي، موعد لكل شخص. الحضور شخصيًا وبصمات الأصابع مطلوبان. قدّم الطلب قبل السفر بـ6 أشهر كحد أقصى وبـ15 يومًا على الأقل."];
  by.fee.fr=["Frais de visa et frais de service du centre de dépôt","Les montants et le mode de paiement sont indiqués sur le site officiel. Ils changent : confirmez-les avant votre rendez-vous."];
  by.fee.en=["Visa fee and application centre service fee","Amounts and payment method are shown on the official website. They change: confirm them before your appointment."];
  by.fee.ar=["رسوم التأشيرة ورسوم خدمة مركز الإيداع","المبالغ وطريقة الدفع مذكورة على الموقع الرسمي. وهي تتغير: تأكد منها قبل موعدك."];
  var o=Object.assign({},t);
  o.msg0=PX.msg0[L];o.linkFV=PX.link[L]+" · "+n[L];
  o.disc=t.disc.replace("France-Visas et auprès de TLScontact","le site officiel de "+n.fr+" et du centre de dépôt").replace("France-Visas and with TLScontact","the official website of "+n.en+" and the application centre").replace("France-Visas ولدى TLScontact","الموقع الرسمي لدولة "+n.ar+" ومركز الإيداع");
  return o;
}
function nm(o){return o.n[S.lang]}
function curC(){return COUNTRIES.filter(function(c){return c.id===S.country})[0]||COUNTRIES[0]}
function eff(){if(S.purpose==="reunion")S.purpose="tourism";return S.motive==="medical"?"medical":S.purpose}
function flag(cc){var u=FLAGS[cc];return u?'<img class="fimg" src="'+u+'" alt="" width="28" height="21">':cc.replace(/./g,function(ch){return String.fromCodePoint(127397+ch.toUpperCase().charCodeAt(0))})}
var open=false,adaptOpen=false;
function adaptHtml(t){return '<details class="adapt"'+(adaptOpen?' open':'')+'><summary>'+t.adapt+'</summary><div class="adapt-body">'+destHtml(t)+panelHtml(t)+'</div></details>'}
function destHtml(t){
  return '<div class="field"><span class="q-label">'+t.s_motive+'</span><div class="mgrid" role="group" aria-label="'+t.s_motive+'">'+["medical","other"].map(function(v){return '<button type="button" class="mcard" data-v="'+v+'" aria-pressed="'+(S.motive===v)+'"><b>'+t.motive[v]+'</b><span>'+t.motiveHint[v]+'</span></button>'}).join("")+'</div></div>';
}
function modeHtml(t){
  var fr=curC().id==="fr";
  return '<div class="mode" role="group" aria-label="'+t.modeTitle+'">'+["check","appeal"].map(function(m){if(m==="appeal"&&!fr){var a=PX.appealOther[S.lang];return '<button type="button" class="mdcard" disabled><b>'+a[0]+'</b><span>'+a[1]+'</span></button>'}return '<button type="button" class="mdcard" data-m="'+m+'"><b>'+t.mode[m][0]+'</b><span>'+t.mode[m][1]+'</span></button>'}).join("")+'</div>';
}
function photoHtml(){
  var tx={fr:["Un couple de voyageurs souriants courant avec leurs valises","Partez l'esprit tranquille.","Un dossier complet, c'est un voyage qui commence bien."],en:["A smiling couple of travellers running with their suitcases","Travel with peace of mind.","A complete file is a trip that starts well."],ar:["زوجان مسافران مبتسمان يركضان بحقيبتي سفرهما","سافر مطمئن البال.","ملف مكتمل يعني رحلة تبدأ بشكل جيد."]}[S.lang];
  return '<img src="'+PHOTO+'" alt="'+tx[0]+'" width="600" height="400"><figcaption><b>'+tx[1]+'</b><span>'+tx[2]+'</span></figcaption>';
}
function homeHtml(t){
  var cur=curC(),L=S.lang;
  var h='<div class="panel hcard"><div class="ask"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg><span>'+t.ask+'</span></div>';
  h+='<div class="field"><span class="q-label">'+t.s_pass+'</span><div class="fval lock"><span class="flag">'+flag("tn")+'</span><span class="fname">'+t.passName+'</span></div></div>';
  h+='<div class="field"><span class="q-label" id="destlbl">'+t.s_dest+'</span><button type="button" class="fbtn" id="destbtn" aria-expanded="'+open+'" aria-labelledby="destlbl destbtn"><span class="flag">'+flag(cur.id)+'</span><span class="fname">'+nm(cur)+'</span><svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>';
  if(open){
    var cmp=function(a,b){return nm(a).localeCompare(nm(b),L)};
    var all=COUNTRIES.filter(function(c){return c.ready}).sort(cmp).concat(COUNTRIES.filter(function(c){return !c.ready}).sort(cmp));
    h+='<ul class="clist">'+all.map(function(c){return '<li><button type="button" class="crow" data-c="'+c.id+'"'+(c.id===S.country?' aria-current="true"':'')+'><span class="flag">'+flag(c.id)+'</span><span class="cn">'+nm(c)+'</span>'+(c.ready?'':'<span class="ctag">'+t.cSoon+'</span>')+'</button></li>'}).join("")+'</ul>';
  }
  h+='</div>';
  if(!cur.ready){h+='<div class="book"><span class="slot">'+t.cSoon+'</span><b>'+nm(cur)+'</b><p>'+t.soonText+'</p></div>'}
  h+=evCardHtml();
  h+='</div>';
  h+='<div class="side"><figure class="photo">'+photoHtml()+'</figure>'+needsHtml(t)+'</div>';
  h+='<section class="why"><h2>'+t.whyTitle+'</h2><ul class="ticks">'+t.why.map(function(x){return '<li><svg class="chk" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="currentColor"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" style="stroke:var(--surface)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg><span>'+x+'</span></li>'}).join("")+'</ul><p class="ag-note">'+t.whyNote+'</p></section>';
  return h;
}
function tileHtml(x){
  var ic;
  if(x.img)ic='<span class="tile-ic"><img src="'+x.img+'" alt=""></span>';
  else ic='<span class="tile-ic" style="--tb:'+x.bg+';--tf:'+x.fg+'"><img class="fav" src="https://www.google.com/s2/favicons?domain='+x.dom+'&sz=128" alt="" loading="lazy" onerror="this.parentNode.classList.add(\'fb\');this.remove()"><span class="fbt" aria-hidden="true">'+x.txt+'</span></span>';
  return '<a class="tile" href="'+x.u+'" target="_blank" rel="noopener noreferrer" aria-label="'+x.n+'">'+ic+'<span class="tile-n">'+x.n+'</span><span class="tile-k">'+x.k[S.lang]+'</span></a>';
}
function tilesHtml(list){return '<div class="tiles">'+list.map(tileHtml).join("")+'</div>'}
var RQ={chan:"email",ln:"",fn:"",d1:"",d2:"",city:"",phone:"",tg:"",mail:"",consent:false,done:false,mode:"",failed:false};
function escA(s){return esc(s).replace(/"/g,"&quot;")}
function today(){return new Date().toISOString().slice(0,10)}
function fmtD(v){var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(v||"");return m?m[3]+"/"+m[2]+"/"+m[1]:v}
function findAgent(id){var k,i,l;for(k in PARTNERS){l=PARTNERS[k];for(i=0;i<l.length;i++){if(l[i].id===id)return l[i]}}for(i=0;i<INTL.length;i++){if(INTL[i].id===id)return INTL[i]}return null}
function rq(st){var R=RT[S.lang];return st===8?R.t8:st===9?R.t9:(RQ.mode==="sent"?R.t10a:R.t10b)}
function rqs(st){var R=RT[S.lang];return st===8?R.s8:st===9?R.s9:(RQ.mode==="sent"?R.s10a:R.s10b)}
function stepper(n){return '<ol class="stp" aria-label="'+STP[S.lang].join(", ")+'">'+STP[S.lang].map(function(x,i){return '<li class="'+(i+1<n?'dn':i+1===n?'on':'')+'"'+(i+1===n?' aria-current="step"':'')+'><i>'+(i+1<n?'✓':i+1)+'</i><span>'+x+'</span></li>'}).join("")+'</ol>'}
function initials(n){return n.split(/\s+/).slice(0,2).map(function(w){return w.charAt(0)}).join("").toUpperCase()}
function avHtml(p){return '<span class="av" aria-hidden="true">'+(p.logo?'<img src="'+p.logo+'" alt="">':initials(p.name))+'</span>'}
function agentCard(p,R){return '<div class="ag-card">'+avHtml(p)+'<div class="ag-body"><b>'+esc(p.name)+'</b><span class="ag-meta">'+(p.city?esc(p.city)+' · ':'')+p.what[S.lang]+'</span>'+(p.test?'<span class="tag">'+R.test+'</span>':'')+'</div><button type="button" class="pay wide" data-agent="'+p.id+'">'+R.choose+'</button></div>'}
function pickHtml(t){
  var R=RT[S.lang],L=S.lang,pt=S.pt==="intl"?"intl":"local",gv=S.pgov||S.gov||"";
  var svc=function(p){return p.svc.indexOf(S.need)>-1};
  var h=stepper(2)+'<div class="panel"><span class="svc-pill">'+R.svc[S.need]+'</span><div class="chips seg" role="group" aria-label="'+R.svc[S.need]+'">'+[["local",R.tabL],["intl",R.tabI]].map(function(x){return '<button type="button" class="chip" data-pt="'+x[0]+'" aria-pressed="'+(pt===x[0])+'">'+x[1]+'</button>'}).join("")+'</div>';
  if(pt==="intl"){h+=INTL.filter(svc).map(function(p){return agentCard(p,R)}).join("")}
  else{
    var gl=GOVS.slice().sort(function(a,b){return a.n[L].localeCompare(b.n[L],L)});
    h+='<div class="q"><label class="q-label" for="pgov">'+t.gov+'</label><select class="sel" id="pgov"><option value="">'+t.govPick+'</option>'+gl.map(function(g){return '<option value="'+g.id+'"'+(gv===g.id?' selected':'')+'>'+g.n[L]+'</option>'}).join("")+'</select></div>';
    if(gv){var list=(PARTNERS[gv]||[]).filter(svc);h+=list.length?list.map(function(p){return agentCard(p,R)}).join(""):'<p class="ag-none">'+R.noLocal+'</p>'}
  }
  h+='</div>';
  var links=WORLD.filter(function(x){return x.svc.indexOf(S.need)>-1});
  h+='<div class="needs"><h2>'+R.selfT+'</h2><p class="ag-sub">'+R.selfN+'</p>'+tilesHtml(links)+'</div>';
  return h;
}
function fld(id,label,type,extra){var req=/^(ln|fn|d1|d2|phone)$/.test(id);return '<div class="field"><label class="q-label" for="rq-'+id+'">'+label+'</label><input class="sel" id="rq-'+id+'" data-f="'+id+'" type="'+type+'" value="'+escA(RQ[id])+'" aria-describedby="fe-'+id+'"'+(req?' aria-required="true"':'')+' '+(extra||'')+'><span class="fe" id="fe-'+id+'" role="alert"></span></div>'}
function formHtml(t){
  var R=RT[S.lang],a=findAgent(S.agent),hot=S.need==="hotel",td=today(),up='autocapitalize="characters" autocomplete="off" style="text-transform:uppercase"';
  return stepper(3)+'<div class="panel"><div class="ag-card sel-ag"><span class="av" aria-hidden="true">'+initials(a.name)+'</span><div class="ag-body"><b>'+esc(a.name)+'</b><span class="ag-meta">'+R.svc[S.need]+'</span></div></div>'
   +'<form class="req-form" id="rqform" novalidate>'
   +'<div class="f-row">'+fld("ln",R.ln,"text",up)+fld("fn",R.fn,"text",up)+'</div>'
   +'<div class="f-row">'+fld("d1",hot?R.d1h:R.d1f,"date",'min="'+td+'"')+fld("d2",hot?R.d2h:R.d2f,"date",'min="'+(RQ.d1||td)+'"')+'</div>'
   +fld("city",R.city,"text",'autocomplete="off"')
   +fld("phone",R.phone,"tel",'inputmode="tel" dir="ltr" autocomplete="tel" placeholder="+216 "')
   +fld("tg",R.tg,"text",'dir="ltr" placeholder="@" autocapitalize="off" autocomplete="off"')
   +fld("mail",R.mail,"email",'dir="ltr" autocomplete="email" autocapitalize="off"')
   +'<div class="q"><span class="q-label">'+R.chan+'</span><div class="chips chgrid" role="group" aria-label="'+R.chan+'">'+["email","whatsapp","telegram","sms"].map(function(c){return '<button type="button" class="chip" data-chan="'+c+'" aria-pressed="'+(RQ.chan===c)+'">'+R.ch[c]+'</button>'}).join("")+'</div></div>'
   +'<div class="field"><label class="item"><input type="checkbox" data-f="consent" id="rq-consent" aria-required="true" aria-describedby="fe-consent"'+(RQ.consent?' checked':'')+'><span class="i-body"><span class="i-title">'+R.consent+'</span></span></label><span class="fe" id="fe-consent" role="alert"></span></div>'
   +'<p class="ag-note">'+R.payNote+'</p><span class="fe" id="fe-form" role="alert"></span>'
   +'<button type="submit" class="pay wide" id="rqsend">'+R.send+'</button></form></div>';
}
/* Numéro de téléphone -> format E.164 ("+" puis 8 à 15 chiffres, le premier non nul), ou "" si invalide.
   Tunisie : 8 chiffres (premier chiffre 2 à 9), avec ou sans 216 / +216 / 00216.
   Étranger : le numéro doit commencer par + ou 00 (sans indicatif, impossible de deviner le pays).
   Accepte espaces, points, tirets, parenthèses, "(0)", chiffres arabo-indiens et marques bidi (saisie en arabe). */
function normPhone(v){
  var d=String(v==null?"":v);
  d=d.replace(/[\u0660-\u0669]/g,function(c){return c.charCodeAt(0)-0x0660})
     .replace(/[\u06F0-\u06F9]/g,function(c){return c.charCodeAt(0)-0x06F0})
     .replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069\u00a0]/g,"")
     .replace(/\(0\)/g,"")
     .replace(/[\s().\-\/]/g,"");
  if(/^00/.test(d))d="+"+d.slice(2);
  else if(/^[0-9]/.test(d)){
    if(/^216[2-9][0-9]{7}$/.test(d))d="+"+d;
    else if(/^[2-9][0-9]{7}$/.test(d))d="+216"+d;
    else return "";
  }
  if(!/^\+[1-9][0-9]{7,14}$/.test(d))return "";
  if(/^\+216/.test(d)&&!/^\+216[2-9][0-9]{7}$/.test(d))return "";
  return d;
}
function normTg(v){return String(v||"").trim().replace(/^https?:\/\/t\.me\//i,"").replace(/^@/,"")}
function reqText(){
  var a=findAgent(S.agent),hot=S.need==="hotel",F=RQ;
  var l=["Demande Visa Checker : "+SVCFR[S.need],"Agence : "+a.name,"Pays de destination : "+curC().n.fr,"Nom : "+F.ln,"Prénom(s) : "+F.fn,(hot?"Check-in : ":"Date d'aller : ")+fmtD(F.d1),(hot?"Check-out : ":"Date de retour : ")+fmtD(F.d2)];
  if(F.city)l.push("Ville : "+F.city);
  l.push("Téléphone / WhatsApp : "+F.phone);if(F.tg)l.push("Telegram : @"+F.tg);if(F.mail)l.push("E-mail : "+F.mail);
  l.push("Canal pour le paiement et le document : "+CHFR[F.chan]);
  return l.join("\n");
}
function contactFor(){return RQ.chan==="telegram"?"@"+RQ.tg:RQ.chan==="email"?RQ.mail:RQ.phone}
function doneHtml(t){
  var R=RT[S.lang],a=findAgent(S.agent),txt=reqText(),hot=S.need==="hotel",F=RQ,L=S.lang;
  var sh=function(x){return x.replace(/\s*\(.*?\)/g,'')},CHL={fr:'Canal',en:'Channel',ar:'القناة'};
  var rows=[[R.svc[S.need],a.name],[sh(R.ln),F.ln],[sh(R.fn),F.fn],[sh(hot?R.d1h:R.d1f),fmtD(F.d1)],[sh(hot?R.d2h:R.d2f),fmtD(F.d2)],[R.phone,F.phone]];
  if(F.tg)rows.push([sh(R.tg),"@"+F.tg]);if(F.mail)rows.push([sh(R.mail),F.mail]);rows.push([CHL[L],R.ch[F.chan]]);
  var h=stepper(4);
  if(F.mode==="sent"){
    h+='<div class="ok-hero"><span class="ok-ic" aria-hidden="true">✓</span><b>'+esc(R.okT(a.name))+'</b><p>'+esc(R.okTxt(R.ch[F.chan],contactFor()))+'</p></div>'
     +'<ol class="nxt">'+NS[L].map(function(x,i){return '<li class="'+(i===0?'dn':'')+'"><i>'+(i===0?'✓':i+1)+'</i><span>'+x+'</span></li>'}).join("")+'</ol>';
  }else{
    var enc=encodeURIComponent(txt),b='';
    if(a.email)b+='<a class="pay wide" href="mailto:'+a.email+'?subject='+encodeURIComponent("Visa Checker : "+SVCFR[S.need])+'&body='+enc+'">'+R.bMail+'</a>';
    if(a.whatsapp)b+='<a class="pay wide alt" href="https://wa.me/'+a.whatsapp+'?text='+enc+'" target="_blank" rel="noopener noreferrer">'+R.bWA+'</a>';
    if(a.telegram)b+='<a class="pay wide alt" data-tgcopy="1" href="https://t.me/'+a.telegram+'" target="_blank" rel="noopener noreferrer">'+R.bTg+'</a><p class="rf-sub">'+R.tgHint+'</p>';
    h+='<div class="book"><b>'+R.manT+'</b><p>'+(F.failed?R.failTxt:R.manTxt)+'</p></div><div class="act">'+b+'</div>';
  }
  h+='<div class="recap"><h2>'+R.recap+'</h2><dl>'+rows.map(function(r){return '<div><dt>'+esc(r[0])+'</dt><dd>'+esc(r[1])+'</dd></div>'}).join("")+'</dl></div>';
  return h;
}
function submitReq(){
  var R=RT[S.lang],E=R.e,er={},a=findAgent(S.agent),hot=S.need==="hotel",td=today(),F=RQ;
  var ln=F.ln.trim(),fn=F.fn.trim(),tg=normTg(F.tg),mail=F.mail.trim(),phone=normPhone(F.phone),latin=/^[A-Za-z][A-Za-z' \-]*$/;
  if(!ln)er.ln=E.req;else if(!latin.test(ln))er.ln=E.name;
  if(!fn)er.fn=E.req;else if(!latin.test(fn))er.fn=E.name;
  if(!F.d1)er.d1=E.req;else if(F.d1<td)er.d1=E.past;
  if(!F.d2)er.d2=E.req;else if(F.d1&&(hot?F.d2<=F.d1:F.d2<F.d1))er.d2=hot?E.dHotel:E.dFlight;
  if(!phone)er.phone=F.phone.trim()?E.phone:E.req;
  if(F.tg.trim()&&!/^[A-Za-z0-9_]{5,32}$/.test(tg))er.tg=E.tg;
  if(mail&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail))er.mail=E.mail;
  if(F.chan==="telegram"&&!tg&&!er.tg)er.tg=E.needTg;
  if(F.chan==="email"&&!mail&&!er.mail)er.mail=E.needMail;
  if(!F.consent)er.consent=E.consent;
  ["ln","fn","d1","d2","phone","tg","mail","consent"].forEach(function(k){var s=$("fe-"+k),i=$("rq-"+k);if(s)s.textContent=er[k]||"";if(i)i.setAttribute("aria-invalid",er[k]?"true":"false")});
  var bad=Object.keys(er);
  if(bad.length){var f=$("rq-"+bad[0]);if(f)f.focus();return}
  F.ln=ln.toUpperCase();F.fn=fn.toUpperCase();F.phone=phone;F.tg=tg;F.mail=mail;
  var payload={service:S.need,destination:curC().n.fr,lastName:F.ln,firstName:F.fn,date1:F.d1,date2:F.d2,city:F.city.trim(),phone:phone,telegram:tg,email:mail,channel:F.chan,lang:S.lang,sentAt:new Date().toISOString(),
    agency:{id:a.id,name:a.name,email:a.email||"",telegram:a.telegram||"",whatsapp:a.whatsapp||""},message:reqText()};
  var btn=$("rqsend");btn.disabled=true;btn.textContent=R.sending;
  function fin(mode,failed){F.done=true;F.mode=mode;F.failed=!!failed;S.step=10;save();render();window.scrollTo(0,0)}
  if(!REQUEST_URL){fin("manual");return}
  var fd=new URLSearchParams(),k;
  for(k in payload){if(k!=="agency")fd.append(k,payload[k])}
  fd.append("agencyName",a.name);fd.append("agencyEmail",a.email||"");fd.append("agencyTelegram",a.telegram||"");fd.append("agencyWhatsapp",a.whatsapp||"");
  /* formulaire simple (pas de pré-vérification CORS) : le Worker renvoie les en-têtes CORS, on lit la réponse et on ne confirme l'envoi que si elle est OK */
  fetch(REQUEST_URL,{method:"POST",body:fd}).then(function(r){if(r.ok)fin("sent",false);else fin("manual",true)},function(){fin("manual",true)});
}
function needsHtml(t){return '<div class="needs"><h2 class="hot">'+t.needTitle+'</h2><p class="ag-sub">'+t.needSub+'</p><div class="sp-chips"><button type="button" class="sp-chip" data-need="flight">'+ICONS.plane+t.needFlight+'</button><button type="button" class="sp-chip" data-need="hotel">'+ICONS.bed+t.needHotel+'</button></div>'+'</div>'}
function renderSponsors(t){
  var h=(S.step>0&&S.step!==7?needsHtml(t):'')+'<h2 id="sp-h" class="c">'+t.spTitle+'</h2>'+tilesHtml(WORLD);
  h+='<p class="sp-join c">'+SPT.note[S.lang]+'</p>';
  $("sponsors").innerHTML=h;
}
function panelHtml(t){
  var e=eff();
  if(e==="reunion"){return chips("purpose",t.s_purpose)+chips("party",t.s_party)+'<div class="book"><b>'+t.reunTitle+'</b><p>'+t.reunText+'</p></div>'}
  if(e==="medical"){return '<div class="book"><b>'+t.gMed+'</b><p>'+t.medNote+'</p></div>'+chips("status",t.s_status)+chips("party",t.s_party)+chips("stay",t.s_stay)+chips("pay",t.s_pay)}
  return chips("purpose",t.s_purpose)+chips("status",t.s_status)+chips("party",t.s_party)+chips("stay",t.s_stay)+chips("pay",t.s_pay);
}
function allAdvisors(){var a=[];for(var k in PARTNERS){PARTNERS[k].forEach(function(p){a.push(p)})}return a}
function advMsg(){var t=UI[S.lang];return "Visa Checker : "+t.advSubject+"\n"+t.advDest+" : "+nm(curC())+"\n"+t.advCase+" : "+(S.refus||"-")}
function renderAgency(t){
  var L=S.lang,list=allAdvisors();
  var h='<h2>'+t.agTitle+'</h2><p class="ag-sub">'+t.agSub+'</p>';
  h+='<div class="q"><label class="q-label" for="refcase">'+t.caseLabel+'</label><textarea class="sel" id="refcase" rows="3" maxlength="300" placeholder="'+esc(t.casePh)+'" aria-describedby="refhint">'+esc(S.refus||"")+'</textarea><span class="i-note" id="refhint">'+t.caseHint+'</span></div>';
  if(!list.length){h+='<p class="ag-none">'+t.agNone+'</p>'}
  else if(S.paid){
    list.forEach(function(p){
      var m=encodeURIComponent(advMsg());
      h+='<div class="partner"><b>'+p.name+'</b><span class="i-note">'+(p.adv||p.what)[L]+'</span>';
      if(p.contact)h+='<span class="i-note">'+p.contact+'</span>';
      if(p.email)h+='<a class="pay wide" href="mailto:'+p.email+'?subject='+encodeURIComponent("Visa Checker")+'&body='+m+'">'+t.advMail+'</a>';
      if(p.whatsapp)h+='<a class="pay wide" href="https://wa.me/'+String(p.whatsapp).replace(/\D/g,"")+'?text='+m+'" target="_blank" rel="noopener">'+t.advWA+'</a>';
      if(!p.contact&&!p.email&&!p.whatsapp)h+='<span class="i-note">'+t.contactSoon+'</span>';
      h+='</div>';
    });
  }else{
    h+='<div class="locked"><b>'+t.agCount(list.length)+'</b><i></i><i></i></div>';
    h+=PAY_URL?'<a class="pay" href="'+PAY_URL+'" target="_blank" rel="noopener">'+t.payBtn+'</a>':'<span class="pay off" aria-disabled="true">'+t.payWait+'</span>';
    h+='<div class="q"><label class="q-label" for="code">'+t.codeLabel+'</label><div class="code-row"><input class="sel" id="code" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" enterkeyhint="go" aria-describedby="err"><button type="button" class="reset" id="unlock">'+t.unlock+'</button></div><span class="ag-err" id="err" role="alert"></span></div>'+supportHtml(t,"block")+'';
  }
  h+='<p class="ag-note">'+t.agNote+'</p>';
  $("agency").innerHTML=h;
}
for(var fk in FX){if(!FLAGS[fk])FLAGS[fk]=FX[fk]}
/* Arabic alphabetical order ignores the article "ال" and treats hamza forms of alef as alef. */
function evKey(c,L){var n=c.n[L];if(L==="ar"){n=n.replace(/^ال(?=.)/,"").replace(/[\u0623\u0625\u0622]/g,"\u0627")}return n}
function evFind(id){for(var i=0;i<EV.length;i++){if(EV[i].id===id)return EV[i]}return null}
function evEmoji(cc){return cc.replace(/./g,function(ch){return String.fromCodePoint(127397+ch.toUpperCase().charCodeAt(0))})}
function evFlag(cc){return flag(cc)}
function evCardHtml(){var x=EVT[S.lang];return '<button type="button" class="evcard" id="evbtn"><span class="evico">'+EVICON+'</span><span class="evtxt"><b>'+x.cardTitle+'</b><span>'+x.cardSub+'</span></span>'+EVARROW+'</button>'}
function evListHtml(){
  var x=EVT[S.lang],L=S.lang;
  var list=EV.slice().sort(function(a,b){return evKey(a,L).localeCompare(evKey(b,L),L)});
  var h='<div class="evwrap"><div class="book"><p>'+x.listWarn+'</p></div><ul class="evlist">';
  list.forEach(function(c){h+='<li><button type="button" class="evrow" data-ev="'+c.id+'"><span class="flag">'+evFlag(c.id)+'</span><span class="cn">'+c.n[L]+'</span><span class="evtag'+(c.type==="check"?' warn':'')+'">'+x.type[c.type]+'</span>'+EVARROW+'</button></li>'});
  return h+'</ul><p class="ag-note">'+x.notListed+'</p></div>';
}
function evDetailHtml(t){
  var x=EVT[S.lang],L=S.lang,c=evFind(S.evc);
  var h='<div class="evwrap"><div class="panel evdetail"><div class="evhead"><span class="flag">'+evFlag(c.id)+'</span><div class="evhd"><b class="evname">'+c.n[L]+'</b><span class="evtag'+(c.type==="check"?' warn':'')+'">'+x.type[c.type]+'</span></div></div>';
  h+='<p class="evintro">'+c.intro[L]+'</p>';
  if(c.type==="check")h+='<div class="book"><p>'+x.confirmBox+'</p></div>';
  h+='<a class="pay wide" href="'+c.url+'" target="_blank" rel="noopener noreferrer">'+x.portalBtn+'</a>';
  h+='<p class="evaddr">'+x.portalAddr+' <span class="evhost" dir="ltr">'+c.host+'</span></p><p class="rf-sub">'+x.portalWarn+'</p></div>';
  h+='<section class="group"><h2>'+x.notesTitle+'</h2><ul class="adv">'+c.notes[L].map(function(n){return '<li>'+n+'</li>'}).join("")+'</ul></section>';
  h+=needsHtml(t);
  h+='<section class="group"><h2>'+x.prepTitle+'</h2><p class="ag-sub">'+x.prepSub+'</p>';
  x.prep.forEach(function(p){var on=!!S.done[p[0]];h+='<label class="item'+(on?' on':'')+'"><input type="checkbox" data-id="'+p[0]+'"'+(on?' checked':'')+'><span class="i-body"><span class="i-title">'+p[1]+'</span><span class="i-note">'+p[2]+'</span></span></label>'});
  h+='</section><section class="group"><h2>'+x.pitTitle+'</h2><ul class="adv">'+x.pits.map(function(n){return '<li>'+n+'</li>'}).join("")+'</ul></section>';
  return h+'<p class="ag-note">'+x.srcNote+'</p></div>';
}
function evTitle(){var c=evFind(S.evc);return c?c.n[S.lang]+" · e-Visa":""}
function render(){
  var cur=curC(),ready=cur.ready;
  var t=applyCountry(UI[S.lang]);
  if(cur.id!=="fr"&&S.mode==="appeal")S.mode="check";
  if(!ready&&S.step>0&&S.step<6)S.step=0;if(S.step===2||S.step===3)S.step=4;
  if(S.step===7&&!evFind(S.evc))S.step=6;if(S.step>10||S.step<0)S.step=0;if(S.step>=8&&!S.need)S.step=0;if(S.step>=9&&!findAgent(S.agent))S.step=8;if(S.step===10&&!RQ.done)S.step=9;
  var st=S.step,e=eff();
  document.documentElement.lang=S.lang;
  document.documentElement.dir=S.lang==="ar"?"rtl":"ltr";
  $("brand").innerHTML='<span style="color:var(--accent)">Visa</span> Checker';$("stamp").hidden=true;
  if(st===0){$("h1").innerHTML=t.sloganA+'<span class="acc">'+t.sloganB+'</span>'}else{$("h1").textContent=[0,t.modeTitle,t.destTitle,t.pTitle,t.dTitle,S.mode==="appeal"?t.apTitle:t.hTitle,EVT[S.lang].listTitle,evTitle(),rq(8),rq(9),rq(10)][st]}
  $("sub").textContent=st===0?t.homeSub2:[0,t.modeSub,t.destSub,t.pSub,t.dSub,S.mode==="appeal"?t.apSub:t.hSub,EVT[S.lang].listSub,EVT[S.lang].detailSub,rqs(8),rqs(9),rqs(10)][st];document.body.dataset.step=st;
  $("disc").textContent=t.disc;renderLegal();$("homeBtn").hidden=st===0;$("homeBtn").setAttribute("aria-label",HOMEL[S.lang]);$("homeBtn").title=HOMEL[S.lang];$("reset").textContent=t.reset;$("wipe").textContent=t.wipe;$("reset").hidden=st!==4;
  ["fr","en","ar"].forEach(function(l){$("l-"+l).setAttribute("aria-pressed",S.lang===l)});
  $("links").innerHTML=(!ready||st<4||st>5||S.mode==="appeal")?"":'<a href="'+(cur.id==="fr"?"https://france-visas.gouv.fr/tunisie":(PROF[cur.id]||{}).site)+'" target="_blank" rel="noopener noreferrer">'+t.linkFV+'</a>';
  var showSt=st>=4&&st<=5&&!(st===5&&S.mode==="appeal");$("stepper").hidden=!showSt;
  if(showSt){$("stepper").innerHTML='<div class="st-row"><span class="st-num">'+t.stepWord(st-3)+' · '+t.stepNames[st-2]+'</span><span class="pill"><span class="flag">'+flag(cur.id)+'</span>'+nm(cur)+(S.motive==="medical"?' · '+t.motive.medical:'')+'</span></div><div class="st-bar" aria-hidden="true">'+[0,1].map(function(i){return '<i'+(i<st-3?' class="on"':'')+'></i>'}).join("")+'</div>'}
  $("home").hidden=st!==0;if(st===0)$("home").innerHTML=homeHtml(t);
  $("mode").hidden=st!==1;if(st===1)$("mode").innerHTML=modeHtml(t);
  $("dest").hidden=st!==2;if(st===2)$("dest").innerHTML=destHtml(t);
  $("panel").hidden=st!==3;if(st===3)$("panel").innerHTML=panelHtml(t);
  $("req").hidden=st<8;if(st===8)$("req").innerHTML=pickHtml(t);if(st===9)$("req").innerHTML=formHtml(t);if(st===10)$("req").innerHTML=doneHtml(t);$("evisa").hidden=st<6||st>7;if(st===6)$("evisa").innerHTML=evListHtml();if(st===7)$("evisa").innerHTML=evDetailHtml(t);
  $("docs").hidden=st!==4;$("help").hidden=st!==5;$("agency").hidden=S.mode==="appeal";$("refus").hidden=S.mode!=="appeal";
  if(st===4){
    var vis=(e==="reunion"?RITEMS:ITEMS).filter(function(i){return i.w(Object.assign({},S,{purpose:e}))});
    var req=vis.filter(function(i){return !i.opt}),doneReq=req.filter(function(i){return S.done[i.id]}).length;
    var pct=req.length?Math.round(doneReq/req.length*100):0,left=req.length-doneReq;
    $("pnum").textContent=doneReq+" "+t.of+" "+req.length+" "+t.ready;
    $("pmsg").textContent=left===0?t.msgDone:(doneReq===0?t.msg0:t.msgN(left));
    CTAS.done=doneReq;CTAS.left=left;$("barfill").style.width=pct+"%";$("bar").setAttribute("aria-valuenow",pct);$("bar").setAttribute("aria-valuetext",$("pnum").textContent);$("bar").className="bar"+(left===0?" done":"");
    var h="";
    ORDER.forEach(function(g){
      var gi=vis.filter(function(i){return i.g===g});if(!gi.length)return;
      var gd=gi.filter(function(i){return S.done[i.id]}).length;
      h+='<section class="group"><div class="g-head"><h2>'+((g==="purpose"&&e==="medical")?t.gMed:t.groups[g])+'</h2><span class="g-count">'+gd+'/'+gi.length+'</span></div>';
      gi.forEach(function(i){
        var c=i[S.lang],on=!!S.done[i.id];
        h+='<label class="item'+(on?' on':'')+'"><input type="checkbox" data-id="'+i.id+'"'+(on?' checked':'')+'><span class="i-body">'+(i.opt?'<span class="tag">'+t.opt+'</span>':'')+'<span class="i-title">'+c[0]+'</span>'+(c[1]?'<span class="i-note">'+c[1]+'</span>':'')+'</span></label>';
      });
      if(g==="stay"){h+='<div class="book"><span class="slot">'+t.bookSlot+'</span><b>'+t.bookTitle+'</b><p>'+t.bookText+'</p></div>'}
      h+='</section>';
    });
    $("list").innerHTML=adaptHtml(t)+h;
  }
  if(st===5){if(S.mode==="appeal"){renderRefus(t)}else{renderAgency(t)}}
  renderSponsors(t);$("sponsors").hidden=st>=8;
  $("dock").hidden=!(st===0&&ready);
  if(st===0&&ready)$("dock").innerHTML='<div class="dock-in"><span class="flag">'+flag("tn")+'</span><span class="arrow" aria-hidden="true">\u2192</span><span class="flag">'+flag(cur.id)+'</span><span class="dname">'+nm(cur)+'</span><button type="button" class="pay" data-go="1">'+t.start+'</button></div>';
  $("nav").hidden=st===0;
  if(st>0){$("nav").innerHTML='<button type="button" class="reset" data-go="-1">'+t.back+'</button>'+(st===4?'<button type="button" class="pay" data-go="1">'+t.next+'</button>':'')}
  renderCta();
  syncA11y();
}
/* Gestion du focus : à chaque changement d'étape, le titre <h1> reçoit le focus (lecteur d'écran + clavier),
   la page remonte en haut et le titre de l'onglet suit l'étape. Aucun effet au premier affichage ni lors d'un simple re-rendu (langue, case cochée). */
var lastStep=null;
function focusStepHeading(){
  var h=$("h1");if(!h)return;
  window.scrollTo(0,0);
  try{h.focus({preventScroll:true})}catch(e){h.focus()}
}
function syncA11y(){
  var h=$("h1"),base="Visa Checker";
  document.title=(S.step>0&&h&&h.textContent?h.textContent.trim()+" · ":"")+base;
  var sk=$("skip");if(sk)sk.textContent=SKIPL[S.lang]||SKIPL.fr;
  var changed=lastStep!==null&&lastStep!==S.step;lastStep=S.step;
  if(changed)focusStepHeading();
}
function go(n){if(S.step>=8){S.step=S.step===8?(S.back||0):(S.step===9?8:0);save();render();window.scrollTo(0,0);try{$("h1").focus({preventScroll:true})}catch(x){}return}if(S.step>=6){S.step=S.step===7?6:0;save();render();window.scrollTo(0,0);try{$("h1").focus({preventScroll:true})}catch(x){}return}if(n<0&&S.mode==="appeal"&&S.step===5)n=-4;if(n<0&&S.mode!=="appeal"&&S.step===4)n=-3;S.step=Math.max(0,Math.min(5,S.step+n));save();render();window.scrollTo(0,0);try{$("h1").focus({preventScroll:true})}catch(x){}}
document.addEventListener("click",function(e){
  if(e.target.id==="unlock"){tryUnlock("block");return}
  if(e.target.id==="unlock2"){tryUnlock("pack");return}
  var cb=e.target.closest(".cp");
  if(cb){copyLetter(cb);return}
  var nd=e.target.closest("[data-need]");
  if(nd){S.need=nd.dataset.need;S.back=S.step;S.step=8;RQ.done=false;RQ.d1="";RQ.d2="";save();render();window.scrollTo(0,0);try{$("h1").focus({preventScroll:true})}catch(x){}return}
  var pb=e.target.closest("[data-pt]");
  if(pb){S.pt=pb.dataset.pt;save();render();return}
  var ab=e.target.closest("[data-agent]");
  if(ab){S.agent=ab.dataset.agent;S.step=9;RQ.done=false;save();render();window.scrollTo(0,0);try{$("h1").focus({preventScroll:true})}catch(x){}return}
  var cn=e.target.closest("[data-chan]");
  if(cn){RQ.chan=cn.dataset.chan;document.querySelectorAll("[data-chan]").forEach(function(b){b.setAttribute("aria-pressed",b===cn)});return}
  if(e.target.closest("[data-tgcopy]")){try{navigator.clipboard.writeText(reqText())}catch(x){}return}
  var gb=e.target.closest("[data-go]");
  if(gb){go(parseInt(gb.dataset.go,10));return}
  if(e.target.closest("#start")){go(1);return}
  if(e.target.closest("#evbtn")){S.step=6;save();render();window.scrollTo(0,0);try{$("h1").focus({preventScroll:true})}catch(x){}return}
  var evr=e.target.closest(".evrow");
  if(evr){S.evc=evr.dataset.ev;S.step=7;save();render();window.scrollTo(0,0);try{$("h1").focus({preventScroll:true})}catch(x){}return}
  if(e.target.closest("#destbtn")){open=!open;render();$("destbtn").focus();return}
  var cr=e.target.closest(".crow");
  if(cr){S.country=cr.dataset.c;open=false;save();render();$("destbtn").focus();return}
  var md=e.target.closest(".mdcard");
  if(md){S.mode=md.dataset.m;S.step=S.mode==="appeal"?5:4;save();render();window.scrollTo(0,0);try{$("h1").focus({preventScroll:true})}catch(x){}return}
  var mc=e.target.closest(".mcard");
  if(mc){S.motive=mc.dataset.v;save();render();return}
  var c=e.target.closest(".chip");
  if(c){S[c.dataset.q]=c.dataset.v;if(c.dataset.q==="purpose"&&c.dataset.v==="family")S.stay="hosted";save();render();return}
});
document.addEventListener("toggle",function(e){if(e.target.classList&&e.target.classList.contains("adapt"))adaptOpen=e.target.open},true);
document.addEventListener("change",function(e){
  if(e.target.id==="gov"){S.gov=e.target.value;save();render();$("gov").focus();return}
  if(e.target.id==="pgov"){S.pgov=e.target.value;save();render();$("pgov").focus();return}
  var id=e.target.dataset&&e.target.dataset.id;
  if(id){if(e.target.checked)S.done[id]=1;else delete S.done[id];save();render();
    var again=document.querySelector('input[data-id="'+id+'"]');if(again)again.focus()}
});
document.addEventListener("input",function(e){var f=e.target.dataset&&e.target.dataset.f;if(f)RQ[f]=e.target.type==="checkbox"?e.target.checked:e.target.value});
document.addEventListener("submit",function(e){if(e.target.id==="rqform"){e.preventDefault();submitReq()}});
document.addEventListener("click",function(e){if(e.target.closest("#homeBtn")){S.step=0;save();render();window.scrollTo(0,0)}});
function renderLegal(){var g=LGL[S.lang];$("legal").innerHTML='<button type="button" data-legal="m">'+g.m+'</button><button type="button" data-legal="c">'+g.c+'</button>'}
function openLegal(k){
  var g=LGL[S.lang],items=k==="m"?g.mt:g.ct,b="";
  items.forEach(function(it){var v=typeof it[1]==="function"?it[1]():esc(it[1]);b+="<h3>"+esc(it[0])+"</h3><p>"+v+"</p>"});
  $("lg-t").textContent=k==="m"?g.m:g.c;$("lg-x").textContent=g.x;$("lg-b").innerHTML=b+'<p class="lg-d">'+esc(g.d)+"</p>";
  var d=$("lg");if(d.showModal)d.showModal();else d.setAttribute("open","");
}
document.addEventListener("click",function(e){var b=e.target.closest("[data-legal]");if(b){openLegal(b.dataset.legal);return}if(e.target.id==="lg-x"||e.target.id==="lg"){var d=$("lg");if(d.close)d.close();else d.removeAttribute("open")}});
var AI={file:null,thumb:"",busy:false,err:"",res:null,f:{},consent:false,code:"",ll:"fr"};
function aiStr(x,n){return String(x==null?"":x).replace(/\s+\n/g,"\n").trim().slice(0,n||600)}
function aiClean(r){
  var o={readable:r&&r.readable!==false,isRefusal:r&&r.is_refusal!==false,fields:{},motives:[],diag:[],plan:[],paras:[],encl:[]};
  var f=(r&&r.fields)||{};
  ["lastName","firstName","fileNumber","decisionDate"].forEach(function(k){o.fields[k]=aiStr(f[k],80)});
  (r&&r.motives||[]).slice(0,17).forEach(function(m){var b=parseInt(m&&m.box,10);if(MOTIFS[b])o.motives.push({box:b,explanation:aiStr(m.explanation,700)})});
  (r&&r.diagnosis||[]).slice(0,12).forEach(function(d){if(d&&d.piece)o.diag.push({piece:aiStr(d.piece,160),status:d.status==="missing"?"missing":"weak",why:aiStr(d.why,500),how:aiStr(d.how,500)})});
  (r&&r.plan||[]).slice(0,8).forEach(function(d){if(d&&d.title)o.plan.push({title:aiStr(d.title,160),detail:aiStr(d.detail,500)})});
  (r&&r.letter_paragraphs||[]).slice(0,8).forEach(function(x){var v=aiStr(x,1400);if(v)o.paras.push(v)});
  (r&&r.enclosures||[]).slice(0,12).forEach(function(x){var v=aiStr(x,160);if(v)o.encl.push(v)});
  return o;
}
function aiToday(){var d=new Date();return ("0"+d.getDate()).slice(-2)+"/"+("0"+(d.getMonth()+1)).slice(-2)+"/"+d.getFullYear()}
function buildLetter(){
  var r=AI.res,f=AI.f,fr=AI.ll!=="en",v=function(x,ph){return x&&x.trim()?x.trim():ph};
  var name=(f.fn||f.ln)?(v(f.fn,"[Prénom]")+" "+v(f.ln,"[NOM]")):(fr?"[Prénom NOM]":"[First name LAST NAME]");
  var to=S.country==="fr"?"À l'attention de la Commission de recours contre les décisions de refus de visa d'entrée en France\n[adresse indiquée sur votre notification de refus]":"To the appeals authority indicated on the refusal notice\n[address shown on your refusal notice]";
  var L=[];
  if(fr){
    L.push(name,"[Adresse en Tunisie]","[Téléphone] · [E-mail]","Passeport n° : [numéro]","","[Ville], le "+v(f.date,aiToday()),"",to,"",
      "Objet : recours contre la décision de refus de visa du "+v(f.dec,"[date de la décision]"),"Référence de la demande : "+v(f.no,"[numéro de dossier]"),"","Madame, Monsieur,","");
    L.push(r.paras.join("\n\n"));
    if(r.encl.length){L.push("","Pièces jointes :");r.encl.forEach(function(x){L.push("- "+x)})}
    L.push("","Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.","","[Signature]");
  }else{
    L.push(name,"[Address in Tunisia]","[Phone] · [E-mail]","Passport no.: [number]","","[City], "+v(f.date,aiToday()),"",
      "To the appeals authority indicated on the refusal notice","[address shown on your refusal notice]","",
      "Subject: appeal against the visa refusal decision of "+v(f.dec,"[decision date]"),"Application reference: "+v(f.no,"[file number]"),"","Dear Sir or Madam,","");
    L.push(r.paras.join("\n\n"));
    if(r.encl.length){L.push("","Enclosures:");r.encl.forEach(function(x){L.push("- "+x)})}
    L.push("","Yours faithfully,","","[Signature]");
  }
  return L.join("\n");
}
function aiHtml(t){
  var h='<h2>'+t.aiTitle+'</h2><p class="rf-sub">'+t.aiSub+'</p>';
  if(AI.res)return h+aiResult(t);
  h+='<label class="ai-drop'+(AI.busy?' busy':'')+'" id="aiDrop" for="aiFile">';
  if(AI.file){h+=(AI.thumb?'<img class="ai-thumb" src="'+AI.thumb+'" alt="">':'<span class="ai-pdf" aria-hidden="true">PDF</span>')+'<b class="ai-fn">'+esc(AI.file.name)+'</b>'+(AI.busy?'<span class="ai-laser" aria-hidden="true"></span>':'<span class="i-note">'+t.aiChange+'</span>')}
  else h+='<span class="ai-ic" aria-hidden="true">&#8679;</span><b>'+t.aiDrop+'</b><span class="i-note" id="aiHint">'+t.aiDropHint+'</span>';
  h+='<input class="ai-in" id="aiFile" type="file" aria-describedby="aiHint'+(AI.err?' aiErrMsg':'')+'"'+(AI.err?' aria-invalid="true"':'')+' accept="application/pdf,image/jpeg,image/png,image/webp"'+(AI.busy?' disabled':'')+'></label>';
  if(AI.err)h+='<p class="ai-err" id="aiErrMsg" role="alert">'+t[AI.err]+'</p>';
  if(AI.file){
    if(!S.packCode)h+='<div class="q"><label class="q-label" for="aicode">'+t.codeLabel+'</label><input class="sel" id="aicode" type="text" autocomplete="off" aria-describedby="aiErrMsg" value="'+esc(AI.code)+'"></div>';
    h+='<label class="ai-consent"><input type="checkbox" id="aiConsent"'+(AI.consent?' checked':'')+'><span>'+t.aiConsent+'</span></label>';
    h+='<button type="button" class="pay wide" id="aiGo"'+(AI.busy?' disabled':'')+'>'+(AI.busy?t.aiScan:t.aiBtn)+'</button>';
  }
  return h+'<p class="ag-note">'+t.aiDisc+'</p>';
}
function aiResult(t){
  var r=AI.res,L=S.lang,h='<section class="group"><h2>'+t.aiMot+'</h2>';
  if(!r.motives.length)h+='<p class="ai-warnbox">'+t.aiNone+'</p>';
  r.motives.forEach(function(m){h+='<div class="ai-card bad"><span class="ai-badge">'+t.aiBox+' '+m.box+'</span><b>'+esc(MOTIFS[m.box][L])+'</b><span class="i-note">'+t.aiLegal+'</span><p>'+esc(m.explanation)+'</p></div>'});
  h+='</section><section class="group"><h2>'+t.aiDiag+'</h2>';
  r.diag.forEach(function(d){var ms=d.status==="missing";h+='<div class="ai-card '+(ms?'bad':'warn')+'"><span class="ai-badge">'+(ms?t.aiMissing:t.aiWeak)+'</span><b>'+esc(d.piece)+'</b><p>'+esc(d.why)+'</p><p class="i-note">'+esc(d.how)+'</p></div>'});
  h+='</section><section class="group"><h2>'+t.aiPlan+'</h2><ol class="ai-plan">';
  r.plan.forEach(function(d){h+='<li><b>'+esc(d.title)+'</b><span class="i-note">'+esc(d.detail)+'</span></li>'});
  h+='</ol></section><section class="group"><h2>'+t.aiLet+'</h2><p class="rf-sub">'+t.aiLetHint+'</p><div class="ai-fields">';
  [["ln",t.aiFLn],["fn",t.aiFFn],["no",t.aiFNo],["dec",t.aiFDec],["date",t.aiFDate]].forEach(function(x){
    h+='<label class="q"><span class="q-label">'+x[1]+'</span><input class="sel" type="text" data-aif="'+x[0]+'" value="'+esc(AI.f[x[0]]||"")+'"></label>'});
  h+='</div><pre class="letter" id="aiLetter">'+esc(buildLetter())+'</pre><div class="ai-acts"><button type="button" class="cp" id="aiCopy">'+t.aiCopy+'</button><button type="button" class="cp" id="aiPrint">'+t.aiPrint+'</button><button type="button" class="cp" id="aiDl">'+t.aiDl+'</button></div>';
  h+='<button type="button" class="reset" id="aiAgain">'+t.aiAgain+'</button></section><p class="ag-note">'+t.aiDisc+'</p>';
  return h;
}
function renderAI(){var b=$("aiBox");if(b)b.innerHTML=aiHtml(applyCountry(UI[S.lang]))}
function aiFail(k){AI.busy=false;AI.err=k;renderAI()}
function aiSetFile(file){
  AI.res=null;AI.err="";if(AI.thumb){try{URL.revokeObjectURL(AI.thumb)}catch(e){}AI.thumb=""}
  if(!file){AI.file=null;renderAI();return}
  var okT=/^(application\/pdf|image\/(jpeg|png|webp))$/.test(file.type);
  if(!okT){AI.file=null;return aiFail("aiErrType")}
  if(file.size>(file.type==="application/pdf"?5:15)*1048576){AI.file=null;return aiFail("aiErrSize")}
  AI.file=file;if(file.type!=="application/pdf")AI.thumb=URL.createObjectURL(file);
  renderAI();
}
function aiPrep(file){return new Promise(function(res,rej){
  if(file.type==="application/pdf"){var r=new FileReader();r.onload=function(){res({mime:"application/pdf",data:String(r.result).split(",")[1]})};r.onerror=function(){rej("read")};r.readAsDataURL(file);return}
  var url=URL.createObjectURL(file),img=new Image();
  img.onload=function(){var sc=Math.min(1,1800/Math.max(img.width,img.height)),c=document.createElement("canvas");c.width=Math.round(img.width*sc);c.height=Math.round(img.height*sc);c.getContext("2d").drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);res({mime:"image/jpeg",data:c.toDataURL("image/jpeg",0.85).split(",")[1]})};
  img.onerror=function(){URL.revokeObjectURL(url);rej("read")};img.src=url;
})}
function aiAnalyze(){
  if(AI.busy||!AI.file)return;
  if(!AI.consent){AI.err="aiErrConsent";renderAI();return}
  var code=S.packCode||AI.code.trim().toUpperCase();
  if(!code){AI.err="aiErrAuth";renderAI();return}
  AI.err="";AI.busy=true;AI.ll=S.country==="fr"?"fr":"en";renderAI();
  aiPrep(AI.file).then(function(p){
    var ctl=new AbortController(),to=setTimeout(function(){ctl.abort()},90000);
    return fetch(AI_URL,{method:"POST",headers:{"Content-Type":"application/json"},signal:ctl.signal,
      body:JSON.stringify({code:code,mime:p.mime,data:p.data,lang:S.lang,letterLang:AI.ll,destination:curC().n.fr})})
    .then(function(r){clearTimeout(to);return r.json().catch(function(){return {ok:false,error:"upstream"}})});
  }).then(function(j){
    if(!j.ok){aiFail(j.error==="locked"?"aiErrLocked":j.error==="auth"?"aiErrAuth":(j.error==="busy"||j.error==="upstream")?"aiErrBusy":j.error==="size"?"aiErrSize":"aiErrNet");return}
    var r=aiClean(j.result);
    if(!r.readable)return aiFail("aiErrRead");
    if(!r.isRefusal)return aiFail("aiErrNot");
    if(!r.paras.length&&!r.motives.length)return aiFail("aiErrRead");
    if(!S.packCode){S.packCode=code;save()}
    AI.res=r;AI.busy=false;
    AI.f={ln:r.fields.lastName.toUpperCase(),fn:r.fields.firstName.toUpperCase(),no:r.fields.fileNumber,dec:r.fields.decisionDate,date:aiToday()};
    renderAI();
  }).catch(function(e){aiFail(e==="read"?"aiErrRead":"aiErrNet")});
}
(function(){
  document.addEventListener("change",function(e){
    var i=e.target.id;
    if(i==="aiFile")aiSetFile(e.target.files&&e.target.files[0]);
    else if(i==="aiConsent"){AI.consent=e.target.checked;if(AI.consent&&AI.err==="aiErrConsent"){AI.err="";renderAI()}}
  });
  document.addEventListener("input",function(e){
    if(e.target.id==="aicode")AI.code=e.target.value;
    var k=e.target.dataset&&e.target.dataset.aif;
    if(k){AI.f[k]=e.target.value;var pre=$("aiLetter");if(pre)pre.textContent=buildLetter()}
  });
  document.addEventListener("click",function(e){
    var c=e.target.closest&&e.target.closest("#aiGo,#aiCopy,#aiPrint,#aiDl,#aiAgain");if(!c)return;
    if(c.id==="aiGo")aiAnalyze();
    else if(c.id==="aiAgain"){AI.res=null;AI.file=null;AI.err="";if(AI.thumb){try{URL.revokeObjectURL(AI.thumb)}catch(x){}AI.thumb=""}renderAI()}
    else if(c.id==="aiCopy"){var pre=$("aiLetter"),t=UI[S.lang];try{navigator.clipboard.writeText(pre.textContent).then(function(){c.textContent=t.copied;setTimeout(function(){c.textContent=t.aiCopy},1800)})}catch(x){var rg=document.createRange();rg.selectNodeContents(pre);var sl=window.getSelection();sl.removeAllRanges();sl.addRange(rg)}}
    else if(c.id==="aiPrint"){document.body.classList.add("print-letter");var d=function(){document.body.classList.remove("print-letter");window.removeEventListener("afterprint",d)};window.addEventListener("afterprint",d);window.print()}
    else if(c.id==="aiDl"){var b=new Blob([$("aiLetter").textContent],{type:"text/plain;charset=utf-8"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="lettre-recours.txt";document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500)}
  });
  ["dragenter","dragover"].forEach(function(n){document.addEventListener(n,function(e){var d=e.target.closest&&e.target.closest("#aiDrop");if(d){e.preventDefault();d.classList.add("over")}})});
  ["dragleave","drop"].forEach(function(n){document.addEventListener(n,function(e){var d=e.target.closest&&e.target.closest("#aiDrop");if(d){e.preventDefault();d.classList.remove("over");if(n==="drop"&&!AI.busy&&e.dataTransfer.files.length)aiSetFile(e.dataTransfer.files[0])}})});
})();
async function verifyCode(kind,code){
  try{
    var r=await fetch(VERIFY_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({kind:kind,code:code})});
    var j=await r.json();
    return {ok:j.ok===true,net:false,locked:j.error==="locked"};
  }catch(e){return {ok:false,net:true}}
}
function reduceMotion(){return !!(window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches)}
/* Assistance sous le champ de code : un bouton principal (premier canal configuré) + liens secondaires. */
function supportHtml(t,kind){
  var m=encodeURIComponent((SUPPORT.msg&&SUPPORT.msg[kind])||"Visa Checker"),L=[];
  var wa=String(SUPPORT.whatsapp||"").replace(/\D/g,"");
  if(wa)L.push(['https://wa.me/'+wa+'?text='+m,t.viaWA,true]);
  if(SUPPORT.telegram)L.push(['https://t.me/'+encodeURIComponent(String(SUPPORT.telegram).replace(/^@/,"")),t.viaTG,true]);
  if(SUPPORT.email)L.push(['mailto:'+SUPPORT.email+'?subject='+encodeURIComponent("Visa Checker")+'&body='+m,t.viaMail,false]);
  if(!L.length)return "";
  var h='<div class="help-code"><span class="help-q">'+t.noCode+'</span><a class="help-main" href="'+L[0][0]+'"'+(L[0][2]?' target="_blank" rel="noopener noreferrer"':'')+'>'+L[0][1]+'</a>';
  if(L.length>1)h+='<span class="help-alt">'+L.slice(1).map(function(x){return '<a href="'+x[0]+'"'+(x[2]?' target="_blank" rel="noopener noreferrer"':'')+'>'+x[1]+'</a>'}).join(" · ")+'</span>';
  return h+'</div>';
}
/* Déblocage par code : retour visuel clair (secousse + message rouge si invalide, coche animée + message vert si valide). */
async function tryUnlock(kind){
  var pack=kind==="pack",inp=$(pack?"code2":"code"),err=$(pack?"err2":"err"),btn=$(pack?"unlock2":"unlock"),row=inp.closest(".code-row"),t=UI[S.lang];
  function bad(msg){
    inp.setAttribute("aria-invalid","true");err.className="ag-err bad";err.textContent=msg;
    row.classList.remove("shake");void row.offsetWidth;row.classList.add("shake");
    try{inp.focus();inp.select()}catch(e){}
  }
  var v=(inp.value||"").trim().toUpperCase();
  if(!v){bad(t.codeEmpty);return}
  inp.setAttribute("aria-invalid","false");row.classList.remove("shake");btn.disabled=true;err.className="ag-err wait";err.textContent=t.chkWait;
  var res=await verifyCode(kind,v);
  if(res.ok){
    row.classList.add("ok");inp.readOnly=true;err.className="ag-err ok";err.textContent=t.codeOk;
    if(pack){S.pack=true;S.packCode=v}else S.paid=true;
    save();
    setTimeout(render,reduceMotion()?250:1100);
    return;
  }
  btn.disabled=false;bad(res.locked?t.tooMany:(res.net?t.aiErrNet:t.codeBad));
}
document.addEventListener("keydown",function(e){
  if(e.key==="Enter"&&(e.target.id==="code"||e.target.id==="code2")){e.preventDefault();tryUnlock(e.target.id==="code2"?"pack":"block")}
});
/* Bannière flottante (Sticky CTA) : met en avant le service payant aux moments clés. */
var CTAS={done:0,left:0},ctaOff={},ctaIO=null;
var CTAK={ready:["ctaReadyT","ctaReadyS","ctaReadyB"],review:["ctaRevT","ctaRevS","ctaRevB"],advisor:["ctaAdvT","ctaAdvS","ctaAdvB"],pack:["ctaPackT","ctaPackS","ctaPackB"]};
function ctaKind(){
  if(S.step===4&&S.mode!=="appeal"&&!S.paid&&CTAS.done>0)return CTAS.left===0?"ready":"review";
  if(S.step===5&&S.mode==="appeal"&&!S.pack)return "pack";
  if(S.step===5&&S.mode!=="appeal"&&!S.paid)return "advisor";
  return "";
}
function renderCta(){
  var el=$("cta");if(!el)return;
  if(ctaIO){ctaIO.disconnect();ctaIO=null}
  var k=ctaKind(),t=UI[S.lang];
  if(!k||ctaOff[k]){el.hidden=true;el.innerHTML="";el.classList.remove("off");document.body.classList.remove("has-cta");return}
  var K=CTAK[k];
  el.innerHTML='<div class="cta-in" role="region" aria-label="'+esc(t[K[0]])+'"><div class="cta-tx"><b>'+t[K[0]]+'</b><span>'+t[K[1]]+'</span></div><button type="button" class="cta-go" data-cta="'+k+'">'+t[K[2]]+'</button><button type="button" class="cta-x" data-cta-x="'+k+'" aria-label="'+esc(t.ctaClose)+'">&times;</button></div>';
  el.hidden=false;el.classList.remove("off");document.body.classList.add("has-cta");
  /* inutile de doubler le bloc de paiement quand il est déjà à l'écran */
  var tgt=(k==="pack"||k==="advisor")?$(k==="pack"?"unlock2":"unlock"):null;
  if(tgt&&window.IntersectionObserver){
    ctaIO=new IntersectionObserver(function(es){el.classList.toggle("off",es[0].isIntersecting)},{threshold:.6});
    ctaIO.observe(tgt.closest(".q")||tgt);
  }
}
document.addEventListener("click",function(e){
  var x=e.target.closest&&e.target.closest("[data-cta-x]");
  if(x){ctaOff[x.dataset.ctaX]=true;renderCta();return}
  var g=e.target.closest&&e.target.closest("[data-cta]");if(!g)return;
  var k=g.dataset.cta;
  if(k==="ready"||k==="review"){S.step=5;save();render();return}
  var tgt=$(k==="pack"?"code2":"code");
  if(tgt){var r=reduceMotion();tgt.scrollIntoView({behavior:r?"auto":"smooth",block:"center"});setTimeout(function(){try{tgt.focus({preventScroll:true})}catch(x){}},r?0:400)}
});
function printPack(){
  document.querySelectorAll("#refus details").forEach(function(d){d.open=true});
  document.body.classList.add("print-pack");
  var done=function(){document.body.classList.remove("print-pack");window.removeEventListener("afterprint",done)};
  window.addEventListener("afterprint",done);
  window.print();
}
document.addEventListener("click",function(e){if(e.target.closest&&e.target.closest("[data-print]"))printPack()});
document.addEventListener("input",function(e){if(e.target.id==="refcase"){S.refus=e.target.value;save()}});
/* Mouvement : décor, apparition au défilement, rejeu à chaque changement d'étape */
(function(){
  var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches;
  document.body.insertAdjacentHTML("afterbegin",'<div class="deco" aria-hidden="true"><i></i><i></i><span class="plane">'+ICONS.plane+'</span></div>');
  if(reduce||!("IntersectionObserver" in window))return;
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.08,rootMargin:"0px 0px -4% 0px"});
  var SEL=".why,.needs,#sponsors>*,.tile,.ag-card,.recap,.item,.partner,.book,.nxt li";
  function scan(){document.querySelectorAll(SEL).forEach(function(el){if(el.dataset.rv)return;el.dataset.rv=1;var sib=Array.prototype.indexOf.call(el.parentNode.children,el);el.style.transitionDelay=Math.min(sib,6)*60+"ms";el.classList.add("rv");io.observe(el)})}
  var tm;new MutationObserver(function(){clearTimeout(tm);tm=setTimeout(scan,30)}).observe(document.body,{childList:true,subtree:true});
  var h=document.querySelector("header"),last=document.body.dataset.step;
  new MutationObserver(function(){var n=document.body.dataset.step;if(n!==last){last=n;h.classList.remove("enter");void h.offsetWidth}}).observe(document.body,{attributes:true,attributeFilter:["data-step"]});
  scan();
})();
["fr","en","ar"].forEach(function(l){$("l-"+l).onclick=function(){S.lang=l;save();render()}});
$("reset").onclick=function(){S.done={};save();render()};
/* Réinitialiser mes données : confirmation, effacement du localStorage, puis rechargement propre.
   WIPED empêche save() de réécrire l'état pendant le rechargement. */
function wipeAll(){
  if(!window.confirm(UI[S.lang].wipeConfirm))return;
  WIPED=true;
  Store.remove(KEY);
  Store.clearSession();
  window.scrollTo(0,0);
  window.location.reload();
}
$("wipe").onclick=wipeAll;
render();
})();
