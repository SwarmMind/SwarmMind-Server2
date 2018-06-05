import { Circle, Point, Vector } from 'flatten-js';


export default class MapObject {
    private _mapRepresentation: Circle;
    private _position: Point;

    protected _movementRange: number;
    protected _attackRange: number;
    protected _hitpoints;

    constructor(private _ID: number, x: number, y: number, representationCreator) {
        this._position = new Point(x, y);
        this._mapRepresentation = representationCreator(this._position);
        this._attackRange = 1;  // TODO adjust the range
        this._movementRange = 1;
        this._hitpoints = 1;
    }

    public get ID(): number {
        return this._ID;
    }

    public isNPC(): boolean {
        return false;
    }

    public isPlayer(): boolean {
        return false;
    }

    public serialize() {
        return {ID: this.ID, x: this._position.x, y: this._position.y};
    }

    public get mapRepresentation() {
        return this._mapRepresentation;
    }

    public set mapRepresentation(value: Circle) {
        this._mapRepresentation = value;
    }

    public set position(value: Point) {     // implicitly changes the position of the MapRepresentation too
        this._position = value;
    }

    public get position(): Point {
        return this._position;
    }

    public get movementRange() {
        return this._movementRange;
    }

    /**
     *
     * @param {} direction normalized Vector
     */
    public moveIn(direction: Vector) {
        this.position = this.position.transform(direction.multiply(this.movementRange));
    }

    public distanceTo(mapObject: MapObject): number {
        return this.position.distanceTo(mapObject.position);
    }

    public isInAttackRange(mapObject: MapObject): boolean {
        return false;
    }

    public isTarget(mapObject: MapObject) {
        return false;
    }
}
