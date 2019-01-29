const fs = require('fs');
const path = require('path');
const readline = require('readline');
const playerLetters = ['X','O','A','B','C','D','E','F','G','H','I','J','K','L','M','N','P','Q','R','S','T','U','V','W','Y','Z'];
const rl = readline.createInterface(process.stdin, process.stdout);

var settings = {
    playerSize: 2,
    boardSize: 3,
    winSequence: 3,
    currentPlayer : 0
};

main();

function StartGameQuestions(){
  rl.question('Resume a saved game? (Y/N)\n', saved_game => {
    saved_game = saved_game.toUpperCase();
    if(saved_game === 'YES' || saved_game === 'Y'){
      console.log('\nYou picked a saved game.\n');
	  LoadGame(rl);

    }
    else if (saved_game === 'NO' || saved_game === 'N'){
      console.log('You picked a new game.');
      rl.question('How many players? (Maximum 26): ', players => {
        if(players <= 26){
          settings.playerSize = parseInt(players);
		  console.log(players);
          rl.question('How large is the board? (Maximum:999): ', board_size => {
            if(board_size <= 999){
              settings.boardSize = parseInt(board_size);
			  console.log(board_size);
              rl.question('Win sequence count? ', win_sequence => {
                if(win_sequence){
                  console.log(win_sequence);
				  settings.winSequence = parseInt(win_sequence);
                  beginGame(settings);
                }
                else{
                  console.log('Not valid ');
                  rl.close();
                }
              })
            }
            else{
              console.log('Not valid');
              StartGameQuestions();
            }
          })
        }
        else{
          console.log('Not valid');
          StartGameQuestions();
        }
      })
    }
    else{
      console.log('Not valid.');
      StartGameQuestions();
    }
  })
}

var drawBoard = function(board_size){
	var board = '';

	for(var row0 = 1; row0 <= board_size; row0++){
		if(row0 === 1){
			board += '    ' + row0;
		}
		else{
			board += '   ' + row0;
		}
	}

	for (var row = 1; row <= board_size; row++){
		board += '\n' + row + '     ';

		for(var column = 1; column < board_size; column++){
			board += '|   ';
		}
		board += '\n   ';

		if(row < board_size){
			for(var row_col = 0; row_col < (board_size * 2 - 1); row_col++){
				if(row_col % 2 !== 0){
					board += '+';
				}
				else{
					board += '---';
				}
			}
		}
	}
  return board;
};



var LoadSavedGame= function (rl, dir, file) {


    fs.readFile(path.join(dir, file + ".xml"), (err,data) => {
        if (err) {
            console.error("Error, choose a different save", err);
        }
        else {
            MyCrumbyXmlParser(data.toString());
        }
    })

}

var MyCrumbyXmlParser = function  (xmlString) {
    var aSave = [];
    aSave["players"] = xmlString.substring(xmlString.indexOf("<players>")+9,xmlString.indexOf("</players>"));
    aSave["boardSize"] = xmlString.substring(xmlString.indexOf("<boardSize>")+11,xmlString.indexOf("</boardSize>"));//-xmlString.indexOf("<boardSize>")-1);
    aSave["winSequence"] = xmlString.substring(xmlString.indexOf("<winSequence>")+13,xmlString.indexOf("</winSequence>"));//-xmlString.indexOf("<winSequence>")-1);

    beginGame(aSave);
}

function LoadGame(rl) {

    rl.question("Enter your save file name " +
        "\nor press Return to see the list of saved games" +
        "\nor type Exit to return to the menu... \n", resp => {

        LoadSavedGame(rl, __dirname, resp);
})
}


var activeBoard = [];

function beginGame(settings) {
    
	console.log('-----Game Started-----');
	activeBoard = createMatrix(settings.boardSize);
	board = drawBoard(settings.boardSize);
	console.log(board);
    recursiveAsyncReadLine();

}

var createMatrix = function(board_size){
    let matrix = [];
    for (var i = 0; i < board_size; i++) {
        let row = [];
        for (var i1 = 0; i1 < board_size; i1++) {
            row.push(' ');
        }
        matrix.push(row);
    }

    console.log(matrix);
    return matrix;
};

function playerMoved(row, column, value){
    console.log(row,column, value);
    if (activeBoard[row][column] === ' '){
        console.log('player has moved');
        activeBoard[row][column] = value;
        console.log(activeBoard);
    } else {
        console.log('a player exists in that space, move invalid');
    }
    checkForWinner(activeBoard, value);
}

var recursiveAsyncReadLine = function () {
    
    if (settings.currentPlayer >= settings.playerSize){
        settings.currentPlayer = 0; 
    }
    rl.question('Enter a row,column (type save to save the game): ', function (answer) {
        if (answer == 'save') 
            return rl.close(); 
        console.log('Your answer was:  ' + answer +  '  "', playerLetters[settings.currentPlayer], '"');

        var grid = answer.split(',');
        playerMoved((parseInt(grid[0])-1), parseInt((grid[1])-1), playerLetters[settings.currentPlayer]);

        settings.currentPlayer++;
        recursiveAsyncReadLine();
    });
};

function checkForWinner(board, player){
    if (checkRows(board, player) || checkDiagonals(board, player) || checkColumns(board, player)) {
        console.log('user has won');
    } else {
        console.log('not a winner');
    }
}

function checkRows(board, player){
        var win = false;
        for(var r = 0; r < board.length; r++){
            var rowSum = 1;
            var previousVal = 'start';
            for(var t = 0; t < board[r].length; t++) {
                if (board[r][t] === player) {
                    ++rowSum;
                    if (previousVal !== board[r][t] && rowSum > 2) {
                        rowSum = 0;
                    }
                }
                previousVal = board[r][t];
                if(rowSum > settings.winSequence){
                    win = true;
                    break;
                }
            }
        }
        return win;
}

function checkDiagonals(board, player){
    return false;
}

function checkColumns(board, player){
    function transpose(a) {
        return Object.keys(a[0]).map(
            function (c) { return a.map(function (r) { return r[c]; }); }
        );
    }

    return checkRows(transpose(board), player);
}


function saveGame() {
}



function main(){
  console.log('Tic-Tac-Toe');
  console.log(
    '                  |   |   \n' +
    '               ---+---+--- \n' +
    '                  |   |   \n' +
    '               ---+---+--- \n' +
    '                  |   |   \n');
	
	StartGameQuestions();
}