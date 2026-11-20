import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ORIGINALS_DIR = path.resolve('originals');
const PUBLIC_DIR = path.resolve('public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const PHOTOS_DIR = path.join(IMAGES_DIR, 'photos');

// Ensure output folders exist
fs.mkdirSync(PHOTOS_DIR, { recursive: true });

async function getStats(filePath) {
  const meta = await sharp(filePath).metadata();
  const stat = fs.statSync(filePath);
  return {
    width: meta.width,
    height: meta.height,
    sizeKb: (stat.size / 1024).toFixed(1),
    bytes: stat.size,
  };
}

async function run() {
  const results = [];

  console.log('--- Processing Hero & Portrait ---');

  // 1. HERO
  const heroPath = path.join(ORIGINALS_DIR, 'hero.png');
  const heroMeta = await sharp(heroPath).metadata();
  console.log(`Hero original: ${heroMeta.width}x${heroMeta.height}`);
  if (heroMeta.width < 2400) {
    console.log(`[Notice] Hero width (${heroMeta.width}px) is less than 2400px. Keeping native width without upscaling.`);
  }

  // hero-2400.webp (quality 80)
  const hero2400Path = path.join(IMAGES_DIR, 'hero-2400.webp');
  await sharp(heroPath)
    .rotate()
    .toColorspace('srgb')
    .resize({ width: 2400, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(hero2400Path);
  results.push({ name: 'hero-2400.webp', role: 'Hero wide', ...(await getStats(hero2400Path)) });

  // hero-1200.webp (quality 78)
  const hero1200Path = path.join(IMAGES_DIR, 'hero-1200.webp');
  await sharp(heroPath)
    .rotate()
    .toColorspace('srgb')
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(hero1200Path);
  results.push({ name: 'hero-1200.webp', role: 'Hero mobile', ...(await getStats(hero1200Path)) });

  // hero.webp (quality 80 fallback)
  const heroFallbackPath = path.join(IMAGES_DIR, 'hero.webp');
  await sharp(heroPath)
    .rotate()
    .toColorspace('srgb')
    .webp({ quality: 80 })
    .toFile(heroFallbackPath);
  results.push({ name: 'hero.webp', role: 'Hero fallback', ...(await getStats(heroFallbackPath)) });

  // og-image.jpg: 1200x630 crop centered on ridge, quality 82
  // For the ridge on hero.png, the ridge is near y ~ 56%
  const ogPath = path.join(PUBLIC_DIR, 'og-image.jpg');
  await sharp(heroPath)
    .rotate()
    .toColorspace('srgb')
    .resize(1200, 630, {
      fit: 'cover',
      position: sharp.position.center, // centered vertically/horizontally covers the green ridge and sky
    })
    .jpeg({ quality: 82 })
    .toFile(ogPath);
  results.push({ name: 'og-image.jpg', role: 'Open Graph image', ...(await getStats(ogPath)) });

  // 2. PORTRAIT
  const portraitPath = path.join(ORIGINALS_DIR, 'portrait.png');
  const portraitMeta = await sharp(portraitPath).metadata();
  console.log(`Portrait original: ${portraitMeta.width}x${portraitMeta.height}`);
  if (portraitMeta.width < 1200) {
    console.log(`[Notice] Portrait width (${portraitMeta.width}px) is less than 1200px. Keeping native width without upscaling.`);
  }

  const portraitOutPath = path.join(IMAGES_DIR, 'portrait.webp');
  await sharp(portraitPath)
    .rotate()
    .toColorspace('srgb')
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(portraitOutPath);
  results.push({ name: 'portrait.webp', role: 'About portrait', ...(await getStats(portraitOutPath)) });

  // 3. GALLERY PHOTOS
  const galleryFiles = [
    { src: '01.webp', id: '01' },
    { src: '02.webp', id: '02' },
    { src: '03.webp', id: '03' },
    { src: '04.webp', id: '04' },
    { src: '05.webp', id: '05' },
    { src: '06.jpeg', id: '06' },
  ];

  console.log('--- Processing Gallery Photos ---');

  for (const item of galleryFiles) {
    const inputPath = path.join(ORIGINALS_DIR, item.src);
    const meta = await sharp(inputPath).metadata();
    const isLandscape = (meta.width || 0) >= (meta.height || 0);

    // Full 1600px long side
    const fullOutPath = path.join(PHOTOS_DIR, `${item.id}.webp`);
    await sharp(inputPath)
      .rotate()
      .toColorspace('srgb')
      .resize({
        width: isLandscape ? 1600 : undefined,
        height: !isLandscape ? 1600 : undefined,
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toFile(fullOutPath);
    results.push({ name: `photos/${item.id}.webp`, role: `Gallery ${item.id} (Full)`, ...(await getStats(fullOutPath)) });

    // Thumb 600px long side
    const thumbOutPath = path.join(PHOTOS_DIR, `${item.id}-thumb.webp`);
    await sharp(inputPath)
      .rotate()
      .toColorspace('srgb')
      .resize({
        width: isLandscape ? 600 : undefined,
        height: !isLandscape ? 600 : undefined,
        withoutEnlargement: true,
      })
      .webp({ quality: 75 })
      .toFile(thumbOutPath);
    results.push({ name: `photos/${item.id}-thumb.webp`, role: `Gallery ${item.id} (Thumb)`, ...(await getStats(thumbOutPath)) });
  }

  console.log('\n--- Optimization Results ---');
  console.table(results);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
