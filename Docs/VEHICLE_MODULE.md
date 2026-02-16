# 🚗 Vehicle Module - Technical Documentation

## Table of Contents

1. [Module Overview](#module-overview)
2. [Architecture Flow](#architecture-flow)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Authentication & Authorization](#authentication--authorization)
6. [Business Rules & Validations](#business-rules--validations)
7. [Frontend Pages & Components](#frontend-pages--components)
8. [State Management (Redux)](#state-management-redux)
9. [Data Flow Diagrams](#data-flow-diagrams)
10. [Feature-Wise Breakdown](#feature-wise-breakdown)
11. [Premium Calculator Integration](#premium-calculator-integration)
12. [Error Handling](#error-handling)
13. [Security Measures](#security-measures)

---

## Module Overview

The **Vehicle Module** is the second core entity module in VIMS. Every insurance policy is ultimately tied to a vehicle, making this module the bridge between customers and insurance coverage. It handles the complete vehicle lifecycle — registration, management, and deletion — with strict business rules to maintain data integrity.

### What This Module Does

| Feature                   | Description                                   | Who Can Use                  |
| :------------------------ | :-------------------------------------------- | :--------------------------- |
| Add Vehicle               | Register a new vehicle with details           | Customer, Staff, Admin       |
| View My Vehicles          | Customer sees their own vehicles in card grid | Customer                     |
| View All Vehicles         | Admin/Staff sees all vehicles in data table   | Admin, Staff                 |
| View Vehicle Detail       | Detailed view with active policies info       | All (ownership enforced)     |
| Edit Vehicle              | Update vehicle details (with restrictions)    | Customer (own), Staff, Admin |
| Delete Vehicle            | Remove vehicle (only if no active policies)   | Customer (own), Admin        |
| Vehicle Statistics        | Aggregated stats by type, age, growth         | Admin, Staff                 |
| Vehicle Number Validation | Regex-based Indian format validation          | All (client + server)        |
| Duplicate Prevention      | No two vehicles can have same number          | System-enforced              |

### Why This Module is Critical

```text
Customer ──owns──→ Vehicle ──insured by──→ Policy
                      │
                      ├── Premium calculated based on vehicle type & age
                      ├── Claims filed against specific vehicle
                      └── Renewals tracked per vehicle-policy pair

Without Vehicle module:
  ❌ Cannot purchase insurance
  ❌ Cannot calculate premiums
  ❌ Cannot file claims
  ❌ Cannot track renewals
```

### Tech Stack Used

| Layer    | Technology            | Purpose                             |
| :------- | :-------------------- | :---------------------------------- |
| Frontend | React.js              | UI Components & Pages               |
| Frontend | Redux Toolkit         | State management for vehicle data   |
| Frontend | React Hook Form       | Form validation & handling          |
| Frontend | Tailwind CSS v4       | Styling with design system          |
| Backend  | Express.js            | REST API endpoints                  |
| Backend  | express-validator     | Server-side validation              |
| Database | MongoDB + Mongoose    | Data storage with schema validation |
| Auth     | JWT + RBAC Middleware | Authentication & role-based access  |

---

## Architecture Flow

### High-Level Module Architecture

```text
┌────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                        │
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │    Pages      │  │   Redux      │  │    Services          │ │
│  │              │  │   Store      │  │                      │ │
│  │ VehicleList  │→ │ vehicleSlice │→ │ vehicleService.js    │ │
│  │ AddVehicle   │  │              │  │                      │ │
│  │ EditVehicle  │  │ - vehicles[] │  │ - getAllVehicles()    │ │
│  │ VehicleDetail│  │ - pagination │  │ - getMyVehicles()    │ │
│  │ AdminVehicle │  │ - stats      │  │ - addVehicle()       │ │
│  │              │  │ - selected   │  │ - updateVehicle()    │ │
│  │              │  │ - loading    │  │ - deleteVehicle()    │ │
│  └──────────────┘  └──────────────┘  └──────────┬───────────┘ │
│                                                   │             │
└───────────────────────────────────────────────────┼─────────────┘
                                                    │
                                          Axios HTTP Requests
                                          (with JWT in header)
                                                    │
┌───────────────────────────────────────────────────┼─────────────┐
│                        BACKEND (Express.js)       │             │
│                                                   ▼             │
│  ┌──────────┐  ┌──────────────┐  ┌─────────────────────────┐  │
│  │  Routes   │→ │  Middleware   │→ │     Controller          │  │
│  │          │  │              │  │                         │  │
│  │ POST /   │  │ 1. protect   │  │ addVehicle()            │  │
│  │ GET  /   │  │ 2. authorize │  │ getAllVehicles()         │  │
│  │ GET  /my │  │ 3. validator │  │ getMyVehicles()          │  │
│  │ GET  /:id│  │ 4. validate  │  │ getVehicleById()        │  │
│  │ PUT  /:id│  │              │  │ updateVehicle()          │  │
│  │ DEL  /:id│  │              │  │ deleteVehicle()          │  │
│  └──────────┘  └──────────────┘  └────────────┬────────────┘  │
│                                                │               │
└────────────────────────────────────────────────┼───────────────┘
                                                 │
                                                 ▼
                                    ┌─────────────────────────┐
                                    │       MongoDB            │
                                    │                         │
                                    │  vehicles collection    │
                                    │  customers collection   │
                                    │  premiums collection    │
                                    │  counters collection    │
                                    └─────────────────────────┘
```

---

## Database Schema

### Vehicle Collection

` ` js

// MongoDB Collection: vehicles
// Mongoose Model: Vehicle

{
\_id: ObjectId("65f1b2c3d4e5f6a7b8c9d0e1"), // Auto-generated MongoDB ID
vehicleID: "VEH-00001", // Auto-generated readable ID
customerID: ObjectId("65f1a2b3c4d5e6f7a8b9c0d1"), // Reference to Customer
vehicleNumber: "MH01AB1234", // Required, Unique, Uppercase
vehicleType: "4-Wheeler", // Enum: 2-Wheeler, 4-Wheeler, Commercial
model: "Honda City ZX", // Required, 2-100 chars
registrationYear: 2022, // Required, 1990 to current year
createdAt: ISODate("2026-02-14T10:30:00Z"), // Auto-generated
updatedAt: ISODate("2026-02-14T10:30:00Z") // Auto-generated
}

````

### Schema Definition with Validations

``` ``` js

const vehicleSchema = new mongoose.Schema({
  vehicleID: {
    type: String,
    unique: true,
    // Auto-generated: VEH-00001, VEH-00002, etc.
  },
  customerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer ID is required'],
    // Creates an index for fast lookup
  },
  vehicleNumber: {
    type: String,
    required: [true, 'Vehicle number is required'],
    unique: true,          // Database-level uniqueness
    uppercase: true,       // Auto-converts to uppercase
    trim: true,            // Removes whitespace
    match: [
      /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/,
      'Vehicle number must be in valid format (e.g., KA01AB1234)'
    ],
  },
  vehicleType: {
    type: String,
    enum: {
      values: ['2-Wheeler', '4-Wheeler', 'Commercial'],
      message: '{VALUE} is not a valid vehicle type'
    },
    required: [true, 'Vehicle type is required'],
  },
  model: {
    type: String,
    required: [true, 'Vehicle model is required'],
    trim: true,
  },
  registrationYear: {
    type: Number,
    required: [true, 'Registration year is required'],
    min: [1990, 'Registration year must be 1990 or later'],
    max: [currentYear, 'Registration year cannot be in the future'],
  },
}, { timestamps: true });

// Virtual field: vehicleAge (not stored in DB, calculated on-the-fly)
vehicleSchema.virtual('vehicleAge').get(function() {
  return new Date().getFullYear() - this.registrationYear;
});
// Example: registrationYear = 2022, current = 2026 → vehicleAge = 4
````

### Entity Relationships

```text
┌──────────────┐     1:N     ┌──────────────┐
│   Customer   │────────────→│   Vehicle     │
│              │             │              │
│ _id          │←────────────│ customerID   │
│ vehicleIDs[] │             │ vehicleNumber│
│ name         │             │ vehicleType  │
│ email        │             │ model        │
└──────────────┘             └──────┬───────┘
                                    │
                                    │ 1:N
                                    ▼
                             ┌──────────────┐
                             │   Premium     │
                             │              │
                             │ vehicleID    │
                             │ policyID     │
                             │ customerID   │
                             │ paymentStatus│
                             └──────────────┘

One Customer → Many Vehicles
One Vehicle → Many Premiums (multiple policies)
Vehicle is referenced by: Premium, Claim, PolicyRenewal
```

### Auto-Generated Vehicle ID

` ` js

// How VEH-00001, VEH-00002, etc. are generated:

// 1. Counter collection tracks the sequence
// { \_id: "vehicleID", sequence: 5 }

// 2. Pre-save hook runs before every new vehicle is saved
vehicleSchema.pre('save', async function() {
if (this.isNew) {
// Atomically increment counter and get new value
const seq = await Counter.getNextSequence('vehicleID');
// seq = 6 (next number)

    // Format with zero-padding
    this.vehicleID = `VEH-${String(seq).padStart(5, '0')}`;
    // Result: "VEH-00006"

}
});

// Sequence: VEH-00001 → VEH-00002 → VEH-00003 → ...
// Never repeats, even if vehicles are deleted

````

### Vehicle Number Format (Indian Standard)

``` text
Format: XX 00 XX 0000
        ↓  ↓  ↓   ↓
        │  │  │   └── Unique Number (4 digits): 0001-9999
        │  │  └────── Series Code (1-2 letters): A, AB, XY
        │  └───────── District Code (2 digits): 01-99
        └──────────── State Code (2 letters): MH, KA, DL, GJ

Valid Examples:
  ✅ KA01AB1234    (Karnataka, District 01, Series AB, Number 1234)
  ✅ MH02A5678     (Maharashtra, District 02, Series A, Number 5678)
  ✅ DL14C9999     (Delhi, District 14, Series C, Number 9999)
  ✅ GJ05XY0001    (Gujarat, District 05, Series XY, Number 0001)

Invalid Examples:
  ❌ INVALID123    (No state/district code)
  ❌ KA1AB1234     (District must be 2 digits)
  ❌ KA01ABC1234   (Series max 2 letters)
  ❌ KA01AB123     (Number must be 4 digits)
  ❌ ka01ab1234    (Must be uppercase - auto-converted)

Regex Pattern: /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/
````

---

## API Endpoints

### Complete Vehicle API Reference

| #   | Method | Endpoint              | Description             | Access                 | Auth   |
| :-- | :----- | :-------------------- | :---------------------- | :--------------------- | :----- |
| 1   | POST   | `/api/vehicles`       | Add new vehicle         | Customer, Staff, Admin | ✅ JWT |
| 2   | GET    | `/api/vehicles`       | Get all vehicles        | Admin, Staff           | ✅ JWT |
| 3   | GET    | `/api/vehicles/my`    | Get customer's vehicles | Customer               | ✅ JWT |
| 4   | GET    | `/api/vehicles/stats` | Vehicle statistics      | Admin, Staff           | ✅ JWT |
| 5   | GET    | `/api/vehicles/:id`   | Get vehicle detail      | Admin, Staff, Owner    | ✅ JWT |
| 6   | PUT    | `/api/vehicles/:id`   | Update vehicle          | Customer, Staff, Admin | ✅ JWT |
| 7   | DELETE | `/api/vehicles/:id`   | Delete vehicle          | Customer, Admin        | ✅ JWT |

---

### Endpoint 1: Add Vehicle

```text
POST /api/vehicles
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

**Request Body (Customer):**

```json
{
  "vehicleNumber": "KA01AB1234",
  "vehicleType": "4-Wheeler",
  "model": "Honda City ZX",
  "registrationYear": 2022
}
```

**Request Body (Staff/Admin — adding for a customer):**

```json
{
  "vehicleNumber": "KA01AB1234",
  "vehicleType": "4-Wheeler",
  "model": "Honda City ZX",
  "registrationYear": 2022,
  "customerID": "65f1a2b3c4d5e6f7a8b9c0d1"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Vehicle added successfully",
  "data": {
    "vehicle": {
      "_id": "65f1b2c3d4e5f6a7b8c9d0e1",
      "vehicleID": "VEH-00001",
      "vehicleNumber": "KA01AB1234",
      "vehicleType": "4-Wheeler",
      "model": "Honda City ZX",
      "registrationYear": 2022,
      "customerID": {
        "customerID": "CUST-00001",
        "name": "Rahul Sharma",
        "email": "rahul@example.com",
        "contactNumber": "9876543210"
      },
      "createdAt": "2026-02-14T10:30:00.000Z"
    }
  }
}
```

**How Customer ID is Determined:**

```js
// Different behavior based on who is adding:

if (role === "Customer") {
  // Customer adds to their OWN account automatically
  targetCustomerID = req.user.linkedCustomerID;
  // No need to specify customerID in body
} else if (role === "Staff" || role === "Admin") {
  // Must explicitly provide customerID
  targetCustomerID = req.body.customerID;
  // Used when staff registers vehicle on behalf of customer
}
```

**What Happens After Vehicle is Created:**

```js

// 1. Vehicle document created in vehicles collection
const vehicle = await Vehicle.create({ ... });

// 2. Vehicle reference added to Customer's vehicleIDs array
customer.vehicleIDs.push(vehicle._id);
await customer.save();

// This means Customer document looks like:
{
  customerID: "CUST-00001",
  name: "Rahul Sharma",
  vehicleIDs: [
    ObjectId("...vehicle1..."),
    ObjectId("...vehicle2...")  // ← newly added
  ]
}
```

---

### Endpoint 2: Get All Vehicles (Admin/Staff)

```text
GET /api/vehicles?page=1&limit=10&search=honda&vehicleType=4-Wheeler&sortBy=createdAt&sortOrder=desc&customerID=xxx
Authorization: Bearer <ADMIN_TOKEN>
```

**Query Parameters:**

| Parameter   | Type   | Default     | Description                                    |
| :---------- | :----- | :---------- | :--------------------------------------------- |
| page        | Number | 1           | Page number for pagination                     |
| limit       | Number | 10          | Records per page (max 100)                     |
| search      | String | ""          | Search in vehicleNumber, model, vehicleID      |
| vehicleType | String | -           | Filter: "2-Wheeler", "4-Wheeler", "Commercial" |
| sortBy      | String | "createdAt" | Sort field                                     |
| sortOrder   | String | "desc"      | Sort direction: "asc" or "desc"                |
| customerID  | String | -           | Filter by specific customer (MongoDB ID)       |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": [
    {
      "_id": "65f1b2c3d4e5f6a7b8c9d0e1",
      "vehicleID": "VEH-00001",
      "vehicleNumber": "KA01AB1234",
      "vehicleType": "4-Wheeler",
      "model": "Honda City ZX",
      "registrationYear": 2022,
      "customerID": {
        "customerID": "CUST-00001",
        "name": "Rahul Sharma",
        "email": "rahul@example.com"
      },
      "createdAt": "2026-02-14T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalRecords": 25,
    "limit": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

**How Search Works:**

` ` js

// Backend uses MongoDB $or with regex for flexible search
if (search) {
  filter.$or = [
{ vehicleNumber: { $regex: search, $options: 'i' } },
{ model: { $regex: search, $options: 'i' } },
{ vehicleID: { $regex: search, $options: 'i' } },
];
}

// Examples:
// search = "honda" → finds "Honda City", "Honda Activa"
// search = "MH01" → finds "MH01AB1234", "MH01XY5678"
// search = "VEH-00" → finds "VEH-00001", "VEH-00002"

````

---

### Endpoint 3: Get My Vehicles (Customer)

``` text
GET /api/vehicles/my?page=1&limit=10&vehicleType=4-Wheeler
Authorization: Bearer <CUSTOMER_TOKEN>
````

**How It Differs from GET /api/vehicles:**

```text
GET /api/vehicles       → ALL vehicles from ALL customers (Admin only)
GET /api/vehicles/my    → ONLY this customer's vehicles (Customer only)

// Internally, /my adds this filter automatically:
filter.customerID = req.user.linkedCustomerID;
// So the customer NEVER sees other customers' vehicles
```

---

### Endpoint 4: Get Vehicle by ID

```text
GET /api/vehicles/:id
Authorization: Bearer <TOKEN>
```

**Ownership Check:**

` ` js

// If the requester is a Customer:
if (req.user.role === 'Customer') {
// Check if this vehicle belongs to them
if (req.user.linkedCustomerID !== vehicle.customerID.\_id) {
return 403: "Access denied. You can only view your own vehicles."
}
}
// Admin and Staff can view ANY vehicle

````

**Response includes Active Policies:**

``` json

{
  "success": true,
  "data": {
    "vehicle": {
      "vehicleID": "VEH-00001",
      "vehicleNumber": "KA01AB1234",
      "vehicleType": "4-Wheeler",
      "model": "Honda City ZX"
    },
    "activePolicies": [
      {
        "premiumID": "PREM-00001",
        "calculatedAmount": 14100,
        "paymentStatus": "Paid",
        "policyID": {
          "policyName": "Comprehensive Shield",
          "coverageType": "Comprehensive",
          "policyDuration": 24
        }
      }
    ],
    "hasActivePolicies": true
  }
}
````

---

### Endpoint 5: Update Vehicle

```text
PUT /api/vehicles/:id
Content-Type: application/json
Authorization: Bearer <TOKEN>

{
  "model": "Honda City 2023 ZX CVT",
  "registrationYear": 2023
}
```

**Update Rules:**

```text
1. Only send fields you want to change (partial update)
2. Vehicle number change → duplicate check performed
3. Vehicle type change → blocked if active policies exist
4. Ownership enforced for Customer role
```

**Vehicle Type Change Restriction:**

```js

// Why? Because premium is calculated based on vehicle type.
// Changing type would make existing premium calculations invalid.

if (vehicleType && vehicleType !== vehicle.vehicleType) {
  const activePremiums = await Premium.countDocuments({
    vehicleID: id,
    paymentStatus: 'Paid',
  });

  if (activePremiums > 0) {
    return 400: "Cannot change vehicle type while there are active policies."
  }
}
```

---

### Endpoint 6: Delete Vehicle

```text
DELETE /api/vehicles/:id
Authorization: Bearer <TOKEN>
```

**Pre-deletion Checks (3-layer protection):**

` ` js

// Check 1: Active policies?
const activePremiums = await Premium.countDocuments({
vehicleID: id,
paymentStatus: 'Paid',
});
if (activePremiums > 0) {
return 400: "Cannot delete vehicle with active insurance policies."
}

// Check 2: Pending payments?
const pendingPremiums = await Premium.countDocuments({
vehicleID: id,
paymentStatus: 'Pending',
});
if (pendingPremiums > 0) {
return 400: "Cannot delete vehicle with pending premium payments."
}

// Check 3: Pending claims?
const pendingClaims = await Claim.countDocuments({
vehicleID: id,
claimStatus: { $in: ['Pending', 'Under-Review'] },
});
if (pendingClaims > 0) {
return 400: "Cannot delete vehicle with pending or under-review claims."
}

````

**What Happens on Successful Deletion:**

``` ``` js

// 1. Remove vehicle reference from Customer document
await Customer.findByIdAndUpdate(vehicle.customerID, {
  $pull: { vehicleIDs: vehicle._id }
});

// Before: customer.vehicleIDs = [veh1, veh2, veh3]
// After:  customer.vehicleIDs = [veh1, veh3]  ← veh2 removed

// 2. Delete vehicle document permanently
await Vehicle.findByIdAndDelete(id);

// Note: This is a HARD delete (unlike Customer which uses soft delete)
// Because vehicle data without active policies has no audit requirement
````

---

### Endpoint 7: Vehicle Statistics

```
GET /api/vehicles/stats
Authorization: Bearer <ADMIN_TOKEN>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "total": 47,
    "byType": {
      "2-Wheeler": 15,
      "4-Wheeler": 25,
      "Commercial": 7
    },
    "thisMonth": 8,
    "lastMonth": 5,
    "growthPercentage": 60,
    "ageDistribution": [
      { "range": "0-2 years", "count": 12 },
      { "range": "3-5 years", "count": 18 },
      { "range": "6-9 years", "count": 11 },
      { "range": "10+ years", "count": 6 }
    ]
  }
}
```

**How Age Distribution is Calculated:**

```js
// Uses MongoDB Aggregation Pipeline

const ageDistribution = await Vehicle.aggregate([
  // Step 1: Calculate age for each vehicle
  {
    $addFields: {
      vehicleAge: { $subtract: [2026, "$registrationYear"] },
    },
  },
  // Step 2: Group into age buckets
  {
    $bucket: {
      groupBy: "$vehicleAge",
      boundaries: [0, 3, 6, 10, 100], // 0-2, 3-5, 6-9, 10+
      default: "Other",
      output: { count: { $sum: 1 } },
    },
  },
]);

// This runs entirely in MongoDB (server-side), not in Node.js
// Very efficient for large datasets
```

---

## Authentication & Authorization

### RBAC Matrix for Vehicle Module

```
                        Admin    Staff    Customer
                        ─────    ─────    ────────
Add Vehicle              ✅       ✅        ✅ (own)
View All Vehicles        ✅       ✅        ❌
View Own Vehicles        ─        ─         ✅
View Vehicle by ID       ✅       ✅        ✅ (own only)
Edit Any Vehicle         ✅       ✅        ❌
Edit Own Vehicle         ─        ─         ✅
Delete Any Vehicle       ✅       ❌        ❌
Delete Own Vehicle       ─        ─         ✅
Vehicle Stats            ✅       ✅        ❌
```

### Middleware Chain (Every Request)

```js
// Example: PUT /api/vehicles/:id

router.put(
  "/:id",

  // Step 1: Verify JWT token
  protect,
  // → Extracts user from token
  // → Checks if user exists and isActive
  // → Attaches req.user = { _id, role, linkedCustomerID, ... }

  // Step 2: Check role authorization
  authorize("Customer", "Staff", "Admin"),
  // → Checks if req.user.role is in allowed list
  // → Returns 403 if role not allowed

  // Step 3: Validate URL parameter
  vehicleIdValidator,
  // → Checks if :id is a valid MongoDB ObjectId
  // → Returns 400 if invalid format

  // Step 4: Validate request body
  updateVehicleValidator,
  // → Checks each field against validation rules
  // → Collects all errors

  // Step 5: Process validation results
  validate,
  // → If any validation errors exist, returns 400 with error details
  // → If all valid, calls next()

  // Step 6: Execute business logic
  updateVehicle,
  // → Ownership check (if Customer)
  // → Duplicate check (if vehicleNumber changed)
  // → Active policy check (if vehicleType changed)
  // → Update and return
);
```

### Ownership Enforcement Pattern

```js
// This pattern is used across all "Owner" endpoints:

if (req.user.role === 'Customer') {
  // Get the vehicle's owner
  const vehicleOwner = vehicle.customerID.toString();

  // Get the logged-in customer's ID
  const loggedInCustomer = req.user.linkedCustomerID.toString();

  // Compare
  if (vehicleOwner !== loggedInCustomer) {
    return 403: "Access denied. You can only manage your own vehicles."
  }
}
// Admin and Staff skip this check — they have unrestricted access
```

---

## Business Rules & Validations

### Client-Side Validation (React Hook Form)

```js
// All validations run instantly in the browser before any API call

const validationRules = {
  vehicleNumber: {
    required: "This field is required",
    pattern: {
      value: /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/,
      message: "Enter valid format (e.g., KA01AB1234)",
    },
    // Auto-converted to uppercase on submit
  },

  vehicleType: {
    required: "This field is required",
    // Dropdown with only 3 options — no free text
  },

  model: {
    required: "This field is required",
    minLength: { value: 2, message: "Model must be at least 2 characters" },
  },

  registrationYear: {
    required: "This field is required",
    // Dropdown from current year down to 1990
  },

  customerID: {
    // Only shown for Staff/Admin
    required: "Customer ID is required", // (when role is Staff/Admin)
  },
};
```

### Server-Side Validation (express-validator)

```js
// ALWAYS validates again on server (defense in depth)

export const addVehicleValidator = [
  body("vehicleNumber")
    .trim()
    .notEmpty()
    .withMessage("Vehicle number is required")
    .toUpperCase()
    .matches(/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/)
    .withMessage("Invalid format (e.g., KA01AB1234)"),

  body("vehicleType")
    .trim()
    .notEmpty()
    .withMessage("Vehicle type is required")
    .isIn(["2-Wheeler", "4-Wheeler", "Commercial"])
    .withMessage("Must be 2-Wheeler, 4-Wheeler, or Commercial"),

  body("model")
    .trim()
    .notEmpty()
    .withMessage("Vehicle model is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Model must be 2-100 characters"),

  body("registrationYear")
    .notEmpty()
    .withMessage("Registration year is required")
    .isInt({ min: 1990, max: new Date().getFullYear() })
    .withMessage("Year must be between 1990 and current year"),
];
```

### Business Rules Summary

| #   | Rule                                          | Enforcement Location                                    | Error Code |
| :-- | :-------------------------------------------- | :------------------------------------------------------ | :--------- |
| 1   | Vehicle number must be unique                 | Database unique index + Controller check                | 409        |
| 2   | Vehicle number must follow Indian format      | Client regex + Server regex                             | 400        |
| 3   | Vehicle number always stored uppercase        | Mongoose `uppercase: true` + validator `.toUpperCase()` | Auto       |
| 4   | Registration year: 1990 to current year       | Client dropdown + Server validator                      | 400        |
| 5   | Customer can only add to own account          | Controller: auto-sets from JWT                          | 403        |
| 6   | Staff/Admin must provide customerID           | Controller: explicit check                              | 400        |
| 7   | Cannot add to inactive customer               | Controller: checks customer.isActive                    | 400        |
| 8   | Cannot change vehicle type with active policy | Controller: checks paid premiums                        | 400        |
| 9   | Cannot delete with active policy              | Controller: checks paid premiums                        | 400        |
| 10  | Cannot delete with pending payments           | Controller: checks pending premiums                     | 400        |
| 11  | Cannot delete with pending claims             | Controller: checks pending claims                       | 400        |
| 12  | Vehicle reference synced with customer        | Controller: push on create, pull on delete              | Auto       |

---

## Frontend Pages & Components

### Page Architecture

```
┌───────────────────────────────────────────────────────────┐
│                      AppRoutes.jsx                         │
│                                                           │
│  ┌─ Customer Routes ──────────────────────────────────┐   │
│  │  /vehicles           → VehicleListPage (Card Grid) │   │
│  │  /vehicles/add       → AddVehiclePage              │   │
│  │  /vehicles/:id       → VehicleDetailPage           │   │
│  │  /vehicles/:id/edit  → EditVehiclePage             │   │
│  └────────────────────────────────────────────────────┘   │
│                                                           │
│  ┌─ Admin Routes ─────────────────────────────────────┐   │
│  │  /admin/vehicles           → AdminVehicleListPage  │   │
│  │  /admin/vehicles/add       → AddVehiclePage        │   │
│  │  /admin/vehicles/:id       → VehicleDetailPage     │   │
│  │  /admin/vehicles/:id/edit  → EditVehiclePage       │   │
│  └────────────────────────────────────────────────────┘   │
│                                                           │
│  ┌─ Staff Routes ─────────────────────────────────────┐   │
│  │  /staff/vehicles           → AdminVehicleListPage  │   │
│  │  /staff/vehicles/add       → AddVehiclePage        │   │
│  │  /staff/vehicles/:id       → VehicleDetailPage     │   │
│  │  /staff/vehicles/:id/edit  → EditVehiclePage       │   │
│  └────────────────────────────────────────────────────┘   │
│                                                           │
│  Note: AddVehiclePage, EditVehiclePage, VehicleDetailPage │
│  are SHARED components that adapt based on user role      │
└───────────────────────────────────────────────────────────┘
```

### Page Designs

#### 1. Customer Vehicle List (`/vehicles`) — Card Grid Layout

```
┌──────────────────────────────────────────────────┐
│  My Vehicles                         [+ Add Vehicle]│
│  Manage your registered vehicles                    │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌─ Search & Filters ───────────────────────────┤
│  │  [🔍 Search by vehicle number, model...]     │
│  │  [All Types ▾] [Sort: Newest ▾] [Clear]      │
│  └──────────────────────────────────────────────┤
│                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────┐│
│  │ ┌─ Blue ──┐ │  │ ┌─ Cyan ──┐ │  │┌─Orange─┐││
│  │ │🚗 MH01AB│ │  │ │🏍 KA05C │ │  ││🚚 GJ01X│││
│  │ │  1234   │ │  │ │  9876   │ │  ││  Y5678 │││
│  │ │4-Wheeler│ │  │ │2-Wheeler│ │  ││Commercl│││
│  │ └────────┘ │  │ └────────┘ │  │└────────┘││
│  │             │  │             │  │          ││
│  │ Model:     │  │ Model:     │  │Model:    ││
│  │ Honda City │  │ Activa 6G  │  │Tata Ace  ││
│  │ Year: 2022 │  │ Year: 2023 │  │Year: 2021││
│  │ Age: 4 yrs │  │ Age: 3 yrs │  │Age: 5 yrs││
│  │ Added: Feb │  │ Added: Feb │  │Added: Feb││
│  │             │  │             │  │          ││
│  │ View | ✏️ 🗑│  │ View | ✏️ 🗑│  │View|✏️ 🗑││
│  └─────────────┘  └─────────────┘  └──────────┘│
│                                                  │
│  ← Previous    Page 1 of 1    Next →            │
└──────────────────────────────────────────────────┘

Color-coded by vehicle type:
  🔵 4-Wheeler: primary-50 background
  🔷 2-Wheeler: info-light background
  🟠 Commercial: warning-light background
```

#### 2. Add Vehicle Page (`/vehicles/add`)

```
┌──────────────────────────────────────────────────┐
│  Add New Vehicle                       [← Back]  │
│  Dashboard > Vehicles > Add Vehicle              │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌─── Form Card ────────────────────────────────┤
│  │                                              │
│  │  Customer ID * (Staff/Admin only)            │
│  │  [Enter customer's MongoDB ID            ]   │
│  │                                              │
│  │  Vehicle Number *                            │
│  │  [🚗 MH01AB1234                          ]   │
│  │  Format: XX00XX0000 (e.g., KA01AB1234)       │
│  │                                              │
│  │  Vehicle Type *           Model *            │
│  │  [4-Wheeler        ▾]   [Honda City      ]   │
│  │                                              │
│  │  Registration Year *                         │
│  │  [📅 2022              ▾]                    │
│  │                                              │
│  │  ┌─ ℹ️ Vehicle Number Format ──────────────┐ │
│  │  │ • First 2 letters: State code            │ │
│  │  │ • Next 2 digits: District code           │ │
│  │  │ • Next 1-2 letters: Series               │ │
│  │  │ • Last 4 digits: Unique number           │ │
│  │  │ Examples: KA01AB1234, MH02A5678          │ │
│  │  └──────────────────────────────────────────┘ │
│  │                                              │
│  │                     [Cancel] [+ Add Vehicle] │
│  └──────────────────────────────────────────────┘
└──────────────────────────────────────────────────┘

Adaptive Behavior:
  Customer → customerID field is HIDDEN (auto-set from JWT)
  Staff/Admin → customerID field is VISIBLE and REQUIRED
```

#### 3. Edit Vehicle Page (`/vehicles/:id/edit`)

```
┌──────────────────────────────────────────────────┐
│  Edit Vehicle                          [← Back]  │
│  Update details for MH01AB1234                   │
├──────────────────────────────────────────────────┤
│                                                  │
│  ⚠️ Active Policies Found                       │
│  This vehicle has active insurance policies.     │
│  Vehicle type cannot be changed.                 │
│                                                  │
│  ┌─── Form Card ────────────────────────────────┤
│  │                                              │
│  │  Vehicle Number *                            │
│  │  [🚗 MH01AB1234                          ]   │
│  │                                              │
│  │  Vehicle Type *           Model *            │
│  │  [4-Wheeler    ▾] 🔒    [Honda City ZX   ]   │
│  │   (disabled if                               │
│  │    active policies)                          │
│  │                                              │
│  │  Registration Year *                         │
│  │  [📅 2022              ▾]                    │
│  │                                              │
│  │  ┌─ Current Details ───────────────────────┐ │
│  │  │ Vehicle ID: VEH-00001                   │ │
│  │  │ Registered: MH01AB1234                  │ │
│  │  │ Type: 4-Wheeler  |  Model: Honda City   │ │
│  │  └────────────────────────────────────────┘  │
│  │                                              │
│  │             [Cancel] [💾 Save Changes]       │
│  │             (Save disabled if no changes)    │
│  └──────────────────────────────────────────────┘
└──────────────────────────────────────────────────┘

Smart Features:
  ✅ Only sends changed fields to API
  ✅ Vehicle type disabled if active policies exist
  ✅ Save button disabled until changes are made
  ✅ Shows current details for reference
```

#### 4. Vehicle Detail Page (`/vehicles/:id`)

```
┌──────────────────────────────────────────────────┐
│  Vehicle Details                   [← Back] [✏️] │
│  Dashboard > Vehicles > KA01AB1234               │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌─── Vehicle Info Card ────────────────────────┤
│  │  ┌─── Blue Gradient Header ─────────────┐   │
│  │  │  🚗  KA01AB1234                      │   │
│  │  │      Honda City ZX • 4-Wheeler       │   │
│  │  │                         [4-Wheeler]  │   │
│  │  └──────────────────────────────────────┘   │
│  │                                              │
│  │  Vehicle Information                         │
│  │  ──────────────────                          │
│  │  # Vehicle ID        VEH-00001              │
│  │  👤 Owner             Rahul (CUST-00001)    │
│  │  🚗 Vehicle Number    KA01AB1234            │
│  │  🚗 Vehicle Type      4-Wheeler             │
│  │  🚗 Model             Honda City ZX         │
│  │  📅 Registration Year 2022                  │
│  │  📅 Vehicle Age       4 years               │
│  │  📅 Added On          14 Feb 2026           │
│  └──────────────────────────────────────────────┘
│                                                  │
│  ┌─── Insurance Policies (1) ────── [Active] ──┤
│  │                                              │
│  │  🛡️  Comprehensive Shield                   │
│  │      Comprehensive • PREM-00001              │
│  │                              ₹14,100  [Paid] │
│  │                                              │
│  │  (or if no policies:)                        │
│  │                                              │
│  │  📄 No active policies                      │
│  │     This vehicle doesn't have coverage       │
│  │                    [Browse Policies]          │
│  └──────────────────────────────────────────────┘
└──────────────────────────────────────────────────┘
```

#### 5. Admin Vehicle List (`/admin/vehicles`) — Data Table Layout

```
┌──────────────────────────────────────────────────────┐
│  Vehicle Management                   [+ Add Vehicle] │
│  View and manage all registered vehicles              │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────────┐ │
│  │ Total  │ │2-Wheel │ │4-Wheel │ │ Commercial   │ │
│  │  47    │ │  15    │ │  25    │ │     7        │ │
│  │ ↑60%   │ │        │ │        │ │              │ │
│  └────────┘ └────────┘ └────────┘ └──────────────┘ │
│                                                      │
│  ┌─ Search & Filters ──────────────────────────────┤
│  │  [🔍 Search by number, model, ID...]            │
│  │  [All Types ▾] [Sort: Newest ▾] [10/pg ▾] [Clr]│
│  └─────────────────────────────────────────────────┤
│                                                      │
│  ┌─ Data Table ────────────────────────────────────┤
│  │Vehicle    │Model     │Type     │Owner    │Action ││
│  │───────────┼──────────┼─────────┼─────────┼──────││
│  │🚗 MH01AB │Honda City│4-Wheeler│Rahul    │👁✏️🗑││
│  │  VEH-001 │          │         │CUST-001 │      ││
│  │───────────┼──────────┼─────────┼─────────┼──────││
│  │🏍 KA05C  │Activa 6G │2-Wheeler│Priya    │👁✏️🗑││
│  │  VEH-002 │          │         │CUST-002 │      ││
│  └─────────────────────────────────────────────────┤
│                                                      │
│  Showing 1 to 10 of 47          [< 1 2 3 4 5 >]    │
└──────────────────────────────────────────────────────┘

Key Differences from Customer View:
  ✅ Shows ALL vehicles from ALL customers
  ✅ Displays "Owner" column with customer name
  ✅ Stats cards with type breakdown
  ✅ Data table format (not card grid)
  ✅ Delete available for Admin
```

---

## State Management (Redux)

### Redux Store Structure

```js
store = {
  auth: { ... },         // Auth state (user, token)
  customer: { ... },     // Customer state

  vehicle: {
    // ── Vehicle List ──
    vehicles: [
      {
        _id: "65f...",
        vehicleID: "VEH-00001",
        vehicleNumber: "KA01AB1234",
        vehicleType: "4-Wheeler",
        model: "Honda City ZX",
        registrationYear: 2022,
        customerID: { name: "Rahul", customerID: "CUST-00001" },
        createdAt: "2026-02-14T10:30:00Z"
      },
      // ... more vehicles
    ],

    // ── Pagination ──
    pagination: {
      currentPage: 1,
      totalPages: 3,
      totalRecords: 25,
      limit: 10,
      hasNextPage: true,
      hasPrevPage: false,
    },

    // ── Statistics ──
    stats: {
      total: 47,
      byType: { "2-Wheeler": 15, "4-Wheeler": 25, "Commercial": 7 },
      thisMonth: 8,
      growthPercentage: 60,
      ageDistribution: [...]
    },

    // ── Selected Vehicle (Detail View) ──
    selectedVehicle: {
      vehicle: { ... },
      activePolicies: [...],
      hasActivePolicies: true,
    },

    // ── Loading States ──
    isLoading: false,       // List/detail loading
    isStatsLoading: false,  // Stats loading
    isSubmitting: false,    // Add/update/delete in progress

    // ── Error ──
    error: null,
  }
}
```

### Async Thunk Pattern

```js
// All 7 vehicle operations follow this pattern:

export const addVehicle = createAsyncThunk(
  "vehicle/add", // Action type
  async (data, { rejectWithValue }) => {
    // Payload creator
    try {
      const response = await vehicleService.addVehicle(data);
      return response.data; // → fulfilled
    } catch (error) {
      return rejectWithValue(
        // → rejected
        error.response?.data?.message || "Failed to add vehicle",
      );
    }
  },
);

// Redux auto-creates 3 action types:
// vehicle/add/pending    → isSubmitting = true
// vehicle/add/fulfilled  → isSubmitting = false, data updated
// vehicle/add/rejected   → isSubmitting = false, error set
```

### How Delete Updates State Without Refetching

```js
// When delete succeeds, we remove the vehicle from Redux state
// directly, WITHOUT making another API call to refresh the list

.addCase(deleteVehicle.fulfilled, (state, action) => {
  state.isSubmitting = false;

  // Filter out the deleted vehicle from the array
  state.vehicles = state.vehicles.filter(
    (v) => v._id !== action.payload.deletedId
  );

  // This instantly removes the card/row from UI
  // No need to call fetchMyVehicles() again!
})
```

---

## Data Flow Diagrams

### Add Vehicle Flow

```text
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Add Page  │     │  Redux   │     │Controller│     │ MongoDB  │
└────┬──────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                  │               │                  │
     │ Fill form:       │               │                  │
     │ KA01AB1234       │               │                  │
     │ 4-Wheeler        │               │                  │
     │ Honda City       │               │                  │
     │ 2022             │               │                  │
     │                  │               │                  │
     │ Click "Add"      │               │                  │
     │─────────────────→│               │                  │
     │                  │ POST /vehicles│                  │
     │                  │──────────────→│                  │
     │                  │               │                  │
     │                  │               │ 1. Determine     │
     │                  │               │    customerID    │
     │                  │               │    (from JWT)    │
     │                  │               │                  │
     │                  │               │ 2. Check customer│
     │                  │               │    exists+active │
     │                  │               │─────────────────→│
     │                  │               │    ✅ Found      │
     │                  │               │←─────────────────│
     │                  │               │                  │
     │                  │               │ 3. Check duplicate│
     │                  │               │    vehicleNumber │
     │                  │               │─────────────────→│
     │                  │               │    ✅ No dup     │
     │                  │               │←─────────────────│
     │                  │               │                  │
     │                  │               │ 4. Create vehicle│
     │                  │               │─────────────────→│
     │                  │               │  VEH-00001       │
     │                  │               │←─────────────────│
     │                  │               │                  │
     │                  │               │ 5. Add ref to    │
     │                  │               │    customer      │
     │                  │               │─────────────────→│
     │                  │               │    ✅ Updated    │
     │                  │               │←─────────────────│
     │                  │               │                  │
     │                  │ 201 Created   │                  │
     │                  │ { vehicle }   │                  │
     │                  │←──────────────│                  │
     │                  │               │                  │
     │ Toast: "Added!"  │               │                  │
     │ Navigate to list │               │                  │
     │←─────────────────│               │                  │
```

### Delete Vehicle Flow

```text
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Vehicle  │     │  Redux   │     │Controller│     │ MongoDB  │
│  Card     │     │          │     │          │     │          │
└────┬──────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                  │               │                  │
     │ Click 🗑 Delete  │               │                  │
     │                  │               │                  │
     │ ┌────────────┐   │               │                  │
     │ │ Confirm?   │   │               │                  │
     │ │ [No] [Yes] │   │               │                  │
     │ └────────────┘   │               │                  │
     │                  │               │                  │
     │ Click "Yes"      │               │                  │
     │─────────────────→│               │                  │
     │                  │ DELETE /:id   │                  │
     │                  │──────────────→│                  │
     │                  │               │                  │
     │                  │               │ Check 1: Active  │
     │                  │               │ policies?        │
     │                  │               │─────────────────→│
     │                  │               │ count = 0  ✅    │
     │                  │               │←─────────────────│
     │                  │               │                  │
     │                  │               │ Check 2: Pending │
     │                  │               │ payments?        │
     │                  │               │─────────────────→│
     │                  │               │ count = 0  ✅    │
     │                  │               │←─────────────────│
     │                  │               │                  │
     │                  │               │ Check 3: Pending │
     │                  │               │ claims?          │
     │                  │               │─────────────────→│
     │                  │               │ count = 0  ✅    │
     │                  │               │←─────────────────│
     │                  │               │                  │
     │                  │               │ Remove ref from  │
     │                  │               │ customer.        │
     │                  │               │ vehicleIDs       │
     │                  │               │─────────────────→│
     │                  │               │←─────────────────│
     │                  │               │                  │
     │                  │               │ Delete vehicle   │
     │                  │               │─────────────────→│
     │                  │               │←─────────────────│
     │                  │               │                  │
     │                  │ 200 OK        │                  │
     │                  │←──────────────│                  │
     │                  │               │                  │
     │ Remove card from │               │                  │
     │ UI instantly     │               │                  │
     │ (filter state)   │               │                  │
     │                  │               │                  │
     │ Toast: "Deleted!"│               │                  │
     │←─────────────────│               │                  │
```

### Delete Blocked Flow (Has Active Policy)

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Vehicle  │     │  Redux   │     │Controller│     │ MongoDB  │
│  Card     │     │          │     │          │     │          │
└────┬──────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                  │               │                  │
     │ Click Delete     │               │                  │
     │ → Confirm "Yes"  │               │                  │
     │─────────────────→│               │                  │
     │                  │ DELETE /:id   │                  │
     │                  │──────────────→│                  │
     │                  │               │                  │
     │                  │               │ Check: Active    │
     │                  │               │ policies?        │
     │                  │               │─────────────────→│
     │                  │               │ count = 2  ❌    │
     │                  │               │←─────────────────│
     │                  │               │                  │
     │                  │ 400 Error     │                  │
     │                  │ "Cannot delete│                  │
     │                  │  vehicle with │                  │
     │                  │  active       │                  │
     │                  │  policies"    │                  │
     │                  │←──────────────│                  │
     │                  │               │                  │
     │ Toast Error:     │               │                  │
     │ "Cannot delete   │               │                  │
     │  with active     │               │                  │
     │  policies"       │               │                  │
     │←─────────────────│               │                  │
     │                  │               │                  │
     │ Vehicle card     │               │                  │
     │ remains in UI    │               │                  │
     │ (no state change)│               │                  │
```

---

## Premium Calculator Integration

### How Vehicle Data Affects Premium

````
``` js
// The premium calculation uses TWO vehicle properties:

// 1. vehicleType → determines vehicleTypeMultiplier
const multipliers = {
  '2-Wheeler':  0.8,   // 20% cheaper (less damage potential)
  '4-Wheeler':  1.0,   // Standard rate
  'Commercial': 1.5,   // 50% more expensive (higher risk)
};

// 2. registrationYear → determines depreciation
const vehicleAge = currentYear - registrationYear;
const depreciationFactor = max(0.5, 1 - (vehicleAge × 2% per year));

// Example calculations:
// 2-Wheeler, 2 years old, base ₹10,000, Comprehensive:
// = 10000 × 0.8 × 1.0 × 0.96 = ₹7,680

// 4-Wheeler, 5 years old, base ₹10,000, Third-Party:
// = 10000 × 1.0 × 0.6 × 0.90 = ₹5,400

// Commercial, 8 years old, base ₹10,000, Comprehensive:
// = 10000 × 1.5 × 1.0 × 0.84 = ₹12,600
````

### Premium Calculation Flow

```
Vehicle Type (from vehicle) ──→ vehicleTypeMultiplier
                                      │
Vehicle Age  (from vehicle) ──→ depreciationFactor
                                      │
Base Amount (from policy)   ──→ ───┐  │
                                   │  │
Coverage Type (from policy) ──→ coverageMultiplier
                                   │  │
                                   ▼  ▼
                            Final Premium Amount

Formula:
premium = baseAmount × vehicleTypeMultiplier × coverageMultiplier × depreciationFactor
```

---

## Error Handling

### Error Response Format

````
``` js
// ALL vehicle API errors follow this consistent structure:

// Validation Error (400)
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "vehicleNumber",
      "message": "Vehicle number must be in valid format (e.g., KA01AB1234)",
      "value": "INVALID"
    },
    {
      "field": "registrationYear",
      "message": "Registration year must be between 1990 and 2026",
      "value": 1980
    }
  ]
}

// Duplicate (409)
{
  "success": false,
  "message": "Vehicle with number MH01AB1234 is already registered"
}

// Not Found (404)
{
  "success": false,
  "message": "Vehicle not found"
}

// Forbidden (403)
{
  "success": false,
  "message": "Access denied. You can only view your own vehicles."
}

// Business Rule Violation (400)
{
  "success": false,
  "message": "Cannot delete vehicle with active insurance policies. Please wait for policies to expire or contact admin."
}
````

### Frontend Error Handling (3 Layers)

```
Layer 1: Form Validation (React Hook Form)
  → Instant red error messages below each field
  → Prevents form submission if invalid
  → Example: "Vehicle number must be in valid format"

Layer 2: API Error (Axios Interceptor)
  → Catches all HTTP errors globally
  → Shows toast notification
  → Handles 401 by refreshing token

Layer 3: Redux Error State
  → Stores error message in vehicleSlice.error
  → Components can display Alert component
  → Cleared on next action or manually
```

---

## Security Measures

### Security Summary

| #   | Measure               | Implementation                                                  |
| :-- | :-------------------- | :-------------------------------------------------------------- |
| 1   | JWT Authentication    | Every request verified via Bearer token                         |
| 2   | Role-Based Access     | Middleware checks role before controller executes               |
| 3   | Ownership Enforcement | Customers can ONLY access their own vehicles                    |
| 4   | Input Validation      | Client (React Hook Form) + Server (express-validator)           |
| 5   | Database Uniqueness   | MongoDB unique index on vehicleNumber                           |
| 6   | Data Integrity        | Cannot delete/modify vehicles with active dependencies          |
| 7   | Auto Uppercase        | Vehicle numbers normalized to prevent case-sensitive duplicates |
| 8   | Rate Limiting         | Max 100 requests per 15 minutes per IP                          |
| 9   | CORS                  | Only configured client URL can access API                       |
| 10  | Helmet                | Security headers (XSS, content-type sniffing, etc.)             |

### Why Both Soft Delete (Customer) and Hard Delete (Vehicle)?

```
Customer Module: SOFT DELETE (deactivate)
  → Customer data has audit/compliance requirements
  → May need to reactivate later
  → Associated data (premiums, claims) still reference the customer

Vehicle Module: HARD DELETE (permanent removal)
  → Only allowed when NO dependencies exist
  → No active policies, no pending payments, no pending claims
  → Vehicle data without policies has no audit requirement
  → Customer's vehicleIDs array is cleaned up atomically
```

---

## Summary

### Module Statistics

| Metric              | Count                                      |
| :------------------ | :----------------------------------------- |
| API Endpoints       | 7                                          |
| Frontend Pages      | 5 (shared across roles)                    |
| Redux Thunks        | 7                                          |
| Reusable Components | 12                                         |
| Validation Rules    | 8 (client) + 8 (server)                    |
| Business Rules      | 12                                         |
| Database Indexes    | 3 (customerID, vehicleNumber, vehicleType) |

### Requirements Fulfilled

| ID     | Requirement                       | Status | Implementation                           |
| :----- | :-------------------------------- | :----- | :--------------------------------------- |
| VEH-01 | Customer can add new vehicle      | ✅     | AddVehiclePage + POST /api/vehicles      |
| VEH-02 | Customer views their vehicles     | ✅     | VehicleListPage + GET /api/vehicles/my   |
| VEH-03 | Customer edits vehicle            | ✅     | EditVehiclePage + PUT /api/vehicles/:id  |
| VEH-04 | Delete vehicle (no active policy) | ✅     | 3-layer check before deletion            |
| VEH-05 | Admin views all vehicles          | ✅     | AdminVehicleListPage + GET /api/vehicles |
| VEH-06 | Staff adds for customers          | ✅     | customerID field shown for Staff/Admin   |
| VEH-07 | Vehicle number format validation  | ✅     | Regex on client + server + database      |
| VEH-08 | Prevent duplicate registration    | ✅     | Unique index + controller check          |

### Key Design Decisions

| Decision                                | Reasoning                                                             |
| :-------------------------------------- | :-------------------------------------------------------------------- |
| Card grid for Customer, Table for Admin | Customers have few vehicles (visual), Admins manage many (data-dense) |
| Color-coded vehicle type cards          | Quick visual identification of vehicle type                           |
| Shared Add/Edit pages across roles      | Reduces code duplication, role-detection adapts behavior              |
| Hard delete instead of soft delete      | Clean data when no dependencies, reduces storage                      |
| Vehicle age as virtual field            | Calculated on-read, never stale, no storage cost                      |
| Uppercase enforcement at 3 levels       | Prevents "MH01AB1234" ≠ "mh01ab1234" duplicate issues                 |
| Stats with age distribution             | Useful for business insights (vehicle fleet age analysis)             |

---

_Document Version: 1.0_
_Last Updated: February 2026_
_Module: Vehicle Management_
_Project: Vehicle Insurance Management System (VIMS)_
