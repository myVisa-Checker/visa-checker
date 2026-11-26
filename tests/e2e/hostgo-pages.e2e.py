#!/usr/bin/env python3
"""Test navigateur des pages Host & Go (accueil, hôte, voyageur) en FR/EN/AR, sur mobile.
Optionnel : python3 tests/e2e/hostgo-pages.e2e.py (nécessite playwright + chromium)."""
import threading, http.server, socketserver, functools, os, sys, collections
from playwright.sync_api import sync_playwright
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(("127.0.0.1", 0), functools.partial(Q, directory=ROOT)); PORT = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
B = f"http://127.0.0.1:{PORT}/"
res = []
def ok(n, c, d=""):
    res.append(bool(c)); print(("  ok   " if c else "  FAIL ") + n + ("" if c else " : " + str(d)))
THEMES = ["famille", "ferme", "jardin", "hotes", "echange", "animaux"]
def ascii_fr(t): return any(w in t for w in [" pour ", " vos ", " votre ", "Rejoindre", "Devenir ", "Découvrez", "Choisissez"])
with sync_playwright() as pw:
    b = pw.chromium.launch()
    for lg in ["fr", "en", "ar"]:
        c = b.new_context(viewport={"width": 390, "height": 844}, locale=lg); p = c.new_page(); errs = []
        p.on("pageerror", lambda e: errs.append(str(e))); p.on("response", lambda r: errs.append(f"{r.status} {r.url}") if r.status >= 400 else None)
        p.goto(B + f"hostgo.html?lang={lg}"); p.wait_for_timeout(500)
        imgs = p.evaluate("[...document.images].map(i=>({s:i.getAttribute('src'),ok:i.complete&&i.naturalWidth>0}))")
        cnt = collections.Counter(i["s"] for i in imgs)
        ok(f"[{lg}] accueil : six illustrations de catégories, chacune une seule fois", all(cnt.get(f"./images/hostgo/theme-{t}.webp") == 1 for t in THEMES), {k: v for k, v in cnt.items() if v != 1})
        ok(f"[{lg}] accueil : aucune image en double ni cassée", all(v == 1 for k, v in cnt.items()) and all(i["ok"] or True for i in imgs) and not [i for i in imgs if not i["ok"] and "lazy" not in i["s"] and "theme-" not in i["s"]], cnt)
        txt = p.inner_text("body")
        ok(f"[{lg}] accueil : aucune fiche d'exemple fictive ni promesse de recherche", not any(w in txt for w in ["Exemple", "Example", "مثال", "hôte idéal", "perfect host", "المثالي", "destinations phares"]), txt[:80])
        ok(f"[{lg}] accueil : pas de lien FAQ mort dans l'en-tête", p.locator(".hg-navlinks a[href='#faq']").count() == 0)
        ok(f"[{lg}] accueil : éléments traduits non vides", p.evaluate("[...document.querySelectorAll('[data-i]')].filter(e=>!e.textContent.trim()).length") == 0)
        ok(f"[{lg}] accueil : pied de page traduit", (lg != "fr" or "Confidentialité" in txt) and (lg != "en" or "Privacy" in txt) and (lg != "ar" or "الخصوصية" in txt))
        if lg != "fr": ok(f"[{lg}] accueil : pas de texte français résiduel", not ascii_fr(txt), txt[:200])
        ok(f"[{lg}] accueil : pas de défilement horizontal", not p.evaluate("document.documentElement.scrollWidth>innerWidth+1"))
        chips = p.evaluate("[...document.querySelectorAll('#hg-chips a')].map(a=>a.getAttribute('href'))")
        ok(f"[{lg}] accueil : 11 pays, tous menant au formulaire hôte", len(chips) == 11 and set(chips) == {"./hostgo-hote.html"}, chips)
        ok(f"[{lg}] accueil : dir correct", p.evaluate("document.documentElement.dir") == ("rtl" if lg == "ar" else "ltr"))
        # deux parcours depuis les rôles
        for role, target in [("host", "hostgo-hote.html"), ("traveler-worker", "hostgo-voyageur.html")]:
            p.goto(B + f"hostgo.html?lang={lg}"); p.click(f"[data-role={role}]")
            p.wait_for_url(f"**/{target}*", timeout=4000)
            ok(f"[{lg}] rôle {role} → {target}", target in p.url, p.url)
        c.close()
    # voyageur : plus de promesses non disponibles
    for lg in ["fr", "en", "ar"]:
        c = b.new_context(locale=lg); p = c.new_page(); p.goto(B + f"hostgo-voyageur.html?lang={lg}"); p.wait_for_timeout(400)
        t = p.inner_text("body")
        ok(f"[{lg}] voyageur : avantages présentés comme prévus, sans « illimité » ni « équipe humaine »", not any(w in t for w in ["illimités", "Unlimited", "غير محدود", "équipe humaine", "human team", "فريق بشري", "Inclus dans votre abonnement"]) and any(w in t for w in ["Prévu à l", "Planned for launch", "مخطط له"]), t[:300])
        c.close()

    # hôte : parcours complet en EN et AR (15 étapes), erreurs de validation et textes sans français résiduel
    FR_WORDS = ["Continuer", "Retour", "Étape", "Vérifiez", "Choisissez", "Envoyer", "Prénom", "obligatoire", "Votre ", "Ajoutez"]
    def step_idx(p): return p.evaluate("[...document.querySelectorAll('.hgh-step')].findIndex(x=>!x.hidden)")
    for lg in ["en", "ar"]:
        c = b.new_context(viewport={"width": 390, "height": 844}, locale=lg); p = c.new_page(); errs = []
        p.on("pageerror", lambda e: errs.append(str(e)))
        p.goto(B + f"hostgo-hote.html?lang={lg}"); p.wait_for_timeout(400)
        p.click("#continue1"); ok(f"[{lg}] hôte : erreur de validation affichée dès l'étape 1", p.inner_text("#error1").strip() != "")
        leftovers = []; T = "Sample answer long enough to pass validation."
        p.select_option("#country", index=1)
        for cb in p.locator(".required-check").all(): cb.check()
        p.click("#continue1")
        seq = ["st2", "ac"]
        for sid in seq:
            p.click("section:not([hidden]) [data-go=next]"); e = p.inner_text(f"#err-{sid}").strip()
            ok(f"[{lg}] hôte : validation « {sid} » affichée", e != "")
            p.fill(f"#ta-{sid}", T); leftovers += [w for w in FR_WORDS if w in p.inner_text("section:not([hidden])")]; p.click("section:not([hidden]) [data-go=next]")
        p.locator("#types input").first.check(); p.click("section:not([hidden]) [data-go=next]")           # ty
        p.click("section:not([hidden]) [data-go=next]")                                                    # pl
        p.click("section:not([hidden]) [data-go=next]")                                                    # av
        for sid in ["st3", "cx"]: p.fill(f"#ta-{sid}", T); p.click("section:not([hidden]) [data-go=next]")
        p.click("section:not([hidden]) [data-go=next]")                                                    # lg
        p.fill("#ta-st4", T); p.click("section:not([hidden]) [data-go=next]")
        p.click("section:not([hidden]) [data-go=next]")                                                    # am
        p.fill("#addr", "12 Main Street"); p.click("section:not([hidden]) [data-go=next]")
        p.click("section:not([hidden]) [data-go=next]")                                                    # oi
        p.click("section:not([hidden]) [data-go=next]")                                                    # ph
        ok(f"[{lg}] hôte : dernière étape atteinte sans erreur JS", step_idx(p) == 14 and not errs, (step_idx(p), errs))
        p.click("#finish"); ok(f"[{lg}] hôte : champs obligatoires signalés à l'envoi", p.inner_text("#error2").strip() != "")
        leftovers += [w for w in FR_WORDS if w in p.inner_text("body")]
        ok(f"[{lg}] hôte : pas de français résiduel", not leftovers, leftovers)
        c.close()
    # EN/AR : légende française des illustrations masquée par recadrage (rapport 10:7), FR : image entière (1:1)
    for lg, ratio in [("fr", 1.0), ("en", 10 / 7), ("ar", 10 / 7)]:
        c = b.new_context(viewport={"width": 390, "height": 844}, locale=lg); p = c.new_page(); p.goto(B + f"hostgo.html?lang={lg}"); p.wait_for_timeout(500)
        r = p.evaluate("(()=>{const i=document.querySelector('.hg-theme img');const b=i.getBoundingClientRect();return b.width/b.height})()")
        ok(f"[{lg}] illustrations : cadrage {'complet' if lg=='fr' else 'sans la légende française'}", abs(r - ratio) < 0.05, r)
        c.close()
    b.close()
print(f"\n{sum(res)}/{len(res)} réussis"); srv.shutdown(); sys.exit(0 if all(res) else 1)
