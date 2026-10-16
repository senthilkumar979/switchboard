import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { enableApiMock } from '@switchboard-js/api-mock';

import { App } from './App.js';
import { demoSwitchboard } from './demo/switchboard.js';
import './index.css';

enableApiMock(demoSwitchboard);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
