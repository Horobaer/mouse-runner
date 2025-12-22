import Background from './Background.js';

export default class World {
    constructor(game) {
        this.game = game;
        this.width = this.game.width;
        this.height = this.game.height;
        this.speed = 12;
        this.groundHeight = 50;
        this.groundX = 0;
        this.background = new Background(game);
    }

    update(deltaTime) {
        // Scroll ground
        this.groundX -= this.speed;
        if (this.groundX <= -this.width) {
            this.groundX = 0;
        }

        this.background.update(this.speed);
    }

    draw(context) {
        // Draw Parallax Layers
        this.background.draw(context);

        // Draw Ground
        context.fillStyle = '#4CAF50';
        context.fillRect(this.groundX, this.height - this.groundHeight, this.width, this.groundHeight);
        context.fillRect(this.groundX + this.width, this.height - this.groundHeight, this.width, this.groundHeight);
    }
}
