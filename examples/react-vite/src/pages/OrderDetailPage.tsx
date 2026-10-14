import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useUserContext } from '@switchboard/react';

import { ApiError, type Order, type OrderStatus } from '../api/client.js';
import { getOrder, updateOrderStatus } from '../api/endpoints.js';
import { can } from '../auth/permissions.js';
import { NEXT_STATUS } from '../components/OrderStatusForm.js';

export function OrderDetailPage() {
  const { orderId = '' } = useParams();
  const { user } = useUserContext();
  const canWrite = can(user, 'orders:write');

  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  async function reload() {
    setLoading(true);
    setError(null);
    try {
      setOrder(await getOrder(orderId));
    } catch (err) {
      setOrder(null);
      setError(err instanceof ApiError ? err.message : 'Failed to load order');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void reload();
  }, [orderId]);

  async function onUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canWrite) return;
    const form = new FormData(event.currentTarget);
    setFeedback(null);
    try {
      const updated = await updateOrderStatus(
        orderId,
        String(form.get('status')) as OrderStatus,
        String(form.get('note') || '') || undefined,
      );
      setOrder(updated);
      setFeedback({ kind: 'ok', text: `Status → ${updated.status}` });
    } catch (err) {
      setFeedback({
        kind: 'error',
        text: err instanceof ApiError ? err.message : 'Update failed',
      });
    }
  }

  if (loading) return <p className="muted">Loading order…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!order) return <p className="error">Order not found</p>;

  const options = NEXT_STATUS[order.status];

  return (
    <section className="stack">
      <div className="page-head">
        <div>
          <Link to={`/customers/${order.customerNumber}/orders`}>← Orders</Link>
          <h2>
            Order <code>{order.id}</code>
          </h2>
          <p className="muted">
            {order.buyerName} · placed {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <span className={`pill status-${order.status}`}>{order.status}</span>
      </div>

      {feedback && (
        <p className={feedback.kind === 'error' ? 'error' : 'status'}>{feedback.text}</p>
      )}

      <div className="panel-card">
        <dl className="detail-list">
          <div>
            <dt>Product</dt>
            <dd>
              {order.productTitle} <code>{order.productId}</code>
            </dd>
          </div>
          <div>
            <dt>Quantity</dt>
            <dd>{order.quantity}</dd>
          </div>
          <div>
            <dt>Total</dt>
            <dd>${order.total.toFixed(2)}</dd>
          </div>
          {order.note && (
            <div>
              <dt>Note</dt>
              <dd>{order.note}</dd>
            </div>
          )}
        </dl>
      </div>

      {canWrite && options.length > 0 && (
        <form className="panel-card editor" onSubmit={onUpdate}>
          <div>
            <p className="eyebrow">Workflow</p>
            <h3>Update status</h3>
          </div>
          <label>
            Status
            <select name="status" defaultValue={options[0]}>
              {options.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label>
            Note
            <input name="note" placeholder="Optional note" />
          </label>
          <button type="submit" className="primary">
            Save
          </button>
        </form>
      )}
    </section>
  );
}
