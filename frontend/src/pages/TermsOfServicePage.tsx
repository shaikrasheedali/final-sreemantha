import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FileCheck, AlertTriangle, Clock, CreditCard, Stethoscope, Phone, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

export const TermsOfServicePage: React.FC = () => {
  const { settings } = useSettings();
  const info = settings.hospital_info || {};
  const phone = info.phone || '+91 96667 81779';
  const emergency = info.emergency_hotline || '+91 88007 73362';

  return (
    <div className="sr-section" style={{ paddingTop: 40 }}>
      <div className="sr-container max-w-4xl mx-auto">
        <Breadcrumbs items={[{ label: 'Legal & Compliance' }, { label: 'Terms of Service' }]} />

        {/* Header */}
        <div className="mb-10 pb-6 border-b border-[rgba(22,55,76,0.12)]">
          <span className="sr-kicker">Hospital Clinical &amp; Digital Terms</span>
          <h1 className="sr-display sr-heading mt-2">
            Terms of Service &amp;<br />
            <em>Patient Care Guidelines</em>
          </h1>
          <p className="sr-copy text-sm mt-3 max-w-2xl">
            Effective Date: October 2026 · Sreemantha Hospital, Khammam, Telangana.
          </p>
        </div>

        {/* Emergency Alert Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-rose-900 m-0">Medical Emergencies Notice</h2>
            <p className="text-xs text-rose-700 leading-relaxed mt-1 m-0">
              Online appointments, web enquiries, and digital forms are NOT intended for urgent medical emergencies. If you or your child are experiencing severe acute symptoms, respiratory distress, labor contractions, or trauma, immediately call our 24/7 Emergency Line at{' '}
              <a href={`tel:${emergency.replace(/[^+\d]/g, '')}`} className="font-bold underline">
                {emergency}
              </a>{' '}
              or report directly to our Emergency &amp; Casualty ward in Nehru Nagar, Khammam.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8 text-[var(--ink)] text-sm leading-relaxed">
          {/* Section 1: Overview */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[rgba(22,55,76,0.12)] shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--mint)] text-[var(--teal)] flex items-center justify-center shrink-0">
                <FileCheck size={20} />
              </div>
              <h2 className="text-lg font-bold text-[var(--ink)] m-0">1. Acceptance of Terms</h2>
            </div>
            <p className="sr-copy mb-3">
              By visiting Sreemantha Hospital in person, registering an outpatient consultation, using our website, or booking an appointment online, you agree to comply with and be bound by these Terms of Service.
            </p>
            <p className="sr-copy m-0">
              These terms govern all outpatient departments (OPD), inpatient admissions (IPD), surgical procedures, fertility cycles (IVF/ICSI/IUI), diagnostic laboratory services, and digital interactions facilitated through our hospital digital platform.
            </p>
          </section>

          {/* Section 2: Medical Advice Disclaimer */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[rgba(22,55,76,0.12)] shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--mint)] text-[var(--teal)] flex items-center justify-center shrink-0">
                <Stethoscope size={20} />
              </div>
              <h2 className="text-lg font-bold text-[var(--ink)] m-0">2. Clinical Consultations &amp; Medical Advice</h2>
            </div>
            <ul className="list-disc pl-5 space-y-2 sr-copy">
              <li>
                <strong>Educational Content:</strong> Informational blog articles, specialty overviews, and clinical guides published on this platform are for general health awareness and do not constitute a binding doctor-patient relationship or individualized prescription.
              </li>
              <li>
                <strong>Clinical Evaluation:</strong> Definitive diagnostic assessments and treatment courses can only be rendered through formal clinical examination by qualified doctors at Sreemantha Hospital.
              </li>
              <li>
                <strong>Informed Consent:</strong> Invasive medical procedures, surgical deliveries (Cesarean), anesthesia, and assisted reproductive technologies require formal informed consent signed by the patient or legal guardian after thorough clinical briefing.
              </li>
            </ul>
          </section>

          {/* Section 3: Appointments and Cancellations */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[rgba(22,55,76,0.12)] shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--mint)] text-[var(--teal)] flex items-center justify-center shrink-0">
                <Clock size={20} />
              </div>
              <h2 className="text-lg font-bold text-[var(--ink)] m-0">3. Appointment Scheduling &amp; Punctuality</h2>
            </div>
            <p className="sr-copy mb-3">
              We strive to adhere strictly to appointment schedules. However, due to emergency obstetric procedures, neonatal resuscitation events, and critical care priorities, scheduled consultation timings may occasionally experience unforeseen adjustments.
            </p>
            <p className="sr-copy m-0">
              Patients who need to reschedule or cancel an appointment are requested to inform our clinical reception desk at least 4 hours in advance by calling{' '}
              <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="font-semibold text-[var(--teal)] underline">
                {phone}
              </a>.
            </p>
          </section>

          {/* Section 4: Billing and Insurance */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[rgba(22,55,76,0.12)] shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--mint)] text-[var(--teal)] flex items-center justify-center shrink-0">
                <CreditCard size={20} />
              </div>
              <h2 className="text-lg font-bold text-[var(--ink)] m-0">4. Billing, Cashless Insurance &amp; Tariffs</h2>
            </div>
            <ul className="list-disc pl-5 space-y-2 sr-copy">
              <li>
                Hospital tariffs are established transparently in accordance with healthcare regulatory norms. Itemized billing statements are provided for all diagnostic, pharmacy, and hospital bed charges.
              </li>
              <li>
                Cashless insurance hospitalization is facilitated through empanelled Insurance Providers and Third-Party Administrators (TPAs). Final authorization is determined solely by your insurance underwriting guidelines.
              </li>
              <li>
                Any co-pays, non-medical consumables, or disallowed claims remain the patient’s financial responsibility upon discharge.
              </li>
            </ul>
          </section>

          {/* Section 5: Hospital Regulations */}
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[rgba(22,55,76,0.12)] shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--mint)] text-[var(--teal)] flex items-center justify-center shrink-0">
                <Shield size={20} />
              </div>
              <h2 className="text-lg font-bold text-[var(--ink)] m-0">5. Hospital Conduct &amp; Visitor Regulations</h2>
            </div>
            <p className="sr-copy mb-3">
              To protect vulnerable neonates in our Level III NICU and post-operative maternity patients, visitors must abide by hospital hygiene protocols:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 sr-copy">
              <li>Strict hand-hygiene and footwear restrictions apply in all sterile areas, cleanrooms, and intensive care zones.</li>
              <li>Sreemantha Hospital is a 100% tobacco-free and alcohol-free healthcare facility.</li>
              <li>Verbal abuse or physical violence against doctors, nurses, or clinical support staff is strictly prohibited and subject to legal prosecution under the Telangana Medicare Service Persons and Medicare Service Institutions (Prevention of Violence and Damage to Property) Act.</li>
            </ul>
          </section>

          {/* Bottom Action Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[var(--deep)] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Have questions about hospital policies?</h3>
              <p className="text-xs text-[var(--mint)] m-0">
                Our patient care desk is available 24/7 to clarify admission procedures, billing tariffs, and clinical guidelines.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link to="/contact" className="sr-button sr-button--light text-xs py-2.5 px-5">
                Contact Reception
              </Link>
              <Link to="/patient-rights" className="sr-button sr-button--outline text-xs py-2.5 px-5 border-white/30 text-white hover:bg-white/10">
                Patient Rights
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
