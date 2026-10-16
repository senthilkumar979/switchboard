export interface Capability {
  id: string;
  name: string;
  eyebrow: string;
  summary: string;
  description: string;
  docsPath: string;
  snippet: string;
}

export const capabilities: Capability[] = [
  {
    id: 'flags',
    name: 'Feature flags',
    eyebrow: 'Runtime toggles',
    summary: 'Flip flags instantly with groups, defaults, and override tracking.',
    description:
      'Define flags in code, toggle them from the panel or hooks, and watch the UI update without a rebuild. Group related flags and track which ones you overrode locally.',
    docsPath: '/docs/feature-flags',
    snippet: `import { useFeatureFlag } from '@switchboard-js/react';

export const Banner = () => {
  const banner = useFeatureFlag('betaBanner');
  if (!banner.enabled) return null;
  return <div>Ops announcement</div>;
};`,
  },
  {
    id: 'user',
    name: 'User simulation',
    eyebrow: 'Roles & permissions',
    summary: 'Swap roles and permissions locally to exercise every UI path.',
    description:
      'Simulate admins, viewers, and custom fields without logging into real accounts. Permission-gated buttons and routes update as soon as the active user changes.',
    docsPath: '/docs/user-context',
    snippet: `import { useUserContext } from '@switchboard-js/react';

export const EditButton = () => {
  const { user } = useUserContext();
  const canWrite = user.permissions?.includes('products:write');
  return <button disabled={!canWrite}>Edit product</button>;
};`,
  },
  {
    id: 'scenarios',
    name: 'Scenarios',
    eyebrow: 'Named snapshots',
    summary: 'Activate a named snapshot of flags, user, and API mocks together.',
    description:
      'Ship ready-made states for demos and QA — “Viewer”, “Products down”, “Happy path” — and activate them from code, URL, or the panel.',
    docsPath: '/docs/scenarios',
    snippet: `import { useScenario } from '@switchboard-js/react';

export const ScenarioStrip = () => {
  const { scenarios, activateScenario } = useScenario();
  return scenarios.map((s) => (
    <button key={s.id} onClick={() => activateScenario(s.id)}>{s.name}</button>
  ));
};`,
  },
  {
    id: 'api-mock',
    name: 'API mocking',
    eyebrow: 'Fetch interception',
    summary: 'Intercept fetch by pathname and return status codes plus JSON bodies.',
    description:
      'Enable mocks only in development. Global rules cover the happy path; scenarios replace them with failure responses for the paths you care about.',
    docsPath: '/docs/api-mocking',
    snippet: `import { enableApiMock } from '@switchboard-js/api-mock';

if (import.meta.env.DEV) {
  enableApiMock(switchboard);
}`,
  },
  {
    id: 'panel',
    name: 'Developer panel',
    eyebrow: 'Selection-only drawer',
    summary: 'A selection-only drawer for activation and toggles — config stays in code.',
    description:
      'Mount the Web Component panel once. Activate scenarios, flip flags, and enable mocks without free-text forms (except custom mock JSON).',
    docsPath: '/docs/developer-panel',
    snippet: `import { SwitchboardPanel } from '@switchboard-js/react';

export const App = () => (
  <>
    <YourApp />
    {import.meta.env.DEV && <SwitchboardPanel />}
  </>
);`,
  },
];

export function getCapability(id: string): Capability | undefined {
  return capabilities.find((c) => c.id === id);
}
