import './style.css'
import Game from './game/Game.js'

const canvas = document.getElementById('gameCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const game = new Game(canvas);

window.addEventListener('resize', () => {
    game.resize(window.innerWidth, window.innerHeight);
});
game.start();
