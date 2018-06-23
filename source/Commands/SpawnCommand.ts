import Command from './Command';
import Game from '../GameModule/Game';

export default class SpawnCommand extends Command {
    constructor(mapObjectID: number) {
        super(mapObjectID);

        this._type = 'spawn';
    }

    protected executionFunction(game: Game) {}
}