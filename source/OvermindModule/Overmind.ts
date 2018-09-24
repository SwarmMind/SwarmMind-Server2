import {Vector} from 'flatten-js';
import AttackCommand from '../Commands/AttackCommand';
import Command from '../Commands/Command';
import MoveCommand from '../Commands/MoveCommand';
import Game from '../GameModule/Game';
import CallCenter from '../OvermindModule/CallCenter';
import User from '../OvermindModule/User';
import UserManager from '../OvermindModule/UserManager';

export default class Overmind {
    private roundIntervalID;
    private game: Game;
    private callCenter: CallCenter;
    private givenCommandCount: number;

    private roundTime: number;
    private roundStartTime: number;

    constructor() {
        this.game = new Game();
        this.callCenter = new CallCenter(this);

        this.roundTime = 20;
        this.givenCommandCount = 0;
    }

    public playGame(mapData) {
        for(const playerSpawn of mapData.playerSpawns){
            this.game.addPlayerSpawnAt(playerSpawn.x, playerSpawn.y);
        }

        for(const npcSpawn of mapData.npcSpawns){
            this.game.addNPCSpawnAt(npcSpawn.x, npcSpawn.y);
        }

        for(const blockade of mapData.blockades){
            this.game.addBlockade(blockade.x, blockade.y);
        }

        this.game.start(mapData.width, mapData.height);
        this.initializeMainInterval();
    }

    public initializeMainInterval() {
        this.roundStartTime = Date.now();
        this.roundIntervalID = setTimeout(this.processRound.bind(this), this.roundTime * 1000);
    }

    public restart() {
        this.game.restart();
        this.initializeMainInterval();
    }

    public startNextRound(){
        clearTimeout(this.roundIntervalID);
        this.processRound();
    }

    // TODO: Outsource to a static class or something? It isn't really Overmind specific.
    private addVectors(vector1: Vector, vector2: Vector): Vector {
        return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
    }

    public get accumulatedCommands() {
        const users = UserManager.users;

        const playerCommands = this.getPlayerCommandMap(users);

        const obj: any = {playerCommands: {}};
        let attackCommands, moveCommands;
        for (const [playerID, commands] of playerCommands) {
            attackCommands = commands.filter((command) => command.type === 'attack');
            moveCommands = commands.filter((command) => command.type === 'move');
            obj.playerCommands[playerID] = {
                move: moveCommands.map((command) => command.direction),
                attack: attackCommands.map((command) => command.direction),
            };
        }

        obj.numberOfGivenCommands = this.givenCommandCount;
        obj.maxNumberOfCommands = this.maxNumberOfCommands();
        console.log(obj);
        return obj;
    }


    private maxNumberOfCommands() {
        return this.callCenter.userCount * this.game.playerNumber;
    }

    private getPlayerCommandMap(users: User[]) {
        const playerIDs = this.game.playerIDs;
        const playerCommands: Map<number, Command[]> = new Map();   // playerID => Command[]

        for (const ID of playerIDs) {
            playerCommands.set(ID, []);
        }

        for (const user of users) {
            for (const [playerID, command] of user.commands) {
                playerCommands.get(playerID).push(command);
            }
        }

        return playerCommands;
    }

    // TODO: Outsource to a static class or something? It isn't really Overmind specific.
    private accumulateVectors(vectors: Vector[]) {
        const sum = vectors.reduce((accumulator, current) =>
            this.addVectors(accumulator, current.direction), new Vector(0, 0));

        return sum.length > 1 ? sum.normalize() : sum;
    }

    // TODO: Maybe outsource this to User class?
    private changeUserWeighting(user: User, playerID: number, command: Command) {
        if (command === null) {
            const userCommand = user.commands.get(playerID);
            user.changeWeightBy(userCommand.calculateDifference(command));
        }
    }

    private generateCommandsToBeExecuted(): Command[] {
        const users = UserManager.users;
        const generatedCommands = [];

        const playerCommands = this.getPlayerCommandMap(users);

        // TODO: write more performant code

        let attackCommands, moveCommands, direction, generatedCommand;
        for (const [playerID, commands] of playerCommands) {
            generatedCommand = null;

            if (commands.length > 0) {
                attackCommands = commands.filter((command) => command.type === 'attack');
                moveCommands = commands.filter((command) => command.type === 'move');

                if (attackCommands.length >= moveCommands.length) {
                    direction = this.accumulateVectors(attackCommands);
                    generatedCommand = new AttackCommand(playerID, direction);
                } else {
                    direction = this.accumulateVectors(moveCommands);
                    generatedCommand = new MoveCommand(playerID, direction);
                }

                for (const user of users) {
                    this.changeUserWeighting(user, playerID, generatedCommand);
                }

                generatedCommands.push(generatedCommand);
            }
        }
        console.log(generatedCommands);
        return generatedCommands;
    }

    private processRound() {
        const oldGameState = this.game.state;
        this.game.newRound(this.generateCommandsToBeExecuted());
        oldGameState.commands = this.game.lastExecutedCommands.map((command) => command.serialize());

        this.callCenter.sendNewRoundInformations(oldGameState);
        UserManager.clearAllUserCommands();
        this.givenCommandCount = 0;

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
            this.callCenter.sendAccumulatedCommands();
            this.givenCommandCount++;
        }

        if(this.givenCommandCount == this.maxNumberOfCommands()){
            this.startNextRound();
        }
    }

    public get initState() {
        const state = this.game.initState;
        Object.assign(state.config, {
            roundTime: this.roundTime,
            timeSinceLastRound: (Date.now() - this.roundStartTime) / 1000
        });

        return state;
    }
}
