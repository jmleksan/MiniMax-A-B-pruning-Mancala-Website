
function createBoard() {
    const board = Array.from(Array(2), () => new Array(6).fill(4));
    return board;
}

function askForMove(board,player) {
while(true) {
        const prompt = require("prompt-sync")();

        var input = prompt(`Player ${player + 1} pick a move: `);

        if (input < 1 || input > 6 || (board[player][input - 1]) == 0) {
            console.log(`Not a possible move. Try again.`)
        } 
        else {
            break
        }
    }
    return input - 1
}

function displayPlayerLine(board,player,top) {
    let string = ""
    if (top == true) {
        string += String(player) + " "
        for (var i = 0; i < board[0].length; i++) {
            string += board[0][i] + " ";
        }
    } else {
        string += "  "
        for (var i = 0; i < board[1].length; i++) {
            string += board[1][i] + " ";
        }
        string += String(player)
    }
    console.log(string);
}

function checkEnd(board, player) {
    let count = 0
    for (i = 0; i < 6; i++) {
        count += board[player][i]
    }
    if (count == 0) {
        return true
    }
    else {
        return false
    }
}

function displayBoard(board, p1, p2) {
    displayPlayerLine(board,p1,true);
    displayPlayerLine(board,p2,false);
}

function getScore(tempBoard,player,tempScore) {
    if (player == 0) {
        for (i=0;i<6;i++) {
            tempScore[1] += tempBoard[1][i]
            tempBoard[1][i] = 0
        }
    } else {
        for (i=0;i<6;i++) {
            tempScore[0] += tempBoard[0][i]
            tempBoard[0][i] = 0
        }
    }
}

function winner() {
    if (score[0] > score[1]) {
        win = 0
    } 
    else if (score[1] > score[0]) {
        win = 1
    } else {
        win = 2
    }
}

function takeTurn(tempBoard, player, pos, tempScore) {
    let end = 0
    //displayBoard(board,score[0],score[1])
    row = player
    //pos = askForMove(board,player)
    if (row == 0) {
        opRow = 1
        let num = tempBoard[row][pos]
        tempBoard[row][pos] = 0
        for (var i = 1; i < num + 1; i++) {
            if (pos - i == -1 && i < 12) {
                row += 1
                tempScore[0] += 1
                pos -= i * 2
                currentPlayer = 0
            } else if (pos + i == 6 && i >= 6){
                row -= 1
                pos += i * 2 - 1
                tempBoard[row][pos - i] += 1
                currentPlayer = 1
            } else if (row == 1) {
                tempBoard[row][pos + i] += 1
                currentPlayer = 1
            } else {
                tempBoard[row][pos - i] += 1
                currentPlayer = 1
            }
            end = pos - i
        }
    } else {
        let num = tempBoard[row][pos]
        tempBoard[row][pos] = 0
        opRow = 0
        for (var i = 1; i < num + 1; i++) {
            if (pos - i == -1 && i >= 6) {
                row += 1
                pos -= (i * 2) - 1
                tempBoard[row][pos + i] += 1
                currentPlayer = 0
            } else if (pos + i == 6 && i < 6){
                row -= 1
                tempScore[1] += 1
                pos += i * 2 - 1
                currentPlayer = 1
            } else if (row == 0) {
                tempBoard[row][pos - i] += 1
                currentPlayer = 0
            } else {
                tempBoard[row][pos + i] += 1
                currentPlayer = 0
            }
            end = pos + i
        }
    }
    
    if (row == player && tempBoard[row][end] == 1 && tempBoard[opRow][end] > 0) {
        if (player == 0) {
            tempScore[0] += tempBoard[0][end] + tempBoard[1][end]
        }
        else {
            tempScore[1] += tempBoard[0][end] + tempBoard[1][end]
        }
        tempBoard[0][end] = 0
        tempBoard[1][end] = 0
    }
    if (checkEnd(tempBoard,player)){
        getScore(tempBoard,player,tempScore)
    }
    //return score
}

function Validate(board,player,pos,score) {
    if (currentPlayer == player && board[player][pos] != 0) {
        takeTurn(board,player,pos,score)
        if (checkEnd(board,player)){
            winner()
        }
        if (AI == true && currentPlayer == 1 && win == null) {
            AIMove(board,1,score)
            currentPlayer = 0
        }
        if (checkEnd(board,player)){
            winner()
        }
        updateList()
    } 
    return false
}

function findPossibleMoves(tempBoard,player) {
    moves = []
    for (i=0;i<6;i++) {
        if (tempBoard[player][i] != 0) {
            moves.push(i)
        }
    }
    return moves
}

function miniMax(tempBoard,player,tempScore,maxPlayer,depth, alpha, beta) {
    let possibleMoves = findPossibleMoves(tempBoard,player)

    if (player == 0) {
        anti = 1
    } else {
        anti = 0
    }

    boardCopy2 = JSON.parse(JSON.stringify(tempBoard))
    scoreCopy2 = JSON.parse(JSON.stringify(tempScore))

    if (checkEnd(boardCopy2,player) == true) {
        getScore(boardCopy2,player,scoreCopy2)
        eva = scoreCopy2[player] - scoreCopy2[anti]
        return {score: eva}
    }

    if (depth == 0) {
        eva = scoreCopy2[player] - scoreCopy2[anti]
        return {score: eva}
    }

    let moves = []

    for (let i = 0; i < possibleMoves.length; i++) {
        let currentTestScore = {}
        currentTestScore.index = possibleMoves[i]
        boardCopy2 = JSON.parse(JSON.stringify(tempBoard))
        scoreCopy2 = JSON.parse(JSON.stringify(tempScore))
        takeTurn(boardCopy2,player,possibleMoves[i],scoreCopy2)

        if (currentPlayer == player) {
            if (maxPlayer == true) {
                eva = miniMax(boardCopy2,player,scoreCopy2,true,depth,alpha,beta)
                currentTestScore.score = eva.score
                alpha = Math.max(alpha,eva.score)
            } 
            else {
                eva = miniMax(boardCopy2,anti,scoreCopy2,false,depth,alpha,beta)
                currentTestScore.score = eva.score
                beta = Math.min(beta,eva.score)
            }
        } else {

            if (maxPlayer == true) {
                eva = miniMax(boardCopy2,anti,scoreCopy2,false,depth - 1,alpha,beta)
                currentTestScore.score = eva.score
                alpha = Math.max(alpha,eva.score)
            } 
            else {
                eva = miniMax(boardCopy2,player,scoreCopy2,true,depth - 1,alpha,beta)
                currentTestScore.score = eva.score
                beta = Math.min(beta,eva.score)
            }
        }
        boardCopy2 = JSON.parse(JSON.stringify(tempBoard))
        scoreCopy2 = JSON.parse(JSON.stringify(tempScore))

        moves.push(currentTestScore)   

        if (alpha >= beta) {
            break
        }
    }   

    let bestPlay = null

    if (maxPlayer == true) {
        let maxEva = -Infinity
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > maxEva) {
                maxEva = moves[i].score;
                bestPlay = i;
            }
        }
    } 
    else {
        let minEva = Infinity
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < minEva) {
                minEva = moves[i].score;
                bestPlay = i;
            }
        }
    }
    return moves[bestPlay]
}


function AIMove(board,player,score) {
    bestMove = miniMax(board,player,score,true,7,-Infinity,Infinity)
    takeTurn(board,player,bestMove.index,score)
}

function updateList() {
    document.getElementById("00").innerHTML = board[0][0];
    document.getElementById("01").innerHTML = board[0][1];
    document.getElementById("02").innerHTML = board[0][2];
    document.getElementById("03").innerHTML = board[0][3];
    document.getElementById("04").innerHTML = board[0][4];
    document.getElementById("05").innerHTML = board[0][5];
    document.getElementById("1s").innerHTML = score[0];
    document.getElementById("10").innerHTML = board[1][0];
    document.getElementById("11").innerHTML = board[1][1];
    document.getElementById("12").innerHTML = board[1][2];
    document.getElementById("13").innerHTML = board[1][3];
    document.getElementById("14").innerHTML = board[1][4];
    document.getElementById("15").innerHTML = board[1][5];
    document.getElementById("2s").innerHTML = score[1];
    if (win == null) {
        if (currentPlayer == 0) {
            document.getElementById("currentPlayer").innerHTML = "Current Player: Player 1";
        } else {
            document.getElementById("currentPlayer").innerHTML = "Current Player: Player 2";
        }
    } else {
        if (win == 0) {
            document.getElementById("currentPlayer").innerHTML = "Player 1 Wins!";
        } else if (win == 1) {
            document.getElementById("currentPlayer").innerHTML = "Player 2 Wins!";
        } else {
            document.getElementById("currentPlayer").innerHTML = "It's a tie!";
        }
    }
}

function AIButton(){
    if (AI == false){
        AI = true
        if (currentPlayer == 1) {
            AIMove(board,1,score)
            updateList()
        }
        document.getElementById("AIButton").innerHTML = "Turn AI Off";
    } else {
        AI = false
        document.getElementById("AIButton").innerHTML = "Turn AI On";
    }
    return false
}


const score = [0,0]
let currentPlayer = 0
AI = false
let win = null
const board = createBoard()

/*while (true) {
    player1Score += takeTurn(board, player1)
    if (checkEnd(board,player1) == true) {
        break
    }
    player2Score += takeTurn(board, player2)
    if (checkEnd(board,player2) == true) {
        break
    }
}

if (player1Score > player2Score){
    console.log(`player 1 wins with a score of ${player1Score} to ${player2Score}`)
} else {
    console.log(`player 2 wins with a score of ${player2Score} to ${player1Score}`)
}
*/

