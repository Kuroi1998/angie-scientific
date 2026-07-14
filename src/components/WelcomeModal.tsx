import { Globe, ShieldCheck } from 'lucide-react';
import { Badge, Button, Modal } from '../design-system';
import { useLanguage } from '../hooks/useLanguage';
import type { Language } from '../hooks/useLanguage';
import './welcome-modal.css';

export function WelcomeModal() {
  const { language, setLanguage, t } = useLanguage();
  if (language !== null) return null;

  const selectLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
  };

  return (
    <Modal
      bodyClassName="welcome-modal-body"
      className="welcome-modal"
      closeLabel={t('welcome.continue')}
      isOpen
      onClose={() => selectLanguage(language || 'fr')}
      title="Angie Scientific"
    >
      <div className="welcome-modal-content">
        <span className="welcome-modal-icon" aria-hidden="true">
          <Globe size={34} />
        </span>
        <Badge tone="info">{t('welcome.badge')}</Badge>
        <p>{t('welcome.description')}</p>
        <div className="welcome-modal-actions">
          <Button onClick={() => selectLanguage('fr')}>Français</Button>
          <Button onClick={() => selectLanguage('es')} variant="outline">
            Español
          </Button>
        </div>
        <span className="welcome-modal-security">
          <ShieldCheck size={14} aria-hidden="true" />
          {t('welcome.secure')}
        </span>
      </div>
    </Modal>
  );
}
