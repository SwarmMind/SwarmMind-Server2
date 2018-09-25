import Flatten from 'flatten-js';
import Command from './Command';

export default class DirectedCommand extends Command{
    protected _direction: Flatten.Vector;

    constructor(mapObjectID: number, direction: Flatten.Vector){
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

        return this.direction.dot(directedCommand.direction) / (this.direction.length * directedCommand.direction.length)
    }

    public serialize() {
        return Object.assign(super.serialize(), {direction: this.direction});
    }
}