import Blockade from './Blockade';
import MapObject from './MapObject';
import MapObjectStore from './MapObjectStore';
import NPC from './NPC';
import Player from './Player';


export default class FactoryStore {
    private _mapObjects: MapObjectStore;
    private mapObjectCounter: number;

    constructor() {
        this.mapObjectCounter = 0;
        this._mapObjects = new MapObjectStore();
    }

    public get players() {
        return this._mapObjects.players;
    }

    public get npcs() {
        return this._mapObjects.npcs;
    }

    public get blockades() {
        return this._mapObjects.blockades;
    }

    public get playerNumber(): number {
        return this.players.length;
    }

    public get npcNumber(): number {
        return this.players.length;
    }

    public get blockadesNumber(): number {
        return this.blockades.length;
    }

    public get mapObjects(): MapObject[] {
        return this._mapObjects.mapObjects;
    }

    public flush() {
        this.mapObjectCounter = 0;
        this._mapObjects = new MapObjectStore();
    }

    public getObjectByID(ID: number): MapObject | null {
        return this._mapObjects.getByID(ID);
    }

    private createMapObject(x: number, y: number, mapObjectClass, addFunction, representationCreator) {
        const mapObject = new mapObjectClass(this.mapObjectCounter, x, y, representationCreator);
        this.mapObjectCounter++;
        addFunction(mapObject);
        return mapObject;
    }

    public createNPC(x: number, y: number, representationCreator): NPC {
        return this.createMapObject(x, y, NPC, this._mapObjects.addNPC, representationCreator);
    }

    public createPlayer(x: number, y: number, representationCreator): Player {
        return this.createMapObject(x, y, Player, this._mapObjects.addPlayer, representationCreator);
    }

    public createBlockade(x: number, y: number, representationCreator): Blockade {
        return this.createMapObject(x, y, Blockade, this._mapObjects.addBlockade, representationCreator);
    }

    public removeObject(ID: number) {
        this._mapObjects.remove(ID);
    }
}
