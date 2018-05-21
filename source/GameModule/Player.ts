import MapObject from './MapObject';

export default class Player extends MapObject {
    isPlayer() {
        return true;
    }
}
