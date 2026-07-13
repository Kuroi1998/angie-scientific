import React, { useState } from 'react';
import { setUserId } from '../api/progress';
import { useLanguage } from '../hooks/useLanguage';
import { UserCircle } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const { language } = useLanguage();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length >= 3) {
      // In this simulated environment, username is used as userId.
      setUserId(username.trim().toLowerCase().replace(/\s+/g, '_'));
      window.location.reload(); // Reload to initialize UserProgressProvider with the new ID
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        padding: '40px',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--neon-cyan)',
        boxShadow: '0 0 20px rgba(0, 243, 255, 0.2)',
        borderRadius: '12px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <UserCircle size={64} style={{ color: 'var(--neon-cyan)' }} />
        </div>
        <h1 style={{
          fontFamily: 'var(--font-title)',
          color: '#fff',
          fontSize: '24px',
          marginBottom: '8px'
        }}>ANGIE SCIENTIFIC</h1>
        <p style={{
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          marginBottom: '32px'
        }}>
          {language === 'fr' ? "Identifie-toi pour sauvegarder tes découvertes." : "Identifícate para guardar tus descubrimientos."}
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={language === 'fr' ? "Ton pseudo (3 lettres min)" : "Tu apodo (mínimo 3 letras)"}
            style={{
              padding: '12px 16px',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--glass-border)',
              borderRadius: '6px',
              color: '#fff',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={username.trim().length < 3}
            style={{
              padding: '12px',
              background: username.trim().length >= 3 ? 'var(--neon-cyan)' : 'var(--bg-tertiary)',
              color: username.trim().length >= 3 ? '#000' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '6px',
              fontFamily: 'var(--font-title)',
              fontWeight: 'bold',
              cursor: username.trim().length >= 3 ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              boxShadow: username.trim().length >= 3 ? 'var(--glow-cyan)' : 'none'
            }}
          >
            {language === 'fr' ? "COMMENCER L'EXPÉRIENCE" : "COMENZAR LA EXPERIENCIA"}
          </button>
        </form>
      </div>
    </div>
  );
};
