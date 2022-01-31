const size = 9;
const bombs = 10;
const totalGuesses = 10;

var numSelected = 0;
var revealedBombs = 0;
var turnNumber = 0;

/**
 * represents the board
 * 0 = empty
 * 1 = guess
 * 2 = revealed
 */
var boardGuesses = Array(size).fill(0).map(x => Array(size).fill(0))

/**
 * 1 = bomb, 0 = empty
 */
var board = Array(size).fill(0).map(x => Array(size).fill(0));
var cells = document.getElementsByClassName('cell');

window.onload = () => {
    generateBoard();
    generateMines();
}

function generateBoard() {
    for (let i = 0; i < size; i++) {
        let row = document.createElement('div');
        row.className = 'row';

        for (let j = 0; j < size; j++) {
            let cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `${i}-${j}`;
            cell.style.width = `${450/size}px`;
            cell.style.height = `${450/size}px`;
            cell.style.lineHeight = `${450/size}px`;
            cell.style.fontSize = `${0.4 * 450/size}px`;

            cell.clicked = false;
            cell.revealed = false;

            cell.onclick = () => {
                boardClick(cell, i, j);
            }
            cell.oncontextmenu = (e) => {
                e.preventDefault();
            }
            row.appendChild(cell);
        }

        document.getElementById('board').appendChild(row);
    }
}

function generateMines() {
    var count = 0;
    while (count < bombs) {
        var row = Math.floor(Math.random() * size);
        var col = Math.floor(Math.random() * size);
        if (board[row][col] != 1) {
            board[row][col] = 1;
            count++;
        }
    }
}

function revealSquares(row, col) {
    // check bounds on row and col
    if (row < 0 || row >= size || col < 0 || col >= size) return;

    document.getElementById(`${row}-${col}`).revealed = true;

    // if the square is a bomb
    if (board[row][col] === 1) {
        revealedBombs++;
        document.getElementById(`${row}-${col}`).style.backgroundColor = '#000000';
        return;
    }

    document.getElementById(`${row}-${col}`).style.backgroundColor = "#ffffff";
    var numAdjacentBombs = 0;
    if (row > 0) if (board[row - 1][col] === 1) numAdjacentBombs++;
    if (col > 0) if (board[row][col - 1] === 1) numAdjacentBombs++;
    if (row < size - 1) if (board[row + 1][col] === 1) numAdjacentBombs++;
    if (col < size - 1) if (board[row][col + 1] === 1) numAdjacentBombs++;

    if (row > 0 && col > 0) if (board[row - 1][col - 1] === 1) numAdjacentBombs++;
    if (row < size - 1 && col > 0) if (board[row + 1][col - 1] === 1) numAdjacentBombs++;
    if (row > 0 && col < size - 1) if (board[row - 1][col + 1] === 1) numAdjacentBombs++;
    if (row < size - 1 && col < size - 1) if (board[row + 1][col + 1] === 1) numAdjacentBombs++;

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

function boardClick(e, row, col) {
    if (e.revealed) return;

    if (e.clicked) {
        e.style.backgroundColor = '#dddddd';
        boardGuesses[row][col] = 0;
        numSelected--;
    } else {
        if (numSelected >= totalGuesses - revealedBombs) return;

        e.style.backgroundColor = '#00ff00';
        boardGuesses[row][col] = 1;
        numSelected++;
    }
    e.clicked = !e.clicked;

    document.getElementById('numSelected').innerHTML = numSelected;
}

function guess() {
    if (numSelected != totalGuesses - revealedBombs) {
        window.alert('Make sure to guess ' + (totalGuesses - revealedBombs - numSelected) + ' more bombs');
        return;
    }

    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (boardGuesses[i][j] === 1) {
                boardGuesses[i][j] = 2;
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

    if (revealedBombs == bombs) {
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
    board = Array(size).fill(0).map(x => Array(size).fill(0));
    boardGuesses = Array(size).fill(0).map(x => Array(size).fill(0));
    numSelected = 0;
    revealedBombs = 0;
    turnNumber = 0;
    document.getElementById('numSelected').innerHTML = 0;
    document.getElementById('totalGuesses').innerHTML = totalGuesses;
    document.getElementById('revealedBombs').innerHTML = 0;
    document.getElementById('turnNumber').innerHTML = '0 guesses';

    generateMines();

    var allCells = document.getElementsByClassName('cell');
    for (let e of allCells) {
        e.revealed = false;
        e.style.backgroundColor = '#dddddd';
        e.clicked = false;
        e.innerHTML = '';
    }
}