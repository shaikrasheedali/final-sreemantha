import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="breadcrumbs mb-8" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <span aria-hidden="true" className="text-[rgba(22,55,76,0.3)]">/</span>
          {item.path ? (
            <Link to={item.path}>{item.label}</Link>
          ) : (
            <span aria-current="page" className="font-bold text-[var(--ink)]">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
