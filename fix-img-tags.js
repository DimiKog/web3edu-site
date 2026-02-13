// Fix malformed img tags created by add-lazy-loading script
import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';

const files = globSync('src/**/*.jsx');

let fixedFiles = 0;
let totalFixes = 0;

files.forEach(file => {
  let content = readFileSync(file, 'utf8');
  const original = content;

  // Fix pattern: / loading="..."  →  loading="..." />
  content = content.replace(
    /\s+\/\s+loading="(lazy|eager)"\s*>/g,
    ' loading="$1" />'
  );

  // Fix pattern: / loading="..." fetchpriority="high">  →  loading="..." fetchpriority="high" />
  content = content.replace(
    /\s+\/\s+loading="(lazy|eager)"\s+fetchpriority="high"\s*>/g,
    ' loading="$1" fetchpriority="high" />'
  );

  if (content !== original) {
    writeFileSync(file, content);
    const fixes = (original.match(/\/\s+loading=/g) || []).length;
    fixedFiles++;
    totalFixes += fixes;
    console.log(`✓ Fixed ${file} (${fixes} tag${fixes > 1 ? 's' : ''})`);
  }
});

console.log(`\n✅ Fixed ${totalFixes} malformed img tags in ${fixedFiles} files\n`);
