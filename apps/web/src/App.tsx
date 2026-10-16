import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { getCapability } from './capabilities.js';
import { Layout } from './components/Layout.js';
import { CapabilityPage } from './pages/CapabilityPage.js';
import { DemoPage } from './pages/DemoPage.js';
import { HomePage } from './pages/HomePage.js';
import { applySeo } from './seo.js';

const RouteSeo = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      applySeo({ path: '/' });
      return;
    }
    if (path === '/demo') {
      applySeo({
        title: 'Live demo',
        description:
          'Interactive Switchboard demo — flip flags, roles, scenarios, and API mocks in the browser.',
        path: '/demo',
      });
      return;
    }
    const match = path.match(/^\/capabilities\/([^/]+)/);
    if (match?.[1]) {
      const cap = getCapability(match[1]);
      if (cap) {
        applySeo({
          title: cap.name,
          description: cap.summary,
          path: `/capabilities/${cap.id}`,
        });
      }
    }
  }, [location.pathname]);

  return null;
};

export const App = () => (
  <BrowserRouter>
    <RouteSeo />
    <Layout wide>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="demo" element={<DemoPage />} />
        <Route path="capabilities/:id" element={<CapabilityPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  </BrowserRouter>
);
