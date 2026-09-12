/* Optional, one-shot visual entry. Reading and navigation never depend on JS. */
(() => {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!("IntersectionObserver" in window) || !Element.prototype.animate) return;
  const animations = new Set();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (motion.matches) continue;
        const animation = entry.target.animate(
          [
            { transform: "translateY(16px)", opacity: 0.72 },
            { transform: "translateY(0)", opacity: 1 },
          ],
          { duration: 650, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
        );
        animations.add(animation);
        animation.finished
          .catch(() => {})
          .finally(() => animations.delete(animation));
      }
    },
    { threshold: 0.15 },
  );
  document
    .querySelectorAll(".friction .scene, .ai-workflow, .app-demo")
    .forEach((el) => observer.observe(el));
  const stopMotion = () => {
    if (motion.matches) animations.forEach((animation) => animation.cancel());
  };
  if (motion.addEventListener) motion.addEventListener("change", stopMotion);
})();
