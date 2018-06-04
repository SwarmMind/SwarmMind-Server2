import Game from '../GameModule/Game';
import Command from '../utilities/Command';
import CallCenter from './CallCenter';
import User from './User';
import UserManager from './UserManager';


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

    private chooseCommandsToBeExecuted(): Command[] {        // TODO: should update biases
        const users = UserManager.users;
        return;
    }

    private processRound() {
        const oldGameState = this.game.state;
        this.game.newRound(this.chooseCommandsToBeExecuted());
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
