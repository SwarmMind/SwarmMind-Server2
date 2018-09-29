export default class SpawnPoint {
    constructor(private x: number, private y: number, private game, private type) {}

    spawnObject() {
        this.type.spawnIn(this.game, this.x, this.y);
    }
}
