# NTHU Quantum Lab Website 清大量子計算實驗室網站

Official website for the **NTHU Quantum Computing Lab**.
**Live site / 網站：** https://qulab.cs.nthu.edu.tw

---

# Part 1 — 如何新增 / 修改內容 (How to edit content)

> 你**幾乎不用碰 HTML/JS**。所有內容都在 `content/*.md`（成員、論文）和 `data/*.json`（區塊文字）裡。
> 改完之後一定要**重新編譯**（見下方），網站才會更新。

## 🟢 編輯流程（兩種方式擇一）

**A. 在 GitHub 網站上直接改（推薦給非工程人員）**
1. 在 GitHub 上打開要改的檔案 → 點鉛筆 ✏️ 編輯 → 預覽（Preview）確認排版/照片正確。
2. 送出 → 開一個 Pull Request（PR）。
3. CI 會自動編譯並產生**預覽網址**（留言在 PR 上，如 `https://qulab.cs.nthu.edu.tw/pr-preview/pr-12/`）。
4. 確認預覽沒問題後，由 owner merge → 正式站自動更新。

**B. 在本機改**
```bash
npm install        # 第一次才需要
# 編輯 content/*.md 或 data/*.json
npm run build      # 把 content/*.md 編譯成 data/*.json
python3 -m http.server 8000   # 開 http://localhost:8000 預覽
```

> 雙語規則：可翻譯的文字一律寫成 **`English | 中文`**（`.md` 檔），或 **`{ "en": ..., "zh": ... }`**（`.json` 檔）。只寫一種語言就中英共用。

---

## 👥 成員 — `content/members.md`

每位成員一個 `## 區塊`。在 GitHub 預覽此檔會直接看到照片與資料，**一眼就能確認改對了**。

```markdown
## Han-Hsuan Lin | 林瀚仚

![photo](../assets/img/person/advisor.avif)

- **Position 職稱:** Advisor | 指導教授
- **Tag 分類:** current
- **Highlight 強調:** yes
- **Bias 照片位置:** 0, 0
- **Link 個人連結:** https://...
```

| 欄位 | 說明 |
|---|---|
| `## 標題` | 姓名，`English \| 中文` |
| 照片 | `![photo](../assets/img/person/檔名.avif)`（相對 `content/`，預覽才看得到；編譯時自動去掉 `../`），或直接**貼上** GitHub 圖片 `<img src="https://github.com/user-attachments/...">` |
| `Position 職稱` | 職稱，雙語 |
| `Tag 分類` | `current`（現任）或 `past`（歷屆） |
| `Highlight 強調` | `yes` / `no`（指導教授用 yes） |
| `Bias 照片位置` | `x, y` 百分比，微調圓框內照片位置 |
| `Link 個人連結` | 可省略；有填則點照片會開啟 |

**新增成員**：複製一個 `##` 區塊改內容；放照片到 `assets/img/person/` 或直接貼上圖片。

---

## 📄 教師論文 — `content/publications.md`

用 `## Conference Papers` / `## Preprints` 分類，每篇一個 `### 標題`。

```markdown
## Conference Papers | 會議論文

### Oracles with costs

- **Authors 作者:** Shelby Kimmel, Chi-Yuan-Yi Lin, Han-Hsuan Lin
- **Year 年份:** 2015
- **arXiv:** 1502.02174
- **URL 連結:** https://arxiv.org/abs/1502.02174
- **Venue 發表場合:** TQC 2015, 10th Conference ...
```

`Authors` 用逗號分隔；`Venue` 可省略（preprint 通常沒有）。標題/作者一般是英文，直接寫即可。

---

## 🎓 學生學位論文 — `content/research.md`

每篇一個 `### English title | 中文標題`。

```markdown
### Depth-Limited Quantum Approximate Counting Algorithm | 深度有限的量子近似計數算法

- **Author 作者:** Lei, Hao-Zhe | 雷皓哲
- **Advisor 指導教授:** Lin, Han-Hsuan | 林瀚仚
- **Year 年份:** 2024
- **Link 連結:** https://etd.lib.nthu.edu.tw/detail/...
```

---

## 🧩 區塊文字 / 導覽列 / 聯絡資訊 — `data/*.json`

這些是手寫的雙語 JSON，可翻譯欄位是 `{ "en": ..., "zh": ... }`，**兩種語言都要改**。

| 要改什麼 | 檔案 |
|---|---|
| 網站標題 / Logo | `data/site.json` |
| 導覽列 | `data/navigation.json` |
| 首頁 Hero | `data/hero.json` |
| 關於我們 | `data/about.json` |
| 研究領域 | `data/fields.json` |
| 聯絡資訊 | `data/contact.json` |
| 頁尾 | `data/footer.json` |
| 「論文發表」區塊標題/標籤 | `data/publications_meta.json` |
| 「學生研究」區塊標題/標籤 | `data/research_meta.json` |

範例：
```json
{ "title": { "en": "What we are doing", "zh": "我們在做什麼" } }
```

> ⚠️ `data/members.json`、`data/teacher_publish.json`、`data/student_history_research.json` 是**自動產生**的（從 `content/*.md` 編譯），**不要直接改**——改 `content/*.md`。

---

# Part 2 — 架構與技術 (Architecture)

## Tech stack

| Layer | Technology |
|---|---|
| Markup | HTML5（單頁、slot-based） |
| Styling | Bootstrap 5.3.7 + 自訂 CSS |
| Scripting | Vanilla JavaScript |
| Content | 雙語 JSON (`{ en, zh }`) + 可閱讀 Markdown |
| Build | Node.js 腳本（`content/*.md` → `data/*.json`） |
| Hosting | GitHub Pages（`gh-pages` 分支）+ 自訂網域 `qulab.cs.nthu.edu.tw` |

## Project structure

```
nthuqulab.github.io/
├── index.html                         # HTML 外殼（內容由 JS 注入）
├── package.json                       # build 腳本 + gray-matter 依賴
├── content/                           # ✏️ 可閱讀 Markdown 內容來源
│   ├── members.md                     #   → data/members.json
│   ├── publications.md                #   → data/teacher_publish.json
│   └── research.md                    #   → data/student_history_research.json
├── scripts/build-data.mjs             # 把 content/*.md 編譯成 data/*.json
├── .github/workflows/deploy.yml       # build + 部署（含 PR 預覽）
├── assets/
│   ├── css/                           # main / contact / publications / research
│   ├── js/
│   │   ├── data-loader.js             # 載入 JSON、依語言渲染
│   │   └── main.js                    # UI 互動（捲動、行動選單、深色模式）
│   └── img/person/                    # 成員照片（AVIF）
└── data/                              # ✏️ 手寫雙語 JSON（+ 3 個自動產生的檔）
```

## 雙語與載入機制

- 每個區塊**一個** JSON 檔，可翻譯字串是 `{ en, zh }`，非翻譯值（圖片、連結、icon）維持原樣。
- `data-loader.js` 載入後用 `localizeData()` 把每個 `{ en, zh }` 依目前語言收合成字串，所以渲染邏輯與語言無關。
- 切換語言時**重新收合快取資料並重繪，不再發網路請求**；語言偏好存在 `localStorage`。
- `<body>` 初始有 `is-loading`，CSS 先隱藏文字；渲染完成後移除 → 內容淡入，**不會閃出空白占位符**。

## Build step

`scripts/build-data.mjs` 解析可閱讀 Markdown（標題 + `- **Label:** value` 條列；雙語 `English | 中文`）：

| 來源 | → | 產出 |
|---|---|---|
| `content/members.md` | → | `data/members.json` |
| `content/publications.md` | → | `data/teacher_publish.json`（依 `## 分類` 拆成 conference / preprints） |
| `content/research.md` | → | `data/student_history_research.json` |

```bash
npm run build
```

產出的 3 個 JSON 是 **build 產物（git-ignored）**；GitHub Actions 每次部署會重新編譯。

## Deployment（GitHub Pages + PR 預覽）

`.github/workflows/deploy.yml` 會 build 後發佈到 **`gh-pages`** 分支：

- **push 到 `main`** → 部署正式站到分支根目錄 → `https://qulab.cs.nthu.edu.tw/`
- **對 `main` 開 PR** → 部署預覽到 `pr-preview/pr-<N>/` 並在 PR 留言預覽網址；PR 關閉時自動清除。

**一次性設定**：repo → **Settings → Pages → Source → "Deploy from a branch" → `gh-pages` / (root)**。自訂網域（`CNAME`）會自動保留。

## Local preview

```bash
npm install        # 第一次
npm run build      # 從 content/*.md 產生 data/*.json
python3 -m http.server 8000
# 開 http://localhost:8000
```
