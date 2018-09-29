import Game from '../GameModule/Game';
import MapObject from '../GameModule/MapObject';
import DirectedCommand from './DirectedCommand';

import Flatten from 'flatten-js';
import DieCommand from './DieCommand';

export default class DamageCommand extends DirectedCommand {
    private target: MapObject;
    private attacker: MapObject;
    constructor(attacker: MapObject, target: MapObject) {
        super(target.ID, new Flatten.Vector(attacker.position, target.position));

        this.target = target;
        this.attacker = attacker;
        this._type = 'damage';
    }

    executionFunction(game: Game) {
        const attacker = game.resolveID(this.mapObjectID);
        attacker.attack(this.target);

        if(this.target.isDead()) {
            console.log(`Unit${this.attacker.ID} killed Unit${this.target.ID}`);
            return new DieCommand(this.target.ID);
        }
    }

    public serialize() {
        return Object.assign(super.serialize(), {target: this.target.ID});
    }
}
