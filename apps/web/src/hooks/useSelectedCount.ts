import { useMemo } from 'react';
import { getSelectedCount } from '../utils/selectors';
import { useBundle } from './useBundle';
import type { CategoryId } from '../types/product';

export function useSelectedCount(categoryId: CategoryId) {
  const { bundle, products } = useBundle();

  return useMemo(
    () => getSelectedCount(bundle, products, categoryId),
    [bundle, categoryId, products],
  );
}