curl -X DELETE http://localhost:3001/api/users/account \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_JWT_AQUÍ" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "contraseñaActual123!"
  }'