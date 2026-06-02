// Build step: compile the Markdown content sources in content/*.md into the
// JSON files consumed by the website at runtime (assets/js/data-loader.js).
//
//   content/members.md      -> data/members.json
//   content/publications.md -> data/teacher_publish.json
//   content/research.md     -> data/student_history_research.json
//
// Each .md file carries its structured data as YAML frontmatter. Bilingual
// fields use { en, zh } objects, which the data loader collapses to the
// active language in the browser.
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

function readFrontmatter(name) {
  const filePath = path.join(contentDir, name);
  const { data } = matter(fs.readFileSync(filePath, 'utf8'));
  return data;
}

function writeJson(name, value) {
  const filePath = path.join(dataDir, name);
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n');
  console.log(`✓ wrote ${path.relative(root, filePath)}`);
}

// Member photos may be given either as a plain path/URL or as a pasted HTML
// <img> tag (the form GitHub produces when you paste an image into Markdown,
// e.g. <img ... src="https://github.com/user-attachments/assets/..." />).
// Normalize both to the bare src URL/path the website expects.
function normalizeImage(value) {
  if (typeof value !== 'string') return value;
  const tag = value.match(/<img\b[^>]*?\bsrc\s*=\s*["']([^"']+)["'][^>]*>/i);
  return (tag ? tag[1] : value).trim();
}

// --- Members -----------------------------------------------------------------
// The frontmatter already matches the members.json shape (section meta + items).
const members = readFrontmatter('members.md');
if (Array.isArray(members.items)) {
  members.items = members.items.map((item) => ({ ...item, image: normalizeImage(item.image) }));
}
writeJson('members.json', members);

// --- Faculty publications ----------------------------------------------------
// Split a single `items` list into conference_papers / preprints by category,
// dropping the `category` discriminator from the emitted records.
const publications = readFrontmatter('publications.md');
const pubItems = publications.items || [];
const stripCategory = ({ category, ...rest }) => rest;
const isPreprint = (category) => category === 'preprint' || category === 'preprints';
writeJson('teacher_publish.json', {
  conference_papers: pubItems.filter((p) => p.category === 'conference').map(stripCategory),
  preprints: pubItems.filter((p) => isPreprint(p.category)).map(stripCategory),
});

// --- Student research --------------------------------------------------------
// Emitted as a flat array (matches the existing student_history_research.json).
const research = readFrontmatter('research.md');
writeJson('student_history_research.json', research.items || []);

console.log('Data build complete.');
