export default class Node {
    public parent;
    public position;

    public g;
    public h;
    public f;

    constructor(parent: Node = null, position) {
        this.parent = parent;
        this.position = position;

        this.g = 0;
        this.h = 0;
        this.f = 0;
    }

    equals(node: Node) {
        return this.position.x === node.position.x && this.position.y === node.position.y;
    }
}
