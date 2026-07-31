# NovaDesk REST API Reference

Version: `v1`

Base URL:

```text
https://api.novadesk.example/v1
```

This reference documents a representative SaaS support-platform API with ten endpoints. The resource names can be replaced without changing the structure.

## Authentication

All protected endpoints require a bearer token:

```http
Authorization: Bearer YOUR_API_TOKEN
```

Tokens must be sent only over HTTPS. Missing, expired, or invalid tokens return `401 Unauthorized`.

## Common headers

```http
Accept: application/json
Content-Type: application/json
Authorization: Bearer YOUR_API_TOKEN
Idempotency-Key: 6aa88d65-2ae8-44c8-9d94-1cf6992407f8
```

`Idempotency-Key` is required for create operations where retrying could produce duplicates.

## Response conventions

Successful object response:

```json
{
  "data": {
    "id": "cus_01J7H8H3D6DT7BK2NQYXX5M3PH"
  },
  "request_id": "req_01J7H8J2Y83DBY7H6ZD4FHJQ4M"
}
```

Error response:

```json
{
  "error": {
    "code": "validation_error",
    "message": "One or more fields are invalid.",
    "details": [
      {
        "field": "email",
        "reason": "invalid_format"
      }
    ]
  },
  "request_id": "req_01J7H8J2Y83DBY7H6ZD4FHJQ4M"
}
```

## Status codes

| Code | Meaning |
|---|---|
| `200` | Request succeeded |
| `201` | Resource created |
| `204` | Request succeeded with no response body |
| `400` | Malformed request |
| `401` | Missing or invalid authentication |
| `403` | Authenticated but not authorized |
| `404` | Resource not found |
| `409` | Conflict or duplicate request |
| `422` | Validation failed |
| `429` | Rate limit exceeded |
| `500` | Unexpected server error |

## Pagination

List endpoints accept:

- `limit`: 1–100, default `25`
- `cursor`: opaque cursor returned by the previous response

```json
{
  "data": [],
  "page": {
    "next_cursor": "eyJpZCI6ImN1c18wMUp...",
    "has_more": true
  }
}
```

## Rate limits

The API permits 120 requests per minute per workspace unless a different plan limit applies.

```http
RateLimit-Limit: 120
RateLimit-Remaining: 87
RateLimit-Reset: 1725128460
```

---

## 1. Create an access token

`POST /auth/tokens`

Creates a short-lived API token from account credentials.

### Request

```json
{
  "email": "agent@example.com",
  "password": "correct-horse-battery-staple"
}
```

### cURL

```bash
curl -X POST "https://api.novadesk.example/v1/auth/tokens" \
  -H "Content-Type: application/json" \
  -d '{"email":"agent@example.com","password":"correct-horse-battery-staple"}'
```

### Response — `201 Created`

```json
{
  "data": {
    "access_token": "nd_live_...",
    "token_type": "Bearer",
    "expires_in": 3600
  },
  "request_id": "req_01J7H8M9Q3F1BA77S2BPSR3M6J"
}
```

Possible errors: `invalid_credentials`, `account_locked`, `validation_error`.

---

## 2. Get the current user

`GET /me`

Returns the authenticated user and workspace role.

```bash
curl "https://api.novadesk.example/v1/me" \
  -H "Authorization: Bearer $TOKEN"
```

### Response — `200 OK`

```json
{
  "data": {
    "id": "usr_01J7H8P7DCTDPPC51C2N5JX1Y4",
    "name": "Alex Morgan",
    "email": "alex@example.com",
    "role": "admin",
    "workspace_id": "wsp_01J7H8Q8H0D5JD8H5P0M2N1R3Q"
  },
  "request_id": "req_01J7H8QZPGQD1HNXA24G8MX70M"
}
```

---

## 3. List customers

`GET /customers`

Query parameters:

- `limit`
- `cursor`
- `status`: `active`, `archived`
- `search`: name or email fragment

```bash
curl "https://api.novadesk.example/v1/customers?status=active&limit=20" \
  -H "Authorization: Bearer $TOKEN"
```

### Response — `200 OK`

```json
{
  "data": [
    {
      "id": "cus_01J7H8TBR74KBYBG5F1EW3TZ6S",
      "name": "Samir Ben Ali",
      "email": "samir@example.com",
      "status": "active",
      "created_at": "2026-07-30T21:20:00Z"
    }
  ],
  "page": {
    "next_cursor": null,
    "has_more": false
  },
  "request_id": "req_01J7H8V3RS2W6A8V7MM2NKG1ZP"
}
```

---

## 4. Create a customer

`POST /customers`

Requires `Idempotency-Key`.

### Request

```json
{
  "name": "Samir Ben Ali",
  "email": "samir@example.com",
  "phone": "+21620000000",
  "metadata": {
    "source": "website"
  }
}
```

```bash
curl -X POST "https://api.novadesk.example/v1/customers" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: 6aa88d65-2ae8-44c8-9d94-1cf6992407f8" \
  -d '{"name":"Samir Ben Ali","email":"samir@example.com"}'
```

### Response — `201 Created`

```json
{
  "data": {
    "id": "cus_01J7H8TBR74KBYBG5F1EW3TZ6S",
    "name": "Samir Ben Ali",
    "email": "samir@example.com",
    "phone": "+21620000000",
    "status": "active",
    "metadata": {
      "source": "website"
    },
    "created_at": "2026-07-30T21:20:00Z"
  },
  "request_id": "req_01J7H8Y7PQF004KHT98RB744C9"
}
```

Possible errors: `email_already_exists`, `validation_error`, `idempotency_conflict`.

---

## 5. Get a customer

`GET /customers/{customer_id}`

```bash
curl "https://api.novadesk.example/v1/customers/cus_01J7H8TBR74KBYBG5F1EW3TZ6S" \
  -H "Authorization: Bearer $TOKEN"
```

### Response — `200 OK`

```json
{
  "data": {
    "id": "cus_01J7H8TBR74KBYBG5F1EW3TZ6S",
    "name": "Samir Ben Ali",
    "email": "samir@example.com",
    "status": "active",
    "created_at": "2026-07-30T21:20:00Z",
    "updated_at": "2026-07-30T21:20:00Z"
  },
  "request_id": "req_01J7H91HMFZ26T0QG3NPR1VA6A"
}
```

Possible error: `customer_not_found`.

---

## 6. Update a customer

`PATCH /customers/{customer_id}`

Only supplied fields are changed.

### Request

```json
{
  "name": "Samir B. Ali",
  "metadata": {
    "plan": "growth"
  }
}
```

```bash
curl -X PATCH "https://api.novadesk.example/v1/customers/cus_01J7H8TBR74KBYBG5F1EW3TZ6S" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Samir B. Ali","metadata":{"plan":"growth"}}'
```

### Response — `200 OK`

```json
{
  "data": {
    "id": "cus_01J7H8TBR74KBYBG5F1EW3TZ6S",
    "name": "Samir B. Ali",
    "email": "samir@example.com",
    "metadata": {
      "plan": "growth"
    },
    "updated_at": "2026-07-30T22:10:00Z"
  },
  "request_id": "req_01J7H93X5NRMQJ7K8MPHKWEW5A"
}
```

---

## 7. List tickets

`GET /tickets`

Query parameters:

- `status`: `open`, `pending`, `resolved`, `closed`
- `customer_id`
- `priority`: `low`, `normal`, `high`, `urgent`
- `limit`, `cursor`

```bash
curl "https://api.novadesk.example/v1/tickets?status=open&priority=high" \
  -H "Authorization: Bearer $TOKEN"
```

### Response — `200 OK`

```json
{
  "data": [
    {
      "id": "tkt_01J7H96DMJNBV39F0FXH4EWPKP",
      "subject": "Unable to export invoices",
      "status": "open",
      "priority": "high",
      "customer_id": "cus_01J7H8TBR74KBYBG5F1EW3TZ6S",
      "created_at": "2026-07-30T22:20:00Z"
    }
  ],
  "page": {
    "next_cursor": null,
    "has_more": false
  },
  "request_id": "req_01J7H97FHJMPQMN6JYW9V3A5T9"
}
```

---

## 8. Create a ticket

`POST /tickets`

Requires `Idempotency-Key`.

### Request

```json
{
  "customer_id": "cus_01J7H8TBR74KBYBG5F1EW3TZ6S",
  "subject": "Unable to export invoices",
  "description": "The CSV export returns an empty file.",
  "priority": "high",
  "tags": ["billing", "export"]
}
```

```bash
curl -X POST "https://api.novadesk.example/v1/tickets" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: 84b35d9e-14a6-4c66-a99b-e49fc0ac2c87" \
  -d @ticket.json
```

### Response — `201 Created`

```json
{
  "data": {
    "id": "tkt_01J7H96DMJNBV39F0FXH4EWPKP",
    "customer_id": "cus_01J7H8TBR74KBYBG5F1EW3TZ6S",
    "subject": "Unable to export invoices",
    "description": "The CSV export returns an empty file.",
    "status": "open",
    "priority": "high",
    "tags": ["billing", "export"],
    "created_at": "2026-07-30T22:20:00Z"
  },
  "request_id": "req_01J7H9C6N5K42X9D38G3SZXJH2"
}
```

---

## 9. Add a ticket message

`POST /tickets/{ticket_id}/messages`

### Request

```json
{
  "body": "We reproduced the issue and are preparing a fix.",
  "visibility": "public"
}
```

```bash
curl -X POST "https://api.novadesk.example/v1/tickets/tkt_01J7H96DMJNBV39F0FXH4EWPKP/messages" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"body":"We reproduced the issue and are preparing a fix.","visibility":"public"}'
```

### Response — `201 Created`

```json
{
  "data": {
    "id": "msg_01J7H9EZVEGGN13A98SE6BMV33",
    "ticket_id": "tkt_01J7H96DMJNBV39F0FXH4EWPKP",
    "body": "We reproduced the issue and are preparing a fix.",
    "visibility": "public",
    "author": {
      "type": "user",
      "id": "usr_01J7H8P7DCTDPPC51C2N5JX1Y4"
    },
    "created_at": "2026-07-30T22:35:00Z"
  },
  "request_id": "req_01J7H9G8AWXSPDQ4JBS3M8YH4D"
}
```

Possible errors: `ticket_not_found`, `ticket_closed`, `validation_error`.

---

## 10. Resolve a ticket

`POST /tickets/{ticket_id}/resolve`

### Request

```json
{
  "resolution_code": "fixed",
  "note": "CSV export service restarted and verified."
}
```

```bash
curl -X POST "https://api.novadesk.example/v1/tickets/tkt_01J7H96DMJNBV39F0FXH4EWPKP/resolve" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"resolution_code":"fixed","note":"CSV export service restarted and verified."}'
```

### Response — `200 OK`

```json
{
  "data": {
    "id": "tkt_01J7H96DMJNBV39F0FXH4EWPKP",
    "status": "resolved",
    "resolution_code": "fixed",
    "resolved_at": "2026-07-30T23:00:00Z",
    "resolved_by": "usr_01J7H8P7DCTDPPC51C2N5JX1Y4"
  },
  "request_id": "req_01J7H9JD1C62X9S8Y1SWRQ5HDH"
}
```

Possible errors: `ticket_not_found`, `invalid_state_transition`, `forbidden`.

## Webhooks

Use signed webhooks for asynchronous updates such as `ticket.created`, `ticket.resolved`, and `customer.updated`. Verify signatures before processing a payload and return a `2xx` response quickly. Consumers should deduplicate events by event ID.

## Versioning and compatibility

The major version appears in the URL. Backward-compatible fields may be added without changing the version. Breaking changes require a new major version and a published migration guide.
