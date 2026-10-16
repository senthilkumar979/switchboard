const SITE = 'https://switchboard.mentorbridge.in';
const DEFAULT_TITLE = 'Switchboard — frontend state under your control';
const DEFAULT_DESCRIPTION =
  'Inspect, simulate, and switch feature flags, users, scenarios, and API responses during development — without changing business logic.';

interface SeoInput {
  title?: string;
  description?: string;
  path?: string;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function applySeo({ title, description, path = '/' }: SeoInput) {
  const fullTitle = title ? `${title} · Switchboard` : DEFAULT_TITLE;
  const desc = description ?? DEFAULT_DESCRIPTION;
  const url = `${SITE}${path}`;

  document.title = fullTitle;
  setMeta('name', 'description', desc);
  setMeta('property', 'og:title', fullTitle);
  setMeta('property', 'og:description', desc);
  setMeta('property', 'og:url', url);
  setMeta('name', 'twitter:title', fullTitle);
  setMeta('name', 'twitter:description', desc);

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
}
