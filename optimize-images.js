// Image Optimization Script for Web3Edu
// This script optimizes all images in src/assets for web performance

import sharp from 'sharp';
import { readdirSync, statSync, existsSync } from 'fs';
import { join, extname, basename } from 'path';

const assetsDir = './src/assets';

// Configuration for different image types
const optimizationConfig = {
  team: { width: 400, quality: 82 }, // Team photos
  icons: { width: 300, quality: 85 }, // Icons and logos
  labs: { width: 800, quality: 80 }, // Lab diagrams
  default: { width: 1200, quality: 78 } // Hero images, large graphics
};

let totalOriginalSize = 0;
let totalOptimizedSize = 0;
let filesProcessed = 0;

async function optimizeImage(filePath, config) {
  try {
    const ext = extname(filePath).toLowerCase();
    if (!['.webp', '.png', '.jpg', '.jpeg'].includes(ext)) {
      return;
    }

    const originalSize = statSync(filePath).size;
    totalOriginalSize += originalSize;

    // Create output path (convert all to webp)
    const outputPath = filePath.replace(/\.\w+$/, '.webp');

    // Optimize
    await sharp(filePath)
      .resize(config.width, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: config.quality, effort: 6 })
      .toFile(outputPath + '.tmp');

    // Check if optimization actually reduced size
    const optimizedSize = statSync(outputPath + '.tmp').size;

    if (optimizedSize < originalSize) {
      // Use optimized version
      const fs = await import('fs');
      fs.renameSync(outputPath + '.tmp', outputPath);

      totalOptimizedSize += optimizedSize;
      filesProcessed++;

      const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
      const fileName = basename(filePath);

      console.log(
        `✓ ${fileName.padEnd(40)} ${(originalSize / 1024).toFixed(0)}KB → ${(optimizedSize / 1024).toFixed(0)}KB (${savings}% smaller)`
      );
    } else {
      // Keep original (already optimized)
      const fs = await import('fs');
      fs.unlinkSync(outputPath + '.tmp');
      totalOptimizedSize += originalSize;

      console.log(`→ ${basename(filePath).padEnd(40)} Already optimized, keeping original`);
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
}

async function processDirectory(dir, config) {
  if (!existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    return;
  }

  const items = readdirSync(dir);

  for (const item of items) {
    const itemPath = join(dir, item);
    const stat = statSync(itemPath);

    if (stat.isDirectory()) {
      // Use specific config for known directories
      const dirConfig = optimizationConfig[item] || config;
      console.log(`\n📁 ${item}/`);
      await processDirectory(itemPath, dirConfig);
    } else if (stat.isFile()) {
      await optimizeImage(itemPath, config);
    }
  }
}

async function main() {
  console.log('🖼️  Web3Edu Image Optimization\n');
  console.log('This will optimize all images in src/assets for web performance\n');

  const startTime = Date.now();

  await processDirectory(assetsDir, optimizationConfig.default);

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(1);

  const totalSavings = totalOriginalSize - totalOptimizedSize;
  const savingsPercent = ((totalSavings / totalOriginalSize) * 100).toFixed(1);

  console.log('\n' + '='.repeat(80));
  console.log('📊 Optimization Summary');
  console.log('='.repeat(80));
  console.log(`Files processed:   ${filesProcessed}`);
  console.log(`Original size:     ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Optimized size:    ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Saved:             ${(totalSavings / 1024 / 1024).toFixed(2)} MB (${savingsPercent}%)`);
  console.log(`Time taken:        ${duration}s`);
  console.log('='.repeat(80));
  console.log('\n✅ Optimization complete!\n');
}

main().catch(console.error);
