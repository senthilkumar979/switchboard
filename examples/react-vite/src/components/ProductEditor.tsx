import type { FormEvent } from 'react';

import type { Product } from '../api/client.js';

interface ProductEditorProps {
  product: Product;
  canWrite: boolean;
  showCost: boolean;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
}

export function ProductEditor({ product, canWrite, showCost, onSave }: ProductEditorProps) {
  return (
    <form className="panel-card editor" onSubmit={onSave}>
      <div>
        <p className="eyebrow">{canWrite ? 'Edit product' : 'View product'}</p>
        <h3>
          {product.sku} <code>{product.id}</code>
        </h3>
      </div>
      <label>
        Title
        <input name="title" defaultValue={product.title} disabled={!canWrite} key={product.id + '-title'} />
      </label>
      <label>
        Price
        <input
          name="price"
          type="number"
          step="0.01"
          defaultValue={product.price}
          disabled={!canWrite}
          key={product.id + '-price'}
        />
      </label>
      {showCost && (
        <label>
          Cost
          <input
            name="cost"
            type="number"
            step="0.01"
            defaultValue={product.cost ?? 0}
            disabled={!canWrite}
            key={product.id + '-cost'}
          />
        </label>
      )}
      <label>
        Stock
        <input
          name="stock"
          type="number"
          defaultValue={product.stock}
          disabled={!canWrite}
          key={product.id + '-stock'}
        />
      </label>
      <label className="check">
        <input
          name="active"
          type="checkbox"
          defaultChecked={product.active}
          disabled={!canWrite}
          key={product.id + '-active'}
        />
        Active
      </label>
      {canWrite && (
        <button type="submit" className="primary">
          Save product
        </button>
      )}
    </form>
  );
}
