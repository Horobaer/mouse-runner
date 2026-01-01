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

        // --- DRAW CHEESE PARAGLIDER ---
        if (this.isGliding) {
            // ... (existing code for glider)
            const canopyY = -100 * fatFactor;
            const canopyWidth = 80 * fatFactor;
            const canopyHeight = 40 * fatFactor;

            // Strings
            context.strokeStyle = '#ecf0f1'; // White/Grey strings
            context.lineWidth = 1.5;
            context.beginPath();
            // Left String
            context.moveTo(-10, -10); // From mouse back
            context.lineTo(-canopyWidth / 2 + 10, canopyY + canopyHeight);
            // Right String
            context.moveTo(10, -10); // From mouse front
            context.lineTo(canopyWidth / 2 - 10, canopyY + canopyHeight);
            context.stroke();

            // Canopy (Cheese Wedge / Arc)
            context.fillStyle = '#FFD700'; // Cheese Gold
            context.beginPath();
            // Draw a semi-circle/arc for the parachute
            context.arc(0, canopyY + canopyHeight, canopyWidth / 2, Math.PI, 0);
            // Close the bottom flat
            context.lineTo(-canopyWidth / 2, canopyY + canopyHeight);
            context.fill();

            // Cheese Holes on Chute
            context.fillStyle = '#FFA500'; // Darker Orange for holes
            context.beginPath();
            context.arc(-20 * fatFactor, canopyY + 15 * fatFactor, 6 * fatFactor, 0, Math.PI * 2);
            context.arc(15 * fatFactor, canopyY + 10 * fatFactor, 8 * fatFactor, 0, Math.PI * 2);
            context.arc(0, canopyY + 25 * fatFactor, 4 * fatFactor, 0, Math.PI * 2);
            context.fill();
        } else if (this.vy < 0 && !this.grounded) {
            // Bigger, Cuter Wings!
            const flap = Math.sin(this.animTimer * 15); // Slightly slower, majestic flap
            const wingY = -35 + flap * 10; // Higher start, wider flap

            context.save();
            context.fillStyle = '#ffffff';
            context.strokeStyle = '#81d4fa'; // Light blue outline
            context.lineWidth = 2.5;

            // Helper to draw a cute round wing
            const drawCuteWing = (isFront) => {
                context.beginPath();
                // Wing Shape (Round & bubbly)
                // Start from body center
                context.moveTo(0, 0);
                // Top curve - big and round
                context.bezierCurveTo(20, -40, 60, -30, 70, 0);
                // Bottom curve - rounded back to body
                context.bezierCurveTo(60, 20, 20, 15, 0, 0);

                context.fill();
                context.stroke();

                // Inner detail (feathers line)
                if (isFront) {
                    context.beginPath();
                    context.moveTo(15, -5);
                    context.lineTo(45, -5);
                    context.strokeStyle = '#e1f5fe';
                    context.lineWidth = 1;
                    context.stroke();
                }
            };

            // Back Wing (Left from viewer)
            context.save();
            context.translate(-10 * fatFactor, wingY);
            context.scale(-1, 1); // Flip horizontally
            context.rotate(flap * 0.2 - 0.2); // Rotated slightly back
            drawCuteWing(false);
            context.restore();

            // Front Wing (Right from viewer)
            context.save();
            context.translate(10 * fatFactor, wingY);
            context.rotate(flap * 0.2 + 0.2); // Rotated slightly forward
            drawCuteWing(true);
            context.restore();

            context.restore();
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
