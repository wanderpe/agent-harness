# Project: {{PROJECT_NAME}} (Laravel Backend)

## Stack
- **Framework**: Laravel 12 / 11, PHP 8.3+
- **Database / Cache**: PostgreSQL / MySQL, Redis
- **Authentication**: Laravel Passport (OAuth2) / Sanctum
- **Architecture**: Multi-Tenancy (stancl/tenancy or ScopedByClient)
- **Testing**: PHPUnit / Pest (`php artisan test`)
- **Code Quality**: PHPStan / Larastan, Laravel Pint

## Architecture Conventions
- `app/Services/`: Orchestrates domain business logic.
- `app/Actions/`: Atomic, reusable, single-responsibility business operations.
- `app/Http/Requests/`: Strict validation with Form Requests (never validate inside controllers).
- `app/Http/Resources/`: Strict API response transformation and schema serialization.
- `app/Policies/`: Authorization gates and permissions.

## Non-Negotiable Rules
1. **Tenancy Isolation**: Mandatory tenant scoping on all model queries.
2. **Atomic Writes**: Wrap all multi-model database writes in `DB::transaction()`.
3. **Optimized Queries**: Prevent N+1 queries using eager loading (`with()`), proper indexes, and `chunkById()` for large batches.
4. **Strict Types**: Use `declare(strict_types=1);` and enforce PHPStan baseline checks.

## Skills & Reference Rules
Review rules under `.agents/skills/laravel-best-practices/rules/` for comprehensive patterns:
- `advanced-queries.md`, `db-performance.md`, `caching.md`, `security.md`, `queue-jobs.md`, etc.

## Quick Commands
- Run Tests: `php artisan test`
- Run Single Test: `php artisan test --filter=ExampleTest`
- Static Analysis: `./vendor/bin/phpstan analyse`
- Code Formatter: `./vendor/bin/pint`
