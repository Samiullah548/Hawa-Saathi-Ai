import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  getAISafetyRecommendations,
  getAIRoutinePlan,
  getAIChatResponse,
} from './gemini';
import {
  validateRecommendationsInput,
  validateRoutineInput,
  validateChatInput,
} from './validation';
import { expressRateLimiter } from './rateLimiter';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security Headers Middleware
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(self)');
  next();
});

// Hardened CORS
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-gemini-key', 'Authorization'],
    maxAge: 86400,
  })
);

app.use(express.json({ limit: '100kb' })); // Mitigate payload flood attacks

// Health Check (Lightweight, unthrottled)
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'HawaSaathi AI Backend Service',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'),
    geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    timestamp: new Date().toISOString(),
  });
});

// Apply rate limiting to AI computational endpoints (60 requests / minute)
app.use('/api/ai', expressRateLimiter(60, 60 * 1000));

// AI Safety Recommendations
app.post('/api/ai/recommendations', async (req: Request, res: Response) => {
  try {
    const validation = validateRecommendationsInput(req.body);
    if (!validation.isValid || !validation.data) {
      res.status(400).json({ error: validation.error || 'Invalid input data' });
      return;
    }

    const customKey = (req.headers['x-gemini-key'] as string) || req.body?.customKey;
    const recommendations = await getAISafetyRecommendations(validation.data, customKey);
    res.json(recommendations);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal processing error';
    console.error('Error in /api/ai/recommendations:', msg);
    res.status(500).json({ error: 'Failed to generate recommendations. Please try again.' });
  }
});

// AI Daily Routine Planner
app.post('/api/ai/routine', async (req: Request, res: Response) => {
  try {
    const validation = validateRoutineInput(req.body);
    if (!validation.isValid || !validation.data) {
      res.status(400).json({ error: validation.error || 'Invalid routine input' });
      return;
    }

    const customKey = (req.headers['x-gemini-key'] as string) || req.body?.customKey;
    const routine = await getAIRoutinePlan(validation.data, customKey);
    res.json(routine);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal processing error';
    console.error('Error in /api/ai/routine:', msg);
    res.status(500).json({ error: 'Failed to generate routine. Please try again.' });
  }
});

// AI Chatbot
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const validation = validateChatInput(req.body);
    if (!validation.isValid || !validation.data) {
      res.status(400).json({ error: validation.error || 'Message is required' });
      return;
    }

    const customKey = (req.headers['x-gemini-key'] as string) || req.body?.customKey;
    const reply = await getAIChatResponse(
      validation.data.message,
      validation.data.cityContext,
      customKey
    );
    res.json({ reply });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal processing error';
    console.error('Error in /api/ai/chat:', msg);
    res.status(500).json({ error: 'Failed to process chat message. Please try again.' });
  }
});

// Export app for testability, and listen if executed directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🌿 HawaSaathi AI Backend Server running at http://localhost:${PORT}`);
  });
}

export default app;
