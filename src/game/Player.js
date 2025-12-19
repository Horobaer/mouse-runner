import Entity from './Entities.js';

export default class Player extends Entity {
    constructor(game) {
        super(game, 100, 0, 64, 64); // Positioned at x=100
        this.vy = 0;
        this.height = 50;
        this.color = '#888';

        this.vy = 0;
        this.weight = 1;
        this.jumpStrength = -22;
        this.grounded = false;

        // Visuals
        this.color = '#ff9900'; // Placeholder mouse color
    }

    update(deltaTime) {
        // Jumping (Multi-jump / Flappy style)
        if (this.game.input.isPressed('Space')) {
            this.vy = this.jumpStrength;
            this.grounded = false;
        }

        // Vertical Physics
        this.y += this.vy;

        // Gravity
        if (!this.grounded) {
            this.vy += this.weight;
        } else {
            this.vy = 0;
        }

        // Shooting
        if (this.game.input.isClicked()) {
            this.game.shoot(this.x + this.width, this.y + this.height / 2);
        }

        // Ground collision (simple floor for now)
        // Ensure player stays on ground
        if (this.y > this.game.height - this.height - 50) { // 50 is ground height
            this.y = this.game.height - this.height - 50;
            this.grounded = true;
        }
    }

    draw(context) {
        context.save();
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;

        // Scale by 1% per cheese (only width/x-axis to get 'fatter')
        const fatFactor = 1 + (this.game.cheeseCount || 0) * 0.01;

        context.translate(centerX, centerY);
        context.scale(fatFactor, 1);
        context.translate(-centerX, -centerY);

        // Draw Mouse Body (Oval)
        // Body
        context.beginPath();
        context.ellipse(this.x + this.width / 2, this.y + this.height / 2 + 10, this.width / 2, this.height / 3, 0, 0, Math.PI * 2);
        context.fillStyle = this.color || '#888'; // Use instance color
        context.fill();

        // Head
        context.beginPath();
        context.arc(this.x + this.width * 0.7, this.y + this.height * 0.4, 20, 0, Math.PI * 2);
        context.fill();

        // Ears
        context.fillStyle = '#696969'; // Dim Gray
        context.beginPath();
        context.arc(this.x + this.width * 0.6, this.y + this.height * 0.2, 12, 0, Math.PI * 2);
        context.arc(this.x + this.width * 0.8, this.y + this.height * 0.2, 12, 0, Math.PI * 2);
        context.fill();

        // Eyes
        context.fillStyle = 'black';
        context.beginPath();
        context.arc(this.x + this.width * 0.75, this.y + this.height * 0.35, 3, 0, Math.PI * 2);
        context.fill();

        // Nose
        context.fillStyle = 'pink';
        context.beginPath();
        context.arc(this.x + this.width * 0.85, this.y + this.height * 0.4, 3, 0, Math.PI * 2);
        context.fill();

        // Tail
        context.strokeStyle = 'pink';
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(this.x + 10, this.y + this.height / 2 + 10);
        context.quadraticCurveTo(this.x - 20, this.y + this.height / 2 - 10, this.x - 10, this.y + this.height / 2 + 20);
        context.stroke();

        context.restore();

        // Debug box (optional, remove later if needed)
        // context.strokeStyle = 'red';
        // context.lineWidth = 1;
        // context.strokeRect(this.x, this.y, this.width, this.height);
    }
}
