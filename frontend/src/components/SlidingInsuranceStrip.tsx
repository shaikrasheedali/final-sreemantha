import React, { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { InsuranceProvider } from '../types';
import { api } from '../utils/api';

const fallbackProviders: InsuranceProvider[] = [
  { id: 1, name: 'Star Health Insurance', type: 'Standalone Health Insurer', cashless_available: 1, claim_assistance_info: 'Direct Cashless TPA', logo_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=120&auto=format&fit=crop&q=80', display_order: 1, status: 'active' },
  { id: 2, name: 'HDFC ERGO General Insurance', type: 'General Insurer', cashless_available: 1, claim_assistance_info: 'Instant Pre-Auth Desk', logo_url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=120&auto=format&fit=crop&q=80', display_order: 2, status: 'active' },
  { id: 3, name: 'ICICI Lombard Health', type: 'General Insurer', cashless_available: 1, claim_assistance_info: 'Fast Pre-Authorization', logo_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=120&auto=format&fit=crop&q=80', display_order: 3, status: 'active' },
  { id: 4, name: 'Care Health Insurance (Religare)', type: 'Health Insurer', cashless_available: 1, claim_assistance_info: 'Maternity Cashless Cover', logo_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=120&auto=format&fit=crop&q=80', display_order: 4, status: 'active' },
  { id: 5, name: 'Bajaj Allianz General Insurance', type: 'General Insurer', cashless_available: 1, claim_assistance_info: 'NICU & Maternity Cashless', logo_url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=120&auto=format&fit=crop&q=80', display_order: 5, status: 'active' },
  { id: 6, name: 'Niva Bupa Health Insurance', type: 'Health Insurer', cashless_available: 1, claim_assistance_info: 'Pre & Post Hospitalization', logo_url: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=120&auto=format&fit=crop&q=80', display_order: 6, status: 'active' },
  { id: 7, name: 'Medi Assist TPA', type: 'Third Party Administrator', cashless_available: 1, claim_assistance_info: 'Corporate & Retail TPA', logo_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=120&auto=format&fit=crop&q=80', display_order: 7, status: 'active' },
  { id: 8, name: 'Paramount Health TPA', type: 'TPA', cashless_available: 1, claim_assistance_info: 'Govt & Corporate Health Plans', logo_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=120&auto=format&fit=crop&q=80', display_order: 8, status: 'active' },
  { id: 9, name: 'New India Assurance', type: 'Public Sector Insurer', cashless_available: 1, claim_assistance_info: 'Cashless Network Empanelled', logo_url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=120&auto=format&fit=crop&q=80', display_order: 9, status: 'active' },
  { id: 10, name: 'United India Insurance', type: 'Public Sector Insurer', cashless_available: 1, claim_assistance_info: 'Govt Healthcare & Cashless', logo_url: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=120&auto=format&fit=crop&q=80', display_order: 10, status: 'active' },
];

export const SlidingInsuranceStrip: React.FC = () => {
  const [providers, setProviders] = useState<InsuranceProvider[]>(fallbackProviders);

  useEffect(() => {
    async function loadProviders() {
      try {
        const res = await api.get<{ providers: InsuranceProvider[] }>('/insurance');
        if (res.providers && res.providers.length > 0) {
          setProviders(res.providers);
        }
      } catch (err) {
        console.warn('Using fallback insurance list:', err);
      }
    }
    loadProviders();
  }, []);

  // Double the list to create a seamless infinite marquee
  const marqueeList = [...providers, ...providers];

  return (
    <div className="w-full bg-[#f1f7fc] border-y border-[#16374c]/10 py-6 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#006c93]/10 text-[#006c93] flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-[#006c93]" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#006c93] font-heading">
              Empanelled Insurance & Cashless Partners
            </h3>
            <p className="text-[11px] text-[#637371]">
              Hassle-free 24/7 cashless hospitalization & corporate insurance support at Sreemantha Hospital, Khammam.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-[#bc1169] bg-[#bc1169]/10 px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Pre-Authorization Desk 24/7
        </span>
      </div>

      {/* Infinite Marquee Track */}
      <div className="relative w-full overflow-hidden mask-fade-edges">
        <div className="animate-marquee flex items-center gap-6">
          {marqueeList.map((provider, idx) => (
            <div
              key={`${provider.id}-${idx}`}
              className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200/80 shadow-sm shrink-0 hover:shadow-md hover:border-[#006c93]/40 transition group cursor-default"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#e0f3fc] to-white border border-[#bfeaff] flex items-center justify-center text-[#073d59] font-black text-sm shrink-0">
                {provider.name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#16374c] group-hover:text-[#006c93] transition whitespace-nowrap">
                  {provider.name}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    Cashless Approved
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {provider.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
