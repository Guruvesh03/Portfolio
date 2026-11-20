import React, { useState } from 'react';
import EditableField from './EditableField';

export default function FieldPhoto({
  photo,
  onClick,
  priority = false,
  className = '',
  showCaption = true,
}) {
  const [hasError, setHasError] = useState(false);
  const aspectRatio = photo.width && photo.height ? `${photo.width} / ${photo.height}` : '4 / 3';

  return (
    <figure className={`group flex flex-col ${className}`}>
      <div
        data-cursor="view"
        className="relative w-full overflow-hidden bg-surface border border-line cursor-pointer focus-within:ring-1 focus-within:ring-accent"
        style={{ aspectRatio }}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
          }
        }}
        tabIndex={onClick ? 0 : undefined}
        role={onClick ? 'button' : undefined}
        aria-label={onClick ? `View photo: ${photo.caption}` : undefined}
      >
        {!hasError ? (
          <img
            src={photo.thumb || photo.src}
            alt={photo.alt.startsWith('[EDIT') ? 'Field observation photograph' : photo.alt}
            width={photo.width}
            height={photo.height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onError={() => setHasError(true)}
            className="w-full h-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.02] will-change-transform"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-surface text-center">
            <span className="font-mono text-[11px] text-muted tracking-wider uppercase mb-1">
              Field note
            </span>
            <span className="font-mono text-xs text-muted/60">
              {photo.src.split('/').pop()}
            </span>
          </div>
        )}
      </div>

      {showCaption && (
        <figcaption className="mt-2.5 flex items-baseline justify-between gap-3 font-mono text-xs text-muted transition-colors duration-300 group-hover:text-text">
          <div className="flex-1 truncate">
            <EditableField value={photo.caption} className="text-muted group-hover:text-text transition-colors duration-300" />
          </div>
          <div className="flex-shrink-0">
            <EditableField value={photo.year} className="text-muted/70 group-hover:text-muted transition-colors duration-300" />
          </div>
        </figcaption>
      )}
    </figure>
  );
}
