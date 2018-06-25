import { Box, Point, Vector } from 'flatten-js';

export default class BoxExtension extends Box {
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
