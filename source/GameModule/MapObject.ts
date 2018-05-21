export default class MapObject {
    constructor(private _ID: string, private _x: number, private _y: number) {
    }

    public get ID(): string {
        return this._ID;
    }

    public isNPC(): boolean {
        return false;
    }

    public isPlayer(): boolean {
        return false;
    }

    public serialize() {
        return {ID: this.ID, x: this._x, y: this._y};
    }
}
