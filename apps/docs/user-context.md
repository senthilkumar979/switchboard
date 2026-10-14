# User Context

User context is a **development simulation** of the attributes your UI reads (role, permissions, display name, etc.). It is not authentication and must not replace server-side authorization.

## Shape

```ts
interface UserContext {
  id?: string;
  name?: string;
  role?: string;
  permissions?: string[];
  [key: string]: unknown; // custom fields allowed
}
```

## Configure at startup

```ts
createSwitchboard({
  user: {
    id: 'dev-1',
    name: 'Alex',
    role: 'admin',
    permissions: ['read', 'write', 'billing'],
    locale: 'en-US',
  },
});
```

## Runtime API

```ts
switchboard.getUser();
switchboard.setUser({ role: 'customer' }); // merges partial updates
switchboard.resetUser(); // restores the configured default user
```

## Scenarios

Scenarios can include a `user` object. Activating the scenario applies that user to the instance.

## React

```tsx
const { user, setUser, resetUser } = useUserContext();
```

## Panel

The **User** tab is shown when the configured user (or any scenario user) has real values (`id`, `name`, `role`, permissions, or custom keys).

- Identity fields are read-only in the panel
- **Role** is selectable via radio options derived from the current user and scenario users
- **Reset user** restores defaults

There is no free-text editing of user fields in the panel — change defaults in code or via scenarios.
