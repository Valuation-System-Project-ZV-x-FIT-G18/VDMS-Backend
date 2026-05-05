# Manager Portal Backend - Complete File Structure & Reference

## 📁 Files Created/Modified

### Authentication Module

```
src/modules/auth/
├── jwt.strategy.ts           - JWT validation strategy
├── jwt-auth.guard.ts         - Guard to protect endpoints
├── roles.guard.ts            - Role-based access control
├── roles.decorator.ts        - @Roles() decorator
├── auth.service.ts           - Login logic
├── auth.controller.ts        - POST /auth/login endpoint
└── auth.module.ts            - Module configuration
```

### Managers Module

```
src/modules/managers/
├── dto/
│   └── manager.dto.ts        - CreateManagerDto, UpdateManagerDto, ManagerResponseDto
├── managers.service.ts       - Manager CRUD + dashboard stats
├── managers.controller.ts    - 6 endpoints for manager operations
└── managers.module.ts        - Module configuration
```

### Approvals Module

```
src/modules/approvals/
├── dto/
│   └── approval.dto.ts       - CreateApprovalDto, UpdateApprovalDto, ApprovalResponseDto
├── approvals.service.ts      - Approval workflow logic + chain tracking
├── approvals.controller.ts   - 9 endpoints for approvals
└── approvals.module.ts       - Module configuration
```

### Reviews Module

```
src/modules/reviews/
├── dto/
│   └── review.dto.ts         - CreateReviewDto, UpdateReviewDto, SubmitReviewDto, ReviewResponseDto
├── reviews.service.ts        - Review management + versioning
├── reviews.controller.ts     - 12 endpoints for reviews
└── reviews.module.ts         - Module configuration
```

### Entities

```
src/entities/
├── manager.entity.ts         - NEW: Manager entity with roles
├── approval.entity.ts        - NEW: Approval workflow entity
├── review.entity.ts          - NEW: Review with versioning
├── project.entity.ts         - UPDATED: Added relations
├── document.entity.ts        - Existing
├── invoice.entity.ts         - Existing
├── notification.entity.ts    - Existing
└── team-member.entity.ts     - Existing
```

### Configuration & Utilities

```
src/
├── app.module.ts             - UPDATED: Added Manager Portal modules
├── seeder.service.ts         - NEW: Generate test data
└── main.ts                   - Existing (CORS configured)
```

### Documentation

```
VDMS-Backend/
├── MANAGER_PORTAL_API.md     - Complete API reference (40+ endpoints)
├── IMPLEMENTATION_SUMMARY.md - Architecture & features
├── QUICK_START.md            - Setup & testing guide
├── .env.example              - Environment configuration template
└── package.json              - UPDATED: Added JWT & Passport dependencies
```

## 🔐 Security Features Implemented

### 1. JWT Authentication

- 24-hour token expiration
- Secure token validation
- Automatic token expiration
- Bearer token scheme

### 2. Role-Based Access Control (RBAC)

- Three roles: L1 (MD), L2 (AGM), L3 (Senior Valuator)
- Endpoint-level role enforcement
- Hierarchical access: L1 can do L2, L1 can do L3
- @Roles() decorator for easy enforcement

### 3. Protected Endpoints

- All Manager Portal endpoints require JWT
- All Manager Portal endpoints check user role
- Automatic 403 Forbidden for unauthorized access

### 4. Input Validation

- class-validator on all DTOs
- Type safety with TypeScript
- Required field validation
- Enum validation for statuses

## 📊 API Endpoints Summary

### Total Endpoints: 40+

| Module                   | Endpoints | Protected | Role Guarded |
| ------------------------ | --------- | --------- | ------------ |
| Auth                     | 1         | ❌        | ❌           |
| Managers                 | 6         | ✅        | ✅           |
| Approvals                | 9         | ✅        | ✅           |
| Reviews                  | 12        | ✅        | ✅           |
| Projects (existing)      | 3         | ❌        | ❌           |
| Invoices (existing)      | 4         | ❌        | ❌           |
| Documents (existing)     | 2         | ❌        | ❌           |
| Notifications (existing) | 3         | ❌        | ❌           |
| Team Members (existing)  | 1         | ❌        | ❌           |
| **TOTAL**                | **41**    | **24**    | **24**       |

## 🎯 Business Logic Implemented

### Managers

- Create/Read/Update/Delete managers
- Dashboard statistics (pending/approved/rejected)
- Review count tracking
- Role-based access for management

### Approvals

- Create approval requests
- Track approval status (Pending, Approved, Rejected, Needs Revision)
- Support 4 approval types
- Approval chain tracking (L3→L2→L1)
- Comments on approval/rejection
- Automatic processing timestamp

### Reviews

- Create/draft reviews for projects
- Version tracking for revisions
- 6 review statuses (Draft, Submitted, Under Review, Approved, Rejected, Revision)
- Review history with versions
- Feedback at each stage
- Only drafts can be edited/deleted

## 📈 Database Relationships

```
Manager (1) ----< (N) Approval
Manager (1) ----< (N) Review

Project (1) ----< (N) Approval
Project (1) ----< (N) Review
Project (1) ----< (N) Document
Project (1) ----< (N) TeamMember
Project (1) ----< (N) Invoice
```

## 🔄 Workflow Examples

### Approval Workflow

```
1. L3 Manager creates approval for project
2. L3 Manager reviews and approves/rejects
3. If approved → moves to L2 Manager
4. L2 Manager reviews and approves/rejects
5. If approved → moves to L1 Manager
6. L1 Manager final approval/rejection
```

### Review Workflow

```
1. L3 Manager creates draft review
2. L3 Manager submits review
3. L2/L1 Manager reviews submitted review
4. Can approve, reject, or request revision
5. If revision → back to draft for L3
6. Once approved → finalized
```

## 🧮 Data Models

### Manager

```typescript
{
  id: UUID
  name: string
  email: string (unique)
  password: string (hashed)
  role: 'L1' | 'L2' | 'L3'
  phone?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Approval

```typescript
{
  id: UUID
  projectId: UUID
  managerId: UUID
  approvalType: 'Document Review' | 'Report Approval' | 'Payment Authorization' | 'Project Completion'
  status: 'Pending' | 'Approved' | 'Rejected' | 'Needs Revision'
  comments?: string
  priority?: 'Low' | 'Medium' | 'High'
  processedAt?: Date
  createdAt: Date
  updatedAt: Date
}
```

### Review

```typescript
{
  id: UUID
  projectId: UUID
  managerId: UUID
  title?: string
  content: string
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Revision Requested'
  feedback?: string
  version: number
  parentReviewId?: UUID
  submittedAt?: Date
  approvedAt?: Date
  createdAt: Date
  updatedAt: Date
}
```

## 📝 DTOs (Data Transfer Objects)

### Manager DTOs

```typescript
CreateManagerDto {
  name: string
  email: string
  password: string (min 6 chars)
  role: ManagerRole
  phone?: string
}

UpdateManagerDto {
  name?: string
  phone?: string
  isActive?: boolean
}
```

### Approval DTOs

```typescript
CreateApprovalDto {
  projectId: UUID
  approvalType: ApprovalType
  priority?: string
  comments?: string
}

UpdateApprovalDto {
  status: ApprovalStatus
  comments?: string
}
```

### Review DTOs

```typescript
CreateReviewDto {
  projectId: UUID
  content: string (min 10 chars)
  title?: string
  parentReviewId?: UUID
}

UpdateReviewDto {
  content?: string
  title?: string
  status?: ReviewStatus
  feedback?: string
}

SubmitReviewDto {
  feedback?: string
}
```

## 🚀 Services Architecture

### AuthService

- `login(email, password)` - Authenticate user
- `validateManager(id)` - Validate manager exists

### ManagersService

- `create(dto)` - Create new manager
- `findAll(role?)` - List managers
- `findOne(id)` - Get manager
- `update(id, dto)` - Update manager
- `delete(id)` - Deactivate manager
- `getDashboardStats(managerId)` - Get statistics

### ApprovalsService

- `create(managerId, dto)` - Create approval
- `findAll(managerId?, status?)` - List approvals
- `findOne(id)` - Get approval
- `update(id, dto)` - Update approval
- `approve(id, comments?)` - Approve
- `reject(id, comments)` - Reject
- `getPendingByManager(managerId)` - Get pending
- `getApprovalChainStatus(projectId)` - Get chain

### ReviewsService

- `create(managerId, dto)` - Create review
- `findAll(managerId?, status?, projectId?)` - List reviews
- `findOne(id)` - Get review
- `update(id, dto)` - Update draft
- `submitReview(id, dto)` - Submit review
- `approveReview(id)` - Approve
- `rejectReview(id, feedback)` - Reject
- `requestRevision(id, feedback)` - Request revision
- `getDraftReviewsByManager(managerId)` - Get drafts
- `getProjectReviews(projectId)` - Get project reviews
- `getReviewHistory(projectId)` - Get history with versions

## 🛠️ Tech Stack Details

### Core Framework

- **NestJS 11** - Progressive Node.js framework
- **TypeScript** - Type safety and modern features

### Database & ORM

- **TypeORM** - Object-Relational Mapping
- **PostgreSQL** - Relational database

### Authentication & Security

- **@nestjs/jwt** - JWT token management
- **@nestjs/passport** - Authentication strategies
- **passport-jwt** - JWT strategy

### Validation & Transformation

- **class-validator** - DTO validation
- **class-transformer** - Data transformation

### Development Tools

- **ts-node** - TypeScript execution
- **ts-jest** - Jest with TypeScript
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📋 Configuration Files

### .env (Environment Variables)

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=vdms_db
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=3000
```

### package.json Dependencies Added

```json
{
  "@nestjs/jwt": "^12.0.1",
  "@nestjs/passport": "^10.0.3",
  "passport": "^0.7.0",
  "passport-jwt": "^4.0.1"
}
```

## ✅ Verification Checklist

- ✅ JWT authentication implemented
- ✅ Role guards working (L1, L2, L3)
- ✅ All 4 modules created
- ✅ All entities with relationships
- ✅ 40+ API endpoints built
- ✅ DTOs with validation
- ✅ Dashboard statistics
- ✅ Approval chain tracking
- ✅ Review versioning
- ✅ Comprehensive documentation
- ✅ Environment configuration
- ✅ Error handling
- ✅ RESTful conventions
- ✅ Seeder for test data

## 🎓 Learning Resources

### Key Files to Review

1. `src/modules/auth/jwt.strategy.ts` - JWT implementation
2. `src/modules/auth/roles.guard.ts` - RBAC implementation
3. `src/modules/approvals/approvals.service.ts` - Business logic
4. `src/modules/reviews/reviews.service.ts` - Version tracking
5. `src/app.module.ts` - Module integration

### Common Questions

- **How to authenticate?** See `POST /auth/login` in MANAGER_PORTAL_API.md
- **How to check roles?** See `@Roles()` decorator usage
- **How to track approvals?** See `GET /approvals/chain/:projectId`
- **How to manage reviews?** See Review endpoints in MANAGER_PORTAL_API.md

## 📞 Support

For issues or questions:

1. Check MANAGER_PORTAL_API.md for endpoint details
2. Review IMPLEMENTATION_SUMMARY.md for architecture
3. See QUICK_START.md for setup issues
4. Check service files for business logic
5. Review test files for usage examples
