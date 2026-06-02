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
| Content | Modular JSON files (bilingual EN/ZH) |
| Deployment | GitHub Pages |

No build system or package manager is required — the site is served directly as static files.

---

## Project Structure

```
nthuqulab.github.io/
├── index.html                        # Main HTML shell (slot-based, no hardcoded content)
├── assets/
│   ├── css/
│   │   ├── main.css                  # Primary stylesheet
│   │   ├── contact.css               # Contact section styles
│   │   ├── publications.css          # Publications section styles
│   │   └── research.css              # Research section styles
│   ├── js/
│   │   ├── data-loader.js            # Loads JSON data and renders into HTML slots
│   │   └── main.js                   # UI interactions (scroll, mobile nav, dark mode)
│   ├── img/
│   │   ├── frontcover.jpg            # Hero background image
│   │   └── person/                   # Team member photos (AVIF format)
│   ├── scss/                         # SCSS source files
│   └── vendor/                       # Bootstrap CSS + JS
└── data/                             # Content data files — edit these to update the site
    ├── site.json                     # Page title, logo, favicon
    ├── navigation.json               # Navigation menu items
    ├── hero.json                     # Hero section content and CTAs
    ├── about.json                    # About / mission section
    ├── fields.json                   # Research fields and descriptions
    ├── members.json                  # Team member list with images
    ├── contact.json                  # Contact information
    ├── footer.json                   # Footer links and copyright
    ├── teacher_publish.json          # Advisor publications
    ├── student_history_research.json # Student research history
    ├── student_info.json             # Student details
    ├── research_meta.json            # Research section metadata
    ├── publications_meta.json        # Publications section metadata
    ├── *.zh.json                     # Chinese translations of the above
    ├── README.md                     # Data directory documentation
    └── STRUCTURE.md                  # Detailed data architecture notes
```

### How Content Is Rendered

`data-loader.js` fetches all JSON files in **parallel** (`Promise.all`) and populates HTML slots in `index.html`. Each slot is a placeholder like `[Hero Title]` or `[About Title]` that gets replaced at runtime.

- **Content edits** → edit `data/` JSON files, no HTML changes needed
- **UI/layout changes** → edit `assets/css/` or `index.html`
- **Bilingual support** → `*.zh.json` variants are loaded when the user switches language

---

## How to Update the Site

### 1. Update content (text, links, team info, publications)

Edit the relevant JSON file in `data/`. Always update both `<file>.json` (English) and `<file>.zh.json` (Chinese) to keep both languages in sync.

| What to change | File to edit | resource |
|---|---|---|
| Site title / logo | `data/site.json` |    |
| Navigation links | `data/navigation.json` |   |
| Hero section | `data/hero.json` | |
| About section | `data/about.json` |   |
| Research fields | `data/fields.json` |    |
| Team members | `data/members.json` |  |
| Contact info | `data/contact.json` |  |
| Footer | `data/footer.json` | |
| Advisor publications | `data/teacher_publish.json` |  |
| Student research | `data/student_history_research.json` | [query webpage](https://etd.lib.nthu.edu.tw/search/?csrfmiddlewaretoken=MVRTq7BP45DUtwM08J2avzppKjYFiJyl9hMxxEPSV2J8QyupnwpsDCaNTf2Wc6tL&query_term=%E6%9E%97%E7%80%9A%E4%BB%9A&query_field=text&match_type=phrase&query_op=) |

### 2. Update images

Place images in `assets/img/person/` for team photos. Use **AVIF format** for best performance, then update the `image` path in `data/members.json`.

### 3. Update styles

Edit files in `assets/css/`. Each section has its own stylesheet. If editing SCSS, compile from `assets/scss/` — the compiled output goes to `assets/css/`.

---

## Modifying index.html

`index.html` is the **structural shell** of the site. Content inside it is not hardcoded — it is populated by `data-loader.js` at runtime. You only need to edit `index.html` for **layout or structural changes**, not for content updates.

### Sections and their HTML IDs

| Section | `id` attribute | Data source |
|---|---|---|
| Navigation | `#navmenu` | `navigation.json` |
| Hero | `#hero` | `hero.json` |
| About | `#about` | `about.json` |
| Research Fields | `#fields` | `fields.json` |
| Team Members | `#members` | `members.json` |
| Student Research | `#research` | `student_history_research.json` + `research_meta.json` |
| Publications | `#publications` | `teacher_publish.json` + `publications_meta.json` |
| Contact | `#contact` | `contact.json` |
| Footer | `#footer` | `footer.json` |

### Slot placeholders

Slots are text nodes like `[Hero Title]` or `[About Title]` inside HTML elements. `data-loader.js` targets these elements by selector and replaces their `textContent` or `innerHTML`. **Do not remove or rename these placeholder elements** unless you update the corresponding selector in `data-loader.js`.

Example slots visible in `index.html`:

```html
<!-- Filled by data-loader.js from hero.json -->
<h1 class="hero-title">[Hero Title]</h1>
<p class="hero-description">[Hero Description]</p>

<!-- Filled from about.json -->
<span class="section-badge">[Section Badge]</span>
<h2>[About Title]</h2>
<p class="lead-text">[Lead Text]</p>

<!-- Filled from contact.json -->
<h2 class="display-5 mb-4">[Contact Title]</h2>
<a href="mailto:[Email]" class="info-link">[Email]</a>
```

### When to edit index.html

| Task | Edit index.html? |
|---|---|
| Change section text / labels | No — edit the JSON file |
| Change layout or add a new section | Yes |
| Add / remove a CSS stylesheet | Yes — add `<link>` in `<head>` |
| Add / remove a JS file | Yes — add `<script>` before `</body>` |
| Change animation timing (`data-aos-delay`) | Yes |
| Add a new static UI element (e.g. a button) | Yes |

### Adding a new section

1. Add a `<section id="new-section">` block in `index.html` at the desired position.
2. Create `data/new-section.json` (and `data/new-section.zh.json` for Chinese).
3. Add a CSS file in `assets/css/` if needed, and link it in `<head>`.
4. Add the fetch and render logic to `assets/js/data-loader.js`.

### CSS and JS loading order

Stylesheets are loaded in `<head>` in this order:

```html
<link href="assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
<link href="assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
<link href="assets/css/main.css" rel="stylesheet">
<link href="assets/css/research.css" rel="stylesheet">
<link href="assets/css/publications.css" rel="stylesheet">
<link href="assets/css/contact.css" rel="stylesheet">
```

Scripts are loaded at the end of `<body>` in this order:

```html
<script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<!-- other vendor scripts (AOS, Swiper, etc.) -->
<script src="assets/js/main.js"></script>      <!-- UI interactions -->
<script src="assets/js/data-loader.js"></script> <!-- must load after main.js -->
```

`data-loader.js` must be last because it depends on the DOM and on `main.js` being initialized.

---

## Deployment Workflow

The site is hosted on **GitHub Pages** from the `main` branch. Any commit merged into `main` is automatically deployed.

### Branch protection

- **Direct pushes to `main` are not allowed.**
- All changes must go through a **pull request (PR)** and be reviewed before merging.

### Recommended workflow

```bash
# 1. Create a new branch for your change
git checkout -b your-branch-name

# 2. Make your edits (e.g., update a JSON file or index.html)

# 3. Stage and commit
git add data/members.json
git commit -m "update: add new member John Doe"

# 4. Push your branch
git push origin your-branch-name

# 5. Open a pull request on GitHub targeting main
# -> After review, merge -> GitHub Pages auto-deploys
```

After the PR is merged, GitHub Pages typically deploys within **1–2 minutes**.

---

## Local Preview

Since this is a static site, serve it locally for reliable preview (opening via `file://` may block JSON fetches due to CORS):

```bash
# Using Python (no install needed)
python3 -m http.server 8000
# Then open http://localhost:8000
```
