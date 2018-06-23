import MapObject from './MapObject';
import { blockadeData } from '../utilities/MapObjectData';

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
}