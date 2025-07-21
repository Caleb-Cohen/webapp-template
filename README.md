# Webapp Template

A production-ready Next.js 15 template with modern tooling and best practices.

## Features

- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Atomic Design** component structure
- **ESLint 9** with strict rules
- **Prettier** for code formatting
- **Husky** + **lint-staged** for commit hooks
- **Turbopack** for fast development
- **Prisma ORM** with PostgreSQL
- **Redis** integration for caching and data store
- **GitHub Actions** for CI/CD
- **Docker** for production deployment

## Quick Start

```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Edit .env with your database and Redis URLs
# For Docker Compose, also set POSTGRES_PASSWORD to a secure value

# Setup database
pnpm docker:up
pnpm db:generate
pnpm db:push

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Or run with Docker
pnpm docker:prod:build
```

## Development Workflow

### Code Quality Checks

```bash
# Run all checks
pnpm check

# Individual checks
pnpm lint        # ESLint
pnpm typecheck   # TypeScript
pnpm format      # Prettier formatting
```

### Database Management

```bash
# Generate Prisma client
pnpm db:generate

# Push schema changes to database
pnpm db:push

# Create and run migrations
pnpm db:migrate

# Open Prisma Studio
pnpm db:studio
```

### Redis Management

- Redis is included in `docker-compose.yml` and runs on `localhost:6379` by default.
- The Redis connection string is set via `REDIS_URL` in your `.env` file:
  ```
  REDIS_URL="redis://localhost:6379"
  ```
- A health check API route is available at `/api/redis`.

### Docker Management

```bash
# Development environment
pnpm docker:up          # Start dev services (PostgreSQL, Redis)
pnpm docker:down        # Stop dev services
pnpm docker:logs        # View logs
pnpm docker:reset       # Reset and restart services

# Production environment
pnpm docker:build       # Build production image
pnpm docker:prod        # Run production stack
pnpm docker:prod:build  # Build and run production stack
```

### Git Hooks

This project uses **Husky** and **lint-staged** to ensure code quality:

- **Pre-commit**: Automatically runs ESLint and Prettier on staged files
- **Commit-msg**: Validates commit message format

### Commit Message Format

Use conventional commit format:

```
type(scope): description

Examples:
feat: add user authentication
fix(auth): resolve login issue
docs: update README
style: format code
refactor: improve component structure
test: add unit tests
chore: update dependencies
```

## Database Setup

### Option 1: Local PostgreSQL

1. Install PostgreSQL locally (or use Docker Compose)
2. Create a database: `createdb webapp_template`
3. Update `.env`:
   ```
   DATABASE_URL="***REMOVED***ql://***REMOVED***:***REMOVED***@localhost:5432/webapp_template"
   ```

### Option 2: Cloud Database (Recommended)

Use a cloud PostgreSQL service like:

- **Supabase** (free tier available)
- **Neon** (free tier available)
- **Railway** (free tier available)
- **Render** (free tier available)

1. Create a PostgreSQL database
2. Copy the connection string to your `.env` file
3. Run `pnpm db:push` to create tables

### Option 3: Prisma Accelerate

1. Sign up at [Prisma Accelerate](https://cloud.prisma.io)
2. Create a new project
3. Copy the connection string to your `.env` file
4. Run `pnpm db:push` to create tables

## Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── atoms/             # Basic building blocks
│   ├── molecules/         # Simple combinations
│   ├── organisms/         # Complex UI sections
│   └── templates/         # Page layouts
├── lib/                   # Utilities and clients
│   ├── db.ts             # Database client
│   └── redis.ts          # Redis client
├── styles/                # Global styles
├── types/                 # TypeScript definitions
├── hooks/                 # Custom React hooks
├── constants/             # App constants
└── utils/                 # Utility functions
prisma/
├── schema.prisma          # Database schema
└── migrations/            # Database migrations
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Package Manager**: pnpm
- **Linting**: ESLint 9 + Prettier
- **Git Hooks**: Husky + lint-staged
- **Development**: Turbopack
- **Database**: PostgreSQL + Prisma ORM
- **Cache/Store**: Redis (ioredis)
- **CI/CD**: GitHub Actions
- **Deployment**: Docker + Docker Compose

## API Routes

- `GET /api/hello` - Returns hello message and database status
- `GET /api/redis` - Returns Redis health check

## License

MIT
