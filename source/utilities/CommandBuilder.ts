import AttackCommand from '../Commands/AttackCommand';
import Command from '../Commands/Command';
import MoveCommand from '../Commands/MoveCommand';

import { Point, Vector } from 'flatten-js';


export default class CommandBuilder {
    static commandTypeList = {
        attack: AttackCommand,
        move: MoveCommand,
    };

    static build(type, ID, direction): Command {
        return  new (CommandBuilder.commandTypeList[type])(ID, new Vector(new Point(0, 0), new Point(direction.x, direction.y)));
    }

    static get types(): string[] {
        return Object.keys(CommandBuilder.commandTypeList);
    }
}
