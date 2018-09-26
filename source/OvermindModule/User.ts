import Command from '../Commands/Command';


export default class User {
    private _commands: Map<number, Command>;
    private _weight: number;

    constructor() {
        this._weight = 1;
        this.clearCommands();
    }

    public takeCommand(command: Command) {
        this._commands.set(command.mapObjectID, this.weightCommand(command));
    }

    private weightCommand(command: Command) {
        command.applyWeight(this._weight);
        return command;
    }

    public changeWeightBy(number: number) {
        this._weight = Math.min(Math.max(0, this._weight - number), 5);
    }

    public get commands(): Map<number, Command> {
        return this._commands;
    }

    public clearCommands() {
        this._commands = new Map();
    }

    public get givenCommandCount() {
        return this.commands.size;
    }

    public get weight(){
        return this._weight;
    }
}
