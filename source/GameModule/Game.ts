import FactoryStore from './FactoryStore';
import NPC from './NPC';
import Player from './Player';
import World from './World';

import Flatten from 'flatten-js';

import AttackCommand from '../Commands/AttackCommand';
import Command from '../Commands/Command';
import DamageCommand from '../Commands/DamageCommand';
import MoveCommand from '../Commands/MoveCommand';
import NullCommand from '../Commands/NullCommand';
import SpawnCommand from '../Commands/SpawnCommand';
import MapObject from './MapObject';
import SpawnPoint from './SpawnPoint';

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

export default class Game {
    private _world: World;
    private store: FactoryStore;

    private _round: number;
    private _lastExecutedCommands: Command[];

    private npcSpawns: SpawnPoint[] = [];
    private playerSpawns: SpawnPoint[] = [];

    constructor() {
        this.store = new FactoryStore();
        this._lastExecutedCommands = [];
    }

    public get round() {
        return this._round;
    }

    public get state() {
        return {
            round: this.round,
            players: this.store.players.map((player) => player.serialize()),
            npcs: this.store.npcs.map((npc) => npc.serialize()),
            commands: [],
        };
    }

    public get initState() {
        return {
            config: {
                width: this._world.width,
                height: this._world.height,
                blockades: this.store.blockades.map((blockade) => blockade.serialize()),
            },
            state: this.state,
        };
    }

    private initializeMapData(mapData) {
        for(const playerSpawn of mapData.playerSpawns) {
            this.addPlayerSpawnAt(playerSpawn.x, playerSpawn.y);
        }

        for(const npcSpawn of mapData.npcSpawns) {
            this.addNPCSpawnAt(npcSpawn.x, npcSpawn.y);
        }

        for(const blockade of mapData.blockades) {
            this.addBlockade(blockade.x, blockade.y);
        }
    }

    public start(mapData) {
        this._round = 0;
        this._world = new World(mapData);
        this.initializeMapData(mapData);
        for (const playerSpawn of this.playerSpawns) {
            playerSpawn.spawnObject();
        }
    }

    public restart(mapData) {
        this.store.flush();
        this.npcSpawns = [];
        this.playerSpawns = [];
        this._lastExecutedCommands = [];
        this.start(mapData);
    }

    private findNearestMapObject(startingPoint: MapObject, possibilities: MapObject[]): MapObject {
        let nearestMapObject = null;
        let distanceToNearestMapObject = Infinity;
        let distance;

        for (const mapObject of possibilities) {
            distance = mapObject.distanceTo(startingPoint);

            if (distance < distanceToNearestMapObject) {
                distanceToNearestMapObject = distance;
                nearestMapObject = mapObject;
            }
        }

        return nearestMapObject;
    }

    private findNearestPlayer(npc: NPC): Player {
        return this.findNearestMapObject(npc, this.store.players) as Player;
    }

    private helper(mapObject1: MapObject, mapObject2: MapObject) {
        return this._world.shortestPathFromTo(mapObject1.position, mapObject2.position);
    }

    private generateNPCCommandFor(npc: NPC): Command {
        const nearestPlayer = this.findNearestPlayer(npc);
        let direction: Flatten.Vector;

        if (nearestPlayer !== null) {
            if (npc.isInAttackRange(nearestPlayer)) {
                direction = (new Flatten.Vector(npc.position, nearestPlayer.position)).normalize();
                return new AttackCommand(npc.ID, direction);
            } else {
                // const foo = this.helper(npc, nearestPlayer);
                // if(foo){    //TODO: change
                    /*let vector = new Flatten.Vector(npc.position, new Flatten.Point(foo[1].x, foo[1].y));
                    direction = vector.length > 1 ? vector.normalize(): vector;*/
                    direction = (new Flatten.Vector(npc.position, nearestPlayer.position)).normalize();
                    return new MoveCommand(npc.ID, direction);
                /*}
                else{
                    console.log('Not good');
                    return new NullCommand();
                }*/

            }
        } else {
            return new NullCommand();
        }
    }

    private generateNPCCommands(): Command[] {
        return this.store.npcs.map((npc) => this.generateNPCCommandFor(npc));
    }

    private spawnNPC() {
        this.npcSpawns[randomNumber(0, this.npcSpawns.length)].spawnObject();
    }

    private executeAndStoreCommand(command: Command) {
        command.execute(this);
        this._lastExecutedCommands.push(...command);
    }

    private executeAndStoreCommands(commands: Command[]) {
        for (const command of commands) {
            this.executeAndStoreCommand(command);
        }
    }

    /**
     * starts a new round by executing chosen commands
     * set the lastExecutedCommands property to executed Commands in this method
     */
    public newRound(commands: Command[]) {
        this._lastExecutedCommands = [];

        this.executeAndStoreCommands(commands);                     // executes player-action
        this.executeAndStoreCommands(this.generateNPCCommands());   // executes npc-actions
        if(this.npcNumber < 15) {
            this.spawnNPC();
        }
        this._round++;
    }

    public addPlayer(x, y) {
        const player = this.store.createPlayer(x, y, (point) => new Flatten.Circle(point, 0.5));
        this.executeAndStoreCommand(new SpawnCommand(player));
    }

    public addNPC(x, y) {
        const npc = this.store.createNPC(x, y, (point) => new Flatten.Circle(point, 0.4));
        this.executeAndStoreCommand(new SpawnCommand(npc));
    }

    public addBlockade(x, y) {
        this.store.createBlockade(x, y,
            (point) => {
            const polygon = new Flatten.Polygon();
            polygon.addFace([point,
                                    new Flatten.Point(point.x + 1, point.y),
                                    new Flatten.Point(point.x + 1, point.y + 1),
                                    new Flatten.Point(point.x, point.y + 1),
                                    point]);
            return polygon;
            });
    }

    public removeMapObject(mapObject: MapObject) {
        this.store.removeObject(mapObject.ID);
    }

    public get lastExecutedCommands() {
        return this._lastExecutedCommands;
    }

    public moveMapObject(mapObjectID: number, direction: Flatten.Vector) {
        const mapObject = this.resolveID(mapObjectID);

        const range = this.possibleMovementRange(mapObject, direction);
        mapObject.moveIn(range);
        return range;
    }

    private possibleMovementRange(mapObject: MapObject, direction: Flatten.Vector) {
        let min = 0;
        let max = 100;
        let obstacles = this.store.mapObjects.filter((obstacle) => obstacle.ID !== mapObject.ID);
        let representation = null;
        let newPossibleObstacles = [];

        for(let i = 0; i < 7; i++) {     // 7 because we do binary search and log(100) = 7
            representation = mapObject.simulateRepresentationAfterMoving(direction, (max - min + 1) / 100);

            newPossibleObstacles = obstacles.filter((obstacle) =>
                representation.intersect(obstacle.mapRepresentation).length > 0);

            if(newPossibleObstacles.length > 0) {
                max = (max + min + 1) >> 1;
            } else {
                min = (max + min + 1) >> 1;
            }

            obstacles = newPossibleObstacles;
        }

        return direction.multiply(Math.min((max + min) / 100, 1));
    }

    private findPossibleTarget(attacker: MapObject, direction: Flatten.Vector) {
        if(attacker === null) { return []; } // TODO why do I need this
        const line = new Flatten.Line(attacker.position, attacker.position.translate(direction));
        const possibleTargets = [];

        for (const possibleTarget of this.store.mapObjects) { // TODO change this
            if (attacker.isTarget(possibleTarget) && attacker.ID !== possibleTarget.ID) {
                if (line.intersect(possibleTarget.mapRepresentation).length > 0) {
                    if((possibleTarget.position.x - attacker.position.x) / direction.x >= 0 &&
                        (possibleTarget.position.y - attacker.position.y) / direction.y >= 0) {
                        possibleTargets.push(possibleTarget);
                    }
                }
            }
        }

        return possibleTargets;
    }

    public resolveID(mapObjectID: number): MapObject {
        return this.store.getObjectByID(mapObjectID);
    }

    public attackInDirection(mapObjectID: number, direction: Flatten.Vector) {
        const attacker = this.resolveID(mapObjectID);
        const possibleTargets = this.findPossibleTarget(attacker, direction);
        const target = this.findNearestMapObject(attacker, possibleTargets);

        if(target !== null) {
            return new DamageCommand(attacker, target);
        }
    }

    public killMapObject(mapObjectID: number) {
        const mapObject = this.resolveID(mapObjectID);
        this.removeMapObject(mapObject);
    }

    public get playerIDs() {
        return this.store.players.map((player) => player.ID);
    }

    public isOver() {
        return this.store.players.length === 0;
    }

    public isValidCommand(command: Command) {
        return this.store.getObjectByID(command.mapObjectID) !== null;
    }

    public get playerNumber() {
        return this.store.playerNumber;
    }

    public get npcNumber() {
        return this.store.npcNumber;
    }

    public addNPCSpawnAt(x: number, y: number) {
        this.npcSpawns.push(new SpawnPoint(x + 0.5, y + 0.5, this, NPC));
    }

    public addPlayerSpawnAt(x: number, y: number) {
        this.playerSpawns.push(new SpawnPoint(x + 0.5, y + 0.5, this, Player));
    }
}
