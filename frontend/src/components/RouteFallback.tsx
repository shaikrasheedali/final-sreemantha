import React from 'react';

/**
 * Lightweight fallback shown while a route-level code-split chunk is loading.
 * It deliberately avoids importing icons so the app shell stays tiny.
 */
export const RouteFallback: React.FC = () => (
  <div
    className="min-h-[45vh] w-full flex flex-col items-center justify-center gap-3 py-16"
    role="status"
    aria-live="polite"
  >
    <span
      className="h-9 w-9 rounded-full border-2 border-[#006c93]/20 border-t-[#006c93] animate-spin"
      aria-hidden="true"
    />
    <span className="text-xs font-semibold tracking-wide text-[#5a7d92]">Loading…</span>
  </div>
);

export default RouteFallback;
