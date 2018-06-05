import AttackCommand from './AttackCommand';
import Command from './Command';
import MoveCommand from './MoveCommand';

import { Point, Vector } from 'flatten-js';


export default class CommandBuilder {
    static commandTypeList = new Map([
        ['attack', AttackCommand],
        ['move', MoveCommand],
    ]);

    static build(type, ID, direction) {
        console.log(direction);
        return new (CommandBuilder.commandTypeList.get(type))(ID, new Vector(new Point(0, 0), new Point(direction.x, direction.y)));
    }

    static get types(): string[] {
        return Array.from(CommandBuilder.commandTypeList.keys());
    }
}
