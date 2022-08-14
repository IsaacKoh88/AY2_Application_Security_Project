## Delete Categories API Documentation

### Request

`POST https://localhost/api/[id]/category/delete`

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
| categoryID | UUID of the existing category, required, only regex `[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}` format allowed |

### Response

| Response Status | Response Meaning |
|-|-|
| 200 | Successful delete categories request |
| 400 | Unsuccessful request, request parameters does not fit requirements above |
| 401 | Unsuccessful request, JWT token invalid |
| 403 | Unsuccessful request, not authorised to delete category controlled by another user |
| 405 | Unsuccessful request, request did not use `POST` method |
| 429 | Unsuccessful request, too many requests from IP, thus rate limited |
| 500 | Unsuccessful request, internal server issue (likely due to error in mysql connection) |