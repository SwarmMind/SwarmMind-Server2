import app = require('express');
import http = require('http');
import sio = require('socket.io');

import NPC from '../GameModule/NPC';
import Player from '../GameModule/Player';
import CommandBuilder from '../utilities/CommandBuilder';
import Command from './../utilities/Command';
import Connection from './Connection';
import Overmind from './Overmind';
import UserManager from './UserManager';


export default class CallCenter {
    private overmind: Overmind;
    private sockets: sio.Socket[];
    private connections: Array<Connection>;

    constructor(overmind: Overmind, port = 3000) {
        this.overmind = overmind;
        this.connections = [];
        this.sockets = [];

        const server = http.createServer(app);    // Made APP to a function (thats how its used in the chat example)
        const io = sio(server);

        io.on('connection', (socket: sio.Socket) => {
            console.log('A client connected');

            const user = UserManager.registerNewUser();
            const connection = new Connection(socket, user);

            const initState = this.serializeObject(this.overmind.initState); // TODO: maybe change this later
            socket.emit('initState', initState);

            socket.on('command', (unitID, type, direction) => {
                console.log('New command: Unit #' + unitID + ' has to ' + type + ' in direction ' + direction);

                this.overmind.takeCommand(CommandBuilder.build(type, unitID, direction), user);
            });

            socket.on('disconnect', () => {
                console.log('A client disconnected');

                UserManager.removeUser(user);    // Later on we should store inactive users,
                                                        // so that they have a chance to reconnect
                                                        // and can be shown on the leaderboards as well
                this.connections.splice(this.connections.indexOf(connection), 1);
            });
        });

        server.listen(port, () => {
            console.log(`listening on Port: ${port}`);
        });
    }

    /**
     * sends game-state to all clients
     */
    public sendNewRoundInformations(state) {
        const roundInformations = this.serializeObject(Object.assign(state));

        this.connectionsDo((connection) => connection.socket.emit('state', roundInformations));
    }

    public sendAccumulatedCommands(playerCommandMap: object) {
        const playerCommandMapSerialized = this.serializeObject(playerCommandMap);
        console.log(playerCommandMapSerialized);
        this.connectionsDo((connection) => connection.socket.emit('accumulatedCommands', playerCommandMapSerialized));
    }

    public informGameOver() {
        this.connectionsDo((connection) => connection.socket.emit('gameOver'));

        console.log('Game over');
    }

    private connectionsDo(fn: (connection: Connection) => void) {
        this.connections.forEach(fn);
    }

    private serializeObject(object: any) {
        return JSON.stringify(object);
    }
}
