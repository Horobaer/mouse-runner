import Entity from './Entities.js';

export default class Heart extends Entity {
    constructor(game, isEasyMode) {
        // Position similar to cheese but maybe rarer/harder?
        // Game logic passes isEasyMode, maybe adjust speed or position?
        // For now, let's keep it accessible.

        const groundY = game.height - 50;
        const jumpHeight = 150;
        // Random height reachable by jump
        const y = groundY - 50 - Math.random() * jumpHeight * 1.2;

        // Reference size: 50x50
        super(game, game.width, y, 50, 50);
        this.vx = -this.game.world.speed;

        // Pulse animation
        this.pulseTimer = 0;
    }

    update(deltaTime) {
        this.x += this.vx;
        this.y += Math.sin(this.pulseTimer) * 2; // Wavy movement
        this.pulseTimer += 0.1;
        if (this.x + this.width < 0) this.markedForDeletion = true;
    }

    draw(context) {
        context.save();
        context.shadowBlur = 10;
        context.shadowColor = 'red';
        context.fillStyle = '#e74c3c';

        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const t = this.width / 2;

        // Draw Heart Body (Complex Bezier from reference)
        context.beginPath();
        context.moveTo(centerX, centerY + t * 0.3);
        context.bezierCurveTo(centerX, centerY, centerX - t, centerY - t, centerX - t * 0.5, centerY - t);
        context.bezierCurveTo(centerX - t * 0.1, centerY - t, centerX, centerY - t * 0.5, centerX, centerY - t * 0.3);
        context.bezierCurveTo(centerX, centerY - t * 0.5, centerX + t * 0.1, centerY - t, centerX + t * 0.5, centerY - t);
        context.bezierCurveTo(centerX + t, centerY - t, centerX + t, centerY, centerX, centerY + t * 0.3);
        context.fill();

        // Draw Wings (Flapping)
        context.fillStyle = 'rgba(255, 255, 255, 0.8)';
        context.beginPath();
        const flap = Math.sin(this.pulseTimer) * 5;

        if (Math.sin(this.pulseTimer) > 0) {
            // Wings Up
            context.moveTo(centerX - 15, centerY - 10 + flap);
            context.lineTo(centerX - 35, centerY - 25 + flap);
            context.lineTo(centerX - 20, centerY + 5 + flap);

            context.moveTo(centerX + 15, centerY - 10 + flap);
            context.lineTo(centerX + 35, centerY - 25 + flap);
            context.lineTo(centerX + 20, centerY + 5 + flap);
        } else {
            // Wings Down
            context.moveTo(centerX - 15, centerY - 5 + flap);
            context.lineTo(centerX - 35, centerY + 15 + flap);
            context.lineTo(centerX - 20, centerY - 5 + flap);

            context.moveTo(centerX + 15, centerY - 5 + flap);
            context.lineTo(centerX + 35, centerY + 15 + flap);
            context.lineTo(centerX + 20, centerY - 5 + flap);
        }
        context.fill();

        context.restore();
    }
}
