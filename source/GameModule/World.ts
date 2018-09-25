export default class World {
    private _width: number;
    private _height: number;
    private grid;

    constructor(mapData) {
        this._width = mapData.width;
        this._height = mapData.height;

        this.grid = [];
        let arr;

        for(let i = 0; i < this.height; i++){
            arr = [];
            this.grid.push(arr);
            for(let k = 0; k < this.width; k++){
                arr.push(0);
            }
        }

        for(const blockade of mapData.blockades){
            this.grid[blockade.y][blockade.x] = 1;
        }
    }

    public get width() {
        return this._width;
    }

    public get height() {
        return this._height;
    }
}
