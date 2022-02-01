const boardPixelWidth = 500;

const possibleSizes = [9, 16, 30];
const possibleBombs = [10, 40, 160];

var currentDifficulty = 0;

/**
 * The number of squares in one side of the board.
 */
var size = possibleSizes[currentDifficulty];
var numBombs = possibleBombs[currentDifficulty];
var totalGuesses = numBombs;

var numSelected = 0;
var revealedBombs = 0;
var squaresUsed = 0;
var turnNumber = 0;

/**
 * Represents the board as a 2d array:
 * true = the square is selected, false = the square is not selected.
 */
var boardSelection = Array(size).fill(false).map(x => Array(size).fill(false));

/**
 * 2d array of bombs, where true (1) = bomb and false (0) = no bomb.
 */
var hasBomb = Array(size).fill(false).map(x => Array(size).fill(false));

window.onload = () => {
    generateBoard();
    generateMines();
}

var selectMultipleCells = false;
window.addEventListener('keydown', (event) => {
    selectMultipleCells = (event.key === 'Control');
});

window.addEventListener('keyup', (event) => {
    selectMultipleCells = false;
});

function generateBoard() {
    for (let i = 0; i < size; i++) {
        let row = document.createElement('div');
        row.className = 'row';

        for (let j = 0; j < size; j++) {
            let cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `${i}-${j}`;
            cell.style.width = `${boardPixelWidth/size}px`;
            cell.style.height = `${boardPixelWidth/size}px`;
            cell.style.lineHeight = `${boardPixelWidth/size}px`;
            cell.style.fontSize = `${0.4 * boardPixelWidth/size}px`;

            cell.clicked = false;
            cell.revealed = false;

            cell.onclick = (event) => {
                boardClick(cell, i, j, false);
            }

            cell.onmouseover = (event) => {
                if (selectMultipleCells) {
                    boardClick(cell, i, j, true);
                }
            }


            cell.oncontextmenu = (event) => {
                event.preventDefault();
            }
            row.appendChild(cell);
        }

        document.getElementById('board').appendChild(row);
    }
}

function generateMines() {
    var count = 0;

    while (count < numBombs) {
        var row = Math.floor(Math.random() * size);
        var col = Math.floor(Math.random() * size);
        if (!hasBomb[row][col]) {
            hasBomb[row][col] = true;
            count++;
        }
    }
}

function changeSize() {
    currentDifficulty++;
    if (currentDifficulty >= possibleSizes.length) currentDifficulty = 0;

    size = possibleSizes[currentDifficulty];
    numBombs = possibleBombs[currentDifficulty];
    totalGuesses = numBombs;

    document.getElementById('board').innerHTML = '';
    generateBoard();
    reset();
}

function revealSquares(row, col) {
    // check bounds on row and col
    if (row < 0 || row >= size || col < 0 || col >= size) return;

    document.getElementById(`${row}-${col}`).revealed = true;

    // if the square is a bomb
    if (hasBomb[row][col]) {
        revealedBombs++;
        document.getElementById(`${row}-${col}`).style.backgroundColor = '#000000';
        return;
    }

    document.getElementById(`${row}-${col}`).style.backgroundColor = "#ffffff";
    var numAdjacentBombs = 0;
    if (row > 0) if (hasBomb[row - 1][col]) numAdjacentBombs++;
    if (col > 0) if (hasBomb[row][col - 1]) numAdjacentBombs++;
    if (row < size - 1) if (hasBomb[row + 1][col]) numAdjacentBombs++;
    if (col < size - 1) if (hasBomb[row][col + 1]) numAdjacentBombs++;

    if (row > 0 && col > 0) if (hasBomb[row - 1][col - 1]) numAdjacentBombs++;
    if (row < size - 1 && col > 0) if (hasBomb[row + 1][col - 1]) numAdjacentBombs++;
    if (row > 0 && col < size - 1) if (hasBomb[row - 1][col + 1]) numAdjacentBombs++;
    if (row < size - 1 && col < size - 1) if (hasBomb[row + 1][col + 1]) numAdjacentBombs++;

    if (numAdjacentBombs > 0) {
        document.getElementById(`${row}-${col}`).innerHTML = numAdjacentBombs;
        return;
    } else {
        if (row > 0) {
            if (!document.getElementById(`${row - 1}-${col}`).revealed) {
                revealSquares(row - 1, col);
            }
        }
        if (col > 0) {
            if (!document.getElementById(`${row}-${col - 1}`).revealed) {
                revealSquares(row, col - 1);
            }
        }
        if (row < size - 1) {
            if (!document.getElementById(`${row + 1}-${col}`).revealed) {
                revealSquares(row + 1, col);
            }
        }
        if (col < size - 1) {
            if (!document.getElementById(`${row}-${col + 1}`).revealed) {
                revealSquares(row, col + 1);
            }
        }
        if (row > 0 && col > 0) {
            if (!document.getElementById(`${row - 1}-${col - 1}`).revealed) {
                revealSquares(row - 1, col - 1);
            }
        }
        if (row < size - 1 && col > 0) {
            if (!document.getElementById(`${row + 1}-${col - 1}`).revealed) {
                revealSquares(row + 1, col - 1);
            }
        }
        if (row > 0 && col < size - 1) {
            if (!document.getElementById(`${row - 1}-${col + 1}`).revealed) {
                revealSquares(row - 1, col + 1);
            }
        }
        if (row < size - 1 && col < size - 1) {
            if (!document.getElementById(`${row + 1}-${col + 1}`).revealed) {
                revealSquares(row + 1, col + 1);
            }
        }
    }
}

function boardClick(e, row, col, forceClick) {
    if (e.revealed) return;

    if (e.clicked) {
        if (forceClick) return;

        e.style.backgroundColor = '#dddddd';
        boardSelection[row][col] = false;
        numSelected--;
    } else {
        if (numSelected >= totalGuesses - revealedBombs) return;

        e.style.backgroundColor = '#00ff00';
        boardSelection[row][col] = true;
        numSelected++;
    }
    e.clicked = !e.clicked;

    document.getElementById('numSelected').innerHTML = numSelected;
}

function guess() {
    squaresUsed += numSelected;
    document.getElementById('squaresUsed').innerHTML = squaresUsed;

    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (boardSelection[i][j]) {
                boardSelection[i][j] = false;
                revealSquares(i, j);
            }
        }
    }

    numSelected = 0;
    document.getElementById('numSelected').innerHTML = 0;
    document.getElementById('totalGuesses').innerHTML = totalGuesses - revealedBombs;

    document.getElementById('revealedBombs').innerHTML = revealedBombs;

    turnNumber++;
    document.getElementById('turnNumber').innerHTML = turnNumber + ' guess' + (turnNumber == 1 ? '' : 'es');

    if (revealedBombs == numBombs) {
        window.alert('You win!');
    }
}

function clearGuess() {
    var allCells = document.getElementsByClassName('cell');
    for (let e of allCells) {
        if (e.revealed) continue;
        e.style.backgroundColor = '#dddddd';
        e.clicked = false;
    }

    numSelected = 0;
    document.getElementById('numSelected').innerHTML = 0;
}

function reset() {
    hasBomb = Array(size).fill(false).map(x => Array(size).fill(false));
    boardSelection = Array(size).fill(false).map(x => Array(size).fill(false));
    
    numSelected = 0;
    revealedBombs = 0;
    squaresUsed = 0;
    turnNumber = 0;

    document.getElementById('numSelected').innerHTML = 0;
    document.getElementById('totalGuesses').innerHTML = totalGuesses;
    document.getElementById('revealedBombs').innerHTML = 0;
    document.getElementById('turnNumber').innerHTML = '0 guesses';
    document.getElementById('squaresUsed').innerHTML = 0;

    document.getElementById('bombs').innerHTML = numBombs;

    generateMines();

    var allCells = document.getElementsByClassName('cell');
    for (let e of allCells) {
        e.revealed = false;
        e.style.backgroundColor = '#dddddd';
        e.clicked = false;
        e.innerHTML = '';
    }
}