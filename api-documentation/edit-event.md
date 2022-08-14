
## Edit Events API Documentation

### Request

`POST https://localhost/api/[id]/events/edit`

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
| eventID | UUID of the existing event, required, only regex `[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}` format allowed |
| eventName | Name of event to be changed to, required, max length of 255 characters, only regex `[[a-zA-Z0-9._ \t]` characters allowed |
| date | Date of event to be changed to, required, date must exist and be in `YYYY-MM-DD` format |
| startTime | Start time of event to be changed to, required, must be a valid time and be in `HH:MM:SS` format |
| endTime | End time of event to be changed to, required, must be a valid time and be in `HH:MM:SS` format, and must be later than startTime |
| description | Description of event to be changed to, required, max length of 65535 characters |
| categoryId | Category ID of event to be changed to, required, must be an existing category UUID under the user, either `''` or regex `[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}` accepted |

### Response

| Response Status | Response Meaning |
|-|-|
| 200 | Successful edit event request |
| 400 | Unsuccessful request, request parameters does not fit requirements above |
| 401 | Unsuccessful request, JWT token invalid |
| 403 | Unsuccessful request, not authorised to request change of event controlled by another user |
| 405 | Unsuccessful signup request, request did not use `POST` method |
| 429 | Unsuccessful signup request, too many requests from IP, thus rate limited |
| 500 | Unsuccessful signup request, internal server issue (likely due to error in mysql connection) |