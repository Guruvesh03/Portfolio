import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export default function Navbar() {
  const location = useLocation();
  const isPhotography = location.pathname === '/photography';
  const reducedMotion = useReducedMotion();

  const [activeSection, setActiveSection] = useState(isPhotography ? 'photography' : null);
  const lastActiveRef = useRef('work');

  // Links configuration based on route
  const navLinks = isPhotography
    ? [
        { label: 'Home', href: '/', id: 'home', isRouter: true },
        { label: 'Photography', href: '/photography', id: 'photography', isRouter: true },
        { label: 'Contact', href: '/#contact', id: 'contact', isRouter: false },
      ]
    : [
        { label: 'About', href: '#about', id: 'about', isRouter: false },
        { label: 'Work', href: '#work', id: 'work', isRouter: false },
        { label: 'Photography', href: '#field-notes', id: 'photography', isRouter: false },
        { label: 'Contact', href: '#contact', id: 'contact', isRouter: false },
      ];

  // IntersectionObserver for tracking active sections on "/"
  useEffect(() => {
    if (isPhotography) {
      setActiveSection('photography');
      return;
    }

    const sectionIds = ['hero', 'about', 'work', 'stack', 'field-notes', 'contact'];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id === 'hero') {
              // In hero, no active link; lens fades out
              setActiveSection(null);
            } else if (id === 'about') {
              setActiveSection('about');
              lastActiveRef.current = 'about';
            } else if (id === 'work') {
              setActiveSection('work');
              lastActiveRef.current = 'work';
            } else if (id === 'stack') {
              // When Stack is in view, keep the last active link (Work)
              setActiveSection(lastActiveRef.current || 'work');
            } else if (id === 'field-notes') {
              setActiveSection('photography');
              lastActiveRef.current = 'photography';
            } else if (id === 'contact') {
              setActiveSection('contact');
              lastActiveRef.current = 'contact';
            }
          }
        });
      },
      {
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0,
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isPhotography]);

  // Click handler: immediate active state & smooth scroll
  const handleLinkClick = (e, link) => {
    if (!isPhotography) {
      setActiveSection(link.id);
      lastActiveRef.current = link.id;

      if (link.href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(link.href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', link.href);
        }
      }
    } else {
      if (link.href === '/#contact') {
        // Navigating back to contact on Home
        setActiveSection('contact');
      }
    }
  };

  return (
    <>
      {/* Skip to Main Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-accent focus:text-bg font-mono text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-text"
      >
        Skip to main content
      </a>

      {/* Pill Nav Container: Fixed top-center on desktop, fixed bottom-center on mobile */}
      <nav
        aria-label="Primary"
        className="nav-pill-container z-50 flex items-center font-sans select-none whitespace-nowrap fixed left-1/2 -translate-x-1/2 h-[44px] p-[4px] bottom-[calc(12px+env(safe-area-inset-bottom))] md:bottom-auto md:top-[calc(16px+env(safe-area-inset-top))] text-[13px] md:text-[14px]"
      >
        {navLinks.map((link) => {
          const isActive = activeSection === link.id;
          const Tag = link.isRouter ? Link : 'a';

          return (
            <Tag
              key={link.id}
              to={link.isRouter ? link.href : undefined}
              href={!link.isRouter ? link.href : undefined}
              data-cursor="target"
              onClick={(e) => handleLinkClick(e, link)}
              aria-current={isActive ? 'location' : undefined}
              className={`relative h-full flex items-center justify-center px-[12px] md:px-[18px] rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                isActive ? 'text-text' : 'text-muted hover:text-text'
              }`}
            >
              {/* Active Lens Indicator with spring layoutId */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="nav-lens"
                    className="nav-lens absolute inset-0 z-0 pointer-events-none"
                    initial={reducedMotion ? false : { opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reducedMotion ? false : { opacity: 0, scale: 0.92 }}
                    transition={
                      reducedMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 380, damping: 34 }
                    }
                  />
                )}
              </AnimatePresence>

              {/* Link Label */}
              <span className="relative z-10 leading-none">{link.label}</span>
            </Tag>
          );
        })}
      </nav>
    </>
  );
}
