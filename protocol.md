# Fümschaun protocol

Socket data transmission is done using [socket.io](socket.io).

## New Session

Http-GET-Request to `/session/new`
Returns session id for newly created session.

## Join Session

Open up socket connection to `/session/{session-id}`.

## Leave Session

Using default `disconnect`-event from socket.io.

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