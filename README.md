API Routes
====================

### Check stall door

**GET:**
```
/current
```

**Response:**
```json
[
    {
        "_id": "54e658d1d0fddf17af1ed676",
        "date": "2015-02-19T15:42:41.000Z",
        "is_open": true
    }
]
```

**Status Codes:**
* `200` is successful
* `403` if no API key provided


### Register for GCM notification

**POST:**
```
/gcm
```

**Body:**
```json
{
    "token": "asdfasdfasdfasdf"
}
```

**Response: 201**
```json
{
    "__v": 0,
    "token": "asdfasdfasdfasdf",
    "_id": "54e68e9802aa03381f9d4054"
}
```


### Remove GCM notification

**DELETE:**
```
/gcm/:_id
```

**Response: 204**
