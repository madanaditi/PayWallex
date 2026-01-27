import { Router, Request, Response } from 'express';
import store from '../store/inMemoryStore';
import { generateId } from '../utils/id';

const router = Router();

// POST /v1/payment_intents
router.post('/', (req: Request, res: Response) => {
  const { amount, currency = 'usd', customer, metadata } = req.body || {};
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: { message: 'Invalid amount' } });
  }

  const id = generateId('pi');
  const now = Math.floor(Date.now() / 1000);
  const pi = {
    id,
    object: 'payment_intent',
    amount,
    currency,
    customer: customer || null,
    status: 'requires_confirmation',
    metadata: metadata || {},
    created: now
  };

  store.paymentIntents.set(id, pi);
  res.status(201).json(pi);
});

// GET /v1/payment_intents/:id
router.get('/:id', (req: Request, res: Response) => {
  const pi = store.paymentIntents.get(req.params.id);
  if (!pi) return res.status(404).json({ error: { message: 'PaymentIntent not found' } });
  res.json(pi);
});

// POST /v1/payment_intents/:id/confirm
router.post('/:id/confirm', (req: Request, res: Response) => {
  const pi = store.paymentIntents.get(req.params.id);
  if (!pi) return res.status(404).json({ error: { message: 'PaymentIntent not found' } });

  // For minimal prototype: confirming immediately succeeds
  if (pi.status === 'succeeded') {
    return res.json(pi);
  }

  pi.status = 'succeeded';
  pi.succeeded_at = Math.floor(Date.now() / 1000);
  store.paymentIntents.set(pi.id, pi);

  // Emit a simple "event" by logging; production would dispatch to webhook processor
  console.log('event: payment_intent.succeeded', { id: pi.id });

  res.json(pi);
});

// POST /v1/payment_intents/:id/cancel
router.post('/:id/cancel', (req: Request, res: Response) => {
  const pi = store.paymentIntents.get(req.params.id);
  if (!pi) return res.status(404).json({ error: { message: 'PaymentIntent not found' } });

  if (pi.status === 'canceled' || pi.status === 'succeeded') {
    return res.status(400).json({ error: { message: `Cannot cancel a payment intent with status ${pi.status}` } });
  }

  pi.status = 'canceled';
  pi.canceled_at = Math.floor(Date.now() / 1000);
  store.paymentIntents.set(pi.id, pi);
  res.json(pi);
});

// GET /v1/payment_intents
router.get('/', (_req: Request, res: Response) => {
  const data = Array.from(store.paymentIntents.values());
  res.json({ object: 'list', data, has_more: false });
});

export default router;
