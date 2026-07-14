import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { Button, IconButton } from './Buttons';
import { cx } from './types';

interface Closeable {
  isOpen: boolean;
  onClose: () => void;
}

const focusableSelector = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function useOverlayLifecycle(
  isOpen: boolean,
  onClose: () => void,
  panelRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    window.setTimeout(() => {
      const target = panelRef.current?.querySelector<HTMLElement>(focusableSelector);
      (target ?? panelRef.current)?.focus();
    });

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose, panelRef]);
}

function renderOverlay(node: ReactNode) {
  if (typeof document === 'undefined') return node;
  return createPortal(node, document.body);
}

interface ModalProps extends Closeable {
  actions?: ReactNode;
  bodyClassName?: string;
  children: ReactNode;
  className?: string;
  closeLabel?: string;
  title: ReactNode;
}

export function Modal({
  actions,
  bodyClassName,
  children,
  className,
  closeLabel = 'Close dialog',
  isOpen,
  onClose,
  title,
}: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLElement | null>(null);
  useOverlayLifecycle(isOpen, onClose, panelRef);
  if (!isOpen) return null;
  return renderOverlay(
    <div className="as-overlay" role="presentation">
      <section
        aria-labelledby={titleId}
        aria-modal="true"
        className={cx('as-modal', className)}
        ref={panelRef}
        role="dialog"
        tabIndex={-1}
      >
        <header className="as-overlay-header">
          <h2 id={titleId}>{title}</h2>
          <IconButton label={closeLabel} onClick={onClose} icon={<span>X</span>} />
        </header>
        <div className={cx('as-overlay-body', bodyClassName)}>{children}</div>
        {actions && <footer className="as-overlay-actions">{actions}</footer>}
      </section>
    </div>,
  );
}

interface DrawerProps extends ModalProps {
  side?: 'left' | 'right';
}

export function Drawer({
  actions,
  bodyClassName,
  children,
  className,
  closeLabel = 'Close drawer',
  isOpen,
  onClose,
  side = 'right',
  title,
}: DrawerProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLElement | null>(null);
  useOverlayLifecycle(isOpen, onClose, panelRef);
  if (!isOpen) return null;
  return renderOverlay(
    <div className="as-overlay" role="presentation">
      <aside
        aria-labelledby={titleId}
        aria-modal="true"
        className={cx('as-drawer', side === 'left' && 'is-left', className)}
        ref={panelRef}
        role="dialog"
        tabIndex={-1}
      >
        <header className="as-overlay-header">
          <h2 id={titleId}>{title}</h2>
          <IconButton label={closeLabel} onClick={onClose} icon={<span>X</span>} />
        </header>
        <div className={cx('as-overlay-body', bodyClassName)}>{children}</div>
        {actions && <footer className="as-overlay-actions">{actions}</footer>}
      </aside>
    </div>,
  );
}

export function BottomSheet({
  actions,
  bodyClassName,
  children,
  className,
  closeLabel = 'Close sheet',
  isOpen,
  onClose,
  title,
}: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLElement | null>(null);
  useOverlayLifecycle(isOpen, onClose, panelRef);
  if (!isOpen) return null;
  return renderOverlay(
    <div className="as-overlay" role="presentation">
      <section
        aria-labelledby={titleId}
        aria-modal="true"
        className={cx('as-bottom-sheet', className)}
        ref={panelRef}
        role="dialog"
        tabIndex={-1}
      >
        <header className="as-overlay-header">
          <h2 id={titleId}>{title}</h2>
          <IconButton label={closeLabel} onClick={onClose} icon={<span>X</span>} />
        </header>
        <div className={cx('as-overlay-body', bodyClassName)}>{children}</div>
        {actions && <footer className="as-overlay-actions">{actions}</footer>}
      </section>
    </div>,
  );
}

interface ConfirmDialogProps extends Closeable {
  cancelLabel?: string;
  children: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  title: ReactNode;
}

export function ConfirmDialog({
  cancelLabel = 'Cancel',
  children,
  confirmLabel,
  isOpen,
  onClose,
  onConfirm,
  title,
}: ConfirmDialogProps) {
  return (
    <Modal
      actions={(
        <>
          <Button onClick={onClose} variant="ghost">
            {cancelLabel}
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            tone="error"
          >
            {confirmLabel}
          </Button>
        </>
      )}
      className="as-confirm-dialog"
      closeLabel={cancelLabel}
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      {children}
    </Modal>
  );
}

export interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
}

export function Tooltip({ children, content }: TooltipProps) {
  return (
    <span className="as-tooltip">
      {children}
      <span className="as-tooltip-content" role="tooltip">
        {content}
      </span>
    </span>
  );
}

export interface PopoverProps {
  children: ReactNode;
  label: ReactNode;
}

export function Popover({ children, label }: PopoverProps) {
  const [open, setOpen] = useState(false);
  return (
    <span className="as-popover">
      <Button
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        variant="outline"
      >
        {label}
      </Button>
      {open && (
        <div className="as-popover-content" role="dialog">
          {children}
        </div>
      )}
    </span>
  );
}
