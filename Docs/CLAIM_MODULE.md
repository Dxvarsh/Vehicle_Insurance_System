# 📄 Claim Management Module - Technical Documentation

## Table of Contents

1. [Module Overview](#module-overview)
2. [Architecture Flow](#architecture-flow)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Authentication & Authorization](#authentication--authorization)
6. [Business Rules & Validations](#business-rules--validations)
7. [Workflow Statuses](#workflow-statuses)
8. [Setup & Performance](#setup--performance)

---

## Module Overview

The **Claim Management Module** handles the post-purchase lifecycle of an insurance policy where customers request financial compensation for damages. It provides a structured workflow for customers to submit evidence and for administrators to assess and process payouts.

### Key Features

| Feature                | Description                                      | Access       |
| :--------------------- | :----------------------------------------------- | :----------- |
| **Submit Claim**       | File a new claim for an active insured vehicle   | Customer     |
| **Document Upload**    | Attach evidence (images, reports) to a claim     | Customer     |
| **Real-time Status**   | Track progress from Pending to Approved/Rejected | Customer     |
| **Claim Processing**   | Admin review, amount settlement, and remarks     | Admin        |
| **Auto-Notifications** | Triggers alerts on every status change           | System       |
| **Claim Dashboard**    | Aggregated statistics and historical data        | Admin, Staff |

---

## Architecture Flow

### Claim Request & Processing Flow

```text
Customer (Active Policy) ──→ Submit Claim (CLM-01) ──→ Status: 'Pending'
                                     │
                                     ▼
Admin Reviews Claim ─────────→ [Under-Review] (CLM-08)
        │                            │
        ▼                            ▼
   [Approved] (CLM-06)         [Rejected] (CLM-07)
        │                            │
        ├── Set Amount Paid          └── Set Reason
        └── Notify Customer          └── Notify Customer
```

---

## Database Schema

### Claim Collection

**Collection Name:** `claims`  
**Model:** `Claim`

```js
{
  _id: ObjectId("..."),
  claimID: "CLM-00001",           // Auto-generated (e.g., CLM-00001)
  customerID: ObjectId("..."),      // Ref: Customer
  policyID: ObjectId("..."),        // Ref: InsurancePolicy
  vehicleID: ObjectId("..."),       // Ref: Vehicle
  premiumID: ObjectId("..."),       // Ref: Premium (Target policy record)
  claimReason: String,              // Min 10 characters
  supportingDocuments: [String],    // Array of URLs/Paths
  claimDate: Date,                  // Date of submission
  claimAmount: Number,              // Approved amount (Set by Admin)
  claimStatus: "Pending",           // Pending, Approved, Rejected, Under-Review
  adminRemarks: String,             // Review notes
  processedDate: Date,              // Date of final decision
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Endpoints

### Claim APIs

| Method   | Endpoint                  | Description                               | Access       |
| :------- | :------------------------ | :---------------------------------------- | :----------- |
| **POST** | `/api/claims`             | Submit a new claim request                | Customer     |
| **GET**  | `/api/claims/my`          | Get all claims for logged-in customer     | Customer     |
| **GET**  | `/api/claims`             | List all system claims (Admin/Staff view) | Admin, Staff |
| **GET**  | `/api/claims/stats`       | Get aggregated claim metrics              | Admin, Staff |
| **GET**  | `/api/claims/:id`         | Get specific claim details                | All (Auth)   |
| **PUT**  | `/api/claims/:id/process` | Approve/Reject/Review a claim             | Admin        |

---

## Authentication & Authorization

| Action              | Admin | Staff | Customer |
| :------------------ | :---: | :---: | :------: |
| **Submit Claim**    |  ❌   |  ❌   |    ✅    |
| **View My Claims**  |  ❌   |  ❌   |    ✅    |
| **View All Claims** |  ✅   |  ✅   |    ❌    |
| **Process Claim**   |  ✅   |  ❌   |    ❌    |
| **View Stats**      |  ✅   |  ✅   |    ❌    |

---

## Business Rules & Validations

1.  **Policy Eligibility (CLM-11)**:
    - Claims can ONLY be raised if a vehicle has an active policy (Premium status: 'Paid').
    - The system verifies the `premiumID` combination before allowing submission.

2.  **Reason Validation (CLM-02)**:
    - `claimReason` must be at least 10 characters long to ensure enough detail for initial review.

3.  **Status Integrity**:
    - Once a claim is 'Approved' or 'Rejected', further modifications to the status are restricted unless handled by an Admin via specific audit tools (not in primary workflow).

4.  **Automatic Notifications (CLM-09)**:
    - Every update to `claimStatus` triggers an entry in the `Notification` collection for the target customer.

---

## Workflow Statuses

- **Pending**: Default state after submission. Awaiting initial screening.
- **Under-Review**: Claim is being actively investigated (e.g., surveyor visit).
- **Approved**: Claim is valid. Settlement amount is finalized.
- **Rejected**: Claim denied. Reason provided in `adminRemarks`.

---

_Document Version: 1.0_  
_Last Updated: February 20, 2026_  
_Module: Claim Management_  
_Project: Vehicle Insurance Management System (VIMS)_
