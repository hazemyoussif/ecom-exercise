import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchBundleData } from './bundleApi';
import { productData } from '../test/fixtures';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('fetchBundleData', () => {
  it('returns a validated catalog response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => productData,
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchBundleData()).resolves.toEqual(productData);
    expect(fetchMock).toHaveBeenCalledWith('/api/data', { signal: undefined });
  });

  it('rejects failed responses and malformed payloads', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    await expect(fetchBundleData()).rejects.toThrow('Unable to load bundle data (503).');

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ products: [] }) }));
    await expect(fetchBundleData()).rejects.toThrow('The bundle data API returned an invalid response.');
  });
});