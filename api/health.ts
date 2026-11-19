import type { VercelRequest, VercelResponse } from './types';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    status: 'healthy',
    service: 'HawaSaathi AI Serverless Engine',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'),
    geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    timestamp: new Date().toISOString(),
  });
}

