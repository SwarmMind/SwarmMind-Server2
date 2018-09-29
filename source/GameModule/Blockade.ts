import { blockadeData } from '../utilities/MapObjectData';
import MapObject from './MapObject';

export default class Blockade extends MapObject {
    protected get statsObject() {
        return blockadeData;
    }

    public isBlockade(): boolean {
        return true;
    }

    public isTarget(mapObject: MapObject) {
        return true;
    }

    public receiveDamage(amount: number) {}
}
