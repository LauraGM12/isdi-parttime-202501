curl -X POST http://localhost:3001/api/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "testd@test.com",
    "password": "test12s3Ab!"
  }' -v