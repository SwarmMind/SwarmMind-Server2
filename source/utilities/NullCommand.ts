import Command from './Command';
import { Vector } from 'flatten-js';


export default class NullCommand extends Command {
    constructor() {
        super(-1)
    }
}