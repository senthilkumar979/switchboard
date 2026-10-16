import type { ReactNode } from 'react';

import { SiteFooter } from './SiteFooter.js';
import { SiteNav } from './SiteNav.js';
import { ThemeToggle } from './ThemeToggle.js';

interface LayoutProps {
  children: ReactNode;
  wide?: boolean;
}

export const Layout = ({ children, wide = false }: LayoutProps) => (
  <div className={`mx-auto min-h-screen px-5 py-6 sm:px-8 ${wide ? 'max-w-6xl' : 'max-w-4xl'}`}>
    <ThemeToggle />
    <SiteNav />
    <main>{children}</main>
    <SiteFooter />
  </div>
);
