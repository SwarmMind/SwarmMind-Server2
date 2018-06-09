import Command from './Command';
import Game from '../GameModule/Game';

export default class DieCommand extends Command{
    protected executionFunction(game: Game){
        game.killMapObject(this.mapObjectID);
    }
}