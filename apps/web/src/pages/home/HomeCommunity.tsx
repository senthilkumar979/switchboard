export const HomeCommunity = () => (
  <section className="space-y-6">
    <div>
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-accent">
        Contribute
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-fg">MIT and free forever</h2>
      <p className="mt-2 max-w-2xl text-muted leading-7">
        Help grow Switchboard — docs, demos, adapters, and bug reports all help.
      </p>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <article className="rounded-2xl border border-line bg-surface/70 p-5">
        <h3 className="font-semibold text-fg">Contributors welcome</h3>
        <p className="mt-2 text-sm leading-6 text-muted">
          Tighten a demo, fix a typo, add a test, or document a gotcha you hit while integrating.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <a
            href="https://github.com/senthilkumar979/switchboard/blob/main/CONTRIBUTING.md"
            className="text-accent hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Contributing guide
          </a>
          <a
            href="https://github.com/senthilkumar979/switchboard/issues"
            className="text-accent hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Issues
          </a>
        </div>
      </article>
      <article className="rounded-2xl border border-line bg-surface/70 p-5">
        <h3 className="font-semibold text-fg">Used in demos &amp; teaching</h3>
        <p className="mt-2 text-sm leading-6 text-muted">
          Built for frontend teams and MentorBridge sessions — stars and “used in production” notes
          help others find it.
        </p>
        <a
          href="https://github.com/senthilkumar979/switchboard"
          className="mt-4 inline-block text-sm text-accent hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Star on GitHub
        </a>
      </article>
    </div>
  </section>
);
