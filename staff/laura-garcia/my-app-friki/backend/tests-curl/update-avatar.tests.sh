curl -X PATCH http://localhost:4321/users/avatar \
    -H "Content-Type: application/json" \
    -H "Authorization: Basic 681cf0103f2241c46336d263" \
    -d '{"avatar": "https://img.pokemondb.net/artwork/large/umbreon.jpg"}' -v