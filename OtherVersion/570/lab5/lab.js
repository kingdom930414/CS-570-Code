var rds = require('fs');
var path = require('path');
var fs = require("readline-sync");
const readline = require('readline');
const game = readline.createInterface(process.stdin, process.stdout);
let result = [];
//var input = rds.readFileSync(path.join(__dirname, 'infile.txt'), "utf8");
//input.replace(/\n/g,' ').split(' ').filter((i)=>{if(i){return i;}}).forEach((i) => {result.push(parseInt(i));});
//console.log(result);
function StartGameQuestions() {
    game.question('input 10 number\n', data => {
        if (data.toLowerCase() == 'n' || result.length == 10) {
            //heap_sort
            console.log(result.hs());
        } else if (parseInt(data) || data == '0') {
            result.push(parseInt(data));
            StartGameQuestions();
        } else {
            throw "can't input letter!";
        }
    })
}
Array.prototype.hs = function() {
    var arr = this.slice(0);

    function swap(i, j) {
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    function maxheap(x, y) {
        var base = x;
        var num = base * 2 + 1;
        if (num >= y)
            return;
        if (num + 1 < y && arr[num] < arr[num + 1])
            num++;
        if (arr[base] <= arr[num]) {
            swap(base, num);
            maxheap(num, y);
        }
    }

    var len = arr.length;

    for (var i = Math.floor(len / 2) - 1; i >= 0; i--){
        maxheap(i, len);
    }
    for (var i = len - 1; i > 0; i--) {
        swap(0, i);
        maxheap(0, i);
    }

    for (var i = 0; i<= Math.floor(len / 2); i++){
        swap(i,len-i-1);
    }
    return arr;
};
//console.log(result.hs());

try{
    function sort(result) {
        var n = result.length;
        for(var i=n/2-1;i>=0;i--){
           heap(result,n,i);
        }
        for (var i = n-1;i>=0;i--){
            var temp = result[0];
            result[0]=result[i];
            [i]=temp;
            heap(result,i,0);
        }
    }

    function heap(result,n,i) {
        var max = i;
        var l = 2 * i + 1;
        var r = 2 * i + 2;
        if (1 < n && result[l] > result[max]) {
            max = 1;
        }
        if (r < n && result[r] > result[max]) {
            max = r;
        }
        if (max != i) {
            var swap = result[i];
            result[i] = result[max];
            result[max] = swap;
            heap(result, n, max);
        }
    }
   // sort(result);
    //console.log(result);

}catch(err){
    console.log(' ');
}


StartGameQuestions()