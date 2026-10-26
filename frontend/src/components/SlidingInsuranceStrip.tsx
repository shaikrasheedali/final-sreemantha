import React, { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { InsuranceProvider } from '../types';
import { api } from '../utils/api';

const fallbackProviders: InsuranceProvider[] = [
  { id: 1, name: 'Aditya Birla Health Insurance', type: 'Health Insurer', cashless_available: 1, logo_url: '/images/insurance/aditya-birla-health.webp', display_order: 1, status: 'active' },
  { id: 2, name: 'SBI General Insurance (Suraksha Aur Bharosa Dono)', type: 'General Insurer', cashless_available: 1, logo_url: '/images/insurance/sbi-general-insurance.webp', display_order: 2, status: 'active' },
  { id: 3, name: 'ICICI Lombard (Nibhaye Vaade)', type: 'General Insurer', cashless_available: 1, logo_url: '/images/insurance/icici-lombard.webp', display_order: 3, status: 'active' },
  { id: 4, name: 'Acko General Insurance', type: 'Digital Insurer', cashless_available: 1, logo_url: '/images/insurance/acko-general-insurance.webp', display_order: 4, status: 'active' },
  { id: 5, name: 'Bajaj Allianz', type: 'General Insurer', cashless_available: 1, logo_url: '/images/insurance/bajaj-allianz.webp', display_order: 5, status: 'active' },
  { id: 6, name: 'Star Health and Allied Insurance', type: 'Standalone Health Insurer', cashless_available: 1, logo_url: '/images/insurance/star-health.webp', display_order: 6, status: 'active' },
  { id: 7, name: 'Reliance General Insurance', type: 'General Insurer', cashless_available: 1, logo_url: '/images/insurance/reliance-general-insurance.webp', display_order: 7, status: 'active' },
  { id: 8, name: 'Max Bupa Health Insurance', type: 'Health Insurer', cashless_available: 1, logo_url: '/images/insurance/max-bupa-niva.webp', display_order: 8, status: 'active' },
  { id: 9, name: 'IFFCO-TOKIO General Insurance (Muskurate Raho)', type: 'General Insurer', cashless_available: 1, logo_url: '/images/insurance/iffco-tokio.webp', display_order: 9, status: 'active' },
  { id: 10, name: 'Safeway Insurance TPA Pvt. Ltd.', type: 'TPA', cashless_available: 1, logo_url: '/images/insurance/safeway-tpa.webp', display_order: 10, status: 'active' },
  { id: 11, name: 'Care Health Insurance', type: 'Health Insurer', cashless_available: 1, logo_url: '/images/insurance/care-health.webp', display_order: 11, status: 'active' },
  { id: 12, name: 'Tata AIG General Insurance', type: 'General Insurer', cashless_available: 1, logo_url: '/images/insurance/tata-aig.webp', display_order: 12, status: 'active' },
  { id: 13, name: 'Ericson Insurance TPA Pvt. Ltd.', type: 'TPA', cashless_available: 1, logo_url: '/images/insurance/ericson-tpa.webp', display_order: 13, status: 'active' },
  { id: 14, name: 'Liberty General Insurance', type: 'General Insurer', cashless_available: 1, logo_url: '/images/insurance/liberty-general.webp', display_order: 14, status: 'active' },
  { id: 15, name: 'Religare Health Insurance (Adv Health Hamesha)', type: 'Health Insurer', cashless_available: 1, logo_url: '/images/insurance/religare-health.webp', display_order: 15, status: 'active' },
  { id: 16, name: 'Future Generali Total Insurance Solutions', type: 'General Insurer', cashless_available: 1, logo_url: '/images/insurance/future-generali.webp', display_order: 16, status: 'active' },
  { id: 17, name: 'Genins India Insurance TPA LTD', type: 'TPA', cashless_available: 1, logo_url: '/images/insurance/genins-tpa.webp', display_order: 17, status: 'active' },
  { id: 18, name: 'Navi Insurance', type: 'General Insurer', cashless_available: 1, logo_url: '/images/insurance/navi-insurance.webp', display_order: 18, status: 'active' },
  { id: 19, name: 'Paramount Health Care', type: 'TPA', cashless_available: 1, logo_url: '/images/insurance/paramount-tpa.webp', display_order: 19, status: 'active' },
  { id: 20, name: 'MD India Health Insurance TPA', type: 'TPA', cashless_available: 1, logo_url: '/images/insurance/md-india-tpa.webp', display_order: 20, status: 'active' },
  { id: 21, name: 'Vidal Health (Third Party Administrator)', type: 'TPA', cashless_available: 1, logo_url: '/images/insurance/vidal-health-tpa.webp', display_order: 21, status: 'active' },
  { id: 22, name: 'Heritage Health (KH)', type: 'TPA', cashless_available: 1, logo_url: '/images/insurance/heritage-health-tpa.webp', display_order: 22, status: 'active' },
  { id: 23, name: 'ManipalCigna Health Insurance', type: 'Health Insurer', cashless_available: 1, logo_url: '/images/insurance/manipal-cigna.webp', display_order: 23, status: 'active' },
  { id: 24, name: 'Apollo Munich Health Insurance', type: 'Health Insurer', cashless_available: 1, logo_url: '/images/insurance/apollo-munich.webp', display_order: 24, status: 'active' },
];

export const SlidingInsuranceStrip: React.FC = () => {
  // Start empty so the fallback logos are never mounted and then replaced by
  // the database list. Chrome's lazy-load audit reports detached image nodes
  // when a lazy list is swapped after the first paint.
  const [providers, setProviders] = useState<InsuranceProvider[]>([]);

  useEffect(() => {
    let mounted = true;
    async function loadProviders() {
      try {
        const res = await api.get<{ providers: InsuranceProvider[] }>('/insurance');
        if (mounted) {
          setProviders(res.providers && res.providers.length > 0 ? res.providers : fallbackProviders);
        }
      } catch {
        if (mounted) setProviders(fallbackProviders);
      }
    }
    loadProviders();
    return () => {
      mounted = false;
    };
  }, []);

  const marqueeList = [...providers, ...providers];

  return (
    <div className="w-full py-14 sm:py-20 bg-[var(--cream)]/40 border-y border-[rgba(22,55,76,0.08)] overflow-hidden relative">
      {/* Section Header */}
      <div className="container mb-8 sm:mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-[rgba(22,55,76,0.08)]">
          <div>
            <div className="eyebrow mb-2">
              <ShieldCheck size={16} className="text-[var(--coral)] inline-block mr-1.5" />
              Cashless Healthcare &amp; TPA Network
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--ink)] tracking-tight font-display">
              Accepted Insurance &amp; TPA Partners
            </h2>
            <p className="text-sm text-[#476a7f] mt-1.5 max-w-xl">
              24/7 dedicated cashless hospitalization desk for seamless pre-authorization, zero-hassle documentation, and direct insurance claims assistance.
            </p>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white border border-[rgba(22,55,76,0.12)] shadow-xs shrink-0 self-start md:self-auto">
            <CheckCircle2 size={16} className="text-[var(--coral)] shrink-0" />
            <span className="text-xs font-bold text-[var(--deep)] tracking-tight">
              24/7 Cashless Desk &amp; Quick Pre-Auth
            </span>
          </div>
        </div>
      </div>

      {/* Marquee Track with edge fade masks */}
      <div className="relative w-full overflow-hidden">
        {/* Left & Right gradient fades for smooth marquee transition */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[var(--paper)] to-transparent z-10 hidden sm:block" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[var(--paper)] to-transparent z-10 hidden sm:block" />

        <div className="animate-marquee-track py-2 flex items-center gap-6">
          {marqueeList.map((provider, idx) => (
            <div
              key={`${provider.id}-${idx}`}
              className="shrink-0 transition-transform duration-200 hover:scale-[1.03]"
              title={provider.name}
            >
              {provider.logo_url ? (
                <img
                  src={provider.logo_url}
                  alt={provider.name}
                  width={320}
                  height={72}
                  loading="lazy"
                  decoding="async"
                  style={{ aspectRatio: '320 / 72' }}
                  className="h-16 sm:h-[72px] w-auto max-w-[320px] object-contain rounded-xl drop-shadow-xs hover:drop-shadow-md transition-shadow"
                />
              ) : (
                <div className="flex items-center gap-3.5 bg-white px-6 py-4 rounded-xl border border-[rgba(22,55,76,0.12)] shadow-xs min-w-[280px]">
                  <div className="w-10 h-10 rounded-lg bg-[var(--mint)] text-[var(--teal)] font-bold flex items-center justify-center shrink-0">
                    {provider.name.charAt(0)}
                  </div>
                  <span className="text-sm font-bold text-[var(--ink)] truncate">
                    {provider.name}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
