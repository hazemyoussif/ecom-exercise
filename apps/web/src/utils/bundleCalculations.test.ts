import { describe, expect, it } from 'vitest';
import { calculatePricing } from './pricing';
import { createReviewItems, getSelectedCount } from './selectors';
import { products } from '../test/fixtures';

const bundle = {
  activeStep: 0,
  selectedVariants: { camera: 'white', sensor: 'default' },
  quantities: { camera: { white: 2, black: 1 }, sensor: { default: 1 } },
};

describe('bundle selectors and pricing', () => {
  it('creates a separate review item for each selected variant', () => {
    const reviewItems = createReviewItems(products, bundle);

    expect(reviewItems).toHaveLength(3);
    expect(reviewItems.map((item) => item.key)).toEqual([
      'camera:white',
      'camera:black',
      'sensor:default',
    ]);
    expect(getSelectedCount(bundle, products, 'cameras')).toBe(1);
  });

  it('derives totals and savings without storing them in bundle state', () => {
    const summary = calculatePricing(createReviewItems(products, bundle));

    expect(summary).toEqual({
      subtotal: 85,
      comparePrice: 100,
      total: 85,
      savings: 15,
    });
  });
});