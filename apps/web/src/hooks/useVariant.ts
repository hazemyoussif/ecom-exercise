import { useCallback, useMemo } from 'react';
import { getQuantity, getVariant } from '../utils/selectors';
import { useBundle } from './useBundle';
import { useProduct } from './useProduct';
import type { ProductId } from '../types/product';

export function useVariant(productId: ProductId) {
  const product = useProduct(productId);
  const { bundle, selectVariant } = useBundle();
  const selectedVariantId = bundle.selectedVariants[productId] ?? product?.variants[0]?.id;

  const selectedVariant = useMemo(
    () => getVariant(product, selectedVariantId),
    [product, selectedVariantId],
  );
  const quantity = selectedVariantId ? getQuantity(bundle, productId, selectedVariantId) : 0;

  const changeVariant = useCallback((variantId: string) => {
    selectVariant(productId, variantId);
  }, [productId, selectVariant]);

  return {
    selectedVariant,
    selectedVariantId,
    variants: product?.variants ?? [],
    quantity,
    changeVariant,
  };
}