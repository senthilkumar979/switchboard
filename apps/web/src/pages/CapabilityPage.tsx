import { Link, Navigate, useParams } from 'react-router-dom';
import { SwitchboardProvider } from '@switchboard-js/react';

import { getCapability } from '../capabilities.js';
import { CodeBlock } from '../components/CodeBlock.js';
import { demoSwitchboard } from '../demo/switchboard.js';
import { CapabilityPreview } from './capabilities/CapabilityPreview.js';

export const CapabilityPage = () => {
  const { id = '' } = useParams();
  const capability = getCapability(id);

  if (!capability) return <Navigate to="/" replace />;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-accent">
          {capability.eyebrow}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-fg md:text-4xl">
          {capability.name}
        </h1>
        <p className="max-w-2xl text-muted leading-7">{capability.description}</p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link to="/demo" className="text-accent hover:underline">
            Open live demo
          </Link>
          <a href={capability.docsPath} className="text-accent hover:underline">
            Full docs
          </a>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-fg">Live preview</h2>
        <SwitchboardProvider instance={demoSwitchboard}>
          <CapabilityPreview capabilityId={capability.id} />
        </SwitchboardProvider>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-fg">Drop into a component</h2>
        <CodeBlock code={capability.snippet} label="TypeScript" />
      </section>
    </div>
  );
};
