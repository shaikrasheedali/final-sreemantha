import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertCircle,
  ArrowUpRight,
  Calendar,
  Check,
  Loader2,
  Phone,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { api } from '../utils/api';

const DEPARTMENTS = [
  'Fertility & Reproductive Medicine',
  'Obstetrics & Gynaecology',
  'Neonatology & NICU',
  'Paediatrics & Child Care',
  "Women's Wellness",
  'General OPD',
];

const TIME_SLOTS = [
  'Morning (09:30 AM – 01:00 PM)',
  'Afternoon (02:00 PM – 05:00 PM)',
  'Evening (05:00 PM – 08:00 PM)',
  'First available slot',
];

function localDateISO(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

interface AppointmentFormState {
  name: string;
  phone: string;
  email: string;
  department: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  consent: boolean;
}

function createInitialForm(preferredDate = ''): AppointmentFormState {
  return {
    name: '',
    phone: '',
    email: '',
    department: DEPARTMENTS[0],
    preferredDate,
    preferredTime: TIME_SLOTS[0],
    message: '',
    consent: true,
  };
}

type SubmitState = 'idle' | 'submitting' | 'success';

interface AppointmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppointmentDrawer: React.FC<AppointmentDrawerProps> = ({ isOpen, onClose }) => {
  const { settings } = useSettings();
  const phone = settings.hospital_info?.phone || '+91 96667 81779';
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, '')}`;

  const [dateBounds] = useState(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return {
      min: localDateISO(today),
      suggested: localDateISO(tomorrow),
    };
  });
  const [form, setForm] = useState<AppointmentFormState>(() =>
    createInitialForm(dateBounds.suggested)
  );
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [submittedPhone, setSubmittedPhone] = useState('');

  const panelRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const doneButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  const nameId = useId();
  const phoneId = useId();
  const emailId = useId();
  const departmentId = useId();
  const dateId = useId();
  const timeId = useId();
  const messageId = useId();
  const consentId = useId();

  const minDate = dateBounds.min;
  const isBusy = submitState === 'submitting';

  const resetForm = useCallback(() => {
    setForm(createInitialForm(dateBounds.suggested));
    setError(null);
    setSubmittedPhone('');
    setSubmitState('idle');
  }, [dateBounds.suggested]);

  const requestClose = useCallback(() => {
    if (isBusy) return;
    onClose();
  }, [isBusy, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    const focusTimer = window.setTimeout(() => {
      titleRef.current?.focus({ preventScroll: true });
    }, 40);

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
      window.clearTimeout(focusTimer);
      previouslyFocusedRef.current?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        requestClose();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.offsetParent !== null && !element.closest('[inert]'));

      if (focusable.length === 0) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && (active === first || active === panelRef.current)) {
        event.preventDefault();
        last.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, requestClose]);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.inert = submitState === 'success';
    }

    if (submitState !== 'success') return undefined;

    const focusTimer = window.setTimeout(() => {
      doneButtonRef.current?.focus({ preventScroll: true });
    }, 1450);

    return () => window.clearTimeout(focusTimer);
  }, [submitState]);

  useEffect(() => {
    if (!isOpen) {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      const timer = window.setTimeout(resetForm, 260);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [isOpen, resetForm]);

  useEffect(
    () => () => {
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    },
    []
  );

  const updateField = <TKey extends keyof AppointmentFormState>(
    key: TKey,
    value: AppointmentFormState[TKey]
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBusy) return;

    const name = form.name.trim();
    const phoneNumber = form.phone.trim();
    const email = form.email.trim();
    const cleanPhone = phoneNumber.replace(/\D/g, '');

    if (!name) {
      setError('Please enter the patient name.');
      return;
    }
    if (cleanPhone.length < 7) {
      setError('Please enter a valid contact phone number.');
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address, or leave it blank.');
      return;
    }
    if (form.preferredDate && form.preferredDate < minDate) {
      setError('Please choose today or a future date.');
      return;
    }
    if (!form.consent) {
      setError('Please confirm we may contact you about this appointment.');
      return;
    }

    setSubmitState('submitting');
    setError(null);

    try {
      await api.post('/appointments', {
        patient_name: name,
        phone: phoneNumber,
        email,
        department: form.department,
        preferred_date: form.preferredDate,
        preferred_time: form.preferredTime,
        message: form.message.trim(),
        reason: form.message.trim() || 'Online appointment drawer request',
        consent: form.consent,
      });

      setSubmittedPhone(phoneNumber);
      setSubmitState('success');
    } catch (submitError: any) {
      console.error('Appointment drawer submission error:', submitError);
      setError(
        submitError?.message ||
          'We could not send your request just now. Please call the hospital directly.'
      );
      setSubmitState('idle');
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="appointment-drawer-root">
      <button
        type="button"
        className="appointment-drawer__backdrop"
        aria-label="Close appointment booking"
        onClick={requestClose}
        tabIndex={-1}
      />

      <div
        ref={panelRef}
        className="appointment-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
      >
        <div className="appointment-drawer__head">
          <div className="appointment-drawer__head-copy">
            <span className="appointment-drawer__kicker">
              <Calendar size={14} aria-hidden="true" />
              Appointments
            </span>
            <h2 id={titleId} ref={titleRef} tabIndex={-1}>
              {submitState === 'success' ? 'Request received' : 'Book a visit'}
            </h2>
            <p id={descriptionId}>
              {submitState === 'success'
                ? 'Our clinical reception will call you shortly.'
                : 'Share a few details and our care team will call to confirm your slot.'}
            </p>
          </div>
          <button
            type="button"
            className="appointment-drawer__close"
            aria-label="Close appointment booking"
            onClick={requestClose}
            disabled={isBusy}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="appointment-drawer__stage">
          <form
            ref={formRef}
            className={`appointment-drawer__form${
              submitState === 'success' ? ' is-morphing' : ''
            }`}
            onSubmit={handleSubmit}
            aria-hidden={submitState === 'success' ? 'true' : undefined}
            noValidate
          >
            {error && (
              <div className="appointment-drawer__error" role="alert">
                <AlertCircle size={17} aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <div className="appointment-drawer__grid">
              <div className="appointment-drawer__field">
                <label htmlFor={nameId}>Patient name *</label>
                <input
                  id={nameId}
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  required
                  disabled={isBusy}
                />
              </div>

              <div className="appointment-drawer__field">
                <label htmlFor={phoneId}>Mobile number *</label>
                <input
                  id={phoneId}
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                  placeholder="e.g. 98765 43210"
                  required
                  disabled={isBusy}
                />
              </div>

              <div className="appointment-drawer__field appointment-drawer__field--full">
                <label htmlFor={emailId}>Email (optional)</label>
                <input
                  id={emailId}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  placeholder="name@example.com"
                  disabled={isBusy}
                />
              </div>

              <div className="appointment-drawer__field appointment-drawer__field--full">
                <label htmlFor={departmentId}>Department</label>
                <select
                  id={departmentId}
                  name="department"
                  value={form.department}
                  onChange={(event) => updateField('department', event.target.value)}
                  disabled={isBusy}
                >
                  {DEPARTMENTS.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="appointment-drawer__field">
                <label htmlFor={dateId}>Preferred date</label>
                <input
                  id={dateId}
                  name="preferred_date"
                  type="date"
                  min={minDate}
                  value={form.preferredDate}
                  onChange={(event) => updateField('preferredDate', event.target.value)}
                  disabled={isBusy}
                />
              </div>

              <div className="appointment-drawer__field">
                <label htmlFor={timeId}>Preferred time</label>
                <select
                  id={timeId}
                  name="preferred_time"
                  value={form.preferredTime}
                  onChange={(event) => updateField('preferredTime', event.target.value)}
                  disabled={isBusy}
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div className="appointment-drawer__field appointment-drawer__field--full">
                <label htmlFor={messageId}>Reason for visit (optional)</label>
                <textarea
                  id={messageId}
                  name="message"
                  rows={3}
                  value={form.message}
                  onChange={(event) => updateField('message', event.target.value)}
                  placeholder="Briefly tell us how we can help."
                  disabled={isBusy}
                />
              </div>
            </div>

            <label className="appointment-drawer__consent" htmlFor={consentId}>
              <input
                id={consentId}
                name="consent"
                type="checkbox"
                checked={form.consent}
                onChange={(event) => updateField('consent', event.target.checked)}
                disabled={isBusy}
              />
              <span>
                I agree to be contacted by the Sreemantha care team about this appointment.
              </span>
            </label>

            <button
              type="submit"
              className="appointment-drawer__submit"
              disabled={isBusy}
              aria-busy={isBusy}
            >
              {isBusy ? (
                <>
                  <Loader2 size={18} className="appointment-drawer__spinner" aria-hidden="true" />
                  Sending request…
                </>
              ) : (
                <>
                  Request appointment
                  <ArrowUpRight size={18} aria-hidden="true" />
                </>
              )}
            </button>

            <div className="appointment-drawer__foot">
              <span>Prefer to talk?</span>
              <a href={phoneHref}>
                <Phone size={13} aria-hidden="true" />
                Call {phone}
              </a>
              <Link to="/book-appointment" onClick={requestClose}>
                Use the full form
              </Link>
            </div>
          </form>

          {submitState === 'success' && (
            <div className="appointment-drawer__success" aria-live="polite">
              <div className="appointment-drawer__success-mark" aria-hidden="true">
                <Check size={44} strokeWidth={3} className="appointment-drawer__success-tick" />
              </div>
              <h3>Thank you, {form.name.trim().split(/\s+/)[0] || 'friend'}.</h3>
              <p>
                Your request has been sent to our clinical reception. We will call you at{' '}
                <strong>{submittedPhone}</strong> to confirm the date and time.
              </p>
              <div className="appointment-drawer__success-actions">
                <button
                  ref={doneButtonRef}
                  type="button"
                  onClick={requestClose}
                  className="sr-button"
                >
                  Done
                </button>
                <Link to="/book-appointment" onClick={requestClose} className="sr-button sr-button--outline">
                  View full form
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
