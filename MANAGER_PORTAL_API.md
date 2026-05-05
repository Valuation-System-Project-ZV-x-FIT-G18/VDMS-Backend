# Manager Portal Backend API Documentation

## Overview

The Manager Portal backend is built with NestJS and provides APIs for managing projects, approvals, and reviews across three manager levels:

- **L1 Manager (MD)** - Highest authority, final approval
- **L2 Manager (AGM)** - Second level approval
- **L3 Manager (Senior Valuator)** - First level reviewer

## Authentication

All endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "manager@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "accessToken": "jwt_token_here",
  "manager": {
    "id": "uuid",
    "email": "manager@example.com",
    "name": "Manager Name",
    "role": "L1"
  }
}
```

## Managers Module

### Get Manager Dashboard Stats

```http
GET /managers/dashboard/stats
```

**Response:**

```json
{
  "manager": {
    "id": "uuid",
    "name": "Manager Name",
    "role": "L1"
  },
  "approvals": {
    "pending": 5,
    "approved": 12,
    "rejected": 2,
    "total": 19
  },
  "reviews": {
    "draft": 3,
    "submitted": 2,
    "approved": 10,
    "total": 15
  }
}
```

### Get All Managers

```http
GET /managers
GET /managers?role=L1
```

### Get Manager by ID

```http
GET /managers/:id
```

### Create Manager (L1 only)

```http
POST /managers
Content-Type: application/json

{
  "name": "New Manager",
  "email": "newmanager@example.com",
  "password": "password123",
  "role": "L2",
  "phone": "+1234567890"
}
```

### Update Manager

```http
PATCH /managers/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "+9876543210"
}
```

### Delete Manager (L1 only)

```http
DELETE /managers/:id
```

## Approvals Module

### Get All Approvals

```http
GET /approvals
GET /approvals?status=Pending
GET /approvals?managerId=uuid
```

### Get Pending Approvals for Current Manager

```http
GET /approvals/pending/mine
```

### Get Approval Chain Status

```http
GET /approvals/chain/:projectId
```

Returns approval status at each manager level (L3, L2, L1)

### Create Approval

```http
POST /approvals
Content-Type: application/json

{
  "projectId": "project-uuid",
  "approvalType": "Document Review",
  "priority": "High",
  "comments": "Optional comments"
}
```

**Approval Types:**

- `Document Review`
- `Report Approval`
- `Payment Authorization`
- `Project Completion`

### Get Approval Details

```http
GET /approvals/:id
```

### Approve

```http
PATCH /approvals/:id/approve
Content-Type: application/json

{
  "comments": "Approved as per requirements"
}
```

### Reject

```http
PATCH /approvals/:id/reject
Content-Type: application/json

{
  "comments": "Please revise and resubmit"
}
```

## Reviews Module

### Create Review Draft

```http
POST /reviews
Content-Type: application/json

{
  "projectId": "project-uuid",
  "title": "Project Review - Property at 123 Main St",
  "content": "Detailed review content here...",
  "parentReviewId": "optional-parent-review-uuid"
}
```

### Get All Reviews

```http
GET /reviews
GET /reviews?status=Draft
GET /reviews?projectId=project-uuid
```

### Get My Draft Reviews

```http
GET /reviews/drafts/mine
```

### Get My Submitted Reviews

```http
GET /reviews/submitted/mine
```

### Get Reviews for a Project

```http
GET /reviews/project/:projectId
```

### Get Review History (with versions)

```http
GET /reviews/history/:projectId
```

### Get Review Details

```http
GET /reviews/:id
```

### Update Draft Review

```http
PATCH /reviews/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content",
  "status": "Draft"
}
```

### Submit Review

```http
PATCH /reviews/:id/submit
Content-Type: application/json

{
  "feedback": "Optional feedback when submitting"
}
```

### Approve Review

```http
PATCH /reviews/:id/approve
```

### Reject Review

```http
PATCH /reviews/:id/reject
Content-Type: application/json

{
  "feedback": "Reason for rejection"
}
```

### Request Revision

```http
PATCH /reviews/:id/request-revision
Content-Type: application/json

{
  "feedback": "Please address the following points..."
}
```

### Delete Draft Review

```http
DELETE /reviews/:id
```

## Projects Module (Existing)

### Get All Projects

```http
GET /projects
GET /projects?status=In%20Progress
GET /projects?paymentStatus=Pending
GET /projects?search=query
```

### Get Project Details (with documents and team)

```http
GET /projects/:id
```

### Get Recent Projects

```http
GET /projects/recent
GET /projects/recent?limit=10
```

## Role-Based Access Control

### Endpoint Roles

- **L1 Manager** - Can create/delete managers, approve at final level
- **L2 Manager** - Can approve at second level, create reviews
- **L3 Manager** - Can create reviews, submit for approval

All three levels can:

- View their dashboard stats
- View projects and related data
- Create and manage approvals
- Create and manage reviews
- Approve/Reject/Request revisions

## Statuses

### Approval Status

- `Pending` - Awaiting action
- `Approved` - Approved by manager
- `Rejected` - Rejected by manager
- `Needs Revision` - Revision needed

### Review Status

- `Draft` - Being written
- `Submitted` - Submitted for review
- `Under Review` - Being reviewed
- `Approved` - Approved
- `Rejected` - Rejected
- `Revision Requested` - Revision requested

## Error Responses

All errors follow standard HTTP status codes:

- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing/invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource
- `500 Internal Server Error` - Server error

Error response format:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

## Tech Stack

- NestJS 11
- TypeORM + PostgreSQL
- JWT + Passport authentication
- class-validator for DTOs
- TypeScript

## Environment Variables

See `.env.example` for required configuration.
