import { npcData } from '../utilities/MapObjectData';
import MapObject from './MapObject';


export default class NPC extends MapObject {
    protected get statsObject() {
        return npcData;
    }

    public isNPC() {
        return true;
    }

    public isInAttackRange(mapObject: MapObject) {
        return this.distanceTo(mapObject) < this._attackRange;
    }

    public isTarget(mapObject: MapObject) {
        return mapObject.isPlayer();
    }
}
