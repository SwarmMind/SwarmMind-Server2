import FactoryStore from './FactoryStore';
import NPC from './NPC';
import Player from './Player';
import World from './World';

import { Circle, Point, Vector } from 'flatten-js';
import AttackCommand from '../utilities/AttackCommand';
import Command from '../utilities/Command';
import MoveCommand from '../utilities/MoveCommand';
import MapObject from './MapObject';


export default class Game {
    private world: World;
    private store: FactoryStore;

    private _round: number;
    private _lastExecutedCommands: Command[];

    public get round() {
        return this._round;
    }

    public get state(): { round: number, players: Player[], npcs: NPC[] } {
        return {
            round: this.round,
            players: this.store.players,
            npcs: this.store.npcs,
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
    }

    /**
     * for semantics
     */
    public restart(width, height) {
        this.start(width, height);
    }

    private findNearestPlayer(npc: NPC): Player {
        let nearestPlayer: Player = null;
        let distanceToNearestPlayer = -Infinity;
        let distance;

        for (const player of this.store.players) {
            distance = player.distanceTo(npc);

            if (distance < distanceToNearestPlayer) {
                distanceToNearestPlayer = distance;
                nearestPlayer = player;
            }
        }

        return nearestPlayer;
    }

    private generateNPCCommandFor(npc: NPC): Command {
        const nearestPlayer = this.findNearestPlayer(npc);

        if (npc.isInAttackRange(nearestPlayer)) {
            return new AttackCommand(npc.ID, nearestPlayer.ID);
        } else {
            return new MoveCommand(npc.ID, new Vector(npc.position, nearestPlayer.position).normalize());
        }
    }

    private generateNPCCommands(): Command[] {
        return this.store.npcs.map((npc) => this.generateNPCCommandFor(npc));
    }

    private spawnNPC() {
        const direction = Math.floor((Math.random() * 4) + 1);
        const positionXBorder = Math.random() * (this.world.width - 20) + 10;
        const positionYBorder = Math.random() * (this.world.height - 20) + 10;

        if (direction === 1) { this.addNPC(positionXBorder, 10); }
        if (direction === 3) { this.addNPC(positionXBorder, this.world.height - 10); }
        if (direction === 2) { this.addNPC(10, positionYBorder); }
        if (direction === 4) { this.addNPC(this.world.width - 10, positionYBorder); }
    }

    private executeAndStoreCommands(commands: Command[]) {
        for (const command of commands) {
            command.execute(this);
            this._lastExecutedCommands.push(command);
        }
    }

    /**
     * starts a new round by executing chosen commands
     * set the lastExecutedCommands property to executed Commands in this method
     * @param {Command[]} commands
     */
    public newRound(commands: Command[]) {
        this._lastExecutedCommands = [];

        this.executeAndStoreCommands(commands);                     // executes player-actions
        this.executeAndStoreCommands(this.generateNPCCommands());   // executes npc-actions
        this.spawnNPC();
        this._round++;
    }

    public addPlayer(x, y) {
        this.store.createPlayer(x, y, (x, y) => new Circle(new Point(x, y), 10));
    }

    public addNPC(x, y) {
        this.store.createNPC(x, y, (x, y) => new Circle(new Point(x, y), 10));
    }

    public get lastExecutedCommands() {
        return this._lastExecutedCommands;
    }

    public moveMapObject(mapObjectID: number, direction: Vector) {
        const mapObject = this.store.getObjectByID(mapObjectID);
        mapObject.moveIn(direction);
    }

    public attackInDirection(mapObjectID: number, direction: Vector) {
        const mapObject = this.store.getObjectByID(mapObjectID);
    }
}
