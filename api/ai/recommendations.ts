import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAISafetyRecommendations } from '../../server/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const customKey = (req.headers['x-gemini-key'] as string) || req.body?.customKey;
    const recommendations = await getAISafetyRecommendations(req.body, customKey);
    return res.status(200).json(recommendations);
  } catch (error: any) {
    console.error('Error in Vercel API /api/ai/recommendations:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate recommendations' });
  }
}
