const boardSize = 4;
let board = [];
let score = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;

// Initialize the game
function initGame() {
    // Create a 4x4 board with all zeros
    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0)); // Reset the board
    score = 0; // Reset the score
    // Add two random tiles to start the game
    addRandomTile();
    addRandomTile();
    renderBoard();
}

// Add a random tile (either 2 or 4) at an empty spot on the board
function addRandomTile() {
    let emptySpaces = [];
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col] === 0) {
                emptySpaces.push({ row: row, col: col });
            }
        }
    }

    if (emptySpaces.length > 0) {
        let randomSpace = emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
        board[randomSpace.row][randomSpace.col] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Render the board in HTML
function renderBoard() {
    let boardElement = document.getElementById('gameBoard');
    boardElement.innerHTML = '';

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            let tile = document.createElement('div');
            tile.className = 'tile';
            tile.textContent = board[row][col] === 0 ? '' : board[row][col];
            tile.classList.add(`tile-${board[row][col]}`);
            boardElement.appendChild(tile);
        }
    }

    document.getElementById('score').textContent = score;
    updateHighScore(); // Update high score display
}

// Update the high score in the UI and local storage
function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore); // Save to local storage
    }
    document.getElementById('highScore').textContent = highScore;
}

// Sliding logic for moving left
function slideLeft() {
    let moved = false;
    for (let i = 0; i < boardSize; i++) {
        let newRow = board[i].filter(val => val); // Remove all zeros
        for (let j = 0; j < newRow.length - 1; j++) {
            if (newRow[j] === newRow[j + 1]) {
                newRow[j] *= 2;
                score += newRow[j];
                newRow[j + 1] = 0;
            }
        }
        newRow = newRow.filter(val => val); // Remove zeros after merging
        while (newRow.length < boardSize) newRow.push(0); // Add zeros back
        if (board[i].toString() !== newRow.toString()) moved = true;
        board[i] = newRow;
    }
    return moved;
}

// Sliding logic for moving right
function slideRight() {
    let moved = false;
    for (let i = 0; i < boardSize; i++) {
        let newRow = board[i].filter(val => val); // Remove all zeros
        for (let j = newRow.length - 1; j > 0; j--) {
            if (newRow[j] === newRow[j - 1]) {
                newRow[j] *= 2;
                score += newRow[j];
                newRow[j - 1] = 0;
            }
        }
        newRow = newRow.filter(val => val); // Remove zeros after merging
        while (newRow.length < boardSize) newRow.unshift(0); // Add zeros back to the front
        if (board[i].toString() !== newRow.toString()) moved = true;
        board[i] = newRow;
    }
    return moved;
}

// Sliding logic for moving up
function slideUp() {
    let moved = false;
    for (let col = 0; col < boardSize; col++) {
        let newCol = [];
        for (let row = 0; row < boardSize; row++) {
            if (board[row][col] !== 0) newCol.push(board[row][col]);
        }
        for (let i = 0; i < newCol.length - 1; i++) {
            if (newCol[i] === newCol[i + 1]) {
                newCol[i] *= 2;
                score += newCol[i];
                newCol[i + 1] = 0;
            }
        }
        newCol = newCol.filter(val => val);
        while (newCol.length < boardSize) newCol.push(0);
        for (let row = 0; row < boardSize; row++) {
            if (board[row][col] !== newCol[row]) moved = true;
            board[row][col] = newCol[row];
        }
    }
    return moved;
}

// Sliding logic for moving down
function slideDown() {
    let moved = false;
    for (let col = 0; col < boardSize; col++) {
        let newCol = [];
        for (let row = 0; row < boardSize; row++) {
            if (board[row][col] !== 0) newCol.push(board[row][col]);
        }
        for (let i = newCol.length - 1; i > 0; i--) {
            if (newCol[i] === newCol[i - 1]) {
                newCol[i] *= 2;
                score += newCol[i];
                newCol[i - 1] = 0;
            }
        }
        newCol = newCol.filter(val => val);
        while (newCol.length < boardSize) newCol.unshift(0);
        for (let row = 0; row < boardSize; row++) {
            if (board[row][col] !== newCol[row]) moved = true;
            board[row][col] = newCol[row];
        }
    }
    return moved;
}

// Handle user input (arrow keys for movement)
window.addEventListener('keydown', (e) => {
    let moved = false;
    if (e.key === 'ArrowLeft') moved = move(0);
    if (e.key === 'ArrowRight') moved = move(1);
    if (e.key === 'ArrowUp') moved = move(2);
    if (e.key === 'ArrowDown') moved = move(3);

    if (moved) {
        addRandomTile();
        renderBoard();
        updateScore();
        checkGameOver();
    }
});

// Move tiles based on the direction
function move(direction) {
    switch (direction) {
        case 0:
            return slideLeft();
        case 1:
            return slideRight();
        case 2:
            return slideUp();
        case 3:
            return slideDown();
    }
}

// Check for game over (no empty spaces or valid moves)
function checkGameOver() {
    if (!canMove()) {
        alert("Game Over!");
    }
}

// Check if there are any valid moves left
function canMove() {
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col] === 0) return true;
            if (col < boardSize - 1 && board[row][col] === board[row][col + 1]) return true;
            if (row < boardSize - 1 && board[row][col] === board[row + 1][col]) return true;
        }
    }
    return false;
}

// Update the score in the UI
function updateScore() {
    document.getElementById('score').textContent = score;
}

// Restart button functionality
document.getElementById('restart').addEventListener('click', initGame);

// Initialize the game when the page loads
initGame();
