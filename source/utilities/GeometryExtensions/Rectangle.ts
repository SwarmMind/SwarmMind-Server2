import {Box, Circle, Line, Point, Segment, Vector} from 'flatten-js';

export default class Rectangle {
    static pointSideRelationship(corner1: Point, corner2: Point, p: Point): number {
        // Just builds the line equation of the two given corners and checks
        // if the given point is left or right of the line.
        // Maybe it cold be more efficient.
        // See https://stackoverflow.com/questions/2752725/finding-whether-a-point-lies-inside-a-rectangle-or-not
        // for further information.

        const A = -(corner2.y - corner1.y);
        const B = corner2.x - corner1.x;
        const C = -(A * corner1.x + B * corner1.y);

        return A * p.x + B * p.y + C;
    }

    static segmentsCrossing(s1p1: Point, s1p2: Point, s2p1: Point, s2p2: Point): boolean {
        const segment1 = new Segment(s1p1, s1p2);
        const segment2 = new Segment(s2p1, s2p2);

        return segment1.intersect(segment2);
    }

    constructor(private _a: Point, private _b: Point, private _c: Point, private _d: Point) {
        // TODO: Make sure that the points build a rectangle
    }

    public get a(): Point {
        return this._a;
    }

    public get b(): Point {
        return this._b;
    }

    public get c(): Point {
        return this._c;
    }

    public get d(): Point {
        return this._d;
    }

    public get xmin(): number {
        return Math.min(this._a.x, this._b.x, this._c.x, this._d.x);
    }

    public get ymin(): number {
        return Math.min(this._a.y, this._b.y, this._c.y, this._d.y);
    }

    public get xmax(): number {
        return Math.max(this._a.x, this._b.x, this._c.x, this._d.x);
    }

    public get ymax(): number {
        return Math.max(this._a.y, this._b.y, this._c.y, this._d.y);
    }

    public get center(): Point {
        return new Point((this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2);
    }

    public intersects(otherObject: Box | Circle | Line | Point | Rectangle): Point[] | boolean {
        switch (typeof otherObject) {
            case Box:
                return this.intersectsBox(otherObject);
            default:
                return false;
        }
    }

    /**
     * Checks, if the given box intersects the rectangle. The array contains corners of the box inside the rectangle
     * and crossing-points of sides of the box and the rectangle.
     * If the whole box lays inside the rectangle, the method returns an empty array.
     * If there is no intersection, the method returns false.
     */
    public intersectsBox(box: Box): Point[] {
        const points = [];
        // 1. Check for line crossing
        const rectPoints = [this._a, this._b, this._c, this._d, this._a];

        // Is the orientation right?
        const boxA = new Point(box.xmin, box.ymin);
        const boxB = new Point(box.xmax, box.ymin);
        const boxC = new Point(box.xmax, box.ymax);
        const boxD = new Point(box.xmin, box.ymax);
        const boxPoints = [boxA, boxB, boxC, boxD, boxA];

        /*for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const intersects = Rectangle.segmentsCrossing(
                    rectPoints[i],
                    rectPoints[i+1],
                    boxPoints[j],
                    boxPoints[j+1],
                );

                if (intersects) { return true; }
            }
        }*/


        // 2. Check if the rectangle contains a point of the box

        if (this.containsPoint(boxA)) { points.push(boxA); }
        if (this.containsPoint(boxB)) { points.push(boxB); }
        if (this.containsPoint(boxC)) { points.push(boxC); }
        if (this.containsPoint(boxD)) { points.push(boxD); }

        // 3. Check if the box contains a point of the rectangle
        if (points.length === 0) {
            for (let i = 0; i < 4; i++) {
                if (
                    box.xmin <= rectPoints[i].x &&
                    box.xmax >= rectPoints[i].x &&
                    box.ymin <= rectPoints[i].y &&
                    box.ymax >= rectPoints[i].y
                ) {
                    return points;
                }
            }
        }

        if (points.length > 0) { return points; }
    }

    public containsPoint(point: Point): boolean {
        const D1 = Rectangle.pointSideRelationship(this._a, this._b, point);
        const D2 = Rectangle.pointSideRelationship(this._b, this._c, point);
        const D3 = Rectangle.pointSideRelationship(this._c, this._d, point);
        const D4 = Rectangle.pointSideRelationship(this._d, this._a, point);

        if (D1 > 0 && D2 > 0 && D3 > 0 && D4 > 0) { return true; }
        if (D1 < 0 && D2 < 0 && D3 < 0 && D4 < 0) { return true; }
    }
}
