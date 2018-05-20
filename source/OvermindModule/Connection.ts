import SIO = require('socket.io');

export default class Connection {
    private socket: SIO.Socket;
    private userID: number;

    constructor(socket, userID) {
        this.socket = socket;
        this.userID = userID;
    }

    public getSocket(): SIO.Socket {
        return this.socket;
    }

    public getUserID(): number {
        return this.userID;
    }
}
