import { Vector } from 'flatten-js';
import Game from '../GameModule/Game';
import DirectedCommand from './DirectedCommand';

export default class AttackCommand extends DirectedCommand {
    constructor(mapObjectID: number, direction: Vector) {
        super(mapObjectID, direction);

        this._type = 'attack';
    }

    protected executionFunction(game: Game) {
        return game.attackInDirection(this.mapObjectID, this.direction);
    }
}
