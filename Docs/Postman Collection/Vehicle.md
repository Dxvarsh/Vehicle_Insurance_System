# Test 1: Login as Admin (Get Token)
``` Bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"admin@vehicleinsurance.com\", \"password\": \"Admin@1234\"}"
```
## Save the accessToken from response.

# Test 2: Register a Customer First (if not done already)
```Bash

curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\": \"testcust\", \"email\": \"testcust@example.com\", \"password\": \"Test@1234\", \"name\": \"Test Customer\", \"contactNumber\": \"9876543210\", \"address\": \"123 Test Street\"}"
Save the customer _id and accessToken.
```
# Test 3: Customer Adds Vehicle (VEH-01)
```Bash

curl -X POST http://localhost:5000/api/vehicles ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer CUSTOMER_TOKEN" ^
  -d "{\"vehicleNumber\": \"MH01AB1234\", \"vehicleType\": \"4-Wheeler\", \"model\": \"Honda City\", \"registrationYear\": 2022}"
```
## Expected Response (201):
``` JSON

{
  "success": true,
  "message": "Vehicle added successfully",
  "data": {
    "vehicle": {
      "_id": "...",
      "vehicleID": "VEH-00001",
      "vehicleNumber": "MH01AB1234",
      "vehicleType": "4-Wheeler",
      "model": "Honda City",
      "registrationYear": 2022,
      "customerID": {
        "customerID": "CUST-00001",
        "name": "Test Customer",
        "email": "testcust@example.com"
      }
    }
  }
}
```

# Test 4: Prevent Duplicate Vehicle Number (VEH-08)
```Bash

curl -X POST http://localhost:5000/api/vehicles ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer CUSTOMER_TOKEN" ^
  -d "{\"vehicleNumber\": \"MH01AB1234\", \"vehicleType\": \"2-Wheeler\", \"model\": \"Honda Activa\", \"registrationYear\": 2023}"
```

## Expected Response (409):

``` JSON

{
  "success": false,
  "message": "Vehicle with number MH01AB1234 is already registered"
}
```

# Test 5: Invalid Vehicle Number Format (VEH-07)
```Bash

curl -X POST http://localhost:5000/api/vehicles ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer CUSTOMER_TOKEN" ^
  -d "{\"vehicleNumber\": \"INVALID123\", \"vehicleType\": \"4-Wheeler\", \"model\": \"Test\", \"registrationYear\": 2022}"
```
## Expected Response (400):

```JSON

{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "vehicleNumber",
      "message": "Vehicle number must be in valid format (e.g., KA01AB1234 or MH02A5678)"
    }
  ]
}
```
# Test 6: Add Another Vehicle (for testing)
```Bash

curl -X POST http://localhost:5000/api/vehicles ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer CUSTOMER_TOKEN" ^
  -d "{\"vehicleNumber\": \"KA05C9876\", \"vehicleType\": \"2-Wheeler\", \"model\": \"Honda Activa 6G\", \"registrationYear\": 2023}"
```
# Test 7: Customer Views Their Vehicles (VEH-02)
```Bash

curl http://localhost:5000/api/vehicles/my ^
  -H "Authorization: Bearer CUSTOMER_TOKEN"
Expected: Only this customer's vehicles
```
# Test 8: Customer Views with Search
```Bash

curl "http://localhost:5000/api/vehicles/my?search=honda" ^
  -H "Authorization: Bearer CUSTOMER_TOKEN"
```
# Test 9: Customer Views with Type Filter
```Bash

curl "http://localhost:5000/api/vehicles/my?vehicleType=4-Wheeler" ^
  -H "Authorization: Bearer CUSTOMER_TOKEN"
```
# Test 10: Admin Views All Vehicles (VEH-05)
```Bash

curl http://localhost:5000/api/vehicles ^
  -H "Authorization: Bearer ADMIN_TOKEN"
```
## Expected: ALL vehicles from ALL customers with pagination

# Test 11: Admin Views with Filters
```Bash

# Filter by type
curl "http://localhost:5000/api/vehicles?vehicleType=4-Wheeler" ^
  -H "Authorization: Bearer ADMIN_TOKEN"

# Search
curl "http://localhost:5000/api/vehicles?search=MH01" ^
  -H "Authorization: Bearer ADMIN_TOKEN"

# Pagination + Sort
curl "http://localhost:5000/api/vehicles?page=1&limit=5&sortBy=vehicleNumber&sortOrder=asc" ^
  -H "Authorization: Bearer ADMIN_TOKEN"

# Filter by customer
curl "http://localhost:5000/api/vehicles?customerID=CUSTOMER_MONGO_ID" ^
  -H "Authorization: Bearer ADMIN_TOKEN"
```
# Test 12: Get Vehicle by ID
```Bash

curl http://localhost:5000/api/vehicles/VEHICLE_MONGO_ID ^
  -H "Authorization: Bearer CUSTOMER_TOKEN"
```
## Expected: Vehicle details + active policies info

# Test 13: Update Vehicle (VEH-03)
```Bash

curl -X PUT http://localhost:5000/api/vehicles/VEHICLE_MONGO_ID ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer CUSTOMER_TOKEN" ^
  -d "{\"model\": \"Honda City 2023 ZX\", \"registrationYear\": 2023}"
```
# Test 14: Delete Vehicle - No Active Policy (VEH-04)
```Bash

curl -X DELETE http://localhost:5000/api/vehicles/VEHICLE_MONGO_ID ^
  -H "Authorization: Bearer CUSTOMER_TOKEN"
```
## Expected (200): Vehicle deleted, reference removed from customer

# Test 15: Staff Adds Vehicle for Customer (VEH-06)
```Bash

curl -X POST http://localhost:5000/api/vehicles ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer STAFF_TOKEN" ^
  -d "{\"vehicleNumber\": \"GJ01XY5678\", \"vehicleType\": \"Commercial\", \"model\": \"Tata Ace\", \"registrationYear\": 2021, \"customerID\": \"CUSTOMER_MONGO_ID\"}"
```
# Test 16: Vehicle Stats (Admin)
```Bash

curl http://localhost:5000/api/vehicles/stats ^
  -H "Authorization: Bearer ADMIN_TOKEN"
```
## Expected Response:

``` JSON

{
  "success": true,
  "data": {
    "total": 3,
    "byType": {
      "2-Wheeler": 1,
      "4-Wheeler": 1,
      "Commercial": 1
    },
    "thisMonth": 3,
    "lastMonth": 0,
    "growthPercentage": 100,
    "ageDistribution": [
      { "range": "0-2 years", "count": 2 },
      { "range": "3-5 years", "count": 1 }
    ]
  }
}
```
# Test 17: Access Control - Customer Cannot View All Vehicles
```Bash

curl http://localhost:5000/api/vehicles ^
  -H "Authorization: Bearer CUSTOMER_TOKEN"
```
## Expected (403):

```JSON

{
  "success": false,
  "message": "Access denied. Role 'Customer' is not authorized to access this resource."
}
```
# Test 18: Customer Cannot View Another Customer's Vehicle
```Bash

# Get a vehicle ID that belongs to another customer
curl http://localhost:5000/api/vehicles/OTHER_CUSTOMERS_VEHICLE_ID ^
  -H "Authorization: Bearer CUSTOMER_TOKEN"
```
## Expected (403):
```JSON

{
  "success": false,
  "message": "Access denied. You can only view your own vehicles."
}