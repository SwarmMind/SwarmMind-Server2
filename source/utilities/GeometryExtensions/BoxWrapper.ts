import Flatten from 'flatten-js';


export default class BoxWrapper {
    private box: Flatten.Box;

    public constructor(xmin: number, ymin: number, xmax: number, ymax: number) {
        this.box = new Flatten.Box(xmin, ymin, xmax, ymax);
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

    public get center(): Flatten.Point {
        return new Flatten.Point((this.box.xmin + this.box.xmax) / 2, (this.box.ymin + this.box.ymax) / 2);
    }

    public get centerVec(): Flatten.Vector {
        return new Flatten.Vector(
            new Flatten.Point(0, 0),
            new Flatten.Point((this.box.xmin + this.box.xmax) / 2, (this.box.ymin + this.box.ymax) / 2),
        );
    }

    public get height(): number {
        return this.box.ymax - this.box.ymin;
    }

    public get width(): number {
        return this.box.xmax - this.box.xmin;
    }
}
