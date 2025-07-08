curl -X POST http://localhost:3001/api/users/lists/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NmQ3N2Q3MmViZTExZTk2MDBiOWI1ZSIsImlhdCI6MTc1MjAwNDcxNiwiZXhwIjoxNzUyMDA4MzE2fQ.5ovm2CI4_6_7XdkH558OkofMIH9q1YFY6t1v2ZfBkOo" \
  -d '{
    "gameId": "12345",
    "gameName": "The Legend of Zelda: Breath of the Wild",
    "gameImage": "https://example.com/zelda.jpg",
    "listType": "wishlist"
  }'