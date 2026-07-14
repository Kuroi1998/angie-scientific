import { useEffect, useState } from 'react';

export function useIsMobileViewport(breakpointPx = 768): boolean {
  const [isMobile, setIsMobile] = useState(() => (
    typeof window !== 'undefined' && window.innerWidth < breakpointPx
  ));

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [breakpointPx]);

  return isMobile;
}
