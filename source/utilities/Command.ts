import { Vector } from 'flatten-js';
import Game from '../GameModule/Game';

export default abstract class Command {
    private _mapObjectID: number;
    protected _direction: Vector;
    protected _type: string;

    constructor(mapObjectID: number, direction: Vector) {
        this._mapObjectID = mapObjectID;
        this._direction = direction;

        this._type = 'abstractCommand';
    }

    public get mapObjectID() {
        return this._mapObjectID;
    }

    public get type() {
        return this._type;
    }

    protected equalsFunctionGenerator(propertyList: string[]) {
        return function(otherCommand: Command): boolean {
            for (const key in ['mapObjectID', 'type', 'direction'].concat(propertyList)) {
                if (otherCommand[key] !== this[key]) {
                    return false;
                }
            }

            return true;
        };
    }

    public serialize() {
        return {ID: this.mapObjectID, type: this.type};
    }

    public execute(game: Game) {
    }


    public get direction() {
        return this._direction;
    }
}
