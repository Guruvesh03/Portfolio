/**
 * Dev-only image quality checker.
 * Automatically stripped from production builds.
 */
export function runDevImageCheck() {
  if (!import.meta.env.DEV) return;

  const performCheck = () => {
    const images = Array.from(document.querySelectorAll('img'));
    const dpr = window.devicePixelRatio || 1;
    const rows = [];

    images.forEach((img) => {
      // Ignore tiny icons or empty src
      if (!img.src || img.src.endsWith('.svg')) return;

      const file = (img.currentSrc || img.src).split('/').pop() || 'unknown';
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;
      const rect = img.getBoundingClientRect();
      const shownWidth = Math.round(rect.width);
      const shownHeight = Math.round(rect.height);

      if (shownWidth === 0 && shownHeight === 0) return;

      const neededWidth = Math.round(shownWidth * dpr);
      const neededHeight = Math.round(shownHeight * dpr);
      const tooSmall = naturalWidth < neededWidth;

      rows.push({
        file,
        naturalSize: `${naturalWidth}x${naturalHeight}`,
        shownCssPx: `${shownWidth}x${shownHeight}`,
        neededPx: `${neededWidth}x${neededHeight}`,
        tooSmall,
      });

      if (tooSmall && naturalWidth > 0) {
        console.warn(
          `[Image Quality Check] "${file}" is tooSmall: natural width ${naturalWidth}px < needed ${neededWidth}px (${shownWidth} CSS px * ${dpr} DPR)`
        );
      }
    });

    if (rows.length > 0) {
      console.log('%c[Image Quality Audit - Revision 11]', 'color: #5DBB63; font-weight: bold;');
      console.table(rows);
    }
  };

  if (document.readyState === 'complete') {
    setTimeout(performCheck, 1500);
  } else {
    window.addEventListener('load', () => setTimeout(performCheck, 1500));
  }
}
