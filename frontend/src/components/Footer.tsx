import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ArrowRight, ShieldCheck, Heart, ArrowUpRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const Footer: React.FC = () => {
  const { settings } = useSettings();
  const info = settings.hospital_info || {};
  const phone = info.phone || '+91 96667 81779';
  const emergency = info.emergency_hotline || '+91 88007 73362';
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, '')}`;
  const emergencyHref = `tel:${emergency.replace(/[^+\d]/g, '')}`;
  const activeFavicon = info.favicon_url || settings.favicon_url || '/favicon.svg';

  return (
    <footer className="bg-[#183f3d] text-[#f8f5ec] pt-20 pb-10 border-t border-[#265350] relative overflow-hidden">
      <div className="sr-container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-14 border-b border-[#2d5c58]">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-5 text-decoration-none">
              <div className="w-10 h-10 rounded-full bg-[#e8eee5] p-1.5 flex items-center justify-center border border-[#cbd7c6] shrink-0">
                <img
                  src={activeFavicon}
                  alt="Sreemantha Hospital Emblem"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-[22px] leading-tight text-[#fffdf5] tracking-tight">
                  Sreemantha
                </span>
                <span className="text-[9px] uppercase tracking-[0.18em] text-[#d0ddc2] font-bold">
                  Hospital · Khammam
                </span>
              </div>
            </Link>

            <p className="text-[#d3dfdb] text-sm leading-relaxed max-w-sm mb-6">
              {info.subtitle ||
                'Thoughtful fertility, maternity and newborn care in Khammam. Putting warmth, science and understanding at the heart of every step.'}
            </p>

            <div className="flex flex-col gap-3 text-xs text-[#d3dfdb]">
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-[#d0ddc2] shrink-0 mt-0.5" />
                <span>{info.address || 'Priyadarshini Degree College Road, Nehru Nagar, Khammam, Telangana 507001'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={15} className="text-[#d0ddc2] shrink-0" />
                <span>Consultations: <a href={phoneHref} className="hover:text-white transition underline-offset-2 hover:underline">{phone}</a></span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#f075b5] shrink-0 animate-pulse" />
                <span>Emergency 24/7 Helpline: <a href={emergencyHref} className="hover:text-white transition font-medium">{emergency}</a></span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={15} className="text-[#d0ddc2] shrink-0" />
                <span>{info.email || 'care@sreemanthahospital.com'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock size={15} className="text-[#d0ddc2] shrink-0" />
                <span>OPD: 9:00 AM – 8:00 PM | Casualty &amp; NICU: 24 Hours</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d0ddc2] block mb-4">
              Explore Care
            </span>
            <ul className="space-y-2.5 text-xs text-[#d3dfdb] list-none p-0 m-0">
              <li><Link to="/" className="hover:text-white transition flex items-center gap-1.5"><ArrowRight size={12} className="text-[#8f4160]" /> Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition flex items-center gap-1.5"><ArrowRight size={12} className="text-[#8f4160]" /> About Sreemantha</Link></li>
              <li><Link to="/specialties" className="hover:text-white transition flex items-center gap-1.5"><ArrowRight size={12} className="text-[#8f4160]" /> Clinical Specialties</Link></li>
              <li><Link to="/treatments" className="hover:text-white transition flex items-center gap-1.5"><ArrowRight size={12} className="text-[#8f4160]" /> Treatments &amp; Procedures</Link></li>
              <li><Link to="/doctors" className="hover:text-white transition flex items-center gap-1.5"><ArrowRight size={12} className="text-[#8f4160]" /> Meet our Specialists</Link></li>
              <li><Link to="/facilities" className="hover:text-white transition flex items-center gap-1.5"><ArrowRight size={12} className="text-[#8f4160]" /> Hospital Spaces &amp; Labs</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition flex items-center gap-1.5"><ArrowRight size={12} className="text-[#8f4160]" /> Visual Gallery</Link></li>
              <li><Link to="/insights" className="hover:text-white transition flex items-center gap-1.5"><ArrowRight size={12} className="text-[#8f4160]" /> Health Journal</Link></li>
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d0ddc2] block mb-4">
              Key Focus Areas
            </span>
            <ul className="space-y-2.5 text-xs text-[#d3dfdb] list-none p-0 m-0">
              <li><Link to="/specialties/fertility-reproductive-medicine" className="hover:text-white transition">IVF &amp; Reproductive Medicine</Link></li>
              <li><Link to="/specialties/obstetrics-high-risk-pregnancy" className="hover:text-white transition">Obstetrics &amp; High-Risk Care</Link></li>
              <li><Link to="/specialties/pediatrics-neonatal-care" className="hover:text-white transition">Pediatrics &amp; Level-III NICU</Link></li>
              <li><Link to="/specialties/advanced-gynecology-laparoscopy" className="hover:text-white transition">Advanced Laparoscopy</Link></li>
              <li><Link to="/facilities/cleanroom-embryology-lab" className="hover:text-white transition">Cleanroom Embryology Lab</Link></li>
              <li><Link to="/facilities/level-iii-nicu" className="hover:text-white transition">24/7 Neonatal Intensive Care</Link></li>
            </ul>
          </div>

          {/* Patient Care & Helplines */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d0ddc2] block mb-4">
              Patient Care
            </span>
            <ul className="space-y-3 text-xs text-[#d3dfdb] list-none p-0 m-0">
              <li>
                <Link
                  to="/book-appointment"
                  className="inline-flex items-center gap-1.5 text-white font-medium hover:text-[#d0ddc2] transition"
                >
                  <span>Book Consultation</span>
                  <ArrowUpRight size={12} />
                </Link>
              </li>
              <li><Link to="/contact" className="hover:text-white transition">Hospital Route &amp; Timings</Link></li>
              <li><span className="text-[#96aaa4]">Cashless Insurance TPA Desk 24/7</span></li>
              <li className="pt-3">
                <Link
                  to="/staff-login"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#244f4d] hover:bg-[#2e6260] text-white text-[11px] font-medium transition"
                >
                  <ShieldCheck size={13} className="text-[#d0ddc2]" />
                  Staff Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-7 flex flex-col sm:flex-row justify-between items-center text-xs text-[#9fb3ad] gap-3">
          <p>© {new Date().getFullYear()} Sreemantha IVF and Child Care Hospital. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Delivering care with</span>
            <Heart size={13} className="text-[#f075b5] fill-[#f075b5]" />
            <span>in Khammam, Telangana</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
