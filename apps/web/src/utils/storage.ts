import type { BundleState } from '../types/bundle';

const STORAGE_KEY = 'bundle-builder:configuration';

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isBundleState(value: unknown): value is BundleState {
  if (!isRecord(value) || typeof value.activeStep !== 'number') return false;
  if (!isRecord(value.selectedVariants) || !isRecord(value.quantities)) return false;

  return Object.values(value.selectedVariants).every((variantId) => typeof variantId === 'string')
    && Object.values(value.quantities).every((variants) => isRecord(variants)
      && Object.values(variants).every((quantity) => typeof quantity === 'number' && quantity > 0));
}

export function loadBundle(): BundleState | null {
  if (typeof window === 'undefined') return null;

  try {
    const storedBundle = window.localStorage.getItem(STORAGE_KEY);
    if (!storedBundle) return null;

    const parsedBundle: unknown = JSON.parse(storedBundle);
    return isBundleState(parsedBundle) ? parsedBundle : null;
  } catch {
    return null;
  }
}

export function saveBundle(bundle: BundleState): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bundle));
}

export function clearBundle(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}