# Tech Stack & Build System

## Backend (Python)

- Language: Python 3.12
- Web framework: Tornado (async HTTP handlers)
- ORM: SQLAlchemy 1.3
- Migrations: Alembic
- Databases: MariaDB (MySQL), MongoDB (pymongo), ClickHouse, InfluxDB, Redis
- Message broker: RabbitMQ (via Kombu)
- Configuration: etcd (via custom config_client)
- Package manager: `uv` (with `pyproject.toml` and `uv.lock` per service)
- Linting: pylint, pycodestyle (max line length 120)
- Testing: pytest (with pytest-xdist for parallel), freezegun, mongomock
- API docs: Swagger (auto-generated via `write_spec.py`)

## Frontend (TypeScript/React)

- Language: TypeScript 5.7
- Framework: React 18
- UI library: MUI (Material UI) 5
- State management: Redux + Redux Persist + Reselect
- Routing: React Router 6
- API layer: Apollo Client (GraphQL) + Axios (REST)
- GraphQL codegen: `@graphql-codegen/cli` generating typed hooks
- Charts: Nivo, Plotly, deck.gl
- Forms: React Hook Form
- i18n: react-intl
- Build tool: Vite (with SWC plugin)
- Package manager: pnpm 10.12 (workspace monorepo)
- Node version: 22.16.0
- Linting: ESLint 9 (custom `@hystax/eslint-config-ui`)
- Formatting: Prettier (printWidth 128, double quotes, trailing commas es5)
- Testing: Vitest + jsdom
- Storybook: v8.6

## BFF (Backend for Frontend)

- Located in `ngui/server/`
- Apollo Server 4 with Express
- GraphQL schema with typed resolvers (codegen generates types)
- Proxies REST API calls to backend services

## Infrastructure & Deployment

- Containerization: Docker (one Dockerfile per service)
- Orchestration: Kubernetes (deployed via Helm-like charts in `optscale-deploy/`)
- Provisioning: Ansible + Vagrant
- Build script: `./build.sh [component] [tag] [--no-cache]`

## Common Commands

### Frontend (ngui/)
```bash
pnpm install                    # Install dependencies
pnpm dev                        # Start dev server + codegen watch
pnpm build                      # Production build (ui + server)
pnpm check                      # Lint all packages
pnpm fix                        # Auto-fix lint + formatting
pnpm codegen                    # Generate GraphQL types/hooks
```

### Frontend UI (ngui/ui/)
```bash
pnpm test                       # Run vitest (watch mode)
pnpm lint                       # ESLint
pnpm type:check                 # TypeScript type checking
pnpm storybook                  # Launch Storybook on port 9009
pnpm translate:check            # Check translation file formatting
```

### Backend (per service, e.g. rest_api/)
```bash
uv --project rest_api sync      # Install dependencies
uv --project rest_api run pytest -n auto rest_api  # Run tests
uv --project rest_api run pycodestyle --max-line-length=120 rest_api
uv --project rest_api run pylint --fail-under=9 .
```

### Docker builds
```bash
./build.sh rest_api local       # Build a single service image
./build.sh ngui local           # Build the frontend image
```

### Running tests via Docker (CI pattern)
Each service has a `run_test.sh` that builds a test Docker image and runs linting + unit tests inside it.
```bash
bash rest_api/run_test.sh
bash ngui/run_test.sh
```
