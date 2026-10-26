import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  applyDocumentLanguage,
  applyLanguageToWidget,
  expireTranslateCookie,
  getTranslateCombo,
  INCLUDED_LANGUAGES,
  isSiteLanguage,
  pageContainsLanguage,
  readPreferredLanguage,
  rememberLanguage,
  removeGoogleArtifacts,
  SCRIPT_ID,
  SCRIPT_SRC,
  TranslationContext,
  WIDGET_ID,
  writeTranslateCookie,
  type SiteLanguage,
  type TranslationContextValue,
  type TranslationStatus,
} from './translation';

interface TranslationProviderProps {
  children: React.ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<SiteLanguage>(() => readPreferredLanguage());
  const [status, setStatus] = useState<TranslationStatus>(() =>
    language === 'en' ? 'ready' : 'loading'
  );
  const languageRef = useRef(language);
  const mountedRef = useRef(true);
  const widgetInitializedRef = useRef(false);
  const pendingLanguageRef = useRef<SiteLanguage | null>(null);
  const statusTimerRef = useRef<number | null>(null);
  const translationRetryTimerRef = useRef<number | null>(null);
  const artifactObserverRef = useRef<number | null>(null);
  const fallbackTimerRef = useRef<number | null>(null);
  const scriptLoadingRef = useRef(false);

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

  /**
   * Google Translate is only loaded when a patient actually chooses Telugu or
   * Hindi. The default English site therefore makes no third-party translation
   * requests and stays free of Google's cookie, eval and quirks-mode artifacts.
   */
  const loadWidget = useCallback(() => {
    if (widgetInitializedRef.current) return;

    window.googleTranslateElementInit = () => {
      scriptLoadingRef.current = false;
      initializeWidget();
    };

    if (window.google?.translate?.TranslateElement) {
      scriptLoadingRef.current = false;
      initializeWidget();
      return;
    }

    if (scriptLoadingRef.current) return;

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      // The script is already in the DOM; its callback will initialize the
      // widget as soon as Google finishes loading it.
      scriptLoadingRef.current = true;
      return;
    }

    scriptLoadingRef.current = true;
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = SCRIPT_SRC;
    script.onerror = () => {
      scriptLoadingRef.current = false;
      if (mountedRef.current) setStatus('error');
    };
    document.body.appendChild(script);

    if (artifactObserverRef.current === null) {
      artifactObserverRef.current = window.setInterval(removeGoogleArtifacts, 600);
    }

    if (fallbackTimerRef.current === null) {
      fallbackTimerRef.current = window.setTimeout(() => {
        fallbackTimerRef.current = null;
        if (mountedRef.current && !widgetInitializedRef.current) {
          setStatus((current) => (current === 'error' ? current : 'ready'));
        }
      }, 9000);
    }
  }, [initializeWidget]);

  useEffect(() => {
    mountedRef.current = true;
    document.documentElement.classList.remove('notranslate');

    return () => {
      mountedRef.current = false;
      clearStatusTimer();
      clearTranslationRetries();

      if (artifactObserverRef.current !== null) {
        window.clearInterval(artifactObserverRef.current);
        artifactObserverRef.current = null;
      }
      if (fallbackTimerRef.current !== null) {
        window.clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }

      // When leaving the public site for the staff portal, clear the stored
      // translation and restore English. This prevents Google's observer from
      // translating the admin interface after client-side navigation.
      if (widgetInitializedRef.current || languageRef.current !== 'en') {
        expireTranslateCookie();
      }
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
  }, [clearStatusTimer, clearTranslationRetries]);

  // Keep the hidden Google select and the document language in sync whenever
  // the widget becomes ready or the user picks a new language.
  useEffect(() => {
    languageRef.current = language;

    if (language === 'en') {
      applyDocumentLanguage('en');

      if (widgetInitializedRef.current) {
        expireTranslateCookie();
        const combo = getTranslateCombo();
        if (combo) {
          combo.value = 'en';
          combo.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
      return;
    }

    writeTranslateCookie(language);
    applyDocumentLanguage(language);

    if (!widgetInitializedRef.current) {
      pendingLanguageRef.current = language;
      loadWidget();
      return;
    }

    // Delegate the actual select change to the retry scheduler. Applying it
    // synchronously here can race the widget's own initialisation and leave
    // the select stuck on "Select Language".
    pendingLanguageRef.current = language;
    scheduleTranslationRetries(language);
  }, [language, scheduleTranslationRetries, loadWidget]);

  const setLanguage = useCallback(
    (nextLanguage: SiteLanguage) => {
      if (!isSiteLanguage(nextLanguage)) return;

      rememberLanguage(nextLanguage);
      clearStatusTimer();
      setStatus(nextLanguage === 'en' ? 'ready' : 'translating');
      setLanguageState(nextLanguage);
      // The language effect above loads Google Translate on demand and
      // schedules the actual widget change once the select has settled.
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
