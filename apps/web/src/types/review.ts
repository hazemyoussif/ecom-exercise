import type { Product, ProductId, VariantId } from './product';

export interface ReviewItem {
  key: string;
  productId: ProductId;
  variantId: VariantId;
  product: Product;
  variantLabel: string;
  variantImage: string;
  quantity: number;
  unitPrice: number;
  compareAtUnitPrice: number;
}

export interface PricingSummary {
  subtotal: number;
  comparePrice: number;
  total: number;
  savings: number;
}