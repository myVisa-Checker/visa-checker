#!/usr/bin/env python3
"""Parcours complet Host & Go dans le navigateur, contre le VRAI Worker : hôte publie -> modération (interface admin) -> voyageur consulte (photos, coordonnées protégées, signalement) -> retrait.
Optionnel : python3 tests/e2e/hostgo-parcours.e2e.py (playwright + chromium + node)."""
import atexit, json, os, subprocess, sys, threading, http.server, socketserver, functools, urllib.request, urllib.error, time
from playwright.sync_api import sync_playwright
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(("127.0.0.1", 0), functools.partial(Q, directory=ROOT)); PORT = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
api = subprocess.Popen(["node", os.path.join(ROOT, "tests/e2e/hostgo-api-server.mjs")], stdout=subprocess.PIPE, text=True)
atexit.register(api.terminate)
atexit.register(api.terminate)
APORT = int(api.stdout.readline().split()[1])
URL = f"http://127.0.0.1:{PORT}/hostgo-hote.html"
res = []
def ok(n, c, d=""):
    res.append(bool(c)); print(("  ok   " if c else "  FAIL ") + n + ("" if c else " : " + str(d)))
CORS = {"Access-Control-Allow-Origin": f"http://127.0.0.1:{PORT}", "Access-Control-Allow-Headers": "Content-Type, X-Edit-Token, X-Admin-Key, Authorization", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Vary": "Origin"}
def raw(path, method="GET", data=None, headers=None):
    h = {"Origin": "https://checkmyvisa.org", **(headers or {})}
    req = urllib.request.Request(f"http://127.0.0.1:{APORT}{path}", data=data, method=method, headers=h)
    try: r = urllib.request.urlopen(req)
    except urllib.error.HTTPError as e: r = e
    return r.status, r.read()
def queue(status="pending"):
    s, b = raw("/hg/admin/queue?status=" + status, headers={"X-Admin-Key": "e2e-admin"}); return json.loads(b).get("offers", json.loads(b).get("items", []))
IPN = [0]

IPN = [0]
def forward_for():
    IPN[0] += 1; ip = f"198.18.0.{IPN[0]}"
    def f(route):
        rq = route.request
        if rq.method == "OPTIONS": return route.fulfill(status=204, headers=CORS)
        path = rq.url.split("workers.dev", 1)[1]
        h = {"Origin": "https://checkmyvisa.org", "CF-Connecting-IP": ip, "Content-Type": rq.headers.get("content-type", "application/json"), "Content-Length": str(len(rq.post_data_buffer or b""))}
        for k in ("x-edit-token", "x-admin-key", "authorization"):
            if rq.headers.get(k): h[k] = rq.headers[k]
        req = urllib.request.Request(f"http://127.0.0.1:{APORT}{path}", data=rq.post_data_buffer, method=rq.method, headers=h)
        try: r = urllib.request.urlopen(req)
        except urllib.error.HTTPError as e: r = e
        route.fulfill(status=r.status, body=r.read(), headers={"Content-Type": r.headers.get("Content-Type", "application/json"), **CORS})
    return f
def ctx(b, lang="fr-FR", api_on=True):
    c = b.new_context(locale=lang)
    if api_on: c.add_init_script("window.HG_CONFIG={apiEnabled:true,api:'https://visa-hostgo.rabehfly.workers.dev/hg'}")
    c.route("**/visa-hostgo.rabehfly.workers.dev/**", forward_for()); return c
TXT = "Texte de test suffisamment long pour valider."
import struct, zlib
def _ch(t, d): return struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xffffffff)
PNG = b"\x89PNG\r\n\x1a\n" + _ch(b"IHDR", struct.pack(">IIBBBBB", 4, 4, 8, 2, 0, 0, 0)) + _ch(b"IDAT", zlib.compress(b"".join(b"\x00" + b"\x10\x80\xf0" * 4 for _ in range(4)))) + _ch(b"IEND", b"")
def next_(p): p.locator("section:not([hidden]) [data-go=next]").click()
def step(p): return p.evaluate("() => [...document.querySelectorAll('.hgh-step')].findIndex(x=>!x.hidden)")
def host_publish(p, email, city):
    p.goto(f"http://127.0.0.1:{PORT}/hostgo-hote.html"); p.wait_for_selector("#st1")
    p.select_option("#country", "Tunisie")
    for c in p.locator(".required-check").all(): c.check()
    p.click("#continue1")
    p.fill("#ta-st2", TXT + " lieu"); next_(p); p.fill("#ta-ac", TXT + " hebergement"); next_(p)
    p.locator("#types input").nth(1).check(); next_(p)
    p.select_option("#pl-hours", "1"); p.select_option("#pl-days", "1"); p.select_option("#pl-stay", "2"); next_(p)
    p.locator("#months button").nth(1).click(); next_(p)
    p.fill("#ta-st3", TXT + " aide"); next_(p); p.fill("#ta-cx", TXT + " culture"); next_(p)
    p.click("#add-lang"); p.select_option("#lg-l1", "3"); p.select_option("#lg-v1", "3"); next_(p)
    p.fill("#ta-st4", TXT + " presentation"); next_(p)
    p.locator("#amen input").nth(0).check(); p.locator("#trav input").nth(1).check(); next_(p)
    p.fill("#addr", "12 rue des Oliviers"); next_(p); next_(p)
    p.set_input_files("#ph-file", {"name": "a.png", "mimeType": "image/png", "buffer": PNG}); next_(p)
    p.fill("#firstName", "Nadia"); p.fill("#email", email); p.fill("#city", city); p.check("#terms"); p.click("#finish")
    p.wait_for_selector("#done:not([hidden])", timeout=10000)
def settle(p):
    for _ in range(30):
        time.sleep(0.15)
        if "Chargement" not in p.inner_text("#state"): break
    time.sleep(0.3)
ADMIN_URL = f"http://127.0.0.1:{PORT}/hostgo-admin.html"; OFFRES = f"http://127.0.0.1:{PORT}/hostgo-offres.html"
CITY = "Kélibia"
with sync_playwright() as pw:
    b = pw.chromium.launch(); errs = []
    # 1. L'hôte publie gratuitement depuis le formulaire
    c = ctx(b); p = c.new_page(); p.on("pageerror", lambda e: errs.append(str(e))); host_publish(p, "nadia@example.com", CITY)
    ok("hôte : offre enregistrée, message « en attente de vérification »", "attente de vérification" in p.inner_text("#doneMsg")); c.close()
    # 2. Rien de public avant modération
    c = ctx(b); p = c.new_page(); p.goto(OFFRES); settle(p)
    ok("voyageur : l'offre n'est pas visible avant approbation", CITY not in p.inner_text("#results")); c.close()
    # 3. Interface d'administration
    c = ctx(b); a = c.new_page(); a.on("pageerror", lambda e: errs.append(str(e))); a.goto(ADMIN_URL)
    ok("admin : rien n'est listé avant connexion", a.locator("#app").is_hidden() and a.locator("#login").is_visible())
    ok("admin : page non indexable", a.evaluate("document.querySelector('meta[name=robots]').content").startswith("noindex"))
    a.fill("#key", "mauvaise"); a.click("#go"); a.wait_for_timeout(500); ok("admin : mauvaise clé refusée", "refusée" in a.inner_text("#login-err") and a.locator("#app").is_hidden())
    a.fill("#key", "e2e-admin"); a.click("#go"); a.wait_for_selector("#app:not([hidden])"); a.wait_for_timeout(300)
    ok("admin : clé non stockée (ni localStorage ni sessionStorage) et champ vidé", a.evaluate("localStorage.length + sessionStorage.length") == 0 and a.input_value("#key") == "")
    ok("admin : l'offre est dans « En attente »", a.locator("#items .hgo-item", has_text=CITY).count() == 1, a.inner_text("#tabs"))
    a.locator("#items .hgo-item", has_text=CITY).get_by_role("button").click(); a.wait_for_selector("#detail:not([hidden])"); a.wait_for_timeout(600)
    d = a.inner_text("#detail")
    ok("admin : détail complet (e-mail, adresse, textes) et photo visible", "nadia@example.com" in d and "12 rue des Oliviers" in d and "hebergement" in d and a.locator("#detail img").count() == 1 and a.evaluate("document.querySelector('#detail img').naturalWidth") > 0, d[:200])
    a.click("#detail >> text=Approuver"); a.wait_for_timeout(700)
    ok("admin : approuvée, sortie de la file « En attente »", a.locator("#items .hgo-item", has_text=CITY).count() == 0)
    # 4. Le voyageur consulte, voit la photo, coordonnées protégées, signale
    c2 = ctx(b); p = c2.new_page(); p.on("pageerror", lambda e: errs.append(str(e))); p.goto(OFFRES); settle(p)
    card = p.locator("#results .hgo-item", has_text=CITY)
    ok("voyageur : l'offre approuvée apparaît avec sa photo en couverture", card.count() == 1 and card.locator("img.hgo-cover").count() == 1)
    p.wait_for_timeout(400); ok("voyageur : la photo se charge réellement", p.evaluate("[...document.querySelectorAll('img.hgo-cover')].some(i=>i.naturalWidth>0)"))
    card.get_by_role("button").click(); p.wait_for_selector("#detail-view:not([hidden])"); p.wait_for_timeout(500)
    ok("voyageur : détail avec galerie de photos", p.locator("#d-photos img").count() == 1 and p.evaluate("document.querySelector('#d-photos img').naturalWidth") > 0)
    dd = p.inner_text("#detail")
    ok("voyageur : e-mail et adresse masqués avant révélation", "@" not in dd and "Oliviers" not in dd)
    p.click("#d-contact"); p.wait_for_timeout(600); ok("voyageur : coordonnées révélées via le système d'accès (2 restants)", "nadia@example.com" in p.inner_text("#contact-box") and "2 contact" in p.inner_text("#contact-box"), p.inner_text("#contact-box"))
    p.click("#d-report"); p.select_option("#report-reason", "fake"); p.fill("#report-note", "Doute"); p.click("#report-go"); p.wait_for_timeout(600)
    ok("voyageur : signalement envoyé", "Merci" in p.inner_text("#contact-box"), p.inner_text("#contact-box"))
    # 5. L'admin voit le signalement puis retire l'offre
    a.click("#tabs >> text=Signalées"); a.wait_for_timeout(600)
    ok("admin : l'offre figure dans « Signalées »", a.locator("#items .hgo-item", has_text=CITY).count() == 1 and "1 signalement" in a.inner_text("#items"))
    a.locator("#items .hgo-item", has_text=CITY).get_by_role("button").click(); a.wait_for_timeout(400); ok("admin : motif du signalement affiché", "Fausse offre" in a.inner_text("#detail") and "Doute" in a.inner_text("#detail"))
    a.on("dialog", lambda dlg: dlg.accept()); a.click("#detail >> text=Retirer définitivement"); a.wait_for_timeout(800)
    p2 = c2.new_page(); p2.goto(OFFRES); settle(p2)
    ok("voyageur : l'offre retirée a disparu de la consultation", CITY not in p2.inner_text("#results"))
    a.click("#tabs >> text=Retirées"); a.wait_for_timeout(600); ok("admin : offre retirée, données personnelles effacées", a.locator("#items .hgo-item").count() >= 1 and "nadia@example.com" not in a.inner_text("#items"))
    a.click("#out"); ok("admin : déconnexion, liste vidée", a.locator("#login").is_visible() and a.locator("#items .hgo-item").count() == 0)
    c.close(); c2.close()
    # 6. Verrouillage admin
    c = ctx(b); a = c.new_page(); a.goto(ADMIN_URL)
    for i in range(11): a.fill("#key", f"faux{i}"); a.click("#go"); a.wait_for_timeout(120)
    a.fill("#key", "e2e-admin"); a.click("#go"); a.wait_for_timeout(500); ok("admin : après trop d'essais, même la bonne clé est bloquée un moment", "patientez" in a.inner_text("#login-err"), a.inner_text("#login-err")); c.close()
    # 7. Séparation Hôte / Traveller côté serveur (formulaire voyageur branché sur /hg/travellers)
    def traveller(email, lang="fr-FR"):
        c = ctx(b, lang); c.route("**/visa-chat.rabehfly.workers.dev/**", lambda r: r.fulfill(status=200, content_type="application/json", headers={"Access-Control-Allow-Origin": "*"}, body='{"ok":true}'))
        p = c.new_page(); p.on("pageerror", lambda e: errs.append(str(e))); p.goto(f"http://127.0.0.1:{PORT}/hostgo-voyageur.html"); p.wait_for_timeout(400)
        p.locator("section:not([hidden]) [data-go=next]").click(); p.fill("#firstName", "Lina"); p.fill("#email", email); p.fill("#country", "France"); p.fill("#city", "Lyon"); p.check("#terms"); p.click("#finish"); p.wait_for_timeout(1200)
        return c, p
    c = ctx(b); p = c.new_page(); host_publish(p, "hote2@example.com", "Sousse"); c.close()
    c, p = traveller("hote2@example.com")
    ok("voyageur avec l'e-mail d'un hôte : refusé par le serveur, message clair, pas de page finale", "déjà utilisée comme compte Hôte" in p.inner_text("#error2") and p.locator("#done").is_hidden(), p.inner_text("#error2")); c.close()
    c, p = traveller("lina@example.com")
    ok("voyageur avec un nouvel e-mail : inscription acceptée", p.locator("#done").is_visible(), p.inner_text("#error2")); c.close()
    c = ctx(b); p = c.new_page(); p.goto(f"http://127.0.0.1:{PORT}/hostgo-hote.html"); p.wait_for_selector("#st1")
    try: host_publish(p, "lina@example.com", "Lyon")
    except Exception: pass
    ok("hôte avec l'e-mail d'un voyageur : refusé par le serveur", "déjà utilisée comme voyageur" in p.inner_text("#error2") and p.locator("#done").is_hidden(), p.inner_text("#error2")); c.close()
    c, p = traveller("anglais@example.com", "en-US"); ok("voyageur EN : inscription acceptée", p.locator("#done").is_visible()); c.close()
    ok("aucune erreur JavaScript pendant tout le parcours", not errs, errs)
    c.close(); b.close()
api.terminate(); srv.shutdown()
print(f"\n{sum(res)}/{len(res)} réussis"); sys.exit(0 if all(res) else 1)
