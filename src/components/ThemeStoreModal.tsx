import React from 'react';
import { Button, Modal } from '../design-system';
import { useLanguage } from '../hooks/useLanguage';
import { UserThemeGallery } from './UserCenter/UserThemeGallery';
import './UserCenter/user-center.css';

interface ThemeStoreModalProps {
  onClose: () => void;
}

export const ThemeStoreModal: React.FC<ThemeStoreModalProps> = ({ onClose }) => {
  const { t } = useLanguage('user');

  return (
    <Modal
      actions={<Button onClick={onClose}>{t('themes.close', { defaultValue: 'Fermer' })}</Button>}
      isOpen
      onClose={onClose}
      title={t('themes.title', { defaultValue: 'Thèmes et personnalisation' })}
    >
      <UserThemeGallery compact />
    </Modal>
  );
};
