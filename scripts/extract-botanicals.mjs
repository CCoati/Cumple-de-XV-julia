import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputImagePath = 'C:/Users/Nacho/.gemini/antigravity-ide/brain/8b144ac6-834c-4e4c-b0af-e373de89c1ba/.tempmediaStorage/media_1787500513679.jpg';
const outputDir = 'c:/Users/Nacho/Desktop/15 Julia/julia-xv/public/images/botanicals';

async function extractLeaves() {
  fs.mkdirSync(outputDir, { recursive: true });

  const metadata = await sharp(inputImagePath).metadata();
  const { width, height } = metadata;
  console.log(`Original image dimensions: ${width}x${height}`);

  // Load raw pixels
  const { data, info } = await sharp(inputImagePath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Function to extract a region with transparency
  // Ivory background in this image is roughly R: ~248-255, G: ~248-255, B: ~245-255
  async function cropAndMakeTransparent(leftRatio, topRatio, widthRatio, heightRatio, outputPath, options = {}) {
    const left = Math.floor(leftRatio * width);
    const top = Math.floor(topRatio * height);
    const w = Math.floor(widthRatio * width);
    const h = Math.floor(heightRatio * height);

    const cropped = await sharp(inputImagePath)
      .extract({ left, top, width: w, height: h })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const rawData = cropped.data;
    const pixelCount = w * h;

    // Remove background: ivory is ~#FAF9F5 (RGB ~ 250, 249, 245)
    // Dark green leaves have lower R/B values and higher G relative to R/B, or overall darker luminance
    for (let i = 0; i < pixelCount; i++) {
      const idx = i * 4;
      const r = rawData[idx];
      const g = rawData[idx + 1];
      const b = rawData[idx + 2];

      // Luminance / distance from white/ivory
      const bgR = 249, bgG = 248, bgB = 245;
      const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);

      if (dist < 18) {
        // Pure background
        rawData[idx + 3] = 0;
      } else if (dist < 40) {
        // Soft edge anti-aliasing
        const alpha = Math.floor(((dist - 18) / 22) * 255);
        rawData[idx + 3] = Math.min(rawData[idx + 3], alpha);
      }
    }

    await sharp(rawData, {
      raw: { width: w, height: h, channels: 4 },
    })
      .png({ quality: 95 })
      .toFile(outputPath);

    console.log(`Saved: ${outputPath}`);
  }

  // 1. Top-Left lush watercolor branch
  await cropAndMakeTransparent(0.08, 0.08, 0.35, 0.32, path.join(outputDir, 'branch-top-left.png'));

  // 2. Bottom-Right delicate watercolor branch
  await cropAndMakeTransparent(0.62, 0.60, 0.30, 0.32, path.join(outputDir, 'branch-bottom-right.png'));

  // 3. Small Sprig Left (flanking XV)
  await cropAndMakeTransparent(0.24, 0.49, 0.12, 0.14, path.join(outputDir, 'sprig-left.png'));

  // 4. Small Sprig Right (flanking XV)
  await cropAndMakeTransparent(0.64, 0.49, 0.12, 0.14, path.join(outputDir, 'sprig-right.png'));

  // 5. Sparkle Star Top-Right
  await cropAndMakeTransparent(0.70, 0.11, 0.16, 0.10, path.join(outputDir, 'sparkle-top.png'));

  // 6. Sparkle Star Bottom-Left
  await cropAndMakeTransparent(0.13, 0.79, 0.14, 0.10, path.join(outputDir, 'sparkle-bottom.png'));

  console.log('All botanical elements extracted with alpha transparency!');
}

extractLeaves().catch(console.error);
