curl -X PUT http://localhost:3001/api/reviews/REVIEW_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NmQ3N2Q3MmViZTExZTk2MDBiOWI1ZSIsImlhdCI6MTc1MjAwNDcxNiwiZXhwIjoxNzUyMDA4MzE2fQ.5ovm2CI4_6_7XdkH558OkofMIH9q1YFY6t1v2ZfBkOo" \
  -d '{
    "content": "Contenido actualizado de la reseña",
    "rating": 4
  }'