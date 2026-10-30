import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

const createStorage = () => {
  const store = new Map();

  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(String(key), String(value));
    },
    removeItem(key) {
      store.delete(String(key));
    },
    clear() {
      store.clear();
    },
    key(index) {
      return Array.from(store.keys())[Number(index)] ?? null;
    },
    get length() {
      return store.size;
    }
  };
};

const storage = createStorage();
Object.defineProperty(window, 'localStorage', {
  value: storage,
  configurable: true,
  writable: true
});
Object.defineProperty(globalThis, 'localStorage', {
  value: storage,
  configurable: true,
  writable: true
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});

beforeEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});
