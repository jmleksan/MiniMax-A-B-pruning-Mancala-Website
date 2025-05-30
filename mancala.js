function createBoard() {
  return Array.from(Array(2), () => new Array(6).fill(4));
}

function checkEnd(board, player) {
  return board[player].every(seeds => seeds === 0);
}

function declareWinner(score) {
  if (score[0] > score[1]) return 0;
  if (score[1] > score[0]) return 1;
  return 2;
}

let finalScoreDisplay = null;

function checkGameOver(board, score) {
  if (checkEnd(board, 0)) {
    for (let i = 0; i < 6; i++) {
      score[1] += board[1][i];
      board[1][i] = 0;
    }
    finalScoreDisplay = [score[0], score[1]];
    updateVisuals();
    return declareWinner(score);
  }
  if (checkEnd(board, 1)) {
    for (let i = 0; i < 6; i++) {
      score[0] += board[0][i];
      board[0][i] = 0;
    }
    finalScoreDisplay = [score[0], score[1]];
    updateVisuals();
    return declareWinner(score);
  }
  return null;
}

function simulateGameOver(board, score) {
  const tempBoard = [board[0].slice(), board[1].slice()];
  const tempScore = [score[0], score[1]];

  if (checkEnd(tempBoard, 0)) {
    for (let i = 0; i < 6; i++) {
      tempScore[1] += tempBoard[1][i];
      tempBoard[1][i] = 0;
    }
    return { over: true, score: tempScore };
  }

  if (checkEnd(tempBoard, 1)) {
    for (let i = 0; i < 6; i++) {
      tempScore[0] += tempBoard[0][i];
      tempBoard[0][i] = 0;
    }
    return { over: true, score: tempScore };
  }

  return { over: false };
}

function takeTurn(board, player, pos, score, visuals = true) {
  let seeds = board[player][pos];
  board[player][pos] = 0;

  let row = player;
  let index = pos;
  let extraTurn = false;

  while (seeds > 0) {
    if (row === 0) {
      if (index < 5) {
        index++;
      } else {
        if (player === 0) {
          score[0]++;
          seeds--;
          if (seeds === 0) {
            extraTurn = true;
            break;
          }
        }
        row = 1;
        index = 5;
        continue;
      }
    } else {
      if (index > 0) {
        index--;
      } else {
        if (player === 1) {
          score[1]++;
          seeds--;
          if (seeds === 0) {
            extraTurn = true;
            break;
          }
        }
        row = 0;
        index = 0;
        continue;
      }
    }
    board[row][index]++;
    seeds--;
  }

  if (!extraTurn && row === player && board[row][index] === 1 && board[1 - row][index] > 0) {
    score[player] += board[1 - row][index] + board[row][index];
    board[1 - row][index] = 0;
    board[row][index] = 0;
  }

  const winner = checkGameOver(board, score);
  if (winner !== null && visuals) {
    win = winner;
  }

  if (visuals) updateVisuals();

  return extraTurn ? player : 1 - player;
}

function Validate(board, player, pos, score) {
  if (win !== null || currentPlayer !== player || board[player][pos] === 0) {
    return false;
  }

  currentPlayer = takeTurn(board, player, pos, score);

  if (AI && currentPlayer === 1 && win === null) {
    AIMove(board, 1, score);
  }

  updateVisuals();
  return true;
}

function findPossibleMoves(board, player) {
  return board[player].map((val, idx) => (val > 0 ? idx : -1)).filter(idx => idx !== -1);
}

function evaluate(board, score, player) {
  const playerSeeds = board[player].reduce((a, b) => a + b, 0);
  const opponentSeeds = board[1 - player].reduce((a, b) => a + b, 0);
  return (score[player] - score[1 - player]) + 0.2 * (playerSeeds - opponentSeeds);
}

const transpositionTable = new Map();

function miniMax(board, player, score, isMax, depth, alpha, beta) {
  const gameOver = simulateGameOver(board, score);
  if (gameOver.over || depth === 0) {
    const finalScore = gameOver.over ? gameOver.score : score;
    return { score: evaluate(board, finalScore, player) };
  }

  const possibleMoves = findPossibleMoves(board, player).sort((a, b) => board[player][b] - board[player][a]);
  if (possibleMoves.length === 0) return { score: evaluate(board, score, player) };

  let best = { index: possibleMoves[0], score: isMax ? -Infinity : Infinity };

  if (isMax) {
    for (let move of possibleMoves) {
      const boardCopy = [board[0].slice(), board[1].slice()];
      const scoreCopy = [score[0], score[1]];
      const nextPlayer = takeTurn(boardCopy, player, move, scoreCopy, false);
      const result = miniMax(boardCopy, nextPlayer, scoreCopy, nextPlayer === player, depth - 1, alpha, beta);
      if (result.score > best.score) {
        best = { index: move, score: result.score };
      }
      alpha = Math.max(alpha, result.score);
      if (beta <= alpha) break;
    }
  } else {
    for (let move of possibleMoves) {
      const boardCopy = [board[0].slice(), board[1].slice()];
      const scoreCopy = [score[0], score[1]];
      const nextPlayer = takeTurn(boardCopy, player, move, scoreCopy, false);
      const result = miniMax(boardCopy, nextPlayer, scoreCopy, nextPlayer === player, depth - 1, alpha, beta);
      if (result.score < best.score) {
        best = { index: move, score: result.score };
      }
      beta = Math.min(beta, result.score);
      if (beta <= alpha) break;
    }
  }

  return best;
}

function AIMove(board, player, score) {
  const depth = 10;
  aiMoveHistory = []; // reset

  while (currentPlayer === player && win === null) {
    const best = miniMax(board, player, score, true, depth, -Infinity, Infinity);
    if (best && best.index !== undefined) {
      aiMoveHistory.push(best.index);

      const pitId = "1" + (5 - best.index);
      const pit = document.getElementById(pitId);
      if (pit) {
        pit.classList.add("ai-move");
        setTimeout(() => pit.classList.remove("ai-move"), 1500);
      }

      currentPlayer = takeTurn(board, player, best.index, score);
    } else {
      break;
    }
  }

  updateVisuals();
  updateLastMoveDisplay();
}

function renderSeeds(pitId, count) {
  const pit = document.getElementById(pitId);
  pit.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.classList.add('pit-content');

  if (count > 12) wrapper.classList.add('too-many');

  for (let i = 0; i < count; i++) {
    const seed = document.createElement('div');
    seed.classList.add('seed');
    wrapper.appendChild(seed);
  }

  const label = document.createElement('div');
  label.classList.add('pit-label');
  label.innerText = count;
  pit.appendChild(label);

  pit.appendChild(wrapper);
}

function updateVisuals() {
  for (let i = 0; i < 6; i++) {
    renderSeeds("0" + i, board[0][i]);
    renderSeeds("1" + (5 - i), board[1][i]);
  }
  renderSeeds("1s", score[0]);
  renderSeeds("2s", score[1]);

  for (let i = 0; i < 6; i++) {
    document.getElementById("0" + i).classList.remove("player1", "player2");
    document.getElementById("1" + i).classList.remove("player1", "player2");
  }
  document.getElementById("1s").classList.remove("player1", "player2");
  document.getElementById("2s").classList.remove("player1", "player2");

  if (win === null) {
    if (currentPlayer === 0) {
      for (let i = 0; i < 6; i++) document.getElementById("0" + i).classList.add("player1");
      document.getElementById("1s").classList.add("player1");
    } else {
      for (let i = 0; i < 6; i++) document.getElementById("1" + i).classList.add("player2");
      document.getElementById("2s").classList.add("player2");
    }
  }

  const cp = document.getElementById("currentPlayer");
  if (win === null) {
    cp.innerText = `Current Player: Player ${currentPlayer + 1}`;
  } else if (win === 2) {
    cp.innerText = `It's a tie! Final Score: P1 ${score[0]} - P2 ${score[1]}`;
  } else {
    cp.innerText = `Player ${win + 1} Wins! Final Score: P1 ${score[0]} - P2 ${score[1]}`;
  }
}

function updateLastMoveDisplay() {
  const lastMoveText = document.getElementById("lastMove");
  if (lastMoveText && AI && aiMoveHistory.length > 0 && win === null) {
    lastMoveText.innerText = `AI moves: ${aiMoveHistory.join(" → ")}`;
  } else if (lastMoveText) {
    lastMoveText.innerText = "";
  }
}

function AIButton() {
  AI = !AI;
  document.getElementById("AIButton").innerText = AI ? "Turn AI Off" : "Turn AI On";

  if (AI && currentPlayer === 1 && win === null) {
    AIMove(board, 1, score);
  }

  updateVisuals();
  return false;
}

function resetGame() {
  win = null;
  currentPlayer = 0;
  score[0] = 0;
  score[1] = 0;
  board[0] = [4, 4, 4, 4, 4, 4];
  board[1] = [4, 4, 4, 4, 4, 4];
  aiMoveHistory = [];
  updateVisuals();
  updateLastMoveDisplay();
  document.getElementById("AIButton").innerText = AI ? "Turn AI Off" : "Turn AI On";
}

// === Global Game State ===
let AI = false;
let win = null;
let currentPlayer = 0;
let aiMoveHistory = [];
const board = createBoard();
const score = [0, 0];

window.onload = () => {
  updateVisuals();
  document.getElementById("AIButton").innerText = "Turn AI On";
};
