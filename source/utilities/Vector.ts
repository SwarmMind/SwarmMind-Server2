import { Vector as FlattenVector } from 'flatten-js';

export default class Vector {
    private vector: FlattenVector;

    constructor(...args) {
        this.vector = new Vector(...args);
    }

    public clone() {
        return this.vector.clone();
    }

    public get slope() {
        return this.vector.slope;
    }

    public add(vector: Vector): Vector {
        return new Vector()
    }

    public angleBetween(vector: Vector) {

    }
}