# Nexus - AI Engineering Standards

This document defines the foundational mandates and expert procedures for AI-assisted development on the Nexus CRM project. These instructions take absolute precedence over general defaults.

## Project Context

Nexus is a multi-tenant CRM built with **Laravel 10**, **React 18**, **Inertia.js**, and **TypeScript**. It utilizes **Spatie Laravel Permission** for RBAC and **Laravel Scout (Meilisearch)** for search.

### Core Stack

-   **Backend**: PHP 8.1+, Laravel 10.x, MySQL, Meilisearch.
-   **Frontend**: React 18, Inertia.js, TypeScript, Tailwind CSS, shadcn/ui.
-   **Testing**: PHPUnit (Backend), Playwright (E2E).
-   **Tooling**: Vite, Laravel Pint, Prettier, Docker.

## Engineering Mandates

### 1. Multi-Tenancy & Data Isolation

-   **Strict Isolation**: All CRM entities (Contacts, Companies, Leads, Deals, Activities) MUST be scoped to an `organization_id`.
-   **Policy Enforcement**: Every controller action MUST verify authorization using Laravel Policies (`app/Policies`).
-   **Query Scoping**: Ensure all Eloquent queries include organization scoping, typically through the `organization_id` on the model or via relationships.

### 2. Frontend Development (React + Inertia)

-   **TypeScript**: ALL new frontend code MUST be written in TypeScript (`.tsx`, `.ts`). Strictly avoid `any`.
-   **shadcn/ui**: Use existing components in `resources/js/Components/ui`. When adding new UI elements, prefer extending shadcn primitives.
-   **Icons**: Use `lucide-react` for iconography.
-   **Routing**: Use the `route()` helper (Ziggy) for all internal links.
-   **Path Aliases**: Use `@/` to reference the `resources/js` directory.

### 3. Backend Development (Laravel)

-   **Type Hinting**: Use strict typing for all method signatures and return types.
-   **Enums**: Use Enums for statuses and permissions (`app/Enums`).
-   **Validation**: Use Form Requests for all non-trivial validation logic.
-   **Pint**: Run `vendor/bin/pint` before finalizing any PHP changes to ensure style consistency.

### 4. Search Implementation (Scout)

-   When modifying models that use `Searchable`, ensure `toSearchableArray()` is updated if necessary.
-   After schema changes affecting searchable fields, remind the user to run `php artisan scout:import`.

## Testing Standards & Practices

**Test-Driven Intent**: Always write tests when necessary or if the logic isn't already covered by existing tests BEFORE implementing a new feature.

### 1. Unit & Feature Testing (PHPUnit)

Backend tests must validate business logic, database interactions, and strict tenant isolation without relying on the UI.

-   **The AAA Pattern**: Structure all tests using Arrange, Act, and Assert blocks. Leave a blank line between each phase to ensure legibility.
-   **Tenant Isolation Assertions**: Every feature test touching tenant-scoped data MUST include a "cross-tenant" assertion. For example, explicitly test that `User A` (Org 1) receives a `403 Forbidden` or `404 Not Found` when attempting to read/update/delete a record belonging to `Org 2`.
-   **Factories over Mocks**: Prefer state-driven testing using Eloquent Factories over mocking, unless interacting with external third-party APIs. Use `RefreshDatabase` to ensure a clean state per test.
-   **Authorization & Policies**: Do not bypass policies in tests. Use actingAs() with a user that has the specific Spatie Roles/Permissions required for the endpoint.
-   **Testing Search (Scout)**: When testing Meilisearch integrations, mock the search engine or use the `scout:sync` queue driver during tests to prevent asynchronous indexing delays from causing flaky assertions.

### 2. End-to-End Testing (Playwright)

E2E tests treat the application as a black box, verifying the integration of Laravel, Inertia, React, and the database through critical user journeys.

-   **Resilient Selectors**: NEVER target elements by styling classes (e.g., `.bg-blue-500`). Use accessible locators (`getByRole`, `getByText`, `getByLabel`) as your first choice. If an element lacks clear accessibility semantics, use dedicated `data-testid` attributes.
-   **Inertia & Network Awareness**: Avoid fixed `page.waitForTimeout()` calls. Playwright must wait for actionable states. Because Inertia handles navigation via XHR, use `page.waitForResponse()` or wait for a specific DOM mutation (like a success toast) to confirm an action completed.
-   **Database Seeding**: E2E tests require a specific seeded state (e.g., `admin@example.com`). Because PHPUnit tests use `RefreshDatabase`, the database MUST be re-seeded (`php artisan migrate:fresh --seed`) after running backend tests and before starting E2E tests.
-   **Avoid Testing the Framework**: Do not write E2E tests to verify Laravel's validation rules unless the UI handles the error in a highly custom way. Basic validation should be covered by PHPUnit. E2E should focus on:
    -   User login & session persistence.
    -   Complex UI state changes (e.g., Kanban board drag-and-drop).
    -   Multi-step forms and Inertia modal interactions.

## Development Workflows

### Execution Phase: Plan -> Act -> Validate

1. **Plan**: Define the change and the testing strategy. Identify boundary cases (e.g., cross-tenant data access).
2. **Act**: Apply surgical changes.
    - **Test First**: If current coverage is insufficient, write the tests (PHPUnit and Playwright) before implementing the feature logic.
    - Use `docker compose exec app php artisan ...` for backend commands.
    - Use `npm run dev` for frontend development (HMR).
3. **Validate**:
    - **Automated Tests**: Use the NPM scripts to run the Dockerized test suite.
        - `npm run test:all`: Runs both PHPUnit and Playwright (re-seeds in between).
        - `npm run test:unit`: Runs PHPUnit tests only.
        - `npm run test:e2e`: Runs Playwright E2E tests only (includes seeding).
        - `npm run test:e2e:ui`: Launches Playwright UI mode (includes seeding).
    - **Frontend Build**: Run `docker compose exec app_test npm run build` to verify there are no compilation or bundling errors.
    - **Linting**: Run `vendor/bin/pint` and `npx prettier --write .`.

### Critical Commands

-   **Run All Tests**: `npm run test:all`
-   **Run Unit/Feature Tests**: `npm run test:unit`
-   **Run E2E Tests**: `npm run test:e2e`
-   **Artisan (Test Environment)**: `docker compose -f docker-compose.test.yml exec app_test php artisan [command]`
-   **Composer**: `docker compose exec app composer [command]`
-   **NPM**: `docker compose exec app npm [command]`
-   **Frontend Build**: `docker compose exec app npm run build`

## Security & Integrity

-   **Credential Protection**: Never touch `.env` files directly unless explicitly asked.
-   **Permission Mapping**: Refer to `app/Enums/*Permissions.php` when implementing role-based access checks.
