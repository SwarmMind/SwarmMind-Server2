import MapObject from './MapObject';
import NPC from './NPC';
import Player from './Player';


export default class MapObjectStore {
    private objects: Map<number, MapObject>;
    private _players: Set<Player>;
    private _npcs: Set<NPC>;

    constructor() {
        this._npcs = new Set();
        this._players = new Set();
        this.objects = new Map();
    }

    public get players() {
        return Array.from(this._players);
    }

    public get npcs() {
        return Array.from(this._npcs);
    }

    public get mapObjects() {
        return Array.from(this.objects.values());
    }

    public addPlayer(player: Player) {
        this.addTo(this._players, player);
    }

    public addNPC(npc: NPC) {
        this.addTo(this._npcs, npc);
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

    public remove(ID: number) {
        const mapObject = this.getByID(ID);

        if (mapObject.isPlayer()) {
            this.removePlayer(mapObject);
        } else {
            this.removeNPC(mapObject);
        }
    }

    public getByID(ID: number): MapObject {     // returning null if ID not found and not undefined
        return this.objects.get(ID) || null;
    }

    private addTo(set: Set<MapObject>, mapObject: MapObject) {
        set.add(mapObject);
        this.objects.set(mapObject.ID, mapObject);
    }
}
