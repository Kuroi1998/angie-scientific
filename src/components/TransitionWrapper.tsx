import React, { useState, useEffect } from 'react';

interface TransitionWrapperProps {
  activeKey: string;
  children: React.ReactNode;
}

export const TransitionWrapper: React.FC<TransitionWrapperProps> = ({ activeKey, children }) => {
  const [displayKey, setDisplayKey] = useState(activeKey);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionClass, setTransitionClass] = useState('is-entering');

  useEffect(() => {
    if (activeKey === displayKey) {
      setDisplayChildren(children);
      return undefined;
    }

    if (shouldReduceMotion()) {
      setDisplayKey(activeKey);
      setDisplayChildren(children);
      setTransitionClass('is-entering');
      return undefined;
    }

    setTransitionClass('is-exiting');
    const timer = window.setTimeout(() => {
      setDisplayKey(activeKey);
      setDisplayChildren(children);
      setTransitionClass('is-entering');
    }, 140);
    return () => window.clearTimeout(timer);
  }, [activeKey, displayKey, children]);

  useEffect(() => {
    if (activeKey !== displayKey) {
      return;
    }
    const timer = window.setTimeout(() => setTransitionClass(''), 220);
    return () => window.clearTimeout(timer);
  }, [activeKey, displayKey]);

  const currentChildren = activeKey === displayKey ? children : displayChildren;

  return (
    <div className={`as-page-transition ${transitionClass}`}>
      {currentChildren}
    </div>
  );
};

function shouldReduceMotion() {
  if (typeof window === 'undefined') return false;
  return document.documentElement.dataset.reducedMotion === 'true'
    || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
