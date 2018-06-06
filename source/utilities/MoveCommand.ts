import { Vector } from 'flatten-js';
import Game from '../GameModule/Game';
import Command from './Command';

export default class MoveCommand extends Command {
    constructor(mapObjectID: number, direction: Vector) {
        super(mapObjectID, direction);

        this._type = 'move';
    }

    public equals(otherCommand: Command): boolean {
        return super.equalsFunctionGenerator([])(otherCommand);
    }

    public serialize() {
        return Object.assign(super.serialize(), {direction: this.direction});
    }

    public execute(game: Game) {
        game.moveMapObject(this.mapObjectID, this.direction);
    }
}
