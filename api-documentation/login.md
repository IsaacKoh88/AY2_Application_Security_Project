## Login API Documentation

### Request

`POST https://localhost/api/login`

#### Parameters

| Parameter Name | Requirements |
|----------------|--------------|
| email | Required field, max 255 characters, only regex `[\w-\.]+@([\w-]+\.)+[\w-]{2,4}` format allowed |
| password | Required field, max 255 characters, only regex `[a-zA-Z0-9._ \t]` characters allowed |

### Response

| Response Status | Response Meaning |
|-|-|
| 200 | Successful login request, sets JWT token, redirects to https://localhost/account/[accountID] |
| 400 | Unsuccessful signup request, request parameters does not conform to requirements above |
| 401 | Unsuccessful signup request, request credentials are incorrect |
| 405 | Unsuccessful signup request, request did not use `POST` method |
| 500 | Unsuccessful signup request, internal server issue (likely due to error in mysql connection) |