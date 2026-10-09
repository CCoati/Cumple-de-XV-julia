import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputImagePath = 'C:/Users/Nacho/.gemini/antigravity-ide/brain/8b144ac6-834c-4e4c-b0af-e373de89c1ba/.tempmediaStorage/media_1787500513679.jpg';
const outputDir = 'c:/Users/Nacho/Desktop/15 Julia/julia-xv/public/images/botanicals';

async function perfectFeatheredLeaves() {
  // 1. TOP-LEFT BRANCH
  const tlLeft = 70, tlTop = 75, tlWidth = 340, tlHeight = 530;
  const tlCropped = await sharp(inputImagePath)
    .extract({ left: tlLeft, top: tlTop, width: tlWidth, height: tlHeight })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const tlData = tlCropped.data;
  for (let i = 0; i < tlWidth * tlHeight; i++) {
    const idx = i * 4;
    const x = i % tlWidth;
    const y = Math.floor(i / tlWidth);
    const r = tlData[idx], g = tlData[idx + 1], b = tlData[idx + 2];

    // Erase horizontal line region
    if (y >= 48 && y <= 95) {
      tlData[idx + 3] = 0;
      continue;
    }
    // Erase top-left region where border was
    if (x < 115 && y < 140) {
      tlData[idx + 3] = 0;
      continue;
    }
    // Erase left edge where border was
    if (x < 65) {
      tlData[idx + 3] = 0;
      continue;
    }
    // Erase letter 'S'
    if (x > 300 || (x > 280 && y > 310)) {
      tlData[idx + 3] = 0;
      continue;
    }

    // Background transparency
    const bgR = 250, bgG = 249, bgB = 246;
    const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);

    if (dist < 15) {
      tlData[idx + 3] = 0;
    } else if (dist < 34) {
      tlData[idx + 3] = Math.floor(((dist - 15) / 19) * 255);
    }
  }

  // Trim to get tight bounds
  const trimmedTl = await sharp(tlData, { raw: { width: tlWidth, height: tlHeight, channels: 4 } })
    .trim()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data: tlFinal, info: tlInfo } = trimmedTl;
  const tW = tlInfo.width, tH = tlInfo.height;

  // Apply smooth edge feathering on top 35px and left 25px so leaf cuts fade out organically
  for (let i = 0; i < tW * tH; i++) {
    const idx = i * 4;
    const x = i % tW;
    const y = Math.floor(i / tW);

    let fade = 1;
    if (y < 35) {
      fade = Math.min(fade, (y / 35) ** 1.5);
    }
    if (x < 25) {
      fade = Math.min(fade, (x / 25) ** 1.5);
    }

    tlFinal[idx + 3] = Math.floor(tlFinal[idx + 3] * fade);
  }

  await sharp(tlFinal, { raw: { width: tW, height: tH, channels: 4 } })
    .png({ quality: 95 })
    .toFile(path.join(outputDir, 'branch-top-left-clean.png'));

  // 2. BOTTOM-RIGHT BRANCH
  const brLeft = 670, brTop = 900, brWidth = 310, brHeight = 550;
  const brCropped = await sharp(inputImagePath)
    .extract({ left: brLeft, top: brTop, width: brWidth, height: brHeight })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const brData = brCropped.data;
  for (let i = 0; i < brWidth * brHeight; i++) {
    const idx = i * 4;
    const x = i % brWidth;
    const y = Math.floor(i / brWidth);
    const r = brData[idx], g = brData[idx + 1], b = brData[idx + 2];

    // Erase left text (date '2026', subtitle)
    if (x < 70) {
      brData[idx + 3] = 0;
      continue;
    }
    // Erase bottom-right corner arc & borders
    if (x > 210 && y > 440) {
      brData[idx + 3] = 0;
      continue;
    }
    if (x > 240) {
      brData[idx + 3] = 0;
      continue;
    }
    if (y > 470) {
      brData[idx + 3] = 0;
      continue;
    }

    // Background transparency
    const bgR = 250, bgG = 249, bgB = 246;
    const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);

    if (dist < 15) {
      brData[idx + 3] = 0;
    } else if (dist < 34) {
      brData[idx + 3] = Math.floor(((dist - 15) / 19) * 255);
    }
  }

  // Trim to get tight bounds
  const trimmedBr = await sharp(brData, { raw: { width: brWidth, height: brHeight, channels: 4 } })
    .trim()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data: brFinal, info: brInfo } = trimmedBr;
  const bW = brInfo.width, bH = brInfo.height;

  // Apply smooth edge feathering on bottom 35px and right 25px
  for (let i = 0; i < bW * bH; i++) {
    const idx = i * 4;
    const x = i % bW;
    const y = Math.floor(i / bW);

    let fade = 1;
    if (y > bH - 35) {
      fade = Math.min(fade, ((bH - y) / 35) ** 1.5);
    }
    if (x > bW - 25) {
      fade = Math.min(fade, ((bW - x) / 25) ** 1.5);
    }

    brFinal[idx + 3] = Math.floor(brFinal[idx + 3] * fade);
  }

  await sharp(brFinal, { raw: { width: bW, height: bH, channels: 4 } })
    .png({ quality: 95 })
    .toFile(path.join(outputDir, 'branch-bottom-right-clean.png'));

  console.log('Organic leaf feathering applied successfully!');
}

perfectFeatheredLeaves().catch(console.error);
