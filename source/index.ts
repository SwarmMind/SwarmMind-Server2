import Overmind from './OvermindModule/Overmind';
const mapData = JSON.parse(require('./map.json'));

const overmind = new Overmind();

overmind.playGame(mapData);
