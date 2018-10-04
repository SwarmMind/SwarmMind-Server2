import { npcData } from '../utilities/MapObjectData';
import Game from './Game';
import MapObject from './MapObject';


export default class NPC extends MapObject {
    protected get statsObject() {
        return npcData;
    }

    static spawnIn(game: Game, x, y) {
        game.addNPC(x, y);
    }

    public isNPC(): boolean {
        return true;
    }

    public isInAttackRange(mapObject: MapObject): boolean {
        return this.distanceTo(mapObject) < this._attackRange;
    }

    public isTarget(mapObject: MapObject): boolean {
        return mapObject.isPlayer() || mapObject.isBlockade();
    }
}
