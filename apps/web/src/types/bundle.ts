import type { ProductId, VariantId } from './product';

export interface BundleState {
  activeStep: number;
  selectedVariants: Record<ProductId, VariantId>;
  quantities: Record<ProductId, Record<VariantId, number>>;
}

export type BundleAction =
  | { type: 'SET_ACTIVE_STEP'; step: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'SELECT_VARIANT'; productId: ProductId; variantId: VariantId }
  | { type: 'INCREMENT_QUANTITY'; productId: ProductId; variantId: VariantId }
  | { type: 'DECREMENT_QUANTITY'; productId: ProductId; variantId: VariantId }
  | { type: 'RESTORE_BUNDLE'; bundle: BundleState }
  | { type: 'RESET_BUNDLE'; bundle: BundleState };