import Command from '../utilities/Command';


export default class User {
    private _commands: Map<string, Command>;
    private lastCommandRound: number;
    private _weight: number;

    constructor() {
        this._weight = 1;
    }

    public takeCommand(command, round) {
        if (!(round === this.lastCommandRound)) {
            this._commands = new Map();
        }

        this._commands.set(command.playerID, command);
    }

    public get commands() {
        return Array.from(this._commands.values());
    }
}
