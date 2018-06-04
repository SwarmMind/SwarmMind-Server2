import FactoryStore from './FactoryStore';
import MapObject from './MapObject';
import NPC from './NPC';
import Player from './Player';


export default class World {
    constructor(private _width: number, private _height: number) {
    }

    public get width() {
        return this._width;
    }

    public get height() {
        return this._height;
    }
}
