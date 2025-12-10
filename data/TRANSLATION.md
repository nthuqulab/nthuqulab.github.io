# Bilingual Website Translation Guide

## Overview

The website now supports bilingual content (English and Chinese). The language switching is handled automatically by loading language-specific JSON files.

## How It Works

### File Naming Convention

- **English files**: Use the original filename (e.g., `site.json`, `navigation.json`)
- **Chinese files**: Add `.zh` suffix before `.json` (e.g., `site.zh.json`, `navigation.zh.json`)

### Language Switching

- Click the language button in the navbar to switch languages
- Button shows "中文" when viewing English content
- Button shows "EN" when viewing Chinese content
- Language preference is saved in browser localStorage

## Files to Translate

To complete the Chinese translation, create the following files:

### Already Created ✅
- `site.zh.json` - Site metadata (title, logo)
- `navigation.zh.json` - Navigation menu items

### Need to Create ⏳

1. **hero.zh.json** - Hero section
   - Title, description, button text, floating cards

2. **about.zh.json** - About section
   - Badge, title, lead text, description

3. **fields.zh.json** - Research fields
   - Section title, description, tab titles and content

4. **members.zh.json** - Team members
   - Section title, description, member quotes

5. **student_history_research.zh.json** - Student research
   - Research titles, authors, advisors (may keep English names)

6. **research_meta.zh.json** - Research section metadata
   - Section title, title, description

7. **teacher_publish.zh.json** - Publications
   - Paper titles, authors (may keep English), venues

8. **publications_meta.zh.json** - Publications metadata
   - Section title, title, description

9. **contact.zh.json** - Contact information
   - Section title, description, badge, title, lead text

10. **footer.zh.json** - Footer content
    - Logo, description, link text, copyright

## Translation Tips

1. **Keep Structure**: Maintain the exact same JSON structure as the English files
2. **Proper Names**: You can keep proper names (people, institutions) in English
3. **Technical Terms**: Consider keeping technical terms in English if commonly used
4. **Consistency**: Use consistent terminology across all files

## Example Comparison

### English (site.json)
```json
{
  "title": "Qutum Lab 清大量子計算實驗室",
  "logo": "Qulab"
}
```

### Chinese (site.zh.json)
```json
{
  "title": "量子計算實驗室 - 清華大學量子計算實驗室",
  "logo": "量子計算實驗室"
}
```

## Testing

After creating translation files:
1. Refresh the website
2. Click the language toggle button
3. Verify all content switches to Chinese
4. Check for any missing translations (will show English fallback)

## Error Handling

If a Chinese translation file doesn't exist, the system will:
- Log an error in the console
- Continue loading other files
- Display English content as fallback for missing translations
