## Signup API Documentation

### Request

`POST https://localhost/api/signup`

#### Parameters

| Parameter Name | Format Requirements |
|----------------|--------------|
| username | Required field, max 255 characters, only regex `[a-zA-Z0-9._ \t]` characters allowed |
| email | Required field, max 255 characters, only regex `[\w-\.]+@([\w-]+\.)+[\w-]{2,4}` format allowed |
| password | Required field, max 255 characters, only regex `[a-zA-Z0-9._ \t]` characters allowed |

### Response

| Response Status | Response Meaning |
|-|-|
| 201 | Successful signup request, account created, redirects to https://localhost/login |
| 400 | Unsuccessful signup request, request parameters does not conform to format above |
| 405 | Unsuccessful signup request, request did not use `POST` method |
| 500 | Unsuccessful signup request, internal server issue (likely due to error in mysql connection) |