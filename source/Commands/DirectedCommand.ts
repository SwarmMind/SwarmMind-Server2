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

    public set direction(newDirection: Vector) {
        this._direction = newDirection;
    }

    public applyWeight(weight: number) {
        this._direction = this._direction.multiply(weight);
    }

    public calculateDifference(command: Command): number{
        if(this.type == command.type) {return -1}
        const directedCommand = command as DirectedCommand;

        return this.direction.dot(directedCommand) / (this.direction.length * directedCommand.direction.length)
    }

    public serialize() {
        return Object.assign(super.serialize(), {direction: this.direction});
    }
}