import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

// Recreate only the approved circle/E geometry, without source canvas or effects.
const root = new URL("../", import.meta.url);
const tokens = await readFile(new URL("styles/tokens.css", root), "utf8");
const navy = tokens.match(/--brand-navy-950:\s*(#[\da-f]{6})/i)?.[1];
if (!navy) throw new Error("Missing --brand-navy-950 token");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><title>Entimema</title><circle cx="256" cy="256" r="256" fill="${navy}"/><path fill="#fff" d="M131 113H381V172H197V227H358V283H197V343H381V399H131Z"/></svg>\n`;
await writeFile(new URL("public/favicon.svg", root), svg);
const assets = [
  [16, "favicon-16x16.png"], [32, "favicon-32x32.png"],
  [48, "favicon-48x48.png"], [96, "favicon-96x96.png"],
  [180, "apple-touch-icon.png"], [192, "android-chrome-192x192.png"],
  [512, "android-chrome-512x512.png"],
];
const images = new Map();
for (const [size, filename] of assets) {
  const png = await sharp(Buffer.from(svg), { density: 384 }).resize(size, size).png().toBuffer();
  await writeFile(new URL(`public/${filename}`, root), png);
  images.set(size, png);
}
// ICO directory with lossless PNG frames and transparency at every size.
const sizes = [16, 32, 48];
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
for (const [index, size] of sizes.entries()) {
  const entry = 6 + index * 16;
  header[entry] = size;
  header[entry + 1] = size;
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(images.get(size).length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += images.get(size).length;
}
await writeFile(new URL("public/favicon.ico", root), Buffer.concat([header, ...sizes.map((size) => images.get(size))]));
const manifestUrl = new URL("public/site.webmanifest", root);
const manifest = JSON.parse(await readFile(manifestUrl, "utf8"));
manifest.theme_color = navy;
for (const icon of manifest.icons) icon.purpose = "any";
await writeFile(manifestUrl, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Generated ${assets.length} PNGs, SVG and multi-size ICO using ${navy}.`);
