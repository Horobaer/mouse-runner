import './style.css'
import Game from './game/Game.js'

const canvas = document.getElementById('gameCanvas');
// 16:9 aspect ratio standard
canvas.width = 1280;
canvas.height = 720;

const game = new Game(canvas);
game.start();
