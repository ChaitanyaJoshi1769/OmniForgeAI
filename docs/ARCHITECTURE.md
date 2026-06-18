# OmniForge AI - Architecture Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Core Architecture](#core-architecture)
4. [Module Structure](#module-structure)
5. [Data Flow](#data-flow)
6. [Security Architecture](#security-architecture)
7. [Scalability Considerations](#scalability-considerations)

## System Overview

OmniForge AI is a production-ready, enterprise-grade, multimodal AI platform designed to support:

- **Multiple Modalities**: Text, images, audio, video, 3D models, code, documents, and more
- **Model-Agnostic Architecture**: Support for OpenAI, Anthropic, Google, Stability AI, and custom models
- **Intelligent Orchestration**: Automatic routing to the best model for each task
- **Enterprise Features**: Multi-tenancy, RBAC, compliance, governance, analytics

### Key Principles

1. **Modularity**: Loosely coupled, highly cohesive modules
2. **Extensibility**: Plugin system for third-party integrations
3. **Scalability**: Cloud-native, distributed architecture
4. **Security**: Defense-in-depth, zero-trust architecture
5. **Observability**: Comprehensive logging, monitoring, and tracing
6. **Maintainability**: Clean code, comprehensive tests, clear documentation

## Technology Stack

### Frontend
- **Framework**: Next.js 16 + React 20
- **Language**: TypeScript
- **State Management**: Zustand + TanStack Query
- **Styling**: TailwindCSS + shadcn/ui
- **3D/Graphics**: Three.js, Fabric.js, Konva, PixiJS
- **Editors**: Monaco Editor, Tiptap, React Flow

### Backend
- **Runtime**: Node.js 20+
- **Framework**: NestJS 10
- **Language**: TypeScript 5
- **APIs**: GraphQL (Apollo), REST, gRPC
- **Architecture**: CQRS, Event-Driven, Hexagonal, Microservices-ready

### Data Layer
- **Relational**: PostgreSQL 16
- **Document**: MongoDB 7
- **Cache**: Redis 7
- **Search**: Elasticsearch 8
- **Vector DB**: Qdrant (semantic search)
- **Object Storage**: MinIO / AWS S3

### Infrastructure
- **Containers**: Docker
- **Orchestration**: Kubernetes + Helm
- **IaC**: Terraform + Pulumi
- **Service Mesh**: Istio (optional)
- **Message Queue**: NATS (event streaming)
- **GitOps**: ArgoCD

### Observability
- **Tracing**: Jaeger + OpenTelemetry
- **Metrics**: Prometheus
- **Dashboards**: Grafana
- **Logging**: Pino + ELK Stack

### AI/ML
- **LLM Routing**: LiteLLM
- **Model Serving**: vLLM, Ollama
- **Libraries**: Transformers, Diffusers
- **UI Generation**: ComfyUI, InvokeAI

## Core Architecture

### Monorepo Structure

```
OmniForgeAI/
├── apps/
│   ├── backend/          # NestJS main application
│   ├── frontend/         # Next.js frontend
│   └── worker/           # Background job processing
├── packages/
│   ├── sdk/              # TypeScript SDK for clients
│   ├── cli/              # Command-line interface
│   ├── shared/           # Shared types and utilities
│   └── plugins/          # Plugin SDK
├── libs/                 # Internal libraries
│   ├── common/           # Shared logic
│   ├── database/         # ORM abstractions
│   ├── auth/             # Authentication logic
│   └── ai/               # AI orchestration
├── infrastructure/       # IaC and deployment configs
│   ├── terraform/        # AWS/GCP infrastructure
│   ├── kubernetes/       # K8s manifests
│   └── helm/             # Helm charts
├── k8s/                  # Kustomize bases
├── docker/               # Dockerfiles
└── docs/                 # Documentation
```

### Domain-Driven Design

The backend follows Domain-Driven Design (DDD) principles with bounded contexts:

1. **Auth Context**: User authentication, authorization, API keys
2. **Workspace Context**: Organizations, workspaces, members, RBAC
3. **Asset Context**: Universal asset library, versioning, metadata
4. **AI Context**: Model routing, provider abstraction, orchestration
5. **Studio Context**: Creative tools (text, image, video, audio, etc.)
6. **Workflow Context**: Automation, triggers, scheduling
7. **Collaboration Context**: Real-time editing, comments, mentions
8. **Analytics Context**: Usage tracking, cost analysis, metrics

Each context has:
- **Entities**: Core domain objects
- **Value Objects**: Immutable objects
- **Repositories**: Data access abstractions
- **Services**: Business logic
- **Events**: Domain events for event sourcing
- **DTOs**: Data Transfer Objects
- **GraphQL Resolvers**: API endpoints

### Hexagonal Architecture

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (GraphQL, REST, gRPC Controllers)      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Application Layer               │
│  (Services, Command Handlers, Queries)  │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│          Domain Layer                   │
│  (Entities, Value Objects, Events)      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Infrastructure Layer               │
│  (Database, Cache, Storage, External)   │
└─────────────────────────────────────────┘
```

## Module Structure

### Authentication Module (`auth`)
Handles user authentication, OAuth, JWT, API keys, and multi-factor authentication.

**Key Components**:
- `User` Entity: Core user data
- `ApiKey` Entity: API key management
- `AuthService`: Business logic for auth flows
- `JwtStrategy`: Passport.js JWT strategy
- `AuthResolver`: GraphQL endpoints

**API Endpoints**:
- `POST /auth/register`: User registration
- `POST /auth/login`: User login
- `POST /auth/refresh`: Token refresh
- `POST /auth/logout`: Session termination
- `GET /auth/me`: Current user info

### Workspace Module (`workspace`)
Manages organizations, workspaces, members, and role-based access control.

**Key Components**:
- `Organization` Entity: Organization data
- `Workspace` Entity: Workspace data
- `OrganizationMember` Entity: Organization membership
- `WorkspaceMember` Entity: Workspace membership
- `WorkspaceService`: Business logic
- `WorkspaceResolver`: GraphQL endpoints

**API Endpoints**:
- `POST /workspaces`: Create workspace
- `GET /workspaces`: List workspaces
- `GET /workspaces/:id`: Get workspace
- `PUT /workspaces/:id`: Update workspace
- `DELETE /workspaces/:id`: Delete workspace

### Asset Module (`asset`)
Manages the universal asset library with versioning and semantic search.

**Key Components**:
- `Asset` Entity: Asset metadata
- `AssetVersion` Entity: Version history
- `AssetRepository`: Data access
- `AssetService`: Business logic
- `AssetResolver`: GraphQL endpoints

**Features**:
- Multi-modality support (text, image, video, audio, 3D, code, etc.)
- Version control and rollback
- Semantic search with vector embeddings
- Full-text search with Elasticsearch
- S3/MinIO integration for storage
- Metadata tagging and collections

### Health Module (`health`)
Provides health checks for the application and dependencies.

**Endpoints**:
- `GET /health`: Application health status
- `GET /health/ready`: Readiness probe

## Data Flow

### User Registration Flow

```
1. User submits registration form
2. Frontend validates input
3. POST /auth/register with credentials
4. Backend validates uniqueness
5. Hash password with bcrypt
6. Create user in database
7. Generate JWT tokens
8. Return tokens to client
9. Client stores tokens in secure storage
10. Redirect to dashboard
```

### Asset Upload Flow

```
1. User selects file for upload
2. Frontend validates file (size, type)
3. Request presigned S3/MinIO URL from backend
4. Upload file directly to S3/MinIO
5. Frontend notifies backend of upload completion
6. Backend validates upload
7. Extract metadata (dimensions, duration, etc.)
8. Generate thumbnail/preview
9. Create asset record in database
10. Trigger embedding generation for semantic search
11. Return asset details to frontend
```

### Model Routing Flow

```
1. User initiates task (e.g., "generate image")
2. Request reaches AI orchestration layer
3. Analyze task requirements:
   - Input modality
   - Output modality
   - Quality requirements
   - Cost preferences
   - Latency constraints
4. Consult model routing rules
5. Query provider availability and pricing
6. Route to optimal provider (e.g., Stability AI for images)
7. Handle provider-specific requirements
8. Stream response back to client
9. Log usage for billing and analytics
10. Update model performance metrics
```

## Security Architecture

### Authentication & Authorization

- **OAuth 2.0**: Multi-provider support (Google, GitHub, Microsoft, Apple)
- **JWT**: Stateless authentication with short-lived access tokens
- **Session Management**: Secure, httpOnly cookies
- **MFA**: Multi-factor authentication support
- **RBAC**: Role-Based Access Control at org and workspace levels
- **ABAC**: Attribute-Based Access Control for fine-grained permissions

### Data Protection

- **Encryption at Rest**: Database encryption, S3 server-side encryption
- **Encryption in Transit**: TLS 1.3 for all communications
- **Secrets Management**: Vault or AWS Secrets Manager
- **Input Validation**: Comprehensive validation at API boundaries
- **Output Encoding**: Protection against XSS attacks
- **SQL Injection Prevention**: Parameterized queries, ORM usage

### Infrastructure Security

- **Zero-Trust Architecture**: Verify every request
- **Network Segmentation**: VPC isolation, security groups
- **DDoS Protection**: Rate limiting, Cloudflare integration
- **API Security**: API key rotation, IP whitelisting
- **Audit Logging**: Comprehensive audit trails

## Scalability Considerations

### Horizontal Scaling

- **Stateless Services**: All services are stateless and horizontally scalable
- **Database Replication**: Read replicas for scaling read-heavy workloads
- **Cache Layers**: Redis for session and cache layer
- **Message Queues**: NATS for asynchronous processing
- **Load Balancing**: Kubernetes ingress or cloud load balancer

### Performance Optimization

- **Caching Strategy**:
  - Response caching for GraphQL queries
  - Database query caching
  - Asset CDN distribution
- **Database Optimization**:
  - Indexing strategy for common queries
  - Query optimization
  - Connection pooling
- **Pagination**: Cursor-based pagination for large result sets
- **Lazy Loading**: Load related data on demand

### Monitoring & Observability

- **Distributed Tracing**: Track requests across services
- **Metrics Collection**: Prometheus for infrastructure metrics
- **Custom Metrics**: Application-specific metrics
- **Alerting**: Automated alerts for anomalies
- **Dashboards**: Real-time visibility into system health

## Deployment Architecture

### Development Environment
- Docker Compose for local development
- All services running locally
- Hot reload for code changes

### Staging Environment
- Kubernetes cluster with 3+ nodes
- Database replication
- Load balancer
- Blue-green deployment strategy

### Production Environment
- Multi-region Kubernetes clusters
- Managed database services (RDS/Cloud SQL)
- CDN for static assets
- Backup and disaster recovery
- Canary deployments

## API Design

### GraphQL
- Auto-generated schema from TypeScript types
- Real-time subscriptions via WebSocket
- Optimistic updates on client
- Error handling with Apollo Client

### REST
- OpenAPI/Swagger documentation
- Standard HTTP status codes
- Pagination with cursor support
- Versioning via Accept header

### gRPC (for internal services)
- Efficient binary protocol
- Streaming support
- Service-to-service communication
- Protobuf definitions

---

For more details, see:
- [API Reference](./API.md)
- [Developer Guide](./DEVELOPER_GUIDE.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Security Guide](./SECURITY.md)
