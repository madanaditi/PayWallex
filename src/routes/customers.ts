import { Router, Request, Response } from 'express';
import store from '../store/inMemoryStore';
import { generateId } from '../utils/id';

const router = Router();

// POST /v1/customers
router.post('/', (req: Request, res: Response) => {
  const { email, name, metadata } = req.body || {};
  const id = generateId('cus');
  const now = Math.floor(Date.now() / 1000);
  const customer = {
    id,
    object: 'customer',
    email: email || null,
    name: name || null,
    metadata: metadata || {},
    created: now
  };
  store.customers.set(id, customer);
  res.status(201).json(customer);
});

// GET /v1/customers/:id
router.get('/:id', (req: Request, res: Response) => {
  const customer = store.customers.get(req.params.id);
  if (!customer) return res.status(404).json({ error: { message: 'Customer not found' } });
  res.json(customer);
});

// GET /v1/customers
router.get('/', (_req: Request, res: Response) => {
  const data = Array.from(store.customers.values());
  res.json({ object: 'list', data, has_more: false });
});

export default router;
