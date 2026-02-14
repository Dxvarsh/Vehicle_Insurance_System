# Vehicle Insurance Management System - Requirements Document

## 🎨 Design System

| Property | Value |
| :--- | :--- |
| **Primary Color** | `#325bb5` |
| **Tech Stack** | MERN (MongoDB, Express.js, React.js, Node.js) |
| **Design Philosophy** | Modern, Trustworthy, Clean UI/UX |
| **Font Style** | Professional Sans-Serif (Inter / Poppins) |
| **UI Library** | Tailwind CSS / Material UI with custom theme |

---

## 📊 Data Models & Schema

### 1. Customer
| Field | Type | Constraints |
| :--- | :--- | :--- |
| `customerID` | String (Auto-generated) | Primary Key, Unique |
| `name` | String | Required, Min 2 chars |
| `contactNumber` | String | Required, Unique, 10 digits |
| `email` | String | Required, Unique, Valid email format |
| `address` | String | Required |
| `vehicleIDs` | Array of ObjectId | References Vehicle collection |
| `createdAt` | Date | Auto-generated |
| `updatedAt` | Date | Auto-generated |

### 2. User
| Field | Type | Constraints |
| :--- | :--- | :--- |
| `userID` | String (Auto-generated) | Primary Key, Unique |
| `username` | String | Required, Unique, Min 3 chars |
| `password` | String | Required, Hashed (bcrypt), Min 8 chars |
| `role` | String (Enum) | Required, Values: `Admin`, `Staff`, `Customer` |
| `linkedCustomerID` | ObjectId | References Customer (only if role is Customer) |
| `isActive` | Boolean | Default: `true` |
| `createdAt` | Date | Auto-generated |
| `updatedAt` | Date | Auto-generated |

### 3. Vehicle
| Field | Type | Constraints |
| :--- | :--- | :--- |
| `vehicleID` | String (Auto-generated) | Primary Key, Unique |
| `customerID` | ObjectId | Required, References Customer |
| `vehicleNumber` | String | Required, Unique, Valid format |
| `vehicleType` | String (Enum) | Required, Values: `2-Wheeler`, `4-Wheeler`, `Commercial` |
| `model` | String | Required |
| `registrationYear` | Number | Required, Valid year (1990 - current year) |
| `createdAt` | Date | Auto-generated |
| `updatedAt` | Date | Auto-generated |

### 4. Insurance Policy
| Field | Type | Constraints |
| :--- | :--- | :--- |
| `policyID` | String (Auto-generated) | Primary Key, Unique |
| `policyName` | String | Required, Unique |
| `coverageType` | String (Enum) | Required, Values: `Third-Party`, `Comprehensive`, `Own-Damage` |
| `policyDuration` | Number | Required, In months (12 / 24 / 36) |
| `baseAmount` | Number | Required, Min 0 |
| `premiumRules` | Object | Contains multiplier rules based on vehicle type, age, coverage |
| `isActive` | Boolean | Default: `true` |
| `createdAt` | Date | Auto-generated |
| `updatedAt` | Date | Auto-generated |

#### Premium Rules Sub-Schema:
| Field | Type | Description |
| :--- | :--- | :--- |
| `vehicleTypeMultiplier` | Object | `{"2-Wheeler": 0.8, "4-Wheeler": 1.0, "Commercial": 1.5}` |
| `ageDepreciation` | Number | Percentage based on vehicle age |
| `coverageMultiplier` | Object | `{"Third-Party": 0.6, "Comprehensive": 1.0, "Own-Damage": 0.8}` |

### 5. Premium
| Field | Type | Constraints |
| :--- | :--- | :--- |
| `premiumID` | String (Auto-generated) | Primary Key, Unique |
| `policyID` | ObjectId | Required, References Insurance Policy |
| `vehicleID` | ObjectId | Required, References Vehicle |
| `customerID` | ObjectId | Required, References Customer |
| `calculatedAmount` | Number | Required, Auto-calculated from premium rules |
| `paymentStatus` | String (Enum) | Values: `Pending`, `Paid`, `Failed`, Default: `Pending` |
| `paymentDate` | Date | Nullable, Set when payment is completed |
| `transactionID` | String | Nullable, Payment gateway reference |
| `createdAt` | Date | Auto-generated |
| `updatedAt` | Date | Auto-generated |

### 6. Policy Renewal
| Field | Type | Constraints |
| :--- | :--- | :--- |
| `renewalID` | String (Auto-generated) | Primary Key, Unique |
| `policyID` | ObjectId | Required, References Insurance Policy |
| `premiumID` | ObjectId | Required, References Premium |
| `vehicleID` | ObjectId | Required, References Vehicle |
| `customerID` | ObjectId | Required, References Customer |
| `renewalDate` | Date | Required |
| `expiryDate` | Date | Required, Must be after `renewalDate` |
| `renewalStatus` | String (Enum) | Values: `Pending`, `Approved`, `Rejected`, `Expired`, Default: `Pending` |
| `reminderSentStatus` | Boolean | Default: `false` |
| `reminderSentDate` | Date | Nullable |
| `adminRemarks` | String | Nullable |
| `createdAt` | Date | Auto-generated |
| `updatedAt` | Date | Auto-generated |

### 7. Claim
| Field | Type | Constraints |
| :--- | :--- | :--- |
| `claimID` | String (Auto-generated) | Primary Key, Unique |
| `customerID` | ObjectId | Required, References Customer |
| `policyID` | ObjectId | Required, References Insurance Policy |
| `vehicleID` | ObjectId | Required, References Vehicle |
| `premiumID` | ObjectId | Required, References Premium |
| `claimReason` | String | Required, Min 10 chars |
| `supportingDocuments` | Array of String | URLs to uploaded documents |
| `claimDate` | Date | Required, Auto-set to current date |
| `claimAmount` | Number | Nullable, Set by admin during approval |
| `claimStatus` | String (Enum) | Values: `Pending`, `Approved`, `Rejected`, `Under-Review`, Default: `Pending` |
| `adminRemarks` | String | Nullable |
| `processedDate` | Date | Nullable, Set when admin takes action |
| `createdAt` | Date | Auto-generated |
| `updatedAt` | Date | Auto-generated |

### 8. Notification
| Field | Type | Constraints |
| :--- | :--- | :--- |
| `notificationID` | String (Auto-generated) | Primary Key, Unique |
| `customerID` | ObjectId | Required, References Customer |
| `policyID` | ObjectId | Nullable, References Insurance Policy |
| `messageType` | String (Enum) | Required, Values: `Expiry`, `Renewal`, `Claim-Update`, `Payment`, `General` |
| `title` | String | Required |
| `message` | String | Required |
| `sentDate` | Date | Auto-generated |
| `isRead` | Boolean | Default: `false` |
| `deliveryStatus` | String (Enum) | Values: `Sent`, `Delivered`, `Failed`, Default: `Sent` |
| `createdAt` | Date | Auto-generated |

---

## 🔧 Modules & Functional Requirements

### Module 1: Authentication & Authorization
| ID | Requirement | Role | Priority |
| :--- | :--- | :--- | :--- |
| AUTH-01 | User registration with email verification | Customer | High |
| AUTH-02 | Secure login with JWT token-based authentication | All | High |
| AUTH-03 | Secure logout (token invalidation) | All | High |
| AUTH-04 | Password hashing using bcrypt | All | High |
| AUTH-05 | Role-based access control (RBAC) middleware | All | High |
| AUTH-06 | Password reset / forgot password functionality | All | Medium |
| AUTH-07 | Session timeout after inactivity | All | Low |

### Module 2: Customer Management
| ID | Requirement | Role | Priority |
| :--- | :--- | :--- | :--- |
| CUST-01 | Customer self-registration with profile creation | Customer | High |
| CUST-02 | View and update own profile details | Customer | High |
| CUST-03 | Admin can view all customers list with search & filter | Admin | High |
| CUST-04 | Admin can activate / deactivate customer accounts | Admin | Medium |
| CUST-05 | Staff can register new customers | Staff | Medium |
| CUST-06 | Customer dashboard (policy summary, claims, notifications) | Customer | High |

### Module 3: Vehicle Management
| ID | Requirement | Role | Priority |
| :--- | :--- | :--- | :--- |
| VEH-01 | Customer can add new vehicle with all details | Customer | High |
| VEH-02 | Customer can view list of their registered vehicles | Customer | High |
| VEH-03 | Customer can edit vehicle details | Customer | Medium |
| VEH-04 | Customer can delete vehicle (if no active policy) | Customer | Medium |
| VEH-05 | Admin can view all registered vehicles with filters | Admin | High |
| VEH-06 | Staff can add vehicle details for customers | Staff | Medium |
| VEH-07 | Vehicle number format validation | All | High |
| VEH-08 | Prevent duplicate vehicle number registration | All | High |

### Module 4: Insurance Policy Management
| ID | Requirement | Role | Priority |
| :--- | :--- | :--- | :--- |
| POL-01 | Admin can create new insurance policy | Admin | High |
| POL-02 | Admin can edit existing policy details | Admin | High |
| POL-03 | Admin can soft-delete (deactivate) a policy | Admin | Medium |
| POL-04 | Customer can browse all available active policies | Customer | High |
| POL-05 | View detailed policy info (coverage, duration, etc.) | Customer | High |
| POL-06 | Customer can purchase/apply for a policy | Customer | High |
| POL-07 | Policy linked to specific vehicle at purchase time | Customer | High |
| POL-08 | Staff can assist customer in policy purchase | Staff | Medium |
| POL-09 | Filter policies by type, duration, vehicle type | Customer | Medium |

### Module 5: Premium Calculation & Payment
| ID | Requirement | Role | Priority |
| :--- | :--- | :--- | :--- |
| PREM-01 | Auto-calculate premium based on rules | System | High |
| PREM-02 | Calculation considers vehicle type, age, coverage | System | High |
| PREM-03 | Customer can view calculated premium before purchase | Customer | High |
| PREM-04 | Customer can make payment (simulated) | Customer | High |
| PREM-05 | Payment status tracking (Pending / Paid / Failed) | All | High |
| PREM-06 | Payment receipt generation | Customer | Medium |
| PREM-07 | Admin can manage premium calculation rules | Admin | High |
| PREM-08 | Admin can view all premium and payment records | Admin | High |
| PREM-09 | Staff can view customer premium details | Staff | Medium |

### Module 6: Policy Renewal
| ID | Requirement | Role | Priority |
| :--- | :--- | :--- | :--- |
| REN-01 | System auto-detects policies nearing expiry | System | High |
| REN-02 | Customer receives renewal reminder notifications | Customer | High |
| REN-03 | Customer can initiate policy renewal request | Customer | High |
| REN-04 | Renewal request submitted for admin approval | Customer | High |
| REN-05 | Admin can approve or reject renewals with remarks | Admin | High |
| REN-06 | Upon approval, new premium is calculated | System | High |
| REN-07 | Renewal history maintained for each policy | All | Medium |
| REN-08 | Staff can assist customers in renewal process | Staff | Medium |
| REN-09 | Expired policies marked automatically | System | Medium |
| REN-10 | Track reminder sent status and date | System | Medium |

### Module 7: Claim Management
| ID | Requirement | Role | Priority |
| :--- | :--- | :--- | :--- |
| CLM-01 | Customer can submit a new insurance claim | Customer | High |
| CLM-02 | Claim requires reason description (min 10 chars) | Customer | High |
| CLM-03 | Customer can upload supporting documents | Customer | Medium |
| CLM-04 | Customer can track claim status in real-time | Customer | High |
| CLM-05 | Admin can view all submitted claims with filters | Admin | High |
| CLM-06 | Admin can approve claim with amount and remarks | Admin | High |
| CLM-07 | Admin can reject claim with remarks | Admin | High |
| CLM-08 | Admin can mark claim as "Under-Review" | Admin | Medium |
| CLM-09 | Customer notified on claim status change | Customer | High |
| CLM-10 | Staff can forward/escalate claim requests to admin | Staff | Medium |
| CLM-11 | Claim can only be raised on active policies | System | High |

### Module 8: Notification System
| ID | Requirement | Role | Priority |
| :--- | :--- | :--- | :--- |
| NOTIF-01 | System sends policy expiry reminders | System | High |
| NOTIF-02 | System sends renewal confirmation | System | High |
| NOTIF-03 | System sends claim status updates | System | High |
| NOTIF-04 | System sends payment confirmation | System | Medium |
| NOTIF-05 | Notification center for customers | Customer | High |
| NOTIF-06 | Mark notifications as read/unread | Customer | Medium |
| NOTIF-07 | Admin can send custom/general notifications | Admin | Medium |
| NOTIF-08 | Admin can manage notification logs | Admin | Medium |
| NOTIF-09 | Notification bell with unread count on UI | Customer | Medium |

### Module 9: Admin Dashboard & Reports
| ID | Requirement | Role | Priority |
| :--- | :--- | :--- | :--- |
| DASH-01 | Admin dashboard with key metrics | Admin | High |
| DASH-02 | Policy distribution by coverage type charts | Admin | Medium |
| DASH-03 | Monthly premium collection charts | Admin | Medium |
| DASH-04 | Claim status breakdown charts | Admin | Medium |
| DASH-05 | Generate policy report | Admin | High |
| DASH-06 | Generate premium/payment report | Admin | High |
| DASH-07 | Generate claim report with filters | Admin | High |
| DASH-08 | Generate renewal report | Admin | Medium |
| DASH-09 | Export reports as PDF/CSV | Admin | Low |
| DASH-10 | Staff can view reports (read-only) | Staff | Medium |
| DASH-11 | Monitor system activity log | Admin | Low |

---

## 🔐 Non-Functional Requirements
| ID | Requirement | Priority |
| :--- | :--- | :--- |
| NFR-01 | Responsive design (Desktop, Tablet, Mobile) | High |
| NFR-02 | Primary theme color `#325bb5` applied consistently | High |
| NFR-03 | Modern UI with clean typography (Inter / Poppins) | High |
| NFR-04 | API response time under 500ms for standard operations | Medium |
| NFR-05 | Passwords stored using bcrypt (min 10 salt rounds) | High |
| NFR-06 | JWT tokens with expiration (24h access, 7d refresh) | High |
| NFR-07 | Input validation on both client and server | High |
| NFR-08 | Proper error handling with meaningful messages | High |
| NFR-09 | MongoDB indexing on frequently queried fields | Medium |
| NFR-10 | CORS configuration for secure API access | High |
| NFR-11 | Environment variables for sensitive config (`dotenv`) | High |
| NFR-12 | MVC pattern on backend | High |
| NFR-13 | Component-based architecture on frontend (React) | High |
| NFR-14 | Loading states, skeletons, and error boundaries | Medium |
| NFR-15 | Form validation with user-friendly error display | High |

---

## 🗂️ API Endpoints Overview

### Auth APIs
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | Register new user/customer | Public |
| POST | `/api/auth/login` | Login and receive JWT | Public |
| POST | `/api/auth/logout` | Logout and invalidate token | Authenticated |
| POST | `/api/auth/forgot-password` | Send password reset link | Public |
| PUT | `/api/auth/reset-password/:token` | Reset password | Public |

### Customer APIs
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/api/customers` | Get all customers | Admin, Staff |
| GET | `/api/customers/:id` | Get customer by ID | Admin, Staff, Owner |
| PUT | `/api/customers/:id` | Update customer profile | Admin, Owner |
| DELETE | `/api/customers/:id` | Deactivate customer | Admin |

### Vehicle APIs
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/api/vehicles` | Add new vehicle | Customer, Staff |
| GET | `/api/vehicles` | Get all vehicles | Admin |
| GET | `/api/vehicles/my` | Get logged-in customer's vehicles | Customer |
| GET | `/api/vehicles/:id` | Get vehicle by ID | Admin, Staff, Owner |
| PUT | `/api/vehicles/:id` | Update vehicle | Customer, Staff |
| DELETE | `/api/vehicles/:id` | Delete vehicle | Customer, Admin |

### Policy APIs
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/api/policies` | Create new policy | Admin |
| GET | `/api/policies` | Get all policies | All Authenticated |
| GET | `/api/policies/:id` | Get policy by ID | All Authenticated |
| PUT | `/api/policies/:id` | Update policy | Admin |
| DELETE | `/api/policies/:id` | Deactivate policy | Admin |
| POST | `/api/policies/:id/purchase` | Purchase policy for vehicle | Customer |

### Premium APIs
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/api/premiums` | Get all premiums | Admin |
| GET | `/api/premiums/my` | Get customer's premiums | Customer |
| GET | `/api/premiums/:id` | Get premium by ID | Admin, Staff, Owner |
| POST | `/api/premiums/calculate` | Calculate premium (preview) | Customer, Staff |
| PUT | `/api/premiums/:id/pay` | Process payment | Customer |

### Renewal APIs
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/api/renewals` | Submit renewal request | Customer |
| GET | `/api/renewals` | Get all renewals | Admin |
| GET | `/api/renewals/my` | Get customer's renewals | Customer |
| GET | `/api/renewals/:id` | Get renewal by ID | Admin, Staff, Owner |
| PUT | `/api/renewals/:id/approve` | Approve renewal | Admin |
| PUT | `/api/renewals/:id/reject` | Reject renewal | Admin |

### Claim APIs
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/api/claims` | Submit new claim | Customer |
| GET | `/api/claims` | Get all claims | Admin |
| GET | `/api/claims/my` | Get customer's claims | Customer |
| GET | `/api/claims/:id` | Get claim by ID | Admin, Staff, Owner |
| PUT | `/api/claims/:id/approve` | Approve claim | Admin |
| PUT | `/api/claims/:id/reject` | Reject claim | Admin |
| PUT | `/api/claims/:id/review` | Mark as under review | Admin |

### Notification APIs
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/api/notifications` | Get all notifications | Admin |
| GET | `/api/notifications/my` | Get customer's notifications | Customer |
| PUT | `/api/notifications/:id/read` | Mark as read | Customer |
| POST | `/api/notifications/send` | Send custom notification | Admin |
| GET | `/api/notifications/unread-count` | Get unread count | Customer |

### Dashboard & Report APIs
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/api/dashboard/stats` | Get dashboard statistics | Admin |
| GET | `/api/reports/policies` | Generate policy report | Admin, Staff |
| GET | `/api/reports/premiums` | Generate premium report | Admin, Staff |
| GET | `/api/reports/claims` | Generate claim report | Admin, Staff |
| GET | `/api/reports/renewals` | Generate renewal report | Admin, Staff |

---

## 📁 Project Folder Structure

```text
vehicle-insurance-management-system/
├── client/                     # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/             # Images, icons, logos
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/         # Button, Input, Modal, Card, Loader
│   │   │   ├── layout/         # Navbar, Sidebar, Footer
│   │   │   └── charts/         # Dashboard chart components
│   │   ├── pages/              # Page-level components
│   │   │   ├── auth/           # Login, Register, ForgotPassword
│   │   │   ├── customer/       # CustomerDashboard, Profile
│   │   │   ├── vehicle/        # AddVehicle, VehicleList
│   │   │   ├── policy/         # PolicyList, PolicyDetail, PurchasePolicy
│   │   │   ├── premium/        # PremiumList, PaymentPage
│   │   │   ├── renewal/        # RenewalList, RenewalRequest
│   │   │   ├── claim/          # ClaimList, SubmitClaim, ClaimDetail
│   │   │   ├── notification/   # NotificationCenter
│   │   │   ├── admin/          # AdminDashboard, ManageUsers, Reports
│   │   │   └── staff/          # StaffDashboard
│   │   ├── context/            # React Context (AuthContext, etc.)
│   │   ├── hooks/              # Custom hooks
│   │   ├── services/           # API service functions (axios)
│   │   ├── utils/              # Helper functions, constants
│   │   ├── routes/             # Route definitions, ProtectedRoute
│   │   ├── styles/             # Global styles, theme config
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js      # Theme with #325bb5 primary
├── server/                     # Node.js + Express Backend
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── env.js              # Environment config
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── ...
│   ├── models/
│   │   ├── User.js
│   │   ├── ...
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── ...
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── ...
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── ...
│   ├── server.js               # Entry point
│   └── package.json
├── .env
├── .gitignore
├── README.md
└── requirements.md
```

---

## 🎨 Design Tokens (Theme Configuration)

```javascript
// Tailwind config or theme file
const theme = {
  colors: {
    primary: {
      50: '#e8edf7',
      100: '#c5d0ec',
      200: '#9fb1df',
      300: '#7992d2',
      400: '#5c7ac8',
      500: '#325bb5', // Main Primary Color
      600: '#2c51a3',
      700: '#24438a',
      800: '#1d3671',
      900: '#142550',
    },
    success: '#16a34a',
    warning: '#f59e0b',
    danger: '#dc2626',
    info: '#0ea5e9',
    background: '#f8fafc',
    surface: '#ffffff',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
  },
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  }
}
```

---

## 🔄 Project Model: Iterative Development

The system follows the Iterative Model where development happens in multiple cycles:

| Iteration | Focus Area | Deliverables |
| :--- | :--- | :--- |
| **Iteration 1** | Foundation & Auth | Project setup, DB schema, Auth module, basic UI shell |
| **Iteration 2** | Core Entities | Customer, Vehicle, Policy CRUD operations |
| **Iteration 3** | Business Logic | Premium calculation, Policy purchase, Payment simulation |
| **Iteration 4** | Workflows | Renewal management, Claim management |
| **Iteration 5** | Communication | Notification system, Reminders, Alerts |
| **Iteration 6** | Analytics & Polish | Admin dashboard, Reports, Charts, UI refinement |
| **Iteration 7** | Testing & Deployment | End-to-end testing, Bug fixes, Deployment |
