import Entity from './Entities.js';

export default class Cat extends Entity {
    constructor(game) {
        super(game, game.width, game.height - 50 - 60, 80, 60); // Slightly larger than standard enemy
        this.markedForDeletion = false;
        // Cats move faster than the world scroll, effectively "running" towards player
        this.runSpeed = 5;
    }

    update(deltaTime) {
        // Total speed = World Scroll + Run Speed
        this.x -= (this.game.world.speed + this.runSpeed);

        if (this.x < 0 - this.width) {
            this.markedForDeletion = true;
        }
    }

    draw(context) {
        context.save();
        context.translate(this.x, this.y);

        // Body (Softer Orange rectangle/oval combo)
        context.fillStyle = '#FFA500'; // Orange
        context.beginPath();
        if (context.roundRect) {
            context.roundRect(10, 20, 60, 40, 15);
        } else {
            context.rect(10, 20, 60, 40); // Fallback
        }
        context.fill();

        // Head (Round)
        context.beginPath();
        context.arc(20, 25, 28, 0, Math.PI * 2);
        context.fill();

        // Ears (Pointy but softer)
        context.beginPath();
        context.moveTo(5, 10);
        context.lineTo(12, -12); // Left Tip
        context.lineTo(25, 10);
        context.fill();

        context.beginPath();
        context.moveTo(25, 10);
        context.lineTo(38, -12); // Right Tip
        context.lineTo(45, 10);
        context.fill();

        // Inner Ears
        context.fillStyle = '#FFDAB9'; // PeachPuff
        context.beginPath();
        context.moveTo(8, 5); context.lineTo(12, -5); context.lineTo(22, 5);
        context.fill();
        context.beginPath();
        context.moveTo(28, 5); context.lineTo(38, -5); context.lineTo(42, 5);
        context.fill();

        // Eyes (Big and cute)
        context.fillStyle = 'black';
        context.beginPath();
        context.arc(12, 18, 4, 0, Math.PI * 2);
        context.arc(32, 18, 4, 0, Math.PI * 2);
        context.fill();

        // Nose (Small triangle)
        context.fillStyle = '#FF69B4'; // HotPink
        context.beginPath();
        context.moveTo(22, 28);
        context.lineTo(19, 25);
        context.lineTo(25, 25);
        context.fill();

        // Mouth ('w' shape)
        context.strokeStyle = 'black';
        context.lineWidth = 1.5;
        context.beginPath();
        context.moveTo(22, 28);
        context.quadraticCurveTo(24, 30, 26, 28);
        context.moveTo(22, 28);
        context.quadraticCurveTo(20, 30, 18, 28);
        context.stroke();

        // Whiskers
        context.strokeStyle = 'white';
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(35, 25); context.lineTo(50, 22);
        context.moveTo(35, 28); context.lineTo(50, 28);
        context.moveTo(35, 31); context.lineTo(50, 34);
        context.stroke();

        // Paws (hidden or simple circles)
        context.fillStyle = 'white';
        context.beginPath();
        context.arc(20, 60, 6, 0, Math.PI * 2);
        context.arc(60, 60, 6, 0, Math.PI * 2);
        context.fill();

        context.restore();
    }
}
