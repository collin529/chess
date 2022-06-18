//Load HTTP module
const http = require("http");
const { setUncaughtExceptionCaptureCallback } = require("process");
const hostname = '127.0.0.1';
const port = 3000;

//Create HTTP server and listen on port 3000 for requests
const server = http.createServer((req, res) => {

  //Set the response HTTP header with HTTP status and Content type
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});


// create the board
// init pieces
// make white pawns go +1 vertically and black -1

// rules:
// - white goes first, maintain who's turn it is, alternate
// - handle piece movements
//   - pawn
//     - attacking
//   - rook
//   - knight
//   - bishop
//   - queen
//   - king
// - handle pieces being blocked by other pieces (yours or enemy pieces)
// - handle check/checkmate
// - stalemate
// - pawns can move 2 spaces from starting square



// GOING THE EXTRA MILE
// - rendering the board


//listen for request on port 3000, and as a callback function have the port listened on logged
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);

    let grid = [ 
        ["w rook",   "w pawn", "", "", "", "", "b pawn", "b rook"],
        ["w knight", "w pawn", "", "", "", "", "b pawn", "b knight"],
        ["w bishop", "w pawn", "", "", "", "", "b pawn", "b bishop"],
        ["w queen",  "w pawn", "", "", "", "", "b pawn", "b queen"],
        ["w king",   "w pawn", "", "", "", "", "b pawn", "b knight"],
        ["w bishop", "w pawn", "", "", "", "", "b pawn", "b bishop"],
        ["w knight", "w pawn", "", "", "", "", "b pawn", "b knight"],
        ["w rook",   "w pawn", "", "", "", "", "b pawn", "b rook"]
    ];

    let isWhiteTurn = true;
    let turnCounter = 0;

    /*
    while(true) {
        turnCounter++;
        runPlayerTurn(grid, isWhiteTurn, turnCounter);
        isWhiteTurn = !isWhiteTurn;
    }
    */

});

function runPlayerTurn(grid, isWhiteTurn, turnCounter) {
    console.log(turnCounter, '...', isWhiteTurn);
}

// the player inputs their move here
function playerTurn(grid, isWhiteTurn, row1, col1, row2, col2) {
    // start and end pos cannot be the same
    if(isSameCoordinate(row1, col1, row2, col2)) {
        return false;
    }

    // starting position is OOB, invalid move
    if(!isOOB(row1, col1)) {
        return false;
    }

    // ending position is OOB, invalid move
    if(isOOB(row2, col2)) {
        return false;
    }

    // OOB check has passed, continue validating this move
    let piece = grid[row1][col1];
    switch(piece) {
        case "pawn":
            movePawn(grid, isWhiteTurn, row1, col1, row2, col2);
            break;
        case "rook":
            moveRook(grid, isWhiteTurn, row1, col1, row2, col2);
            break;
        case "bishop":
            moveBishop(grid, isWhiteTurn, row1, col1, row2, col2);
            break;
        case "knight":
            moveKnight(grid, isWhiteTurn, row1, col1, row2, col2);
            break;
        case "queen":
            moveQueen(grid, isWhiteTurn, row1, col1, row2, col2);
            break;
        case "king":
            moveKing(grid, isWhiteTurn, row1, col1, row2, col2);
            break;
    }


    // TODO: correct this later because we are assuming a valid move

    // destination piece = starting piece
    grid[row2][col2] = grid[row1][col1];

    // erase the old piece
    grid[row1][col1] = "";

    return true;
}

function isOOB(row, col) {
    return row < 0 || row >= 8 || col < 0 || col >= 8;
}

function movePawn(grid, isWhiteTurn, row1, col1, row2, col2) {
    // be able to move 2 from initial square    - ignore for now
    // en passant                               - ignore for now

    let forwardDirection = 1;
    if(!isWhiteTurn) {
        forwardDirection = -1;
    }
    let newRow = row1 + forwardDirection;

    if(row2 != newRow) {
        return false;
    }

    // move forward 1 if there is no enemy piece
    if(col2 == col1 && grid[newRow][col2] == "") {
        return true;
    }
    // check diagonal
    else if((col2 == col1 - 1 || col2 == col1 + 1) && grid[row2][col2] != "") {
        return true;
    }
    return false;
}

function moveRook(grid, isWhiteTurn, row1, col1, row2, col2) {
    // up
    for(let i = row1; i < 8; i++) {
        if(row2 == i && col2 == col1) {
            return true;
        }

        // we have encountered another piece- abort
        if(grid[i][col1] != "") {
            break;
        }
    }
    // down
    for(let i = row1; i >= 0; i--) {
        if(row2 == i && col2 == col1) {
            return true;
        }

        // we have encountered another piece- abort
        if(grid[i][col1] != "") {
            break;
        }
    }
    // right
    for(let j = col1; j < 8; j++) {
        if(col2 == j && row2 == row1) {
            return true;
        }

        // we have encountered another piece- abort
        if(grid[row1][j] != "") {
            break;
        }
    }
    // left
    for(let j = col1; j >= 0; j--) {
        if(col2 == j && row2 == row1) {
            return true;
        }

        // we have encountered another piece- abort
        if(grid[row1][j] != "") {
            break;
        }
    }
    return false;
}

function moveBishop(grid, isWhiteTurn, row1, col1, row2, col2) {
    // up right
    for(let i = row1, j = col1; i < 8, j < 8; i++, j++) {
        if(row2 == i && col2 == j) {
            return true;
        }
    
        // we have encountered another piece- abort
        if(grid[i][j] != "") {
            break;
        }
    }
    // down right
    for(let i = row1, j = col1; i >= 0, j < 8; i--, j++) {
        if(row2 == i && col2 == j) {
            return true;
        }
        
        // we have encountered another piece- abort
        if(grid[i][j] != "") {
            break;
        }
    }
    // up left
    for(let i = row1, j = col1; i < 8, j >= 0; i++, j--) {
        if(row2 == i && col2 == j) {
            return true;
        }
    
        // we have encountered another piece- abort
        if(grid[i][j] != "") {
            break;
        }
    }
    // down left
    for(let i = row1, j = col1; i >= 0, j >= 0; i--, j--) {
        if(row2 == i && col2 == j) {
            return true;
        }
    
        // we have encountered another piece- abort
        if(grid[i][j] != "") {
            break;
        }
    }
    return false;
}

function moveKnight(grid, isWhiteTurn, row1, col1, row2, col2) {
    let rowPositions = [-1,-2,-2,-1, 1, 2, 2, 1];
    let colPositions = [ 2, 1,-1,-2,-2,-1, 1, 2];

    for(let i = 0; i < 8; i++) {
        let resultingRow = row1 + rowPositions[i];
        let resultingCol = col1 + colPositions[i];

        if(!isOOB(resultingRow, resultingCol)) {
            return true;
        }
    }
    return false
}

    // 0 0 0 0 0 0 0 0 
    // 0 0 0 0 0 0 0 0
    // 0 0 0 0 0 0 0 0
    // 0 0 0 0 0 0 0 0
    // 0 0 0 0 0 0 k 0
    // 0 0 0 0 0 0 0 0
    // 0 0 0 0 0 X 0 0
    // 0 0 0 0 0 0 0 0


function moveQueen(grid, isWhiteTurn, row1, col1, row2, col2) {
    // up
    for(let i = row1; i < 8; i++) {
        if(row2 == i && col2 == col1) {
            return true;
        }

        // we have encountered another piece- abort
        if(grid[i][col1] != "") {
            break;
        }
    }
    // down
    for(let i = row1; i >= 0; i--) {
        if(row2 == i && col2 == col1) {
            return true;
        }

        // we have encountered another piece- abort
        if(grid[i][col1] != "") {
            break;
        }
    }
    // right
    for(let j = col1; j < 8; j++) {
        if(col2 == j && row2 == row1) {
            return true;
        }

        // we have encountered another piece- abort
        if(grid[row1][j] != "") {
            break;
        }
    }
    // left
    for(let j = col1; j >= 0; j--) {
        if(col2 == j && row2 == row1) {
            return true;
        }

        // we have encountered another piece- abort
        if(grid[row1][j] != "") {
            break;
        }
    }
    // up right
    for(let i = row1, j = col1; i < 8, j < 8; i++, j++) {
        if(row2 == i && col2 == j) {
            return true;
        }
    
        // we have encountered another piece- abort
        if(grid[i][j] != "") {
            break;
        }
    }
    // down right
    for(let i = row1, j = col1; i >= 0, j < 8; i--, j++) {
        if(row2 == i && col2 == j) {
            return true;
        }
        
        // we have encountered another piece- abort
        if(grid[i][j] != "") {
            break;
        }
    }
    // up left
    for(let i = row1, j = col1; i < 8, j >= 0; i++, j--) {
        if(row2 == i && col2 == j) {
            return true;
        }
    
        // we have encountered another piece- abort
        if(grid[i][j] != "") {
            break;
        }
    }
    // down left
    for(let i = row1, j = col1; i >= 0, j >= 0; i--, j--) {
        if(row2 == i && col2 == j) {
            return true;
        }
    
        // we have encountered another piece- abort
        if(grid[i][j] != "") {
            break;
        }
    }
    return false;
}

function moveKing(grid, isWhiteTurn, row1, col1, row2, col2) {
    let rowPositions = [-1,-1,-1, 0, 1, 1, 1, 0];
    let colPositions = [ 1, 0,-1,-1,-1, 0, 1, 1];

    for(let i = 0; i < 8; i++) {
        let resultingRow = row1 + rowPositions[i];
        let resultingCol = col1 + colPositions[i];

        if(!isOOB(resultingRow, resultingCol)) {
            return true;
        }
    }
    return false
}

function isSameCoordinate(row1, col1, row2, col2) {
    return row1 == row2 && col1 == col2;
}


// we never need to check the location of our computed paths for the piece to go in the grid
// what we do instead, is check if the computed path is equal to row2,col2
// then since we know row2,col2 is not OOB, we can do grid[row2][col2]