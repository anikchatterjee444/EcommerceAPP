# Agent Instructions

This repo is worked on by both a human developer and OpenCode CLI (v1.17.14) agents.

## Architecture (do not violate)

```
Controller -> AuthService -> UsersService -> PrismaService -> PostgreSQL
```

- Only `PrismaService` may import `PrismaClient` / talk to the database.
- Controllers contain no business logic — validate, delegate, return.
- All request bodies are validated with `class-validator` DTOs + the global `ValidationPipe`.
- Passwords are always hashed with bcrypt in `AuthService` before reaching `UsersService`.
- Password hashes are never returned in an HTTP response.

## Workflow

1. Run the `plan` agent before starting any sprint or task.
2. Run the `build` agent for exactly one task at a time (see commit messages below).
3. Work happens on a `feature/*` branch, never on `main`.
4. Every task ends in a small, working commit — never a broken intermediate state.

## Sprint 2 task -> commit message map

| Task | Commit message |
|---|---|
| Prisma layer | `feat(prisma): add Prisma service and module` |
| Users module | `feat(users): create users module and service` |
| Auth registration | `feat(auth): implement user registration` |
| Tests | `test(auth): add registration tests` |
