import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Switchboard',
  description: 'Universal development controls for frontend applications',
  base: '/docs/',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#0f766e' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:title', content: 'Switchboard' }],
    [
      'meta',
      {
        name: 'og:description',
        content: 'Inspect, simulate, and switch frontend states during development.',
      },
    ],
  ],
  themeConfig: {
    logo: undefined,
    siteTitle: 'Switchboard',
    nav: [
      { text: 'Home', link: 'https://switchboard.mentorbridge.in/' },
      { text: 'Demo', link: 'https://switchboard.mentorbridge.in/demo' },
      { text: 'Guide', link: '/getting-started' },
      { text: 'API', link: '/api-reference' },
      { text: 'Examples', link: '/examples' },
      { text: 'Roadmap', link: '/roadmap' },
    ],
    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'What is Switchboard?', link: '/introduction' },
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Installation', link: '/installation' },
          { text: 'Core Concepts', link: '/core-concepts' },
        ],
      },
      {
        text: 'Guides',
        items: [
          { text: 'Feature Flags', link: '/feature-flags' },
          { text: 'User Context', link: '/user-context' },
          { text: 'Environments & Persistence', link: '/environments-persistence' },
          { text: 'Scenarios', link: '/scenarios' },
          { text: 'Developer Panel', link: '/developer-panel' },
          { text: 'API Mocking', link: '/api-mocking' },
        ],
      },
      {
        text: 'Integrations',
        items: [
          { text: 'React', link: '/react' },
          { text: 'Vanilla JavaScript', link: '/vanilla' },
          { text: 'Angular', link: '/angular' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'API Reference', link: '/api-reference' },
          { text: 'Examples', link: '/examples' },
          { text: 'Roadmap', link: '/roadmap' },
          { text: 'Contributing', link: '/contributing' },
        ],
      },
    ],
    outline: { level: [2, 3] },
    search: { provider: 'local' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/senthilkumar979/switchboard' }],
    footer: {
      message: 'MIT Licensed open-source developer tooling',
      copyright: 'Switchboard contributors',
    },
    editLink: {
      pattern: 'https://github.com/senthilkumar979/switchboard/edit/main/apps/docs/:path',
      text: 'Edit this page',
    },
  },
});
