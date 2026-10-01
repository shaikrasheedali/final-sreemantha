import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-1.5 text-[11px] text-[#596966] mb-8 flex-wrap uppercase tracking-wider font-semibold" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-[#8f4160] transition text-decoration-none">
        Home
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight size={12} className="text-[#a4b2a8] shrink-0" />
          {item.path ? (
            <Link to={item.path} className="hover:text-[#8f4160] transition text-decoration-none">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#183f3d] font-bold truncate max-w-xs">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
