# Visa Checker — legal and technical launch gate

Internal working document — branch `amelioration`
Last reviewed: 9 November 2026

This checklist is a product-risk assessment, not a legal opinion. The applicable law, the exact controller identity, the current regulatory practice and the deployed infrastructure must be confirmed with Tunisian counsel and, where relevant, counsel in each target market.

## 1. Current release posture

The public website is a preparation and information tool. It must not imply that it is a consulate, visa authority, visa centre, travel agency, legal practice or appointment provider.

The following functions are deliberately not commercial or operational until their prerequisites are met:
- Online payments and paid unlocks.
- Paid advisor directory and paid refusal-review service.
- Partner agency booking/request forwarding.
- Visa Radar real-time appointment monitoring and notifications.
- Google AdSense and other behavioural advertising.

No example partner may be shown as an approved provider. No payment number, wallet, manual transfer instruction or placeholder checkout may be exposed.

## 2. Tunisia — personal data

Primary text: Organic Law No. 2004-63 of 27 July 2004 and implementing Decree No. 2007-3004 of 27 November 2007. The INPDP itself lists these texts in its legal framework.

Before operating a personal-data processing workflow:
1. Identify the data controller and its legal capacity (natural person or registered entity), full address and contact channel.
2. Map every category of data, purpose, recipient, hosting/processing country, retention period and security control.
3. Check and complete the prior declaration under Article 7, and any additional authorisation required for the intended processing.
4. Obtain INPDP authorisation before international transfers under Article 52; Article 51 also requires an adequate level of protection.
5. Check Article 15 authorisation requirements if processing sensitive categories under Article 14.
6. Provide the required information to data subjects and obtain the form of consent required by applicable law. Do not treat a privacy notice alone as a substitute for a lawful basis or regulatory formality.
7. Set a real retention schedule and a documented deletion process. Do not promise deletion if provider logs or backups remain outside the operator's control.
8. Execute appropriate processor agreements and assess each provider's location, subprocessors, security and transfer terms.

Relevant official reference: INPDP legal texts page — https://www.inpdp.tn/Texte.html
Law text reference: https://legislation-securite.tn/latest-laws/loi-organique-n-2004-63-du-27-juillet-2004-portant-sur-la-protection-des-donnees-a-caractere-personnel/
Implementing decree: https://legislation-securite.tn/latest-laws/decret-n-2007-3004-du-27-novembre-2007-fixant-les-conditions-et-les-procedures-de-declaration-et-dautorisation-pour-le-traitement-des-donnees-a-caractere-personnel/

## 3. GDPR — EU visitors

The GDPR may apply to an operator established outside the EU where it offers services to people in the EU or monitors their behaviour (Article 3). Mere global accessibility of a website is not, by itself, enough to conclude that the GDPR applies; actual targeting and monitoring must be assessed.

If applicable, prepare:
- Article 13/14 privacy information and lawful-basis mapping.
- Controller/processor contracts under Article 28 and records of processing where required.
- International transfer mechanism and transfer assessment under Chapter V.
- Data-subject request workflow, security and breach response.
- Article 27 EU representative assessment where the non-EU controller has no EU establishment and the conditions/exemptions require one.
- Cookie/advertising consent controls where required.

Official overview: https://commission.europa.eu/law/law-topic/data-protection/data-protection-explained_en

## 4. AI provider and user content

The website currently routes assistant messages through a Cloudflare Worker to Google Gemini. Provider terms differ between unpaid and paid API services. Under Google's current Gemini API terms, unpaid service content may be used to improve Google products and may be reviewed by humans; paid service prompts and responses are not used for product improvement, but limited abuse-monitoring retention can still occur. The exact billing status and API product used by this project must be checked in the Google account before the privacy notice is finalised.

Do not claim "zero retention", "never reviewed" or "never used for training" without evidence for the exact API configuration. Do not invite users to submit passports, identity documents, bank details, refusal letters or other sensitive data until the legal basis, INPDP formalities, provider terms and security design have been approved.

Official terms: https://ai.google.dev/gemini-api/terms
Retention guidance: https://ai.google.dev/gemini-api/docs/zdr

## 5. Consumer and e-commerce readiness

Before selling anything to consumers, validate the applicable Tunisian electronic-commerce and consumer rules and the rules of markets specifically targeted. Obtain legal review of:
- Operator identity, legal form, registered/contact address and business disclosures.
- Clear service description, total price, currency, taxes/fees, delivery time and support channel before order.
- Order confirmation, proof of contract, complaints, refunds and cancellation/withdrawal rules, including any digital-content exceptions and required express acknowledgements.
- Payment-provider authorisation, settlement, chargeback/refund process, payment security and reconciliation.
- Terms that do not unlawfully exclude mandatory consumer rights or liability.

No price, payment method or paid-service promise should appear until the service and provider are genuinely available and the full purchase flow has been validated.

## 6. Partners, agencies and affiliate links

Before listing a partner:
- Verify legal name, registration/authority where relevant, address, contact details, service scope and professional qualifications where required.
- Obtain written permission to publish its name, logo, contact details and offers.
- Sign an agreement covering referrals, commission, customer data, complaint handling, liability, insurance and termination.
- Disclose any commission or commercial relationship clearly beside the relevant link.
- Obtain a clear, separate user choice before transmitting personal data to the named recipient.
- Do not describe a provider as "approved", "official" or "verified" without a documented basis.

Do not publish sample, test or placeholder businesses in the live directory.

## 7. Visa advice and editorial accuracy

- Every visa guide must state the passport/nationality, destination, purpose and stay length to which it applies.
- Display a "last verified" date and link directly to the official authority for every changing requirement.
- Separate official requirements from Visa Checker commentary and recommendations.
- Do not promise visa approval, appointment availability or processing time.
- Do not present an AI-generated checklist as official, exhaustive or legal advice.
- Do not advise users to fabricate bookings, evidence, employment details or financial records.
- For refusals and appeals, quote the actual decision notice and official deadlines only after jurisdiction-specific verification; do not market an AI-generated appeal as representation by a lawyer.

## 8. AdSense and cookies

AdSense is not enabled. Before activation:
- Select and actually implement a CMP suitable for the visitor geography.
- For personalised advertising in the EEA, UK and Switzerland, use a Google-certified CMP integrated with the IAB TCF as required by Google's publisher policy.
- Block advertising tags until the required consent signals exist; provide a way to change or withdraw choices.
- Verify the current Google publisher policy and CMP certification list at launch time.
- Publish a truthful cookie notice matching the actual scripts and storage mechanisms. Do not state that a consent banner is active until it is deployed and tested.

Google publisher policy: https://support.google.com/adsense/answer/13554020

## 9. Technical security gate

Before processing real customer information:
- Replace the in-memory per-IP rate limiter with a distributed rate-limiting control; per-instance memory does not enforce a reliable global limit.
- Make paid-code usage accounting atomic or otherwise concurrency-safe; a KV read-then-write counter can race.
- Validate message count, role, type and per-message size; reject malformed entries rather than silently filtering arbitrary payloads.
- Set request size limits and timeouts at the edge and upstream; never log user prompts, API keys or personal documents.
- Keep API keys only in server-side secrets; rotate any key ever committed to Git or exposed in browser code.
- Use security headers (CSP, HSTS, X-Content-Type-Options, Referrer-Policy, frame restrictions) consistently on every HTML page, not only selected pages.
- Review CORS allowlists, endpoint authentication, abuse monitoring and denial-of-service exposure.
- Avoid collecting IP addresses or other identifiers unless necessary; document their use, access and retention.
- Test privacy controls, language/RTL layouts, form error handling, accessibility and all outbound links before release.

## 10. Facts still required from the operator

These facts cannot be invented in code or legal pages:
- Whether Visa Checker is operated by an individual or a registered company; if a company, its exact legal name, registration number and registered address.
- The operator's business/contact address and the jurisdiction in which it is established.
- Whether the Gemini API project has active billing and which API features are enabled.
- Which Cloudflare Worker endpoints and logs are live in production, and which data they retain.
- Whether any INPDP declaration or authorisation has already been filed or granted.
- Which countries are actively targeted with paid offers or behavioural advertising.
- The actual payment provider and the terms it has approved for this business.

Until these facts and legal formalities are confirmed, keep customer document uploads, partner forwarding, paid services, appointment monitoring and advertising disabled.
