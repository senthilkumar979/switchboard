import { Link, NavLink } from 'react-router-dom';

import { BrandMark } from './BrandMark.js';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm transition ${isActive ? 'text-accent' : 'text-muted hover:text-fg'}`;

export const SiteNav = () => (
  <header className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
    <Link to="/" className="inline-flex">
      <BrandMark size="sm" />
    </Link>
    <nav className="flex flex-wrap items-center gap-5">
      <NavLink to="/demo" className={linkClass}>
        Demo
      </NavLink>
      <a href="/docs/" className="text-sm text-muted transition hover:text-fg">
        Docs
      </a>
      <a
        href="https://github.com/senthilkumar979/switchboard"
        target="_blank"
        rel="noreferrer"
        className="text-sm text-muted transition hover:text-fg"
      >
        GitHub
      </a>
      <Link
        to="/demo"
        className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-fg shadow-[0_10px_30px_-12px_rgba(15,118,110,0.8)]"
      >
        Try demo
      </Link>
    </nav>
  </header>
);
