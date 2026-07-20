import { useCallback } from 'react';
import { clearBundle, loadBundle, saveBundle } from '../utils/storage';
import { useBundle } from './useBundle';

export function usePersistence() {
  const { bundle, resetBundle, restoreBundle } = useBundle();

  const save = useCallback(() => {
    saveBundle(bundle);
  }, [bundle]);

  const restore = useCallback(() => {
    const storedBundle = loadBundle();
    if (!storedBundle) return false;

    restoreBundle(storedBundle);
    return true;
  }, [restoreBundle]);

  const clear = useCallback(() => {
    clearBundle();
    resetBundle();
  }, [resetBundle]);

  return { save, restore, clear };
}