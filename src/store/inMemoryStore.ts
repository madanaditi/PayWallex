type AnyRecord = Record<string, any>;

class InMemoryStore {
  customers: Map<string, AnyRecord> = new Map();
  paymentIntents: Map<string, AnyRecord> = new Map();

  // idempotency-key -> { status, body }
  idempotency: Map<string, { status: number; body: any }> = new Map();
}

const store = new InMemoryStore();
export default store;
