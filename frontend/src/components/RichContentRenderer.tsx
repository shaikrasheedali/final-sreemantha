import React from 'react';

interface RichContentRendererProps {
  content?: string | null;
  className?: string;
}

export const RichContentRenderer: React.FC<RichContentRendererProps> = ({
  content,
  className = '',
}) => {
  if (!content) return null;

  return (
    <div
      className={`wysiwyg-content ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
