let board;
let currentPlayer;
let gameActive;
let currentMode;
let player1Name;
let player2Name;
let player1Score = 0;
let player2Score = 0;
let player1Wins = 0;
let player2Wins = 0;
let round = 1;

const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const nextRoundButton = document.getElementById('nextRound');
const restartButton = document.getElementById('restart');
const score1Display = document.getElementById('score1');
const score2Display = document.getElementById('score2');

document.addEventListener('DOMContentLoaded', () => {
    player1Name = localStorage.getItem('player1Name');
    player2Name = localStorage.getItem('player2Name');
    currentMode = localStorage.getItem('mode');

    score1Display.innerText = `${player1Name}: ${player1Score}`;
    score2Display.innerText = `${player2Name}: ${player2Score}`;

    startGame(currentMode);
});

function startGame(mode) {
    if (round > 3) {
        declareOverallWinner();
        return;
    }

    currentMode = mode;
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    cells.forEach(cell => {
        cell.innerText = '';
        cell.style.color = '';
        cell.addEventListener('click', handleCellClick);
    });
    statusDisplay.innerText = `${player1Name}'s turn`;
    nextRoundButton.style.display = 'none';
}

function restartMatch() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    cells.forEach(cell => {
        cell.innerText = '';
        cell.style.color = '';
    });
    statusDisplay.innerText = `${player1Name}'s turn`;
}

function handleCellClick(event) {
    const cellIndex = event.target.getAttribute('data-index');
    if (board[cellIndex] || !gameActive) return;

    board[cellIndex] = currentPlayer;
    event.target.innerText = currentPlayer;
    event.target.style.color = currentPlayer === 'X' ? 'red' : 'blue';
    checkResult();

    if (gameActive && currentMode === 'bot' && currentPlayer === 'O') {
        setTimeout(botMove, 500);
    }
}


function botMove() {
    let availableCells = [];
    board.forEach((cell, index) => {
        if (!cell) availableCells.push(index);
    });

    const randomIndex = Math.floor(Math.random() * availableCells.length);
    board[availableCells[randomIndex]] = 'O';
    cells[availableCells[randomIndex]].innerText = 'O';
    cells[availableCells[randomIndex]].style.color = 'blue';
    checkResult();
}


function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerText = `${currentPlayer === 'X' ? player1Name : player2Name} wins this round!`;
        gameActive = false;
        updateScore(currentPlayer);
        alert(`${currentPlayer === 'X' ? player1Name : player2Name} wins this round!`);
        nextRoundButton.style.display = 'block';
        round++;
        promptNewGame();
        return;
    }

    if (!board.includes(null)) {
        statusDisplay.innerText = 'This round is a draw!';
        gameActive = false;
        alert('This round is a draw!');
        nextRoundButton.style.display = 'block';
        round++;
        promptNewGame();
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.innerText = `${currentPlayer === 'X' ? player1Name : player2Name}'s turn`;
}

function promptNewGame() {
    if (round > 3) {
        declareOverallWinner();
    } else {
        if (confirm("Do you want to start a new game?")) {
            startGame(currentMode);
        }
    }
}

function updateScore(winner) {
    if (winner === 'X') {
        player1Score++;
        player1Wins++;
    } else {
        player2Score++;
        player2Wins++;
    }
    score1Display.innerText = `${player1Name}: ${player1Score}`;
    score2Display.innerText = `${player2Name}: ${player2Score}`;
}

function declareOverallWinner() {
    if (player1Wins > player2Wins) {
        statusDisplay.innerText = `${player1Name} wins the game!`;
        alert(`${player1Name} wins the game!`);
    } else if (player2Wins > player1Wins) {
        statusDisplay.innerText = `${player2Name} wins the game!`;
        alert(`${player2Name} wins the game!`);
    } else {
        statusDisplay.innerText = 'The game is a draw!';
        alert('The game is a draw!');
    }
    nextRoundButton.style.display = 'none';
}
