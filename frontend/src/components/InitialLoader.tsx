import React, { useEffect } from 'react';

export const InitialLoader: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    const loader = document.getElementById('initial-loader');
    if (!loader) {
      if (onComplete) onComplete();
      return;
    }

    const timer = setTimeout(() => {
      loader.classList.add('loader-complete');
      const removeTimer = setTimeout(() => {
        loader.remove();
        if (onComplete) onComplete();
      }, 400);
      return () => clearTimeout(removeTimer);
    }, 800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return null;
};

export default InitialLoader;
