# Policy Renewal Module API cURLs

This document contains cURL commands for testing the Policy Renewal Module APIs.
Base URL: `http://localhost:5000/api`

## 1. Submit Renewal Request (Customer)

**Endpoint:** `POST /api/renewals`
**Description:** Customer initiates a renewal request for an existing policy and vehicle.

```bash
curl --location 'http://localhost:5000/api/renewals' \
--header 'Authorization: Bearer <CUSTOMER_TOKEN>' \
--header 'Content-Type: application/json' \
--data '{
    "policyID": "<POLICY_ID>",
    "vehicleID": "<VEHICLE_ID>"
}'
```

## 2. Get My Renewals (Customer)

**Endpoint:** `GET /api/renewals/my`
**Description:** Get a list of all renewal requests made by the logged-in customer.

```bash
curl --location 'http://localhost:5000/api/renewals/my?page=1&limit=10' \
--header 'Authorization: Bearer <CUSTOMER_TOKEN>'
```

## 3. Get All Renewals (Admin/Staff)

**Endpoint:** `GET /api/renewals`
**Description:** Get a paginated list of all renewal requests in the system.

```bash
curl --location 'http://localhost:5000/api/renewals?page=1&limit=10&renewalStatus=Pending' \
--header 'Authorization: Bearer <ADMIN_TOKEN>'
```

## 4. Get Expiring Policies (Admin/Staff)

**Endpoint:** `GET /api/renewals/expiring`
**Description:** Get a list of policies expiring within the specified number of days (default 30).

```bash
curl --location 'http://localhost:5000/api/renewals/expiring?days=30' \
--header 'Authorization: Bearer <ADMIN_TOKEN>'
```

## 5. Get Renewal By ID

**Endpoint:** `GET /api/renewals/:id`
**Description:** Get detailed information about a specific renewal request.

```bash
curl --location 'http://localhost:5000/api/renewals/<RENEWAL_ID>' \
--header 'Authorization: Bearer <TOKEN>'
```

## 6. Approve Renewal (Admin)

**Endpoint:** `PUT /api/renewals/:id/approve`
**Description:** Approve a pending renewal request.

```bash
curl --location 'http://localhost:5000/api/renewals/<RENEWAL_ID>/approve' \
--header 'Authorization: Bearer <ADMIN_TOKEN>' \
--header 'Content-Type: application/json' \
--data '{
    "adminRemarks": "Approved. Documents verified."
}'
```

## 7. Reject Renewal (Admin)

**Endpoint:** `PUT /api/renewals/:id/reject`
**Description:** Reject a pending renewal request.

```bash
curl --location 'http://localhost:5000/api/renewals/<RENEWAL_ID>/reject' \
--header 'Authorization: Bearer <ADMIN_TOKEN>' \
--header 'Content-Type: application/json' \
--data '{
    "adminRemarks": "Rejected. Vehicle age exceeds limit."
}'
```

## 8. Send Renewal Reminder (Admin/Staff)

**Endpoint:** `POST /api/renewals/:id/remind`
**Description:** Send a manual notification reminder to the customer about their expiring policy.

```bash
curl --location 'http://localhost:5000/api/renewals/<RENEWAL_ID>/remind' \
--header 'Authorization: Bearer <TOKEN>'
```

## 9. Batch Mark Expired Policies (Admin)

**Endpoint:** `PUT /api/renewals/mark-expired`
**Description:** Manually trigger a system check to mark all policies past their expiry date as 'Expired'.

```bash
curl --location --request PUT 'http://localhost:5000/api/renewals/mark-expired' \
--header 'Authorization: Bearer <ADMIN_TOKEN>'
```
