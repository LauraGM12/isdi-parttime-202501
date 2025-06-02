# Pets-App Api

## Api Endpoints

### POST `/users`:
```sh
curl -X POST http://localhost:4321/users \
    -H "Content-Type: application/json" \
    -d '{"email": "hiro@mail.com", "password": "12345Aa!"}' -v
```
**expected response:**    
-  201 Created

### POST `/users/auth`
```sh
curl -X POST http://localhost:4321/users/auth \
    -H "Content-Type: application/json" \
    -d '{"email": "cosmo@mail.com", "password": "12345Aa!"}' -v
```
**expected response:**    
-  200 OK + Body: {id (type: number)}

### GET `/users/username`
```sh
curl -X GET http://localhost:4321/users/username \
    -H "Authorization: Basic 1745520811922" -v
```
**expected response:**    
-  200 OK + Body: {username (type: string)}
