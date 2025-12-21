const fs = require('fs');
const https = require('https');
const path = require('path');

// Fix SSL
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const OUTPUT_DIR = path.join(__dirname, 'public/images/competitions');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// DIRECT Unsplash photo URLs - these are the current images already working in your mockData.ts
// I'm downloading them locally so they load faster and work offline
const competitions = [
  { id: 'c1', filename: '10k-cash.jpg', url: 'https://images.unsplash.com/photo-1554672723-b208dc2d7197?auto=format&fit=crop&q=80&w=1200' },
  { id: 'c2', filename: '2k-bills.jpg', url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=1200' },
  { id: 'c3', filename: '500-flash-cash.jpg', url: 'https://images.unsplash.com/photo-1559589689-577aabd1db4f?auto=format&fit=crop&q=80&w=1200' },
  { id: 'c4', filename: '50k-mortgage.jpg', url: 'https://images.unsplash.com/photo-1560518883-ce09059ee971?auto=format&fit=crop&q=80&w=1200' },
  { id: 'c5', filename: '1k-supermarket.jpg', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200' },
  { id: 'c6', filename: '5k-emergency.jpg', url: 'https://images.unsplash.com/photo-1621981386829-9b416a40202b?auto=format&fit=crop&q=80&w=1200' },
  
  { id: 'n1', filename: 'bugaboo-fox.jpg', url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=1200' },
  { id: 'n2', filename: 'snoo-bassinet.jpg', url: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&q=80&w=1200' },
  { id: 'n3', filename: 'stokke-highchair.jpg', url: 'https://images.unsplash.com/photo-1544243642-4f014e3049b7?auto=format&fit=crop&q=80&w=1200' },
  { id: 'n4', filename: 'nursery-furniture.jpg', url: 'https://images.unsplash.com/photo-1522771753035-4a50097a6f55?auto=format&fit=crop&q=80&w=1200' },
  { id: 'n5', filename: 'elvie-pump.jpg', url: 'https://images.unsplash.com/photo-1614856050518-e3c314959db4?auto=format&fit=crop&q=80&w=1200' },
  { id: 'n6', filename: 'nursery-makeover.jpg', url: 'https://images.unsplash.com/photo-1525956180549-4d511fd16f35?auto=format&fit=crop&q=80&w=1200' },
  
  { id: 't1', filename: 'lego-bundle.jpg', url: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&q=80&w=1200' },
  { id: 't2', filename: 'ps5-bundle.jpg', url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=1200' },
  { id: 't3', filename: 'mercedes-rideon.jpg', url: 'https://images.unsplash.com/photo-1549497558-8671404c0df6?auto=format&fit=crop&q=80&w=1200' },
  { id: 't4', filename: 'tonies-box.jpg', url: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=1200' },
  { id: 't5', filename: 'ipads-kids.jpg', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=1200' },
  { id: 't6', filename: 'climbing-frame.jpg', url: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=1200' },
  
  { id: 'h1', filename: 'disney-florida.jpg', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200' },
  { id: 'h2', filename: 'center-parcs.jpg', url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200' },
  { id: 'h3', filename: 'lapland-santa.jpg', url: 'https://images.unsplash.com/photo-1518176258769-e3d8c1c52b0c?auto=format&fit=crop&q=80&w=1200' },
  { id: 'h4', filename: 'eurocamp-france.jpg', url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200' },
  { id: 'h5', filename: 'dubai-atlantis.jpg', url: 'https://images.unsplash.com/photo-1512453979798-5ea904ac6605?auto=format&fit=crop&q=80&w=1200' },
  { id: 'h6', filename: 'uk-cottage.jpg', url: 'https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?auto=format&fit=crop&q=80&w=1200' },
  
  { id: 'e1', filename: 'pampers-year.jpg', url: 'https://images.unsplash.com/photo-1555529733-0e670560f7e1?auto=format&fit=crop&q=80&w=1200' },
  { id: 'e2', filename: 'john-lewis.jpg', url: 'https://images.unsplash.com/photo-1555529771-7888783a18d3?auto=format&fit=crop&q=80&w=1200' },
  { id: 'e3', filename: 'thermomix.jpg', url: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=80&w=1200' },
  { id: 'e4', filename: 'fuel-card.jpg', url: 'https://images.unsplash.com/photo-1626125345510-4703417cb211?auto=format&fit=crop&q=80&w=1200' },
  { id: 'e5', filename: 'hello-fresh.jpg', url: 'https://images.unsplash.com/photo-1627309366653-204592a4767f?auto=format&fit=crop&q=80&w=1200' },
  { id: 'e6', filename: 'costa-coffee.jpg', url: 'https://images.unsplash.com/photo-1594261642340-0255c478a846?auto=format&fit=crop&q=80&w=1200' }
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

async function downloadAllImages() {
  console.log('🎨 BabyBets - Downloading Competition Images Locally');
  console.log('📥 Downloading existing Unsplash images for faster loading');
  console.log(`📁 Output: ${OUTPUT_DIR}\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < competitions.length; i++) {
    const comp = competitions[i];
    console.log(`[${i + 1}/${competitions.length}] ${comp.filename}`);
    
    try {
      await downloadImage(comp.url, comp.filename);
      console.log(`  ✅ Downloaded`);
      successCount++;
      await new Promise(r => setTimeout(r, 500));
    } catch (error) {
      console.log(`  ❌ Failed: ${error.message}`);
      failCount++;
    }
  }
  
  console.log(`\n🎉 Complete!`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  
  if (successCount > 0) {
    console.log(`\n📝 Run next: node update-image-paths.cjs`);
  }
}

downloadAllImages().catch(console.error);


