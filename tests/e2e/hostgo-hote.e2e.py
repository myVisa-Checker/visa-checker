#!/usr/bin/env python3
"""Test navigateur réel du parcours hôte (reprise, protection des données, anti-doublon).
Optionnel (hors tests/run.mjs, aucune dépendance Node) : python3 tests/e2e/hostgo-hote.e2e.py
Nécessite : pip install playwright && playwright install chromium. Sert le dépôt sur un port local ; le Worker /contact est simulé."""
import json, sys, threading, http.server, socketserver, functools, os
from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(("127.0.0.1", 0), functools.partial(Q, directory=ROOT)); PORT = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
URL = f"http://127.0.0.1:{PORT}/hostgo-hote.html"
res = []
def ok(name, cond, detail=""):
    res.append(bool(cond)); print(("  ok   " if cond else "  FAIL ") + name + ("" if cond else " : " + str(detail)))

TXT = "Texte de test suffisamment long pour valider."
def next_(p): p.locator("section:not([hidden]) [data-go=next]").click()
def step(p):
    return p.evaluate("() => { const s=[...document.querySelectorAll('.hgh-step')].findIndex(x=>!x.hidden); return s }")
def fill_to_step(p, target):
    """Remplit réellement le parcours jusqu'à l'étape (index) demandée."""
    p.select_option("#country", "Tunisie")
    for c in p.locator(".required-check").all(): c.check()
    p.click("#continue1")                                   # 0 -> 1
    for sid in ["st2", "ac"]:
        if step(p) >= target: return
        p.fill(f"#ta-{sid}", TXT + " " + sid); next_(p)
    if step(p) >= target: return
    p.locator("#types input").first.check(); p.locator("#types input").nth(2).check(); next_(p)   # ty
    p.select_option("#pl-hours", "1"); p.select_option("#pl-days", "0"); p.select_option("#pl-stay", "3"); next_(p)  # pl
    p.locator("#months button").nth(1).click(); p.locator("#months button").nth(1).click(); next_(p)   # av (mars: partiel)
    for sid in ["st3", "cx", "st4"]:
        if step(p) >= target: return
        if sid == "st4":
            pass
        p.fill(f"#ta-{sid}", TXT + " " + sid)
        if sid == "cx": next_(p); 
        else: next_(p)
        if sid == "cx":
            # lg : une langue
            p.click("#add-lang"); p.select_option("#lg-l1", "2"); p.select_option("#lg-v1", "3"); p.fill("#lx-note", "Échange de langues"); 
            p.locator("section:not([hidden]) [data-go=next]").click()
    return

with sync_playwright() as pw:
    b = pw.chromium.launch()
    # ---------- Scénario 1 : parcours complet, fermeture/réouverture
    ctx = b.new_context(locale="fr-FR"); page = ctx.new_page(); errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    sent = []
    def route(r):
        body = json.loads(r.request.post_data); sent.append(body)
        n = len(sent)
        if fail_at.get("n") == n: r.fulfill(status=500, content_type="application/json", body='{"ok":false}')
        else: r.fulfill(status=200, content_type="application/json", headers={"Access-Control-Allow-Origin": "*"}, body='{"ok":true}')
    fail_at = {}
    ctx.route("**/visa-chat.rabehfly.workers.dev/**", route)
    page.goto(URL); page.wait_for_selector("#st1")
    ok("première visite : aucun bandeau de reprise", page.locator("#draft-banner").is_hidden())
    page.select_option("#country", "Tunisie"); page.wait_for_timeout(700)
    ok("pays seul : rien n'est stocké", page.evaluate("localStorage.getItem('hg_host_draft_v1')") is None)

    # étapes 1 à 6 (index 0..5) puis la suite
    page.select_option("#country", "Tunisie")
    for c in page.locator(".required-check").all(): c.check()
    page.click("#continue1")
    page.fill("#ta-st2", TXT + " lieu"); next_(page)
    page.fill("#ta-ac", TXT + " hebergement"); next_(page)
    page.locator("#types input").nth(0).check(); page.locator("#types input").nth(2).check(); next_(page)
    page.select_option("#pl-hours", "0"); page.select_option("#pl-days", "1"); page.select_option("#pl-stay", "4"); next_(page)
    page.locator("#months button").nth(1).click(); page.locator("#months button").nth(1).click(); page.locator("#months button").nth(7).click(); next_(page)
    page.fill("#ta-st3", TXT + " aide"); next_(page)
    page.fill("#ta-cx", TXT + " culture"); next_(page)
    page.click("#add-lang"); page.select_option("#lg-l1", "3"); page.select_option("#lg-v1", "3"); page.click("#add-lang"); page.select_option("#lg-l2", "2"); page.select_option("#lg-v2", "1")
    page.uncheck("#lx-on"); page.fill("#lx-note", "note langues"); next_(page)
    page.fill("#ta-st4", TXT + " presentation"); next_(page)
    page.locator("#amen input").nth(0).check(); page.locator("#trav input").nth(1).check(); next_(page)
    page.fill("#addr", "12 rue des Oliviers"); page.fill("#zip", "9000"); next_(page)
    page.fill("#ta-oi", "Infos utiles"); next_(page)
    ok("on est à l'étape 14 (photos)", step(page) == 13, step(page))
    page.set_input_files("#ph-file", {"name": "a.png", "mimeType": "image/png", "buffer": bytes.fromhex("89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d49444154789c6360000002000001e221bc330000000049454e44ae426082")})
    next_(page)
    page.fill("#firstName", "Sami"); page.fill("#email", "sami@example.com"); page.fill("#city", "Béja"); page.fill("#pv", "note privée équipe")
    page.wait_for_timeout(800)
    ok("on est à la dernière étape (15)", step(page) == 14, step(page))
    ls = page.evaluate("localStorage.getItem('hg_host_draft_v1')"); ss = page.evaluate("sessionStorage.getItem('hg_host_draft_v1')")
    ok("localStorage : brouillon présent, sans e-mail/prénom/adresse/ville/note privée", ls and not any(x in ls for x in ["sami@example.com", "Sami", "Oliviers", "9000", "Béja", "note privée"]), ls)
    ok("sessionStorage : coordonnées présentes", ss and all(x in ss for x in ["sami@example.com", "Oliviers", "Béja"]))
    ok("rien du tout sur les consentements dans le stockage", "terms" not in ls and "marketing" not in ls)
    ok("indicateur de sauvegarde visible", "enregistré" in page.inner_text("#draft-status"))

    # rechargement dans le même onglet
    page.reload(); page.wait_for_selector("#st1")
    ok("rechargement : bandeau de reprise affiché", page.locator("#draft-banner").is_visible())
    ok("bandeau : indique l'étape 15 sur 15 et 1 photo non conservée", "étape 15 sur 15" in page.inner_text("#draft-text") and "1 photo" in page.inner_text("#draft-photos"), page.inner_text("#draft-text"))
    page.click("#continue1"); ok("tant que le choix n'est pas fait, on ne peut pas avancer", "Reprendre" in page.inner_text("#error1"))
    page.click("#draft-resume"); page.wait_for_timeout(300)
    ok("reprise : retour à l'étape 15", step(page) == 14, step(page))
    vals = page.evaluate("""() => ({fn:firstName.value,em:email.value,city:city.value,pv:pv.value,addr:addr.value,zip:zip.value,
       st2:document.getElementById('ta-st2').value, st4:document.getElementById('ta-st4').value, oi:document.getElementById('ta-oi').value,
       types:[...document.querySelectorAll('#types input')].map(c=>c.checked), hours:document.getElementById('pl-hours').value,days:document.getElementById('pl-days').value,stay:document.getElementById('pl-stay').value,
       cal:[...document.querySelectorAll('#months button')].map(b=>b.className), langs:[...document.querySelectorAll('#langs select')].map(s=>s.value), lx:document.getElementById('lx-on').checked, lxn:document.getElementById('lx-note').value,
       amen:[...document.querySelectorAll('#amen input')].map(c=>c.checked), trav:[...document.querySelectorAll('#trav input')].map(c=>c.checked), terms:terms.checked, marketing:marketing.checked, ctr:document.getElementById('ct-st2').textContent})""")
    ok("coordonnées et note privée restituées (même onglet)", (vals["fn"], vals["em"], vals["city"], vals["pv"], vals["addr"], vals["zip"]) == ("Sami", "sami@example.com", "Béja", "note privée équipe", "12 rue des Oliviers", "9000"), vals)
    ok("textes des 6 zones restitués, compteur de caractères à jour", vals["st2"].endswith("lieu") and vals["st4"].endswith("presentation") and vals["oi"] == "Infos utiles" and not vals["ctr"].startswith("0 /"), vals["ctr"])
    ok("types d'aide restitués", vals["types"][0] and vals["types"][2] and sum(vals["types"]) == 2)
    ok("heures / jours / séjour restitués", (vals["hours"], vals["days"], vals["stay"]) == ("0", "1", "4"), vals)
    ok("calendrier restitué (mars partiel, août ou sept. besoin)", "m2" in vals["cal"][1] and "m1" in vals["cal"][7], vals["cal"])
    ok("langues restituées (2 lignes)", vals["langs"] == ["3", "3", "2", "1"], vals["langs"])
    ok("échange linguistique décoché et note restituée", vals["lx"] is False and vals["lxn"] == "note langues")
    ok("équipements et voyageurs restitués", vals["amen"][0] and vals["trav"][1])
    ok("consentements NON restitués (à redonner)", vals["terms"] is False and vals["marketing"] is False)
    page.click("#back2"); page.wait_for_timeout(200)
    ok("photos : message demandant de les rajouter", "ajoutez-les de nouveau" in page.inner_text("#ph-count"), page.inner_text("#ph-count"))
    page.click("section:not([hidden]) [data-go=next]")

    # ---------- Envoi : échec au 2e message puis nouvel essai sans doublon
    # textes au maximum pour forcer un envoi en plusieurs messages (3000 caractères max par message côté Worker)
    page.evaluate("""() => { for (const id of ['st2','ac','st3','cx','st4','oi']) { const t=document.getElementById('ta-'+id); t.value=('Texte '+id+' ').repeat(200).slice(0,t.maxLength); t.dispatchEvent(new Event('input',{bubbles:true})); } }""")
    page.wait_for_timeout(700)
    page.check("#terms")
    fail_at["n"] = 2; sent.clear()
    page.evaluate("window.__mailto=null; Object.defineProperty(window,'location',{configurable:true})") if False else None
    page.on("framenavigated", lambda f: None)
    page.click("#finish"); page.wait_for_timeout(1500)
    first_try = list(sent)
    ok("envoi multi-parties : échec simulé sur la partie 2", len(first_try) == 2, len(first_try))
    ok("chaque partie porte la référence de demande", all(("Réf. demande : hg-" in s["message"]) or ("hg-" in s["message"]) for s in first_try))
    ref = [l for l in first_try[0]["message"].split("\n") if l.startswith("Réf. demande")][0].split(": ")[1]
    ctx.set_default_timeout(5000)
    page.goto(URL); page.wait_for_selector("#st1")
    ok("après échec : le brouillon est conservé", page.locator("#draft-banner").is_visible())
    page.click("#draft-resume"); page.wait_for_timeout(300); page.check("#terms"); fail_at["n"] = None; sent.clear()
    page.click("#finish"); page.wait_for_selector("#done:not([hidden])")
    ok("nouvel essai : seules les parties manquantes sont envoyées (pas de doublon de la partie 1)", len(sent) >= 1 and all("suite" in s["message"].split("\n")[0] for s in sent), [s["message"][:60] for s in sent])
    ok("nouvel essai : même référence de demande", all(ref in s["message"] for s in sent))
    ok("succès : brouillon effacé (local + session)", page.evaluate("localStorage.getItem('hg_host_draft_v1')") is None and page.evaluate("sessionStorage.getItem('hg_host_draft_v1')") is None)
    ok("succès : l'e-mail n'est mémorisé qu'en empreinte", "sami@example.com" not in (page.evaluate("localStorage.getItem('hg_host_sent_v1')") or ""))
    hr = page.evaluate("localStorage.getItem('hg_roles')") or ""
    ok("rôle hôte mémorisé sans e-mail en clair", hr and "sami@example.com" not in hr and '"host"' in hr, hr)
    page.goto(URL); page.wait_for_selector("#st1")
    ok("après envoi : formulaire vierge, pas de bandeau", page.locator("#draft-banner").is_hidden())
    ok("aucune erreur JavaScript", not errors, errors)

    # ---------- Scénario 2 : fermeture complète du navigateur (nouveau contexte = sessionStorage vide)
    ls_state = None
    c1 = b.new_context(locale="fr-FR"); p1 = c1.new_page(); p1.goto(URL); p1.wait_for_selector("#st1")
    p1.select_option("#country", "Maroc")
    for c in p1.locator(".required-check").all(): c.check()
    p1.click("#continue1"); p1.fill("#ta-st2", TXT + " maroc"); next_(p1); p1.wait_for_timeout(700)
    state = c1.storage_state()  # localStorage seul (sessionStorage non inclus)
    c1.close()
    c2 = b.new_context(storage_state=state, locale="fr-FR"); p2 = c2.new_page(); p2.goto(URL); p2.wait_for_selector("#st1")
    ok("fermeture/réouverture : reprise proposée (étape 3)", p2.locator("#draft-banner").is_visible() and "étape 3 sur 15" in p2.inner_text("#draft-text"), p2.inner_text("#draft-text") if p2.locator("#draft-banner").is_visible() else "pas de bandeau")
    p2.click("#draft-resume"); p2.wait_for_timeout(300)
    ok("réouverture : réponses restituées", step(p2) == 2 and p2.input_value("#country") == "Maroc" and p2.input_value("#ta-st2").endswith("maroc"), step(p2))
    # Recommencer
    p2.goto(URL); p2.wait_for_selector("#draft-banner:not([hidden])"); p2.click("#draft-restart")
    ok("« Recommencer » : brouillon effacé, formulaire vierge", p2.evaluate("localStorage.getItem('hg_host_draft_v1')") is None and p2.input_value("#country") == "")
    # Effacer
    p2.select_option("#country", "Tunisie"); [c.check() for c in p2.locator(".required-check").all()]; p2.click("#continue1"); p2.fill("#ta-st2", TXT + " x"); next_(p2); p2.wait_for_timeout(700)
    p2.click("#draft-status button"); p2.wait_for_selector("#st1:not([hidden])"); p2.wait_for_timeout(300)
    ok("« Effacer mon brouillon » : plus rien de stocké après rechargement", p2.evaluate("localStorage.getItem('hg_host_draft_v1')") is None and p2.locator("#draft-banner").is_hidden())
    c2.close()

    # ---------- Scénario 3 : stockage indisponible
    c3 = b.new_context(locale="fr-FR"); c3.add_init_script("Storage.prototype.setItem=function(){throw new DOMException('Quota','QuotaExceededError')}")
    p3 = c3.new_page(); e3 = []; p3.on("pageerror", lambda e: e3.append(str(e))); p3.goto(URL); p3.wait_for_selector("#st1")
    p3.select_option("#country", "Tunisie")
    for c in p3.locator(".required-check").all(): c.check()
    p3.click("#continue1"); p3.fill("#ta-st2", TXT + " q"); next_(p3); p3.wait_for_timeout(700)
    ok("stockage plein : avertissement affiché, parcours non bloqué, aucune erreur", "impossible" in p3.inner_text("#draft-status") and step(p3) == 2 and not e3, (p3.inner_text("#draft-status"), e3))
    c3.close()

    # ---------- Scénario 4 : EN et AR
    for lg, word, dirn in [("en", "Resume", "ltr"), ("ar", "استئناف", "rtl")]:
        c = b.new_context(locale="fr-FR"); p = c.new_page(); p.goto(URL + f"?lang={lg}"); p.wait_for_selector("#st1")
        p.select_option("#country", "Tunisie")
        for ch in p.locator(".required-check").all(): ch.check()
        p.click("#continue1"); p.fill("#ta-st2", TXT + " lang"); next_(p); p.wait_for_timeout(700)
        p.goto(URL + f"?lang={lg}"); p.wait_for_selector("#st1")
        ok(f"{lg.upper()} : bandeau de reprise traduit ({dirn})", word in p.inner_text("#draft-resume") and p.evaluate("document.documentElement.dir") == dirn, p.inner_text("#draft-resume"))
        c.close()
    b.close()
print(f"\n{sum(res)}/{len(res)} réussis"); srv.shutdown(); sys.exit(0 if all(res) else 1)
