import { useMemo } from 'react';
import { useBundle } from './useBundle';
import type { ProductId } from '../types/product';

export function useProduct(productId: ProductId) {
  const { products } = useBundle();

  return useMemo(
    () => products.find((product) => product.id === productId),
    [productId, products],
  );
}