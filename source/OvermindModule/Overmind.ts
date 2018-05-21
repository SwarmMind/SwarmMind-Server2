import PlayerInterface from './interfaces/PlayerInterface';

import Command from '../utilities/Command';
import CallCenter from './CallCenter';
import User from './User';

export default class Overmind implements PlayerInterface {

    private intervalID: number;
    private callCenter: CallCenter;

    /**
     * getCommandForUnit
     */
    public getCommandForUnit(unitID: string): string {
        // TODO: Implement
        return 'foo';
    }

    /**
     * takeNewGameState
     */
    public takeNewGameState(state: any): void {
        // TODO: Implement
    }

    public playGame() {
        this.setInterval(4);
    }

    /**
     * takeCommand
     */
    public takeCommand(command: Command, user: User) {
        // TODO: Implement
    }

    // TODO: Later on the overmind should periodically pull the commands,
    // so that the callcenter does not need to know the overmind

    private processRound() {

    }

    /**
     * @param {number} duration in seconds
     */
    private setInterval(duration: number) {         // if the function is not binded it does not know the this context
        this.intervalID = setInterval(this.processRound.bind(this), duration * 1000);
    }
}
