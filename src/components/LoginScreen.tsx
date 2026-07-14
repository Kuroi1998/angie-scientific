import React, { useState } from 'react';
import { setUserId } from '../api/progress';
import { useLanguage } from '../hooks/useLanguage';
import { UserCircle } from 'lucide-react';
import { Button } from '../design-system';

export const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const { t } = useLanguage();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length >= 3) {
      // In this simulated environment, username is used as userId.
      setUserId(username.trim().toLowerCase().replace(/\s+/g, '_'));
      window.location.reload(); // Reload to initialize UserProgressProvider with the new ID
    }
  };

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--as-bg-space)',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        padding: '40px',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <UserCircle size={64} style={{ color: 'var(--as-accent-cyan)' }} aria-hidden="true" />
        </div>
        <h1 style={{
          fontFamily: 'var(--as-font-display)',
          color: 'var(--as-text-primary)',
          fontSize: '24px',
          marginBottom: '8px'
        }}>ANGIE SCIENTIFIC</h1>
        <p style={{
          color: 'var(--as-text-secondary)',
          fontFamily: 'var(--as-font-mono)',
          fontSize: '12px',
          marginBottom: '32px'
        }}>
          {t('login.subtitle', { ns: 'auth' })}
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t('login.placeholder', { ns: 'auth' })}
            aria-label={t('login.ariaLabel', { ns: 'auth' })}
            className="as-input"
          />
          <Button
            type="submit"
            disabled={username.trim().length < 3}
            style={{ width: '100%', marginTop: '8px' }}
          >
            {t('login.submit', { ns: 'auth' })}
          </Button>
        </form>
      </div>
    </main>
  );
};
