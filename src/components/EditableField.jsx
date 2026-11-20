import React from 'react';

function renderEditBadge(text, key) {
  // Strip outer [EDIT: or [EDIT and trailing ] if present for cleaner display alongside the EDIT tag
  const innerText = text
    .replace(/^\[EDIT:?\s*/i, '')
    .replace(/\]$/, '')
    .trim();

  return (
    <span
      key={key}
      className="inline-flex items-baseline gap-1.5 px-2 py-0.5 border border-dashed border-silver bg-white/[0.06] rounded-sm text-silver font-mono text-xs select-none"
    >
      <span className="text-[9px] font-mono font-bold tracking-wider uppercase px-1 py-0.5 bg-white/10 rounded text-text leading-none">
        EDIT
      </span>
      {innerText ? <span className="text-text/90">{innerText}</span> : null}
    </span>
  );
}

export default function EditableField({ value, className = '', as = 'span' }) {
  const content = value ?? '';

  if (typeof content !== 'string') {
    const Tag = as;
    return <Tag className={className}>{content}</Tag>;
  }

  // If the entire string is an [EDIT...] placeholder
  if (content.startsWith('[EDIT')) {
    const Tag = as === 'p' ? 'p' : 'span';
    return (
      <Tag className={className}>
        {renderEditBadge(content, 'single')}
      </Tag>
    );
  }

  // If string contains [EDIT...] anywhere inside it
  if (content.includes('[EDIT')) {
    const parts = content.split(/(\[EDIT[^\]]*\])/g);
    const Tag = as;
    return (
      <Tag className={className}>
        {parts.map((part, index) => {
          if (part.startsWith('[EDIT')) {
            return renderEditBadge(part, index);
          }
          return <span key={index}>{part}</span>;
        })}
      </Tag>
    );
  }

  const Tag = as;
  return <Tag className={className}>{content}</Tag>;
}
