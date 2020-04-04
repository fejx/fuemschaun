# Fümschaun protocol

Socket data transmission is done using [socket.io](socket.io).

## New Session

Automatically created on connect if no joinid is provided.

On succesfull creation `created`-event with the new session id is fired.
Example body:

```json
{ sessionId: "xxxx-243254-xxxx" }
```

## Join Session

A request parameter has to be provided with the id as value.

Example request:
```
url:port?joinid=xxxx-243254-xxxx&username=asdf
```

Upon succesfull join a `joined`-event is fired with the username in body.

Example body:
```json
{ name: "Fritz Phantom" }
```

## Leave Session

Using default `disconnect`-event from socket.io.

Remaining room participants receive `leave`-event with username of the user who is leaving
Example body:
```json
{ name: "Fritz Phantom" }
```

## Change username

Event name: `set-name`
Example body:
```json
{ name: "Fritz Phantom" }
```

## Play/Pause event

Event name: `playback-status`
Example body:
```json
{ playing: true }
```

## Playback position jump

Event name: `playback-position`
Example body:
```json
{ position: 3421 }
```
Description: Updates the playback position for all clients.

## Buffering

Event name: `buffering`
Example body:
```json
{ buffering: true }
```

## Optional Part

### Subtitle / Language change
