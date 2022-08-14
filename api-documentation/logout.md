## Logout API Documentation

### Request

`GET https://localhost/api/login`

#### Header Parameters

| Parameter Type | Requirements |
|----------------|--------------|
| Cookie | Must have a authorised an JWT token under cookie name `token` |

### Response

| Response Status | Response Meaning |
|-|-|
| 200 | Successful logout request, removes JWT token from client, blacklists JWT token, redirects to https://localhost/ |
| 400 | Unsuccessful logout request, request parameters does not fit requirements above |
| 401 | Unsuccessful logout request, JWT token invalid |
| 405 | Unsuccessful logout request, request did not use `GET` method |
| 429 | Unsuccessful logout request, too many requests from IP, thus rate limited |
| 500 | Unsuccessful logout request, internal server issue (likely due to error in mysql connection) |