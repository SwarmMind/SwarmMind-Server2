import AttackCommand from '../Commands/AttackCommand';
import Command from '../Commands/Command';
import MoveCommand from '../Commands/MoveCommand';

import Flatten from 'flatten-js';


export default class CommandBuilder {
    static commandTypeList = {
        attack: AttackCommand,
        move: MoveCommand,
    };

    static build(type, ID, direction): Command {
        return  new (CommandBuilder.commandTypeList[type])(
                        ID,
                        new Flatten.Vector(new Flatten.Point(0, 0),
                        new Flatten.Point(direction.x, direction.y)));
    }

    static get types(): string[] {
        return Object.keys(CommandBuilder.commandTypeList);
    }
}
