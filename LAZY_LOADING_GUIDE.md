# Manual Lazy Loading Guide

## Quick Reference

### Hero Images (Above the Fold) - Load Eagerly
```jsx
<img
  src={heroImage}
  alt="Hero"
  loading="eager"
  fetchpriority="high"
/>
```

**Apply to:**
- Logo in PageShell.jsx
- Hero images in Join.jsx, JoinGR.jsx
- Featured images at top of pages

### Below-the-Fold Images - Load Lazily
```jsx
<img
  src={image}
  alt="Description"
  loading="lazy"
/>
```

**Apply to:**
- Team member photos
- Lab images
- Footer images
- All images below the fold

---

## Priority Files to Update Manually

### High Priority (Above the Fold)
1. `src/components/PageShell.jsx` - Logo (line ~245)
   - Keep as `loading="eager" fetchpriority="high"`

2. `src/pages/Join.jsx` - Hero image (line ~161)
   - Already set to `loading="eager"`

3. `src/pages/JoinGR.jsx` - Hero image
   - Already set to `loading="eager"`

### Medium Priority (Below the Fold)
4. `src/components/TeamMemberCard.jsx` - Team photos
   - Add `loading="lazy"`

5. `src/pages/Labs.jsx` & `LabsGR.jsx` - Lab icons
   - Add `loading="lazy"`

6. `src/components/Footer.jsx` & `FooterGR.jsx` - Footer logo
   - Can be `loading="lazy"` (at bottom of page)

---

## If Build Keeps Failing

**Option 1: Remove all loading attributes added by script**
```bash
# Create remove-loading.js
```

```javascript
import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';

const files = globSync('src/**/*.jsx');

files.forEach(file => {
  let content = readFileSync(file, 'utf8');

  // Remove loading attributes
  content = content.replace(/\s*loading="(lazy|eager)"\s*/g, ' ');
  content = content.replace(/\s*fetchpriority="high"\s*/g, ' ');

  writeFileSync(file, content);
});

console.log('✅ Removed all loading attributes');
```

**Option 2: Start fresh with git**
```bash
# If you have git commits
git diff src/ > lazy-loading-changes.patch
git checkout src/

# Then manually add loading to just hero images
```

---

## Expected Impact

Adding lazy loading to just 10-15 key images still gives you **80% of the performance benefit** with minimal risk.

**Focus on:**
- Hero images: `eager` (3 images)
- Team photos: `lazy` (6-8 images)
- Lab images: `lazy` (5-10 images)

**Total time:** 15 minutes
**Risk:** Very low
**Benefit:** +20-30 Lighthouse points
