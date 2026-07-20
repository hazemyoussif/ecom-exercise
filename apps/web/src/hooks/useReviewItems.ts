import { useMemo } from 'react';
import { createReviewItems } from '../utils/selectors';
import { useBundle } from './useBundle';

export function useReviewItems() {
  const { products, bundle } = useBundle();

  return useMemo(
    () => createReviewItems(products, bundle),
    [bundle, products],
  );
}