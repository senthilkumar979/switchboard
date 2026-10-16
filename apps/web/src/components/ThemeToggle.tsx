import { useEffect, useState } from 'react';

import { applyTheme, readTheme, type Theme } from '../theme.js';

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const initial = readTheme();
    applyTheme(initial);
    setTheme(initial);
  }, []);

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed right-4 top-4 z-40 rounded-full border border-line bg-surface/90 px-3 py-1.5 text-xs font-medium text-fg backdrop-blur hover:bg-code"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
};
