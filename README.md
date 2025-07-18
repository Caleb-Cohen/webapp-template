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

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
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
├── styles/                # Global styles
├── types/                 # TypeScript definitions
├── hooks/                 # Custom React hooks
├── constants/             # App constants
└── utils/                 # Utility functions
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Package Manager**: pnpm
- **Linting**: ESLint 9 + Prettier
- **Git Hooks**: Husky + lint-staged
- **Development**: Turbopack

## License

MIT
