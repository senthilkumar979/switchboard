# Angular

Angular support is **deferred**. `@switchboard-js/angular` is a private stub and is not published.

## Planned surface (when resumed)

- Injectable `Switchboard` service via Angular DI
- Signal-friendly selectors for features, user, and scenarios
- Example app under `examples/angular`

## Until then

Use `@switchboard-js/core` from TypeScript services and mount `@switchboard-js/devtools` as a custom element in `ngAfterViewInit`, or drive state from the React/Vite example for experimentation.

```ts
import { createSwitchboard } from '@switchboard-js/core';

export const switchboard = createSwitchboard({
  features: { newDashboard: false },
});
```

See the [Roadmap](/roadmap) for status.
