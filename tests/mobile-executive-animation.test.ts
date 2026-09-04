import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const component = readFileSync("components/DecisionArchitecture.tsx", "utf8");
const mobileCss = readFileSync("styles/mobile-premium.css", "utf8");

test("mobile executive sequence is readable, finite and user-controlled", () => {
  assert.match(component, /isMobile \? 2600 : 1120/);
  assert.match(component, /Math\.min\(current \+ 1, 3\)/);
  assert.match(component, /mobileSequenceComplete/);
  assert.match(component, /Replay animation/);
  assert.match(component, /Pause animation/);
});

test("animation pauses when hidden and reduced motion resolves immediately", () => {
  assert.match(component, /useSyncExternalStore\(subscribeToPageVisibility/);
  assert.match(component, /const displayedStep = reduceMotion \? 3 : activeStep/);
  assert.match(component, /!pageVisible/);
  assert.match(component, /isMobile && !reduceMotion &&/);
});

test("mobile avoids hidden work and defers the below-fold portrait", () => {
  assert.match(component, /!isMobile && <AgentPanel side="right"/);
  assert.match(component, /loading="lazy"/);
  assert.doesNotMatch(component, /fill priority/);
});

test("mobile animation controls meet premium touch and type contracts", () => {
  assert.match(mobileCss, /\.executive-intelligence__switch button \{[\s\S]*min-height: 2\.75rem/);
  assert.match(mobileCss, /\.executive-intelligence__playback \{[\s\S]*min-height: 2\.75rem/);
  assert.match(mobileCss, /\.executive-agent__step \{ min-height: 2\.75rem; font-size: \.8125rem/);
});
