import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

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

type TranslationStatus = 'loading' | 'ready' | 'translating' | 'error';

interface TranslationContextValue {
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

const TranslationContext = createContext<TranslationContextValue | undefined>(undefined);

const STORAGE_KEY = 'sreemantha.language';
const WIDGET_ID = 'sreemantha-google-translate';
const SCRIPT_ID = 'sreemantha-google-translate-script';
const SCRIPT_SRC =
  'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
const INCLUDED_LANGUAGES = 'en,te,hi';
const GOOGLE_TRANSLATE_COOKIE = 'googtrans';

function isSiteLanguage(value: unknown): value is SiteLanguage {
  return value === 'en' || value === 'te' || value === 'hi';
}

function readCookieLanguage(): SiteLanguage | null {
  if (typeof document === 'undefined') return null;

  const cookie = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${GOOGLE_TRANSLATE_COOKIE}=`));

  if (!cookie) return null;

  const rawValue = decodeURIComponent(cookie.slice(GOOGLE_TRANSLATE_COOKIE.length + 1));
  const code = rawValue.split('/').filter(Boolean).pop();
  return isSiteLanguage(code) ? code : null;
}

function readPreferredLanguage(): SiteLanguage {
  if (typeof window === 'undefined') return 'en';

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isSiteLanguage(stored)) return stored;
  } catch {
    // Storage can be unavailable in privacy-restricted webviews.
  }

  return readCookieLanguage() ?? 'en';
}

function expireTranslateCookie() {
  if (typeof document === 'undefined') return;

  const expired = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
  const host = window.location.hostname;

  document.cookie = `${GOOGLE_TRANSLATE_COOKIE}=; ${expired}; path=/; SameSite=Lax`;
  if (host && host !== 'localhost' && host !== '127.0.0.1') {
    document.cookie = `${GOOGLE_TRANSLATE_COOKIE}=; ${expired}; path=/; domain=${host}; SameSite=Lax`;
    document.cookie = `${GOOGLE_TRANSLATE_COOKIE}=; ${expired}; path=/; domain=.${host}; SameSite=Lax`;
  }
}

function writeTranslateCookie(language: SiteLanguage) {
  if (typeof document === 'undefined') return;

  expireTranslateCookie();
  if (language === 'en') return;

  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${GOOGLE_TRANSLATE_COOKIE}=/en/${language}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function rememberLanguage(language: SiteLanguage) {
  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // The Google Translate cookie still keeps the selection on the next load.
  }
}

function getTranslateCombo(): GoogleTranslateCombo | null {
  return document.querySelector<GoogleTranslateCombo>('.goog-te-combo');
}

function applyLanguageToWidget(language: SiteLanguage) {
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
function applyDocumentLanguage(language: SiteLanguage) {
  document.documentElement.lang = language;
  document.documentElement.classList.toggle('is-translated', language !== 'en');
  document.documentElement.dataset.siteLanguage = language;
}

function pageContainsLanguage(language: SiteLanguage) {
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

function removeGoogleArtifacts() {
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

interface TranslationProviderProps {
  children: React.ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<SiteLanguage>(() => readPreferredLanguage());
  const [status, setStatus] = useState<TranslationStatus>('loading');
  const languageRef = useRef(language);
  const mountedRef = useRef(true);
  const widgetInitializedRef = useRef(false);
  const pendingLanguageRef = useRef<SiteLanguage | null>(null);
  const statusTimerRef = useRef<number | null>(null);
  const translationRetryTimerRef = useRef<number | null>(null);

  const clearStatusTimer = useCallback(() => {
    if (statusTimerRef.current !== null) {
      window.clearTimeout(statusTimerRef.current);
      statusTimerRef.current = null;
    }
  }, []);

  const clearTranslationRetries = useCallback(() => {
    if (translationRetryTimerRef.current !== null) {
      window.clearTimeout(translationRetryTimerRef.current);
      translationRetryTimerRef.current = null;
    }
  }, []);

  /**
   * Google's select is built asynchronously and can reset an early programmatic
   * change while the widget is still booting. Retry until the target script is
   * visible in the page instead of assuming the first change event worked.
   */
  const scheduleTranslationRetries = useCallback(
    (target: SiteLanguage) => {
      clearTranslationRetries();
      clearStatusTimer();

      let attempts = 0;
      const maxAttempts = 16;

      const tick = () => {
        if (!mountedRef.current || languageRef.current !== target) return;

        if (pageContainsLanguage(target)) {
          setStatus('ready');
          return;
        }

        if (widgetInitializedRef.current) {
          applyLanguageToWidget(target);
        }

        attempts += 1;
        if (attempts < maxAttempts) {
          translationRetryTimerRef.current = window.setTimeout(tick, 400);
        } else {
          setStatus((current) => (current === 'error' ? current : 'ready'));
        }
      };

      setStatus('translating');
      // Google builds its hidden select asynchronously and silently ignores a
      // change event fired before the widget has settled. Waiting one frame
      // cycle (400ms) before the first programmatic change avoids leaving the
      // select stuck on its placeholder value.
      translationRetryTimerRef.current = window.setTimeout(tick, 400);
    },
    [clearStatusTimer, clearTranslationRetries]
  );

  const initializeWidget = useCallback(() => {
    if (!window.google?.translate?.TranslateElement) return false;

    const host = document.getElementById(WIDGET_ID);
    if (!host) return false;

    if (!widgetInitializedRef.current) {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: INCLUDED_LANGUAGES,
          autoDisplay: false,
          multilanguagePage: true,
        },
        WIDGET_ID
      );
      widgetInitializedRef.current = true;
    }

    removeGoogleArtifacts();

    const pending = pendingLanguageRef.current;
    const target = pending ?? languageRef.current;
    applyDocumentLanguage(target);

    pendingLanguageRef.current = null;
    // Let the widget settle before changing its select; see
    // scheduleTranslationRetries for the rationale.
    scheduleTranslationRetries(target);
    return true;
  }, [scheduleTranslationRetries]);

  // Load the Google Website Translator once for the public site. Staff and
  // admin routes live outside this provider, so they stay in English.
  useEffect(() => {
    mountedRef.current = true;

    const initialLanguage = languageRef.current;
    writeTranslateCookie(initialLanguage);
    applyDocumentLanguage(initialLanguage);
    document.documentElement.classList.remove('notranslate');

    window.googleTranslateElementInit = () => {
      initializeWidget();
    };

    if (window.google?.translate?.TranslateElement) {
      initializeWidget();
    } else {
      const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
      if (existing) {
        // A hot reload or remount can reuse the original script tag. Google
        // calls the global callback as soon as the script has finished.
        if (window.google?.translate?.TranslateElement) initializeWidget();
      } else {
        const script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.async = true;
        script.src = SCRIPT_SRC;
        script.onerror = () => {
          if (mountedRef.current) setStatus('error');
        };
        document.body.appendChild(script);
      }
    }

    const artifactObserver = window.setInterval(removeGoogleArtifacts, 600);

    const fallbackTimer = window.setTimeout(() => {
      if (mountedRef.current && !widgetInitializedRef.current) {
        setStatus((current) => (current === 'error' ? current : 'ready'));
      }
    }, 9000);

    return () => {
      mountedRef.current = false;
      clearStatusTimer();
      clearTranslationRetries();
      window.clearInterval(artifactObserver);
      window.clearTimeout(fallbackTimer);

      // When leaving the public site for the staff portal, clear the stored
      // translation and restore English. This prevents Google's observer from
      // translating the admin interface after client-side navigation.
      expireTranslateCookie();
      document.documentElement.classList.add('notranslate');
      document.documentElement.classList.remove('is-translated');
      applyDocumentLanguage('en');

      const combo = getTranslateCombo();
      if (combo) {
        combo.value = 'en';
        combo.dispatchEvent(new Event('change', { bubbles: true }));
      }

      if (document.body) {
        document.body.style.setProperty('top', '0px', 'important');
      }
    };
  }, [clearStatusTimer, clearTranslationRetries, initializeWidget]);

  // Keep the hidden Google select and the document language in sync whenever
  // the widget becomes ready or the user picks a new language.
  useEffect(() => {
    languageRef.current = language;

    if (language !== 'en') {
      writeTranslateCookie(language);
    } else {
      expireTranslateCookie();
    }

    if (!widgetInitializedRef.current) {
      pendingLanguageRef.current = language;
      return;
    }

    applyDocumentLanguage(language);

    if (language === 'en') {
      const combo = getTranslateCombo();
      if (combo) {
        combo.value = 'en';
        combo.dispatchEvent(new Event('change', { bubbles: true }));
      }
      return;
    }

    // Delegate the actual select change to the retry scheduler. Applying it
    // synchronously here can race the widget's own initialisation and leave
    // the select stuck on "Select Language".
    pendingLanguageRef.current = language;
    scheduleTranslationRetries(language);
  }, [language, scheduleTranslationRetries]);

  const setLanguage = useCallback(
    (nextLanguage: SiteLanguage) => {
      if (!isSiteLanguage(nextLanguage)) return;

      rememberLanguage(nextLanguage);
      writeTranslateCookie(nextLanguage);
      clearStatusTimer();
      setStatus('translating');
      setLanguageState(nextLanguage);
      // The language effect above schedules the actual widget change once the
      // Google select has had time to settle.
    },
    [clearStatusTimer]
  );

  const value = useMemo<TranslationContextValue>(
    () => ({
      language,
      status,
      isReady: status === 'ready',
      setLanguage,
    }),
    [language, setLanguage, status]
  );

  return (
    <TranslationContext.Provider value={value}>
      {children}
      <div id={WIDGET_ID} className="google-translate-host notranslate" aria-hidden="true" />
      <span className="sr-only" role="status" aria-live="polite">
        {status === 'translating'
          ? 'Translating page'
          : status === 'error'
            ? 'Translation service unavailable'
            : status === 'ready' && language !== 'en'
              ? 'Page translated'
              : ''}
      </span>
    </TranslationContext.Provider>
  );
};

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
