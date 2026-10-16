const benefits = [
  {
    title: 'Runtime feature flags',
    body: 'Toggle flags in the panel or from hooks. Groups, environment defaults, and override tracking stay local.',
  },
  {
    title: 'User simulation',
    body: 'Swap roles and permissions without real auth. Exercise every gated path in seconds.',
  },
  {
    title: 'Named scenarios',
    body: 'One click activates flags, user, and API mocks together — ready for demos and QA.',
  },
  {
    title: 'Panel + API mocks',
    body: 'Selection-only drawer for activation. Fetch interception for pathname mocks, opt-in for development.',
  },
];

export const HomeBenefits = () => (
  <section className="space-y-6">
    <div>
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-accent">
        Why Switchboard
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-fg">
        Local controls next to your app
      </h2>
      <p className="mt-2 max-w-2xl text-muted leading-7">
        Stop bouncing between remote flag dashboards, hand-edited fixtures, and rebuilds just to try
        another role.
      </p>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      {benefits.map((item) => (
        <article key={item.title} className="rounded-2xl border border-line bg-surface/70 p-5">
          <h3 className="text-base font-semibold text-fg">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
        </article>
      ))}
    </div>
  </section>
);
