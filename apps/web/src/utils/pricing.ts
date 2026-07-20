import type { PricingSummary, ReviewItem } from '../types/review';

export function calculatePricing(reviewItems: ReviewItem[]): PricingSummary {
  const { subtotal, comparePrice } = reviewItems.reduce(
    (totals, item) => ({
      subtotal: totals.subtotal + item.unitPrice * item.quantity,
      comparePrice: totals.comparePrice + item.compareAtUnitPrice * item.quantity,
    }),
    { subtotal: 0, comparePrice: 0 },
  );

  return {
    subtotal,
    comparePrice,
    total: subtotal,
    savings: Math.max(0, comparePrice - subtotal),
  };
}