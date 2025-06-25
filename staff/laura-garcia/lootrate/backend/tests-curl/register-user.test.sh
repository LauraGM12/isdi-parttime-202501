curl -X POST https://lootrate-api.onrender.com/api/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@test.com",
    "password": "test123Ab!"
  }' -v