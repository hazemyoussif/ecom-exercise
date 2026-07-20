export type ProductId = string;
export type VariantId = string;
export type CategoryId = string;

export interface ProductVariant {
  id: VariantId;
  label: string;
  colorCode?: string;
  image: string;
}

export interface Product {
  id: ProductId;
  categoryId: CategoryId;
  name: string;
  description?: string;
  link?: string;
  basePrice: number;
  compareAtPrice?: number;
  badge?: string;
  isSubscription?: boolean;
  variants: ProductVariant[];
}

export interface ProductData {
  products: Product[];
  initialCart: Record<string, number>;
}