import InputHandler from './InputHandler.js';
import World from './World.js';
import Player from './Player.js';

import Projectile from './Projectile.js';
import Enemy from './Enemy.js';
import Bird from './Bird.js';
import Cheese from './Cheese.js';
import Leaderboard from './Leaderboard.js';

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

        this.projectiles = [];
        this.enemies = []; // Stores both ground enemies and birds
        this.enemyTimer = 0;
        this.enemyInterval = 2000; // ms

        this.cheeses = [];
        this.cheeseTimer = 0;
        this.cheeseInterval = 1000;
        this.cheeseCount = 0;

        this.lastTime = 0;

        this.gameTime = 0;
        this.gameOver = false;
        this.leaderboardShown = false;
        this.restartCooldown = 0;
        this.scoreSubmitted = false;

        // Level System
        this.level = 1;
        this.levelTimer = 0;
        this.levelDuration = 10000; // 10 seconds
    }

    start() {
        this.animate(0);
    }

    animate(timeStamp) {
        const deltaTime = timeStamp - this.lastTime;
        this.lastTime = timeStamp;

        if (!this.gameOver) {
            this.update(deltaTime);
            this.draw();
            requestAnimationFrame(this.animate.bind(this));
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
                if (!this.scoreSubmitted) {
                    this.handleScoreSubmission();
                } else {
                    this.handleGlobalRestart();
                }
            }
        }
    }

    handleGlobalRestart() {
        // Find the submit logic and trigger it from here
        const nameInput = document.getElementById('player-name');
        const listEl = document.getElementById('leaderboard-list');
        const inputContainer = document.getElementById('name-input-container');
        const leaderboardEl = document.getElementById('leaderboard');

        // Auto-submit current name (or random) logic
        const name = nameInput.value || this.getRandomMouseName();
        localStorage.setItem('mouse_adventure_username', name); // Persist name
        this.leaderboard.addScore(name, (this.gameTime / 1000).toFixed(1), this.level, this.cheeseCount);

        // Hide UI
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

        const name = nameInput.value || this.getRandomMouseName();
        localStorage.setItem('mouse_adventure_username', name);

        // Add Score and get Index
        const highlightIdx = this.leaderboard.addScore(name, (this.gameTime / 1000).toFixed(1), this.level, this.cheeseCount);

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
        this.world.speed = 6; // Reset speed
        this.enemyInterval = 2000;
        this.enemies = [];
        this.cheeses = [];
        this.cheeseCount = 0;
        this.projectiles = [];
        this.player = new Player(this);
        this.world = new World(this);
        this.lastTime = performance.now();

        // Update HUD Name
        const storedName = localStorage.getItem('mouse_adventure_username') || 'Unknown Mouse';
        const playerEl = document.getElementById('current-player');
        if (playerEl) {
            playerEl.innerText = 'Player: ' + storedName;
            playerEl.classList.remove('hidden');
        }

        // Reset Color
        this.player.color = '#888';
    }

    shoot(x, y) {
        this.projectiles.push(new Projectile(this, x, y));
    }

    update(deltaTime) {
        // Level Progression
        this.levelTimer += deltaTime;
        if (this.levelTimer > this.levelDuration) {
            this.level++;
            this.levelTimer = 0;
            // Increase Difficulty
            this.world.speed += 1; // Faster world
            // Dynamic Color Change
            const colors = ['#888', '#e74c3c', '#3498db', '#9b59b6', '#f1c40f', '#2ecc71'];
            this.player.color = colors[(this.level - 1) % colors.length];

            // Cap minimum interval to avoid impossible spawn rates
            if (this.enemyInterval > 500) {
                this.enemyInterval -= 200; // Faster spawns
            }
        }

        // Time Scoring
        this.gameTime += deltaTime;

        this.world.update(deltaTime);
        this.player.update(deltaTime);

        // Handle Projectiles
        this.projectiles.forEach(projectile => {
            projectile.update(deltaTime);
        });
        this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);

        // Handle Enemies (Spikes and Birds)
        if (this.enemyTimer > this.enemyInterval) {
            // Random chance to spawn Bird or Ground Enemy
            if (Math.random() > 0.5) {
                this.enemies.push(new Bird(this));
            } else {
                this.enemies.push(new Enemy(this));
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
            if (this.checkCollision(this.player, enemy)) {
                this.gameOver = true;
            }
            // Collision with Projectiles
            this.projectiles.forEach(projectile => {
                if (this.checkCollision(projectile, enemy)) {
                    enemy.markedForDeletion = true;
                    projectile.markedForDeletion = true;
                    // this.score += 5; // REMOVED Point scoring
                }
            });
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
        this.player.draw(this.context);

        this.projectiles.forEach(projectile => {
            projectile.draw(this.context);
        });
        this.enemies.forEach(enemy => {
            enemy.draw(this.context);
        });
        this.cheeses.forEach(cheese => {
            cheese.draw(this.context);
        });

        // UI Updates (DOM)
        const scoreEl = document.getElementById('score');
        const levelEl = document.getElementById('level');
        if (scoreEl) scoreEl.innerText = 'Time: ' + (this.gameTime / 1000).toFixed(1) + 's';
        if (levelEl) levelEl.innerText = 'Level: ' + this.level;
        const cheeseEl = document.getElementById('cheese-count');
        if (cheeseEl) {
            cheeseEl.innerText = '🧀 ' + this.cheeseCount;
            cheeseEl.classList.remove('hidden');
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
        restartBtn.classList.add('hidden'); // Hide restart until name submitted or skipped
        inputContainer.classList.remove('hidden');

        const currentPlayerEl = document.getElementById('current-player');
        if (currentPlayerEl) currentPlayerEl.classList.add('hidden');

        // Show Celebration
        const celebrationEl = document.getElementById('celebration-msg');
        if (celebrationEl) {
            const timeVal = parseFloat((this.gameTime / 1000).toFixed(1));
            const cheeseVal = this.cheeseCount || 0;
            const scores = this.leaderboard.getScores();
            let rank = 1;

            // Calculate Rank based on Cheese Descending, Time Descending
            for (const s of scores) {
                const sCheese = s.cheese || 0;
                const sTime = parseFloat(s.time);

                // If existing score is better, push me down rankings
                // Better = More cheese, OR same cheese and More time
                if (sCheese > cheeseVal) {
                    rank++;
                } else if (sCheese === cheeseVal && sTime > timeVal) {
                    rank++;
                }
            }

            const timeStr = timeVal.toFixed(1) + 's';
            // Use the same structure as the submit handler (slimmer, one line)
            celebrationEl.innerHTML = `GAME OVER<br><span style="font-size: 0.6em">Rank #${rank} • Level ${this.level} • ${timeStr} • 🧀 ${this.cheeseCount}</span>`;
            celebrationEl.classList.remove('hidden');
        }

        // Pre-fill Name
        const storedName = localStorage.getItem('mouse_adventure_username');
        if (storedName) {
            nameInput.value = storedName;
        } else {
            nameInput.value = this.getRandomMouseName();
        }

        // Render List
        this.renderLeaderboardList(listEl);

        // Handle Submit
        submitBtn.onclick = () => {
            const name = nameInput.value || this.getRandomMouseName();
            localStorage.setItem('mouse_adventure_username', name);
            // Add score and get the index of the new entry
            const index = this.leaderboard.addScore(name, (this.gameTime / 1000).toFixed(1), this.level, this.cheeseCount);
            // Render list with the new index highlighted
            this.renderLeaderboardList(listEl, index);

            // Update Celebration with Rank
            if (celebrationEl) {
                const rank = index + 1;
                const timeStr = (this.gameTime / 1000).toFixed(1) + 's';
                celebrationEl.innerHTML = `RANK #${rank}<br>Level ${this.level} • ${timeStr} • 🧀 ${this.cheeseCount}`;
            }

            inputContainer.classList.add('hidden');
            restartBtn.classList.remove('hidden');

            // Flag as submitted so Space key restarts
            this.scoreSubmitted = true;
        };

        // Handle Restart Click
        restartBtn.onclick = () => {
            this.restart();
            leaderboardEl.classList.add('hidden');
            requestAnimationFrame(this.animate.bind(this));
        };
    }

    getRandomMouseName() {
        const adjectives = ['Speedy', 'Cheesy', 'Fluffy', 'Brave', 'Tiny', 'Mighty', 'Sneaky', 'Happy'];
        const nouns = ['Mouse', 'Rat', 'Squeaker', 'Nibbler', 'Runner', 'Whiskers', 'Tail', 'Cheese'];
        return adjectives[Math.floor(Math.random() * adjectives.length)] + nouns[Math.floor(Math.random() * nouns.length)];
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
            if (index === highlightIndex) {
                div.classList.add('highlight');
                highlightEl = div;
            }
            const lvl = entry.level || 1;
            const cheese = entry.cheese || 0;
            const dateStr = entry.date ? new Date(entry.date).toLocaleString() : '';
            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <span style="flex: 2; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">#${index + 1} <strong>${entry.name}</strong></span>
                    <span style="flex: 1; text-align: center;">🆙 ${lvl}</span>
                    <span style="flex: 1.5; text-align: right;">⏱️ ${entry.time}s | 🧀 ${cheese}</span>
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
                    this.renderLeaderboardList(container); // Refresh without specific highlight logic overrides, 
                    // but we need to pass the page. 
                    // Actually, simpler: update dataset and re-call.
                    container.dataset.page = i;
                    this.renderLeaderboardList(container, highlightIndex); // Keep highlight index known
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
        this.context.fillText('GAME OVER', this.width / 2 - 150, this.height / 2);
    }

    checkCollision(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.height + rect1.y > rect2.y
        );
    }
}
