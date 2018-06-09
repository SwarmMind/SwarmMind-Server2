import Command from '../utilities/Command';


export default class User {
    private _commands: Map<number, Command>;
    private _weight: number;

    constructor() {
        this._weight = 1;
        this.clearCommands();
    }

    public takeCommand(command: Command) {
        this._commands.set(command.mapObjectID, command);
    }

    public get commands(): Map<number, Command> {
        return this._commands;
    }

    public clearCommands() {
        this._commands = new Map();
    }
}
