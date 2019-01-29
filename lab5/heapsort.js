var rds = require('fs');
var path = require('path');
var fs = require("readline-sync");
const readline = require('readline');
const game = readline.createInterface(process.stdin, process.stdout);

let result = [];
//var input = rds.readFileSync(path.join(__dirname, 'infile.txt'), "utf8");
function StartGameQuestions() {
    game.question('input 10 number\n', data => {
        if (data.toLowerCase() == 'n' || result.length == 10) {
            //heap_sort
            console.log(result.heap_sort());
        } else if (parseInt(data) || data == '0') {
            result.push(parseInt(data));
            StartGameQuestions();
        } else {
            throw "can't input letter!";
        }
    })
}
//input.replace(/\n/g, ' ').split(' ').filter((i) => { if (i) { return i; } }).forEach((i) => { result.push(parseInt(i)); });
//console.log(result);

Array.prototype.heap_sort = function () {
    var arr = this.slice(0);
    function swap(i, j) {
        var tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
    function max_heapify(start, end) {
        var dad = start;
        var son = dad * 2 + 1;
        if (son >= end)
            return;
        if (son + 1 < end && arr[son] < arr[son + 1])
            son++;
        if (arr[dad] <= arr[son]) {
            swap(dad, son);
            max_heapify(son, end);
        }
    }
    var len = arr.length;
    for (var i = Math.floor(len / 2) - 1; i >= 0; i--)
        max_heapify(i, len);
    for (var i = len - 1; i > 0; i--) {
        swap(0, i);
        max_heapify(0, i);
    }

    return arr;
};

StartGameQuestions()