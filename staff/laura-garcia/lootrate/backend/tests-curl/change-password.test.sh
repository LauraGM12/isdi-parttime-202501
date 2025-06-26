curl -X PUT http://localhost:3001/api/users/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_JWT_AQUÍ" \
  -d '{
    "currentPassword": "contraseñaActual123!", 
    "newPassword": "nuevaContraseña456!"
  }'