import { Link } from 'react-router-dom';
import { SwitchboardProvider } from '@switchboard-js/react';

import { DemoConsole } from '../demo/DemoConsole.js';
import { demoSwitchboard } from '../demo/switchboard.js';

export const DemoPage = () => (
  <div className="space-y-8">
    <div className="space-y-3">
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-accent">Live demo</p>
      <h1 className="text-3xl font-semibold tracking-tight text-fg md:text-4xl">
        Flip state. Watch the UI move.
      </h1>
      <p className="max-w-2xl text-muted leading-7">
        Activate a scenario below, or open the Switchboard panel. Flags gate the banner and toolbar;
        the viewer role disables edits; “Products down” returns a mocked 500 from{' '}
        <code className="text-fg">fetch</code>.
      </p>
      <p className="text-sm text-muted">
        Prefer guided pages?{' '}
        <Link to="/capabilities/flags" className="text-accent hover:underline">
          Browse capabilities
        </Link>
        .
      </p>
    </div>

    <SwitchboardProvider instance={demoSwitchboard}>
      <DemoConsole />
    </SwitchboardProvider>
  </div>
);
