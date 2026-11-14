import { config } from "./config.js";
import { htmlLanguage, resolveLanguage, translate } from "./i18n.js";
import { youtubeEmbedUrl } from "./media.js";

const STORAGE_KEY = "chambita.language";
let language = resolveLanguage(new URLSearchParams(location.search).get("lang"), readSaved());

function readSaved() {
  try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
}

function save(value) {
  try { localStorage.setItem(STORAGE_KEY, value); } catch { /* the choice still applies to this page */ }
}

function t(key) {
  return translate(language, key);
}

function setMeta(selector, value) {
  document.querySelector(selector)?.setAttribute("content", value);
}

function applyLanguage() {
  document.documentElement.lang = htmlLanguage(language);
  const isTerms = document.body.dataset.page === "terms";
  document.title = isTerms ? `Chambita · ${t("terms.title")}` : t("meta.title");
  setMeta('meta[name="description"]', t("meta.description"));
  setMeta('meta[name="keywords"]', t("meta.keywords"));
  setMeta('meta[property="og:locale"]', language === "es" ? "es_419" : "en_US");
  document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = t(node.dataset.i18n); });
  document.querySelectorAll("[data-i18n-label]").forEach((node) => node.setAttribute("aria-label", t(node.dataset.i18nLabel)));
  document.querySelectorAll("[data-language]").forEach((button) =>
    button.setAttribute("aria-pressed", String(button.dataset.language === language)));
  document.querySelectorAll("[data-lang]").forEach((node) => { node.hidden = node.dataset.lang !== language; });
  // Keep the language when moving between the landing page and the terms (US07).
  document.querySelectorAll('a[href^="terms.html"], a[href^="index.html"]').forEach((link) => {
    const [path, hash] = link.getAttribute("href").split("#");
    link.setAttribute("href", `${path.split("?")[0]}?lang=${language}${hash ? `#${hash}` : ""}`);
  });
  renderTestimonials();
}

function setUpLinks() {
  const lang = () => (language === "es" ? "es" : "en");
  document.querySelectorAll("[data-link='publish']").forEach((link) => {
    link.href = `${config.webAppUrl}/sign-up?role=client`;
    link.addEventListener("click", () => { link.href = `${config.webAppUrl}/sign-up?role=client&lang=${lang()}`; });
  });
  document.querySelectorAll("[data-link='portal']").forEach((link) => { link.href = config.verificationPortalUrl; });
  document.querySelectorAll("[data-link='contact']").forEach((link) => { link.href = `mailto:${config.contactEmail}`; });
  document.querySelectorAll("[data-link='apk']").forEach((link) => {
    if (config.apkUrl) {
      link.href = config.apkUrl;
      link.rel = "noopener";
      link.target = "_blank";
    } else {
      link.hidden = true;
      document.querySelectorAll("[data-apk-soon]").forEach((note) => { note.hidden = false; });
    }
  });
}

function setUpMenu() {
  const button = document.querySelector(".menu-button");
  const menu = document.getElementById("site-menu");
  if (!button || !menu) return;
  const close = () => {
    button.setAttribute("aria-expanded", "false");
    button.dataset.i18nLabel = "menu.open";
    button.setAttribute("aria-label", t("menu.open"));
    menu.classList.remove("site-menu--open");
  };
  button.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") !== "true";
    if (!open) return close();
    button.setAttribute("aria-expanded", "true");
    button.dataset.i18nLabel = "menu.close";
    button.setAttribute("aria-label", t("menu.close"));
    menu.classList.add("site-menu--open");
  });
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") close(); });
}

function setUpVideos() {
  const ids = { product: config.productVideoId, team: config.teamVideoId };
  document.querySelectorAll("[data-video]").forEach((container) => {
    const src = youtubeEmbedUrl(ids[container.dataset.video]);
    if (!src) return;
    const play = container.querySelector(".video__play");
    container.querySelector(".video__soon").hidden = true;
    play.hidden = false;
    // The video plays inside the page (US05, US06); YouTube loads only after the click.
    play.addEventListener("click", () => {
      const frame = document.createElement("iframe");
      frame.src = `${src}?autoplay=1&hl=${language}`;
      frame.title = play.getAttribute("aria-label");
      frame.allow = "autoplay; encrypted-media; picture-in-picture";
      frame.allowFullscreen = true;
      container.replaceChildren(frame);
    });
  });
}

function renderTestimonials() {
  const list = document.getElementById("testimonials");
  if (!list) return;
  const items = config.testimonials ?? [];
  document.getElementById("testimonials-soon").hidden = items.length > 0;
  list.replaceChildren(...items.map((item) => {
    const figure = document.createElement("figure");
    figure.className = "card testimonial";
    const quote = document.createElement("blockquote");
    quote.textContent = `“${item.quote[language] ?? item.quote.en}”`;
    const caption = document.createElement("figcaption");
    caption.className = "muted small";
    caption.textContent = `${item.name} · ${item.role[language] ?? item.role.en}`;
    figure.append(quote, caption);
    return figure;
  }));
}

document.querySelectorAll("[data-language]").forEach((button) => button.addEventListener("click", () => {
  language = button.dataset.language;
  save(language);
  const url = new URL(location.href);
  url.searchParams.set("lang", language);
  history.replaceState(null, "", url);
  applyLanguage();
  scrollToLegalAnchor();
}));

/** Terms page: #terms and #privacy point to the article of the current language. */
function scrollToLegalAnchor() {
  if (document.body.dataset.page !== "terms" || !location.hash) return;
  const id = location.hash.slice(1).replace(/-es$/, "");
  document.getElementById(language === "es" ? `${id}-es` : id)?.scrollIntoView();
}

setUpLinks();
setUpMenu();
setUpVideos();
applyLanguage();
scrollToLegalAnchor();
