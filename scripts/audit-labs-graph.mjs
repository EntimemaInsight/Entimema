import assert from 'node:assert/strict';
import { graphEdges, graphNodes, graphBoundary, relatedEdges } from '../app/labs/decision-graph-data.ts';

export async function auditDecisionGraph(page, { width, output }) {
  const figure = page.locator('#decision-architecture');
  const nodes = figure.locator('button[data-node]');
  assert.equal(await nodes.count(), 8);
  assert.ok((await figure.innerText()).includes(graphBoundary));
  assert.equal(await figure.locator('[role=status] > [data-visible=true]').count(), 1);
  const mobile = width <= 768;
  assert.equal(await figure.locator('[data-mobile-edge=support]').isVisible(), mobile);
  assert.equal(await figure.locator('[data-edge=support]').isVisible(), !mobile);
  await figure.screenshot({ path: output + '/' + width + '-graph-default.png', style: '.site-header, .site-header * { visibility: hidden !important; }' });
  const initialBox = await figure.boundingBox();
  const appY = await page.locator('#applied-system').evaluate(n => n.getBoundingClientRect().top + scrollY);
  // Selection must work offline, independently of existing Next.js link prefetch.
  await page.context().setOffline(true);
  await nodes.first().focus();
  for (let i = 0; i < graphNodes.length; i++) {
    const node = graphNodes[i];
    const button = nodes.nth(i);
    await page.waitForFunction(id => document.querySelector('[data-node=' + id + ']')?.getAttribute('aria-pressed') === 'true', node.id);
    await figure.locator('[role=status] > [data-visible=true]').getByText(node.detail, { exact: true }).waitFor({ state: 'visible' });
    assert.equal(await button.getAttribute('data-node'), node.id);
    assert.equal(await button.evaluate(n => n === document.activeElement), true, 'Graph tab order');
    assert.equal(await button.getAttribute('aria-pressed'), 'true');
    assert.equal(await button.evaluate(n => getComputedStyle(n).outlineStyle), 'solid');
    assert.ok((await button.innerText()).includes(node.description));
    const activePanel = figure.locator('[role=status] > [data-visible=true]');
    assert.ok((await activePanel.innerText()).includes(node.detail), node.id + ": " + await activePanel.innerText());
    const highlighted = await figure.locator('[data-edge][data-state=selected]').evaluateAll(nodes => nodes.map(n => n.dataset.edge).sort());
    assert.deepEqual(highlighted, relatedEdges(node.id).map(e => e.id).sort(), node.id + ' direct edges only');
    assert.equal((await figure.boundingBox()).height, initialBox.height, 'Selection must not shift the graph');
    assert.equal(await page.locator('#applied-system').evaluate(n => n.getBoundingClientRect().top + scrollY), appY, 'Selection must not move the application section');
    if (i < graphNodes.length - 1) await page.keyboard.press('Tab');
  }
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.querySelectorAll('#decision-architecture [data-node][aria-pressed=true]').length === 0);
  assert.equal(await figure.locator('[data-node][aria-pressed=true]').count(), 0);
  await figure.locator('[data-node=model]').click();
  assert.equal(await figure.locator('[data-node=model]').getAttribute('aria-pressed'), 'true');
  await figure.screenshot({ path: output + '/' + width + '-graph-model.png', style: '.site-header, .site-header * { visibility: hidden !important; }' });
  await figure.getByRole('button', { name: 'Reset emphasis' }).click();
  await page.waitForFunction(() => document.querySelectorAll('#decision-architecture [data-node][aria-pressed=true]').length === 0);
  assert.equal(await figure.locator('[data-node][aria-pressed=true]').count(), 0);

  assert.ok((await nodes.first().evaluate(n => getComputedStyle(n).transitionDuration)).split(',').every(value => parseFloat(value) <= .0001), 'Reduced motion respects the shared near-zero override');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  assert.equal(await nodes.first().evaluate(n => getComputedStyle(n).transitionDuration), '0.2s, 0.2s');
  await figure.locator('[data-node=rule]').click();
  assert.equal(await figure.locator('[data-node=rule]').getAttribute('aria-pressed'), 'true');
  await figure.getByRole('button', { name: 'Reset emphasis' }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.context().setOffline(false);
  return { nodes: 8, relationships: graphEdges.length, mobile, keyboard: true, selection: true, noSelectionShift: true, worksOffline: true };
}

export async function auditStaticGraph(page) {
  const figure = page.locator('#decision-architecture');
  for (const node of graphNodes) {
    assert.equal(await figure.getByRole('button', { name: node.label, exact: true }).isVisible(), true);
    assert.ok((await figure.innerText()).includes(node.description), 'Static description: ' + node.label);
  }
  assert.ok((await figure.innerText()).includes(graphBoundary));
  for (const edge of graphEdges) {
    const locator = edge.kind === 'lineage' ? figure.locator('[data-edge="' + edge.id + '"]') : figure.locator('[data-mobile-edge="' + edge.id + '"]');
    assert.equal(await locator.isVisible(), true, 'Static relationship: ' + edge.id);
  }
}
