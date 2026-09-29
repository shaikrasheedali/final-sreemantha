import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Baby, Sparkles, Activity, CalendarCheck } from 'lucide-react';

export const TrustBar: React.FC = () => {
  const cards = [
    {
      icon: Activity,
      title: '24/7 Emergency & ICU',
      subtitle: 'Immediate trauma, critical maternal, and neonatal emergency rescue.',
      link: '/contact',
      color: 'from-blue-500/10 to-teal-500/10 text-[#006c93] border-blue-100',
    },
    {
      icon: Sparkles,
      title: 'Fertility & IVF Center',
      subtitle: 'Advanced clean-room embryology lab with highest IVF success rate in Khammam.',
      link: '/specialties/fertility-ivf',
      color: 'from-pink-500/10 to-rose-500/10 text-[#bc1169] border-pink-100',
    },
    {
      icon: HeartPulse,
      title: 'Maternity & Obstetrics',
      subtitle: 'Compassionate prenatal, painless delivery, and high-risk pregnancy care.',
      link: '/specialties/obstetrics-gynecology',
      color: 'from-amber-500/10 to-orange-500/10 text-amber-700 border-amber-100',
    },
    {
      icon: Baby,
      title: 'Level-III NICU & PICU',
      subtitle: 'Expert neonatologists caring for premature babies with dedicated ventilators.',
      link: '/specialties/pediatrics-neonatology',
      color: 'from-cyan-500/10 to-sky-500/10 text-[#05a5ea] border-cyan-100',
    },
    {
      icon: CalendarCheck,
      title: 'Book Consultation',
      subtitle: 'Easy appointment scheduling with senior obstetricians & fertility specialists.',
      link: '/book-appointment',
      color: 'from-emerald-500/10 to-teal-500/10 text-emerald-700 border-emerald-100',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 -mt-10 sm:-mt-12 relative z-30 mb-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className={`bg-white/95 backdrop-blur-md p-5 rounded-2xl border ${card.color} shadow-lg hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between group`}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#16374c] group-hover:text-[#006c93] transition font-heading">
                  {card.title}
                </h3>
                <p className="text-xs text-[#637371] leading-relaxed mt-1.5">
                  {card.subtitle}
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#006c93] mt-3 flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn more →
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
