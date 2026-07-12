import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import type { ReactionResult } from '../../engines/chemistryEngine';
import { RefreshCw, Layers } from 'lucide-react';

interface StoichiometryProps {
  reaction: ReactionResult;
  onSelectCascadeReaction?: (sym1: string, sym2: string, initialMassOfReactant: number) => void;
}

export const Stoichiometry: React.FC<StoichiometryProps> = ({ reaction, onSelectCascadeReaction }) => {
  const { language } = useLanguage();

  const r1 = reaction.reactants[0];
  const r2 = reaction.reactants[1];
  const prod = reaction.products[0];

  // Independent inputs
  const [m1, setM1] = useState<string>('10'); // reactant 1 mass (g)
  const [m2, setM2] = useState<string>('8');  // reactant 2 mass (g)
  const [expYield, setExpYield] = useState<string>(''); // experimental yield (g)

  // Stoichiometric lock mode (linked recalculation)
  const [isLocked, setIsLocked] = useState<boolean>(true);

  // Moles calculation
  const n1 = parseFloat(m1) / r1.molarMass || 0;
  const n2 = parseFloat(m2) / r2.molarMass || 0;

  // Stoichiometric factors
  const f1 = n1 / r1.coef;
  const f2 = n2 / r2.coef;

  // Determine limiting and excess
  let limitingReactant = '';
  let excessReactant = '';
  let fLimiting = 0;
  let excessMolesLeft = 0;
  let excessMassLeft = 0;

  if (f1 <= f2) {
    limitingReactant = r1.symbol;
    excessReactant = r2.symbol;
    fLimiting = f1;
    excessMolesLeft = n2 - (f1 * r2.coef);
    excessMassLeft = excessMolesLeft * r2.molarMass;
  } else {
    limitingReactant = r2.symbol;
    excessReactant = r1.symbol;
    fLimiting = f2;
    excessMolesLeft = n1 - (f2 * r1.coef);
    excessMassLeft = excessMolesLeft * r1.molarMass;
  }

  // Theoretical yield
  const theoMoles = fLimiting * prod.coef;
  const theoMass = theoMoles * prod.molarMass;

  // Lock mode updates: when reactant 1 changes, update reactant 2 stoichiometrically
  const handleLockUpdate = (val: string, source: 'r1' | 'r2') => {
    if (source === 'r1') {
      setM1(val);
      const moles = parseFloat(val) / r1.molarMass;
      if (!isNaN(moles)) {
        const correspondingMoles = (moles / r1.coef) * r2.coef;
        const correspondingMass = correspondingMoles * r2.molarMass;
        setM2(correspondingMass.toFixed(2));
      }
    } else {
      setM2(val);
      const moles = parseFloat(val) / r2.molarMass;
      if (!isNaN(moles)) {
        const correspondingMoles = (moles / r2.coef) * r1.coef;
        const correspondingMass = correspondingMoles * r1.molarMass;
        setM1(correspondingMass.toFixed(2));
      }
    }
  };

  // Experimental Yield calculations
  const expMassVal = parseFloat(expYield) || 0;
  const percentYield = theoMass > 0 ? Math.min(100, (expMassVal / theoMass) * 100) : 0;
  const conversionRate = isLocked ? 100 : percentYield; // if locking, 100% conversion
  const massLoss = (parseFloat(m1) || 0) + (parseFloat(m2) || 0) - expMassVal;

  // Detect cascade opportunities (e.g. if H2O is produced, let's offer to react it with Sodium)
  const showCascade = prod.symbol === 'H2O' && onSelectCascadeReaction !== undefined;

  const handleTriggerCascade = () => {
    if (onSelectCascadeReaction) {
      // Water + Sodium -> NaOH + H2
      onSelectCascadeReaction('Na', 'H2O', parseFloat(theoMass.toFixed(2)));
    }
  };

  return React.createElement('div', {
    className: 'stoichiometry-container animate-fade-in',
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }
  },
    // Mode Switcher Header
    React.createElement('div', {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.02)',
        padding: '10px 14px',
        borderRadius: '6px',
        border: '1px solid var(--glass-border)'
      }
    },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
        React.createElement(Layers, { size: 14, style: { color: 'var(--neon-cyan)' } }),
        React.createElement('span', { style: { fontFamily: 'var(--font-title)', fontSize: '11px', color: '#fff', letterSpacing: '1px' } },
          (language === 'fr' ? "RAPPORTS STŒCHIOMÉTRIQUES" : "RELACIONES ESTEQUIOMÉTRICAS").toUpperCase()
        )
      ),
      React.createElement('button', {
        onClick: () => {
          setIsLocked(!isLocked);
          if (!isLocked) {
            // lock it immediately based on current m1
            handleLockUpdate(m1, 'r1');
          }
        },
        style: {
          padding: '4px 10px',
          background: isLocked ? 'rgba(0, 243, 255, 0.08)' : 'transparent',
          border: `1px solid ${isLocked ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '4px',
          color: isLocked ? 'var(--neon-cyan)' : 'var(--text-secondary)',
          fontFamily: 'var(--font-title)',
          fontSize: '9px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }
      },
        React.createElement(RefreshCw, { size: 10 }),
        isLocked 
          ? (language === 'fr' ? 'RATIO PUREMENT STŒCHIOMÉTRIQUE' : 'PROPORCIÓN ESTEQUIOMÉTRICA').toUpperCase()
          : (language === 'fr' ? 'REACTIFS INDÉPENDANTS' : 'REACTIVOS INDEPENDIENTES').toUpperCase()
      )
    ),

    // Reactants Input Grid
    React.createElement('div', {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px'
      }
    },
      // Reactant 1 Input
      React.createElement('div', {
        className: 'glass-panel',
        style: {
          padding: '14px',
          background: 'rgba(255,255,255,0.01)',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }
      },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
          React.createElement('span', { style: { fontFamily: 'var(--font-title)', fontSize: '12px', color: '#fff' } }, r1.symbol),
          React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)' } }, `${r1.molarMass.toFixed(2)} g/mol`)
        ),
        React.createElement('div', { style: { display: 'flex', gap: '8px' } },
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('label', { style: { fontSize: '9px', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px', fontFamily: 'var(--font-mono)' } }, "MASSE (g)"),
            React.createElement('input', {
              type: 'number',
              value: m1,
              onChange: (e) => {
                if (isLocked) handleLockUpdate(e.target.value, 'r1');
                else setM1(e.target.value);
              },
              style: {
                width: '100%',
                padding: '6px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--glass-border)',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '11px',
                outline: 'none'
              }
            })
          ),
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('label', { style: { fontSize: '9px', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px', fontFamily: 'var(--font-mono)' } }, "MOLES"),
            React.createElement('input', {
              type: 'text',
              value: n1.toFixed(3),
              readOnly: true,
              style: {
                width: '100%',
                padding: '6px',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '4px',
                color: 'var(--text-secondary)',
                fontSize: '11px',
                outline: 'none'
              }
            })
          )
        )
      ),

      // Reactant 2 Input
      React.createElement('div', {
        className: 'glass-panel',
        style: {
          padding: '14px',
          background: 'rgba(255,255,255,0.01)',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }
      },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
          React.createElement('span', { style: { fontFamily: 'var(--font-title)', fontSize: '12px', color: '#fff' } }, r2.symbol),
          React.createElement('span', { style: { fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)' } }, `${r2.molarMass.toFixed(2)} g/mol`)
        ),
        React.createElement('div', { style: { display: 'flex', gap: '8px' } },
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('label', { style: { fontSize: '9px', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px', fontFamily: 'var(--font-mono)' } }, "MASSE (g)"),
            React.createElement('input', {
              type: 'number',
              value: m2,
              onChange: (e) => {
                if (isLocked) handleLockUpdate(e.target.value, 'r2');
                else setM2(e.target.value);
              },
              style: {
                width: '100%',
                padding: '6px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--glass-border)',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '11px',
                outline: 'none'
              }
            })
          ),
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('label', { style: { fontSize: '9px', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px', fontFamily: 'var(--font-mono)' } }, "MOLES"),
            React.createElement('input', {
              type: 'text',
              value: n2.toFixed(3),
              readOnly: true,
              style: {
                width: '100%',
                padding: '6px',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '4px',
                color: 'var(--text-secondary)',
                fontSize: '11px',
                outline: 'none'
              }
            })
          )
        )
      )
    ),

    // Yield and limiting calculations results
    React.createElement('div', {
      className: 'glass-panel',
      style: {
        padding: '16px',
        border: '1px solid rgba(0, 243, 255, 0.1)',
        background: 'rgba(0, 243, 255, 0.01)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }
    },
      React.createElement('h4', { style: { margin: 0, fontFamily: 'var(--font-title)', fontSize: '11px', color: 'var(--neon-cyan)', letterSpacing: '1px' } },
        (language === 'fr' ? "RÉSULTATS DE SYNTHÈSE QUANTIQUE" : "RESULTADOS DE SÍNTESIS CUÁNTICA").toUpperCase()
      ),

      React.createElement('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px'
        }
      },
        // Theoretical Yield
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } },
          React.createElement('div', null,
            React.createElement('span', { style: { color: 'var(--text-secondary)' } }, language === 'fr' ? "Rendement Théorique : " : "Rendimiento Teórico: "),
            React.createElement('span', { style: { color: '#fff', fontWeight: 'bold' } }, `${theoMass.toFixed(2)} g (${theoMoles.toFixed(3)} moles)`)
          ),
          !isLocked && React.createElement('div', null,
            React.createElement('span', { style: { color: 'var(--text-secondary)' } }, language === 'fr' ? "Réactif Limitant : " : "Reactivo Limitante: "),
            React.createElement('span', { style: { color: 'var(--neon-magenta)', fontWeight: 'bold' } }, limitingReactant)
          ),
          !isLocked && React.createElement('div', null,
            React.createElement('span', { style: { color: 'var(--text-secondary)' } }, language === 'fr' ? "Excès Restant : " : "Exceso Restante: "),
            React.createElement('span', { style: { color: 'var(--neon-green)' } }, `${excessMassLeft.toFixed(2)} g (${excessReactant})`)
          )
        ),

        // Experimental Yield Input and actual percent yield
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
            React.createElement('span', { style: { color: 'var(--text-secondary)' } }, language === 'fr' ? "Masse Expérimentale : " : "Masa Experimental: "),
            React.createElement('input', {
              type: 'number',
              placeholder: "0.0",
              value: expYield,
              onChange: (e) => setExpYield(e.target.value),
              style: {
                width: '70px',
                padding: '3px 6px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--glass-border)',
                borderRadius: '3px',
                color: '#fff',
                fontSize: '11px',
                outline: 'none'
              }
            }),
            React.createElement('span', null, "g")
          ),
          expYield !== '' && React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } },
            React.createElement('div', null,
              React.createElement('span', { style: { color: 'var(--text-secondary)' } }, language === 'fr' ? "Rendement Réel : " : "Rendimiento Real: "),
              React.createElement('span', { style: { color: 'var(--neon-yellow)', fontWeight: 'bold' } }, `${percentYield.toFixed(1)} %`)
            ),
            React.createElement('div', null,
              React.createElement('span', { style: { color: 'var(--text-secondary)' } }, language === 'fr' ? "Taux de Conversion : " : "Tasa de Conversión: "),
              React.createElement('span', { style: { color: '#fff' } }, `${conversionRate.toFixed(1)} %`)
            ),
            React.createElement('div', null,
              React.createElement('span', { style: { color: 'var(--text-secondary)' } }, language === 'fr' ? "Perte de Matière : " : "Pérdida de Materia: "),
              React.createElement('span', { style: { color: massLoss > 0.01 ? 'var(--neon-magenta)' : '#fff' } }, `${Math.max(0, massLoss).toFixed(2)} g`)
            )
          )
        )
      )
    ),

    // Cascade React Button
    showCascade && React.createElement('div', {
      className: 'glass-panel animate-pulse-glow',
      style: {
        padding: '14px',
        border: '1px solid var(--neon-purple)',
        background: 'rgba(157, 0, 255, 0.03)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    },
      React.createElement('div', null,
        React.createElement('h5', { style: { margin: 0, fontFamily: 'var(--font-title)', fontSize: '11px', color: 'var(--neon-purple)', letterSpacing: '1px' } },
          (language === 'fr' ? "RÉACTION EN CASCADE DISPONIBLE (Étape A ➔ B ➔ C)" : "REACCIÓN EN CASCADA DISPONIBLE (Paso A ➔ B ➔ C)").toUpperCase()
        ),
        React.createElement('p', { style: { fontSize: '10px', color: 'var(--text-secondary)', margin: '4px 0 0 0' } },
          language === 'fr' 
            ? `Faire réagir l'eau produite (${theoMass.toFixed(2)} g H₂O) avec du Sodium métallique.`
            : `Hacer reaccionar el agua producida (${theoMass.toFixed(2)} g H₂O) con Sodio metálico.`
        )
      ),
      React.createElement('button', {
        onClick: handleTriggerCascade,
        style: {
          padding: '8px 16px',
          background: 'rgba(157, 0, 255, 0.1)',
          border: '1px solid var(--neon-purple)',
          borderRadius: '4px',
          color: '#fff',
          fontFamily: 'var(--font-title)',
          fontSize: '10px',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: '0 0 8px rgba(157, 0, 255, 0.3)'
        }
      },
        language === 'fr' ? "INITIER LA CASCADE" : "INICIAR CASCADA"
      )
    )
  );
};
