import Game from '../GameModule/Game';
import Command from './Command';

export default class DieCommand extends Command {
    constructor(mapObjectID: number) {
        super(mapObjectID);

        this._type = 'die';
    }

    protected executionFunction(game: Game) {
        game.killMapObject(this.mapObjectID);
    }
}
