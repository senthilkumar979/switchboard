import { CodeBlock } from '../../components/CodeBlock.js';

const installCmd = `pnpm add @switchboard-js/core @switchboard-js/react @switchboard-js/devtools @switchboard-js/api-mock`;

const reactSnippet = `import { createSwitchboard, SwitchboardProvider, SwitchboardPanel } from '@switchboard-js/react';
import { enableApiMock } from '@switchboard-js/api-mock';

const switchboard = createSwitchboard({
  features: { betaBanner: true },
  user: { id: 'dev', role: 'admin', permissions: ['read', 'write'] },
  environment: 'development',
});

if (import.meta.env.DEV) enableApiMock(switchboard);

export const App = () => (
  <SwitchboardProvider instance={switchboard}>
    <YourApp />
    {import.meta.env.DEV && <SwitchboardPanel />}
  </SwitchboardProvider>
);`;

export const HomeInstall = () => (
  <section className="space-y-6">
    <div>
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-accent">Install</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-fg">
        Add the packages you need
      </h2>
      <p className="mt-2 max-w-2xl text-muted leading-7">
        Core is framework-agnostic. Add React bindings, the panel, and API mocking as needed.
        Mount the panel and mocks only in development builds.
      </p>
    </div>
    <CodeBlock code={installCmd} label="Terminal" />
    <CodeBlock code={reactSnippet} label="React" />
  </section>
);
