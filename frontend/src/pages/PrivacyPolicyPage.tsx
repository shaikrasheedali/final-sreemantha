import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ShieldCheck, Lock, Eye, FileText, Phone, Mail, MapPin } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const PrivacyPolicyPage: React.FC = () => {
  const { settings } = useSettings();
  const info = settings.hospital_info || {};
  const phone = info.phone || '+91 96667 81779';
  const email = info.email || 'care@sreemanthahospital.com';

  return (
    <div className="sr-section" style={{ paddingTop: 40 }}>
      <div className="sr-container max-w-4xl mx-auto">
        <Breadcrumbs items={[{ label: 'Legal & Compliance' }, { label: 'Privacy Policy' }]} />

        {/* Header */}
        <div className="mb-10 pb-6 border-b border-[rgba(22,55,76,0.12)]">
          <span className="sr-kicker">Patient Data Protection &amp; Confidentiality</span>
          <h1 className="sr-display sr-heading mt-2">
            Privacy Policy &amp;<br />
            <em>Medical Data Governance</em>
          </h1>
          <p className="sr-copy text-sm mt-3 max-w-2xl">
            Effective Date: October 2026 · Sreemantha Hospital, Khammam, Telangana.
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-[var(--ink)] text-sm leading-relaxed">
          {/* Section 1: Introduction */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[rgba(22,55,76,0.12)] shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--mint)] text-[var(--teal)] flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-lg font-bold text-[var(--ink)] m-0">1. Commitment to Clinical Privacy</h2>
            </div>
            <p className="sr-copy mb-3">
              At Sreemantha Hospital (“Hospital”, “we”, “our”, or “us”), protecting the confidentiality and integrity of our patients’ health information is a fundamental clinical imperative. We provide advanced reproductive medicine, fertility treatments (IVF/ICSI), obstetrics, neonatal intensive care (NICU), and pediatrics.
            </p>
            <p className="sr-copy m-0">
              This Privacy Policy explains how we collect, process, store, and safeguard your personal and sensitive personal health information (SPHI) in compliance with the Digital Personal Data Protection Act (DPDP Act), the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, and applicable National Medical Commission (NMC) ethical directives.
            </p>
          </section>

          {/* Section 2: Information Collected */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[rgba(22,55,76,0.12)] shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--mint)] text-[var(--teal)] flex items-center justify-center shrink-0">
                <FileText size={20} />
              </div>
              <h2 className="text-lg font-bold text-[var(--ink)] m-0">2. Categories of Information We Collect</h2>
            </div>
            <p className="sr-copy mb-4">
              To provide personalized medical diagnostics and clinical care, we collect the following data points:
            </p>
            <ul className="list-disc pl-5 space-y-2 sr-copy">
              <li>
                <strong>Patient Identity Data:</strong> Full name, age, date of birth, gender, blood group, government identity documents (Aadhaar or equivalent for admission and birth registrations).
              </li>
              <li>
                <strong>Contact Information:</strong> Phone number, residential address, emergency contact numbers, and email address.
              </li>
              <li>
                <strong>Clinical &amp; Medical Records:</strong> Medical history, allergy profiles, obstetric history, ultrasound scans, embryology logs, pathology results, prescription histories, and doctor consultation notes.
              </li>
              <li>
                <strong>Billing &amp; Insurance Information:</strong> Cashless health insurance provider details, TPA pre-authorization documents, policy numbers, and transaction receipts.
              </li>
              <li>
                <strong>Digital Website Data:</strong> IP address, device type, browser session logs, and functional cookies used strictly to power site navigation and appointment scheduling.
              </li>
            </ul>
          </section>

          {/* Section 3: Purpose of Processing */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[rgba(22,55,76,0.12)] shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--mint)] text-[var(--teal)] flex items-center justify-center shrink-0">
                <Eye size={20} />
              </div>
              <h2 className="text-lg font-bold text-[var(--ink)] m-0">3. Purpose and Legal Basis of Processing</h2>
            </div>
            <p className="sr-copy mb-3">
              We process health and identity information strictly for legitimate medical and hospital administrative purposes:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="p-4 rounded-xl bg-[var(--cream)] border border-[rgba(22,55,76,0.08)]">
                <strong className="block text-xs font-bold text-[var(--deep)] uppercase mb-1">Clinical Diagnosis &amp; Care</strong>
                <p className="text-xs text-[#5a7d92] m-0">Accurate treatment planning, surgical protocols, medication dispensing, and pediatric health monitoring.</p>
              </div>
              <div className="p-4 rounded-xl bg-[var(--cream)] border border-[rgba(22,55,76,0.08)]">
                <strong className="block text-xs font-bold text-[var(--deep)] uppercase mb-1">Appointments &amp; Updates</strong>
                <p className="text-xs text-[#5a7d92] m-0">Sending SMS, phone, or WhatsApp reminders regarding consultation schedules and test report readiness.</p>
              </div>
              <div className="p-4 rounded-xl bg-[var(--cream)] border border-[rgba(22,55,76,0.08)]">
                <strong className="block text-xs font-bold text-[var(--deep)] uppercase mb-1">Statutory Compliance</strong>
                <p className="text-xs text-[#5a7d92] m-0">Fulfilling mandatory public health reporting for live births, vaccinations, and communicable disease registers.</p>
              </div>
              <div className="p-4 rounded-xl bg-[var(--cream)] border border-[rgba(22,55,76,0.08)]">
                <strong className="block text-xs font-bold text-[var(--deep)] uppercase mb-1">Insurance Settlement</strong>
                <p className="text-xs text-[#5a7d92] m-0">Facilitating real-time claim adjudication with empanelled cashless health insurers and TPAs.</p>
              </div>
            </div>
          </section>

          {/* Section 4: Data Security and Safeguards */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[rgba(22,55,76,0.12)] shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--mint)] text-[var(--teal)] flex items-center justify-center shrink-0">
                <Lock size={20} />
              </div>
              <h2 className="text-lg font-bold text-[var(--ink)] m-0">4. Information Security &amp; Retention</h2>
            </div>
            <p className="sr-copy mb-3">
              Sreemantha Hospital employs industry-standard physical, procedural, and technological safeguards to defend your health data:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 sr-copy mb-4">
              <li>End-to-end encrypted database connections (TLS/SSL) with Argon2/PBKDF2 credential hashing.</li>
              <li>Role-based access control (RBAC) ensuring only treating clinicians and certified hospital staff can access relevant records.</li>
              <li>Medical record archives maintained in compliance with statutory Indian retention requirements (typically a minimum of 3 years for adult clinical records and until the age of 21 for pediatric and birth records).</li>
            </ul>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
              <strong>Notice:</strong> We will never sell, lease, or commercially trade your personal contact details or sensitive clinical histories to third-party marketing companies.
            </div>
          </section>

          {/* Section 5: Patient Rights & Contact */}
          <section className="bg-[var(--deep)] text-white p-6 sm:p-8 rounded-2xl shadow-md">
            <h2 className="text-lg font-bold text-white mb-2">5. Patient Data Rights &amp; Grievance Redressal</h2>
            <p className="text-xs text-[var(--mint)] leading-relaxed mb-6">
              Under Indian data protection laws, patients and their legal guardians have the right to request a physical or digital copy of their clinical discharge summaries, request correction of erroneous demographic information, or withdraw consent for non-essential digital communications.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/15 text-xs">
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-[var(--lime)] shrink-0" />
                <div>
                  <span className="text-white/60 block text-[10px] uppercase">Hospital Helpline</span>
                  <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="font-bold text-white hover:text-[var(--lime)]">{phone}</a>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-[var(--lime)] shrink-0" />
                <div>
                  <span className="text-white/60 block text-[10px] uppercase">Grievance Desk</span>
                  <span className="font-bold text-white">{email}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin size={16} className="text-[var(--lime)] shrink-0" />
                <div>
                  <span className="text-white/60 block text-[10px] uppercase">Hospital Location</span>
                  <span className="text-white/90">Nehru Nagar, Khammam</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
