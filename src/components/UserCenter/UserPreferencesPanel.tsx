import { Globe, MonitorOff, Music, Volume2 } from 'lucide-react';
import { Button, Panel, Switch } from '../../design-system';
import type { UserProfile } from '../../data/educational/models';
import { useLanguage } from '../../hooks/useLanguage';
import { AudioManager } from '../../services/Audio/AudioManager';
import { useUserProgress } from '../useUserProgress';
import { ThemeSelector } from '../../theme/components/ThemeSelector';

interface UserPreferencesPanelProps {
  compact?: boolean;
}

type ProfileFlag = keyof Pick<
  UserProfile,
  'globalSoundEnabled' | 'mascotEnabled' | 'mascotSoundEnabled' | 'reducedMotion'
>;

export function UserPreferencesPanel({ compact = false }: UserPreferencesPanelProps) {
  const { profile, saveProfile } = useUserProgress();
  const { language, setLanguage, t } = useLanguage();

  const toggleProfileFlag = (key: ProfileFlag) => {
    if (!profile) return;
    AudioManager.getInstance().playClick();
    void saveProfile({ [key]: !profile[key] });
  };

  const toggleLanguage = () => {
    AudioManager.getInstance().playClick();
    setLanguage(language === 'fr' ? 'es' : 'fr');
  };

  return (
    <Panel title={compact ? t('preferences', { ns: 'settings' }) : t('preferencesAndAccessibility', { ns: 'settings' })}>
      <div className="user-panel-grid">
        <div className="user-id-card">
          <strong><Volume2 size={19} aria-hidden="true" /> {t('audio', { ns: 'settings' })}</strong>
          <Switch
            checked={profile?.globalSoundEnabled ?? true}
            label={t('globalSound', { ns: 'settings' })}
            onChange={() => toggleProfileFlag('globalSoundEnabled')}
          />
          <Switch
            checked={profile?.mascotSoundEnabled ?? true}
            label={t('angieSound', { ns: 'settings' })}
            onChange={() => toggleProfileFlag('mascotSoundEnabled')}
          />
        </div>
        <div className="user-id-card">
          <strong><Music size={19} aria-hidden="true" /> {t('angie', { ns: 'settings' })}</strong>
          <Switch
            checked={profile?.mascotEnabled ?? true}
            label={t('angieVisible', { ns: 'settings' })}
            onChange={() => toggleProfileFlag('mascotEnabled')}
          />
          <p className="user-muted">{t('angieDesc', { ns: 'settings' })}</p>
        </div>
        <div className="user-id-card">
          <strong><MonitorOff size={19} aria-hidden="true" /> {t('accessibility', { ns: 'settings' })}</strong>
          <Switch
            checked={profile?.reducedMotion ?? false}
            label={t('reducedMotion', { ns: 'settings' })}
            onChange={() => toggleProfileFlag('reducedMotion')}
          />
          <p className="user-muted">{t('reducedMotionDesc', { ns: 'settings' })}</p>
        </div>
        <div className="user-id-card">
          <strong><Globe size={19} aria-hidden="true" /> {t('language', { ns: 'settings' })}</strong>
          <p className="user-muted">{t('languageActive', { ns: 'settings' })}</p>
          <Button onClick={toggleLanguage} variant="outline">
            {t('toggleLanguage', { ns: 'settings' })}
          </Button>
        </div>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <ThemeSelector />
      </div>
    </Panel>
  );
}
