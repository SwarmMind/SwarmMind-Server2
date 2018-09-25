import Flatten from 'flatten-js';
import Game from './Game';


export default abstract class MapObject {
    private _position: Flatten.Point;

    protected _movementRange: number;
    protected _attackStrength: number;
    protected _attackRange: number;
    protected _hitpoints: number;

    constructor(private _ID: number, private x: number, private y: number, private _mapRepresentationCreator) {
        this._position = new Flatten.Point(x, y);

        this.importStats(this.statsObject);
    }

    protected get statsObject(){
        return {};
    }

    private importStats(statsObject) {
        for(const key in statsObject) {
            this[`_${key}`] = statsObject[key];
        }
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

    public isBlockade(): boolean {
        return false;
    }

    public serialize() {
        return {ID: this.ID, x: this._position.x, y: this._position.y};
    }

    public get mapRepresentation() {
        return this._mapRepresentationCreator(this.position);
    }

    public simulateRepresentationAfterMoving(direction: Flatten.Vector, range: number){
        return this._mapRepresentationCreator(this.position.translate(direction.multiply(this.movementRange * range)));
    }

    public set position(value: Flatten.Point) {
        this._position.x = value.x;
        this._position.y = value.y;
    }

    public get position(): Flatten.Point {
        return this._position;
    }

    public get movementRange() {
        return this._movementRange;
    }

    public moveIn(direction: Flatten.Vector) {
        this.position = this.position.translate(direction.multiply(this.movementRange));
    }

    public distanceTo(mapObject: MapObject): number {   // distanceTo returns an Array
        return this.position.distanceTo(mapObject.position)[0];
    }

    public receiveDamage(amount: number) {
        this._hitpoints -= amount;
    }

    public attack(mapObject: MapObject) {
        mapObject.receiveDamage(this._attackStrength);
    }

    public isInAttackRange(mapObject: MapObject): boolean {
        return false;
    }

    public isTarget(mapObject: MapObject) {
        return false;
    }

    public isDead() {
        return this._hitpoints <= 0;
    }

    static spawnIn(game: Game, x, y){}
}
