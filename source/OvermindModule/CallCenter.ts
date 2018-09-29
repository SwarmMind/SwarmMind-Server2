import app = require('express');
import http = require('http');
import sio = require('socket.io');

import CommandBuilder from '../utilities/CommandBuilder';
import Connection from './Connection';
import Overmind from './Overmind';
import UserManager from './UserManager';


export default class CallCenter {
    private overmind: Overmind;
    private connections: Connection[];

    constructor(overmind: Overmind, port = 3000) {
        this.overmind = overmind;
        this.connections = [];

        const server = http.createServer(app);
        const io = sio(server);

        io.on('connection', (socket: sio.Socket) => {
            console.log('A client connected');

            const user = UserManager.registerNewUser();
            const connection = new Connection(socket, user);
            this.connections.push(connection);

            connection.send('initState', this.overmind.initState);
            this.sendAccumulatedCommands();

            socket.on('command', (unitID, type, direction) => {
                const command = CommandBuilder.build(type, parseInt(unitID, 10), JSON.parse(direction));

                this.overmind.takeCommand(command, user);
            });

            socket.on('chat', (userName, text, position) => {
                this.connectionsDo((con) => {
                    if(con !== connection) {
                        con.send('chat',{userName, text, position});
                    }
                });
            });

            socket.on('disconnect', () => {
                console.log('A client disconnected');

                UserManager.removeUser(user);
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

    public get userCount(){
        return UserManager.userCount;
    }

    private connectionsDo(fn: (connection: Connection) => void) {
        this.connections.forEach(fn);
    }
}
