import DamageCommand from './DamageCommand';
import Game from '../GameModule/Game';
import MapObject from '../GameModule/MapObject';

import { Vector } from 'flatten-js';
import DieCommand from './DieCommand';

export default class AmountedDamageCommand extends DamageCommand {
    private amount: number;
    constructor(attacker: MapObject, target: MapObject, amount: number) {
        super(attacker, target);

        this.amount = amount;
        this._type = 'amountedDamage';
    }

    executionFunction(game: Game) {
        const attacker = game.resolveID(this.mapObjectID);
        attacker.attackAmounted(this.target, this.amount);

        if(this.target.isDead()) {
            console.log(`Unit${this.attacker.ID} killed Unit${this.target.ID}`);
            return new DieCommand(this.target.ID);
        }
    }

    public serialize() {
        return Object.assign(super.serialize(), {target: this.target.ID});
    }
}