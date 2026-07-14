import React from 'react';
import { Settings2 } from 'lucide-react';
import type { Emotion } from '../state/angie.types';

interface AngieAvatarProps {
  emotion: Emotion;
  activateLabel: string;
  hideLabel: string;
  onActivate: () => void;
  onToggleVisibility: () => void;
}

const eyeColor = 'var(--as-text-inverse)';

function eyeExpression(emotion: Emotion) {
  switch (emotion) {
    case 'happy':
    case 'encouraging':
    case 'proud':
      return <path d="M 10 20 Q 15 15 20 20 M 30 20 Q 35 15 40 20" stroke={eyeColor} strokeWidth="3" fill="none" strokeLinecap="round" />;
    case 'celebrating':
      return (
        <>
          <path d="M 10 20 Q 15 15 20 20 M 30 20 Q 35 15 40 20" stroke={eyeColor} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 6 8 L 8 12 M 42 8 L 40 12" stroke="var(--as-accent-amber)" strokeWidth="2" strokeLinecap="round" />
        </>
      );
    case 'surprised':
      return <><circle cx="15" cy="18" r="4" fill={eyeColor} /><circle cx="35" cy="18" r="4" fill={eyeColor} /></>;
    case 'worried':
      return <path d="M 10 18 Q 15 15 20 18 M 30 18 Q 35 15 40 18" stroke={eyeColor} strokeWidth="3" fill="none" strokeLinecap="round" />;
    case 'confused':
      return <><path d="M 10 20 L 20 17" stroke={eyeColor} strokeWidth="3" strokeLinecap="round" /><path d="M 30 17 L 40 20" stroke={eyeColor} strokeWidth="3" strokeLinecap="round" /></>;
    case 'thinking':
      return <><path d="M 10 20 L 20 20" stroke={eyeColor} strokeWidth="3" strokeLinecap="round" /><circle cx="35" cy="18" r="3" fill={eyeColor} /></>;
    case 'explaining':
      return <><circle cx="15" cy="20" r="3" fill={eyeColor} /><circle cx="35" cy="20" r="3" fill={eyeColor} /><path d="M 18 32 Q 25 36 32 32" stroke={eyeColor} strokeWidth="2" fill="none" strokeLinecap="round" /></>;
    case 'curious':
      return <><circle cx="15" cy="20" r="3" fill={eyeColor} /><path d="M 30 16 Q 35 13 40 16" stroke={eyeColor} strokeWidth="3" fill="none" strokeLinecap="round" /></>;
    case 'sleepy':
      return <path d="M 10 20 L 20 20 M 30 20 L 40 20" stroke={eyeColor} strokeWidth="3" strokeLinecap="round" />;
    case 'attentive':
      return <><circle cx="15" cy="20" r="3.5" fill={eyeColor} /><circle cx="35" cy="20" r="3.5" fill={eyeColor} /></>;
    default:
      return <><circle cx="15" cy="20" r="3" fill={eyeColor} /><circle cx="35" cy="20" r="3" fill={eyeColor} /></>;
  }
}

export const AngieAvatar: React.FC<AngieAvatarProps> = ({ emotion, activateLabel, hideLabel, onActivate, onToggleVisibility }) => (
  <div
    className={`angie-mascot-avatar angie-emotion-${emotion}`}
    key={emotion}
    aria-label={activateLabel}
    onClick={onActivate}
    onKeyDown={(event) => {
      if (!['Enter', ' '].includes(event.key)) return;
      event.preventDefault();
      onActivate();
    }}
    role="button"
    tabIndex={0}
  >
    <svg width="60" height="60" viewBox="0 0 50 50" aria-hidden="true">
      <circle cx="25" cy="25" r="22" fill="var(--as-surface-inverse)" stroke="var(--as-accent-cyan)" strokeWidth="2" />
      <ellipse cx="25" cy="25" rx="20" ry="8" fill="none" stroke="var(--as-accent-cyan-soft)" transform="rotate(45 25 25)" />
      <ellipse cx="25" cy="25" rx="20" ry="8" fill="none" stroke="var(--as-accent-cyan-soft)" transform="rotate(-45 25 25)" />
      {eyeExpression(emotion)}
    </svg>
    <button
      className="angie-mascot-mini"
      onClick={(event) => {
        event.stopPropagation();
        onToggleVisibility();
      }}
      aria-label={hideLabel}
    >
      <Settings2 size={12} />
    </button>
  </div>
);
