import { GET as googleCallbackHandler } from '@/app/api/auth/google/callback/route';

// Just test the basic structure without mocking everything
test('returns 400 for missing parameters', async () => {
  const request = new Request('http://localhost:3000/api/auth/google/callback');
  const response = await googleCallbackHandler(request);
  expect(response.status).toBe(400);
});
