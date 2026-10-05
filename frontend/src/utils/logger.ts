/**
 * Enterprise Client-Side Centralized Logger
 * Sreemantha Hospital Platform
 * Clean, readable, structured console formatting with log levels and timestamps.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const STYLES = {
  info: 'background: #006c93; color: white; border-radius: 4px; padding: 2px 6px; font-weight: bold;',
  warn: 'background: #f59e0b; color: white; border-radius: 4px; padding: 2px 6px; font-weight: bold;',
  error: 'background: #ef4444; color: white; border-radius: 4px; padding: 2px 6px; font-weight: bold;',
  debug: 'background: #64748b; color: white; border-radius: 4px; padding: 2px 6px; font-weight: bold;',
  context: 'color: #073d59; font-weight: bold;',
  time: 'color: #94a3b8; font-size: 11px;',
};

function formatTime(): string {
  const d = new Date();
  return d.toTimeString().split(' ')[0] + '.' + String(d.getMilliseconds()).padStart(3, '0');
}

export const clientLogger = {
  info(context: string, message: string, data?: unknown) {
    if (data !== undefined) {
      console.log(`%cINFO%c %c[${context}]%c ${message} %c${formatTime()}`, STYLES.info, '', STYLES.context, '', STYLES.time, data);
    } else {
      console.log(`%cINFO%c %c[${context}]%c ${message} %c${formatTime()}`, STYLES.info, '', STYLES.context, '', STYLES.time);
    }
  },

  warn(context: string, message: string, data?: unknown) {
    if (data !== undefined) {
      console.warn(`%cWARN%c %c[${context}]%c ${message} %c${formatTime()}`, STYLES.warn, '', STYLES.context, '', STYLES.time, data);
    } else {
      console.warn(`%cWARN%c %c[${context}]%c ${message} %c${formatTime()}`, STYLES.warn, '', STYLES.context, '', STYLES.time);
    }
  },

  error(context: string, message: string, error?: unknown) {
    if (error !== undefined) {
      console.error(`%cERROR%c %c[${context}]%c ${message} %c${formatTime()}`, STYLES.error, '', STYLES.context, '', STYLES.time, error);
    } else {
      console.error(`%cERROR%c %c[${context}]%c ${message} %c${formatTime()}`, STYLES.error, '', STYLES.context, '', STYLES.time);
    }
  },

  debug(context: string, message: string, data?: unknown) {
    if (import.meta.env.DEV) {
      if (data !== undefined) {
        console.debug(`%cDEBUG%c %c[${context}]%c ${message} %c${formatTime()}`, STYLES.debug, '', STYLES.context, '', STYLES.time, data);
      } else {
        console.debug(`%cDEBUG%c %c[${context}]%c ${message} %c${formatTime()}`, STYLES.debug, '', STYLES.context, '', STYLES.time);
      }
    }
  },
};

export default clientLogger;
