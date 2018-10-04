import Blockade from './Blockade';
import MapObject from './MapObject';
import NPC from './NPC';
import Player from './Player';


export default class MapObjectStore {
    private objects: Map<number, MapObject>;
    private _players: Set<Player>;
    private _npcs: Set<NPC>;
    private _blockades: Set<Blockade>;

    constructor() {
        this._npcs = new Set();
        this._players = new Set();
        this._blockades = new Set();
        this.objects = new Map();
    }

    public get players(): Player[] {
        return Array.from(this._players);
    }

    public get npcs(): NPC[] {
        return Array.from(this._npcs);
    }

    public get blockades(): Blockade[] {
        return Array.from(this._blockades);
    }

    public get mapObjects(): MapObject[] {
        return Array.from(this.objects.values());
    }

    public addPlayer(player: Player) {
        this.addTo(this._players, player);
    }

    public addNPC(npc: NPC) {
        this.addTo(this._npcs, npc);
    }

    public addBlockade(npc: NPC) {
        this.addTo(this._blockades, npc);
    }

    private removeFrom(set: Set<MapObject>, mapObject: MapObject) {
        set.delete(mapObject);
        this.objects.delete(mapObject.ID);
    }

    public removePlayer(player: Player) {
        this.removeFrom(this._players, player);
    }

    public removeNPC(npc: NPC) {
        this.removeFrom(this._npcs, npc);
    }

    public removeBlockade(blockade: Blockade) {
        this.removeFrom(this._blockades, blockade);
    }

    public remove(ID: number) {
        const mapObject = this.getByID(ID);

        if (mapObject.isPlayer()) {
            this.removePlayer(mapObject as Player);
        }
        else if(mapObject.isBlockade()) {
            this.removeBlockade(mapObject as Blockade);
        }
        else {
            this.removeNPC(mapObject as NPC);
        }
    }

    public getByID(ID: number): MapObject | null {     // returns null if ID not found and not undefined
        return this.objects.get(ID) || null;
    }

    private addTo(set: Set<MapObject>, mapObject: MapObject) {
        set.add(mapObject);
        this.objects.set(mapObject.ID, mapObject);
    }
}
