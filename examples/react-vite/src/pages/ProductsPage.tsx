import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFeatureFlag, useUserContext } from '@switchboard-js/react';

import { ApiError, type Product } from '../api/client.js';
import { listProducts, updateProduct } from '../api/endpoints.js';
import { can } from '../auth/permissions.js';
import { ProductEditor } from '../components/ProductEditor.js';

export function ProductsPage() {
  const { customerNumber = '' } = useParams();
  const { user } = useUserContext();
  const costField = useFeatureFlag('productCostField');
  const canWrite = can(user, 'products:write');

  const [items, setItems] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  async function reload() {
    setLoading(true);
    setError(null);
    try {
      setItems((await listProducts(customerNumber)).items);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load products');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void reload();
  }, [customerNumber]);

  async function onSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !canWrite) return;
    const form = new FormData(event.currentTarget);
    const body = {
      title: String(form.get('title') ?? ''),
      price: Number(form.get('price')),
      stock: Number(form.get('stock')),
      active: form.get('active') === 'on',
      ...(costField.enabled ? { cost: Number(form.get('cost')) } : {}),
    };
    setFeedback(null);
    try {
      const updated = await updateProduct(selected.id, body, 'PUT');
      setSelected(updated);
      setFeedback({ kind: 'ok', text: `Saved ${updated.sku}` });
      await reload();
    } catch (err) {
      setFeedback({
        kind: 'error',
        text: err instanceof ApiError ? err.message : 'Save failed',
      });
    }
  }

  return (
    <section className="stack">
      <div className="page-head">
        <div>
          <Link to={`/customers/${customerNumber}`}>← {customerNumber}</Link>
          <h2>Products</h2>
          <p className="muted">Catalog for this customer account</p>
        </div>
      </div>

      {loading && <p className="muted">Loading…</p>}
      {error && <p className="error">{error}</p>}
      {feedback && (
        <p className={feedback.kind === 'error' ? 'error' : 'status'}>{feedback.text}</p>
      )}

      <div className="split">
        <table className="data-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Title</th>
              <th>Price</th>
              <th>Stock</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((product) => (
              <tr key={product.id}>
                <td>
                  <code>{product.sku}</code>
                </td>
                <td>{product.title}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>
                  <button
                    type="button"
                    className={selected?.id === product.id ? 'primary' : undefined}
                    onClick={() => setSelected(product)}
                  >
                    {canWrite ? 'Edit' : 'View'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selected && (
          <ProductEditor
            product={selected}
            canWrite={canWrite}
            showCost={costField.enabled}
            onSave={onSave}
          />
        )}
      </div>
    </section>
  );
}
