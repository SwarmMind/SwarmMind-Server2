import MapObject from './MapObject';
import { playerData } from '../utilities/MapObjectData';


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

    public isTarget(mapObject: MapObject) {
        return mapObject.isNPC();
    }
}
