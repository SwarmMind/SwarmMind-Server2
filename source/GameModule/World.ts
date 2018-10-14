import Flatten from 'flatten-js';
import Node from '../utilities/Node';

export default class World {
    private _width: number;
    private _height: number;
    private grid;

    constructor(mapData) {
        this._width = mapData.width;
        this._height = mapData.height;

        this.grid = [];
        let arr;

        for(let i = 0; i < this.height; i++) {
            arr = [];
            this.grid.push(arr);
            for(let k = 0; k < this.width; k++) {
                arr.push(0);
            }
        }

        for(const blockade of mapData.blockades) {
            this.grid[blockade.y][blockade.x] = 1;
        }

        console.log(this.grid.map((x) => x.join('')).join('\n'));
    }

    public get width() {
        return this._width;
    }

    public get height() {
        return this._height;
    }

    private floorPoint(point: Flatten.Point) {
        return {x: Math.floor(point.x), y: Math.floor(point.y)};
    }

    private backtrackPath(currentNode: Node) {
        const path = [];
        let current = currentNode;

        while(current !== null) {
            path.push(current.position);
            current = current.parent;
        }

        return path.reverse();
    }

    public shortestPathFromTo(start: Flatten.Point, end: Flatten.Point) {
        const startNode = new Node(null, this.floorPoint(start));
        const endNode = new Node(null, this.floorPoint(end));

        const openList = [startNode];
        const closedList = [];

        while(openList.length > 0) {

            let currentNode = openList[0];
            let currentIndex = 0;

            for(let i = 0; i < openList.length; i++) {
                if(openList[i].f < currentNode.f) {
                    currentNode = openList[i];
                    currentIndex = i;
                }
            }

            openList.splice(currentIndex, 1);
            closedList.push(currentNode);

            if(currentNode.equals(endNode)) {
                return this.backtrackPath(currentNode);
            }

            const children = [];

            for(const newPosition of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
                const nodePosition = {
                    x: currentNode.position.x + newPosition[0],
                    y: currentNode.position.y + newPosition[1]};

                if(nodePosition.x > (this.width - 1) || nodePosition.x < 0 ||
                    nodePosition.y > (this.height - 1) || nodePosition.y < 0) {
                    continue;
                }

                if(this.grid[nodePosition.y][nodePosition.x] !== 0) {
                    continue;
                }

                const newNode = new Node(currentNode, nodePosition);
                children.push(newNode);
            }

            for(const newPosition of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
                const nodePosition = {
                    x: currentNode.position.x + newPosition[0],
                    y: currentNode.position.y + newPosition[1]};

                if(nodePosition.x > (this.width - 1) || nodePosition.x < 0 ||
                    nodePosition.y > (this.height - 1) || nodePosition.y < 0) {
                    continue;
                }

                if(this.grid[nodePosition.y][nodePosition.x] !== 0 ||
                    this.grid[currentNode.position.y][nodePosition.x] !== 0 ||
                    this.grid[nodePosition.y][currentNode.position.x] !== 0) {
                    continue;
                }

                const newNode = new Node(currentNode, nodePosition);
                children.push(newNode);
            }


            for(const child of children) {
                let flag = false;

                for(const closedNode of closedList) {
                    if(closedNode.equals(child)) {
                        flag = true;
                        break;
                    }
                }

                if(flag) {
                    continue;
                }

                child.g = currentNode.g + 1;
                child.h = ((child.position.x - endNode.position.y) ** 2)
                            + ((child.position.y - endNode.position.y) ** 2);
                child.f = child.g + child.h;

                for(const openNode of openList) {
                    if(child.equals(openNode) && child.g > openNode.g) {
                        flag = true;
                        break;
                    }
                }

                if(flag) {
                    continue;
                }

                openList.push(child);
            }
        }
    }
}
