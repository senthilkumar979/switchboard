import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const EXAMPLES = ['CUST-1001', 'CUST-1002'];

export function LookupPage() {
  const navigate = useNavigate();
  const [customerNumber, setCustomerNumber] = useState('CUST-1001');

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const value = customerNumber.trim().toUpperCase();
    if (!value) return;
    navigate(`/customers/${encodeURIComponent(value)}`);
  }

  return (
    <section className="lookup-hero">
      <p className="eyebrow">Start here</p>
      <h2>Customer lookup</h2>
      <p className="muted">
        Open a company by customer number to manage its catalog and the orders buyers placed on its
        products.
      </p>
      <form className="lookup-form" onSubmit={onSubmit}>
        <label>
          Customer number
          <input
            value={customerNumber}
            onChange={(event) => setCustomerNumber(event.target.value)}
            placeholder="CUST-1001"
            autoComplete="off"
            autoFocus
          />
        </label>
        <button type="submit" className="primary">
          Open customer
        </button>
      </form>
      <div className="row">
        <span className="tiny muted">Try</span>
        {EXAMPLES.map((number) => (
          <button
            key={number}
            type="button"
            className="chip"
            onClick={() => setCustomerNumber(number)}
          >
            {number}
          </button>
        ))}
      </div>
    </section>
  );
}
