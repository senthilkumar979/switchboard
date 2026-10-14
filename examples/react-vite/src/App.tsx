import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AppShell } from './layout/AppShell.js';
import { CustomerPage } from './pages/CustomerPage.js';
import { LookupPage } from './pages/LookupPage.js';
import { OrderDetailPage } from './pages/OrderDetailPage.js';
import { OrdersPage } from './pages/OrdersPage.js';
import { ProductsPage } from './pages/ProductsPage.js';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<LookupPage />} />
          <Route path="customers/:customerNumber" element={<CustomerPage />} />
          <Route path="customers/:customerNumber/products" element={<ProductsPage />} />
          <Route path="customers/:customerNumber/orders" element={<OrdersPage />} />
          <Route path="orders/:orderId" element={<OrderDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
