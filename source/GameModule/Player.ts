import MapObject from './MapObject';
import { playerData } from '../utilities/MapObjectData';
import Game from './Game';


export default class Player extends MapObject {
    protected get statsObject(){
        return playerData;
    }

    public isPlayer() {
        return true;
    }

    public isInAttackRange(mapObject: MapObject) {
        return true;
    }

    static spawnIn(game: Game, x, y){
        game.addPlayer(x, y);
    }
}
