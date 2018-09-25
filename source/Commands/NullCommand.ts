import Command from './Command';

export default class NullCommand extends Command {
    constructor() {
        super(-1)
    }
}