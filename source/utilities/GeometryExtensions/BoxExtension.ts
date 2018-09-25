import Flatten from 'flatten-js';

export default class BoxExtension extends Flatten.Box {
    public xmin: number;
    public xmax: number;
    public ymin: number;
    public ymax: number;

    constructor(xmin: number, ymin: number, xmax: number, ymax: number) {
        super(xmin, ymin, xmax, ymax);
    }

    public get center(): Flatten.Point {
        return new Flatten.Point((this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2);
    }

    public get centerVec(): Flatten.Vector {
        return new Flatten.Vector(
            new Flatten.Point(0, 0),
            new Flatten.Point((this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2),
        );
    }

    public get height(): number {
        return this.ymax - this.ymin;
    }

    public get width(): number {
        return this.xmax - this.xmin;
    }
}
