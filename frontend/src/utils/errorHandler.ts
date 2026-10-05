/**
 * Centralized Client Error Handling Utility
 * Sreemantha Hospital Platform
 */

import { clientLogger } from './logger';

export function getErrorMessage(error: unknown, fallback = 'An unexpected error occurred. Please try again.'): string {
  if (typeof error === 'string') return error;

  if (error && typeof error === 'object') {
    const err = error as Record<string, any>;
    if (typeof err.error === 'string') return err.error;
    if (typeof err.message === 'string') return err.message;
    if (err.response && typeof err.response.data?.error === 'string') return err.response.data.error;
    if (err.response && typeof err.response.data?.message === 'string') return err.response.data.message;
  }

  return fallback;
}

export function handleClientError(context: string, error: unknown, userMessage?: string): string {
  const message = getErrorMessage(error, userMessage);
  clientLogger.error(context, message, error);
  return message;
}
