import app = require('express');
import http = require('http');
import sio = require('socket.io');

import CommandBuilder from '../utilities/CommandBuilder';
import Connection from './Connection';
import Overmind from './Overmind';
import UserManager from './UserManager';


export default class CallCenter {
    private overmind: Overmind;
    private connections: Array<Connection>;

    constructor(overmind: Overmind, port = 3000) {
        this.overmind = overmind;
        this.connections = [];

        const server = http.createServer(app);    // Made APP to a function (thats how its used in the chat example)
        const io = sio(server);

        io.on('connection', (socket: sio.Socket) => {
            console.log('A client connected');

            const user = UserManager.registerNewUser();
            const connection = new Connection(socket, user);
            this.connections.push(connection);

            connection.send('initState', this.overmind.initState);
            this.sendAccumulatedCommands();

            socket.on('command', (unitID, type, direction) => {
                console.log('New command: Unit #' + unitID + ' has to ' + type + ' in direction ' + direction);

                this.overmind.takeCommand(CommandBuilder.build(type, parseInt(unitID), JSON.parse(direction)), user);
            });

            socket.on('chat', (userName, text, position) => {
                this.connectionsDo(function(con){
                    if(con != connection){
                        con.send('chat',{userName: userName, text: text, position: position});
                    }
                });
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
        this.connectionsDo((connection) => connection.send('state', state));
    }

    public sendAccumulatedCommands() {
        this.connectionsDo((connection) =>
            connection.send('accumulatedCommands', this.overmind.accumulatedCommands));
    }

    public informGameOver() {
        this.connectionsDo((connection) => connection.socket.emit('gameOver'));

        console.log('Game over');
    }

    private connectionsDo(fn: (connection: Connection) => void) {
        this.connections.forEach(fn);
    }
}
