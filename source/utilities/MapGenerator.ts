function randInt(min, max){
    return Math.floor(Math.random() * (max - min) + min);
}

export default class MapGenerator {
    private _map: number[][];

    private width: number;
    private height: number;

    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    public initializeArray() {
        this._map = [];
        for(let i = 0; i < this.width; i++){
            this._map.push([]);
            for(let j = 0; j < this.height; j++){
                this._map[i].push(0);
            }
        }
    }

    public generate( dimensions, maxTunnels, maxLength) {
        this.initializeArray();

        let currentRow = randInt(0, dimensions),
            currentColumn = randInt(0, dimensions),
            directions = [[-1, 0], [1, 0], [0, -1], [0, 1]],
            lastDirection = [],
            randomDirection;

        while (maxTunnels && maxLength && dimensions) {
            do {
                randomDirection = directions[randInt(0, directions.length)];
            } while ((randomDirection[0] === -lastDirection[0] && randomDirection[1] === -lastDirection[1]) || (randomDirection[0] === lastDirection[0] && randomDirection[1] === lastDirection[1]));



            let randomLength = Math.ceil(Math.random() * maxLength),
                tunnelLength = 0;

            while (tunnelLength < randomLength) {

                //break the loop if it is going out of the map
                if (((currentRow === 0) && (randomDirection[0] === -1)) ||
                    ((currentColumn === 0) && (randomDirection[1] === -1)) ||
                    ((currentRow === dimensions - 1) && (randomDirection[0] === 1)) ||
                    ((currentColumn === dimensions - 1) && (randomDirection[1] === 1))) {
                    break;
                }
                else {
                    this._map[currentRow][currentColumn] = 0;
                    currentRow += randomDirection[0];
                    currentColumn += randomDirection[1];
                    tunnelLength++;
                }
            }

            if (tunnelLength) {
                lastDirection = randomDirection;
                maxTunnels--;
            }
        }

        return this._map;
    }

}