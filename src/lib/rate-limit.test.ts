import RedisMock from 'ioredis-mock';
import checkRateLimit from './rate-limit';

jest.mock('./redis', () => {
  const client = new RedisMock();
  return { redis: client };
});

describe('checkRateLimit', () => {
  it('should return true if the rate limit is not exceeded', async () => {
    const result = await checkRateLimit('test', 10, 5);
    expect(result).toBe(true);
  });

  it('should return false if the rate limit is exceeded', async () => {
    const result = await checkRateLimit('Exceed Limit', 1, 5);
    expect(result).toBe(true);
    const result2 = await checkRateLimit('Exceed Limit', 1, 5);
    expect(result2).toBe(false);
  });

  it('Should reset the rate limit after the window', async () => {
    const result = await checkRateLimit('Reset Limit', 1, 1);
    expect(result).toBe(true);
    const result2 = await checkRateLimit('Reset Limit', 1, 1);
    expect(result2).toBe(false);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const result3 = await checkRateLimit('Reset Limit', 1, 1);
    expect(result3).toBe(true);
  });
});
