import { createReactionDraft } from './reactionHelpers';
import type { ReactionDraft } from './reactionTypes';

export const getKnownReactionDraft = (sym1: string, sym2: string): ReactionDraft | null => {
  switch (`${sym1}|${sym2}`) {
    case 'H|O':
      return createReactionDraft({
        prodSym: 'H2O',
        prodName: 'Eau / Agua (H₂O)',
        c1: 2,
        c2: 1,
        cp: 2,
        intermediates: ['H radical', 'O radical', 'OH radical'],
        catalystFR: 'Platine ou etincelle electrique.',
        catalystES: 'Platino o chispa electrica.',
        mechanismFR: [
          'Initiation : clivage de H2 sous chaleur ou etincelle.',
          'Propagation : H reagit avec O2 pour generer OH et O.',
          "Terminaison : recombinaison des radicaux pour former l'eau."
        ],
        mechanismES: [
          'Iniciacion: escision de H2 bajo calor o chispa.',
          'Propagacion: H reacciona con O2 para generar OH y O.',
          'Terminacion: recombinacion de radicales para formar agua.'
        ],
        cascadeFR: "L'eau produite peut reagir avec du sodium actif pour produire NaOH et H2.",
        cascadeES: 'El agua producida puede reaccionar con sodio activo para producir NaOH y H2.'
      });

    case 'Na|Cl':
      return createReactionDraft({
        prodSym: 'NaCl',
        prodName: 'Chlorure de Sodium / Cloruro de Sodio (NaCl)',
        c1: 2,
        c2: 1,
        cp: 2,
        intermediates: ['Na+', 'Cl-', 'Cl radical'],
        catalystFR: "Une goutte d'eau accelere la reaction en dissolvant la couche d'oxyde du sodium.",
        catalystES: 'Una gota de agua acelera la reaccion al disolver la capa de oxido del sodio.',
        mechanismFR: [
          "Etape 1 : le sodium fond sous l'effet de la chaleur d'initiation.",
          'Etape 2 : le dichlore se dissocie en atomes de chlore.',
          'Etape 3 : transfert electronique puis condensation ionique.'
        ],
        mechanismES: [
          'Paso 1: el sodio se funde bajo el calor de iniciacion.',
          'Paso 2: el dicloro se disocia en atomos de cloro.',
          'Paso 3: transferencia electronica y condensacion ionica.'
        ],
        cascadeFR: "NaCl dissous peut subir une electrolyse via le procede chlore-alcali.",
        cascadeES: 'NaCl disuelto puede someterse a electrolisis mediante el proceso cloro-alcali.'
      });

    case 'Mg|O':
      return createReactionDraft({
        prodSym: 'MgO',
        prodName: 'Oxyde de Magnesium / Oxido de Magnesio (MgO)',
        c1: 2,
        c2: 1,
        cp: 2,
        intermediates: ['Mg2+', 'O2-'],
        mechanismFR: [
          "Etape 1 : le magnesium s'enflamme a l'air.",
          'Etape 2 : transfert de deux electrons de Mg vers O.'
        ],
        mechanismES: [
          'Paso 1: el magnesio se enciende en el aire.',
          'Paso 2: transferencia de dos electrones de Mg a O.'
        ]
      });

    case 'Al|O':
      return createReactionDraft({
        prodSym: 'Al2O3',
        prodName: 'Alumine / Alumina (Al2O3)',
        c1: 4,
        c2: 3,
        cp: 2,
        intermediates: ['Al3+', 'O2-'],
        mechanismFR: [
          'Etape 1 : oxydation rapide de surface.',
          'Etape 2 : formation des ions aluminium et oxyde.'
        ],
        mechanismES: [
          'Paso 1: oxidacion rapida de superficie.',
          'Paso 2: formacion de iones aluminio y oxido.'
        ]
      });

    case 'C|O':
      return createReactionDraft({
        prodSym: 'CO2',
        prodName: 'Dioxyde de Carbone / Dioxido de Carbono (CO2)',
        c1: 1,
        c2: 1,
        cp: 1,
        intermediates: ['CO'],
        mechanismFR: [
          'Etape 1 : oxydation partielle du carbone en CO.',
          "Etape 2 : oxydation complete du CO en CO2 avec exces d'oxygene."
        ],
        mechanismES: [
          'Paso 1: oxidacion parcial del carbono en CO.',
          'Paso 2: oxidacion completa de CO a CO2 con exceso de oxigeno.'
        ]
      });

    case 'H|N':
      return createReactionDraft({
        prodSym: 'NH3',
        prodName: 'Ammoniac / Amoniaco (NH3)',
        c1: 3,
        c2: 1,
        cp: 2,
        intermediates: ['N ads', 'NH ads', 'NH2 ads'],
        catalystFR: 'Catalyseur au fer sous haute pression et haute temperature.',
        catalystES: 'Catalizador de hierro bajo alta presion y alta temperatura.',
        mechanismFR: [
          'Etape 1 : adsorption dissociative de N2 et H2 sur le fer.',
          'Etape 2 : hydrogenation sequentielle de surface.',
          "Etape 3 : desorption de l'ammoniac forme."
        ],
        mechanismES: [
          'Paso 1: adsorcion disociativa de N2 y H2 sobre hierro.',
          'Paso 2: hidrogenacion secuencial de superficie.',
          'Paso 3: desorcion del amoniaco formado.'
        ],
        cascadeFR: "NH3 peut etre oxyde en acide nitrique via le procede Ostwald.",
        cascadeES: 'NH3 puede oxidarse a acido nitrico mediante el proceso Ostwald.'
      });

    case 'Ca|O':
      return createReactionDraft({
        prodSym: 'CaO',
        prodName: 'Chaux Vive / Cal Viva (CaO)',
        c1: 2,
        c2: 1,
        cp: 2
      });

    case 'Ca|Cl':
      return createReactionDraft({
        prodSym: 'CaCl2',
        prodName: 'Chlorure de Calcium / Cloruro de Calcio (CaCl2)'
      });

    case 'Fe|S':
      return createReactionDraft({
        prodSym: 'FeS',
        prodName: 'Sulfure de Fer / Sulfuro de Hierro (FeS)'
      });

    case 'Fe|O':
      return createReactionDraft({
        prodSym: 'Fe2O3',
        prodName: 'Rouille / Oxido de Hierro (Fe2O3)',
        c1: 4,
        c2: 3,
        cp: 2
      });

    case 'Cu|O':
      return createReactionDraft({
        prodSym: 'CuO',
        prodName: 'Oxyde de Cuivre / Oxido de Cobre (CuO)',
        c1: 2,
        c2: 1,
        cp: 2
      });

    case 'S|Zn':
      return createReactionDraft({
        prodSym: 'ZnS',
        prodName: 'Blende / Blenda (ZnS)'
      });

    case 'Li|F':
      return createReactionDraft({
        prodSym: 'LiF',
        prodName: 'Fluorure de Lithium / Fluoruro de Litio (LiF)',
        c1: 2,
        c2: 1,
        cp: 2
      });

    case 'I|K':
      return createReactionDraft({
        prodSym: 'KI',
        prodName: 'Iodure de Potassium / Yoduro de Potasio (KI)',
        c1: 2,
        c2: 1,
        cp: 2
      });

    default:
      return null;
  }
};
