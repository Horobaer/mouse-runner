import Entity from './Entities.js';

export default class Cheese extends Entity {
    constructor(game) {
        // Random Y position, favoring air (upper 2/3 of screen)
        // Screen height is game.height (~ground is at game.height - 50)
        // We want them jumpable.
        const groundY = game.height - 50;
        const jumpHeight = 150;
        const y = groundY - 50 - Math.random() * jumpHeight * 1.5;

        // Reference size: 60x60
        super(game, game.width, y, 60, 60);
        this.vx = -this.game.world.speed;
        this.image = null;
    }

    update(deltaTime) {
        this.x += this.vx;
        if (this.x + this.width < 0) this.markedForDeletion = true;
    }

    draw(context) {
        context.save();
        context.translate(this.x, this.y);

        // Cheese Wedge Shape (Cute Cartoon Style)

        // 3D Side (Shadow)
        context.fillStyle = '#FFA500'; // Dark Orange
        context.beginPath();
        context.moveTo(5, this.height - 5);
        context.lineTo(this.width, 5);
        context.lineTo(this.width, this.height - 10);
        context.lineTo(5, this.height + 5);
        context.fill();

        // Top Face (Main Yellow)
        context.fillStyle = '#FFD700'; // Gold
        context.beginPath();
        context.moveTo(5, this.height - 5);
        context.lineTo(this.width, 5);
        context.lineTo(20, 0); // Top point
        context.lineTo(5, this.height - 5);
        context.fill();

        // Outline
        context.strokeStyle = '#D2691E'; // Chocolate
        context.lineWidth = 2;
        context.lineJoin = 'round';
        context.stroke();

        // Holes
        context.fillStyle = '#DAA520'; // GoldenRod
        context.beginPath();
        context.arc(20, 15, 3, 0, Math.PI * 2);
        context.fill();
        context.beginPath();
        context.arc(32, 10, 2, 0, Math.PI * 2);
        context.fill();
        context.beginPath();
        context.arc(25, 25, 1.5, 0, Math.PI * 2);
        context.fill();

        // Cute Face (optional, maybe just holes is enough for cheese? Let's add a tiny smile)
        context.fillStyle = '#000';
        context.beginPath();
        context.arc(12, 12, 1, 0, Math.PI * 2); // Eye
        context.arc(28, 8, 1, 0, Math.PI * 2); // Eye
        context.fill();

        context.strokeStyle = '#000';
        context.lineWidth = 1;
        context.beginPath();
        context.arc(20, 15, 5, 0.2, Math.PI - 0.2); // Smile under holes
        context.stroke();

        context.restore();
    }
}
