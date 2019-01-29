const fs = require('fs');
const path = require('path');
const readline = require('readline');
const playerLetters = ['X', 'O', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'Y', 'Z'];
const game = readline.createInterface(process.stdin, process.stdout);

var config = {
    playerNum: 2,
    boardSize: 3,
    winConfig: 3,
    currentPlayer: 0
};

main();

function StartGameQuestions() {
    game.question('Resume a saved game? (Y/N)\n', saved_game => {
        saved_game = saved_game.toUpperCase();
        if (saved_game === 'YES' || saved_game === 'Y') {
            console.log('\nYou picked a saved game.\n');
            //console.log('what')
            game.question('what type of the game you want to resume? (txt/xml)\n', data => {
                if (data.toLowerCase() == 'txt') {
                    console.log('\nYou picked a txt saved game.\n');
                    LoadGame(game);
                } else if (data.toLowerCase() == 'xml') {
                    console.log('\nYou picked a xml saved game.\n');
                    LoadGame(game);
                } else {
                    console.log('Not valid.');
                    StartGameQuestions();
                }
            })
            LoadGame(game);

        }
        else if (saved_game === 'NO' || saved_game === 'N') {
            console.log('You start a new game.');
            game.question('How many players? (Maximum 26): ', players => {
                if (players <= 26) {
                    config.playerNum = parseInt(players);
                    console.log(players);
                    game.question('How large is the board? (Maximum:999): ', board_size => {
                        if (board_size <= 999) {
                            if(board_size>=3){
                                config.boardSize = parseInt(board_size);
                                console.log(board_size);
                                game.question('Win sequence count? ', winConfig => {
                                    if (winConfig) {
                                        console.log(winConfig);
                                        config.winConfig = parseInt(winConfig);
                                        beginGame(config);
                                    }
                                    else {
                                        console.log('you need to input every argument to begin the game');
                                        game.close();
                                    }
                                })
                            }else{
                                console.log('boardSize is too small, cannot play game');
                                StartGameQuestions();
                            }       
                        }
                        else {
                            console.log(`${board_size} need to be a number or small than 999`);
                            StartGameQuestions();
                        }
                    })
                }
                else {
                    console.log(`${players} is not a number, players need be a number`);
                    StartGameQuestions();
                }
            })
        }
        else {
            console.log('Not valid.');
            StartGameQuestions();
        }
    })
}

var drawBoard = function (board_size) {
    var board = '';

    for (var row0 = 1; row0 <= board_size; row0++) {
        if (row0 === 1) {
            board += '    ' + row0;
        }
        else {
            board += '   ' + row0;
        }
    }

    for (var row = 1; row <= board_size; row++) {
        board += '\n' + row + '     ';

        for (var column = 1; column < board_size; column++) {
            board += '|   ';
        }
        board += '\n   ';

        if (row < board_size) {
            for (var row_col = 0; row_col < (board_size * 2 - 1); row_col++) {
                if (row_col % 2 !== 0) {
                    board += '+';
                }
                else {
                    board += '---';
                }
            }
        }
    }
    return board;
};



var LoadSavedGame = function (rl, dir, file) {


    fs.readFile(path.join(dir, file + ".xml"), (err, data) => {
        if (err) {
            console.error("Error, choose a different save, this has something wrong", err);
        }
        else {
            MyCrumbyXmlParser(data.toString());
        }
    })

}

var LoadSavedGameTxt = function (rl, dir, file) {


    fs.readFile(path.join(dir, file + ".txt"), 'utf-8', (err, data) => {
        if (err) {
            console.error("Error, choose a different save, this has something wrong", err);
        }
        else {
            MyCrumbyTxtParser(data.toString());
        }
    })

}

var MyCrumbyXmlParser = function (xmlString) {
    var aSave = [];
    aSave["players"] = xmlString.substring(xmlString.indexOf("<players>") + 9, xmlString.indexOf("</players>"));
    aSave["boardSize"] = xmlString.substring(xmlString.indexOf("<boardSize>") + 11, xmlString.indexOf("</boardSize>"));//-xmlString.indexOf("<boardSize>")-1);
    aSave["winConfig"] = xmlString.substring(xmlString.indexOf("<winConfig>") + 13, xmlString.indexOf("</winConfig>"));//-xmlString.indexOf("<winConfig>")-1);

    beginGame(aSave);
}

var MyCrumbyTxtParser = function (xmlString) {
    var aSave = [];


    beginGame(aSave);
}

function LoadGame(rl) {

    game.question("Enter your save file name " +
        "\nor press Return to see the list of saved games" +
        "\nor type Exit to return to the menu... \n", resp => {

            LoadSavedGame(rl, __dirname, resp);
        })
}


var activeBoard = [];

function beginGame(settings) {

    console.log('-----Game Started-----');
    activeBoard = createMatrix(config.boardSize);
    board = drawBoard(config.boardSize);
    console.log(board);
    recursiveAsyncReadLine(activeBoard);

}

const createMatrix = (board_size) => {
    let matrix = [];
    for (let i = 0; i < board_size; i++) {
        let row = [];
        for (let j = 0; j < board_size; j++) {
            row.push(' ');
        }
        matrix.push(row);
    }

    console.log(matrix);
    return matrix;
};

const playerMoved = (row, column, value) => {
    console.log(row, column, value);
    if (activeBoard[row][column] === ' ') {
        console.log('player has moved');
        activeBoard[row][column] = value;
        console.log(activeBoard);
    } else {
        console.log('a player exists in that space, choose another place');
    }
    checkForWinner(activeBoard, value);
}

const recursiveAsyncReadLine = (board) => {

    if (config.currentPlayer >= config.playerNum) {
        config.currentPlayer = 0;
    }
    const row = board.length;
    const col = board[0].length;
    //console.log(row,col);
    game.question('Enter a row,column (format(3,2) && type save to save the game): ', function (answer) {
        
        if (answer == 'save') {
            return game.close();
        }
        let grid = answer.split(',');
        console.log(parseInt(grid[0]));
        if (parseInt(grid[0]) && parseInt(grid[1]) && parseInt(grid[0])<row && parseInt(grid[1])<col) {

            console.log('Your answer was:  ' + answer + '  "', playerLetters[config.currentPlayer], '"');

            playerMoved((parseInt(grid[0]) - 1), parseInt((grid[1]) - 1), playerLetters[config.currentPlayer]);

            config.currentPlayer++;
            recursiveAsyncReadLine();


        } else {
            console.log('input is not valid, try again');
            //return game.close();
            recursiveAsyncReadLine();
        }
    });
};

const checkForWinner = (board, player) => {
    if (checkRows(board, player) || checkDiagonals(board, player) || checkColumns(board, player)) {
        console.log('user has won');
    } else {
        console.log('not a winner');
    }
}

const checkRows = (board, player) => {
    var win = false;
    for (var r = 0; r < board.length; r++) {
        var rowSum = 1;
        var previousVal = 'start';
        for (var t = 0; t < board[r].length; t++) {
            if (board[r][t] === player) {
                ++rowSum;
                if (previousVal !== board[r][t] && rowSum > 2) {
                    rowSum = 0;
                }
            }
            previousVal = board[r][t];
            if (rowSum > config.winConfig) {
                win = true;
                break;
            }
        }
    }
    return win;
}

function checkDiagonals(board, player) {
    let win = false;
    for (let r = 0; r < board.length; r++) {
        let rowSum = 0;
        let previousVal = 'start';
        //console.log(board);
        for (let t = 0; t < board[r].length; t++) {
            if (board[r][t] === player) {
                ++rowSum;
            }
            if (board[r + 1][t + 1]) {
                rowSum = frontDiagonal(r, t, board, rowSum, player);
                if (rowSum > config.winConfig) {
                    win = true;
                    break;
                }
            }
            if (board[r + 1][t - 1]) {
                rowSum = frontDiagonal(r, t, board, rowSum, player);
                if (rowSum > config.winConfig) {
                    win = true;
                    break;
                }
            }

            // if (board[r + 1][t - 1] || board[r + 1][t + 1]) {
            //     if (board[r][t] == player || board[r + 1][t + 1] == player) {
            //         ++rowSum;
            //     }
            // }
            // if (board[r - 1][t - 1] || board[r - 1][t + 1]) {
            //     if (board[r - 1][t] == player || board[r - 1][t + 1] == player) {
            //         ++rowSum;
            //     }
            // }
            previousVal = board[r][t];
            if (rowSum > config.winConfig) {
                win = true;
                break;
            }
        }
    }
    return win;
}

const backDiagonal = (i, j, arr, result, player) => {

    if (arr[i + 1][j - 1]) {
        if (arr[i + 1][j - 1] == player) {
            ++result;
            backDiagonal(i + 1, j - 1, arr, result)
        } else {
            return result;
        }
    }
}

const frontDiagonal = (i, j, arr, result, player) => {
    if (arr[i + 1][j + 1]) {
        if (arr[i + 1][j + 1] == player) {
            ++result;
            backDiagonal(i + 1, j + 1, arr, result)
        } else {
            return result;
        }
    }
}

function checkColumns(board, player) {
    function transpose(a) {
        return Object.keys(a[0]).map(
            function (c) { return a.map(function (r) { return r[c]; }); }
        );
    }

    return checkRows(transpose(board), player);
}


const saveGameTxt = (file, data) => {
    fs.writeFile(path.join(__dirname, file + ".txt"), data, { encoding: 'utf8', mode: 438 /*=0666*/, flag: 'w' }, (err, data) => {
        if (err) {
            console.log('some argument is wrong, please try again');
        } else {
            console.log('save success');
        }
    })
}

const saveGameXml = (file, data) => {
    fs.writeFile(path.join(__dirname, file + ".xml"), data, { encoding: 'utf8', mode: 438 /*=0666*/, flag: 'w' }, (err, data) => {
        if (err) {
            console.log('some argument is wrong, please try again');
        } else {
            console.log('save success');
        }
    })
}


function main() {
    console.log('Tic-Tac-Toe');
    console.log(
        '                  |   |   \n' +
        '               ---+---+--- \n' +
        '                  |   |   \n' +
        '               ---+---+--- \n' +
        '                  |   |   \n');

    StartGameQuestions();
}