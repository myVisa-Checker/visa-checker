#!/usr/bin/env python3
"""Test navigateur de la page des offres (hostgo-offres.html) contre le VRAI Worker Host & Go (KV en mémoire).
Optionnel : python3 tests/e2e/hostgo-offres.e2e.py (playwright + chromium + node)."""
import json, os, subprocess, sys, threading, http.server, socketserver, functools, urllib.request, urllib.error
from playwright.sync_api import sync_playwright
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(("127.0.0.1", 0), functools.partial(Q, directory=ROOT)); PORT = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
api = subprocess.Popen(["node", os.path.join(ROOT, "tests/e2e/hostgo-api-server.mjs")], stdout=subprocess.PIPE, text=True)
APORT = int(api.stdout.readline().split()[1])
B = f"http://127.0.0.1:{PORT}/hostgo-offres.html"
res = []
def ok(n, c, d=""):
    res.append(bool(c)); print(("  ok   " if c else "  FAIL ") + n + ("" if c else " : " + str(d)))
CORS = {"Access-Control-Allow-Origin": f"http://127.0.0.1:{PORT}", "Access-Control-Allow-Headers": "Content-Type, Authorization", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Vary": "Origin"}
def forward(route):
    rq = route.request
    if rq.method == "OPTIONS": return route.fulfill(status=204, headers=CORS)
    path = rq.url.split("workers.dev", 1)[1]
    h = {"Origin": "https://checkmyvisa.org", "Content-Type": "application/json"}
    if rq.headers.get("authorization"): h["Authorization"] = rq.headers["authorization"]
    req = urllib.request.Request(f"http://127.0.0.1:{APORT}{path}", data=rq.post_data_buffer, method=rq.method, headers=h)
    try: r = urllib.request.urlopen(req)
    except urllib.error.HTTPError as e: r = e
    route.fulfill(status=r.status, body=r.read(), headers={"Content-Type": "application/json", **CORS})
def admin(path, body):
    req = urllib.request.Request(f"http://127.0.0.1:{APORT}{path}", data=json.dumps(body).encode(), method="POST", headers={"Origin": "https://checkmyvisa.org", "X-Admin-Key": "e2e-admin", "Content-Type": "application/json"})
    return json.loads(urllib.request.urlopen(req).read())
def cards(p): return p.locator("#results .hgo-item").count()
def settle(p):
    for _ in range(50):
        if p.inner_text("#state").strip() not in ("Chargement…", "Loading…", "جارٍ التحميل…", ""): break
        p.wait_for_timeout(100)
    p.wait_for_timeout(150)
with sync_playwright() as pw:
    b = pw.chromium.launch()
    # 1. Worker pas déployé : message clair dans les 3 langues, rien de simulé
    for lg, w in [("fr", "pas encore ouvertes"), ("en", "not open yet"), ("ar", "غير مفتوحة بعد")]:
        c = b.new_context(viewport={"width": 390, "height": 844}, locale=lg); c.route("**/visa-hostgo.rabehfly.workers.dev/**", lambda r: r.fulfill(status=404, body="<html>Not found</html>", content_type="text/html", headers=CORS))
        p = c.new_page(); p.goto(B + f"?lang={lg}"); settle(p)
        ok(f"[{lg}] API absente : « offres pas encore ouvertes », aucune carte", w in p.inner_text("#state") and cards(p) == 0, p.inner_text("#state"))
        ok(f"[{lg}] dir correct", p.evaluate("document.documentElement.dir") == ("rtl" if lg == "ar" else "ltr")); c.close()
    # 2. Hors ligne ou erreur serveur : pas de faux « bientôt ouvert »
    c = b.new_context(locale="fr"); c.route("**/visa-hostgo.rabehfly.workers.dev/**", lambda r: r.fulfill(status=500, body="{}", content_type="application/json", headers=CORS))
    p = c.new_page(); p.goto(B); settle(p); ok("erreur serveur : message d'erreur (pas « pas encore ouvertes »)", "Chargement impossible" in p.inner_text("#state"), p.inner_text("#state")); c.close()

    # 3. Avec l'API réelle
    c = b.new_context(viewport={"width": 390, "height": 844}, locale="fr"); c.route("**/visa-hostgo.rabehfly.workers.dev/**", forward)
    p = c.new_page(); errs = []; p.on("pageerror", lambda e: errs.append(str(e))); p.goto(B); settle(p)
    ok("5 offres approuvées affichées, compteur", cards(p) == 5 and "5 offre" in p.inner_text("#state"), p.inner_text("#state"))
    ok("aucune coordonnée dans la liste", not any(x in p.inner_text("#results") for x in ["@", "rue du Test", "seed"]))
    ok("pas de défilement horizontal sur mobile", not p.evaluate("document.documentElement.scrollWidth>innerWidth+1"))
    def f(sel, val): p.select_option(sel, val); settle(p)
    f("#f-country", "tn"); ok("filtre pays Tunisie : 2", cards(p) == 2, cards(p))
    f("#f-cat", "family"); ok("+ catégorie Vie en famille : 1 (Amel)", cards(p) == 1 and "Amel" in p.inner_text("#results"), p.inner_text("#results")[:80])
    p.click("#f-reset"); settle(p); ok("réinitialiser : 5", cards(p) == 5)
    f("#f-cat", "pets"); ok("catégorie Animaux : 1 (Lyon)", cards(p) == 1 and "Lyon" in p.inner_text("#results")); p.click("#f-reset"); settle(p)
    f("#f-stay", "1"); ok("séjour 1 semaine max : 2 (minimum ≤ 1 semaine)", cards(p) == 2, cards(p)); p.click("#f-reset"); settle(p)
    f("#f-lang", "0"); ok("langue arabe : 2", cards(p) == 2, cards(p)); p.click("#f-reset"); settle(p)
    f("#f-trav", "0"); ok("voyageurs nomades : 2", cards(p) == 2, cards(p)); f("#f-country", "dz"); ok("aucun résultat : message", cards(p) == 0 and "Aucune offre" in p.inner_text("#state")); p.click("#f-reset"); settle(p)
    # détail
    p.locator("#results .hgo-item", has_text="Sami").get_by_role("button").click(); p.wait_for_selector("#detail-view:not([hidden])"); p.wait_for_timeout(200)
    d = p.inner_text("#detail")
    ok("détail : textes, calendrier et auteur", "Ferme d'oliviers" in d and "Avr. 2026" in d and "Proposé par Sami" in d, d[:200])
    ok("détail : HTML saisi par l'hôte affiché comme texte (pas interprété)", "<b>test</b>" in d and p.locator("#detail b").count() == 0)
    ok("détail : e-mail et adresse absents avant déblocage", "@" not in d and "rue du Test" not in d)
    ok("boutons tactiles ≥ 44 px", all(p.locator(s).bounding_box()["height"] >= 43 for s in ["#d-contact", "#d-report"]))
    # signalement
    p.click("#d-report"); p.select_option("#report-reason", "scam"); p.fill("#report-note", "Demande de l'argent"); p.click("#report-go"); p.wait_for_timeout(500)
    ok("signalement envoyé : remerciement", "Merci" in p.inner_text("#contact-box"), p.inner_text("#contact-box"))
    # 3 contacts gratuits puis déblocage
    def contact_of(name):
        p.click("#back-list"); p.locator("#results .hgo-item", has_text=name).get_by_role("button").click(); p.wait_for_selector("#detail-view:not([hidden])"); p.wait_for_timeout(150); p.click("#d-contact"); p.wait_for_timeout(500)
    contact_of("Sami"); ok("contact 1 gratuit : e-mail affiché, 2 restants", "seed1@example.com" in p.inner_text("#contact-box") and "2 contact" in p.inner_text("#contact-box"), p.inner_text("#contact-box"))
    contact_of("Claire"); contact_of("Amel"); ok("contact 3 : 0 restant", "0 contact" in p.inner_text("#contact-box"), p.inner_text("#contact-box"))
    contact_of("Youssef"); ok("4e offre : déblocage demandé, pas d'e-mail", p.locator("#unlock-box").is_visible() and "seed4" not in p.inner_text("#detail"), p.inner_text("#detail")[-200:])
    p.fill("#unlock-code", "ABCDEF123456"); p.click("#unlock-go"); p.wait_for_timeout(500); ok("mauvais code : erreur", "invalide" in p.inner_text("#d-err"), p.inner_text("#d-err"))
    code = admin("/hg/admin/codes", {"n": 1, "days": 30})["codes"][0]
    p.fill("#unlock-code", code); p.click("#unlock-go"); p.wait_for_timeout(700)
    ok("bon code : coordonnées affichées et accès illimité annoncé", "seed4@example.com" in p.inner_text("#contact-box") and "Accès illimité" in p.inner_text("#contact-box"), p.inner_text("#contact-box"))
    ok("jeton visiteur seul en localStorage (aucune coordonnée)", "@" not in (p.evaluate("JSON.stringify(localStorage)")))
    ok("aucune erreur JavaScript", not errs, errs); c.close()

    # 4. Anglais et arabe : libellés traduits, pas de français résiduel
    for lg, words in [("en", ["Find a hosting offer", "Reset filters"]), ("ar", ["ابحث عن عرض استضافة", "إعادة ضبط المرشحات"])]:
        c = b.new_context(viewport={"width": 390, "height": 844}, locale=lg); c.route("**/visa-hostgo.rabehfly.workers.dev/**", forward)
        p = c.new_page(); p.goto(B + f"?lang={lg}"); settle(p); t = p.inner_text("body")
        ok(f"[{lg}] page traduite avec offres", all(w in t for w in words) and cards(p) == 5 and not any(w in t for w in ["Catégorie", "Séjour", "Réinitialiser", "Voir l’offre"]), t[:160])
        ok(f"[{lg}] pas de défilement horizontal", not p.evaluate("document.documentElement.scrollWidth>innerWidth+1")); c.close()
    b.close()
api.terminate(); srv.shutdown()
print(f"\n{sum(res)}/{len(res)} réussis"); sys.exit(0 if all(res) else 1)
