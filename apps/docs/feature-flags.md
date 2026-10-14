# Feature Flags

Feature flags in Switchboard are **booleans** evaluated at runtime on the client. Use them to gate UI, not to enforce security.

## Registering flags

### Boolean shorthand

```ts
createSwitchboard({
  features: {
    newDashboard: false,
    darkModeNav: true,
  },
});
```

### Full definition

```ts
createSwitchboard({
  features: {
    betaBanner: {
      default: true,
      group: 'experiments',
      description: 'Show the beta announcement banner',
      environments: {
        staging: true,
        production: false,
      },
    },
  },
  environment: 'staging',
});
```

| Field | Description |
| --- | --- |
| `default` | Value when no override and no environment-specific default applies |
| `group` | Optional label for organizing flags in tooling |
| `description` | Human-readable notes |
| `environments` | Map of environment name → default boolean |

## Reading and writing

```ts
switchboard.isEnabled('newDashboard'); // boolean
switchboard.getFeature('newDashboard'); // boolean | undefined
switchboard.getFeatures(); // Record<string, boolean>

switchboard.setFeature('newDashboard', true);
switchboard.registerFeature('checkoutV2', { default: false, group: 'checkout' });
```

Unknown feature names: `isEnabled` returns `false`; `getFeature` returns `undefined`.

## Environment defaults

When you call `setEnvironment('staging')`, Switchboard reapplies environment presets (if configured) and re-resolves feature defaults from each definition’s `environments` map. Explicit overrides still win until cleared via `reset()` or by aligning the value with the resolved default.

## Metadata

```ts
const { featureMeta } = switchboard.getState();
featureMeta.betaBanner.isOverridden; // true if current ≠ resolved default
featureMeta.betaBanner.group;
featureMeta.betaBanner.description;
```

## React

```tsx
const { enabled, setEnabled, meta } = useFeatureFlag('newDashboard');
```

## Panel

The **Features** tab lists registered flags as switches. The tab is hidden when no features are configured.
