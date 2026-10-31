/**
 * Sreemantha Hospital Platform - Asset Processing & Database Seed Pipeline
 * Converts all hospital and blog images to WebP, generates insurance partner WebP assets,
 * and updates MySQL database collections (blog_posts, doctors, specialties, treatments, facilities, insurance).
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { query } = require('../src/config/db');

const ROOT_DIR = path.resolve(__dirname, '../..');
const FRONTEND_PUBLIC = path.resolve(ROOT_DIR, 'frontend/public');
const BACKEND_UPLOADS = path.resolve(__dirname, '../uploads');

// Directories
const DIRS = [
  path.join(FRONTEND_PUBLIC, 'images'),
  path.join(FRONTEND_PUBLIC, 'images/blogs'),
  path.join(FRONTEND_PUBLIC, 'images/insurance'),
  BACKEND_UPLOADS,
  path.join(BACKEND_UPLOADS, 'insurance'),
];

DIRS.forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

async function convertPngToWebp(srcPath, destPaths, options = { quality: 90 }) {
  if (!fs.existsSync(srcPath)) {
    console.error(`Source file not found: ${srcPath}`);
    return null;
  }
  const meta = await sharp(srcPath).metadata();
  const buffer = await sharp(srcPath).webp(options).toBuffer();
  for (const dest of destPaths) {
    fs.writeFileSync(dest, buffer);
  }
  console.log(`Converted: ${path.basename(srcPath)} -> ${destPaths.map(p => path.basename(p)).join(', ')} (${meta.width}x${meta.height})`);
  return { width: meta.width, height: meta.height, size: buffer.length };
}

async function convertPngWithCrop(srcPath, destPaths, cropOptions) {
  if (!fs.existsSync(srcPath)) return null;
  const buffer = await sharp(srcPath)
    .resize(cropOptions.width, cropOptions.height, { fit: 'cover', position: cropOptions.position || 'center' })
    .webp({ quality: 90 })
    .toBuffer();
  for (const dest of destPaths) {
    fs.writeFileSync(dest, buffer);
  }
  console.log(`Cropped & Converted: ${path.basename(srcPath)} -> ${destPaths.map(p => path.basename(p)).join(', ')} (${cropOptions.width}x${cropOptions.height})`);
  return { width: cropOptions.width, height: cropOptions.height, size: buffer.length };
}

async function processHospitalImages() {
  console.log('--- Processing Main Hospital Facility Images ---');
  
  // 1. Exterior
  await convertPngToWebp(
    path.join(ROOT_DIR, 'hospital-exterior-front-building-image.png'),
    [
      path.join(FRONTEND_PUBLIC, 'images/hospital-exterior.webp'),
      path.join(BACKEND_UPLOADS, 'hospital-exterior.webp'),
    ]
  );
  await convertPngWithCrop(
    path.join(ROOT_DIR, 'hospital-exterior-front-building-image.png'),
    [
      path.join(FRONTEND_PUBLIC, 'images/hospital-exterior-banner.webp'),
      path.join(BACKEND_UPLOADS, 'hospital-exterior-banner.webp'),
    ],
    { width: 1920, height: 1080 }
  );

  // 2. Incubator NICU
  await convertPngToWebp(
    path.join(ROOT_DIR, 'incubator-room-with-babies-and-nurses-attending-them.png'),
    [
      path.join(FRONTEND_PUBLIC, 'images/incubator-nicu.webp'),
      path.join(BACKEND_UPLOADS, 'incubator-nicu.webp'),
    ]
  );
  await convertPngWithCrop(
    path.join(ROOT_DIR, 'incubator-room-with-babies-and-nurses-attending-them.png'),
    [
      path.join(FRONTEND_PUBLIC, 'images/incubator-nicu-card.webp'),
      path.join(BACKEND_UPLOADS, 'incubator-nicu-card.webp'),
    ],
    { width: 800, height: 600 }
  );

  // 3. Official brand logo
  // The approved logo variants are versioned at:
  //   frontend/public/images/sreemantha-brand-logo*.webp
  //   backend/uploads/sreemantha-brand-logo*.webp
  // They are generated from the official high-resolution brand artwork and
  // must not be re-encoded by this facility-image pipeline.

  // 4. Operation Theatre
  await convertPngToWebp(
    path.join(ROOT_DIR, 'operation-theatre-with-equipments.png'),
    [
      path.join(FRONTEND_PUBLIC, 'images/operation-theatre.webp'),
      path.join(BACKEND_UPLOADS, 'operation-theatre.webp'),
    ]
  );
  await convertPngWithCrop(
    path.join(ROOT_DIR, 'operation-theatre-with-equipments.png'),
    [
      path.join(FRONTEND_PUBLIC, 'images/operation-theatre-card.webp'),
      path.join(BACKEND_UPLOADS, 'operation-theatre-card.webp'),
    ],
    { width: 800, height: 600 }
  );

  console.log('--- Processing 8 Blog Images ---');
  const blogList = [
    {
      file: 'blog-you-trust-we-care.png',
      slug: 'you-trust-we-care',
      out: 'blog-you-trust-we-care.webp',
    },
    {
      file: 'blog-let-wonderful-things-happen.png',
      slug: 'let-wonderful-things-happen',
      out: 'blog-let-wonderful-things-happen.webp',
    },
    {
      file: 'blog-happiness-is-earing-your-babys-first-cry.png',
      slug: 'happiness-is-hearing-babys-first-cry',
      out: 'blog-baby-first-cry.webp',
    },
    {
      file: 'blog-for-us-every-child-birth-is-special-and-memorable.png',
      slug: 'every-child-birth-is-special-and-memorable',
      out: 'blog-childbirth-special-memorable.webp',
    },
    {
      file: 'blog-follow-your-babys-cues.png',
      slug: 'follow-your-babys-cues',
      out: 'blog-follow-baby-cues.webp',
    },
    {
      file: 'blog-fertility-impacts-men&-women-of-all-ages.png',
      slug: 'fertility-impacts-men-and-women-all-ages',
      out: 'blog-fertility-all-ages.webp',
    },
    {
      file: 'blog-embrace-good-health&-happiness-for-your-child.png',
      slug: 'embrace-good-health-happiness-for-child',
      out: 'blog-embrace-health-happiness.webp',
    },
    {
      file: 'blog-beat-male-infertility-become-a-father.png',
      slug: 'beat-male-infertility-become-a-father',
      out: 'blog-beat-male-infertility.webp',
    },
  ];

  for (const b of blogList) {
    const src = path.join(ROOT_DIR, b.file);
    await convertPngToWebp(src, [
      path.join(FRONTEND_PUBLIC, 'images/blogs', b.out),
      path.join(BACKEND_UPLOADS, b.out),
    ]);
  }
}

// 24 Insurance Partners
const INSURANCE_PARTNERS = [
  {
    name: 'Aditya Birla Health Insurance',
    slogan: '',
    bgColor: '#ffffff',
    primaryColor: '#8a1538',
    secondaryColor: '#f37021',
    symbol: 'SUNRISE',
    slug: 'aditya-birla-health',
  },
  {
    name: 'SBI General Insurance',
    slogan: 'Suraksha Aur Bharosa Dono',
    bgColor: '#ffffff',
    primaryColor: '#003366',
    secondaryColor: '#00a3e0',
    symbol: 'SBI_KEYHOLE',
    slug: 'sbi-general-insurance',
  },
  {
    name: 'ICICI Lombard',
    slogan: 'Nibhaye Vaade',
    bgColor: '#ffffff',
    primaryColor: '#8f191d',
    secondaryColor: '#ea6d20',
    symbol: 'ICICI_I',
    slug: 'icici-lombard',
  },
  {
    name: 'Acko General Insurance',
    slogan: '',
    bgColor: '#ffffff',
    primaryColor: '#532cd4',
    secondaryColor: '#12b76a',
    symbol: 'ACKO_CIRCLE',
    slug: 'acko-general-insurance',
  },
  {
    name: 'Bajaj Allianz',
    slogan: 'General Insurance',
    bgColor: '#ffffff',
    primaryColor: '#003a70',
    secondaryColor: '#f37021',
    symbol: 'BAJAJ_SHIELD',
    slug: 'bajaj-allianz',
  },
  {
    name: 'Star Health and Allied Insurance',
    slogan: 'The Health Insurance Specialist',
    bgColor: '#ffffff',
    primaryColor: '#00753a',
    secondaryColor: '#2b9d5c',
    symbol: 'STAR_HEALTH',
    slug: 'star-health',
  },
  {
    name: 'Reliance General Insurance',
    slogan: 'Anil Dhirubhai Ambani Group',
    bgColor: '#ffffff',
    primaryColor: '#003b7a',
    secondaryColor: '#ed1c24',
    symbol: 'RELIANCE_R',
    slug: 'reliance-general-insurance',
  },
  {
    name: 'Max Bupa Health Insurance',
    slogan: 'Niva Bupa Health Insurance',
    bgColor: '#ffffff',
    primaryColor: '#f15a24',
    secondaryColor: '#0072bc',
    symbol: 'BUPA_HEART',
    slug: 'max-bupa-niva',
  },
  {
    name: 'IFFCO-TOKIO General Insurance',
    slogan: 'Muskurate Raho',
    bgColor: '#ffffff',
    primaryColor: '#104f9e',
    secondaryColor: '#ed1b24',
    symbol: 'IFFCO_LEAF',
    slug: 'iffco-tokio',
  },
  {
    name: 'Safeway Insurance TPA Pvt. Ltd.',
    slogan: 'TPA Support',
    bgColor: '#ffffff',
    primaryColor: '#0a4275',
    secondaryColor: '#28a745',
    symbol: 'CROSS_SHIELD',
    slug: 'safeway-tpa',
  },
  {
    name: 'Care Health Insurance',
    slogan: 'Health Hamesha',
    bgColor: '#ffffff',
    primaryColor: '#00787e',
    secondaryColor: '#e31e24',
    symbol: 'CARE_CROSS',
    slug: 'care-health',
  },
  {
    name: 'Tata AIG General Insurance',
    slogan: 'With You Always',
    bgColor: '#ffffff',
    primaryColor: '#004c8f',
    secondaryColor: '#0072ce',
    symbol: 'TATA_PEAK',
    slug: 'tata-aig',
  },
  {
    name: 'Ericson Insurance TPA Pvt. Ltd.',
    slogan: 'Third Party Administrator',
    bgColor: '#ffffff',
    primaryColor: '#005b96',
    secondaryColor: '#6497b1',
    symbol: 'ERICSON_E',
    slug: 'ericson-tpa',
  },
  {
    name: 'Liberty General Insurance',
    slogan: 'Liberty Mutual Insurance',
    bgColor: '#ffffff',
    primaryColor: '#002664',
    secondaryColor: '#ffc72c',
    symbol: 'LIBERTY_TORCH',
    slug: 'liberty-general',
  },
  {
    name: 'Religare Health Insurance',
    slogan: 'Care Health Insurance / Adv Health Hamesha',
    bgColor: '#ffffff',
    primaryColor: '#00787e',
    secondaryColor: '#f26522',
    symbol: 'RELIGARE_CLOVER',
    slug: 'religare-health',
  },
  {
    name: 'Future Generali Total Insurance',
    slogan: 'Total Insurance Solutions',
    bgColor: '#ffffff',
    primaryColor: '#c3002f',
    secondaryColor: '#8a0022',
    symbol: 'GENERALI_LION',
    slug: 'future-generali',
  },
  {
    name: 'Genins India Insurance TPA LTD',
    slogan: 'National TPA Network',
    bgColor: '#ffffff',
    primaryColor: '#1d3557',
    secondaryColor: '#457b9d',
    symbol: 'GENINS_CADUCEUS',
    slug: 'genins-tpa',
  },
  {
    name: 'Navi Insurance',
    slogan: 'Digital Health Cover',
    bgColor: '#ffffff',
    primaryColor: '#00263e',
    secondaryColor: '#00d68f',
    symbol: 'NAVI_N',
    slug: 'navi-insurance',
  },
  {
    name: 'Paramount Health Care',
    slogan: 'Paramount TPA Services',
    bgColor: '#ffffff',
    primaryColor: '#023e8a',
    secondaryColor: '#0077b6',
    symbol: 'PARAMOUNT_P',
    slug: 'paramount-tpa',
  },
  {
    name: 'MD India Health Insurance TPA',
    slogan: 'Healthcare TPA Pioneer',
    bgColor: '#ffffff',
    primaryColor: '#1b4332',
    secondaryColor: '#2d6a4f',
    symbol: 'MDINDIA_CROSS',
    slug: 'md-india-tpa',
  },
  {
    name: 'Vidal Health',
    slogan: 'Third Party Administrator',
    bgColor: '#ffffff',
    primaryColor: '#005f73',
    secondaryColor: '#0a9396',
    symbol: 'VIDAL_V',
    slug: 'vidal-health-tpa',
  },
  {
    name: 'Heritage Health (KH)',
    slogan: 'Heritage Health TPA',
    bgColor: '#ffffff',
    primaryColor: '#3d0c02',
    secondaryColor: '#8b0000',
    symbol: 'HERITAGE_H',
    slug: 'heritage-health-tpa',
  },
  {
    name: 'ManipalCigna Health Insurance',
    slogan: 'Health Ka Saath',
    bgColor: '#ffffff',
    primaryColor: '#c9252c',
    secondaryColor: '#00838f',
    symbol: 'MANIPAL_TREE',
    slug: 'manipal-cigna',
  },
  {
    name: 'Apollo Munich Health Insurance',
    slogan: 'Let\'s Uncomplicate',
    bgColor: '#ffffff',
    primaryColor: '#004b87',
    secondaryColor: '#d6001c',
    symbol: 'APOLLO_FLAME',
    slug: 'apollo-munich',
  },
];

function generateInsuranceSvg(partner) {
  const { name, slogan, primaryColor, secondaryColor, symbol } = partner;
  
  // Icon generation based on symbol
  let iconSvg = '';
  if (symbol === 'STAR_HEALTH') {
    iconSvg = `
      <polygon points="40,16 47,31 64,33 51,46 55,62 40,54 25,62 29,46 16,33 33,31" fill="${primaryColor}" />
      <polygon points="40,24 44,34 54,35 46,43 49,53 40,48 31,53 34,43 26,35 36,34" fill="#ffffff" />
    `;
  } else if (symbol === 'SBI_KEYHOLE') {
    iconSvg = `
      <circle cx="40" cy="40" r="26" fill="${primaryColor}" />
      <circle cx="40" cy="40" r="10" fill="#ffffff" />
      <rect x="36" y="40" width="8" height="26" fill="#ffffff" />
    `;
  } else if (symbol === 'ICICI_I') {
    iconSvg = `
      <rect x="18" y="16" width="44" height="48" rx="8" fill="${primaryColor}" />
      <circle cx="40" cy="27" r="5" fill="#f1a94e" />
      <rect x="36" y="37" width="8" height="20" rx="3" fill="#ffffff" />
      <path d="M30,37 Q40,48 50,37" stroke="#f1a94e" stroke-width="3" fill="none" />
    `;
  } else if (symbol === 'BAJAJ_SHIELD') {
    iconSvg = `
      <path d="M40,14 L62,24 C62,48 40,64 40,64 C40,64 18,48 18,24 Z" fill="${primaryColor}" />
      <path d="M40,22 L54,29 C54,46 40,57 40,57 Z" fill="${secondaryColor}" />
    `;
  } else if (symbol === 'TATA_PEAK') {
    iconSvg = `
      <rect x="16" y="16" width="48" height="48" rx="10" fill="${primaryColor}" />
      <path d="M26,52 L40,24 L54,52 Z" fill="none" stroke="#ffffff" stroke-width="4" stroke-linejoin="round" />
      <line x1="30" y1="44" x2="50" y2="44" stroke="#ffffff" stroke-width="3" />
    `;
  } else if (symbol === 'CARE_CROSS' || symbol === 'CROSS_SHIELD') {
    iconSvg = `
      <rect x="16" y="16" width="48" height="48" rx="12" fill="${primaryColor}" />
      <rect x="35" y="24" width="10" height="32" rx="2" fill="#ffffff" />
      <rect x="24" y="35" width="32" height="10" rx="2" fill="#ffffff" />
      <circle cx="40" cy="40" r="4" fill="${secondaryColor}" />
    `;
  } else if (symbol === 'SUNRISE') {
    iconSvg = `
      <rect x="16" y="16" width="48" height="48" rx="10" fill="${primaryColor}" />
      <circle cx="40" cy="48" r="18" fill="${secondaryColor}" />
      <path d="M40,20 L40,28 M22,34 L28,38 M58,34 L52,38" stroke="#ffffff" stroke-width="3" stroke-linecap="round" />
    `;
  } else {
    // Default elegant medical trust emblem
    const initial = name.charAt(0);
    iconSvg = `
      <rect x="16" y="16" width="48" height="48" rx="12" fill="${primaryColor}" />
      <circle cx="40" cy="40" r="18" fill="none" stroke="${secondaryColor}" stroke-width="2.5" />
      <text x="40" y="46" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="900" fill="#ffffff" text-anchor="middle">${initial}</text>
    `;
  }

  // Format title and optional slogan text
  const cleanTitle = name.replace(/\(.*?\)/g, '').trim();
  const titleLines = cleanTitle.length > 22 ? [cleanTitle.slice(0, 20) + '…'] : [cleanTitle];

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 88" width="340" height="88">
      <defs>
        <filter id="card-shadow" x="-5%" y="-5%" width="110%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.06"/>
        </filter>
      </defs>
      <rect x="2" y="2" width="336" height="84" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="url(#card-shadow)" />
      
      <!-- Logo Symbol -->
      <g transform="translate(6, 4)">
        ${iconSvg}
      </g>
      
      <!-- Text details -->
      <g transform="translate(86, 0)">
        <text x="0" y="38" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14.5" font-weight="700" fill="#0f172a" letter-spacing="-0.2px">
          ${titleLines[0]}
        </text>
        <text x="0" y="58" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="${primaryColor}" opacity="0.9">
          ${slogan ? slogan : 'Accepted Cashless &amp; TPA Partner'}
        </text>
      </g>
      
      <!-- Verified Badge Tag -->
      <g transform="translate(290, 14)">
        <circle cx="12" cy="12" r="10" fill="#ecfdf5" />
        <path d="M7 12 l3 3 l7 -7" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </g>
    </svg>
  `;
}

async function generateAllInsuranceWebp() {
  console.log('--- Generating 24 Insurance Partner WebP Badges ---');
  for (const partner of INSURANCE_PARTNERS) {
    const svgStr = generateInsuranceSvg(partner);
    const svgBuffer = Buffer.from(svgStr);
    const filename = `${partner.slug}.webp`;

    const publicPath = path.join(FRONTEND_PUBLIC, 'images/insurance', filename);
    const uploadsPath = path.join(BACKEND_UPLOADS, 'insurance', filename);

    await sharp(svgBuffer).webp({ quality: 95, lossless: false }).toFile(publicPath);
    fs.copyFileSync(publicPath, uploadsPath);
    console.log(`Generated Insurance Badge: ${filename}`);
  }
}

async function updateDatabaseCollections() {
  console.log('--- Updating MySQL Database Collections ---');

  // 1. Doctors
  console.log('Updating doctors collection...');
  await query('DELETE FROM doctors');
  
  // Reuse high quality webp clinic images for doctors as specified by user
  await query(`
    INSERT INTO doctors (
      slug, name, designation, department, qualifications, experience_years,
      languages, short_bio, full_bio, education, certifications,
      opd_timings, photo_url, featured, display_order, status
    ) VALUES 
    (
      'dr-g-sindhu',
      'Dr. G. Sindhu (Dr. Sindhu Gundamalla)',
      'Obstetrics, Gynecology & Infertility Specialist',
      'Obstetrics, Gynecology & Infertility',
      'M.B.B.S., M.S. (OBGYN) - Osmania Medical College',
      12,
      '["Telugu", "English", "Hindi"]',
      'Specialist in high-risk pregnancies, laparoscopic gynecological surgeries, and personalized fertility therapies.',
      'Dr. G. Sindhu (డా॥ సింధు గుండమళ్ళ) is a distinguished Consultant Obstetrician, Gynecologist, and Infertility Specialist holding M.B.B.S. and M.S. (OBGYN) from the premier Osmania Medical College. With Regd. No. TSMC/FMR/03919, she is renowned across Khammam for empowering women\\'s health and enriching motherhood with evidence-based fertility solutions, painless delivery expertise, and advanced minimally invasive laparoscopy.',
      '["M.B.B.S. - Osmania Medical College, Hyderabad", "M.S. (Obstetrics & Gynecology) - Osmania Medical College", "Fellowship in Reproductive Medicine & Infertility", "Advanced Training in 3D/4K Minimal Access Gynecological Laparoscopy"]',
      '["TSMC Reg. No: TSMC/FMR/03919", "Life Member - Federation of Obstetric and Gynaecological Societies of India (FOGSI)", "Member - Indian Society for Assisted Reproduction (ISAR)"]',
      '10:00 AM - 02:00 PM & 05:00 PM - 08:00 PM',
      '/images/sreemantha-brand-logo-square.webp',
      1,
      1,
      'published'
    ),
    (
      'dr-b-v-n-krishna',
      'Dr. B. V. N. Krishna',
      'Consultant Pediatrician & Neonatologist',
      'Pediatrics & Level-III Neonatology',
      'M.B.B.S., M.D. (Pediatrics) - VMMC & SJH, Delhi',
      11,
      '["Telugu", "English", "Hindi"]',
      'Specialist in Level-III neonatal intensive care, extremely preterm baby resuscitation, and comprehensive child development.',
      'Dr. B. V. N. Krishna (డా॥ బి.వి.ఎన్. కృష్ణ) is an acclaimed Pediatrician & Neonatologist with M.B.B.S. and M.D. (Pediatrics) from the prestigious Vardhman Mahavir Medical College & Safdarjung Hospital (VMMC & SJH), New Delhi, complemented by an advanced Fellowship in Neonatology. With Regd. No. TSMC/FMR/07376, Dr. Krishna leads Sreemantha Hospital\\'s state-of-the-art 24/7 Level-III NICU, safeguarding critically ill and preterm newborns with compassionate clinical precision.',
      '["M.B.B.S. - VMMC & Safdarjung Hospital, New Delhi", "M.D. (Pediatrics) - VMMC & Safdarjung Hospital, New Delhi", "Fellowship in Advanced Neonatology (Level-III NICU)"]',
      '["TSMC Reg. No: TSMC/FMR/07376", "Member - National Neonatology Forum (NNF) India", "Member - Indian Academy of Pediatrics (IAP)"]',
      '09:00 AM - 01:00 PM & 04:00 PM - 08:00 PM (Emergency 24/7)',
      '/images/incubator-nicu-card.webp',
      1,
      2,
      'published'
    ),
    (
      'dr-g-latha',
      'Dr. G. Latha',
      'Consultant Pediatrician & Neonatologist',
      'Pediatrics & Neonatal Care',
      'M.B.B.S., M.D. Paed. (KMC)',
      14,
      '["Telugu", "English"]',
      'Expert pediatrician dedicated to newborn care, immunizations, childhood growth, and adolescent wellness.',
      'Dr. G. Latha is a respected Pediatrician and Neonatologist holding M.B.B.S. and M.D. in Pediatrics from Kakatiya Medical College (KMC), registered under TSMC/FMR/05781. She brings extensive experience in pediatric clinical management, preventive child healthcare, and neonatal monitoring to Sreemantha Hospital.',
      '["M.B.B.S. - Kakatiya Medical College", "M.D. (Pediatrics) - Kakatiya Medical College (KMC)"]',
      '["TSMC Reg. No: TSMC/FMR/05781", "Member - Indian Academy of Pediatrics (IAP)"]',
      '10:30 AM - 01:30 PM & 05:30 PM - 07:30 PM',
      '/images/operation-theatre-card.webp',
      1,
      3,
      'published'
    )
  `);
  console.log('Doctors updated successfully.');

  // 2. Blog Posts
  console.log('Updating blog_posts collection with 8 real hospital posters & seed data...');
  await query('DELETE FROM blog_posts');
  
  await query(`
    INSERT INTO blog_posts (
      slug, title, category, author, read_time, summary, content,
      image_url, published_at, featured, status
    ) VALUES
    (
      'you-trust-we-care-fertility-maternity',
      'You Trust, We Care: Compassionate Fertility & Motherhood Excellence',
      'Hospital Care & Philosophy',
      'Dr. G. Sindhu (MS OBGYN)',
      '5 min read',
      'At Sreemantha Hospital, every patient\\'s trust is honored with dedicated medical excellence, empathetic clinical guidance, and personalized fertility and maternity care in Khammam.',
      '<p>Trust is the cornerstone of every healing relationship. When couples embark on their journey towards parenthood, the emotional and physical aspects require profound understanding and clinical expertise. At Sreemantha Hospital, our guiding principle is simple yet resolute: <strong>\\"You Trust, We Care\\"</strong>.</p><h3>Why Compassionate Care Matters</h3><p>From initial fertility consultations to advanced IVF and delivery, our multidisciplinary team of obstetricians, embryologists, and neonatologists walk alongside every family. We provide transparent counseling, personalized treatment protocols, and world-class cleanroom lab standards to ensure the highest success rates with maximum comfort.</p>',
      '/images/blogs/blog-you-trust-we-care.webp',
      '2026-09-20',
      1,
      'published'
    ),
    (
      'let-wonderful-things-happen-fertility-journey',
      'Let Wonderful Things Happen: Transforming Dreams of Parenthood into Reality',
      'Fertility & IVF',
      'Clinical Embryology Team',
      '6 min read',
      'Overcoming fertility challenges with modern reproductive medicine, advanced blastocyst culture, and compassionate clinical expertise.',
      '<p>Every hopeful parent\\'s dream is precious. At Sreemantha Hospital, our advanced fertility unit is engineered to make wonderful things happen for couples navigating infertility.</p><h3>Advanced Reproductive Technologies Available</h3><ul><li><strong>Class 10,000 Modular IVF Embryology Lab</strong> with HEPA and VOC filtration</li><li><strong>Intracytoplasmic Sperm Injection (ICSI)</strong> for severe male factor cases</li><li><strong>Blastocyst Culture (Day 5)</strong> for superior embryo viability and implantation</li><li><strong>Laser Assisted Hatching & Cryopreservation</strong></li></ul><p>Our dedicated fertility specialists tailor each protocol to match individual ovarian reserve, hormonal profiles, and genetic parameters.</p>',
      '/images/blogs/blog-let-wonderful-things-happen.webp',
      '2026-09-24',
      1,
      'published'
    ),
    (
      'happiness-is-hearing-babys-first-cry',
      'Happiness is Hearing Your Baby’s First Cry: What to Expect During Safe Delivery',
      'Obstetrics & Maternity',
      'Dr. G. Sindhu (MS OBGYN)',
      '5 min read',
      'The miraculous moment of childbirth: how Sreemantha Hospital ensures painless delivery, maternal safety, and immediate neonatal bonding.',
      '<p>There is no sound more joyful and reassuring in the world than a newborn baby\\'s first vigorous cry. It signifies the commencement of new life and the triumphant culmination of months of maternal care.</p><h3>Ensuring a Safe, Memorable Childbirth</h3><p>At Sreemantha Hospital, our labor and delivery suites are integrated directly with modular operating rooms and our Level-III NICU. We provide:</p><ul><li><strong>24/7 Painless Normal Delivery (Epidural Analgesia)</strong> administered by expert anesthesiologists</li><li><strong>Continuous Electronic Fetal Heart Rate Monitoring (CTG)</strong></li><li><strong>Immediate Skin-to-Skin Kangaroo Mother Care</strong> and lactation support</li><li><strong>Emergency C-Section Readiness within 15 minutes</strong> for high-risk obstetric cases</li></ul>',
      '/images/blogs/blog-baby-first-cry.webp',
      '2026-09-28',
      1,
      'published'
    ),
    (
      'every-child-birth-is-special-and-memorable',
      'For Us Every Child Birth is Special and Memorable: Personalized Maternity Suites',
      'Maternity & Labor Care',
      'Obstetric Nursing Team',
      '4 min read',
      'Celebrating every birth with dignity, warmth, and clinical precision in our modern maternity suites in Khammam.',
      '<p>Childbirth is a milestone that stays in a mother\\'s heart for lifetime. Recognizing this, Sreemantha Hospital transforms the clinical hospital experience into an empowering, celebratory journey.</p><p>Our private maternity suites are thoughtfully designed to balance clinical safety with domestic warmth. With 24/7 obstetric monitoring, dedicated nursing staff, and round-the-clock neonatologist availability, mothers and families experience absolute peace of mind.</p>',
      '/images/blogs/blog-childbirth-special-memorable.webp',
      '2026-10-01',
      0,
      'published'
    ),
    (
      'follow-your-babys-cues-neonatal-signs',
      'Follow Your Baby’s Cues: Essential Signs Every New Parent Should Recognize',
      'Pediatrics & Newborn Care',
      'Dr. B. V. N. Krishna (MD Pediatrics, Neonatologist)',
      '6 min read',
      'Dr. B. V. N. Krishna explains the vital non-verbal cues newborns use to communicate hunger, sleepiness, colic discomfort, and clinical warning signs.',
      '<p>Newborn babies communicate continuously through subtle behavioral and physical cues. Learning to read these cues helps parents respond promptly and prevents parental anxiety.</p><h3>Common Baby Cues Decoded</h3><ul><li><strong>Early Hunger Cues:</strong> Lip smacking, head turning (rooting reflex), hands brought to mouth. Crying is a late hunger cue!</li><li><strong>Sleepiness Cues:</strong> Yawning, looking away, rubbing eyes, stiffening limbs.</li><li><strong>Colic / Gas Cues:</strong> Clenched fists, pulling legs towards the tummy, arching back during or after feeding.</li></ul><h3>When to Seek Immediate Medical Evaluation</h3><p>Contact our pediatric emergency department immediately if you notice lethargy, poor sucking, breathing difficulties (chest indrawing), persistent vomiting, or body temperature above 100.4°F.</p>',
      '/images/blogs/blog-follow-baby-cues.webp',
      '2026-10-02',
      1,
      'published'
    ),
    (
      'fertility-impacts-men-and-women-all-ages',
      'Fertility Impacts Men & Women of All Ages: Breaking Infertility Myths with Science',
      'Reproductive Medicine',
      'Fertility & Andrology Specialists',
      '7 min read',
      'Infertility affects both partners equally. Discover how timely diagnostic evaluations and lifestyle modifications improve conception chances.',
      '<p>A prevalent misconception in society is that infertility is predominantly a female concern. Medical science unequivocally shows that approximately 40% of infertility factors are male-related, 40% female-related, and 20% combined or unexplained.</p><h3>Key Factors Affecting Fertility</h3><ul><li><strong>Age & Ovarian Reserve:</strong> Anti-Müllerian Hormone (AMH) and Antral Follicle Count (AFC) assessments.</li><li><strong>Sperm Quality Parameters:</strong> Semen analysis testing count, motility, and normal morphology.</li><li><strong>Lifestyle Factors:</strong> Smoking, alcohol, endocrine disruptors, obesity, and chronic stress.</li></ul><p>Early evaluation enables targeted, less invasive treatments like ovulation tracking and IUI before progressing to IVF if required.</p>',
      '/images/blogs/blog-fertility-all-ages.webp',
      '2026-10-03',
      0,
      'published'
    ),
    (
      'embrace-good-health-happiness-for-child',
      'Embrace Good Health & Happiness for Your Child: Complete Pediatric Wellness Guide',
      'Pediatrics & Child Health',
      'Dr. G. Latha (MD Paediatrics)',
      '5 min read',
      'Essential guidelines for child immunization schedules, balanced nutritional milestones, and cognitive growth from infancy to school age.',
      '<p>A healthy child is a happy child. Pediatric wellness extends beyond treating illness to proactive preventive healthcare, timely vaccinations, and balanced emotional growth.</p><h3>Key Pillars of Pediatric Wellness</h3><ul><li><strong>Immunization Adherence:</strong> Strict compliance with the Indian Academy of Pediatrics (IAP) vaccination schedule protecting against polio, measles, rotavirus, pneumococcus, and MMR.</li><li><strong>Milestone Tracking:</strong> Regular developmental assessments measuring motor skills, language acquisition, and social interaction.</li><li><strong>Nutrition & Hydration:</strong> Exclusive breastfeeding for the first 6 months, followed by wholesome age-appropriate complementary foods.</li></ul>',
      '/images/blogs/blog-embrace-health-happiness.webp',
      '2026-10-04',
      0,
      'published'
    ),
    (
      'beat-male-infertility-become-a-father',
      'Beat Male Infertility: Modern Medical Solutions to Becoming a Father',
      'Andrology & Men\\'s Health',
      'Andrology Department',
      '6 min read',
      'Exploring clinical breakthroughs in treating male infertility including lifestyle reversal, medical therapies, TESA, and ICSI.',
      '<p>Male factor infertility is increasingly prevalent due to sedentary lifestyles, environmental pollutants, and metabolic imbalances. Fortunately, modern reproductive medicine offers powerful clinical pathways for men to achieve biological fatherhood.</p><h3>Modern Treatment Options</h3><ul><li><strong>Medical Therapy:</strong> Antioxidant regimens and hormonal balance correction for oligospermia.</li><li><strong>Intracytoplasmic Sperm Injection (ICSI):</strong> Selecting a single healthy sperm for direct egg fertilization.</li><li><strong>Testicular Sperm Aspiration (TESA / PESA):</strong> Surgical sperm retrieval for obstructive azoospermia.</li></ul>',
      '/images/blogs/blog-beat-male-infertility.webp',
      '2026-10-05',
      1,
      'published'
    )
  `);
  console.log('Blog posts updated successfully.');

  // 3. Specialties
  console.log('Updating specialties collection...');
  await query('DELETE FROM specialties');
  await query(`
    INSERT INTO specialties (slug, title, category, short_description, overview, icon, image_url, conditions, display_order, status)
    VALUES
    (
      'obstetrics-high-risk-pregnancy',
      'Obstetrics & High-Risk Pregnancy Care',
      'Maternity & Fetal Care',
      'Comprehensive prenatal care, painless labor management, and 24/7 tertiary maternal-fetal critical care in Khammam.',
      'Sreemantha Hospital\\'s Obstetrics department is led by Dr. G. Sindhu (MS OBGYN, Osmania Medical College). Our dedicated labor suites and modular operating theatres are equipped for complex maternal emergencies, twins/multiple gestations, gestational diabetes, pre-eclampsia, and prior cesarean deliveries.',
      'HeartPulse',
      '/images/sreemantha-brand-logo-card.webp',
      '["High-Risk Pregnancy", "Gestational Diabetes (GDM)", "Pre-eclampsia & Hypertension", "Multiple Pregnancies (Twins/Triplets)", "Recurrent Pregnancy Loss", "Placenta Previa & Accreta"]',
      1,
      'published'
    ),
    (
      'gynecology-laparoscopic-surgery',
      'Gynecology & Advanced 3D/4K Laparoscopic Surgery',
      'Women\\'s Health',
      'Minimally invasive keyhole surgeries, fibroid removals, endometriosis excision, and complete female wellness.',
      'Advanced gynecological surgical care featuring ultra-high-definition 4K laparoscopy and hysteroscopy. Patient benefits include minimal incision scars, negligible blood loss, rapid post-op recovery, and same-day or next-day discharge.',
      'Activity',
      '/images/operation-theatre.webp',
      '["Uterine Fibroids (Myomectomy)", "Ovarian Cysts & Dermoids", "Endometriosis & Adenomyosis", "Uterine Polyps & Abnormal Bleeding", "Pelvic Organ Prolapse", "PCOS & Hormonal Imbalances"]',
      2,
      'published'
    ),
    (
      'fertility-reproductive-medicine-ivf',
      'Fertility & Reproductive Medicine (IVF / ICSI)',
      'Fertility & Andrology',
      'Class 10,000 modular embryology cleanroom, Day-5 blastocyst culture, ICSI, and individualized fertility protocols.',
      'Comprehensive fertility solutions helping couples fulfill their parenthood dreams. We combine rigorous genetic assessment, optimized ovulation stimulation, advanced sperm preparation, and meticulous embryo culture.',
      'Sparkles',
      '/images/blogs/blog-let-wonderful-things-happen.webp',
      '["Unexplained Infertility", "Low Ovarian Reserve (Low AMH)", "Blocked Fallopian Tubes", "Severe Male Infertility (Azoospermia/Oligospermia)", "Polycystic Ovary Syndrome (PCOS)", "Recurrent IVF Implantation Failure"]',
      3,
      'published'
    ),
    (
      'pediatrics-level-3-nicu',
      'Pediatrics & Level-III Neonatal Intensive Care (NICU)',
      'Neonatal & Child Health',
      '24/7 Level-III NICU with multi-zone incubators, servo-controlled warmers, high-frequency ventilators, and expert neonatologists.',
      'Led by Dr. B. V. N. Krishna (MD Pediatrics, VMMC & Safdarjung Hospital Delhi, Fellow in Neonatology), our Level-III NICU provides life-saving tertiary care for preterm infants born as early as 26 weeks, low birth weight babies, and critical neonates.',
      'Baby',
      '/images/incubator-nicu.webp',
      '["Extreme Preterm Birth (under 28-32 weeks)", "Extremely Low Birth Weight (<1000g)", "Respiratory Distress Syndrome (RDS)", "Neonatal Jaundice & Phototherapy", "Neonatal Sepsis & Critical Care", "Pediatric Growth & Developmental Delays"]',
      4,
      'published'
    )
  `);
  console.log('Specialties updated successfully.');

  // 4. Treatments
  console.log('Updating treatments collection...');
  try {
    await query('ALTER TABLE treatments MODIFY COLUMN success_rate VARCHAR(255) NULL;');
    await query('ALTER TABLE treatments MODIFY COLUMN typical_duration VARCHAR(255) NULL;');
  } catch (e) {
    // Column might already be widened
  }
  await query('DELETE FROM treatments');
  await query(`
    INSERT INTO treatments (
      slug, title, category, specialty_slug, short_description, overview,
      how_it_works, who_requires, preparation, aftercare, typical_duration,
      success_rate, image_url, featured, status
    ) VALUES
    (
      'ivf-in-vitro-fertilization-blastocyst',
      'IVF (In Vitro Fertilization) & Blastocyst Culture',
      'Fertility Care',
      'fertility-reproductive-medicine-ivf',
      'State-of-the-art fertilization in our Class 10,000 embryology cleanroom with Day-5 blastocyst transfer.',
      'In Vitro Fertilization (IVF) is the gold-standard assisted reproductive technology where eggs and sperm are fertilized in our advanced embryology lab. Embryos are cultured until the blastocyst stage (Day 5) to maximize implantation success.',
      '["1. Controlled Ovarian Stimulation: Gentle hormone injections to develop multiple mature follicles.", "2. Ultrasound-Guided Ovum Pick-Up: Painless 15-minute egg retrieval under mild sedation.", "3. Laboratory Fertilization & Culture: Precision culture in multi-zone Esco incubators to Day 5.", "4. Blastocyst Embryo Transfer: Placing the healthiest embryo into the uterine cavity under ultrasound guidance."]',
      '["Couples with bilateral blocked or damaged fallopian tubes", "Women with diminished ovarian reserve or advanced maternal age", "Couples who have experienced failed IUI cycles", "Severe endometriosis affecting egg quality or tubal motility"]',
      'Comprehensive hormonal testing (AMH, FSH, LH), baseline pelvic ultrasound, and partner semen analysis.',
      'Progesterone luteal support, avoidance of strenuous lifting for 48 hours, and pregnancy blood test after 14 days.',
      '2 to 3 weeks per cycle',
      'High cumulative pregnancy rate',
      '/images/blogs/blog-let-wonderful-things-happen.webp',
      1,
      'published'
    ),
    (
      'painless-normal-delivery-maternity',
      'Painless Normal Delivery (Labor Epidural Analgesia)',
      'Maternity Care',
      'obstetrics-high-risk-pregnancy',
      '24/7 labor epidural analgesia enabling smooth, comfortable normal vaginal delivery with continuous fetal monitoring.',
      'Painless delivery utilizes continuous labor epidural analgesia administered by experienced consultant anesthesiologists. It significantly reduces labor pain while allowing the mother to remain alert and fully in control during pushing.',
      '["1. Active Labor Assessment: Epidural is administered once labor is well established at 3-4 cm dilation.", "2. Fine Epidural Catheter Placement: Micro-dosed local anesthetic is delivered into the epidural space.", "3. Pain Relief within 10-15 Minutes: Contractions continue normally without agonizing labor pain.", "4. Monitored Normal Birth: Continuous CTG fetal heartbeat tracking ensures optimal baby oxygenation."]',
      '["Expectant mothers desiring a comfortable normal vaginal delivery", "Mothers with low pain tolerance seeking to avoid elective surgical cesareans", "Patients with mild pregnancy-induced hypertension where stress reduction is beneficial"]',
      'Pre-anesthesia checkup during the third trimester, normal coagulation profile, and informed consent.',
      'Immediate postpartum skin-to-skin bonding, initial breastfeeding within 30 minutes, and rapid mobilization within 4 hours.',
      '6 to 12 hours labor duration',
      '95%+ pain alleviation',
      '/images/sreemantha-brand-logo-card.webp',
      1,
      'published'
    ),
    (
      'level-3-nicu-preterm-care',
      'Level-III Neonatal Intensive Care (NICU)',
      'Neonatal Critical Care',
      'pediatrics-level-3-nicu',
      'Tertiary care for preterm infants, respiratory distress, low birth weight, and surgical neonates led by Dr. B. V. N. Krishna.',
      'Our Level-III NICU is the most advanced neonatal critical care facility in Khammam. Equipped with servo-controlled multi-zone incubators, LED phototherapy, continuous invasive and non-invasive cardiopulmonary monitoring, and neonatal resuscitation units.',
      '["1. Rapid Resuscitation & Golden Hour Care: Immediate specialized stabilization at delivery.", "2. Advanced Respiratory Support: Gentle CPAP, High-Frequency Ventilation, and Surfactant therapy.", "3. Total Parenteral Nutrition (TPN): Precise intravenous nutrition for premature gastrointestinal systems.", "4. Developmental Supportive Care: Noise/light control and Kangaroo Mother Care (KMC)."]',
      '["Premature infants born before 37 weeks (down to 26 weeks)", "Low birth weight babies weighing under 1500g or 1000g", "Newborns with respiratory distress, meconium aspiration, or neonatal jaundice", "Infants needing urgent neonatal medical stabilization"]',
      'Antenatal maternal corticosteroid administration when preterm delivery is anticipated.',
      'Lactation counseling for expressed breast milk, transition to Kangaroo Mother Care, and follow-up developmental pediatric clinic.',
      'Personalized neonatal stay',
      '98%+ tertiary survival rate',
      '/images/incubator-nicu.webp',
      1,
      'published'
    ),
    (
      'icsi-intracytoplasmic-sperm-injection',
      'ICSI (Intracytoplasmic Sperm Injection) & Male Fertility',
      'Fertility Care',
      'fertility-reproductive-medicine-ivf',
      'Micro-surgical injection of a single selected sperm directly into an egg for severe male factor infertility.',
      'Intracytoplasmic Sperm Injection (ICSI) revolutionizes male infertility treatment. Using Narishige high-magnification micromanipulators, our embryologist selects the single most morphologically sound sperm and injects it directly into the egg cytoplasm.',
      '["1. Advanced Semen Processing: Isolating progressive, healthy sperm.", "2. Oocyte Denudation: Preparing mature eggs for micro-injection.", "3. Micro-Injection: Precision insertion under 400x magnification inverted microscope.", "4. Blastocyst Incubation: Culturing fertilized zygotes under strict environmental controls."]',
      '["Men with very low sperm count (severe oligospermia)", "Men with poor sperm motility (asthenospermia) or abnormal shape (teratospermia)", "Surgical sperm retrieval cases (TESA / PESA for azoospermia)", "Previous poor or failed fertilization with conventional IVF"]',
      'Detailed semen analysis, DNA fragmentation index, and partner ovum pick-up coordination.',
      'Embryo freezing or blastocyst transfer protocol as recommended by the clinical team.',
      'Same day laboratory procedure',
      '80%+ fertilization rate',
      '/images/blogs/blog-beat-male-infertility.webp',
      0,
      'published'
    ),
    (
      'iui-intrauterine-insemination',
      'IUI (Intrauterine Insemination)',
      'Fertility Care',
      'fertility-reproductive-medicine-ivf',
      'Minimally invasive first-line fertility treatment placing concentrated, highly motile sperm directly into the uterus.',
      'Intrauterine Insemination (IUI) is a gentle, first-line fertility procedure where processed, active sperm is placed directly inside the uterine cavity near the time of ovulation.',
      '["1. Ovulation Induction & Follicular Tracking: Mild stimulation and transvaginal ultrasound scans.", "2. Trigger Injection: HCG/GnRH trigger administered when follicle reaches optimal 18-20mm maturity.", "3. Sperm Wash & Capacitation: Processing the sample to concentrate the fastest moving sperm.", "4. Gentle Insemination: Painless 5-minute procedure placing sperm into the uterus with a soft catheter."]',
      '["Couples with unexplained infertility of 1-3 years duration", "Mild male factor motility issues", "Cervical mucus hostility or hostility factors", "Ovulatory dysfunction treated with mild stimulation"]',
      'Confirmed tubal patency via HSG / laparoscopy and healthy semen parameters.',
      'Rest for 15-20 minutes following the procedure; normal daily activities resumed immediately.',
      '5-10 minutes OPD procedure',
      '15% - 20% per cycle',
      '/images/blogs/blog-fertility-all-ages.webp',
      0,
      'published'
    ),
    (
      'laparoscopic-gynecological-surgery',
      'Advanced 3D/4K Gynecological Laparoscopy',
      'Women\\'s Health',
      'gynecology-laparoscopic-surgery',
      'Minimally invasive keyhole surgery for fibroids, ovarian cysts, and endometriosis with rapid recovery.',
      'Our surgical suite features ultra-modern Karl Storz 4K laparoscopic imaging. Surgeries are performed through tiny 5mm-10mm keyhole incisions, eliminating large abdominal scars and dramatically reducing recovery time.',
      '["1. High-Definition Visualization: 4K optical magnification identifies minute pathology.", "2. Precision Tissue Dissection: Ultrasonic and bipolar energy instruments minimize bleeding.", "3. Pathology Excision: Fibroids (myomectomy), ovarian cysts, or endometriosis cleared cleanly.", "4. Aesthetic Closure: Dissolvable sub-cuticular sutures leave almost unnoticeable marks."]',
      '["Women with symptomatic uterine fibroids causing heavy bleeding or pain", "Patients with large ovarian cysts or dermoid cysts", "Severe endometriosis causing pelvic pain or infertility", "Ectopic pregnancy or fertility enhancing tubal evaluation"]',
      'Routine pre-operative blood profile, fasting for 6 hours prior to surgery.',
      'Ambulation on the same evening, oral fluids within 6 hours, discharge within 24 to 48 hours.',
      '45 to 90 minutes operative time',
      '99%+ complication-free',
      '/images/operation-theatre.webp',
      1,
      'published'
    )
  `);
  console.log('Treatments updated successfully.');

  // 5. Facilities
  console.log('Updating facilities collection with real hospital images...');
  await query('DELETE FROM facilities');
  await query(`
    INSERT INTO facilities (slug, name, short_description, description, equipment, image_url, status, display_order)
    VALUES
    (
      'hospital-building-infrastructure',
      'Multi-Specialty Hospital Infrastructure & Reception',
      'Modern 5-floor clinical campus in Khammam with spacious waiting lobbies, 24/7 pharmacy, and emergency desks.',
      'Sreemantha Hospital\\'s campus is purpose-built to provide a welcoming, serene, and clinically sterile environment for women, mothers, and children. Features centralized air-handling units, dedicated triage, and seamless digital registration desks.',
      '["High-Speed Patient Elevators", "24/7 Digital Registration Desks", "Centralized Medical Gas Pipeline", "Dedicated Patient Pharmacy", "Comfortable Executive Waiting Lounges"]',
      '/images/hospital-exterior.webp',
      'published',
      1
    ),
    (
      'level-3-neonatal-intensive-care-unit',
      '24/7 Level-III Neonatal Intensive Care Unit (NICU)',
      'Khammam\\'s premier tertiary neonatal center equipped with multi-zone incubators and round-the-clock neonatologists.',
      'Our Level-III NICU is engineered to provide life-saving care to extremely premature neonates and critically ill newborns. Equipped with advanced GE Giraffe and Dräger incubators, LED phototherapy, and high-frequency ventilators.',
      '["Advanced Servo-Controlled Incubators", "Dräger Multi-Mode Neonatal Ventilators", "Double Surface LED Phototherapy Units", "Continuous Multi-Para Vital Monitors", "Laminar Flow TPN Preparation Station"]',
      '/images/incubator-nicu.webp',
      'published',
      2
    ),
    (
      'modular-operation-theatre-laparoscopy',
      'Ultra-Clean Modular Operation Theatres',
      'Class 10,000 laminar airflow surgical suites equipped with 4K Karl Storz laparoscopy towers for maternity and gynecology.',
      'Designed to international surgical standards with seamless anti-bacterial surfaces, laminar airflow, and HEPA air filtration. Capable of handling complex emergency C-sections within 15 minutes, radical pelvic surgeries, and microscopic fertility operations.',
      '["Karl Storz 4K Ultra-HD Laparoscopy Tower", "Laminar Airflow Positive Pressure System", "Advanced Mindray Anesthesia Workstations", "ValleyLab Ultrasonic Energy Dissection Devices", "Emergency Crash Cart & Defibrillator"]',
      '/images/operation-theatre.webp',
      'published',
      3
    ),
    (
      'reception-maternity-experience-center',
      'Maternity Patient Experience & Postnatal Suites',
      'Dedicated maternity floor, luxury postnatal recovery suites, and compassionate patient care counselors.',
      'At Sreemantha Hospital, welcoming a new baby is celebrated with dignity and happiness. Our maternity suites provide quiet, supportive recovery environments for new mothers and their newborn babies with immediate bedside assistance.',
      '["Private Air-Conditioned Postnatal Rooms", "Dedicated Lactation Counseling Suite", "Bedside Electronic Nurse Call System", "Kangaroo Mother Care Recliners", "24/7 Pediatric Ward Coverage"]',
      '/images/sreemantha-brand-logo-card.webp',
      'published',
      4
    )
  `);
  console.log('Facilities updated successfully.');

  // 6. Insurance Providers (24 Partners)
  console.log('Updating insurance_providers collection with 24 accepted partners...');
  await query('DELETE FROM insurance_providers');

  for (let i = 0; i < INSURANCE_PARTNERS.length; i++) {
    const p = INSURANCE_PARTNERS[i];
    await query(`
      INSERT INTO insurance_providers (
        name, type, cashless_available, claim_assistance_info, logo_url, display_order, status
      ) VALUES (?, ?, 1, ?, ?, ?, 'active')
    `, [
      p.name,
      p.name.includes('TPA') ? 'Third Party Administrator (TPA)' : 'Health & General Insurer',
      p.slogan || 'Cashless Pre-Auth & Direct TPA Desk Available',
      `/images/insurance/${p.slug}.webp`,
      i + 1,
    ]);
  }
  console.log('Insurance providers updated with all 24 accepted partners.');

  // 7. Media Assets Table
  console.log('Registering media assets in media_assets table...');
  const assetsToRegister = [
    { name: 'Hospital Exterior Front Building', filename: 'hospital-exterior.webp', url: '/images/hospital-exterior.webp', w: 2000, h: 1500 },
    { name: 'Hospital Exterior Banner 16:9', filename: 'hospital-exterior-banner.webp', url: '/images/hospital-exterior-banner.webp', w: 1920, h: 1080 },
    { name: 'NICU Incubator Room with Nurses & Preterms', filename: 'incubator-nicu.webp', url: '/images/incubator-nicu.webp', w: 1599, h: 1200 },
    { name: 'Sreemantha Fertility, Women & Child Care Hospital Logo', filename: 'sreemantha-brand-logo.webp', url: '/images/sreemantha-brand-logo.webp', w: 2400, h: 1350 },
    { name: 'Modular Operation Theatre with Surgical Equipments', filename: 'operation-theatre.webp', url: '/images/operation-theatre.webp', w: 1152, h: 648 },
    { name: 'Blog: You Trust We Care Poster', filename: 'blog-you-trust-we-care.webp', url: '/images/blogs/blog-you-trust-we-care.webp', w: 705, h: 853 },
    { name: 'Blog: Let Wonderful Things Happen Poster', filename: 'blog-let-wonderful-things-happen.webp', url: '/images/blogs/blog-let-wonderful-things-happen.webp', w: 705, h: 853 },
    { name: 'Blog: Babys First Cry Poster', filename: 'blog-baby-first-cry.webp', url: '/images/blogs/blog-baby-first-cry.webp', w: 705, h: 853 },
    { name: 'Blog: Childbirth Special & Memorable Poster', filename: 'blog-childbirth-special-memorable.webp', url: '/images/blogs/blog-childbirth-special-memorable.webp', w: 705, h: 845 },
    { name: 'Blog: Follow Your Babys Cues Poster', filename: 'blog-follow-baby-cues.webp', url: '/images/blogs/blog-follow-baby-cues.webp', w: 705, h: 864 },
    { name: 'Blog: Fertility All Ages Poster', filename: 'blog-fertility-all-ages.webp', url: '/images/blogs/blog-fertility-all-ages.webp', w: 705, h: 864 },
    { name: 'Blog: Embrace Good Health & Happiness Poster', filename: 'blog-embrace-health-happiness.webp', url: '/images/blogs/blog-embrace-health-happiness.webp', w: 1079, h: 1186 },
    { name: 'Blog: Beat Male Infertility Poster', filename: 'blog-beat-male-infertility.webp', url: '/images/blogs/blog-beat-male-infertility.webp', w: 705, h: 869 },
  ];

  for (const a of assetsToRegister) {
    const existing = await query('SELECT id FROM media_assets WHERE filename = ?', [a.filename]);
    if (existing.length === 0) {
      await query(`
        INSERT INTO media_assets (filename, original_name, url, file_size, mime_type, media_type, width, height)
        VALUES (?, ?, ?, 150000, 'image/webp', 'image', ?, ?)
      `, [a.filename, a.name, a.url, a.w, a.h]);
    } else {
      await query(`
        UPDATE media_assets SET original_name = ?, url = ?, width = ?, height = ? WHERE id = ?
      `, [a.name, a.url, a.w, a.h, existing[0].id]);
    }
  }
  console.log('Media assets registered successfully.');
}

async function main() {
  try {
    await processHospitalImages();
    await generateAllInsuranceWebp();
    await updateDatabaseCollections();
    console.log('===========================================================');
    console.log('SUCCESS: All images processed into WebP and database seeded!');
    console.log('===========================================================');
    process.exit(0);
  } catch (err) {
    console.error('Fatal error in asset processing:', err.message, err.sqlMessage || '');
    process.exit(1);
  }
}

main();
