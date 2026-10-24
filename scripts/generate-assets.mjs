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

  // 2. Generate Open Graph 1200x630 (Instagram, WhatsApp & Social Preview)
  const width = 1200;
  const height = 630;

  const svgBackground = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Warm luxurious linen paper gradient -->
        <radialGradient id="paperBg" cx="50%" cy="48%" r="68%" fx="50%" fy="48%">
          <stop offset="0%" stop-color="#FCFAF7" />
          <stop offset="65%" stop-color="#FAF6F0" />
          <stop offset="100%" stop-color="#EFE9DE" />
        </radialGradient>
      </defs>

      <!-- Background with warm linen fill -->
      <rect width="${width}" height="${height}" fill="url(#paperBg)" />

      <!-- Outer Scalloped Luxury Frame -->
      <path d="
        M 76 34
        L 1124 34
        A 34 34 0 0 1 1158 68
        L 1158 562
        A 34 34 0 0 1 1124 596
        L 76 596
        A 34 34 0 0 1 42 562
        L 42 68
        A 34 34 0 0 1 76 34
        Z
      " stroke="#8B9D7D" stroke-width="2.2" fill="none" opacity="0.88" />

      <!-- Inner Scalloped Frame with 10px inset -->
      <path d="
        M 84 44
        L 1116 44
        A 30 30 0 0 1 1146 74
        L 1146 556
        A 30 30 0 0 1 1116 586
        L 84 586
        A 30 30 0 0 1 54 556
        L 54 74
        A 30 30 0 0 1 84 46
        Z
      " stroke="#A3B18A" stroke-width="1.2" fill="none" opacity="0.65" />

      <!-- Delicate corner flourishes / 4-point stars -->
      <!-- Top Right Stars -->
      <g transform="translate(1072, 68) scale(0.38)" fill="#7A8B6F" opacity="0.75">
        <path d="M50 0 Q50 50, 100 50 Q50 50, 50 100 Q50 50, 0 50 Q50 50, 50 0 Z" />
      </g>
      <g transform="translate(1106, 98) scale(0.24)" fill="#8B9D7D" opacity="0.6">
        <path d="M50 0 Q50 50, 100 50 Q50 50, 50 100 Q50 50, 0 50 Q50 50, 50 0 Z" />
      </g>

      <!-- Bottom Left Stars -->
      <g transform="translate(92, 526) scale(0.38)" fill="#7A8B6F" opacity="0.75">
        <path d="M50 0 Q50 50, 100 50 Q50 50, 50 100 Q50 50, 0 50 Q50 50, 50 0 Z" />
      </g>
      <g transform="translate(126, 554) scale(0.24)" fill="#8B9D7D" opacity="0.6">
        <path d="M50 0 Q50 50, 100 50 Q50 50, 50 100 Q50 50, 0 50 Q50 50, 50 0 Z" />
      </g>

      <!-- Header: MIS QUINCE with proper word spacing -->
      <text x="600" y="98"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="22"
        fill="#556B48"
        text-anchor="middle"
        font-weight="bold"
        opacity="0.95">
        <tspan letter-spacing="10">MIS</tspan>
        <tspan dx="20" letter-spacing="10">QUINCE</tspan>
      </text>

      <!-- Bottom Divider line with Heart (under centerpiece) -->
      <line x1="435" y1="432" x2="575" y2="432" stroke="#CBDABB" stroke-width="1.2" opacity="0.85" />
      <text x="600" y="436" font-size="13" fill="#7A8B6F" text-anchor="middle" opacity="0.9">♥</text>
      <line x1="625" y1="432" x2="765" y2="432" stroke="#CBDABB" stroke-width="1.2" opacity="0.85" />

      <!-- Date: 28 DE NOVIEMBRE DE 2026 -->
      <text x="600" y="476"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="26"
        letter-spacing="9"
        fill="#33422E"
        text-anchor="middle"
        font-weight="bold">28 DE NOVIEMBRE DE 2026</text>

      <!-- Little Heart separator -->
      <text x="600" y="504" font-size="11" fill="#8B9D7D" text-anchor="middle" opacity="0.85">♥</text>

      <!-- Location / Time details -->
      <text x="600" y="530"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="16"
        letter-spacing="5"
        fill="#586C4E"
        text-anchor="middle"
        font-weight="600">SOLAR DOM PEDRO · 21:00 HS</text>

      <!-- Bottom invitation quote -->
      <text x="600" y="558"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="14.5"
        font-style="italic"
        letter-spacing="2.5"
        fill="#7A8B6F"
        text-anchor="middle">Los momentos más lindos son los que compartimos</text>
    </svg>
  `;

  const tlBranch = await sharp(path.join(botanicalsDir, 'branch-top-left-clean.png'))
    .resize(345, null)
    .toBuffer();

  const brBranch = await sharp(path.join(botanicalsDir, 'branch-bottom-right-clean.png'))
    .resize(350, null)
    .toBuffer();

  const ogCenterpiece = await sharp(path.join(botanicalsDir, 'centerpiece-xv-juli.png'))
    .resize(470, null)
    .toBuffer();

  const ogImage = await sharp(Buffer.from(svgBackground))
    .composite([
      // Top-left foliage
      {
        input: tlBranch,
        top: 25,
        left: 40,
      },
      // Bottom-right foliage
      {
        input: brBranch,
        top: 195,
        left: 840,
      },
      // Authentic XV Juli centerpiece
      {
        input: ogCenterpiece,
        top: 114,
        left: 365,
      },
    ])
    .png({ quality: 98 })
    .toBuffer();

  fs.writeFileSync(path.join(rootDir, 'public', 'og-image.png'), ogImage);
  fs.writeFileSync(path.join(rootDir, 'src', 'app', 'opengraph-image.png'), ogImage);

  console.log('All branding assets generated with authentic watercolor art!');
}

generateAllAssetsWithAuthenticBotanicals().catch(console.error);
