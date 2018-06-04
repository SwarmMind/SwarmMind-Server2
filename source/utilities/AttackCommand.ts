import { Vector } from 'flatten-js';
import Game from '../GameModule/Game';
import Command from './Command';

export default class AttackCommand extends Command {
    private _targetID: number;

    constructor(mapObjectID: number, direction: Vector) {
        super(mapObjectID, direction);

        this._type = 'attack';
    }

    public get targetID(): number {
        return this._targetID;
    }

    public equals(otherCommand: Command): boolean {
        return super.equalsFunctionGenerator([])(otherCommand);
    }

    public serialize() {
        return Object.assign(super.serialize(), {target: this.targetID});
    }

    public execute(game: Game) {
        game.attackInDirection(this.mapObjectID, this.direction);
    }
}
