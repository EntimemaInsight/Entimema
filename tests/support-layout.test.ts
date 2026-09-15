import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const supportPage = readFileSync("app/support/page.tsx", "utf8");
const supportForm = readFileSync("app/support/SupportForm.tsx", "utf8");
const supportStyles = readFileSync("app/support/support.module.css", "utf8");

test("support resources precede the contact form at every breakpoint", () => {
  const resourcesPosition = supportPage.indexOf(`<div className={styles.resources}>`);
  const formPosition = supportPage.indexOf("<SupportForm />");

  assert.notEqual(resourcesPosition, -1);
  assert.notEqual(formPosition, -1);
  assert.ok(resourcesPosition < formPosition);
  assert.match(
    supportStyles,
    /\.support\{display:grid;grid-template-columns:minmax\(360px,\.92fr\) minmax\(0,1\.08fr\)/,
  );
  assert.match(
    supportStyles,
    /@media\(max-width:820px\)\{[\s\S]*?\.support\{grid-template-columns:1fr;/,
  );
});

test("support form starts with names and keeps its message field label", () => {
  const formStart = supportForm.indexOf(`<form className={styles.form}`);
  const firstNamePosition = supportForm.indexOf("First name", formStart);
  const lastNamePosition = supportForm.indexOf("Last name", formStart);

  assert.ok(formStart !== -1 && formStart < firstNamePosition);
  assert.ok(firstNamePosition < lastNamePosition);
  assert.match(
    supportForm,
    /<label className=\{styles\.fullWidth\}><span>How can we help\?<\/span><textarea name="message" required rows=\{5\} \/><\/label>/,
  );
  assert.doesNotMatch(supportForm, /CONTACT SUPPORT|Tell us what you need/);
});

test("support form captures required company identity and explicit privacy acknowledgement", () => {
  for (const label of ["First name*", "Last name*", "Company email*", "Company name*", "Job title*"]) {
    assert.match(supportForm, new RegExp(`<span>${label.replace("*", "\\*")}<\\/span>`));
  }
  assert.match(supportForm, /name="country"/);
  assert.match(supportForm, /countryOptions\.map/);
  assert.match(supportForm, /name="privacyConsent" required type="checkbox" value="yes"/);
  assert.match(supportForm, /href="\/privacy">Privacy Notice<\/a>/);
});

test("support section has no surrounding horizontal rules", () => {
  const supportRule = supportStyles.match(/\.support\{[^}]+\}/)?.[0];

  assert.ok(supportRule);
  assert.doesNotMatch(supportRule, /border-(?:top|bottom)/);
});
