import React, { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { InsuranceProvider } from '../types';
import { api } from '../utils/api';

const fallbackProviders: InsuranceProvider[] = [
  { id: 1, name: 'Star Health Insurance', type: 'Standalone Health Insurer', cashless_available: 1, claim_assistance_info: 'Direct Cashless TPA', display_order: 1, status: 'active' },
  { id: 2, name: 'HDFC ERGO General Insurance', type: 'General Insurer', cashless_available: 1, claim_assistance_info: 'Instant Pre-Auth Desk', display_order: 2, status: 'active' },
  { id: 3, name: 'ICICI Lombard Health', type: 'General Insurer', cashless_available: 1, claim_assistance_info: 'Fast Pre-Authorization', display_order: 3, status: 'active' },
  { id: 4, name: 'Care Health Insurance', type: 'Health Insurer', cashless_available: 1, claim_assistance_info: 'Maternity Cashless Cover', display_order: 4, status: 'active' },
  { id: 5, name: 'Bajaj Allianz General Insurance', type: 'General Insurer', cashless_available: 1, claim_assistance_info: 'NICU & Maternity Cashless', display_order: 5, status: 'active' },
  { id: 6, name: 'Niva Bupa Health Insurance', type: 'Health Insurer', cashless_available: 1, claim_assistance_info: 'Pre & Post Hospitalization', display_order: 6, status: 'active' },
  { id: 7, name: 'Medi Assist TPA', type: 'Third Party Administrator', cashless_available: 1, claim_assistance_info: 'Corporate & Retail TPA', display_order: 7, status: 'active' },
  { id: 8, name: 'Paramount Health TPA', type: 'TPA', cashless_available: 1, claim_assistance_info: 'Govt & Corporate Health Plans', display_order: 8, status: 'active' },
  { id: 9, name: 'New India Assurance', type: 'Public Sector Insurer', cashless_available: 1, claim_assistance_info: 'Cashless Network Empanelled', display_order: 9, status: 'active' },
  { id: 10, name: 'United India Insurance', type: 'Public Sector Insurer', cashless_available: 1, claim_assistance_info: 'Govt Healthcare & Cashless', display_order: 10, status: 'active' },
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

  const marqueeList = [...providers, ...providers];

  return (
    <div className="w-full py-6 overflow-hidden relative">
      <div className="container mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-[var(--coral)]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
            Empanelled Insurance &amp; Cashless Partners
          </span>
        </div>
        <span className="text-xs text-[#5a7d92] flex items-center gap-1.5 font-medium">
          <CheckCircle2 size={14} className="text-[var(--coral)]" />
          24/7 Cashless Desk &amp; Pre-Authorization Assistance
        </span>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="animate-marquee-track">
          {marqueeList.map((provider, idx) => (
            <div
              key={`${provider.id}-${idx}`}
              className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl border border-[rgba(22,55,76,0.12)] shrink-0 shadow-xs hover:shadow-md hover:border-[var(--teal)] transition-all cursor-default min-w-[300px]"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--mint)] to-white border border-[rgba(22,55,76,0.12)] flex items-center justify-center text-[var(--teal)] font-extrabold text-sm shrink-0 shadow-xs">
                {provider.name.charAt(0)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-[var(--ink)] whitespace-nowrap tracking-tight">
                  {provider.name}
                </span>
                <span className="text-xs text-[#5a7d92] mt-0.5 truncate">
                  {provider.claim_assistance_info || provider.type || 'Cashless Inpatient Partner'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
