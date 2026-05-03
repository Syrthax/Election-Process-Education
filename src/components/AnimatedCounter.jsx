import { useEffect, useRef, useState } from 'react';
import { useInView } from './useInView';

export default function AnimatedCounter({ target, duration = 1000 }) {
  const [count, setCount] = useState(() => {
    const n = parseInt(target, 10);
    return Number.isFinite(n) ? 0 : target;
  });
  const [ref, inView] = useInView();
  const rafRef = useRef(null);

  useEffect(() => {
    if (!inView) return undefined;
    const num = parseInt(target, 10);
    if (!Number.isFinite(num)) {
      // Non-numeric target: render the literal value once and skip the animation.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCount(target);
      return undefined;
    }

    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * num));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [inView, target, duration]);

  return <span ref={ref}>{count}</span>;
}
