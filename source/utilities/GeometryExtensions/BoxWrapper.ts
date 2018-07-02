import { Box, Point, Vector } from 'flatten-js';

export default class BoxWrapper {
    private box: Box;

    public constructor(xmin: number, ymin: number, xmax: number, ymax: number) {
        this.box = new Box(xmin, ymin, xmax, ymax);
    }

    public get xmin(): number {
        return this.box.xmin;
    }

    public get ymin(): number {
        return this.box.ymin;
    }

    public get xmax(): number {
        return this.box.xmax;
    }

    public get ymax(): number {
        return this.box.ymax;
    }

    public get center(): Point {
        return new Point((this.box.xmin + this.box.xmax) / 2, (this.box.ymin + this.box.ymax) / 2);
    }

    public get centerVec(): Vector {
        return new Vector(
            new Point(0, 0),
            new Point((this.box.xmin + this.box.xmax) / 2, (this.box.ymin + this.box.ymax) / 2),
        );
    }

    public get height(): number {
        return this.box.ymax - this.box.ymin;
    }

    public get width(): number {
        return this.box.xmax - this.box.xmin;
    }
}
