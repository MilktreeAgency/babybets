const fs = require('fs');
const https = require('https');
const path = require('path');

const GEMINI_API_KEY = 'AIzaSyAB4yaEKxsTdm7FwpVe53vACN-D6-u3Ugo';

// Competition image prompts following BabyBets brand guidelines
const competitions = [
  // CASH PRIZES
  {
    id: 'c1',
    filename: '10k-cash.jpg',
    prompt: 'Premium family-friendly image of British pound sterling banknotes (£10,000 worth) arranged beautifully on a clean white marble surface. Soft teal (#496B71) color tones in the background. Include a subtle piggy bank and a modern home setting visible in soft focus. Natural warm lighting, professional photography style, aspirational but trustworthy mood. 4:3 aspect ratio, cream and teal color palette.'
  },
  {
    id: 'c2',
    filename: '2k-bills.jpg',
    prompt: 'Professional image showing British pound notes (£2,000) next to household bills being marked as PAID with a green checkmark. Family kitchen counter setting with soft cream (#FBEFDF) and teal (#496B71) tones. Natural morning light, organized and relieving atmosphere. Premium stock photography style, 4:3 aspect ratio.'
  },
  {
    id: 'c3',
    filename: '500-flash-cash.jpg',
    prompt: 'Elegant image of £500 in British pound notes fanned out with a subtle sparkle effect. Clean modern background with teal (#496B71) gradient. Quick win, exciting energy but still professional and family-friendly. Soft peach (#FED0B9) accent lighting. 4:3 aspect ratio, premium photography.'
  },
  {
    id: 'c4',
    filename: '50k-mortgage.jpg',
    prompt: 'Aspirational image of a beautiful family home exterior (British style semi-detached or detached house) with the front door open and welcoming. A set of house keys with a "MORTGAGE FREE" tag in teal (#496B71). Natural daylight, cream and teal color palette. Feeling of financial freedom and security. Premium real estate photography style, 4:3 aspect ratio.'
  },
  {
    id: 'c5',
    filename: '1k-supermarket.jpg',
    prompt: 'Premium lifestyle image of a full shopping trolley in a modern, bright supermarket aisle. Fresh produce, healthy foods, family-size products visible. Soft cream and teal color grading. A family hand placing items in cart. Natural supermarket lighting enhanced, professional photography, 4:3 aspect ratio.'
  },
  {
    id: 'c6',
    filename: '5k-emergency.jpg',
    prompt: 'Reassuring image of a modern piggy bank or savings jar filled with money, placed on a clean desk next to a family photo frame. Soft natural light from a window. Teal (#496B71) and cream (#FBEFDF) color palette. Feeling of security and preparedness. Premium lifestyle photography, 4:3 aspect ratio.'
  },
  
  // NURSERY
  {
    id: 'n1',
    filename: 'bugaboo-fox.jpg',
    prompt: 'Premium Scandinavian-style nursery with a luxury modern stroller (Bugaboo Fox 5 style - grey/cream colored) as the focal point. Natural light streaming through white sheer curtains. Cream (#FBEFDF) walls, natural light wood floors, soft peach (#FED0B9) cushion accent. Minimalist, serene, aspirational aesthetic. Magazine quality lifestyle photography, 4:3 aspect ratio.'
  },
  {
    id: 'n2',
    filename: 'snoo-bassinet.jpg',
    prompt: 'Beautiful modern nursery featuring a premium smart bassinet (SNOO style - sleek white/grey modern design) with subtle LED indicator. Soft natural morning light, peaceful sleeping baby visible through the mesh. Cream and soft grey tones with teal (#496B71) wall accent. Serene, restful, premium baby product photography, 4:3 aspect ratio.'
  },
  {
    id: 'n3',
    filename: 'stokke-highchair.jpg',
    prompt: 'Bright, modern Scandinavian kitchen with three Stokke Tripp Trapp style wooden high chairs in natural wood, white, and soft grey. Morning light, family breakfast setting. Clean, organized, joyful atmosphere. Cream and natural wood tones with peach (#FED0B9) fruit bowl accent. Premium lifestyle photography, 4:3 aspect ratio.'
  },
  {
    id: 'n4',
    filename: 'nursery-furniture.jpg',
    prompt: 'Complete white nursery furniture set - sleigh cot bed, matching wardrobe, and changing unit in a beautiful light-filled nursery. Soft cream walls, natural wood floor, teal (#496B71) curtain accent. Organized, peaceful, premium baby room. Professional interior photography, 4:3 aspect ratio.'
  },
  {
    id: 'n5',
    filename: 'elvie-pump.jpg',
    prompt: 'Modern, empowering image of Elvie style wearable breast pump (white, sleek, tubeless design) on a clean surface next to baby bottles and storage bags. Soft natural light, cream and white color palette with subtle teal accent. Professional, discrete, modern motherhood. Premium product photography, 4:3 aspect ratio.'
  },
  {
    id: 'n6',
    filename: 'nursery-makeover.jpg',
    prompt: 'Stunning complete nursery transformation - before/after style split image or beautiful finished nursery with designer furniture, custom wall art, plush toys, and premium crib. Natural daylight, cream (#FBEFDF) base with peach (#FED0B9) and teal (#496B71) accents. Dream nursery aesthetic. Magazine interior design photography, 4:3 aspect ratio.'
  },
  
  // TOYS
  {
    id: 't1',
    filename: 'lego-bundle.jpg',
    prompt: 'Colorful LEGO castle sets (Harry Potter Hogwarts style, Star Wars Millennium Falcon) displayed together on a clean white shelf. Child hands building in soft focus background. Bright, joyful, playful energy. Natural daylight, organized toy display. Cream background with colorful LEGO accents. Premium toy photography, 4:3 aspect ratio.'
  },
  {
    id: 't2',
    filename: 'ps5-bundle.jpg',
    prompt: 'PlayStation 5 console with two controllers and stack of family-friendly game cases on modern TV unit. Cozy family living room setting with soft lighting. Teal (#496B71) sofa visible in background. Modern entertainment setup, premium but homey atmosphere. Professional tech photography, 4:3 aspect ratio.'
  },
  {
    id: 't3',
    filename: 'mercedes-rideon.jpg',
    prompt: 'Luxury kids electric ride-on car (Mercedes G-Wagon style, white or black) in a beautiful garden setting. Happy toddler at the wheel with parent holding remote control nearby. Sunny day, green lawn, teal door of house visible. Joyful, aspirational, family fun. Premium lifestyle photography, 4:3 aspect ratio.'
  },
  {
    id: 't4',
    filename: 'tonies-box.jpg',
    prompt: 'Colorful Toniebox audio player (cube-shaped, teal/blue color) surrounded by multiple Tonie character figures on a child play table. Bright playroom setting, natural light. Screen-free fun, educational play atmosphere. Cream walls, colorful toy accents. Premium children product photography, 4:3 aspect ratio.'
  },
  {
    id: 't5',
    filename: 'ipads-kids.jpg',
    prompt: 'Two iPad Air tablets in colorful rugged kid-proof cases on a wooden table. Educational apps visible on screens. Bright, modern family home setting. Teal (#496B71) and cream (#FBEFDF) color palette. Technology for learning atmosphere. Premium tech lifestyle photography, 4:3 aspect ratio.'
  },
  {
    id: 't6',
    filename: 'climbing-frame.jpg',
    prompt: 'Beautiful wooden Montessori-style indoor climbing frame with slide and swing in a bright playroom. Happy toddler climbing safely. Natural light, Scandinavian interior design. Cream walls, natural wood, soft play mat with teal and peach colors. Active play, child development focus. Premium lifestyle photography, 4:3 aspect ratio.'
  },
  
  // HOLIDAYS
  {
    id: 'h1',
    filename: 'disney-florida.jpg',
    prompt: 'Magical Cinderella Castle at Disney World Florida during golden hour sunset. Family of four silhouettes (parents with two young children) holding hands in foreground looking at castle. Fireworks beginning in sky. Warm, magical, dream vacation atmosphere. Premium travel photography, 4:3 aspect ratio.'
  },
  {
    id: 'h2',
    filename: 'center-parcs.jpg',
    prompt: 'Beautiful Center Parcs style executive log lodge cabin by a peaceful lake surrounded by forest. Family bikes parked outside, warm lights glowing from windows at dusk. Cozy UK staycation atmosphere. Natural greens and warm cream tones. Premium travel photography, 4:3 aspect ratio.'
  },
  {
    id: 'h3',
    filename: 'lapland-santa.jpg',
    prompt: 'Magical winter scene in Lapland Finland. Husky sled dogs, snow-covered pine trees, Northern Lights in sky. Happy family meeting Santa in traditional red outfit. Warm golden lights from wooden cabin. Magical Christmas wonderland. Premium travel photography, 4:3 aspect ratio.'
  },
  {
    id: 'h4',
    filename: 'eurocamp-france.jpg',
    prompt: 'Premium Eurocamp style mobile home at a French campsite. Family relaxing on deck chairs, swimming pool visible in background. Mediterranean sun, happy vacation vibes. Cream and teal holiday aesthetic. Affordable luxury family holiday. Premium travel photography, 4:3 aspect ratio.'
  },
  {
    id: 'h5',
    filename: 'dubai-atlantis.jpg',
    prompt: 'Atlantis The Palm Dubai hotel exterior at sunset with its iconic arch design. Family splashing in the Aquaventure waterpark in foreground. Luxury, exotic, dream holiday atmosphere. Golden hour lighting, palm trees, crystal blue water. Premium travel photography, 4:3 aspect ratio.'
  },
  {
    id: 'h6',
    filename: 'uk-cottage.jpg',
    prompt: 'Charming English stone cottage with hot tub in garden, fairy lights glowing at dusk. Dog-friendly sign visible. Rolling British countryside in background. Cozy, romantic, family getaway atmosphere. Cream and teal brand colors subtle in flowers. Premium travel photography, 4:3 aspect ratio.'
  },
  
  // ESSENTIALS
  {
    id: 'e1',
    filename: 'pampers-year.jpg',
    prompt: 'Beautiful baby changing station with stacked Pampers nappy packages arranged attractively. Cute baby in soft focus being changed by loving parent hands. Clean, fresh, practical lifestyle. Cream (#FBEFDF) and soft peach (#FED0B9) color palette. Premium baby care photography, 4:3 aspect ratio.'
  },
  {
    id: 'e2',
    filename: 'john-lewis.jpg',
    prompt: 'John Lewis shopping experience - elegant shopping bags in iconic green color on a beautiful counter. Home, fashion, and baby items peeking out. Premium British retail atmosphere. Clean, aspirational, lifestyle shopping. Cream background with brand green accent. Premium lifestyle photography, 4:3 aspect ratio.'
  },
  {
    id: 'e3',
    filename: 'thermomix.jpg',
    prompt: 'Modern Thermomix TM6 (white/grey) on a beautiful kitchen counter with fresh ingredients around it. Steam rising from cooking. Modern family kitchen, meal prep in progress. Baby food containers visible. Cream and teal (#496B71) kitchen aesthetic. Premium kitchen appliance photography, 4:3 aspect ratio.'
  },
  {
    id: 'e4',
    filename: 'fuel-card.jpg',
    prompt: 'Happy parent at petrol station fuel pump with family car (modern SUV). Child visible waving from back seat. Fuel card being used at pump. Practical family life, freedom to travel. Bright daylight, clean aesthetic. Teal and cream brand colors in clothing. Premium lifestyle photography, 4:3 aspect ratio.'
  },
  {
    id: 'e5',
    filename: 'hello-fresh.jpg',
    prompt: 'HelloFresh meal kit box open on kitchen counter with fresh ingredients laid out. Family cooking together in background - parent and child. Modern kitchen, healthy eating atmosphere. Green HelloFresh branding with cream (#FBEFDF) kitchen. Premium food lifestyle photography, 4:3 aspect ratio.'
  },
  {
    id: 'e6',
    filename: 'costa-coffee.jpg',
    prompt: 'Cozy Costa Coffee scene - premium takeaway cups with Costa branding on a café table. Tired but happy parent having a peaceful coffee moment, pushchair beside them. Warm café atmosphere with morning light. Teal and cream color accents. Parenting self-care moment. Premium lifestyle photography, 4:3 aspect ratio.'
  }
];

console.log('Image generation prompts ready!');
console.log('Total competitions:', competitions.length);
console.log('\nTo generate these images, the Nanobanana Pro MCP needs to be active in Cursor.');
console.log('\nPrompts saved for reference.');

// Save prompts to a JSON file for reference
fs.writeFileSync(
  path.join(__dirname, 'public/images/image-prompts.json'),
  JSON.stringify(competitions, null, 2)
);

console.log('\nPrompts saved to public/images/image-prompts.json');
