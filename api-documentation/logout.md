## Logout API Documentation

### Request

`POST https://localhost/api/login`

#### Header Parameters

| Parameter Type | Requirements |
|----------------|--------------|
| Cookie | Must have a authorised an JWT token under cookie name `token` |

### Response

| Response Status | Response Meaning |
|-|-|
| 200 | Successful logout request, removes JWT token from client, blacklists JWT token, redirects to https://localhost/login |
| 400 | Unsuccessful signup request, request parameters does not fit requirements above |
| 401 | Unsuccessful signup request, JWT token invalid |
| 405 | Unsuccessful signup request, request did not use `GET` method |
| 500 | Unsuccessful signup request, internal server issue (likely due to error in mysql connection) |