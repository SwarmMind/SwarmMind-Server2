# SwarmMind-Server
The Server for the SwarmMind game.

## Getting Started
Clone the repository and run an `npm install`. After cloning you go to the file node_modules/flatten-js/index.js and change the last line in the file from ```module.exports = f``` to ```module.exports.default = f```. Then you can build with `npm run build` and start with `npm run start`.

## Exchange format
The server communicates with the client via `socket.io` events.

### Commands
Besides the `connect` and `disconnect` events, we provide a listener on the `command` event. This event needs 3 arguments. `unitID`, which has to be the ID of the unit that should receive the command, `type`, which has to be either `move` or `shoot` and `direction`, which has to be `north`, `south`, `west` or `east`.

### State
After each processed round the server sends the new state, using a `state` event, containing the new roundID, to every client.

The format of the state (as `JSON`) looks like the following:

```json
{
    "round": 42,
    "players": [
        {
            "ID": 0,
            "x": 1,
            "y": 3
        },
        ...
        {
            "ID": x,
            "x": 3,
            "y": 7
        },
        ...
    ],
    "npcs": [
        {
            "ID": 0,
            "x": 3,
            "y": 7
        },
        ...
    ],
    "commands": [
        {
            "type": "shoot",
            "direction": {
                x: 1,
                y: 1
            },
            "ID": 0
        },
        ...
    ]
}
```

As you can see, the `JSON` object contains a member `roundID`, which holds a number and a member `mapObjects`, which holds an array of object. Each of them has a member `ID`, which contains a string, that is either `unit` or `npc`, followed by a number that, identifies the unit or the NPC. Also each of them has the members `posX`and `posY`, with the exact current location of the object on the grid.

When a client connects, the server sends him an `initState` event. The `initState` contains the current game state and has the following structure, where `state` holds an state object with the exact same structure as the `JSON`above and `config` holds an object with the configuration. At the moment `config` only holds the members `sizeX` and `sizeY`, where the size of the grid is stored.

```json
{
    "state": {
        ...
    },

    "config": {
        "width": 73,
        "height": 42,
        ...
    }
}
```

### Game Over
If the game is over (because all units have been killed), the server sends an `gameOver` event without any arguments.
