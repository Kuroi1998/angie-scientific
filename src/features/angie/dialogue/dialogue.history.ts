export function pushDialogueHistory(history: string[], dialogueId: string, limit: number): string[] {
  const next = [...history, dialogueId];
  return next.length > limit ? next.slice(next.length - limit) : next;
}

export function lastUsedIndex(dialogueId: string, history: string[]): number {
  for (let index = history.length - 1; index >= 0; index -= 1) {
    if (history[index] === dialogueId) return index;
  }
  return -1;
}

export function wasRecentlyShown(dialogueId: string, history: string[], withinLast = 5): boolean {
  const index = lastUsedIndex(dialogueId, history);
  if (index === -1) return false;
  return history.length - index <= withinLast;
}
