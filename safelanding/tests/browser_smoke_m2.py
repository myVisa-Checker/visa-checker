"""Test navigateur réel (Chromium) du Module 2 et de son intégration au Module 1. Serveur attendu sur le port 8765."""
import sys, json
from playwright.sync_api import sync_playwright
URL = "http://127.0.0.1:8765/index.html"
ok = lambda c, m: (print(("PASS " if c else "FAIL ") + m), c)[1]
R = []
V1 = {"version": 1, "profile": {"nationality": "TN", "residence": "TN", "destination": "DE", "transit": ["AE"], "departureDate": "2027-03-10",
      "stayDays": 10, "purpose": "tourism", "accommodation": "hotel", "birthDate": ""},
      "documents": {"lodging": {"address": "Rue Migration 7", "checkIn": "2027-03-10", "checkOut": "2027-03-20", "hostContact": ""}, "ticket": {"return": "2027-03-20"}},
      "handled": {"entry-authorization": True}, "changeReports": []}
def fill_profile(page):
    f = lambda n, v: page.fill(f"[name={n}]", v); s = lambda n, v: page.select_option(f"[name={n}]", v)
    s("nationality", "TN"); s("residence", "TN"); page.check("[name=showAllDestinations]"); s("destination", "DE"); f("departureDate", "2027-03-10"); f("stayDays", "10")
    s("purpose", "tourism"); s("accommodation", "private"); f("lodging_address", "3 Hauptstrasse Berlin"); f("lodging_host", "+49 30 000")
    f("arrival_airport", "cdg"); s("arrival_budget", "low"); s("arrival_bags", "yes"); f("ticket_return", "2027-03-20")
with sync_playwright() as p:
    b = p.chromium.launch()
    # ---- Parcours complet, mobile ----
    ctx = b.new_context(viewport={"width": 390, "height": 844}, locale="fr-FR"); page = ctx.new_page()
    errors = []; page.on("pageerror", lambda e: errors.append(str(e))); page.on("console", lambda m: m.type == "error" and errors.append(m.text))
    page.goto(URL); page.wait_for_load_state("networkidle")
    R.append(ok(page.locator("#tab-m1").get_attribute("aria-selected") == "true" and page.locator("h1").inner_text() == "Before Departure", "Module 1 affiché par défaut (titre inchangé)"))
    page.click("#tab-m2")
    R.append(ok(page.locator("h1").inner_text() == "Airport Arrival" and page.locator("#m2-empty").is_visible() and not page.locator("#panel-m1").is_visible(), "onglet Arrivée : titre, état vide, panneau M1 masqué"))
    page.click("#open-profile"); fill_profile(page); page.click("#save-profile")
    R.append(ok(page.locator("#m2-body").is_visible(), "UNE saisie de profil alimente le Module 2 (pas de second formulaire)"))
    txt = page.locator("#m2-questions").inner_text()
    R.append(ok("3 Hauptstrasse Berlin" in txt and "Tourisme" in txt and "Retour le 2027-03-20" in txt, "réponses de contrôle préremplies depuis les données du Module 1"))
    R.append(ok(page.locator("#m2-phases details").count() == 9, "9 phases du parcours d'arrivée"))
    body = page.locator("#m2-phases").text_content()  # text_content : inclut les phases repliées
    R.append(ok("Conseil pratique" in body and "Information officielle · Non vérifié" in body, "distinction conseil pratique / information officielle non vérifiée"))
    R.append(ok("Aéroport CDG : aucune donnée spécifique" in page.locator("#m2-airport").inner_text(), "aéroport sans données : conseils généraux annoncés"))
    R.append(ok("Adapté à votre budget" in body and "Récupération par votre hôte" in body, "transfert adapté au budget et à l'hébergement chez un particulier"))
    R.append(ok(all("noopener" in (a.get_attribute("rel") or "") for a in page.locator("#m2-phases a").all()), "liens sources : rel=noopener"))
    R.append(ok(page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"), "mobile 390 px : aucun défilement horizontal (Module 2)"))
    page.screenshot(path="/tmp/m2-shot.png")
    pt = page.locator("#m2-progress-text").inner_text()
    page.locator('[id="h-arrival:a-orient"]').check()
    R.append(ok(page.locator("#m2-progress-text").inner_text() != pt, "« Fait » met à jour la progression d'arrivée"))
    page.click("#tab-m1")
    R.append(ok(page.locator("#checklist").is_visible() and page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"), "retour au Module 1 : checklist intacte, sans débordement"))
    st = json.loads(page.evaluate("localStorage.getItem('safelanding.state')"))
    R.append(ok(st["version"] == 2 and st["arrival"]["airport"] == "CDG" and st["handled"].get("arrival:a-orient") and "number" not in json.dumps(st).lower(), "état v2 persisté (aéroport, étape cochée), sans numéro de passeport"))
    page.reload(); page.wait_for_load_state("networkidle"); page.click("#tab-m2")
    R.append(ok(page.locator('[id="h-arrival:a-orient"]').is_checked(), "étape cochée conservée après rechargement"))
    # ---- Hors connexion ----
    page.evaluate("navigator.serviceWorker.ready.then(()=>1)"); page.wait_for_timeout(1500)
    ctx.set_offline(True); page.reload(); page.wait_for_load_state("domcontentloaded"); page.wait_for_timeout(800); page.click("#tab-m2")
    R.append(ok(page.locator("#m2-body").is_visible() and "3 Hauptstrasse Berlin" in page.locator("#m2-questions").inner_text(), "hors connexion : Module 2 complet restitué"))
    ctx.set_offline(False)
    R.append(ok(not errors, "aucune erreur console/JS " + (str(errors[:2]) if errors else "")))
    ctx.close()
    # ---- Migration : un état v1 déjà enregistré doit survivre ----
    ctx2 = b.new_context(viewport={"width": 390, "height": 844}, locale="fr-FR")
    ctx2.add_init_script("if(!localStorage.getItem('safelanding.state')) localStorage.setItem('safelanding.state', %s);" % json.dumps(json.dumps(V1)))
    pg = ctx2.new_page(); e2 = []; pg.on("pageerror", lambda e: e2.append(str(e)))
    pg.goto(URL); pg.wait_for_load_state("networkidle")
    R.append(ok(pg.locator("#checklist").is_visible() and pg.locator("#h-entry-authorization").is_checked() and "Transit via AE" in pg.locator("#categories").inner_text(), "état v1 existant : Module 1 intact (checklist, « Traité », transit)"))
    pg.click("#tab-m2")
    R.append(ok("Rue Migration 7" in pg.locator("#m2-questions").inner_text(), "état v1 existant : données réutilisées par le Module 2"))
    pg.locator('[id="h-arrival:d-ready"]').check()
    st2 = json.loads(pg.evaluate("localStorage.getItem('safelanding.state')"))
    R.append(ok(st2["version"] == 2 and st2["handled"].get("entry-authorization") and st2["handled"].get("arrival:d-ready") and st2["profile"]["destination"] == "DE"
                and st2["documents"]["lodging"]["address"] == "Rue Migration 7", "après sauvegarde : v2, anciennes ET nouvelles données conservées"))
    R.append(ok(not e2, "migration sans erreur JS"))
    b.close()
print(f"\n{sum(R)}/{len(R)} vérifications réussies"); sys.exit(0 if all(R) else 1)
