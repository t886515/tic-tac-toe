window.onload = main;

// Global game record/model

let cacheCoordinate = [];

let turnCount = 0;
let gameRecord = new GameRecord();

function main() {
  bindEventListeners();
}

function resetGame() {
  gameRecord = new GameRecord();
  turnCount = 0;
  cacheCoordinate = [];
  rebuildBoard();
  resetCurrentPlayer();
  removeModal();
  bindEventListeners();
}

function GameRecord() {
  return {
    O: {
      row: [[], [], []],
      col: [[], [], []]
    },
    X: {
      row: [[], [], []],
      col: [[], [], []]
    }
  };
}

function bindEventListeners() {
  const listOfBlocks = document.getElementsByClassName('col');
  for (let i = 0; i < listOfBlocks.length; i++) {
    let ele = listOfBlocks[i];
    ele.addEventListener('click', onClickBlock);
  }
}

function rebuildBoard() {
  const newBoard = buildBoard();
  const boardAnchor = document.getElementById('board-score');
  const oldBoard = document.getElementById('board');
  boardAnchor.replaceChild(newBoard, oldBoard);
}

function buildBoard() {
  const board = document.createElement('div');
  board.id = 'board';
  board.className = 'board';
  for (let i = 0; i < 3; i++) {
    let row = document.createElement('div');
    row.className = `row row-${i}`;
    for (let j = 0; j < 3; j++) {
      let col = document.createElement('div');
      col.className = `col col-${j}`;
      col.id = `${i},${j}`;
      let flipCardWrapper = createFlippingCards();
      col.appendChild(flipCardWrapper);
      row.appendChild(col);
    }
    board.appendChild(row);
  };
  return board;
}

function resetCurrentPlayer() {
  const currentPlayer = document.getElementById('current-player');
  currentPlayer.innerHTML = 'O';
  currentPlayer.classList.remove('X');
  currentPlayer.classList.add('O');
}

function createFlippingCards() {
  const flipCardWrapper = document.createElement('div');
  flipCardWrapper.className = "flip-card-wrapper";
  const flipCardFront = document.createElement('div');
  flipCardFront.className = "flip-card-front";
  const flipCardBack = document.createElement('div');
  flipCardBack.className = "flip-card-back";
  flipCardWrapper.appendChild(flipCardFront);
  flipCardWrapper.appendChild(flipCardBack);
  return flipCardWrapper;
}

function onClickBlock(e) {
  console.log('i clicked on:', e.currentTarget.id);
  const blockId = e.currentTarget.id;
  // if can't find in cache value
  if (!cacheCoordinate.includes(blockId)) {
    // push to cache value
    cacheCoordinate.push(blockId);

    // evaluate symbol to put
    const currentSymbol = evaluateSymbol();

    updateDOM(currentSymbol, blockId);
    updateGameRecord(currentSymbol, blockId);

    // if counter > 4;
    // determine win or tie from game record
    if (turnCount > 4) {
      const won = determineResult(currentSymbol, blockId);
      if (won) {
        handleEndGame(currentSymbol + ' player won the game!');
        return;
      }
    }
    if (turnCount === 9) {
      handleEndGame('We have a tie!');
    }
  } else {
    console.log('Already selected!');
  }
}

/** ======================== */
/** END GAME: Modal handling */
function handleEndGame(message) {
  updateModalMessage(message);
  addResetGameEvents();
  renderModal();
}

function updateModalMessage(message) {
  const modalMessage = document.getElementById('end-game-message');
  modalMessage.innerHTML = message;
}

function renderModal() {
  const app = document.getElementById('app');
  app.classList.add("modal-show");
}

function removeModal() {
  const app = document.getElementById('app');
  app.classList.remove("modal-show");
}

function addResetGameEvents() {
  const resetButton = document.getElementById('reset-button')
  resetButton.addEventListener('click', resetGame);
}

/** END GAME: Modal handling */
/** ======================== */

/** ====================== */
/** IN GAME: card handling */
function updateDOM(currentSymbol, blockId) {
  const block = document.getElementById(blockId);
  appendSymbolToCard(block, currentSymbol);
  updateInnerCardStatus(block);
  updateCurrentPlayer();
}

function createSymbolElement(currentSymbol) {
  const symbolElement = document.createElement('div');
  symbolElement.innerHTML = currentSymbol;
  symbolElement.className = currentSymbol;
  symbolElement.classList.add("board-symbol");
  return symbolElement;
}
function updateInnerCardStatus(block) {
  const cardWrapper = block.querySelector(".flip-card-wrapper");
  cardWrapper.classList.add("flip-card-wrapper--clicked");
};
function appendSymbolToCard(block, currentSymbol) {
  const symbolElement = createSymbolElement(currentSymbol);
  const cardBack = block.querySelector(".flip-card-back");
  cardBack.appendChild(symbolElement);
}

function updateCurrentPlayer() {
  const currentPlayer = document.getElementById('current-player');
  currentPlayer.innerHTML = turnCount % 2 === 1 ? 'X' : 'O';
  currentPlayer.classList.toggle('O');
  currentPlayer.classList.toggle('X');
}


/** IN GAME: card handling */
/** ====================== */

/** =================== */
/** IN GAME: game logic */

function updateGameRecord(currentSymbol, blockId) {
  const splitId = blockId.split(',');
  const x = splitId[0];
  const y = splitId[1];
  gameRecord[currentSymbol].row[x].push(blockId);
  gameRecord[currentSymbol].col[y].push(blockId);
}
function evaluateSymbol() {
  turnCount++;
  return turnCount % 2 === 1 ? 'O' : 'X';
}

function determineResult(currentSymbol, blockId) {
  // determine row or col win
  if (
    determineDiagonalWin(currentSymbol) ||
    determineRowOrColumnWin(currentSymbol)
  ) {
    return true;
  } else {
    return false;
  }
}

function determineRowOrColumnWin(currentSymbol) {
  const rowAndCol = gameRecord[currentSymbol];
  for (let i = 0; i < rowAndCol.row.length; i++) {
    let rows = rowAndCol.row[i];
    let cols = rowAndCol.col[i];
    if (rows.length === 3 || cols.length === 3) {
      return true;
    }
  }
  return false;
}

function determineDiagonalWin(currentSymbol) {
  const condition1 = ['0,0', '1,1', '2,2'];
  const condition2 = ['0,2', '1,1', '2,0'];
  const meets1 = checkIncludes(currentSymbol, condition1);
  const meets2 = checkIncludes(currentSymbol, condition2);
  return meets1 || meets2;
}

function checkIncludes(currentSymbol, conditions) {
  for (let i = 0; i < conditions.length; i++) {
    let rowToCheck = gameRecord[currentSymbol].row[i];
    let pair = conditions[i];
    if (!rowToCheck.includes(pair)) {
      return false;
    }
  }
  return true;
}

/** IN GAME: game logic */
/** =================== */