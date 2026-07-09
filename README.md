# E-Commerce App (Internship Project)

Production-style e-commerce app built with:

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Backend:** NestJS 11, TypeScript
- **Database:** PostgreSQL 16 via Prisma 7
- **Auth:** bcrypt password hashing (JWT arrives in the Login sprint)
- **Infra:** Docker Compose (PostgreSQL)

## Structure

```
app/
├── backend/     NestJS API
├── frontend/    Next.js app
├── docker-compose.yml
├── opencode.json + .opencode/agents/   OpenCode plan/build agents
└── AGENTS.md    Architecture rules for AI agents working on this repo
```

## Architecture

```
Controller -> AuthService -> UsersService -> PrismaService -> PostgreSQL
```

`AuthService` never touches Prisma directly — it only knows `UsersService`.
`PrismaService` is the single point of contact with the database.

## Getting started

```bash
# 1. Start Postgres
docker compose up -d

# 2. Backend
cd backend
cp .env.example .env
npm install
npm run prisma:migrate   # creates the users table
npm run start:dev        # http://localhost:3001

# 3. Frontend (separate terminal)
cd frontend
npm install
npm run dev               # http://localhost:3000
```

## Sprint roadmap

| Sprint | Scope | Status |
|---|---|---|
| 1 | Database (Docker, Postgres, Prisma, User model) | ✅ Done |
| 2 | Authentication (Prisma service, Users module, Register API, tests) | ✅ Scaffolded |
| 3 | Products | ⏳ |
| 4 | Cart | ⏳ |
| 5 | Orders | ⏳ |
| 6 | Frontend integration | ⏳ |

## API — Sprint 2

`POST /auth/register`

```json
{
  "email": "user@example.com",
  "password": "supersecret123",
  "name": "Optional Name"
}
```

Returns `201` with `{ message, user }` (no password), `409` on duplicate email,
`400` on validation failure (e.g. password under 8 characters).

## Git workflow

Feature branches only, never commit to `main` directly:

```
main -> feature/database -> PR -> merge -> feature/auth -> PR -> merge -> ...
```
