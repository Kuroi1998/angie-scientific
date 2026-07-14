import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { LogOut, RotateCcw, Save, ShieldCheck } from 'lucide-react';
import { removeUserId } from '../../api/progress';
import { Button, ConfirmDialog, Input, Panel, Select } from '../../design-system';
import { clearAllStoredValues } from '../../utils/localStorage';
import { useUserProgress } from '../useUserProgress';
import { learningLevelOptions } from './userCenterData';
import type { LearningLevel } from '../../data/educational/models';

import { useLanguage } from '../../hooks/useLanguage';

interface UserProfilePanelProps {
  compact?: boolean;
}

export function UserProfilePanel({ compact = false }: UserProfilePanelProps) {
  const { profile, saveProfile } = useUserProgress();
  const { t } = useLanguage();
  const [username, setUsername] = useState(profile?.username ?? '');
  const [learningLevel, setLearningLevel] = useState<LearningLevel>(
    profile?.learningLevel ?? 'discovery',
  );
  const [status, setStatus] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    setUsername(profile?.username ?? '');
    setLearningLevel(profile?.learningLevel ?? 'discovery');
  }, [profile]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await saveProfile({
      learningLevel,
      username: username.trim() || profile?.username || 'Scientist',
    });
    setStatus(t('profileUpdated', { ns: 'settings' }));
  };

  const logout = () => {
    removeUserId();
    window.location.reload();
  };

  const resetAll = () => {
    clearAllStoredValues();
    removeUserId();
    window.location.reload();
  };

  return (
    <Panel title={compact ? t('profile', { ns: 'settings' }) : t('scientificIdentity', { ns: 'settings' })}>
      <form className="user-panel-grid" onSubmit={submit}>
        <Input
          label={t('profileName', { ns: 'settings' })}
          onChange={(event) => setUsername(event.target.value)}
          value={username}
        />
        <Select
          label={t('learningLevel', { ns: 'settings' })}
          onChange={(event) => setLearningLevel(event.target.value as LearningLevel)}
          options={learningLevelOptions}
          value={learningLevel}
        />
        <div className="user-action-row">
          <Button iconLeft={<Save size={16} />} type="submit">
            {t('save', { ns: 'settings' })}
          </Button>
          {status && <span className="user-muted" role="status">{status}</span>}
        </div>
      </form>
      <div className="user-id-card">
        <strong><ShieldCheck size={20} aria-hidden="true" /> {t('localSecurity', { ns: 'settings' })}</strong>
        <p className="user-muted">
          {t('localSecurityDesc', { ns: 'settings' })}
        </p>
        <div className="user-action-row">
          <Button iconLeft={<LogOut size={16} />} onClick={logout} tone="warning" variant="outline">
            {t('logout', { ns: 'settings' })}
          </Button>
          <Button
            iconLeft={<RotateCcw size={16} />}
            onClick={() => setConfirmReset(true)}
            tone="error"
            variant="ghost"
          >
            {t('reset', { ns: 'settings' })}
          </Button>
        </div>
      </div>
      <ConfirmDialog
        cancelLabel={t('cancel', { ns: 'settings' })}
        confirmLabel={t('reset', { ns: 'settings' })}
        isOpen={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={resetAll}
        title={t('confirmReset', { ns: 'settings' })}
      >
        {t('confirmResetDesc', { ns: 'settings' })}
      </ConfirmDialog>
    </Panel>
  );
}
