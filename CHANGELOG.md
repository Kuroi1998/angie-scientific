# Changelog

## 2026-07-13 — `fix/stabilization-angie-scientific`

Mission de stabilisation complète menée à partir d'un audit de code. Détails complets dans [`REPAIR_REPORT_ANGIE_SCIENTIFIC.md`](./REPAIR_REPORT_ANGIE_SCIENTIFIC.md).

### Corrections critiques

- **Fix (crash) :** `AtomModelCanvas` plantait (`addColorStop` / couleur CSS non résolue) au survol d'un élément ou à l'ouverture de sa fiche détaillée.
- **Fix (crash) :** `Hybridization` plantait à l'ouverture de l'onglet « États d'hybridation orbitale » pour la même raison.
- **Fix :** toutes les autres utilisations de variables CSS (`var(--...)`) dans des contextes Canvas (`fillStyle`, `strokeStyle`, `shadowColor`, `font`) ont été auditées et corrigées sur 10 composants (rendu couleur/police auparavant silencieusement ignoré par l'API Canvas).
- **Fix :** suppression de `dangerouslySetInnerHTML` pour l'affichage des équations chimiques — remplacé par un rendu JSX sûr basé sur une tokenisation typée de la formule.
- **Fix :** warning `react-hooks/exhaustive-deps` dans `PhaseDiagram` traité sans désactiver la règle.
- **Fix :** débordement horizontal de la page sur petit écran (320-390px) sur plusieurs onglets (grilles CSS, en-tête, champs de saisie).

### Améliorations de stabilité

- Ajout d'un Error Boundary global (recharge l'app) et de limites d'erreur localisées autour du Simulateur de Fusion, du Visualiseur Quantique, du Labo Physique-Chimie, du Labo Virtuel et de la fiche détaillée d'un élément — plus jamais d'écran blanc en cas d'erreur de rendu.
- Prise en charge du ratio de pixels de l'appareil (DPR) et de `prefers-reduced-motion` sur le modèle atomique animé.

### Améliorations d'accessibilité

- Résultats du laboratoire virtuel annoncés via une région `aria-live`.
- Cellules du tableau périodique, slots de réactifs, ligne de quête et suggestions de recherche convertis en éléments `<button>` sémantiques avec libellés accessibles.
- Navigation principale et onglets de la fiche élément structurés en `role="tablist"/"tab"/"tabpanel"` avec navigation clavier (flèches) et focus roving.
- Fiche élément : `role="dialog"`, fermeture au clavier (Échap), gestion du focus (ouverture/fermeture).
- Alternative textuelle (`role="img"` + `aria-label`) sur les 12 canvases scientifiques informatifs.
- Animations décoratives désactivées sous `prefers-reduced-motion: reduce`.

### Ajout de la persistance

- Nouvelle couche de stockage local versionnée (`angieScientific:v1:*`), résiliente aux données corrompues ou de forme invalide, avec migration automatique des anciennes clés non versionnées.
- Persistance étendue : langue, progression des quêtes, historique de recherche, onglet actif, expériences du labo virtuel complétées.
- Bouton de réinitialisation complète des données locales avec confirmation.

### Ajout des tests

- Infrastructure Vitest + React Testing Library (composants) : **84 tests** sur 15 fichiers (utilitaires, hooks, composants).
- Infrastructure Playwright (bout-en-bout) contre le build de production : **10 scénarios** couvrant le parcours critique complet (tableau périodique, fiche élément, visualiseur quantique, simulateur de fusion, labo virtuel, persistance après rechargement, navigation clavier, responsive mobile, absence d'erreurs console/réseau).

### Modifications techniques importantes

- Nouveaux utilitaires : `resolveCssColor`, `resolveCssFont`, `cssVariables`, `canvasSetup`, `chemicalFormula`, `localStorage`, hook `useLocalStorageState`.
- Nouveaux scripts npm : `typecheck`, `test`, `test:watch`, `test:e2e`.
- `vite.config.ts` : port de développement configurable (`PORT` env), configuration Vitest intégrée (environnement `jsdom`).

### Ruptures de compatibilité

- Le champ `equationHTML` du moteur chimique (`ReactionResult`) a été supprimé. Aucun consommateur externe connu ; le composant `FusionCore` a été mis à jour en conséquence.
- Les anciennes clés `localStorage` non versionnées (`angie_sci_lang`, `angie_scientific_quests_completed`, `angie_sci_search_history`) sont migrées automatiquement une seule fois vers le nouveau schéma versionné ; elles ne sont plus lues directement après la migration.
