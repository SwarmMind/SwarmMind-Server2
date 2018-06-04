import MapObject from './MapObject';
import MapObjectStore from './MapObjectStore';
import NPC from './NPC';
import Player from './Player';

import { Circle } from 'flatten-js';


export default class FactoryStore {
    private mapObjects: MapObjectStore = new MapObjectStore();

    private mapObjectCounter: number;

    public get players() {
        return this.mapObjects.players;
    }

    public get npcs() {
        return this.mapObjects.npcs;
    }

    /**
     * getObjectByID
     */
    public getObjectByID(ID: number): MapObject {
        return this.mapObjects.getByID(ID);
    }

    private createMapObject(x: number, y: number, mapObjectClass, addFunctionName: string, representationCreator) {
        const mapObject = new mapObjectClass(this.mapObjectCounter, x, y, representationCreator);
        this.mapObjectCounter++;
        this.mapObjects[addFunctionName](mapObject);
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
        this.mapObjects.remove(ID);
    }
}
