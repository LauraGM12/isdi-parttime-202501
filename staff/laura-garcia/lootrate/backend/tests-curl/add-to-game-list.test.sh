curl -X POST http://localhost:3001/api/users/lists/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JWT_SECRET" \
  -d '{
    "gameId": "12345",
    "gameName": "The Legend of Zelda: Breath of the Wild",
    "gameImage": "https://example.com/zelda.jpg",
    "listType": "wishlist"
  }'