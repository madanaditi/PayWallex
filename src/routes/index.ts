import { Router } from 'express';
import customersRouter from './customers';
import paymentIntentsRouter from './payment_intents';
import { idempotencyMiddleware } from '../middleware/idempotency';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Auth & Idempotency for v1 endpoints
router.use(authMiddleware);
router.use(idempotencyMiddleware);

// Resource routers
router.use('/customers', customersRouter);
router.use('/payment_intents', paymentIntentsRouter);

// Webhook (no auth by default; in production you'd verify signatures)
router.post('/webhook', (req, res) => {
  // minimal webhook stub
  console.log('webhook event:', req.body);
  res.json({ received: true });
});

export default router;
