import Flatten from 'flatten-js';
import Game from '../GameModule/Game';
import DirectedCommand from './DirectedCommand';

export default class MoveCommand extends DirectedCommand {
    private executedMovement: Flatten.Vector;

    constructor(mapObjectID: number, direction: Flatten.Vector) {
        super(mapObjectID, direction);

        this._type = 'move';
    }

    protected executionFunction(game: Game) {
        this._direction = game.moveMapObject(this.mapObjectID, this.direction);
        // this.executedMovement = game.moveMapObject(this.mapObjectID, this.direction); // TODO change this
    }

    serialize() {
        return Object.assign(super.serialize(), {executedMovement: this.executedMovement});
    }
}
