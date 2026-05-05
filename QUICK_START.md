# Manager Portal Backend - Quick Start Guide

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Step 1: Install Dependencies

```bash
cd VDMS-Backend
npm install
```

### Step 2: Configure Environment

```bash
# Create .env file from template
cp .env.example .env

# Edit .env with your database credentials:
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
# DATABASE_USER=postgres
# DATABASE_PASSWORD=your_password
# DATABASE_NAME=vdms_db
# JWT_SECRET=your-secret-key
```

### Step 3: Start Database (PostgreSQL)

```bash
# Make sure PostgreSQL is running on your system
# Create the database:
createdb vdms_db

# Or through psql:
psql -U postgres
CREATE DATABASE vdms_db;
```

### Step 4: Run Backend

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

Server will run on `http://localhost:3000`

## 🔑 Test Credentials

After seeding, use these credentials to login:

| Role                 | Email               | Password    |
| -------------------- | ------------------- | ----------- |
| L1 (MD)              | l1.manager@vdms.com | password123 |
| L2 (AGM)             | l2.manager@vdms.com | password123 |
| L3 (Senior Valuator) | l3.manager@vdms.com | password123 |

## 📱 Testing APIs

### 1. Get Token

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"l3.manager@vdms.com",
    "password":"password123"
  }'
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "manager": {
    "id": "uuid",
    "email": "l3.manager@vdms.com",
    "name": "Senior Valuator",
    "role": "L3"
  }
}
```

### 2. Save Token

```bash
export TOKEN="your_token_here"
```

### 3. Test Protected Endpoint

```bash
curl -X GET http://localhost:3000/managers/dashboard/stats \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Create an Approval

First, get a project ID from `/projects`:

```bash
curl -X GET http://localhost:3000/projects \
  -H "Authorization: Bearer $TOKEN"
```

Then create approval:

```bash
curl -X POST http://localhost:3000/approvals \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "PROJECT_ID_FROM_ABOVE",
    "approvalType": "Document Review",
    "priority": "High",
    "comments": "Initial review"
  }'
```

### 5. Create a Review

```bash
curl -X POST http://localhost:3000/reviews \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "PROJECT_ID",
    "title": "Project Review",
    "content": "Detailed review content here..."
  }'
```

### 6. Submit Review

```bash
curl -X PATCH http://localhost:3000/reviews/REVIEW_ID/submit \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "feedback": "Ready for higher level review"
  }'
```

## 📊 API Endpoints Quick Reference

### Authentication

- `POST /auth/login` - Get JWT token

### Managers

- `GET /managers/dashboard/stats` - Dashboard statistics
- `GET /managers` - List managers
- `POST /managers` - Create manager (L1 only)
- `GET /managers/:id` - Get manager details
- `PATCH /managers/:id` - Update manager
- `DELETE /managers/:id` - Delete manager (L1 only)

### Approvals

- `POST /approvals` - Create approval
- `GET /approvals` - List approvals
- `GET /approvals/pending/mine` - My pending approvals
- `GET /approvals/chain/:projectId` - Approval chain
- `GET /approvals/:id` - Get approval details
- `PATCH /approvals/:id/approve` - Approve
- `PATCH /approvals/:id/reject` - Reject

### Reviews

- `POST /reviews` - Create review
- `GET /reviews` - List reviews
- `GET /reviews/drafts/mine` - My drafts
- `GET /reviews/submitted/mine` - My submissions
- `GET /reviews/history/:projectId` - Review history
- `PATCH /reviews/:id/submit` - Submit review
- `PATCH /reviews/:id/approve` - Approve
- `PATCH /reviews/:id/reject` - Reject

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module @nestjs/jwt"

**Solution:** Run `npm install` and check package.json dependencies

### Issue: Database connection error

**Solution:**

- Verify PostgreSQL is running
- Check .env database credentials
- Ensure database `vdms_db` exists

### Issue: "Unauthorized" on protected routes

**Solution:**

- Verify token in Authorization header: `Bearer <token>`
- Check token expiration (24 hours)
- Get new token using login endpoint

### Issue: "Forbidden" error

**Solution:**

- Verify your role has permission for endpoint
- L1 endpoints require L1 role
- Check @Roles() decorator on controller

## 📚 Documentation

- **MANAGER_PORTAL_API.md** - Complete API documentation
- **IMPLEMENTATION_SUMMARY.md** - Architecture and features
- **src/modules/** - Module-specific README in each folder

## 🧪 Development Tips

### Logging

```typescript
// Service
private logger = new Logger('MyService');
this.logger.log('Info message');
this.logger.error('Error message');
```

### Debugging

```bash
# Run in debug mode
npm run start:debug

# VS Code: Set breakpoints and attach debugger
```

### Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## 📦 Build & Deploy

### Build for Production

```bash
npm run build

# Output in dist/ folder
```

### Start Production

```bash
npm run start:prod
```

## 🔒 Security Considerations

1. **Change JWT_SECRET** - Set a strong random secret in production
2. **Password Hashing** - Use bcrypt for password hashing
3. **HTTPS** - Use HTTPS in production
4. **CORS** - Update CORS settings for production domain
5. **Rate Limiting** - Add rate limiting for security
6. **Input Validation** - All DTOs use class-validator

## 📞 Need Help?

- Check MANAGER_PORTAL_API.md for endpoint details
- Review service files for business logic
- Check test files for usage examples
- Run: `npm run start:debug` for debugging

## ✅ Next Steps

1. ✅ Backend is ready for Manager Portal
2. ✅ Connect frontend to these endpoints
3. ✅ Implement password hashing
4. ✅ Set up email notifications
5. ✅ Add audit logging
6. ✅ Deploy to production

Happy coding! 🎉
