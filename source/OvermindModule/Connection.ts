import SIO = require('socket.io');
import User from './User';


export default class Connection {
    constructor(private _socket: SIO.Socket, private _user: User) {}

    public get socket(): SIO.Socket {
        return this._socket;
    }

    public get user(): User {
        return this._user;
    }

    public send(event: string, args) {
        this.socket.emit(event, this.serialize(args));
    }

    private serialize(data): string {
        return JSON.stringify(data);
    }
}
