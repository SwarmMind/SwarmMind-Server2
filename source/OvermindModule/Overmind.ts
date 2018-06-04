import Game from '../GameModule/Game';
import Command from '../utilities/Command';
import CallCenter from './CallCenter';
import User from './User';
import UserManager from './UserManager';

import { Vector } from 'flatten-js';


export default class Overmind {

    private intervalID: number;
    private game: Game;
    private callCenter: CallCenter;

    constructor() {
        this.game = new Game();
        this.callCenter = new CallCenter(this);
    }

    public playGame(width, height) {
        this.game.start(width, height);
        this.setInterval(4);
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
        const commandCount: Map<number, Map<string, number>> = new Map();
        const directions: Map<number, Vector> = new Map();

        for (const playerID of playerIDs) {
            directions.set(playerID, new Vector(0, 0));
            commandCount.set(playerID, new Map());

            for (const commandType of Command.types) {
                commandCount.get(playerID).set(commandType, 0);
            }
        }

        for (const user of users) {
            for (const [playerID, command] of user.commands) {
                directions.set(playerID, this.addVectors(directions.get(playerID), command.direction));
                commandCount.get(playerID).set(command.type, commandCount.get(playerID).get(command.type) + 1);
            }
        }


        return;
    }

    private processRound() {
        const oldGameState = this.game.state;
        this.game.newRound(this.generateCommandsToBeExecuted());
        this.callCenter.sendNewRoundInformations(oldGameState, this.game.lastExecutedCommands);
    }

    /**
     * @param {number} duration in seconds
     */
    private setInterval(duration: number) {         // if the function is not bound it does not know the this context
        this.intervalID = setInterval(this.processRound.bind(this), duration * 1000);
    }

    public get initState() {
        return this.game.initState;
    }
}
