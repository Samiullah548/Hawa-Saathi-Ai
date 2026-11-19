import type { VercelRequest, VercelResponse } from '../types';
import { getAIChatResponse } from '../../server/gemini';
import { validateChatInput } from '../../server/validation';
import { checkRateLimit } from '../../server/rateLimiter';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate Limiting
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const limit = checkRateLimit(clientIp, 60, 60000);
  res.setHeader('X-RateLimit-Limit', '60');
  res.setHeader('X-RateLimit-Remaining', limit.remaining.toString());

  if (!limit.isAllowed) {
    res.setHeader('Retry-After', limit.resetInSec.toString());
    return res.status(429).json({
      error: 'Rate limit exceeded. Please wait a moment before sending another message.',
      retryAfter: limit.resetInSec,
    });
  }

  // Validation
  const validation = validateChatInput(req.body);
  if (!validation.isValid || !validation.data) {
    return res.status(400).json({ error: validation.error || 'Message is required' });
  }

  try {
    const customKey = (req.headers['x-gemini-key'] as string) || req.body?.customKey;
    const reply = await getAIChatResponse(
      validation.data.message,
      validation.data.cityContext,
      customKey
    );
    return res.status(200).json({ reply });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal error';
    console.error('Error in Vercel API /api/ai/chat:', msg);
    return res.status(500).json({ error: 'Failed to process chat message. Please try again.' });
  }
}
