import { createContext, useContext, useEffect } from 'react';

export type SiteLanguage = 'en' | 'te' | 'hi';

export interface SiteLanguageOption {
  code: SiteLanguage;
  label: string;
  nativeLabel: string;
}

export const SITE_LANGUAGES: SiteLanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
];

export type TranslationStatus = 'loading' | 'ready' | 'translating' | 'error';

export interface TranslationContextValue {
  language: SiteLanguage;
  status: TranslationStatus;
  isReady: boolean;
  setLanguage: (language: SiteLanguage) => void;
}

interface GoogleTranslateCombo extends HTMLSelectElement {
  value: string;
}

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement?: new (
          options: Record<string, unknown>,
          elementId: string
        ) => unknown;
      };
    };
  }
}

export const TranslationContext = createContext<TranslationContextValue | undefined>(undefined);

const STORAGE_KEY = 'sreemantha.language';
export const WIDGET_ID = 'sreemantha-google-translate';
export const SCRIPT_ID = 'sreemantha-google-translate-script';
export const SCRIPT_SRC =
  'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
export const INCLUDED_LANGUAGES = 'en,te,hi';
const GOOGLE_TRANSLATE_COOKIE = 'googtrans';
export const GOOGLE_TRANSLATE_COMBO_ID = 'sreemantha-google-translate-select';
export const GOOGLE_TRANSLATE_COMBO_NAME = 'sreemantha-language';

export function isSiteLanguage(value: unknown): value is SiteLanguage {
  return value === 'en' || value === 'te' || value === 'hi';
}

export function readPreferredLanguage(): SiteLanguage {
  if (typeof window === 'undefined') return 'en';

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isSiteLanguage(stored)) return stored;
  } catch {
    // Storage can be unavailable in privacy-restricted webviews.
  }

  return 'en';
}

export function expireTranslateCookie() {
  if (typeof document === 'undefined') return;

  const expired = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
  const host = window.location.hostname;

  document.cookie = `${GOOGLE_TRANSLATE_COOKIE}=; ${expired}; path=/; SameSite=Lax`;
  if (host && host !== 'localhost' && host !== '127.0.0.1') {
    document.cookie = `${GOOGLE_TRANSLATE_COOKIE}=; ${expired}; path=/; domain=${host}; SameSite=Lax`;
    document.cookie = `${GOOGLE_TRANSLATE_COOKIE}=; ${expired}; path=/; domain=.${host}; SameSite=Lax`;
  }
}

export function writeTranslateCookie(language: SiteLanguage) {
  if (typeof document === 'undefined') return;

  expireTranslateCookie();
  if (language === 'en') return;

  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${GOOGLE_TRANSLATE_COOKIE}=/en/${language}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function rememberLanguage(language: SiteLanguage) {
  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // The Google Translate cookie still keeps the selection on the next load.
  }
}

export function getTranslateCombo(): GoogleTranslateCombo | null {
  return document.querySelector<GoogleTranslateCombo>('.goog-te-combo');
}

/**
 * Google injects its own hidden language select. Chrome's autofill audit flags
 * form controls without an id or name, so annotate the generated control as
 * soon as it appears. Our visible language picker in the navbar remains the
 * only control patients interact with.
 */
export function annotateGoogleCombo() {
  const combo = getTranslateCombo();
  if (!combo) return;

  if (combo.id !== GOOGLE_TRANSLATE_COMBO_ID) combo.id = GOOGLE_TRANSLATE_COMBO_ID;
  if (combo.name !== GOOGLE_TRANSLATE_COMBO_NAME) combo.name = GOOGLE_TRANSLATE_COMBO_NAME;
}

export function applyLanguageToWidget(language: SiteLanguage) {
  const combo = getTranslateCombo();
  if (!combo) return false;

  const value = language === 'en' ? 'en' : language;
  const hasOption = Array.from(combo.options).some((option) => option.value === value);
  if (!hasOption) return false;

  combo.value = value;
  combo.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}

/**
 * Keeps translated headings and body copy readable. Google Translate preserves
 * Latin brand names and phone numbers, but Telugu and Hindi need extra line
 * height and slightly looser letter spacing to remain legible on small screens.
 */
export function applyDocumentLanguage(language: SiteLanguage) {
  document.documentElement.lang = language;
  document.documentElement.classList.toggle('is-translated', language !== 'en');
  document.documentElement.dataset.siteLanguage = language;
}

export function pageContainsLanguage(language: SiteLanguage) {
  if (typeof document === 'undefined') return false;

  if (language === 'en') {
    return !document.documentElement.classList.contains('translated-ltr');
  }

  const sample = document.querySelector('main')?.innerText ?? '';
  if (!sample.trim()) return false;

  return language === 'te'
    ? /[\u0C00-\u0C7F]/.test(sample)
    : /[\u0900-\u097F]/.test(sample);
}

export function removeGoogleArtifacts() {
  annotateGoogleCombo();

  document
    .querySelectorAll<HTMLElement>(
      [
        '.goog-te-banner-frame',
        '.goog-te-balloon-frame',
        'iframe.skiptranslate',
        '#goog-gt-tt',
        '[id^="goog-gt-tt"]',
        '.VIpgJd-yAWNEb-L7lbkb',
        '.VIpgJd-ZVi9od-ORHb-OEVmcd',
        '.VIpgJd-ZVi9od-aZ2wEe-wOHMyf',
        '[class*="VIpgJd-yAWNEb"]',
      ].join(', ')
    )
    .forEach((element) => {
      element.style.setProperty('display', 'none', 'important');
      element.style.setProperty('visibility', 'hidden', 'important');
      element.style.setProperty('height', '0', 'important');
      element.style.setProperty('min-height', '0', 'important');
    });

  if (document.body) {
    document.body.style.setProperty('top', '0px', 'important');
  }
}

export function useTranslation(): TranslationContextValue {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}

/**
 * Applies the "English only" guard to staff-facing routes. It is exported so
 * the login screen and admin shell can call it even though they render outside
 * the public TranslationProvider.
 */
export function useEnglishOnlyPage() {
  useEffect(() => {
    document.documentElement.classList.add('notranslate');
    document.documentElement.classList.remove('is-translated');
    document.documentElement.lang = 'en';
    expireTranslateCookie();

    const combo = getTranslateCombo();
    if (combo) {
      combo.value = 'en';
      combo.dispatchEvent(new Event('change', { bubbles: true }));
    }

    return () => {
      document.documentElement.classList.remove('notranslate');
    };
  }, []);
}
