# 🛒 E-Commerce API

A modular REST API for an e-commerce platform built with NestJS. The application provides user registration and email verification, JWT-based authentication, product management, Redis-backed sessions and caching, and authenticated shopping carts.

## ✨ Features

- User registration with Argon2 password hashing
- Email verification with time-limited Redis tokens
- Login, refresh-token, and logout flows
- HTTP-only refresh-token cookies
- Role-based access control for administrators
- Product CRUD operations with pagination
- Redis caching for individual products
- Authenticated shopping carts and cart-item management
- Stock and product-availability checks when adding or updating cart items
- MySQL persistence through TypeORM migrations
- Health checks for MySQL and Redis
- Global request validation and throttling
- Swagger/OpenAPI documentation
- Docker Compose setup for the API, MySQL, and Redis

## 🛠 Tech Stack

- **Runtime:** Node.js 24, TypeScript
- **Framework:** NestJS 11
- **Database:** MySQL 8.4
- **ORM:** TypeORM
- **Cache and sessions:** Redis 7
- **Authentication:** Passport, JWT, Argon2
- **Validation:** `class-validator`, `class-transformer`, Joi
- **Email:** Nodemailer, `@nestjs-modules/mailer`, EJS templates
- **API documentation:** Swagger / OpenAPI
- **Package manager:** pnpm
- **Testing:** Jest, Supertest
- **Containerization:** Docker and Docker Compose

## 🏗 Architecture

The project follows a modular NestJS architecture. Controllers expose HTTP endpoints, providers contain application use cases, entities describe persistence models, and shared guards/decorators provide cross-cutting authentication behavior.

```text
Client
  |
  v
NestJS HTTP API (/api/v1)
  |
  +--> AuthModule ------> UsersModule ------> MySQL
  |        |
  |        +-------------> Redis sessions and verification tokens
  |        +-------------> MailModule / SMTP
  |
  +--> ProductModule ---> MySQL
  |        |
  |        +-------------> Redis product cache
  |
  +--> CartModule ------> MySQL
  |        |
  |        +-------------> ProductModule for product and stock checks
  |
  +--> HealthModule ----> MySQL and Redis health indicators
```

## 📊 Architecture Diagram

```mermaid
flowchart LR
    Client[Web or Mobile Client] --> API[NestJS API\n/api/v1]
    API --> Auth[Auth Module]
    API --> Users[Users Module]
    API --> Products[Product Module]
    API --> Cart[Cart Module]
    API --> Health[Health Module]
    Auth --> DB[(MySQL)]
    Users --> DB
    Products --> DB
    Cart --> DB
    Auth --> Redis[(Redis)]
    Products --> Redis
    Auth --> Mail[SMTP / Mailtrap]
    Health --> DB
    Health --> Redis
```

## 📁 Project Structure

```text
src/
├── auth/                 Authentication, JWT strategy, sessions, email verification
├── cart/                 Cart and cart-item controllers, entities, and providers
├── config/               Environment-backed application configuration
├── database/             TypeORM data source and migrations
├── health/               MySQL and Redis health checks
├── mail/                 Mail module, service, and EJS templates
├── product/              Product CRUD, entities, providers, and cache service
├── redis/                Global Redis module and Redis service
├── shared/               Guards and request decorators
├── users/                User management, entities, DTOs, and providers
├── app.module.ts         Root module and global configuration
└── main.ts               Application bootstrap, validation, Swagger, and server setup
```

## 🗄 Database Design

The application uses four main tables:

- **users:** identity, credentials, role, and email-verification state
- **products:** product details, price, stock, category, active state, and creator
- **carts:** one cart per user
- **cart_items:** products and quantities belonging to a cart

Important relationships:

- One user can create many products.
- One user has at most one cart.
- One cart has many cart items.
- Each cart item references one product.
- Deleting cart items when a cart is deleted is configured with cascade behavior.
- Product and user deletion are currently restricted by related foreign keys.

The schema is created and changed through TypeORM migrations. Runtime synchronization is disabled with `synchronize: false`.

## 📊 ER Diagram

```mermaid
erDiagram
    USERS ||--o{ PRODUCTS : creates
    USERS ||--o| CARTS : owns
    CARTS ||--o{ CART_ITEMS : contains
    PRODUCTS ||--o{ CART_ITEMS : referenced_by

    USERS {
        uuid id PK
        varchar firstName
        varchar lastName
        varchar email UK
        varchar password
        enum role
        boolean isEmailVerified
        timestamp created_at
        timestamp updated_at
    }

    PRODUCTS {
        uuid id PK
        varchar name
        text description
        decimal price
        int stock
        boolean isActive
        enum category
        uuid created_by FK
        timestamp created_at
        timestamp updated_at
    }

    CARTS {
        uuid id PK
        uuid user_id FK UK
        timestamp created_at
        timestamp updated_at
    }

    CART_ITEMS {
        uuid id PK
        uuid cart_id FK
        uuid product_id FK
        int quantity
    }
```

## 🔐 Authentication & Authorization

Authentication uses two JWT types:

- **Access token:** short-lived token returned in the login response and sent with `Authorization: Bearer <token>`.
- **Refresh token:** longer-lived token stored in an HTTP-only cookie named `refresh_token`.

The JWT strategy extracts the access token from the Authorization header and places the authenticated `userId` and `role` on the request.

Authorization is enforced with:

- `JwtAuthGuard` for authenticated routes
- `RolesGuard` and `@Roles(UserRole.ADMIN)` for administrator routes
- `@Authorized('userId')` to access the authenticated user id in controllers

Administrator emails are configured through `ADMIN_EMAILS` during registration.

## 📊 Authentication Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant A as API
    participant DB as MySQL
    participant R as Redis
    participant M as Mail Server

    C->>A: POST /auth/register
    A->>DB: Create unverified user
    A->>R: Store verification token (10 min)
    A->>M: Send verification email
    A-->>C: Registration successful

    C->>A: GET /auth/verify-email?token=...
    A->>R: Validate and consume token
    A->>DB: Mark email as verified
    A-->>C: Email verified

    C->>A: POST /auth/login
    A->>DB: Validate credentials
    A->>R: Store refresh session (7 days)
    A-->>C: Access token + HTTP-only refresh cookie

    C->>A: POST /auth/refresh
    A->>R: Validate refresh session
    A-->>C: New access token

    C->>A: POST /auth/logout
    A->>R: Delete refresh session
    A-->>C: Clear refresh cookie
```

## ⚡ Redis & Session Management

Redis is provided by the global `RedisModule` and is used for:

- Refresh-token sessions: `session:<session-id>` with a seven-day TTL
- Email-verification tokens: managed by `EmailVerificationService` with a ten-minute TTL
- Product cache: `product:<product-id>` with a ten-minute TTL

Product cache entries are read on product lookup, written after a cache miss, and invalidated on product update or deletion.

## 📊 Redis Session Flow

```mermaid
flowchart TD
    Login[Successful login] --> Generate[Generate refresh token and session id]
    Generate --> Store[Redis SET session:id with 7-day TTL]
    Store --> Cookie[Set HTTP-only refresh_token cookie]
    Cookie --> Refresh[POST /auth/refresh]
    Refresh --> Verify[Verify JWT and compare Redis session]
    Verify --> Access[Issue new access token]
    Cookie --> Logout[POST /auth/logout]
    Logout --> Delete[Redis DEL session:id]
    Delete --> Clear[Clear refresh cookie]
```

## 📚 API Documentation

The API uses the following base URL:

```text
http://localhost:3000/api/v1
```

Swagger UI is available at:

```text
http://localhost:3000/api
```

Main route groups:

| Group    | Selected endpoints                                                                                             | Access                                                 |
| -------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Auth     | `POST /auth/register`, `GET /auth/verify-email`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout` | Public, except session-dependent operations            |
| Users    | `GET /users/me`, `GET /users/all`, `PATCH /users/update`, `PATCH /users/password`, `DELETE /users/delete`      | Authenticated; user listing is admin-only              |
| Products | `GET /product/:id`                                                                                             | Public                                                 |
| Products | `GET /product/all`, `POST /product/create`, `PATCH /product/update/:id`, `DELETE /product/delete/:id`          | Admin workflow; ownership is also checked by providers |
| Cart     | `GET /cart/all`, `POST /cart/items`, `PATCH /cart/items/:id`, `DELETE /cart/items/:id`, `DELETE /cart/clear`   | Authenticated                                          |
| Health   | `GET /health`                                                                                                  | Public                                                 |

## 🚀 Getting Started

### Prerequisites

- Node.js 24 or a compatible modern Node.js version
- pnpm 12+
- MySQL 8+
- Redis 7+
- SMTP credentials for email verification

Docker Compose can provide MySQL, Redis, and the API without installing the database services locally.

### Installation

```bash
git clone <repository-url>
cd e-commercial
pnpm install
```

### Environment Variables

Create a `.env` file in the project root. Do not commit real secrets.

```dotenv
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000/api/v1

ADMIN_EMAILS=admin@example.com

DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=change-me
DATABASE_HOST=localhost
DATABASE_NAME=e-commercial

REDIS_URL=redis://localhost:6379

JWT_ACCESS_SECRET=change-me-access-secret
JWT_ACCESS_EXPIRATION=10m
JWT_REFRESH_SECRET=change-me-refresh-secret
JWT_REFRESH_EXPIRATION=7d

MAIL_HOST=sandbox.smtp.mailtrap.io
SMTP_USERNAME=your-smtp-username
SMTP_PASSWORD=your-smtp-password
```

For Docker Compose, the API container must connect to the Redis service by its Compose hostname:

```dotenv
DATABASE_HOST=mysql
REDIS_URL=redis://redis:6379
```

The application validates required environment variables at startup.

### Run the Project

Run TypeORM migrations before starting the API:

```bash
pnpm migration:run
pnpm start:dev
```

Other useful commands:

```bash
pnpm build
pnpm start
pnpm start:prod
pnpm migration:show
pnpm migration:revert
```

## 🐳 Docker

Start the full development stack:

```bash
docker compose up --build
```

The Compose setup starts:

- API at `http://localhost:3000`
- MySQL exposed at host port `3307`
- Redis exposed at host port `6379`

The API container runs migrations and then starts the development server. For container-to-container communication, use `mysql` and `redis` as hostnames in the API environment.

Stop the stack:

```bash
docker compose down
```

Named volumes preserve MySQL and Redis data. Remove them only when you intentionally want to delete local development data:

```bash
docker compose down -v
```

## 🧪 Testing

Run the test suite:

```bash
pnpm test
```

Watch test files:

```bash
pnpm test:watch
```

Generate coverage:

```bash
pnpm test:cov
```

Run end-to-end tests when the e2e configuration and test files are available:

```bash
pnpm test:e2e
```

## 📡 API Examples

### Register

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane@example.com",
    "password": "StrongPassword123!"
  }'
```

Verify the email using the token sent by the configured mail provider:

```bash
curl "http://localhost:3000/api/v1/auth/verify-email?token=<verification-token>"
```

### Login

```bash
curl -i -c cookies.txt -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "StrongPassword123!"
  }'
```

The response contains an access token. The refresh token is stored in `cookies.txt`.

### Get the Current User

```bash
curl http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer <access-token>"
```

### Add an Item to the Cart

```bash
curl -X POST http://localhost:3000/api/v1/cart/items \
  -H "Authorization: Bearer <access-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "<product-id>",
    "quantity": 2
  }'
```

### Refresh the Access Token

```bash
curl -b cookies.txt -X POST http://localhost:3000/api/v1/auth/refresh
```

## 🔒 Security

- Passwords are hashed with Argon2 before storage.
- Access tokens are short-lived and signed with a dedicated secret.
- Refresh tokens are stored in HTTP-only cookies and checked against Redis sessions.
- Email verification tokens expire automatically.
- DTO validation uses whitelisting and rejects non-whitelisted properties.
- Authentication and role guards protect private and administrative routes.
- Global and auth-specific throttling reduce abusive request rates.
- Secrets and SMTP credentials must be supplied through environment variables.
- Production deployments should use HTTPS, secure cookie settings, secret rotation, and a managed secret store.

## 🧠 Design Decisions

- **Modular NestJS structure:** keeps authentication, users, products, carts, mail, and infrastructure concerns independently maintainable.
- **Providers for use cases:** business operations live outside controllers and are easier to test or reuse.
- **Redis for ephemeral state:** sessions, verification tokens, and cache entries have natural TTL-based lifecycles.
- **Migrations instead of synchronization:** prevents accidental schema changes in shared or production databases.
- **HTTP-only refresh cookies:** keeps the long-lived token out of normal client-side JavaScript access.
- **Explicit DTO validation:** creates a strict boundary between external input and application logic.

## 📊 Request Lifecycle

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant Guard as JWT / Roles Guard
    participant Provider
    participant Store as MySQL / Redis
    participant Response

    Client->>Controller: HTTP request
    Controller->>Guard: Authenticate and authorize
    Guard-->>Controller: Request user context
    Controller->>Provider: Validate DTO and execute use case
    Provider->>Store: Read or write data
    Store-->>Provider: Result
    Provider-->>Controller: Domain result
    Controller->>Response: Serialize response and cookies
    Response-->>Client: HTTP response
```

## 🔮 Future Improvements

- Add unit and end-to-end tests for auth, guards, ownership, cart operations, and cache invalidation.
- Rotate refresh tokens on every refresh and detect token reuse.
- Add database transactions for cart creation and concurrent cart updates.
- Reserve or decrement stock during checkout instead of only checking stock in the cart.
- Define explicit deletion behavior for products referenced by cart items.
- Add filtering and sorting to product queries.
- Add a dedicated checkout and order module.
- Add structured logging, request IDs, metrics, and distributed tracing.
- Add CI checks for formatting, linting, build, migrations, and tests.
- Use separate environment configuration and secret management for local, staging, and production deployments.

## 📄 License

No open-source license is currently specified in `package.json`. Add a license file and update this section before distributing the project publicly.
