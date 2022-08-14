## Create Expense API Documentation

### Request

`POST https://localhost/api/[id]/expense/create`

#### Header Parameters

| Parameter Type | Requirements |
|----------------|--------------|
| Cookie | Must have a authorised an JWT token under cookie name `token` |

#### Query Parameters

| Parameter Type | Requirements |
|----------------|--------------|
| id | UUID of the user, only regex `[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}` format allowed |

#### Body Parameters

| Parameter Type | Requirements |
|----------------|--------------|
| accountID | UUID of user, required, only regex `[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}` format allowed |
| expenseName | Name of expense to be created, required, max length of 255 characters, only regex `[[a-zA-Z0-9._ \t]` characters allowed |
| amount | Amount of expense to be created, required, max of up to 2 decimal places and 65 digits |
| date | Date of todo to be created, required, date must exist and be in `YYYY-MM-DD` format |

### Response

| Response Status | Response Meaning |
|-|-|
| 201 | Successful create expense request |
| 400 | Unsuccessful request, request parameters does not fit requirements above |
| 401 | Unsuccessful request, JWT token invalid |
| 403 | Unsuccessful request, not authorised to create todos under another user |
| 405 | Unsuccessful request, request did not use `POST` method |
| 409 | Unsuccessful request, too many expenses created for specified user in that month |
| 429 | Unsuccessful request, too many requests from IP, thus rate limited |
| 500 | Unsuccessful request, internal server issue (likely due to error in mysql connection) |