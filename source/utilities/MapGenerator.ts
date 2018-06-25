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
    }
}