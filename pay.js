/* Visa Checker - module de paiement (Flouci / Konnect)
 * Aucun bouton de paiement n'est ajouté au site : ce module ne s'ouvre
 * que lorsqu'on appelle VisaPay.open('joury' | 'aicha' | 'saden').
 *
 * Utilisation :
 *   <script src="pay.js"></script>
 *   bouton "Débloquer" :  onclick="VisaPay.open('joury')"
 *   verrou :  if (VisaPay.needsPay('joury')) { VisaPay.open('joury', reprise); return; }  (needsPay est toujours faux tant que ENABLED = false)
 *   écouter le déblocage : window.addEventListener('visapay:unlocked', e => e.detail.offer)
 */
(function () {
  // ---- Réglages ----
  var ENABLED = false; // false = aucun verrou, le site reste 100 % gratuit. Passer à true pour activer les paiements.
  var TEST_MODE = true; // true = paiement simulé. Mettre false quand Flouci/Konnect sont branchés.
  var API = "https://visa-proxy.rabehfly.workers.dev"; // Worker : /pay/create et /pay/verify

  var OFFERS = {
    joury: { price: 20, fr: "Joury : plan d'action et lettre de recours", en: "Joury: action plan and appeal letter", ar: "جوري: خطة العمل ورسالة الطعن" },
    aicha: { price: 15, fr: "Aïcha : analyse complète de vos documents", en: "Aïcha: full analysis of your documents", ar: "عائشة: تحليل كامل لوثائقك" },
    saden: { price: 15, fr: "Consulat Saden : séance d'entretien complète", en: "Consulate Saden: full interview session", ar: "قنصلية سعدن: جلسة مقابلة كاملة" }
  };
  var TXT = {
    fr: { title: "Débloquer", choose: "Choisissez votre moyen de paiement", cancel: "Annuler", pay: "Payer", wait: "Redirection vers le paiement…", ok: "Paiement confirmé", fail: "Paiement non confirmé. Réessayez.", test: "MODE TEST : aucun vrai paiement", note: "Paiement sécurisé par Flouci ou Konnect. Aucune garantie de visa." },
    en: { title: "Unlock", choose: "Choose your payment method", cancel: "Cancel", pay: "Pay", wait: "Redirecting to payment…", ok: "Payment confirmed", fail: "Payment not confirmed. Please try again.", test: "TEST MODE: no real payment", note: "Secure payment via Flouci or Konnect. No visa guarantee." },
    ar: { title: "فتح", choose: "اختر طريقة الدفع", cancel: "إلغاء", pay: "ادفع", wait: "جارٍ التحويل إلى الدفع…", ok: "تم تأكيد الدفع", fail: "لم يتم تأكيد الدفع. حاول مرة أخرى.", test: "وضع تجريبي: لا يوجد دفع حقيقي", note: "دفع آمن عبر Flouci أو Konnect. لا ضمان للتأشيرة." }
  };

  function lang() {
    var l = ((window.VC && VC.lang) || document.documentElement.lang || "fr").slice(0, 2);
    return TXT[l] ? l : "fr";
  }
  function key(o) { return "vp_token_" + o; }

  // ---- Style ----
  var css = ".vp-ov{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9999;display:flex;align-items:flex-end;justify-content:center}" +
    ".vp-box{background:#fff;width:100%;max-width:420px;border-radius:18px 18px 0 0;padding:20px;font-family:system-ui,sans-serif;color:#222}" +
    "@media(min-width:600px){.vp-ov{align-items:center}.vp-box{border-radius:18px}}" +
    ".vp-box h3{margin:0 0 4px;font-size:18px}.vp-sub{color:#666;font-size:14px;margin-bottom:14px}" +
    ".vp-price{font-size:26px;font-weight:700;color:#f97316;margin-bottom:14px}" +
    ".vp-m{display:flex;align-items:center;gap:10px;border:2px solid #e5e5e5;border-radius:12px;padding:14px;margin-bottom:10px;cursor:pointer;font-size:16px;font-weight:600}" +
    ".vp-m.on{border-color:#f97316;background:#fff7ed}" +
    ".vp-go{width:100%;background:#f97316;color:#fff;border:0;border-radius:12px;padding:14px;font-size:16px;font-weight:700;cursor:pointer;margin-top:4px}" +
    ".vp-go:disabled{opacity:.5}.vp-x{width:100%;background:none;border:0;color:#666;padding:12px;cursor:pointer}" +
    ".vp-note{font-size:12px;color:#888;text-align:center;margin-top:6px}.vp-test{background:#fef3c7;color:#92400e;font-size:12px;text-align:center;border-radius:8px;padding:6px;margin-bottom:10px}" +
    ".vp-msg{text-align:center;margin:8px 0;font-size:14px}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  // ---- API publique ----
  var VisaPay = {
    isUnlocked: function (offer) {
      try { return !!localStorage.getItem(key(offer)); } catch (e) { return false; }
    },
    needsPay: function (offer) { return ENABLED && !VisaPay.isUnlocked(offer); },
    getToken: function (offer) {
      try { return localStorage.getItem(key(offer)); } catch (e) { return null; }
    },
    open: function (offer, done) {
      var o = OFFERS[offer]; if (!o) return;
      var L = lang(), t = TXT[L], method = "flouci";
      var ov = document.createElement("div"); ov.className = "vp-ov";
      ov.innerHTML =
        '<div class="vp-box" dir="' + (L === "ar" ? "rtl" : "ltr") + '">' +
        '<h3>' + t.title + '</h3><div class="vp-sub">' + o[L] + '</div>' +
        '<div class="vp-price">' + o.price + ' DT</div>' +
        (TEST_MODE ? '<div class="vp-test">' + t.test + '</div>' : '') +
        '<div style="font-size:14px;margin-bottom:8px">' + t.choose + '</div>' +
        '<div class="vp-m on" data-m="flouci">Flouci</div>' +
        '<div class="vp-m" data-m="konnect">Konnect</div>' +
        '<div class="vp-msg"></div>' +
        '<button class="vp-go">' + t.pay + ' ' + o.price + ' DT</button>' +
        '<button class="vp-x">' + t.cancel + '</button>' +
        '<div class="vp-note">' + t.note + '</div></div>';
      document.body.appendChild(ov);
      var msg = ov.querySelector(".vp-msg"), go = ov.querySelector(".vp-go");

      ov.querySelectorAll(".vp-m").forEach(function (el) {
        el.onclick = function () {
          ov.querySelectorAll(".vp-m").forEach(function (x) { x.classList.remove("on"); });
          el.classList.add("on"); method = el.getAttribute("data-m");
        };
      });
      ov.querySelector(".vp-x").onclick = function () { ov.remove(); };
      ov.onclick = function (e) { if (e.target === ov) ov.remove(); };

      go.onclick = function () {
        go.disabled = true; msg.textContent = t.wait;
        if (TEST_MODE) { // simulation : débloque directement
          setTimeout(function () { unlock(offer, "test-" + Date.now()); msg.textContent = t.ok; setTimeout(function () { ov.remove(); if (done) done(); }, 700); }, 600);
          return;
        }
        fetch(API + "/pay/create", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ offer: offer, method: method, return_url: location.origin + location.pathname })
        }).then(function (r) { return r.json(); }).then(function (d) {
          if (!d.url) throw 0;
          try { sessionStorage.setItem("vp_pending", JSON.stringify({ offer: offer, ref: d.ref })); } catch (e) {}
          location.href = d.url; // page de paiement Flouci / Konnect
        }).catch(function () { msg.textContent = t.fail; go.disabled = false; });
      };
    }
  };

  function unlock(offer, token) {
    try { localStorage.setItem(key(offer), token); } catch (e) {}
    window.dispatchEvent(new CustomEvent("visapay:unlocked", { detail: { offer: offer, token: token } }));
  }

  // ---- Retour du paiement : vérification côté serveur ----
  function checkReturn() {
    var p; try { p = JSON.parse(sessionStorage.getItem("vp_pending") || "null"); } catch (e) {}
    if (!p || TEST_MODE) return;
    fetch(API + "/pay/verify?ref=" + encodeURIComponent(p.ref))
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d.paid && d.token) { sessionStorage.removeItem("vp_pending"); unlock(p.offer, d.token); }
      }).catch(function () {});
  }
  window.VisaPay = VisaPay;
  window.addEventListener("load", checkReturn);
})();
