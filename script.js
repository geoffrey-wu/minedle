const size = 9;
const bombs = 10;

/**
 * represents the board
 * 0 = empty
 * 1 = guess
 * 2 = bomb
 * 3 = revealed
 */
var board = Array(size).fill(0).map(x => Array(size).fill(0))

function boardClick(e, row, col) {
    if (e.isClicked) {
        e.style.backgroundColor = '#dddddd';
        board[row][col] = 0;
    } else {
        e.style.backgroundColor = '#00ff00';
        board[row][col] = 1;
    }
    e.isClicked = !e.isClicked;
}

function guess() {
    var numGuesses = 0;
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (board[i][j] == 1) {
                console.log(i, j);
                numGuesses++;
            }
        }
    }
    if (numGuesses != bombs) {
        window.alert('Make sure to guess ' + (bombs - numGuesses) + ' more bombs');
    }
}

function clearGuess() {
    var allCells = document.getElementsByClassName('cell');
    for (let e of allCells) {
        e.style.backgroundColor = '#dddddd';
        e.isClicked = false;
    }

    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            board[i][j] = 0;
        }
    }
}