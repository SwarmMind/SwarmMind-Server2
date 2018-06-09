import { Circle, Point, Vector } from 'flatten-js';
import DieCommand from '../utilities/DieCommand';


export default class MapObject {
    private _mapRepresentationCreator: Circle;
    private _position: Point;

    protected _movementRange: number;
    protected _attackStrength: number;
    protected _attackRange: number;
    protected _hitpoints: number;

    constructor(private _ID: number, x: number, y: number, representationCreator) {
        this._position = new Point(x, y);
        this._mapRepresentationCreator = representationCreator;
        this._attackRange = 1;  // TODO adjust the range
        this._movementRange = 1;
        this._hitpoints = 1;
        this._attackStrength = 0;
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
        return this._mapRepresentationCreator(this.position);
    }

    public set position(value: Point) {
        this._position.x = value.x;
        this._position.y = value.y;
    }

    public get position(): Point {
        return this._position;
    }

    public get movementRange() {
        return this._movementRange;
    }

    /**
     *
     * @param {} direction
     */
    public moveIn(direction: Vector) {
        this.position = this.position.translate(direction.multiply(this.movementRange));
    }

    public distanceTo(mapObject: MapObject): number {   // distanceTo returns an Array
        return this.position.distanceTo(mapObject.position)[0];
    }

    public receiveDamage(amount: number){
        this._hitpoints -= amount;
    }

    public attack(mapObject: MapObject){
        mapObject.receiveDamage(this._attackStrength);
    }

    public isInAttackRange(mapObject: MapObject): boolean {
        return false;
    }

    public isTarget(mapObject: MapObject) {
        return false;
    }

    public isDead(){
        return this._hitpoints <= 0;
    }
}
