var prompt = require('prompt');

prompt.start();
var BoardDisplay = function(boardArray) {
  let board = [];
  for (let item of boardArray) {
    if (item === 0) {
      board.push('[ ]');
    } else if (item === 1) {
      board.push('[O]');
    } else if (item === 2) {
      board.push('[X]');
    }
  }
  let result = [];
  while (board.length!==0) {
    let subset = [];
    for (let i = 0; i < 3; i++) {
      subset.push(board[0]);
      board.shift();
    }
    result.push(subset);
  }
  console.log('Here is the current board: ');
  console.log(result.join('\n'));
  console.log('Here is the numbers corresponding to the position: ');
  console.log('[1],[2],[3]\n[4],[5],[6]\n[7],[8],[9]');


}

var checkForEnd = function(boardArray) {
  let bool = false;
  
  return bool;
}

var checkForResult = function(boardArray) {
  let resultString = '';

  return resultString;
}

var gameConsole = function() {
  let start = prompt('Start the game? Enter "Y" or "y" for yes.');
  if (start === 'Y' || start === 'y') {
    let boardArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let count = 0;
    let currentPlayer = '';
    let num = 0;
    let turnEnd = false;
    var askingPlayer = function() {
      if (checkForEnd()) {
        return checkForResult();
      }
      turnEnd = false;
      if (count%2 === 0) {
        currentPlayer = 'Player 1';
        num = 1;
      } else {
        currentPlayer = 'Player 2';
        num = 2;
      }
      while (turnEnd) {
        let pick = prompt('Where would you like to go, ' + currentPlayer + '? Please pick a number that correspond to the location on the grid.');
        BoardDisplay();
        if (array[pick+1] === 0) {
          array[pick+1] = num;
          turnEnd = true;
          askingPlayer();
        } else {
          console.log('Invalid move. Please try again.')
        }
      }
    } 

  } else {
    console.log('Bye!');
  }
}

gameConsole([0, 0, 0, 0, 0, 0, 0, 0, 0])
