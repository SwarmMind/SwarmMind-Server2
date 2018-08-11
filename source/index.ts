import Overmind from './OvermindModule/Overmind';

const mapData = require('../source/map.json');

const overmind = new Overmind();
overmind.playGame(mapData);
