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

    // Show the SVG loading animation on initial entry
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        setVisible(false);
        try {
          sessionStorage.setItem('sreemantha_intro_shown', 'true');
        } catch {}
        if (onComplete) onComplete();
      }, 450);
    }, 1200);

    return () => clearTimeout(timer);
  }, [visible, onComplete]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at 50% 42%, #fff 10%, #effaff 65%, #fdf1f8)',
      }}
      role="status"
      aria-label="Loading Sreemantha Hospital"
    >
      <div className="w-[90vw] max-w-[780px] flex items-center justify-center">
        <img
          src="/initial-loader.svg"
          alt="Loading Sreemantha Hospital"
          className="w-full h-auto"
        />
      </div>
      <p className="text-xs sm:text-sm font-medium text-[#375c74] mt-3 tracking-wide animate-pulse">
        Getting ready to care for you…
      </p>
    </div>
  );
};
