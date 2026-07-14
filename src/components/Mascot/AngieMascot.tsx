import React from 'react';
import { Settings2, X } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useMascot } from './useMascot';
import { useUserProgress } from '../useUserProgress';
import './angie-mascot.css';

const factsFr = [
  "Savais-tu que l'eau se dilate en gelant ?",
  "L'helium est le deuxieme element le plus abondant de l'univers !",
  'Le carbone est a la base de toute forme de vie connue sur Terre.',
  "L'or est tellement malleable qu'un gramme peut etre etire sur plusieurs kilometres.",
  "As-tu decouvert de nouveaux elements aujourd'hui ?",
];

const factsEs = [
  'Sabias que el agua se expande al congelarse?',
  'El helio es el segundo elemento mas abundante del universo!',
  'El carbono es la base de todas las formas de vida conocidas en la Tierra.',
  'El oro es muy maleable y se puede estirar en hilos muy finos.',
  'Has descubierto nuevos elementos hoy?',
];

export const AngieMascot: React.FC = () => {
  const { currentMessage, emotion, hideMessage, isVisible, showMessage, toggleVisibility } = useMascot();
  const { language } = useLanguage();
  const { profile } = useUserProgress();

  if (profile?.mascotEnabled === false) return null;

  if (!isVisible) {
    return (
      <button className="angie-mascot-toggle" onClick={toggleVisibility} aria-label="Afficher Angie">
        A
      </button>
    );
  }

  const shareFact = () => {
    const facts = language === 'fr' ? factsFr : factsEs;
    showMessage(facts[Math.floor(Math.random() * facts.length)], 4000, 'happy');
  };

  return (
    <div className="angie-mascot">
      {currentMessage && (
        <div className="angie-mascot-bubble animate-pop-in">
          {currentMessage}
          <button className="angie-mascot-close" onClick={hideMessage} aria-label="Fermer le message Angie">
            <X size={12} />
          </button>
        </div>
      )}
      <div
        className={`angie-mascot-avatar ${emotionClass(emotion)}`}
        key={emotion}
        aria-label="Demander un fait a Angie"
        onClick={shareFact}
        onKeyDown={(event) => {
          if (!['Enter', ' '].includes(event.key)) return;
          event.preventDefault();
          shareFact();
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
        <button className="angie-mascot-mini" onClick={(event) => {
          event.stopPropagation();
          toggleVisibility();
        }} aria-label="Masquer Angie">
          <Settings2 size={12} />
        </button>
      </div>
    </div>
  );
};

function emotionClass(emotion: string) {
  return `angie-emotion-${emotion}`;
}

function eyeExpression(emotion: string) {
  const eyeColor = 'var(--as-text-inverse)';
  if (emotion === 'happy') {
    return <path d="M 10 20 Q 15 15 20 20 M 30 20 Q 35 15 40 20" stroke={eyeColor} strokeWidth="3" fill="none" strokeLinecap="round" />;
  }
  if (emotion === 'surprised') {
    return <><circle cx="15" cy="18" r="4" fill={eyeColor} /><circle cx="35" cy="18" r="4" fill={eyeColor} /></>;
  }
  if (emotion === 'worried') {
    return <path d="M 10 18 Q 15 15 20 18 M 30 18 Q 35 15 40 18" stroke={eyeColor} strokeWidth="3" fill="none" strokeLinecap="round" />;
  }
  if (emotion === 'thinking') {
    return <><path d="M 10 20 L 20 20" stroke={eyeColor} strokeWidth="3" strokeLinecap="round" /><circle cx="35" cy="18" r="3" fill={eyeColor} /></>;
  }
  return <><circle cx="15" cy="20" r="3" fill={eyeColor} /><circle cx="35" cy="20" r="3" fill={eyeColor} /></>;
}
