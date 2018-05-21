import FactoryStore from './FactoryStore';
import World from './World';

export default class Game {
    private world: World;
    private store: FactoryStore;

    private _round: number;

    public get round() {
        return this.round;
    }

    public get state() {
        return {
            players: this.store.players,
            npcs: this.store.npcs,
        };
    }

    public start(width, height) {
        this._round = 0;
        this.world = new World(width, height);
    }

    public newRound() {
        this._round++;
    }
}
