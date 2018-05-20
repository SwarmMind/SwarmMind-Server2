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
    private sockets: sio.Socket[] = [];
    private connections: Array<Connection>;

    constructor(overmind: Overmind, port = 3000) {
        this.overmind = overmind;
        this.connections = [];

        const server = http.createServer(app);    // Made APP to a function (thats how its used in the chat example)
        const io = sio(server);

        io.on('connection', (socket: sio.Socket) => {
            console.log('A client connected');

            const userID = this.userManager.registerNewUser();
            const connection = new Connection(socket, userID);
            this.connections.push(connection);

            const initState = this.serializeObject(/*this.overmind.getInitState()*/42); // TODO: correction
            socket.emit('initState', initState);

            socket.on('command', (unitID, type, direction) => {
                console.log('New command: Unit #' + unitID + ' has to ' + type + ' in direction ' + direction);

                const command = new Command(unitID, type, direction);
                this.overmind.takeCommand(command, userID);
            });

            socket.on('disconnect', () => {
                console.log('A client disconnected');

                this.userManager.removeUser(userID);    // Later on we should store inactive users,
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

        for (const connection of this.connections) {
            const socket = connection.getSocket();
            socket.emit('state', stateAsJSON);
        }
    }

    public informGameOver() {
        for (const connection of this.connections) {
            const socket = connection.getSocket();
            socket.emit('gameOver');
        }
        console.log('Game over');
    }

    private serializeObject(object: any) {
        return JSON.stringify(object);
    }
}
