import { expect, test } from '@playwright/test';

test.describe('Test status endpoint', () => {
  test('should return 200', async ({ request }) => {
    const response = await request.get('/api/status');
    expect(response.status()).toBe(200);
  });

  test('should return 200 with deep check', async ({ request }) => {
    const response = await request.get('/api/status?deep=1', {
      headers: { Authorization: `Bearer ${process.env.DEEP_CHECK_TOKEN}` },
    });

    expect(response.status()).toBe(200);
  });

  test('should return 401 with deep check', async ({ request }) => {
    const response = await request.get('/api/status?deep=1');
    expect(response.status()).toBe(401);
  });
});
