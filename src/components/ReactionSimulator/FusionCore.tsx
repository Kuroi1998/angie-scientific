import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { predictReaction } from '../../engines/chemistryEngine';
import type { ReactionResult } from '../../engines/chemistryEngine';
import { Stoichiometry } from './Stoichiometry';
import { EnergyDiagram } from './EnergyDiagram';
import { Flame, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

interface FusionCoreProps {
  selectedReactant1: string | null;
  selectedReactant2: string | null;
  setSelectedReactant1: (s: string | null) => void;
  setSelectedReactant2: (s: string | null) => void;
}

export const FusionCore: React.FC<FusionCoreProps> = ({
  selectedReactant1,
  selectedReactant2,
  setSelectedReactant1,
  setSelectedReactant2
}) => {
  const { t, language } = useLanguage();
  const [reactionResult, setReactionResult] = useState<ReactionResult | null>(null);

  // List of common reactive elements for quick selector
  const quickElements = [
    { s: 'H', name: 'Hydrogen' }, { s: 'Li', name: 'Lithium' },
    { s: 'C', name: 'Carbon' }, { s: 'N', name: 'Nitrogen' },
    { s: 'O', name: 'Oxygen' }, { s: 'F', name: 'Fluorine' },
    { s: 'Na', name: 'Sodium' }, { s: 'Mg', name: 'Magnesium' },
    { s: 'Al', name: 'Aluminum' }, { s: 'S', name: 'Sulfur' },
    { s: 'Cl', name: 'Chlorine' }, { s: 'K', name: 'Potassium' },
    { s: 'Ca', name: 'Calcium' }, { s: 'Fe', name: 'Iron' },
    { s: 'Cu', name: 'Copper' }, { s: 'Zn', name: 'Zinc' },
    { s: 'I', name: 'Iodine' }
  ];

  // Predict reaction whenever reactants change
  useEffect(() => {
    if (selectedReactant1 && selectedReactant2) {
      if (selectedReactant1 === selectedReactant2) {
        setReactionResult(null);
        return;
      }
      const result = predictReaction(selectedReactant1, selectedReactant2);
      setReactionResult(result);
    } else {
      setReactionResult(null);
    }
  }, [selectedReactant1, selectedReactant2]);

  const selectQuickElement = (symbol: string) => {
    if (!selectedReactant1) {
      setSelectedReactant1(symbol);
    } else if (!selectedReactant2 && selectedReactant1 !== symbol) {
      setSelectedReactant2(symbol);
    } else {
      // Replace slot 2 or reset
      setSelectedReactant2(symbol);
    }
  };

  const clearReactants = () => {
    setSelectedReactant1(null);
    setSelectedReactant2(null);
    setReactionResult(null);
  };

  return React.createElement('div', { className: 'fusion-container animate-fade-in', style: { display: 'flex', flexDirection: 'column', gap: '24px' } },
    
    // Reactor chamber display
    React.createElement('div', {
      className: 'glass-panel scanline-container',
      style: {
        padding: '24px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--neon-purple)',
        boxShadow: '0 0 25px rgba(157, 0, 255, 0.12)',
        borderRadius: '8px',
        textAlign: 'center'
      }
    },
      React.createElement('h2', { style: { fontFamily: 'var(--font-title)', fontSize: '18px', color: 'var(--neon-purple)', marginBottom: '16px', letterSpacing: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' } },
        React.createElement(Sparkles, { className: 'animate-flicker', size: 18 }),
        "REACTOR CHAMBER / CAMARA DE FUSION"
      ),

      // Slots
      React.createElement('div', {
        style: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '30px',
          margin: '20px 0'
        }
      },
        // Slot 1
        React.createElement('div', {
          onClick: () => setSelectedReactant1(null),
          style: {
            width: '80px',
            height: '80px',
            border: `2px dashed ${selectedReactant1 ? 'var(--neon-cyan)' : 'var(--text-muted)'}`,
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(0, 0, 0, 0.4)',
            cursor: selectedReactant1 ? 'pointer' : 'default',
            boxShadow: selectedReactant1 ? 'var(--glow-cyan)' : 'none',
            transition: 'all 0.2s'
          }
        },
          selectedReactant1 ? [
            React.createElement('span', { key: 'sym', style: { fontSize: '28px', fontWeight: 'bold', fontFamily: 'var(--font-title)', color: '#fff' } }, selectedReactant1),
            React.createElement('span', { key: 'lbl', style: { fontSize: '9px', color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)' } }, "REACTANT 1")
          ] : React.createElement('span', { style: { fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' } }, "EMPTY SLOT")
        ),

        // Plus sign
        React.createElement('span', { style: { fontSize: '24px', fontFamily: 'var(--font-title)', color: 'var(--neon-purple)' } }, "+"),

        // Slot 2
        React.createElement('div', {
          onClick: () => setSelectedReactant2(null),
          style: {
            width: '80px',
            height: '80px',
            border: `2px dashed ${selectedReactant2 ? 'var(--neon-magenta)' : 'var(--text-muted)'}`,
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(0, 0, 0, 0.4)',
            cursor: selectedReactant2 ? 'pointer' : 'default',
            boxShadow: selectedReactant2 ? 'var(--glow-magenta)' : 'none',
            transition: 'all 0.2s'
          }
        },
          selectedReactant2 ? [
            React.createElement('span', { key: 'sym', style: { fontSize: '28px', fontWeight: 'bold', fontFamily: 'var(--font-title)', color: '#fff' } }, selectedReactant2),
            React.createElement('span', { key: 'lbl', style: { fontSize: '9px', color: 'var(--neon-magenta)', fontFamily: 'var(--font-mono)' } }, "REACTANT 2")
          ] : React.createElement('span', { style: { fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' } }, "EMPTY SLOT")
        )
      ),

      // Reset Button
      (selectedReactant1 || selectedReactant2) && React.createElement('button', {
        onClick: clearReactants,
        style: {
          padding: '6px 16px',
          background: 'transparent',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-title)',
          fontSize: '10px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          margin: '0 auto'
        }
      },
        React.createElement(RefreshCw, { size: 10 }),
        "RESET CHAMBER"
      )
    ),

    // Grid Body: Quick Selector on left, reaction details on right
    React.createElement('div', {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }
    },
      // Left: Quick Element Selection Panel
      React.createElement('div', {
        className: 'glass-panel',
        style: {
          padding: '20px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--glass-border)',
          borderRadius: '8px'
        }
      },
        React.createElement('h3', { style: { fontFamily: 'var(--font-title)', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '1px' } },
          "QUICK SELECTOR / SELECCION QUICK"
        ),
        React.createElement('div', {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px'
          }
        },
          quickElements.map(el => {
            const isSelected = selectedReactant1 === el.s || selectedReactant2 === el.s;
            return React.createElement('button', {
              key: el.s,
              onClick: () => selectQuickElement(el.s),
              disabled: isSelected,
              style: {
                padding: '12px 6px',
                background: isSelected ? 'var(--bg-tertiary)' : 'rgba(0, 243, 255, 0.02)',
                border: `1px solid ${isSelected ? 'var(--text-muted)' : 'var(--glass-border)'}`,
                borderRadius: '4px',
                color: isSelected ? 'var(--text-muted)' : '#fff',
                fontFamily: 'var(--font-title)',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: isSelected ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: !isSelected ? 'inset 0 0 5px rgba(0, 243, 255, 0.02)' : 'none'
              },
              className: !isSelected ? 'quick-element-btn' : ''
            }, el.s);
          })
        )
      ),

      // Right: Reaction Telemetry & calculations
      React.createElement('div', {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }
      },
        reactionResult ? [
          // Equation & Telemetry
          React.createElement('div', {
            key: 'equation',
            className: 'glass-panel',
            style: {
              padding: '20px',
              border: `1px solid ${reactionResult.stable ? 'var(--neon-green)' : 'var(--neon-yellow)'}`,
              boxShadow: reactionResult.stable ? '0 0 10px rgba(57, 255, 20, 0.05)' : '0 0 10px rgba(255, 230, 0, 0.05)'
            }
          },
            React.createElement('h3', { style: { fontFamily: 'var(--font-title)', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '1px' } },
              t('fusion.equation').toUpperCase()
            ),
            
            // Equation formula
            React.createElement('div', {
              dangerouslySetInnerHTML: { __html: reactionResult.equationHTML },
              style: {
                fontSize: '24px',
                fontWeight: 'bold',
                fontFamily: 'var(--font-title)',
                color: '#fff',
                margin: '12px 0',
                textShadow: reactionResult.stable ? '0 0 8px rgba(57, 255, 20, 0.4)' : 'none'
              }
            }),

            // Compound name
            React.createElement('p', {
              style: {
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
                marginBottom: '16px',
                fontStyle: 'italic'
              }
            }, reactionResult.products[0].name),

            // Thermodynamics readout
            React.createElement('div', {
              style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                paddingTop: '16px'
              }
            },
              React.createElement('div', null,
                React.createElement('span', { style: { display: 'block', fontSize: '9px', color: 'var(--text-secondary)' } }, "ENTHALPY (ΔH)"),
                React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 'bold', color: reactionResult.dH < 0 ? 'var(--neon-cyan)' : 'var(--neon-magenta)' } }, `${reactionResult.dH} kJ`)
              ),
              React.createElement('div', null,
                React.createElement('span', { style: { display: 'block', fontSize: '9px', color: 'var(--text-secondary)' } }, "ENTROPY (ΔS)"),
                React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: '14px', color: '#fff' } }, `${reactionResult.dS} J/K`)
              ),
              React.createElement('div', null,
                React.createElement('span', { style: { display: 'block', fontSize: '9px', color: 'var(--text-secondary)' } }, "GIBBS FREE (ΔG)"),
                React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 'bold', color: reactionResult.stable ? 'var(--neon-green)' : 'var(--neon-magenta)' } }, `${reactionResult.dG} kJ`)
              )
            ),

            // Spontaneity Indicator
            React.createElement('div', {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '16px',
                padding: '10px',
                background: reactionResult.stable ? 'rgba(57, 255, 20, 0.05)' : 'rgba(255, 0, 127, 0.05)',
                border: `1px solid ${reactionResult.stable ? 'rgba(57, 255, 20, 0.2)' : 'rgba(255, 0, 127, 0.2)'}`,
                borderRadius: '4px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                color: reactionResult.stable ? 'var(--neon-green)' : 'var(--neon-magenta)'
              }
            },
              React.createElement(Flame, { size: 14 }),
              React.createElement('span', null,
                reactionResult.stable 
                  ? (language === 'es' ? "REACCIÓN ESPONTÁNEA & COMPUESTO ESTABLE" : "RÉACTION SPONTANÉE & PRODUIT STABLE")
                  : (language === 'es' ? "NO ESPONTÁNEA / INESTABLE EN STP" : "NON SPONTANÉE / INSTABLE EN STP")
              )
            )
          ),

          // Stoichiometry Calculator
          React.createElement(Stoichiometry, {
            key: 'stoich',
            reaction: reactionResult,
            onSelectCascadeReaction: (sym1, sym2) => {
              setSelectedReactant1(sym1);
              setSelectedReactant2(sym2);
            }
          })
        ] : React.createElement('div', {
          className: 'glass-panel',
          style: {
            padding: '24px',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            minHeight: '200px',
            border: '1px dashed var(--glass-border)'
          }
        },
          React.createElement(ShieldAlert, { size: 28, style: { color: 'var(--neon-magenta)' } }),
          React.createElement('p', null, t('fusion.noReaction'))
        )
      )
    ),

    // Render Reaction Coordinate Energy Diagram underneath (if reaction is valid)
    reactionResult && React.createElement('div', {
      className: 'glass-panel',
      style: {
        padding: '20px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--glass-border)'
      }
    },
      React.createElement('h3', { style: { fontFamily: 'var(--font-title)', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '1px', textAlign: 'center' } },
        t('fusion.energyDiagram').toUpperCase()
      ),
      React.createElement(EnergyDiagram, {
        dH: reactionResult.dH
      })
    )
  );
};
