import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const Footer: React.FC = () => {
  const { settings } = useSettings();
  const info = settings.hospital_info || {};

  return (
    <footer className="bg-[#073d59] text-white pt-16 pb-8 border-t border-white/10 relative overflow-hidden">
      {/* Background glow decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#006c93]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#bc1169]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <img
                src="/logo.svg"
                alt="Sreemantha Hospital"
                className="h-12 w-auto bg-white/90 p-1.5 rounded-xl shadow-md"
              />
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm mb-6">
              {info.subtitle ||
                'Leading fertility, reproductive medicine, maternity, neonatal and pediatric care center in Khammam. Providing compassionate healthcare with cutting-edge medical technology.'}
            </p>

            <div className="flex flex-col gap-2.5 text-xs text-slate-200">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#05a5ea] shrink-0 mt-0.5" />
                <span>{info.address || 'Priyadarshini Degree/College Road, Nehru Nagar, Khammam, Telangana 507001'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#e32a8c] shrink-0" />
                <span>Appointments: {info.phone || '+91 96667 81779'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-300 shrink-0" />
                <span>{info.email || 'care@sreemanthahospital.com'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Emergency Care & NICU: Open 24 Hours / 7 Days</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-cyan-200 mb-4 font-heading">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><Link to="/" className="hover:text-white transition flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-[#05a5ea]" /> Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-[#05a5ea]" /> About Us</Link></li>
              <li><Link to="/facilities" className="hover:text-white transition flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-[#05a5ea]" /> Hospital Facilities</Link></li>
              <li><Link to="/specialties" className="hover:text-white transition flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-[#05a5ea]" /> Specialties</Link></li>
              <li><Link to="/treatments" className="hover:text-white transition flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-[#05a5ea]" /> Treatments & Services</Link></li>
              <li><Link to="/doctors" className="hover:text-white transition flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-[#05a5ea]" /> Medical Specialists</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-[#05a5ea]" /> Photo & Video Gallery</Link></li>
              <li><Link to="/insights" className="hover:text-white transition flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-[#05a5ea]" /> Health Insights & Blog</Link></li>
            </ul>
          </div>

          {/* Clinical Departments */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-pink-300 mb-4 font-heading">
              Departments
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><Link to="/specialties/fertility-ivf" className="hover:text-white transition">Fertility & Advanced IVF</Link></li>
              <li><Link to="/specialties/obstetrics-gynecology" className="hover:text-white transition">High-Risk Obstetrics</Link></li>
              <li><Link to="/specialties/pediatrics-neonatology" className="hover:text-white transition">Pediatrics & Level-III NICU</Link></li>
              <li><Link to="/specialties/fetal-medicine" className="hover:text-white transition">Fetal Medicine & Diagnostics</Link></li>
              <li><Link to="/facilities/cleanroom-embryology-lab" className="hover:text-white transition">Cleanroom Embryology Lab</Link></li>
              <li><Link to="/facilities/modular-operation-theatre" className="hover:text-white transition">Laparoscopic OT</Link></li>
            </ul>
          </div>

          {/* Patient Care & Legal */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300 mb-4 font-heading">
              Patient Care
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><Link to="/book-appointment" className="hover:text-white font-medium text-cyan-200 transition">Book Doctor Appointment</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Hospital Route & Contact</Link></li>
              <li><span className="text-slate-400">Cashless Insurance TPA Desk</span></li>
              <li className="pt-3">
                <Link
                  to="/staff-login"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
                  Staff Portal Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} Sreemantha IVF and Child Care Hospital. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Delivering care with</span>
            <Heart className="w-3.5 h-3.5 text-[#e32a8c] fill-[#e32a8c]" />
            <span>in Khammam, Telangana</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
