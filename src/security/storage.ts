/**
 * Wrapper seguro para LocalStorage com isolamento de namespace,
 * tratamento de exceções (ex: modo anônimo com cookies bloqueados) e expiração.
 */

const STORAGE_PREFIX = 'aurora_sec_v2_';

export const SecureStorage = {
  setItem<T>(key: string, value: T, ttlMinutes?: number): boolean {
    try {
      const payload = {
        data: value,
        timestamp: Date.now(),
        expiresAt: ttlMinutes ? Date.now() + ttlMinutes * 60 * 1000 : null,
      };
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(payload));
      return true;
    } catch (err) {
      console.warn(`[SecureStorage] Falha ao gravar item: ${key}`, err);
      return false;
    }
  },

  getItem<T>(key: string, defaultValue: T): T {
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (!raw) return defaultValue;

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return defaultValue;

      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        this.removeItem(key);
        return defaultValue;
      }

      return (parsed.data as T) ?? defaultValue;
    } catch (err) {
      console.warn(`[SecureStorage] Falha ao recuperar item: ${key}`, err);
      return defaultValue;
    }
  },

  removeItem(key: string): void {
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    } catch (err) {
      console.warn(`[SecureStorage] Falha ao remover item: ${key}`, err);
    }
  },

  clearAll(): void {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(STORAGE_PREFIX))
        .forEach((k) => localStorage.removeItem(k));
    } catch (err) {
      console.warn(`[SecureStorage] Falha ao limpar storage`, err);
    }
  }
};
