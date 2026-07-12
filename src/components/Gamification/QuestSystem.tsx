import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Trophy, Award, Target, Sparkles, CheckSquare } from 'lucide-react';

interface Quest {
  id: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  titleFR: string;
  titleES: string;
  descFR: string;
  descES: string;
  points: number;
}

const QUESTS: Quest[] = [
  {
    id: 'halogens',
    level: 'beginner',
    titleFR: 'Trouver 3 Halogènes',
    titleES: 'Encontrar 3 Halógenos',
    descFR: 'Explorez la fiche détaillée de 3 éléments de la colonne 17 (F, Cl, Br, I) dans la grille.',
    descES: 'Explore la ficha detallada de 3 elementos de la columna 17 (F, Cl, Br, I) en la cuadrícula.',
    points: 100
  },
  {
    id: 'h2o_combustion',
    level: 'beginner',
    titleFR: 'Équilibrer l\'équation de l\'eau',
    titleES: 'Equilibrar la ecuación del agua',
    descFR: 'Initiez la fusion chimique entre H et O dans le simulateur de fusion.',
    descES: 'Inicie la fusión química entre H y O en el simulador de fusión.',
    points: 150
  },
  {
    id: 'limiting_reactant',
    level: 'intermediate',
    titleFR: 'Trouver le réactif limitant',
    titleES: 'Encontrar el reactivo limitante',
    descFR: 'Basculez le calculateur en mode Réactifs Indépendants et comparez les rapports.',
    descES: 'Cambie el calculador al modo Reactivos Independientes y compare las proporciones.',
    points: 200
  },
  {
    id: 'cascade_synthesis',
    level: 'advanced',
    titleFR: 'Synthèse multi-étapes en Cascade',
    titleES: 'Síntesis multi-etapas en Cascada',
    descFR: 'Lancez la réaction en cascade Sodium + Eau après avoir produit de l\'eau.',
    descES: 'Inicie la reacción en cascada Sodio + Agua después de haber producido agua.',
    points: 350
  },
  {
    id: 'vsepr_prediction',
    level: 'advanced',
    titleFR: 'Prédire la géométrie VSEPR',
    titleES: 'Predecir la geometría VSEPR',
    descFR: 'Prédisez la géométrie d\'un composé avec 4 ligands (ex: CH₄ - Tétraédrique).',
    descES: 'Prediga la geometría de un compuesto con 4 ligandos (ej: CH₄ - Tetraédrica).',
    points: 300
  }
];

export const QuestSystem: React.FC = () => {
  const { language } = useLanguage();
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [totalPoints, setTotalPoints] = useState<number>(0);

  // Load state from localStorage on init
  useEffect(() => {
    const saved = localStorage.getItem('angie_scientific_quests_completed');
    if (saved) {
      try {
        const ids = JSON.parse(saved) as string[];
        setCompletedQuests(ids);
        
        // Sum points
        let sum = 0;
        ids.forEach(id => {
          const q = QUESTS.find(item => item.id === id);
          if (q) sum += q.points;
        });
        setTotalPoints(sum);
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const toggleQuest = (id: string) => {
    let next: string[];
    if (completedQuests.includes(id)) {
      next = completedQuests.filter(item => item !== id);
    } else {
      next = [...completedQuests, id];
    }
    setCompletedQuests(next);
    localStorage.setItem('angie_scientific_quests_completed', JSON.stringify(next));

    // Recalculate points
    let sum = 0;
    next.forEach(nid => {
      const q = QUESTS.find(item => item.id === nid);
      if (q) sum += q.points;
    });
    setTotalPoints(sum);
  };

  const getLevelColor = (level: string) => {
    if (level === 'beginner') return 'var(--neon-green)';
    if (level === 'intermediate') return 'var(--neon-yellow)';
    return 'var(--neon-magenta)';
  };

  const completedCount = completedQuests.length;
  const progressPercent = QUESTS.length > 0 ? (completedCount / QUESTS.length) * 100 : 0;

  // Unlocked Badges
  const badges = [
    { name: language === 'fr' ? 'Apprenti Chimiste' : 'Aprendiz Químico', min: 100, icon: Target },
    { name: language === 'fr' ? 'Maître des Équilibres' : 'Maestro de Equilibrios', min: 250, icon: Award },
    { name: language === 'fr' ? 'Quantum Wizard' : 'Mago Cuántico', min: 500, icon: Trophy },
    { name: language === 'fr' ? 'Commandeur Scientifique' : 'Comandante Científico', min: 800, icon: Sparkles }
  ];

  return React.createElement('div', {
    className: 'quest-system-container animate-fade-in',
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      width: '100%'
    }
  },
    // Left column: Active Quests list
    React.createElement('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }
    },
      React.createElement('div', {
        className: 'glass-panel',
        style: {
          padding: '16px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }
      },
        React.createElement('h3', { style: { fontFamily: 'var(--font-title)', fontSize: '13px', color: '#fff', margin: 0, letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' } },
          React.createElement(Target, { size: 14, style: { color: 'var(--neon-cyan)' } }),
          (language === 'fr' ? "QUÊTES & DÉFIS ACTIFS" : "MISIONES Y DESAFÍOS ACTIVOS").toUpperCase()
        ),

        // Quest items list
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
          QUESTS.map(q => {
            const isCompleted = completedQuests.includes(q.id);
            return React.createElement('div', {
              key: q.id,
              onClick: () => toggleQuest(q.id),
              style: {
                padding: '12px',
                background: isCompleted ? 'rgba(0, 243, 255, 0.03)' : 'rgba(255,255,255,0.01)',
                border: `1px solid ${isCompleted ? 'var(--neon-cyan)' : 'var(--glass-border)'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start'
              }
            },
              // Glowing checkmark checkbox
              React.createElement('div', {
                style: {
                  width: '18px',
                  height: '18px',
                  border: `1px solid ${isCompleted ? 'var(--neon-cyan)' : 'var(--text-secondary)'}`,
                  borderRadius: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isCompleted ? 'rgba(0, 243, 255, 0.1)' : 'transparent',
                  color: 'var(--neon-cyan)',
                  marginTop: '2px'
                }
              },
                isCompleted && React.createElement(CheckSquare, { size: 12 })
              ),

              // Quest details
              React.createElement('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' } },
                React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                  React.createElement('span', { style: { fontFamily: 'var(--font-title)', fontSize: '12px', color: isCompleted ? 'var(--neon-cyan)' : '#fff', fontWeight: 'bold' } },
                    language === 'fr' ? q.titleFR : q.titleES
                  ),
                  React.createElement('span', {
                    style: {
                      fontSize: '8px',
                      fontFamily: 'var(--font-mono)',
                      color: getLevelColor(q.level),
                      border: `1px solid ${getLevelColor(q.level)}`,
                      padding: '2px 4px',
                      borderRadius: '3px',
                      textTransform: 'uppercase'
                    }
                  }, q.level)
                ),
                React.createElement('p', { style: { fontSize: '10.5px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' } },
                  language === 'fr' ? q.descFR : q.descES
                ),
                React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '4px' } },
                  React.createElement('span', null, isCompleted ? "COMPLETED" : "IN PROGRESS"),
                  React.createElement('span', { style: { color: 'var(--neon-yellow)' } }, `+ ${q.points} PTS`)
                )
              )
            );
          })
        )
      )
    ),

    // Right column: User achievements & progress
    React.createElement('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }
    },
      // Core stats panel
      React.createElement('div', {
        className: 'glass-panel',
        style: {
          padding: '16px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }
      },
        React.createElement('h3', { style: { fontFamily: 'var(--font-title)', fontSize: '13px', color: '#fff', margin: 0, letterSpacing: '1px' } },
          (language === 'fr' ? "PROGRES SCIENTIFIQUE GLOBALE" : "PROGRESO CIENTÍFICO GLOBAL").toUpperCase()
        ),

        // Moles/Points display
        React.createElement('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#07080f',
            padding: '14px',
            borderRadius: '6px',
            border: '1px solid rgba(0, 243, 255, 0.05)'
          }
        },
          React.createElement('div', null,
            React.createElement('span', { style: { fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase' } },
              language === 'fr' ? "Points d'Expérience" : "Puntos de Experiencia"
            ),
            React.createElement('span', { style: { fontSize: '28px', fontFamily: 'var(--font-title)', fontWeight: '900', color: 'var(--neon-yellow)', textShadow: '0 0 10px rgba(255, 230, 0, 0.4)' } },
              totalPoints
            )
          ),
          React.createElement('div', { style: { textAlign: 'right' } },
            React.createElement('span', { style: { fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase' } },
              language === 'fr' ? "Défis Complétés" : "Desafíos Completados"
            ),
            React.createElement('span', { style: { fontSize: '20px', fontFamily: 'var(--font-title)', color: '#fff' } },
              `${completedCount} / ${QUESTS.length}`
            )
          )
        ),

        // Progress bar
        React.createElement('div', null,
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: '4px' } },
            React.createElement('span', null, language === 'fr' ? "NIVEAU D'ACCRÉDITATION" : "NIVEL DE ACREDITACIÓN"),
            React.createElement('span', null, `${Math.round(progressPercent)}%`)
          ),
          React.createElement('div', {
            style: {
              width: '100%',
              height: '6px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '3px',
              overflow: 'hidden'
            }
          },
            React.createElement('div', {
              style: {
                width: `${progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))',
                borderRadius: '3px',
                boxShadow: 'var(--glow-cyan)',
                transition: 'width 0.3s'
              }
            })
          )
        )
      ),

      // Badges unlocks panel
      React.createElement('div', {
        className: 'glass-panel',
        style: {
          padding: '16px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }
      },
        React.createElement('h3', { style: { fontFamily: 'var(--font-title)', fontSize: '13px', color: '#fff', margin: 0, letterSpacing: '1px' } },
          (language === 'fr' ? "INSIGNES & DISTINCTIONS" : "INSIGNIAS Y DISTINCIONES").toUpperCase()
        ),

        // Badges grid
        React.createElement('div', {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px'
          }
        },
          badges.map((b, i) => {
            const isUnlocked = totalPoints >= b.min;
            const Icon = b.icon;
            return React.createElement('div', {
              key: i,
              className: 'glass-panel',
              style: {
                padding: '10px',
                background: isUnlocked ? 'rgba(157, 0, 255, 0.02)' : 'rgba(255,255,255,0.01)',
                border: `1px solid ${isUnlocked ? 'var(--neon-purple)' : 'var(--glass-border)'}`,
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: isUnlocked ? 1 : 0.4,
                transition: 'all 0.2s'
              }
            },
              React.createElement(Icon, { size: 18, style: { color: isUnlocked ? 'var(--neon-purple)' : 'var(--text-secondary)' } }),
              React.createElement('div', { style: { display: 'flex', flexDirection: 'column' } },
                React.createElement('span', { style: { fontSize: '9.5px', fontFamily: 'var(--font-title)', fontWeight: 'bold', color: isUnlocked ? '#fff' : 'var(--text-secondary)' } },
                  b.name
                ),
                React.createElement('span', { style: { fontSize: '8px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' } },
                  isUnlocked ? "UNLOCKED" : `${b.min} PTS`
                )
              )
            );
          })
        )
      )
    )
  );
};
