import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import crypto from "node:crypto";

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16);
  const key = crypto.pbkdf2Sync(password, salt, 120000, 32, "sha256");
  return `${salt.toString("base64url")}.${key.toString("base64url")}`;
}

const db = new DatabaseSync("salon.sqlite");
const now = Date.now();

console.log("Seeding luxury beauty salon data...");

// 1. Users
const adminPasswordHash = hashPassword("AdminLuxury2026!");
const stylistPasswordHash = hashPassword("StylistPass2026!");

db.prepare(`
  INSERT OR REPLACE INTO users (id, email, name, phone, password_hash, role, created_at, updated_at)
  VALUES 
    ('usr_admin_01', 'director@aegisbeauty.com', 'Eleanor Vance', '+1 (555) 728-2831', ?, 'CORPORATE_ADMIN', ?, ?),
    ('usr_stylist_01', 'clara@aegisbeauty.com', 'Clara Dubois', '+1 (555) 234-5678', ?, 'STYLIST', ?, ?),
    ('usr_stylist_02', 'marcus@aegisbeauty.com', 'Marcus Vance', '+1 (555) 345-6789', ?, 'STYLIST', ?, ?),
    ('usr_stylist_03', 'sofia@aegisbeauty.com', 'Sofia Chen', '+1 (555) 456-7890', ?, 'STYLIST', ?, ?),
    ('usr_stylist_04', 'elena@aegisbeauty.com', 'Elena Rostova', '+1 (555) 567-8901', ?, 'STYLIST', ?, ?)
`).run(adminPasswordHash, now, now, stylistPasswordHash, now, now, stylistPasswordHash, now, now, stylistPasswordHash, now, now, stylistPasswordHash, now, now);

// 2. Brands
db.prepare(`
  INSERT OR REPLACE INTO brands (id, name, slug, category, description, created_at, updated_at)
  VALUES ('brand_aegis', 'Aegis Maison de Beauté', 'aegis-maison', 'LUXURY_SPA', 'Haute couture haircare, transformative clinical skincare, and artisanal beauty rituals.', ?, ?)
`).run(now, now);

// 3. Salons
const defaultSalonId = 'salon_soho_01';
db.prepare(`
  INSERT OR REPLACE INTO salons (id, franchisee_id, brand_id, name, slug, address, city, phone, email, hours, lat, lng, status, created_at, updated_at)
  VALUES (?, 'usr_admin_01', 'brand_aegis', 'Aegis Maison de Beauté — SoHo Flagship', 'aegis-soho', '482 Broome Street, SoHo, New York, NY 10013', 'New York', '+1 (212) 555-0198', 'soho@aegisbeauty.com', 'Mon - Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 6:00 PM', 40.7223, -73.9998, 'ACTIVE', ?, ?)
`).run(defaultSalonId, now, now);

// 4. Stylists
const stylistsData = [
  {
    id: 'sty_01',
    name: 'Clara Dubois',
    title: 'Creative Director & Master Colorist',
    spec: 'French Balayage, Bespoke Color Formulation & Precision Cutting',
    exp: 14,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    bio: 'Trained in Paris and Milan, Clara specializes in luminous lived-in blondes, couture brunettes, and harmonic architectural haircuts tailored to individual facial contours.',
    rating: 4.98
  },
  {
    id: 'sty_02',
    name: 'Marcus Vance',
    title: 'Senior Hair Artisan & Texture Specialist',
    spec: 'Keratin Infusions, Japanese Silk Smoothing & Editorial Styling',
    exp: 11,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    bio: 'Marcus has styled high-fashion runway shows in London and New York. His signature silk smoothing and restorative keratin glosses restore supreme structural integrity to hair.',
    rating: 4.95
  },
  {
    id: 'sty_03',
    name: 'Sofia Chen',
    title: 'Lead Aesthetician & Dermal Therapist',
    spec: 'Hydra-Infusion Facials, Micro-Current Sculpting & Bridal Radiance',
    exp: 12,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    bio: 'A certified dermal clinical specialist, Sofia blends clinical non-invasive biotechnologies with relaxing lymph-drainage massage for glass-skin luminescence.',
    rating: 4.99
  },
  {
    id: 'sty_04',
    name: 'Elena Rostova',
    title: 'Haute Editorial & Bridal Makeup Artist',
    spec: 'High-Definition Bridal Glam, Airbrush Finish & Red Carpet Glow',
    exp: 9,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    bio: 'Elena is celebrated for weightless, enduring bridal makeup that enhances natural bone structure while remaining completely photographic and timeless.',
    rating: 4.97
  },
  {
    id: 'sty_05',
    name: 'Amara Laurent',
    title: 'Master Nail Artist & Sculptor',
    spec: 'Russian E-File Manicure, Sculptured Gel Extensions & Minimalist Nail Art',
    exp: 8,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    bio: 'Amara redefines nail artistry with immaculate cuticle care, structural balance, and delicate hand-painted champagne gold accents.',
    rating: 4.96
  }
];

const insertStylist = db.prepare(`
  INSERT OR REPLACE INTO stylists (id, salon_id, user_id, name, title, specialization, experience_years, avatar_url, bio, rating, commission_rate, status, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0.25, 'ACTIVE', ?, ?)
`);

for (const s of stylistsData) {
  insertStylist.run(s.id, defaultSalonId, null, s.name, s.title, s.spec, s.exp, s.avatar, s.bio, s.rating, now, now);
}

// 5. Services (Hair, Skin, Makeup, Nails, Grooming)
const servicesData = [
  // HAIR
  {
    id: 'srv_hair_01',
    cat: 'HAIR',
    name: 'Couture Cut & Botanical Blow-Dry',
    desc: 'Bespoke diagnostic consultation, botanical scalp detox, tailored precision cut, and signature voluminous silk blowout.',
    duration: 60,
    price: 135,
    img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    featured: 1,
    bestSeller: 1
  },
  {
    id: 'srv_hair_02',
    cat: 'HAIR',
    name: 'French Sun-Kissed Balayage & Gloss',
    desc: 'Hand-painted dimensional highlighting technique followed by a custom peptide toner and high-shine conditioning glaze.',
    duration: 150,
    price: 285,
    img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
    featured: 1,
    bestSeller: 1
  },
  {
    id: 'srv_hair_03',
    cat: 'HAIR',
    name: 'Caviar & Collagen Deep Spa Therapy',
    desc: 'Intense micro-mist steam infusion with marine caviar extracts and vegetal collagen to rebuild broken molecular bonds.',
    duration: 75,
    price: 165,
    img: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
    featured: 0,
    bestSeller: 0
  },
  {
    id: 'srv_hair_04',
    cat: 'HAIR',
    name: 'Liquid Silk Keratin Smoothing Treatment',
    desc: 'Formaldehyde-free organic keratin formula that seals cuticle pores, eliminates 100% of frizz, and enhances mirror-like reflectivity.',
    duration: 180,
    price: 350,
    img: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80',
    featured: 1,
    bestSeller: 0
  },
  {
    id: 'srv_hair_05',
    cat: 'HAIR',
    name: 'Full Color Transformation & Scalp Shield',
    desc: 'Ammonia-free rich pigment application with scalp-protective lipid serum and antioxidant color-locking treatment.',
    duration: 120,
    price: 195,
    img: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=800&q=80',
    featured: 0,
    bestSeller: 0
  },

  // SKIN & FACIAL
  {
    id: 'srv_skin_01',
    cat: 'SKIN',
    name: 'Signature Hydra-Infusion Glass Facial',
    desc: 'Triple-vortex gentle extraction, lactic acid resurfacing, micro-current facial lift, and chilled hyaluronic antioxidant infusion.',
    duration: 75,
    price: 210,
    img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    featured: 1,
    bestSeller: 1
  },
  {
    id: 'srv_skin_02',
    cat: 'SKIN',
    name: '24K Gold Cellular Anti-Aging Elixir',
    desc: 'Firming peptide sheet mask saturated with colloidal 24K gold, followed by lymphatic drainage massage with cool jade rollers.',
    duration: 90,
    price: 260,
    img: 'https://images.unsplash.com/photo-1512290900672-1f55b99a5382?auto=format&fit=crop&w=800&q=80',
    featured: 1,
    bestSeller: 0
  },
  {
    id: 'srv_skin_03',
    cat: 'SKIN',
    name: 'Deep Pore Enzymatic Purification',
    desc: 'Targeted decongestion facial featuring ultrasonic desincrustation, calming azulene compress, and blue LED light therapy.',
    duration: 60,
    price: 155,
    img: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
    featured: 0,
    bestSeller: 0
  },
  {
    id: 'srv_skin_04',
    cat: 'SKIN',
    name: 'Diamond Micro-Dermabrasion Polishing',
    desc: 'Precision diamond-tip exfoliation to diminish fine lines, sun spots, and uneven texture, finished with peptide misting.',
    duration: 60,
    price: 180,
    img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    featured: 0,
    bestSeller: 0
  },
  {
    id: 'srv_skin_05',
    cat: 'SKIN',
    name: 'Luminescent Bridal Skincare Prep',
    desc: 'Intensive brightening ritual featuring stabilized Vitamin C, oxygen spray therapy, and neck & décolleté rejuvenation.',
    duration: 90,
    price: 245,
    img: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80',
    featured: 1,
    bestSeller: 1
  },

  // MAKEUP
  {
    id: 'srv_mu_01',
    cat: 'MAKEUP',
    name: 'Haute Bridal Makeup & Airbrush Glow',
    desc: 'Flawless 16-hour sweat-resistant bridal complexion, bespoke lash layering, waterproof lip contouring, and bridal touch-up kit.',
    duration: 90,
    price: 295,
    img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
    featured: 1,
    bestSeller: 1
  },
  {
    id: 'srv_mu_02',
    cat: 'MAKEUP',
    name: 'Gala & Evening Party Glamour',
    desc: 'Sophisticated smoky or radiant eye artistry, satin luminous skin, tailored contouring, and long-wear velvety lip finish.',
    duration: 60,
    price: 160,
    img: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=800&q=80',
    featured: 0,
    bestSeller: 1
  },
  {
    id: 'srv_mu_03',
    cat: 'MAKEUP',
    name: 'Engagement & Romantic Celebration Look',
    desc: 'Soft ethereal pastels, romantic dewy highlight, feathered brow styling, and natural flutter lashes for intimate celebrations.',
    duration: 75,
    price: 190,
    img: 'https://images.unsplash.com/photo-1503236823255-94609f598e71?auto=format&fit=crop&w=800&q=80',
    featured: 0,
    bestSeller: 0
  },
  {
    id: 'srv_mu_04',
    cat: 'MAKEUP',
    name: 'High-Definition Editorial Photoshoot Artistry',
    desc: 'Studio-light calibrated camera makeup designed for high-resolution photography, editorial campaigns, and video production.',
    duration: 90,
    price: 230,
    img: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80',
    featured: 0,
    bestSeller: 0
  },

  // NAILS
  {
    id: 'srv_nail_01',
    cat: 'NAILS',
    name: 'Russian E-File Manicure & BIAB Gel',
    desc: 'Meticulous dry cuticle treatment, builder-in-a-bottle (BIAB) apex reinforcement, and mirror-gloss gel finish with 4-week durability.',
    duration: 75,
    price: 95,
    img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
    featured: 1,
    bestSeller: 1
  },
  {
    id: 'srv_nail_02',
    cat: 'NAILS',
    name: 'Champagne Spa Pedicure & Hot Stone Massage',
    desc: 'Warm milk and organic rose petal foot bath, glycolic heel polish, deeply soothing basalt hot stone foot and calf massage.',
    duration: 60,
    price: 110,
    img: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80',
    featured: 0,
    bestSeller: 0
  },
  {
    id: 'srv_nail_03',
    cat: 'NAILS',
    name: 'Artisan Sculpted Gel Extensions & Chrome',
    desc: 'Tailored form-fitted sculpting with odorless hard gel, bespoke French ombre fade, or fine chrome glazed finish.',
    duration: 105,
    price: 145,
    img: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
    featured: 1,
    bestSeller: 0
  },

  // BEAUTY & GROOMING
  {
    id: 'srv_groom_01',
    cat: 'GROOMING',
    name: 'Architectural Brow Sculpt & Tinting',
    desc: 'Facial proportion mapping, organic cotton thread shaping, gentle tweezers detailing, and botanical henna hybrid tint.',
    duration: 40,
    price: 65,
    img: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80',
    featured: 0,
    bestSeller: 1
  },
  {
    id: 'srv_groom_02',
    cat: 'GROOMING',
    name: 'Full Body Silk Sugar Polish & Hydration',
    desc: 'Whipped brown sugar and sweet almond oil whole-body exfoliation followed by warm shea butter cocoon envelope.',
    duration: 75,
    price: 175,
    img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    featured: 0,
    bestSeller: 0
  },
  {
    id: 'srv_groom_03',
    cat: 'GROOMING',
    name: 'Luxury Lycon Hot Wax Experience',
    desc: 'Virtually painless Australian Lycon lavender hot wax with calming chamomile pre-wax oil and soothing tea tree lotion.',
    duration: 50,
    price: 90,
    img: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=800&q=80',
    featured: 0,
    bestSeller: 0
  }
];

const insertService = db.prepare(`
  INSERT OR REPLACE INTO services (id, salon_id, name, description, duration_mins, price, currency, category, image_url, is_featured, is_best_seller, status, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, 'USD', ?, ?, ?, ?, 'ACTIVE', ?, ?)
`);

for (const s of servicesData) {
  insertService.run(s.id, defaultSalonId, s.name, s.desc, s.duration, s.price, s.cat, s.img, s.featured, s.bestSeller, now, now);
}

// 6. Packages
const packagesData = [
  {
    id: 'pkg_01',
    name: 'The Sovereign Bridal Crown Experience',
    slug: 'sovereign-bridal-crown',
    subtitle: 'The pinnacle wedding day sanctuary for the discerning bride',
    desc: 'A complete private-suite beauty sanctuary combining high-definition bridal airbrush makeup, couture hair artistry, champagne luxury pedicure, veil placement, and full day-of touchup concierge.',
    duration: 270,
    origPrice: 790,
    price: 650,
    badge: 'Signature Experience',
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
    includes: JSON.stringify([
      'Private VIP bridal suite reservation with champagne and fresh pastries',
      'Haute couture bridal hair styling with veil & tiara anchoring',
      '16-hour waterproof luxury airbrush makeup & handmade mink lashes',
      'Hydra-infusion skin radiance flash treatment',
      'Russian e-file manicure & champagne pedicure with 24K gold foil',
      'Luxury bridal emergency kit (lipstick, powder, setting mist, pins)'
    ])
  },
  {
    id: 'pkg_02',
    name: 'Pre-Bridal Radiance 3-Day Journey',
    slug: 'pre-bridal-radiance-journey',
    subtitle: 'Structured skin & hair preparation for unforgettable wedding photos',
    desc: 'Scheduled 1 to 2 weeks prior to vows. Prepares the skin barrier, enhances hair luminosity, and ensures deep cellular hydration for impeccable natural glow.',
    duration: 240,
    origPrice: 620,
    price: 495,
    badge: 'Most Popular',
    img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80',
    includes: JSON.stringify([
      'Signature Hydra-Infusion deep pore glass facial',
      'Full body organic sugar polish & warm shea butter massage',
      'Caviar & collagen hair molecular restoration treatment',
      'Bespoke architectural brow tint & sculpting',
      'Deluxe nail restoration and Japanese gel polish'
    ])
  },
  {
    id: 'pkg_03',
    name: 'Evening Gala & Red Carpet Ready',
    slug: 'evening-gala-red-carpet-ready',
    subtitle: 'Step into the spotlight with total confidence and timeless sophistication',
    desc: 'An expedited 2-stylist luxury turnaround. Designed for red carpets, galas, and momentous celebrations.',
    duration: 150,
    origPrice: 380,
    price: 310,
    badge: 'Evening Favorite',
    img: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=1000&q=80',
    includes: JSON.stringify([
      'Voluminous red-carpet blowout or modern chignon updo',
      'High-glamour evening makeup with customized individual lashes',
      'Quick-drying gel flash manicure with high-shine top coat',
      'Champagne glass and artisanal macarons during treatment'
    ])
  },
  {
    id: 'pkg_04',
    name: 'Maison Bespoke Custom Ritual',
    slug: 'maison-bespoke-custom-ritual',
    subtitle: 'Curate your own afternoon of personal transformation',
    desc: 'Select any three signature treatments with consultation by our Senior Creative Director, complemented by bespoke herbal teas and personalized take-home skincare vial.',
    duration: 180,
    origPrice: 450,
    price: 375,
    badge: 'Custom Tailored',
    img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
    includes: JSON.stringify([
      'One bespoke hair therapy (Cut & Style or Caviar Spa)',
      'One clinical facial (Hydra-Infusion or 24K Gold)',
      'One nail experience (Russian E-File or Champagne Spa Pedicure)',
      'Customized post-treatment homecare regimen plan'
    ])
  }
];

const insertPackage = db.prepare(`
  INSERT OR REPLACE INTO packages (id, salon_id, name, slug, subtitle, description, duration_mins, original_price, price, currency, includes, badge, image_url, is_featured, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'USD', ?, ?, ?, 1, ?, ?)
`);

for (const p of packagesData) {
  insertPackage.run(p.id, defaultSalonId, p.name, p.slug, p.subtitle, p.desc, p.duration, p.origPrice, p.price, p.includes, p.badge, p.img, now, now);
}

// 7. Gallery Items (with Before/After)
const galleryData = [
  {
    id: 'gal_01',
    title: 'Warm Honey Lived-in Balayage',
    cat: 'HAIR',
    img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=900&q=80',
    desc: 'Seamless dimensional blonde transition on natural dark base.',
    stylist: 'Clara Dubois'
  },
  {
    id: 'gal_02',
    title: 'Haute Bridal Airbrush Glamour',
    cat: 'MAKEUP',
    img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
    desc: 'Dewy glass skin, champagne gold lids, and sculpted soft rose lips.',
    stylist: 'Elena Rostova'
  },
  {
    id: 'gal_03',
    title: 'Haute French Minimalist Nail Art',
    cat: 'NAILS',
    img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80',
    desc: 'Clean Russian e-file cuticle detailing with micro-gold leaf accents.',
    stylist: 'Amara Laurent'
  },
  {
    id: 'gal_04',
    title: 'Maison SoHo Sanctuary Lounge',
    cat: 'INTERIOR',
    img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80',
    desc: 'Champagne stone, curved Italian velvet seating, and serene ambient lighting.',
    stylist: 'Maison Architects'
  },
  {
    id: 'gal_05',
    title: 'Brunette to Platinum Blonde Metamorphosis',
    cat: 'BEFORE_AFTER',
    img: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=900&q=80',
    beforeImg: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=80',
    afterImg: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=900&q=80',
    desc: 'Nine-hour single day bond-protected platinum transformation without structural breakage.',
    stylist: 'Clara Dubois'
  },
  {
    id: 'gal_06',
    title: 'Frizzed Wave to Glass Silk Keratin Finish',
    cat: 'BEFORE_AFTER',
    img: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=900&q=80',
    beforeImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
    afterImg: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=900&q=80',
    desc: 'Complete cuticle alignment providing 6 months of humidity-resistant shine.',
    stylist: 'Marcus Vance'
  },
  {
    id: 'gal_07',
    title: 'Gala Red Carpet Smokey Radiance',
    cat: 'MAKEUP',
    img: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=900&q=80',
    desc: 'Velvet plum shadow with satin skin for Met Gala attendee.',
    stylist: 'Elena Rostova'
  },
  {
    id: 'gal_08',
    title: 'Glass Skin Hydra-Infusion Result',
    cat: 'BEFORE_AFTER',
    img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80',
    beforeImg: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80',
    afterImg: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80',
    desc: 'Immediate reduction in erythema and marked improvement in dermal light bounce.',
    stylist: 'Sofia Chen'
  }
];

const insertGallery = db.prepare(`
  INSERT OR REPLACE INTO gallery_items (id, salon_id, title, category, image_url, before_image_url, after_image_url, description, stylist_name, is_featured, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
`);

for (const g of galleryData) {
  insertGallery.run(g.id, defaultSalonId, g.title, g.cat, g.img, g.beforeImg ?? null, g.afterImg ?? null, g.desc, g.stylist, now, now);
}

// 8. Special Offers
const offersData = [
  {
    id: 'off_01',
    code: 'FIRSTLUXE',
    title: 'First-Visit Welcome Privilege',
    desc: 'Enjoy an exclusive 20% privilege credit on your debut service appointment at Aegis Maison.',
    discount: 20,
    valid: 'Ongoing 2026',
    isFirst: 1
  },
  {
    id: 'off_02',
    code: 'CHAMPAGNEGLOW',
    title: 'Bridal Party Champagne Upgrade',
    desc: 'Complimentary vintage champagne reception & botanical scalp massages for bridal parties of 3 or more.',
    discount: 15,
    valid: 'Valid thru Dec 2026',
    isFirst: 0
  },
  {
    id: 'off_03',
    code: 'HYDRASUMMER',
    title: 'Midweek Dermal Renewal',
    desc: 'Book any Facial treatment Tuesday through Thursday and receive a complimentary Neck & Eye Microcurrent lift.',
    discount: 25,
    valid: 'Limited Availability',
    isFirst: 0
  }
];

const insertOffer = db.prepare(`
  INSERT OR REPLACE INTO special_offers (id, salon_id, code, title, description, discount_percent, valid_until, is_first_visit, is_active, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
`);

for (const o of offersData) {
  insertOffer.run(o.id, defaultSalonId, o.code, o.title, o.desc, o.discount, o.valid, o.isFirst, now, now);
}

// 9. Appointments (initial seed for demonstration in dashboard)
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(10, 0, 0, 0);

const apt1Start = tomorrow.getTime();
const apt1End = apt1Start + 60 * 60 * 1000;

const apt2Start = tomorrow.getTime() + 2 * 60 * 60 * 1000;
const apt2End = apt2Start + 90 * 60 * 1000;

db.prepare(`
  INSERT OR REPLACE INTO appointments (id, consumer_id, stylist_id, service_id, package_id, salon_id, customer_name, customer_email, customer_phone, booking_notes, start_time, end_time, status, total_price, created_at, updated_at)
  VALUES 
    ('apt_demo_01', 'usr_admin_01', 'sty_01', 'srv_hair_01', NULL, ?, 'Lady Genevieve Sterling', 'genevieve@sterling.com', '+1 (555) 345-9812', 'Prefers quiet appointment, champagne upon arrival.', ?, ?, 'CONFIRMED', 135, ?, ?),
    ('apt_demo_02', NULL, 'sty_03', 'srv_skin_01', NULL, ?, 'Audrey Dupont', 'audrey.dupont@vogue.fr', '+1 (555) 762-1190', 'Preparing for gala red carpet tomorrow evening.', ?, ?, 'CONFIRMED', 210, ?, ?)
`).run(defaultSalonId, apt1Start, apt1End, now, now, defaultSalonId, apt2Start, apt2End, now, now);

// 10. Sample Customer Inquiries
db.prepare(`
  INSERT OR REPLACE INTO customer_inquiries (id, salon_id, name, email, phone, subject, message, status, created_at, updated_at)
  VALUES 
    ('inq_01', ?, 'Charlotte Laurent', 'charlotte@laurent.co', '+1 (555) 912-3841', 'Private Bridal Suite Booking for 6 Bridesmaids', 'Hello, we are planning a September wedding in SoHo and would love to reserve the entire suite for hair and makeup. Could you kindly share your group availability and catering options?', 'UNREAD', ?, ?),
    ('inq_02', ?, 'Victoria Kensington', 'vkensington@luxurygroup.com', '+1 (555) 888-2309', 'Keratin & Color Formulation Inquiry', 'I recently had partial highlights in London and want to confirm if your French Balayage glaze is compatible with Olaplex. Thank you!', 'UNREAD', ?, ?)
`).run(defaultSalonId, now, now, defaultSalonId, now, now);

console.log("Database seeded successfully with luxury salon assets!");

