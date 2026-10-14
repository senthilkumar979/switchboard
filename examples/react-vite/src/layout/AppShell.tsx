import { NavLink, Outlet } from 'react-router-dom';
import { SwitchboardPanel, useFeatureFlag, useScenario, useUserContext } from '@switchboard/react';

export function AppShell() {
  const { user } = useUserContext();
  const banner = useFeatureFlag('betaBanner');
  const { scenarios, activeScenarioId, activateScenario } = useScenario();

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark" aria-hidden>
            AO
          </div>
          <strong>Acme Ops</strong>
          <span>E-commerce back office</span>
        </div>
        <nav className="side-nav">
          <NavLink to="/" end>
            Customer lookup
          </NavLink>
        </nav>
        <div className="side-meta">
          <strong>{user.name ?? 'Employee'}</strong>
          <code>{String(user.role ?? '—')}</code>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div>
            <h1>Employee console</h1>
            <p className="muted">
              Scenario <code>{activeScenarioId ?? 'none'}</code>
            </p>
          </div>
          <div className="scenario-strip" role="group" aria-label="Employee scenarios">
            {scenarios
              .filter((s) => s.id.startsWith('employee-'))
              .map((scenario) => (
                <button
                  key={scenario.id}
                  type="button"
                  className="chip"
                  disabled={activeScenarioId === scenario.id}
                  onClick={() => activateScenario(scenario.id)}
                >
                  {scenario.name.replace('Employee — ', '')}
                </button>
              ))}
          </div>
        </header>

        {banner.enabled && (
          <div className="banner">
            <span>
              Look up <code>CUST-1001</code> or <code>CUST-1002</code>, then manage products and
              orders. Use the Switchboard panel for API failure scenarios.
            </span>
            <button type="button" className="ghost" onClick={() => banner.setEnabled(false)}>
              Dismiss
            </button>
          </div>
        )}

        <div className="content">
          <Outlet />
        </div>
      </div>

      {import.meta.env.DEV && <SwitchboardPanel />}
    </div>
  );
}
