import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAIChatResponse } from '../../server/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, cityContext } = req.body || {};
    const customKey = (req.headers['x-gemini-key'] as string) || req.body?.customKey;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    const reply = await getAIChatResponse(message, cityContext, customKey);
    return res.status(200).json({ reply });
  } catch (error: any) {
    console.error('Error in Vercel API /api/ai/chat:', error);
    return res.status(500).json({ error: error.message || 'Failed to process chat message' });
  }
}

