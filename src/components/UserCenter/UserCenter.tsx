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
import './user-center.css';

interface UserCenterProps {
  initialSection?: UserCenterSection;
}

export function UserCenter({ initialSection = 'profile' }: UserCenterProps) {
  const { profile, progress } = useUserProgress();
  const [section, setSection] = useState<UserCenterSection>(initialSection);
  const metrics = getUserMetrics(profile, progress);

  useEffect(() => setSection(initialSection), [initialSection]);

  const items = useMemo(() => [
    {
      content: <UserProfilePanel />,
      icon: <UserCircle size={16} />,
      id: 'profile',
      label: 'Profil',
    },
    {
      content: <UserPreferencesPanel />,
      icon: <Settings size={16} />,
      id: 'preferences',
      label: 'Parametres',
    },
    {
      content: <UserProgressPanel />,
      icon: <Workflow size={16} />,
      id: 'progress',
      label: 'Progression',
    },
    {
      content: <UserAlbumPanel />,
      icon: <Medal size={16} />,
      id: 'album',
      label: 'Album et quetes',
    },
    {
      content: <UserThemeGallery />,
      icon: <Palette size={16} />,
      id: 'themes',
      label: 'Themes',
    },
  ], []);

  return (
    <div className="user-center">
      <PageHeader
        description={`Niveau ${metrics.level}, ${metrics.xp} XP, ${metrics.discoveredCount} elements suivis.`}
        eyebrow="Compte scientifique"
        title={`Profil et progression de ${metrics.username}`}
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
