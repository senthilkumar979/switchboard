import { useCallback, useEffect, useState } from 'react';
import {
  SwitchboardPanel,
  useFeatureFlag,
  useScenario,
  useUserContext,
} from '@switchboard-js/react';

interface Product {
  id: string;
  name: string;
  price: number;
}

export const DemoConsole = () => {
  const { user } = useUserContext();
  const banner = useFeatureFlag('betaBanner');
  const bulk = useFeatureFlag('bulkActions');
  const { scenarios, activeScenarioId, activateScenario } = useScenario();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canWrite = Boolean(user.permissions?.includes('products:write'));

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/demo/products');
      const data = (await res.json()) as { items?: Product[]; error?: string };
      if (!res.ok) {
        setProducts(null);
        setError(data.error ?? `Request failed (${res.status})`);
        return;
      }
      setProducts(data.items ?? []);
    } catch (err) {
      setProducts(null);
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts, activeScenarioId]);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface/80 shadow-[0_24px_80px_-48px_rgba(15,118,110,0.5)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div>
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-accent">
            Live console
          </p>
          <h2 className="mt-1 text-lg font-semibold text-fg">Acme Ops · demo</h2>
        </div>
        <div className="text-right text-sm">
          <p className="font-medium text-fg">{user.name ?? 'Employee'}</p>
          <p className="font-mono text-xs text-muted">{String(user.role ?? '—')}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-line px-5 py-3" role="group" aria-label="Scenarios">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            disabled={activeScenarioId === scenario.id}
            onClick={() => activateScenario(scenario.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              activeScenarioId === scenario.id
                ? 'bg-accent text-accent-fg'
                : 'border border-line bg-code text-fg hover:border-accent/40'
            }`}
          >
            {scenario.name}
          </button>
        ))}
      </div>

      {banner.enabled && (
        <div className="flex items-start justify-between gap-3 border-b border-line bg-accent-soft px-5 py-3 text-sm text-fg">
          <span>
            Banner is on. Open the Switchboard launcher to flip flags, users, and API mocks.
          </span>
          <button type="button" className="shrink-0 text-accent hover:underline" onClick={() => banner.setEnabled(false)}>
            Dismiss
          </button>
        </div>
      )}

      <div className="space-y-5 p-5">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!canWrite}
            className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-fg disabled:cursor-not-allowed disabled:opacity-40"
          >
            Edit product
          </button>
          {bulk.enabled && (
            <button
              type="button"
              disabled={!canWrite}
              className="rounded-lg border border-line px-3 py-2 text-sm text-fg disabled:cursor-not-allowed disabled:opacity-40"
            >
              Bulk actions
            </button>
          )}
          <button
            type="button"
            onClick={() => void loadProducts()}
            className="rounded-lg border border-line px-3 py-2 text-sm text-fg hover:bg-code"
          >
            {loading ? 'Loading…' : 'Reload products'}
          </button>
        </div>

        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            {error}
          </p>
        )}

        {products && (
          <ul className="divide-y divide-line rounded-xl border border-line">
            {products.map((product) => (
              <li key={product.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="font-medium text-fg">{product.name}</span>
                <span className="font-mono text-muted">${product.price}</span>
              </li>
            ))}
          </ul>
        )}

        <p className="text-xs leading-5 text-muted">
          Active scenario:{' '}
          <code className="text-fg">{activeScenarioId ?? 'none'}</code>. Use the floating
          Switchboard control to open the full panel.
        </p>
      </div>

      <SwitchboardPanel />
    </div>
  );
};
