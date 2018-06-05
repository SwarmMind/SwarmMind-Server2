import AttackCommand from './AttackCommand';
import Command from './Command';
import MoveCommand from './MoveCommand';


export default class CommandBuilder {
    static commandTypeList = new Map([
        ['attack', AttackCommand],
        ['move', MoveCommand],
    ]);

    static build(type, ...constructorArguments) {
        return new CommandBuilder.commandTypeList[type](...constructorArguments);
    }

    static get types(): string[] {
        return Array.from(CommandBuilder.commandTypeList.keys());
    }
}
