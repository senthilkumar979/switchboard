import { createSwitchboard } from '@switchboard/core';

import './style.css';

const switchboard = createSwitchboard({
  features: {
    newDashboard: false,
    betaFeature: {
      default: true,
      group: 'experiments',
    },
  },
  user: {
    id: 'dev-user',
    name: 'Developer',
    role: 'admin',
    permissions: ['read', 'write'],
  },
  environment: 'development',
  persistence: 'memory',
});

const app = document.querySelector('#app');

function render(): void {
  if (!app) return;

  const state = switchboard.getState();

  app.innerHTML = `
    <main style="font-family: ui-sans-serif, system-ui, sans-serif; padding: 2rem; max-width: 40rem;">
      <h1>Switchboard Playground</h1>
      <p>Phase 1 core engine demo</p>

      <section>
        <h2>Environment</h2>
        <p><code>${state.environment}</code></p>
      </section>

      <section>
        <h2>Features</h2>
        <ul>
          ${Object.entries(state.features)
            .map(
              ([name, enabled]) => `
            <li>
              <label>
                <input type="checkbox" data-feature="${name}" ${enabled ? 'checked' : ''} />
                ${name}${state.featureMeta[name]?.isOverridden ? ' (overridden)' : ''}
              </label>
            </li>
          `,
            )
            .join('')}
        </ul>
      </section>

      <section>
        <h2>User</h2>
        <pre>${JSON.stringify(state.user, null, 2)}</pre>
        <button type="button" data-action="toggle-role">
          Toggle role (admin / customer)
        </button>
      </section>

      <section>
        <button type="button" data-action="reset">Reset</button>
      </section>
    </main>
  `;

  app.querySelectorAll<HTMLInputElement>('input[data-feature]').forEach((input) => {
    input.addEventListener('change', () => {
      const name = input.dataset.feature;
      if (!name) return;
      switchboard.setFeature(name, input.checked);
    });
  });

  app.querySelector('[data-action="toggle-role"]')?.addEventListener('click', () => {
    const role = switchboard.getUser().role === 'admin' ? 'customer' : 'admin';
    switchboard.setUser({ role });
  });

  app.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
    switchboard.reset();
  });
}

switchboard.subscribe(render);
render();
