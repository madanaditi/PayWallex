import { v4 as uuidv4 } from 'uuid';

export function generateId(prefix: string) {
  // stripe-like id: prefix_xxx
  return `${prefix}_${uuidv4().replace(/-/g, '').slice(0, 24)}`;
}
