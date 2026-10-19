const express = require("express");
const fs = require("fs");
const path = require("path");

const TOKEN = process.env.TELEGRAM_TOKEN;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const BASE_URL = process.env.RENDER_EXTERNAL_URL;
const PORT = process.env.PORT || 3000;

if (!TOKEN || !GEMINI_KEY) {
  console.error("Il manque TELEGRAM_TOKEN ou GEMINI_API_KEY dans les variables d'environnement.");
  process.exit(1);
}

const PROMPT = fs.readFileSync(path.join(__dirname, "prompt.txt"), "utf8");
const TG = `https://api.telegram.org/bot${TOKEN}`;

// Historique court par conversation (en mémoire)
const histories = new Map();
const MAX_MESSAGES = 20;

const WELCOME =
  "Bonjour ! Je suis l'assistant Visa Checker. Je vous aide à vérifier votre dossier de visa pour la France et à réagir après un refus.\n\n" +
  "Hello! I'm the Visa Checker assistant. I help you check your French visa file and respond after a refusal.\n\n" +
  "مرحبًا! أنا مساعد Visa Checker. أساعدك على مراجعة ملف تأشيرة فرنسا وعلى التصرف بعد الرفض.\n\n" +
  "Quel est le motif de votre voyage ? / What is the reason for your trip? / ما سبب سفرك؟";

async function tg(method, body) {
  const r = await fetch(`${TG}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) console.error(method, r.status, await r.text());
  return r;
}

async function askGemini(chatId, text) {
  const history = histories.get(chatId) || [];
  history.push({ role: "user", parts: [{ text }] });

  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": GEMINI_KEY },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: PROMPT }] },
        contents: history,
        generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
      }),
    }
  );

  if (!r.ok) {
    history.pop();
    throw new Error(`Gemini ${r.status}: ${await r.text()}`);
  }

  const data = await r.json();
  const reply =
    data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ||
    "Désolé, je n'ai pas pu répondre. Pouvez-vous reformuler ?";

  history.push({ role: "model", parts: [{ text: reply }] });
  while (history.length > MAX_MESSAGES) history.splice(0, 2);
  histories.set(chatId, history);
  return reply;
}

async function handleUpdate(update) {
  const msg = update.message;
  if (!msg) return;
  const chatId = msg.chat.id;

  if (!msg.text) {
    await tg("sendMessage", {
      chat_id: chatId,
      text: "Écrivez-moi votre question en texte, s'il vous plaît. / Please write your question as text. / اكتب سؤالك نصًا من فضلك.",
    });
    return;
  }

  if (msg.text.startsWith("/start")) {
    histories.delete(chatId);
    await tg("sendMessage", { chat_id: chatId, text: WELCOME });
    return;
  }

  if (msg.text.startsWith("/reset")) {
    histories.delete(chatId);
    await tg("sendMessage", { chat_id: chatId, text: "OK, on recommence. / Let's start over. / لنبدأ من جديد." });
    return;
  }

  await tg("sendChatAction", { chat_id: chatId, action: "typing" });

  try {
    const reply = await askGemini(chatId, msg.text);
    await tg("sendMessage", { chat_id: chatId, text: reply.slice(0, 4000) });
  } catch (e) {
    console.error(e);
    await tg("sendMessage", {
      chat_id: chatId,
      text: "Petit souci technique. Réessayez dans un instant. / Technical issue, please try again shortly.",
    });
  }
}

const app = express();
app.use(express.json());

app.get("/", (req, res) => res.send("Visa Checker bot OK"));

app.post(`/telegram/${TOKEN}`, (req, res) => {
  res.sendStatus(200);
  handleUpdate(req.body).catch((e) => console.error(e));
});

app.listen(PORT, async () => {
  console.log("Serveur démarré sur le port", PORT);
  if (!BASE_URL) {
    console.warn("RENDER_EXTERNAL_URL absent : le webhook Telegram n'a pas été configuré.");
    return;
  }
  const r = await tg("setWebhook", { url: `${BASE_URL}/telegram/${TOKEN}` });
  console.log("setWebhook :", r.status);
});
