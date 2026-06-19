import { useEffect, useCallback, useSyncExternalStore } from 'react';

const storageListeners = new Map<string, Set<(value: string | null) => void>>();

function emitStorageChange(key: string, value: string | null) {
  const listeners = storageListeners.get(key);
  if (listeners) {
    listeners.forEach((listener) => listener(value));
  }
}

function subscribeToStorage(key: string, listener: (value: string | null) => void) {
  if (!storageListeners.has(key)) {
    storageListeners.set(key, new Set());
  }
  storageListeners.get(key)!.add(listener);
  return () => {
    storageListeners.get(key)?.delete(listener);
  };
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined') return JSON.stringify(initialValue);
    return window.localStorage.getItem(key);
  }, [key, initialValue]);

  const getServerSnapshot = useCallback(() => JSON.stringify(initialValue), [initialValue]);

  const storedString = useSyncExternalStore(
    (callback) => subscribeToStorage(key, callback),
    getSnapshot,
    getServerSnapshot
  );

  const storedValue = (() => {
    if (storedString === null) return initialValue;
    try {
      return JSON.parse(storedString) as T;
    } catch {
      return initialValue;
    }
  })();

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const prev = storedValue;
        const valueToStore = value instanceof Function ? value(prev) : value;
        const serialized = JSON.stringify(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, serialized);
        }
        emitStorageChange(key, serialized);
      } catch (error) {
        console.warn(`Erro ao salvar ${key} no localStorage:`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      emitStorageChange(key, null);
    } catch (error) {
      console.warn(`Erro ao remover ${key} do localStorage:`, error);
    }
  }, [key]);

  // Mantém sincronia com outras abas/janelas
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        emitStorageChange(key, event.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue] as const;
}
