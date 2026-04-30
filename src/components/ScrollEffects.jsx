import { useEffect, useRef, useState } from 'react';

export default function ScrollToTop() {
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  return null;
}

/**
 * Hook to detect if an element is in viewport
 */
export function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

/**
 * Animated counter for stats
 */
export function AnimatedCounter({ target, duration = 1000 }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView();

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const num = parseInt(target, 10);
    if (isNaN(num)) { setCount(target); return; }

    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * num));
      if (progress >= 1) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return <span ref={ref}>{count}</span>;
}
