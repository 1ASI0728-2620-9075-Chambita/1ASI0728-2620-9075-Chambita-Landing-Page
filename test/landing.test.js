import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { htmlLanguage, messages, resolveLanguage, translate } from "../js/i18n.js";
import { youtubeEmbedUrl } from "../js/media.js";

const pages = ["index.html", "terms.html"].map((file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8"));
const usedKeys = new Set(pages.flatMap((html) =>
  [...html.matchAll(/data-i18n(?:-label)?="([^"]+)"/g)].map((match) => match[1])));

test("English is the default language (US07)", () => {
  assert.equal(resolveLanguage(null, null), "en");
  assert.equal(htmlLanguage("en"), "en-US");
});

test("the saved choice or ?lang= switches to Latin American Spanish (US07)", () => {
  assert.equal(resolveLanguage(null, "es"), "es");
  assert.equal(resolveLanguage("en", "es"), "en");
  assert.equal(resolveLanguage("fr", null), "en");
  assert.equal(htmlLanguage("es"), "es-419");
});

test("both languages have exactly the same keys", () => {
  assert.deepEqual(Object.keys(messages.es).sort(), Object.keys(messages.en).sort());
});

test("every text of the pages is translated", () => {
  const missing = [...usedKeys].filter((key) => !(key in messages.en));
  assert.deepEqual(missing, []);
  assert.equal(translate("es", "nav.how"), "Cómo funciona");
});

test("SEO texts follow section 6.2.4", () => {
  assert.equal(messages.en["meta.title"], "Chambita · Real projects for university students");
  assert.equal(messages.es["meta.title"], "Chambita · Proyectos reales para universitarios");
  assert.match(pages[0], /hreflang="es-419"/);
  assert.match(pages[0], /property="og:image"/);
});

test("the landing page links every section of the navigation (US01)", () => {
  for (const id of ["how-it-works", "students", "entrepreneurs", "certificates", "team"]) {
    assert.match(pages[0], new RegExp(`href="#${id}"`));
    assert.match(pages[0], new RegExp(`id="${id}"`));
  }
});

test("the terms explain Law No. 29733 and that the blockchain has no personal data (US08)", () => {
  assert.match(pages[1], /Law No\. 29733/);
  assert.match(pages[1], /Ley N\.° 29733/);
  assert.match(pages[1], /never records names, emails or other personal data/);
});

test("videos only embed valid YouTube ids", () => {
  assert.equal(youtubeEmbedUrl("dQw4w9WgXcQ"), "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
  assert.equal(youtubeEmbedUrl(""), null);
  assert.equal(youtubeEmbedUrl("javascript:alert(1)"), null);
});
