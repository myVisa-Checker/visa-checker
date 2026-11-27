const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const matcher = require("../career-matcher.js");
const catalogue = JSON.parse(fs.readFileSync(path.join(__dirname,"../data/occupations.json"),"utf8"));
const byId = id => catalogue.occupations.find(x=>x.id===id);

assert.equal(catalogue.occupations.length,14,"catalogue contient 14 métiers");
assert.equal(new Set(catalogue.occupations.map(x=>x.id)).size,14,"IDs uniques");
assert.equal(byId("pflegefachkraft").training_type,"regulated_school_based","soins distingués de la formation duale classique");

let r=matcher.match({skills:["programming","logic","troubleshooting"],interests:["technology","problem_solving"],environments:["office","computer"],experience:["it"],german_level:"A2"},catalogue,3);
assert.equal(r.results[0].occupation_id,"fachinformatiker","profil informatique classé en premier");
assert.equal(r.results[0].score,79,"score pondéré calculé sur les tags correspondants");

r=matcher.match({skills:["mechanical_reasoning","manual_precision"],interests:["automotive"],environments:["workshop","garage"],experience:["automotive"],german_level:"A1"},catalogue,3);
assert.equal(r.results[0].occupation_id,"kfz_mechatroniker","profil mécanique classé en premier");
assert.match(r.readiness.german_note_fr,/progression en allemand/i,"niveau de langue traité dans readiness");

r=matcher.match({skills:["empathy","communication","organization"],interests:["health","helping_people"],environments:["hospital","clinic","people_facing"],experience:["health"],german_level:"B1"},catalogue,3);
assert.equal(r.results[0].occupation_id,"pflegefachkraft","profil soins classé en premier");

r=matcher.match({skills:["programming"],interests:["technology"],environments:[],experience:[],german_level:"A1"},catalogue,10);
assert.equal(r.results[0].occupation_id,"fachinformatiker");
assert.equal(r.results[0].confidence,"medium","confiance faible si peu de dimensions renseignées");
assert.equal(r.results[0].dimensions.environments,null,"absence de réponse n'est pas zéro");

r=matcher.match({skills:[],interests:[],environments:[],experience:[],german_level:"UNKNOWN"},catalogue,3);
assert.equal(r.results.length,0,"pas de faux classement sans données");

const a=matcher.match({skills:["logic"],interests:["technology"],environments:["office"],experience:[],german_level:"A2"},catalogue,5);
const b=matcher.match({skills:["logic"],interests:["technology"],environments:["office"],experience:[],german_level:"A2"},catalogue,5);
assert.deepEqual(a.results.map(x=>[x.occupation_id,x.score]),b.results.map(x=>[x.occupation_id,x.score]),"résultats déterministes");


const neutralA=matcher.match({skills:["programming"],interests:["technology"],environments:["office"],experience:[],german_level:"A1",education:"baccalaureat"},catalogue,10);
const neutralB=matcher.match({skills:["programming"],interests:["technology"],environments:["office"],experience:[],german_level:"C1",education:"master"},catalogue,10);
assert.deepEqual(neutralA.results.map(x=>[x.occupation_id,x.score]),neutralB.results.map(x=>[x.occupation_id,x.score]),"langue et diplôme ne pénalisent pas la compatibilité métier");
assert.equal(matcher.readiness({german_level:"A1"}).german_level,"A1","niveau de langue conservé dans readiness");

assert.match(r.disclaimer_fr,/pas une probabilité d'embauche ou de visa/i);


/* --- Ajouts d'intégration CheckMyVisa --- */
assert.deepEqual(Object.values(matcher.WEIGHTS),[35,30,20,15],"pondérations 35/30/20/15");
assert.equal(Object.values(matcher.WEIGHTS).reduce((a,b)=>a+b,0),100,"pondérations = 100");

// « Aucune expérience » : la dimension est exclue du dénominateur, elle ne vaut pas zéro.
const noExp=matcher.match({skills:["programming","logic"],interests:["technology"],environments:["office"],experience:[],german_level:"A1"},catalogue,10);
assert.equal(noExp.results[0].dimensions.experience,null,"aucune expérience = dimension absente, pas zéro");
const dims=noExp.results[0].dimensions;
const expected=Math.round((dims.skills*35+dims.interests*30+dims.environments*20)/85);
assert.equal(noExp.results[0].score,expected,"dénominateur limité aux dimensions renseignées");

// Aucun critère discriminant : âge, nationalité, sexe, origine, santé, statut migratoire sont ignorés.
const base={skills:["logic"],interests:["technology"],environments:["office"],experience:[],german_level:"B1"};
const withExtras=Object.assign({},base,{age:53,nationality:"TN",gender:"f",origin:"X",health:"y",migration_status:"z"});
assert.deepEqual(matcher.match(base,catalogue,10).results.map(x=>[x.occupation_id,x.score]),matcher.match(withExtras,catalogue,10).results.map(x=>[x.occupation_id,x.score]),"aucun filtrage par âge, nationalité, sexe, origine, santé ou statut migratoire");

// Fiabilité : plus de dimensions renseignées => fiabilité plus élevée.
const rank={low:0,medium:1,high:2};
const few=matcher.match({skills:["logic"],interests:[],environments:[],experience:[]},catalogue,1).results[0].confidence;
const all=matcher.match({skills:["logic"],interests:["technology"],environments:["office"],experience:["it"]},catalogue,1).results[0].confidence;
assert.ok(rank[few]<rank[all],"fiabilité croissante avec les réponses");
assert.equal(all,"high","quatre dimensions = fiabilité élevée");

// Niveau « Aucun » (A0) : connu, jamais traité comme « à préciser ».
const a0=matcher.readiness({german_level:"A0"});
assert.equal(a0.german_level,"A0","A0 conservé");
assert.match(a0.german_note_fr,/progression en allemand/i,"A0 => conseil de progression");
assert.doesNotMatch(a0.german_note_fr,/reste à préciser/i,"A0 n'est pas « inconnu »");
assert.match(matcher.readiness({german_level:""}).german_note_fr,/reste à préciser/i,"niveau absent => à préciser");

// Conseils de préparation : libellés lisibles, jamais les codes internes.
const rd=matcher.readiness({german_level:"B1",education:"baccalaureat",availability:"3_6",mobility:"consider"});
assert.match(rd.school_note_fr,/baccalauréat/);
assert.match(rd.project_note_fr,/3 à 6 mois/);
assert.doesNotMatch(JSON.stringify(rd),/baccalaureat|3_6/,"aucun code interne affiché");
assert.match(rd.visa_note_fr,/ne garantit/i,"pas une probabilité de visa");
for(const k of ["german_note_fr","school_note_fr","project_note_fr","mobility_note_fr","visa_note_fr"]) assert.doesNotMatch(rd[k],/\b(tu|ton|ta|tes)\b/i,"vouvoiement dans "+k);

// Langue, diplôme et mobilité ne changent pas le score métier.
const m1=matcher.match(Object.assign({},base,{german_level:"A0",education:"middle_school",mobility:"no"}),catalogue,10);
const m2=matcher.match(Object.assign({},base,{german_level:"C1",education:"master",mobility:"yes"}),catalogue,10);
assert.deepEqual(m1.results.map(x=>[x.occupation_id,x.score]),m2.results.map(x=>[x.occupation_id,x.score]),"langue, diplôme, mobilité : score inchangé");

// Catalogue conforme au schéma (validation minimale, sans dépendance externe).
const schema=JSON.parse(fs.readFileSync(path.join(__dirname,"../schemas/occupation.schema.json"),"utf8"));
const itemSchema=schema.properties.occupations.items;
assert.ok(catalogue.occupations.length>=schema.properties.occupations.minItems,"nombre minimal de métiers");
assert.ok(schema.properties.catalogue_status.enum.includes(catalogue.catalogue_status),"statut de catalogue valide");
for(const o of catalogue.occupations){
  for(const k of itemSchema.required) assert.ok(k in o,o.id+" : champ requis "+k);
  assert.match(o.id,new RegExp(itemSchema.properties.id.pattern),o.id+" : id valide");
  assert.ok(itemSchema.properties.training_type.enum.includes(o.training_type),o.id+" : training_type");
  assert.ok(Number.isInteger(o.duration_months)&&o.duration_months>=12&&o.duration_months<=60,o.id+" : durée");
  for(const k of ["interests","skills","environments","experience_domains"]) assert.ok(Array.isArray(o[k])&&o[k].length>0&&o[k].every(x=>typeof x==="string"),o.id+" : "+k);
  assert.ok(o.language_guidance&&"level" in o.language_guidance&&typeof o.language_guidance.status==="string",o.id+" : language_guidance");
  assert.equal(o.language_guidance.level,null,o.id+" : aucune exigence linguistique fixe codée");
}

// P1-1 — vocabulaire commun questionnaire ↔ catalogue, vérifié dans les DEUX sens.
const VOC=matcher.VOCABULARY;
const appSrc=fs.readFileSync(path.join(__dirname,"../app.js"),"utf8");
const stepValues=(id)=>{const m=appSrc.match(new RegExp('\\{id:"'+id+'",values:\\[([^\\]]*)\\]'));assert.ok(m,"étape "+id+" introuvable");return [...m[1].matchAll(/"([a-z0-9_]+)"/g)].map(x=>x[1]);};
const tagsOf=(k)=>new Set(catalogue.occupations.flatMap(o=>o[k]));
const interestAnswers=stepValues("interests"), envAnswers=stepValues("environment").filter(v=>v!=="open");
assert.deepEqual(interestAnswers,[...VOC.interests],"intérêts du questionnaire = vocabulaire du moteur");
assert.deepEqual([...envAnswers].sort(),Object.keys(VOC.environments).sort(),"lieux du questionnaire = vocabulaire du moteur");
assert.match(appSrc,/skillValues = window\.AusbildungMatcher\.VOCABULARY\.skills/,"app.js lit les compétences du vocabulaire commun");
assert.match(appSrc,/domainValues = window\.AusbildungMatcher\.VOCABULARY\.domains/,"app.js lit les domaines du vocabulaire commun");
assert.match(appSrc,/environmentTags\(answers\.environment\)/,"app.js construit les lieux via le vocabulaire commun");
const envUnion=new Set(Object.values(VOC.environments).flat());
const reach={skills:new Set(VOC.skills),interests:new Set(VOC.interests),environments:envUnion,experience_domains:new Set(VOC.domains)};
// (a) catalogue → questionnaire : aucun tag du catalogue n'est impossible à sélectionner.
for(const o of catalogue.occupations) for(const k of Object.keys(reach)) for(const tag of o[k]) assert.ok(reach[k].has(tag),o.id+" : tag "+k+" inatteignable depuis le questionnaire : "+tag);
// (b) questionnaire → catalogue : aucune réponse sans effet.
for(const v of VOC.skills) assert.ok(tagsOf("skills").has(v),"compétence sans métier : "+v);
for(const v of VOC.domains) assert.ok(tagsOf("experience_domains").has(v),"domaine sans métier : "+v);
for(const v of VOC.interests) assert.ok(tagsOf("interests").has(v)||v==="helping_people"&&tagsOf("interests").has(v),"intérêt sans métier : "+v);
for(const [env,tags] of Object.entries(VOC.environments)) assert.ok(tags.some(x=>tagsOf("environments").has(x)),"lieu sans métier : "+env);
// pas de doublon de tags dans un métier, pas de tag hors vocabulaire déclaré
for(const o of catalogue.occupations) for(const k of Object.keys(reach)) assert.equal(new Set(o[k]).size,o[k].length,o.id+" : doublon dans "+k);
assert.deepEqual(matcher.environmentTags("open").slice().sort(),[...envUnion].sort(),"« ouvert » = union des lieux");
assert.deepEqual(matcher.environmentTags("inconnu"),[],"lieu inconnu = aucune réponse");

// (c) profil idéal de chaque métier (tout ce qui le décrit est cochable) : score élevé ET rang 1 ou à égalité de score avec rang 1.
const ceiling={};
for(const o of catalogue.occupations){
  const env=Object.entries(VOC.environments).map(([k,tags])=>[k,o.environments.filter(x=>tags.includes(x)).length]).sort((a,b)=>b[1]-a[1])[0][0];
  const prof={skills:o.skills,interests:o.interests,environments:matcher.environmentTags(env),experience:o.experience_domains};
  const res=matcher.match(prof,catalogue,14).results;
  const me=res.find(r=>r.occupation_id===o.id);
  ceiling[o.id]=me.score;
  assert.ok(me.score>=85,o.id+" : un profil qui lui correspond doit dépasser 85 (obtenu "+me.score+")");
  assert.equal(me.score,res[0].score,o.id+" : son profil idéal ne doit pas être battu par un autre métier");
}
// aucun métier n'a un plafond structurellement plus bas que les autres (écart max 15 points)
const cv=Object.values(ceiling);
assert.ok(Math.max(...cv)-Math.min(...cv)<=15,"plafonds homogènes : "+JSON.stringify(ceiling));

// (d) pas de favoritisme par construction : sur des profils aléatoires reproductibles, aucun métier ne rafle > 25 % des premières places et chacun gagne au moins une fois.
{
  let seed=12345;const rnd=()=>(seed=(seed*1103515245+12345)%2147483648)/2147483648;
  const pick=(arr,p)=>arr.filter(()=>rnd()<p);
  const wins={};catalogue.occupations.forEach(o=>wins[o.id]=0);let n=0;
  for(let i=0;i<4000;i++){
    const envs=Object.keys(VOC.environments).concat("open");
    const prof={skills:pick(VOC.skills,.3),interests:pick(VOC.interests,.3),environments:matcher.environmentTags(envs[Math.floor(rnd()*envs.length)]),experience:pick(VOC.domains,.25)};
    const r=matcher.match(prof,catalogue,14).results;if(!r.length)continue;n++;
    const top=r.filter(x=>x.score===r[0].score);wins[top[Math.floor(rnd()*top.length)].occupation_id]++;
  }
  for(const [id,w] of Object.entries(wins)){assert.ok(w>0,id+" ne gagne jamais");assert.ok(w/n<=0.25,id+" favorisé : "+(100*w/n).toFixed(1)+" %");}
  console.log("Part de 1res places (profils aléatoires) :",Object.entries(wins).map(([k,v])=>k+" "+(100*v/n).toFixed(1)+"%").join(", "));
  console.log("Plafonds (profil idéal) :",JSON.stringify(ceiling));
}

// Mobilité : la situation administrative (visa en cours) ne modifie pas le classement et n'est jamais lue comme un refus.
const mbase={skills:["logic"],interests:["technology"],environments:["office"],experience:[],german_level:"B1"};
const scoreOf=(mob)=>JSON.stringify(matcher.match(Object.assign({},mbase,{mobility:mob}),catalogue,14).results.map(r=>[r.occupation_id,r.score]));
assert.equal(scoreOf("visa_pending"),scoreOf("yes"),"la mobilité n'entre pas dans le score");
assert.match(matcher.readiness(Object.assign({},mbase,{mobility:"visa_pending"})).mobility_note_fr,/visa est en cours/);
assert.doesNotMatch(matcher.readiness(Object.assign({},mbase,{mobility:"visa_pending"})).mobility_note_fr,/ne souhaitez pas/);

// P1-2 : aucune limite artificielle. Le moteur doit pouvoir classer tout le catalogue (14 métiers),
// sinon un métier choisi mais classé au-delà du 10e rang disparaîtrait des résultats.
{
  const N=catalogue.occupations.length;
  assert.equal(N,14,"catalogue de 14 métiers");
  const prof={skills:["empathy","communication"],interests:["health"],environments:["hospital"],experience:[]};
  const all=matcher.match(prof,catalogue,N);
  assert.equal(all.results.length,N,"match(…, N) renvoie les "+N+" métiers classés");
  assert.equal(new Set(all.results.map(r=>r.occupation_id)).size,N,"aucun doublon, aucun oubli");
  assert.equal(matcher.match(prof,catalogue,500).results.length,N,"une limite supérieure au catalogue est ramenée à N");
  assert.equal(matcher.match(prof,catalogue,3).results.length,3,"le top 3 reste disponible");
  assert.equal(matcher.match(prof,catalogue,0).results.length,1,"limite minimale : 1 résultat");
  // Un échantillon de 5 métiers choisis, y compris les derniers du classement, est entièrement retrouvé.
  const lastFive=all.results.slice(-5).map(r=>r.occupation_id);
  const found=all.results.filter(r=>lastFive.includes(r.occupation_id));
  assert.equal(found.length,5,"5 métiers choisis parmi les derniers du classement : 5 retrouvés");
  assert.ok(all.results.slice(-5).every((r,i)=>all.results.indexOf(r)>=N-5),"ils sont bien au-delà du 9e rang");
}

console.log("Career Matcher: tous les tests sont passés.");
