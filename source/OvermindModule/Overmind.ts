import Flatten from 'flatten-js';
import AttackCommand from '../Commands/AttackCommand';
import Command from '../Commands/Command';
import DirectedCommand from '../Commands/DirectedCommand';
import MoveCommand from '../Commands/MoveCommand';
import Game from '../GameModule/Game';
import CallCenter from '../OvermindModule/CallCenter';
import User from '../OvermindModule/User';

function accumulateVectors(vectors: DirectedCommand[]): Flatten.Vector {
    const sum = vectors.reduce((accumulator, current) =>
        accumulator.add(current.direction), new Flatten.Vector(0, 0));

    return sum.length > 1 ? sum.normalize() : sum;
}

export default class Overmind {
    private roundIntervalID;
    private game: Game;
    private callCenter: CallCenter;
    private givenCommandCount: number;
    private mapData;

    private roundTime: number;
    private roundStartTime: number;

    constructor() {
        this.game = new Game();
        this.callCenter = new CallCenter(this);

        this.roundTime = 20;
        this.givenCommandCount = 0;
    }

    public playGame(mapData) {
        this.mapData = mapData;
        this.game.start(this.mapData);
        this.initializeMainInterval();
    }

    public initializeMainInterval() {
        this.roundStartTime = Date.now();
        this.roundIntervalID = setTimeout(this.processRound.bind(this), this.roundTime * 1000);
    }

    public restart() {
        this.game.restart(this.mapData);
        this.initializeMainInterval();
    }

    public startNextRound() {
        clearTimeout(this.roundIntervalID);
        this.processRound();
    }

    public get accumulatedCommands() {
        const users = this.callCenter.connectedUsers;

        const playerCommands = this.getPlayerCommandMap(users);

        const summery: any = {playerCommands: {}};  // not a map because we want to convert it to json later
        let attackCommands, moveCommands;
        for (const [playerID, commands] of playerCommands) {
            attackCommands = commands.filter((command) => command.type === 'attack');
            moveCommands = commands.filter((command) => command.type === 'move');

            summery.playerCommands[playerID] = {
                move: moveCommands.map((command) => command.direction),
                attack: attackCommands.map((command) => command.direction),
            };
        }

        summery.numberOfGivenCommands = this.givenCommandCount;
        summery.maxNumberOfCommands = this.maxNumberOfCommands();
        return summery;
    }


    private maxNumberOfCommands(): number {
        return this.callCenter.userCount * this.game.playerNumber;
    }

    private getPlayerCommandMap(users: User[]): Map<number, Command[]> {
        const playerIDs = this.game.playerIDs;
        const playerCommands: Map<number, Command[]> = new Map();

        for (const ID of playerIDs) {
            playerCommands.set(ID, []);
        }

        for (const user of users) {
            for (const [playerID, command] of user.commands) {
                command.weight += user.weight;
                playerCommands.get(playerID).push(command);
            }
        }

        return playerCommands;
    }

    private generateCommand(playerID: number, commandList: DirectedCommand[], commandClass){
        const direction = accumulateVectors(commandList);
        return new commandClass(playerID, direction);
    }

    private generateCommandsToBeExecuted(): Command[] {
        const users = this.callCenter.connectedUsers;
        const generatedCommands = [];

        const playerCommands = this.getPlayerCommandMap(users);

        let attackCommands, moveCommands,  generatedCommand, attackWeight, moveWeight;
        const reduceFunction = (acc, cur) => acc + cur.weight;

        for (const [playerID, commands] of playerCommands) {
            generatedCommand = null;

            if (commands.length > 0) {
                attackCommands = commands.filter((command) => command.type === 'attack');
                moveCommands = commands.filter((command) => command.type === 'move');

                attackWeight = attackCommands.reduce(reduceFunction, 0);
                moveWeight = moveCommands.reduce(reduceFunction, 0);

                if (attackWeight >= moveWeight) {
                    generatedCommand = this.generateCommand(playerID, attackCommands, AttackCommand);
                } else {
                    generatedCommand = this.generateCommand(playerID, moveCommands, MoveCommand);
                }

                for (const user of users) {
                    user.changeWeighting(playerID, generatedCommand);
                }

                generatedCommands.push(generatedCommand);
            }
        }

        return generatedCommands;
    }

    private processRound() {
        const oldGameState = this.game.state;
        this.game.newRound(this.generateCommandsToBeExecuted());
        oldGameState.commands = this.game.lastExecutedCommands.map((command) => command.serialize());

        // send old game state + commands(delta) => client can display current game state
        this.callCenter.sendNewRoundInformations(oldGameState);

        this.givenCommandCount = 0;
        this.callCenter.resetUserCommandInformations();

        this.initializeMainInterval();

        if (this.game.isOver()) {
            this.callCenter.informGameOver();
            clearTimeout(this.roundIntervalID);
            this.restart();
        }
    }

    public takeCommand(command: Command, user: User) {
        if (this.game.isValidCommand(command)) {
            user.takeCommand(command);
            this.givenCommandCount++;
            this.callCenter.sendAccumulatedCommands();
        }

        if(this.givenCommandCount === this.maxNumberOfCommands()) {
            this.startNextRound();
        }
    }

    public get initState() {
        const state = this.game.initState;
        Object.assign(state.config, {
            roundTime: this.roundTime,
            timeSinceLastRound: (Date.now() - this.roundStartTime) / 1000,
        });

        return state;
    }
}
