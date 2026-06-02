# Data Structure

This directory contains the content data for the website, split into modular JSON files for better organization and maintainability.

## Files Overview

| File | Size | Description |
|------|------|-------------|
| `site.json` | 168B | Site metadata (title, logo, favicon) |
| `navigation.json` | 307B | Navigation menu items |
| `hero.json` | 633B | Hero section content |
| `about.json` | 676B | About section content |
| `fields.json` | 2.7KB | Research fields tabs and content |
| `members.json` | 2.0KB | Student/member information |
| `faq.json` | 2.1KB | FAQ items |
| `contact.json` | 1.1KB | Contact information and form config |
| `footer.json` | 1.3KB | Footer content and links |

**Total Size:** ~11KB

## File Details

### site.json
Contains basic site metadata:
- Page title
- Logo text
- Favicon paths

### navigation.json
Array of navigation menu items with:
- Label (text)
- href (link)
- active (boolean)

### hero.json
Hero section data:
- Title and highlighted text
- Description
- Image path
- Call-to-action buttons
- Floating cards (icons and text)

### about.json
About section content:
- Section badge text
- Title
- Lead text
- Description paragraph

### fields.json
Research fields with tabs:
- Section title and description
- Array of field tabs with:
  - Icon
  - Title and subtitle
  - Full description
  - Image
  - Floating card data

### members.json
Student/member information:
- Section title and description
- Array of student/member items with:
  - Name
  - Position
  - Image path
  - Quote
  - Highlight flag

### faq.json
Array of FAQ items:
- Question
- Answer
- Active state (for default open)

### contact.json
Contact section data:
- Section metadata
- Contact information (email, phone, address)
- Form configuration
- Messages (loading, success, error)

### footer.json
Footer content:
- Logo and description
- Social media links
- Useful links
- Services links
- Contact information
- Copyright text

## How It Works

The `data-loader.js` script loads all these files in parallel using `Promise.all()` and dynamically populates the HTML content. This approach provides:

- **Modularity**: Each section can be edited independently
- **Performance**: Files load in parallel
- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to add new sections

## Editing Content

To update website content:

1. Edit the appropriate JSON file
2. Ensure JSON syntax is valid
3. Refresh the website - changes will appear automatically

No HTML modification needed for content updates!
