import React from 'react';

interface BrandLogoProps {
  className?: string;
  theme?: 'dark' | 'light';
  alt?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  theme = 'light',
  alt = 'Sreemantha Hospital — Fertility, Women & Child Care',
}) => {
  return (
    <span
      className={`brand-logo ${theme === 'dark' ? 'brand-logo-dark' : ''} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        maxWidth: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1982 607"
        role="img"
        aria-label={alt}
        focusable="false"
        className="w-full h-auto max-w-full aspect-[1982/607] block"
        style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
      >
        <use href="#sreemantha-vector-logo" />
      </svg>
    </span>
  );
};

export default BrandLogo;

