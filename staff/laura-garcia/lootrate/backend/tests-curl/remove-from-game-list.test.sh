curl -X DELETE http://localhost:3001/api/users/lists/remove \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "gameId": "12345",
    "listType": "wishlist"
  }'