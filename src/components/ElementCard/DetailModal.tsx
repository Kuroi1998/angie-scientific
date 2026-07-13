import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import type { ElementType } from '../PeriodicTable/TableGrid';
import { AtomModelCanvas } from './AtomModelCanvas';
import { X, Info, Shield, Layers, HelpCircle, GitCommit, Star } from 'lucide-react';
import { LewisVisualizer } from './LewisVisualizer';
import { useUserProgress } from '../UserProgressProvider';
import { useMascot } from '../Mascot/MascotContext';
import { ElementFactRepository } from '../../services/Educational/ElementFactRepository';

interface DetailModalProps {
  element: ElementType;
  onClose: () => void;
  onAddToFusion?: (el: ElementType) => void;
}

// Elements that cannot form standard covalent bonds
const NOBLE_GASES = ['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn', 'Og'];

type TabType = 'general' | 'atomic' | 'quantum' | 'history' | 'bonds';
const TITLE_ID = 'element-detail-modal-title';

export const DetailModal: React.FC<DetailModalProps> = ({ element, onClose, onAddToFusion }) => {
  const { language, t } = useLanguage();
  const { profile } = useUserProgress();
  const { showMessage } = useMascot();
  const isNobleGas = NOBLE_GASES.includes(element.s);
  const [activeTab, setActiveTab] = useState<TabType | 'superpowers'>('general');
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  // Keeps the effect below mount/unmount-only (no re-subscribing on every parent
  // render, since onClose is a fresh closure each time) while still always
  // calling the latest onClose.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Keyboard: close on Escape; focus management: focus the close button on open,
  // restore focus to whatever triggered the modal when it unmounts.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, []);

  // Mascot element facts logic
  useEffect(() => {
    if (profile?.mascotEnabled === false) return;
    
    const fact = ElementFactRepository.getFactForElement(element.n, language || 'fr');
    let emotion: any = 'happy';
    if (fact.category === 'surprising') emotion = 'impressed';
    else if (fact.category === 'reaction' || fact.category === 'safety') emotion = 'surprised';
    else if (fact.category === 'discovery') emotion = 'thinking';
    
    const t = setTimeout(() => showMessage(fact.childFriendlyText, 6000, emotion), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element.n, language, profile?.mascotEnabled]);

  // Map category to color
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'alkali-metal': return 'var(--neon-magenta)';
      case 'alkaline-earth': return 'var(--neon-orange)';
      case 'transition-metal': return 'var(--neon-yellow)';
      case 'lanthanide': return 'var(--neon-magenta)';
      case 'actinide': return 'var(--neon-purple)';
      case 'post-transition-metal': return 'var(--neon-cyan)';
      case 'metalloid': return 'var(--neon-green)';
      case 'reactive-nonmetal': return 'var(--neon-green)';
      case 'noble-gas': return 'var(--neon-cyan)';
      default: return 'var(--text-secondary)';
    }
  };

  const catColor = getCategoryColor(element.cat);
  const name = language === 'es' ? element.nameES : element.nameFR;
  const uses = language === 'es' ? element.usesES : element.usesFR;
  const history = language === 'es' ? element.historyES : element.historyFR;
  const desc = language === 'es' ? element.descES : element.descFR;

  const kelvinToCelsius = (k: number | null) => {
    if (k === null) return 'N/A';
    return `${(k - 273.15).toFixed(1)} °C`;
  };

  const displayVal = (val: any, unit: string = '') => {
    return val !== null && val !== undefined ? `${val} ${unit}` : 'N/A';
  };

  return React.createElement('div', {
    style: {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'rgba(5, 5, 10, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '1000',
      padding: '20px'
    },
    onClick: onClose
  },
    React.createElement('div', {
      className: 'glass-panel modal-anim scanline-container',
      role: 'dialog',
      'aria-modal': true,
      'aria-labelledby': TITLE_ID,
      style: {
        width: '100%',
        maxWidth: '850px',
        background: 'var(--bg-secondary)',
        border: `1px solid ${catColor}`,
        boxShadow: `0 0 30px rgba(${catColor === 'var(--neon-magenta)' ? '255,0,127' : '0,243,255'}, 0.15)`,
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative'
      },
      onClick: (e) => e.stopPropagation()
    },
      // Modal Header
      React.createElement('div', {
        style: {
          padding: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: `linear-gradient(90deg, rgba(${catColor === 'var(--neon-magenta)' ? '255,0,127' : '0,243,255'}, 0.05), transparent)`
        }
      },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } },
          // Glowing square representing element
          React.createElement('div', {
            style: {
              width: '60px',
              height: '60px',
              border: `2px solid ${catColor}`,
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'rgba(0,0,0,0.3)',
              boxShadow: `0 0 10px ${catColor}`
            }
          },
            React.createElement('span', { style: { fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' } }, element.n),
            React.createElement('span', { style: { fontSize: '24px', fontWeight: '900', fontFamily: 'var(--font-title)', color: '#fff', lineHeight: '1', textShadow: `0 0 8px ${catColor}` } }, element.s)
          ),
          React.createElement('div', null,
            React.createElement('h2', { id: TITLE_ID, style: { fontFamily: 'var(--font-title)', fontSize: '24px', fontWeight: '700', textTransform: 'uppercase', color: '#fff', letterSpacing: '1px' } }, name),
            React.createElement('p', { style: { fontSize: '11px', fontFamily: 'var(--font-mono)', color: catColor, textTransform: 'uppercase', letterSpacing: '2px' } }, element.cat.replace('-', ' '))
          )
        ),
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
          // Add to Fusion shortcut button
          onAddToFusion && React.createElement('button', {
            onClick: () => { onAddToFusion(element); onClose(); },
            title: language === 'fr' ? 'Ajouter au Simulateur de Fusion' : 'Añadir al Simulador de Fusión',
            style: {
              background: 'rgba(157, 0, 255, 0.1)',
              border: '1px solid var(--neon-purple)',
              borderRadius: '4px',
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--neon-purple)',
              cursor: 'pointer',
              fontFamily: 'var(--font-title)',
              fontSize: '10px',
              fontWeight: 'bold',
              letterSpacing: '1px',
              boxShadow: 'var(--glow-purple)',
              transition: 'all 0.2s'
            }
          }, '⚡ FUSION'),
          React.createElement('button', {
            ref: closeButtonRef,
            type: 'button',
            onClick: onClose,
            'aria-label': language === 'fr' ? 'Fermer la fiche élément' : 'Cerrar la ficha del elemento',
            style: {
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            },
            className: 'close-btn'
          },
            React.createElement(X, { size: 18 })
          )
        )
      ),

      // Modal Grid Body
      React.createElement('div', {
        className: 'element-modal-grid',
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          padding: '20px',
          maxHeight: 'min(70vh, 600px)',
          overflowY: 'auto',
          overflowX: 'hidden'
        }
      },
        // Column 1: Tabs & Details
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' } },
          // Tab Buttons
          React.createElement('div', {
            role: 'tablist',
            'aria-label': language === 'fr' ? 'Sections de la fiche élément' : 'Secciones de la ficha del elemento',
            style: {
              display: 'flex',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              gap: '8px'
            }
          },
            (() => {
              const tabs = ([
                { id: 'general', label: t('element.general'), icon: Info },
                { id: 'superpowers', label: language === 'fr' ? 'Super-Pouvoirs' : 'Superpoderes', icon: Star },
                { id: 'atomic', label: t('element.atomic'), icon: Layers },
                { id: 'quantum', label: t('element.quantum'), icon: Shield },
                // Hide Bonds tab for noble gases — they don't form covalent bonds
                ...(isNobleGas ? [] : [{ id: 'bonds', label: language === 'fr' ? 'Liaisons' : 'Enlaces', icon: GitCommit }]),
                { id: 'history', label: t('element.history'), icon: HelpCircle }
              ] as { id: TabType | 'superpowers'; label: string; icon: React.ElementType }[]);

              const focusTabAt = (index: number) => {
                const wrapped = (index + tabs.length) % tabs.length;
                const nextTab = tabs[wrapped];
                setActiveTab(nextTab.id);
                requestAnimationFrame(() => {
                  document.getElementById(`element-tab-${nextTab.id}`)?.focus();
                });
              };

              return tabs.map((tab, i) => {
                const active = activeTab === tab.id;
                const Icon = tab.icon;
                return React.createElement('button', {
                  key: tab.id,
                  id: `element-tab-${tab.id}`,
                  role: 'tab',
                  type: 'button',
                  'aria-selected': active,
                  'aria-controls': `element-tabpanel-${tab.id}`,
                  tabIndex: active ? 0 : -1,
                  onClick: () => setActiveTab(tab.id),
                  onKeyDown: (e: React.KeyboardEvent) => {
                    if (e.key === 'ArrowRight') { e.preventDefault(); focusTabAt(i + 1); }
                    else if (e.key === 'ArrowLeft') { e.preventDefault(); focusTabAt(i - 1); }
                  },
                  style: {
                    padding: '8px 12px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: active ? `2px solid ${catColor}` : '2px solid transparent',
                    color: active ? '#fff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: 'var(--font-title)',
                    fontSize: '11px',
                    fontWeight: active ? 'bold' : 'normal',
                    transition: 'all 0.2s'
                  }
                },
                  React.createElement(Icon, { size: 12, style: { color: active ? catColor : 'inherit' } }),
                  tab.label
                );
              });
            })()
          ),

          // Tab Content
          React.createElement('div', {
            role: 'tabpanel',
            id: `element-tabpanel-${activeTab}`,
            'aria-labelledby': `element-tab-${activeTab}`,
            style: { flex: '1', minHeight: '220px' }
          },
            activeTab === 'general' && React.createElement('div', { className: 'tab-content', style: { display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', fontFamily: 'var(--font-mono)' } },
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.05)', paddingBottom: '6px' } },
                React.createElement('span', { style: { color: 'var(--text-secondary)' } }, t('element.state')),
                React.createElement('span', { style: { color: catColor, fontWeight: 'bold' } }, element.state.toUpperCase())
              ),
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.05)', paddingBottom: '6px' } },
                React.createElement('span', { style: { color: 'var(--text-secondary)' } }, t('element.density')),
                React.createElement('span', null, displayVal(element.density, 'g/cm³'))
              ),
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.05)', paddingBottom: '6px' } },
                React.createElement('span', { style: { color: 'var(--text-secondary)' } }, t('element.meltingPoint')),
                React.createElement('span', null, element.mp !== null ? `${element.mp} K (${kelvinToCelsius(element.mp)})` : 'N/A')
              ),
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.05)', paddingBottom: '6px' } },
                React.createElement('span', { style: { color: 'var(--text-secondary)' } }, t('element.boilingPoint')),
                React.createElement('span', null, element.bp !== null ? `${element.bp} K (${kelvinToCelsius(element.bp)})` : 'N/A')
              ),
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.05)', paddingBottom: '6px' } },
                React.createElement('span', { style: { color: 'var(--text-secondary)' } }, t('element.abundance')),
                React.createElement('span', null, displayVal(element.ab, 'mg/kg'))
              )
            ),

            activeTab === 'superpowers' && React.createElement('div', { className: 'tab-content', style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
              React.createElement('div', { style: { background: 'rgba(255, 215, 0, 0.1)', border: '1px solid gold', padding: '16px', borderRadius: '8px' } },
                React.createElement('h3', { style: { color: 'gold', margin: '0 0 8px 0', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '8px' } }, 
                  React.createElement(Star, { size: 18 }),
                  language === 'fr' ? "Le super-pouvoir de cet élément !" : "¡El superpoder de este elemento!"
                ),
                React.createElement('p', { style: { color: '#fff', fontSize: '14px', lineHeight: 1.5, margin: 0 } },
                  profile?.learningLevel === 'discovery' 
                    ? (language === 'fr' ? "Cet élément est incroyable ! Il est utilisé partout autour de toi." : "¡Este elemento es increíble! Se usa en todas partes.")
                    : (language === 'fr' ? desc : desc) // Placeholder for actual educational facts DB
                )
              )
            ),

            activeTab === 'atomic' && React.createElement('div', { className: 'tab-content', style: { display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', fontFamily: 'var(--font-mono)' } },
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.05)', paddingBottom: '6px' } },
                React.createElement('span', { style: { color: 'var(--text-secondary)' } }, t('element.config')),
                React.createElement('span', { style: { color: 'var(--neon-cyan)', fontWeight: 'bold' } }, element.config)
              ),
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.05)', paddingBottom: '6px' } },
                React.createElement('span', { style: { color: 'var(--text-secondary)' } }, "Shells"),
                React.createElement('span', null, element.shells.join(', '))
              ),
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.05)', paddingBottom: '6px' } },
                React.createElement('span', { style: { color: 'var(--text-secondary)' } }, t('element.atomicRadius')),
                React.createElement('span', null, displayVal(element.ar, 'pm'))
              ),
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.05)', paddingBottom: '6px' } },
                React.createElement('span', { style: { color: 'var(--text-secondary)' } }, t('element.ionicRadius')),
                React.createElement('span', null, displayVal(element.ir, 'pm'))
              ),
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.05)', paddingBottom: '6px' } },
                React.createElement('span', { style: { color: 'var(--text-secondary)' } }, t('element.crystal')),
                React.createElement('span', null, element.crystal)
              )
            ),

            activeTab === 'quantum' && React.createElement('div', { className: 'tab-content', style: { display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', fontFamily: 'var(--font-mono)' } },
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.05)', paddingBottom: '6px' } },
                React.createElement('span', { style: { color: 'var(--text-secondary)' } }, t('element.electronegativity')),
                React.createElement('span', { style: { color: 'var(--neon-yellow)' } }, displayVal(element.en))
              ),
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.05)', paddingBottom: '6px' } },
                React.createElement('span', { style: { color: 'var(--text-secondary)' } }, t('element.ionization')),
                React.createElement('span', null, displayVal(element.ie, 'kJ/mol'))
              ),
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.05)', paddingBottom: '6px' } },
                React.createElement('span', { style: { color: 'var(--text-secondary)' } }, t('element.affinity')),
                React.createElement('span', null, displayVal(element.ea, 'kJ/mol'))
              )
            ),

            activeTab === 'history' && React.createElement('div', { className: 'tab-content', style: { display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' } },
              React.createElement('div', null,
                React.createElement('h4', { style: { fontSize: '11px', color: catColor, textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'var(--font-title)' } }, t('element.discovery')),
                React.createElement('p', { style: { color: '#fff', fontStyle: 'italic' } }, history)
              ),
              React.createElement('div', { style: { marginTop: '8px' } },
                React.createElement('h4', { style: { fontSize: '11px', color: catColor, textTransform: 'uppercase', marginBottom: '4px', fontFamily: 'var(--font-title)' } }, t('element.uses')),
                React.createElement('p', { style: { color: 'var(--text-secondary)', lineHeight: '1.4' } }, uses)
              )
            ),
            activeTab === 'bonds' && React.createElement(LewisVisualizer, { centralSymbol: element.s })
          ),

          // Element summary description (under tabs)
          React.createElement('div', {
            style: {
              background: 'rgba(0,0,0,0.2)',
              padding: '12px',
              borderRadius: '4px',
              borderLeft: `2px solid ${catColor}`,
              fontSize: '12.5px',
              lineHeight: '1.5',
              color: 'var(--text-secondary)'
            }
          },
            desc
          )
        ),

        // Column 2: Bohr atomic canvas model
        React.createElement('div', {
          className: 'glass-panel',
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            background: 'rgba(0, 0, 0, 0.25)',
            position: 'relative',
            minHeight: '260px'
          }
        },
          React.createElement('span', {
            style: {
              position: 'absolute',
              top: '12px',
              left: '12px',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'rgba(0, 243, 255, 0.4)',
              letterSpacing: '1px'
            }
          }, "QUANTUM BOHR SIMULATION"),
          React.createElement(AtomModelCanvas, {
            shells: element.shells,
            categoryColor: catColor,
            symbol: element.s
          })
        )
      )
    )
  );
};
