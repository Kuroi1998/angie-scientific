export class ProgressionService {
  public static calculateLevel(xp: number): number {
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  }

  public static getNextLevelXP(currentLevel: number): number {
    return Math.pow(currentLevel, 2) * 100;
  }
}
