import { Request, Response, NextFunction } from 'express';
import store from '../store/inMemoryStore';

// Idempotency middleware:
// - If Idempotency-Key present and we've stored a response for this method+path+key, return it.
// - Otherwise, allow request to proceed and capture the response to store it under the key.
export function idempotencyMiddleware(req: Request, res: Response, next: NextFunction) {
  const key = req.header('idempotency-key');
  if (!key) return next();

  const idKey = `${req.method}:${req.originalUrl}:${key}`;
  const existing = store.idempotency.get(idKey);
  if (existing) {
    // replay stored response
    res.status(existing.status).json(existing.body);
    return;
  }

  // wrap res.json to capture
  const originalJson = res.json.bind(res);
  res.json = (body: any) => {
    // store response for idempotency
    store.idempotency.set(idKey, { status: res.statusCode || 200, body });
    return originalJson(body);
  };

  next();
}
