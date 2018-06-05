import Command from './Command';

import { Vector } from 'flatten-js';


export default class NullCommand extends Command {
    constructor() {
        super(-1, new Vector(1, 1))
    }

    execute() {
    }
}