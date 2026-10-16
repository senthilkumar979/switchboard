import { useFeatureFlag, useScenario, useUserContext } from '@switchboard-js/react';

interface CapabilityPreviewProps {
  capabilityId: string;
}

export const CapabilityPreview = ({ capabilityId }: CapabilityPreviewProps) => {
  const banner = useFeatureFlag('betaBanner');
  const { user } = useUserContext();
  const { scenarios, activeScenarioId, activateScenario } = useScenario();
  const canWrite = Boolean(user.permissions?.includes('products:write'));

  if (capabilityId === 'flags') {
    return (
      <div className="space-y-3 rounded-2xl border border-line bg-code/60 p-4">
        <p className="text-sm text-muted">
          Flag <code className="text-fg">betaBanner</code> is{' '}
          <strong className="text-fg">{banner.enabled ? 'on' : 'off'}</strong>.
        </p>
        <button
          type="button"
          className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-fg"
          onClick={() => banner.setEnabled(!banner.enabled)}
        >
          {banner.enabled ? 'Disable banner' : 'Enable banner'}
        </button>
        {banner.enabled && (
          <div className="rounded-xl bg-accent-soft px-3 py-2 text-sm text-fg">Ops announcement</div>
        )}
      </div>
    );
  }

  if (capabilityId === 'user') {
    return (
      <div className="space-y-3 rounded-2xl border border-line bg-code/60 p-4">
        <p className="text-sm text-muted">
          Acting as <strong className="text-fg">{user.name}</strong> (
          <code className="text-fg">{String(user.role)}</code>).
        </p>
        <div className="flex flex-wrap gap-2">
          {scenarios
            .filter((s) => s.id === 'happy-path' || s.id === 'viewer')
            .map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                onClick={() => activateScenario(scenario.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  activeScenarioId === scenario.id
                    ? 'bg-accent text-accent-fg'
                    : 'border border-line bg-surface text-fg'
                }`}
              >
                {scenario.name}
              </button>
            ))}
        </div>
        <button
          type="button"
          disabled={!canWrite}
          className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-fg disabled:opacity-40"
        >
          Edit product
        </button>
      </div>
    );
  }

  if (capabilityId === 'scenarios' || capabilityId === 'panel' || capabilityId === 'api-mock') {
    return (
      <div className="space-y-3 rounded-2xl border border-line bg-code/60 p-4">
        <p className="text-sm text-muted">
          Active:{' '}
          <code className="text-fg">{activeScenarioId ?? 'none'}</code>
        </p>
        <div className="flex flex-wrap gap-2">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              onClick={() => activateScenario(scenario.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                activeScenarioId === scenario.id
                  ? 'bg-accent text-accent-fg'
                  : 'border border-line bg-surface text-fg'
              }`}
            >
              {scenario.name}
            </button>
          ))}
        </div>
        {capabilityId === 'api-mock' && (
          <p className="text-xs text-muted">
            Try “API — Products down”, then open the{' '}
            <a href="/demo" className="text-accent hover:underline">
              full demo
            </a>{' '}
            and reload products.
          </p>
        )}
        {capabilityId === 'panel' && (
          <p className="text-xs text-muted">
            Open the{' '}
            <a href="/demo" className="text-accent hover:underline">
              live demo
            </a>{' '}
            to use the floating Switchboard panel.
          </p>
        )}
      </div>
    );
  }

  return null;
};
