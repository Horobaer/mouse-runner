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
        window.addEventListener('touchstart', (e) => {
            // Prevent default to avoid scrolling/zooming on rapid taps
            if (e.target.tagName === 'CANVAS') {
                e.preventDefault();
            }
            this.keys.add('Space'); // Keep Space mapping for compatibility
            this.keysJustPressed.add('Space');

            // Register a specific touch inputs if we want to separate them later
            this.keys.add('Touch');
            this.keysJustPressed.add('Touch');

            this.mouse.clicked = true;
        }, { passive: false });

        window.addEventListener('touchend', (e) => {
            // e.preventDefault(); // Sometimes needed, but passive defaults are complex
            this.keys.delete('Space');
            this.keys.delete('Touch');
        });
    }

    isDown(code) {
        return this.keys.has(code);
    }

    // Check if key was pressed exactly this frame
    isPressed(code) {
        if (this.keysJustPressed.has(code)) {
            this.keysJustPressed.delete(code);
            return true;
        }
        return false;
    }

    // Abstract method to check for any jump input (Space or Touch)
    didJump() {
        return this.isPressed('Space') || this.isPressed('Touch') || this.isClicked();
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
