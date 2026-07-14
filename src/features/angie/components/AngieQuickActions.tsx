import React from 'react';

export interface QuickAction {
  intentId: string;
  label: string;
}

interface AngieQuickActionsProps {
  actions: QuickAction[];
  onSelect: (intentId: string, label: string) => void;
}

export const AngieQuickActions: React.FC<AngieQuickActionsProps> = ({ actions, onSelect }) => (
  <div className="angie-quick-actions" role="group">
    {actions.map((action) => (
      <button
        key={action.intentId}
        className="angie-quick-action"
        onClick={() => onSelect(action.intentId, action.label)}
        type="button"
      >
        {action.label}
      </button>
    ))}
  </div>
);
