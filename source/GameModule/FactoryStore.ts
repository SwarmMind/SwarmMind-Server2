import MapObject from './MapObject';
import MapObjectStore from './MapObjectStore';
import NPC from './NPC';
import Player from './Player';

import { Circle } from 'flatten-js';


export default class FactoryStore {
    private _mapObjects: MapObjectStore = new MapObjectStore();

    private mapObjectCounter: number;

    constructor(){
        this.mapObjectCounter = 0;
    }

    public get players() {
        return this._mapObjects.players;
    }

    public get npcs() {
        return this._mapObjects.npcs;
    }

    public get mapObjects() {
        return this._mapObjects.mapObjects;
    }

    /**
     * getObjectByID
     */
    public getObjectByID(ID: number): MapObject {
        return this._mapObjects.getByID(ID);
    }

    private createMapObject(x: number, y: number, mapObjectClass, addFunctionName: string, representationCreator) {
        const mapObject = new mapObjectClass(this.mapObjectCounter, x, y, representationCreator);
        this.mapObjectCounter++;
        this._mapObjects[addFunctionName](mapObject);
        return mapObject;
    }

    /**
     * createNPC
     */
    public createNPC(x: number, y: number, representationCreator): NPC {
        return this.createMapObject(x, y, NPC, 'addNPC', representationCreator);
    }

    /**
     * createUnit
     */
    public createPlayer(x: number, y: number, representationCreator): Player {
        return this.createMapObject(x, y, Player, 'addPlayer', representationCreator);
    }

    /**
     * removeObject
     */
    public removeObject(ID: number) {       // quick and dirty
        this._mapObjects.remove(ID);
    }
}
