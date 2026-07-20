import type { BundleAction, BundleState } from '../types/bundle';
import type { Product, ProductId, VariantId } from '../types/product';

export const BUNDLE_STEP_COUNT = 4;

function cloneBundle(bundle: BundleState): BundleState {
  return {
    activeStep: bundle.activeStep,
    selectedVariants: { ...bundle.selectedVariants },
    quantities: Object.fromEntries(
      Object.entries(bundle.quantities).map(([productId, variants]) => [productId, { ...variants }]),
    ),
  };
}

export function createBundleState(products: Product[], initialCart: Record<string, number> = {}): BundleState {
  const selectedVariants = products.reduce<Record<ProductId, VariantId>>((selection, product) => {
    const [firstVariant] = product.variants;
    if (firstVariant) selection[product.id] = firstVariant.id;
    return selection;
  }, {});

  const quantities = products.reduce<BundleState['quantities']>((nextQuantities, product) => {
    const variantQuantities = product.variants.reduce<Record<VariantId, number>>((variants, variant) => {
      const quantity = initialCart[`${product.id}_${variant.id}`] ?? 0;
      if (quantity > 0) variants[variant.id] = quantity;
      return variants;
    }, {});

    if (Object.keys(variantQuantities).length > 0) {
      nextQuantities[product.id] = variantQuantities;
      selectedVariants[product.id] = Object.keys(variantQuantities)[0];
    }

    return nextQuantities;
  }, {});

  return { activeStep: 0, selectedVariants, quantities };
}

export function reconcileBundleState(bundle: BundleState, products: Product[]): BundleState {
  const defaults = createBundleState(products);
  const quantities: BundleState['quantities'] = {};
  const selectedVariants = { ...defaults.selectedVariants };

  products.forEach((product) => {
    const validVariantIds = new Set(product.variants.map((variant) => variant.id));
    const savedQuantities = bundle.quantities[product.id] ?? {};
    const productQuantities = Object.entries(savedQuantities).reduce<Record<VariantId, number>>((nextQuantities, [variantId, quantity]) => {
      if (validVariantIds.has(variantId) && quantity > 0) nextQuantities[variantId] = quantity;
      return nextQuantities;
    }, {});

    if (Object.keys(productQuantities).length > 0) quantities[product.id] = productQuantities;

    const savedVariant = bundle.selectedVariants[product.id];
    if (savedVariant && validVariantIds.has(savedVariant)) {
      selectedVariants[product.id] = savedVariant;
    } else if (Object.keys(productQuantities)[0]) {
      selectedVariants[product.id] = Object.keys(productQuantities)[0];
    }
  });

  return {
    activeStep: Math.min(Math.max(bundle.activeStep, 0), BUNDLE_STEP_COUNT - 1),
    selectedVariants,
    quantities,
  };
}

function updateQuantity(
  state: BundleState,
  productId: ProductId,
  variantId: VariantId,
  quantityChange: number,
): BundleState {
  const currentQuantity = state.quantities[productId]?.[variantId] ?? 0;
  const nextQuantity = Math.max(0, currentQuantity + quantityChange);
  const productQuantities = { ...(state.quantities[productId] ?? {}) };

  if (nextQuantity === 0) {
    delete productQuantities[variantId];
  } else {
    productQuantities[variantId] = nextQuantity;
  }

  const quantities = { ...state.quantities };
  if (Object.keys(productQuantities).length === 0) {
    delete quantities[productId];
  } else {
    quantities[productId] = productQuantities;
  }

  return { ...state, quantities };
}

export function bundleReducer(state: BundleState, action: BundleAction): BundleState {
  switch (action.type) {
    case 'SET_ACTIVE_STEP':
      return { ...state, activeStep: Math.min(Math.max(action.step, 0), BUNDLE_STEP_COUNT - 1) };

    case 'NEXT_STEP':
      return { ...state, activeStep: Math.min(state.activeStep + 1, BUNDLE_STEP_COUNT - 1) };

    case 'PREVIOUS_STEP':
      return { ...state, activeStep: Math.max(state.activeStep - 1, 0) };

    case 'SELECT_VARIANT':
      return {
        ...state,
        selectedVariants: { ...state.selectedVariants, [action.productId]: action.variantId },
      };

    case 'INCREMENT_QUANTITY':
      return updateQuantity(state, action.productId, action.variantId, 1);

    case 'DECREMENT_QUANTITY':
      return updateQuantity(state, action.productId, action.variantId, -1);

    case 'RESTORE_BUNDLE':
    case 'RESET_BUNDLE':
      return cloneBundle(action.bundle);

    default:
      return state;
  }
}