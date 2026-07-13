export class OfflineStorageService {
  public static getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (!item) return null;
    try {
      return JSON.parse(item) as T;
    } catch {
      return item as unknown as T;
    }
  }

  public static setItem<T>(key: string, value: T): void {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, stringValue);
  }

  public static removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
