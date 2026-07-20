export interface Variant {
  id: string;
  label: string;
  colorCode?: string;
  image: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  link?: string;
  basePrice: number;
  compareAtPrice?: number;
  badge?: string;
  isSubscription?: boolean;
  variants: Variant[];
}

export interface Step {
  id: string;
  title: string;
  icon: string;
  label: string;
}

export interface AppData {
  products: Product[];
  initialCart: Record<string, number>;
}

export type CartState = Record<string, number>;

export interface LineItem {
  key: string;
  productId: string;
  variantId: string;
  product: Product;
  variant: Variant;
  qty: number;
}