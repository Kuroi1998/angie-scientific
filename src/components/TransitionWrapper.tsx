import React, { useState, useEffect } from 'react';

interface TransitionWrapperProps {
  activeKey: string;
  children: React.ReactNode;
}

export const TransitionWrapper: React.FC<TransitionWrapperProps> = ({ activeKey, children }) => {
  const [displayKey, setDisplayKey] = useState(activeKey);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionClass, setTransitionClass] = useState('tab-slide-in');

  // Trigger out animation
  if (activeKey !== displayKey && transitionClass !== 'tab-slide-out') {
    setTransitionClass('tab-slide-out');
  }

  useEffect(() => {
    if (activeKey !== displayKey) {
      const timer = setTimeout(() => {
        setDisplayKey(activeKey);
        setDisplayChildren(children);
        setTransitionClass('tab-slide-in');
      }, 200); // 200ms matches the slide-out-fade animation duration
      return () => clearTimeout(timer);
    } else {
      // Keep displayChildren in sync without transition delay
      setDisplayChildren(children);
    }
  }, [activeKey, displayKey, children]);

  // Use fresh children if no transition is occurring, to prevent 1-render lag
  const currentChildren = activeKey === displayKey ? children : displayChildren;

  return (
    <div className={transitionClass} style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
      {currentChildren}
    </div>
  );
};
