import { Request, Response, NextFunction } from 'express';

// Minimal API key auth: expects Authorization: Bearer <sk_test_...>
const TEST_API_KEY = process.env.PAYWALLEX_API_KEY || 'sk_test_123';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.header('authorization') || '';
  if (!auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: { message: 'Missing or invalid Authorization header' } });
  }
  const key = auth.slice('Bearer '.length);
  if (key !== TEST_API_KEY) {
    return res.status(403).json({ error: { message: 'Invalid API key' } });
  }
  next();
}
