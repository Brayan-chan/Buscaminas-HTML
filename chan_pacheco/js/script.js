

function handleCellTouch(event) {
    event.preventDefault();
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

