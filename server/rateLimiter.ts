import type { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000).unref(); // unref so timer doesn't hold open Node process in tests

export function checkRateLimit(
  clientIp: string,
  maxRequests = 45,
  windowMs = 60 * 1000
): { isAllowed: boolean; remaining: number; resetInSec: number } {
  const now = Date.now();
  let record = rateLimitMap.get(clientIp);

  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + windowMs };
    rateLimitMap.set(clientIp, record);
    return { isAllowed: true, remaining: maxRequests - 1, resetInSec: Math.ceil(windowMs / 1000) };
  }

  if (record.count >= maxRequests) {
    const resetInSec = Math.max(1, Math.ceil((record.resetTime - now) / 1000));
    return { isAllowed: false, remaining: 0, resetInSec };
  }

  record.count += 1;
  const remaining = Math.max(0, maxRequests - record.count);
  const resetInSec = Math.max(1, Math.ceil((record.resetTime - now) / 1000));
  return { isAllowed: true, remaining, resetInSec };
}

export function expressRateLimiter(maxRequests = 45, windowMs = 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.headers['x-forwarded-for']?.toString() || '127.0.0.1';
    const result = checkRateLimit(ip, maxRequests, windowMs);

    res.setHeader('X-RateLimit-Limit', maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', result.remaining.toString());

    if (!result.isAllowed) {
      res.setHeader('Retry-After', result.resetInSec.toString());
      res.status(429).json({
        error: 'Too many requests. Please wait before asking HawaSaathi AI again.',
        retryAfter: result.resetInSec,
      });
      return;
    }

    next();
  };
}

