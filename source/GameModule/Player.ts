import { playerData } from '../utilities/MapObjectData';
import Game from './Game';
import MapObject from './MapObject';


export default class Player extends MapObject {
    protected get statsObject() {
        return playerData;
    }

    static spawnIn(game: Game, x, y) {
        game.addPlayer(x, y);
    }

    public isPlayer(): boolean {
        return true;
    }

    public isInAttackRange(mapObject: MapObject): boolean {
        return true;
    }

    public isTarget(): boolean {
        return true;
    }
}
