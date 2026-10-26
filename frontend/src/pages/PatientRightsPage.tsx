import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { HeartHandshake, ShieldCheck, UserCheck, Phone } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const PatientRightsPage: React.FC = () => {
  const { settings } = useSettings();
  const info = settings.hospital_info || {};
  const phone = info.phone || '+91 96667 81779';

  return (
    <div className="sr-section" style={{ paddingTop: 40 }}>
      <div className="sr-container max-w-4xl mx-auto">
        <Breadcrumbs items={[{ label: 'Legal & Compliance' }, { label: 'Patient Rights & Responsibilities' }]} />

        {/* Header */}
        <div className="mb-10 pb-6 border-b border-[rgba(22,55,76,0.12)]">
          <span className="sr-kicker">NABH Standards &amp; Ethical Clinical Care</span>
          <h1 className="sr-display sr-heading mt-2">
            Patient Rights &amp;<br />
            <em>Responsibilities Charter</em>
          </h1>
          <p className="sr-copy text-sm mt-3 max-w-2xl">
            Sreemantha Hospital adheres to compassionate, transparent, and ethical healthcare standards for every family in Khammam.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[var(--ink)] text-sm leading-relaxed">
          {/* Column 1: Patient Rights */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[rgba(22,55,76,0.12)] shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[rgba(22,55,76,0.08)]">
              <div className="w-10 h-10 rounded-xl bg-[var(--mint)] text-[var(--teal)] flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-lg font-bold text-[var(--ink)] m-0">Your Rights as a Patient</h2>
            </div>

            <div className="space-y-4">
              <div>
                <strong className="block text-xs font-bold text-[var(--teal)] uppercase tracking-wider mb-1">1. Respect &amp; Dignity</strong>
                <p className="sr-copy text-xs m-0">Right to considerate, respectful care given by competent personnel without discrimination based on caste, religion, gender, or socioeconomic status.</p>
              </div>
              <div>
                <strong className="block text-xs font-bold text-[var(--teal)] uppercase tracking-wider mb-1">2. Information &amp; Informed Consent</strong>
                <p className="sr-copy text-xs m-0">Right to receive complete, understandable clinical information regarding your diagnosis, procedure risks, treatment alternatives, and expected outcomes before consenting.</p>
              </div>
              <div>
                <strong className="block text-xs font-bold text-[var(--teal)] uppercase tracking-wider mb-1">3. Privacy &amp; Medical Confidentiality</strong>
                <p className="sr-copy text-xs m-0">Right to privacy during medical consultations, clinical examinations, labor delivery, and ultrasound investigations, as well as strict confidentiality of health records.</p>
              </div>
              <div>
                <strong className="block text-xs font-bold text-[var(--teal)] uppercase tracking-wider mb-1">4. Access to Medical Records</strong>
                <p className="sr-copy text-xs m-0">Right to access and obtain copies of diagnostic test reports, surgical notes, discharge summaries, and itemized billing statements.</p>
              </div>
              <div>
                <strong className="block text-xs font-bold text-[var(--teal)] uppercase tracking-wider mb-1">5. Second Medical Opinion</strong>
                <p className="sr-copy text-xs m-0">Right to seek a second clinical opinion without fear of compromise in the quality of your ongoing care.</p>
              </div>
              <div>
                <strong className="block text-xs font-bold text-[var(--teal)] uppercase tracking-wider mb-1">6. Transparent Tariffs</strong>
                <p className="sr-copy text-xs m-0">Right to transparent cost estimates before undergoing non-emergency elective procedures, surgeries, or IVF cycles.</p>
              </div>
            </div>
          </div>

          {/* Column 2: Patient Responsibilities */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[rgba(22,55,76,0.12)] shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[rgba(22,55,76,0.08)]">
              <div className="w-10 h-10 rounded-xl bg-[var(--mint)] text-[var(--coral)] flex items-center justify-center shrink-0">
                <UserCheck size={20} />
              </div>
              <h2 className="text-lg font-bold text-[var(--ink)] m-0">Your Responsibilities</h2>
            </div>

            <div className="space-y-4">
              <div>
                <strong className="block text-xs font-bold text-[var(--coral)] uppercase tracking-wider mb-1">1. Accurate Health History</strong>
                <p className="sr-copy text-xs m-0">Provide complete and accurate details regarding present complaints, past illnesses, hospitalizations, medications, allergies, and family medical histories.</p>
              </div>
              <div>
                <strong className="block text-xs font-bold text-[var(--coral)] uppercase tracking-wider mb-1">2. Adherence to Treatment</strong>
                <p className="sr-copy text-xs m-0">Follow the agreed therapeutic plan recommended by our healthcare team, and promptly communicate if unexpected complications or side effects occur.</p>
              </div>
              <div>
                <strong className="block text-xs font-bold text-[var(--coral)] uppercase tracking-wider mb-1">3. Respect for Hospital Staff &amp; Patients</strong>
                <p className="sr-copy text-xs m-0">Treat doctors, nursing staff, administrative personnel, and other patients with dignity, courtesy, and mutual respect.</p>
              </div>
              <div>
                <strong className="block text-xs font-bold text-[var(--coral)] uppercase tracking-wider mb-1">4. Hospital Hygiene &amp; Cleanroom Rules</strong>
                <p className="sr-copy text-xs m-0">Abide by infection control protocols, NICU visitor limitations, sterile cleanroom guidelines, and the hospital's zero-smoking policy.</p>
              </div>
              <div>
                <strong className="block text-xs font-bold text-[var(--coral)] uppercase tracking-wider mb-1">5. Financial Obligations</strong>
                <p className="sr-copy text-xs m-0">Fulfill agreed financial commitments promptly and provide accurate insurance documentation during admission.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-8 p-6 rounded-2xl bg-[var(--deep)] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <HeartHandshake size={24} className="text-[var(--lime)] shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-white m-0">Patient Relations &amp; Grievance Helpdesk</h3>
              <p className="text-xs text-[var(--mint)] m-0 mt-0.5">Need assistance or have feedback regarding your care experience?</p>
            </div>
          </div>
          <a
            href={`tel:${phone.replace(/[^+\d]/g, '')}`}
            className="sr-button sr-button--light text-xs py-2 px-4 shrink-0"
          >
            <Phone size={14} /> Call {phone}
          </a>
        </div>
      </div>
    </div>
  );
};
