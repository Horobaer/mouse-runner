
export class Particle {
    constructor(game, x, y, color) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.color = color;
        // Random velocity in all directions
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.life = 1.0; // 1.0 = 100% life
        this.decay = Math.random() * 0.02 + 0.01; // Fade speed
        this.gravity = 0.1;
        this.markedForDeletion = false;
    }

    update() {
        this.vx *= 0.95; // Air resistance
        this.vy *= 0.95;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;

        this.life -= this.decay;
        if (this.life <= 0) this.markedForDeletion = true;
    }

    draw(context) {
        context.save();
        context.globalAlpha = this.life;
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, 3, 0, Math.PI * 2);
        context.fill();
        context.restore();
    }
}

export default class FireworksManager {
    constructor(game) {
        this.game = game;
        this.particles = [];
        this.fireworkTimer = 0;
        this.fireworkInterval = 400; // Time between auto-launches
    }

    spawn(x, y, color) {
        for (let i = 0; i < 30; i++) {
            this.particles.push(new Particle(this.game, x, y, color));
        }
    }

    update(deltaTime, active = false) {
        // Auto-spawn if active (during celebration)
        if (active) {
            this.fireworkTimer += deltaTime;
            if (this.fireworkTimer > this.fireworkInterval) {
                const x = Math.random() * this.game.width;
                const y = Math.random() * (this.game.height * 0.5); // Top half
                const colors = ['#f1c40f', '#e74c3c', '#3498db', '#9b59b6', '#2ecc71', '#ffffff'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                this.spawn(x, y, color);
                this.fireworkTimer = 0;
            }
        }

        this.particles.forEach(p => p.update());
        this.particles = this.particles.filter(p => !p.markedForDeletion);
    }

    draw(context) {
        this.particles.forEach(p => p.draw(context));
    }
}
