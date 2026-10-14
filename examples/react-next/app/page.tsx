export default function HomePage() {
  return (
    <main style={{ fontFamily: 'system-ui', padding: '2rem', maxWidth: 640 }}>
      <h1>Switchboard E-commerce BO API</h1>
      <p>
        This Next.js app exposes REST handlers for the Vite employee console. Run on port{' '}
        <code>3001</code>.
      </p>
      <ul>
        <li>
          <code>GET /api/health</code>
        </li>
        <li>
          <code>GET /api/customers/CUST-1001</code>
        </li>
        <li>
          <code>GET /api/customers/CUST-1001/products</code>
        </li>
        <li>
          <code>GET /api/customers/CUST-1001/orders</code>
        </li>
      </ul>
    </main>
  );
}
