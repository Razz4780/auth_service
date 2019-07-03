# auth_service
This service provides simple JWT authentication functionality through REST API.
Users can create accounts, acquire tokens and retrieve their ids and usernames.
Service also provides user administration functionality for admins through REST API

## Stored data
This service operates on two types of records: users and admins.

1. Users are described with four properties: id, username, password and status.
Password is not stored in the database. Status is one of two values: active or inactive.
2. Admins are described with two properties: id and username.

Data is stored in PostgreSQL database in two tables:

```
CREATE TABLE auth_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR (64) UNIQUE NOT NULL,
    pass_hash VARCHAR NOT NULL,
    active BOOLEAN NOT NULL
);

CREATE TABLE auth_admins (
    id SERIAL PRIMARY KEY,
    pass_hash VARCHAR NOT NULL
);
```

This service requires both tables to already exist in the database. 
Table ```admins``` is not editable through this service.

## Configuration
This service can be configured through following environment variables:

1. ```DB_HOST``` - database server hostname (default ```localhost```);
2. ```DB_PORT``` - database server port number (default ```5432```);
3. ```DB_USER``` - database user name (default ```postgres```);
4. ```DB_PASS``` - database user password (default ```postgres```);
5. ```DB_NAME``` - database name (default ```postgres```);
6. ```ADM_OFF``` - set this variable to any value to disable user administration functionality;
7. ```SECRET``` - secret key used in hashing algorithms (default ```SECRET```);

Example:

```
DB_HOST=dbdomain
DB_PORT=1024
DB_USER=myuser
DB_PASS=mypass
DB_NAME=authdb
ADM_OFF=1
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
Requires admin credentials to be given in the request body. Example request body:

```json
{
  "id": 2,
  "password": "password"
}
```

### PATCH /api/users/<:id>
Updates the data of the user with the given id. 
Only username, password and status properties can be updated.
New values are given in the request body. Examples request body:

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
