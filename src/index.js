window.onload = main;

// Global game record/model

let cacheCoordinate = [];

let turnCount = 0;
let gameRecord = new GameRecord();
// let currentSymbol;
// let currentId;

function main() {
  bindEventListeners();
}

function resetGame() {
  gameRecord = new GameRecord();
  turnCount = 0;
  cacheCoordinate = [];
  rebuildBoard();
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
  const boardAnchor = document.getElementById('board-anchor');
  const oldBoard = document.getElementById('board');
  oldBoard.remove();
  console.log(boardAnchor, newBoard)
  boardAnchor.appendChild(newBoard);
}

function buildBoard() {
  const board = document.createElement('div');
  board.id = 'board';
  for (let i = 0; i < 3; i++) {
    let row = document.createElement('div');
    row.className = `row row-${i}`;
    for (let j = 0; j < 3; j++) {
      let col = document.createElement('div');
      col.className = `col col-${j}`;
      col.id = `${i},${j}`;
      row.appendChild(col);
    }
    board.appendChild(row);
  };
  return board;
}
function onClickBlock(e) {
  console.log('i clicked on:', e.target.id);
  const blockId = e.target.id;
  // if can't find in cache value
  if (!cacheCoordinate.includes(blockId)) {
    // push to cache value
    cacheCoordinate.push(blockId);

    // evaluate symbol to put
    const currentSymbol = evaluateSymbol();

    // update dom to 1 create symbol ele 2 append to dom
    updateDOM(currentSymbol, blockId);
    //
    // update game record
    updateGameRecord(currentSymbol, blockId);

    // if counter > 4;
    // determine win or tie from game record
    if (turnCount > 4) {
      const won = determineResult(currentSymbol, blockId);
      console.log('?', won);
      if (won) {
        console.log(currentSymbol, 'WON THE GAME!');
        renderModal(currentSymbol + ' player won the game!');
        // resetGame();
        // end game
        return;
      }
    }
    if (turnCount === 9) {
      console.log('TIE!');
      renderModal('Tie!');
      // resetGame();
      // end game
    }
  } else {
    console.log('Already selected!');
  }
}

function renderModal(currentSymbol) {
  const anchorModalElement = document.getElementById('modal-anchor');
  const modalContentElement = createModalContentElement(currentSymbol);
  const modalBackgroundElement = createModelBackgroundElement(
    modalContentElement
  );
  anchorModalElement.append(modalBackgroundElement);
}

function removeModal() {
  const modalBackgroundElement = document.getElementById('modal');
  modalBackgroundElement.remove();
}

function createModelBackgroundElement(modalContentElement) {
  const modalElement = document.createElement('div');
  modalElement.className = 'modal-background';
  modalElement.id = 'modal';
  modalElement.append(modalContentElement);
  return modalElement;
}

function createModalContentElement(displayMessage) {
  const modalContentElement = document.createElement('div');
  modalContentElement.className = 'modal-content';
  modalContentElement.innerHTML = displayMessage;
  const resetButton = createResetButton();
  modalContentElement.appendChild(resetButton);
  return modalContentElement;
}

function createResetButton() {
  const resetButton = document.createElement('button');
  resetButton.innerHTML = "Reset Board";
  resetButton.className = "button reset-button";
  // resetButton.removeEventListener('click');
  resetButton.addEventListener('click', resetGame);
  return resetButton;
}

function evaluateSymbol() {
  turnCount++;
  return turnCount % 2 === 1 ? 'O' : 'X';
}

function updateDOM(currentSymbol, blockId) {
  const symbolElement = createSymbolElement(currentSymbol);
  appendSymbol(symbolElement, blockId);
}

function createSymbolElement(currentSymbol) {
  const symbolElement = document.createElement('div');
  symbolElement.innerHTML = currentSymbol;
  symbolElement.className = currentSymbol;
  return symbolElement;
}

function appendSymbol(symbolElement, blockId) {
  const block = document.getElementById(blockId);
  block.appendChild(symbolElement);
}

function updateGameRecord(currentSymbol, blockId) {
  const splitId = blockId.split(',');
  const x = splitId[0];
  const y = splitId[1];
  gameRecord[currentSymbol].row[x].push(blockId);
  gameRecord[currentSymbol].col[y].push(blockId);

  console.log(gameRecord);
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