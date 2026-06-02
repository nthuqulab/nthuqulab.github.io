# Data Directory

Content the website loads at runtime. Each file is **bilingual**: translatable
strings are `{ "en": ..., "zh": ... }` objects; non-translatable values
(image paths, hrefs, icons, emails) are plain values. `assets/js/data-loader.js`
collapses each `{ en, zh }` leaf to the active language in the browser.

## Files

| File | Description | Source |
|------|-------------|--------|
| `site.json` | Site title, logo, favicon | edit here |
| `navigation.json` | Navigation menu items | edit here |
| `hero.json` | Hero section content and CTAs | edit here |
| `about.json` | About section | edit here |
| `fields.json` | Research field tabs | edit here |
| `contact.json` | Contact info and labels | edit here |
| `footer.json` | Footer links and contact | edit here |
| `research_meta.json` | Student research section labels | edit here |
| `publications_meta.json` | Publications section labels | edit here |
| `members.json` | Lab members | **generated** from `content/members.md` |
| `teacher_publish.json` | Faculty publications | **generated** from `content/publications.md` |
| `student_history_research.json` | Student theses | **generated** from `content/research.md` |

> **Generated** files are build artifacts (git-ignored). Do not edit them
> directly — edit the matching `content/*.md` and run `npm run build`.

## Bilingual format

```json
{
  "title": { "en": "What we are doing", "zh": "我們在做什麼" },
  "image": "assets/img/frontcover.jpg"
}
```

When editing, update **both** `en` and `zh` in each `{ en, zh }` object.

## Editing

1. Section text/labels → edit the JSON file here (keep `en`/`zh` in sync).
2. Members / publications / theses → edit `content/*.md`, then `npm run build`.
3. Validate JSON syntax, then preview locally (`python3 -m http.server`).

See the top-level [`README.md`](../README.md) and [`STRUCTURE.md`](STRUCTURE.md)
for the full architecture and build/deploy workflow.
