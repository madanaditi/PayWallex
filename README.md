# PayWallex — Minimal Stripe-like prototype

This is a minimal prototype (TypeScript + Express) implementing a small subset of Payment APIs:
- Customers: create, retrieve, list
- Payment Intents: create, retrieve, confirm, cancel, list
- Idempotency-Key support
- API key auth (Bearer)
- In-memory store (no DB)
- Webhook endpoint stub
- smote change

## Quick start

Requirements:
- Node 18+ recommended
- npm

Install:
```bash
npm install
```

Start (development):
```bash
npm run start
# or: npm run dev (requires ts-node-dev)
```

The server listens on http://localhost:3000 by default.

API key:
- Default test key: `sk_test_123`
- Send as: `Authorization: Bearer sk_test_123`

## Example requests

Create a customer:
```bash
curl -X POST http://localhost:3000/v1/customers \
  -H "Authorization: Bearer sk_test_123" \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","name":"Alice"}'
```

Sample response:
```json
{
  "id": "cus_1a2b3c4d5e6f7g8h9i0j",
  "object": "customer",
  "email": "alice@example.com",
  "name": "Alice",
  "metadata": {},
  "created": 1670000000
}
```

Create a payment intent:
```bash
curl -X POST http://localhost:3000/v1/payment_intents \
  -H "Authorization: Bearer sk_test_123" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: create-pi-123" \
  -d '{"amount":1000,"currency":"usd","customer":"cus_..."}'
```

Sample response:
```json
{
  "id": "pi_1a2b3c4d5e6f7g8h9i0j",
  "object": "payment_intent",
  "amount": 1000,
  "currency": "usd",
  "customer": "cus_...",
  "status": "requires_confirmation",
  "metadata": {},
  "created": 1670000000
}
```

Confirm a payment intent:
```bash
curl -X POST http://localhost:3000/v1/payment_intents/pi_.../confirm \
  -H "Authorization: Bearer sk_test_123"
```

This prototype confirms immediately and marks the PaymentIntent `succeeded`.

List payment intents:
```bash
curl -X GET http://localhost:3000/v1/payment_intents \
  -H "Authorization: Bearer sk_test_123"
```

Webhook endpoint (minimal):
```bash
curl -X POST http://localhost:3000/v1/webhook -d '{"type":"test.event"}' -H "Content-Type: application/json"
```

## Notes & next steps

- The store is in-memory; restarting the server loses data. For persistence, swap the store for a DB (SQLite/Postgres).
- Idempotency keys are stored in-memory. In a distributed environment, persist them in a shared store (Redis, DB).
- Webhook handling is a stub — add signature verification and retry delivery logic.
- You can extend to Charges, Refunds, PaymentMethods, and an OpenAPI spec.

If you want, I can:
- Add a SQLite-backed store and simple migrations,
- Implement Charges & Refunds,
- Add OpenAPI docs and example Postman collection,
- Or produce a Dockerfile for easy running.

