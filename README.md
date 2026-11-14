# Chambita · Landing Page

Landing page of **Chambita**, the marketplace by Chambita Labs that connects verified university students with
entrepreneurs in Lima (UPC · 1ASI0728 Arquitecturas de Software Emergentes). User stories US01–US08 (EP01).

## Content

| Section | User story |
|---------|------------|
| Hero with the value proposition and two calls to action, navigation by sections | US01 |
| For students: how it works and download of the Android app (APK) | US02 |
| For entrepreneurs: how it works, protected payment and link to the web application sign-up | US03 |
| Verifiable certificates and link to the public verification portal | US04 |
| About-the-Product video and testimonials from the validation interviews | US05 |
| Team and About-the-Team video | US06 |
| Language switch: English by default, Latin American Spanish, kept while navigating | US07 |
| Terms and conditions and privacy policy (Law No. 29733) in `terms.html` | US08 |

SEO and Open Graph tags follow section 6.2.4 of the report (`hreflang` en / es-419, `og:image`, `robots.txt`, `sitemap.xml`).

## Configuration

`js/config.js` holds the public links: web application, verification portal, APK (Google Drive), contact email,
YouTube ids of the videos and the testimonials. Testimonials and videos stay hidden until real ones are added.

## Run and test

```bash
npm start   # http://localhost:5600
npm test    # Node.js test runner: translations, SEO tags, sections and terms
```

## Deployment

Static site on Vercel (no build step).

## Conventions

GitFlow, Semantic Versioning and Conventional Commits. Code in English; texts in en_US and es_419.
