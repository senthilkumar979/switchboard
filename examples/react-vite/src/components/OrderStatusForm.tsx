import type { FormEvent } from 'react';

import type { OrderStatus } from '../api/client.js';

export const NEXT_STATUS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

interface OrderStatusFormProps {
  options: OrderStatus[];
  onSubmit: (status: OrderStatus, note?: string) => void;
}

export function OrderStatusForm({ options, onSubmit }: OrderStatusFormProps) {
  if (options.length === 0) return <span className="muted">Terminal</span>;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSubmit(String(form.get('status')) as OrderStatus, String(form.get('note') || '') || undefined);
  }

  return (
    <form className="inline-form" onSubmit={handleSubmit}>
      <select name="status" defaultValue={options[0]}>
        {options.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <input name="note" placeholder="Note" />
      <button type="submit">Update</button>
    </form>
  );
}
