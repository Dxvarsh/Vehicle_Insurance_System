# 📊 Admin Dashboard & Reports - Technical Documentation

## Module Overview

The **Admin Dashboard & Reports Module** provides a high-level overview of the system's performance and health. It aggregates data from all other modules (Customers, Policies, Premiums, Claims) to present actionable insights through metrics and visual charts.

## Features

- **Key Performance Indicators (KPIs)**: Instant view of total customers, active policies, revenue, and payouts.
- **Policy Analytics**: Visual distribution of policies by coverage type (Third-Party, Comprehensive, etc.).
- **Revenue Tracking**: Monthly snapshots of premium collections to track growth.
- **Claim Monitoring**: Real-time breakdown of claim statuses (Approved, Pending, Rejected).
- **Data Export/Reporting**: Backend support for generating detailed lists of policies, payments, and claims for administrative review.

## API Endpoints

### Dashboard APIs

| Method | Endpoint                 | Description                                    | Access       |
| :----- | :----------------------- | :--------------------------------------------- | :----------- |
| `GET`  | `/api/dashboard/stats`   | Get overview KPI counters                      | Admin, Staff |
| `GET`  | `/api/dashboard/charts`  | Get data for Policy, Revenue, and Claim charts | Admin, Staff |
| `GET`  | `/api/dashboard/reports` | Get detailed tabular data for reports          | Admin        |

## Implementation Details

### Data Aggregations (Mongoose)

1. **Stats**:
   - `Customer.countDocuments()`
   - `PolicyRenewal.countDocuments({ renewalStatus: 'Approved' })`
   - `Premium.aggregate` with `$sum` for `totalPremiumAmount`.
   - `Claim.aggregate` with `$sum` for `claimAmount`.

2. **Charts**:
   - Uses `$lookup` to join `PolicyRenewal` with `InsurancePolicy` for distribution by `coverageType`.
   - Uses `$group` with `$month` and `$year` for monthly revenue snapshots.

### Business Rules

1. **Access Control**:
   - Staff can view Dashboard Stats and Charts but cannot access detailed Report Data.
   - Admin has full access to all analytical data and report generation.
2. **Growth Metrics**:
   - Revenue charts focus on the last 6 months of successfully paid premiums.
3. **Report Limits**:
   - Reports are currently limited to the most recent 50 records per type to ensure performance.
