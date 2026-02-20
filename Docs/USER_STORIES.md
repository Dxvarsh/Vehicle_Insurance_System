# 📖 VIMS - User Stories & Functional Mapping

This document compares the implemented functionality with the project requirements through the lens of User Stories.

## Module 1: Authentication & Authorization

**Goal:** Secure system access and role-based control.

- **User Story 1:** As a **New User**, I want to register an account so that I can use the system's services.
- **User Story 2:** As a **Returning User**, I want to log in securely with my credentials so that I can access my private data.
- **User Story 3:** As the **System**, I want to restrict access to certain pages (like Admin Dashboard) based on user roles (RBAC) to ensure data security.
- **User Story 4:** As a **User**, I want to reset my password if I forget it so that I don't lose access to my account.

---

## Module 2: Customer Management

**Goal:** Managing identity and user profiles.

- **User Story 1:** As a **Customer**, I want to update my profile (phone, address) so that the company can reach me.
- **User Story 2:** As an **Admin**, I want to search and filter through the customer list to find specific user accounts quickly.
- **User Story 3:** As **Staff**, I want to register a customer who walks into the office so that they are added to our digital system.

---

## Module 3: Vehicle Management

**Goal:** Managing the assets being insured.

- **User Story 1:** As a **Customer**, I want to add my vehicle details (Model, Number, Type) so that I can get it insured.
- **User Story 2:** As the **System**, I want to validate vehicle formats and prevent duplicate registrations to maintain data integrity.
- **User Story 3:** As a **Customer**, I want to see all my vehicles in one place to manage their insurance statuses easily.

---

## Module 4: Insurance Policy Management

**Goal:** Defining and offering insurance products.

- **User Story 1:** As an **Admin**, I want to create new insurance plans (e.g., Gold Shield, Third-Party) so that customers have options to choose from.
- **User Story 2:** As a **Customer**, I want to browse available policies and see their details (base amount, duration) so that I can pick the one that fits my needs.
- **User Story 3:** As an **Admin**, I want to deactivate outdated policies so that customers cannot purchase them anymore.

---

## Module 5: Premium Calculation & Payment

**Goal:** Revenue generation and financial transactions.

- **User Story 1:** As a **Customer**, I want the system to automatically calculate my premium based on my vehicle type and age so that I get a fair price.
- **User Story 2:** As a **Customer**, I want to pay for my policy via a simulated gateway so that my insurance coverage begins immediately.
- **User Story 3:** As a **Customer**, I want to download a payment receipt after a successful transaction for my financial records.

---

## Module 6: Policy Renewal

**Goal:** Maintaining continuous customer coverage.

- **User Story 1:** As a **Customer**, I want to apply for a renewal before my policy expires so that I don't have a gap in coverage.
- **User Story 2:** As an **Admin**, I want to review renewal requests and approve/reject them with remarks to ensure eligibility.
- **User Story 3:** As the **System**, I want to automatically flag expired policies that weren't renewed to keep status records accurate.

---

## Module 7: Claim Management

**Goal:** Assisting customers during accidents/losses.

- **User Story 1:** As a **Customer**, I want to file a claim with a reason and supporting documents so that I can get reimbursed for damages.
- **User Story 2:** As an **Admin**, I want to track all pending claims and process them (Approve/Reject/Review) so that customers receive timely payouts.
- **User Story 3:** As a **Customer**, I want to see the status of my claim in real-time (e.g., "Under Review") so that I stay informed.

---

## Module 8: Notification System

**Goal:** Keeping users informed through alerts.

- **User Story 1:** As a **Customer**, I want to see a badge on the notification bell so that I know when I have new updates.
- **User Story 2:** As an **Admin**, I want to send a broadcast message to all customers about a new policy launch or system maintenance.
- **User Story 3:** As a **Customer**, I want to mark notifications as read so that I can keep my notification center organized.

---

## Module 9: Admin Dashboard & Reports

**Goal:** High-level analytics and data auditing.

- **User Story 1:** As an **Admin**, I want to see visual charts of my revenue growth and policy distribution so that I can analyze business trends.
- **User Story 2:** As an **Admin**, I want to export detailed reports (Policies, Premiums, Claims) so that I can perform monthly audits or share data with stakeholders.
- **User Story 3:** As **Staff**, I want to view high-level stats of the company's performance while having restricted access to sensitive individual data.
