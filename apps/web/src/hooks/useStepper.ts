import { useCallback } from 'react';
import { getQuantity } from '../utils/selectors';
import { useBundle } from './useBundle';
import { useVariant } from './useVariant';
import type { ProductId, VariantId } from '../types/product';

export function useStepper(productId: ProductId, variantId?: VariantId) {
  const { bundle, increment, decrement } = useBundle();
  const { selectedVariantId } = useVariant(productId);
  const activeVariantId = variantId ?? selectedVariantId;
  const quantity = activeVariantId ? getQuantity(bundle, productId, activeVariantId) : 0;

  const increase = useCallback(() => {
    if (activeVariantId) increment(productId, activeVariantId);
  }, [activeVariantId, increment, productId]);

  const decrease = useCallback(() => {
    if (activeVariantId) decrement(productId, activeVariantId);
  }, [activeVariantId, decrement, productId]);

  return {
    quantity,
    increment: increase,
    decrement: decrease,
    canDecrement: quantity > 0,
  };
}