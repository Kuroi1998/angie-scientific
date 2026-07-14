import React from 'react';
import { Button, Modal } from '../design-system';
import { UserPreferencesPanel } from './UserCenter/UserPreferencesPanel';
import { UserProfilePanel } from './UserCenter/UserProfilePanel';
import { useLanguage } from '../hooks/useLanguage';
import './UserCenter/user-center.css';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { t } = useLanguage();
  return (
    <Modal
      actions={<Button onClick={onClose}>{t('close', { ns: 'settings' })}</Button>}
      isOpen
      onClose={onClose}
      title={t('modalTitle', { ns: 'settings' })}
    >
      <div className="user-modal-stack">
        <UserPreferencesPanel compact />
        <UserProfilePanel compact />
      </div>
    </Modal>
  );
};
