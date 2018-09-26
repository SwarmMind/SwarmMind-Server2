import Game from '../GameModule/Game';

export default abstract class Command {
    private readonly _mapObjectID: number;
    private implication: Command;
    public weight: number;
    protected _type: string;

    constructor(mapObjectID: number) {
        this._mapObjectID = mapObjectID;

        this.implication  = null;

        this._type = 'abstractCommand';
        this.weight = 0;
    }

    public get mapObjectID() {
        return this._mapObjectID;
    }

    public get type() {
        return this._type;
    }

    public serialize() {
        return {ID: this.mapObjectID, type: this.type};
    }

    public implicate(implication: Command) {
        this.implication = implication;
    }

    protected executionFunction(game: Game): void | Command {}

    public calculateDifference(command: Command): number { return 0; }

    public execute(game: Game) {
        const implication = this.executionFunction(game);

        if(implication) {
            this.implication = implication;
            this.implication.execute(game);
        }
    }

    public applyWeight(weight: number) {}

    *[Symbol.iterator]() {
        yield this;
        if(this.implication !== null) {
            yield* this.implication;
        }
    }
}
