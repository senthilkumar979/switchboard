import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFeatureFlag } from '@switchboard-js/react';

import { ApiError } from '../api/client.js';
import { getCustomer, getStats } from '../api/endpoints.js';
import type { Customer, Stats } from '../api/client.js';

export function CustomerPage() {
  const { customerNumber = '' } = useParams();
  const headerFlag = useFeatureFlag('newCustomerHeader');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([getCustomer(customerNumber), getStats(customerNumber)])
      .then(([nextCustomer, nextStats]) => {
        if (cancelled) return;
        setCustomer(nextCustomer);
        setStats(nextStats);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setCustomer(null);
        setStats(null);
        setError(err instanceof ApiError ? err.message : 'Failed to load customer');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [customerNumber]);

  if (loading) return <p className="muted">Loading customer…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!customer) return <p className="error">Customer not found</p>;

  return (
    <section className="stack">
      <div className={headerFlag.enabled ? 'customer-header alt' : 'customer-header'}>
        <div>
          <p className="eyebrow">{customer.customerNumber}</p>
          <h2>{customer.company}</h2>
          <p className="muted">
            {customer.name} · {customer.email} ·{' '}
            <span className="pill">{customer.status}</span>
          </p>
        </div>
        <div className="row">
          <Link className="button primary" to={`/customers/${customer.customerNumber}/products`}>
            Products
          </Link>
          <Link className="button" to={`/customers/${customer.customerNumber}/orders`}>
            Orders
          </Link>
          <Link className="button ghost" to="/">
            New lookup
          </Link>
        </div>
      </div>

      {stats && (
        <div className="stat-grid">
          <div className="stat-card">
            <span>Products</span>
            <strong>{stats.productCount}</strong>
          </div>
          <div className="stat-card">
            <span>Active SKUs</span>
            <strong>{stats.activeProductCount}</strong>
          </div>
          <div className="stat-card">
            <span>Orders</span>
            <strong>{stats.orderCount}</strong>
          </div>
          <div className="stat-card">
            <span>Open pipeline</span>
            <strong>{stats.pendingOrders}</strong>
          </div>
          <div className="stat-card">
            <span>Revenue</span>
            <strong>${stats.revenue.toFixed(2)}</strong>
          </div>
        </div>
      )}
    </section>
  );
}
