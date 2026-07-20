import { useCallback, useContext } from 'react';
import { BundleContext } from '../context/BundleContext';
import type { ProductId, VariantId } from '../types/product';

export function useBundle() {
  const context = useContext(BundleContext);

  if (!context) {
    throw new Error('useBundle must be used within BundleProvider.');
  }

  const { products, bundle, initialBundle, isLoading, error, reload, dispatch } = context;

  const increment = useCallback((productId: ProductId, variantId: VariantId) => {
    dispatch({ type: 'INCREMENT_QUANTITY', productId, variantId });
  }, [dispatch]);

  const decrement = useCallback((productId: ProductId, variantId: VariantId) => {
    dispatch({ type: 'DECREMENT_QUANTITY', productId, variantId });
  }, [dispatch]);

  const selectVariant = useCallback((productId: ProductId, variantId: VariantId) => {
    dispatch({ type: 'SELECT_VARIANT', productId, variantId });
  }, [dispatch]);

  const nextStep = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' });
  }, [dispatch]);

  const previousStep = useCallback(() => {
    dispatch({ type: 'PREVIOUS_STEP' });
  }, [dispatch]);

  const setActiveStep = useCallback((step: number) => {
    dispatch({ type: 'SET_ACTIVE_STEP', step });
  }, [dispatch]);

  const restoreBundle = useCallback((restoredBundle: typeof bundle) => {
    dispatch({ type: 'RESTORE_BUNDLE', bundle: restoredBundle });
  }, [dispatch]);

  const resetBundle = useCallback(() => {
    dispatch({ type: 'RESET_BUNDLE', bundle: initialBundle });
  }, [dispatch, initialBundle]);

  return {
    products,
    bundle,
    isLoading,
    error,
    reload,
    dispatch,
    increment,
    decrement,
    selectVariant,
    nextStep,
    previousStep,
    setActiveStep,
    restoreBundle,
    resetBundle,
  };
}