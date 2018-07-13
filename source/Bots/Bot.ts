import sio = require('socket.io-client');

import { Point, Vector } from 'flatten-js'

function distance(x1, y1, x2, y2): number{
    return Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
}

function randInt(min, max){
    return Math.floor(Math.random() * (max - min) + min);
}

function randSign(){
    return randInt(0, 2) == 0 ? -1 : 1;
}

class Bot{
    private io;

    constructor(address, port) {
        this.io = sio(`${address}:${port}`);
        this.io.on('state', (state) => {
            const parsedState = JSON.parse(state);
            // console.log(parsedState);
            this.generateAction(parsedState);
        })
    }

    private sendCommand([id, type, direction]) {
        this.io.emit('command', id, type, direction);
    }

    protected commandFor(player, npcList): [number, string, string]{
        return;
    }

    public generateAction(state) {
        for(const player of state.players){
            let actions = this.commandFor(player, state.npcs);
            // console.log('actions: ', actions);
            this.sendCommand(actions);
        }
    }
}

class Angsthase extends Bot {
    protected commandFor(player, npcList): [number, string, string]{
        let nearestNPC = null;
        let nearestNPCDistance = Infinity;
        let dist;

        for (const npc of npcList) {
            dist = distance(player.x, player.y, npc.x, npc.y);
            if(dist < nearestNPCDistance){
                nearestNPC = npc;
                nearestNPCDistance = dist;
            }
        }

        return [player.ID, 'move', JSON.stringify((new Vector(new Point(0, 0), new Point(-(nearestNPC.x - player.x), -(nearestNPC.y - player.y)))).normaliz())];
    }
}

class RandomWalker extends Bot {
    protected commandFor(player, npcList): [number, string, string]{
        console.log('command');
        return [player.ID, 'move', JSON.stringify((new Vector(new Point(0, 0), new Point(Math.random() * randSign(), Math.random() * randSign()))).normalize())];
    }
}

class Schießwütiger extends Bot {

}

class Mitläufer extends Bot {

}

for(let i = 0; i < 10; i++){
    new RandomWalker('http://159.69.32.65', 3000);
}


