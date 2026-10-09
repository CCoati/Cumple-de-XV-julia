import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const botanicalsDir = path.join(rootDir, 'public', 'images', 'botanicals');

async function generateAllAssetsWithAuthenticBotanicals() {
  console.log('Generating favicon and OpenGraph image using authentic watercolor artwork...');

  // 1. Generate Favicon & App Icons with authentic centerpiece
  const iconBase = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: '#FAF8F5',
    },
  }).png().toBuffer();

  const centerpieceBuffer = await sharp(path.join(botanicalsDir, 'centerpiece-xv-juli.png'))
    .resize(440, null)
    .toBuffer();

  const iconWithArt = await sharp(iconBase)
    .composite([
      {
        input: Buffer.from(`
          <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="20" width="472" height="472" rx="90" fill="none" stroke="#CBDABB" stroke-width="4" opacity="0.8" />
            <rect x="32" y="32" width="448" height="448" rx="80" fill="none" stroke="#B1C49C" stroke-width="2" opacity="0.6" />
          </svg>
        `),
        top: 0,
        left: 0,
      },
      {
        input: centerpieceBuffer,
        top: 100,
        left: 36,
      },
      {
        input: Buffer.from(`
          <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <text x="256" y="88" font-family="Georgia, serif" font-size="28" letter-spacing="8" fill="#7A8B6F" text-anchor="middle">MIS XV</text>
            <text x="256" y="445" font-family="Georgia, serif" font-size="28" letter-spacing="6" fill="#7A8B6F" text-anchor="middle">28 · 11 · 2026</text>
          </svg>
        `),
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toBuffer();

  // Save icons
  fs.writeFileSync(path.join(rootDir, 'public', 'icon.png'), iconWithArt);
  fs.writeFileSync(path.join(rootDir, 'src', 'app', 'icon.png'), iconWithArt);

  const appleIcon = await sharp(iconWithArt).resize(180, 180).toBuffer();
  fs.writeFileSync(path.join(rootDir, 'public', 'apple-touch-icon.png'), appleIcon);
  fs.writeFileSync(path.join(rootDir, 'src', 'app', 'apple-icon.png'), appleIcon);

  const icoBuffer = await sharp(iconWithArt).resize(64, 64).toBuffer();
  fs.writeFileSync(path.join(rootDir, 'public', 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(rootDir, 'src', 'app', 'favicon.ico'), icoBuffer);

  // 2. Generate Open Graph 1200x630 (WhatsApp & Social Preview)
  const ogBase = await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: '#FAF8F5',
    },
  }).png().toBuffer();

  const tlBranch = await sharp(path.join(botanicalsDir, 'branch-top-left-clean.png'))
    .resize(230, null)
    .toBuffer();

  const brBranch = await sharp(path.join(botanicalsDir, 'branch-bottom-right-clean.png'))
    .resize(230, null)
    .toBuffer();

  const ogCenterpiece = await sharp(path.join(botanicalsDir, 'centerpiece-xv-juli.png'))
    .resize(460, null)
    .toBuffer();

  const ogImage = await sharp(ogBase)
    .composite([
      // Scalloped luxury border
      {
        input: Buffer.from(`
          <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
            <path d="M 60 25 L 1140 25 A 30 30 0 0 1 1170 55 L 1170 575 A 30 30 0 0 1 1140 605 L 60 605 A 30 30 0 0 1 30 575 L 30 55 A 30 30 0 0 1 60 25 Z" stroke="#8B9D7D" stroke-width="2" fill="none" opacity="0.85" />
            <path d="M 68 33 L 1132 33 A 28 28 0 0 1 1160 61 L 1160 569 A 28 28 0 0 1 1132 597 L 68 597 A 28 28 0 0 1 40 569 L 40 61 A 28 28 0 0 1 68 33 Z" stroke="#A3B18A" stroke-width="1.2" fill="none" opacity="0.6" />
            <text x="600" y="90" font-family="Georgia, serif" font-size="30" letter-spacing="12" fill="#7A8B6F" text-anchor="middle" font-weight="bold">SAVE THE DATE</text>
            <text x="600" y="475" font-family="Georgia, serif" font-size="24" letter-spacing="3" font-style="italic" fill="#8B9D7D" text-anchor="middle">Te invito a celebrar juntos esta noche inolvidable</text>
            <text x="600" y="535" font-family="Georgia, serif" font-size="30" letter-spacing="8" fill="#7A8B6F" text-anchor="middle" font-weight="bold">28 · 11 · 2026</text>
          </svg>
        `),
        top: 0,
        left: 0,
      },
      // Top left watercolor branch
      {
        input: tlBranch,
        top: 35,
        left: 45,
      },
      // Bottom right watercolor branch
      {
        input: brBranch,
        top: 200,
        left: 920,
      },
      // Authentic XV Juli centerpiece
      {
        input: ogCenterpiece,
        top: 105,
        left: 370,
      },
    ])
    .png({ quality: 95 })
    .toBuffer();

  fs.writeFileSync(path.join(rootDir, 'public', 'og-image.png'), ogImage);
  fs.writeFileSync(path.join(rootDir, 'src', 'app', 'opengraph-image.png'), ogImage);

  console.log('All branding assets generated with authentic watercolor art!');
}

generateAllAssetsWithAuthenticBotanicals().catch(console.error);
