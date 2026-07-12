<div align="center">

<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
<img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
<img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
<img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License"/>
<img src="https://img.shields.io/badge/Tests-10%20passing-success?style=for-the-badge&logo=vitest" alt="Tests"/>

<br/><br/>

# ⚗️ AngieScientific — Tableau Périodique Interactif

### *Application Web Bilingue de Chimie Futuriste*

**[🇫🇷 Français](#français) · [🇪🇸 Español](#español)**

<br/>

</div>

---

## 🇫🇷 Français {#français}

### 🚀 Présentation

**AngieScientific** est une application web interactive et bilingue (Français / Espagnol) dédiée à l'enseignement de la chimie moderne. Elle combine le tableau périodique classique avec des simulations avancées de chimie quantique, de liaisons moléculaires, de laboratoire virtuel et d'un système de quêtes gamifié — le tout dans une interface ultra-futuriste à thème cyberpunk/néon.

<div align="center">

| Module | Description |
|---|---|
| 🔬 **Tableau Périodique** | 118 éléments avec fiches détaillées interactives |
| ⚗️ **Simulateur de Fusion** | Prédiction de réactions + stoichiométrie avancée |
| ⚛️ **Chimie Quantique** | Orbitales 3D, principe de Heisenberg, spectroscopie |
| 🧪 **Physico-Chimie** | Diagrammes de phases, gaz réels, électrochimie |
| 🏭 **Laboratoire Virtuel** | Expériences animées avec dials et alertes de sécurité |
| 🏆 **Quêtes & Défis** | Progression gamifiée avec badges et XP |

</div>

---

### ✨ Fonctionnalités Principales

#### 🔬 Tableau Périodique Interactif
- Affichage complet des **118 éléments** avec code couleur par catégorie
- **Fiches détaillées** : numéro atomique, masse, électronégativité, configuration électronique, états d'oxydation
- **Onglet Liaisons** : Visualiseur Lewis 2D + Géométrie VSEPR 3D sur canvas HTML5
- Bouton **"Ajouter à la Fusion"** pour charger un élément directement dans le simulateur

#### ⚗️ Simulateur de Réactions Chimiques
- **Moteur de prédiction** de réactions avec ΔH, ΔS, ΔG (spontanéité)
- **Équilibrage automatique** avec coefficients stœchiométriques
- **Calculs stœchiométriques** : masse, moles, rendement expérimental, réactif limitant
- **Mécanismes réactionnels** étape par étape avec intermédiaires et rôle des catalyseurs
- **Réactions en cascade** (ex : Synthèse de l'eau → Sodium + Eau)
- **Diagramme énergétique** de la coordonnée réactionnelle

#### ⚛️ Chimie Quantique
- Visualisation 3D des **orbitales atomiques** (s, p, d, f) avec fonctions d'onde
- **Principe d'incertitude de Heisenberg** avec simulation interactive
- **Niveaux d'énergie** et transitions électroniques (diagramme de Jablonski)
- **Spectroscopie** : UV-Vis, IR, NMR, spectrométrie de masse

#### 🧲 Liaisons Chimiques (Moteur VSEPR)
- Calcul automatique de la **géométrie moléculaire** (Linéaire, Angulaire, Tétraédrique, Trigonale plane, etc.)
- **Hybridation** prédite (sp, sp², sp³, sp³d, sp³d²)
- **Type de liaison** : Ionique, Covalente Polaire/Apolaire (différence d'électronégativité)
- **Longueurs et énergies de liaisons** en pm et kJ/mol

#### 🏭 Laboratoire Virtuel
- **3 expériences animées** sur canvas HTML5 :
  - 💥 Combustion explosive H₂ + O₂ → H₂O
  - 🧂 Fusion Na dans Cl₂ → NaCl (sel de table)
  - 🩷 Titrage Acide-Base avec indicateur phénolphtaléine (virage rose)
- **Dials interactifs** : Température (K), Pression (atm), Masses (g)
- **Alertes de sécurité dynamiques** (Corrosif, Toxique, Inflammable, Explosif)

#### 🏆 Système de Quêtes & Gamification
- **5 quêtes progressives** : Débutant → Intermédiaire → Avancé
- **Points d'expérience (XP)** cumulatifs avec persistance `localStorage`
- **4 badges** à débloquer : Apprenti Chimiste, Maître des Équilibres, Quantum Wizard, Commandeur Scientifique

---

### 🛠️ Technologies

```
React 18 + TypeScript 5      →  Framework UI + typage statique
Vite 8                       →  Bundler ultra-rapide
HTML5 Canvas API             →  Animations scientifiques (orbitales, beaker, VSEPR)
Lucide React                 →  Icônes modernes
Vitest                       →  Tests unitaires (10 tests, 2 suites)
localStorage                 →  Persistance des préférences et quêtes
CSS Custom Properties        →  Thème cyberpunk/néon dynamique
```

---

### ⚙️ Installation & Démarrage

```bash
# 1. Cloner le dépôt
git clone https://github.com/Kuroi1998/angie-scientific.git
cd angie-scientific

# 2. Installer les dépendances
npm install

# 3. Démarrer le serveur de développement
npm run dev

# 4. Ouvrir dans le navigateur
# → http://localhost:5173/
```

### 📦 Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement avec HMR |
| `npm run build` | Build de production optimisé |
| `npm run preview` | Prévisualiser le build de production |
| `npx vitest run` | Lancer les 10 tests unitaires |

---

### 🧪 Tests Unitaires

```
✓ src/engines/chemistryEngine.test.ts  (5 tests)
✓ src/engines/bondingEngine.test.ts    (5 tests)

Test Files: 2 passed | Tests: 10 passed
```

**Couverture :**
- Fonctions d'onde quantiques (formes s, p, d)
- Spontanéité des réactions (ΔG de Gibbs)
- Stœchiométrie et masses molaires
- Géométries VSEPR (Linéaire, Coudée, Tétraédrique)
- Types de liaisons chimiques (Ionique, Covalente Polaire/Apolaire)

---

### 📁 Architecture du Projet

```
src/
├── components/
│   ├── PeriodicTable/          # Grille du tableau périodique
│   ├── ElementCard/            # Fiche détaillée + LewisVisualizer
│   ├── ReactionSimulator/      # FusionCore + Stoichiometry
│   ├── QuantumVisualizer/      # Orbitales + spectroscopie + Heisenberg
│   ├── PhysicsChemistry/       # Diagrammes de phases + gaz réels
│   ├── VirtualLab/             # Laboratoire animé
│   └── Gamification/           # QuestSystem + badges XP
├── engines/
│   ├── chemistryEngine.ts      # Moteur de réactions + stœchiométrie
│   ├── bondingEngine.ts        # Calculs VSEPR + hybridation
│   └── data/
│       └── elements.json       # Base de données 118 éléments
├── hooks/
│   └── useLanguage.ts          # Internationalisation FR/ES
└── styles/
    ├── theme.css               # Variables CSS + thème néon
    └── animations.css          # Animations cyberpunk
```

---

### 🌐 Bilingue FR / ES

L'interface est entièrement traduite via un système de clés de traduction. La préférence de langue est persistée dans `localStorage`.

```typescript
// Exemple d'utilisation
const { language, t } = useLanguage();
// t('nav.table') → "Tableau Périodique" ou "Tabla Periódica"
```

---

### 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :
1. Fork le dépôt
2. Créer une branche : `git checkout -b feature/ma-fonctionnalite`
3. Committer : `git commit -m 'feat: ajouter ma fonctionnalité'`
4. Pusher : `git push origin feature/ma-fonctionnalite`
5. Ouvrir une Pull Request

---

### 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

---
---

## 🇪🇸 Español {#español}

### 🚀 Presentación

**AngieScientific** es una aplicación web interactiva y bilingüe (Francés / Español) dedicada a la enseñanza de la química moderna. Combina la tabla periódica clásica con simulaciones avanzadas de química cuántica, enlaces moleculares, laboratorio virtual y un sistema de misiones gamificado — todo en una interfaz ultra-futurista con temática cyberpunk/neón.

<div align="center">

| Módulo | Descripción |
|---|---|
| 🔬 **Tabla Periódica** | 118 elementos con fichas detalladas interactivas |
| ⚗️ **Simulador de Fusión** | Predicción de reacciones + estequiometría avanzada |
| ⚛️ **Química Cuántica** | Orbitales 3D, principio de Heisenberg, espectroscopía |
| 🧪 **Físico-Química** | Diagramas de fase, gases reales, electroquímica |
| 🏭 **Laboratorio Virtual** | Experimentos animados con diales y alertas de seguridad |
| 🏆 **Misiones & Desafíos** | Progresión gamificada con insignias y XP |

</div>

---

### ✨ Funcionalidades Principales

#### 🔬 Tabla Periódica Interactiva
- Visualización completa de los **118 elementos** con código de colores por categoría
- **Fichas detalladas**: número atómico, masa, electronegatividad, configuración electrónica, estados de oxidación
- **Pestaña de enlaces**: Visualizador Lewis 2D + Geometría VSEPR 3D en canvas HTML5
- Botón **"Añadir a la Fusión"** para cargar un elemento directamente en el simulador

#### ⚗️ Simulador de Reacciones Químicas
- **Motor de predicción** de reacciones con ΔH, ΔS, ΔG (espontaneidad)
- **Balanceo automático** con coeficientes estequiométricos
- **Cálculos estequiométricos**: masa, moles, rendimiento experimental, reactivo limitante
- **Mecanismos de reacción** paso a paso con intermediarios y papel de los catalizadores
- **Reacciones en cascada** (ej: Síntesis del agua → Sodio + Agua)
- **Diagrama energético** de la coordenada de reacción

#### ⚛️ Química Cuántica
- Visualización 3D de **orbitales atómicos** (s, p, d, f) con funciones de onda
- **Principio de incertidumbre de Heisenberg** con simulación interactiva
- **Niveles de energía** y transiciones electrónicas (diagrama de Jablonski)
- **Espectroscopía**: UV-Vis, IR, NMR, espectrometría de masas

#### 🧲 Enlace Químico (Motor VSEPR)
- Cálculo automático de la **geometría molecular** (Lineal, Angular, Tetraédrica, Trigonal plana, etc.)
- **Hibridación** predicha (sp, sp², sp³, sp³d, sp³d²)
- **Tipo de enlace**: Iónico, Covalente Polar/Apolar (diferencia de electronegatividad)
- **Longitudes y energías de enlace** en pm y kJ/mol

#### 🏭 Laboratorio Virtual
- **3 experimentos animados** en canvas HTML5:
  - 💥 Combustión explosiva H₂ + O₂ → H₂O
  - 🧂 Fusión de Na en Cl₂ → NaCl (sal de mesa)
  - 🩷 Titulación Ácido-Base con indicador fenolftaleína (viraje rosa)
- **Diales interactivos**: Temperatura (K), Presión (atm), Masas (g)
- **Alertas de seguridad dinámicas** (Corrosivo, Tóxico, Inflamable, Explosivo)

#### 🏆 Sistema de Misiones y Gamificación
- **5 misiones progresivas**: Principiante → Intermedio → Avanzado
- **Puntos de experiencia (XP)** acumulativos con persistencia `localStorage`
- **4 insignias** para desbloquear: Aprendiz Químico, Maestro de Equilibrios, Mago Cuántico, Comandante Científico

---

### 🛠️ Tecnologías

```
React 18 + TypeScript 5      →  Framework UI + tipado estático
Vite 8                       →  Bundler ultrarrápido
HTML5 Canvas API             →  Animaciones científicas (orbitales, beaker, VSEPR)
Lucide React                 →  Iconos modernos
Vitest                       →  Tests unitarios (10 tests, 2 suites)
localStorage                 →  Persistencia de preferencias y misiones
CSS Custom Properties        →  Tema cyberpunk/neón dinámico
```

---

### ⚙️ Instalación & Inicio

```bash
# 1. Clonar el repositorio
git clone https://github.com/Kuroi1998/angie-scientific.git
cd angie-scientific

# 2. Instalar las dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev

# 4. Abrir en el navegador
# → http://localhost:5173/
```

### 📦 Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción optimizado |
| `npm run preview` | Previsualizar el build de producción |
| `npx vitest run` | Ejecutar los 10 tests unitarios |

---

### 🧪 Tests Unitarios

```
✓ src/engines/chemistryEngine.test.ts  (5 tests)
✓ src/engines/bondingEngine.test.ts    (5 tests)

Test Files: 2 passed | Tests: 10 passed
```

**Cobertura:**
- Funciones de onda cuánticas (formas s, p, d)
- Espontaneidad de reacciones (ΔG de Gibbs)
- Estequiometría y masas molares
- Geometrías VSEPR (Lineal, Angular, Tetraédrica)
- Tipos de enlace químico (Iónico, Covalente Polar/Apolar)

---

### 📁 Arquitectura del Proyecto

```
src/
├── components/
│   ├── PeriodicTable/          # Cuadrícula de la tabla periódica
│   ├── ElementCard/            # Ficha detallada + LewisVisualizer
│   ├── ReactionSimulator/      # FusionCore + Stoichiometry
│   ├── QuantumVisualizer/      # Orbitales + espectroscopía + Heisenberg
│   ├── PhysicsChemistry/       # Diagramas de fase + gases reales
│   ├── VirtualLab/             # Laboratorio animado
│   └── Gamification/           # QuestSystem + insignias XP
├── engines/
│   ├── chemistryEngine.ts      # Motor de reacciones + estequiometría
│   ├── bondingEngine.ts        # Cálculos VSEPR + hibridación
│   └── data/
│       └── elements.json       # Base de datos 118 elementos
├── hooks/
│   └── useLanguage.ts          # Internacionalización FR/ES
└── styles/
    ├── theme.css               # Variables CSS + tema neón
    └── animations.css          # Animaciones cyberpunk
```

---

### 🌐 Bilingüe FR / ES

La interfaz está completamente traducida mediante un sistema de claves de traducción. La preferencia de idioma se persiste en `localStorage`.

---

### 🤝 Contribución

¡Las contribuciones son bienvenidas! Para contribuir:
1. Haz un fork del repositorio
2. Crea una rama: `git checkout -b feature/mi-funcionalidad`
3. Commitea: `git commit -m 'feat: añadir mi funcionalidad'`
4. Haz push: `git push origin feature/mi-funcionalidad`
5. Abre un Pull Request

---

### 📄 Licencia

Este proyecto está bajo licencia **MIT**. Ver el archivo [LICENSE](./LICENSE) para más detalles.

---

<div align="center">

**Fait avec ❤️ pour la science / Hecho con ❤️ para la ciencia**

*AngieScientific © 2026 — Kuroi1998*

</div>
