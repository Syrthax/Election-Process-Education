import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageTransition({ children }) {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsVisible(true);
    }, 80);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // On first mount, show immediately
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div style={{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity 0.3s ease, transform 0.3s ease',
    }}>
      {displayChildren}
    </div>
  );
}
