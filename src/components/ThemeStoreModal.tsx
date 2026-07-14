import React from 'react';
import { Button, Modal } from '../design-system';
import { UserThemeGallery } from './UserCenter/UserThemeGallery';
import './UserCenter/user-center.css';

interface ThemeStoreModalProps {
  onClose: () => void;
}

export const ThemeStoreModal: React.FC<ThemeStoreModalProps> = ({ onClose }) => (
  <Modal
    actions={<Button onClick={onClose}>Fermer</Button>}
    isOpen
    onClose={onClose}
    title="Themes et personnalisation"
  >
    <UserThemeGallery compact />
  </Modal>
);
