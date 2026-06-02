# Website Data Architecture

## Overview

Content lives in two forms:

1. **Bilingual JSON** in `data/` — hand-edited section content. Translatable
   strings are `{ "en", "zh" }` objects; other values are plain.
2. **Markdown sources** in `content/` — list-style content (members,
   publications, theses) compiled into JSON by `scripts/build-data.mjs`.

```
content/*.md  ──(npm run build)──►  data/{members,teacher_publish,student_history_research}.json
                                          │
data/*.json (hand-edited + generated) ────┤
                                          ▼
                                  assets/js/data-loader.js
                            fetch (Promise.all) → localize({en,zh}) → render
                                          ▼
                                      index.html
```

## Runtime data flow

`data-loader.js`:

1. `loadData()` fetches every file in `data/` in parallel and caches the raw
   bilingual objects in `this.rawData`.
2. `applyLanguage()` runs `localizeData(rawData, lang)`, recursively collapsing
   each `{ en, zh }` leaf to the active language string, leaving arrays and
   plain values untouched.
3. The `renderXxx()` methods consume the localized data and populate
   `index.html`. Because localization already produced plain strings, render
   logic is language-agnostic.
4. The language toggle changes `lang`, re-runs `applyLanguage()` and re-renders
   from the cached raw data — **no refetch**.

## Loading state

`<body>` starts with `is-loading`, which hides text content via CSS. The loader
removes the class after rendering (or on failure), so content fades in and no
empty placeholders flash.

## Files

### Hand-edited bilingual JSON
`site`, `navigation`, `hero`, `about`, `fields`, `contact`, `footer`,
`research_meta`, `publications_meta`.

### Generated (do not edit; build artifacts, git-ignored)
| Output | Source | Notes |
|---|---|---|
| `members.json` | `content/members.md` | Section meta + `items`; member `image` is a path, URL, or pasted GitHub `<img>` tag (src extracted at build) |
| `teacher_publish.json` | `content/publications.md` | `items` split by `category` into `conference_papers` / `preprints` |
| `student_history_research.json` | `content/research.md` | `items` emitted as a flat array |

## Build

```bash
npm install      # first time
npm run build    # content/*.md → data/*.json
```

`scripts/build-data.mjs` parses YAML frontmatter with `gray-matter`. GitHub
Actions runs the build on every push/PR to `main` and deploys to GitHub Pages.

## Adding a new section

1. Add a `<section>` block in `index.html`.
2. Create `data/new-section.json` with bilingual `{ en, zh }` values
   (or a `content/new-section.md` + build rule for list-style data).
3. Add a stylesheet in `assets/css/` and link it in `<head>` if needed.
4. Add fetch + render logic in `assets/js/data-loader.js`.
