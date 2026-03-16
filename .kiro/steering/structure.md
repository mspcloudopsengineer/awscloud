# Project Structure

## Architecture

OptScale is a microservices monorepo. Each top-level directory is typically a standalone service with its own Dockerfile, dependencies, and tests.

## Top-Level Layout

```
├── ngui/                    # Frontend monorepo (pnpm workspace)
│   ├── ui/                  # React SPA (Vite + TypeScript)
│   │   └── src/
│   │       ├── components/  # Reusable UI components (one folder per component)
│   │       ├── containers/  # Data-fetching wrappers connecting components to APIs
│   │       ├── pages/       # Route-level page components
│   │       ├── graphql/     # GraphQL queries + codegen output
│   │       ├── api/         # REST API utilities
│   │       ├── hooks/       # Custom React hooks
│   │       ├── reducers/    # Redux reducers
│   │       ├── services/    # Service layer
│   │       ├── utils/       # Shared utilities, constants, route definitions
│   │       ├── translations/# i18n JSON files
│   │       └── stories/     # Storybook stories
│   └── server/              # BFF - Apollo GraphQL server (Express + TypeScript)
│       └── graphql/         # Schema definitions, resolvers, generated types
│
├── rest_api/                # Main REST API (Tornado + SQLAlchemy)
│   └── rest_api_server/
│       ├── controllers/     # Business logic
│       ├── handlers/        # HTTP request handlers (v1, v2)
│       ├── models/          # SQLAlchemy models
│       ├── swagger/         # API spec
│       └── tests/           # Unit tests
│
├── auth/                    # Authentication service (Tornado)
│   └── auth_server/         # Same controller/handler/model pattern
│
├── optscale_client/         # Internal Python client libraries
│   ├── auth_client/
│   ├── config_client/
│   ├── rest_api_client/
│   ├── herald_client/
│   └── ...                  # One client per service
│
├── tools/                   # Shared Python libraries
│   ├── cloud_adapter/       # Multi-cloud provider abstraction
│   ├── optscale_exceptions/
│   ├── optscale_types/
│   ├── optscale_time/
│   └── optscale_password/
│
├── docker_images/           # Auxiliary services (schedulers, workers, observers)
│   ├── resource_discovery/
│   ├── resource_observer/
│   ├── power_schedule/
│   └── ...
│
├── diworker/                # Data import worker
├── diproxy/                 # Data import proxy
├── bumiworker/              # Optimization recommendation worker
├── bumischeduler/           # Optimization scheduler
├── bi_exporter/             # Business Intelligence export
├── herald/                  # Notification service
├── keeper/                  # ML profiling data store
├── katara/                  # Report/schedule service
├── insider/                 # Cloud pricing data
├── metroculus/              # Metrics collection
├── slacker/                 # Slack integration
├── jira_bus/                # Jira integration
├── gemini/                  # S3 duplicate finder
├── risp/                    # Reserved instance/savings plan processing
├── trapper/                 # ML task trapping
├── subspector/              # Subscription inspector
│
├── optscale-deploy/         # Kubernetes deployment configs
│   ├── ansible/
│   └── optscale/            # Helm-style chart templates
│
└── build.sh                 # Docker image build script
```

## Backend Service Pattern

Each Python service follows a consistent structure:
```
service_name/
├── service_name/
│   ├── controllers/     # Business logic classes
│   ├── handlers/        # Tornado HTTP handlers (v1/, v2/)
│   ├── models/          # SQLAlchemy ORM models
│   ├── swagger/         # OpenAPI spec files
│   ├── tests/           # pytest test files
│   ├── server.py        # Tornado app entry point
│   ├── constants.py     # URL patterns and constants
│   └── exceptions.py    # Custom exception classes
├── Dockerfile
├── Dockerfile_tests
├── pyproject.toml
├── uv.lock
└── run_test.sh
```

## Frontend Component Pattern

The UI follows a Pages → Containers → Components architecture:
- `pages/` - Route entry points, minimal logic
- `containers/` - Data fetching (GraphQL hooks, API calls), passes data to components
- `components/` - Pure presentational components, one folder per component with an `index.ts` barrel export

GraphQL workflow: `.graphql` query files → codegen → typed hooks in `graphql/__generated__/hooks/`
