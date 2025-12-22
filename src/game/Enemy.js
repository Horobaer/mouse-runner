import Entity from './Entities.js';

export default class Enemy extends Entity {
    constructor(game) {
        super(game, game.width, game.height - 50 - 50, 50, 50); // Start off-screen right
        this.markedForDeletion = false;
        this.color = '#8B0000'; // Dark Red
    }

    update(deltaTime) {
        this.x -= this.game.world.speed; // Move exactly with world scroll

        // Actually since the world "scrolls", the enemies should just move left relative to camera
        // But in this simple engine, the world scroll is visual. 
        // We simulate relative movement.

        if (this.x < 0 - this.width) {
            this.markedForDeletion = true;
        }
    }

    draw(context) {
        // Draw Cute Stone
        context.save();
        context.translate(this.x, this.y);

        // Stone Body (Round/Irregular)
        context.fillStyle = '#708090'; // SlateGray
        context.beginPath();
        context.arc(this.width / 2, this.height / 2, this.width / 2, 0, Math.PI * 2);
        context.fill();

        // Highlight (Shine)
        context.fillStyle = '#B0C4DE'; // LightSteelBlue
        context.beginPath();
        context.arc(this.width / 2 - 10, this.height / 2 - 10, 5, 0, Math.PI * 2);
        context.fill();

        // Angry/Cute Face

        // Eyes (Slanted lines for "angry" but cute)
        context.strokeStyle = 'white';
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(10, 15); context.lineTo(20, 20);
        context.moveTo(40, 15); context.lineTo(30, 20);
        context.stroke();

        // Mouth (Grumpy line)
        context.strokeStyle = 'white';
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(15, 35);
        context.quadraticCurveTo(25, 30, 35, 35);
        context.stroke();

        context.restore();
    }
}
