const fs = require('fs');
const path = require('path');

const mockDataPath = path.join(__dirname, 'mockData.ts');
const imagesDir = path.join(__dirname, 'public/images/competitions');

// Image mapping from competition IDs to new local paths
const imageMapping = {
  'c1': '/images/competitions/10k-cash.jpg',
  'c2': '/images/competitions/2k-bills.jpg',
  'c3': '/images/competitions/500-flash-cash.jpg',
  'c4': '/images/competitions/50k-mortgage.jpg',
  'c5': '/images/competitions/1k-supermarket.jpg',
  'c6': '/images/competitions/5k-emergency.jpg',
  'n1': '/images/competitions/bugaboo-fox.jpg',
  'n2': '/images/competitions/snoo-bassinet.jpg',
  'n3': '/images/competitions/stokke-highchair.jpg',
  'n4': '/images/competitions/nursery-furniture.jpg',
  'n5': '/images/competitions/elvie-pump.jpg',
  'n6': '/images/competitions/nursery-makeover.jpg',
  't1': '/images/competitions/lego-bundle.jpg',
  't2': '/images/competitions/ps5-bundle.jpg',
  't3': '/images/competitions/mercedes-rideon.jpg',
  't4': '/images/competitions/tonies-box.jpg',
  't5': '/images/competitions/ipads-kids.jpg',
  't6': '/images/competitions/climbing-frame.jpg',
  'h1': '/images/competitions/disney-florida.jpg',
  'h2': '/images/competitions/center-parcs.jpg',
  'h3': '/images/competitions/lapland-santa.jpg',
  'h4': '/images/competitions/eurocamp-france.jpg',
  'h5': '/images/competitions/dubai-atlantis.jpg',
  'h6': '/images/competitions/uk-cottage.jpg',
  'e1': '/images/competitions/pampers-year.jpg',
  'e2': '/images/competitions/john-lewis.jpg',
  'e3': '/images/competitions/thermomix.jpg',
  'e4': '/images/competitions/fuel-card.jpg',
  'e5': '/images/competitions/hello-fresh.jpg',
  'e6': '/images/competitions/costa-coffee.jpg'
};

function updateMockData() {
  console.log('📝 Updating mockData.ts with new image paths...\n');
  
  // Read the file
  let content = fs.readFileSync(mockDataPath, 'utf8');
  
  let updatedCount = 0;
  let skippedCount = 0;
  
  // Update each competition's image path
  for (const [id, newPath] of Object.entries(imageMapping)) {
    const imagePath = path.join(imagesDir, path.basename(newPath));
    
    // Check if image file exists
    if (!fs.existsSync(imagePath)) {
      console.log(`⚠️ Skipping ${id}: Image file not found (${path.basename(newPath)})`);
      skippedCount++;
      continue;
    }
    
    // Find and replace the image URL for this competition
    // Match pattern: id: 'c1', ... image: 'https://...'
    const regex = new RegExp(
      `(id:\\s*'${id}'[\\s\\S]*?image:\\s*)'[^']*'`,
      'g'
    );
    
    if (content.match(regex)) {
      content = content.replace(regex, `$1'${newPath}'`);
      console.log(`✅ Updated ${id}: ${newPath}`);
      updatedCount++;
    } else {
      console.log(`⚠️ Could not find pattern for ${id}`);
      skippedCount++;
    }
  }
  
  // Write the updated content back
  fs.writeFileSync(mockDataPath, content, 'utf8');
  
  console.log(`\n🎉 Update Complete!`);
  console.log(`✅ Updated: ${updatedCount}`);
  console.log(`⚠️ Skipped: ${skippedCount}`);
  console.log(`\n📄 File: ${mockDataPath}`);
  console.log('\n🚀 Your site should now load local images!');
}

updateMockData();

