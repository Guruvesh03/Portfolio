import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EditableField from './EditableField';

export default function Lightbox({
  photos,
  currentIndex,
  onClose,
  onNavigate,
}) {
  const isOpen = currentIndex !== null && currentIndex >= 0;
  const currentPhoto = isOpen ? photos[currentIndex] : null;
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Keyboard navigation & Esc to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onNavigate((currentIndex - 1 + photos.length) % photos.length);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNavigate((currentIndex + 1) % photos.length);
      } else if (e.key === 'Tab') {
        // Focus trap
        if (!modalRef.current) return;
        const focusable = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, photos.length, onClose, onNavigate]);

  // Lock body scroll & focus on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => closeBtnRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && currentPhoto && (
        <motion.div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label="Field notes photo lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex flex-col justify-between p-4 md:p-8 bg-bg/95 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Top Bar: Counter & Liquid Glass Close Control */}
          <div className="flex items-center justify-between font-mono text-xs text-muted max-w-5xl w-full mx-auto pb-4 border-b border-line">
            <span>
              {String(currentIndex + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
            </span>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              className="glass min-h-[44px] px-5 py-2 text-text hover:text-accent font-mono text-xs uppercase tracking-widest transition-colors focus-visible:outline-none flex items-center justify-center cursor-pointer"
              aria-label="Close lightbox modal"
            >
              <span className="relative z-[1]">[esc] close</span>
            </button>
          </div>

          {/* Center Stage: Photo & Liquid Glass Navigation Controls */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            {/* Prev button (liquid glass) */}
            <button
              type="button"
              onClick={() => onNavigate((currentIndex - 1 + photos.length) % photos.length)}
              className="glass absolute left-2 md:left-4 z-10 min-h-[44px] min-w-[44px] px-4 py-2.5 font-mono text-xs text-text hover:text-accent transition-colors focus-visible:outline-none flex items-center justify-center cursor-pointer"
              aria-label="Previous photograph"
            >
              <span className="relative z-[1]">&larr; prev</span>
            </button>

            {/* Photo Container */}
            <div className="max-w-4xl max-h-[70vh] flex items-center justify-center">
              <img
                src={currentPhoto.src}
                alt={currentPhoto.alt.startsWith('[EDIT') ? 'Field observation photograph' : currentPhoto.alt}
                width={currentPhoto.width}
                height={currentPhoto.height}
                decoding="async"
                className="max-w-full max-h-[70vh] object-contain border border-line bg-surface"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextSibling.style.display = 'flex';
                }}
              />
              <div
                style={{ display: 'none', width: '320px', height: '240px' }}
                className="items-center justify-center bg-surface border border-line text-muted font-mono text-xs flex-col p-4 text-center"
              >
                <span>[Photo missing: {currentPhoto.src.split('/').pop()}]</span>
              </div>
            </div>

            {/* Next button (liquid glass) */}
            <button
              type="button"
              onClick={() => onNavigate((currentIndex + 1) % photos.length)}
              className="glass absolute right-2 md:right-4 z-10 min-h-[44px] min-w-[44px] px-4 py-2.5 font-mono text-xs text-text hover:text-accent transition-colors focus-visible:outline-none flex items-center justify-center cursor-pointer"
              aria-label="Next photograph"
            >
              <span className="relative z-[1]">next &rarr;</span>
            </button>
          </div>

          {/* Bottom Bar: Caption & Year */}
          <div className="max-w-5xl w-full mx-auto pt-4 border-t border-line flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 font-mono text-xs">
            <div className="text-text">
              <EditableField value={currentPhoto.caption} />
            </div>
            <div className="text-muted">
              <EditableField value={currentPhoto.year} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
