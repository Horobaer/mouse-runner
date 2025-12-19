import Entity from './Entities.js';

export default class Bird extends Entity {
    constructor(game) {
        // Random Y position in the upper half of the screen
        const y = Math.random() * (game.height * 0.5);
        super(game, game.width, y, 40, 30);
        this.speedX = -Math.random() * 3 - 4; // Faster than minimal enemies
        this.speedY = Math.random() * 2 - 1; // Slight vertical bobbing
        this.markedForDeletion = false;
        this.color = '#333';
        this.angle = 0;
    }

    update(deltaTime) {
        this.x += this.speedX + -this.game.world.speed * 0.5;
        this.y += Math.sin(this.angle) * 2; // Wavy flight
        this.angle += 0.1;

        if (this.x < 0 - this.width) {
            this.markedForDeletion = true;
        }
    }

    draw(context) {
        context.fillStyle = this.color;

        // Simple Bird Shape (V shape or body+wings)
        // Body
        context.beginPath();
        context.ellipse(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, this.height / 3, 0, 0, Math.PI * 2);
        context.fill();

        // Wing (flapping visual simulated by simple triangle up or down based on angle)
        context.beginPath();
        if (Math.sin(this.angle) > 0) {
            // Wing Up trigger
            context.moveTo(this.x + 10, this.y + 10);
            context.lineTo(this.x + 20, this.y - 15);
            context.lineTo(this.x + 30, this.y + 10);
        } else {
            // Wing Down
            context.moveTo(this.x + 10, this.y + 10);
            context.lineTo(this.x + 20, this.y + 25);
            context.lineTo(this.x + 30, this.y + 10);
        }
        context.fill();

        // Beak
        context.fillStyle = 'orange';
        context.beginPath();
        context.moveTo(this.x + 5, this.y + 15);
        context.lineTo(this.x - 10, this.y + 20); // Pointing left
        context.lineTo(this.x + 5, this.y + 20);
        context.fill();
    }
}
