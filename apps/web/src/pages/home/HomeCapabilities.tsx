import { Link } from 'react-router-dom';

import { capabilities } from '../../capabilities.js';

export const HomeCapabilities = () => (
  <section className="space-y-6">
    <div>
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-accent">
        Capabilities
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-fg">
        Browse what you can control
      </h2>
      <p className="mt-2 max-w-2xl text-muted leading-7">
        Each capability has a live preview, a short description, and a snippet you can paste into
        your app.
      </p>
    </div>
    <ul className="grid gap-3 sm:grid-cols-2">
      {capabilities.map((cap) => (
        <li key={cap.id}>
          <Link
            to={`/capabilities/${cap.id}`}
            className="block h-full rounded-2xl border border-line bg-surface/70 p-5 transition hover:border-accent/40 hover:bg-accent-soft/40"
          >
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-accent">
              {cap.eyebrow}
            </p>
            <h3 className="mt-2 text-base font-semibold text-fg">{cap.name}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{cap.summary}</p>
          </Link>
        </li>
      ))}
    </ul>
  </section>
);
