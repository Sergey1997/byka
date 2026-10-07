import assert from "node:assert/strict";
import test from "node:test";
import { deliverLead, parseLead, type LeadInput } from "../lib/leads";

const valid = {
  kind: "booking",
  name: "Анна",
  phone: "+375291112233",
  telegram: "",
  location: "razgovor",
  date: "2026-10-20",
  time: "14:00",
  topic: "Интервью",
  message: "Двое в кадре",
  page: "/",
  company: "",
};

test("rejects a lead without a way to reply", () => {
  const result = parseLead({ ...valid, phone: "", telegram: "" });
  assert.equal("error" in result, true);
});

test("accepts telegram without a phone", () => {
  const result = parseLead({ ...valid, phone: "", telegram: "@anna" });
  assert.equal("lead" in result, true);
});

test("drops the honeypot without calling sinks", async () => {
  let called = false;
  const parsed = parseLead({ ...valid, company: "spam ltd" });
  assert.ok("lead" in parsed);
  const result = await deliverLead(
    parsed.lead,
    async () => {
      called = true;
    },
    async () => {
      called = true;
      return true;
    },
  );
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.ignored, true);
  assert.equal(called, false);
});

test("succeeds when telegram accepts and the database is down", async () => {
  const lead = (parseLead(valid) as { lead: LeadInput }).lead;
  const result = await deliverLead(
    lead,
    async () => {
      throw new Error("db down");
    },
    async () => true,
  );
  assert.deepEqual(result, { ok: true, stored: false, telegram: true });
});

test("returns 503 when nothing can take the lead", async () => {
  const lead = (parseLead(valid) as { lead: LeadInput }).lead;
  const result = await deliverLead(lead, null, null);
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.status, 503);
});
