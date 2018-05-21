import app = require('express');
import http = require('http');
import sio = require('socket.io');

import Command from './../utilities/Command';
import Connection from './Connection';
import Overmind from './Overmind';
import UserManager from './UserManager';

export default class CallCenter {
    private overmind: Overmind;
    private userManager: UserManager;
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

            const user = this.userManager.registerNewUser();
            const connection = new Connection(socket, user);
            this.connections.push(connection);

            const initState = this.serializeObject(/*this.overmind.getInitState()*/42); // TODO: correction
            socket.emit('initState', initState);

            socket.on('command', (unitID, type, direction) => {
                console.log('New command: Unit #' + unitID + ' has to ' + type + ' in direction ' + direction);

                this.overmind.takeCommand(new Command(unitID, type, direction), user);
            });

            socket.on('disconnect', () => {
                console.log('A client disconnected');

                this.userManager.removeUser(user);    // Later on we should store inactive users,
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
    public sendState(state: any) {
        const stateAsJSON = this.serializeObject(state);

        this.connectionsDo((connection) => connection.socket.emit('state', stateAsJSON));
    }

    public informGameOver() {
        this.connectionsDo((connection) => connection.socket.emit('gameOver'));

        console.log('Game over');
    }

    private connectionsDo(fn: (connection: Connection) => void) {
        for (const connection of this.connections) {
            fn(connection);
        }
    }

    private serializeObject(object: any) {
        return JSON.stringify(object);
    }
}
