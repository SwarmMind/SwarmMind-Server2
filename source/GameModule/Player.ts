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

    public isPlayer() {
        return true;
    }

    public isInAttackRange(mapObject: MapObject) {
        return true;
    }

    public isTarget() {
        return true;
    }
}
