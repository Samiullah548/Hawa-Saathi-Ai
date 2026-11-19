import { describe, it, expect } from 'vitest';
import { checkRateLimit } from '../../server/rateLimiter';

describe('Server Rate Limiting Engine', () => {
  it('allows requests within the configured threshold', () => {
    const testIp = '192.168.1.101';
    const limit = 5;
    const windowMs = 5000;

    for (let i = 0; i < limit; i++) {
      const res = checkRateLimit(testIp, limit, windowMs);
      expect(res.isAllowed).toBe(true);
      expect(res.remaining).toBe(limit - 1 - i);
    }
  });

  it('blocks subsequent requests once the threshold is exceeded with 0 remaining', () => {
    const testIp = '10.0.0.99';
    const limit = 3;
    const windowMs = 5000;

    // First 3 requests permitted
    checkRateLimit(testIp, limit, windowMs);
    checkRateLimit(testIp, limit, windowMs);
    checkRateLimit(testIp, limit, windowMs);

    // 4th request blocked
    const blockedRes = checkRateLimit(testIp, limit, windowMs);
    expect(blockedRes.isAllowed).toBe(false);
    expect(blockedRes.remaining).toBe(0);
    expect(blockedRes.resetInSec).toBeGreaterThan(0);
  });

  it('differentiates different IP addresses independently', () => {
    const ipA = '172.16.0.1';
    const ipB = '172.16.0.2';
    const limit = 2;

    checkRateLimit(ipA, limit, 5000);
    checkRateLimit(ipA, limit, 5000);
    expect(checkRateLimit(ipA, limit, 5000).isAllowed).toBe(false);

    // ipB should still be allowed
    expect(checkRateLimit(ipB, limit, 5000).isAllowed).toBe(true);
  });
});
