````markdown
# Policy API Test Collection

## Test 1: Login as Admin

```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"admin@vehicleinsurance.com\", \"password\": \"Admin@1234\"}"
```
````

## Test 2: Create Policies (Admin) - POL-01

### Third-Party Policy

```bash
curl -X POST http://localhost:5000/api/policies ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ADMIN_TOKEN" ^
  -d "{\"policyName\": \"Basic Third-Party Cover\", \"coverageType\": \"Third-Party\", \"policyDuration\": 12, \"baseAmount\": 5000, \"description\": \"Mandatory third-party liability coverage as per Motor Vehicles Act. Covers damages to third-party property and injuries.\", \"premiumRules\": {\"vehicleTypeMultiplier\": {\"2-Wheeler\": 0.7, \"4-Wheeler\": 1.0, \"Commercial\": 1.8}, \"ageDepreciation\": 1.5, \"coverageMultiplier\": {\"Third-Party\": 0.6, \"Comprehensive\": 1.0, \"Own-Damage\": 0.8}}}"
```

### Comprehensive Policy

```bash
curl -X POST http://localhost:5000/api/policies ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ADMIN_TOKEN" ^
  -d "{\"policyName\": \"Premium Comprehensive Shield\", \"coverageType\": \"Comprehensive\", \"policyDuration\": 24, \"baseAmount\": 15000, \"description\": \"Complete coverage including third-party liability, own damage, theft, fire, and natural calamities. Best value for full protection.\"}"
```

### Own-Damage Policy

```bash
curl -X POST http://localhost:5000/api/policies ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ADMIN_TOKEN" ^
  -d "{\"policyName\": \"Own Damage Protection\", \"coverageType\": \"Own-Damage\", \"policyDuration\": 12, \"baseAmount\": 8000, \"description\": \"Covers damage to your own vehicle from accidents, fire, theft, and natural disasters. Does not include third-party coverage.\"}"
```

### Another Comprehensive (36 months)

```bash
curl -X POST http://localhost:5000/api/policies ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ADMIN_TOKEN" ^
  -d "{\"policyName\": \"Ultimate 3-Year Coverage\", \"coverageType\": \"Comprehensive\", \"policyDuration\": 36, \"baseAmount\": 25000, \"description\": \"Our best long-term comprehensive coverage for 3 years. Maximum protection with lowest per-year cost.\"}"
```

## Test 3: Duplicate Policy Name Check

```bash
curl -X POST http://localhost:5000/api/policies ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ADMIN_TOKEN" ^
  -d "{\"policyName\": \"Basic Third-Party Cover\", \"coverageType\": \"Third-Party\", \"policyDuration\": 12, \"baseAmount\": 6000}"
```

**Expected (409):**

```json
{
  "success": false,
  "message": "Policy with name \"Basic Third-Party Cover\" already exists"
}
```

## Test 4: Get All Policies (Customer View) - POL-04

```bash
# Login as customer first
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"testcust@example.com\", \"password\": \"Test@1234\"}"

# Browse policies
curl http://localhost:5000/api/policies ^
  -H "Authorization: Bearer CUSTOMER_TOKEN"
```

## Test 5: Filter Policies - POL-09

```bash
# By coverage type
curl "http://localhost:5000/api/policies?coverageType=Comprehensive" ^
  -H "Authorization: Bearer CUSTOMER_TOKEN"

# By duration
curl "http://localhost:5000/api/policies?policyDuration=12" ^
  -H "Authorization: Bearer CUSTOMER_TOKEN"

# By price range
curl "http://localhost:5000/api/policies?minAmount=5000&maxAmount=20000" ^
  -H "Authorization: Bearer CUSTOMER_TOKEN"

# Search by name
curl "http://localhost:5000/api/policies?search=comprehensive" ^
  -H "Authorization: Bearer CUSTOMER_TOKEN"

# Combined filters
curl "http://localhost:5000/api/policies?coverageType=Comprehensive&sortBy=baseAmount&sortOrder=asc" ^
  -H "Authorization: Bearer CUSTOMER_TOKEN"
```

## Test 6: Get Policy Detail - POL-05

```bash
curl http://localhost:5000/api/policies/POLICY_MONGO_ID ^
  -H "Authorization: Bearer CUSTOMER_TOKEN"
```

## Test 7: Calculate Premium Preview - PREM-01, PREM-02, PREM-03

```bash
curl -X POST http://localhost:5000/api/policies/calculate-premium ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer CUSTOMER_TOKEN" ^
  -d "{\"policyID\": \"POLICY_MONGO_ID\", \"vehicleID\": \"VEHICLE_MONGO_ID\"}"
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Premium calculated successfully",
  "data": {
    "policy": {
      "policyName": "Premium Comprehensive Shield",
      "coverageType": "Comprehensive",
      "baseAmount": 15000
    },
    "vehicle": {
      "vehicleNumber": "MH01AB1234",
      "vehicleType": "4-Wheeler",
      "registrationYear": 2022
    },
    "premiumBreakdown": {
      "baseAmount": 15000,
      "vehicleType": "4-Wheeler",
      "vehicleTypeMultiplier": 1.0,
      "coverageType": "Comprehensive",
      "coverageMultiplier": 1.0,
      "vehicleAge": 3,
      "ageDepreciationRate": 2,
      "depreciationFactor": 0.94,
      "calculationSteps": {
        "step1": "Base Amount: ₹15000",
        "step2": "× Vehicle Type (4-Wheeler): 1",
        "step3": "× Coverage (Comprehensive): 1",
        "step4": "× Age Factor (3yr, -2%/yr): 0.94",
        "result": "= ₹14100"
      },
      "finalAmount": 14100
    }
  }
}
```

## Test 8: Purchase Policy - POL-06, POL-07

```bash
curl -X POST http://localhost:5000/api/policies/POLICY_MONGO_ID/purchase ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer CUSTOMER_TOKEN" ^
  -d "{\"vehicleID\": \"VEHICLE_MONGO_ID\"}"
```

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Policy purchased successfully. Please complete payment.",
  "data": {
    "premium": {
      "premiumID": "PREM-00001",
      "calculatedAmount": 14100,
      "paymentStatus": "Pending",
      "policyID": { "policyName": "Premium Comprehensive Shield" },
      "vehicleID": { "vehicleNumber": "MH01AB1234" }
    },
    "renewal": {
      "renewalID": "REN-00001",
      "renewalDate": "2026-02-14",
      "expiryDate": "2028-02-14",
      "renewalStatus": "Pending"
    },
    "premiumBreakdown": { "...": "..." }
  }
}
```

## Test 9: Duplicate Purchase Prevention

```bash
# Try purchasing same policy again
curl -X POST http://localhost:5000/api/policies/POLICY_MONGO_ID/purchase ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer CUSTOMER_TOKEN" ^
  -d "{\"vehicleID\": \"VEHICLE_MONGO_ID\"}"
```

**Expected (409):**

```json
{
  "success": false,
  "message": "You already have a pending payment for this policy. Please complete the existing payment."
}
```

## Test 10: Update Policy - POL-02

```bash
curl -X PUT http://localhost:5000/api/policies/POLICY_MONGO_ID ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer ADMIN_TOKEN" ^
  -d "{\"baseAmount\": 16000, \"description\": \"Updated comprehensive coverage with enhanced benefits.\"}"
```

## Test 11: Deactivate Policy - POL-03

```bash
curl -X DELETE http://localhost:5000/api/policies/POLICY_MONGO_ID ^
  -H "Authorization: Bearer ADMIN_TOKEN"
```

## Test 12: Policy Stats

```bash
curl http://localhost:5000/api/policies/stats ^
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Expected:**

```json
{
  "success": true,
  "data": {
    "policies": { "total": 4, "active": 4, "inactive": 0 },
    "byCoverageType": {
      "Third-Party": 1,
      "Comprehensive": 2,
      "Own-Damage": 1
    },
    "purchases": {
      "total": 1,
      "totalRevenue": 14100,
      "averagePremium": 14100,
      "byCoverage": []
    },
    "durationDistribution": [
      { "months": 12, "count": 2 },
      { "months": 24, "count": 1 },
      { "months": 36, "count": 1 }
    ]
  }
}
```

## Test 13: Access Control

```bash
# Customer tries to create policy (should fail)
curl -X POST http://localhost:5000/api/policies ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer CUSTOMER_TOKEN" ^
  -d "{\"policyName\": \"Test\", \"coverageType\": \"Third-Party\", \"policyDuration\": 12, \"baseAmount\": 1000}"
```

**Expected (403):**

```json
{
  "success": false,
  "message": "Access denied. Role 'Customer' is not authorized to access this resource."
}
```
