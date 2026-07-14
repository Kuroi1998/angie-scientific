import React from 'react';

export const PeriodicTableLayout = React.lazy(() =>
  import('../components/PeriodicTable/PeriodicTableLayout').then((module) => ({
    default: module.PeriodicTableLayout,
  })),
);

export const FusionCore = React.lazy(() =>
  import('../components/ReactionSimulator/FusionCore').then((module) => ({
    default: module.FusionCore,
  })),
);

export const QuantumVisualizer = React.lazy(() =>
  import('../features/quantum-visualizer/components/QuantumVisualizerHub').then((module) => ({
    default: module.QuantumVisualizerHub,
  }))
);

export const PhysChemLab = React.lazy(() =>
  import('../features/physics-chemistry-lab/components/PhysChemHub').then((module) => ({
    default: module.PhysChemHub,
  }))
);

export const VirtualLab = React.lazy(() =>
  import('../components/VirtualLab/VirtualLab').then((module) => ({
    default: module.VirtualLab,
  })),
);

export const DiscoveryAlbum = React.lazy(() =>
  import('../components/Gamification/DiscoveryAlbum').then((module) => ({
    default: module.DiscoveryAlbum,
  })),
);

export const UserCenter = React.lazy(() =>
  import('../components/UserCenter/UserCenter').then((module) => ({
    default: module.UserCenter,
  })),
);

export const QuizMode = React.lazy(() =>
  import('../components/Gamification/QuizMode').then((module) => ({
    default: module.QuizMode,
  })),
);

export const DesignSystemDemo = React.lazy(() =>
  import('../design-system/DesignSystemDemo').then((module) => ({
    default: module.DesignSystemDemo,
  })),
);
