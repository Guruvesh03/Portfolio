import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

export default function CustomCursor() {
  const reducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [cursorType, setCursorType] = useState('default'); // 'default' | 'view'
  const [isVisible, setIsVisible] = useState(false);

  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const animFrameId = useRef(null);

  // Check pointer: fine and touch devices
  useEffect(() => {
    if (reducedMotion) {
      setEnabled(false);
      return;
    }

    const mediaQuery = window.matchMedia('(pointer: fine) and (hover: hover)');
    const updateEnabled = () => setEnabled(mediaQuery.matches);
    updateEnabled();

    mediaQuery.addEventListener('change', updateEnabled);
    return () => mediaQuery.removeEventListener('change', updateEnabled);
  }, [reducedMotion]);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Check if hovering over an element requesting custom cursor ('view' or 'target')
      const target = e.target.closest('[data-cursor]');
      if (target) {
        const type = target.getAttribute('data-cursor');
        setCursorType(type || 'view');
      } else {
        setCursorType('default');
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Easing loop via requestAnimationFrame
    const loop = () => {
      // Easing factor for the 36px/56px ring
      const ease = 0.18;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ease;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ease;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x - 6}px, ${mousePos.current.y - 6}px, 0)`;
      }

      if (ringRef.current) {
        const offset = cursorType === 'view' || cursorType === 'target' ? 28 : 18;
        ringRef.current.style.transform = `translate3d(${ringPos.current.x - offset}px, ${ringPos.current.y - offset}px, 0)`;
      }

      animFrameId.current = requestAnimationFrame(loop);
    };

    animFrameId.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [enabled, isVisible, cursorType]);

  if (!enabled || reducedMotion || !isVisible) {
    return null;
  }

  const isView = cursorType === 'view';
  const isTarget = cursorType === 'target';
  const isExpanded = isView || isTarget;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden" aria-hidden="true">
      {/* 12px Dot (follows cursor directly) */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-3 h-3 rounded-full bg-accent pointer-events-none will-change-transform opacity-75"
        style={{
          transition: 'opacity 0.2s ease',
        }}
      />

      {/* 36px Ring (grows to 56px with "view" or "target" label, follows with easing) */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border pointer-events-none flex items-center justify-center will-change-transform transition-[width,height,border-color,background-color] duration-200 ease-out ${
          isExpanded
            ? 'w-14 h-14 border-accent bg-surface/80 backdrop-blur-[2px]'
            : 'w-9 h-9 border-accent/50 bg-transparent'
        }`}
      >
        {isView && (
          <span className="font-mono text-[10px] tracking-widest text-accent uppercase font-medium select-none">
            view
          </span>
        )}
        {isTarget && (
          <span className="font-mono text-[9px] tracking-widest text-accent uppercase font-medium select-none">
            target
          </span>
        )}
      </div>
    </div>
  );
}
