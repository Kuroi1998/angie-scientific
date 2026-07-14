import { useState } from 'react';
import type { CSSProperties } from 'react';
import { CheckCircle, Lock, Star } from 'lucide-react';
import { Alert, Badge, Button, Panel } from '../../design-system';
import { AudioManager } from '../../services/Audio/AudioManager';
import { useUserProgress } from '../useUserProgress';
import { defaultUnlockedThemes, themeOptions } from './userCenterData';
import { useTheme } from '../../theme/hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';

interface UserThemeGalleryProps {
  compact?: boolean;
}

export function UserThemeGallery({ compact = false }: UserThemeGalleryProps) {
  const { t } = useLanguage('user');
  const { progress, unlockTheme } = useUserProgress();
  const { theme, setTheme } = useTheme();
  const currentXp = progress?.experiencePoints ?? 0;
  const unlocked = progress?.unlockedThemes?.length
    ? progress.unlockedThemes
    : defaultUnlockedThemes;
  const [notice, setNotice] = useState('');

  // setTheme applies the theme immediately and persists it to the profile via
  // UserProgressProvider's 'themechange' listener — no separate equipTheme call needed.
  const chooseTheme = async (themeId: string, cost: number) => {
    AudioManager.getInstance().playClick();
    if (unlocked.includes(themeId) || cost === 0) {
      setTheme(themeId as any);
      setNotice(t('themes.equipped'));
      return;
    }
    if (currentXp < cost) {
      AudioManager.getInstance().playError();
      setNotice(t('themes.insufficientXp'));
      return;
    }
    const success = await unlockTheme(themeId, cost);
    if (success) {
      setTheme(themeId as any);
      setNotice(t('themes.unlocked'));
    }
  };

  return (
    <Panel title={compact ? t('themes.compactTitle') : t('themes.title')}>
      <div className="user-action-row">
        <Badge tone="warning"><Star size={14} aria-hidden="true" /> {currentXp} {t('themes.xp')}</Badge>
        {notice && <Alert title={t('themes.compactTitle')} tone="info">{notice}</Alert>}
      </div>
      <div className="user-theme-grid">
        {themeOptions.map((themeOption) => {
          const isActive = theme === themeOption.id;
          const isUnlocked = unlocked.includes(themeOption.id) || themeOption.cost === 0;
          return (
            <article className="user-theme-card" data-active={isActive} key={themeOption.id}>
              <span
                className="user-swatch"
                style={{ '--user-theme-color': themeOption.color } as CSSProperties}
              />
              <strong>{themeOption.name}</strong>
              <p className="user-muted">{themeOption.description}</p>
              <div className="user-action-row">
                {isActive && <Badge tone="success"><CheckCircle size={14} /> {t('themes.active')}</Badge>}
                {!isUnlocked && <Badge tone="warning"><Lock size={14} /> {themeOption.cost} {t('themes.xp')}</Badge>}
                {!isActive && isUnlocked && (
                  <Button onClick={() => chooseTheme(themeOption.id, themeOption.cost)} size="sm">
                    {t('themes.equip')}
                  </Button>
                )}
                {!isActive && !isUnlocked && (
                  <Button onClick={() => chooseTheme(themeOption.id, themeOption.cost)} size="sm" variant="solid">
                    {t('themes.unlock')}
                  </Button>
                )}</div>
            </article>
          );
        })}
      </div>
    </Panel>
  );
}
