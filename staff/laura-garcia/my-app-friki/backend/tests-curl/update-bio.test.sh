curl -X PATCH http://localhost:4321/users/bio \
    -H "Content-Type: application/json" \
    -H "Authorization: Basic 681d01502f3a0ded5e3cb3ee" \
    -d '{"bio": "test test test"}' -v