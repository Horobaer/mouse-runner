export default class Leaderboard {
    constructor() {
        this.scores = JSON.parse(localStorage.getItem('mouse_adventure_scores')) || [];
    }

    addScore(name, time, level, cheese, difficulty, hearts) {
        const id = Date.now() + Math.random();
        this.scores.push({ name, time, level, cheese, difficulty: difficulty || 'hard', hearts: hearts || 0, date: new Date().toISOString(), id });
        // Sort by Cheese Descending (primary), Time Descending (secondary)
        this.scores.sort((a, b) => {
            if (a.cheese !== b.cheese) {
                return b.cheese - a.cheese;
            }
            return b.time - a.time;
        });
        // Keep top 10 - REMOVED, keeping all scores
        // this.scores = this.scores.slice(0, 10);
        this.save();
        return this.scores.findIndex(s => s.id === id);
    }

    getScores() {
        return this.scores;
    }

    save() {
        localStorage.setItem('mouse_adventure_scores', JSON.stringify(this.scores));
    }
}
