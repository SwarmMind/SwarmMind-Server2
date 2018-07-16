import FactoryStore from './FactoryStore';
import NPC from './NPC';
import Player from './Player';
import World from './World';

import { Box, Circle, Line, Point, Segment, Vector } from 'flatten-js';
import BoxExtension from '../utilities/GeometryExtensions/BoxExtension';
import CustomRay from '../utilities/GeometryExtensions/CustomRay';
import Rectangle from '../utilities/GeometryExtensions/Rectangle';

import AttackCommand from '../Commands/AttackCommand';
import Command from '../Commands/Command';
import DamageCommand from '../Commands/DamageCommand';
import MoveCommand from '../Commands/MoveCommand';
import NullCommand from '../Commands/NullCommand';
import MapObject from './MapObject';
import SpawnCommand from '../Commands/SpawnCommand'
import DirectedCommand from "../Commands/DirectedCommand";

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

export default class Game {
    private _world: World;
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
            commands: [],
        };
    }

    public get initState() {
        return {
            config: {
                width: this._world.width,
                height: this._world.height,
            },
            state: this.state,
        };
    }

    public start(width, height) {
        this._round = 0;
        this._world = new World(width, height);
        this.addPlayer(9.5, 9.5);
        // this.addPlayer(10, 10);
        this.addPlayer(11, 10);
        this.addPlayer(10, 11);
    }

    public restart() {
        this.store.flush();
        this._lastExecutedCommands = [];
        this.start(this._world.width, this._world.height);
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
            } else {
                return new MoveCommand(npc.ID, direction);
            }
        } else {
            return new NullCommand();
        }
    }

    private generateNPCCommands(): Command[] {
        return this.store.npcs.map((npc) => this.generateNPCCommandFor(npc));
    }

    private spawnNPC() {
        const direction = Math.floor(randomNumber(1, 5));
        const positionXBorder = Math.random() * (this._world.width - 2) + 1;
        const positionYBorder = Math.random() * (this._world.height - 2) + 1;

        if (direction === 1) {
            this.addNPC(positionXBorder, 1);
        }
        if (direction === 3) {
            this.addNPC(positionXBorder, this._world.height - 1);
        }
        if (direction === 2) {
            this.addNPC(1, positionYBorder);
        }
        if (direction === 4) {
            this.addNPC(this._world.width - 1, positionYBorder);
        }
    }

    private executeAndStoreCommand(command: Command) {
        command.execute(this);
        this._lastExecutedCommands.push(...command);
    }

    private executeAndStoreCommands(commands: Command[]) {
        const movementCommands = [];
        const otherCommands = [];
        for (const command of commands) {
            if (command.type === 'move') {
                movementCommands.push(command);
            } else {
                otherCommands.push(command);
            }
        }

        for (const command of movementCommands) {
            console.log(command);
            const adjustedCommand = this.adjustMovementVector(command as DirectedCommand);
            console.log(adjustedCommand);
            this.executeAndStoreCommand(adjustedCommand);
        }

        for (const command of otherCommands) {
            this.executeAndStoreCommand(command);
        }
    }

    /**
     * starts a new round by executing chosen commands
     * set the lastExecutedCommands property to executed Commands in this method
     * @param {Command[]} commands
     */
    public newRound(commands: Command[]) {
        this._lastExecutedCommands = [];

        this.executeAndStoreCommands(commands);      // executes player-action
        this.executeAndStoreCommands(this.generateNPCCommands());   // executes npc-actions
        this.spawnNPC();
        this._round++;
    }

    public addPlayer(x, y) {
        let player = this.store.createPlayer(x, y, (point) => new Circle(point, 0.5));
        this.executeAndStoreCommand(new SpawnCommand(player.ID));
    }

    public addNPC(x, y) {
        let npc = this.store.createNPC(x, y, (point) => new Circle(point, 0.5));
        this.executeAndStoreCommand(new SpawnCommand(npc.ID));
    }

    public removeMapObject(mapObject: MapObject) {
        this.store.removeObject(mapObject.ID);
    }

    public get lastExecutedCommands() {
        return this._lastExecutedCommands;
    }

    public moveMapObject(mapObjectID: number, direction: Vector) {
        const mapObject = this.resolveID(mapObjectID);
        mapObject.moveIn(direction);
    }

    private avoidCollision(object: MapObject, direction: Vector, obstacle: MapObject) {
        if (direction.x === 0 && direction.y === 0) { return false; }

        const oldBB = object.mapRepresentation.box;
        const objectBB = new BoxExtension(oldBB.xmin, oldBB.ymin, oldBB.xmax, oldBB.ymax);

        // 1. Calculate the side and back distances for creating a not-axis-aligned BB of the movement
        let corner;
        let sideDist;
        let backDist;
        let orthogonalLine;
        const movementLine = new Line(objectBB.center, direction.normalize());
        const orthogonalUnitVec = direction.rotate90CW().normalize();

        if (direction.y === 0) {
            sideDist = objectBB.height / 2;
            backDist = objectBB.width / 2;
        } else if (direction.x === 0) {
            sideDist = objectBB.width / 2;
            backDist = objectBB.height / 2;
        } else if (direction.x > 0) {
            if (direction.y > 0) {
                corner = new Point(objectBB.xmax, objectBB.ymin);
                sideDist = corner.distanceTo(movementLine);
                orthogonalLine = new Line(new Point(objectBB.xmax, objectBB.ymax), orthogonalUnitVec);
                backDist = objectBB.center.distanceTo(orthogonalLine);
            } else {
                corner = new Point(objectBB.xmax, objectBB.ymax);
                sideDist = corner.distanceTo(movementLine);
                orthogonalLine = new Line(new Point(objectBB.xmax, objectBB.ymin), orthogonalUnitVec);
                backDist = objectBB.center.distanceTo(orthogonalLine);
            }
        } else {
            if (direction.y > 0) {
                corner = new Point(objectBB.xmin, objectBB.ymin);
                sideDist = corner.distanceTo(movementLine);
                orthogonalLine = new Line(new Point(objectBB.xmin, objectBB.ymax), orthogonalUnitVec);
                backDist = objectBB.center.distanceTo(orthogonalLine);
            } else {
                corner = new Point(objectBB.xmin, objectBB.ymax);
                sideDist = corner.distanceTo(movementLine);
                orthogonalLine = new Line(new Point(objectBB.xmin, objectBB.ymin), orthogonalUnitVec);
                backDist = objectBB.center.distanceTo(orthogonalLine);
            }
        }

        // 2. Calculate the four points of the not-axis-aligned BB of the movement
        const directionNormVec = direction.normalize();
        const sideVec = directionNormVec.rotate90CCW().multiply(sideDist);
        const backVec = directionNormVec.invert().multiply(backDist);

        const vecA = objectBB.centerVec.add(sideVec).add(backVec);
        const vecB = objectBB.centerVec.add(sideVec.invert()).add(backVec);
        const vecC = objectBB.centerVec.add(sideVec.invert()).add(direction).add(backVec.invert());
        const vecD = objectBB.centerVec.add(sideVec).add(direction).add(backVec.invert());

        const movementBB = new Rectangle(
            new Point(vecA.x, vecA.y),
            new Point(vecB.x, vecB.y),
            new Point(vecC.x, vecC.y),
            new Point(vecD.x, vecD.y),
        );

        // 3. Check for collision with obstacle and adjust the movement vector
        const box = obstacle.mapRepresentation.box;
        let points = movementBB.intersects(box);

        if (points === false) { return direction; }

        points = points as Point[];
        if (points.length === 0) {
            points = [
                new Point(box.xmin, box.ymin),
                new Point(box.xmax, box.ymin),
                new Point(box.xmax, box.ymax),
                new Point(box.xmin, box.ymax),
            ];
        }

        // TODO: At the moment The distance to the front orthogonal is used.
        // TODO: It is better to create a line with p and direction and check for the point,
        // TODO: where it hits the moving object.
        let minD = direction.length + backDist * 2;
        const frontPositionVec = objectBB.centerVec.add(directionNormVec.multiply(backDist));
        const frontPosition = new Point(frontPositionVec.x, frontPositionVec.y);

        for (const p of points) {
            minD = Math.min(minD, frontPosition.distanceTo(p));
        }

        return directionNormVec.multiply(minD);
    }

    private adjustMovementVector(movementCommand: DirectedCommand, pufferDist = 0.01): DirectedCommand {
        let collision = false;
        const mapObject = this.resolveID(movementCommand.mapObjectID);
        const objectBox = mapObject.mapRepresentation.box;

        // Chose points to start the rays from
        const direction = movementCommand.direction;
        const usedCorners = [];
        if (direction.x < 0) {
            usedCorners.push(new Point(objectBox.xmin, objectBox.ymin));
            usedCorners.push(new Point(objectBox.xmin, objectBox.ymax));
            if (direction.y < 0) {
                usedCorners.push(new Point(objectBox.xmax, objectBox.ymin));
            } else {
                usedCorners.push(new Point(objectBox.xmax, objectBox.ymax));
            }
        } else {
            usedCorners.push(new Point(objectBox.xmax, objectBox.ymin));
            usedCorners.push(new Point(objectBox.xmax, objectBox.ymax));
            if (direction.y < 0) {
                usedCorners.push(new Point(objectBox.xmin, objectBox.ymin));
            } else {
                usedCorners.push(new Point(objectBox.xmin, objectBox.ymax));
            }
        }

        // Create rays
        const rays = new Map();
        rays[usedCorners[0]] = new Line(usedCorners[0], direction);
        rays[usedCorners[1]] = new Line(usedCorners[1], direction);
        rays[usedCorners[2]] = new Line(usedCorners[2], direction);
        // const ray1 = new Line(usedCorners[0], directionNorm);
        // const ray2 = new Line(usedCorners[1], directionNorm);
        // const ray3 = new Line(usedCorners[2], directionNorm);
        const ray1 = new CustomRay(usedCorners[0], direction);
        const ray2 = new CustomRay(usedCorners[1], direction);
        const ray3 = new CustomRay(usedCorners[2], direction);

        const usedRays = [];
        usedRays.push(ray1);
        usedRays.push(ray2);
        usedRays.push(ray3);

        let distance = movementCommand.direction.length;

        const collidableObjects = this.store.mapObjects;
        for (const obstacle of collidableObjects) {

            if (obstacle !== mapObject) {
                // Create segments
                const obstacleBox = obstacle.mapRepresentation.box;
                const a = new Point(obstacleBox.xmin, obstacleBox.xmin);
                const b = new Point(obstacleBox.xmin, obstacleBox.xmax);
                const c = new Point(obstacleBox.xmax, obstacleBox.xmax);
                const d = new Point(obstacleBox.xmax, obstacleBox.xmin);
                const segments = [];
                segments.push(new Segment(a, b));
                segments.push(new Segment(b, c));
                segments.push(new Segment(c, d));
                segments.push(new Segment(d, a));

                for (let i = 0; i < 3; i++) {
                    for (const segment of segments) {
                        const intersections = usedRays[i].intersect(segment);
                        //console.log('intersections for corner ' + i + ':');
                        //console.log(intersections);
                        if (intersections.length > 0) {
                            for (const intersection of intersections) {
                                const obstDist = usedCorners[i].distanceTo(intersection)[0];
                                //console.log('obstDist (of corner ' + i + '): ');
                                //console.log(usedCorners[i].distanceTo(intersection));
                                if (obstDist < distance) {
                                    distance = obstDist;
                                    collision = true;
                                }
                            }

                        }
                    }
                }
            }
        }
        if (collision) { distance = distance - pufferDist; }
        movementCommand.direction = direction.normalize().multiply(distance);

        return movementCommand;
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

    public resolveID(mapObjectID: number): MapObject{
        return this.store.getObjectByID(mapObjectID);
    }

    public attackInDirection(mapObjectID: number, direction: Vector) {
        const attacker = this.resolveID(mapObjectID);
        const possibleTargets = this.findPossibleTarget(attacker.position, direction, attacker.isTarget.bind(attacker));
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

    public get npcNumber(){
        return this.store.npcNumber;
    }
}
