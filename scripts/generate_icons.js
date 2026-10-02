const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const appIconSvgPath = path.join(__dirname, '../android/app/src/main/res/orbita_app_icon.svg');

const foregroundSvg = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(153.6, 153.6) scale(0.7)">
    <mask id="mask0_fg" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="-38" y="-38" width="1100" height="1100">
      <path d="M1062 -38H-38V1062H1062V-38Z" fill="white"/>
      <path d="M512 776C657.803 776 776 657.803 776 512C776 366.197 657.803 248 512 248C366.197 248 248 366.197 248 512C248 657.803 366.197 776 512 776Z" fill="black"/>
    </mask>
    <g mask="url(#mask0_fg)">
      <mask id="mask1_fg" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="-592" y="-592" width="2208" height="2208">
        <path d="M803.345 -591.161L-591.161 221.954L220.655 1615.16L1615.16 802.046L803.345 -591.161Z" fill="white"/>
        <path d="M563.739 596.056C723.94 511.394 830.644 405.128 802.069 358.705C773.494 312.283 620.461 343.282 460.26 427.944C300.059 512.607 193.355 618.872 221.93 665.295C250.505 711.718 403.538 680.718 563.739 596.056Z" fill="black"/>
      </mask>
      <g mask="url(#mask1_fg)">
        <path d="M583.833 630.053C824.828 503.743 988.032 348.494 948.36 283.296C908.687 218.097 681.162 267.638 440.167 393.948C199.172 520.258 35.968 675.506 75.6404 740.705C115.313 805.903 342.839 756.363 583.833 630.053Z" fill="white"/>
      </g>
    </g>
    <mask id="mask2_fg" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="-56" y="-32" width="1100" height="1100">
      <path d="M1044 -32H-56V1068H1044V-32Z" fill="white"/>
      <path d="M765.168 384.783C775.518 402.969 756.5 434.914 712.299 473.592C668.098 512.27 602.334 554.512 529.475 591.025C456.616 627.538 382.63 655.331 323.792 668.29C264.955 681.25 226.087 678.313 215.737 660.127L29.3234 753.548C50.5482 790.844 119.487 802.266 220.974 785.301C322.46 768.335 448.182 724.372 570.481 663.082C692.78 601.792 801.639 528.197 873.109 458.486C944.58 388.775 972.807 328.659 951.582 291.362L765.168 384.783Z" fill="black"/>
    </mask>
    <g mask="url(#mask2_fg)">
      <path d="M511.625 749.25C644.519 749.25 752.25 641.519 752.25 508.625C752.25 375.731 644.519 268 511.625 268C378.731 268 271 375.731 271 508.625C271 641.519 378.731 749.25 511.625 749.25Z" fill="white"/>
    </g>
    <mask id="mask3_fg" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="-230" y="150" width="1846" height="1466">
      <path d="M1190.35 150.344L-229.505 928.694L195.308 1615.16L1615.16 836.812L1190.35 150.344Z" fill="white"/>
    </mask>
    <g mask="url(#mask3_fg)">
      <mask id="mask4_fg" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="-592" y="-592" width="2208" height="2208">
        <path d="M801.854 -591.161L-591.161 221.314L222.146 1615.16L1615.16 802.686L801.854 -591.161Z" fill="white"/>
        <path d="M563.864 596.128C723.996 511.506 830.589 405.24 801.945 358.778C773.301 312.315 620.268 343.249 460.136 427.872C300.004 512.494 193.411 618.76 222.055 665.222C250.699 711.685 403.732 680.751 563.864 596.128Z" fill="black"/>
      </mask>
      <g mask="url(#mask4_fg)">
        <path d="M584.422 629.855C825.092 503.436 987.769 348.188 947.771 283.098C907.774 218.008 680.248 267.726 439.578 394.145C198.909 520.564 36.2315 675.812 76.2289 740.902C116.226 805.991 343.752 756.274 584.422 629.855Z" fill="white"/>
      </g>
    </g>
  </g>
</svg>`;

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
const fgBuffer = Buffer.from(foregroundSvg);
const notifBuffer = Buffer.from(notificationSvg);

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
      .png()
      .toFile(path.join(targetDir, 'ic_launcher.png'));

    await sharp(appIconSvg)
      .resize(size, size)
      .png()
      .toFile(path.join(targetDir, 'ic_launcher_round.png'));

    await sharp(fgBuffer)
      .resize(foreground, foreground)
      .png()
      .toFile(path.join(targetDir, 'ic_launcher_foreground.png'));
  }

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
