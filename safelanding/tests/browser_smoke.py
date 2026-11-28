"""Test navigateur réel (Playwright/Chromium) : parcours profil -> checklist -> hors connexion."""
import sys, json
from playwright.sync_api import sync_playwright
URL = "http://127.0.0.1:8765/index.html"
ok = lambda c, m: (print(("PASS " if c else "FAIL ") + m), c)[1]
results = []
with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(locale="fr-FR"); page = ctx.new_page()
    errors = []; page.on("pageerror", lambda e: errors.append(str(e))); page.on("console", lambda m: m.type == "error" and errors.append(m.text))
    page.goto(URL); page.wait_for_load_state("networkidle")
    results.append(ok(page.locator("h1").inner_text() == "Before Departure", "titre Before Departure"))
    results.append(ok(page.locator("#empty").is_visible() and not page.locator("#checklist").is_visible(), "état vide au premier lancement"))
    results.append(ok(page.locator("select[name=nationality] option").count() > 150, "liste de pays générée"))
    page.click("#open-profile")
    page.click("#save-profile")
    results.append(ok(page.locator("#form-errors li").count() >= 5, "validation : erreurs affichées si profil vide"))
    f = lambda n, v: page.fill(f"[name={n}]", v)
    s = lambda n, v: page.select_option(f"[name={n}]", v)
    s("nationality", "TN"); s("residence", "TN"); page.check("[name=showAllDestinations]"); s("destination", "DE"); f("transit", "AE")
    f("departureDate", "2027-03-10"); f("stayDays", "10"); s("purpose", "tourism"); s("accommodation", "private")
    f("passport_expiry", "2027-04-01"); f("passport_issue", "2022-01-01"); f("ticket_return", "2027-03-20")
    page.click("#save-profile")
    results.append(ok(page.locator("#checklist").is_visible(), "checklist affichée après enregistrement"))
    txt = page.locator("#categories").inner_text()
    results.append(ok("Passeport" in txt and "Transit via AE" in txt and "Manquant" in txt, "catégories, transit et statut Manquant (passeport < 3 mois après séjour)"))
    results.append(ok(page.locator("#alerts li").count() >= 1, "alertes affichées"))
    results.append(ok("Non vérifié" in txt, "règles livrées marquées « Non vérifié »"))
    results.append(ok("Conforme" not in page.locator(".badge").all_inner_texts().__str__(), "aucun « Conforme » avec règles non vérifiées"))
    before = page.locator("#progress-text").inner_text()
    page.locator("#h-passport").check()
    results.append(ok(page.locator("#progress-text").inner_text() == before, "« Traité » sur un élément Manquant ne fait PAS progresser"))
    page.locator("#h-entry-authorization").check()
    results.append(ok(page.locator("#progress-text").inner_text() != before, "« Traité » sur un élément À vérifier met à jour la progression"))
    stored = page.evaluate("localStorage.getItem('safelanding.state')")
    results.append(ok(stored and "passport" in stored and "number" not in stored.lower(), "données persistées localement, sans numéro de passeport"))
    # liens externes sûrs
    results.append(ok(all("noopener" in (a.get_attribute("rel") or "") for a in page.locator("#categories a").all()), "liens sources : rel=noopener"))
    # hors connexion
    page.evaluate("navigator.serviceWorker.ready.then(()=>1)"); page.wait_for_timeout(1500)
    ctx.set_offline(True); page.reload(); page.wait_for_load_state("domcontentloaded"); page.wait_for_timeout(800)
    results.append(ok(page.locator("#checklist").is_visible() and "Transit via AE" in page.locator("#categories").inner_text(), "hors connexion : checklist restituée après rechargement"))
    results.append(ok("Hors connexion" in page.locator("#net").inner_text(), "indicateur hors connexion"))
    ctx.set_offline(False)
    # effacement
    page.on("dialog", lambda d: d.accept()); page.click("#reset")
    results.append(ok(page.locator("#empty").is_visible() and page.evaluate("localStorage.getItem('safelanding.state')") is None, "effacement complet des données"))
    results.append(ok(not errors, "aucune erreur console/JS " + (str(errors[:2]) if errors else "")))
    b.close()
print(f"\n{sum(results)}/{len(results)} vérifications réussies"); sys.exit(0 if all(results) else 1)
