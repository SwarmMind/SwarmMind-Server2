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
    private userManager: UserManager;


    constructor(overmind: Overmind, port = 3000) {
        this.overmind = overmind;
        this.userManager = new UserManager();
        this.connections = [];

        const server = http.createServer(app);
        const io = sio(server);

        io.on('connection', (socket: sio.Socket) => {
            console.log('A client connected');

            const user = this.userManager.registerNewUser();
            const connection = new Connection(socket, user);
            this.connections.push(connection);

            // synchronize the new joined client with the current gamestate
            connection.send('initState', this.overmind.initState);
            this.sendAccumulatedCommands();

            // handle messages from the client
            this.receiveCommands(socket, user);
            this.processChatMessages(socket, connection);
            this.handleDisconnect(socket, user, connection);
        });

        server.listen(port, () => {
            console.log(`listening on Port: ${port}`);
        });
    }

    receiveCommands(socket, user){
        socket.on('command', (unitID, type, direction) => {
            const command = CommandBuilder.build(type, parseInt(unitID, 10), JSON.parse(direction));

            this.overmind.takeCommand(command, user);
        });
    }

    processChatMessages(socket, currentConnection: Connection){
        socket.on('chat', (userName, text, position) => {
            this.connectionsDo((con) => {
                if(con !== currentConnection) {
                    con.send('chat',{userName, text, position});
                }
            });
        });
    }

    handleDisconnect(socket, user, connection){
        socket.on('disconnect', () => {
            console.log('A client disconnected');

            this.userManager.removeUser(user);
            this.connections.splice(this.connections.indexOf(connection), 1);
        });
    }

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
        return this.userManager.userCount;
    }

    public get connectedUsers(){
        return this.userManager.users;
    }

    public resetUserCommandInformations(){
        this.userManager.clearAllUserCommands();
        this.sendAccumulatedCommands();         // reset command indicators for client
    }

    private connectionsDo(fn: (connection: Connection) => void) {
        this.connections.forEach(fn);
    }
}
