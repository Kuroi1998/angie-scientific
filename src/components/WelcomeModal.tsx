import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import type { Language } from '../hooks/useLanguage';
import { ShieldCheck, Globe } from 'lucide-react';

export const WelcomeModal: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  if (language !== null) return null;

  const selectLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  return React.createElement('div', {
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'radial-gradient(circle at center, #0f1122 0%, #05060b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }
  },
    React.createElement('div', {
      className: 'glass-panel scanline-container animate-pulse-glow',
      style: {
        width: '100%',
        maxWidth: '500px',
        padding: '40px 30px',
        background: 'rgba(12, 14, 25, 0.85)',
        border: '1px solid var(--neon-cyan)',
        borderRadius: '12px',
        textAlign: 'center',
        boxShadow: 'var(--glow-cyan)'
      }
    },
      // Futuristic Logo Glow
      React.createElement('div', {
        style: {
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          border: '2px solid var(--neon-cyan)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: 'var(--glow-cyan)',
          background: 'rgba(0, 243, 255, 0.05)'
        }
      },
        React.createElement(Globe, { size: 36, className: 'animate-flicker', style: { color: 'var(--neon-cyan)' } })
      ),

      React.createElement('h1', {
        style: {
          fontFamily: 'var(--font-title)',
          fontSize: '24px',
          fontWeight: '900',
          letterSpacing: '3px',
          color: '#fff',
          textTransform: 'uppercase',
          marginBottom: '8px',
          textShadow: '0 0 10px rgba(0, 243, 255, 0.5)'
        }
      }, "ANGIE SCIENTIFIC"),
      
      React.createElement('p', {
        style: {
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-secondary)',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          marginBottom: '32px'
        }
      }, "SYSTEM IDENTIFICATION / ACCRÉDITATION"),

      React.createElement('h3', {
        style: {
          fontSize: '13px',
          fontFamily: 'var(--font-title)',
          color: '#fff',
          marginBottom: '16px',
          fontWeight: '500'
        }
      }, "SÉLECTIONNEZ VOTRE LANGUE / SELECCIONE SU IDIOMA"),

      // Selector Buttons
      React.createElement('div', {
        style: {
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          marginBottom: '24px'
        }
      },
        React.createElement('button', {
          onClick: () => selectLanguage('fr'),
          style: {
            flex: 1,
            padding: '14px 20px',
            background: 'rgba(0, 243, 255, 0.05)',
            border: '1px solid var(--neon-cyan)',
            borderRadius: '6px',
            color: '#fff',
            fontFamily: 'var(--font-title)',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: 'inset 0 0 10px rgba(0, 243, 255, 0.05)',
            transition: 'all 0.2s'
          },
          className: 'lang-btn'
        }, "FRANÇAIS"),
        
        React.createElement('button', {
          onClick: () => selectLanguage('es'),
          style: {
            flex: 1,
            padding: '14px 20px',
            background: 'rgba(255, 0, 127, 0.05)',
            border: '1px solid var(--neon-magenta)',
            borderRadius: '6px',
            color: '#fff',
            fontFamily: 'var(--font-title)',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: 'inset 0 0 10px rgba(255, 0, 127, 0.05)',
            transition: 'all 0.2s'
          },
          className: 'lang-btn-es'
        }, "ESPAÑOL")
      ),

      React.createElement('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          fontSize: '10px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)'
        }
      },
        React.createElement(ShieldCheck, { size: 12 }),
        "SECURE ACCREDITED INTERFACE v2.4.0"
      )
    )
  );
};
