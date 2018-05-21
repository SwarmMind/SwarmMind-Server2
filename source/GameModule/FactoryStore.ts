import MapObject from './MapObject';
import MapObjectStore from './MapObjectStore';
import NPC from './NPC';
import Player from './Player';

export default class FactoryStore {
    private mapObjects: MapObjectStore = new MapObjectStore();

    private playerCounter: number;
    private npcCounter: number;

    public get players() {
        return this.mapObjects.players;
    }

    public get npcs() {
        return this.mapObjects.npcs;
    }

    /**
     * getObjectByID
     */
    public getObjectByID(ID: string): MapObject {
        return this.mapObjects.getByID(ID);
    }

    /**
     * createNPC
     */
    public createNPC(positionX: number, positionY: number): NPC {
        const npc = new NPC(`npc${this.npcCounter}`, positionX, positionY);
        this.npcCounter++;
        this.mapObjects.addNPC(npc);
        return npc;
    }

    /**
     * createUnit
     */
    public createPlayer(positionX: number, positionY: number): Player {
        const player = new Player(`player${this.playerCounter}`, positionX, positionY);
        this.playerCounter++;
        this.mapObjects.addPlayer(player);
        return player;
    }

    /**
     * removeObject
     */
    public removeObject(ID: string) {       // quick and dirty
        this.mapObjects.remove(ID);
    }
}
