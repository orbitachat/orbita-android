const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const appIconSvgPath = path.join(__dirname, '../android/app/src/main/res/orbita_app_icon.svg');

const notificationSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
    <defs>
        <clipPath id="front-clip">
            <rect x="-600" y="0" width="1200" height="600" />
        </clipPath>
        <mask id="back-ring-mask">
            <rect x="0" y="0" width="800" height="800" fill="white" />
            <circle cx="400" cy="400" r="192" fill="black" />
        </mask>
        <mask id="planet-mask">
            <rect x="0" y="0" width="800" height="800" fill="white" />
            <g transform="translate(400, 400) rotate(-26)">
                <path d="M 224 0 A 224 59 0 0 1 -224 0 L -376 0 A 376 121 0 0 0 376 0 Z" fill="black" />
            </g>
        </mask>
        <mask id="ring-hole">
            <rect x="-600" y="-600" width="1200" height="1200" fill="white" />
            <ellipse cx="0" cy="0" rx="240" ry="75" fill="black" />
        </mask>
    </defs>
    <g mask="url(#back-ring-mask)">
        <g transform="translate(400, 400) rotate(-26)">
            <ellipse cx="0" cy="0" rx="360" ry="105" fill="#FFFFFF" mask="url(#ring-hole)" />
        </g>
    </g>
    <circle cx="400" cy="400" r="175" fill="#FFFFFF" mask="url(#planet-mask)" />
    <g transform="translate(400, 400) rotate(-26)">
        <g clip-path="url(#front-clip)">
            <ellipse cx="0" cy="0" rx="360" ry="105" fill="#FFFFFF" mask="url(#ring-hole)" />
        </g>
    </g>
</svg>`;

const appIconSvg = fs.readFileSync(appIconSvgPath);

const mipmapSizes = [
  { dir: 'mipmap-mdpi', size: 48, foreground: 108 },
  { dir: 'mipmap-hdpi', size: 72, foreground: 162 },
  { dir: 'mipmap-xhdpi', size: 96, foreground: 216 },
  { dir: 'mipmap-xxhdpi', size: 144, foreground: 324 },
  { dir: 'mipmap-xxxhdpi', size: 192, foreground: 432 }
];

const drawableSizes = [
  { dir: 'drawable-mdpi', size: 24 },
  { dir: 'drawable-hdpi', size: 36 },
  { dir: 'drawable-xhdpi', size: 48 },
  { dir: 'drawable-xxhdpi', size: 72 },
  { dir: 'drawable-xxxhdpi', size: 96 },
  { dir: 'drawable', size: 48 }
];

async function generate() {
  const baseRes = path.join(__dirname, '../android/app/src/main/res');

  for (const { dir, size, foreground } of mipmapSizes) {
    const targetDir = path.join(baseRes, dir);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    await sharp(appIconSvg)
      .resize(size, size)
      .webp({ quality: 100, lossless: true })
      .toFile(path.join(targetDir, 'ic_launcher.webp'));

    await sharp(appIconSvg)
      .resize(size, size)
      .webp({ quality: 100, lossless: true })
      .toFile(path.join(targetDir, 'ic_launcher_round.webp'));

    await sharp(appIconSvg)
      .resize(foreground, foreground)
      .webp({ quality: 100, lossless: true })
      .toFile(path.join(targetDir, 'ic_launcher_foreground.webp'));
  }

  const notifBuffer = Buffer.from(notificationSvg);

  for (const { dir, size } of drawableSizes) {
    const targetDir = path.join(baseRes, dir);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    await sharp(notifBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(targetDir, 'ic_notification.png'));
  }

  console.log('Icons generated successfully');
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
