# ADR 0001: Domain-Driven Frontend Structure

- Status: Accepted
- Date: 2026-02-21
- Deciders: Frontend Team

## Context

The codebase had grown around flat directories and broad utility files, which made ownership and reuse unclear.
As features expanded (posts, companies, search, auth, layout), it became harder to decide where new code should live.
This increased onboarding cost and made refactoring risky.

## Decision

Adopt a domain-driven structure for both UI and logic:

- `components/`
  - `auth/`, `category/`, `common/`, `company/`, `layout/`, `post/`, `providers/`, `search/`, `ui/`
- `lib/`
  - `posts/`, `companies/`, `search/`, `shared/`

Rules:

1. Page routing composition stays in `app/`.
2. Feature/domain logic is implemented in `lib/<domain>`.
3. Shared cross-domain concerns go to `lib/shared`.
4. UI composition lives in `components/<domain>`.
5. Reusable design primitives stay in `components/ui`.
6. New files must be placed in a domain package first; `shared` is a deliberate exception.

## Consequences

### Positive

- Clear ownership by domain.
- Faster navigation and onboarding.
- Better reuse through explicit boundaries.
- Lower chance of accidental cross-feature coupling.

### Negative

- More directories to manage.
- Initial migration overhead.
- Requires team discipline to keep boundaries clean.

## Alternatives Considered

1. Keep flat `components/` and `lib/` with naming conventions only.
  - Rejected: low enforcement and poor scalability.
2. Route-only co-location under `app/` for all logic.
  - Rejected: weak separation of UI composition and business logic.

## Follow-up Actions

1. Add ADR index and linking convention in `docs/README.md`.
2. Add lint/import boundary rules to discourage cross-domain leakage.
3. Update PR checklist to include “correct package placement”.
