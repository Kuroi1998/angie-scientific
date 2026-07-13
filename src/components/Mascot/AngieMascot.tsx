import React from 'react';
import { useMascot } from './MascotContext';
import { X, Settings2 } from 'lucide-react';

export const AngieMascot: React.FC = () => {
  const { emotion, currentMessage, isVisible, hideMessage, toggleVisibility } = useMascot();
  // We'll use profile settings later to disable sound/animations completely
  // const { profile } = useUserProgress();

  if (!isVisible) {
    return (
      <button 
        onClick={toggleVisibility}
        style={{
          position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000,
          background: 'var(--neon-cyan)', color: '#000', border: 'none',
          borderRadius: '50%', width: '50px', height: '50px',
          boxShadow: 'var(--glow-cyan)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
        aria-label="Afficher Angie"
      >
        A
      </button>
    );
  }

  // Base SVG for Angie (a cute atom/robot)
  const getEyeExpression = () => {
    switch (emotion) {
      case 'happy': return <path d="M 10 20 Q 15 15 20 20 M 30 20 Q 35 15 40 20" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />;
      case 'surprised': return <><circle cx="15" cy="18" r="4" fill="#fff" /><circle cx="35" cy="18" r="4" fill="#fff" /></>;
      case 'worried': return <path d="M 10 18 Q 15 15 20 18 M 30 18 Q 35 15 40 18" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />;
      case 'thinking': return <><path d="M 10 20 L 20 20" stroke="#fff" strokeWidth="3" strokeLinecap="round" /><circle cx="35" cy="18" r="3" fill="#fff" /></>;
      default: return <><circle cx="15" cy="20" r="3" fill="#fff" /><circle cx="35" cy="20" r="3" fill="#fff" /></>;
    }
  };

  return (
    <div style={{
      position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px'
    }}>
      {currentMessage && (
        <div 
          className="speech-bubble animate-pop-in"
          style={{
            background: '#fff', color: '#000', padding: '12px 16px',
            borderRadius: '16px 16px 0 16px', maxWidth: '250px',
            fontFamily: 'var(--font-title)', fontSize: '13px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)', position: 'relative'
          }}
        >
          {currentMessage}
          <button 
            onClick={hideMessage} 
            style={{ position: 'absolute', top: '4px', right: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
          >
            <X size={12} />
          </button>
        </div>
      )}
      
      <div 
        className={`mascot-avatar ${emotion === 'happy' ? 'animate-bounce' : emotion === 'worried' ? 'animate-shake' : 'animate-float'}`}
        style={{ cursor: 'pointer', position: 'relative' }}
        onClick={() => {
          // Click on Angie -> Open settings or show random fact
        }}
      >
        {/* Simple SVG Avatar */}
        <svg width="60" height="60" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="22" fill="var(--bg-secondary)" stroke="var(--neon-cyan)" strokeWidth="2" />
          {/* Orbit paths */}
          <ellipse cx="25" cy="25" rx="20" ry="8" fill="none" stroke="rgba(0, 243, 255, 0.3)" transform="rotate(45 25 25)" />
          <ellipse cx="25" cy="25" rx="20" ry="8" fill="none" stroke="rgba(0, 243, 255, 0.3)" transform="rotate(-45 25 25)" />
          {/* Eyes */}
          {getEyeExpression()}
        </svg>
        <button 
          onClick={(e) => { e.stopPropagation(); toggleVisibility(); }}
          style={{
            position: 'absolute', bottom: '-5px', left: '-5px', background: 'var(--bg-primary)',
            border: '1px solid var(--glass-border)', borderRadius: '50%', padding: '4px',
            color: '#fff', cursor: 'pointer', display: 'flex'
          }}
        >
          <Settings2 size={12} />
        </button>
      </div>
    </div>
  );
};
