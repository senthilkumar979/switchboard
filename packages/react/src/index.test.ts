import { describe, expect, it } from 'vitest';

import { PACKAGE_NAME, PACKAGE_VERSION, createSwitchboard } from './index.js';

describe('@switchboard/react package', () => {
  it('exports package identity', () => {
    expect(PACKAGE_NAME).toBe('@switchboard/react');
    expect(PACKAGE_VERSION).toBe('0.0.0');
  });

  it('re-exports createSwitchboard', () => {
    const sb = createSwitchboard({
      features: { flag: true },
      persistence: false,
    });
    expect(sb.isEnabled('flag')).toBe(true);
  });
});
