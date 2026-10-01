import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Clock,
  Heart,
  MapPin,
  Phone,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Activity,
  Microscope,
  Baby,
  ChevronLeft,
  ChevronRight,
  CalendarCheck,
  MessageSquare,
  FileHeart,
  HandHeart,
} from 'lucide-react';
import { SlidingInsuranceStrip } from '../components/SlidingInsuranceStrip';
import { useSettings } from '../context/SettingsContext';
import type { Facility, Specialty, Treatment, Doctor, Insight } from '../types';
import { api } from '../utils/api';

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1400&q=80',
  mother: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1200&q=80',
  baby: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80',
  nicu: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
  patient: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
};

const TESTIMONIALS = [
  {
    text: 'Dr. Sreemantha Rao and the team explained every detail with so much patience. The IVF treatment was clear, transparent, and we were blessed with our baby boy after 6 years of waiting.',
    name: 'Ananya & Ramesh K.',
    meta: 'Fertility & IVF Care · Khammam',
  },
  {
    text: 'The neonatal team in the Level-III NICU saved our preterm baby born at 31 weeks. Attentive nurses around the clock and doctors who truly care like family.',
    name: 'Priyanka & Suresh M.',
    meta: 'NICU Care · Verified Visit',
  },
  {
    text: 'Seamless cashless delivery under Star Health insurance. Clean modern maternity rooms, polite staff, and an exceptionally calm hospital atmosphere.',
    name: 'Kavitha Reddy',
    meta: 'Maternity Care · Normal Delivery',
  },
];

export const HomePage: React.FC = () => {
  const { settings } = useSettings();
  const info = settings.hospital_info || {};
  const phone = info.phone || '+91 96667 81779';
  const emergency = info.emergency_hotline || '+91 88007 73362';
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, '')}`;
  const emergencyHref = `tel:${emergency.replace(/[^+\d]/g, '')}`;

  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [selectedFacilityIdx, setSelectedFacilityIdx] = useState(0);
  const [storyIdx, setStoryIdx] = useState(0);

  useEffect(() => {
    let mounted = true;
    Promise.allSettled([
      api.get<{ specialties: Specialty[] }>('/specialties'),
      api.get<{ treatments: Treatment[] }>('/treatments'),
      api.get<{ doctors: Doctor[] }>('/doctors'),
      api.get<{ facilities: Facility[] }>('/facilities'),
      api.get<{ insights: Insight[] }>('/insights'),
    ]).then(([specRes, treatRes, docRes, facRes, insRes]) => {
      if (!mounted) return;
      if (specRes.status === 'fulfilled' && specRes.value.specialties) {
        setSpecialties(specRes.value.specialties);
      }
      if (treatRes.status === 'fulfilled' && treatRes.value.treatments) {
        setTreatments(treatRes.value.treatments);
      }
      if (docRes.status === 'fulfilled' && docRes.value.doctors) {
        setDoctors(docRes.value.doctors);
      }
      if (facRes.status === 'fulfilled' && facRes.value.facilities) {
        setFacilities(facRes.value.facilities);
      }
      if (insRes.status === 'fulfilled' && insRes.value.insights) {
        setInsights(insRes.value.insights);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const activeStory = TESTIMONIALS[storyIdx % TESTIMONIALS.length];
  const activeFacility = facilities[selectedFacilityIdx] || {
    id: 1,
    name: 'Advanced Cleanroom Embryology Lab',
    tagline: 'Equipped with Esco Multi-Zone Incubators & Narishige Micromanipulators',
    description: 'Class-10,000 cleanroom air filtration with HEPA and VOC filters, creating an optimal microenvironment for gamete handling, ICSI and blastocyst culture.',
    image_url: IMAGES.nicu,
  };

  return (
    <div className="public-site">
      {/* 1. HERO SECTION */}
      <header className="hero" id="home">
        <div className="hero-media">
          <img src={IMAGES.hero} alt="Sreemantha Hospital Specialist Care" />
        </div>
        <div className="container">
          <div className="hero-copy">
            <div className="eyebrow hero-reveal">Care that grows with your family</div>
            <h1 className="hero-reveal">
              Every beginning deserves <em>extraordinary</em> care.
            </h1>
            <p className="hero-reveal">
              Advanced fertility, women’s health and pediatric care — brought together under one trusted roof in Khammam.
            </p>
            <div className="hero-ctas">
              <Link to="/book-appointment" className="btn btn-primary">
                <span>Book Appointment</span>
                <Calendar size={18} />
              </Link>
              <Link to="/specialties" className="btn btn-outline">
                <span>Explore our care</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="hero-trust">
            <div className="trust-copy">
              <div className="avatar-stack">
                {doctors.slice(0, 3).map((doc, idx) => (
                  <img
                    key={doc.id || idx}
                    src={doc.photo_url || doc.profile_photo || IMAGES.patient}
                    alt={doc.name}
                  />
                ))}
              </div>
              <div>
                <b>Trusted specialists</b>
                <span>One connected care team in Khammam</span>
              </div>
            </div>

            <a className="hero-side-card" href={emergencyHref}>
              <span className="pulse">
                <PhoneCall size={20} className="text-white" />
              </span>
              <div>
                <b>24/7 Emergency</b>
                <small>Call {emergency}</small>
              </div>
            </a>
          </div>
        </div>
      </header>

      {/* 2. RUNNING TICKER */}
      <div className="ticker">
        <div className="ticker-track">
          <span className="ticker-copy">
            <span>Fertility &amp; IVF</span> <i>✦</i>
            <span>Women’s wellness</span> <i>✦</i>
            <span>Advanced pediatrics</span> <i>✦</i>
            <span>NICU &amp; PICU</span> <i>✦</i>
            <span>Always open 24/7</span> <i>✦</i>
            <span>Cashless Insurance Empanelled</span> <i>✦</i>
          </span>
          <span className="ticker-copy" aria-hidden="true">
            <span>Fertility &amp; IVF</span> <i>✦</i>
            <span>Women’s wellness</span> <i>✦</i>
            <span>Advanced pediatrics</span> <i>✦</i>
            <span>NICU &amp; PICU</span> <i>✦</i>
            <span>Always open 24/7</span> <i>✦</i>
            <span>Cashless Insurance Empanelled</span> <i>✦</i>
          </span>
        </div>
      </div>

      {/* 3. ABOUT SECTION */}
      <section className="section" id="about">
        <div className="container intro-grid">
          <div className="intro-visual">
            <img
              className="intro-main"
              src={IMAGES.mother}
              alt="Mother and child sharing a peaceful moment"
            />
            <img
              className="intro-float"
              src={IMAGES.baby}
              alt="A peacefully resting newborn at Sreemantha"
            />
            <div className="year-badge">
              <strong>2022</strong>
              <span>Established</span>
            </div>
          </div>

          <div className="intro-copy">
            <div className="eyebrow">About Sreemantha</div>
            <h2>Science-led care, delivered with a human touch.</h2>
            <p>
              Since 2022, Sreemantha has reimagined the hospital experience around one simple idea: every family deserves advanced specialist care that still feels personal, empathetic, and respectful.
            </p>
            <div className="principles">
              <div className="principle">
                <span className="principle-icon">
                  <Sparkles size={18} />
                </span>
                <span>Advanced medicine</span>
              </div>
              <div className="principle">
                <span className="principle-icon">
                  <Heart size={18} />
                </span>
                <span>Human connection</span>
              </div>
              <div className="principle">
                <span className="principle-icon">
                  <ShieldCheck size={18} />
                </span>
                <span>Affordable care</span>
              </div>
              <div className="principle">
                <span className="principle-icon">
                  <Stethoscope size={18} />
                </span>
                <span>Fully accessible</span>
              </div>
            </div>

            <Link to="/doctors" className="btn btn-dark">
              <span>Meet our specialists</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US / OVERVIEW */}
      <section className="section values-section" id="whyChoose">
        <div className="container">
          <div className="eyebrow">Why Choose Us</div>
          <h2>Care built around your family.</h2>
          <p className="max-w-xl mb-8">
            Clear communication, multidisciplinary clinical support, and compassionate healthcare that prioritizes your comfort at every step.
          </p>

          <div className="services-grid">
            <article className="service-card">
              <span className="service-icon">
                <Stethoscope size={28} />
              </span>
              <h3>Specialist-led care</h3>
              <p>
                Direct consultations with senior gynecologists, certified reproductive embryologists, and pediatric intensivists.
              </p>
            </article>

            <article className="service-card featured">
              <span className="service-icon">
                <ShieldCheck size={28} />
              </span>
              <h3>Clarity on costs</h3>
              <p>
                Transparent treatment estimates, zero hidden room charges, and direct cashless claims with leading TPA networks.
              </p>
            </article>

            <article className="service-card">
              <span className="service-icon">
                <Clock size={28} />
              </span>
              <h3>24/7 Emergency availability</h3>
              <p>
                Continuous emergency coverage, Level-III NICU, and round-the-clock neonatal support day and night.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* 5. SPECIALTIES & SERVICES */}
      <section className="section services" id="services">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Connected expertise</div>
              <h2>Complete care through every chapter.</h2>
            </div>
            <p>
              Specialist teams, modern technology and a family-first approach — all in one welcoming hospital in Khammam.
            </p>
          </div>

          <div className="services-grid">
            {specialties.length > 0
              ? specialties.slice(0, 6).map((spec, idx) => (
                  <article
                    className={`service-card ${idx === 0 ? 'featured' : ''}`}
                    key={spec.id || idx}
                  >
                    <span className="service-num">0{idx + 1}</span>
                    <span className="service-icon">
                      {idx === 0 ? (
                        <Microscope size={26} />
                      ) : idx === 1 ? (
                        <Heart size={26} />
                      ) : idx === 2 ? (
                        <Baby size={26} />
                      ) : (
                        <Activity size={26} />
                      )}
                    </span>
                    <h3>{spec.title}</h3>
                    <p className="line-clamp-3">{spec.short_description || spec.overview}</p>
                    <Link
                      to={`/specialties/${spec.slug}`}
                      className="service-link"
                    >
                      <span>Discover department</span>
                      <i>↗</i>
                    </Link>
                  </article>
                ))
              : [
                  { title: 'Fertility & IVF', desc: 'Personalized fertility pathways with advanced IVF and ICSI treatment, delivered with privacy and compassion.' },
                  { title: 'Obstetrics & High-Risk Pregnancy', desc: 'Consultant-led pregnancy care with dedicated expertise for high-risk pregnancies and safe deliveries.' },
                  { title: 'Pediatrics & Neonatology', desc: 'Thoughtful pediatric consultations, preventive care, growth tracking and pediatric sick care.' },
                  { title: 'NICU & PICU Level-III', desc: 'Round-the-clock critical care infrastructure for newborns, premature infants and critically ill children.' },
                  { title: 'Gynecological Laparoscopy', desc: 'Modern minimally invasive keyhole surgeries for ovarian cysts, fibroids, and endometriosis.' },
                  { title: 'Preventive Well-Woman Care', desc: 'Cervical cancer screening, PCOS management, adolescent health and menopause support.' },
                ].map((item, idx) => (
                  <article
                    className={`service-card ${idx === 0 ? 'featured' : ''}`}
                    key={idx}
                  >
                    <span className="service-num">0{idx + 1}</span>
                    <span className="service-icon">
                      {idx === 0 ? (
                        <Microscope size={26} />
                      ) : idx === 1 ? (
                        <Heart size={26} />
                      ) : (
                        <Baby size={26} />
                      )}
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                    <Link to="/specialties" className="service-link">
                      <span>Explore treatment</span>
                      <i>↗</i>
                    </Link>
                  </article>
                ))}
          </div>

          <div className="mt-8 text-center">
            <Link to="/specialties" className="btn btn-dark">
              <span>View all specialties</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. STATS BANNER */}
      <section className="stats" id="stats">
        <div className="container stats-grid">
          <div className="stat">
            <strong>4.2/5</strong>
            <span>Patient review rating</span>
          </div>
          <div className="stat">
            <strong>24/7</strong>
            <span>Emergency availability</span>
          </div>
          <div className="stat">
            <strong>6+</strong>
            <span>Integrated specialities</span>
          </div>
          <div className="stat">
            <strong>10+</strong>
            <span>Cashless TPA partners</span>
          </div>
        </div>
      </section>

      {/* 7. DOCTORS SECTION */}
      <section className="section doctor-section" id="doctors">
        <div className="container doctor-layout">
          <div className="doctor-intro">
            <div className="eyebrow">People behind the care</div>
            <h2>Experts who listen first.</h2>
            <p className="mb-6">
              Meet a multidisciplinary team united by evidence, empathy and a commitment to making healthcare understandable.
            </p>
            <Link to="/doctors" className="btn btn-dark">
              <span>Meet all doctors</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          <div>
            <div className="doctor-list">
              {doctors.length > 0
                ? doctors.slice(0, 4).map((doc) => (
                    <article className="doctor profile-card" key={doc.id}>
                      <img
                        src={doc.photo_url || doc.profile_photo || IMAGES.patient}
                        alt={doc.name}
                      />
                      <div>
                        <h3>
                          <Link to={`/doctors/${doc.slug}`}>{doc.name}</Link>
                        </h3>
                        <p>
                          {doc.designation || 'Consultant'} · {doc.experience_years ? `${doc.experience_years}+ years experience` : 'Senior Specialist'}
                        </p>
                        <p className="text-xs mt-1 text-[#546c7c]">
                          <strong>Qualifications:</strong> {doc.qualifications || 'MBBS, MD'}
                        </p>
                        <p className="text-xs text-[#546c7c]">
                          <strong>OPD Timings:</strong> {doc.opd_timings || '10:00 AM – 2:00 PM, 5:00 PM – 8:00 PM'}
                        </p>
                        <div className="doctor-tags">
                          <span className="tag">Consultant</span>
                          <span className="tag">Appointments open</span>
                        </div>
                        <div className="profile-actions">
                          <Link
                            className="btn btn-soft"
                            to={`/doctors/${doc.slug}`}
                          >
                            View full profile
                          </Link>
                          <Link
                            className="btn btn-dark"
                            to={`/book-appointment?doctor=${encodeURIComponent(doc.name)}`}
                          >
                            Book consultation
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))
                : [
                    { name: 'Dr. S. Sreemantha Rao', role: 'Chief Fertility & IVF Specialist', exp: '15+ years experience', qual: 'MBBS, MS (OBG), Fellowship in Reproductive Medicine' },
                    { name: 'Dr. K. Ananya Reddy', role: 'Senior Obstetrician & Gynecologist', exp: '12+ years experience', qual: 'MBBS, DGO, DNB (Obstetrics & Gynecology)' },
                    { name: 'Dr. V. Rajesh Kumar', role: 'Consultant Pediatrician & Neonatologist', exp: '10+ years experience', qual: 'MBBS, MD (Pediatrics), Fellowship in Neonatology' },
                  ].map((doc, idx) => (
                    <article className="doctor profile-card" key={idx}>
                      <img src={IMAGES.patient} alt={doc.name} />
                      <div>
                        <h3><Link to="/doctors">{doc.name}</Link></h3>
                        <p>{doc.role} · {doc.exp}</p>
                        <p className="text-xs mt-1 text-[#546c7c]"><strong>Qualifications:</strong> {doc.qual}</p>
                        <p className="text-xs text-[#546c7c]"><strong>OPD timings:</strong> 10:00 AM – 2:00 PM, 5:00 PM – 8:00 PM</p>
                        <div className="doctor-tags">
                          <span className="tag">Consultant</span>
                          <span className="tag">Appointments open</span>
                        </div>
                        <div className="profile-actions">
                          <Link className="btn btn-soft" to="/doctors">View full profile</Link>
                          <Link className="btn btn-dark" to="/book-appointment">Book consultation</Link>
                        </div>
                      </div>
                    </article>
                  ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. FACILITIES SECTION */}
      <section className="section facilities" id="facilities">
        <div className="container">
          <div className="facility-stage">
            <div className="facility-image">
              <img
                src={activeFacility.image_url || IMAGES.nicu}
                alt={activeFacility.name}
              />
            </div>
            <div className="facility-content">
              <div className="eyebrow">Designed around recovery</div>
              <h2>{activeFacility.name}</h2>
              <p>{activeFacility.description || activeFacility.short_description}</p>

              <div className="facility-tabs">
                {(facilities.length > 0 ? facilities : [
                  { name: 'Cleanroom Embryology Lab', short_description: 'Class-10,000 Air Purity with VOC Filters' },
                  { name: 'Level-III Neonatal ICU (NICU)', short_description: 'Advanced Ventilators, Warmers & LED Phototherapy' },
                  { name: 'Modular Operation Theatres', short_description: 'Laminar Airflow & Full Olympus HD Laparoscopy' },
                  { name: 'Mother & Baby Suites', short_description: 'Hygienic Private Inpatient Rooms with 24/7 Monitoring' },
                ]).slice(0, 4).map((f, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`facility-tab ${selectedFacilityIdx === idx ? 'active' : ''}`}
                    onClick={() => setSelectedFacilityIdx(idx)}
                  >
                    <b>0{idx + 1}</b>
                    <strong>{f.name}</strong>
                    <span>↗</span>
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <Link to="/facilities" className="btn btn-outline">
                  <span>Explore all facilities</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CARE JOURNEY */}
      <section className="section" id="journey">
        <div className="container">
          <div className="journey-head">
            <div className="eyebrow">A simpler care journey</div>
            <h2>From first hello to feeling better.</h2>
            <p>Clear steps, fewer worries, and a team that keeps you informed throughout.</p>
          </div>

          <div className="journey-grid">
            <article className="step">
              <div className="step-num">
                <CalendarCheck size={26} />
              </div>
              <h3>1. Book your visit</h3>
              <p>Choose your preferred specialist and consultation slot online or over the phone.</p>
            </article>

            <article className="step">
              <div className="step-num">
                <MessageSquare size={26} />
              </div>
              <h3>2. Meet your doctor</h3>
              <p>Share your symptoms and history in an unhurried, private clinical consultation.</p>
            </article>

            <article className="step">
              <div className="step-num">
                <FileHeart size={26} />
              </div>
              <h3>3. Personal care plan</h3>
              <p>Receive clear diagnostic insights, transparent estimates, and an individualized roadmap.</p>
            </article>

            <article className="step">
              <div className="step-num">
                <HandHeart size={26} />
              </div>
              <h3>4. Ongoing support</h3>
              <p>Stay connected with our care coordinator and clinical team after your appointment.</p>
            </article>
          </div>
        </div>
      </section>

      {/* 10. TESTIMONIALS */}
      <section className="section testimonial-section" id="testimonials">
        <div className="container testimonial-wrap">
          <div className="patient-collage">
            <img
              className="main-patient"
              src={IMAGES.patient}
              alt="Care team at Sreemantha"
            />
            <div className="rating-float">
              <strong>4.2</strong>
              <div className="stars">★★★★★</div>
              <p>Loved by families across Khammam</p>
            </div>
          </div>

          <div className="testimonial">
            <div className="eyebrow">Patient stories</div>
            <div className="quote-mark" aria-hidden="true">“</div>
            <blockquote aria-live="polite">{activeStory.text}</blockquote>
            <div className="testimonial-person">
              <div>
                <strong>{activeStory.name}</strong>
                <span>{activeStory.meta}</span>
              </div>
              <div className="testimonial-nav">
                <button
                  type="button"
                  className="round-btn"
                  aria-label="Previous story"
                  onClick={() =>
                    setStoryIdx((storyIdx + TESTIMONIALS.length - 1) % TESTIMONIALS.length)
                  }
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  className="round-btn"
                  aria-label="Next story"
                  onClick={() => setStoryIdx((storyIdx + 1) % TESTIMONIALS.length)}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. EMPANELLED INSURANCE & CASHLESS PARTNERS (TESTED SELECTOR) */}
      <section className="insurance-strip">
        <SlidingInsuranceStrip />
      </section>

      {/* 12. 24/7 EMERGENCY STRIP */}
      <aside className="emergency-strip">
        <div className="container">
          <div>
            <strong>24/7 Emergency Care</strong>
            <p>
              For urgent maternal, neonatal, and pediatric care, call the hospital casualty desk directly. Round-the-clock emergency team on duty.
            </p>
            <span>
              Near Priyadarshini Degree College, Nehru Nagar, Wyra Road, Khammam · Open 24 hours
            </span>
          </div>
          <a
            className="btn btn-light !text-[var(--deep)] font-extrabold shadow-md hover:bg-[var(--lime)]"
            href={emergencyHref}
            style={{ color: '#073d59', backgroundColor: '#ffffff', fontWeight: 800 }}
          >
            <PhoneCall size={16} className="text-[var(--coral)]" />
            <span style={{ color: '#073d59', fontWeight: 800 }}>Call: {emergency}</span>
          </a>
        </div>
      </aside>

      {/* 13. CONTACT & LOCATION CARD */}
      <section className="contact-section" id="contact">
        <div className="container pb-16">
          <div className="contact-card">
            <div className="contact-copy">
              <div className="eyebrow">We’re here, always</div>
              <h2>Your care can start today.</h2>
              <p>
                Appointments are recommended for OPD consultations. Emergency, neonatal and pediatric critical care are available around the clock.
              </p>

              <div className="contact-actions">
                <a className="btn btn-light" href={phoneHref}>
                  <span>Call {phone}</span>
                  <Phone size={16} />
                </a>
                <Link to="/book-appointment" className="btn btn-outline">
                  <span>Book appointment</span>
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="contact-meta">
                <div>
                  <small>Visit us</small>
                  <span>{info.address || 'Near Priyadarshini Degree College, Nehru Nagar, Khammam, Telangana 507001'}</span>
                </div>
                <div>
                  <small>Consultation Hours</small>
                  <span>OPD: 9:00 AM – 8:00 PM · Emergency: 24/7</span>
                </div>
              </div>
            </div>

            <div className="location-map">
              <div className="map-placeholder">
                <MapPin size={38} className="text-[var(--teal)] mb-2" />
                <h3>Sreemantha Hospital</h3>
                <p className="text-sm max-w-xs">{info.address || 'Nehru Nagar, Khammam, Telangana'}</p>
                <a
                  className="btn btn-dark mt-4"
                  href={`https://maps.google.com/?q=${encodeURIComponent('Sreemantha Hospital, Nehru Nagar, Khammam')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Open in Google Maps</span>
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
