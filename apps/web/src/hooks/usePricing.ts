import { useMemo } from 'react';
import { calculatePricing } from '../utils/pricing';
import type { ReviewItem } from '../types/review';

export function usePricing(reviewItems: ReviewItem[]) {
  return useMemo(
    () => calculatePricing(reviewItems),
    [reviewItems],
  );
}