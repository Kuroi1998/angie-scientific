import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useLocalStorageState } from '../../hooks/useLocalStorageState';
import elementsData from '../../engines/data/elements.json';
import { Search, RotateCcw, Filter } from 'lucide-react';

const isStringArray = (raw: unknown): raw is string[] =>
  Array.isArray(raw) && raw.every(item => typeof item === 'string');

export interface ElementType {
  n: number;
  s: string;
  nameFR: string;
  nameES: string;
  cat: string;
  mass: number;
  en: number | null;
  config: string;
  shells: number[];
  state: 'solid' | 'liquid' | 'gas' | 'synthetic';
  density: number | null;
  mp: number | null;
  bp: number | null;
  ar: number | null;
  ir: number | null;
  ie: number | null;
  ea: number | null;
  crystal: string;
  ab: number | null;
  usesFR: string;
  usesES: string;
  historyFR: string;
  historyES: string;
  descFR: string;
  descES: string;
}

interface TableGridProps {
  onSelectElement: (el: ElementType) => void;
  onAddToFusion?: (el: ElementType) => void;
}

export const TableGrid: React.FC<TableGridProps> = ({ onSelectElement, onAddToFusion }) => {
  const { language, t } = useLanguage();
  const elements = elementsData as ElementType[];

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<ElementType[]>([]);
  const [, setSearchHistory] = useLocalStorageState<string[]>(
    'searchHistory',
    [],
    {
      validate: isStringArray,
      legacyKey: 'angie_sci_search_history',
      parseLegacy: (raw) => {
        try {
          const parsed: unknown = JSON.parse(raw);
          return isStringArray(parsed) ? parsed : undefined;
        } catch {
          return undefined;
        }
      },
    }
  );


  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  
  // Advanced range filters
  const [enRange, setEnRange] = useState<[number, number]>([0.7, 4.0]);
  const [densityRange, setDensityRange] = useState<[number, number]>([0, 23]);
  const [mpRange, setMpRange] = useState<[number, number]>([0, 4000]);

  const [showFilters, setShowFilters] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<ElementType | null>(null);

  // Autocomplete Suggestions
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }
    const query = search.toLowerCase();
    const filtered = elements.filter(el => {
      const name = language === 'es' ? el.nameES : el.nameFR;
      return el.s.toLowerCase().startsWith(query) || 
             name.toLowerCase().includes(query) || 
             el.n.toString() === query;
    }).slice(0, 5);
    setSuggestions(filtered);
  }, [search, language, elements]);

  const handleSearchSubmit = (queryStr: string) => {
    if (!queryStr.trim()) return;
    const cleanQuery = queryStr.trim();

    // Add to history
    setSearchHistory(prev => [cleanQuery, ...prev.filter(h => h !== cleanQuery)].slice(0, 5));

    // Find exact match first (symbol, name, or atomic number)
    const matched = elements.find(el => {
      const name = language === 'es' ? el.nameES : el.nameFR;
      return el.s.toLowerCase() === cleanQuery.toLowerCase() ||
             name.toLowerCase() === cleanQuery.toLowerCase() ||
             el.n.toString() === cleanQuery;
    });

    if (matched) {
      onSelectElement(matched);
      setSearch('');
      setSuggestions([]);
    } else {
      // Fallback: open first partial match if available
      const partialMatched = elements.find(el => {
        const name = language === 'es' ? el.nameES : el.nameFR;
        return el.s.toLowerCase().startsWith(cleanQuery.toLowerCase()) ||
               name.toLowerCase().includes(cleanQuery.toLowerCase());
      });
      if (partialMatched) {
        onSelectElement(partialMatched);
        setSearch('');
        setSuggestions([]);
      }
      // Otherwise: keep the search text to filter the grid
    }
  };


  // Reset filters
  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedState('all');
    setEnRange([0.7, 4.0]);
    setDensityRange([0, 23]);
    setMpRange([0, 4000]);
  };

  // Check if element matches filters
  const matchesFilters = (el: ElementType) => {
    // Search filter
    if (search.trim()) {
      const query = search.toLowerCase();
      const name = language === 'es' ? el.nameES : el.nameFR;
      const matchSearch = el.s.toLowerCase().includes(query) || 
                          name.toLowerCase().includes(query) || 
                          el.n.toString() === query;
      if (!matchSearch) return false;
    }
    // Category filter
    if (selectedCategory !== 'all' && el.cat !== selectedCategory) return false;
    // State filter
    if (selectedState !== 'all' && el.state !== selectedState) return false;
    // Electronegativity filter
    if (el.en !== null) {
      if (el.en < enRange[0] || el.en > enRange[1]) return false;
    } else if (enRange[0] > 0.7) {
      return false; // exclude if range is restricted
    }
    // Density filter
    if (el.density !== null) {
      if (el.density < densityRange[0] || el.density > densityRange[1]) return false;
    } else if (densityRange[0] > 0) {
      return false;
    }
    // Melting Point filter
    if (el.mp !== null) {
      if (el.mp < mpRange[0] || el.mp > mpRange[1]) return false;
    } else if (mpRange[0] > 0) {
      return false;
    }

    return true;
  };

  // Calculate standard grid layout position
  const getGridPosition = (n: number) => {
    if (n === 1) return { gridRow: 1, gridColumn: 1 };
    if (n === 2) return { gridRow: 1, gridColumn: 18 };
    if (n >= 3 && n <= 4) return { gridRow: 2, gridColumn: n - 2 };
    if (n >= 5 && n <= 10) return { gridRow: 2, gridColumn: n + 8 };
    if (n >= 11 && n <= 12) return { gridRow: 3, gridColumn: n - 10 };
    if (n >= 13 && n <= 18) return { gridRow: 3, gridColumn: n };
    if (n >= 19 && n <= 36) return { gridRow: 4, gridColumn: n - 18 };
    if (n >= 37 && n <= 54) return { gridRow: 5, gridColumn: n - 36 };
    
    // Period 6 (includes Lanthanides split)
    if (n >= 55 && n <= 56) return { gridRow: 6, gridColumn: n - 54 };
    if (n === 57) return { gridRow: 6, gridColumn: 3 }; // placeholder cell
    if (n >= 58 && n <= 71) return { gridRow: 9, gridColumn: n - 58 + 4 }; // Lanthanide row
    if (n >= 72 && n <= 86) return { gridRow: 6, gridColumn: n - 72 + 4 };
    
    // Period 7 (includes Actinides split)
    if (n >= 87 && n <= 88) return { gridRow: 7, gridColumn: n - 86 };
    if (n === 89) return { gridRow: 7, gridColumn: 3 }; // placeholder cell
    if (n >= 90 && n <= 103) return { gridRow: 10, gridColumn: n - 90 + 4 }; // Actinide row
    if (n >= 104 && n <= 118) return { gridRow: 7, gridColumn: n - 104 + 4 };
    
    return {};
  };

  const categories = [
    { id: 'alkali-metal', label: t('legend.alkali'), color: 'var(--cat-alkali)' },
    { id: 'alkaline-earth', label: t('legend.alkaline'), color: 'var(--cat-alkaline)' },
    { id: 'transition-metal', label: t('legend.transition'), color: 'var(--cat-transition)' },
    { id: 'lanthanide', label: t('legend.lanthanide'), color: 'var(--cat-lanthanide)' },
    { id: 'actinide', label: t('legend.actinide'), color: 'var(--cat-actinide)' },
    { id: 'post-transition-metal', label: t('legend.post'), color: 'var(--cat-post-transition)' },
    { id: 'metalloid', label: t('legend.metalloid'), color: 'var(--cat-metalloid)' },
    { id: 'reactive-nonmetal', label: t('legend.nonmetal'), color: 'var(--cat-nonmetal)' },
    { id: 'noble-gas', label: t('legend.noble'), color: 'var(--cat-noble)' },
    { id: 'unknown', label: t('legend.unknown'), color: 'var(--cat-unknown)' }
  ];

  return React.createElement('div', { className: 'table-container animate-fade-in' },
    // Header Toolbar
    React.createElement('div', { className: 'toolbar glass-panel', style: { padding: '16px', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' } },
      // Search Box
      React.createElement('div', { style: { position: 'relative', flex: '1', minWidth: '280px' } },
        React.createElement('div', { style: { display: 'flex', gap: '8px' } },
          React.createElement('div', { style: { position: 'relative', flex: '1', minWidth: 0 } },
            React.createElement('input', {
              type: 'text',
              value: search,
              onChange: (e) => setSearch(e.target.value),
              onKeyDown: (e) => e.key === 'Enter' && handleSearchSubmit(search),
              placeholder: t('search.placeholder'),
              style: {
                width: '100%',
                padding: '10px 12px 10px 36px',
                background: 'rgba(5, 5, 10, 0.6)',
                border: '1px solid var(--glass-border)',
                borderRadius: '4px',
                color: '#fff',
                fontFamily: 'var(--font-body)',
                outline: 'none',
              }
            }),
            React.createElement(Search, { size: 16, style: { position: 'absolute', left: '12px', top: '12px', color: 'var(--text-secondary)' } })
          ),
          React.createElement('button', {
            onClick: () => setShowFilters(!showFilters),
            className: 'action-btn',
            style: {
              padding: '10px 16px',
              background: showFilters ? 'rgba(0, 243, 255, 0.15)' : 'var(--bg-tertiary)',
              border: '1px solid var(--neon-cyan)',
              borderRadius: '4px',
              color: 'var(--neon-cyan)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-title)',
              fontSize: '12px',
              boxShadow: showFilters ? 'var(--glow-cyan)' : 'none'
            }
          },
            React.createElement(Filter, { size: 14 }),
            "FILTERS"
          )
        ),
        // Autocomplete suggestions
        suggestions.length > 0 && React.createElement('div', {
          style: {
            position: 'absolute',
            top: '46px',
            left: '0',
            width: '100%',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--neon-cyan)',
            borderRadius: '4px',
            zIndex: '100',
            boxShadow: 'var(--glow-cyan)',
            overflow: 'hidden'
          }
        },
          suggestions.map(el => React.createElement('button', {
            key: el.n,
            type: 'button',
            onClick: () => {
              onSelectElement(el);
              setSearch('');
              setSuggestions([]);
            },
            style: {
              width: '100%',
              padding: '10px 16px',
              cursor: 'pointer',
              border: 'none',
              borderBottom: '1px solid rgba(0, 243, 255, 0.1)',
              background: 'transparent',
              color: 'inherit',
              font: 'inherit',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'background 0.2s'
            },
            className: 'suggestion-item'
          },
            React.createElement('span', { style: { fontFamily: 'var(--font-title)', fontWeight: 'bold' } },
              React.createElement('span', { style: { color: 'var(--neon-cyan)', marginRight: '8px' } }, `${el.n}.`),
              React.createElement('span', null, language === 'es' ? el.nameES : el.nameFR)
            ),
            React.createElement('span', { style: { fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' } }, el.s)
          ))
        )
      ),

      // Hover element quick details readout (telemetry style)
      React.createElement('div', {
        style: {
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          alignItems: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          color: 'var(--neon-cyan)',
          minWidth: '220px',
          maxWidth: '100%',
          background: 'rgba(0, 243, 255, 0.03)',
          borderLeft: '2px solid var(--neon-cyan)',
          padding: '8px 16px',
          borderRadius: '0 4px 4px 0'
        }
      },
        hoveredElement ? [
          React.createElement('div', { key: 'num', style: { display: 'flex', flexDirection: 'column' } },
            React.createElement('span', { style: { fontSize: '10px', color: 'var(--text-secondary)' } }, "NUM"),
            React.createElement('span', { style: { fontSize: '16px', fontWeight: 'bold' } }, hoveredElement.n)
          ),
          React.createElement('div', { key: 'sym', style: { display: 'flex', flexDirection: 'column' } },
            React.createElement('span', { style: { fontSize: '10px', color: 'var(--text-secondary)' } }, "SYM"),
            React.createElement('span', { style: { fontSize: '16px', fontWeight: 'bold', color: '#fff' } }, hoveredElement.s)
          ),
          React.createElement('div', { key: 'name', style: { display: 'flex', flexDirection: 'column' } },
            React.createElement('span', { style: { fontSize: '10px', color: 'var(--text-secondary)' } }, "NAME"),
            React.createElement('span', null, language === 'es' ? hoveredElement.nameES : hoveredElement.nameFR)
          ),
          React.createElement('div', { key: 'mass', style: { display: 'flex', flexDirection: 'column' } },
            React.createElement('span', { style: { fontSize: '10px', color: 'var(--text-secondary)' } }, "MASS"),
            React.createElement('span', null, `${hoveredElement.mass} u`)
          )
        ] : React.createElement('span', { style: { color: 'var(--text-secondary)', fontStyle: 'italic' } }, "TELEMETRY OFFLINE: HOVER AN ELEMENT")
      )
    ),

    // Advanced Filters Panel
    showFilters && React.createElement('div', { className: 'glass-panel animate-fade-in', style: { padding: '20px', marginBottom: '20px', border: '1px solid var(--neon-magenta)' } },
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' } },
        // Category Select
        React.createElement('div', null,
          React.createElement('label', { style: { display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', fontFamily: 'var(--font-title)' } }, t('filter.category')),
          React.createElement('select', {
            value: selectedCategory,
            onChange: (e) => setSelectedCategory((e.target as HTMLSelectElement).value),
            style: {
              width: '100%',
              padding: '8px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--glass-border)',
              borderRadius: '4px',
              color: '#fff',
              outline: 'none'
            }
          },
            React.createElement('option', { value: 'all' }, "ALL CATEGORIES"),
            categories.map(c => React.createElement('option', { key: c.id, value: c.id }, c.label.toUpperCase()))
          )
        ),
        // State Select
        React.createElement('div', null,
          React.createElement('label', { style: { display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', fontFamily: 'var(--font-title)' } }, t('filter.state')),
          React.createElement('select', {
            value: selectedState,
            onChange: (e) => setSelectedState((e.target as HTMLSelectElement).value),
            style: {
              width: '100%',
              padding: '8px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--glass-border)',
              borderRadius: '4px',
              color: '#fff',
              outline: 'none'
            }
          },
            React.createElement('option', { value: 'all' }, "ALL STATES"),
            React.createElement('option', { value: 'solid' }, t('filter.state.solid').toUpperCase()),
            React.createElement('option', { value: 'liquid' }, t('filter.state.liquid').toUpperCase()),
            React.createElement('option', { value: 'gas' }, t('filter.state.gas').toUpperCase()),
            React.createElement('option', { value: 'synthetic' }, t('filter.state.synthetic').toUpperCase())
          )
        ),
        // Electronegativity Slider
        React.createElement('div', null,
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', fontFamily: 'var(--font-title)' } },
            React.createElement('span', null, t('filter.electronegativity')),
            React.createElement('span', { style: { color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)' } }, `${enRange[0].toFixed(1)} - ${enRange[1].toFixed(1)}`)
          ),
          React.createElement('input', {
            type: 'range',
            min: 0.7,
            max: 4.0,
            step: 0.1,
            value: enRange[1],
            onChange: (e) => setEnRange([enRange[0], parseFloat(e.target.value)]),
            style: { width: '100%', accentColor: 'var(--neon-cyan)' }
          })
        ),
        // Melting Point Slider
        React.createElement('div', null,
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', fontFamily: 'var(--font-title)' } },
            React.createElement('span', null, t('filter.melting')),
            React.createElement('span', { style: { color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)' } }, `${mpRange[0]}K - ${mpRange[1]}K`)
          ),
          React.createElement('input', {
            type: 'range',
            min: 0,
            max: 4000,
            step: 50,
            value: mpRange[1],
            onChange: (e) => setMpRange([mpRange[0], parseInt(e.target.value)]),
            style: { width: '100%', accentColor: 'var(--neon-cyan)' }
          })
        )
      ),
      // Reset Button
      React.createElement('div', { style: { marginTop: '16px', display: 'flex', justifyContent: 'flex-end' } },
        React.createElement('button', {
          onClick: handleResetFilters,
          style: {
            padding: '8px 16px',
            background: 'transparent',
            border: '1px solid rgba(255,0,127,0.5)',
            borderRadius: '4px',
            color: 'var(--neon-magenta)',
            cursor: 'pointer',
            fontFamily: 'var(--font-title)',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }
        },
          React.createElement(RotateCcw, { size: 12 }),
          t('filter.reset').toUpperCase()
        )
      )
    ),

    // Scroll hint, shown only on narrow viewports (see responsive.css)
    React.createElement('p', {
      className: 'periodic-grid-scroll-hint',
      style: {
        fontSize: '10px',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-secondary)',
        textAlign: 'center',
        margin: '0 0 8px 0'
      }
    }, language === 'fr' ? '← Faites défiler pour voir tous les éléments →' : '← Desliza para ver todos los elementos →'),

    // Grid Layout Area. `minmax(45px, 1fr)` keeps every cell readable/tappable —
    // on a narrow viewport the grid's intrinsic width exceeds its box, so this
    // container (not the whole page) scrolls horizontally instead of squishing cells.
    React.createElement('div', {
      className: 'periodic-grid-scroll',
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(18, minmax(45px, 1fr))',
        gap: '6px',
        overflowX: 'auto',
        paddingBottom: '16px'
      }
    },
      elements.map(el => {
        const active = matchesFilters(el);
        const gridPos = getGridPosition(el.n);
        const catObj = categories.find(c => c.id === el.cat);
        const catColor = catObj ? catObj.color : 'var(--cat-unknown)';

        // Render individual element cell. Wraps a real <button> (select action) and a
        // sibling overlay button (quick-add to fusion) — buttons cannot be nested in HTML.
        return React.createElement('div', {
          key: el.n,
          style: { ...gridPos, position: 'relative' }
        },
          React.createElement('button', {
            type: 'button',
            disabled: !active,
            'aria-label': `${el.n} — ${language === 'es' ? el.nameES : el.nameFR} (${el.s})`,
            style: {
              width: '100%',
              height: '100%',
              border: `1px solid ${active ? catColor : 'rgba(255, 255, 255, 0.05)'}`,
              borderRadius: '4px',
              background: active
                ? `linear-gradient(135deg, rgba(20,20,30,0.8), rgba(${catColor === 'var(--cat-alkali)' ? '255,65,54' : '0,243,255'},0.04))`
                : 'rgba(255, 255, 255, 0.01)',
              opacity: active ? 1 : 0.2,
              aspectRatio: '1',
              padding: '4px',
              cursor: active ? 'pointer' : 'default',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: active && hoveredElement?.n === el.n ? `0 0 12px ${catColor}` : 'none',
              transform: active && hoveredElement?.n === el.n ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.15s ease-in-out',
              position: 'relative',
              zIndex: hoveredElement?.n === el.n ? '10' : '1',
              font: 'inherit',
              textAlign: 'left'
            },
            onMouseEnter: () => active && setHoveredElement(el),
            onMouseLeave: () => active && setHoveredElement(null),
            onFocus: () => active && setHoveredElement(el),
            onBlur: () => active && setHoveredElement(null),
            onClick: () => active && onSelectElement(el)
          },
            // Atomic Number
            React.createElement('span', {
              style: {
                fontSize: '9px',
                fontFamily: 'var(--font-mono)',
                color: active ? 'var(--text-secondary)' : 'var(--text-muted)',
                alignSelf: 'flex-start'
              }
            }, el.n),
            // Symbol
            React.createElement('span', {
              style: {
                fontSize: '16px',
                fontWeight: '900',
                fontFamily: 'var(--font-title)',
                color: active ? '#fff' : 'var(--text-muted)',
                textAlign: 'center',
                textShadow: active ? `0 0 8px ${catColor}` : 'none'
              }
            }, el.s),
            // Atomic Mass or Name abbreviated
            React.createElement('span', {
              style: {
                fontSize: '7px',
                fontFamily: 'var(--font-mono)',
                color: active ? 'var(--text-secondary)' : 'var(--text-muted)',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
              }
            }, el.mass.toFixed(2))
          ),

          // Action button overlay on hover/focus
          active && hoveredElement?.n === el.n && onAddToFusion && React.createElement('button', {
            type: 'button',
            title: t('fusion.add'),
            'aria-label': `${t('fusion.add')}: ${el.s}`,
            onClick: (e) => {
              e.stopPropagation();
              onAddToFusion(el);
            },
            style: {
              position: 'absolute',
              top: '1px',
              right: '1px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: 'var(--neon-magenta)',
              border: 'none',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--glow-magenta)',
              zIndex: 11
            }
          }, "+")
        );
      }),

      // Placeholders inside empty grid blocks to write Lanthanum / Actinium limits
      React.createElement('div', {
        key: 'la-placeholder',
        style: {
          gridRow: 6,
          gridColumn: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px dashed var(--text-muted)',
          borderRadius: '4px',
          background: 'rgba(255,255,255,0.02)',
          fontSize: '9px',
          fontFamily: 'var(--font-title)',
          color: 'var(--text-secondary)',
          textAlign: 'center'
        }
      }, "57-71"),
      React.createElement('div', {
        key: 'ac-placeholder',
        style: {
          gridRow: 7,
          gridColumn: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px dashed var(--text-muted)',
          borderRadius: '4px',
          background: 'rgba(255,255,255,0.02)',
          fontSize: '9px',
          fontFamily: 'var(--font-title)',
          color: 'var(--text-secondary)',
          textAlign: 'center'
        }
      }, "89-103")
    ),

    // Grid Category Legend
    React.createElement('div', {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        marginTop: '20px',
        padding: '12px',
        border: '1px solid var(--glass-border)',
        borderRadius: '4px',
        background: 'rgba(10, 10, 15, 0.5)'
      }
    },
      categories.map(cat => React.createElement('button', {
        key: cat.id,
        type: 'button',
        'aria-pressed': selectedCategory === cat.id,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          fontFamily: 'var(--font-title)',
          cursor: 'pointer',
          opacity: selectedCategory === 'all' || selectedCategory === cat.id ? 1 : 0.4,
          background: 'transparent',
          border: 'none',
          padding: 0,
          color: 'inherit'
        },
        onClick: () => setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)
      },
        React.createElement('div', {
          style: {
            width: '12px',
            height: '12px',
            borderRadius: '2px',
            background: cat.color,
            boxShadow: `0 0 6px ${cat.color}`
          }
        }),
        React.createElement('span', { style: { color: selectedCategory === cat.id ? 'var(--neon-cyan)' : '#fff' } }, cat.label)
      ))
    )
  );
};
