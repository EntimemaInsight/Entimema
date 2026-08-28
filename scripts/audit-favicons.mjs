import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import sharp from "sharp";

const root = new URL("../", import.meta.url);
const assets = [
  [16, "favicon-16x16.png"], [32, "favicon-32x32.png"],
  [48, "favicon-48x48.png"], [96, "favicon-96x96.png"],
  [180, "apple-touch-icon.png"], [192, "android-chrome-192x192.png"],
  [512, "android-chrome-512x512.png"],
];
const tokens = await readFile(new URL("styles/tokens.css", root), "utf8");
const navy = tokens.match(/--brand-navy-950:\s*(#[\da-f]{6})/i)[1];
const rgb = navy.slice(1).match(/../g).map((hex) => parseInt(hex, 16));
for (const [size, filename] of assets) {
  const { data, info } = await sharp(await readFile(new URL(`public/${filename}`, root))).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, size);
  assert.equal(info.height, size);
  const pixel = (x, y) => [...data.subarray((y * size + x) * 4, (y * size + x) * 4 + 4)];
  for (const [x, y] of [[0, 0], [size - 1, 0], [0, size - 1], [size - 1, size - 1]]) assert.equal(pixel(x, y)[3], 0);
  assert.deepEqual(pixel(Math.floor(size / 2), Math.floor(size / 8)), [...rgb, 255]);
  assert.deepEqual(pixel(Math.floor(size / 3), Math.floor(size / 2)), [255, 255, 255, 255]);
  // Every pixel more than one antialiasing pixel outside the circle is transparent.
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    if (Math.hypot(x + 0.5 - size / 2, y + 0.5 - size / 2) > size / 2 + 1) assert.equal(pixel(x, y)[3], 0);
  }
  console.log(`PASS ${filename}: square RGBA, transparent exterior, navy/white mark`);
}
const ico = await readFile(new URL("public/favicon.ico", root));
assert.equal(ico.readUInt16LE(2), 1);
assert.equal(ico.readUInt16LE(4), 3);
for (const [index, size] of [16, 32, 48].entries()) {
  const entry = 6 + index * 16;
  assert.equal(ico[entry], size);
  assert.equal(ico[entry + 1], size);
  const offset = ico.readUInt32LE(entry + 12);
  const length = ico.readUInt32LE(entry + 8);
  assert.deepEqual(ico.subarray(offset, offset + length), await readFile(new URL(`public/favicon-${size}x${size}.png`, root)));
}
console.log("PASS ICO: 16, 32, 48px lossless frames");
if (process.argv[2]) {
  const base = process.argv[2];
  for (const filename of [...assets.map(([, name]) => name), "favicon.ico", "favicon.svg", "site.webmanifest"]) {
    const response = await fetch(new URL(`/${filename}`, base));
    assert.equal(response.status, 200, filename);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), await readFile(new URL(`public/${filename}`, root)), `${filename}: served asset differs`);
    assert(!/noindex|noimageindex/i.test(response.headers.get("x-robots-tag") || ""));
    console.log(`PASS HTTP 200 and exact asset bytes: ${filename}`);
  }
  for (const route of ["/", "/resources", "/services/cfo-function"]) {
    const response = await fetch(new URL(route, base));
    assert.equal(response.status, 200);
    const html = await response.text();
    const links = html.match(/<link\b[^>]*>/g) || [];
    for (const [href, rel, sizes] of [["/favicon.ico", "icon", "16x16 32x32 48x48"], ...[16,32,48,96].map((size) => [`/favicon-${size}x${size}.png`, "icon", `${size}x${size}`]), ["/apple-touch-icon.png", "apple-touch-icon", "180x180"]]) {
      assert(links.some((link) => link.includes(`href="${href}"`) && link.includes(`rel="${rel}"`) && link.includes(`sizes="${sizes}"`)), `${route}: missing ${href}`);
    }
    assert(links.some((link) => link.includes('rel="manifest"') && link.includes('href="/site.webmanifest"')));
    console.log(`PASS rendered metadata: ${route}`);
  }
  const robots = await fetch(new URL("/robots.txt", base));
  assert.equal(robots.status, 200);
  const rules = await robots.text();
  assert.match(rules, /Allow: \/(?:\r?\n|$)/);
  assert(!/Disallow:\s*\S/.test(rules));
  console.log("PASS robots: homepage and icons crawlable");
}
