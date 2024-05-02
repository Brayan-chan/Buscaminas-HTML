document.addEventListener('DOMContentLoaded', function () {
    const board = document.getElementById('game-board');
    const resetButton = document.getElementById('reset-button');
    const configForm = document.getElementById('config-form');
    let playerName = '';
    let currentRows = 0;
    let currentColumns = 0;
    let currentMines = 0;

    configForm.addEventListener('submit', function (event) {
        event.preventDefault();
        playerName = document.getElementById('player-name').value;
        const rows = parseInt(document.getElementById('rows').value);
        const columns = parseInt(document.getElementById('columns').value);
        const mines = parseInt(document.getElementById('mines').value);

        currentRows = rows;
        currentColumns = columns;
        currentMines = mines;

        startGame(rows, columns, mines);
    });

    let boardSize = { rows: 0, columns: 0 };
    let totalMines = 0;
    let remainingCells = 0;
    let gameBoard = [];
    let revealedCells = [];
    let flaggedCells = [];
    let score = 0;

    function startGame(rows, columns, mines) {
        boardSize = { rows, columns };
        totalMines = mines;
        remainingCells = rows * columns;
        gameBoard = Array.from({ length: rows }, () => Array(columns).fill(0));
        revealedCells = Array.from({ length: rows }, () => Array(columns).fill(false));
        flaggedCells = Array.from({ length: rows }, () => Array(columns).fill(false));
        playerName = playerName || 'Player';
        score = 0;

        generateMines(rows, columns, mines);
        createBoard(rows, columns);
        displayScore(score);
    }

    function revealCell(row, col) {
        if (revealedCells[row][col] || flaggedCells[row][col]) {
            return;
        }
    
        if (gameBoard[row][col] === 'mine') {
            gameOver();
        } else if (gameBoard[row][col] === 0) {
            revealEmptyCells(row, col);
        } else {
            revealedCells[row][col] = true;
            remainingCells--;
            score++;
            displayScore(score);
            const cellElement = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
            cellElement.textContent = gameBoard[row][col];
            cellElement.classList.add('revealed');
        }
    }

    function revealCell(row, col) {
        if (revealedCells[row][col] || flaggedCells[row][col]) {
            return;
        }
    
        if (gameBoard[row][col] === 'mine') {
            gameOver();
        } else if (gameBoard[row][col] === 0) {
            revealEmptyCells(row, col);
        } else {
            revealedCells[row][col] = true;
            remainingCells--;
            score++;
            displayScore(score);
            const cellElement = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
            cellElement.textContent = gameBoard[row][col];
            cellElement.classList.add('revealed');
        }
    }
    
    function revealEmptyCells(row, col) {
        const queue = [{ row, col }];
    
        while (queue.length > 0) {
            const { row, col } = queue.shift();
            if (revealedCells[row][col] || flaggedCells[row][col]) {
                continue;
            }
    
            revealedCells[row][col] = true;
            remainingCells--;
            score++;
            displayScore(score);
    
            const cellElement = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
            cellElement.classList.add('revealed');
    
            if (gameBoard[row][col] === 0) {
                for (let m = -1; m <= 1; m++) {
                    for (let n = -1; n <= 1; n++) {
                        const newRow = row + m;
                        const newCol = col + n;
                        if (newRow >= 0 && newRow < boardSize.rows && newCol >= 0 && newCol < boardSize.columns) {
                            queue.push({ row: newRow, col: newCol });
                        }
                    }
                }
            } else {
                cellElement.textContent = gameBoard[row][col];
            }
        }
    }

    function checkWin() {
        if (remainingCells === totalMines) {
            score += 100;
            displayScore(score);
            Swal.fire({
                title: '¡Felicidades!',
                text: `${playerName}, has ganado con un puntaje de ${score}.`,
                icon: 'success',
                confirmButtonText: 'Genial'
            });
        }
    }

    function gameOver() {
        for (let i = 0; i < boardSize.rows; i++) {
            for (let j = 0; j < boardSize.columns; j++) {
                if (gameBoard[i][j] === 'mine') {
                    const cellElement = document.querySelector(`.cell[data-row='${i}'][data-col='${j}']`);
                    cellElement.textContent = '💣';
                    cellElement.classList.add('revealed', 'mine');
                }
            }
        }

        Swal.fire({
            title: '¡Oh no!',
            text: `Has perdido, ${playerName}. ¡Inténtalo de nuevo!`,
            icon: 'error',
            confirmButtonText: 'OK'

        }).then(() => {
            Swal.fire({
                title: 'Tu puntaje fue de: ' + score + ' puntos',
                text: '¿Deseas reiniciar el juego?',
                icon: 'success',
                showCancelButton: true,
                cancelButtonText: 'No',
                confirmButtonText: 'Sí'
            }).then((result) => {
                if (result.isConfirmed) {
                    resetGame();
                }
            })
        })
        }

    function createBoard(rows, columns) {
        const boardElement = document.getElementById('game-board');
        boardElement.innerHTML = '';
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', handleCellClick);
                boardElement.appendChild(cell);
            }
        }
    }

    function generateMines(rows, columns, mines) {
        let minesPlaced = 0;
        while (minesPlaced < mines) {
            const row = Math.floor(Math.random() * rows);
            const col = Math.floor(Math.random() * columns);
            if (gameBoard[row][col] !== 'mine') {
                gameBoard[row][col] = 'mine';
                minesPlaced++;
            }
        }
    
        countAdjacentMines(rows, columns);
    }
    
    function countAdjacentMines(rows, columns) {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (gameBoard[i][j] !== 'mine') {
                    let count = 0;
                    for (let m = -1; m <= 1; m++) {
                        for (let n = -1; n <= 1; n++) {
                            const newRow = i + m;
                            const newCol = j + n;
                            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < columns && gameBoard[newRow][newCol] === 'mine') {
                                count++;
                            }
                        }
                    }
                    gameBoard[i][j] = count;
                }
            }
        }
    }
    

    function displayScore(score) {
        const scoreElement = document.getElementById('score');
        scoreElement.textContent = `Puntaje: ${score}`;
    }

    function handleCellClick(event) {
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);

        if (revealedCells[row][col] || flaggedCells[row][col]) {
            return;
        }
        if (gameBoard[row][col] === 'mine') {
            gameOver();
        } else {
            revealCell(row, col);
            checkWin();
        }
    }

    function resetGame() {
        startGame(currentRows, currentColumns, currentMines);
    }

    resetButton.addEventListener('click', resetGame);

    function checkWin() {
        if (remainingCells === totalMines) {
            score += 100;
            displayScore(score);
            alert(`¡Felicidades, ${playerName}! Has ganado con un puntaje de ${score}.`);
        }
    }
});