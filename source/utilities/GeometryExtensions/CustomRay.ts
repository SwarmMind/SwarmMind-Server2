import { Line, Point, Segment, Vector } from 'flatten-js';

export default class CustomRay {
    private line: Line;

    constructor(pt: Point, dir: Vector) {
        if (dir.length === 0) { throw new Error('Null vector given as direction'); }
        this.line = new Line(pt, dir);
    }

    public get direction(): Vector {
        return this.line.norm;
    }

    public get origin(): Point {
        return this.line.pt;
    }

    public intersect(shape: Line | Point | Segment) {
        const intersections = [];
        const lineIntersections = this.line.intersect(shape);
        for (const point of lineIntersections) {
            if (
                (this.direction.x > 0 && point.x > this.origin.x) ||
                (this.direction.x < 0 && point.x < this.origin.x) ||
                (this.direction.y > 0 && point.y > this.origin.y) ||
                (this.direction.y < 0 && point.y < this.origin.y)
            ) {
                intersections.push(point);
            }
        }
        return intersections;
    }
}
