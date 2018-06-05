import Game from '../GameModule/Game';
import Command from '../utilities/Command';
import CallCenter from './CallCenter';
import User from './User';
import UserManager from './UserManager';

import { Vector } from 'flatten-js';
import CommandBuilder from '../utilities/CommandBuilder';
import AttackCommand from '../utilities/AttackCommand';
import MoveCommand from '../utilities/MoveCommand';


export default class Overmind {

    private roundIntervalID: number;
    private tickIntervalID: number;
    private game: Game;
    private callCenter: CallCenter;

    constructor() {
        this.game = new Game();
        this.callCenter = new CallCenter(this);
    }

    public playGame(width, height) {
        this.game.start(width, height);
        this.roundIntervalID = this.setInterval(4, this.processRound);

    }

    /**
     * takeCommand
     */
    public takeCommand(command: Command, user: User) {
        user.takeCommand(command, this.game.round);
    }

    private addVectors(vector1: Vector, vector2: Vector): Vector {
        return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
    }

    private generateCommandsToBeExecuted(): Command[] {        // TODO: should update biases
        const users = UserManager.users;
        const playerIDs = this.game.playerIDs;
        const playerCommands: Map<number, Command[]> = new Map();   // playerID => Command[]
        const commands = [];

        for (const ID of playerIDs) {
            playerCommands.set(ID, []);
        }

        for (const user of users) {
            for (const [playerID, command] of user.commandsForThisRound(this.game.round)) {
                playerCommands.get(playerID).push(command);
            }
        }

        // TODO: write more performant code

        let attackCommands, moveCommands, direction;
        for (const [playerID, commands] of playerCommands) {
            attackCommands = commands.filter((command) => command.type === 'attack');
            moveCommands = commands.filter((command) => command.type === 'move');

            if (attackCommands.length >= moveCommands.length) {
                direction = attackCommands.reduce((accumulator, current) =>
                    this.addVectors(accumulator, current.direction), new Vector(0, 0));

                commands.push(new AttackCommand(playerID, direction));
            }
            else {
                direction = moveCommands.reduce((accumulator, current) =>
                    this.addVectors(accumulator, current.direction), new Vector(0, 0));

                commands.push(new MoveCommand(playerID, direction));
            }
        }

        return commands;
    }

    private processRound() {
        const oldGameState = this.game.state;
        this.game.newRound(this.generateCommandsToBeExecuted());
        this.callCenter.sendNewRoundInformations(oldGameState, this.game.lastExecutedCommands);
    }

    /**
     * @param {number} duration in seconds
     */
    private setInterval(duration: number, fn) {
        // if the function is not bound it does not know the this context
        return setInterval(fn.bind(this), duration * 1000);
    }

    public get initState() {
        return this.game.initState;
    }
}
