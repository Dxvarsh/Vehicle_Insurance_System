# 📄 Insurance Policy Module - Technical Documentation

## Table of Contents

1. [Module Overview](#module-overview)
2. [Architecture Flow](#architecture-flow)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Authentication & Authorization](#authentication--authorization)
6. [Business Rules & Validations](#business-rules--validations)
7. [Frontend Pages & Components](#frontend-pages--components)
8. [State Management (Redux)](state-management-redux)
9. [Premium Logic & Calculator](#premium-logic--calculator)
10. [Error Handling](#error-handling)
11. [Security Measures](#security-measures)

---

## Module Overview

The **Insurance Policy Module** is the core product catalog of VIMS. It defines the insurance products available for customers to purchase. This module manages the lifecycle of insurance policies—from creation by administrators to purchase by customers. It heavily interacts with the Vehicle and Premium modules to deliver customized insurance solutions.

### What This Module Does

| Feature               | Description                                              | Who Can Use            |
| :-------------------- | :------------------------------------------------------- | :--------------------- |
| **Create Policy**     | Define new insurance plans (Name, Coverage, Base Amount) | Admin                  |
| **View Policies**     | Browse available insurance plans                         | Customer, Staff, Admin |
| **Policy Details**    | View detailed benefits, coverage limits, and terms       | All                    |
| **Calculate Premium** | Get instant premium quote based on vehicle & policy      | All                    |
| **Purchase Policy**   | Buy a policy for a specific vehicle                      | Customer               |
| **Edit Policy**       | Modify policy terms (Affects new purchases only)         | Admin                  |
| **Delete Policy**     | Remove a policy (Soft/Hard delete logic)                 | Admin                  |
| **Policy Stats**      | View sales performance and popularity of plans           | Admin, Staff           |

### Why This Module is Critical

```text
Policy ──defines──→ Coverage Rules ──used by──→ Premium Calculator
   │
   ├── Purchased by Customer for a Vehicle
   ├── Generates Premium Record
   └── Determines Claim Eligibility
```

---

## Architecture Flow

### High-Level Module Architecture

```text
┌────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                        │
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │    Pages     │  │   Redux      │  │    Services          │ │
│  │              │  │   Store      │  │                      │ │
│  │ PolicyList   │→ │ policySlice  │→ │ policyService.js     │ │
│  │ PolicyDetail │  │              │  │ - getAllPolicies()   │ │
│  │ PurchasePolicy│ │ - policies[] │  │ - getPolicyById()    │ │
│  │ ManagePolicy │  │ - current    │  │ - createPolicy()     │ │
│  │ AdminList    │  │ - premium    │  │ - updatePolicy()     │ │
│  │              │  │ - loading    │  │ - calculatePremium() │ │
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
│  │  Routes  │→ │  Middleware  │→ │     Controller          │  │
│  │          │  │              │  │                         │  │
│  │ GET  /   │  │ 1. protect   │  │ getAllPolicies()        │  │
│  │ GET  /:id│  │ 2. authorize │  │ getPolicyById()         │  │
│  │ POST /   │  │ 3. validator │  │ createPolicy()          │  │
│  │ PUT  /:id│  │ 4. validate  │  │ updatePolicy()          │  │
│  │ POST /cal│  │              │  │ calculatePremiumPreview()│ │
│  │ POST /buy│  │              │  │ purchasePolicy()        │  │
│  └──────────┘  └──────────────┘  └────────────┬────────────┘  │
│                                               │               │
└───────────────────────────────────────────────┼───────────────┘
                                                │
                                                ▼
                                    ┌─────────────────────────┐
                                    │       MongoDB            │
                                    │                         │
                                    │  insurancepolicies      │
                                    │  premiums               │
                                    │  vehicles               │
                                    │                         │
                                    └─────────────────────────┘
```

---

## Database Schema

### Insurance Policy Collection

```js
// MongoDB Collection: insurancepolicies
// Mongoose Model: InsurancePolicy

{
  _id: ObjectId("..."),
  policyID: "POL-00001",           // Auto-generated ID
  policyName: "Comprehensive Pro", // Unique Name
  coverageType: "Comprehensive",   // Enum: Third-Party, Comprehensive, Own-Damage
  baseAmount: 5000,                // Base premium in INR
  policyDuration: 12,              // Duration in Months (e.g., 12, 24, 36)
  description: "Full coverage...", // Detailed description
  premiumRules: {
    vehicleTypeMultiplier: {       // Multiplier Map
      "2-Wheeler": 0.8,
      "4-Wheeler": 1.0,
      "Commercial": 1.5
    },
    ageDepreciation: 2,            // % Depreciation per year
    coverageMultiplier: {
      "Third-Party": 0.6,
      "Comprehensive": 1.0,
      "Own-Damage": 0.8
    }
  },
  isActive: true,                  // Soft delete flag
  benefits: ["24x7 Support", "Zero Dep", "Engine Protect"],
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

### Key Schema Features

1.  **Flexible Premium Rules**: The `premiumRules` object allows admins to tweak how premiums are calculated without changing code.
2.  **isActive Flag**: Policies are rarely deleted to preserve history. Instead, they are marked `isActive: false` to prevent new purchases.
3.  **Benefits Array**: Stores feature list for frontend display.

---

## API Endpoints

### Core Policy Endpoints

| Method     | Endpoint              | Description                | Access              |
| :--------- | :-------------------- | :------------------------- | :------------------ |
| **GET**    | `/api/policies`       | Get all available policies | All (Auth required) |
| **GET**    | `/api/policies/:id`   | Get policy details         | All                 |
| **POST**   | `/api/policies`       | Create new policy          | Admin               |
| **PUT**    | `/api/policies/:id`   | Update policy details      | Admin               |
| **DELETE** | `/api/policies/:id`   | Soft delete policy         | Admin               |
| **GET**    | `/api/policies/stats` | Get policy sales stats     | Admin, Staff        |

### Transactional Endpoints

| Method   | Endpoint                          | Description            | Access          |
| :------- | :-------------------------------- | :--------------------- | :-------------- |
| **POST** | `/api/policies/calculate-premium` | Preview premium amount | Customer, Staff |
| **POST** | `/api/policies/:id/purchase`      | Buy policy for vehicle | Customer        |

---

## Authentication & Authorization

### RBAC Matrix

| Action                | Admin | Staff | Customer |
| :-------------------- | :---: | :---: | :------: |
| **View Policies**     |  ✅   |  ✅   |    ✅    |
| **Create Policy**     |  ✅   |  ❌   |    ❌    |
| **Edit Policy**       |  ✅   |  ❌   |    ❌    |
| **Delete Policy**     |  ✅   |  ❌   |    ❌    |
| **Calculate Premium** |  ✅   |  ✅   |    ✅    |
| **Purchase Policy**   |  ❌   |  ❌   |    ✅    |
| **View Stats**        |  ✅   |  ✅   |    ❌    |

---

## Business Rules & Validations

1.  **Unique Policy Name**: No two active policies can have the same name.
2.  **Duplicate Coverage Prevention**: A vehicle cannot have two active policies of the same `coverageType` at the same time.
    - _Error 409_: "Vehicle already has an active Comprehensive coverage."
3.  **Ownership Check**: Customers can only calculate premiums and purchase policies for vehicles _they_ own.
4.  **Base Amount Floor**: Base amount cannot be negative.
5.  **Modification Restriction**: Key financial fields (like `baseAmount`) generally should only be updated for _future_ purchases, not affecting existing legitimate policies (though the system allows updates, historical records in `Premium` collection preserve the _paid_ amount).

---

## Frontend Pages & Components

### 1. Policy List (`/policies`)

- **User**: Customer, Admin, Staff
- **Features**:
  - Grid view of policy cards.
  - Filtering by Coverage Type (Third-Party, Comprehensive, etc.).
  - "View Details" and "Buy Now" buttons.
  - Admin view (`/admin/policies`) includes "Edit" and "Delete" actions.

### 2. Policy Detail (`/policies/:id`)

- **User**: All
- **Features**:
  - Comprehensive breakdown of policy benefits.
  - Table showing coverage limits.
  - "Calculate Premium" simulator.

### 3. Purchase Policy (`/policies/:id/purchase`)

- **User**: Customer
- **Flow**:
  1.  Select Vehicle (from user's registered vehicles).
  2.  Calculate Premium (Preview shown).
  3.  Confirm Purchase & Pay.
  4.  Redirect to Payment Gateway Simulator.

### 4. Admin Manage Policy (`/admin/policies/new`)

- **User**: Admin
- **Features**:
  - Form to add/edit policy details.
  - Dynamic benefit list management.
  - Premium rule configuration.

---

## Premium Logic & Calculator

The premium calculation is the "brain" of this module. It ensures fair pricing based on risk factors.

### Formula

```math
Premium = BaseAmount \times VehicleTypeMultiplier \times CoverageMultiplier \times DepreciationFactor
```

### Factors

1.  **Base Amount**: Defined in the Policy.
2.  **Vehicle Type Multiplier**:
    - 2-Wheeler: `0.8`
    - 4-Wheeler: `1.0`
    - Commercial: `1.5`
3.  **Coverage Multiplier**:
    - Third-Party: `0.6`
    - Comprehensive: `1.0`
    - Own-Damage: `0.8`
4.  **Age Depreciation**:
    - Reduces premium for older vehicles.
    - Rate: `2%` per year of vehicle age.
    - _Floor_: Max depreciation is capped at 50% (Factor >= 0.5).

### Example Calculation

- **Policy**: Gold Plan (Base: ₹5000)
- **Vehicle**: Honda City (4-Wheeler), 5 Years Old
- **Coverage**: Comprehensive

```text
Step 1: Base = 5000
Step 2: Type Multiplier (4-Wheeler) = 1.0
Step 3: Coverage Multiplier (Comprehensive) = 1.0
Step 4: Age = 5 Years. Depreciation = 5 * 2% = 10%. Factor = 0.9.

Final = 5000 * 1.0 * 1.0 * 0.9 = ₹4,500
```

---

## Error Handling

### Backend Errors

- **404 Not Found**: Policy or Vehicle ID invalid.
- **400 Bad Request**: Invalid data or business rule violation (e.g., purchasing inactive policy).
- **409 Conflict**: Vehicle already insured.
- **403 Forbidden**: Accessing admin routes or other user's data.

### Frontend Handling

- **Toast Notifications**: For transient success/error messages.
- **Alert Components**: For persistent form errors.
- **Redux Error State**: Global error tracking in `policySlice`.

---

## Security Measures

1.  **Input Validation**: `express-validator` sanitizes all inputs (e.g., numeric checks for amounts).
2.  **Role Enforcement**: Middleware strictly blocks non-admins from modification routes.
3.  **Data Isolation**: Customers can only see _their own_ calculated premiums and purchase history.
4.  **Transaction Safety**: Payment processing uses simulated atomic operations (updates Payment Status + Creates Renewal Record).

---

_Document Version: 1.0_
_Last Updated: February 2026_
_Module: Insurance Policy Management_
_Project: Vehicle Insurance Management System (VIMS)_
