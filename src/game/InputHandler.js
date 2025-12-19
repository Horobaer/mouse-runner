export default class InputHandler {
    constructor() {
        this.keys = new Set();
        this.keysJustPressed = new Set();
        this.mouse = { x: 0, y: 0, clicked: false, down: false };

        window.addEventListener('keydown', e => {
            if (!this.keys.has(e.code)) {
                this.keysJustPressed.add(e.code);
            }
            this.keys.add(e.code);
        });

        window.addEventListener('keyup', e => {
            this.keys.delete(e.code);
        });

        window.addEventListener('mousedown', e => {
            this.mouse.down = true;
            this.mouse.clicked = true;
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseup', e => {
            this.mouse.down = false;
        });

        // Also support touch for mobile check (basic)
        window.addEventListener('touchstart', () => {
            this.keys.add('Space'); // Treat touch as jump
            this.keysJustPressed.add('Space');
            this.mouse.clicked = true;
        });
        window.addEventListener('touchend', () => {
            this.keys.delete('Space');
        });
    }

    isDown(code) {
        return this.keys.has(code);
    }

    // Check if key was pressed exactly this frame (consumer must reset/it auto resets via logic if we wanted, but let's clear it manually or use a frame cleaner?)
    // Actually, simpler: make isPressed consume the event like isClicked
    isPressed(code) {
        if (this.keysJustPressed.has(code)) {
            this.keysJustPressed.delete(code);
            return true;
        }
        return false;
    }

    // Check if clicked exactly this frame (consumer must reset)
    isClicked() {
        if (this.mouse.clicked) {
            this.mouse.clicked = false;
            return true;
        }
        return false;
    }
}
