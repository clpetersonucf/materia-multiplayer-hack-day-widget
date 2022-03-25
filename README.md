## Materia Multiplayer Widget

#### A UCF Hack Day Project

This widget is a proof-of-concept for using web sockets to facilitate multiplayer widgets.
Materia Widgets were never designed with multiplayer in mind; they are designed to be played individually, asynchronously,
at the convenience of the student. Therefore, shoe-horning multiplayer functionality into a widget proves a unique challenge.

The idea: make the widget playable solo, but also support opt-in multiplayer. Instead of a matchmaking system,
provide a unique "session ID" code that users can share with others, say, an instructor sharing a code with their class.

The actual content of the widget is a basic multiple choice quiz. Users must wait for all other players to answer a question before they receive feedback and
the widget advances to the next question for all players.

Currently, the widget includes:

- A playable multiple choice quiz for 1 or more players
- Players can share their session ID with other users to join a game concurrently

The widget does not include:

- A creator interface for customizing the widget content
- Scoring, or any sort of score module
- Support for players leaving or disconnecting
- Question feedback is rudimentary at best and players are not uniquely identified

Note that the widget must be paired with the Materia Multiplayer Server in order to work.

Messages _from_ the websocket server are formatted in the following way:
```
{
    message: 'message-type',
    payload: {
        key: value
    }
}
```
The server uses `message: 'game-status'` to communicate updates about the current game session. `message: 'client-status'` provide updates about clients (other players).

Messages _to_ the websocket server are formatted in the following way:
```
{
    session: 'session id',
    playerId: 'player id',
    action: 'action',
    payload: {
        key: value
    }
}
```
The `session`, `playerId`, and `action` values are required. `action` describes the action the widget performed and is providing an update for.

For more information about developing Materia widgets, be sure to consult the [Widget Developer Guide](https://ucfopen.github.io/Materia-Docs/develop/widget-developer-guide.html)

