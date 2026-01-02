import Entity from './Entities.js';

export default class Cat extends Entity {
    constructor(game, canJump = false) {
        // Cats are larger: 150x150? Adjust as needed.
        // Ground is game.height - 50.
        super(game, game.width, game.height - 50 - 100, 100, 100);
        this.speedX = -(this.game.world.speed + 1); // Move slightly faster than world

        this.markedForDeletion = false;
        this.color = '#e67e22'; // Orange cat

        // Animation
        this.animTimer = 0;

        // Jump Logic
        this.canJump = canJump;
        this.hasJumped = false;
        this.vy = 0;
        this.weight = 1;
        this.groundY = game.height - 50 - 100; // Original Y (Ground)
    }

    update(deltaTime) {
        // Move left
        this.x += this.speedX;

        // Animation Tick
        this.animTimer += deltaTime * 0.008;

        // Jump Logic
        if (this.canJump && !this.hasJumped) {
            // Random chance to jump if on ground
            if (this.y >= this.groundY && Math.random() < 0.01) {
                this.vy = -25; // Jump strength
                this.hasJumped = true;
            }
        }

        // Apply Gravity
        this.y += this.vy;
        if (this.y < this.groundY) {
            this.vy += this.weight;
        } else {
            this.y = this.groundY;
            this.vy = 0;
        }

        if (this.x < 0 - this.width) {
            this.markedForDeletion = true;
        }
    }

    draw(context) {
        context.save();
        const x = this.x;
        const y = this.y;
        const w = this.width;
        const h = this.height;

        // Animation Values
        const bobY = Math.sin(this.animTimer) * 5; // Up and down body movement
        const tailWag = Math.cos(this.animTimer) * 0.5; // Tail rotation
        const legMove = Math.sin(this.animTimer * 1.5) * 10; // Leg offset

        // Shadow (Static on ground, scales slightly with bob?)
        context.fillStyle = 'rgba(0,0,0,0.2)';
        context.beginPath();
        context.ellipse(x + w / 2, y + h - 5, w / 2 - 10 - bobY, 10, 0, 0, Math.PI * 2);
        context.fill();

        // Apply Bobbing to everything else
        context.translate(0, bobY);

        // Tail (Draw first so it's behind)
        context.save();
        context.translate(x + w - 20, y + h / 2 + 10);
        context.rotate(tailWag - 0.5); // Base angle + wag
        context.fillStyle = '#FF9933';
        context.beginPath();
        context.moveTo(0, 0);
        context.quadraticCurveTo(30, -20, 40, 10); // Curvy tail
        context.lineTo(25, 10);
        context.quadraticCurveTo(20, -10, 0, 10);
        context.fill();
        context.restore();

        // Cat Body (Round Loaf shape)
        context.fillStyle = '#FF9933'; // Bright Ginger Orange
        context.beginPath();
        // Body ellipse
        context.ellipse(x + w / 2, y + h / 2 + 10, w / 2 - 5, h / 2 - 15, 0, 0, Math.PI * 2);
        context.fill();

        // Legs (Little nubs moving)
        context.fillStyle = '#E67E22'; // Darker orange for legs
        // Front Left
        context.beginPath(); context.arc(x + 30 + legMove, y + h - 15, 12, 0, Math.PI * 2); context.fill();
        // Front Right
        context.beginPath(); context.arc(x + 30 - legMove, y + h - 15, 12, 0, Math.PI * 2); context.fill();
        // Back Left
        context.beginPath(); context.arc(x + w - 30 + legMove, y + h - 15, 12, 0, Math.PI * 2); context.fill();
        // Back Right
        context.beginPath(); context.arc(x + w - 30 - legMove, y + h - 15, 12, 0, Math.PI * 2); context.fill();

        // Fur Fluff (Circles to make it fluffy - redraw over legs)
        context.fillStyle = '#FF9933';
        context.beginPath();
        context.arc(x + 20, y + h - 25, 15, 0, Math.PI * 2); // Bottom left
        context.arc(x + w - 20, y + h - 25, 15, 0, Math.PI * 2); // Bottom right
        context.fill();

        // Head Group (Moves slightly less or delayed? strict sync for now)
        // Ears
        const drawEar = (ex, ey, rot) => {
            context.save();
            context.translate(ex, ey);
            context.rotate(rot);
            context.fillStyle = '#FF9933';
            context.beginPath();
            context.moveTo(-15, 0);
            context.lineTo(0, -30);
            context.lineTo(15, 0);
            context.fill();
            // Pink Inner
            context.fillStyle = '#FFC0CB';
            context.beginPath();
            context.moveTo(-8, 0);
            context.lineTo(0, -20);
            context.lineTo(8, 0);
            context.fill();
            context.restore();
        };
        drawEar(x + 25, y + 30, -0.3 + Math.sin(this.animTimer) * 0.05); // Left
        drawEar(x + w - 25, y + 30, 0.3 - Math.sin(this.animTimer) * 0.05); // Right

        // Face details
        // Eyes (Big and Cute)
        context.fillStyle = 'white';
        context.beginPath();
        context.arc(x + 30, y + 50, 12, 0, Math.PI * 2); // Left
        context.arc(x + w - 30, y + 50, 12, 0, Math.PI * 2); // Right
        context.fill();

        // Pupils (Move slightly with bob?)
        context.fillStyle = 'black';
        context.beginPath();
        context.arc(x + 32, y + 50, 5, 0, Math.PI * 2);
        context.arc(x + w - 32, y + 50, 5, 0, Math.PI * 2);
        context.fill();

        // Shine in eyes
        context.fillStyle = 'white';
        context.beginPath();
        context.arc(x + 34, y + 48, 2, 0, Math.PI * 2);
        context.arc(x + w - 34, y + 48, 2, 0, Math.PI * 2);
        context.fill();

        // Nose
        context.fillStyle = 'pink';
        context.beginPath();
        context.ellipse(x + w / 2, y + 65, 4, 3, 0, 0, Math.PI * 2);
        context.fill();

        // Whiskers (Bounce a bit)
        context.strokeStyle = 'white';
        context.lineWidth = 2;
        const whiskBob = Math.cos(this.animTimer * 2) * 2;
        context.beginPath();
        // Left
        context.moveTo(x + 25, y + 65); context.lineTo(x + 5, y + 60 + whiskBob);
        context.moveTo(x + 25, y + 68); context.lineTo(x + 5, y + 70 + whiskBob);
        // Right
        context.moveTo(x + w - 25, y + 65); context.lineTo(x + w - 5, y + 60 + whiskBob);
        context.moveTo(x + w - 25, y + 68); context.lineTo(x + w - 5, y + 70 + whiskBob);
        context.stroke();

        context.restore();
    }
}
