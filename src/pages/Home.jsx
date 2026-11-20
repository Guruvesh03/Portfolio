import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { projects } from '../data/projects';
import { heroImage, portraitImage, photos } from '../data/photos';
import EditableField from '../components/EditableField';
import FieldPhoto from '../components/FieldPhoto';
import Lightbox from '../components/Lightbox';

export default function Home() {
  const [expandedId, setExpandedId] = useState(null);
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [portraitImgFailed, setPortraitImgFailed] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const reducedMotion = useReducedMotion();

  const toggleProject = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Section fade up animation config: 12px once, 500ms
  const sectionFadeProps = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-50px' },
        transition: { duration: 0.5, ease: 'easeOut' },
      };

  return (
    <main id="main-content" className="w-full pb-[88px] md:pb-0">
      {/* 1. HERO (photo band on top, then a solid dark block in --bg) */}
      <section
        id="hero"
        aria-label="Hero"
        className="relative w-full border-b border-line bg-bg"
      >
        {/* Photo band: full-width, desktop 55svh (min 320px), mobile 60svh */}
        <div className="relative w-full h-[60svh] md:h-[55svh] min-h-[320px] overflow-hidden bg-surface">
          {!heroImgFailed ? (
            <img
              src={heroImage.src}
              width={heroImage.width}
              height={heroImage.height}
              alt=""
              fetchPriority="high"
              decoding="async"
              onError={() => setHeroImgFailed(true)}
              className="w-full h-full object-cover"
              style={{
                objectPosition: 'var(--hero-pos, var(--hero-pos-desktop))',
              }}
            />
          ) : (
            <div className="w-full h-full bg-surface flex items-center justify-center">
              <span className="font-mono text-xs text-muted/60 uppercase tracking-widest">
                [hero photo]
              </span>
            </div>
          )}

          {/* Subtle top scrim behind the nav */}
          <div
            className="absolute top-0 left-0 right-0 h-[120px] pointer-events-none z-10"
            style={{
              background:
                'linear-gradient(to bottom, rgba(10, 13, 12, 0.35) 0%, transparent 100%)',
            }}
            aria-hidden="true"
          />

          {/* Bottom fade: 120px linear-gradient from transparent to var(--bg) */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[120px] pointer-events-none z-10"
            style={{
              background:
                'linear-gradient(to bottom, transparent 0%, var(--bg) 100%)',
            }}
            aria-hidden="true"
          />
        </div>

        {/* Below the photo, a solid block with background --bg, max-width 1200px */}
        <div className="w-full bg-bg">
          <div className="max-w-[1200px] mx-auto px-6 pt-8 pb-12 md:pt-10 md:pb-14">
            {/* H1 in Fraunces weight 700, letter-spacing -0.03em, line-height 1, color --text. Line-by-line reveal */}
            <h1
              className="font-serif font-bold text-text tracking-tight text-left select-none mb-6"
              style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1,
                fontSize: 'clamp(2.75rem, 9.5vw, 9rem)',
              }}
            >
              <span className="inline-block overflow-hidden py-1 mr-[0.25em]">
                <motion.span
                  className="inline-block"
                  initial={reducedMotion ? false : { y: '115%' }}
                  animate={{ y: '0%' }}
                  transition={{
                    duration: 0.7,
                    ease: [0.2, 0.7, 0.2, 1],
                    delay: 0.1,
                  }}
                >
                  Guruvesh
                </motion.span>
              </span>
              <span className="inline-block overflow-hidden py-1">
                <motion.span
                  className="inline-block"
                  initial={reducedMotion ? false : { y: '115%' }}
                  animate={{ y: '0%' }}
                  transition={{
                    duration: 0.7,
                    ease: [0.2, 0.7, 0.2, 1],
                    delay: 0.22,
                  }}
                >
                  Bachhav
                </motion.span>
              </span>
            </h1>

            {/* Row with two sides: left intro/status, right buttons */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
              {/* Left side: two-line intro in Hanken Grotesk max-w-[34rem], then mono status line with accent dot */}
              <div className="max-w-[34rem] space-y-3">
                <p className="font-sans text-base md:text-lg text-text/90 font-light leading-relaxed">
                  Software developer. I build APIs, web apps and ML-backed tools, and photograph animals on my phone.
                </p>
                <div className="flex items-center gap-2 font-mono text-xs md:text-sm text-muted flex-wrap">
                  <span className="w-2 h-2 rounded-full bg-accent inline-block flex-shrink-0" aria-hidden="true" />
                  <span>
                    Final-year Computer Engineering &middot; Nashik &middot; Graduating 2027 &middot; Open to software developer roles
                  </span>
                </div>
              </div>

              {/* Right side: two buttons, rectangular (radius 2px), mono-free, with arrow icon ↗ at end */}
              <div className="flex items-center gap-4 flex-wrap flex-shrink-0">
                <a
                  href="#work"
                  className="min-h-[44px] px-5 py-2.5 rounded-[2px] border border-accent text-accent hover:bg-[rgba(93,187,99,0.12)] transition-colors font-sans text-sm font-medium inline-flex items-center gap-1.5 focus-visible:outline-none"
                >
                  <span>View work</span>
                  <span aria-hidden="true">&#x2197;</span>
                </a>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-5 py-2.5 rounded-[2px] bg-surface text-text hover:bg-surface-2 border border-line transition-colors font-sans text-sm font-medium inline-flex items-center gap-1.5 focus-visible:outline-none"
                >
                  <span>Resume</span>
                  <span aria-hidden="true">&#x2197;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT (full-bleed --surface-2 band with vertical padding 7rem) */}
      <section
        id="about"
        aria-label="About"
        className="w-full bg-surface-2 py-28 border-b border-line"
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Columns 1 to 3: The Label */}
            <div className="md:col-span-3">
              <h2
                className="font-serif font-bold text-text leading-none mb-4"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '3rem',
                  fontWeight: 700,
                }}
              >
                About
              </h2>
              <div className="space-y-1 font-sans text-sm text-muted">
                <p>Final-year Computer Engineering</p>
                <p>Nashik, India</p>
              </div>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] inline-flex items-center font-sans text-sm text-text hover:text-accent underline underline-offset-4 mt-4 transition-colors focus-visible:outline-none"
              >
                Download resume
              </a>
            </div>

            {/* Columns 4 to 7: The Portrait (sticky top-24, aspect 4:5, data-cursor="target") */}
            <div className="md:col-span-4 flex justify-center md:justify-start self-start">
              <div className="w-full max-w-[340px] lg:max-w-[360px] md:sticky md:top-24">
                <figure className="w-full">
                  <div
                    data-cursor="target"
                    className="portrait-wrapper focus-within:ring-1 focus-within:ring-accent"
                  >
                    {!portraitImgFailed ? (
                      <img
                        src={portraitImage.src}
                        alt="Guruvesh Bachhav portrait"
                        width={portraitImage.width}
                        height={portraitImage.height}
                        decoding="sync"
                        onError={() => setPortraitImgFailed(true)}
                        className="portrait-img"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                        <span className="font-mono text-xs text-muted/70 tracking-widest uppercase">
                          portrait
                        </span>
                      </div>
                    )}
                  </div>
                  <figcaption className="mt-3 font-mono text-xs text-muted text-center md:text-left">
                    <EditableField value="[EDIT: caption]" />
                  </figcaption>
                </figure>
              </div>
            </div>

            {/* Columns 8 to 12: Heading, Paragraph, and Three Mono Lines */}
            <div className="md:col-span-5 space-y-6">
              <h3
                className="font-serif font-semibold text-text leading-tight"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2rem',
                  fontWeight: 600,
                }}
              >
                Software developer.
              </h3>

              <p className="font-sans text-base md:text-lg text-text/90 leading-relaxed font-light">
                I'm a final-year Computer Engineering student from Nashik. I did a Data Science and AI/ML internship at SupraTech and now focus on Python backend development. I like building things that explain their own decisions. Outside code, I photograph animals and daily scenes on my phone.
              </p>

              {/* Three mono lines: Building, Learning, Practicing */}
              <div id="now" className="pt-4 border-t border-line/60 space-y-3 font-sans text-sm">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                  <span className="font-mono text-xs text-muted uppercase tracking-wider min-w-[90px]">
                    Building:
                  </span>
                  <span className="text-text">
                    Sentimate, my final-year project (FastAPI, XGBoost, React)
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                  <span className="font-mono text-xs text-muted uppercase tracking-wider min-w-[90px]">
                    Learning:
                  </span>
                  <span className="text-text">
                    Python backend depth, PostgreSQL, system design basics
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                  <span className="font-mono text-xs text-muted uppercase tracking-wider min-w-[90px]">
                    Practicing:
                  </span>
                  <span className="text-text">
                    data structures and algorithms
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SELECTED WORK (followed by the projects) */}
      <motion.section
        id="work"
        aria-label="Selected work"
        {...sectionFadeProps}
        className="max-w-[1200px] mx-auto px-6 py-24 md:py-32 border-b border-line"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-3">
            <h2 className="font-mono text-xs text-muted uppercase tracking-widest block font-normal">
              03 // selected work
            </h2>
          </div>
          <div className="md:col-span-9">
            <div className="divide-y divide-line border-t border-b border-line">
              {projects.map((item) => {
                const isExpanded = expandedId === item.id;
                const isFeatured = item.featured !== false;

                // Non-featured compact row
                if (!isFeatured) {
                  return (
                    <article key={item.id} className="py-6 transition-colors">
                      <div
                        data-cursor="view"
                        className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 group transition-transform duration-300 ease-out motion-safe:hover:translate-x-1.5"
                      >
                        <div className="space-y-2 max-w-3xl">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-mono text-xs text-accent">
                              {item.number}
                            </span>
                            {/* Title with drawing accent underline */}
                            <div className="relative inline-block">
                              <h3 className="font-serif text-xl md:text-2xl text-text font-normal group-hover:text-accent transition-colors pb-0.5">
                                {item.title}
                              </h3>
                              <span
                                className="absolute left-0 bottom-0 w-full h-[1px] bg-accent origin-left scale-x-0 transition-transform duration-300 ease-out motion-safe:group-hover:scale-x-100 pointer-events-none"
                                aria-hidden="true"
                              />
                            </div>
                            <EditableField
                              value={item.status}
                              className="text-[11px] uppercase tracking-wider font-mono text-muted border border-line px-2 py-0.5"
                            />
                            <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-muted/70">
                              {item.stack.map((st) => (
                                <span key={st}>{st}</span>
                              ))}
                            </div>
                          </div>
                          <p className="font-sans text-sm text-muted leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 font-mono text-xs self-start md:self-center shrink-0">
                          {item.links.map((link) => (
                            <a
                              key={link.label}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="min-h-[44px] inline-flex items-center text-text hover:text-accent border-b border-accent pb-0.5 transition-colors focus-visible:outline-none"
                            >
                              <span>{link.label}</span>
                              <span aria-hidden="true">&rarr;</span>
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* Optional Note Field */}
                      {item.note && (
                        <p className="font-mono text-xs text-muted/80 mt-2.5">
                          <EditableField value={item.note} />
                        </p>
                      )}
                    </article>
                  );
                }

                return (
                  <article key={item.id} className="py-8 transition-colors">
                    {/* Expandable Row */}
                    <button
                      type="button"
                      data-cursor="view"
                      onClick={() => toggleProject(item.id)}
                      aria-expanded={isExpanded}
                      aria-controls={`case-study-${item.id}`}
                      className="w-full min-h-[44px] text-left flex flex-col md:flex-row md:items-baseline justify-between gap-4 group focus-visible:outline-none transition-transform duration-300 ease-out motion-safe:group-hover:translate-x-2"
                    >
                      <div className="space-y-2 max-w-2xl transition-transform duration-300 ease-out motion-safe:group-hover:translate-x-1.5">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-mono text-xs text-accent">
                            {item.number}
                          </span>
                          {/* Title with drawing accent underline */}
                          <div className="relative inline-block">
                            <h3 className="font-serif text-2xl md:text-3xl text-text font-normal group-hover:text-accent transition-colors pb-0.5">
                              {item.title}
                            </h3>
                            <span
                              className="absolute left-0 bottom-0 w-full h-[1px] bg-accent origin-left scale-x-0 transition-transform duration-300 ease-out motion-safe:group-hover:scale-x-100 pointer-events-none"
                              aria-hidden="true"
                            />
                          </div>
                          <EditableField
                            value={item.status}
                            className="text-[11px] uppercase tracking-wider font-mono text-muted border border-line px-2 py-0.5"
                          />
                        </div>
                        <p className="font-sans text-sm md:text-base text-muted leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 self-start md:self-center font-mono text-xs text-muted">
                        <div className="hidden lg:flex items-center gap-2">
                          {item.stack.slice(0, 3).map((st) => (
                            <span key={st} className="text-muted/70">
                              {st}
                            </span>
                          ))}
                        </div>
                        <span className="text-text group-hover:text-accent">
                          {isExpanded ? '[ − close ]' : '[ + details ]'}
                        </span>
                      </div>
                    </button>

                    {/* Optional Note Field for featured rows */}
                    {item.note && (
                      <p className="font-mono text-xs text-muted/80 mt-2.5">
                        <EditableField value={item.note} />
                      </p>
                    )}

                    {/* In-page Case-study Panel */}
                    {isExpanded && (
                      <div
                        id={`case-study-${item.id}`}
                        className="mt-8 pt-6 border-t border-line/60 space-y-6 text-sm"
                      >
                        {/* Problem */}
                        <div>
                          <h4 className="font-mono text-xs text-muted uppercase tracking-wider block mb-1">
                            Problem
                          </h4>
                          <EditableField as="p" value={item.problem} className="text-text/90" />
                        </div>

                        {/* What I built */}
                        <div>
                          <h4 className="font-mono text-xs text-muted uppercase tracking-wider block mb-1">
                            What I built
                          </h4>
                          <EditableField as="p" value={item.built} className="text-text/90" />
                        </div>

                        {/* The hard part */}
                        <div>
                          <h4 className="font-mono text-xs text-muted uppercase tracking-wider block mb-1">
                            The hard part
                          </h4>
                          <EditableField as="p" value={item.hardPart} className="text-text/90" />
                        </div>

                        {/* Stack */}
                        <div>
                          <h4 className="font-mono text-xs text-muted uppercase tracking-wider block mb-2">
                            Stack
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {item.stack.map((st) => (
                              <span
                                key={st}
                                className="font-mono text-xs px-2 py-1 bg-surface border border-line text-text"
                              >
                                {st}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Links */}
                        <div>
                          <h4 className="font-mono text-xs text-muted uppercase tracking-wider block mb-2">
                            Links
                          </h4>
                          <div className="flex flex-wrap items-center gap-4">
                            {item.links.map((link) => {
                              const isEditableLink = link.href.startsWith('[EDIT');
                              return isEditableLink ? (
                                <span
                                  key={link.label}
                                  className="inline-flex items-center gap-1 font-mono text-xs px-2 py-0.5 border border-dashed border-silver text-silver bg-white/[0.06] rounded-sm"
                                >
                                  <span>{link.label}:</span>
                                  <span>{link.href}</span>
                                </span>
                              ) : (
                                <a
                                  key={link.label}
                                  href={link.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="min-h-[44px] inline-flex items-center font-mono text-xs text-text hover:text-accent border-b border-accent pb-0.5 transition-colors focus-visible:outline-none"
                                >
                                  {link.label} &rarr;
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            {/* Coursework Note */}
            <p className="font-mono text-xs text-muted mt-6">
              Also: AWS EC2 architecture design (coursework project).
            </p>
          </div>
        </div>
      </motion.section>

      {/* 4. STACK */}
      <motion.section
        id="stack"
        aria-label="Stack"
        {...sectionFadeProps}
        className="max-w-[1200px] mx-auto px-6 py-24 md:py-32 border-b border-line"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-3">
            <h2 className="font-mono text-xs text-muted uppercase tracking-widest block font-normal">
              04 // stack
            </h2>
          </div>
          <div className="md:col-span-9 space-y-4 font-sans text-sm md:text-base">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
              <span className="font-mono text-xs text-muted uppercase tracking-wider min-w-[160px]">
                Languages:
              </span>
              <span className="text-text">Python, Java, JavaScript, C++</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
              <span className="font-mono text-xs text-muted uppercase tracking-wider min-w-[160px]">
                Backend and data:
              </span>
              <span className="text-text">FastAPI, PostgreSQL, Supabase, MongoDB, SQL</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
              <span className="font-mono text-xs text-muted uppercase tracking-wider min-w-[160px]">
                Frontend:
              </span>
              <span className="text-text">React, HTML, CSS</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
              <span className="font-mono text-xs text-muted uppercase tracking-wider min-w-[160px]">
                ML:
              </span>
              <span className="text-text">Scikit-learn, XGBoost, SHAP, NLP</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
              <span className="font-mono text-xs text-muted uppercase tracking-wider min-w-[160px]">
                Cloud:
              </span>
              <span className="text-text">AWS (Academy coursework)</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
              <span className="font-mono text-xs text-muted uppercase tracking-wider min-w-[160px]">
                Tools:
              </span>
              <span className="text-text">Git, GitHub, Postman</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 5. FIELD NOTES / PHOTOGRAPHY (at the last second, before contact) */}
      <motion.section
        id="field-notes"
        aria-label="Field notes"
        {...sectionFadeProps}
        className="max-w-[1200px] mx-auto px-6 py-24 md:py-32 border-b border-line"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-3">
            <h2 className="font-mono text-xs text-muted uppercase tracking-widest block font-normal">
              05 // field notes
            </h2>
          </div>
          <div className="md:col-span-9">
            {/* Asymmetric layout of four photos */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
              {/* Photo 1: Landscape (span 7) */}
              <div className="sm:col-span-7">
                <FieldPhoto
                  photo={photos[0]}
                  onClick={() => setLightboxIndex(0)}
                />
              </div>

              {/* Photo 2: Portrait (span 5, offset) */}
              <div className="sm:col-span-5 sm:pt-8">
                <FieldPhoto
                  photo={photos[1]}
                  onClick={() => setLightboxIndex(1)}
                />
              </div>

              {/* Photo 3: Landscape (span 5) */}
              <div className="sm:col-span-5">
                <FieldPhoto
                  photo={photos[2]}
                  onClick={() => setLightboxIndex(2)}
                />
              </div>

              {/* Photo 4: 4:3 (span 7) */}
              <div className="sm:col-span-7">
                <FieldPhoto
                  photo={photos[3]}
                  onClick={() => setLightboxIndex(3)}
                />
              </div>
            </div>

            {/* Link to all field notes */}
            <div className="mt-8 pt-6 border-t border-line flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
              <p className="font-mono text-xs text-muted">
                Observational records: systems, light, and animals in Nashik. Shot on phone.
              </p>
              <Link
                to="/photography"
                className="min-h-[44px] inline-flex items-center font-mono text-xs uppercase tracking-wider text-text hover:text-accent border-b border-accent pb-0.5 transition-colors self-start sm:self-auto"
              >
                See all field notes &rarr;
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 6. CONTACT */}
      <motion.section
        id="contact"
        aria-label="Contact"
        {...sectionFadeProps}
        className="max-w-[1200px] mx-auto px-6 py-24 md:py-32 border-b border-line"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-3">
            <h2 className="font-mono text-xs text-muted uppercase tracking-widest block font-normal">
              06 // contact
            </h2>
          </div>
          <div className="md:col-span-9 space-y-6">
            <div className="space-y-3 font-sans text-sm md:text-base">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                <span className="font-mono text-xs text-muted uppercase tracking-wider min-w-[120px]">
                  Email:
                </span>
                <a
                  href="mailto:guruveshbachhav@gmail.com"
                  className="min-h-[44px] inline-flex items-center text-text hover:text-accent border-b border-line hover:border-accent pb-0.5 transition-colors focus-visible:outline-none"
                >
                  guruveshbachhav@gmail.com
                </a>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                <span className="font-mono text-xs text-muted uppercase tracking-wider min-w-[120px]">
                  GitHub:
                </span>
                <a
                  href="https://github.com/Guruvesh03"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] inline-flex items-center text-text hover:text-accent border-b border-line hover:border-accent pb-0.5 transition-colors focus-visible:outline-none"
                >
                  https://github.com/Guruvesh03
                </a>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                <span className="font-mono text-xs text-muted uppercase tracking-wider min-w-[120px]">
                  LinkedIn:
                </span>
                <a
                  href="https://www.linkedin.com/in/guruvesh-bachhav-099538312/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] inline-flex items-center text-text hover:text-accent border-b border-line hover:border-accent pb-0.5 transition-colors focus-visible:outline-none"
                >
                  https://www.linkedin.com/in/guruvesh-bachhav-099538312/
                </a>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                <span className="font-mono text-xs text-muted uppercase tracking-wider min-w-[120px]">
                  Resume:
                </span>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] inline-flex items-center text-text hover:text-accent border-b border-line hover:border-accent pb-0.5 transition-colors focus-visible:outline-none"
                >
                  /resume.pdf
                </a>
              </div>
            </div>

            <p className="font-mono text-xs text-accent pt-4">
              Open to software developer roles for 2027.
            </p>
          </div>
        </div>
      </motion.section>

      {/* 7. FOOTER */}
      <footer
        id="footer"
        aria-label="Footer"
        className="max-w-[1200px] mx-auto px-6 py-16"
      >
        <p className="font-mono text-xs text-muted tracking-wider">
          &copy; 2026 Guruvesh Bachhav
        </p>
      </footer>

      {/* Lightbox for Home Teaser */}
      <Lightbox
        photos={photos}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </main>
  );
}
