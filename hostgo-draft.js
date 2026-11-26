/* Host & Go : brouillon du parcours hôte (sauvegarde progressive, reprise, anti-doublon).
   Module sans DOM, testable sous Node (tests/hostgo-draft.test.mjs). Chargé avant hostgo-hote.js.
   Protection des données :
   - les champs personnels (prénom, e-mail, ville, adresse, code postal, note privée) ne vont que dans sessionStorage
     (survivent à un rechargement, effacés à la fermeture de l'onglet) ;
   - le reste (réponses non identifiantes) va dans localStorage pour une durée limitée (14 jours) ;
   - aucun consentement (CGU, e-mails) n'est mémorisé : il est redemandé à l'envoi ;
   - les photos ne sont jamais stockées (seul leur nombre l'est, pour prévenir l'hôte qu'il doit les rajouter). */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api; else root.HGDraft = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  var KEY = "hg_host_draft_v1", SENT_KEY = "hg_host_sent_v1", VERSION = 1;
  var TTL = 14 * 24 * 3600 * 1000, SENT_TTL = 30 * 24 * 3600 * 1000, SKEW = 5 * 60 * 1000;
  var SENSITIVE = ["firstName", "email", "city", "addr", "zip", "pv"];
  var MAXLEN = { country: 40, ta_st2: 700, ta_ac: 500, ta_st3: 700, ta_cx: 500, ta_st4: 700, ta_oi: 500, lxNote: 300, addr: 160, zip: 12, firstName: 60, email: 254, city: 80, pv: 300 };
  var STR_KEYS = Object.keys(MAXLEN);
  var SID_RE = /^hg-[0-9a-f]{16}$/;

  function str(v, max) { return typeof v === "string" ? v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").slice(0, max) : ""; }
  function int(v, min, max) { return typeof v === "number" && isFinite(v) && Math.floor(v) === v && v >= min && v <= max ? v : null; }
  function intList(a, max, len) {
    var out = [];
    if (!Array.isArray(a)) return out;
    a.forEach(function (x) { var n = int(x, 0, max); if (n !== null && out.indexOf(n) < 0 && out.length < len) out.push(n); });
    return out.sort(function (p, q) { return p - q; });
  }

  /* Ne garde que les champs connus, aux types et longueurs attendus : un brouillon altéré ne peut rien injecter. */
  function sanitize(d) {
    var o = {};
    if (!d || typeof d !== "object") return o;
    STR_KEYS.forEach(function (k) { if (typeof d[k] === "string" && d[k]) o[k] = str(d[k], MAXLEN[k]); });
    if (Array.isArray(d.decls)) o.decls = d.decls.slice(0, 12).map(function (b) { return b === true; });
    ["types", "amen", "trav"].forEach(function (k) { if (Array.isArray(d[k])) o[k] = intList(d[k], 99, 30); });
    [["hours", 20], ["days", 20], ["stay", 20], ["photos", 10]].forEach(function (p) { var n = int(d[p[0]], 0, p[1]); if (n !== null) o[p[0]] = n; });
    if (typeof d.lxOn === "boolean") o.lxOn = d.lxOn;
    if (Array.isArray(d.langs)) o.langs = d.langs.slice(0, 10).map(function (r) { var a = Array.isArray(r) ? int(r[0], 0, 30) : null, b = Array.isArray(r) ? int(r[1], 0, 10) : null; return a === null || b === null ? null : [a, b]; }).filter(Boolean);
    if (d.cal && typeof d.cal === "object") {
      o.cal = {};
      Object.keys(d.cal).forEach(function (y) {
        var yy = int(+y, 2000, 2200), row = d.cal[y];
        if (yy === null || !row || typeof row !== "object") return;
        Object.keys(row).forEach(function (m) { var mm = int(+m, 0, 11), st = int(row[m], 1, 3); if (mm !== null && st !== null) { o.cal[yy] = o.cal[yy] || {}; o.cal[yy][mm] = st; } });
      });
    }
    return o;
  }

  /* Les empreintes gardent leur position (index de la partie envoyée) ; une valeur invalide devient "". */
  function cleanSent(a) { return Array.isArray(a) ? a.slice(0, 20).map(function (h) { return typeof h === "string" && /^[0-9a-f]{8}$/.test(h) ? h : ""; }) : []; }

  function split(data) {
    var s = sanitize(data), pub = {}, priv = {};
    Object.keys(s).forEach(function (k) { (SENSITIVE.indexOf(k) >= 0 ? priv : pub)[k] = s[k]; });
    return { pub: pub, priv: priv };
  }

  /* Un brouillon « vaut la peine d'être repris » dès qu'une réponse utile a été saisie (le pays seul ne compte pas). */
  function isMeaningful(state) {
    if (!state) return false;
    if (state.step > 0) return true;
    var d = state.data || {};
    return Object.keys(d).some(function (k) {
      if (k === "country" || k === "decls" || k === "photos") return false;
      var v = d[k]; return Array.isArray(v) ? v.length > 0 : v && typeof v === "object" ? Object.keys(v).length > 0 : typeof v === "string" ? v.trim() !== "" : false;
    });
  }

  function hash(s) { var h = 0x811c9dc5; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0; } return ("00000000" + h.toString(16)).slice(-8); }

  function newSid(rng) {
    var hex = "";
    try {
      var c = (typeof crypto !== "undefined" && crypto.getRandomValues) ? crypto : null;
      if (c) { var a = new Uint8Array(8); c.getRandomValues(a); for (var i = 0; i < a.length; i++) hex += ("0" + a[i].toString(16)).slice(-2); }
    } catch (e) { hex = ""; }
    if (hex.length !== 16) { var r = rng || Math.random; hex = ""; for (var j = 0; j < 16; j++) hex += Math.floor(r() * 16).toString(16); }
    return "hg-" + hex;
  }

  /* Parties à envoyer : celles dont le texte exact n'a pas déjà été accepté par le serveur (pas de doublon au nouvel essai). */
  function planParts(texts, sent) {
    var out = []; sent = Array.isArray(sent) ? sent : [];
    texts.forEach(function (t, i) { if (sent[i] !== hash(t)) out.push(i); });
    return out;
  }

  function create(o) {
    o = o || {};
    var local = o.local, session = o.session, now = o.now || Date.now, steps = o.steps || 15;
    function get(st, k) { try { return st ? st.getItem(k) : null; } catch (e) { return null; } }
    function put(st, k, v) { try { if (!st) return false; st.setItem(k, v); return true; } catch (e) { return false; } }
    function del(st, k) { try { if (st) st.removeItem(k); } catch (e) { /* stockage indisponible */ } }
    function parse(raw) { try { var j = JSON.parse(raw); return j && typeof j === "object" && !Array.isArray(j) ? j : null; } catch (e) { return null; } }

    function save(state) {
      var sp = split(state.data), t = now();
      var step = int(state.step, 0, steps - 1); if (step === null) step = 0;
      var sid = SID_RE.test(state.sid || "") ? state.sid : newSid();
      var sent = cleanSent(state.sent);
      var okLocal = put(local, KEY, JSON.stringify({ v: VERSION, ts: t, sid: sid, step: step, sent: sent, data: sp.pub }));
      var okSession = put(session, KEY, JSON.stringify({ v: VERSION, ts: t, sid: sid, data: sp.priv }));
      return { ok: okLocal, privateOk: okSession, sid: sid };
    }

    function load() {
      var raw = get(local, KEY), j = raw ? parse(raw) : null;
      if (!j || j.v !== VERSION || !SID_RE.test(j.sid || "") || typeof j.ts !== "number") { if (raw) clear(); return null; }
      var t = now();
      if (t - j.ts > TTL || j.ts - t > SKEW) { clear(); return null; }
      var data = sanitize(j.data), hasPrivate = false;
      var sraw = get(session, KEY), sj = sraw ? parse(sraw) : null;
      if (sj && sj.v === VERSION && sj.sid === j.sid) {
        var p = sanitize(sj.data);
        Object.keys(p).forEach(function (k) { if (SENSITIVE.indexOf(k) >= 0) { data[k] = p[k]; hasPrivate = true; } });
      } else if (sraw) del(session, KEY);
      var step = int(j.step, 0, steps - 1); if (step === null) step = 0;
      return { sid: j.sid, ts: j.ts, step: step, sent: cleanSent(j.sent), data: data, hasPrivate: hasPrivate };
    }

    function clear() { del(local, KEY); del(session, KEY); }

    /* Mémoire anti-doublon d'envoi : empreintes d'e-mails (jamais l'adresse), 30 jours. */
    function sentMap() {
      var j = parse(get(local, SENT_KEY) || "") || {}, t = now(), out = {};
      Object.keys(j).forEach(function (h) { if (/^[0-9a-f]{8}$/.test(h) && typeof j[h] === "number" && t - j[h] < SENT_TTL && j[h] - t < SKEW) out[h] = j[h]; });
      return out;
    }
    function rememberSent(email) { var m = sentMap(); m[hash(String(email).trim().toLowerCase())] = now(); return put(local, SENT_KEY, JSON.stringify(m)); }
    function wasSent(email) { return !!sentMap()[hash(String(email).trim().toLowerCase())]; }

    return { save: save, load: load, clear: clear, rememberSent: rememberSent, wasSent: wasSent };
  }

  /* Rôle déjà pris sur cet appareil (hôte OU voyageur) : stocké sous une empreinte de l'e-mail, plus jamais l'adresse en clair.
     Les anciennes entrées en clair sont migrées puis supprimées à la première lecture. */
  var ROLES_KEY = "hg_roles";
  function roleKey(email) { var e = String(email).trim().toLowerCase(); return "r" + hash(e) + hash("2|" + e); }
  function roleMap(st) { try { var j = JSON.parse(st.getItem(ROLES_KEY) || "{}"); return j && typeof j === "object" && !Array.isArray(j) ? j : {}; } catch (e) { return {}; } }
  function getRole(st, email) {
    var m = roleMap(st), k = roleKey(email), plain = String(email).trim().toLowerCase(), r = Object.prototype.hasOwnProperty.call(m, k) ? m[k] : null;
    if (Object.prototype.hasOwnProperty.call(m, plain)) { var old = m[plain]; delete m[plain]; if (!r && (old === "host" || old === "traveler")) { m[k] = old; r = old; } try { st.setItem(ROLES_KEY, JSON.stringify(m)); } catch (e) { /* stockage indisponible */ } }
    return r === "host" || r === "traveler" ? r : null;
  }
  function setRole(st, email, role) {
    if (role !== "host" && role !== "traveler") return false;
    try { var m = roleMap(st); delete m[String(email).trim().toLowerCase()]; m[roleKey(email)] = role; st.setItem(ROLES_KEY, JSON.stringify(m)); return true; } catch (e) { return false; }
  }

  return { getRole: getRole, setRole: setRole, roleKey: roleKey, create: create, sanitize: sanitize, split: split, isMeaningful: isMeaningful, hash: hash, newSid: newSid, planParts: planParts, KEY: KEY, SENT_KEY: SENT_KEY, TTL: TTL, SENSITIVE: SENSITIVE };
});
