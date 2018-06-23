import DirectedCommand from './DirectedCommand';
import Game from '../GameModule/Game';
import MapObject from '../GameModule/MapObject';

import { Vector } from 'flatten-js';
import DieCommand from './DieCommand';

export default class DamageCommand extends DirectedCommand {
    private target: MapObject;
    constructor(attacker: MapObject, target: MapObject){
        super(target.ID, new Vector(attacker.position, target.position));

        this.target = target;
        this._type = 'damage';
    }

    executionFunction(game: Game){
        const attacker = game.resolveID(this.mapObjectID);
        attacker.attack(this.target);

        if(this.target.isDead()){
            return new DieCommand(this.target.ID);
        }
    }

    public serialize(){
        return Object.assign(super.serialize(), {target: this.target.ID});
    }
}