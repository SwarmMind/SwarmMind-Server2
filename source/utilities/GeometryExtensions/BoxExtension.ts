import { Box, Point, Vector } from 'flatten-js';

export default class BoxExtension extends Box {
    public xmin: number;
    public xmax: number;
    public ymin: number;
    public ymax: number;

    constructor(xmin: number, ymin: number, xmax: number, ymax: number) {
        super(xmin, ymin, xmax, ymax);
    }

    public get center(): Point {
        return new Point((this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2);
    }

    public get centerVec(): Vector {
        return new Vector(
            new Point(0, 0),
            new Point((this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2),
        );
    }

    public get height(): number {
        return this.ymax - this.ymin;
    }

    public get width(): number {
        return this.xmax - this.xmin;
    }
}
