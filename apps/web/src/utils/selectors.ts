import type { BundleState } from '../types/bundle';
import type { CategoryId, Product, ProductId, ProductVariant, VariantId } from '../types/product';
import type { ReviewItem } from '../types/review';

export function getProduct(products: Product[], productId: ProductId): Product | undefined {
  return products.find((product) => product.id === productId);
}

export function getVariant(product: Product | undefined, variantId: VariantId | undefined): ProductVariant | undefined {
  return product?.variants.find((variant) => variant.id === variantId);
}

export function getQuantity(bundle: BundleState, productId: ProductId, variantId: VariantId): number {
  return bundle.quantities[productId]?.[variantId] ?? 0;
}

export function getSelectedCount(bundle: BundleState, products: Product[], categoryId: CategoryId): number {
  return products.reduce((count, product) => {
    if (product.categoryId !== categoryId) return count;

    const hasQuantity = Object.values(bundle.quantities[product.id] ?? {}).some((quantity) => quantity > 0);
    return hasQuantity ? count + 1 : count;
  }, 0);
}

export function createReviewItems(products: Product[], bundle: BundleState): ReviewItem[] {
  return products.flatMap((product) => {
    const productQuantities = bundle.quantities[product.id] ?? {};

    return Object.entries(productQuantities).flatMap(([variantId, quantity]) => {
      if (quantity <= 0) return [];

      const variant = getVariant(product, variantId);
      if (!variant) return [];

      return [{
        key: `${product.id}:${variant.id}`,
        productId: product.id,
        variantId: variant.id,
        product,
        variantLabel: variant.label,
        variantImage: variant.image,
        quantity,
        unitPrice: product.basePrice,
        compareAtUnitPrice: product.compareAtPrice ?? product.basePrice,
      }];
    });
  });
}