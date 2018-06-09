import { Vector } from 'flatten-js';
import Game from '../GameModule/Game';
import DirectedCommand from './DirectedCommand';

export default class MoveCommand extends DirectedCommand {
    constructor(mapObjectID: number, direction: Vector) {
        super(mapObjectID, direction);

        this._type = 'move';
    }

    protected executionFunction(game: Game){
        game.moveMapObject(this.mapObjectID, this.direction);
    }
}
