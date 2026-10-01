import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Sparkles,
  ShieldCheck,
  Check,
  Calendar,
  Phone,
  ArrowRight,
  ArrowUpRight,
  Baby,
  Stethoscope,
  Building2,
  Award,
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useSettings } from '../context/SettingsContext';

export const AboutPage: React.FC = () => {
  const { settings } = useSettings();
  const info = settings.hospital_info || {};
  const phone = info.phone || '+91 96667 81779';
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, '')}`;

  return (
    <div className="sr-section" style={{ paddingTop: 40 }}>
      <div className="sr-container">
        <Breadcrumbs items={[{ label: 'About Sreemantha' }]} />

        {/* 1. Hero Overview */}
        <div className="sr-heading-row mb-12">
          <div>
            <span className="sr-kicker">Our Story &amp; Purpose</span>
            <h1 className="sr-display sr-heading mt-3">
              Where scientific precision<br />
              meets <em>heartfelt understanding.</em>
            </h1>
          </div>
          <p className="sr-copy max-w-md">
            Founded with the belief that starting a family is among life’s most profound milestones, Sreemantha Hospital in Khammam brings together reproductive science, maternal care and neonatology under one roof.
          </p>
        </div>

        {/* Hero Visual Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-24">
          <div className="lg:col-span-7">
            <div className="sr-media rounded-3xl overflow-hidden shadow-sm h-[420px] sm:h-[480px]">
              <img
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?w=1200&auto=format&fit=crop&q=85"
                alt="Sreemantha Hospital clinical leadership and care team"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-10 rounded-2xl bg-[#e8eee5] border border-[#cbd7c6]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8f4160] block mb-2">
                A Khammam Benchmark
              </span>
              <h2 className="sr-display text-3xl mb-4 text-[#183f3d]">
                Care centered around you, not just protocols.
              </h2>
              <p className="sr-copy text-sm leading-relaxed mb-6">
                From our cleanroom embryology labs to our round-the-clock Level-III NICU, every space is designed to give you medical reassurance and gentle emotional comfort.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#cbd7c6]">
              <div>
                <span className="font-serif text-3xl text-[#183f3d] font-bold block">15,000+</span>
                <span className="text-[11px] text-[#596966] font-medium">Families Assisted</span>
              </div>
              <div>
                <span className="font-serif text-3xl text-[#8f4160] font-bold block">98%</span>
                <span className="text-[11px] text-[#596966] font-medium">IVF Cumulative Success</span>
              </div>
              <div>
                <span className="font-serif text-3xl text-[#183f3d] font-bold block">24/7</span>
                <span className="text-[11px] text-[#596966] font-medium">Level-III NICU</span>
              </div>
              <div>
                <span className="font-serif text-3xl text-[#8f4160] font-bold block">18+</span>
                <span className="text-[11px] text-[#596966] font-medium">Years of Leadership</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Core Pillars / Values */}
        <div className="mb-24">
          <div className="sr-heading-row">
            <div>
              <span className="sr-kicker">Guiding Principles</span>
              <h2 className="sr-display sr-heading mt-2">
                The values that shape<br />
                <em>every decision we make.</em>
              </h2>
            </div>
            <Link to="/doctors" className="sr-text-link">
              Meet our team
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-xl bg-[#fffefb] border border-[#e0e5dd] flex flex-col justify-between">
              <div>
                <span className="font-serif text-3xl text-[#8a9b90] block mb-4">01</span>
                <h3 className="text-xl font-medium text-[#183f3d] mb-3">Honest, Clear Answers</h3>
                <p className="sr-copy text-sm">
                  We demystify fertility and maternal health. You will always know why a test is recommended, what your options are, and what the realistic outcomes entail.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-xl bg-[#fffefb] border border-[#e0e5dd] flex flex-col justify-between">
              <div>
                <span className="font-serif text-3xl text-[#8a9b90] block mb-4">02</span>
                <h3 className="text-xl font-medium text-[#183f3d] mb-3">Uncompromising Lab Rigor</h3>
                <p className="sr-copy text-sm">
                  Our cleanroom embryology suite maintains HEPA filtration, strict temperature gradients, and micromanipulation technology to give every embryo the optimal beginning.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-xl bg-[#fffefb] border border-[#e0e5dd] flex flex-col justify-between">
              <div>
                <span className="font-serif text-3xl text-[#8a9b90] block mb-4">03</span>
                <h3 className="text-xl font-medium text-[#183f3d] mb-3">Warmth at Every Step</h3>
                <p className="sr-copy text-sm">
                  No couple is just a case number. Whether you are navigating your first fertility consultation or welcoming your baby, our nursing and medical team listens with empathy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Clinical Leadership & Standards */}
        <div className="p-8 sm:p-14 rounded-2xl bg-[#183f3d] text-[#f8f5ec] mb-24 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d0ddc2] block mb-3">
                Clinical Philosophy
              </span>
              <blockquote className="font-serif text-2xl sm:text-3xl leading-snug text-[#fffdf5] mb-6">
                “Advanced medical technology only fulfills its true purpose when paired with deep human empathy. Our commitment in Khammam is to provide every family with the highest international clinical standards, right close to home.”
              </blockquote>
              <div>
                <strong className="text-base text-white block">Dr. S. Sreemantha Rao</strong>
                <span className="text-xs text-[#d0ddc2]">
                  Managing Director &amp; Chief Fertility Specialist · Sreemantha Hospital
                </span>
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-3">
              <div className="p-4 rounded-lg bg-[#224b48] border border-[#305f5c]">
                <div className="flex items-center gap-2 text-[#d0ddc2] text-xs font-semibold uppercase tracking-wider mb-1">
                  <ShieldCheck size={16} /> Certified Quality
                </div>
                <p className="text-xs text-[#d3dfdb] m-0">
                  NABH-oriented protocols, sterile air handling, continuous embryology monitoring.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-[#224b48] border border-[#305f5c]">
                <div className="flex items-center gap-2 text-[#d0ddc2] text-xs font-semibold uppercase tracking-wider mb-1">
                  <Baby size={16} /> Level-III NICU Care
                </div>
                <p className="text-xs text-[#d3dfdb] m-0">
                  Advanced neonatal ventilators, LED phototherapy, and dedicated neonatologists 24/7.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Milestone Timeline */}
        <div className="mb-24">
          <span className="sr-kicker">Our Journey</span>
          <h2 className="sr-display sr-heading mt-2 mb-10">
            Milestones of trust<br />
            <em>across two decades.</em>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-[#fffefb] border border-[#e0e5dd]">
              <span className="text-xs font-bold text-[#8f4160] tracking-wider block mb-2">2008</span>
              <h3 className="text-base font-semibold text-[#183f3d] mb-2">Foundation</h3>
              <p className="sr-copy text-xs">
                Inaugurated dedicated women and maternal health clinic in Khammam with a focus on high-risk obstetrics.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-[#fffefb] border border-[#e0e5dd]">
              <span className="text-xs font-bold text-[#8f4160] tracking-wider block mb-2">2014</span>
              <h3 className="text-base font-semibold text-[#183f3d] mb-2">Cleanroom IVF Suite</h3>
              <p className="sr-copy text-xs">
                Commissioned advanced cleanroom embryology lab with laser hatching, ICSI, and vitrification.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-[#fffefb] border border-[#e0e5dd]">
              <span className="text-xs font-bold text-[#8f4160] tracking-wider block mb-2">2019</span>
              <h3 className="text-base font-semibold text-[#183f3d] mb-2">Level-III NICU</h3>
              <p className="sr-copy text-xs">
                Expanded state-of-the-art Neonatal Intensive Care Unit supporting extremely premature and critical newborns.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-[#fffefb] border border-[#e0e5dd]">
              <span className="text-xs font-bold text-[#8f4160] tracking-wider block mb-2">Today</span>
              <h3 className="text-base font-semibold text-[#183f3d] mb-2">15,000+ Journeys</h3>
              <p className="sr-copy text-xs">
                Recognized as the region’s premier fertility, maternity, and pediatric healthcare center.
              </p>
            </div>
          </div>
        </div>

        {/* 5. Final CTA Banner */}
        <div className="p-12 sm:p-16 rounded-2xl bg-[#e8eee5] border border-[#cbd7c6] text-center">
          <span className="sr-kicker">Start your conversation</span>
          <h2 className="sr-display sr-heading mt-3 mb-4">
            We are here to listen<br />
            and <em>guide you forward.</em>
          </h2>
          <p className="sr-copy max-w-xl mx-auto mb-8">
            Whether you are considering fertility guidance, seeking maternal care, or looking for expert pediatric advice, our doctors are ready to meet you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/book-appointment" className="sr-button">
              <Calendar size={17} />
              Book a consultation
              <ArrowUpRight size={16} />
            </Link>
            <a href={phoneHref} className="sr-button sr-button--outline">
              <Phone size={16} />
              Call us at {phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
