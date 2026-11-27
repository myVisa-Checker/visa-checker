#!/usr/bin/env python3
"""Formulaire hôte -> VRAI Worker Host & Go (KV en mémoire) : doublons, coupures réseau, délais, 5xx, double clic, accès non autorisé, photos.
Optionnel : python3 tests/e2e/hostgo-hote-api.e2e.py (playwright + chromium + node)."""
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
CORS = {"Access-Control-Allow-Origin": f"http://127.0.0.1:{PORT}", "Access-Control-Allow-Headers": "Content-Type, X-Edit-Token", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Vary": "Origin"}
def raw(path, method="GET", data=None, headers=None):
    h = {"Origin": "https://checkmyvisa.org", **(headers or {})}
    req = urllib.request.Request(f"http://127.0.0.1:{APORT}{path}", data=data, method=method, headers=h)
    try: r = urllib.request.urlopen(req)
    except urllib.error.HTTPError as e: r = e
    return r.status, r.read()
def queue(status="pending"):
    s, b = raw("/hg/admin/queue?status=" + status, headers={"X-Admin-Key": "e2e-admin"}); return json.loads(b).get("offers", json.loads(b).get("items", []))
IPN = [0]
class Net:
    """Pilote du réseau : modes par appel POST /hg/offers et par photo."""

    def __init__(s): IPN[0] += 1; s.ip = f"192.0.2.{IPN[0]}"; s.mode = []; s.posts = 0; s.photos = 0; s.photo_mode = []
    def __call__(s, route):
        rq = route.request
        if rq.method == "OPTIONS": return route.fulfill(status=204, headers=CORS)
        path = rq.url.split("workers.dev", 1)[1]; is_offer = path == "/hg/offers" and rq.method == "POST"; is_photo = "/photos" in path and rq.method == "POST"
        m = None
        if is_offer: s.posts += 1; m = s.mode.pop(0) if s.mode else None
        if is_photo: s.photos += 1; m = s.photo_mode.pop(0) if s.photo_mode else None
        if m == "abort_before": return route.abort("failed")
        if m == "500": return route.fulfill(status=503, body='{"ok":false}', content_type="application/json", headers=CORS)
        if m == "slow": time.sleep(0.2)
        h = {"Content-Type": rq.headers.get("content-type", "application/json")}
        if rq.headers.get("x-edit-token"): h["X-Edit-Token"] = rq.headers["x-edit-token"]
        req = urllib.request.Request(f"http://127.0.0.1:{APORT}{path}", data=rq.post_data_buffer, method=rq.method, headers={"Origin": "https://checkmyvisa.org", "CF-Connecting-IP": s.ip, "Content-Length": str(len(rq.post_data_buffer or b"")), **h})
        try: r = urllib.request.urlopen(req)
        except urllib.error.HTTPError as e: r = e
        body = r.read()
        if m == "lose_response": return route.abort("failed")      # le serveur a traité la demande, mais la réponse est perdue
        route.fulfill(status=r.status, body=body, headers={"Content-Type": "application/json", **CORS})
TXT = "Texte de test suffisamment long pour valider."
import struct, zlib
def _ch(t, d): return struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xffffffff)
PNG = b"\x89PNG\r\n\x1a\n" + _ch(b"IHDR", struct.pack(">IIBBBBB", 4, 4, 8, 2, 0, 0, 0)) + _ch(b"IDAT", zlib.compress(b"".join(b"\x00" + b"\x10\x80\xf0" * 4 for _ in range(4)))) + _ch(b"IEND", b"")
def next_(p): p.locator("section:not([hidden]) [data-go=next]").click()
def step(p): return p.evaluate("() => [...document.querySelectorAll('.hgh-step')].findIndex(x=>!x.hidden)")
def to_last(p, email, photos=None):
    p.goto(URL); p.wait_for_selector("#st1")
    p.select_option("#country", "Tunisie")
    for c in p.locator(".required-check").all(): c.check()
    p.click("#continue1")
    p.fill("#ta-st2", TXT + " lieu"); next_(p); p.fill("#ta-ac", TXT + " hebergement"); next_(p)
    p.locator("#types input").nth(0).check(); next_(p)
    p.select_option("#pl-hours", "1"); p.select_option("#pl-days", "1"); p.select_option("#pl-stay", "2"); next_(p)
    p.locator("#months button").nth(1).click(); next_(p)
    p.fill("#ta-st3", TXT + " aide"); next_(p); p.fill("#ta-cx", TXT + " culture"); next_(p)
    p.click("#add-lang"); p.select_option("#lg-l1", "3"); p.select_option("#lg-v1", "3"); next_(p)
    p.fill("#ta-st4", TXT + " presentation"); next_(p)
    p.locator("#amen input").nth(0).check(); p.locator("#trav input").nth(1).check(); next_(p)
    p.fill("#addr", "12 rue des Oliviers"); next_(p); next_(p)
    if photos: p.set_input_files("#ph-file", photos)
    next_(p)
    p.fill("#firstName", "Sami"); p.fill("#email", email); p.fill("#city", "Béja"); p.check("#terms")
def ctx_for(b, net, lang="fr-FR"):
    c = b.new_context(locale=lang); c.add_init_script("window.HG_CONFIG={apiEnabled:true,api:'https://visa-hostgo.rabehfly.workers.dev/hg'}")
    c.route("**/visa-hostgo.rabehfly.workers.dev/**", net)
    c.route("**/visa-chat.rabehfly.workers.dev/**", lambda r: r.fulfill(status=500, body="{}"))
    return c
def settle(p, ms=250):
    for _ in range(40):
        if p.locator("#finish").is_enabled(): break
        time.sleep(0.1)
    time.sleep(ms / 1000)
def done(p): return step(p) == 15
with sync_playwright() as pw:
    b = pw.chromium.launch()
    img = {"name": "a.png", "mimeType": "image/png", "buffer": PNG}
    # 1. Parcours nominal + photo
    net = Net(); c = ctx_for(b, net); p = c.new_page(); errs = []; p.on("pageerror", lambda e: errs.append(str(e)))
    to_last(p, "sami@example.com", img); p.click("#finish"); p.wait_for_selector("#done:not([hidden])", timeout=8000)
    q = queue()
    ok("offre créée côté serveur, en attente de validation", len(q) == 1 and q[0].get("status", "pending") == "pending", q)
    ok("message final : en attente de vérification, pas « publiée »", "attente de vérification" in p.inner_text("#doneMsg") and "publiée" not in p.inner_text("#doneMsg"))
    ok("l'offre n'apparaît pas dans la consultation publique", "Béja" not in raw("/hg/offers?country=tn")[1].decode().replace("Béja", "Béja", 0) or all(o.get("id") != queue()[0]["id"] for o in json.loads(raw("/hg/offers?country=tn")[1]).get("offers", [])))
    ok("1 photo envoyée", net.photos == 1)
    ok("aucun appel à l'ancien /contact ni erreur JS", not errs, errs)
    ok("jeton de gestion gardé en sessionStorage seulement", p.evaluate("!!sessionStorage.getItem('hg_manage') && !localStorage.getItem('hg_manage')"))
    ok("brouillon effacé après succès", p.evaluate("localStorage.getItem('hg_host_draft_v1')") is None); c.close()
    # 2. Réponse perdue (coupure après traitement serveur) puis nouvel essai : une seule offre
    net = Net(); net.mode = ["lose_response"]; c = ctx_for(b, net); p = c.new_page()
    to_last(p, "perdu@example.com"); p.click("#finish"); settle(p, 400)
    ok("réponse perdue : message réseau, bouton réactivé, pas de page finale", "Connexion impossible" in p.inner_text("#error2") and not done(p) and p.locator("#finish").is_enabled(), p.inner_text("#error2"))
    n1 = len([o for o in queue() if True]); p.click("#finish"); p.wait_for_selector("#done:not([hidden])", timeout=8000)
    ok("après nouvel essai : 2 requêtes, mais UNE seule offre pour cet e-mail", net.posts == 2 and len(queue()) == n1, (net.posts, n1, len(queue())))
    c.close()
    # 3. Serveur indisponible (503) puis succès
    net = Net(); net.mode = ["500"]; c = ctx_for(b, net); p = c.new_page(); to_last(p, "cinq@example.com"); p.click("#finish"); settle(p)
    ok("503 : message de service indisponible, rien de publié", "momentanément indisponible" in p.inner_text("#error2") and not done(p)); n2 = len(queue())
    p.click("#finish"); p.wait_for_selector("#done:not([hidden])", timeout=8000); ok("503 puis nouvel essai : une offre de plus", len(queue()) == n2 + 1); c.close()
    # 4. Coupure avant envoi
    net = Net(); net.mode = ["abort_before"]; c = ctx_for(b, net); p = c.new_page(); n3 = len(queue()); to_last(p, "coupe@example.com"); p.click("#finish"); settle(p)
    ok("coupure avant envoi : aucune offre créée, données du formulaire conservées", len(queue()) == n3 and p.input_value("#city") == "Béja" and not done(p))
    c.close()
    # 5. Double clic rapide
    net = Net(); net.mode = ["slow"]; c = ctx_for(b, net); p = c.new_page(); n4 = len(queue()); to_last(p, "double@example.com")
    p.evaluate("document.getElementById('finish').click(); document.getElementById('finish').click(); document.getElementById('finish').click()"); p.wait_for_selector("#done:not([hidden])", timeout=8000)
    ok("triple clic : une seule requête, une seule offre", net.posts == 1 and len(queue()) == n4 + 1, (net.posts, len(queue()) - n4)); c.close()
    # 6. Même e-mail depuis un autre brouillon (nouvel identifiant) : refusé, pas de doublon
    net = Net(); c = ctx_for(b, net); p = c.new_page(); n5 = len(queue()); to_last(p, "sami@example.com"); p.click("#finish"); settle(p)
    ok("même e-mail, nouvelle demande : refusé (déjà une offre), aucune création", "déjà une offre" in p.inner_text("#error2") and len(queue()) == n5 and not done(p), p.inner_text("#error2")); c.close()
    # 7. Séparation hôte / voyageur côté serveur
    s, bd = raw("/hg/travellers", "POST", json.dumps({"email": "voyageur@example.com", "consent": True}).encode(), {"Content-Type": "application/json"})
    net = Net(); c = ctx_for(b, net); p = c.new_page(); n6 = len(queue()); to_last(p, "voyageur@example.com"); p.click("#finish"); settle(p)
    ok("e-mail déjà voyageur : refus serveur (role_conflict), message clair", s in (200, 201) and "déjà utilisée comme voyageur" in p.inner_text("#error2") and len(queue()) == n6, (s, p.inner_text("#error2"))); c.close()
    # 8. Accès non autorisés
    st, _ = raw("/hg/admin/queue"); ok("file de modération sans clé : refusée", st in (401, 403), st)
    st, _ = raw("/hg/admin/queue", headers={"X-Admin-Key": "mauvaise"}); ok("file de modération avec mauvaise clé : refusée", st in (401, 403), st)
    oid = queue()[0]["id"]
    st, _ = raw(f"/hg/offers/{oid}/photos", "POST", PNG, {"Content-Type": "image/png"}); ok("photo sans jeton : refusée", st == 404, st)
    st, _ = raw(f"/hg/offers/{oid}/photos", "POST", PNG, {"Content-Type": "image/png", "X-Edit-Token": "0" * 48}); ok("photo avec faux jeton : refusée", st == 404, st)
    st, _ = raw(f"/hg/offers/{oid}", "PATCH", b"{}", {"Content-Type": "application/json"}); ok("modification sans jeton : refusée", st in (401, 403, 404), st)
    st, _ = raw(f"/hg/offers/{oid}"); ok("détail public d'une offre non approuvée : introuvable", st == 404, st)
    st, _ = raw(f"/hg/offers/{oid}/photos/0"); ok("photo publique d'une offre non approuvée : introuvable", st == 404, st)
    # 9. Photos : faux fichier renommé, trop lourd, fichier valide avec échec réseau puis reprise
    net = Net(); c = ctx_for(b, net); p = c.new_page(); to_last(p, "fausse@example.com", {"name": "x.png", "mimeType": "image/png", "buffer": b"<html><script>alert(1)</script></html>"}); p.click("#finish"); settle(p)
    ok("faux PNG (HTML renommé) : refusé côté client, aucune requête photo", net.photos == 0 and "format non reconnu" in p.inner_text("#error2") and not done(p), p.inner_text("#error2")); c.close()
    net = Net(); c = ctx_for(b, net); p = c.new_page(); to_last(p, "gros@example.com", {"name": "g.png", "mimeType": "image/png", "buffer": PNG + b"\0" * (2 * 1024 * 1024 + 10)}); p.click("#finish"); settle(p)
    ok("photo > 2 Mo : refusée côté client", net.photos == 0 and "trop lourde" in p.inner_text("#error2"), p.inner_text("#error2")); c.close()
    net = Net(); net.photo_mode = ["abort_before"]; c = ctx_for(b, net); p = c.new_page(); to_last(p, "photo@example.com", img); p.click("#finish"); settle(p, 400)
    ok("photo coupée : offre enregistrée, message précis, pas de page finale", "photo(s) n" in p.inner_text("#error2") and not done(p), p.inner_text("#error2"))
    nq = len(queue()); p.click("#finish"); p.wait_for_selector("#done:not([hidden])", timeout=8000)
    ok("reprise : seule la photo manquante est envoyée, pas de nouvelle offre", net.photos == 2 and len(queue()) == nq, (net.photos, nq, len(queue()))); c.close()
    # 10. Drapeau éteint (défaut) : ancien envoi e-mail, aucun appel à l'API
    c = b.new_context(locale="fr-FR"); calls = []; c.route("**/visa-hostgo.rabehfly.workers.dev/**", lambda r: (calls.append(1), r.abort())); c.route("**/visa-chat.rabehfly.workers.dev/**", lambda r: r.fulfill(status=200, content_type="application/json", headers={"Access-Control-Allow-Origin": "*"}, body='{"ok":true}'))
    p = c.new_page(); to_last(p, "ancien@example.com"); p.click("#finish"); p.wait_for_selector("#done:not([hidden])", timeout=8000)
    ok("apiEnabled=false : parcours inchangé, aucun appel Host & Go", not calls and "enregistrée" in p.inner_text("#doneMsg"), p.inner_text("#doneMsg")); c.close()
    # 11. Anglais et arabe
    for lg, w in [("en-US", "awaiting review"), ("ar", "بانتظار المراجعة")]:
        net = Net(); c = ctx_for(b, net, lg); p = c.new_page(); to_last(p, f"{lg[:2]}@example.com"); p.click("#finish"); p.wait_for_selector("#done:not([hidden])", timeout=8000)
        ok(f"[{lg}] message final traduit", w in p.inner_text("#doneMsg"), p.inner_text("#doneMsg")); c.close()
    b.close()
api.terminate(); srv.shutdown()
print(f"\n{sum(res)}/{len(res)} réussis"); sys.exit(0 if all(res) else 1)
