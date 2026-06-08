'use client';

import { useEffect, useRef, useState } from 'react';

// localStorage-backed useState. Survives reloads, tab closes, and deploys so
// the user never loses their palpites again. SSR-safe: reads only after mount.
export function usePersistentState<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  // `hydrated` flips true once we've read the stored value on the client. This
  // lets callers avoid writing the default over real data during the first render.
  const [hydrated, setHydrated] = useState(false);
  const keyRef = useRef(key);
  keyRef.current = key;

  // Load once on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      // Corrupted/blocked storage — fall back to the initial value silently.
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on every change, but only after hydration so we don't clobber
  // saved data with the initial default before it's been read.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(keyRef.current, JSON.stringify(value));
    } catch {
      // Storage full or disabled — nothing we can do, keep app working.
    }
  }, [value, hydrated]);

  return [value, setValue, hydrated];
}

// Clear all persisted bolão keys (used by "começar de novo").
export function clearPersistedBolao(keys: string[]) {
  try {
    keys.forEach(k => window.localStorage.removeItem(k));
  } catch {
    // ignore
  }
}
