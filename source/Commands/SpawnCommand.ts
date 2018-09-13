import Command from './Command';
import Game from '../GameModule/Game';
import MapObject from '../GameModule/MapObject';

export default class SpawnCommand extends Command {
    constructor(private mapObject: MapObject) {
        super(mapObject.ID);

        this.mapObject = mapObject;

        this._type = 'spawn';
    }

    protected executionFunction(game: Game) {}

    public serialize() {
        return Object.assign(super.serialize(),
            {isPlayer: this.mapObject.isPlayer(), position: this.mapObject.position});
    }
}