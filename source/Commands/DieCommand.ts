import Command from './Command';
import Game from '../GameModule/Game';

export default class DieCommand extends Command{
    constructor(mapObjectID: number) {
        super(mapObjectID);

        this._type = 'die';
    }

    protected executionFunction(game: Game){
        game.killMapObject(this.mapObjectID);
    }
}