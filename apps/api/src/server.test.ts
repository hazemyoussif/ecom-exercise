import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { Server } from 'node:http';
import { createApp } from './server';

let server: Server;
let baseUrl: string;

beforeEach(async () => {
  server = await new Promise<Server>((resolve) => {
    const nextServer = createApp().listen(0, '127.0.0.1', () => resolve(nextServer));
  });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Unable to determine test server port.');
  baseUrl = `http://127.0.0.1:${address.port}`;
});

afterEach(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

describe('API server', () => {
  it('exposes a health check for deployment monitoring', async () => {
    const response = await fetch(`${baseUrl}/health`);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ status: 'ok' });
  });

  it('serves the product catalog contract', async () => {
    const response = await fetch(`${baseUrl}/api/data`);
    const data = await response.json() as { products: unknown[]; initialCart: Record<string, number> };

    expect(response.status).toBe(200);
    expect(data.products.length).toBeGreaterThan(0);
    expect(Object.keys(data.initialCart).length).toBeGreaterThan(0);
  });
});