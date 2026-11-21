import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { photos } from '../data/photos';
import FieldPhoto from '../components/FieldPhoto';
import Lightbox from '../components/Lightbox';

export default function Photography() {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const reducedMotion = useReducedMotion();

  const sectionFadeProps = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: 'easeOut' },
      };

  return (
    <main id="main-content" className="w-full min-h-screen bg-bg text-text pb-24 md:pb-32">
      <motion.section
        id="field-notes-archive"
        aria-label="Field notes archive"
        {...sectionFadeProps}
        className="max-w-[1200px] mx-auto px-6 pt-24 md:pt-28"
      >
        {/* Navigation Breadcrumb (min 44px tap target) */}
        <div className="mb-8">
          <Link
            to="/"
            className="min-h-[44px] inline-flex items-center font-mono text-xs text-muted hover:text-accent transition-colors focus-visible:outline-none"
          >
            &larr; Back to overview
          </Link>
        </div>

        {/* Header Block */}
        <header className="mb-16 pb-8 border-b border-line">
          <span className="font-mono text-xs text-muted uppercase tracking-widest block mb-3">
            archive // field notes
          </span>
          <h1
            className="font-serif font-normal text-text tracking-tight mb-4"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', lineHeight: 1 }}
          >
            Field notes
          </h1>
          <p className="font-sans text-base md:text-lg text-muted max-w-2xl font-light">
            Field notes on light, urban wildlife, and overlooked structures in Nashik.
          </p>
        </header>

        {/* Masonry Layout */}
        <div className="columns-1 sm:columns-2 lg:columns-2 gap-8 space-y-8">
          {photos.map((photo, index) => (
            <div key={photo.src} className="break-inside-avoid">
              <FieldPhoto
                photo={photo}
                onClick={() => setLightboxIndex(index)}
              />
            </div>
          ))}
        </div>
      </motion.section>

      {/* Lightbox Modal */}
      <Lightbox
        photos={photos}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </main>
  );
}
