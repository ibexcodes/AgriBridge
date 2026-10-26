# AgriBridge Business Platform Blueprint

## Objective

Complete AgriBridge as a production-oriented Botswana agricultural marketplace with a reliable transaction loop, trusted communication, and differentiated discovery without reintroducing demo data.

## Delivery order

### 1. Transaction foundation

**Context:** Listings and orders exist in Supabase, but customers cannot create orders from the UI, cart state is absent, stock is not protected, and farmer status actions are incomplete.

**Work:**
- Add a typed cart and checkout flow for customers.
- Add an atomic Supabase order-creation function that validates active listings, farmer ownership, quantity, and total amount.
- Add order history and customer order status views.
- Add farmer approve, reject/cancel, and complete actions with guarded status transitions.
- Add quantity/availability fields and prevent self-purchase.
- Add explicit loading and mutation errors in screens.

**Verification:** lint, TypeScript, Android export, migration push, and manual customer-to-farmer order flow.

### 2. Trust and communication

**Context:** Conversations/messages tables exist, but the app only displays placeholder chat rows and has no notification or trust signals.

**Work:**
- Add conversation creation from listing detail.
- Add real-time message loading/sending and unread counts.
- Add in-app notifications for order and message events.
- Add farmer verification/profile completeness indicators.
- Add post-completion ratings and report/block actions.

**Verification:** RLS policy tests/queries, two-user conversation flow, notification read flow, and empty/error states.

### 3. Smart marketplace discovery

**Context:** Discovery currently filters only by category and title.

**Work:**
- Add location-aware search and distance-friendly sorting.
- Add seasonal/availability tags and “best match” explanations.
- Add rent-versus-buy guidance for machinery.
- Add related listings and supplier recommendations using deterministic signals first.
- Keep recommendations explainable and avoid inventing unavailable inventory.

**Verification:** deterministic unit tests for ranking, filter combinations, and mobile performance with long lists.

### 4. Operations and reliability

**Context:** The store owns data fetching and mutations in one component and refreshes broadly after each mutation.

**Work:**
- Split Supabase access into repositories/services.
- Add focused refresh and optimistic UI only where rollback is reliable.
- Add retry handling for transient reads/uploads.
- Add structured user-facing error states and offline-safe draft handling.
- Add analytics-safe event boundaries without collecting sensitive data.

**Verification:** typecheck, lint, export, failure-path tests, and no secret/config regressions.

### 5. Release hardening

**Work:**
- Reconcile and push migrations to the linked Supabase project.
- Run Expo Doctor and Android export.
- Verify auth, storage, RLS, checkout, messaging, and role-based flows on a device.
- Update README with the complete production workflow.

**Exit criteria:** no demo marketplace state is used by production screens, all core flows have explicit failure states, and `main` contains validated changes.

## Dependencies

`1 -> 2 -> 3`; `1 -> 4`; `2,3,4 -> 5`.

## Rollback

Each phase uses a separate migration and commit. Client changes are guarded by existing tables/functions and can be reverted independently; no destructive migration is permitted.
