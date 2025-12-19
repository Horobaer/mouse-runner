import Entity from './Entities.js';

export default class Cheese extends Entity {
    constructor(game) {
        // Random Y position, favoring air (upper 2/3 of screen)
        // Screen height is game.height (~ground is at game.height - 50)
        // We want them jumpable.
        const groundY = game.height - 50;
        const jumpHeight = 150;
        const y = groundY - 50 - Math.random() * jumpHeight * 1.5;

        super(game, game.width, y, 40, 40);
        this.vx = -this.game.world.speed;
        this.image = null; // Could add sprite later
    }

    update(deltaTime) {
        this.x += this.vx;
        if (this.x + this.width < 0) this.markedForDeletion = true;
    }

    draw(context) {
        // Draw a yellow wedge/triangle or circle
        context.fillStyle = '#f1c40f'; // Cheese Yellow

        // Draw wedge shape
        context.beginPath();
        context.moveTo(this.x, this.y);
        context.lineTo(this.x + this.width, this.y + this.height / 2);
        context.lineTo(this.x, this.y + this.height);
        context.closePath();
        context.fill();
        context.strokeStyle = '#000';
        context.lineWidth = 2;
        context.stroke();

        // Add holes
        context.fillStyle = '#d35400';
        context.beginPath();
        context.arc(this.x + 10, this.y + 15, 3, 0, Math.PI * 2);
        context.fill();
        context.beginPath();
        context.arc(this.x + 15, this.y + 30, 4, 0, Math.PI * 2);
        context.fill();
    }
}
