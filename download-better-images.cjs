const fs = require('fs');
const https = require('https');
const path = require('path');

// Fix SSL certificate issue
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const OUTPUT_DIR = path.join(__dirname, 'public/images/competitions');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Better curated Unsplash images that match BabyBets brand
const competitions = [
  // CASH PRIZES - Professional money/finance images with warm tones
  { id: 'c1', filename: '10k-cash.jpg', unsplashId: 'photo-1633158829875-e5316a358c6f', query: 'british-pounds-money' },
  { id: 'c2', filename: '2k-bills.jpg', unsplashId: 'photo-1579621970563-ebec7560ff3e', query: 'bills-finance-relief' },
  { id: 'c3', filename: '500-flash-cash.jpg', unsplashId: 'photo-1607863680198-23d4b2565df0', query: 'money-cash-savings' },
  { id: 'c4', filename: '50k-mortgage.jpg', unsplashId: 'photo-1560518883-ce09059ee971', query: 'house-keys-home' },
  { id: 'c5', filename: '1k-supermarket.jpg', unsplashId: 'photo-1604719312566-8912e9227c6a', query: 'grocery-shopping-cart' },
  { id: 'c6', filename: '5k-emergency.jpg', unsplashId: 'photo-1579621970795-87facc2f976d', query: 'savings-piggy-bank' },
  
  // NURSERY - Scandinavian, serene baby spaces
  { id: 'n1', filename: 'bugaboo-fox.jpg', unsplashId: 'photo-1522771739844-6a9f6d5f14af', query: 'baby-stroller-nursery' },
  { id: 'n2', filename: 'snoo-bassinet.jpg', unsplashId: 'photo-1555252333-9f8e92e65df9', query: 'baby-bassinet-crib' },
  { id: 'n3', filename: 'stokke-highchair.jpg', unsplashId: 'photo-1556910103-1c02745a30bf', query: 'baby-highchair-kitchen' },
  { id: 'n4', filename: 'nursery-furniture.jpg', unsplashId: 'photo-1522771739844-6a9f6d5f14af', query: 'nursery-furniture-crib' },
  { id: 'n5', filename: 'elvie-pump.jpg', unsplashId: 'photo-1515488042361-ee00e0ddd4e4', query: 'baby-bottles-feeding' },
  { id: 'n6', filename: 'nursery-makeover.jpg', unsplashId: 'photo-1555252333-9f8e92e65df9', query: 'modern-nursery-design' },
  
  // TOYS - Playful, colorful, educational
  { id: 't1', filename: 'lego-bundle.jpg', unsplashId: 'photo-1587654780291-39c9404d746b', query: 'lego-castle-toys' },
  { id: 't2', filename: 'ps5-bundle.jpg', unsplashId: 'photo-1606144042614-b2417e99c4e3', query: 'playstation-5-gaming' },
  { id: 't3', filename: 'mercedes-rideon.jpg', unsplashId: 'photo-1549317661-bd32c8ce0db2', query: 'kids-ride-on-car' },
  { id: 't4', filename: 'tonies-box.jpg', unsplashId: 'photo-1558060370-d644479cb6f7', query: 'kids-toys-audio' },
  { id: 't5', filename: 'ipads-kids.jpg', unsplashId: 'photo-1544244015-0df4b3ffc6b0', query: 'ipad-kids-learning' },
  { id: 't6', filename: 'climbing-frame.jpg', unsplashId: 'photo-1503454537195-1dcabb73ffb9', query: 'kids-climbing-frame' },
  
  // HOLIDAYS - Aspirational travel destinations
  { id: 'h1', filename: 'disney-florida.jpg', unsplashId: 'photo-1597395252821-83c4a1da3e1f', query: 'disney-castle-florida' },
  { id: 'h2', filename: 'center-parcs.jpg', unsplashId: 'photo-1542314831-068cd1dbfeeb', query: 'log-cabin-forest-lake' },
  { id: 'h3', filename: 'lapland-santa.jpg', unsplashId: 'photo-1512389142860-9c449e58a543', query: 'lapland-winter-northern-lights' },
  { id: 'h4', filename: 'eurocamp-france.jpg', unsplashId: 'photo-1520250497591-112f2f40a3f4', query: 'camping-france-mediterranean' },
  { id: 'h5', filename: 'dubai-atlantis.jpg', unsplashId: 'photo-1512453979798-5ea904ac6605', query: 'dubai-atlantis-palm-hotel' },
  { id: 'h6', filename: 'uk-cottage.jpg', unsplashId: 'photo-1449158743715-0a90ebb6d2d8', query: 'english-cottage-countryside' },
  
  // ESSENTIALS - Practical family life helpers
  { id: 'e1', filename: 'pampers-year.jpg', unsplashId: 'photo-1515488042361-ee00e0ddd4e4', query: 'baby-diapers-nappies' },
  { id: 'e2', filename: 'john-lewis.jpg', unsplashId: 'photo-1607083206968-13611e3d76db', query: 'shopping-bags-retail' },
  { id: 'e3', filename: 'thermomix.jpg', unsplashId: 'photo-1556911220-bff31c812dba', query: 'kitchen-appliance-cooking' },
  { id: 'e4', filename: 'fuel-card.jpg', unsplashId: 'photo-1593941707882-a5bba14938c7', query: 'gas-station-fuel-pump' },
  { id: 'e5', filename: 'hello-fresh.jpg', unsplashId: 'photo-1542010589005-d1eacc3918f2', query: 'meal-kit-fresh-ingredients' },
  { id: 'e6', filename: 'costa-coffee.jpg', unsplashId: 'photo-1509042239860-f550ce710b93', query: 'coffee-cafe-cup' }
];

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(OUTPUT_DIR, filename);
    const file = fs.createWriteStream(outputPath);
    
    const download = (imageUrl) => {
      https.get(imageUrl, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          download(response.headers.location);
        } else if (response.statusCode === 200) {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve(outputPath);
          });
        } else {
          fs.unlink(outputPath, () => {});
          reject(new Error(`HTTP ${response.statusCode}`));
        }
      }).on('error', (err) => {
        fs.unlink(outputPath, () => {});
        reject(err);
      });
    };
    
    download(url);
  });
}

async function downloadCompetitionImages() {
  console.log('🎨 BabyBets - Downloading Better Unsplash Images');
  console.log(`📁 Output: ${OUTPUT_DIR}\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < competitions.length; i++) {
    const comp = competitions[i];
    console.log(`[${i + 1}/${competitions.length}] ${comp.filename}`);
    
    // Unsplash Source API - high quality 1200x900 (4:3 ratio)
    const url = `https://source.unsplash.com/${comp.unsplashId}/1200x900`;
    
    try {
      await downloadImage(url, comp.filename);
      console.log(`  ✅ Downloaded`);
      successCount++;
      // Respectful delay
      await new Promise(r => setTimeout(r, 1000));
    } catch (error) {
      console.log(`  ❌ Failed: ${error.message}`);
      failCount++;
    }
  }
  
  console.log(`\n🎉 Complete!`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`\n📁 Images saved to: ${OUTPUT_DIR}`);
  console.log(`\n📝 Next step: node update-image-paths.cjs`);
}

downloadCompetitionImages().catch(console.error);

