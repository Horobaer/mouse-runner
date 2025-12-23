export default class LanguageManager {
    constructor() {
        this.currentLang = 'en';
        this.dictionary = {
            'en': {
                'gameTitle': 'Mouse Adventure',
                'enterName': 'Enter your name to start:',
                'namePlaceholder': 'Mouse Name',
                'startBtn': 'Start Game',
                'difficultyHard': 'Hard',
                'difficultyModerate': 'Moderate',
                'difficultyEasy': 'Easy',
                'leaderboardTitle': 'Leaderboard',
                'enterNameLeaderboard': 'Enter Name',
                'submitBtn': 'Submit',
                'restartBtn': 'Restart Game',
                'gameOver': 'GAME OVER',
                'lives': 'Lives:',
                'level': 'Level:',
                'player': 'Player:',
                'time': 'Time:',
                'rank': 'Rank #',
                'unknownMouse': 'Unknown Mouse',
                'mouseAdjectives': ['Speedy', 'Cheesy', 'Fluffy', 'Brave', 'Tiny', 'Mighty', 'Sneaky', 'Happy'],
                'mouseNouns': ['Mouse', 'Rat', 'Squeaker', 'Nibbler', 'Runner', 'Whiskers', 'Tail', 'Cheese']
            },
            'de': {
                'gameTitle': 'Maus Abenteuer',
                'enterName': 'Gib deinen Namen ein:',
                'namePlaceholder': 'Maus Name',
                'startBtn': 'Spiel Starten',
                'difficultyHard': 'Schwer',
                'difficultyModerate': 'Mittel',
                'difficultyEasy': 'Einfach',
                'leaderboardTitle': 'Bestenliste',
                'enterNameLeaderboard': 'Name eingeben',
                'submitBtn': 'Absenden',
                'restartBtn': 'Neustart',
                'gameOver': 'SPIEL VORBEI',
                'lives': 'Leben:',
                'level': 'Level:',
                'player': 'Spieler:',
                'time': 'Zeit:',
                'rank': 'Rang #',
                'unknownMouse': 'Unbekannte Maus',
                'mouseAdjectives': ['Schneller', 'Mutiger', 'Kleiner', 'Mächtiger', 'Hastiger', 'Glücklicher', 'Verrückter', 'Super'],
                'mouseNouns': ['Käseliebhaber', 'Käseläufer', 'Käsesprinter', 'Käsespringer', 'Käsejäger', 'Renner', 'Nager', 'Meister']
            }
        };
        this.listeners = [];
    }

    subscribe(callback) {
        this.listeners.push(callback);
    }

    init() {
        // Detect browser language
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('de')) {
            this.setLanguage('de');
        } else {
            this.setLanguage('en');
        }

        // Attach event listeners
        const btnEn = document.getElementById('lang-btn-en');
        const btnDe = document.getElementById('lang-btn-de');

        if (btnEn) btnEn.onclick = () => this.setLanguage('en');
        if (btnDe) btnDe.onclick = () => this.setLanguage('de');
    }

    setLanguage(lang) {
        if (this.dictionary[lang]) {
            this.currentLang = lang;
            this.updateUI();
            this.listeners.forEach(cb => cb(lang));
        }
    }

    t(key) {
        return this.dictionary[this.currentLang][key] || key;
    }

    updateUI() {
        // Update elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (this.dictionary[this.currentLang][key]) {
                if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
                    el.placeholder = this.dictionary[this.currentLang][key];
                } else if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
                    // Only replace text content if it's a simple text node to preserve icons/structure if any
                    // But for this simpel app, innerText is usually fine, or we use specific logic.
                    // Let's use innerText but be careful about HTML within it (although our dict is plain text)
                    el.innerText = this.dictionary[this.currentLang][key];
                } else {
                    // For mixed content, we might need a more robust approach or spans.
                    // For now, simpler is better.
                    el.innerText = this.dictionary[this.currentLang][key];
                }
            }
        });

        // Toggle active state on language buttons if they exist
        ['en', 'de'].forEach(lang => {
            const btn = document.getElementById(`lang-btn-${lang}`);
            if (btn) {
                if (lang === this.currentLang) {
                    btn.classList.add('active-lang');
                    btn.style.fontWeight = 'bold';
                    btn.style.textDecoration = 'underline';
                } else {
                    btn.classList.remove('active-lang');
                    btn.style.fontWeight = 'normal';
                    btn.style.textDecoration = 'none';
                }
            }
        });
    }

    getRandomMouseName() {
        const adjectives = this.dictionary[this.currentLang].mouseAdjectives;
        const nouns = this.dictionary[this.currentLang].mouseNouns;
        return adjectives[Math.floor(Math.random() * adjectives.length)] + ' ' + nouns[Math.floor(Math.random() * nouns.length)];
    }
}
