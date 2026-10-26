import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Calendar,
  Phone,
  ArrowUpRight,
  Baby,
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-24">
          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden shadow-xl relative bg-[var(--mint)] border border-[rgba(22,55,76,0.12)] flex items-center justify-center p-4 sm:p-6 h-full min-h-[480px] sm:min-h-[560px]">
              <img
                src="/images/sreemantha-hospital-facade.webp"
                alt="Sreemantha Hospital facade in Khammam"
                width={1047}
                height={1481}
                className="block h-auto w-auto max-h-[500px] sm:max-h-[560px] max-w-full rounded-2xl object-contain shadow-sm"
              />
            </div>
          </div>
          <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 rounded-2xl bg-[var(--mint)] border border-[rgba(22,55,76,0.12)]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--coral)] block mb-2">
                A Khammam Benchmark
              </span>
              <h2 className="sr-display text-3xl mb-4 text-[var(--ink)]">
                Care centered around you, not just protocols.
              </h2>
              <p className="sr-copy text-sm leading-relaxed mb-6 max-w-2xl">
                From our cleanroom embryology labs to our round-the-clock Level-III NICU, every space is designed to give you medical reassurance and gentle emotional comfort.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[rgba(22,55,76,0.12)]">
              <div>
                <span className="font-serif text-3xl text-[var(--ink)] font-bold block">15,000+</span>
                <span className="text-[11px] text-[#5a7d92] font-medium">Families Assisted</span>
              </div>
              <div>
                <span className="font-serif text-3xl text-[var(--coral)] font-bold block">98%</span>
                <span className="text-[11px] text-[#5a7d92] font-medium">IVF Cumulative Success</span>
              </div>
              <div>
                <span className="font-serif text-3xl text-[var(--ink)] font-bold block">24/7</span>
                <span className="text-[11px] text-[#5a7d92] font-medium">Level-III NICU</span>
              </div>
              <div>
                <span className="font-serif text-3xl text-[var(--coral)] font-bold block">18+</span>
                <span className="text-[11px] text-[#5a7d92] font-medium">Years of Leadership</span>
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
            <div className="p-8 rounded-xl bg-white border border-[rgba(22,55,76,0.12)] flex flex-col justify-between">
              <div>
                <span className="font-serif text-3xl text-[#8a9b90] block mb-4">01</span>
                <h3 className="text-xl font-medium text-[var(--ink)] mb-3">Honest, Clear Answers</h3>
                <p className="sr-copy text-sm">
                  We demystify fertility and maternal health. You will always know why a test is recommended, what your options are, and what the realistic outcomes entail.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-xl bg-white border border-[rgba(22,55,76,0.12)] flex flex-col justify-between">
              <div>
                <span className="font-serif text-3xl text-[#8a9b90] block mb-4">02</span>
                <h3 className="text-xl font-medium text-[var(--ink)] mb-3">Uncompromising Lab Rigor</h3>
                <p className="sr-copy text-sm">
                  Our cleanroom embryology suite maintains HEPA filtration, strict temperature gradients, and micromanipulation technology to give every embryo the optimal beginning.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-xl bg-white border border-[rgba(22,55,76,0.12)] flex flex-col justify-between">
              <div>
                <span className="font-serif text-3xl text-[#8a9b90] block mb-4">03</span>
                <h3 className="text-xl font-medium text-[var(--ink)] mb-3">Warmth at Every Step</h3>
                <p className="sr-copy text-sm">
                  No couple is just a case number. Whether you are navigating your first fertility consultation or welcoming your baby, our nursing and medical team listens with empathy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Clinical Leadership & Standards */}
        <div className="p-8 sm:p-14 rounded-2xl bg-[var(--deep)] text-[#f8f5ec] mb-24 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--lime)] block mb-3">
                Clinical Philosophy
              </span>
              <blockquote className="font-serif text-2xl sm:text-3xl leading-snug text-[#fffdf5] mb-6">
                “Advanced medical technology only fulfills its true purpose when paired with deep human empathy. Our commitment in Khammam is to provide every family with the highest international clinical standards, right close to home.”
              </blockquote>
              <div>
                <strong className="text-base text-white block">Dr. S. Sreemantha Rao</strong>
                <span className="text-xs text-[var(--lime)]">
                  Managing Director &amp; Chief Fertility Specialist · Sreemantha Hospital
                </span>
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-3">
              <div className="p-4 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xs">
                <div className="flex items-center gap-2 text-[var(--lime)] text-xs font-semibold uppercase tracking-wider mb-1">
                  <ShieldCheck size={16} /> Certified Quality
                </div>
                <p className="text-xs text-white leading-relaxed m-0 font-medium" style={{ color: '#ffffff' }}>
                  NABH-oriented protocols, sterile air handling, continuous embryology monitoring.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xs">
                <div className="flex items-center gap-2 text-[var(--lime)] text-xs font-semibold uppercase tracking-wider mb-1">
                  <Baby size={16} /> Level-III NICU Care
                </div>
                <p className="text-xs text-white leading-relaxed m-0 font-medium" style={{ color: '#ffffff' }}>
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
            <div className="p-6 rounded-xl bg-white border border-[rgba(22,55,76,0.12)]">
              <span className="text-xs font-bold text-[var(--coral)] tracking-wider block mb-2">2008</span>
              <h3 className="text-base font-semibold text-[var(--ink)] mb-2">Foundation</h3>
              <p className="sr-copy text-xs">
                Inaugurated dedicated women and maternal health clinic in Khammam with a focus on high-risk obstetrics.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-[rgba(22,55,76,0.12)]">
              <span className="text-xs font-bold text-[var(--coral)] tracking-wider block mb-2">2014</span>
              <h3 className="text-base font-semibold text-[var(--ink)] mb-2">Cleanroom IVF Suite</h3>
              <p className="sr-copy text-xs">
                Commissioned advanced cleanroom embryology lab with laser hatching, ICSI, and vitrification.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-[rgba(22,55,76,0.12)]">
              <span className="text-xs font-bold text-[var(--coral)] tracking-wider block mb-2">2019</span>
              <h3 className="text-base font-semibold text-[var(--ink)] mb-2">Level-III NICU</h3>
              <p className="sr-copy text-xs">
                Expanded state-of-the-art Neonatal Intensive Care Unit supporting extremely premature and critical newborns.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-[rgba(22,55,76,0.12)]">
              <span className="text-xs font-bold text-[var(--coral)] tracking-wider block mb-2">Today</span>
              <h3 className="text-base font-semibold text-[var(--ink)] mb-2">15,000+ Journeys</h3>
              <p className="sr-copy text-xs">
                Recognized as the region’s premier fertility, maternity, and pediatric healthcare center.
              </p>
            </div>
          </div>
        </div>

        {/* 5. Final CTA Banner */}
        <div className="p-12 sm:p-16 rounded-2xl bg-[var(--mint)] border border-[rgba(22,55,76,0.12)] text-center">
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
