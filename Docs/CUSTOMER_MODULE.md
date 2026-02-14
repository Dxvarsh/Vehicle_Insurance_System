# 📋 Customer Module - Technical Documentation

## Table of Contents
1. [Module Overview](#module-overview)
2. [Architecture Flow](#architecture-flow)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Authentication & Authorization](#authentication--authorization)
6. [Frontend Pages & Components](#frontend-pages--components)
7. [State Management (Redux)](#state-management-redux)
8. [Data Flow Diagrams](#data-flow-diagrams)
9. [Feature-Wise Breakdown](#feature-wise-breakdown)
10. [Validation Rules](#validation-rules)
11. [Error Handling](#error-handling)
12. [Security Measures](#security-measures)

---

## Module Overview

The **Customer Module** is a core entity module in the Vehicle Insurance Management System (VIMS). It handles everything related to customer lifecycle management — from registration to profile management, from admin oversight to dashboard analytics.

### What This Module Does

| Feature | Description | Who Can Use |
|:--------|:-----------|:------------|
| Self-Registration | Customers register themselves via signup form | Public |
| Profile View | Customers can view their complete profile | Customer |
| Profile Edit | Customers can update name, email, phone, address | Customer |
| Admin Customer List | Admin sees all customers with search, filter, sort, pagination | Admin |
| Staff Customer List | Staff can view all customers | Staff |
| Register Customer (Staff) | Staff/Admin can register customers on their behalf | Admin, Staff |
| Activate/Deactivate | Admin can enable or disable customer accounts | Admin |
| Customer Dashboard | Real-time summary of policies, claims, vehicles, notifications | Customer |
| Customer Detail View | Admin/Staff can view detailed customer profile | Admin, Staff |
| Customer Statistics | Aggregated stats (total, active, inactive, growth) | Admin, Staff |

### Tech Stack Used

| Layer | Technology |
|:------|:-----------|
| Frontend | React.js, Redux Toolkit, React Router, React Hook Form |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| Authentication | JWT (JSON Web Tokens) |
| Validation | express-validator (Backend), React Hook Form (Frontend) |
| Styling | Tailwind CSS v4 |

---

## Architecture Flow

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                      │
│                                                          │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  ┌─────────┐ │
│  │  Pages   │→ │  Hooks   │→ │  Redux    │→ │ Service │ │
│  │(UI Layer)│  │(useAuth) │  │  Store    │  │  (API)  │ │
│  └─────────┘  └──────────┘  └───────────┘  └────┬────┘ │
│                                                   │      │
└───────────────────────────────────────────────────┼──────┘
                                                    │
                                          HTTP (Axios)
                                                    │
┌───────────────────────────────────────────────────┼──────┐
│                     BACKEND (Express.js)          │      │
│                                                   ▼      │
│  ┌─────────┐  ┌────────────┐  ┌────────────┐  ┌──────┐ │
│  │ Routes  │→ │ Middleware │→ │ Controller │→ │Model │ │
│  │         │  │(Auth+Valid)│  │  (Logic)   │  │      │ │
│  └─────────┘  └────────────┘  └────────────┘  └──┬───┘ │
│                                                   │      │
└───────────────────────────────────────────────────┼──────┘
                                                    │
                                                    ▼
                                            ┌──────────────┐
                                            │   MongoDB     │
                                            │  (Database)   │
                                            └──────────────┘
```

### Request Flow (Example: Update Customer Profile)

```
Customer clicks "Save Changes"
        │
        ▼
React Hook Form validates input (client-side)
        │
        ▼
Redux Thunk dispatches `updateCustomer` action
        │
        ▼
customerService.updateCustomer() calls API via Axios
        │
        ▼
PUT /api/customers/:id  →  Express Router
        │
        ▼
authMiddleware.protect()  →  Verifies JWT Token
        │
        ▼
authMiddleware.authorize('Admin', 'Customer')  →  Role Check
        │
        ▼
validate middleware  →  Server-side validation (express-validator)
        │
        ▼
customerController.updateCustomer()
   ├── Find customer in DB
   ├── Check ownership (Customer can only edit own profile)
   ├── Check duplicate email/phone
   ├── Update fields
   ├── Sync email with User model
   └── Return updated customer
        │
        ▼
Redux store updates state
        │
        ▼
React re-renders UI with new data
        │
        ▼
Toast notification: "Profile updated successfully"
```

---

## Database Schema

### Customer Collection

```javascript
// MongoDB Collection: customers

{
  _id: ObjectId("..."),                    // Auto-generated MongoDB ID
  customerID: "CUST-00001",               // Auto-generated readable ID
  name: "Rahul Sharma",                   // Required, min 2 chars
  contactNumber: "9876543210",            // Required, unique, 10 digits
  email: "rahul@example.com",             // Required, unique, valid email
  address: "456 MG Road, Mumbai",         // Required
  vehicleIDs: [                           // References to Vehicle collection
    ObjectId("..."),
    ObjectId("...")
  ],
  isActive: true,                         // Default: true
  createdAt: ISODate("2026-02-14"),       // Auto-generated
  updatedAt: ISODate("2026-02-14")        // Auto-generated
}
```

### User Collection (Linked to Customer)

```javascript
// MongoDB Collection: users

{
  _id: ObjectId("..."),
  userID: "USR-00003",
  username: "rahulsharma",
  email: "rahul@example.com",             // Same as customer email
  password: "$2a$10$...",                 // Bcrypt hashed (never stored as plain text)
  role: "Customer",                       // Enum: Admin, Staff, Customer
  linkedCustomerID: ObjectId("..."),      // Points to Customer document
  isActive: true,
  lastLogin: ISODate("2026-02-14"),
  createdAt: ISODate("2026-02-14")
}
```

### Relationship Between User and Customer

```
┌──────────────┐         ┌──────────────────┐
│     User     │         │    Customer      │
├──────────────┤         ├──────────────────┤
│ userID       │         │ customerID       │
│ username     │         │ name             │
│ email        │    1:1  │ email            │
│ password     │────────→│ contactNumber    │
│ role         │         │ address          │
│ linkedCust.. │─────────│ vehicleIDs[]     │
│ isActive     │         │ isActive         │
└──────────────┘         └──────────────────┘

- One User maps to One Customer (for role = "Customer")
- Admin and Staff users don't have linkedCustomerID
- When customer is deactivated, both User and Customer isActive = false
```

### Auto-Generated ID System

```javascript
// Counter Collection tracks sequences for readable IDs

// How it works:
// 1. When new customer is created, Counter collection is queried
// 2. Sequence for "customerID" is incremented atomically
// 3. Formatted as "CUST-00001", "CUST-00002", etc.

// Example:
counterSchema.statics.getNextSequence = async function(sequenceName) {
  const counter = await this.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence: 1 } },
    { returnDocument: 'after', upsert: true }
  );
  return counter.sequence;
};

// In Customer model pre-save hook:
customerSchema.pre('save', async function() {
  if (this.isNew) {
    const seq = await Counter.getNextSequence('customerID');
    this.customerID = `CUST-${String(seq).padStart(5, '0')}`;
    // Result: CUST-00001, CUST-00002, CUST-00003...
  }
});
```

---

## API Endpoints

### Complete Customer API Reference

| # | Method | Endpoint | Description | Access | Auth Required |
|:--|:-------|:---------|:-----------|:-------|:-------------|
| 1 | GET | `/api/customers` | List all customers | Admin, Staff | ✅ JWT |
| 2 | GET | `/api/customers/stats` | Customer statistics | Admin, Staff | ✅ JWT |
| 3 | GET | `/api/customers/:id` | Get single customer | Admin, Staff, Owner | ✅ JWT |
| 4 | GET | `/api/customers/:id/dashboard` | Customer dashboard data | Admin, Staff, Owner | ✅ JWT |
| 5 | PUT | `/api/customers/:id` | Update customer profile | Admin, Owner | ✅ JWT |
| 6 | DELETE | `/api/customers/:id` | Toggle activate/deactivate | Admin | ✅ JWT |
| 7 | POST | `/api/customers/register` | Staff registers customer | Admin, Staff | ✅ JWT |

---

### Endpoint 1: Get All Customers

```
GET /api/customers?page=1&limit=10&search=rahul&sortBy=name&sortOrder=asc&isActive=true
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|:----------|:-----|:--------|:-----------|
| page | Number | 1 | Page number |
| limit | Number | 10 | Records per page (max 100) |
| search | String | "" | Search in name, email, phone, customerID |
| sortBy | String | "createdAt" | Sort field (name, email, customerID, createdAt) |
| sortOrder | String | "desc" | Sort direction (asc/desc) |
| isActive | String | - | Filter: "true" or "false" |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
      "customerID": "CUST-00001",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "contactNumber": "9876543210",
      "address": "456 MG Road, Mumbai",
      "isActive": true,
      "vehicleIDs": [
        {
          "vehicleNumber": "MH01AB1234",
          "vehicleType": "4-Wheeler",
          "model": "Honda City"
        }
      ],
      "createdAt": "2026-02-14T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalRecords": 47,
    "limit": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

**How Search Works:**

```javascript
// Backend builds a MongoDB $or query for search
if (search) {
  filter.$or = [
    { name: { $regex: search, $options: 'i' } },         // Case-insensitive
    { email: { $regex: search, $options: 'i' } },
    { contactNumber: { $regex: search, $options: 'i' } },
    { customerID: { $regex: search, $options: 'i' } },
  ];
}

// Example: search = "rahul"
// MongoDB finds documents where name OR email OR phone OR ID contains "rahul"
```

---

### Endpoint 2: Get Customer Statistics

```
GET /api/customers/stats
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Customer stats fetched successfully",
  "data": {
    "total": 47,
    "active": 42,
    "inactive": 5,
    "thisMonth": 8,
    "lastMonth": 6,
    "growthPercentage": 33
  }
}
```

**How Growth is Calculated:**

```javascript
// Growth % = ((thisMonth - lastMonth) / lastMonth) × 100
// Example: thisMonth = 8, lastMonth = 6
// Growth = ((8 - 6) / 6) × 100 = 33.33% → Rounded to 33%

const growth = lastMonthCustomers > 0
  ? Math.round(((thisMonthCustomers - lastMonthCustomers) / lastMonthCustomers) * 100)
  : thisMonthCustomers > 0 ? 100 : 0;
```

---

### Endpoint 3: Get Customer by ID

```
GET /api/customers/:id
```

**Ownership Check Logic:**

```javascript
// If the logged-in user is a Customer, they can ONLY view their own profile
if (req.user.role === 'Customer') {
  if (req.user.linkedCustomerID.toString() !== req.params.id) {
    return 403 Forbidden: "You can only view your own profile"
  }
}
// Admin and Staff can view any customer
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "customer": {
      "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
      "customerID": "CUST-00001",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "contactNumber": "9876543210",
      "address": "456 MG Road, Mumbai",
      "isActive": true,
      "vehicleIDs": [
        {
          "vehicleID": "VEH-00001",
          "vehicleNumber": "MH01AB1234",
          "vehicleType": "4-Wheeler",
          "model": "Honda City",
          "registrationYear": 2022
        }
      ]
    },
    "userAccount": {
      "userID": "USR-00003",
      "username": "rahulsharma",
      "role": "Customer",
      "isActive": true,
      "lastLogin": "2026-02-14T10:30:00.000Z"
    }
  }
}
```

---

### Endpoint 4: Customer Dashboard

```
GET /api/customers/:id/dashboard
```

**What Data is Fetched (All in Parallel):**

```javascript
// Using Promise.all for performance - all queries run simultaneously
const [
  vehicles,          // All customer vehicles
  totalPremiums,     // Count of all premiums
  paidPremiums,      // Count of paid premiums (= active policies)
  pendingPremiums,   // Count of pending premiums
  activePolicies,    // Recent active policy details
  totalClaims,       // Count of all claims
  pendingClaims,     // Count of pending claims
  approvedClaims,    // Count of approved claims
  rejectedClaims,    // Count of rejected claims
  pendingRenewals,   // Count of pending renewals
  expiredRenewals,   // Count of expired renewals
  recentNotifications, // Last 5 notifications
  unreadCount,       // Unread notification count
] = await Promise.all([...queries]);

// Additionally, MongoDB Aggregation for totals:
// - Total amount paid (sum of all paid premiums)
// - Total claim amount approved (sum of approved claim amounts)
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "customer": {
      "customerID": "CUST-00001",
      "name": "Rahul Sharma"
    },
    "summary": {
      "vehicles": {
        "total": 2,
        "list": [
          { "vehicleNumber": "MH01AB1234", "vehicleType": "4-Wheeler", "model": "Honda City" }
        ]
      },
      "policies": {
        "active": 1,
        "total": 2,
        "pending": 1,
        "recentActive": [...]
      },
      "claims": {
        "total": 3,
        "pending": 1,
        "approved": 1,
        "rejected": 1,
        "totalApprovedAmount": 50000
      },
      "renewals": {
        "pending": 1,
        "expired": 0
      },
      "payments": {
        "totalPaid": 15000,
        "pendingPayments": 1
      },
      "notifications": {
        "recent": [...],
        "unreadCount": 3
      }
    }
  }
}
```

---

### Endpoint 5: Update Customer

```
PUT /api/customers/:id
Content-Type: application/json

{
  "name": "Rahul Kumar Sharma",
  "address": "789 New Address, Delhi"
}
```

**Update Logic Flow:**

```
1. Find customer by ID
   └── Not found? → 404 Error

2. Check ownership (if Customer role)
   └── Not owner? → 403 Forbidden

3. If email is being changed:
   ├── Check duplicate in Customer collection
   ├── Check duplicate in User collection
   └── Update email in BOTH Customer and User models

4. If contactNumber is being changed:
   └── Check duplicate in Customer collection

5. Update only the fields that were sent
   └── Don't overwrite fields not included in request

6. Save and return updated customer
```

---

### Endpoint 6: Toggle Customer Status

```
DELETE /api/customers/:id
Content-Type: application/json

{ "isActive": false }
```

**What Happens on Deactivation:**

```
1. Customer.isActive → false
2. Linked User.isActive → false (synced)
3. Customer can NO LONGER login
4. All existing data is PRESERVED (not deleted)
5. Admin can RE-ACTIVATE anytime by sending { "isActive": true }
```

**Why DELETE method?** Following REST conventions where DELETE typically disables/removes a resource. In our case, it's a "soft delete" — the data remains but the account is disabled.

---

### Endpoint 7: Staff Register Customer

```
POST /api/customers/register
Content-Type: application/json

{
  "name": "New Customer",
  "email": "new@example.com",
  "contactNumber": "9876543211",
  "address": "Some Address",
  "username": "newcustomer",
  "password": "NewCust@1234"
}
```

**Registration Flow:**

```
1. Check if Customer exists (by email or contactNumber)
   └── Exists? → 409 Conflict

2. Check if User exists (by email or username)
   └── Exists? → 409 Conflict

3. Create Customer document
   └── Auto-generates: customerID = "CUST-00005"

4. Create User document
   ├── Auto-generates: userID = "USR-00008"
   ├── Password hashed with bcrypt (10 salt rounds)
   ├── Role = "Customer"
   ├── linkedCustomerID = customer._id
   └── emailVerified = true (staff-registered = pre-verified)

5. Return both customer and user info
   └── Also returns who registered (staff details)
```

---

## Authentication & Authorization

### How JWT Authentication Works

```
┌─────────┐                    ┌──────────┐                    ┌──────────┐
│ Browser  │                    │  Server  │                    │ MongoDB  │
└────┬─────┘                    └────┬─────┘                    └────┬─────┘
     │                               │                               │
     │  POST /api/auth/login         │                               │
     │  {email, password}            │                               │
     │──────────────────────────────→│                               │
     │                               │  Find user by email           │
     │                               │──────────────────────────────→│
     │                               │  User document                │
     │                               │←──────────────────────────────│
     │                               │                               │
     │                               │  bcrypt.compare(password)     │
     │                               │  ✅ Match!                    │
     │                               │                               │
     │                               │  Generate JWT:                │
     │                               │  { id: user._id, role: "Customer" }
     │                               │  Signed with JWT_SECRET       │
     │                               │  Expires in 24 hours          │
     │                               │                               │
     │  Response:                    │                               │
     │  { accessToken: "eyJhb..." }  │                               │
     │←──────────────────────────────│                               │
     │                               │                               │
     │  GET /api/customers/:id       │                               │
     │  Header: Authorization:       │                               │
     │  Bearer eyJhb...              │                               │
     │──────────────────────────────→│                               │
     │                               │  Verify JWT                   │
     │                               │  Decode: { id, role }         │
     │                               │  Find user by id              │
     │                               │──────────────────────────────→│
     │                               │  User found, isActive=true    │
     │                               │←──────────────────────────────│
     │                               │                               │
     │                               │  Check role authorization     │
     │                               │  "Customer" ∈ allowed roles? ✅│
     │                               │                               │
     │                               │  Check ownership              │
     │                               │  user.linkedCustomerID === :id? ✅
     │                               │                               │
     │                               │  Execute controller logic     │
     │                               │──────────────────────────────→│
     │  Customer data response       │  Query result                 │
     │←──────────────────────────────│←──────────────────────────────│
     │                               │                               │
```

### Role-Based Access Control (RBAC) Matrix

```
                    Admin    Staff    Customer
                    ─────    ─────    ────────
List Customers       ✅       ✅        ❌
Customer Stats       ✅       ✅        ❌
View Any Customer    ✅       ✅        ❌
View Own Profile     ✅       ✅        ✅
Edit Any Customer    ✅       ❌        ❌
Edit Own Profile     ─        ─         ✅
Activate/Deactivate  ✅       ❌        ❌
Register Customer    ✅       ✅        ❌
Customer Dashboard   ✅       ✅        ✅ (own only)
```

### Middleware Chain for Each Request

```javascript
// Example: PUT /api/customers/:id

router.put(
  '/:id',
  protect,                    // Step 1: Verify JWT token exists and is valid
  authorize('Admin', 'Customer'), // Step 2: Check if role is Admin or Customer
  customerIdValidator,        // Step 3: Validate :id is a valid MongoDB ObjectId
  updateCustomerValidator,    // Step 4: Validate request body fields
  validate,                   // Step 5: Check validation results, return errors if any
  updateCustomer              // Step 6: Execute business logic
);

// If ANY middleware fails, the request stops and returns an error
// The controller (Step 6) only runs if ALL middleware passes
```

---

## Frontend Pages & Components

### Page Architecture

```
┌──────────────────────────────────────────────────┐
│                  AppRoutes.jsx                     │
│                                                    │
│  ┌─ Public Routes ────────────────────────────┐   │
│  │  /login          → LoginPage               │   │
│  │  /register       → RegisterPage            │   │
│  └────────────────────────────────────────────┘   │
│                                                    │
│  ┌─ Customer Routes (Protected) ──────────────┐   │
│  │  /dashboard      → CustomerDashboardPage   │   │
│  │  /profile        → ProfilePage             │   │
│  └────────────────────────────────────────────┘   │
│                                                    │
│  ┌─ Admin Routes (Protected: Admin only) ─────┐   │
│  │  /admin/customers     → CustomerListPage   │   │
│  │  /admin/customers/new → RegisterCustomerPage│  │
│  │  /admin/customers/:id → CustomerDetailPage │   │
│  └────────────────────────────────────────────┘   │
│                                                    │
│  ┌─ Staff Routes (Protected: Staff only) ─────┐   │
│  │  /staff/customers     → CustomerListPage   │   │
│  │  /staff/customers/new → RegisterCustomerPage│  │
│  │  /staff/customers/:id → CustomerDetailPage │   │
│  └────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

### How Route Protection Works

```javascript
// ProtectedRoute component wraps every protected page:

<ProtectedRoute allowedRoles={['Admin']}>
  <DashboardLayout>
    <CustomerListPage />
  </DashboardLayout>
</ProtectedRoute>

// Logic:
// 1. Check if user is authenticated (has valid token)
//    └── No? → Redirect to /login
// 2. Check if user's role is in allowedRoles array
//    └── No? → Redirect to /unauthorized
// 3. All checks pass → Render the page
```

### Pages Summary

#### 1. Customer Dashboard Page (`/dashboard`)

```
┌─────────────────────────────────────────────┐
│  Welcome back, Rahul!                       │
│  Here's your insurance overview             │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ Purchase │ │ File a   │ │ Add      │   │
│  │ Policy   │ │ Claim    │ │ Vehicle  │   │
│  └──────────┘ └──────────┘ └──────────┘   │
│                                             │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌─────┐ │
│  │Active  │ │My      │ │Pending │ │Total│ │
│  │Policies│ │Vehicles│ │Claims  │ │Paid │ │
│  │   1    │ │   2    │ │   1    │ │₹15K │ │
│  └────────┘ └────────┘ └────────┘ └─────┘ │
│                                             │
│  ┌─ My Vehicles ──┐ ┌─ Active Policies ─┐  │
│  │ MH01AB1234     │ │ Comprehensive     │  │
│  │ Honda City     │ │ ₹15,000/year      │  │
│  └────────────────┘ └───────────────────┘  │
│                                             │
│  ┌─ Claims ──┐ ┌─ Renewals ┐ ┌─ Notifs ─┐  │
│  │ Total: 3  │ │ Pending:1 │ │ Unread:3 │  │
│  │ Approved:1│ │ Expired:0 │ │ Policy   │  │
│  │ Pending:1 │ │           │ │ expiring │  │
│  └───────────┘ └───────────┘ └──────────┘  │
└─────────────────────────────────────────────┘

Data Source: GET /api/customers/:id/dashboard
Loads on: Component mount (useEffect)
Updates: Every time page is visited
```

#### 2. Profile Page (`/profile`)

```
┌─────────────────────────────────────────────┐
│  My Profile                    [Edit Profile]│
│  View and manage your account               │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─── Profile Header (Blue Gradient) ────┐  │
│  │  [R]  Rahul Sharma                    │  │
│  │       CUST-00001  [Customer]          │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌─── VIEW MODE ─────────────────────────┐  │
│  │  Customer ID    CUST-00001            │  │
│  │  Username       rahulsharma           │  │
│  │  Email          rahul@example.com     │  │
│  │  Contact        9876543210            │  │
│  │  Address        456 MG Road, Mumbai   │  │
│  │  Role           Customer              │  │
│  │  Member Since   14 Feb 2026           │  │
│  │  Last Login     14 Feb 2026           │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌─── EDIT MODE (when Edit clicked) ─────┐  │
│  │  Full Name     [Rahul Sharma      ]   │  │
│  │  Contact       [9876543210        ]   │  │
│  │  Email         [rahul@example.com ]   │  │
│  │  Address       [456 MG Road       ]   │  │
│  │                                       │  │
│  │              [Cancel] [Save Changes]  │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘

Toggle: View Mode ↔ Edit Mode
Validation: Client-side (React Hook Form) + Server-side
Only sends changed fields to API
```

#### 3. Customer List Page (`/admin/customers`)

```
┌──────────────────────────────────────────────────┐
│  Customer Management              [Register New] │
│  View and manage all registered customers        │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐ │
│  │ Total  │ │ Active │ │Inactive│ │This Month│ │
│  │  47    │ │  42    │ │   5    │ │  8 ↑33%  │ │
│  └────────┘ └────────┘ └────────┘ └──────────┘ │
│                                                  │
│  ┌─ Search & Filters ───────────────────────────┤
│  │  [🔍 Search by name, email, phone...]        │
│  │  [All Status ▾] [Sort: Newest ▾] [10/page ▾]│
│  └──────────────────────────────────────────────┤
│                                                  │
│  ┌─ Data Table ─────────────────────────────────┤
│  │ Customer    │ Email       │ Status │ Actions ││
│  │─────────────┼─────────────┼────────┼─────────│
│  │ [R] Rahul   │ rahul@...   │ Active │ 👁 🚫  ││
│  │ CUST-00001  │             │        │         ││
│  │─────────────┼─────────────┼────────┼─────────│
│  │ [P] Priya   │ priya@...   │ Active │ 👁 🚫  ││
│  │ CUST-00002  │             │        │         ││
│  └──────────────────────────────────────────────┤
│                                                  │
│  Showing 1 to 10 of 47       [< 1 2 3 4 5 >]   │
└──────────────────────────────────────────────────┘

Features:
- Real-time search (500ms debounce)
- Filter by Active/Inactive
- Sort by Name, Email, ID, Date
- Pagination with page numbers
- Activate/Deactivate with confirmation modal
```

#### 4. Register Customer Page (`/admin/customers/new`)

```
┌─────────────────────────────────────────────┐
│  Register New Customer            [← Back]  │
│  Create a new customer account              │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─── Personal Information ──────────────┐  │
│  │  Full Name *     Contact Number *     │  │
│  │  [             ] [                  ] │  │
│  │                                       │  │
│  │  Email Address *                      │  │
│  │  [                                  ] │  │
│  │                                       │  │
│  │  Address *                            │  │
│  │  [                                  ] │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌─── Account Credentials ───────────────┐  │
│  │  Username *                           │  │
│  │  [                                  ] │  │
│  │                                       │  │
│  │  Password *          Confirm *        │  │
│  │  [               ]  [              ] │  │
│  └───────────────────────────────────────┘  │
│                                             │
│                 [Cancel] [Register Customer] │
└─────────────────────────────────────────────┘

Creates BOTH Customer + User records in one API call
Password is hashed server-side
Account is pre-verified (emailVerified = true)
```

---

## State Management (Redux)

### Redux Store Structure

```javascript
// How state is organized in Redux store

store = {
  auth: {
    user: { _id, userID, username, email, role, linkedCustomerID },
    customer: { _id, customerID, name, email, contactNumber, address },
    isAuthenticated: true,
    isInitialized: true,
    isLoading: false,
    error: null,
  },

  customer: {
    customers: [...],           // Array of customer objects (Admin list)
    pagination: {               // Pagination metadata
      currentPage: 1,
      totalPages: 5,
      totalRecords: 47,
      limit: 10,
      hasNextPage: true,
      hasPrevPage: false,
    },
    stats: {                    // Customer statistics
      total: 47,
      active: 42,
      inactive: 5,
      thisMonth: 8,
      growthPercentage: 33,
    },
    selectedCustomer: null,     // Single customer detail
    dashboard: null,            // Customer dashboard data
    isLoading: false,
    isUpdating: false,
    error: null,
  }
}
```

### Redux Data Flow

```
User Action (Click, Form Submit)
        │
        ▼
Component dispatches Async Thunk
        │
  dispatch(fetchAllCustomers({ page: 1, search: "rahul" }))
        │
        ▼
Redux Middleware processes thunk
        │
  ┌─────┤ Thunk executes:
  │     │   1. Sets state: isLoading = true  (pending)
  │     │   2. Calls: customerService.getAllCustomers(params)
  │     │   3. Axios sends HTTP request to backend
  │     │
  │     ▼
  │  Backend processes and returns response
  │     │
  │     ▼
  │  On Success:                    On Failure:
  │  state.customers = data         state.error = message
  │  state.pagination = pagination  state.isLoading = false
  │  state.isLoading = false
  │     │
  └─────┤
        ▼
React detects state change → Re-renders components
```

### Async Thunk Pattern Used

```javascript
// All API calls follow this pattern:

export const fetchAllCustomers = createAsyncThunk(
  'customer/fetchAll',                    // Action type prefix
  async (params, { rejectWithValue }) => { // Payload creator
    try {
      const response = await customerService.getAllCustomers(params);
      return response;                     // Goes to .fulfilled case
    } catch (error) {
      return rejectWithValue(              // Goes to .rejected case
        error.response?.data?.message || 'Failed to fetch customers'
      );
    }
  }
);

// Redux automatically creates 3 action types:
// 'customer/fetchAll/pending'   → isLoading = true
// 'customer/fetchAll/fulfilled' → Update data, isLoading = false
// 'customer/fetchAll/rejected'  → Set error, isLoading = false
```

---

## Data Flow Diagrams

### Customer Registration Flow (Self-Registration)

```
┌───────────┐     ┌──────────┐     ┌───────────┐     ┌──────────┐
│  Register │     │  Auth    │     │  Auth     │     │  MongoDB │
│  Page     │     │  Slice   │     │ Controller│     │          │
└────┬──────┘     └─────┬────┘     └────┬──────┘     └─────┬────┘
     │                  │               │                  │
     │ Fill form +      │               │                  │
     │ Click Register   │               │                  │
     │─────────────────→│               │                  │
     │                  │ POST /auth/   │                  │
     │                  │ register      │                  │
     │                  │──────────────→│                  │
     │                  │               │ Check duplicates │
     │                  │               │─────────────────→│
     │                  │               │ No duplicates    │
     │                  │               │←─────────────────│
     │                  │               │ Create Customer  │
     │                  │               │─────────────────→│
     │                  │               │ CUST-00005       │
     │                  │               │←─────────────────│
     │                  │               │ Create User      │
     │                  │               │─────────────────→│
     │                  │               │ USR-00008        │
     │                  │               │←─────────────────│
     │                  │               │ Generate JWT     │
     │                  │ { user,       │                  │
     │                  │   customer,   │                  │
     │                  │   token }     │                  │
     │                  │←──────────────│                  │
     │ Store token      │               │                  │
     │ Update state     │               │                  │
     │ Redirect to      │               │                  │
     │ /dashboard       │               │                  │
     │←─────────────────│               │                  │
     │                  │               │                  │
```

### Admin Customer Management Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Customer │     │ Customer │     │ Customer │     │  MongoDB │
│  List Page│     │  Slice   │     │Controller│     │          │
└────┬──────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                  │               │                  │
     │ Page Load        │               │                  │
     │─────────────────→│               │                  │
     │                  │ GET /customers│                  │
     │                  │ ?page=1       │                  │
     │                  │──────────────→│                  │
     │                  │               │ Verify JWT       │
     │                  │               │ Check role=Admin │
     │                  │               │ Query DB         │
     │                  │               │─────────────────→│
     │                  │               │ 10 customers     │
     │                  │               │ + pagination     │
     │                  │               │←─────────────────│
     │                  │ { data,       │                  │
     │                  │   pagination }│                  │
     │                  │←──────────────│                  │
     │ Render table     │               │                  │
     │←─────────────────│               │                  │
     │                  │               │                  │
     │ Type "rahul"     │               │                  │
     │ in search        │               │                  │
     │────(500ms)──────→│               │                  │
     │                  │ GET /customers│                  │
     │                  │ ?search=rahul │                  │
     │                  │──────────────→│                  │
     │                  │               │ $or query        │
     │                  │               │─────────────────→│
     │                  │ Filtered data │ Matching docs    │
     │                  │←──────────────│←─────────────────│
     │ Re-render table  │               │                  │
     │←─────────────────│               │                  │
     │                  │               │                  │
     │ Click Deactivate │               │                  │
     │────────────────→ │               │                  │
     │                  │ Show confirm  │                  │
     │ Confirm          │ modal         │                  │
     │─────────────────→│               │                  │
     │                  │ DELETE        │                  │
     │                  │ /customers/:id│                  │
     │                  │──────────────→│                  │
     │                  │               │ Set isActive=    │
     │                  │               │ false on both    │
     │                  │               │ Customer + User  │
     │                  │               │─────────────────→│
     │                  │ Success       │                  │
     │                  │←──────────────│←─────────────────│
     │ Update table     │               │                  │
     │ Show toast       │               │                  │
     │←─────────────────│               │                  │
```

---

## Validation Rules

### Client-Side Validation (React Hook Form)

```javascript
// All form fields are validated BEFORE sending to server

const validationRules = {
  name: {
    required: "This field is required",
    minLength: { value: 2, message: "Name must be at least 2 characters" }
  },

  email: {
    required: "This field is required",
    pattern: {
      value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      message: "Please enter a valid email address"
    }
  },

  contactNumber: {
    required: "This field is required",
    pattern: {
      value: /^\d{10}$/,
      message: "Phone number must be exactly 10 digits"
    }
  },

  password: {
    required: "This field is required",
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      message: "Must contain uppercase, lowercase, and number (min 8 chars)"
    }
  },

  username: {
    required: "This field is required",
    pattern: {
      value: /^[a-zA-Z0-9_]{3,}$/,
      message: "Letters, numbers, underscores only (min 3 chars)"
    }
  }
};
```

### Server-Side Validation (express-validator)

```javascript
// Server validates AGAIN even if client validated
// This prevents API abuse via direct HTTP requests

export const updateCustomerValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),

  body('contactNumber')
    .optional()
    .trim()
    .matches(/^\d{10}$/)
    .withMessage('Contact number must be exactly 10 digits'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email'),

  body('address')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Address cannot be empty'),
];

// If validation fails, response:
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "contactNumber",
      "message": "Contact number must be exactly 10 digits",
      "value": "123"
    }
  ]
}
```

### Why Both Client AND Server Validation?

```
Client-Side Validation:
├── Provides instant feedback to user
├── Prevents unnecessary API calls
├── Better user experience
└── Can be bypassed (browser dev tools, direct API calls)

Server-Side Validation:
├── Cannot be bypassed
├── Protects data integrity
├── Handles edge cases client misses
└── Security layer against malicious input

RULE: Never trust client-side validation alone!
```

---

## Error Handling

### Error Response Format

```javascript
// ALL API errors follow this consistent format:

// Validation Error (400)
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Please enter a valid email", "value": "bad-email" }
  ]
}

// Not Found (404)
{
  "success": false,
  "message": "Customer not found"
}

// Duplicate (409)
{
  "success": false,
  "message": "A customer with this email already exists"
}

// Unauthorized (401)
{
  "success": false,
  "message": "Access denied. No token provided."
}

// Forbidden (403)
{
  "success": false,
  "message": "Access denied. You can only view your own profile."
}

// Server Error (500)
{
  "success": false,
  "message": "Internal Server Error"
}
```

### Frontend Error Handling

```javascript
// Errors are handled at 3 levels:

// Level 1: Axios Interceptor (global)
// - Shows toast for all API errors
// - Handles 401 by attempting token refresh
// - Redirects to login if refresh fails

// Level 2: Redux Thunk (slice level)
// - Catches errors from service calls
// - Stores error message in Redux state
// - Components can display inline errors

// Level 3: Component Level
// - Form validation errors shown inline
// - Alert components for API errors
// - Toast notifications for success/failure
```

---

## Security Measures

### Security Features Implemented

| # | Security Measure | Implementation |
|:--|:----------------|:--------------|
| 1 | Password Hashing | bcrypt with 10 salt rounds — passwords never stored as plain text |
| 2 | JWT Authentication | Tokens expire in 24 hours, signed with secret key |
| 3 | Refresh Tokens | 7-day refresh tokens to get new access tokens without re-login |
| 4 | RBAC | Middleware checks user role before allowing access to any endpoint |
| 5 | Ownership Check | Customers can ONLY access their own data, enforced server-side |
| 6 | Input Validation | Both client-side and server-side validation on every input |
| 7 | Duplicate Prevention | Unique constraints on email, phone, username at database level |
| 8 | Soft Delete | Deactivation instead of deletion — data is never permanently lost |
| 9 | CORS Protection | Only configured client URL can access the API |
| 10 | Rate Limiting | Max 100 requests per 15 minutes per IP |
| 11 | Helmet | HTTP security headers (XSS protection, content type sniffing, etc.) |
| 12 | HTTP-Only Cookies | Tokens stored in HTTP-only cookies (not accessible via JavaScript) |

### Password Security Flow

```
Registration:
User enters: "Rahul@1234"
                │
                ▼
bcrypt.genSalt(10) → generates random salt
                │
                ▼
bcrypt.hash("Rahul@1234", salt)
                │
                ▼
Stored in DB: "$2a$10$K7ZxR3qW5vN8mP1cL2dY6e...."
(Original password is NEVER stored)

Login:
User enters: "Rahul@1234"
                │
                ▼
bcrypt.compare("Rahul@1234", "$2a$10$K7ZxR3...")
                │
                ▼
Returns: true (match!) or false (wrong password)

Note: Even if database is compromised, passwords cannot be reversed
```

---

## Summary

### Module Statistics

| Metric | Count |
|:-------|:------|
| API Endpoints | 7 |
| Frontend Pages | 5 |
| Redux Thunks | 7 |
| Reusable Components Used | 10 |
| Validation Rules | 12 |
| Database Models Involved | 7 (Customer, User, Vehicle, Premium, Claim, Renewal, Notification) |

### Requirements Fulfilled

| ID | Requirement | Status |
|:---|:-----------|:-------|
| CUST-01 | Customer self-registration with profile creation | ✅ Implemented |
| CUST-02 | View and update own profile details | ✅ Implemented |
| CUST-03 | Admin can view all customers with search & filter | ✅ Implemented |
| CUST-04 | Admin can activate/deactivate customer accounts | ✅ Implemented |
| CUST-05 | Staff can register new customers | ✅ Implemented |
| CUST-06 | Customer dashboard (policy summary, claims, notifications) | ✅ Implemented |

### Key Design Decisions

1. **Separate Customer and User models** — Clean separation of profile data vs authentication data
2. **Auto-generated readable IDs** — CUST-00001 format for human readability alongside MongoDB ObjectIds
3. **Soft delete pattern** — Deactivation instead of deletion preserves data integrity
4. **Parallel queries in dashboard** — Promise.all for performance (all 13 queries run simultaneously)
5. **Debounced search** — 500ms delay prevents excessive API calls while typing
6. **Only send changed fields** — Profile update only sends modified fields, not the entire form
7. **Email sync** — When customer email changes, it's updated in both Customer and User collections

---

*Document Version: 1.0*
*Last Updated: February 2026*
*Module: Customer Management*
*Project: Vehicle Insurance Management System (VIMS)*