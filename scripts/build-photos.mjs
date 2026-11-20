import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import { exiftool } from 'exiftool-vendored';

const ORIGINALS_DIR = path.resolve('originals');
const PUBLIC_DIR = path.resolve('public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const PHOTOS_DIR = path.join(IMAGES_DIR, 'photos');

fs.mkdirSync(PHOTOS_DIR, { recursive: true });

function getHash(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(buf).digest('hex').slice(0, 6);
}

async function generateBlur(filePath) {
  const buf = await sharp(filePath)
    .rotate()
    .resize(24)
    .blur(1.5)
    .jpeg({ quality: 50 })
    .toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

async function processPhoto(item) {
  const sourcePath = path.join(ORIGINALS_DIR, item.originalFile);
  const hash = getHash(sourcePath);
  const meta = await sharp(sourcePath).metadata();

  const isPng = item.originalFile.endsWith('.png');
  const fullFileName = `${item.id}.${hash}.jpg`;
  const gridFileName = `${item.id}-grid.${hash}.jpg`;
  const fullDest = path.join(PHOTOS_DIR, fullFileName);
  const gridDest = path.join(PHOTOS_DIR, gridFileName);

  console.log(`Processing Photo ${item.id} (${item.title}) from ${item.originalFile}...`);

  // 1. FULL SIZE (src)
  if (isPng) {
    // Lossless / ultra-high quality conversion to JPEG for PNG originals
    await sharp(sourcePath)
      .rotate()
      .jpeg({
        quality: 97,
        mozjpeg: true,
        chromaSubsampling: '4:4:4',
        progressive: true,
      })
      .toFile(fullDest);
  } else {
    // Lossless copy of original JPEG
    fs.copyFileSync(sourcePath, fullDest);
  }

  // Strip metadata (GPS, XMP, IPTC, thumbnails) while keeping ICC profile and Orientation
  try {
    await exiftool.write(fullDest, {}, [
      '-all=',
      '--icc_profile:all',
      '-tagsfromfile',
      '@',
      '-Orientation:all',
      '-overwrite_original',
    ]);
  } catch (err) {
    console.warn(`Exiftool notice on ${fullDest}:`, err.message);
  }

  const fullMeta = await sharp(fullDest).metadata();

  // 2. GRID VERSION (2000px long side, never upscale, mozjpeg 95, 4:4:4, progressive)
  const isLandscape = (fullMeta.width || 0) >= (fullMeta.height || 0);
  const maxDim = Math.max(fullMeta.width || 0, fullMeta.height || 0);

  let resizeOpts = { withoutEnlargement: true };
  if (maxDim > 2000) {
    if (isLandscape) {
      resizeOpts.width = 2000;
    } else {
      resizeOpts.height = 2000;
    }
  }

  await sharp(sourcePath)
    .rotate()
    .resize(resizeOpts)
    .withMetadata()
    .jpeg({
      quality: 95,
      mozjpeg: true,
      chromaSubsampling: '4:4:4',
      progressive: true,
    })
    .toFile(gridDest);

  try {
    await exiftool.write(gridDest, {}, [
      '-all=',
      '--icc_profile:all',
      '-overwrite_original',
    ]);
  } catch (err) {
    console.warn(`Exiftool notice on ${gridDest}:`, err.message);
  }

  const gridMeta = await sharp(gridDest).metadata();

  // 3. 24px Blur base64
  const blur = await generateBlur(sourcePath);

  const fullStat = fs.statSync(fullDest);
  const gridStat = fs.statSync(gridDest);

  return {
    ...item,
    src: `/images/photos/${fullFileName}`,
    grid: `/images/photos/${gridFileName}`,
    width: fullMeta.width,
    height: fullMeta.height,
    gridWidth: gridMeta.width,
    gridHeight: gridMeta.height,
    blur,
    fullSizeKb: (fullStat.size / 1024).toFixed(1),
    gridSizeKb: (gridStat.size / 1024).toFixed(1),
  };
}

async function buildHero() {
  const heroPath = path.join(ORIGINALS_DIR, 'hero.jpeg');
  const hash = getHash(heroPath);
  const fileName = `hero-sunset.${hash}.jpg`;
  const heroDest = path.join(IMAGES_DIR, fileName);

  console.log('Building Hero image...');

  // Auto-rotate from EXIF, modulate saturation 0.82
  const { data, info } = await sharp(heroPath)
    .rotate()
    .modulate({ saturation: 0.82 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Add fine monochrome Gaussian noise ~1.5% to prevent banding
  for (let i = 0; i < data.length; i += info.channels) {
    // Gaussian noise approximation: mean 0, std ~ 3.8 (1.5% of 255)
    const n = (Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() - 3) * 3.8;
    data[i] = Math.min(255, Math.max(0, Math.round(data[i] + n)));
    data[i + 1] = Math.min(255, Math.max(0, Math.round(data[i + 1] + n)));
    data[i + 2] = Math.min(255, Math.max(0, Math.round(data[i + 2] + n)));
  }

  await sharp(data, { raw: info })
    .withMetadata()
    .jpeg({
      quality: 97,
      mozjpeg: true,
      chromaSubsampling: '4:4:4',
      progressive: true,
    })
    .toFile(heroDest);

  try {
    await exiftool.write(heroDest, {}, [
      '-all=',
      '--icc_profile:all',
      '-overwrite_original',
    ]);
  } catch (err) {
    console.warn('Hero exiftool notice:', err.message);
  }

  const heroMeta = await sharp(heroDest).metadata();
  const blur = await generateBlur(heroDest);
  const stat = fs.statSync(heroDest);

  return {
    src: `/images/${fileName}`,
    width: heroMeta.width,
    height: heroMeta.height,
    sizeKb: (stat.size / 1024).toFixed(1),
    blur,
  };
}

async function buildPortrait() {
  const portraitPath = path.join(ORIGINALS_DIR, 'portrait-cutout.png');
  const hash = getHash(portraitPath);
  const fileName = `portrait.${hash}.png`;
  const portraitDest = path.join(IMAGES_DIR, fileName);

  console.log('Building Portrait image (PNG cutout)...');

  // Lossless, sRGB, compressionLevel 9, no metadata
  await sharp(portraitPath)
    .toColorspace('srgb')
    .png({
      compressionLevel: 9,
      adaptiveFiltering: true,
    })
    .toFile(portraitDest);

  try {
    await exiftool.write(portraitDest, {}, [
      '-all=',
      '-overwrite_original',
    ]);
  } catch (err) {
    console.warn('Portrait exiftool notice:', err.message);
  }

  const meta = await sharp(portraitDest).metadata();
  const stat = fs.statSync(portraitDest);

  return {
    src: `/images/${fileName}`,
    width: meta.width,
    height: meta.height,
    sizeKb: (stat.size / 1024).toFixed(1),
    originalFile: 'portrait-cutout.png',
    generatedFileName: fileName,
  };
}

async function buildOgImage() {
  const heroPath = path.join(ORIGINALS_DIR, 'hero.jpeg');
  const ogDest = path.join(PUBLIC_DIR, 'og-image.jpg');

  console.log('Building OG image (1200x630, centered on tree and power pole)...');
  await sharp(heroPath)
    .rotate()
    .resize(1200, 630, {
      fit: 'cover',
      position: sharp.position.center,
    })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(ogDest);

  const stat = fs.statSync(ogDest);
  return {
    src: '/og-image.jpg',
    sizeKb: (stat.size / 1024).toFixed(1),
  };
}

async function main() {
  const photoDefinitions = [
    {
      id: '01',
      originalFile: '07.png',
      title: 'Waterfall',
      alt: 'Waterfall cascading down dark rocky cliff faces surrounded by green foliage',
      caption: 'Randha Waterfall, near Bhandardara',
      year: '2026',
      teaser: true,
    },
    {
      id: '02',
      originalFile: '02.jpeg',
      title: 'Cat in Foliage',
      alt: 'Tabby cat with green eyes looking outward through sunlit green tree leaves',
      caption: 'Malegaon',
      year: '2025',
      teaser: true,
    },
    {
      id: '03',
      originalFile: '04.jpg',
      title: 'Morning Street',
      alt: 'City street bathed in warm sunrise light with dust haze filtering through tree branches',
      caption: 'Mhasrul, Nashik',
      year: '2025',
      teaser: true,
    },
    {
      id: '04',
      originalFile: '03.jpeg',
      title: 'Red Rose',
      alt: 'Close-up of a blooming red rose flower with detailed petals',
      caption: 'Nashik',
      year: '2026',
      teaser: true,
    },
    {
      id: '05',
      originalFile: 'hero.jpeg',
      title: 'Sunset Silhouette',
      alt: 'Silhouette of trees and rooftops against an orange and dark sunset sky with utility power lines',
      caption: 'Malegaon',
      year: '2025',
      teaser: false,
    },
    {
      id: '06',
      originalFile: '09.jpeg',
      title: 'Gondeshwar Temple',
      alt: 'Carved stone towers and entrance of the ancient Gondeshwar temple complex under a clear blue sky',
      caption: 'Sinnar, Nashik',
      year: '2025',
      teaser: false,
    },
    {
      id: '07',
      originalFile: '05.jpeg',
      title: 'Wild Flower',
      alt: 'Close-up of a yellow wild daisy flower in sunlight',
      caption: 'Malegaon',
      year: '2025',
      teaser: false,
    },
    {
      id: '08',
      originalFile: '06.png',
      title: 'River Bend',
      alt: 'Calm river winding between green forested hills under a blue sky',
      caption: 'Bhandardara',
      year: '2026',
      teaser: false,
    },
    {
      id: '09',
      originalFile: '01.png',
      title: 'Storm Ridge',
      alt: 'Green hill ridge with a footpath leading toward a dramatic stormy sky',
      caption: 'Ramsej Fort, Nashik',
      year: '2026',
      teaser: false,
    },
    {
      id: '10',
      originalFile: '08.jpeg',
      title: 'Cat on Ledge',
      alt: 'Portrait of a striped cat looking directly at the camera through foliage',
      caption: 'Malegaon',
      year: '2025',
      teaser: false,
    },
  ];

  const processedPhotos = [];
  for (const item of photoDefinitions) {
    const res = await processPhoto(item);
    processedPhotos.push(res);
  }

  const heroData = await buildHero();
  const portraitData = await buildPortrait();
  const ogData = await buildOgImage();

  await exiftool.end();

  // Generate src/data/photos.js
  const photosCode = `// Generated by scripts/build-photos.mjs — Revision 11
export const heroImage = ${JSON.stringify(heroData, null, 2)};

export const portraitImage = ${JSON.stringify(portraitData, null, 2)};

export const photos = [
${processedPhotos
  .map(
    (p) => `  {
    id: ${JSON.stringify(p.id)},
    title: ${JSON.stringify(p.title)},
    src: ${JSON.stringify(p.src)},
    grid: ${JSON.stringify(p.grid)},
    width: ${p.width},
    height: ${p.height},
    gridWidth: ${p.gridWidth},
    gridHeight: ${p.gridHeight},
    alt: ${JSON.stringify(p.alt)},
    caption: ${JSON.stringify(p.caption)},
    year: ${JSON.stringify(p.year)},
    teaser: ${p.teaser},
    blur: ${JSON.stringify(p.blur)}
  }`
  )
  .join(',\n')}
];
`;

  fs.writeFileSync('src/data/photos.js', photosCode);
  console.log('Successfully generated src/data/photos.js');

  console.log('\n--- Build Summary ---');
  console.log(`Hero: ${heroData.src} (${heroData.width}x${heroData.height}, ${heroData.sizeKb} KB)`);
  console.log(`Portrait: ${portraitData.src} (${portraitData.width}x${portraitData.height}, ${portraitData.sizeKb} KB)`);
  console.log(`OG Image: ${ogData.src} (${ogData.sizeKb} KB)`);
  console.log('\nGallery Photos:');
  console.table(
    processedPhotos.map((p) => ({
      id: p.id,
      title: p.title,
      src: p.src,
      dims: `${p.width}x${p.height}`,
      size: `${p.fullSizeKb} KB`,
      gridDims: `${p.gridWidth}x${p.gridHeight}`,
      gridSize: `${p.gridSizeKb} KB`,
    }))
  );
}

main().catch(async (err) => {
  console.error(err);
  try {
    await exiftool.end();
  } catch {}
  process.exit(1);
});
