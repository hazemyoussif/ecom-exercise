import { describe, expect, it } from 'vitest';
import { bundleReducer, createBundleState, reconcileBundleState } from './bundleReducer';
import { products } from '../test/fixtures';

describe('bundleReducer', () => {
  it('creates an immutable bundle configuration from catalog defaults and initial cart data', () => {
    const state = createBundleState(products, {
      camera_white: 2,
      sensor_default: 1,
    });

    expect(state.selectedVariants).toEqual({ camera: 'white', sensor: 'default' });
    expect(state.quantities).toEqual({ camera: { white: 2 }, sensor: { default: 1 } });
  });

  it('increments and removes only the targeted variant quantity', () => {
    const initialState = createBundleState(products, { camera_white: 1, camera_black: 2 });
    const incremented = bundleReducer(initialState, {
      type: 'INCREMENT_QUANTITY',
      productId: 'camera',
      variantId: 'white',
    });
    const decremented = bundleReducer(incremented, {
      type: 'DECREMENT_QUANTITY',
      productId: 'camera',
      variantId: 'white',
    });
    const removed = bundleReducer(decremented, {
      type: 'DECREMENT_QUANTITY',
      productId: 'camera',
      variantId: 'white',
    });

    expect(initialState.quantities.camera.white).toBe(1);
    expect(incremented.quantities.camera).toEqual({ white: 2, black: 2 });
    expect(removed.quantities.camera).toEqual({ black: 2 });
  });

  it('clamps navigation and drops stale persisted products and variants', () => {
    const restored = reconcileBundleState({
      activeStep: 99,
      selectedVariants: { camera: 'retired', retired_product: 'default' },
      quantities: { camera: { retired: 5, black: 1 }, retired_product: { default: 3 } },
    }, products);

    expect(restored.activeStep).toBe(3);
    expect(restored.selectedVariants.camera).toBe('black');
    expect(restored.quantities).toEqual({ camera: { black: 1 } });
  });
});