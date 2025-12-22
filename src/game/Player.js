import Entity from './Entities.js';

export default class Player extends Entity {
    constructor(game) {
        super(game, 100, game.height - 50 - 50, 64, 64); // Positioned at x=100, y=ground
        this.grounded = true;
        this.height = 50;
        this.color = '#888';

        this.vy = 0;
        this.weight = 1;
        this.jumpStrength = -11;
        this.grounded = false;

        // Visuals
        this.color = '#ff9900'; // Placeholder mouse color
    }

    update(deltaTime) {
        // Jumping (Multi-jump / Flappy style)
        if (this.game.input.didJump()) {
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
        context.restore();

        // Cute Mouse Drawing (Kawaii Style)
        context.save();
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;

        // Fat factor based on cheese
        const fatFactor = 1 + (this.game.cheeseCount || 0) * 0.02; // More noticeable fatness

        context.translate(centerX, centerY);
        context.scale(fatFactor, 1);

        // Body (Circle/Soft Oval)
        context.beginPath();
        context.ellipse(0, 10, this.width / 2, this.height / 2.5, 0, 0, Math.PI * 2);
        context.fillStyle = this.color || '#A0A0A0';
        context.fill();

        // Ears (Large and Round)
        context.fillStyle = '#808080';
        context.beginPath();
        context.arc(-20, -15, 18, 0, Math.PI * 2); // Left Ear
        context.arc(20, -15, 18, 0, Math.PI * 2);  // Right Ear
        context.fill();

        // Inner Ears (Pink)
        context.fillStyle = '#FFC0CB';
        context.beginPath();
        context.arc(-20, -15, 10, 0, Math.PI * 2);
        context.arc(20, -15, 10, 0, Math.PI * 2);
        context.fill();

        // Eyes (Large, Black, with Sparkles)
        context.fillStyle = 'black';
        context.beginPath();
        context.arc(-12, 0, 5, 0, Math.PI * 2);
        context.arc(12, 0, 5, 0, Math.PI * 2);
        context.fill();

        // Eye Sparkles
        context.fillStyle = 'white';
        context.beginPath();
        context.arc(-10, -2, 2, 0, Math.PI * 2);
        context.arc(14, -2, 2, 0, Math.PI * 2);
        context.fill();

        // Cheeks (Pink)
        context.globalAlpha = 0.6;
        context.fillStyle = '#FF69B4'; // HotPink
        context.beginPath();
        context.arc(-22, 8, 6, 0, Math.PI * 2);
        context.arc(22, 8, 6, 0, Math.PI * 2);
        context.fill();
        context.globalAlpha = 1.0;

        // Nose (Small Pink Button)
        context.fillStyle = '#FFC0CB';
        context.beginPath();
        context.arc(0, 5, 4, 0, Math.PI * 2);
        context.fill();

        // Whiskers
        context.strokeStyle = '#505050';
        context.lineWidth = 2;
        context.beginPath();
        // Left
        context.moveTo(-10, 5); context.lineTo(-35, 0);
        context.moveTo(-10, 8); context.lineTo(-35, 10);
        // Right
        context.moveTo(10, 5); context.lineTo(35, 0);
        context.moveTo(10, 8); context.lineTo(35, 10);
        context.stroke();

        // Tail
        context.strokeStyle = '#FFC0CB';
        context.lineWidth = 4;
        context.lineCap = 'round';
        context.beginPath();
        context.moveTo(-25, 20);
        context.quadraticCurveTo(-45, 10, -50, 30);
        context.stroke();

        context.restore();

        // Debug box (optional, remove later if needed)
        // context.strokeStyle = 'red';
        // context.lineWidth = 1;
        // context.strokeRect(this.x, this.y, this.width, this.height);
    }
}
