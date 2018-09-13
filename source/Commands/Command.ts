import Game from '../GameModule/Game';

export default abstract class Command {
    private readonly _mapObjectID: number;
    private implication: Command;
    private implications: Array<Command>;
    protected _type: string;

    constructor(mapObjectID: number) {
        this._mapObjectID = mapObjectID;

        // this.implication  = null;
        this.implications = [];

        this._type = 'abstractCommand';
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
        // this.implication = implication;
        this.implications.push(implication);
    }

    protected executionFunction(game: Game): void | Command | Array<Command> {}

    public calculateDifference(command: Command): number { return 0; }

    public execute(game: Game) {
        const implication = this.executionFunction(game);

        if(implication) {
            if (implication instanceof Array) {
                this.implications = this.implications.concat(implication);
            } else {
                this.implications.push(implication);
            }
            for (const imp of this.implications) {
                imp.execute(game);
            }
            // this.implication = implication;
            // this.implication.execute(game);
        }
    }

    public applyWeight(weight: number) {}

    *[Symbol.iterator]() {
        yield this;
        /*if(this.implication !== null) {
            yield* this.implication;
        }*/
        for (const implication of this.implications) {
            yield* implication;
        }
    }
}
