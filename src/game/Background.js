class Layer {
    constructor(game, width, height, speedModifier, color, type) {
        this.game = game;
        this.width = width;
        this.height = height;
        this.speedModifier = speedModifier;
        this.color = color;
        this.type = type; // 'mountains', 'hills', 'clouds'
        this.x = 0;
        this.y = 0;
    }

    update(gameSpeed) {
        this.speed = gameSpeed * this.speedModifier;
        this.x -= this.speed;
        if (this.x <= -this.width) {
            this.x = 0;
        }
    }

    draw(context) {
        context.fillStyle = this.color;

        // We draw the layer twice to create seamless scrolling
        this.drawShape(context, this.x);
        this.drawShape(context, this.x + this.width);
    }

    drawShape(context, xOffset) {
        context.beginPath();
        if (this.type === 'mountains') {
            // Reference:
            // moveTo(i, height)
            // lineTo(i+width*.2, height-200) ...
            context.moveTo(xOffset, this.height);
            context.lineTo(xOffset + this.width * 0.2, this.height - 200);
            context.lineTo(xOffset + this.width * 0.4, this.height - 100);
            context.lineTo(xOffset + this.width * 0.6, this.height - 250);
            context.lineTo(xOffset + this.width * 0.8, this.height - 150);
            context.lineTo(xOffset + this.width, this.height);
        } else if (this.type === 'hills') {
            // Reference:
            // bezierCurveTo(i+width/4, height-150, i+width/2, height-50, i+width, height)
            context.moveTo(xOffset, this.height);
            context.bezierCurveTo(
                xOffset + this.width / 4, this.height - 150,
                xOffset + this.width / 2, this.height - 50,
                xOffset + this.width, this.height
            );
        } else if (this.type === 'clouds') {
            // Reference:
            // drawCloud(i+100, 100), (i+400, 150), (i+800, 80)
            this.drawCloud(context, xOffset + 100, 100);
            this.drawCloud(context, xOffset + 400, 150);
            this.drawCloud(context, xOffset + 800, 80);
            return;
        }
        context.lineTo(xOffset + this.width, this.height);
        context.lineTo(xOffset, this.height);
        context.fill();
    }

    drawCloud(context, x, y) {
        context.beginPath();
        context.arc(x, y, 30, 0, Math.PI * 2);
        context.arc(x + 25, y - 10, 35, 0, Math.PI * 2);
        context.arc(x + 50, y, 30, 0, Math.PI * 2);
        context.fill();
    }
}

export default class Background {
    constructor(game) {
        this.game = game;
        this.width = game.width;
        this.height = game.height;
        this.layers = [];

        // Add layers
        // Sky is drawn in update loop of World or here, we can just fill rect.

        this.layers.push(new Layer(game, this.width, this.height, 0.2, '#FFEBEE', 'clouds')); // Clouds (Very Light Red)
        this.layers.push(new Layer(game, this.width, this.height, 0.1, '#EF9A9A', 'mountains')); // Mountains (Light Red)
        this.layers.push(new Layer(game, this.width, this.height, 0.5, '#C62828', 'hills')); // Hills (Dark Red)
    }

    update(speed) {
        this.layers.forEach(layer => layer.update(speed));
    }

    draw(context) {
        // Draw Sky based on Difficulty
        // Draw Sky based on Difficulty
        let skyColor = '#FF0000'; // Default (Moderate) - Red
        const difficulty = this.game.difficulty;

        if (difficulty === 'hard') {
            skyColor = '#8B0000'; // Dark Red for Hard
        } else if (difficulty === 'easy') {
            skyColor = '#FFCDD2'; // Light Red for Easy
        }

        context.fillStyle = skyColor;
        context.fillRect(0, 0, this.width, this.height);

        this.layers.forEach(layer => layer.draw(context));
    }
}
