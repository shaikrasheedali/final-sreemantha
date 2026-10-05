import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { clientLogger } from './utils/logger';

// Global defensive listener for third-party browser extensions (e.g. 200.js / M_ID) and application error logging
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (
      (event.filename && event.filename.includes('200.js')) ||
      (event.message && (event.message.includes('M_ID') || event.message.includes("reading 'M_ID'")))
    ) {
      event.preventDefault();
      event.stopPropagation();
      return true;
    }
    clientLogger.error('WindowError', event.message, { filename: event.filename, lineno: event.lineno });
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const str = typeof reason === 'string' ? reason : (reason && (reason.message || reason.stack) ? (reason.message || reason.stack) : '');
    if (str && (str.includes('M_ID') || str.includes('200.js') || str.includes("reading 'M_ID'"))) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    clientLogger.error('UnhandledRejection', str || 'Unhandled promise rejection', reason);
  }, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

