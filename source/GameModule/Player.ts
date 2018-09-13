import MapObject from './MapObject';
import { playerData } from '../utilities/MapObjectData';


export default class Player extends MapObject {
    protected _shootingRays: number;
    protected _rayAngle: number;
    protected _damagePerRay: number;
    protected _maxShootDistance: number;

    protected get statsObject(){
        return playerData;
    }

    public isPlayer() {
        return true;
    }

    public isInAttackRange(mapObject: MapObject) {
        return true;
    }

    public isTarget(mapObject: MapObject) {
        return mapObject.isNPC();
    }

    public get shootingRays(): number {
        return this._shootingRays;
    }

    public get rayAngle(): number {
        return this._rayAngle;
    }

    public get damagePerRay(): number {
        return this._damagePerRay;
    }

    public get maxShootDistance(): number {
        return this._maxShootDistance;
    }
}
