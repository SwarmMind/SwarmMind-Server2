import MapObject from './MapObject';


export default class Player extends MapObject {
    public isPlayer() {
        return true;
    }

    public isInAttackRange(mapObject: MapObject) {
        return true;
    }
}
