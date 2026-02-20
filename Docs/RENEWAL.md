# 📄 Policy Renewal Module - Technical Documentation

## Table of Contents

1. [Module Overview](#module-overview)
2. [Architecture Flow](#architecture-flow)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Authentication & Authorization](#authentication--authorization)
6. [Workflow & Business Logic](#workflow--business-logic)
7. [Frontend Pages & Components](#frontend-pages--components)
8. [Setup & Automated Tasks](#setup--automated-tasks)

---

## Module Overview

The **Policy Renewal Module** manages the lifecycle of insurance policy extensions. It allows customers to request renewals for their expiring policies and provides administrators with tools to review, approve, or reject these requests. It also handles proactive reminders and automated status updates for expired policies.

### Core Features

| Feature                 | Description                                             | Access                 |
| :---------------------- | :------------------------------------------------------ | :--------------------- |
| **Renewal Request**     | Customers can initiate a renewal for active policies    | Customer               |
| **Premium Calculation** | Auto-calculates new premium based on current rules      | System/Customer        |
| **Admin Review**        | Approve/Reject renewal requests with remarks            | Admin                  |
| **Renewal History**     | View list of past and pending renewal requests          | Customer, Admin, Staff |
| **Expiry Tracking**     | Identify policies nearing their expiration date         | Admin, Staff           |
| **Automated Reminders** | Send notifications to customers about upcoming expiries | Admin, Staff           |
| **Auto-Expiration**     | Mark policies as 'Expired' once the end date passes     | Admin/System           |

---

## Architecture Flow

### High-Level Flow

```text
Customer Policy Expiring ──→ Submit Renewal Request ──→ New Premium Generated (Pending)
                                       │
                                       ▼
Admin Reviews Request ─────→ [Approve / Reject]
        │                              │
        │                              └──→ If Rejected: Premium Cancelled
        ▼
If Approved: Policy Extended ──→ New Expiry Date Set ──→ Customer informed
```

---

## Database Schema

### Policy Renewal Collection

**Collection Name:** `policyrenewals`  
**Model:** `PolicyRenewal`

```js
{
  _id: ObjectId("..."),
  renewalID: "REN-00001",           // Auto-generated (e.g., REN-00001)
  policyID: ObjectId("..."),        // Ref: InsurancePolicy
  premiumID: ObjectId("..."),       // Ref: Premium (New record for renewal)
  vehicleID: ObjectId("..."),       // Ref: Vehicle
  customerID: ObjectId("..."),      // Ref: Customer
  renewalDate: Date,                // Date of renewal initiation
  expiryDate: Date,                 // New calculated expiry date
  renewalStatus: "Pending",         // Enum: Pending, Approved, Rejected, Expired
  reminderSentStatus: false,        // Track if reminder was sent
  reminderSentDate: Date,           // Date when reminder was last sent
  adminRemarks: "Verified",         // Optional remarks from admin
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Endpoints

### Renewal APIs

| Method   | Endpoint                     | Description                                 | Access       |
| :------- | :--------------------------- | :------------------------------------------ | :----------- |
| **POST** | `/api/renewals`              | Submit a new renewal request                | Customer     |
| **GET**  | `/api/renewals`              | Get all renewals (list view)                | Admin, Staff |
| **GET**  | `/api/renewals/my`           | Get renewals for logged-in customer         | Customer     |
| **GET**  | `/api/renewals/expiring`     | List policies expiring within X days        | Admin, Staff |
| **GET**  | `/api/renewals/:id`          | Get detailed info of a renewal              | All (Auth)   |
| **PUT**  | `/api/renewals/:id/approve`  | Approve a renewal request                   | Admin        |
| **PUT**  | `/api/renewals/:id/reject`   | Reject a renewal request                    | Admin        |
| **POST** | `/api/renewals/:id/remind`   | Send manual renewal reminder notification   | Admin, Staff |
| **PUT**  | `/api/renewals/mark-expired` | Batch process to mark past dates as Expired | Admin        |

---

## Authentication & Authorization

| Action                  | Admin | Staff | Customer |
| :---------------------- | :---: | :---: | :------: |
| **Submit Request**      |  ❌   |  ❌   |    ✅    |
| **View All Renewals**   |  ✅   |  ✅   |    ❌    |
| **View My Renewals**    |  ❌   |  ❌   |    ✅    |
| **Approve/Reject**      |  ✅   |  ❌   |    ❌    |
| **Send Reminder**       |  ✅   |  ✅   |    ❌    |
| **Process Auto-Expiry** |  ✅   |  ❌   |    ❌    |

---

## Workflow & Business Logic

1.  **Submission (REN-03, REN-04)**:
    - Customer selects an active policy/vehicle.
    - System uses `premiumCalculator` to generate a new `Premium` record in 'Pending' status.
    - `renewalDate` is set to current date, and `expiryDate` is set based on policy duration.

2.  **Validation**:
    - Prevents duplicate pending renewal requests for the same vehicle/policy.
    - Ensures the user has a linked customer profile.

3.  **Approval (REN-05)**:
    - Admin updates status to 'Approved'.
    - New expiry date becomes active.

4.  **Notification (REN-02, REN-10)**:
    - Manual or automated trigger creates a `Notification` record with type `Renewal`.
    - Updates `reminderSentStatus` to prevent spamming.

---

## Frontend Pages & Components

### 1. Renewal Request (`/renewals/request`)

- **Utility**: Customer selects their active policy and clicks "Initiate Renewal".
- **Component**: `RenewalRequestPage.jsx`

### 2. My Renewals (`/renewals`)

- **Utility**: Customer tracks status of their requests.
- **Component**: `RenewalListPage.jsx`

### 3. Admin Renewal Management (`/admin/renewals`)

- **Utility**: List view with filters for Pending/Approved requests.
- **Actions**: Approve/Reject modals and "Send Reminder" triggers.
- **Component**: `AdminRenewalListPage.jsx`

---

## Setup & Automated Tasks

### Mark Expired Policies

The system includes an endpoint `PUT /api/renewals/mark-expired` which should be triggered by a Cron job or scheduled task daily to transition policies from `Approved` to `Expired` status automatically.

---

_Document Version: 1.0_  
_Last Updated: February 20, 2026_  
_Module: Policy Renewal_  
_Project: Vehicle Insurance Management System (VIMS)_
