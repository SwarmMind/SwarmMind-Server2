import PlayerInterface from './interfaces/PlayerInterface';

import Command from '../utilities/Command';
import CallCenter from './CallCenter';
import PlayerManager from './UserManager';

export default class Overmind implements PlayerInterface {

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

    // TODO: Later on the overmind should periodically pull the commands,
    // so that the callcenter does not need to know the overmind
    /**
     * takeCommand
     */
    public takeCommand(command: Command, userID: number) {
        // TODO: Implement
    }
}
