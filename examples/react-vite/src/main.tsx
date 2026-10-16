import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { enableApiMock } from '@switchboard-js/api-mock';
import { SwitchboardProvider } from '@switchboard-js/react';

import { App } from './App.js';
import { exampleSwitchboard } from './switchboard.js';
import './styles.css';

if (import.meta.env.DEV) {
  enableApiMock(exampleSwitchboard);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SwitchboardProvider instance={exampleSwitchboard}>
      <App />
    </SwitchboardProvider>
  </StrictMode>,
);
