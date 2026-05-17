# @emprinte/types (landing copy)

Shared contracts for **emprinte** landing/admin and **emprinte-readers-hub** mobile.

Canonical copy for mobile/EAS: `emprinte-readers-hub/packages/emprinte-types`.

When types change, sync from mobile (or mono `packages/emprinte-types`):

```bash
rsync -a emprinte-readers-hub/packages/emprinte-types/ emprinte/packages/emprinte-types/ --exclude node_modules
```
