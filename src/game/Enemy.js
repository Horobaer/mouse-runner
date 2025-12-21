import Entity from './Entities.js';

export default class Enemy extends Entity {
    constructor(game) {
        // Reference size: 75x75. Y needs to be strictly on ground.
        // Game height - ground(50) - enemyHeight(75)
        super(game, game.width, game.height - 50 - 75, 75, 75);
        this.speedX = -Math.random() * 4 - 3; // Random speed between -3 and -7
        this.markedForDeletion = false;
        this.color = '#8B0000'; // Dark Red
    }

    update(deltaTime) {
        this.x += this.speedX + -this.game.world.speed * 0.5; // Move left + world scroll effect (pseudo)

        // Actually since the world "scrolls", the enemies should just move left relative to camera
        // But in this simple engine, the world scroll is visual. 
        // We simulate relative movement.

        if (this.x < 0 - this.width) {
            this.markedForDeletion = true;
        }
    }

    draw(context) {
        // Draw Spike/Trap
        context.fillStyle = this.color;
        context.beginPath();
        const bottom = this.y + this.height;
        context.moveTo(this.x, bottom);
        context.lineTo(this.x + this.width / 2, this.y);
        context.lineTo(this.x + this.width, bottom);
        context.lineTo(this.x, bottom);
        context.fill();

        // Metallic shine
        context.fillStyle = 'rgba(255, 255, 255, 0.3)';
        context.beginPath();
        context.moveTo(this.x + 10, bottom);
        context.lineTo(this.x + this.width / 2, this.y + 10);
        context.lineTo(this.x + this.width / 2 + 5, this.y + 20);
        context.lineTo(this.x + 20, bottom);
        context.fill();
    }
}
