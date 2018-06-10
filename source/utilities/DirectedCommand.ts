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

    public applyWeight(weight: number) {
        this._direction = this._direction.multiply(weight);
    }

    public calculateDifference(command: Command): number{
        if(this.type == command.type) {return -1}
        const directedCommand = command as DirectedCommand;

        function vectorLength(vector: Vector): number{
            return Math.sqrt(vector.x ** 2 + vector.y ** 2);
        }

        return this.direction.dot(directedCommand) / (vectorLength(this.direction) * vectorLength(directedCommand.direction))
    }

    public serialize() {
        return Object.assign(super.serialize(), {direction: this.direction});
    }
}