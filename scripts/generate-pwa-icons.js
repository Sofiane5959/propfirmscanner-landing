/**
 * Script to generate PNG icons for PWA
 * 
 * Prerequisites:
 * npm install sharp
 * 
 * Run:
 * node scripts/generate-pwa-icons.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outputDir = path.join(__dirname, '../public/icons');

// SVG template for the icon
const createSvg = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#34d399;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.2)}" fill="url(#grad)"/>
  <text 
    x="50%" 
    y="55%" 
    dominant-baseline="middle" 
    text-anchor="middle" 
    font-family="system-ui, -apple-system, BlinkMacSystemFont, sans-serif" 
    font-weight="bold" 
    font-size="${Math.round(size * 0.5)}" 
    fill="white"
  >P</text>
</svg>
`;

async function generateIcons() {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🎨 Generating PWA icons...\n');

  for (const size of sizes) {
    const svgBuffer = Buffer.from(createSvg(size));
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);

    try {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated: icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`❌ Failed to generate ${size}x${size}:`, error.message);
    }
  }

  // Generate apple-touch-icon (180x180)
  const appleSvg = Buffer.from(createSvg(180));
  const appleOutputPath = path.join(outputDir, 'apple-touch-icon.png');
  
  try {
    await sharp(appleSvg)
      .resize(180, 180)
      .png()
      .toFile(appleOutputPath);
    
    console.log(`✅ Generated: apple-touch-icon.png`);
  } catch (error) {
    console.error('❌ Failed to generate apple-touch-icon:', error.message);
  }

  // Generate favicon.ico (32x32)
  const faviconSvg = Buffer.from(createSvg(32));
  const faviconOutputPath = path.join(__dirname, '../public/favicon.ico');
  
  try {
    await sharp(faviconSvg)
      .resize(32, 32)
      .png()
      .toFile(faviconOutputPath.replace('.ico', '.png'));
    
    console.log(`✅ Generated: favicon.png (rename to .ico manually or use as-is)`);
  } catch (error) {
    console.error('❌ Failed to generate favicon:', error.message);
  }

  console.log('\n🎉 Done! Icons generated in public/icons/');
  console.log('\n📝 Next steps:');
  console.log('1. Update manifest.json to use .png files');
  console.log('2. Add <link rel="apple-touch-icon"> to your layout');
}

generateIcons().catch(console.error);
