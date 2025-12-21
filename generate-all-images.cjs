const fs = require('fs');
const https = require('https');
const path = require('path');

// Fix SSL certificate issue
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const GEMINI_API_KEY = 'AIzaSyAB4yaEKxsTdm7FwpVe53vACN-D6-u3Ugo';
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
    filename: '10k-cash.png',
    prompt: 'Premium family-friendly photograph of British pound sterling banknotes (ten thousand pounds worth) arranged beautifully on a clean white marble surface. Soft teal color tones in the background. Include a subtle piggy bank and a modern home setting visible in soft focus. Natural warm lighting, professional photography style, aspirational but trustworthy mood. 4:3 aspect ratio, cream and teal color palette. Photorealistic, high quality.'
  },
  {
    id: 'c2',
    filename: '2k-bills.png',
    prompt: 'Professional photograph showing British pound notes (two thousand pounds) next to household bills being marked as PAID with a green checkmark. Family kitchen counter setting with soft cream and teal tones. Natural morning light, organized and relieving atmosphere. Premium stock photography style, 4:3 aspect ratio. Photorealistic.'
  },
  {
    id: 'c3',
    filename: '500-flash-cash.png',
    prompt: 'Elegant photograph of five hundred pounds in British pound notes fanned out beautifully. Clean modern background with teal gradient. Quick win, exciting energy but still professional and family-friendly. Soft peach accent lighting. 4:3 aspect ratio, premium photography. Photorealistic, high quality.'
  },
  {
    id: 'c4',
    filename: '50k-mortgage.png',
    prompt: 'Aspirational photograph of a beautiful British family home exterior (semi-detached or detached house with front garden) with the front door open and welcoming. A set of house keys with a MORTGAGE FREE tag in teal. Natural daylight, cream and teal color palette. Feeling of financial freedom and security. Premium real estate photography style, 4:3 aspect ratio. Photorealistic.'
  },
  {
    id: 'c5',
    filename: '1k-supermarket.png',
    prompt: 'Premium lifestyle photograph of a full shopping trolley in a modern, bright supermarket aisle. Fresh produce, healthy foods, family-size products visible. Soft cream and teal color grading. Natural supermarket lighting enhanced, professional photography, 4:3 aspect ratio. Photorealistic, high quality.'
  },
  {
    id: 'c6',
    filename: '5k-emergency.png',
    prompt: 'Reassuring photograph of a modern glass savings jar filled with money, placed on a clean desk next to a family photo frame. Soft natural light from a window. Teal and cream color palette. Feeling of security and preparedness. Premium lifestyle photography, 4:3 aspect ratio. Photorealistic.'
  },
  
  // NURSERY
  {
    id: 'n1',
    filename: 'bugaboo-fox.png',
    prompt: 'Premium Scandinavian-style nursery photograph with a luxury modern baby stroller (Bugaboo Fox 5 style - grey and cream colored with large wheels) as the focal point. Natural light streaming through white sheer curtains. Cream walls, natural light wood floors, soft peach cushion accent. Minimalist, serene, aspirational aesthetic. Magazine quality lifestyle photography, 4:3 aspect ratio. Photorealistic.'
  },
  {
    id: 'n2',
    filename: 'snoo-bassinet.png',
    prompt: 'Beautiful modern nursery photograph featuring a premium smart bassinet (SNOO style - sleek white and grey modern oval design with mesh sides) with subtle LED indicator light. Soft natural morning light, peaceful atmosphere. Cream and soft grey tones with teal wall accent. Serene, restful, premium baby product photography, 4:3 aspect ratio. Photorealistic.'
  },
  {
    id: 'n3',
    filename: 'stokke-highchair.png',
    prompt: 'Bright, modern Scandinavian kitchen photograph with three Stokke Tripp Trapp style wooden high chairs in natural wood, white, and soft grey arranged at a kitchen island. Morning light, family breakfast setting. Clean, organized, joyful atmosphere. Cream and natural wood tones with peach fruit bowl accent. Premium lifestyle photography, 4:3 aspect ratio. Photorealistic.'
  },
  {
    id: 'n4',
    filename: 'nursery-furniture.png',
    prompt: 'Complete white nursery furniture set photograph - sleigh cot bed, matching wardrobe, and changing unit in a beautiful light-filled nursery. Soft cream walls, natural wood floor, teal curtain accent. Organized, peaceful, premium baby room. Professional interior photography, 4:3 aspect ratio. Photorealistic, high quality.'
  },
  {
    id: 'n5',
    filename: 'elvie-pump.png',
    prompt: 'Modern, empowering photograph of Elvie style wearable breast pump (white, sleek, wireless tubeless design) on a clean marble surface next to baby bottles and storage bags. Soft natural light, cream and white color palette with subtle teal accent. Professional, discrete, modern motherhood. Premium product photography, 4:3 aspect ratio. Photorealistic.'
  },
  {
    id: 'n6',
    filename: 'nursery-makeover.png',
    prompt: 'Stunning complete dream nursery photograph with designer furniture, custom wall art with animals, plush toys on shelves, and premium white crib with mobile. Natural daylight streaming in, cream base with peach and teal accents throughout. Dream nursery aesthetic. Magazine interior design photography, 4:3 aspect ratio. Photorealistic, high quality.'
  },
  
  // TOYS
  {
    id: 't1',
    filename: 'lego-bundle.png',
    prompt: 'Colorful LEGO castle sets photograph (Harry Potter Hogwarts style castle and Star Wars spaceship) displayed together on a clean white shelf in a bright playroom. Bright, joyful, playful energy. Natural daylight, organized toy display. Cream background with colorful LEGO accents. Premium toy photography, 4:3 aspect ratio. Photorealistic.'
  },
  {
    id: 't2',
    filename: 'ps5-bundle.png',
    prompt: 'PlayStation 5 console photograph with two DualSense controllers and stack of family-friendly game cases on modern white TV unit. Cozy family living room setting with soft lighting. Teal sofa visible in background. Modern entertainment setup, premium but homey atmosphere. Professional tech photography, 4:3 aspect ratio. Photorealistic.'
  },
  {
    id: 't3',
    filename: 'mercedes-rideon.png',
    prompt: 'Luxury kids electric ride-on car photograph (Mercedes G-Wagon style, glossy white) in a beautiful garden setting. Happy toddler at the wheel with parent holding remote control nearby in soft focus. Sunny day, green lawn, brick house visible. Joyful, aspirational, family fun. Premium lifestyle photography, 4:3 aspect ratio. Photorealistic.'
  },
  {
    id: 't4',
    filename: 'tonies-box.png',
    prompt: 'Colorful Toniebox audio player photograph (cube-shaped speaker in teal blue color) surrounded by multiple cute Tonie character figures on a child play table. Bright playroom setting, natural light. Screen-free fun, educational play atmosphere. Cream walls, colorful toy accents. Premium children product photography, 4:3 aspect ratio. Photorealistic.'
  },
  {
    id: 't5',
    filename: 'ipads-kids.png',
    prompt: 'Two iPad Air tablets in colorful rugged kid-proof cases (one teal, one pink) on a wooden table. Educational kids apps visible on screens. Bright, modern family home setting with books nearby. Teal and cream color palette. Technology for learning atmosphere. Premium tech lifestyle photography, 4:3 aspect ratio. Photorealistic.'
  },
  {
    id: 't6',
    filename: 'climbing-frame.png',
    prompt: 'Beautiful wooden Montessori-style indoor climbing frame with slide and ladder in a bright playroom. Natural wood construction against cream walls. Natural light, Scandinavian interior design. Soft play mat with teal and peach geometric patterns. Active play, child development focus. Premium lifestyle photography, 4:3 aspect ratio. Photorealistic.'
  },
  
  // HOLIDAYS
  {
    id: 'h1',
    filename: 'disney-florida.png',
    prompt: 'Magical Cinderella Castle at Disney World Florida during golden hour sunset photograph. Beautiful iconic pink and blue castle with spires against orange and pink sky. Fireworks beginning in sky above castle. Warm, magical, dream vacation atmosphere. Premium travel photography, 4:3 aspect ratio. Photorealistic, high quality.'
  },
  {
    id: 'h2',
    filename: 'center-parcs.png',
    prompt: 'Beautiful Center Parcs style executive log lodge cabin photograph by a peaceful lake surrounded by lush green forest. Family bikes parked outside on deck, warm lights glowing from large windows at dusk. Cozy UK staycation atmosphere. Natural greens and warm cream tones. Premium travel photography, 4:3 aspect ratio. Photorealistic.'
  },
  {
    id: 'h3',
    filename: 'lapland-santa.png',
    prompt: 'Magical winter scene in Lapland Finland photograph. Husky sled dogs in snow, snow-covered pine trees, Northern Lights (green aurora) in starry sky. Warm golden lights from traditional wooden cabin with snow on roof. Magical Christmas wonderland atmosphere. Premium travel photography, 4:3 aspect ratio. Photorealistic, high quality.'
  },
  {
    id: 'h4',
    filename: 'eurocamp-france.png',
    prompt: 'Premium Eurocamp style mobile home photograph at a French campsite. Modern mobile home with large deck, outdoor furniture. Swimming pool with loungers visible in background under blue Mediterranean sky. Happy vacation vibes. Cream and teal holiday aesthetic. Affordable luxury family holiday. Premium travel photography, 4:3 aspect ratio. Photorealistic.'
  },
  {
    id: 'h5',
    filename: 'dubai-atlantis.png',
    prompt: 'Atlantis The Palm Dubai hotel photograph at sunset with its iconic pink arch design against orange sky. Palm trees silhouettes in foreground, crystal blue pool water reflecting the building. Luxury, exotic, dream holiday atmosphere. Golden hour lighting. Premium travel photography, 4:3 aspect ratio. Photorealistic, high quality.'
  },
  {
    id: 'h6',
    filename: 'uk-cottage.png',
    prompt: 'Charming English stone cottage photograph with wooden hot tub bubbling in the garden, fairy lights string glowing at dusk. Rolling British countryside with green hills in background. Dog-friendly cozy atmosphere. Cream stone walls with flower garden. Romantic family getaway. Premium travel photography, 4:3 aspect ratio. Photorealistic.'
  },
  
  // ESSENTIALS
  {
    id: 'e1',
    filename: 'pampers-year.png',
    prompt: 'Beautiful baby changing station photograph with stacked nappy packages arranged attractively on shelving. Clean, fresh, organized nursery corner. Soft natural light. Cream and soft peach color palette throughout. Premium baby care lifestyle photography, 4:3 aspect ratio. Photorealistic.'
  },
  {
    id: 'e2',
    filename: 'john-lewis.png',
    prompt: 'John Lewis shopping experience photograph - elegant green shopping bags with white John Lewis and Partners text on a beautiful kitchen counter. Home items, clothing, and baby products peeking out. Premium British retail atmosphere. Clean, aspirational shopping lifestyle. Cream background with brand green accent. Premium lifestyle photography, 4:3 aspect ratio. Photorealistic.'
  },
  {
    id: 'e3',
    filename: 'thermomix.png',
    prompt: 'Modern Thermomix TM6 food processor (white and grey) on a beautiful kitchen counter with fresh colorful ingredients around it including vegetables and fruits. Steam rising from cooking. Modern family kitchen, meal prep in progress. Small baby food containers visible. Cream and teal kitchen aesthetic. Premium kitchen appliance photography, 4:3 aspect ratio. Photorealistic.'
  },
  {
    id: 'e4',
    filename: 'fuel-card.png',
    prompt: 'Happy scene at petrol station fuel pump with modern family SUV car being filled. Fuel card being inserted at pump display. Bright daylight, clean aesthetic, practical family life atmosphere. Modern BP or Shell style pump design. Teal and cream brand colors subtle in scene. Premium lifestyle photography, 4:3 aspect ratio. Photorealistic.'
  },
  {
    id: 'e5',
    filename: 'hello-fresh.png',
    prompt: 'HelloFresh meal kit photograph with green branded box open on kitchen counter, fresh colorful ingredients (vegetables, proteins, recipe cards) laid out beautifully. Modern kitchen background. Healthy eating atmosphere, family meal preparation. Green HelloFresh branding with cream kitchen. Premium food lifestyle photography, 4:3 aspect ratio. Photorealistic.'
  },
  {
    id: 'e6',
    filename: 'costa-coffee.png',
    prompt: 'Cozy Costa Coffee scene photograph - premium takeaway cups with maroon Costa branding on a café table beside a window. Warm morning light streaming in. Comfortable café atmosphere with cream and warm wood tones. Parent self-care moment, relaxation. Premium lifestyle photography, 4:3 aspect ratio. Photorealistic.'
  }
];

async function generateImage(prompt, filename) {
  return new Promise((resolve, reject) => {
    const requestBody = JSON.stringify({
      contents: [{
        parts: [{
          text: `Generate an image: ${prompt}`
        }]
      }],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"]
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${GEMINI_API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.candidates && response.candidates[0]) {
            const parts = response.candidates[0].content.parts;
            for (const part of parts) {
              if (part.inlineData && part.inlineData.data) {
                const imageBuffer = Buffer.from(part.inlineData.data, 'base64');
                const outputPath = path.join(OUTPUT_DIR, filename);
                fs.writeFileSync(outputPath, imageBuffer);
                console.log(`✅ Generated: ${filename}`);
                resolve(outputPath);
                return;
              }
            }
          }
          console.log(`⚠️ No image in response for ${filename}:`, JSON.stringify(response).substring(0, 200));
          resolve(null);
        } catch (e) {
          console.error(`❌ Error parsing response for ${filename}:`, e.message);
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      console.error(`❌ Request error for ${filename}:`, e.message);
      reject(e);
    });

    req.write(requestBody);
    req.end();
  });
}

async function generateAllImages() {
  console.log('🎨 Starting BabyBets Image Generation');
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  console.log(`🖼️ Total images to generate: ${competitions.length}\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < competitions.length; i++) {
    const comp = competitions[i];
    console.log(`\n[${i + 1}/${competitions.length}] Generating: ${comp.filename}`);
    
    try {
      const result = await generateImage(comp.prompt, comp.filename);
      if (result) {
        successCount++;
      } else {
        failCount++;
      }
      // Small delay between requests to avoid rate limiting
      await new Promise(r => setTimeout(r, 2000));
    } catch (error) {
      console.error(`Failed: ${comp.filename}`, error.message);
      failCount++;
    }
  }
  
  console.log(`\n\n🎉 Generation Complete!`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`\n📁 Images saved to: ${OUTPUT_DIR}`);
}

generateAllImages().catch(console.error);

