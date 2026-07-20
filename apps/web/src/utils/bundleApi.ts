import type { Product, ProductData, ProductVariant } from '../types/product';

const DATA_ENDPOINT = import.meta.env.VITE_BUNDLE_DATA_URL ?? '/api/data';

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isProductVariant(value: unknown): value is ProductVariant {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string'
    && typeof value.label === 'string'
    && typeof value.image === 'string';
}

function isProduct(value: unknown): value is Product {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string'
    && typeof value.categoryId === 'string'
    && typeof value.name === 'string'
    && typeof value.basePrice === 'number'
    && Array.isArray(value.variants)
    && value.variants.every(isProductVariant);
}

function isProductData(value: unknown): value is ProductData {
  if (!isRecord(value) || !Array.isArray(value.products) || !isRecord(value.initialCart)) return false;

  return value.products.every(isProduct)
    && Object.values(value.initialCart).every((quantity) => typeof quantity === 'number' && quantity > 0);
}

export async function fetchBundleData(signal?: AbortSignal): Promise<ProductData> {
  const response = await fetch(DATA_ENDPOINT, { signal });

  if (!response.ok) {
    throw new Error(`Unable to load bundle data (${response.status}).`);
  }

  const data: unknown = await response.json();
  if (!isProductData(data)) {
    throw new Error('The bundle data API returned an invalid response.');
  }

  return data;
}