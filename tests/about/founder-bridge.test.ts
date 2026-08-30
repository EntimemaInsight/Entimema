import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const page = readFileSync("app/about/page.tsx", "utf8");
const oldCopy = [
  "The practitioner foundation",
  "Practitioner-led by design.",
  "Entimema is founded and led by Alexander Dimitrov, whose experience spans finance, accounting, controlling and credit risk. That grounding keeps the work connected to the decisions practitioners actually face."
];
const approvedCopy = [
  "The founder’s perspective",
  "The question behind the architecture.",
  "Entimema is founded and led by Alexander Dimitrov. Its practitioner foundation begins with a question that precedes any individual model or technology: how financial reality becomes data, how that data acquires meaning, how uncertainty is represented, and how evidence becomes a decision an institution can explain, control and act upon."
];
const hash = (value: string) => createHash("sha256").update(value.replace(/\r\n/g, "\n")).digest("hex");

test("About Founder bridge uses the approved perspective, question and institutional decision thesis", () => {
  for (const value of approvedCopy) assert.equal(page.split(value).length - 1, 1);
  for (const value of oldCopy) assert.ok(!page.includes(value));
  assert.match(page, /<Link className="editorial-link--arrow" href="\/alexander-dimitrov">About the Founder <span aria-hidden="true">→<\/span><\/Link>/);
});

test("Adjacent Labs bridge stays byte-for-byte unchanged", () => {
  const start = page.indexOf('<div className={`editorial-col-6 editorial-item editorial-stack ${styles.labsBridge}');
  const end = page.indexOf('<div className={`editorial-col-6 editorial-item editorial-stack ${styles.practitionerBridge}');
  assert.equal(hash(page.slice(start, end)), "7702d30207ba6ada3df67e675e10ce4f8237ad2de3b72344e4d7ce262a7ede3d");
});

test("Only the three Founder strings change; About metadata, JSON-LD and all other markup/copy remain frozen", () => {
  let restored = page;
  approvedCopy.forEach((value, index) => { restored = restored.replace(value, oldCopy[index]); });
  assert.equal(hash(restored), "8f17eec334a9bedb5f50148cef63e8d520d87eccea2ce147f182e9b6bf1c36b5");
});
