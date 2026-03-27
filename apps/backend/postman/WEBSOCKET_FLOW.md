# AppChat WebSocket Flow (Postman)

Gateway namespace: `/chat`

## 1) Connect
- Open Postman -> New -> WebSocket Request
- URL: `{{wsBaseUrl}}/chat`
- Headers:
  - `Authorization: Bearer {{accessToken}}`
- Click Connect

## 2) Subscribe to a channel room
Send event:
- Event: `join_channel`
- Payload:
```json
{
  "channelId": "{{channelId}}"
}
```

Expected response:
```json
{
  "success": true
}
```

## 3) Send real-time message
Send event:
- Event: `send_message`
- Payload:
```json
{
  "channelId": "{{channelId}}",
  "content": "Hello from Postman WebSocket"
}
```

You should receive broadcast event:
- Event: `message:new`
- Payload: saved message object with `id`, `content`, `userId`, `channelId`, timestamps.

## 4) Leave channel room
Send event:
- Event: `leave_channel`
- Payload:
```json
{
  "channelId": "{{channelId}}"
}
```