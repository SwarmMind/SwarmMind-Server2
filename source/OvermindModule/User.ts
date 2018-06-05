import Command from '../utilities/Command';


export default class User {
    private _commands: Map<number, Command>;
    private lastCommandRound: number;
    private _weight: number;

    constructor() {
        this._weight = 1;
    }

    public takeCommand(command: Command, round) {
        if (!(round === this.lastCommandRound)) {
            this._commands = new Map();
        }

        this._commands.set(command.mapObjectID, command);
    }

    public commandsForThisRound(round: number): Map<number, Command> {
        if (round === this.lastCommandRound) {
            return this._commands;
        }
        else {
            return new Map();
        }
    }
}
