import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Heart, Users, Activity, CheckCircle, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'About Us' }]} />

        {/* Hero */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200 mb-12">
          <span className="eyebrow mb-3">Institutional Overview</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#073d59] font-heading mb-6 max-w-3xl">
            Sreemantha Hospital: A Benchmark in Fertility, Maternal & Pediatric Excellence
          </h1>
          <p className="text-base text-[#637371] leading-relaxed max-w-4xl mb-6">
            Situated on Priyadarshini Degree College Road in Nehru Nagar, Khammam, Sreemantha Hospital was founded with a singular purpose: to deliver compassionate, technologically advanced, and evidence-based clinical care for families at every stage of their reproductive and parenting journey.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-slate-100">
            <div>
              <span className="text-2xl font-black text-[#bc1169] block font-heading">15,000+</span>
              <span className="text-xs text-slate-500 font-medium">Successful Deliveries & IVF</span>
            </div>
            <div>
              <span className="text-2xl font-black text-[#006c93] block font-heading">98%</span>
              <span className="text-xs text-slate-500 font-medium">Cumulative IVF Success</span>
            </div>
            <div>
              <span className="text-2xl font-black text-emerald-600 block font-heading">24/7</span>
              <span className="text-xs text-slate-500 font-medium">Level-III Neonatal ICU</span>
            </div>
            <div>
              <span className="text-2xl font-black text-amber-600 block font-heading">100%</span>
              <span className="text-xs text-slate-500 font-medium">Cashless TPA Support</span>
            </div>
          </div>
        </div>

        {/* Mission, Vision & Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#006c93]/10 text-[#006c93] flex items-center justify-center mb-5">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#073d59] font-heading mb-3">Our Mission</h3>
              <p className="text-sm text-[#637371] leading-relaxed">
                To provide compassionate, comprehensive, and patient-centered reproductive medicine, obstetrics, and pediatric care with the highest ethical and clinical standards.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#bc1169]/10 text-[#bc1169] flex items-center justify-center mb-5">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#073d59] font-heading mb-3">Our Vision</h3>
              <p className="text-sm text-[#637371] leading-relaxed">
                To be the most trusted and innovative center of excellence for fertility solutions, maternal health, and neonatal survival in the region.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#073d59] font-heading mb-3">Our Core Values</h3>
              <ul className="text-xs text-[#637371] space-y-2 mt-2">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Integrity & Transparent Ethics</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Patient-First Compassion</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Advanced Embryology Standards</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Continuous Clinical Training</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Infrastructure Highlights */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200 mb-12">
          <span className="eyebrow mb-3">World-Class Infrastructure</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#073d59] font-heading mb-6">
            Equipped with Cutting-Edge Medical Technology
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-[#637371] leading-relaxed">
            <div>
              <h4 className="text-base font-bold text-[#073d59] font-heading mb-2">Clean-Room Embryology Lab</h4>
              <p className="mb-4">
                Our IVF laboratory features medical-grade positive air pressure, HEPA VOC air purification systems, and micromanipulator ICSI workstations that replicate the natural womb environment for optimal blastocyst formation.
              </p>
              <h4 className="text-base font-bold text-[#073d59] font-heading mb-2">Level-III Neonatal Intensive Care</h4>
              <p>
                Equipped with infant ventilators, double-surface phototherapy, multi-parameter vital monitors, and radiant warmers for the care of extremely low-birth-weight babies.
              </p>
            </div>
            <div>
              <h4 className="text-base font-bold text-[#073d59] font-heading mb-2">Modular Laparoscopic Operation Theatres</h4>
              <p className="mb-4">
                Advanced surgical suites with 4K Karl Storz laparoscopy towers, harmonic scalpels, and specialized fetal monitoring systems for safe cesarean and gynecological surgeries.
              </p>
              <h4 className="text-base font-bold text-[#073d59] font-heading mb-2">Deluxe Maternity Suites & Daycare</h4>
              <p>
                Spacious, hygienic, private labor delivery recovery (LDR) rooms designed to provide privacy, quiet, and comfort for the new mother and baby.
              </p>
            </div>
          </div>
        </div>

        {/* CTA banner */}
        <div className="bg-gradient-to-r from-[#006c93] to-[#bc1169] text-white p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold font-heading mb-1">Meet Our Specialists</h3>
            <p className="text-xs sm:text-sm text-slate-200">Book an appointment or visit Sreemantha Hospital in Khammam today.</p>
          </div>
          <Link
            to="/doctors"
            className="bg-white text-[#073d59] px-6 py-3 rounded-full font-bold text-sm shadow-md hover:scale-105 transition shrink-0"
          >
            Consult Our Doctors →
          </Link>
        </div>
      </div>
    </div>
  );
};
