import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  getAISafetyRecommendations,
  getAIRoutinePlan,
  getAIChatResponse,
} from './gemini';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'HawaSaathi AI Backend Service',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'),
    timestamp: new Date().toISOString(),
  });
});

// AI Safety Recommendations
app.post('/api/ai/recommendations', async (req: Request, res: Response) => {
  try {
    const customKey = (req.headers['x-gemini-key'] as string) || req.body.customKey;
    const recommendations = await getAISafetyRecommendations(req.body, customKey);
    res.json(recommendations);
  } catch (error: any) {
    console.error('Error in /api/ai/recommendations:', error);
    res.status(500).json({ error: error.message || 'Failed to generate recommendations' });
  }
});

// AI Daily Routine Planner
app.post('/api/ai/routine', async (req: Request, res: Response) => {
  try {
    const customKey = (req.headers['x-gemini-key'] as string) || req.body.customKey;
    const routine = await getAIRoutinePlan(req.body, customKey);
    res.json(routine);
  } catch (error: any) {
    console.error('Error in /api/ai/routine:', error);
    res.status(500).json({ error: error.message || 'Failed to generate routine' });
  }
});

// AI Chatbot
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { message, cityContext } = req.body;
    const customKey = (req.headers['x-gemini-key'] as string) || req.body.customKey;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    const reply = await getAIChatResponse(message, cityContext, customKey);
    res.json({ reply });
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);
    res.status(500).json({ error: error.message || 'Failed to process chat message' });
  }
});

app.listen(PORT, () => {
  console.log(`🌿 HawaSaathi AI Backend Server running at http://localhost:${PORT}`);
});
