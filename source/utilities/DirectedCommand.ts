import { Vector } from 'flatten-js';
import Command from './Command';

export default class DirectedCommand extends Command{
    protected _direction: Vector;

    constructor(mapObjectID: number, direction: Vector){
        super(mapObjectID);
        this._direction = direction;
    }

    public get direction() {
        return this._direction;
    }

    public serialize() {
        return Object.assign(super.serialize(), {direction: this.direction});
    }
}