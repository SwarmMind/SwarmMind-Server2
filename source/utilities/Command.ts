import * as assert from 'assert';

export default class Command {

    private _playerID: string;
    private _direction: string;
    private _type: string;

    constructor(playerID: string, type: string, direction: string) {
        assert(['move', 'shoot'].includes(type));
        assert(['north', 'south', 'east', 'west'].includes(direction));

        this._playerID = playerID;
        this._type = type;
        this._direction = direction;
    }

    public get playerID() {
        return this._playerID;
    }

    public get direction() {
        return this._direction;
    }

    public get type() {
        return this._type;
    }

    public equals(otherCommand: Command) {
        if (otherCommand.playerID !== this.playerID) {
            return false;
        }
        if (otherCommand.type !== this.type) {
            return false;
        }
        if (otherCommand.direction !== this.direction) {
            return false;
        }

        return true;
    }
}
