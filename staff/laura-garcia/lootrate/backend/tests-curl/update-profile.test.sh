curl -X PUT http://localhost:3001/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "username": "updatedUsername",
    "bio": "Esta es mi nueva biografía",
    "favoriteGenres": ["RPG", "Aventura"]
  }'