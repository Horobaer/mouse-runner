import Entity from './Entities.js';

export default class Projectile extends Entity {
    constructor(game, x, y) {
        super(game, x, y, 10, 10);
        this.speed = 10;
        this.markedForDeletion = false;
    }

    update(deltaTime) {
        this.x += this.speed;
        if (this.x > this.game.width) {
            this.markedForDeletion = true;
        }
    }

    draw(context) {
        context.fillStyle = '#ff0000'; // Red bullet
        context.beginPath();
        context.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
        context.fill();
    }
}
