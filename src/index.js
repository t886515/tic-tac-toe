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
  // rebuild the board
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
        resetGame();
        // end game
        return;
      }
    }
    if (turnCount > 9) {
      console.log('TIE!');
      resetGame();
      // end game
    }
  } else {
    console.log('Already selected!');
  }
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
  // if anything found, return true right away
  // determine diagonal win
  // if anything found, return true right away
  // if reach here, means false;
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
}

function determineDiagonalWin() {
  const condition1 = ['0,0', '1,1', '2,2'];
  const condition2 = [];
  return false;
}
