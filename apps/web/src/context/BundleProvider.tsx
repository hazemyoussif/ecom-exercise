import { useCallback, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { BundleContext } from './BundleContext';
import { bundleReducer, createBundleState, reconcileBundleState } from './bundleReducer';
import { fetchBundleData } from '../utils/bundleApi';
import { loadBundle } from '../utils/storage';
import type { BundleState } from '../types/bundle';
import type { ProductData } from '../types/product';

const EMPTY_CATALOG: ProductData = { products: [], initialCart: {} };
const EMPTY_BUNDLE = createBundleState([]);

export function BundleProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<ProductData>(EMPTY_CATALOG);
  const [initialBundle, setInitialBundle] = useState<BundleState>(EMPTY_BUNDLE);
  const [bundle, dispatch] = useReducer(bundleReducer, EMPTY_BUNDLE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async (signal?: AbortSignal) => {
    if (!signal) {
      setIsLoading(true);
      setError(null);
    }

    try {
      const nextCatalog = await fetchBundleData(signal);
      const savedBundle = loadBundle();
      const nextInitialBundle = savedBundle
        ? reconcileBundleState(savedBundle, nextCatalog.products)
        : createBundleState(nextCatalog.products, nextCatalog.initialCart);

      setCatalog(nextCatalog);
      setInitialBundle(nextInitialBundle);
      dispatch({ type: 'RESTORE_BUNDLE', bundle: nextInitialBundle });
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
      setError(requestError instanceof Error ? requestError.message : 'Unable to load bundle data.');
    } finally {
      if (!signal?.aborted) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => { void reload(controller.signal); });
    return () => controller.abort();
  }, [reload]);

  const value = useMemo(
    () => ({
      products: catalog.products,
      bundle,
      initialBundle,
      isLoading,
      error,
      reload: () => reload(),
      dispatch,
    }),
    [bundle, catalog.products, error, initialBundle, isLoading, reload],
  );

  return <BundleContext.Provider value={value}>{children}</BundleContext.Provider>;
}