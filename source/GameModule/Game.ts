import FactoryStore from './FactoryStore';
import NPC from './NPC';
import Player from './Player';
import World from './World';

import { Circle, Line, Point, Vector } from 'flatten-js';
import AttackCommand from '../utilities/AttackCommand';
import Command from '../utilities/Command';
import MoveCommand from '../utilities/MoveCommand';
import MapObject from './MapObject';
import NullCommand from '../utilities/NullCommand';
import DamageCommand from '../utilities/DamageCommand';

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

export default class Game {
    private world: World;
    private store: FactoryStore;

    private _round: number;
    private _lastExecutedCommands: Command[];

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
            commands: []
        };
    }

    public get initState() {
        return {
            config: {
                width: this.world.width,
                height: this.world.height,
            },
            state: this.state,
        };
    }

    public start(width, height) {
        this._round = 0;
        this.world = new World(width, height);
        this.addPlayer(10, 10);
        this.addPlayer(11, 10);
        this.addPlayer(10, 11);
    }

    public restart() {
        this.start(this.world.width, this.world.height);
        this.store.flush();
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

    private generateNPCCommandFor(npc: NPC): Command {
        const nearestPlayer = this.findNearestPlayer(npc);
        let direction: Vector;

        if (nearestPlayer !== null) {
            direction = (new Vector(npc.position, nearestPlayer.position)).normalize();
            if (npc.isInAttackRange(nearestPlayer)) {
                return new AttackCommand(npc.ID, direction);
            }
            else {
                return new MoveCommand(npc.ID, direction);
            }
        }
        else {
            return new NullCommand();
        }
    }

    private generateNPCCommands(): Command[] {
        return this.store.npcs.map((npc) => this.generateNPCCommandFor(npc));
    }

    private spawnNPC() {
        const direction = Math.floor(randomNumber(1, 5));
        const positionXBorder = Math.random() * (this.world.width - 2) + 1;
        const positionYBorder = Math.random() * (this.world.height - 2) + 1;

        if (direction === 1) {
            this.addNPC(positionXBorder, 1);
        }
        if (direction === 3) {
            this.addNPC(positionXBorder, this.world.height - 1);
        }
        if (direction === 2) {
            this.addNPC(1, positionYBorder);
        }
        if (direction === 4) {
            this.addNPC(this.world.width - 1, positionYBorder);
        }
    }

    private executeAndStoreCommands(commands: Command[]) {
        for (const command of commands) {
            command.execute(this);

            for(const partCommand of command){
                this._lastExecutedCommands.push(partCommand);
            }
        }
    }

    /**
     * starts a new round by executing chosen commands
     * set the lastExecutedCommands property to executed Commands in this method
     * @param {Command[]} commands
     */
    public newRound(commands: Command[]) {
        console.log(commands);
        this._lastExecutedCommands = [];

        this.executeAndStoreCommands(commands);      // executes player-action
        this.executeAndStoreCommands(this.generateNPCCommands());   // executes npc-actions
        this.spawnNPC();
        this._round++;
    }

    public addPlayer(x, y) {
        this.store.createPlayer(x, y, (x, y) => new Circle(new Point(x, y), 0.5));
    }

    public addNPC(x, y) {
        this.store.createNPC(x, y, (x, y) => new Circle(new Point(x, y), 0.5));
    }

    public removeMapObject(mapObject: MapObject) {
        this.store.removeObject(mapObject.ID);
    }

    public get lastExecutedCommands() {
        return this._lastExecutedCommands;
    }

    public moveMapObject(mapObjectID: number, direction: Vector) {
        const mapObject = this.resolveID(mapObjectID);
        console.log(mapObject, direction);
        mapObject.moveIn(direction);
    }

    private findPossibleTarget(position: Point, direction: Vector, isPossibleTarget) {
        const line = new Line(position, position.translate(direction));
        const possibleTargets = [];

        for (const possibleTarget of this.store.mapObjects) {
            if (isPossibleTarget(possibleTarget)) {
                if (line.intersect(possibleTarget.mapRepresentation).length > 0) {
                    possibleTargets.push(possibleTarget);
                }
            }
        }

        return possibleTargets;
    }

    public resolveID(mapObjectID: number){
        return this.store.getObjectByID(mapObjectID);
    }

    public attackInDirection(mapObjectID: number, direction: Vector) {
        const attacker = this.resolveID(mapObjectID);
        const possibleTargets = this.findPossibleTarget(attacker.position, direction, attacker.isTarget.bind(attacker));
        const target = this.findNearestMapObject(attacker, possibleTargets);

        if(target !== null){
            return new DamageCommand(attacker, target);
        }
    }

    public killMapObject(mapObjectID: number){
        const mapObject = this.resolveID(mapObjectID);
        this.removeMapObject(mapObject);
    }

    public get playerIDs() {
        return this.store.players.map((player) => player.ID);
    }

    public isOver(){
        return this.store.players.length === 0;
    }
}
