"""Test navigateur du cas exemple Tunisien → Brésil (Modules 1 + 2). Serveur attendu sur le port 8765."""
import sys
from playwright.sync_api import sync_playwright
URL = "http://127.0.0.1:8765/index.html"
ok = lambda c, m: (print(("PASS " if c else "FAIL ") + m), c)[1]
R = []
with sync_playwright() as p:
    b = p.chromium.launch(); ctx = b.new_context(viewport={"width": 390, "height": 844}, locale="fr-FR"); page = ctx.new_page()
    errors = []; page.on("pageerror", lambda e: errors.append(str(e))); page.on("console", lambda m: m.type == "error" and errors.append(m.text))
    page.goto(URL); page.wait_for_load_state("networkidle"); page.click("#open-profile")
    f = lambda n, v: page.fill(f"[name={n}]", v); s = lambda n, v: page.select_option(f"[name={n}]", v)
    s("nationality", "TN"); s("residence", "TN"); s("destination", "BR"); f("departureDate", "2027-03-10"); f("stayDays", "10")
    s("purpose", "tourism"); s("accommodation", "hotel"); f("passport_expiry", "2030-01-01"); f("ticket_return", "2027-03-20")
    page.click("#save-profile")
    m1 = page.locator("#categories").text_content()
    R.append(ok("exemption pour les nationaux tunisiens" in m1, "Module 1 : règle tunisienne du Brésil sélectionnée"))
    R.append(ok("jusqu’à 90 jours" in m1 and "Résultat à confirmer : règle non vérifiée" in m1, "Module 1 : durée affichée ET résultat signalé à confirmer"))
    badge = page.locator("li.item", has_text="exemption pour les nationaux tunisiens").locator(".badge").inner_text()
    R.append(ok("À vérifier" in badge and "Conforme" not in badge and "Non applicable" not in badge, f"Module 1 : badge « {badge} » (jamais Conforme / Non applicable tant que non vérifié)"))
    R.append(ok("Décret 5.169/2004" in m1 and "Voir aussi : Itamaraty" in m1 and "nationalité TN" in m1, "Module 1 : source principale, « voir aussi » et champ d'application visibles"))
    hrefs = [a.get_attribute("href") for a in page.locator("#categories a").all()]
    R.append(ok(any("justia" in (h or "") for h in hrefs) and any("gov.br/mre" in (h or "") for h in hrefs) and all("noopener" in (a.get_attribute("rel") or "") for a in page.locator("#categories a").all()), "Module 1 : liens sources présents, rel=noopener"))
    page.click("#tab-m2")
    m2 = page.locator("#m2-phases").text_content()
    R.append(ok("Receita Federal" in m2 and "ANVISA" in m2 and "Polícia Federal" in m2, "Module 2 : renvois officiels brésiliens (douane, santé, immigration)"))
    R.append(ok(m2.count("Non vérifié") >= 3 and "jamais vérifié" in m2, "Module 2 : tous signalés non vérifiés, « jamais vérifié »"))
    docs = page.locator("#m2-docs").text_content()
    R.append(ok("exemption pour les nationaux tunisiens" in docs and "À vérifier" in docs, "Module 2 : réutilise le résultat visa du Module 1 sans ressaisie"))
    R.append(ok(page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"), "mobile 390 px : aucun débordement horizontal"))
    page.screenshot(path="/tmp/br-m2.png"); page.click("#tab-m1"); page.locator("li.item", has_text="exemption pour les nationaux tunisiens").scroll_into_view_if_needed(); page.screenshot(path="/tmp/br-m1.png")
    # autre nationalité : repli sur la règle générique
    page.click("#open-profile"); s("nationality", "FR"); page.click("#save-profile")
    m1b = page.locator("#categories").text_content()
    R.append(ok("exemption pour les nationaux tunisiens" not in m1b and "Visa ou autorisation électronique d’entrée" in m1b, "autre nationalité (FR) : règle générique, pas la règle tunisienne"))
    R.append(ok(not errors, "aucune erreur console/JS " + (str(errors[:2]) if errors else "")))
    b.close()
print(f"\n{sum(R)}/{len(R)} vérifications réussies"); sys.exit(0 if all(R) else 1)
