// Script to add loading="lazy" to images in JSX files
// Skips hero images and logos that should load eagerly

import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';

const files = globSync('src/**/*.jsx');

// Patterns that indicate an image should NOT be lazy loaded
const eagerImagePatterns = [
  /logo/i,
  /hero/i,
  /banner/i,
  /featured/i,
  /above[-_]fold/i
];

let totalFiles = 0;
let modifiedFiles = 0;
let imagesUpdated = 0;

files.forEach(file => {
  const originalContent = readFileSync(file, 'utf8');
  let content = originalContent;
  let fileModified = false;
  let fileImageCount = 0;

  // Pattern 1: <img without loading attribute
  content = content.replace(
    /<img\s+([^>]*?)>/g,
    (match, attrs) => {
      // Already has loading attribute
      if (/loading=/.test(attrs)) {
        return match;
      }

      // Check if this is an eager image
      const isEagerImage = eagerImagePatterns.some(pattern =>
        pattern.test(attrs) || pattern.test(match)
      );

      if (isEagerImage) {
        // Add eager loading + high priority
        fileModified = true;
        fileImageCount++;
        return `<img ${attrs} loading="eager" fetchpriority="high">`;
      } else {
        // Add lazy loading
        fileModified = true;
        fileImageCount++;
        return `<img ${attrs} loading="lazy">`;
      }
    }
  );

  // Pattern 2: Self-closing img tags
  content = content.replace(
    /<img\s+([^>]*?)\/>/g,
    (match, attrs) => {
      // Already has loading attribute
      if (/loading=/.test(attrs)) {
        return match;
      }

      // Check if this is an eager image
      const isEagerImage = eagerImagePatterns.some(pattern =>
        pattern.test(attrs) || pattern.test(match)
      );

      if (isEagerImage) {
        fileModified = true;
        fileImageCount++;
        return `<img ${attrs} loading="eager" fetchpriority="high" />`;
      } else {
        fileModified = true;
        fileImageCount++;
        return `<img ${attrs} loading="lazy" />`;
      }
    }
  );

  if (fileModified && content !== originalContent) {
    writeFileSync(file, content);
    modifiedFiles++;
    imagesUpdated += fileImageCount;
    console.log(`✓ ${file.padEnd(60)} ${fileImageCount} image(s) updated`);
  }

  totalFiles++;
});

console.log('\n' + '='.repeat(80));
console.log('📊 Lazy Loading Summary');
console.log('='.repeat(80));
console.log(`Total files scanned:   ${totalFiles}`);
console.log(`Files modified:        ${modifiedFiles}`);
console.log(`Images updated:        ${imagesUpdated}`);
console.log('='.repeat(80));
console.log('\n✅ Lazy loading attributes added!\n');
console.log('Note: Hero images and logos set to loading="eager" fetchpriority="high"');
console.log('All other images set to loading="lazy"\n');
