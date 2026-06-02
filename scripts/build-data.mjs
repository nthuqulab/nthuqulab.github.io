// Build step: compile the human-readable Markdown sources in content/*.md into
// the JSON files the website loads at runtime (assets/js/data-loader.js).
//
//   content/members.md      -> data/members.json
//   content/publications.md -> data/teacher_publish.json
//   content/research.md     -> data/student_history_research.json
//
// The Markdown is written so a maintainer can preview it on GitHub and see, at
// a glance, exactly what they edited: each item is a heading, photos render as
// images, and fields are a bullet list. Conventions:
//
//   - Each item is a "## Heading" (members) or "### Heading" (papers/theses).
//   - Bilingual text is written "English | 中文". A value with no "|" is used
//     for both languages. (Full-width "｜" is also accepted.)
//   - Fields are bullets: "- **Label:** value". Labels are matched loosely by
//     keyword, so "**Position 職稱:**" and "**Position:**" both work.
//   - A member photo is a Markdown image ![](path) or a pasted GitHub <img> tag.
//
// Run with: npm run build

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const contentDir = path.join(root, 'content');
const dataDir = path.join(root, 'data');

const read = (name) => matter(fs.readFileSync(path.join(contentDir, name), 'utf8'));

function writeJson(name, value) {
  fs.writeFileSync(path.join(dataDir, name), JSON.stringify(value, null, 2) + '\n');
  console.log(`✓ wrote data/${name}`);
}

// "English | 中文" -> { en, zh }; a string without a separator stays a string.
function bilingual(value) {
  if (typeof value !== 'string') return value;
  const idx = value.search(/[|｜]/);
  if (idx === -1) return value.trim();
  const en = value.slice(0, idx).trim();
  const zh = value.slice(idx + 1).trim();
  return zh ? { en, zh } : en;
}

// Extract an image src from a Markdown image ![](src) or a pasted <img> tag.
// Local paths are written relative to content/ (e.g. ../assets/img/...) so they
// render in GitHub's Markdown preview; we strip the leading ../ so the site
// gets a path relative to its root (assets/img/...). Absolute URLs (pasted
// GitHub <img> tags) are left untouched.
function extractImage(text) {
  const md = text.match(/!\[[^\]]*\]\(\s*([^)\s]+)/);
  const tag = text.match(/<img\b[^>]*?\bsrc\s*=\s*["']([^"']+)["']/i);
  const src = md ? md[1].trim() : tag ? tag[1].trim() : undefined;
  if (!src) return undefined;
  return /^(https?:)?\/\//i.test(src) ? src : src.replace(/^(\.\.\/)+/, '').replace(/^\.\//, '');
}

// Collect "- **Label:** value" bullets into [label, value] pairs.
function parseBullets(block) {
  const pairs = [];
  const re = /^[ \t]*[-*][ \t]*\*\*(.+?)\*\*[ \t]*[:：]?[ \t]*(.*)$/gm;
  let m;
  while ((m = re.exec(block))) pairs.push([m[1].trim(), m[2].trim()]);
  return pairs;
}

// Value of the first bullet whose label contains any of the keywords.
function field(bullets, ...keywords) {
  const hit = bullets.find(([label]) =>
    keywords.some((k) => label.toLowerCase().includes(k.toLowerCase())));
  return hit ? hit[1] : undefined;
}

// Split a Markdown body into { heading, body } sections at a heading level.
function sections(body, level) {
  const re = new RegExp(`^#{${level}}[ \\t]+(.+?)[ \\t]*$`, 'gm');
  const out = [];
  let m;
  let prev = null;
  while ((m = re.exec(body))) {
    if (prev) out.push({ heading: prev.heading, body: body.slice(prev.start, m.index) });
    prev = { heading: m[1].trim(), start: re.lastIndex };
  }
  if (prev) out.push({ heading: prev.heading, body: body.slice(prev.start) });
  return out;
}

function parseBias(value) {
  if (!value) return [0, 0];
  return value.split(',').map((n) => Number(n.trim()));
}

function parseBool(value) {
  return /^(yes|true|y|✓)$/i.test((value || '').trim());
}

// --- Members -----------------------------------------------------------------
{
  const { data: meta, content } = read('members.md');
  const members = {
    sectionTitle: bilingual(meta.sectionTitle),
    description: bilingual(meta.description),
    tabs: {
      all: bilingual(meta.tabs.all),
      current: bilingual(meta.tabs.current),
      past: bilingual(meta.tabs.past),
    },
    items: sections(content, 2).map((sec) => {
      const b = parseBullets(sec.body);
      const item = {
        name: bilingual(sec.heading),
        position: bilingual(field(b, 'position', '職稱')),
        image: extractImage(sec.body),
      };
      const link = field(b, 'link', '連結');
      if (link) item.link = link;
      item.bias = parseBias(field(b, 'bias', '位置'));
      item.highlight = parseBool(field(b, 'highlight', '強調'));
      item.tag = (field(b, 'tag', '分類') || 'current').toLowerCase();
      return item;
    }),
  };
  writeJson('members.json', members);
}

// --- Faculty publications ----------------------------------------------------
{
  const { content } = read('publications.md');
  const conference_papers = [];
  const preprints = [];
  for (const cat of sections(content, 2)) {
    const isPreprint = /preprint|預印/i.test(cat.heading);
    for (const paper of sections(cat.body, 3)) {
      const b = parseBullets(paper.body);
      const rec = {
        title: bilingual(paper.heading),
        authors: (field(b, 'authors', '作者') || '')
          .split(',')
          .map((a) => a.trim())
          .filter(Boolean),
        year: Number(field(b, 'year', '年份')),
        arXiv_id: field(b, 'arxiv'),
        url: field(b, 'url', '連結'),
      };
      const venue = field(b, 'venue', '場合');
      if (venue) rec.venue = venue;
      (isPreprint ? preprints : conference_papers).push(rec);
    }
  }
  writeJson('teacher_publish.json', { conference_papers, preprints });
}

// --- Student research --------------------------------------------------------
{
  const { content } = read('research.md');
  const items = sections(content, 3).map((sec) => {
    const b = parseBullets(sec.body);
    return {
      title: bilingual(sec.heading),
      author: bilingual(field(b, 'author', '作者')),
      advisor: bilingual(field(b, 'advisor', '指導')),
      year: Number(field(b, 'year', '年份')),
      download_link: field(b, 'link', '連結', 'download'),
    };
  });
  writeJson('student_history_research.json', items);
}

console.log('Data build complete.');
