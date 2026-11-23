const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const matcher = require("../career-matcher.js");
const catalogue = JSON.parse(fs.readFileSync(path.join(__dirname,"../data/occupations.json"),"utf8"));
const byId = id => catalogue.occupations.find(x=>x.id===id);

assert.equal(catalogue.occupations.length,10,"catalogue contient 10 métiers");
assert.equal(new Set(catalogue.occupations.map(x=>x.id)).size,10,"IDs uniques");
assert.equal(byId("pflegefachkraft").training_type,"regulated_school_based","soins distingués de la formation duale classique");

let r=matcher.match({skills:["programming","logic","troubleshooting"],interests:["technology","programming","computers"],environments:["office","computer"],experience:["it","web"],german_level:"A2"},catalogue,3);
assert.equal(r.results[0].occupation_id,"fachinformatiker","profil informatique classé en premier");
assert.equal(r.results[0].score,58,"score pondéré calculé sur les tags correspondants");

r=matcher.match({skills:["mechanical_reasoning","manual_precision"],interests:["automotive","mechanics"],environments:["workshop","garage"],experience:["automotive","repair"],german_level:"A1"},catalogue,3);
assert.equal(r.results[0].occupation_id,"kfz_mechatroniker","profil mécanique classé en premier");
assert.match(r.readiness.german_note_fr,/progression en allemand/i,"niveau de langue traité dans readiness");

r=matcher.match({skills:["empathy","communication","organization"],interests:["health","helping_people","care"],environments:["hospital","clinic","people_facing"],experience:["health","care"],german_level:"B1"},catalogue,3);
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

// Le questionnaire (app.js) ne propose que des valeurs que le catalogue connaît (sinon un choix n'aurait aucun effet).
const appSrc=fs.readFileSync(path.join(__dirname,"../app.js"),"utf8");
const values=(name)=>{const m=appSrc.match(new RegExp("const "+name+" = \\[([\\s\\S]*?)\\];"));assert.ok(m,name+" introuvable");return [...m[1].matchAll(/\["([a-z0-9_]+)"/g)].map(x=>x[1]);};
const tagsOf=(k)=>new Set(catalogue.occupations.flatMap(o=>o[k]));
for(const v of values("skillOptions")) assert.ok(tagsOf("skills").has(v),"compétence sans métier : "+v);
for(const v of values("domainOptions")) assert.ok(tagsOf("experience_domains").has(v),"domaine d'expérience sans métier : "+v);
const interestMap={electronics:"electronics",industry:"industrial_systems",construction:"construction"};
const stepsSrc=appSrc.slice(appSrc.indexOf('id:"interests"'),appSrc.indexOf('id:"environment"'));
for(const m of stepsSrc.matchAll(/\["([a-z_]+)","/g)) assert.ok(tagsOf("interests").has(interestMap[m[1]]||m[1]),"intérêt sans métier : "+m[1]);

console.log("Career Matcher: tous les tests sont passés.");
