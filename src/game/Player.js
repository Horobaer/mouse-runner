import Entity from './Entities.js';

export default class Player extends Entity {
    constructor(game) {
        super(game, 100, 0, 96, 96); // Approx size from reference (width=96, height=75?)
        // Reference uses width=96, height=75 in constructor super call.

        this.vy = 0;
        this.height = 75;
        this.color = '#888';

        this.weight = 1;
        this.jumpStrength = -20;
        this.grounded = false;

        // Visuals
        this.color = '#ff9900'; // Placeholder mouse color

        this.isInvulnerable = false;
        this.invulnerabilityTimer = 0;
        this.flashSpeed = 0;

        // Animations
        this.angle = 0;
        this.isRolling = false;
        this.animTimer = 0; // Unified timer
        this.glideTimer = 0;
        this.isGliding = false;
    }

    update(deltaTime) {
        // Jumping (Multi-jump / Flappy style)
        if (this.game.input.didJump()) {
            this.vy = this.jumpStrength;
            this.grounded = false;
        }

        // Vertical Physics
        this.y += this.vy;
        this.animTimer += deltaTime * 0.01;

        // Hit Timer (Invulnerability)
        if (this.isInvulnerable) {
            this.invulnerabilityTimer += deltaTime;
            this.flashSpeed += deltaTime;
            if (this.invulnerabilityTimer > 2000) { // 2s invulnerability
                this.isInvulnerable = false;
                this.invulnerabilityTimer = 0;
                this.isRolling = false;
            }
        }

        // Gliding Logic
        this.isGliding = false;
        if (this.grounded) {
            this.vy = 0;
            this.glideTimer = 0;
        } else {
            // If holding space, falling, AND within glide time limit
            if (this.vy > 0 && this.game.input.isDown('Space') && this.glideTimer < (this.maxGlideTime || 1000)) {
                this.vy = 3; // Slow fall
                this.isGliding = true;
                this.glideTimer += deltaTime;
            } else {
                this.vy += this.weight;
                // If we run out of glide time, we don't reset it until grounded, 
                // but we might want to ensure we don't accidentally glide if we tap space again?
                // The check `this.glideTimer < max` handles it.
            }
        }

        // Shooting - REMOVED

        // Ground collision
        if (this.y > this.game.height - this.height - 50) {
            this.y = this.game.height - this.height - 50;
            this.grounded = true;
        }
    }

    hurt() {
        if (!this.isInvulnerable) {
            this.isInvulnerable = true;
            this.isRolling = true;
            this.invulnerabilityTimer = 0;
        }
    }

    draw(context) {
        context.save();
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;

        let scaleX = 1;
        let scaleY = 1;
        let offsetY = 0;
        let earRotation = 0;
        let rotation = 0;

        const fatFactor = 1 + (this.game.cheeseCount || 0) * 0.01;

        // Hit Rotation (Barrel Roll)
        if (this.isRolling) {
            // Full rotation based on time (approx 2s)
            // Reference: c = this.hitTimer / 500 * Math.PI * 2
            rotation = (this.invulnerabilityTimer / 500) * Math.PI * 2;
        }

        // State-based Animation
        if (this.isGliding) {
            scaleX = 0.9;
            scaleY = 1.1;
            offsetY = Math.sin(this.animTimer * 3) * 3;
            earRotation = -0.2;
        } else if (this.grounded) {
            // Breathing / Walking Bounce
            scaleX = 1 * fatFactor;
            scaleY = 1 - Math.abs(Math.sin(this.animTimer * 1.5)) * 0.1;
            offsetY = Math.abs(Math.sin(this.animTimer * 1.5)) * 5;
            earRotation = Math.sin(this.animTimer) * 0.1;
        } else if (this.vy < 0) {
            // Jumping Up (Stretch)
            scaleX = 0.8 * fatFactor;
            scaleY = 1.2;
            earRotation = 0.2;
        } else {
            // Falling
            scaleX = 1 * fatFactor;
            scaleY = 1;
            earRotation = -0.2;
        }

        context.translate(centerX, centerY + offsetY);
        context.rotate(rotation);
        context.scale(scaleX, scaleY);

        if (this.isInvulnerable && !this.isRolling) {
            if (Math.floor(this.flashSpeed / 100) % 2 === 0) {
                context.globalAlpha = 0.5;
            }
        }

        // --- DRAW GLIDER (Umbrella/Parachute) ---
        if (this.isGliding) {
            context.strokeStyle = '#5d4037';
            context.lineWidth = 4;
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(0, -75 * fatFactor);
            context.stroke();

            context.fillStyle = '#f1c40f';
            context.beginPath();
            context.arc(0, -75 * fatFactor, 60 * fatFactor, Math.PI, 0);
            context.fill();

            // Spots on glider
            context.fillStyle = '#f39c12';
            context.beginPath();
            context.arc(-22 * fatFactor, -105 * fatFactor, 7 * fatFactor, 0, Math.PI * 2);
            context.arc(30 * fatFactor, -90 * fatFactor, 10 * fatFactor, 0, Math.PI * 2);
            context.arc(0, -120 * fatFactor, 6 * fatFactor, 0, Math.PI * 2);
            context.fill();
        }

        // --- DRAW BODY ---
        context.beginPath();
        context.ellipse(0, 15, this.width / 2, this.height / 3, 0, 0, Math.PI * 2);
        context.fillStyle = this.color || '#888';
        context.fill();

        // --- DRAW LEGS (Walking) ---
        if (this.grounded) {
            context.fillStyle = '#696969';
            const legAnim = Math.sin(this.animTimer * 1.5) * 15;
            context.beginPath();
            context.ellipse(-22 + legAnim, 38, 12, 7, 0, 0, Math.PI * 2);
            context.fill();
            context.beginPath();
            context.ellipse(22 - legAnim, 38, 12, 7, 0, 0, Math.PI * 2);
            context.fill();
        }

        // --- DRAW HEAD ---
        const o = this.width * 0.2;
        const r = -this.height * 0.1;

        context.beginPath();
        context.arc(o, r, 30, 0, Math.PI * 2);
        context.fillStyle = this.color || '#888';
        context.fill();

        // Ears
        context.fillStyle = '#696969';
        context.beginPath();
        context.ellipse(o - 15, r - 22, 18, 18, earRotation, 0, Math.PI * 2);
        context.fill();
        context.beginPath();
        context.ellipse(o + 15, r - 22, 18, 18, -earRotation, 0, Math.PI * 2);
        context.fill();

        // Eyes
        context.fillStyle = 'black';
        context.beginPath();
        context.arc(o + 7, r - 7, 5, 0, Math.PI * 2);
        context.fill();

        // Nose
        context.fillStyle = 'pink';
        context.beginPath();
        context.arc(o + 22, r, 5, 0, Math.PI * 2);
        context.fill();

        // --- DRAW TAIL ---
        const tailWag = Math.sin(this.animTimer * 2) * 15;
        context.strokeStyle = 'pink';
        context.lineWidth = 4;
        context.beginPath();
        context.moveTo(-this.width / 2 + 30, 15);
        context.quadraticCurveTo(-this.width / 2 - 30, -15 + tailWag, -this.width / 2 - 15, 30 + tailWag);
        context.stroke();

        context.restore();
    }
}
