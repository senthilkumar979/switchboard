import { Link } from 'react-router-dom';

import { BrandMark } from '../components/BrandMark.js';
import { HomeBenefits } from './home/HomeBenefits.js';
import { HomeCapabilities } from './home/HomeCapabilities.js';
import { HomeCommunity } from './home/HomeCommunity.js';
import { HomeInstall } from './home/HomeInstall.js';

export const HomePage = () => (
  <div className="space-y-16">
    <header className="space-y-6">
      <BrandMark size="lg" />
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-accent">
        Universal development controls · React today
      </p>
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-fg md:text-5xl md:leading-[1.15]">
        Frontend state, under your control.
      </h1>
      <p className="max-w-2xl text-lg leading-8 text-muted">
        Inspect, simulate, and switch feature flags, users, scenarios, and API responses during
        development — without changing business logic.
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href="#install"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg shadow-[0_12px_36px_-14px_rgba(15,118,110,0.85)]"
        >
          Install
        </a>
        <Link
          to="/demo"
          className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm text-fg hover:bg-code"
        >
          Try live demo
        </Link>
        <a
          href="/docs/"
          className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm text-fg hover:bg-code"
        >
          Docs
        </a>
      </div>
      <p className="max-w-2xl text-sm leading-6 text-muted">
        Config lives in code. The panel is selection-only. Mount mocks and the drawer only in{' '}
        <span className="font-mono text-fg">DEV</span> builds.
      </p>
      <div className="flex flex-wrap gap-2 text-xs text-muted">
        <span className="rounded-full border border-line bg-surface px-3 py-1">@switchboard-js/core</span>
        <span className="rounded-full border border-line bg-surface px-3 py-1">@switchboard-js/react</span>
        <span className="rounded-full border border-line bg-surface px-3 py-1">
          @switchboard-js/devtools
        </span>
        <span className="rounded-full border border-line bg-surface px-3 py-1">
          @switchboard-js/api-mock
        </span>
      </div>
    </header>

    <HomeBenefits />
    <div id="install" className="scroll-mt-8">
      <HomeInstall />
    </div>
    <div id="capabilities" className="scroll-mt-8">
      <HomeCapabilities />
    </div>
    <div id="community" className="scroll-mt-8">
      <HomeCommunity />
    </div>
  </div>
);
