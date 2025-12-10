# Website Data Structure

## Directory Layout

```
/Users/doggylin/Documents/LabWebsite/
├── index.html                      # Main HTML (slot-based, no hardcoded content)
├── extracted_data.json            # Original monolithic file (11KB) [deprecated]
├── data/                          # New modular data structure
│   ├── site.json                  # 168B - Site metadata
│   ├── navigation.json            # 307B - Nav menu
│   ├── hero.json                  # 633B - Hero section
│   ├── about.json                 # 676B - About section
│   ├── fields.json                # 2.7KB - Research fields
│   ├── members.json               # 2.0KB - Student/member info
│   ├── faq.json                   # 2.1KB - FAQ items
│   ├── contact.json               # 1.1KB - Contact info
│   ├── footer.json                # 1.3KB - Footer content
│   └── README.md                  # Documentation
└── assets/
    └── js/
        └── data-loader.js         # Dynamic content loader
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      index.html                              │
│                  (Slot-based placeholders)                   │
│  [Logo] [Hero Title] [About Section] [Dynamic Content]...   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   data-loader.js                             │
│              Parallel data loading engine                     │
└──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬────┘
       │      │      │      │      │      │      │      │
       ▼      ▼      ▼      ▼      ▼      ▼      ▼      ▼
   ┌─────┐ ┌────┐ ┌────┐ ┌─────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐
   │site │ │nav │ │hero│ │about│ │flds│ │mems│ │faq │ │foot│
   └─────┘ └────┘ └────┘ └─────┘ └────┘ └────┘ └────┘ └────┘
      ▲      ▲      ▲       ▲       ▲      ▲      ▲      ▲
      └──────┴──────┴───────┴───────┴──────┴──────┴──────┘
                    All files loaded in parallel
                    using Promise.all()
```

## Comparison: Monolithic vs Modular

### Before (Monolithic)
```json
{
  "site": { ... },
  "navigation": [ ... ],
  "hero": { ... },
  "about": { ... },
  "fields": { ... },
  "members": { ... },
  "faq": [ ... ],
  "contact": { ... },
  "footer": { ... }
}
```
- **Size:** 11KB single file
- **Loading:** One HTTP request
- **Editing:** Must edit large file, risk of syntax errors
- **Version control:** Large diffs for small changes
- **Caching:** Entire file re-downloaded on any change

### After (Modular)
```
data/
├── site.json          (168B)
├── navigation.json    (307B)
├── hero.json          (633B)
├── about.json         (676B)
├── fields.json        (2.7KB)
├── members.json       (2.0KB)
├── faq.json           (2.1KB)
├── contact.json       (1.1KB)
└── footer.json        (1.3KB)
```
- **Size:** ~11KB total (9 files)
- **Loading:** 9 parallel HTTP requests (faster with HTTP/2)
- **Editing:** Edit only relevant section
- **Version control:** Clean, focused diffs
- **Caching:** Only changed files re-downloaded
- **Organization:** Clear separation of concerns

## Benefits

### 1. **Modularity**
Each section is independent. Update navigation without touching hero data.

### 2. **Maintainability**
Smaller files are easier to read, edit, and validate.

### 3. **Collaboration**
Team members can work on different sections without merge conflicts.

### 4. **Performance** (with HTTP/2)
Parallel loading can be faster than one large file.
Better caching granularity.

### 5. **Clarity**
Clear file names indicate content purpose.
Easier to locate specific data.

### 6. **Error Isolation**
Syntax error in one file doesn't break entire site.

## Usage Example

### Editing Navigation
```bash
# Before: Edit 11KB file, find navigation section
vim extracted_data.json

# After: Edit 307B file directly
vim data/navigation.json
```

### Adding a Student/Member
```bash
# Just edit members.json
vim data/members.json

# Add new student/member to the "items" array
# No need to touch other sections
```

### Updating Contact Info
```bash
# Edit only contact data
vim data/contact.json

# Change email, phone, or address
# All other sections unchanged
```

## Migration Path

The old `extracted_data.json` file is kept for reference but is no longer used. The `data-loader.js` now loads from the modular structure in the `data/` directory.

To rollback (if needed):
1. Update `data-loader.js` to fetch from `extracted_data.json`
2. Restore the old `loadData()` method

## Future Enhancements

Possible improvements:
- Add validation schema for each JSON file
- Implement versioning for data files
- Add TypeScript types for data structures
- Create admin UI for editing JSON files
- Add build step to combine files for production
