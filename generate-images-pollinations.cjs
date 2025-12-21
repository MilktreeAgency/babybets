const fs = require('fs');
const https = require('https');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'public/images/competitions');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// All competition image prompts following BabyBets brand guidelines
const competitions = [
  // CASH PRIZES
  {
    id: 'c1',
    filename: '10k-cash.jpg',
    prompt: 'Premium photograph of British pound sterling banknotes ten thousand pounds arranged beautifully on white marble surface, soft teal background, piggy bank, modern home setting, natural warm lighting, professional photography, aspirational trustworthy mood, cream and teal color palette, 4:3 aspect ratio, photorealistic stock photo'
  },
  {
    id: 'c2',
    filename: '2k-bills.jpg',
    prompt: 'Professional photograph British pound notes two thousand pounds next to household bills marked PAID with green checkmark, family kitchen counter, soft cream and teal tones, natural morning light, organized relieving atmosphere, premium stock photography, 4:3 aspect ratio, photorealistic'
  },
  {
    id: 'c3',
    filename: '500-flash-cash.jpg',
    prompt: 'Elegant photograph five hundred pounds British pound notes fanned out beautifully, clean modern background with teal gradient, exciting energy professional family-friendly, soft peach accent lighting, 4:3 aspect ratio, premium photography, photorealistic stock photo'
  },
  {
    id: 'c4',
    filename: '50k-mortgage.jpg',
    prompt: 'Beautiful British family home exterior semi-detached house with front garden, front door open welcoming, house keys with MORTGAGE FREE tag in teal, natural daylight, cream and teal color palette, financial freedom security feeling, premium real estate photography, 4:3 aspect ratio, photorealistic'
  },
  {
    id: 'c5',
    filename: '1k-supermarket.jpg',
    prompt: 'Premium lifestyle photograph full shopping trolley modern bright supermarket aisle, fresh produce healthy foods family-size products, soft cream and teal color grading, natural supermarket lighting, professional photography, 4:3 aspect ratio, photorealistic stock photo'
  },
  {
    id: 'c6',
    filename: '5k-emergency.jpg',
    prompt: 'Reassuring photograph modern glass savings jar filled with money on clean desk next to family photo frame, soft natural light from window, teal and cream color palette, security preparedness feeling, premium lifestyle photography, 4:3 aspect ratio, photorealistic'
  },
  
  // NURSERY
  {
    id: 'n1',
    filename: 'bugaboo-fox.jpg',
    prompt: 'Premium Scandinavian-style nursery with luxury modern baby stroller grey cream colored large wheels as focal point, natural light streaming through white sheer curtains, cream walls natural light wood floors soft peach cushion accent, minimalist serene aspirational aesthetic, magazine quality lifestyle photography, 4:3 aspect ratio, photorealistic'
  },
  {
    id: 'n2',
    filename: 'snoo-bassinet.jpg',
    prompt: 'Beautiful modern nursery featuring premium smart bassinet sleek white grey modern oval design with mesh sides and LED indicator, soft natural morning light peaceful atmosphere, cream and soft grey tones with teal wall accent, serene restful premium baby product photography, 4:3 aspect ratio, photorealistic'
  },
  {
    id: 'n3',
    filename: 'stokke-highchair.jpg',
    prompt: 'Bright modern Scandinavian kitchen with three wooden high chairs in natural wood white and soft grey at kitchen island, morning light family breakfast setting, clean organized joyful atmosphere, cream and natural wood tones with peach fruit bowl accent, premium lifestyle photography, 4:3 aspect ratio, photorealistic'
  },
  {
    id: 'n4',
    filename: 'nursery-furniture.jpg',
    prompt: 'Complete white nursery furniture set sleigh cot bed matching wardrobe and changing unit in beautiful light-filled nursery, soft cream walls natural wood floor teal curtain accent, organized peaceful premium baby room, professional interior photography, 4:3 aspect ratio, photorealistic'
  },
  {
    id: 'n5',
    filename: 'elvie-pump.jpg',
    prompt: 'Modern empowering photograph of wearable breast pump white sleek wireless tubeless design on clean marble surface next to baby bottles and storage bags, soft natural light cream and white color palette with subtle teal accent, professional discrete modern motherhood, premium product photography, 4:3 aspect ratio, photorealistic'
  },
  {
    id: 'n6',
    filename: 'nursery-makeover.jpg',
    prompt: 'Stunning complete dream nursery with designer furniture custom wall art with animals plush toys on shelves and premium white crib with mobile, natural daylight streaming in cream base with peach and teal accents throughout, dream nursery aesthetic, magazine interior design photography, 4:3 aspect ratio, photorealistic'
  },
  
  // TOYS
  {
    id: 't1',
    filename: 'lego-bundle.jpg',
    prompt: 'Colorful LEGO castle sets Harry Potter Hogwarts style castle and Star Wars spaceship displayed together on clean white shelf in bright playroom, bright joyful playful energy, natural daylight organized toy display, cream background with colorful LEGO accents, premium toy photography, 4:3 aspect ratio, photorealistic'
  },
  {
    id: 't2',
    filename: 'ps5-bundle.jpg',
    prompt: 'PlayStation 5 console with two DualSense controllers and stack of family-friendly game cases on modern white TV unit, cozy family living room setting with soft lighting, teal sofa visible in background, modern entertainment setup premium homey atmosphere, professional tech photography, 4:3 aspect ratio, photorealistic'
  },
  {
    id: 't3',
    filename: 'mercedes-rideon.jpg',
    prompt: 'Luxury kids electric ride-on car Mercedes G-Wagon style glossy white in beautiful garden setting, happy toddler at wheel with parent holding remote control nearby, sunny day green lawn brick house visible, joyful aspirational family fun, premium lifestyle photography, 4:3 aspect ratio, photorealistic'
  },
  {
    id: 't4',
    filename: 'tonies-box.jpg',
    prompt: 'Colorful Toniebox audio player cube-shaped speaker in teal blue color surrounded by multiple cute character figures on child play table, bright playroom setting natural light, screen-free fun educational play atmosphere, cream walls colorful toy accents, premium children product photography, 4:3 aspect ratio, photorealistic'
  },
  {
    id: 't5',
    filename: 'ipads-kids.jpg',
    prompt: 'Two iPad Air tablets in colorful rugged kid-proof cases one teal one pink on wooden table, educational kids apps visible on screens, bright modern family home setting with books nearby, teal and cream color palette, technology for learning atmosphere, premium tech lifestyle photography, 4:3 aspect ratio, photorealistic'
  },
  {
    id: 't6',
    filename: 'climbing-frame.jpg',
    prompt: 'Beautiful wooden Montessori-style indoor climbing frame with slide and ladder in bright playroom, natural wood construction against cream walls, natural light Scandinavian interior design, soft play mat with teal and peach geometric patterns, active play child development focus, premium lifestyle photography, 4:3 aspect ratio, photorealistic'
  },
  
  // HOLIDAYS
  {
    id: 'h1',
    filename: 'disney-florida.jpg',
    prompt: 'Magical Cinderella Castle at Disney World Florida during golden hour sunset, beautiful iconic pink and blue castle with spires against orange and pink sky, fireworks beginning in sky above castle, warm magical dream vacation atmosphere, premium travel photography, 4:3 aspect ratio, photorealistic'
  },
  {
    id: 'h2',
    filename: 'center-parcs.jpg',
    prompt: 'Beautiful executive log lodge cabin by peaceful lake surrounded by lush green forest, family bikes parked outside on deck warm lights glowing from large windows at dusk, cozy UK staycation atmosphere, natural greens and warm cream tones, premium travel photography, 4:3 aspect ratio, photorealistic'
  },
  {
    id: 'h3',
    filename: 'lapland-santa.jpg',
    prompt: 'Magical winter scene in Lapland Finland, husky sled dogs in snow snow-covered pine trees Northern Lights green aurora in starry sky, warm golden lights from traditional wooden cabin with snow on roof, magical Christmas wonderland atmosphere, premium travel photography, 4:3 aspect ratio, photorealistic'
  },
  {
    id: 'h4',
    filename: 'eurocamp-france.jpg',
    prompt: 'Premium mobile home at French campsite, modern mobile home with large deck outdoor furniture, swimming pool with loungers visible in background under blue Mediterranean sky, happy vacation vibes cream and teal holiday aesthetic, affordable luxury family holiday, premium travel photography, 4:3 aspect ratio, photorealistic'
  },
  {
    id: 'h5',
    filename: 'dubai-atlantis.jpg',
    prompt: 'Atlantis The Palm Dubai hotel at sunset with iconic pink arch design against orange sky, palm trees silhouettes in foreground crystal blue pool water reflecting building, luxury exotic dream holiday atmosphere, golden hour lighting, premium travel photography, 4:3 aspect ratio, photorealistic'
  },
  {
    id: 'h6',
    filename: 'uk-cottage.jpg',
    prompt: 'Charming English stone cottage with wooden hot tub bubbling in garden fairy lights string glowing at dusk, rolling British countryside with green hills in background, dog-friendly cozy atmosphere cream stone walls with flower garden, romantic family getaway, premium travel photography, 4:3 aspect ratio, photorealistic'
  },
  
  // ESSENTIALS
  {
    id: 'e1',
    filename: 'pampers-year.jpg',
    prompt: 'Beautiful baby changing station with stacked nappy packages arranged attractively on shelving, clean fresh organized nursery corner, soft natural light cream and soft peach color palette throughout, premium baby care lifestyle photography, 4:3 aspect ratio, photorealistic'
  },
  {
    id: 'e2',
    filename: 'john-lewis.jpg',
    prompt: 'Elegant green shopping bags with white John Lewis and Partners text on beautiful kitchen counter, home items clothing and baby products peeking out, premium British retail atmosphere, clean aspirational shopping lifestyle cream background with brand green accent, premium lifestyle photography, 4:3 aspect ratio, photorealistic'
  },
  {
    id: 'e3',
    filename: 'thermomix.jpg',
    prompt: 'Modern Thermomix food processor white and grey on beautiful kitchen counter with fresh colorful ingredients around it vegetables and fruits, steam rising from cooking, modern family kitchen meal prep in progress, small baby food containers visible cream and teal kitchen aesthetic, premium kitchen appliance photography, 4:3 aspect ratio, photorealistic'
  },
  {
    id: 'e4',
    filename: 'fuel-card.jpg',
    prompt: 'Happy scene at petrol station fuel pump with modern family SUV car being filled, fuel card being inserted at pump display, bright daylight clean aesthetic practical family life atmosphere, modern fuel pump design teal and cream brand colors subtle, premium lifestyle photography, 4:3 aspect ratio, photorealistic'
  },
  {
    id: 'e5',
    filename: 'hello-fresh.jpg',
    prompt: 'HelloFresh meal kit green branded box open on kitchen counter fresh colorful ingredients vegetables proteins recipe cards laid out beautifully, modern kitchen background healthy eating atmosphere family meal preparation, green HelloFresh branding with cream kitchen, premium food lifestyle photography, 4:3 aspect ratio, photorealistic'
  },
  {
    id: 'e6',
    filename: 'costa-coffee.jpg',
    prompt: 'Cozy Costa Coffee scene premium takeaway cups with maroon Costa branding on cafe table beside window, warm morning light streaming in comfortable cafe atmosphere with cream and warm wood tones, parent self-care moment relaxation, premium lifestyle photography, 4:3 aspect ratio, photorealistic'
  }
];

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(OUTPUT_DIR, filename);
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        https.get(response.headers.location, (res) => {
          res.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve(outputPath);
          });
        }).on('error', reject);
      } else if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(outputPath);
        });
      } else {
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {}); // Delete partial file
      reject(err);
    });
  });
}

async function generateImage(prompt, filename) {
  // Use Pollinations.ai - free, no API key required, works globally
  const encodedPrompt = encodeURIComponent(prompt);
  const width = 1200;
  const height = 900; // 4:3 aspect ratio
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&model=flux`;
  
  try {
    await downloadImage(url, filename);
    console.log(`✅ Generated: ${filename}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed: ${filename}:`, error.message);
    return false;
  }
}

async function generateAllImages() {
  console.log('🎨 Starting BabyBets Image Generation');
  console.log('🔧 Using Pollinations.ai (Flux model)');
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  console.log(`🖼️ Total images to generate: ${competitions.length}\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < competitions.length; i++) {
    const comp = competitions[i];
    console.log(`\n[${i + 1}/${competitions.length}] Generating: ${comp.filename}`);
    
    try {
      const success = await generateImage(comp.prompt, comp.filename);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
      // Small delay to be respectful to the API
      await new Promise(r => setTimeout(r, 3000));
    } catch (error) {
      console.error(`Failed: ${comp.filename}`, error.message);
      failCount++;
    }
  }
  
  console.log(`\n\n🎉 Generation Complete!`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`\n📁 Images saved to: ${OUTPUT_DIR}`);
  
  // Update mockData.ts with new image paths
  if (successCount > 0) {
    console.log('\n📝 To update mockData.ts, run: node update-image-paths.cjs');
  }
}

generateAllImages().catch(console.error);

