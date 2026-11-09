import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../worker/visa-chat-worker.js", import.meta.url), "utf8");
const moduleUrl = "data:text/javascript;base64," + Buffer.from(source).toString("base64");
const { VisaCheckerCounter } = await import(moduleUrl);

class MemoryStorage {
  constructor() { this.data = new Map(); this.tail = Promise.resolve(); }
  transaction(callback) {
    const run = this.tail.then(() => callback({
      get: async (key) => this.data.get(key),
      put: async (key, value) => { this.data.set(key, structuredClone(value)); },
    }));
    this.tail = run.catch(() => {});
    return run;
  }
}
const state = { storage: new MemoryStorage() };
const counter = new VisaCheckerCounter(state, {});
async function call(body) {
  const response = await counter.fetch(new Request("https://counter.test/consume", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  }));
  return { status: response.status, body: await response.json() };
}
const invalid = await call({ action: "delete", limit: 10 });
assert.equal(invalid.status, 400);
const check = await call({ action: "check", limit: 10 });
assert.equal(check.body.allowed, true);
assert.equal(check.body.left, 10);
const results = await Promise.all(Array.from({ length: 80 }, () => call({ action: "consume", limit: 10 })));
assert.equal(results.filter((x) => x.body.allowed).length, 10);
assert.equal(results.filter((x) => !x.body.allowed).length, 70);
const after = await call({ action: "check", limit: 10 });
assert.equal(after.body.allowed, false);
assert.equal(after.body.left, 0);
const second = new VisaCheckerCounter({ storage: new MemoryStorage() }, {});
const isolated = await second.fetch(new Request("https://counter.test/consume", {
  method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "consume", limit: 1 }),
}));
assert.equal((await isolated.json()).allowed, true);
console.log("Durable Object counter tests: 7 assertions passed.");
