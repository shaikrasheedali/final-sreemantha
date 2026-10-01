import React, { useState, useEffect } from 'react';

export const InitialLoader: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [visible, setVisible] = useState(() => {
    try {
      return !sessionStorage.getItem('sreemantha_intro_shown');
    } catch {
      return true;
    }
  });
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        setVisible(false);
        try {
          sessionStorage.setItem('sreemantha_intro_shown', 'true');
        } catch {}
        if (onComplete) onComplete();
      }, 400);
    }, 900);

    return () => clearTimeout(timer);
  }, [visible, onComplete]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500 bg-[#faf8f3] ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      role="status"
      aria-label="Loading Sreemantha Hospital"
    >
      <div className="w-16 h-16 rounded-full bg-[#e8eee5] p-3 flex items-center justify-center border border-[#cbd7c6] mb-4 animate-pulse">
        <img
          src="/favicon.svg"
          alt="Sreemantha Hospital Emblem"
          className="w-full h-full object-contain"
        />
      </div>
      <h2 className="font-serif text-xl text-[#183f3d] tracking-tight">
        Sreemantha Hospital
      </h2>
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8f4160] mt-1.5">
        Care, with a human touch
      </p>
    </div>
  );
};
