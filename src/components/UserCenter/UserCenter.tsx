import { useEffect, useMemo, useState } from 'react';
import { Medal, Palette, Settings, UserCircle, Workflow } from 'lucide-react';
import { PageHeader, Tabs } from '../../design-system';
import { useUserProgress } from '../useUserProgress';
import { UserAlbumPanel } from './UserAlbumPanel';
import { UserPreferencesPanel } from './UserPreferencesPanel';
import { UserProfilePanel } from './UserProfilePanel';
import { UserProgressPanel } from './UserProgressPanel';
import { UserThemeGallery } from './UserThemeGallery';
import type { UserCenterSection } from './userCenterData';
import { getUserMetrics } from './userCenterModel';
import { useLanguage } from '../../hooks/useLanguage';
import './user-center.css';

interface UserCenterProps {
  initialSection?: UserCenterSection;
}

export function UserCenter({ initialSection = 'profile' }: UserCenterProps) {
  const { t } = useLanguage('user');
  const { profile, progress } = useUserProgress();
  const [section, setSection] = useState<UserCenterSection>(initialSection);
  const metrics = getUserMetrics(profile, progress);

  useEffect(() => setSection(initialSection), [initialSection]);

  const items = useMemo(() => [
    {
      content: <UserProfilePanel />,
      icon: <UserCircle size={16} />,
      id: 'profile',
      label: t('sections.profile'),
    },
    {
      content: <UserPreferencesPanel />,
      icon: <Settings size={16} />,
      id: 'preferences',
      label: t('sections.preferences'),
    },
    {
      content: <UserProgressPanel />,
      icon: <Workflow size={16} />,
      id: 'progress',
      label: t('sections.progress'),
    },
    {
      content: <UserAlbumPanel />,
      icon: <Medal size={16} />,
      id: 'album',
      label: t('sections.album'),
    },
    {
      content: <UserThemeGallery />,
      icon: <Palette size={16} />,
      id: 'themes',
      label: t('sections.themes'),
    },
  ], [t]);

  return (
    <div className="user-center">
      <PageHeader
        description={t('subtitle', { level: metrics.level, xp: metrics.xp, count: metrics.discoveredCount })}
        eyebrow="Compte scientifique"
        title={t('title', { username: metrics.username })}
      />
      <Tabs
        ariaLabel="Sections du profil utilisateur"
        items={items}
        onChange={(id) => setSection(id as UserCenterSection)}
        value={section}
      />
    </div>
  );
}
