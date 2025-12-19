export default class Entity {
    constructor(game, x, y, width, height) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.markedForDeletion = false;
    }

    update(deltaTime) {
        // Validation / Base logic
    }

    draw(context) {
        // Debug draw
        context.fillStyle = 'red';
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}
