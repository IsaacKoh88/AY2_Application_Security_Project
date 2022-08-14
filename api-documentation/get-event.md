## Get Events API Documentation

### Request

`POST https://localhost/api/[id]/events/[date]`

#### Header Parameters

| Parameter Type | Requirements |
|----------------|--------------|
| Cookie | Must have a authorised an JWT token under cookie name `token` |

#### Query Parameters

| Parameter Type | Requirements |
|----------------|--------------|
| id | UUID of the user, only regex `[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}` format allowed |
| date | Date of events requested, date requested must exist and be in `YYYY-MM-DD` format required |

### Response

| Response Status | Response Meaning |
|-|-|
| 200 | Successful request, returns event data of queried user and date |
| 400 | Unsuccessful request, request parameters does not fit requirements above |
| 401 | Unsuccessful request, JWT token invalid |
| 403 | Unsuccessful request, not authorised to request data from another user |
| 405 | Unsuccessful signup request, request did not use `GET` method |
| 429 | Unsuccessful signup request, too many requests from IP, thus rate limited |
| 500 | Unsuccessful signup request, internal server issue (likely due to error in mysql connection) |

#### Successful response format 

```
{
    ID: string,
    Name: string,
    Color: string
}[]
```