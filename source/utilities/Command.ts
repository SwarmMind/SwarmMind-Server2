import { Vector } from 'flatten-js';
import Game from '../GameModule/Game';
import AttackCommand from './AttackCommand';
import MoveCommand from './MoveCommand';

export default abstract class Command {
    static commandTypeList = new Map([
        ['attack', AttackCommand],
        ['move', MoveCommand],
    ]);

    private _mapObjectID: number;
    protected _direction: Vector;
    protected _type: string;


    static build(type, ...constructorArguments) {
        return new Command.commandTypeList[type](...constructorArguments);
    }

    static get types(): string[] {
        return Array.from(Command.commandTypeList.keys());
    }

    constructor(mapObjectID: number, direction: Vector) {
        this._mapObjectID = mapObjectID;
        this._direction = direction.normalize();
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
        return {mapObjectID: this.mapObjectID, type: this.type};
    }

    public execute(game: Game) {
    }


    public get direction() {
        return this._direction;
    }
}
