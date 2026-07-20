import assert from 'node:assert/strict';
import fs from 'node:fs';

const requiredFiles = [
  'index.html',
  'styles.css',
  'app.js',
  'favicon.svg',
  'vercel.json',
];

for (const file of requiredFiles) {
  assert.equal(fs.existsSync(new URL(file, import.meta.url)), true, `Missing ${file}`);
}

const html = fs.readFileSync(new URL('index.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('styles.css', import.meta.url), 'utf8');
const vercel = JSON.parse(fs.readFileSync(new URL('vercel.json', import.meta.url), 'utf8'));

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length, 'HTML ids must be unique.');

const requiredSections = [
  'inicio',
  'ruta',
  'historia',
  'reinos',
  'geopolitica',
  'razas',
  'reglas',
  'app-fichas',
  'ficha',
];
for (const section of requiredSections) {
  assert.ok(ids.includes(section), `Missing section #${section}`);
}

const localLinks = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
for (const target of localLinks) {
  assert.ok(ids.includes(target), `Anchor points to missing #${target}`);
}

assert.equal((html.match(/\sdata-race(?:\s|>)/g) ?? []).length, 92, 'Race catalog must contain 92 entries.');

const rulesStart = html.indexOf('<div class="rules-ledger">');
const rulesEnd = html.indexOf('</div>\n      </section>', rulesStart);
assert.notEqual(rulesStart, -1, 'Rules ledger not found.');
assert.notEqual(rulesEnd, -1, 'Rules ledger closing marker not found.');
const rules = html.slice(rulesStart, rulesEnd);
assert.equal((rules.match(/<details/g) ?? []).length, 18, 'Rules ledger must contain 18 rules.');

assert.ok(
  html.includes('https://github.com/XxxRaiconxxX/kingdoom-fichas/releases/download/latest/app-debug.apk'),
  'Official Kingdoom Fichas APK link is missing.'
);
assert.ok(html.includes('rel="noopener noreferrer"'), 'External release link must be isolated.');
assert.equal(/\[(?:completar|pendiente)[^\]]*\]/i.test(html), false, 'Canon placeholders must not reach the public site.');
assert.equal(/<script(?![^>]*\bsrc=)/i.test(html), false, 'Inline scripts would violate the Vercel CSP.');
assert.equal(/<style[\s>]/i.test(html), false, 'Inline styles would violate the Vercel CSP.');

assert.ok(css.includes('@media (max-width: 920px)'), 'Tablet/mobile layout breakpoint is missing.');
assert.ok(css.includes('@media (min-width: 921px)'), 'Desktop density breakpoint is missing.');
assert.ok(css.includes('--sidebar-width: 229px'), 'Desktop sidebar density is missing.');
assert.ok(css.includes('--content-width: 944px'), 'Desktop content density is missing.');
assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'), 'Reduced-motion support is missing.');
assert.ok(css.includes('min-height: 46px'), 'Touch target baseline is missing.');

const securityHeaders = vercel.headers?.[0]?.headers ?? [];
assert.ok(
  securityHeaders.some(({ key }) => key === 'Content-Security-Policy'),
  'Vercel Content-Security-Policy header is missing.'
);

console.log(`SITE_OK sections=${requiredSections.length} races=92 rules=18 anchors=${localLinks.length}`);
