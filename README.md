# auth_service
This service provides simple JWT authentication functionality through REST API.
Users can create accounts, acquire tokens and retrieve their ids and usernames.
Service also provides user administration functionality.

## Stored data
Users are described with four properties: id, username, password and status.
Password is not stored in the database. Status is one of two values: active or inactive.
Data is stored in PostgreSQL database:

```
CREATE TABLE auth_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR (64) UNIQUE NOT NULL,
    pass_hash VARCHAR NOT NULL,
    active BOOLEAN NOT NULL
);
```

This service requires the table to exist in the database.

## Configuration
This service can be configured through following environment variables:

1. ```DB_HOST``` - database server hostname (default ```localhost```);
2. ```DB_PORT``` - database server port number (default ```5432```);
3. ```DB_USER``` - database user name (default ```postgres```);
4. ```DB_PASS``` - database user password (default ```postgres```);
5. ```DB_NAME``` - database name (default ```postgres```);
6. ```SECRET``` - secret key used to generate tokens (default ```SECRET```);

Example:

```
DB_HOST=dbdomain
DB_PORT=1024
DB_USER=myuser
DB_PASS=mypass
DB_NAME=authdb
SECRET=ASDF4fdsfVe423rFSEfgYH56hr
```

## Endpoints
### GET /api/users/<:id>
Returns the data (id, username and status) of the user with the given id.

### POST /api/users
Creates new user with username and password given in the request body. Example request body:

```json
{
  "username": "user",
  "password": "password"
}
```

Returns the data of the newly created user.

### DELETE /api/users/<:id>
Deletes the user with the given id. 

### PATCH /api/users/<:id>
Updates the data of the user with the given id. 
Only username, password and status properties can be updated.
New values are given in the request body. Request body examples:

```json
{
  "username": "newusername",
  "password": "newpassword",
  "active": true
}
```

```json
{
  "active": false
}
```

### POST /api/tokens
Creates a new token for the user identified with credentials given in the request body. 
Example request body:

```json
{
  "username": "user",
  "password": "password"
}
```

### GET /api/tokens
Returns the data of the user authenticated with a token given in the headers. 
Requires a valid token present in the ```Authorization``` header 
with the ```Bearer``` authentication scheme. Example:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```
