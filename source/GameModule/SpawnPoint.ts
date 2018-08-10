export default class SpawnPoint{
    constructor(private x, private y, private game, private type){}

    spawnObject(){
        this.type.spawnIn(this.game, this.x, this.y);
    }
}