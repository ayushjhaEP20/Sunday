# Microservices API Gateway — Documentation

## Architecture Overview

This system follows a distributed microservices architecture where all client traffic is routed through a central API Gateway. The gateway handles request routing, authentication validation, rate limiting, and load balancing before forwarding requests to the appropriate downstream service.

Each microservice is independently deployable, maintains its own database, and communicates via REST over HTTP. The gateway acts as the single entry point for all external clients.

```
                        ┌─────────────────────────────────────────────┐
                        │              CLIENT (Browser / App)          │
                        └─────────────────────┬───────────────────────┘
                                              │
                                              ▼
                        ┌─────────────────────────────────────────────┐
                        │          API GATEWAY  (port 8080)            │
                        │     Rate Limiting · Auth · Routing           │
                        └──┬──────────┬──────────┬──────────┬─────────┘
                           │          │          │          │          │
                           ▼          ▼          ▼          ▼          ▼
                      ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐
                      │  Auth  │ │ Event  │ │Revenue │ │ Media  │ │Analytics │
                      │Service │ │Service │ │ Engine │ │Service │ │ Service  │
                      │ :3001  │ │ :3002  │ │ :3003  │ │ :3004  │ │  :3005   │
                      └────────┘ └────────┘ └────────┘ └────────┘ └──────────┘
```

---

## API Gateway Routing Table

| Service            | Base Path             | Dev Port | Prod Domain                  | Auth Required |
|--------------------|-----------------------|----------|------------------------------|---------------|
| Auth Service       | `/api/v1/auth`        | 3001     | auth.yourdomain.com          | Partial       |
| Event Service      | `/api/v1/events`      | 3002     | events.yourdomain.com        | Yes           |
| Revenue Engine     | `/api/v1/revenue`     | 3003     | revenue.yourdomain.com       | Yes           |
| Media Service      | `/api/v1/media`       | 3004     | media.yourdomain.com         | Yes           |
| Analytics Service  | `/api/v1/analytics`   | 3005     | analytics.yourdomain.com     | Yes           |

---

## Authentication

This API uses **JWT (JSON Web Token)** based authentication. Tokens are issued upon successful login and must be included in the `Authorization` header of all protected requests.

### Auth Flow

1. **Register** a new user account via `POST /api/v1/auth/register`.
2. **Login** with credentials via `POST /api/v1/auth/login` — the response returns an `accessToken` and a `refreshToken`.
3. **Attach** the `accessToken` to subsequent requests using the `Bearer` scheme.
4. When the `accessToken` expires, use the `refreshToken` via `POST /api/v1/auth/refresh` to obtain a new pair without re-authenticating.

### Getting a Token

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
  "expiresIn": 3600
}
```

### Using the Token

```http
GET /api/v1/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiry & Refresh

- `accessToken` expires in **1 hour** (`expiresIn: 3600`).
- `refreshToken` expires in **7 days**.
- On expiry, call `POST /api/v1/auth/refresh` with the `refreshToken` in the request body to receive a new `accessToken`.

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

---

## Request Chaining Flow

The collection is designed to be run sequentially. Each request automatically saves key values as environment variables using test scripts, which are then consumed by subsequent requests.

| Step | Request              | Saves Variable(s)                    |
|------|----------------------|--------------------------------------|
| 1    | Register User        | `userId`                             |
| 2    | Login                | `authToken`, `refreshToken`          |
| 3    | Create Event         | `eventId`                            |
| 4    | Register Participant | `participantId`                      |
| 5    | Initiate Purchase    | `purchaseId`                         |
| 6    | Upgrade Event        | Uses `eventId` + `authToken`         |
| 7    | Start Live Stream    | `streamId`                           |
| 8    | Upload Media         | `mediaAssetId`                       |

> All variables are stored in the active Postman environment and referenced using `{{variableName}}` syntax throughout the collection.

---

## Service Documentation

### Auth Service

Base URL: `{{gateway_url}}/api/v1/auth`

| Method | Path        | Description              | Auth Required |
|--------|-------------|--------------------------|---------------|
| POST   | `/register` | Register new user        | No            |
| POST   | `/login`    | Login and get JWT        | No            |
| POST   | `/refresh`  | Refresh access token     | No            |
| GET    | `/me`       | Get current user profile | Yes           |
| POST   | `/logout`   | Logout and revoke token  | Yes           |

---

### Event Service

Base URL: `{{gateway_url}}/api/v1/events`

| Method | Path                              | Description                        | Auth Required |
|--------|-----------------------------------|------------------------------------|---------------|
| POST   | `/`                               | Create a new event                 | Yes           |
| GET    | `/`                               | List all events                    | Yes           |
| GET    | `/:eventId`                       | Get event by ID                    | Yes           |
| PUT    | `/:eventId`                       | Update event details               | Yes           |
| DELETE | `/:eventId`                       | Delete an event                    | Yes           |
| POST   | `/:eventId/participants`          | Register a participant             | Yes           |
| GET    | `/:eventId/participants`          | List participants for an event     | Yes           |
| DELETE | `/:eventId/participants/:id`      | Remove a participant               | Yes           |
| POST   | `/:eventId/upgrade`               | Upgrade event tier                 | Yes           |
| POST   | `/:eventId/stream/start`          | Start live stream for event        | Yes           |

---

### Revenue Engine

Base URL: `{{gateway_url}}/api/v1/revenue`

| Method | Path                    | Description                          | Auth Required |
|--------|-------------------------|--------------------------------------|---------------|
| POST   | `/purchase`             | Initiate a purchase                  | Yes           |
| GET    | `/purchase/:purchaseId` | Get purchase details                 | Yes           |
| GET    | `/purchases`            | List all purchases for user          | Yes           |
| POST   | `/refund/:purchaseId`   | Request a refund                     | Yes           |
| GET    | `/plans`                | List available subscription plans    | Yes           |
| POST   | `/subscribe`            | Subscribe to a plan                  | Yes           |
| DELETE | `/subscribe/:subId`     | Cancel a subscription                | Yes           |
| POST   | `/webhook/stripe`       | Stripe webhook receiver              | No            |

---

### Media Service

Base URL: `{{gateway_url}}/api/v1/media`

| Method | Path              | Description                        | Auth Required |
|--------|-------------------|------------------------------------|---------------|
| POST   | `/upload`         | Upload a media asset               | Yes           |
| GET    | `/`               | List all media assets for user     | Yes           |
| GET    | `/:mediaAssetId`  | Get media asset metadata           | Yes           |
| DELETE | `/:mediaAssetId`  | Delete a media asset               | Yes           |
| GET    | `/quota`          | Get current storage quota usage    | Yes           |
| POST   | `/transcode`      | Trigger transcoding for an asset   | Yes           |

---

### Analytics Service

Base URL: `{{gateway_url}}/api/v1/analytics`

| Method | Path                    | Description                          | Auth Required |
|--------|-------------------------|--------------------------------------|---------------|
| GET    | `/events/:eventId`      | Get analytics for a specific event   | Yes           |
| GET    | `/revenue`              | Get revenue analytics summary        | Yes           |
| GET    | `/media/:mediaAssetId`  | Get media engagement analytics       | Yes           |
| GET    | `/users`                | Get user activity analytics          | Yes           |
| GET    | `/dashboard`            | Get aggregated dashboard metrics     | Yes           |

---

## Environment Variables

| Variable               | Development                                  | Production                          | Description                              |
|------------------------|----------------------------------------------|-------------------------------------|------------------------------------------|
| `gateway_url`          | `http://localhost:8080`                      | `https://api.yourdomain.com`        | API Gateway base URL                     |
| `auth_service_url`     | `http://localhost:3001`                      | `https://auth.yourdomain.com`       | Auth Service direct URL                  |
| `event_service_url`    | `http://localhost:3002`                      | `https://events.yourdomain.com`     | Event Service direct URL                 |
| `revenue_service_url`  | `http://localhost:3003`                      | `https://revenue.yourdomain.com`    | Revenue Engine direct URL                |
| `media_service_url`    | `http://localhost:3004`                      | `https://media.yourdomain.com`      | Media Service direct URL                 |
| `analytics_service_url`| `http://localhost:3005`                      | `https://analytics.yourdomain.com`  | Analytics Service direct URL             |
| `stripe_test_key`      | `sk_test_mock_development_key`               | `sk_live_REPLACE_WITH_REAL_KEY`     | Stripe API key (secret)                  |
| `stripe_webhook_secret`| `whsec_test_mock_secret`                     | `whsec_REPLACE_WITH_REAL_SECRET`    | Stripe webhook signing secret            |
| `jwt_secret`           | `dev_jwt_secret_key_not_for_production`      | `REPLACE_WITH_STRONG_PRODUCTION_SECRET` | JWT signing secret                   |
| `db_connection`        | `mongodb://localhost:27017/microservices_dev` | `mongodb+srv://REPLACE_WITH_ATLAS_URI` | MongoDB connection string             |
| `redis_url`            | `redis://localhost:6379`                     | `rediss://REPLACE_WITH_REDIS_CLOUD_URL` | Redis connection URL                 |
| `s3_bucket`            | `dev-media-uploads-bucket`                   | `prod-media-uploads-bucket`         | S3 bucket name for media uploads         |
| `s3_region`            | `us-east-1`                                  | `us-east-1`                         | AWS S3 region                            |
| `max_upload_size_mb`   | `500`                                        | `2048`                              | Maximum file upload size in MB           |
| `storage_quota_gb`     | `10`                                         | `1000`                              | Total storage quota per user in GB       |
| `rate_limit_per_minute`| `100`                                        | `1000`                              | API rate limit (requests per minute)     |
| `log_level`            | `debug`                                      | `error`                             | Application log verbosity level          |
| `environment`          | `development`                                | `production`                        | Active environment identifier            |

---

## Error Codes Reference

| HTTP Status | Meaning                  | Common Cause                              |
|-------------|--------------------------|-------------------------------------------|
| 200         | OK                       | Request processed successfully            |
| 201         | Created                  | Resource created via POST                 |
| 204         | No Content               | Resource deleted successfully             |
| 400         | Bad Request              | Validation failed or malformed input      |
| 401         | Unauthorized             | Missing, invalid, or expired JWT          |
| 403         | Forbidden                | Authenticated but insufficient role/permissions |
| 404         | Not Found                | Resource does not exist or invalid ID     |
| 413         | Payload Too Large        | File size exceeds `max_upload_size_mb`    |
| 422         | Unprocessable Entity     | Business rule violation (e.g., event capacity exceeded) |
| 429         | Too Many Requests        | Exceeded `rate_limit_per_minute` threshold |
| 500         | Internal Server Error    | Unexpected server-side failure            |

---

## Mock Data Reference

### Stripe Webhook Payload

```json
{
  "id": "evt_mock_001",
  "object": "event",
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_mock_payment_intent_001",
      "amount": 4999,
      "currency": "usd",
      "status": "succeeded",
      "metadata": {
        "userId": "{{userId}}",
        "purchaseId": "{{purchaseId}}"
      }
    }
  },
  "created": 1712361600
}
```

### Purchase Initiation

```json
{
  "planId": "plan_pro_monthly",
  "paymentMethodId": "pm_mock_card_visa",
  "userId": "{{userId}}",
  "eventId": "{{eventId}}",
  "currency": "usd",
  "metadata": {
    "source": "web",
    "campaign": "spring_launch"
  }
}
```

### Event Creation

```json
{
  "title": "Annual Tech Summit 2026",
  "description": "A premier gathering of engineers, product leaders, and innovators.",
  "startDate": "2026-06-15T09:00:00.000Z",
  "endDate": "2026-06-15T18:00:00.000Z",
  "capacity": 500,
  "type": "conference",
  "isLive": false,
  "tags": ["technology", "networking", "innovation"],
  "location": {
    "type": "hybrid",
    "physical": "San Francisco Convention Center",
    "virtual": "https://stream.yourdomain.com/summit2026"
  }
}
```

### Media Upload

```json
{
  "fileName": "keynote_recording.mp4",
  "mimeType": "video/mp4",
  "fileSizeMb": 320,
  "eventId": "{{eventId}}",
  "visibility": "private",
  "tags": ["keynote", "recording", "2026"],
  "metadata": {
    "duration": "01:45:30",
    "resolution": "1920x1080",
    "codec": "H.264"
  }
}
```

---

## Running the Collection

Follow these steps to run the full collection end-to-end:

1. **Import the Collection**
   - Open Postman and click **Import**.
   - Select the collection JSON file from the `postman/` directory.

2. **Import the Environment**
   - Click **Import** again.
   - Select either `development.environment.json` or `production.environment.json` from `postman/environments/`.

3. **Select the Environment**
   - In the top-right environment dropdown, select **Development** (or **Production**).
   - Verify that `{{gateway_url}}` resolves correctly in the environment panel.

4. **Run Auth Service First**
   - Open the **Auth Service** folder in the collection.
   - Run **Register User** — this saves `userId` to the environment.
   - Run **Login** — this saves `authToken` and `refreshToken` to the environment.

5. **Run the Full Collection with Collection Runner**
   - Click the collection name → **Run collection**.
   - Ensure requests are in the correct order (matching the Request Chaining Flow above).
   - Click **Run** to execute all requests sequentially.

6. **Automatic Variable Chaining**
   - Each request's test script extracts values from the response (e.g., `pm.environment.set("eventId", response.eventId)`) and stores them as environment variables.
   - Subsequent requests reference these variables using `{{variableName}}` in their URLs, headers, and bodies — no manual copy-pasting required.

---

## CI/CD Integration

Use [Newman](https://github.com/postmanlabs/newman) — Postman's CLI collection runner — to integrate the collection into your CI/CD pipeline.

### Install Newman

```bash
npm install -g newman
```

### Run with Development Environment

```bash
newman run postman/Microservices_API_Gateway.postman_collection.json \
  --environment postman/environments/development.environment.json \
  --reporters cli,json \
  --reporter-json-export postman/reports/newman-report.json \
  --delay-request 200 \
  --timeout-request 10000
```

### Run with Production Environment

```bash
newman run postman/Microservices_API_Gateway.postman_collection.json \
  --environment postman/environments/production.environment.json \
  --reporters cli,json \
  --reporter-json-export postman/reports/newman-report-prod.json \
  --delay-request 500 \
  --timeout-request 15000
```

### GitHub Actions Example

```yaml
name: API Integration Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  api-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install Newman
        run: npm install -g newman

      - name: Run Postman Collection
        run: |
          newman run postman/Microservices_API_Gateway.postman_collection.json \
            --environment postman/environments/development.environment.json \
            --reporters cli,json \
            --reporter-json-export postman/reports/newman-report.json

      - name: Upload Test Report
        uses: actions/upload-artifact@v3
        with:
          name: newman-report
          path: postman/reports/newman-report.json
```
