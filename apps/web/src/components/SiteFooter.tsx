export const SiteFooter = () => (
  <footer className="mt-20 border-t border-line pt-8 text-sm text-muted">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="font-medium text-fg">Switchboard</p>
        <p className="mt-1 max-w-md leading-6">
          MIT Licensed open-source developer tooling from{' '}
          <a
            href="https://www.mentorbridge.in"
            className="text-accent hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            MentorBridge
          </a>
          .
        </p>
      </div>
      <div className="flex flex-wrap gap-4">
        <a href="/docs/" className="hover:text-fg">
          Docs
        </a>
        <a
          href="https://github.com/senthilkumar979/switchboard"
          className="hover:text-fg"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <a
          href="https://github.com/senthilkumar979/switchboard/blob/main/CONTRIBUTING.md"
          className="hover:text-fg"
          target="_blank"
          rel="noreferrer"
        >
          Contributing
        </a>
      </div>
    </div>
  </footer>
);
