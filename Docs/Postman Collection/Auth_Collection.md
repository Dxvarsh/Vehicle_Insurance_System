# Health check
curl http://localhost:5000/api/health

# Register a customer
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "John@1234",
    "name": "John Doe",
    "contactNumber": "9876543210",
    "address": "123 Main Street, City"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@vehicleinsurance.com",
    "password": "Admin@1234"
  }'

# Get profile (use token from login response)
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <your_access_token>"