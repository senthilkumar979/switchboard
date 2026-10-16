import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFeatureFlag, useUserContext } from '@switchboard-js/react';

import { ApiError, type Order, type OrderStatus } from '../api/client.js';
import { listOrders, updateOrderStatus } from '../api/endpoints.js';
import { can } from '../auth/permissions.js';
import { OrderStatusForm, NEXT_STATUS } from '../components/OrderStatusForm.js';

export function OrdersPage() {
  const { customerNumber = '' } = useParams();
  const { user } = useUserContext();
  const bulk = useFeatureFlag('bulkOrderActions');
  const canWrite = can(user, 'orders:write');

  const [items, setItems] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  async function reload() {
    setLoading(true);
    setError(null);
    try {
      setItems((await listOrders(customerNumber)).items);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load orders');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void reload();
  }, [customerNumber]);

  async function updateStatus(orderId: string, status: OrderStatus, note?: string) {
    setFeedback(null);
    try {
      await updateOrderStatus(orderId, status, note);
      setFeedback({ kind: 'ok', text: `Updated ${orderId} → ${status}` });
      await reload();
    } catch (err) {
      setFeedback({
        kind: 'error',
        text: err instanceof ApiError ? err.message : 'Update failed',
      });
    }
  }

  async function onBulkConfirm() {
    for (const id of selectedIds) {
      const order = items.find((item) => item.id === id);
      if (order?.status === 'pending') await updateStatus(id, 'confirmed', 'Bulk confirm');
    }
    setSelectedIds([]);
  }

  function toggleSelected(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <section className="stack">
      <div className="page-head">
        <div>
          <Link to={`/customers/${customerNumber}`}>← {customerNumber}</Link>
          <h2>Orders</h2>
          <p className="muted">Buyer orders against this customer’s products</p>
        </div>
        {bulk.enabled && canWrite && (
          <button
            type="button"
            className="primary"
            disabled={selectedIds.length === 0}
            onClick={() => void onBulkConfirm()}
          >
            Confirm selected ({selectedIds.length})
          </button>
        )}
      </div>

      {loading && <p className="muted">Loading…</p>}
      {error && <p className="error">{error}</p>}
      {feedback && (
        <p className={feedback.kind === 'error' ? 'error' : 'status'}>{feedback.text}</p>
      )}

      {!loading && !error && items.length === 0 ? (
        <p className="empty-state panel-card">No orders for this customer yet.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              {bulk.enabled && canWrite && <th />}
              <th>Order</th>
              <th>Buyer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((order) => (
              <tr key={order.id}>
                {bulk.enabled && canWrite && (
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(order.id)}
                      onChange={() => toggleSelected(order.id)}
                      disabled={order.status !== 'pending'}
                    />
                  </td>
                )}
                <td>
                  <Link to={`/orders/${order.id}`}>
                    <code>{order.id}</code>
                  </Link>
                </td>
                <td>{order.buyerName}</td>
                <td>${order.total.toFixed(2)}</td>
                <td>
                  <span className={`pill status-${order.status}`}>{order.status}</span>
                </td>
                <td>
                  {canWrite ? (
                    <OrderStatusForm
                      options={NEXT_STATUS[order.status]}
                      onSubmit={(status, note) => void updateStatus(order.id, status, note)}
                    />
                  ) : (
                    <span className="muted">Read only</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
