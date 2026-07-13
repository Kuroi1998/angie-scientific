import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { predictReaction } from '../../engines/chemistryEngine';
import type { ReactionResult } from '../../engines/chemistryEngine';
import { Stoichiometry } from './Stoichiometry';
import { EnergyDiagram } from './EnergyDiagram';
import { ChemicalEquation } from './ChemicalEquation';
import { Flame, ShieldAlert, Sparkles, RefreshCw, Info } from 'lucide-react';
import { useUserProgress } from '../UserProgressProvider';
import { useMascot } from '../Mascot/MascotContext';
import confetti from 'canvas-confetti';

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
  const { profile, addSuccessfulReaction } = useUserProgress();
  const { showMessage, setEmotion } = useMascot();
  const [reactionResult, setReactionResult] = useState<ReactionResult | null>(null);
  const [customInput, setCustomInput] = useState<string>('');

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

  useEffect(() => {
    if (selectedReactant1 && selectedReactant2) {
      if (selectedReactant1 === selectedReactant2) {
        setReactionResult(null);
        return;
      }
      const result = predictReaction(selectedReactant1, selectedReactant2);
      setReactionResult(result);
      
      if (result) {
        const prod = result.products[0]?.symbol;
        if (result.stable) {
          addSuccessfulReaction(prod);
          
          if (profile?.reducedMotion !== true) {
            confetti({ particleCount: 50, spread: 45, origin: { y: 0.4 } });
          }

          if (prod === 'H2O') {
            showMessage(language === 'fr' ? "Bravo ! Tu as créé de l'Eau. C'est ce qu'il y a dans ta gourde !" : "¡Bravo! Has creado Agua.");
            setEmotion('happy');
          } else if (prod === 'NaCl') {
            showMessage(language === 'fr' ? "Super ! Le NaCl, c'est le sel que l'on met sur les frites !" : "¡Súper! NaCl es la sal de mesa.");
            setEmotion('happy');
          } else if (prod === 'CO2') {
            showMessage(language === 'fr' ? "Le dioxyde de carbone, c'est ce qui fait les bulles dans les sodas !" : "El CO2 es lo que hace las burbujas.");
            setEmotion('impressed');
          } else {
            showMessage(language === 'fr' ? "Réaction réussie !" : "¡Reacción exitosa!", 3000, 'happy');
          }
        } else {
          showMessage(language === 'fr' ? "Oups ! Cette réaction est instable et a fait BOUM ! Attention dans un vrai labo !" : "¡Oops! Reacción inestable.");
          setEmotion('surprised');
          
          const chamber = document.getElementById('reactor-chamber');
          if (chamber) {
            chamber.classList.add('animate-shake');
            setTimeout(() => chamber.classList.remove('animate-shake'), 500);
          }
        }
      }
    } else {
      setReactionResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedReactant1, selectedReactant2]);

  const selectQuickElement = (symbol: string) => {
    if (!selectedReactant1) {
      setSelectedReactant1(symbol);
    } else if (!selectedReactant2 && selectedReactant1 !== symbol) {
      setSelectedReactant2(symbol);
    } else {
      setSelectedReactant2(symbol);
    }
  };

  const clearReactants = () => {
    setSelectedReactant1(null);
    setSelectedReactant2(null);
    setReactionResult(null);
  };

  return (
    <div className="fusion-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Reactor chamber display */}
      <div
        id="reactor-chamber"
        className="glass-panel scanline-container"
        style={{ padding: '24px', textAlign: 'center', borderColor: 'var(--neon-purple)', boxShadow: '0 0 25px rgba(157, 0, 255, 0.12)' }}
        role="region"
        aria-label="Chambre de réaction"
      >
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '18px', color: 'var(--neon-purple)', marginBottom: '16px', letterSpacing: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Sparkles className="animate-flicker" size={18} aria-hidden="true" />
          REACTOR CHAMBER / CÁMARA DE FUSIÓN
        </h2>

        {/* Slots */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', flexWrap: 'wrap', margin: '20px 0' }}>
          
          {/* Slot 1 */}
          <button
            type="button"
            className={`hover-lift ${selectedReactant1 ? '' : 'empty-slot'}`}
            disabled={!selectedReactant1}
            onClick={() => setSelectedReactant1(null)}
            aria-label={selectedReactant1 ? `${language === 'fr' ? 'Retirer le réactif 1' : 'Quitar el reactivo 1'}: ${selectedReactant1}` : (language === 'fr' ? 'Emplacement réactif 1 vide' : 'Ranura de reactivo 1 vacía')}
            style={{
              width: '80px', height: '80px',
              border: `2px dashed ${selectedReactant1 ? 'var(--neon-cyan)' : 'var(--text-muted)'}`,
              borderRadius: '8px',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.4)',
              cursor: selectedReactant1 ? 'pointer' : 'default',
              boxShadow: selectedReactant1 ? 'var(--glow-cyan)' : 'none',
              transition: 'all 0.2s', font: 'inherit'
            }}
          >
            {selectedReactant1 ? (
              <>
                <span style={{ fontSize: '28px', fontWeight: 'bold', fontFamily: 'var(--font-title)', color: '#fff' }}>{selectedReactant1}</span>
                <span style={{ fontSize: '9px', color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)' }}>REACTANT 1</span>
              </>
            ) : (
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>EMPTY SLOT</span>
            )}
          </button>

          {/* Plus sign */}
          <span aria-hidden="true" style={{ fontSize: '24px', fontFamily: 'var(--font-title)', color: 'var(--neon-purple)' }}>+</span>

          {/* Slot 2 */}
          <button
            type="button"
            className={`hover-lift ${selectedReactant2 ? '' : 'empty-slot'}`}
            disabled={!selectedReactant2}
            onClick={() => setSelectedReactant2(null)}
            aria-label={selectedReactant2 ? `${language === 'fr' ? 'Retirer le réactif 2' : 'Quitar el reactivo 2'}: ${selectedReactant2}` : (language === 'fr' ? 'Emplacement réactif 2 vide' : 'Ranura de reactivo 2 vacía')}
            style={{
              width: '80px', height: '80px',
              border: `2px dashed ${selectedReactant2 ? 'var(--neon-magenta)' : 'var(--text-muted)'}`,
              borderRadius: '8px',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.4)',
              cursor: selectedReactant2 ? 'pointer' : 'default',
              boxShadow: selectedReactant2 ? 'var(--glow-magenta)' : 'none',
              transition: 'all 0.2s', font: 'inherit'
            }}
          >
            {selectedReactant2 ? (
              <>
                <span style={{ fontSize: '28px', fontWeight: 'bold', fontFamily: 'var(--font-title)', color: '#fff' }}>{selectedReactant2}</span>
                <span style={{ fontSize: '9px', color: 'var(--neon-magenta)', fontFamily: 'var(--font-mono)' }}>REACTANT 2</span>
              </>
            ) : (
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>EMPTY SLOT</span>
            )}
          </button>
        </div>

        {/* Reset Button */}
        {(selectedReactant1 || selectedReactant2) && (
          <button onClick={clearReactants} className="btn btn-outline hover-lift" style={{ margin: '0 auto' }}>
            <RefreshCw size={12} aria-hidden="true" />
            RESET CHAMBER
          </button>
        )}
      </div>

      <div className="responsive-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Left: Quick Element Selection Panel */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '1px' }}>
            QUICK SELECTOR / SELECCIÓN RÁPIDA
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))', gap: '10px' }} aria-label="Liste des éléments rapides">
            {quickElements.map(el => {
              const isSelected = selectedReactant1 === el.s || selectedReactant2 === el.s;
              return (
                <button
                  key={el.s}
                  onClick={() => selectQuickElement(el.s)}
                  disabled={isSelected}
                  className={!isSelected ? 'hover-lift' : ''}
                  aria-pressed={isSelected}
                  style={{
                    padding: '12px 6px',
                    background: isSelected ? 'var(--bg-tertiary)' : 'rgba(0, 243, 255, 0.02)',
                    border: `1px solid ${isSelected ? 'var(--text-muted)' : 'var(--glass-border)'}`,
                    borderRadius: '4px',
                    color: isSelected ? 'var(--text-muted)' : '#fff',
                    fontFamily: 'var(--font-title)',
                    fontSize: '14px', fontWeight: 'bold',
                    cursor: isSelected ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: !isSelected ? 'inset 0 0 5px rgba(0, 243, 255, 0.02)' : 'none'
                  }}
                >
                  {el.s}
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px', letterSpacing: '1px' }}>
              {(language === 'fr' ? "SAISIE MANUELLE D'ÉLÉMENT" : 'ENTRADA MANUAL DE ELEMENTO').toUpperCase()}
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput((e.target as HTMLInputElement).value.slice(0, 3))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customInput.trim()) {
                    selectQuickElement(customInput.trim());
                    setCustomInput('');
                  }
                }}
                placeholder={language === 'fr' ? 'Ex: Fe, Au, Pb...' : 'Ej: Fe, Au, Pb...'}
                aria-label={language === 'fr' ? 'Saisir un symbole chimique manuellement' : 'Ingresar un símbolo químico manualmente'}
                style={{
                  flex: 1, minWidth: 0, padding: '8px 12px',
                  background: 'rgba(5, 5, 10, 0.6)', border: '1px solid var(--glass-border)',
                  borderRadius: '4px', color: '#fff', fontFamily: 'var(--font-title)',
                  fontSize: '14px', fontWeight: 'bold', outline: 'none', letterSpacing: '1px'
                }}
              />
              <button
                className="btn btn-primary hover-lift"
                style={{ padding: '8px 14px', fontSize: '11px' }}
                onClick={() => { if (customInput.trim()) { selectQuickElement(customInput.trim()); setCustomInput(''); } }}
              >
                {language === 'fr' ? 'AJOUTER' : 'AÑADIR'}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Reaction Telemetry & calculations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {reactionResult ? (
            <>
              {/* Equation & Telemetry */}
              <div
                className="glass-panel"
                role="status"
                aria-live="polite"
                style={{
                  padding: '20px',
                  borderColor: reactionResult.stable ? 'var(--neon-green)' : 'var(--neon-yellow)',
                  boxShadow: reactionResult.stable ? '0 0 10px rgba(57, 255, 20, 0.05)' : '0 0 10px rgba(255, 230, 0, 0.05)'
                }}
              >
                <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '1px' }}>
                  {t('fusion.equation').toUpperCase()}
                </h3>
                
                <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'var(--font-title)', color: '#fff', margin: '12px 0', textShadow: reactionResult.stable ? '0 0 8px rgba(57, 255, 20, 0.4)' : 'none' }}>
                  <ChemicalEquation
                    reactants={reactionResult.reactants.map(r => ({ coefficient: r.coef, formula: r.symbol }))}
                    products={reactionResult.products.map(p => ({ coefficient: p.coef, formula: p.symbol }))}
                  />
                </div>

                <p style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: '16px', fontStyle: 'italic' }}>
                  {reactionResult.products[0].name}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '16px' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-secondary)' }}>ENTHALPY (ΔH)</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 'bold', color: reactionResult.dH < 0 ? 'var(--neon-cyan)' : 'var(--neon-magenta)' }}>{reactionResult.dH} kJ</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-secondary)' }}>ENTROPY (ΔS)</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: '#fff' }}>{reactionResult.dS} J/K</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-secondary)' }}>GIBBS FREE (ΔG)</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 'bold', color: reactionResult.stable ? 'var(--neon-green)' : 'var(--neon-magenta)' }}>{reactionResult.dG} kJ</span>
                  </div>
                </div>

                {profile?.learningLevel === 'discovery' && (
                  <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(0, 243, 255, 0.05)', border: '1px solid var(--neon-cyan)', borderRadius: '8px', color: '#fff', fontSize: '13px', textAlign: 'left', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <Info size={16} style={{ color: 'var(--neon-cyan)', flexShrink: 0 }} aria-hidden="true" />
                    <p style={{ margin: 0, lineHeight: 1.4 }}>
                      {reactionResult.products[0]?.symbol === 'H2O' ? "L'eau est indispensable à la vie !" :
                       reactionResult.products[0]?.symbol === 'NaCl' ? "Le sel de table !" :
                       "Tu as fait une belle découverte scientifique."}
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', padding: '10px', background: reactionResult.stable ? 'rgba(57, 255, 20, 0.05)' : 'rgba(255, 0, 127, 0.05)', border: `1px solid ${reactionResult.stable ? 'rgba(57, 255, 20, 0.2)' : 'rgba(255, 0, 127, 0.2)'}`, borderRadius: '4px', fontSize: '12px', fontFamily: 'var(--font-mono)', color: reactionResult.stable ? 'var(--neon-green)' : 'var(--neon-magenta)' }}>
                  <Flame size={14} aria-hidden="true" />
                  <span>
                    {reactionResult.stable 
                      ? (language === 'es' ? "REACCIÓN ESPONTÁNEA & COMPUESTO ESTABLE" : "RÉACTION SPONTANÉE & PRODUIT STABLE")
                      : (language === 'es' ? "NO ESPONTÁNEA / INESTABLE EN STP" : "NON SPONTANÉE / INSTABLE EN STP")}
                  </span>
                </div>
              </div>

              <Stoichiometry
                reaction={reactionResult}
                onSelectCascadeReaction={(sym1, sym2) => {
                  setSelectedReactant1(sym1);
                  setSelectedReactant2(sym2);
                }}
              />
            </>
          ) : (
            <div className="glass-panel" style={{ padding: '24px', color: 'var(--text-secondary)', fontSize: '13px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', minHeight: '200px', border: '1px dashed var(--glass-border)' }}>
              <ShieldAlert size={28} style={{ color: 'var(--neon-magenta)' }} aria-hidden="true" />
              <p>{t('fusion.noReaction')}</p>
            </div>
          )}
        </div>
      </div>

      {reactionResult && (
        <div className="glass-panel" style={{ padding: '20px', borderColor: 'var(--glass-border)' }}>
          <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '1px', textAlign: 'center' }}>
            {t('fusion.energyDiagram').toUpperCase()}
          </h3>
          <EnergyDiagram dH={reactionResult.dH} />
        </div>
      )}
    </div>
  );
};
