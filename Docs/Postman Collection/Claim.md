# Claim Module API cURLs

This document contains cURL commands for testing the Claim Management Module APIs.
Base URL: `http://localhost:5000/api`

## 1. Submit Claim (Customer)

**Endpoint:** `POST /api/claims`
**Description:** Customer files a claim for an active policy.

```bash
curl --location 'http://localhost:5000/api/claims' \
--header 'Authorization: Bearer <CUSTOMER_TOKEN>' \
--header 'Content-Type: application/json' \
--data '{
    "policyID": "<POLICY_ID>",
    "vehicleID": "<VEHICLE_ID>",
    "premiumID": "<PREMIUM_ID>",
    "claimReason": "Accident occurred at main crossing. Front bumper damaged.",
    "supportingDocuments": ["https://example.com/image1.jpg", "https://example.com/report.pdf"]
}'
```

## 2. Get My Claims (Customer)

**Endpoint:** `GET /api/claims/my`
**Description:** Get all claims filed by the logged-in customer.

```bash
curl --location 'http://localhost:5000/api/claims/my?page=1&limit=10' \
--header 'Authorization: Bearer <CUSTOMER_TOKEN>'
```

## 3. Get All Claims (Admin/Staff)

**Endpoint:** `GET /api/claims`
**Description:** View all claims in the system with optional status filtering.

```bash
curl --location 'http://localhost:5000/api/claims?page=1&limit=10&claimStatus=Pending' \
--header 'Authorization: Bearer <ADMIN_TOKEN>'
```

## 4. Get Claim Statistics (Admin/Staff)

**Endpoint:** `GET /api/claims/stats`
**Description:** Get summary of claims (Total, Approved amount, etc.)

```bash
curl --location 'http://localhost:5000/api/claims/stats' \
--header 'Authorization: Bearer <ADMIN_TOKEN>'
```

## 5. Get Claim By ID

**Endpoint:** `GET /api/claims/:id`

```bash
curl --location 'http://localhost:5000/api/claims/<CLAIM_ID>' \
--header 'Authorization: Bearer <TOKEN>'
```

## 6. Process Claim (Admin)

**Endpoint:** `PUT /api/claims/:id/process`
**Description:** Approve, Reject or mark a claim as Under-Review.

**Sample Body for Approval:**

```json
{
  "claimStatus": "Approved",
  "claimAmount": 15000,
  "adminRemarks": "Surveyor report verified. Payout approved."
}
```

**Sample Body for Rejection:**

```json
{
  "claimStatus": "Rejected",
  "adminRemarks": "Damage not covered under policy terms."
}
```

```bash
curl --location --request PUT 'http://localhost:5000/api/claims/<CLAIM_ID>/process' \
--header 'Authorization: Bearer <ADMIN_TOKEN>' \
--header 'Content-Type: application/json' \
--data '{
    "claimStatus": "Approved",
    "claimAmount": 15000,
    "adminRemarks": "Payout processed."
}'
```
