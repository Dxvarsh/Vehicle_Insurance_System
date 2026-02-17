# Test 1: Login as Admin (Get Token)
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"admin@vehicleinsurance.com\", \"password\": \"Admin@1234\"}"

C
## Copy the accessToken from response. Use it in all following requests.

# Test 2: Get Customer Stats
curl http://localhost:5000/api/customers/stats ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"


# Test 3: Get All Customers (with Search & Pagination)
# Basic list
curl http://localhost:5000/api/customers ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# With search
curl "http://localhost:5000/api/customers?search=john" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# With pagination & sorting
curl "http://localhost:5000/api/customers?page=1&limit=5&sortBy=name&sortOrder=asc" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Filter active only
curl "http://localhost:5000/api/customers?isActive=true" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"


# Test 4: Staff Register New Customer
curl -X POST http://localhost:5000/api/customers/register ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"name\": \"Rahul Sharma\", \"email\": \"rahul@example.com\", \"contactNumber\": \"9876543210\", \"address\": \"456 MG Road, Mumbai\", \"username\": \"rahulsharma\", \"password\": \"Rahul@1234\"}"


# Test 5: Get Customer by ID
curl http://localhost:5000/api/customers/CUSTOMER_MONGO_ID_HERE ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"


# Test 6: Update Customer Profile
curl -X PUT http://localhost:5000/api/customers/CUSTOMER_MONGO_ID_HERE ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"name\": \"Rahul Kumar Sharma\", \"address\": \"789 New Address, Delhi\"}"

# Test 7: Deactivate Customer
curl -X DELETE http://localhost:5000/api/customers/CUSTOMER_MONGO_ID_HERE ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"isActive\": false}"

# Test 8: Reactivate Customer
curl -X DELETE http://localhost:5000/api/customers/CUSTOMER_MONGO_ID_HERE ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"isActive\": true}"

# Test 9: Customer Dashboard
curl http://localhost:5000/api/customers/CUSTOMER_MONGO_ID_HERE/dashboard ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Test 10: Access Control Test (Should Fail)
# Login as customer
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"rahul@example.com\", \"password\": \"Rahul@1234\"}"

# Try to access all customers list (should fail - Customer role)
curl http://localhost:5000/api/customers ^
  -H "Authorization: Bearer CUSTOMER_TOKEN_HERE"

