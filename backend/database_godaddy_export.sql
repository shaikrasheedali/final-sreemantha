-- ========================================================
-- Sreemantha Hospital Platform - Production MySQL Database Export
-- Clean Database with Local Codebase Assets Only (Zero External URLs)
-- Ready for GoDaddy Hosted MySQL Database Integration
-- Generated at: 2026-10-15T10:09:48.431Z
-- ========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `users` (

  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `stored_password` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'Administrator',
  `full_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)

);

-- Dumping baseline data for table `users` (3 rows)

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `stored_password`, `role`, `full_name`, `created_at`) VALUES
  (1, 'admin', 'admin@sreemantha.hospital', '$argon2id$v=19$m=65536,p=1,t=3$nHevHErxpIPq1L5e56DvHQ$UX9ILhgwZj6KfUj7nPmQetO9efmZemkik0ftfA44wG0', 'Admin@2026', 'admin', 'Hospital Administrator', '2026-09-28 15:33:32'),
  (2, 'superadmin', 'superadmin@sreemantha.hospital', '$argon2id$v=19$m=65536,p=1,t=3$/LlnHefmt6d+KoefbqKZUw$fBfBKAsMNBT/fqtZgkVSknIITlsFBw15ETufRn82jJA', 'SuperAdmin@2026', 'superadmin', 'Chief Medical Director (Super Admin)', '2026-09-28 17:54:00'),
  (3, 'staff', 'staff@sreemantha.hospital', '$argon2id$v=19$m=65536,p=1,t=3$i0l/GAI9Gmn42Ge/w1UM+Q$jeBHPslnOMAEWDZOMlqipjYMbYJHUh5oDVb5wO5f9qc', 'Staff@2026', 'staff', 'Clinical Operations Staff', '2026-09-28 17:54:00');

-- --------------------------------------------------------
-- Table structure for table `departments`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `departments` (

  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(120) NOT NULL,
  `name` varchar(255) NOT NULL,
  `tagline` varchar(255) DEFAULT NULL,
  `description` longtext,
  `head_doctor_name` varchar(255) DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `status` enum('draft','published') DEFAULT 'published',
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)

);

-- Dumping baseline data for table `departments` (4 rows)

INSERT INTO `departments` (`id`, `slug`, `name`, `tagline`, `description`, `head_doctor_name`, `icon`, `image_url`, `status`) VALUES
  (1, 'fertility-reproductive-medicine', 'Fertility and Reproductive Medicine', 'World-Class IVF & Embryology in Khammam', 'Complete assisted reproduction suite with cleanroom IVF lab, ICSI workstations, and blastocyst vitrification.', 'Dr. S. Sreemantha Rao', 'Sparkles', '/uploads/departments/fertility-reproductive-medicine.webp', 'published'),
  (2, 'obstetrics-gynecology', 'Obstetrics and Gynecology', 'Holistic Maternal & Women Healthcare', 'Painless delivery suites, advanced high-risk obstetric monitoring, and 4K minimally invasive laparoscopy.', 'Dr. P. Shravani', 'HeartHandshake', '/uploads/departments/obstetrics-gynecology.webp', 'published'),
  (3, 'pediatrics-neonatology', 'Pediatrics and Neonatal Intensive Care (NICU)', 'Level III 24/7 Newborn & Pediatric Care', 'Advanced intensive care for premature and sick newborns with Giraffe incubators and dedicated transport ambulance.', 'Dr. M. Vamsi Krishna', 'Baby', '/uploads/departments/pediatrics-neonatology.webp', 'published'),
  (4, 'fetal-medicine-diagnostics', 'Fetal Medicine and Advanced Ultrasound', 'Precision 4D Prenatal Imaging', 'GE Voluson E10 4D ultrasound, NT anomaly screening, fetal Doppler, and non-invasive prenatal testing (NIPT).', 'Dr. P. Shravani', 'Activity', '/uploads/departments/fetal-medicine-diagnostics.webp', 'published');

-- --------------------------------------------------------
-- Table structure for table `specialties`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `specialties` (

  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(120) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT 'Fertility & Reproductive',
  `short_description` text NOT NULL,
  `overview` longtext,
  `icon` varchar(100) DEFAULT NULL,
  `image_url` text,
  `conditions` json DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `status` enum('draft','published') DEFAULT 'published',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)

);

-- Dumping baseline data for table `specialties` (4 rows)

INSERT INTO `specialties` (`id`, `slug`, `title`, `category`, `short_description`, `overview`, `icon`, `image_url`, `conditions`, `display_order`, `status`, `created_at`) VALUES
  (13, 'obstetrics-high-risk-pregnancy', 'Obstetrics & High-Risk Pregnancy Care', 'Maternity & Fetal Care', 'Comprehensive prenatal care, painless labor management, and 24/7 tertiary maternal-fetal critical care in Khammam.', 'Sreemantha Hospital\'s Obstetrics department is led by Dr. G. Sindhu (MS OBGYN, Osmania Medical College). Our dedicated labor suites and modular operating theatres are equipped for complex maternal emergencies, twins/multiple gestations, gestational diabetes, pre-eclampsia, and prior cesarean deliveries.', 'HeartPulse', '/uploads/reception-newborn.webp', '["High-Risk Pregnancy","Gestational Diabetes (GDM)","Pre-eclampsia & Hypertension","Multiple Pregnancies (Twins/Triplets)","Recurrent Pregnancy Loss","Placenta Previa & Accreta"]', 1, 'published', '2026-10-05 01:38:52'),
  (14, 'gynecology-laparoscopic-surgery', 'Gynecology & Advanced 3D/4K Laparoscopic Surgery', 'Women\'s Health', 'Minimally invasive keyhole surgeries, fibroid removals, endometriosis excision, and complete female wellness.', 'Advanced gynecological surgical care featuring ultra-high-definition 4K laparoscopy and hysteroscopy. Patient benefits include minimal incision scars, negligible blood loss, rapid post-op recovery, and same-day or next-day discharge.', 'Activity', '/uploads/operation-theatre.webp', '["Uterine Fibroids (Myomectomy)","Ovarian Cysts & Dermoids","Endometriosis & Adenomyosis","Uterine Polyps & Abnormal Bleeding","Pelvic Organ Prolapse","PCOS & Hormonal Imbalances"]', 2, 'published', '2026-10-05 01:38:52'),
  (15, 'fertility-reproductive-medicine-ivf', 'Fertility & Reproductive Medicine (IVF / ICSI)', 'Fertility & Andrology', 'Class 10,000 modular embryology cleanroom, Day-5 blastocyst culture, ICSI, and individualized fertility protocols.', 'Comprehensive fertility solutions helping couples fulfill their parenthood dreams. We combine rigorous genetic assessment, optimized ovulation stimulation, advanced sperm preparation, and meticulous embryo culture.', 'Sparkles', '/uploads/blogs/blog-let-wonderful-things-happen.webp', '["Unexplained Infertility","Low Ovarian Reserve (Low AMH)","Blocked Fallopian Tubes","Severe Male Infertility (Azoospermia/Oligospermia)","Polycystic Ovary Syndrome (PCOS)","Recurrent IVF Implantation Failure"]', 3, 'published', '2026-10-05 01:38:52'),
  (16, 'pediatrics-level-3-nicu', 'Pediatrics & Level-III Neonatal Intensive Care (NICU)', 'Neonatal & Child Health', '24/7 Level-III NICU with multi-zone incubators, servo-controlled warmers, high-frequency ventilators, and expert neonatologists.', 'Led by Dr. B. V. N. Krishna (MD Pediatrics, VMMC & Safdarjung Hospital Delhi, Fellow in Neonatology), our Level-III NICU provides life-saving tertiary care for preterm infants born as early as 26 weeks, low birth weight babies, and critical neonates.', 'Baby', '/uploads/incubator-nicu.webp', '["Extreme Preterm Birth (under 28-32 weeks)","Extremely Low Birth Weight (<1000g)","Respiratory Distress Syndrome (RDS)","Neonatal Jaundice & Phototherapy","Neonatal Sepsis & Critical Care","Pediatric Growth & Developmental Delays"]', 4, 'published', '2026-10-05 01:38:52');

-- --------------------------------------------------------
-- Table structure for table `treatments`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `treatments` (

  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(120) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `specialty_slug` varchar(120) DEFAULT NULL,
  `short_description` text NOT NULL,
  `overview` longtext,
  `how_it_works` longtext,
  `who_requires` longtext,
  `preparation` text,
  `aftercare` text,
  `typical_duration` varchar(255) DEFAULT NULL,
  `success_rate` varchar(255) DEFAULT NULL,
  `image_url` text,
  `featured` tinyint(1) DEFAULT '0',
  `status` enum('draft','published') DEFAULT 'published',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)

);

-- Dumping baseline data for table `treatments` (6 rows)

INSERT INTO `treatments` (`id`, `slug`, `title`, `category`, `specialty_slug`, `short_description`, `overview`, `how_it_works`, `who_requires`, `preparation`, `aftercare`, `typical_duration`, `success_rate`, `image_url`, `featured`, `status`, `created_at`) VALUES
  (19, 'ivf-in-vitro-fertilization-blastocyst', 'IVF (In Vitro Fertilization) & Blastocyst Culture', 'Fertility Care', 'fertility-reproductive-medicine-ivf', 'State-of-the-art fertilization in our Class 10,000 embryology cleanroom with Day-5 blastocyst transfer.', 'In Vitro Fertilization (IVF) is the gold-standard assisted reproductive technology where eggs and sperm are fertilized in our advanced embryology lab. Embryos are cultured until the blastocyst stage (Day 5) to maximize implantation success.', '<ol><li><strong>Initial Clinical Assessment:</strong> Comprehensive hormonal & ultrasound evaluation</li><li><strong>Ovarian Stimulation:</strong> Monitored protocol tailored to ovarian reserve</li><li><strong>Egg Retrieval:</strong> Ultrasound-guided painless procedure</li><li><strong>Embryo Transfer:</strong> Single blastocyst ultrasound guided transfer</li></ol>', '["Couples with bilateral blocked or damaged fallopian tubes","Women with diminished ovarian reserve or advanced maternal age","Couples who have experienced failed IUI cycles","Severe endometriosis affecting egg quality or tubal motility"]', 'Comprehensive hormonal testing (AMH, FSH, LH), baseline pelvic ultrasound, and partner semen analysis.', 'Progesterone luteal support, avoidance of strenuous lifting for 48 hours, and pregnancy blood test after 14 days.', '2 to 3 weeks per cycle', 'High cumulative pregnancy rate', '/uploads/blogs/blog-let-wonderful-things-happen.webp', 1, 'published', '2026-10-05 01:38:53'),
  (20, 'painless-normal-delivery-maternity', 'Painless Normal Delivery (Labor Epidural Analgesia)', 'Maternity Care', 'obstetrics-high-risk-pregnancy', '24/7 labor epidural analgesia enabling smooth, comfortable normal vaginal delivery with continuous fetal monitoring.', 'Painless delivery utilizes continuous labor epidural analgesia administered by experienced consultant anesthesiologists. It significantly reduces labor pain while allowing the mother to remain alert and fully in control during pushing.', '["1. Active Labor Assessment: Epidural is administered once labor is well established at 3-4 cm dilation.","2. Fine Epidural Catheter Placement: Micro-dosed local anesthetic is delivered into the epidural space.","3. Pain Relief within 10-15 Minutes: Contractions continue normally without agonizing labor pain.","4. Monitored Normal Birth: Continuous CTG fetal heartbeat tracking ensures optimal baby oxygenation."]', '["Expectant mothers desiring a comfortable normal vaginal delivery","Mothers with low pain tolerance seeking to avoid elective surgical cesareans","Patients with mild pregnancy-induced hypertension where stress reduction is beneficial"]', 'Pre-anesthesia checkup during the third trimester, normal coagulation profile, and informed consent.', 'Immediate postpartum skin-to-skin bonding, initial breastfeeding within 30 minutes, and rapid mobilization within 4 hours.', '6 to 12 hours labor duration', '95%+ pain alleviation', '/uploads/reception-newborn-card.webp', 1, 'published', '2026-10-05 01:38:53'),
  (21, 'level-3-nicu-preterm-care', 'Level-III Neonatal Intensive Care (NICU)', 'Neonatal Critical Care', 'pediatrics-level-3-nicu', 'Tertiary care for preterm infants, respiratory distress, low birth weight, and surgical neonates led by Dr. B. V. N. Krishna.', 'Our Level-III NICU is the most advanced neonatal critical care facility in Khammam. Equipped with servo-controlled multi-zone incubators, LED phototherapy, continuous invasive and non-invasive cardiopulmonary monitoring, and neonatal resuscitation units.', '["1. Rapid Resuscitation & Golden Hour Care: Immediate specialized stabilization at delivery.","2. Advanced Respiratory Support: Gentle CPAP, High-Frequency Ventilation, and Surfactant therapy.","3. Total Parenteral Nutrition (TPN): Precise intravenous nutrition for premature gastrointestinal systems.","4. Developmental Supportive Care: Noise/light control and Kangaroo Mother Care (KMC)."]', '["Premature infants born before 37 weeks (down to 26 weeks)","Low birth weight babies weighing under 1500g or 1000g","Newborns with respiratory distress, meconium aspiration, or neonatal jaundice","Infants needing urgent neonatal medical stabilization"]', 'Antenatal maternal corticosteroid administration when preterm delivery is anticipated.', 'Lactation counseling for expressed breast milk, transition to Kangaroo Mother Care, and follow-up developmental pediatric clinic.', 'Personalized neonatal stay', '98%+ tertiary survival rate', '/uploads/incubator-nicu.webp', 1, 'published', '2026-10-05 01:38:53'),
  (22, 'icsi-intracytoplasmic-sperm-injection', 'ICSI (Intracytoplasmic Sperm Injection) & Male Fertility', 'Fertility Care', 'fertility-reproductive-medicine-ivf', 'Micro-surgical injection of a single selected sperm directly into an egg for severe male factor infertility.', 'Intracytoplasmic Sperm Injection (ICSI) revolutionizes male infertility treatment. Using Narishige high-magnification micromanipulators, our embryologist selects the single most morphologically sound sperm and injects it directly into the egg cytoplasm.', '["1. Advanced Semen Processing: Isolating progressive, healthy sperm.","2. Oocyte Denudation: Preparing mature eggs for micro-injection.","3. Micro-Injection: Precision insertion under 400x magnification inverted microscope.","4. Blastocyst Incubation: Culturing fertilized zygotes under strict environmental controls."]', '["Men with very low sperm count (severe oligospermia)","Men with poor sperm motility (asthenospermia) or abnormal shape (teratospermia)","Surgical sperm retrieval cases (TESA / PESA for azoospermia)","Previous poor or failed fertilization with conventional IVF"]', 'Detailed semen analysis, DNA fragmentation index, and partner ovum pick-up coordination.', 'Embryo freezing or blastocyst transfer protocol as recommended by the clinical team.', 'Same day laboratory procedure', '80%+ fertilization rate', '/uploads/blogs/blog-beat-male-infertility.webp', 0, 'published', '2026-10-05 01:38:53'),
  (23, 'iui-intrauterine-insemination', 'IUI (Intrauterine Insemination)', 'Fertility Care', 'fertility-reproductive-medicine-ivf', 'Minimally invasive first-line fertility treatment placing concentrated, highly motile sperm directly into the uterus.', 'Intrauterine Insemination (IUI) is a gentle, first-line fertility procedure where processed, active sperm is placed directly inside the uterine cavity near the time of ovulation.', '["1. Ovulation Induction & Follicular Tracking: Mild stimulation and transvaginal ultrasound scans.","2. Trigger Injection: HCG/GnRH trigger administered when follicle reaches optimal 18-20mm maturity.","3. Sperm Wash & Capacitation: Processing the sample to concentrate the fastest moving sperm.","4. Gentle Insemination: Painless 5-minute procedure placing sperm into the uterus with a soft catheter."]', '["Couples with unexplained infertility of 1-3 years duration","Mild male factor motility issues","Cervical mucus hostility or hostility factors","Ovulatory dysfunction treated with mild stimulation"]', 'Confirmed tubal patency via HSG / laparoscopy and healthy semen parameters.', 'Rest for 15-20 minutes following the procedure; normal daily activities resumed immediately.', '5-10 minutes OPD procedure', '15% - 20% per cycle', '/uploads/blogs/blog-fertility-all-ages.webp', 0, 'published', '2026-10-05 01:38:53'),
  (24, 'laparoscopic-gynecological-surgery', 'Advanced 3D/4K Gynecological Laparoscopy', 'Women\'s Health', 'gynecology-laparoscopic-surgery', 'Minimally invasive keyhole surgery for fibroids, ovarian cysts, and endometriosis with rapid recovery.', 'Our surgical suite features ultra-modern Karl Storz 4K laparoscopic imaging. Surgeries are performed through tiny 5mm-10mm keyhole incisions, eliminating large abdominal scars and dramatically reducing recovery time.', '["1. High-Definition Visualization: 4K optical magnification identifies minute pathology.","2. Precision Tissue Dissection: Ultrasonic and bipolar energy instruments minimize bleeding.","3. Pathology Excision: Fibroids (myomectomy), ovarian cysts, or endometriosis cleared cleanly.","4. Aesthetic Closure: Dissolvable sub-cuticular sutures leave almost unnoticeable marks."]', '["Women with symptomatic uterine fibroids causing heavy bleeding or pain","Patients with large ovarian cysts or dermoid cysts","Severe endometriosis causing pelvic pain or infertility","Ectopic pregnancy or fertility enhancing tubal evaluation"]', 'Routine pre-operative blood profile, fasting for 6 hours prior to surgery.', 'Ambulation on the same evening, oral fluids within 6 hours, discharge within 24 to 48 hours.', '45 to 90 minutes operative time', '99%+ complication-free', '/uploads/operation-theatre.webp', 1, 'published', '2026-10-05 01:38:53');

-- --------------------------------------------------------
-- Table structure for table `doctors`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `doctors` (

  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(120) NOT NULL,
  `name` varchar(255) NOT NULL,
  `designation` varchar(255) NOT NULL,
  `department` varchar(100) NOT NULL,
  `qualifications` text NOT NULL,
  `experience_years` int NOT NULL,
  `languages` json DEFAULT NULL,
  `short_bio` text NOT NULL,
  `full_bio` longtext,
  `education` json DEFAULT NULL,
  `certifications` json DEFAULT NULL,
  `opd_timings` varchar(255) DEFAULT NULL,
  `photo_url` text,
  `featured` tinyint(1) DEFAULT '0',
  `display_order` int DEFAULT '0',
  `status` enum('draft','published') DEFAULT 'published',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)

);

-- Dumping baseline data for table `doctors` (3 rows)

INSERT INTO `doctors` (`id`, `slug`, `name`, `designation`, `department`, `qualifications`, `experience_years`, `languages`, `short_bio`, `full_bio`, `education`, `certifications`, `opd_timings`, `photo_url`, `featured`, `display_order`, `status`, `created_at`) VALUES
  (11, 'dr-g-sindhu', 'Dr. G. Sindhu (Dr. Sindhu Gundamalla)', 'Obstetrics, Gynecology & Infertility Specialist', 'Obstetrics, Gynecology & Infertility', 'M.B.B.S., M.S. (OBGYN) - Osmania Medical College', 12, '["Telugu","English","Hindi"]', 'Specialist in high-risk pregnancies, laparoscopic gynecological surgeries, and personalized fertility therapies.', 'Dr. G. Sindhu (డా॥ సింధు గుండమళ్ళ) is a distinguished Consultant Obstetrician, Gynecologist, and Infertility Specialist holding M.B.B.S. and M.S. (OBGYN) from the premier Osmania Medical College. With Regd. No. TSMC/FMR/03919, she is renowned across Khammam for empowering women\'s health and enriching motherhood with evidence-based fertility solutions, painless delivery expertise, and advanced minimally invasive laparoscopy.', '["M.B.B.S. - Osmania Medical College, Hyderabad","M.S. (Obstetrics & Gynecology) - Osmania Medical College","Fellowship in Reproductive Medicine & Infertility","Advanced Training in 3D/4K Minimal Access Gynecological Laparoscopy"]', '["TSMC Reg. No: TSMC/FMR/03919","Life Member - Federation of Obstetric and Gynaecological Societies of India (FOGSI)","Member - Indian Society for Assisted Reproduction (ISAR)"]', '10:00 AM - 02:00 PM & 05:00 PM - 08:00 PM', '/uploads/reception-newborn-card.webp', 1, 1, 'published', '2026-10-05 01:38:52'),
  (12, 'dr-b-v-n-krishna', 'Dr. B. V. N. Krishna', 'Consultant Pediatrician & Neonatologist', 'Pediatrics & Level-III Neonatology', 'M.B.B.S., M.D. (Pediatrics) - VMMC & SJH, Delhi', 11, '["Telugu","English","Hindi"]', 'Specialist in Level-III neonatal intensive care, extremely preterm baby resuscitation, and comprehensive child development.', 'Dr. B. V. N. Krishna (డా॥ బి.వి.ఎన్. కృష్ణ) is an acclaimed Pediatrician & Neonatologist with M.B.B.S. and M.D. (Pediatrics) from the prestigious Vardhman Mahavir Medical College & Safdarjung Hospital (VMMC & SJH), New Delhi, complemented by an advanced Fellowship in Neonatology. With Regd. No. TSMC/FMR/07376, Dr. Krishna leads Sreemantha Hospital\'s state-of-the-art 24/7 Level-III NICU, safeguarding critically ill and preterm newborns with compassionate clinical precision.', '["M.B.B.S. - VMMC & Safdarjung Hospital, New Delhi","M.D. (Pediatrics) - VMMC & Safdarjung Hospital, New Delhi","Fellowship in Advanced Neonatology (Level-III NICU)"]', '["TSMC Reg. No: TSMC/FMR/07376","Member - National Neonatology Forum (NNF) India","Member - Indian Academy of Pediatrics (IAP)"]', '09:00 AM - 01:00 PM & 04:00 PM - 08:00 PM (Emergency 24/7)', '/uploads/incubator-nicu-card.webp', 1, 2, 'published', '2026-10-05 01:38:52'),
  (13, 'dr-g-latha', 'Dr. G. Latha', 'Consultant Pediatrician & Neonatologist', 'Pediatrics & Neonatal Care', 'M.B.B.S., M.D. Paed. (KMC)', 14, '["Telugu","English"]', 'Expert pediatrician dedicated to newborn care, immunizations, childhood growth, and adolescent wellness.', 'Dr. G. Latha is a respected Pediatrician and Neonatologist holding M.B.B.S. and M.D. in Pediatrics from Kakatiya Medical College (KMC), registered under TSMC/FMR/05781. She brings extensive experience in pediatric clinical management, preventive child healthcare, and neonatal monitoring to Sreemantha Hospital.', '["M.B.B.S. - Kakatiya Medical College","M.D. (Pediatrics) - Kakatiya Medical College (KMC)"]', '["TSMC Reg. No: TSMC/FMR/05781","Member - Indian Academy of Pediatrics (IAP)"]', '10:30 AM - 01:30 PM & 05:30 PM - 07:30 PM', '/uploads/operation-theatre-card.webp', 1, 3, 'published', '2026-10-05 01:38:52');

-- --------------------------------------------------------
-- Table structure for table `facilities`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `facilities` (

  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(120) NOT NULL,
  `name` varchar(255) NOT NULL,
  `short_description` text NOT NULL,
  `description` longtext,
  `equipment` json DEFAULT NULL,
  `image_url` text,
  `status` enum('draft','published') DEFAULT 'published',
  `display_order` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)

);

-- Dumping baseline data for table `facilities` (4 rows)

INSERT INTO `facilities` (`id`, `slug`, `name`, `short_description`, `description`, `equipment`, `image_url`, `status`, `display_order`) VALUES
  (5, 'hospital-building-infrastructure', 'Multi-Specialty Hospital Infrastructure & Reception', 'Modern 5-floor clinical campus in Khammam with spacious waiting lobbies, 24/7 pharmacy, and emergency desks.', 'Sreemantha Hospital\'s campus is purpose-built to provide a welcoming, serene, and clinically sterile environment for women, mothers, and children. Features centralized air-handling units, dedicated triage, and seamless digital registration desks.', '["High-Speed Patient Elevators","24/7 Digital Registration Desks","Centralized Medical Gas Pipeline","Dedicated Patient Pharmacy","Comfortable Executive Waiting Lounges"]', '/uploads/hospital-exterior.webp', 'published', 1),
  (6, 'level-3-neonatal-intensive-care-unit', '24/7 Level-III Neonatal Intensive Care Unit (NICU)', 'Khammam\'s premier tertiary neonatal center equipped with multi-zone incubators and round-the-clock neonatologists.', 'Our Level-III NICU is engineered to provide life-saving care to extremely premature neonates and critically ill newborns. Equipped with advanced GE Giraffe and Dräger incubators, LED phototherapy, and high-frequency ventilators.', '["Advanced Servo-Controlled Incubators","Dräger Multi-Mode Neonatal Ventilators","Double Surface LED Phototherapy Units","Continuous Multi-Para Vital Monitors","Laminar Flow TPN Preparation Station"]', '/uploads/incubator-nicu.webp', 'published', 2),
  (7, 'modular-operation-theatre-laparoscopy', 'Ultra-Clean Modular Operation Theatres', 'Class 10,000 laminar airflow surgical suites equipped with 4K Karl Storz laparoscopy towers for maternity and gynecology.', 'Designed to international surgical standards with seamless anti-bacterial surfaces, laminar airflow, and HEPA air filtration. Capable of handling complex emergency C-sections within 15 minutes, radical pelvic surgeries, and microscopic fertility operations.', '["Karl Storz 4K Ultra-HD Laparoscopy Tower","Laminar Airflow Positive Pressure System","Advanced Mindray Anesthesia Workstations","ValleyLab Ultrasonic Energy Dissection Devices","Emergency Crash Cart & Defibrillator"]', '/uploads/operation-theatre.webp', 'published', 3),
  (8, 'reception-maternity-experience-center', 'Maternity Patient Experience & Postnatal Suites', 'Dedicated maternity floor, luxury postnatal recovery suites, and compassionate patient care counselors.', 'At Sreemantha Hospital, welcoming a new baby is celebrated with dignity and happiness. Our maternity suites provide quiet, supportive recovery environments for new mothers and their newborn babies with immediate bedside assistance.', '["Private Air-Conditioned Postnatal Rooms","Dedicated Lactation Counseling Suite","Bedside Electronic Nurse Call System","Kangaroo Mother Care Recliners","24/7 Pediatric Ward Coverage"]', '/uploads/reception-newborn.webp', 'published', 4);

-- --------------------------------------------------------
-- Table structure for table `blog_posts`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `blog_posts` (

  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(150) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `author` varchar(255) NOT NULL,
  `read_time` varchar(50) DEFAULT '5 min read',
  `summary` text NOT NULL,
  `content` longtext NOT NULL,
  `image_url` text,
  `published_at` date NOT NULL,
  `featured` tinyint(1) DEFAULT '0',
  `status` enum('published','draft') DEFAULT 'published',
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)

);

-- Dumping baseline data for table `blog_posts` (8 rows)

INSERT INTO `blog_posts` (`id`, `slug`, `title`, `category`, `author`, `read_time`, `summary`, `content`, `image_url`, `published_at`, `featured`, `status`) VALUES
  (22, 'you-trust-we-care-fertility-maternity', 'You Trust, We Care: Compassionate Fertility & Motherhood Excellence', 'Hospital Care & Philosophy', 'Dr. G. Sindhu (MS OBGYN)', '5 min read', 'At Sreemantha Hospital, every patient\'s trust is honored with dedicated medical excellence, empathetic clinical guidance, and personalized fertility and maternity care in Khammam.', '<p>Trust is the cornerstone of every healing relationship. When couples embark on their journey towards parenthood, the emotional and physical aspects require profound understanding and clinical expertise. At Sreemantha Hospital, our guiding principle is simple yet resolute: <strong>"You Trust, We Care"</strong>.</p><h3>Why Compassionate Care Matters</h3><p>From initial fertility consultations to advanced IVF and delivery, our multidisciplinary team of obstetricians, embryologists, and neonatologists walk alongside every family. We provide transparent counseling, personalized treatment protocols, and world-class cleanroom lab standards to ensure the highest success rates with maximum comfort.</p>', '/uploads/blogs/blog-you-trust-we-care.webp', '2026-09-19 18:30:00', 1, 'published'),
  (23, 'let-wonderful-things-happen-fertility-journey', 'Let Wonderful Things Happen: Transforming Dreams of Parenthood into Reality', 'Fertility & IVF', 'Clinical Embryology Team', '6 min read', 'Overcoming fertility challenges with modern reproductive medicine, advanced blastocyst culture, and compassionate clinical expertise.', '<p>Every hopeful parent\'s dream is precious. At Sreemantha Hospital, our advanced fertility unit is engineered to make wonderful things happen for couples navigating infertility.</p><h3>Advanced Reproductive Technologies Available</h3><ul><li><strong>Class 10,000 Modular IVF Embryology Lab</strong> with HEPA and VOC filtration</li><li><strong>Intracytoplasmic Sperm Injection (ICSI)</strong> for severe male factor cases</li><li><strong>Blastocyst Culture (Day 5)</strong> for superior embryo viability and implantation</li><li><strong>Laser Assisted Hatching & Cryopreservation</strong></li></ul><p>Our dedicated fertility specialists tailor each protocol to match individual ovarian reserve, hormonal profiles, and genetic parameters.</p>', '/uploads/blogs/blog-let-wonderful-things-happen.webp', '2026-09-23 18:30:00', 1, 'published'),
  (24, 'happiness-is-hearing-babys-first-cry', 'Happiness is Hearing Your Baby’s First Cry: What to Expect During Safe Delivery', 'Obstetrics & Maternity', 'Dr. G. Sindhu (MS OBGYN)', '5 min read', 'The miraculous moment of childbirth: how Sreemantha Hospital ensures painless delivery, maternal safety, and immediate neonatal bonding.', '<p>There is no sound more joyful and reassuring in the world than a newborn baby\'s first vigorous cry. It signifies the commencement of new life and the triumphant culmination of months of maternal care.</p><h3>Ensuring a Safe, Memorable Childbirth</h3><p>At Sreemantha Hospital, our labor and delivery suites are integrated directly with modular operating rooms and our Level-III NICU. We provide:</p><ul><li><strong>24/7 Painless Normal Delivery (Epidural Analgesia)</strong> administered by expert anesthesiologists</li><li><strong>Continuous Electronic Fetal Heart Rate Monitoring (CTG)</strong></li><li><strong>Immediate Skin-to-Skin Kangaroo Mother Care</strong> and lactation support</li><li><strong>Emergency C-Section Readiness within 15 minutes</strong> for high-risk obstetric cases</li></ul>', '/uploads/blogs/blog-baby-first-cry.webp', '2026-09-27 18:30:00', 1, 'published'),
  (25, 'every-child-birth-is-special-and-memorable', 'For Us Every Child Birth is Special and Memorable: Personalized Maternity Suites', 'Maternity & Labor Care', 'Obstetric Nursing Team', '4 min read', 'Celebrating every birth with dignity, warmth, and clinical precision in our modern maternity suites in Khammam.', '<p>Childbirth is a milestone that stays in a mother\'s heart for lifetime. Recognizing this, Sreemantha Hospital transforms the clinical hospital experience into an empowering, celebratory journey.</p><p>Our private maternity suites are thoughtfully designed to balance clinical safety with domestic warmth. With 24/7 obstetric monitoring, dedicated nursing staff, and round-the-clock neonatologist availability, mothers and families experience absolute peace of mind.</p>', '/uploads/blogs/blog-childbirth-special-memorable.webp', '2026-09-30 18:30:00', 0, 'published'),
  (26, 'follow-your-babys-cues-neonatal-signs', 'Follow Your Baby’s Cues: Essential Signs Every New Parent Should Recognize', 'Pediatrics & Newborn Care', 'Dr. B. V. N. Krishna (MD Pediatrics, Neonatologist)', '6 min read', 'Dr. B. V. N. Krishna explains the vital non-verbal cues newborns use to communicate hunger, sleepiness, colic discomfort, and clinical warning signs.', '<p>Newborn babies communicate continuously through subtle behavioral and physical cues. Learning to read these cues helps parents respond promptly and prevents parental anxiety.</p><h3>Common Baby Cues Decoded</h3><ul><li><strong>Early Hunger Cues:</strong> Lip smacking, head turning (rooting reflex), hands brought to mouth. Crying is a late hunger cue!</li><li><strong>Sleepiness Cues:</strong> Yawning, looking away, rubbing eyes, stiffening limbs.</li><li><strong>Colic / Gas Cues:</strong> Clenched fists, pulling legs towards the tummy, arching back during or after feeding.</li></ul><h3>When to Seek Immediate Medical Evaluation</h3><p>Contact our pediatric emergency department immediately if you notice lethargy, poor sucking, breathing difficulties (chest indrawing), persistent vomiting, or body temperature above 100.4°F.</p>', '/uploads/blogs/blog-follow-baby-cues.webp', '2026-10-01 18:30:00', 1, 'published'),
  (27, 'fertility-impacts-men-and-women-all-ages', 'Fertility Impacts Men & Women of All Ages: Breaking Infertility Myths with Science', 'Reproductive Medicine', 'Fertility & Andrology Specialists', '7 min read', 'Infertility affects both partners equally. Discover how timely diagnostic evaluations and lifestyle modifications improve conception chances.', '<p>A prevalent misconception in society is that infertility is predominantly a female concern. Medical science unequivocally shows that approximately 40% of infertility factors are male-related, 40% female-related, and 20% combined or unexplained.</p><h3>Key Factors Affecting Fertility</h3><ul><li><strong>Age & Ovarian Reserve:</strong> Anti-Müllerian Hormone (AMH) and Antral Follicle Count (AFC) assessments.</li><li><strong>Sperm Quality Parameters:</strong> Semen analysis testing count, motility, and normal morphology.</li><li><strong>Lifestyle Factors:</strong> Smoking, alcohol, endocrine disruptors, obesity, and chronic stress.</li></ul><p>Early evaluation enables targeted, less invasive treatments like ovulation tracking and IUI before progressing to IVF if required.</p>', '/uploads/blogs/blog-fertility-all-ages.webp', '2026-10-02 18:30:00', 0, 'published'),
  (28, 'embrace-good-health-happiness-for-child', 'Embrace Good Health & Happiness for Your Child: Complete Pediatric Wellness Guide', 'Pediatrics & Child Health', 'Dr. G. Latha (MD Paediatrics)', '5 min read', 'Essential guidelines for child immunization schedules, balanced nutritional milestones, and cognitive growth from infancy to school age.', '<p>A healthy child is a happy child. Pediatric wellness extends beyond treating illness to proactive preventive healthcare, timely vaccinations, and balanced emotional growth.</p><h3>Key Pillars of Pediatric Wellness</h3><ul><li><strong>Immunization Adherence:</strong> Strict compliance with the Indian Academy of Pediatrics (IAP) vaccination schedule protecting against polio, measles, rotavirus, pneumococcus, and MMR.</li><li><strong>Milestone Tracking:</strong> Regular developmental assessments measuring motor skills, language acquisition, and social interaction.</li><li><strong>Nutrition & Hydration:</strong> Exclusive breastfeeding for the first 6 months, followed by wholesome age-appropriate complementary foods.</li></ul>', '/uploads/blogs/blog-embrace-health-happiness.webp', '2026-10-03 18:30:00', 0, 'published'),
  (29, 'beat-male-infertility-become-a-father', 'Beat Male Infertility: Modern Medical Solutions to Becoming a Father', 'Andrology & Men\'s Health', 'Andrology Department', '6 min read', 'Exploring clinical breakthroughs in treating male infertility including lifestyle reversal, medical therapies, TESA, and ICSI.', '<p>Male factor infertility is increasingly prevalent due to sedentary lifestyles, environmental pollutants, and metabolic imbalances. Fortunately, modern reproductive medicine offers powerful clinical pathways for men to achieve biological fatherhood.</p><h3>Modern Treatment Options</h3><ul><li><strong>Medical Therapy:</strong> Antioxidant regimens and hormonal balance correction for oligospermia.</li><li><strong>Intracytoplasmic Sperm Injection (ICSI):</strong> Selecting a single healthy sperm for direct egg fertilization.</li><li><strong>Testicular Sperm Aspiration (TESA / PESA):</strong> Surgical sperm retrieval for obstructive azoospermia.</li></ul>', '/uploads/blogs/blog-beat-male-infertility.webp', '2026-10-04 18:30:00', 1, 'published');

-- --------------------------------------------------------
-- Table structure for table `gallery_items`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `gallery_items` (

  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `media_type` varchar(50) DEFAULT 'image',
  `media_url` text,
  `embed_code` text,
  `thumbnail_url` varchar(500) DEFAULT NULL,
  `caption` text,
  `display_order` int DEFAULT '0',
  PRIMARY KEY (`id`)

);

-- Dumping baseline data for table `gallery_items` (8 rows)

INSERT INTO `gallery_items` (`id`, `title`, `category`, `media_type`, `media_url`, `embed_code`, `thumbnail_url`, `caption`, `display_order`) VALUES
  (1, 'Advanced IVF Embryology Cleanroom Lab', 'Facilities & Labs', 'image', '/uploads/gallery/gallery-embryology-lab.webp', '', '/uploads/gallery/gallery-embryology-lab.webp', 'HEPA-filtered Class 10,000 cleanroom equipped with high-resolution micromanipulators for ICSI and embryo vitrification.', 0),
  (2, 'Level III Neonatal Intensive Care Unit (NICU)', 'NICU & Pediatrics', 'image', '/uploads/gallery/gallery-level-3-nicu.webp', NULL, '/uploads/gallery/gallery-level-3-nicu.webp', 'Continuous multipara monitoring, advanced servo incubators, and dedicated neonatal resuscitation team on 24/7 duty.', 2),
  (3, 'Modular Laminar Airflow Operation Theatre', 'Operation Theatres', 'image', '/uploads/gallery/gallery-operation-theatre.webp', NULL, '/uploads/gallery/gallery-operation-theatre.webp', 'State-of-the-art sterile surgical theater dedicated to laparoscopic gynecology, hysteroscopy, and caesarean deliveries.', 3),
  (4, '4D Fetal Medicine & Ultrasound Diagnostics', 'Facilities & Labs', 'image', '/uploads/gallery/gallery-fetal-medicine.webp', NULL, '/uploads/gallery/gallery-fetal-medicine.webp', 'High-definition Voluson ultrasound technology for accurate fetal anomaly scans, nuchal translucency, and doppler studies.', 4),
  (5, 'Deluxe Patient Post-Operative & Recovery Suite', 'Hospital Infrastructure', 'image', '/uploads/gallery/gallery-recovery-suite.webp', NULL, '/uploads/gallery/gallery-recovery-suite.webp', 'Comfortable, private recovery rooms with attached patient amenities and dedicated nursing call systems.', 5),
  (6, 'Pediatric Care & Child Wellness Consultation Suites', 'NICU & Pediatrics', 'image', '/uploads/gallery/gallery-pediatric-consultation.webp', NULL, '/uploads/gallery/gallery-pediatric-consultation.webp', 'Child-friendly examination rooms designed to keep infants and children comfortable during routine vaccinations and wellness checks.', 6),
  (7, 'Sreemantha Hospital Welcoming Reception & Patient Lounge', 'Hospital Infrastructure', 'image', '/uploads/gallery/gallery-reception-lounge.webp', NULL, '/uploads/gallery/gallery-reception-lounge.webp', 'Warm, compassionate patient reception on Priyadarshini Degree College Road, Nehru Nagar, Khammam.', 7),
  (8, 'Celebrating Parenthood: Healthy Newborn Deliveries', 'Happy Families', 'image', '/uploads/gallery/gallery-healthy-newborns.webp', NULL, '/uploads/gallery/gallery-healthy-newborns.webp', 'Over 15,000 families blessed with healthy babies through dedicated reproductive care and high-risk obstetric support.', 8);

-- --------------------------------------------------------
-- Table structure for table `insurance_providers`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `insurance_providers` (

  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` varchar(100) NOT NULL,
  `cashless_available` tinyint(1) DEFAULT '1',
  `claim_assistance_info` text,
  `logo_url` varchar(500) DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `status` enum('active','inactive') DEFAULT 'active',
  PRIMARY KEY (`id`)

);

-- Dumping baseline data for table `insurance_providers` (24 rows)

INSERT INTO `insurance_providers` (`id`, `name`, `type`, `cashless_available`, `claim_assistance_info`, `logo_url`, `display_order`, `status`) VALUES
  (11, 'Aditya Birla Health Insurance', 'Health & General Insurer', 1, 'Cashless Pre-Auth & Direct TPA Desk Available', '/uploads/insurance/aditya-birla-health.webp', 1, 'active'),
  (12, 'SBI General Insurance', 'Health & General Insurer', 1, 'Suraksha Aur Bharosa Dono', '/uploads/insurance/sbi-general-insurance.webp', 2, 'active'),
  (13, 'ICICI Lombard', 'Health & General Insurer', 1, 'Nibhaye Vaade', '/uploads/insurance/icici-lombard.webp', 3, 'active'),
  (14, 'Acko General Insurance', 'Health & General Insurer', 1, 'Cashless Pre-Auth & Direct TPA Desk Available', '/uploads/insurance/acko-general-insurance.webp', 4, 'active'),
  (15, 'Bajaj Allianz', 'Health & General Insurer', 1, 'General Insurance', '/uploads/insurance/bajaj-allianz.webp', 5, 'active'),
  (16, 'Star Health and Allied Insurance', 'Health & General Insurer', 1, 'The Health Insurance Specialist', '/uploads/insurance/star-health.webp', 6, 'active'),
  (17, 'Reliance General Insurance', 'Health & General Insurer', 1, 'Anil Dhirubhai Ambani Group', '/uploads/insurance/reliance-general-insurance.webp', 7, 'active'),
  (18, 'Max Bupa Health Insurance', 'Health & General Insurer', 1, 'Niva Bupa Health Insurance', '/uploads/insurance/max-bupa-niva.webp', 8, 'active'),
  (19, 'IFFCO-TOKIO General Insurance', 'Health & General Insurer', 1, 'Muskurate Raho', '/uploads/insurance/iffco-tokio.webp', 9, 'active'),
  (20, 'Safeway Insurance TPA Pvt. Ltd.', 'Third Party Administrator (TPA)', 1, 'TPA Support', '/uploads/insurance/safeway-tpa.webp', 10, 'active'),
  (21, 'Care Health Insurance', 'Health & General Insurer', 1, 'Health Hamesha', '/uploads/insurance/care-health.webp', 11, 'active'),
  (22, 'Tata AIG General Insurance', 'Health & General Insurer', 1, 'With You Always', '/uploads/insurance/tata-aig.webp', 12, 'active'),
  (23, 'Ericson Insurance TPA Pvt. Ltd.', 'Third Party Administrator (TPA)', 1, 'Third Party Administrator', '/uploads/insurance/ericson-tpa.webp', 13, 'active'),
  (24, 'Liberty General Insurance', 'Health & General Insurer', 1, 'Liberty Mutual Insurance', '/uploads/insurance/liberty-general.webp', 14, 'active'),
  (25, 'Religare Health Insurance', 'Health & General Insurer', 1, 'Care Health Insurance / Adv Health Hamesha', '/uploads/insurance/religare-health.webp', 15, 'active'),
  (26, 'Future Generali Total Insurance', 'Health & General Insurer', 1, 'Total Insurance Solutions', '/uploads/insurance/future-generali.webp', 16, 'active'),
  (27, 'Genins India Insurance TPA LTD', 'Third Party Administrator (TPA)', 1, 'National TPA Network', '/uploads/insurance/genins-tpa.webp', 17, 'active'),
  (28, 'Navi Insurance', 'Health & General Insurer', 1, 'Digital Health Cover', '/uploads/insurance/navi-insurance.webp', 18, 'active'),
  (29, 'Paramount Health Care', 'Health & General Insurer', 1, 'Paramount TPA Services', '/uploads/insurance/paramount-tpa.webp', 19, 'active'),
  (30, 'MD India Health Insurance TPA', 'Third Party Administrator (TPA)', 1, 'Healthcare TPA Pioneer', '/uploads/insurance/md-india-tpa.webp', 20, 'active'),
  (31, 'Vidal Health', 'Health & General Insurer', 1, 'Third Party Administrator', '/uploads/insurance/vidal-health-tpa.webp', 21, 'active'),
  (32, 'Heritage Health (KH)', 'Health & General Insurer', 1, 'Heritage Health TPA', '/uploads/insurance/heritage-health-tpa.webp', 22, 'active'),
  (33, 'ManipalCigna Health Insurance', 'Health & General Insurer', 1, 'Health Ka Saath', '/uploads/insurance/manipal-cigna.webp', 23, 'active'),
  (34, 'Apollo Munich Health Insurance', 'Health & General Insurer', 1, 'Let\'s Uncomplicate', '/uploads/insurance/apollo-munich.webp', 24, 'active');

-- --------------------------------------------------------
-- Table structure for table `settings`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `settings` (

  `setting_key` varchar(100) NOT NULL,
  `setting_value` json NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)

);

-- Dumping baseline data for table `settings` (2 rows)

INSERT INTO `settings` (`setting_key`, `setting_value`, `updated_at`) VALUES
  ('contact_buttons', '{"phone_button":{"label":"Call Hospital","order":1,"number":"+919666781779","enabled":true,"position":"bottom-left","tel_link":"tel:+919666781779"},"whatsapp_button":{"label":"WhatsApp Us","order":2,"number":"+919666781779","enabled":true,"position":"bottom-left","wa_target":"https://wa.me/919666781779","default_message":"Hello Sreemantha Hospital, I would like to inquire about consultation."}}', '2026-09-28 15:33:32'),
  ('hospital_info', '{"email":"care@sreemanthahospital.com","phone":"+91 96667 81779","stats":[{"label":"Happy Families","value":"15,000+"},{"label":"IVF Success Rate","value":"78%"},{"label":"Level III NICU","value":"24/7"},{"label":"Expert Specialists","value":"25+"}],"address":"Priyadarshini Degree/College Road, Nehru Nagar, Khammam, Telangana 507001","tagline":"Bringing the Joy of Parenthood to Your Life","location":"Khammam, Telangana","subtitle":"World-class IVF technology, compassionate maternity care, and expert pediatric services in Khammam.","whatsapp":"+91 96667 81779","hospital_name":"Sreemantha IVF and Child Care Hospital","working_hours":{"opd":"Monday - Saturday: 9:00 AM to 8:00 PM | Sunday: 9:00 AM to 1:00 PM","emergency":"24/7 Casualty, NICU and Maternity Support"},"display_hotline":"+91-8800-SREEMANTHA","emergency_hotline":"+91 88007 73362"}', '2026-09-28 15:33:32');

-- --------------------------------------------------------
-- Table structure for table `faqs`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `faqs` (

  `id` int NOT NULL AUTO_INCREMENT,
  `category` varchar(100) NOT NULL,
  `question` varchar(500) NOT NULL,
  `answer` longtext NOT NULL,
  `display_order` int DEFAULT '0',
  `status` enum('published','draft') DEFAULT 'published',
  PRIMARY KEY (`id`)

);

-- Dumping baseline data for table `faqs` (6 rows)

INSERT INTO `faqs` (`id`, `category`, `question`, `answer`, `display_order`, `status`) VALUES
  (1, 'Fertility', 'What is the IVF success rate at Sreemantha Hospital Khammam?', 'Our cumulative IVF pregnancy success rate stands at 78% for women under 35, achieved through our advanced modular embryology laboratory, routine day-5 blastocyst culture, and individualized stimulation regimens supervised by senior specialists.', 1, 'published'),
  (2, 'Fertility', 'How do I know if I need IUI or IVF?', 'During your initial consultation, we conduct an ultrasound follicular scan, tubal patency evaluation, and semen analysis. Couples with open tubes and mild male factor challenges often begin with gentle IUI, whereas severe sperm issues, blocked tubes, or repeated IUI failures benefit from IVF or ICSI.', 2, 'published'),
  (3, 'Maternity', 'What is painless delivery, and is it safe for my baby?', 'Painless delivery utilizes labor epidural analgesia administered by experienced consultant anesthetists. It relieves the severe contractions pain while allowing you to remain fully conscious and physically active to push. Clinical studies confirm it is safe for both mother and infant.', 3, 'published'),
  (4, 'Pediatrics', 'When is a newborn admitted to the Level III NICU?', 'Babies born prematurely (before 36 weeks), with birth weights under 2.0 kg, respiratory distress, severe jaundice, infection, or difficult deliveries requiring observation receive immediate round-the-clock intensive care in our Level III NICU.', 4, 'published'),
  (5, 'Insurance', 'Which health insurance policies and TPAs offer cashless treatment here?', 'We offer cashless hospitalization with Star Health, HDFC ERGO, ICICI Lombard, Medi Assist, Vidal Health, Care Health, Niva Bupa, and Bajaj Allianz. We also assist with Telangana State Government EHS and Aarogyasri protocols. Our insurance desk manages documentation directly.', 5, 'published'),
  (6, 'General', 'What are the consultation timings and how do I book an appointment?', 'OPD operates Monday through Saturday from 9:00 AM to 8:00 PM, and Sunday from 9:00 AM to 1:00 PM. Emergency services, maternity casualty, and Level III NICU operate 24 hours every day. You can book online through this website or call +91 96667 81779.', 6, 'published');

-- --------------------------------------------------------
-- Table structure for table `testimonials`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `testimonials` (

  `id` int NOT NULL AUTO_INCREMENT,
  `patient_name` varchar(255) NOT NULL,
  `location` varchar(100) NOT NULL,
  `treatment_category` varchar(100) NOT NULL,
  `rating` int DEFAULT '5',
  `story` longtext NOT NULL,
  `consent_verified` tinyint(1) DEFAULT '1',
  `status` enum('published','draft') DEFAULT 'published',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)

);

-- Dumping baseline data for table `testimonials` (3 rows)

INSERT INTO `testimonials` (`id`, `patient_name`, `location`, `treatment_category`, `rating`, `story`, `consent_verified`, `status`, `created_at`) VALUES
  (1, 'Anusha & Venkat Rao', 'Khammam Town', 'IVF Treatment', 5, 'After 7 years of heartbreaking negative tests across Hyderabad hospitals, we met Dr. Sreemantha Rao. His calm reassurance and the advanced lab in Khammam blessed us with twin baby boys on our very first IVF cycle.', 1, 'published', '2026-09-28 15:33:34'),
  (2, 'Pooja & Rajesh Kumar', 'Kothagudem', 'Level III NICU Care', 5, 'Our daughter was born at just 29 weeks weighing 1.1 kilograms. Dr. Vamsi Krishna and the NICU nursing staff cared for her like their own child for 42 days. Today she is a healthy, cheerful 1-year-old baby girl.', 1, 'published', '2026-09-28 15:33:34'),
  (3, 'Sravanthi & Mohan', 'Suryapet', 'Painless Delivery', 5, 'Dr. Shravani made my entire maternity journey wonderful. The epidural painless delivery was completely peaceful, and the postnatal nursing team supported us with breastfeeding from the very first hour.', 1, 'published', '2026-09-28 15:33:34');

-- --------------------------------------------------------
-- Table structure for table `media_assets`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `media_assets` (

  `id` int NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `url` varchar(500) NOT NULL,
  `file_size` int NOT NULL DEFAULT '0',
  `mime_type` varchar(100) NOT NULL DEFAULT 'image/webp',
  `media_type` enum('image','video') NOT NULL DEFAULT 'image',
  `width` int DEFAULT NULL,
  `height` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)

);

-- Dumping baseline data for table `media_assets` (44 rows)

INSERT INTO `media_assets` (`id`, `filename`, `original_name`, `url`, `file_size`, `mime_type`, `media_type`, `width`, `height`, `created_at`) VALUES
  (1, 'fertility-reproductive-medicine.webp', 'Embryology Lab Cleanroom', '/uploads/departments/fertility-reproductive-medicine.webp', 135752, 'image/webp', 'image', 1200, 800, '2026-10-01 17:09:12'),
  (2, 'obstetrics-gynecology.webp', 'Maternal Obstetric Care', '/uploads/departments/obstetrics-gynecology.webp', 78988, 'image/webp', 'image', 1200, 800, '2026-10-01 17:09:12'),
  (3, 'pediatrics-neonatology.webp', 'Pediatric Neonatal Ward', '/uploads/departments/pediatrics-neonatology.webp', 66342, 'image/webp', 'image', 1200, 800, '2026-10-01 17:09:12'),
  (4, 'fetal-medicine-diagnostics.webp', 'Fetal Ultrasound Diagnostics', '/uploads/departments/fetal-medicine-diagnostics.webp', 125920, 'image/webp', 'image', 1200, 800, '2026-10-01 17:09:12'),
  (5, 'fertility-reproductive-medicine.webp', 'Embryology Lab Cleanroom', '/uploads/departments/fertility-reproductive-medicine.webp', 135752, 'image/webp', 'image', 1200, 800, '2026-10-01 17:09:12'),
  (6, 'laboratory-research.webp', 'Diagnostic Research Lab', '/uploads/laboratory-research.webp', 109830, 'image/webp', 'image', 1200, 800, '2026-10-01 17:09:12'),
  (7, 'obstetrics-gynecology.webp', 'Maternal Obstetric Care', '/uploads/departments/obstetrics-gynecology.webp', 78988, 'image/webp', 'image', 1200, 800, '2026-10-01 17:09:12'),
  (8, 'pediatrics-neonatology.webp', 'Pediatric Neonatal Ward', '/uploads/departments/pediatrics-neonatology.webp', 66342, 'image/webp', 'image', 1200, 800, '2026-10-01 17:09:12'),
  (9, 'obstetrics-gynecology.webp', 'Maternal Obstetric Care', '/uploads/departments/obstetrics-gynecology.webp', 78988, 'image/webp', 'image', 1200, 800, '2026-10-01 17:09:12'),
  (10, 'fetal-medicine-diagnostics.webp', 'Fetal Ultrasound Diagnostics', '/uploads/departments/fetal-medicine-diagnostics.webp', 125920, 'image/webp', 'image', 1200, 800, '2026-10-01 17:09:12'),
  (11, 'doctor-consultation-male.webp', 'Consultant Doctor Profile Male', '/uploads/doctor-consultation-male.webp', 54556, 'image/webp', 'image', 800, 800, '2026-10-01 17:09:12'),
  (13, 'doctor-consultation-female.webp', 'Consultant Doctor Profile Female', '/uploads/doctor-consultation-female.webp', 44936, 'image/webp', 'image', 800, 800, '2026-10-01 17:09:12'),
  (14, 'doctor-pediatrician.webp', 'Senior Pediatrician', '/uploads/doctor-pediatrician.webp', 77054, 'image/webp', 'image', 800, 800, '2026-10-01 17:09:12'),
  (15, 'fertility-reproductive-medicine.webp', 'Embryology Lab Cleanroom', '/uploads/departments/fertility-reproductive-medicine.webp', 135752, 'image/webp', 'image', 1200, 800, '2026-10-01 17:09:13'),
  (16, 'pediatrics-neonatology.webp', 'Pediatric Neonatal Ward', '/uploads/departments/pediatrics-neonatology.webp', 66342, 'image/webp', 'image', 1200, 800, '2026-10-01 17:09:13'),
  (17, 'fetal-medicine-diagnostics.webp', 'Fetal Ultrasound Diagnostics', '/uploads/departments/fetal-medicine-diagnostics.webp', 125920, 'image/webp', 'image', 1200, 800, '2026-10-01 17:09:13'),
  (18, 'obstetrics-gynecology.webp', 'Maternal Obstetric Care', '/uploads/departments/obstetrics-gynecology.webp', 78988, 'image/webp', 'image', 1200, 800, '2026-10-01 17:09:13'),
  (19, 'fertility-reproductive-medicine.webp', 'Embryology Lab Cleanroom', '/uploads/departments/fertility-reproductive-medicine.webp', 135752, 'image/webp', 'image', 1200, 800, '2026-10-01 17:09:13'),
  (20, 'pediatrics-neonatology.webp', 'Pediatric Neonatal Ward', '/uploads/departments/pediatrics-neonatology.webp', 66342, 'image/webp', 'image', 1200, 800, '2026-10-01 17:09:13'),
  (21, 'diagnostic-microscope.webp', 'High Precision Microscope', '/uploads/diagnostic-microscope.webp', 134116, 'image/webp', 'image', 1200, 800, '2026-10-01 17:09:13'),
  (22, 'gallery-fetal-medicine.webp', '4D Prenatal Imaging Room', '/uploads/gallery/gallery-fetal-medicine.webp', 78988, 'image/webp', 'image', 1200, 800, '2026-10-01 17:09:13'),
  (23, 'gallery-level-3-nicu.webp', 'Level III NICU Giraffe Incubator', '/uploads/gallery/gallery-level-3-nicu.webp', 82822, 'image/webp', 'image', 1200, 800, '2026-10-01 17:09:13'),
  (25, 'gallery-level-3-nicu.webp', 'Level III NICU Giraffe Incubator', '/uploads/gallery/gallery-level-3-nicu.webp', 82822, 'image/webp', 'image', 1200, 800, '2026-10-01 17:09:13'),
  (26, 'gallery-operation-theatre.webp', 'Modular OT Laminar Flow Suite', '/uploads/gallery/gallery-operation-theatre.webp', 41748, 'image/webp', 'image', 1200, 800, '2026-10-01 17:09:13'),
  (27, 'gallery-fetal-medicine.webp', '4D Prenatal Imaging Room', '/uploads/gallery/gallery-fetal-medicine.webp', 78988, 'image/webp', 'image', 1200, 800, '2026-10-01 17:09:13'),
  (28, 'gallery-recovery-suite.webp', 'Deluxe Patient Recovery Room', '/uploads/gallery/gallery-recovery-suite.webp', 75314, 'image/webp', 'image', 1200, 800, '2026-10-01 17:09:13'),
  (29, 'gallery-pediatric-consultation.webp', 'Pediatric Examination Lounge', '/uploads/gallery/gallery-pediatric-consultation.webp', 81130, 'image/webp', 'image', 1200, 800, '2026-10-01 17:09:14'),
  (30, 'gallery-reception-lounge.webp', 'Hospital Main Entrance Reception', '/uploads/gallery/gallery-reception-lounge.webp', 91468, 'image/webp', 'image', 1200, 800, '2026-10-01 17:09:14'),
  (31, 'gallery-embryology-lab.webp', 'ICSI Embryology Cleanroom', '/uploads/gallery/gallery-embryology-lab.webp', 35570, 'image/webp', 'image', 1200, 800, '2026-10-01 17:09:14'),
  (39, 'asset-1791049250066-295820097.webp', 'Untitled image (2).jpeg', '/uploads/asset-1791049250066-295820097.webp', 64736, 'image/webp', 'image', 2400, 1340, '2026-10-03 12:10:51'),
  (45, 'hospital-exterior.webp', 'Adobe Express - file.png', '/uploads/hospital-exterior.webp', 93686, 'image/webp', 'image', 1672, 941, '2026-10-05 00:08:38'),
  (47, 'hospital-exterior.webp', 'Hospital Exterior Front Building', '/uploads/hospital-exterior.webp', 150000, 'image/webp', 'image', 2000, 1500, '2026-10-05 01:38:54'),
  (48, 'hospital-exterior-banner.webp', 'Hospital Exterior Banner 16:9', '/uploads/hospital-exterior-banner.webp', 150000, 'image/webp', 'image', 1920, 1080, '2026-10-05 01:38:55'),
  (49, 'incubator-nicu.webp', 'NICU Incubator Room with Nurses & Preterms', '/uploads/incubator-nicu.webp', 150000, 'image/webp', 'image', 1599, 1200, '2026-10-05 01:38:55'),
  (50, 'reception-newborn.webp', 'Newborn Mom & Staff at Reception', '/uploads/reception-newborn.webp', 150000, 'image/webp', 'image', 2000, 900, '2026-10-05 01:38:55'),
  (51, 'operation-theatre.webp', 'Modular Operation Theatre with Surgical Equipments', '/uploads/operation-theatre.webp', 150000, 'image/webp', 'image', 1152, 648, '2026-10-05 01:38:55'),
  (52, 'blog-you-trust-we-care.webp', 'Blog: You Trust We Care Poster', '/uploads/blogs/blog-you-trust-we-care.webp', 150000, 'image/webp', 'image', 705, 853, '2026-10-05 01:38:55'),
  (53, 'blog-let-wonderful-things-happen.webp', 'Blog: Let Wonderful Things Happen Poster', '/uploads/blogs/blog-let-wonderful-things-happen.webp', 150000, 'image/webp', 'image', 705, 853, '2026-10-05 01:38:56'),
  (54, 'blog-baby-first-cry.webp', 'Blog: Babys First Cry Poster', '/uploads/blogs/blog-baby-first-cry.webp', 150000, 'image/webp', 'image', 705, 853, '2026-10-05 01:38:56'),
  (55, 'blog-childbirth-special-memorable.webp', 'Blog: Childbirth Special & Memorable Poster', '/uploads/blogs/blog-childbirth-special-memorable.webp', 150000, 'image/webp', 'image', 705, 845, '2026-10-05 01:38:56'),
  (56, 'blog-follow-baby-cues.webp', 'Blog: Follow Your Babys Cues Poster', '/uploads/blogs/blog-follow-baby-cues.webp', 150000, 'image/webp', 'image', 705, 864, '2026-10-05 01:38:57'),
  (57, 'blog-fertility-all-ages.webp', 'Blog: Fertility All Ages Poster', '/uploads/blogs/blog-fertility-all-ages.webp', 150000, 'image/webp', 'image', 705, 864, '2026-10-05 01:38:57'),
  (58, 'blog-embrace-health-happiness.webp', 'Blog: Embrace Good Health & Happiness Poster', '/uploads/blogs/blog-embrace-health-happiness.webp', 150000, 'image/webp', 'image', 1079, 1186, '2026-10-05 01:38:58'),
  (59, 'blog-beat-male-infertility.webp', 'Blog: Beat Male Infertility Poster', '/uploads/blogs/blog-beat-male-infertility.webp', 150000, 'image/webp', 'image', 705, 869, '2026-10-05 01:38:58');

-- --------------------------------------------------------
-- Table structure for table `appointments`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `appointments` (

  `id` int NOT NULL AUTO_INCREMENT,
  `patient_name` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `department` varchar(100) NOT NULL,
  `doctor_name` varchar(255) DEFAULT NULL,
  `preferred_date` date DEFAULT NULL,
  `preferred_time` varchar(50) NOT NULL,
  `reason` text,
  `status` varchar(50) NOT NULL DEFAULT 'waiting',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)

);

-- --------------------------------------------------------
-- Table structure for table `enquiries`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `enquiries` (

  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'unread',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)

);

-- --------------------------------------------------------
-- Table structure for table `audit_logs`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `audit_logs` (

  `id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(100) NOT NULL,
  `action` varchar(255) NOT NULL,
  `entity_type` varchar(100) NOT NULL,
  `entity_id` varchar(100) DEFAULT NULL,
  `details` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)

);

SET FOREIGN_KEY_CHECKS = 1;
-- ========================================================
-- End of Database Export
-- ========================================================
