---
title: "API Reference"
description: "Complete API documentation for Trunk OS Gild API"
order: 3
---

# API Reference

The Trunk OS Gild API provides programmatic access to system management functionality for the Trunk OS platform.

## Base URL

```
http://trunk.local:5309
```

## Data Formats

The Gild API uses a hybrid approach for data serialization:

- **Request Bodies**: CBOR (Concise Binary Object Representation)
- **Success Responses**: CBOR 
- **Error Responses**: JSON using RFC 7807 ProblemDetails format

### Content Type Headers

**For requests with body data:**
```
Content-Type: application/cbor
Accept: application/cbor
```

**CBOR Benefits:**
- Smaller payload size (typically 20-50% smaller than JSON)
- Faster parsing and serialization
- Native support for binary data
- Type safety preservation

### Example CBOR Usage

```bash
# Convert JSON to CBOR and make request
echo '{"username":"admin","password":"secret"}' | \
  json2cbor | \
  curl -X POST \
    -H "Content-Type: application/cbor" \
    -H "Accept: application/cbor" \
    --data-binary @- \
    http://localhost:5300/session/login
```

## Authentication

All protected endpoints require authentication using JWT bearer tokens obtained via session login.

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/cbor" \
     -H "Accept: application/cbor" \
     http://localhost:5300/status/ping
```

## Session Management

### POST /session/login
Authenticate with username/password to obtain a JWT token.

**Request Body (CBOR):**
```json
{
  "username": "admin",
  "password": "secure_password"
}
```

**Validation:**
- `username`: 3-30 characters, required
- `password`: 8-100 characters, required

**Success Response (CBOR):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires": "2024-01-08T12:00:00Z"
}
```

**Error Response (JSON ProblemDetails):**
```json
{
  "type": "about:blank",
  "title": "Authentication failed",
  "status": 401,
  "detail": "Invalid username or password",
  "instance": "/session/login"
}
```

### GET /session/me
Get current authenticated user details.

**Authentication:** Required

**Success Response (CBOR):**
```json
{
  "id": 1,
  "username": "admin",
  "realname": "Administrator",
  "email": "admin@example.com",
  "phone": "+1234567890",
  "deleted_at": null
}
```

**Error Response (JSON ProblemDetails):**
```json
{
  "type": "about:blank",
  "title": "Unauthorized",
  "status": 401,
  "detail": "Valid JWT token required",
  "instance": "/session/me"
}
```

## User Management

### PUT /users
Create a new user (first-time setup or admin creation).

**Request Body (CBOR):**
```json
{
  "username": "newuser",
  "password": "secure_password",
  "realname": "Real Name",
  "email": "user@example.com",
  "phone": "+1234567890"
}
```

**Validation:**
- `username`: 3-30 characters, required
- `password`: 8-100 characters, required  
- `realname`: 3-50 characters, optional
- `email`: 6-100 characters, valid email format, optional
- `phone`: 10-20 characters, optional

**Success Response (CBOR):**
```json
{
  "id": 2,
  "username": "newuser",
  "realname": "Real Name",
  "email": "user@example.com",
  "phone": "+1234567890",
  "deleted_at": null
}
```

**Error Response (JSON ProblemDetails):**
```json
{
  "type": "about:blank",
  "title": "Validation Error",
  "status": 400,
  "detail": "Username 'newuser' already exists",
  "instance": "/users"
}
```

### GET /users
List users with pagination and filtering.

**Authentication:** Required

**Query Parameters:**
- `page`: Page number (optional)
- `per_page`: Results per page (optional)
- `since`: Timestamp filter (optional)

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "username": "admin",
      "realname": "Administrator",
      "email": "admin@example.com",
      "phone": "+1234567890",
      "deleted_at": null
    }
  ],
  "total": 1,
  "page": 1,
  "per_page": 50
}
```

### GET /user/{id}
Retrieve specific user by ID.

**Authentication:** Required

**Parameters:**
- `id`: User ID (required)

**Response:**
```json
{
  "id": 1,
  "username": "admin",
  "realname": "Administrator", 
  "email": "admin@example.com",
  "phone": "+1234567890",
  "deleted_at": null
}
```

### POST /user/{id}
Update user information.

**Authentication:** Required

**Parameters:**
- `id`: User ID (required)

**Request Body:**
```json
{
  "realname": "Updated Name",
  "email": "updated@example.com",
  "phone": "+0987654321"
}
```

**Response:** Updated user object

### DELETE /user/{id}
Soft delete a user (sets deletion timestamp).

**Authentication:** Required

**Parameters:**
- `id`: User ID (required)

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

## ZFS Storage Management

### GET /zfs/list
List ZFS datasets and volumes.

**Authentication:** Required

**Response:**
```json
{
  "datasets": [
    {
      "name": "tank/data",
      "type": "dataset",
      "used": "1.5G",
      "available": "48.5G",
      "mountpoint": "/tank/data",
      "compression": "lz4"
    }
  ],
  "volumes": [
    {
      "name": "tank/vol1", 
      "type": "volume",
      "size": "10G",
      "used": "2.1G"
    }
  ]
}
```

### POST /zfs/create_dataset
Create a new ZFS dataset.

**Authentication:** Required

**Request Body:**
```json
{
  "name": "tank/new_dataset",
  "mountpoint": "/tank/new_dataset",
  "compression": "lz4",
  "quota": "10G"
}
```

**Response:** Created dataset information

### POST /zfs/modify_dataset
Modify an existing ZFS dataset.

**Authentication:** Required

**Request Body:**
```json
{
  "name": "tank/existing_dataset",
  "quota": "20G",
  "compression": "zstd"
}
```

**Response:** Updated dataset information

### POST /zfs/create_volume
Create a new ZFS volume.

**Authentication:** Required

**Request Body:**
```json
{
  "name": "tank/new_volume",
  "size": "5G",
  "compression": "lz4"
}
```

**Response:** Created volume information

### POST /zfs/modify_volume
Modify an existing ZFS volume.

**Authentication:** Required

**Request Body:**
```json
{
  "name": "tank/existing_volume",
  "size": "10G"
}
```

**Response:** Updated volume information

### DELETE /zfs/destroy
Destroy a ZFS dataset or volume.

**Authentication:** Required

**Request Body:**
```json
{
  "name": "tank/to_destroy",
  "force": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "ZFS object destroyed successfully"
}
```

## System Status

### GET /status/ping
Health check and system status information.

**Success Response (CBOR):**
```json
{
  "health": {
    "buckle": "healthy",
    "errors": null,
    "latency": "2ms"
  },
  "info": "System operational"
}
```

### GET /status/log
Retrieve audit logs with pagination.

**Authentication:** Required

**Query Parameters:**
- `page`: Page number (optional)
- `per_page`: Results per page (optional)

**Response:**
```json
{
  "logs": [
    {
      "id": 1,
      "user_id": 1,
      "time": "2024-01-01T12:00:00Z",
      "entry": "User login successful",
      "endpoint": "/session/login",
      "ip": "192.168.1.100",
      "data": {},
      "error": null
    }
  ],
  "total": 150,
  "page": 1,
  "per_page": 50
}
```

## Configuration

The API server can be configured via YAML file:

```yaml
listen: "0.0.0.0:5300"        # Server bind address
socket: "/tmp/buckled.sock"    # Unix socket path  
db: "./gild.db"               # SQLite database path
log_level: "info"             # Logging verbosity
```

## Security Features

- **JWT Authentication**: 7-day expiration (configurable)
- **Password Hashing**: Argon2 with salt
- **Input Validation**: Comprehensive validation on all endpoints
- **Audit Logging**: All operations logged with user, IP, and timestamp
- **CORS Support**: Configured for cross-origin requests

## Error Handling

All API errors return standardized JSON responses using RFC 7807 ProblemDetails format:

```json
{
  "type": "about:blank",
  "title": "Validation Error",
  "status": 400,
  "detail": "Username must be between 3-30 characters",
  "instance": "/users"
}
```

### ProblemDetails Fields

- **type**: URI identifying the problem type (often "about:blank" for generic errors)
- **title**: Human-readable summary of the problem type
- **status**: HTTP status code
- **detail**: Human-readable explanation specific to this occurrence
- **instance**: URI reference identifying the specific occurrence

### Common Error Examples

**Validation Error (400):**
```json
{
  "type": "https://example.com/validation-error",
  "title": "Validation failed",
  "status": 400,
  "detail": "Password must be at least 8 characters",
  "instance": "/session/login"
}
```

**Authentication Error (401):**
```json
{
  "type": "about:blank",
  "title": "Unauthorized",
  "status": 401,
  "detail": "Invalid or expired JWT token",
  "instance": "/users"
}
```

**Not Found Error (404):**
```json
{
  "type": "about:blank", 
  "title": "Not Found",
  "status": 404,
  "detail": "User with ID 123 does not exist",
  "instance": "/user/123"
}
```

**Common HTTP Status Codes:**
- **200**: Success (CBOR response)
- **400**: Bad Request (JSON ProblemDetails)
- **401**: Unauthorized (JSON ProblemDetails)
- **403**: Forbidden (JSON ProblemDetails)
- **404**: Not Found (JSON ProblemDetails)
- **422**: Unprocessable Entity (JSON ProblemDetails)
- **500**: Internal Server Error (JSON ProblemDetails)
