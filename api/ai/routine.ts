import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAIRoutinePlan } from '../../server/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const customKey = (req.headers['x-gemini-key'] as string) || req.body?.customKey;
    const routine = await getAIRoutinePlan(req.body, customKey);
    return res.status(200).json(routine);
  } catch (error: any) {
    console.error('Error in Vercel API /api/ai/routine:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate routine' });
  }
}
