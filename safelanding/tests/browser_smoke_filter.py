"""Test navigateur : choix de la nationalité puis du pays, liste de destinations filtrée. Serveur attendu sur le port 8765."""
import sys, json
from playwright.sync_api import sync_playwright
URL = "http://127.0.0.1:8765/index.html"
ok = lambda c, m: (print(("PASS " if c else "FAIL ") + m), c)[1]
R = []
opts = lambda page, sel: page.locator(f"{sel} option").all_inner_texts()
with sync_playwright() as p:
    b = p.chromium.launch(); ctx = b.new_context(viewport={"width": 390, "height": 844}, locale="fr-FR"); page = ctx.new_page()
    errors = []; page.on("pageerror", lambda e: errors.append(str(e))); page.on("console", lambda m: m.type == "error" and errors.append(m.text))
    page.goto(URL); page.wait_for_load_state("networkidle")
    R.append(ok(page.locator("#quickstart").is_visible() and page.locator("[name=qs_nationality]").count() == 1, "écran d'accueil : case nationalité puis case destination"))
    order = page.evaluate("[...document.querySelectorAll('#quickstart select')].map(s=>s.name)")
    R.append(ok(order == ["qs_nationality", "qs_destination"], "ordre : 1) nationalité, 2) destination"))
    R.append(ok("Choisissez d’abord votre nationalité" in page.locator("#qs-hint").inner_text(), "sans nationalité : invitation à choisir d'abord la nationalité"))
    page.select_option("[name=qs_nationality]", "TN")
    o = opts(page, "[name=qs_destination]")
    R.append(ok(len(o) == 2 and "Brésil" in o[1] and "à confirmer" in o[1], f"nationalité Tunisie : la liste ne contient que {o[1:]} (signalé « à confirmer »)"))
    R.append(ok("à confirmer à la source officielle" in page.locator("#qs-hint").inner_text(), "mention : base en cours de constitution, à confirmer"))
    page.select_option("[name=qs_nationality]", "FR")
    R.append(ok(len(opts(page, "[name=qs_destination]")) == 1 and "Aucune destination sans visa" in page.locator("#qs-hint").inner_text(), "nationalité sans règle enregistrée : liste vide + explication (rien n'est supposé)"))
    page.check("[name=qs_all]")
    R.append(ok(len(opts(page, "[name=qs_destination]")) > 150, "case « Afficher aussi… » : tous les pays disponibles"))
    page.uncheck("[name=qs_all]"); page.select_option("[name=qs_nationality]", "TN"); page.select_option("[name=qs_destination]", "BR")
    R.append(ok(page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"), "mobile 390 px : aucun débordement horizontal"))
    page.screenshot(path="/tmp/filter-home.png")
    page.click("#quickstart button[type=submit]")
    R.append(ok(page.locator("#profile-dialog").evaluate("d => d.open"), "« Continuer » ouvre le profil"))
    R.append(ok(page.input_value("[name=nationality]") == "TN" and page.input_value("[name=destination]") == "BR", "nationalité et destination déjà reprises : pas de ressaisie"))
    R.append(ok(opts(page, "[name=destination]")[1:] and len(opts(page, "[name=destination]")) == 2, "profil : même liste filtrée pour la nationalité choisie"))
    st = json.loads(page.evaluate("localStorage.getItem('safelanding.state')"))
    R.append(ok(st["profile"]["nationality"] == "TN" and st["profile"]["destination"] == "BR", "choix enregistrés dans l'état partagé"))
    f = lambda n, v: page.fill(f"[name={n}]", v); s = lambda n, v: page.select_option(f"[name={n}]", v)
    s("residence", "TN"); f("departureDate", "2027-03-10"); f("stayDays", "10"); s("purpose", "tourism"); s("accommodation", "hotel")
    page.click("#save-profile")
    R.append(ok(page.locator("#checklist").is_visible() and "exemption pour les nationaux tunisiens" in page.locator("#categories").text_content(), "profil complété : checklist du Brésil pour Tunisien"))
    # rechargement : un choix déjà fait n'est jamais perdu, même s'il n'est pas dans la liste filtrée
    page.click("#open-profile"); page.select_option("[name=nationality]", "FR")
    R.append(ok(page.locator("[name=showAllDestinations]").is_checked() and page.input_value("[name=destination]") == "BR", "changement de nationalité : destination conservée (case « Afficher aussi… » cochée automatiquement)"))
    R.append(ok(not errors, "aucune erreur console/JS " + (str(errors[:2]) if errors else "")))
    b.close()
print(f"\n{sum(R)}/{len(R)} vérifications réussies"); sys.exit(0 if all(R) else 1)
