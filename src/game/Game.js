import InputHandler from './InputHandler.js';
import World from './World.js';
import Player from './Player.js';

import Enemy from './Enemy.js';
import Bird from './Bird.js';
import Cheese from './Cheese.js';
import Leaderboard from './Leaderboard.js';
import LanguageManager from './LanguageManager.js';
import Fireworks from './Fireworks.js';
import Heart from './Heart.js';
import Cat from './Cat.js';

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;

        this.input = new InputHandler();
        this.world = new World(this);
        this.player = new Player(this);
        this.leaderboard = new Leaderboard();
        this.languageManager = new LanguageManager();
        this.languageManager.init();

        this.fireworks = new Fireworks();
        this.levelAnnouncementTimer = 0;

        this.currentSuggestedName = ""; // Track for dynamic updates
        this.enemies = []; // Stores both ground enemies and birds
        this.enemyTimer = 0;
        this.enemyInterval = 2000; // ms

        this.cheeses = [];
        this.cheeseTimer = 0;
        this.cheeseInterval = 1000;
        this.cheeseCount = 0;
        this.heartsCollected = 0; // Track collected hearts

        this.lastTime = 0;
        this.gameTime = 0;
        this.started = false;
        this.gameOver = false;
        this.leaderboardShown = false;
        this.restartCooldown = 0;
        this.scoreSubmitted = false;

        this.level = 1;
        this.levelTimer = 0;
        this.levelDuration = 10000; // 10 seconds

        // Lives System
        this.lives = 2; // Start with 2 lives
        this.heartSpawned = false;
        this.catSpawned = false;
        this.started = false;
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
        if (this.world) {
            this.world.width = width;
            this.world.height = height;
        }
    }

    start() {
        const startScreen = document.getElementById('start-screen');
        const startBtn = document.getElementById('start-btn');
        const startInput = document.getElementById('start-player-name');

        // Pre-fill name
        const storedName = localStorage.getItem('mouse_adventure_username');
        const initialName = storedName || this.languageManager.getRandomMouseName();
        startInput.value = initialName;
        if (!storedName) {
            this.currentSuggestedName = initialName;
        }

        // Subscribe to language changes
        this.languageManager.subscribe((lang) => {
            // Update difficulty labels if visible
            const playerEl = document.getElementById('current-player');
            if (playerEl && !playerEl.classList.contains('hidden')) {
                // We need to re-render the player text
            }

            // Update Name Input if it matches the previous suggestion
            if (document.activeElement !== startInput && startInput.value === this.currentSuggestedName) {
                const newName = this.languageManager.getRandomMouseName();
                startInput.value = newName;
                this.currentSuggestedName = newName;
            }
        });

        startBtn.onclick = () => {
            const name = startInput.value || this.languageManager.getRandomMouseName();
            localStorage.setItem('mouse_adventure_username', name);

            // Difficulty Logic
            this.applyDifficultySettings();

            // Apply immediately
            this.world.speed = this.baseSpeed;

            // Update HUD
            const playerEl = document.getElementById('current-player');
            if (playerEl) {
                // Determine difficulty label
                let diffLabel = this.difficulty === 'hard' ? this.languageManager.t('difficultyHard') :
                    (this.difficulty === 'moderate' ? this.languageManager.t('difficultyModerate') : this.languageManager.t('difficultyEasy'));

                playerEl.innerText = this.languageManager.t('player') + ' ' + name + ' (' + diffLabel.toUpperCase() + ')';
                playerEl.classList.remove('hidden');
            }

            // Also update the game-over/leaderboard input for consistency
            const endInput = document.getElementById('player-name');
            if (endInput) endInput.value = name;

            this.started = true;
            startScreen.classList.add('hidden');
            const uiLayer = document.getElementById('ui-layer');
            if (uiLayer) uiLayer.classList.remove('hidden');

            // Allow music to start if user interaction happened
        };

        // Start the background scenery loop
        requestAnimationFrame((t) => {
            this.lastTime = t;
            requestAnimationFrame(this.animate.bind(this));
        });
    }

    animate(timeStamp) {
        if (!this.lastTime) this.lastTime = timeStamp;
        const deltaTime = timeStamp - this.lastTime;
        this.lastTime = timeStamp;

        try {
            // Run loop if game is running OR if it hasn't started (demo mode)
            if (!this.gameOver || !this.started) {
                this.update(deltaTime);
                this.draw();
                requestAnimationFrame((t) => this.animate(t));
            } else {
                // Stop drawing game loop, show leaderboard
                if (!this.leaderboardShown) {
                    this.showLeaderboard();
                    this.leaderboardShown = true;
                    this.restartCooldown = 1.0; // 1 second cooldown
                }

                if (this.restartCooldown > 0) {
                    this.restartCooldown -= deltaTime / 1000;
                }

                // Check for Space to Restart (only if cooldown over)
                const nameInput = document.getElementById('player-name');
                if (this.restartCooldown <= 0 && this.input.didJump() && document.activeElement !== nameInput) {
                    if (this.scoreSubmitted) {
                        this.handleGlobalRestart();
                    }
                }
            }
        } catch (e) {
            console.error("CRITICAL GAME LOOP ERROR:", e);
        }
    }

    handleGlobalRestart() {
        // Reuse stored name logic
        const leaderboardEl = document.getElementById('leaderboard');
        const inputContainer = document.getElementById('name-input-container');

        // We already submitted, so we just restart
        // Ensure UI is hidden
        inputContainer.classList.add('hidden');
        leaderboardEl.classList.add('hidden');

        // Restart
        this.restart();
        requestAnimationFrame(this.animate.bind(this));
    }

    handleScoreSubmission() {
        const nameInput = document.getElementById('player-name');
        const listEl = document.getElementById('leaderboard-list');
        const inputContainer = document.getElementById('name-input-container');
        const restartBtn = document.getElementById('restart-btn');
        const submitBtn = document.getElementById('submit-score');

        const name = nameInput.value || this.languageManager.getRandomMouseName();
        localStorage.setItem('mouse_adventure_username', name);

        // Add Score and get Index
        const highlightIdx = this.leaderboard.addScore(name, (this.gameTime / 1000).toFixed(1), this.level, this.cheeseCount, this.difficulty, this.heartsCollected);

        // Re-render with highlight
        this.renderLeaderboardList(listEl, highlightIdx);

        // Update UI state
        inputContainer.classList.add('hidden');
        restartBtn.classList.remove('hidden');
        submitBtn.onclick = null; // Remove listener

        this.scoreSubmitted = true;
    }

    restart() {
        this.gameOver = false;
        this.leaderboardShown = false;
        this.scoreSubmitted = false;
        this.gameTime = 0;
        this.level = 1;
        this.levelTimer = 0;
        this.cheeseCount = 0; // Reset cheese (missing in original code? assuming cheese resets on game over for score?)
        // Oh wait, cheeseCount was not reset in original code in restart(), but it should be for a new game session score.
        // Actually line 403 in view_file showed cheeseCount being used.
        // Looking at line 208-248 of original code... I don't see cheeseCount reset! 
        // It was line 39 in constructor.
        // I will add cheeseCount reset too just in case, and heartsCollected.
        this.cheeseCount = 0;
        this.heartsCollected = 0;

        // Check for difficulty change on restart screen
        const restartDiffEls = document.getElementsByName('difficulty-restart');
        let newDifficulty = null;
        for (const el of restartDiffEls) {
            if (el.checked) {
                newDifficulty = el.value;
                break;
            }
        }
        if (newDifficulty && newDifficulty !== this.difficulty) {
            this.difficulty = newDifficulty;
        }

        // Apply Difficulty Settings (Speed and Glide)
        this.applyDifficultySettings(this.difficulty);

        this.world = new World(this);
        // CRITICAL FIX: Set speed AFTER creating new world, or pass it in constructor
        this.world.speed = this.baseSpeed;

        this.lastTime = performance.now();

        // Update HUD Name
        const storedName = localStorage.getItem('mouse_adventure_username') || 'Unknown Mouse';
        const playerEl = document.getElementById('current-player');
        if (playerEl) {
            playerEl.innerText = 'Player: ' + storedName;
            playerEl.classList.remove('hidden');
        }

        // Reset Color
        this.player = new Player(this); // Full reset of player state
        this.player.color = '#888';

        // Clear Entities
        this.enemies = [];
        this.cheeses = [];
        this.enemyTimer = 0;
        this.cheeseTimer = 0;

        // Reset Spawning Flags
        this.heartSpawned = false;
        this.catSpawned = false;
        this.lives = 2; // Reset lives
    }

    // shoot(x, y) REMOVED

    update(deltaTime) {
        // --- BACKGROUND SCENERY MODE ---
        if (!this.started) {
            this.level = 1;
            this.levelTimer = 0;
            this.world.speed = 6;
            this.lives = 2;
            // No Player Update, No AI, Just Scrolling
        }

        // Level Progression
        this.levelTimer += deltaTime;
        if (this.started && this.levelTimer > this.levelDuration) {
            this.level++;
            this.levelTimer = 0;
            this.heartSpawned = false; // Reset for next level
            this.catSpawned = false;
            // Increase Difficulty
            this.world.speed += 1; // Faster world
            // Dynamic Color Change
            const colors = ['#888', '#e74c3c', '#3498db', '#9b59b6', '#f1c40f', '#2ecc71'];
            this.player.color = colors[(this.level - 1) % colors.length];

            // Cap minimum interval to avoid impossible spawn rates
            if (this.enemyInterval > 500) {
                this.enemyInterval -= 200; // Faster spawns
            }

            // Level Up Effects
            this.fireworks.explode(this.width / 2, this.height / 2, 100); // Center burst
            this.fireworks.explode(this.width / 4, this.height / 3, 50);
            this.fireworks.explode(this.width * 0.75, this.height / 3, 50);

            this.levelAnnouncementTimer = 3000; // Show for 3 seconds
        }

        if (this.levelAnnouncementTimer > 0) {
            this.levelAnnouncementTimer -= deltaTime;
        }

        this.fireworks.update();

        // Time Scoring
        if (this.started) {
            this.gameTime += deltaTime;
            this.player.update(deltaTime); // Only update player if game started
        }

        this.world.update(deltaTime);

        // Handle Enemies (Spikes and Birds)
        if (this.enemyTimer > this.enemyInterval) {
            // Random chance to spawn Bird or Ground Enemy
            if (Math.random() > 0.5) {
                this.enemies.push(new Bird(this));
            } else {
                this.enemies.push(new Enemy(this));
            }

            // Flying Heart Spawning (Once per level)
            if (!this.heartSpawned) {
                // Guaranteed spawn if we are past 80% of level duration
                const isFailsafe = this.levelTimer > this.levelDuration * 0.8;
                // Random chance (20%) if we are past 20% of level duration
                const isRandomLuck = this.levelTimer > this.levelDuration * 0.2 && Math.random() < 0.2;

                if (isFailsafe || isRandomLuck) {
                    this.enemies.push(new Heart(this));
                    this.heartSpawned = true;
                }
            }

            // Cat Spawning (One per level based on difficulty rules)
            if (!this.catSpawned) {
                const difficulty = this.difficulty;
                let shouldSpawn = false;
                let canJump = false;

                if (difficulty === 'hard') {
                    // Hard: Every level. Level 3+ can jump.
                    shouldSpawn = true;
                    if (this.level >= 3) canJump = true;
                } else if (difficulty === 'moderate') {
                    // Mid: Every level starting Level 3
                    if (this.level >= 3) shouldSpawn = true;
                } else {
                    // Easy: Every 2nd Level (2, 4, 6...)
                    if (this.level % 2 === 0) shouldSpawn = true;
                }

                if (shouldSpawn) {
                    // Spawn logic: Random chance OR Failsafe near end of level
                    // Increased chance to 0.3 (30%) per check
                    // Failsafe: If > 80% level time and not spawned yet, force spawn.
                    const isFailsafe = this.levelTimer > this.levelDuration * 0.8;
                    const isRandomLuck = this.levelTimer > this.levelDuration * 0.1 && Math.random() < 0.3;

                    if (isFailsafe || isRandomLuck) {
                        this.enemies.push(new Cat(this, canJump));
                        this.catSpawned = true;
                    }
                }
            }

            this.enemyTimer = 0;
            // Recalculate interval base on randomness but keep it tighter as levels go up
            // We use a base interval that gets smaller, plus random logic
            // Actually, let's keep the random logic but scale the base.
            // Simplified: The interval check uses a fixed target that we decrease on level up.
            // But we reset to 0 and wait for `enemyInterval`.
            // So decreasing `enemyInterval` works.
            // We need to re-randomize it slightly to avoid predictability?
            // Let's just set it to a range based on difficulty.
            let minSpawnTime = 1000 - (this.level * 50);
            if (minSpawnTime < 200) minSpawnTime = 200;

            this.enemyInterval = Math.random() * 1000 + minSpawnTime;
        } else {
            this.enemyTimer += deltaTime;
        }

        this.enemies.forEach(enemy => {
            enemy.update(deltaTime);
            // Collision with Player
            if (this.started) {
                if (this.checkCollision(this.player, enemy)) {
                    // Check if it's a Heart
                    if (enemy instanceof Heart) {
                        this.lives++;
                        this.heartsCollected++; // Track collected hearts
                        enemy.markedForDeletion = true;
                        // Floating text or effect?
                        this.fireworks.explode(enemy.x, enemy.y, 20); // Mini explosion
                        // Optional: Sound
                    } else if (!this.player.isInvulnerable) {
                        // Cat or Generic Enemy
                        this.lives--;
                        this.player.hurt();
                        if (this.lives <= 0) {
                            this.gameOver = true;
                        }
                    }
                }
            }
            // Collision with Projectiles - REMOVED
        });
        this.enemies = this.enemies.filter(e => !e.markedForDeletion);

        // Handle Cheese
        if (this.cheeseTimer > this.cheeseInterval) {
            this.cheeses.push(new Cheese(this));
            this.cheeseTimer = 0;
            // Increase cheese amount by 50% per level (Interval = Base / 1.5^(level-1))
            const spawnScale = Math.pow(1.5, this.level - 1);
            this.cheeseInterval = (Math.random() * 2000 + 1000) / spawnScale;
        } else {
            this.cheeseTimer += deltaTime;
        }

        this.cheeses.forEach(cheese => {
            cheese.update(deltaTime);
            if (this.checkCollision(this.player, cheese)) {
                cheese.markedForDeletion = true;
                this.cheeseCount++;
                // Optional: Play sound
            }
        });
        this.cheeses = this.cheeses.filter(c => !c.markedForDeletion);
    }

    draw() {
        this.context.clearRect(0, 0, this.width, this.height);
        this.world.draw(this.context);

        if (this.started) {
            this.player.draw(this.context);
        }

        this.enemies.forEach(enemy => {
            enemy.draw(this.context);
        });
        this.cheeses.forEach(cheese => {
            cheese.draw(this.context);
        });

        // UI Updates (DOM)
        const scoreEl = document.getElementById('score');
        const levelEl = document.getElementById('level');
        if (scoreEl) scoreEl.innerHTML = '<span class="material-symbols-outlined">timer</span> ' + (this.gameTime / 1000).toFixed(1) + 's';
        if (levelEl) levelEl.innerHTML = '<span class="material-symbols-outlined">stairs_2</span> ' + this.level;
        const cheeseEl = document.getElementById('cheese-count');
        if (cheeseEl) {
            cheeseEl.innerText = '🧀 ' + this.cheeseCount;
            cheeseEl.classList.remove('hidden');
        }
        const heartEl = document.getElementById('heart-count');
        /* REMOVED: Heart count only for leaderboard now
        if (heartEl) {
            heartEl.innerText = '❤️ ' + this.heartsCollected;
            heartEl.classList.remove('hidden');
        }
        */
        if (heartEl) heartEl.classList.add('hidden'); // Ensure hidden


        const livesEl = document.getElementById('lives');
        if (livesEl) {
            // New Format: Icon + Number
            livesEl.innerHTML = '<span class="material-symbols-outlined">favorite</span> ' + Math.max(0, this.lives);
        }

        // Draw Fireworks
        this.fireworks.draw(this.context);

        // Draw Level Up Announcement
        if (this.levelAnnouncementTimer > 0) {
            this.context.save();
            this.context.shadowColor = 'black';
            this.context.shadowBlur = 10;

            // Main Title "LEVEL UP!"
            this.context.font = 'bold 80px "Chewy", cursive, sans-serif';
            this.context.fillStyle = '#FFD700'; // Cheese Gold
            this.context.textAlign = 'center';
            this.context.fillText(this.languageManager.t('levelUp'), this.width / 2, this.height / 2 - 50);

            // Subtitle "Speed Increased"
            this.context.font = 'bold 40px "Roboto", sans-serif';
            this.context.fillStyle = '#FFA500'; // Orange
            this.context.fillText(this.languageManager.t('speedUp'), this.width / 2, this.height / 2 + 20);

            this.context.restore();
        }
    }

    showLeaderboard() {
        const leaderboardEl = document.getElementById('leaderboard');
        const listEl = document.getElementById('leaderboard-list');
        const restartBtn = document.getElementById('restart-btn');
        const inputContainer = document.getElementById('name-input-container');
        const submitBtn = document.getElementById('submit-score');
        const nameInput = document.getElementById('player-name');

        leaderboardEl.classList.remove('hidden');
        restartBtn.classList.remove('hidden'); // allow restart immediately
        inputContainer.classList.add('hidden'); // hidden by default since we auto-submit

        // Sync difficulty-restart radios with current difficulty
        const restartDiffEls = document.getElementsByName('difficulty-restart');
        for (const el of restartDiffEls) {
            if (el.value === this.difficulty) {
                el.checked = true;
            }
        }

        const currentPlayerEl = document.getElementById('current-player');
        if (currentPlayerEl) currentPlayerEl.classList.add('hidden');

        // Pre-fill Name (or generate) and Auto-Submit
        let name = localStorage.getItem('mouse_adventure_username');
        if (!name) {
            name = this.languageManager.getRandomMouseName();
            localStorage.setItem('mouse_adventure_username', name);
        }
        nameInput.value = name; // Just in case we show it later

        // Add score immediately
        const idx = this.leaderboard.addScore(name, (this.gameTime / 1000).toFixed(1), this.level, this.cheeseCount, this.difficulty, this.heartsCollected);

        // Show Celebration
        const celebrationEl = document.getElementById('celebration-msg');
        if (celebrationEl) {
            const rank = idx + 1;
            const timeStr = (this.gameTime / 1000).toFixed(1) + 's';
            // Translate RANK
            celebrationEl.innerHTML = `<span class="material-symbols-outlined">emoji_events</span> RANK #${rank}<br><span class="material-symbols-outlined">stairs_2</span> ${this.level} • ${timeStr} • 🧀 ${this.cheeseCount} • ❤️ ${this.heartsCollected}`;
            celebrationEl.classList.remove('hidden');
        }

        // Render List
        this.renderLeaderboardList(listEl, idx);

        this.scoreSubmitted = true; // Mark as done

        // Remove redundant submit listener usage or keep it minimal
        submitBtn.onclick = null;

        // Handle Restart Click
        restartBtn.onclick = () => {
            this.restart();
            leaderboardEl.classList.add('hidden');
            requestAnimationFrame(this.animate.bind(this));
        };
    }

    getRandomMouseName() {
        return this.languageManager.getRandomMouseName();
    }

    renderLeaderboardList(container, highlightIndex = -1) {
        container.innerHTML = '';
        const scores = this.leaderboard.getScores();
        const itemsPerPage = 20;

        // Determine Page
        let page = 0;
        // If we have a highlight index, jump to that page
        if (highlightIndex !== -1) {
            page = Math.floor(highlightIndex / itemsPerPage);
            // Store current page to reuse if we just want to browse? 
            // For now, let's just make sure we find the highlight.
        } else if (container.dataset.page) {
            page = parseInt(container.dataset.page);
        }

        // Save current page state
        container.dataset.page = page;

        const start = page * itemsPerPage;
        const end = start + itemsPerPage;
        const pageScores = scores.slice(start, end);
        const totalPages = Math.ceil(scores.length / itemsPerPage);

        // Render Entries
        let highlightEl = null;
        pageScores.forEach((entry, i) => {
            const index = start + i;
            const div = document.createElement('div');
            div.className = 'leaderboard-entry';
            const diff = entry.difficulty || 'hard';
            div.classList.add('diff-' + diff); // Add Color Class

            if (index === highlightIndex) {
                div.classList.add('highlight');
                highlightEl = div;
            }
            const lvl = entry.level || 1;
            const cheese = entry.cheese || 0;
            const hearts = entry.hearts || 0; // Get hearts

            const diffIcon = diff === 'easy' ? '<span class="material-symbols-outlined">sentiment_satisfied</span>' : (diff === 'moderate' ? '<span class="material-symbols-outlined">sentiment_neutral</span>' : '<span class="material-symbols-outlined">sentiment_very_dissatisfied</span>');

            div.innerHTML = `
                <div style="display: grid; grid-template-columns: 2fr 0.5fr 2.5fr; align-items: center; width: 100%; gap: 5px;">
                    <span style="text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: flex; align-items: center; gap: 4px;">
                        #${index + 1} ${diffIcon} <strong>${entry.name}</strong>
                    </span>
                    <span style="display: flex; align-items: center; justify-content: center; gap: 2px;">
                        <span class="material-symbols-outlined" style="font-size: 1.0em;">stairs_2</span>${lvl}
                    </span>
                    <span style="display: flex; align-items: center; justify-content: flex-end; gap: 8px; font-size: 0.95em;">
                         <span style="min-width: 45px; text-align:right;">${entry.time}s</span>
                         <span style="display:flex; align-items:center;">🧀 ${cheese}</span>
                         <span style="display:flex; align-items:center;">❤️ ${hearts}</span>
                    </span>
                </div>
            `;
            container.appendChild(div);
        });

        // Pagination Controls
        if (totalPages > 1) {
            const paginationDiv = document.createElement('div');
            paginationDiv.style.cssText = 'display: flex; justify-content: center; margin-top: 10px; gap: 5px;';

            for (let i = 0; i < totalPages; i++) {
                const btn = document.createElement('button');
                btn.innerText = i + 1;
                btn.style.cssText = `
                    padding: 5px 10px; 
                    background: ${i === page ? '#ff9900' : '#444'}; 
                    color: white; 
                    border: none; 
                    border-radius: 4px; 
                    cursor: pointer;
                `;
                btn.onclick = () => {
                    // Update dataset to the new page
                    container.dataset.page = i;
                    // Render without forcing highlight navigation (pass -1 for highlightIndex)
                    // We can still highlight the row if it happens to be on this page, 
                    // but we won't force the page to change back.
                    this.renderLeaderboardList(container, highlightIndex);
                };
                paginationDiv.appendChild(btn);
            }
            container.appendChild(paginationDiv);
        }

        if (highlightEl) {
            setTimeout(() => {
                highlightEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }

    drawGameOver() {
        // Redundant with Leaderboard overlay, but can keep as background or minimal text
        this.context.fillStyle = 'rgba(0,0,0,0.5)';
        this.context.fillRect(0, 0, this.width, this.height);
        // We removed the text drawing here since HTML overlay handles it now, 
        // but maybe keep "GAME OVER"
        this.context.fillStyle = 'white';
        this.context.font = '60px Impact';
        const gameOverText = this.languageManager.t('gameOver');
        this.context.fillText(gameOverText, this.width / 2 - 150, this.height / 2);
    }

    checkCollision(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.height + rect1.y > rect2.y
        );
    }

    applyDifficultySettings(forcedDifficulty = null) {
        // Difficulty Logic
        let difficulty = forcedDifficulty;

        if (!difficulty) {
            const difficultyEls = document.getElementsByName('difficulty');
            difficulty = 'hard'; // default
            for (const el of difficultyEls) {
                if (el.checked) {
                    difficulty = el.value;
                    break;
                }
            }
        }

        // Hard starts with current speed (6)
        // Moderate starts with 65% of hard speed
        // Easy starts with 30% of hard speed
        const HARD_SPEED = 6;
        // Base Glide Duration (Hard)
        let glideDuration = 1000;

        if (difficulty === 'hard') {
            this.baseSpeed = HARD_SPEED;
            glideDuration = 1000;
        } else if (difficulty === 'moderate') {
            this.baseSpeed = HARD_SPEED * 0.65;
            glideDuration = 1000 + 1500;
        } else if (difficulty === 'easy') {
            this.baseSpeed = HARD_SPEED * 0.3;
            glideDuration = 1000 + 2500;
        }
        this.difficulty = difficulty;
        this.player.maxGlideTime = glideDuration;
    }
}
