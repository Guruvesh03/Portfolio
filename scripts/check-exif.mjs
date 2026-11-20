import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function parseExif(filePath) {
  try {
    const meta = await sharp(filePath).metadata();
    let hasGps = false;
    let gpsDetails = null;
    let exifKeys = [];
    if (meta.exif) {
      // Look for GPS tag 0x8825 in IFD0
      const buf = meta.exif;
      // Search for 'GPS ' or common GPS markers
      if (buf.includes('GPS') || buf.indexOf(Buffer.from([0x88, 0x25])) !== -1) {
        hasGps = true;
      }
    }
    return {
      format: meta.format,
      width: meta.width,
      height: meta.height,
      hasExif: !!meta.exif,
      hasGps,
      orientation: meta.orientation,
    };
  } catch (err) {
    return { error: err.message };
  }
}

async function run() {
  const dirs = ['public/images', 'originals'];
  const all = {};
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      if (stat.isFile()) {
        const info = await parseExif(full);
        all[full.replace(/\\/g, '/')] = {
          sizeBytes: stat.size,
          sizeKb: (stat.size / 1024).toFixed(1) + ' KB',
          sizeMb: (stat.size / (1024 * 1024)).toFixed(2) + ' MB',
          ...info
        };
      }
    }
  }
  console.log(JSON.stringify(all, null, 2));
}

run();
