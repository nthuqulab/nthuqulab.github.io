# NTHU Quantum Lab Website

Official website for the **National Tsing Hua University Quantum Computing Lab**, deployed via GitHub Pages.

**Live site:** [https://nthuqulab.github.io](https://nthuqulab.github.io)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 (single-page, slot-based) |
| Styling | Bootstrap 5.3.7 + Custom CSS/SCSS |
| Icons | Bootstrap Icons |
| Scripting | Vanilla JavaScript |
| Content | Bilingual JSON (`{ en, zh }`) + Markdown sources |
| Build | Node.js script (`content/*.md` → `data/*.json`) |
| Deployment | GitHub Pages via GitHub Actions |

The site itself runs as static files in the browser. A small Node build step compiles the Markdown content sources into the JSON the site loads.

---

## Project Structure

```
nthuqulab.github.io/
├── index.html                        # Main HTML shell (slot-based, no hardcoded content)
├── package.json                      # Build script + gray-matter dependency
├── content/                          # Markdown sources for list-style content
│   ├── members.md                    # Lab members  → data/members.json
│   ├── publications.md               # Faculty papers → data/teacher_publish.json
│   └── research.md                   # Student theses → data/student_history_research.json
├── scripts/
│   └── build-data.mjs                # Compiles content/*.md into data/*.json
├── .github/workflows/
│   └── deploy.yml                    # Build + deploy to GitHub Pages
├── assets/
│   ├── css/                          # main.css, contact.css, publications.css, research.css
│   ├── js/
│   │   ├── data-loader.js            # Loads JSON, picks language, renders into HTML
│   │   └── main.js                   # UI interactions (scroll, mobile nav, dark mode)
│   ├── img/person/                   # Team member photos (AVIF)
│   ├── scss/                         # SCSS source files
│   └── vendor/                       # Bootstrap CSS + JS
└── data/                             # Content the browser loads (bilingual JSON)
    ├── site.json                     # Page title, logo, favicon
    ├── navigation.json               # Navigation menu items
    ├── hero.json                     # Hero section content and CTAs
    ├── about.json                    # About / mission section
    ├── fields.json                   # Research fields and descriptions
    ├── contact.json                  # Contact information
    ├── footer.json                   # Footer links
    ├── research_meta.json            # Research section labels
    ├── publications_meta.json        # Publications section labels
    ├── members.json                  # GENERATED from content/members.md
    ├── teacher_publish.json          # GENERATED from content/publications.md
    ├── student_history_research.json # GENERATED from content/research.md
    ├── README.md                     # Data directory documentation
    └── STRUCTURE.md                  # Data architecture notes
```

> The three **GENERATED** files are build artifacts (git-ignored). Edit the matching `content/*.md` source and run `npm run build` instead of editing them directly.

---

## Bilingual content (`{ en, zh }`)

Every section has **one** JSON file holding both languages. Translatable strings are objects with `en` and `zh` keys; non-translatable values (image paths, hrefs, icons) stay as plain values:

```json
{
  "titleHighlight": { "en": "Quantum Lab", "zh": "量子計算實驗室" },
  "description":    { "en": "Quantum Lab was...", "zh": "量子計算實驗室成立於..." },
  "image": "assets/img/frontcover.jpg"
}
```

At runtime `data-loader.js` collapses each `{ en, zh }` leaf to the active language (`localizeData`). Switching language re-projects the already-loaded data — no extra network requests. Language preference is stored in `localStorage`.

There are **no** `*.zh.json` files anymore — both languages live side by side.

---

## How content is rendered

`data-loader.js` fetches all JSON files in parallel (`Promise.all`), localizes them to the chosen language, then renders into `index.html`. The page starts with the `is-loading` class on `<body>`, which hides text content; the class is removed once rendering finishes, so the content **fades in** and empty placeholders never flash on screen.

- **Section text/labels** → edit the bilingual JSON in `data/`
- **Members / publications / theses** → edit `content/*.md`, then `npm run build`
- **UI/layout** → edit `assets/css/` or `index.html`

---

## How to update the site

### Members, faculty publications, student theses (Markdown)

Edit the relevant file in `content/`. These are written as **readable Markdown** — open the file on GitHub and the rendered preview shows each item as a heading with its photo and fields, so you can confirm at a glance that your edit is correct. Conventions:

- Each item is a heading: `## Name | 中文姓名` (members) or `### Title | 中文標題` (papers / theses).
- **Bilingual text** is written `English | 中文`. A value with no `|` is used for both languages. (Full-width `｜` is also accepted.)
- **Fields** are bullets, `- **Label:** value`. Labels are matched by keyword, so `**Position 職稱:**` and `**Position:**` both work.

Per file:

- **`content/members.md`** — a small header (section title / description / tab labels), then one `## Name | 中文姓名` block per member with a photo and these fields: `Position`, `Tag` (`current`/`past`), `Highlight` (`yes`/`no`), `Bias` (`x, y` photo offset in %), and an optional `Link`.
- **`content/publications.md`** — `## Conference Papers` / `## Preprints` sections, each with `### Paper Title` blocks and fields: `Authors` (comma-separated), `Year`, `arXiv`, `URL`, optional `Venue`.
- **`content/research.md`** — one `### English title | 中文標題` block per thesis with fields: `Author`, `Advisor`, `Year`, `Link`.

Then regenerate the JSON:

```bash
npm install   # first time only
npm run build
```

### Section text, links, contact info (JSON)

Edit the relevant bilingual JSON file in `data/`, updating **both** the `en` and `zh` values in each `{ en, zh }` object.

### Images

Member photos are the image under each member in `content/members.md`, written as a normal Markdown image. Either:

- a local file in `assets/img/person/` (AVIF recommended), referenced **relative to `content/`** so it renders in the GitHub preview: `![photo](../assets/img/person/name.avif)` (the build strips the `../` for the site); or
- a pasted GitHub image — drag/paste an image into the Markdown editor on GitHub and keep the `![](...)` or `<img ... src="https://github.com/user-attachments/assets/..." />` it inserts. The build extracts the URL automatically, and it renders in the preview too.

### Styles

Edit files in `assets/css/`. If editing SCSS, compile from `assets/scss/`.

---

## Build step

`scripts/build-data.mjs` compiles the Markdown sources into the JSON the site loads:

| Source | → | Output |
|---|---|---|
| `content/members.md` | → | `data/members.json` |
| `content/publications.md` | → | `data/teacher_publish.json` (split into `conference_papers` / `preprints`) |
| `content/research.md` | → | `data/student_history_research.json` |

```bash
npm run build
```

The generated files are git-ignored; GitHub Actions builds them on every deploy.

---

## Deployment

The workflow (`.github/workflows/deploy.yml`) builds the site (`content/*.md` → `data/*.json`) and publishes it to a **`gh-pages`** branch:

- **Push to `main`** → deploys the production site to the branch root → live at the site URL.
- **Pull request to `main`** → deploys a **live preview** under `pr-preview/pr-<N>/` and comments the preview link on the PR. The preview is removed automatically when the PR is closed.

So every PR gets a clickable preview URL, e.g. `https://qulab.cs.nthu.edu.tw/pr-preview/pr-42/`, before it is merged.

### One-time setup

In the repository: **Settings → Pages → Build and deployment → Source → "Deploy from a branch"**, then choose branch **`gh-pages`** / **(root)**. The custom domain (`CNAME`) is preserved automatically. (The first run of the workflow creates the `gh-pages` branch.)

### Branch protection / workflow

Direct pushes to `main` are not allowed — open a pull request.

```bash
git checkout -b your-branch-name
# edit content/*.md, data/*.json, or assets/
npm run build            # regenerate data if you changed content/*.md
git add -A
git commit -m "update: ..."
git push origin your-branch-name
# open a PR targeting main → CI builds a preview + comments the link
#   → review on the preview URL → merge → production auto-deploys
```

---

## Local preview

Serve the site locally (opening via `file://` blocks JSON fetches due to CORS):

```bash
npm install        # first time only
npm run build      # generate data/members.json etc. from content/*.md
python3 -m http.server 8000
# open http://localhost:8000
```
