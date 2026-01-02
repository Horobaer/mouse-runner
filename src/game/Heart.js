import Entity from './Entities.js';

export default class Heart extends Entity {
    constructor(game) {
        let y, speedX;
        const groundY = game.height - 50;

        // Determine spawn Y and speed based on difficulty
        const difficulty = game.difficulty || 'hard';

        if (difficulty === 'hard') {
            // Hard: Flying anywhere
            y = Math.random() * (game.height - 150) + 50;
            speedX = 0; // Will use world speed multiplier in update
        } else if (difficulty === 'moderate') {
            // Mid: Mostly low level
            y = (game.height * 0.6) + Math.random() * (game.height * 0.2);
            speedX = -Math.random() * 3 - 4; // Bird speed characteristic
        } else {
            // Easy: Ground level mostly
            y = groundY - 60;
            speedX = 0;
        }

        super(game, game.width, y, 40, 40);
        this.difficulty = difficulty;
        this.angle = 0;
        this.baseY = y;
        this.birdSpeed = speedX;

        // Animation
        this.flapAngle = 0;
    }

    update(deltaTime) {
        // Movement Logic
        if (this.difficulty === 'hard') {
            this.x -= this.game.world.speed * 1.4;
            // Also add slight vertical oscillation for "flying" feel even in hard
            this.y = this.baseY + Math.sin(this.angle) * 30;
            this.angle += 0.05;
        } else if (this.difficulty === 'moderate') {
            this.x += this.birdSpeed + (-this.game.world.speed * 0.5);
            // "Flying" wavy pattern
            this.y = this.baseY + Math.sin(this.angle) * 20;
            this.angle += 0.05;
        } else {
            // Easy: Stone-like bounce
            this.x -= this.game.world.speed;
            // Bouncing logic
            this.y = this.baseY - Math.abs(Math.sin(this.angle)) * 150;
            this.angle += 0.03;
        }

        // Flapping Animation
        this.flapAngle += 0.2;

        if (this.x < 0 - this.width) {
            this.markedForDeletion = true;
        }
    }

    draw(context) {
        context.save();
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        context.translate(cx, cy);

        // Flapping wings
        // Angle oscillates between -0.4 and 0.4 radians approx
        const flap = Math.sin(this.flapAngle) * 0.4;

        // Draw Wings (White)
        context.fillStyle = 'rgba(255, 255, 255, 0.9)';
        context.strokeStyle = '#ddd';
        context.lineWidth = 1;

        // Left Wing
        context.save();
        context.translate(-10, -5);
        context.rotate(-flap - 0.2); // Initial offset + flap
        this.drawWing(context, -1);
        context.restore();

        // Right Wing
        context.save();
        context.translate(10, -5);
        context.rotate(flap + 0.2);
        this.drawWing(context, 1);
        context.restore();

        // Draw Cute Heart Body
        // Scale pulse
        const pulse = 1 + Math.sin(this.flapAngle * 0.5) * 0.05;
        context.scale(pulse, pulse);

        context.fillStyle = '#e74c3c'; // Red
        context.strokeStyle = '#c0392b';
        context.lineWidth = 2;

        context.beginPath();
        // Custom heart shape centered at 0,0 locally
        context.moveTo(0, -5);
        context.bezierCurveTo(-15, -20, -35, 0, 0, 25);
        context.bezierCurveTo(35, 0, 15, -20, 0, -5);
        context.fill();
        context.stroke();

        // Cute Face
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        // Eyes
        context.beginPath();
        context.arc(-8, -4, 2.5, 0, Math.PI * 2);
        context.arc(8, -4, 2.5, 0, Math.PI * 2);
        context.fill();

        // Smile
        context.beginPath();
        context.strokeStyle = 'rgba(0,0,0,0.7)';
        context.lineWidth = 1.5;
        context.arc(0, 2, 4, 0.2, Math.PI - 0.2);
        context.stroke();

        // Shine on top left
        context.fillStyle = 'rgba(255, 255, 255, 0.5)';
        context.beginPath();
        context.ellipse(-10, -10, 5, 2.5, -Math.PI / 4, 0, Math.PI * 2);
        context.fill();

        context.restore();
    }

    drawWing(ctx, dir) {
        // dir: -1 (left) or 1 (right)
        // Wing shape relative to attachment
        const w = 22;
        const h = 14;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        // Top edge curve
        ctx.quadraticCurveTo(dir * w * 0.5, -h, dir * w, -h * 0.5);
        // Tips / Feathers
        ctx.lineTo(dir * w * 1.1, 0);
        // Bottom edge curve back
        ctx.quadraticCurveTo(dir * w * 0.5, h * 0.5, 0, 5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}
