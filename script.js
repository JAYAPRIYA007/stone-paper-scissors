const startGameButton = document.getElementById('start-game');
const gameContainer = document.getElementById('game-container');
const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');
const gameHistory = document.getElementById('game-history');

let player1Name, player2Name;
let player1Score = 0, player2Score = 0;
let currentRound = 1;

// Get player names and start game
document.getElementById('start-game').addEventListener('click', () => {
    player1Name = document.getElementById('player1').value;
    player2Name = document.getElementById('player2').value;
    document.getElementById('player-names').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    document.getElementById('player1-name').innerText = player1Name;
    document.getElementById('player2-name').innerText = player2Name;
    document.getElementById('player1-score').innerText = player1Score;
    document.getElementById('player2-score').innerText = player2Score;
});

// Handle player choices
document.querySelectorAll('#game-rounds button').forEach(button => {
    button.addEventListener('click', () => {
        const player1Choice = (link );
        const player2Choice = getRandomChoice();

        const result = determineWinner(player1Choice, player2Choice);

        if (result === 'tie') {
            document.getElementById('result').innerText = 'It\'s a tie!';
        } else if (result === 'player1') {
            player1Score++;
            document.getElementById('result').innerText = `${player1Name} wins this round!`;
        } else {
            player2Score++;
            document.getElementById('result').innerText = `${player2Name} wins this round!`;
        }

        document.getElementById('player1-score').innerText = player1Score;
        document.getElementById('player2-score').innerText = player2Score;

        // Save game data to DB
        saveGameData(player1Name, player2Name, player1Score, player2Score, currentRound);

        currentRound++;
        if (currentRound > 6) {
            // Game over, display final scores
            document.getElementById('game-rounds').style.display = 'none';
            document.getElementById('result').innerText = `Game over! Final scores: ${player1Name} ${player1Score} - ${player2Name} ${player2Score}`;
        }
    });
});



// Helper functions
function getRandomChoice() {
    const choices = ['stone', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * choices.length)];
}

function determineWinner(player1Choice, player2Choice) {
    if (player1Choice === player2Choice) return 'tie';
    if ((player1Choice === 'stone' && player2Choice === 'scissors') ||
        (player1Choice === 'scissors' && player2Choice === 'paper') ||
        (player1Choice === 'paper' && player2Choice === 'stone')) {
        return 'player1';
    } else {
        return 'player2';
    }
}
// Save game data to SQL database
const db = openDatabase('RockPaperScissors', '1.0', 'Rock Paper Scissors Database', 2 * 1024 * 1024);

db.transaction(tx => {
    tx.executeSql(`
        CREATE TABLE IF NOT EXISTS games
        (id INTEGER PRIMARY KEY AUTOINCREMENT,
        player1Name TEXT,
        player2Name TEXT,
        player1Score INTEGER,
        player2Score INTEGER,
        round INTEGER)
    `);
});

function saveGameData(player1Name, player2Name, player1Score, player2Score, round) {
    db.transaction(tx => {
        tx.executeSql(`
            INSERT INTO games (player1Name, player2Name, player1Score, player2Score, round)
            VALUES (?, ?, ?, ?, ?)
        `, [player1Name, player2Name, player1Score, player2Score, round],
            (_, result) => console.log(`Game data saved: ${result.insertId}`),
            error => console.error(error)
        );
    });
}



