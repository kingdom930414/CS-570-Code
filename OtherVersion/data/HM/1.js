const fs = require('fs');
const path = require('path');
const readline = require('readline');
const game = readline.createInterface(process.stdin, process.stdout);

main();

function StartGameQuestions() {
    fs.readFile(path.join(__dirname, "infile.dat"), (err, data) => {
        if (err) {
            console.error("Error, choose a different save, this has something wrong", err);
        }
        else {
            try {
                console.log('--------+');
                //console.log(data.toString());
                let arrlow = [], arrup = [], result = [], arrresult = [], haff = []; huff_code_table = {}; total = 0; total_bits = 0; total_string = 0;
                let objlow = {}, objup = {}, obj = {}, objhuff = {};
                //console.log( typeof data.toString());
                let arr = data.toString().replace(/\W/g, "").split('');

                var pq = new PriorityQueue([], function (e1, e2) { return e1.symbol_info.frequency > e2.symbol_info.frequency; });

                arrlow = arr.sort().filter(i => { if (i.charCodeAt() >= 97 && i.charCodeAt() <= 122) { return i } });

                arrup = arr.sort().filter(i => { if (i.charCodeAt() >= 65 && i.charCodeAt() <= 90) { return i } });
                //arrresult = arrlow.concat(arrup);
                arrlow.forEach(i => { if (objlow[i]) { objlow[i]++ } else { objlow[i] = 1 } });
                arrup.forEach(i => { if (objup[i]) { objup[i]++ } else { objup[i] = 1 } });
                for (let i = 0; i < Object.keys(objup).length; i++) {
                    objlow[Object.keys(objup)[i]] = objup[Object.keys(objup)[i]];
                }
                //console.log(arrlow);
                //console.log(objlow);
                //console.log(objup);
                //console.log(objlow);
                // for(let i =1;i<=Object.keys(objlow).length;i++){
                //     if(objlow[Object.keys(objlow)[i]]>objlow[Object.keys(objlow)[i-1]]){

                //     }
                // }
                for (let i = 0; i < arr.length; i++) {
                    let char = arr[i];
                    if (objhuff[char] == null) {
                        objhuff[char] = 1;
                    }
                    else {
                        objhuff[char]++;
                    }
                }

                for (let i = 0; i < Object.keys(objlow).length; i++) {
                    total += objlow[Object.keys(objlow)[i]];
                    result.push(objlow[Object.keys(objlow)[i]]);
                }

                for (var prop in objhuff) {
                    var sym = new symbol_info(prop, objhuff[prop]);
                    var treeNode = new tree_node(null, null, null, sym);
                    total_string += objhuff[prop];
                    pq.Insert(treeNode);
                    haff.push(sym);
                }
                //console.log(result);
                //result.forEach(i =>  total = total + i );
                // console.log(total);
                // for (let i = 0; i < result.length; i++) {
                //     //console.log(result[i]);
                //     total = total + result[i];
                //     console.log(total)
                // }
                //console.log(total);
                result.sort((a, b) => { return b - a });
                haff.sort((a, b) => { return b.frequency - a.frequency });
                for (let j = 0; j < result.length; j++) {
                    for (let i = 0; i < Object.keys(objlow).length; i++) {
                        if (objlow[Object.keys(objlow)[i]] == result[j]) {
                            //console.log(Object.keys(objlow)[i], "++", result[j])
                            obj[Object.keys(objlow)[i]] = result[j];
                        }
                    }
                }

                while (pq.GetSize() > 1) {
                    var least = pq.DeleteMin();
                    var second = pq.DeleteMin();
                    var sym = new symbol_info(null, least.symbol_info.frequency + second.symbol_info.frequency);
                    var new_tree_node = new tree_node(least, second, null, sym);
                    least.parent = new_tree_node;
                    second.parent = new_tree_node;
                    pq.Insert(new_tree_node);
                }
                var root = pq.getArr()[1];
                //var root = pq.getArr()[1];
                DFS(root, "");
                console.log(this.total_string);
                var output_string = "";
                output_string = "Symbol|Frequency|Huffman Codes\n";
                for (var i = 0; i < haff.length; i++) {
                    this.total_bits = this.total_bits + (haff[i].frequency * this.huff_code_table[haff[i].symbol].split("").length);
                    output_string += haff[i].symbol + '|' + parseFloat((haff[i].frequency / total_string).toFixed(4)) * 100 + '%' + '|' + this.huff_code_table[haff[i].symbol] + "\n";
                }
                output_string += "Total Bits:" + this.total_bits;
                writeSquence(obj, total, output_string);
                //console.log(result.sort((a,b)=>{return b-a}));
                //Object.keys(objlow);
                //MyCrumbyTxtParser(data.toString());
            } catch (e) {
                console.log(e);
                //let gamedata = JSON.parse(data);
                // let {playerNum,boardSize,winConfig,currentPlayer} = gamedata;
                //console.log(gamedata);
                // console.log(playerNum,boardSize,winConfig,currentPlayer);
                // beginGame(gamedata,1,gamedata);
            }
        }
    })
}

function main() {

    StartGameQuestions();
}

const DFS = function (root, path) {
    if (root.leftchild == null && root.rightchild == null) {
        huff_code_table[root.symbol_info.symbol] = path;
        return;
    }
    else if (root.leftchild != null && root.rightchild == null) {
        DFS(root.leftchild, path + "0");
    }
    else if (root.leftchild == null && root.rightchild != null) {
        DFS(root.rightchild, path + "1");
    }
    else {
        DFS(root.leftchild, path + "0");
        DFS(root.rightchild, path + "1");
    }
};

var symbol_info = (function () {
    function symbol_info(s, f) {
        this.symbol = s;
        this.frequency = f;
    }
    return symbol_info;
}());

var tree_node = (function () {
    function tree_node(l, r, p, s) {
        this.leftchild = l;
        this.rightchild = r;
        this.parent = p;
        this.symbol_info = s;
    }
    return tree_node;
}());


function writeSquence(data, total, file) {
    //console.log(total);
    let result = 'Symbol||frequency||Huffman Codes\n';
    //var pq = new PriorityQueue([], compare(a, b, data))
    for (let i = 0; i < Object.keys(data).length; i++) {
        result += `${Object.keys(data)[i]}||${((data[Object.keys(data)[i]] / total) * 100).toFixed(2)}%\n`;
    }
    fs.writeFile(path.join(__dirname, 'outfile.dat'), file, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
        }
    })
}

const compare = function (a, b, data) {
    return data[a] > data[b];
}

var Queue = (function () {
    function Queue() {
        this.arr = [];
    }
    Queue.prototype.enqueue = function (value) {
        this.arr.push(value);
    };
    Queue.prototype.dequeue = function () {
        this.arr.shift();
    };
    Queue.prototype.front = function () {
        return this.arr[0];
    };
    Queue.prototype.isEmpty = function () {
        if (this.arr.length === 0)
            return true;
        else
            return false;
    };
    Queue.prototype.print = function () {
        console.log(this.arr.join(""));
    };
    Queue.prototype.output = function () {
        for (var i = 0; i < this.arr.length; i++) {
            console.log(this.arr[i]);
        }
    };
    return Queue;
}());

var PriorityQueue = (function () {
    function PriorityQueue(arr, compare) {
        if (compare === void 0) { compare = PriorityQueue.defaultCompare; }
        this.arr = arr || [];
        this.arr.push(null);
        this.compare = compare;
    }
    PriorityQueue.defaultCompare = function (e1, e2) {
        return e1.weight > e2.weight;
    };

    PriorityQueue.prototype.isEmpty = function () {
        return this.arr.length == 1;
    };

    PriorityQueue.prototype.GetSize = function () {
        return this.arr.length - 1;
    };

    PriorityQueue.prototype.Insert = function (value) {
        this.arr[this.arr.length] = value;
        var pos = this.arr.length - 1;
        while (this.findParentNode(pos) >= 1) {
            if (!this.compare(this.arr[pos], this.arr[this.findParentNode(pos)])) {
                this.swap(pos, this.findParentNode(pos));
                pos = this.findParentNode(pos);
            }
            else {
                break;
            }
        }
    };

    PriorityQueue.prototype.DeleteMin = function () {
        var rtn = this.arr[1];
        this.arr[1] = this.arr[this.arr.length - 1];
        this.arr.splice(this.arr.length - 1, 1);
        var pos = 1;
        while (pos * 2 <= this.arr.length - 1) {
            if (this.arr.length === 3) {
                if (this.compare(this.arr[pos], this.arr[this.findLeftChildNode(pos)])) {
                    this.swap(pos, this.findLeftChildNode(pos));
                    pos = this.findLeftChildNode(pos);
                }
                break;
            }
            if (this.findRightChildNode(pos) > this.arr.length - 1) {
                if (this.compare(this.arr[pos], this.arr[this.findLeftChildNode(pos)])) {
                    this.swap(pos, this.findLeftChildNode(pos));
                    pos = this.findLeftChildNode(pos);
                }
                else {
                    break;
                }
            }
            else {
                if (this.compare(this.arr[this.findLeftChildNode(pos)], this.arr[this.findRightChildNode(pos)])) {
                    if (this.compare(this.arr[pos], this.arr[this.findRightChildNode(pos)])) {
                        this.swap(pos, this.findRightChildNode(pos));
                        pos = this.findRightChildNode(pos);
                    }
                    else {
                        break;
                    }
                }
                else {
                    if (this.compare(this.arr[pos], this.arr[this.findLeftChildNode(pos)])) {
                        this.swap(pos, this.findLeftChildNode(pos));
                        pos = this.findLeftChildNode(pos);
                    }
                    else {
                        break;
                    }
                }
            }
        }
        return rtn;
    };
    PriorityQueue.prototype.swap = function (i, j) {
        var temp = this.arr[i];
        this.arr[i] = this.arr[j];
        this.arr[j] = temp;
    };
    PriorityQueue.prototype.findParentNode = function (i) {
        return Math.floor(i / 2);
    };
    PriorityQueue.prototype.findLeftChildNode = function (i) {
        return 2 * i;
    };
    PriorityQueue.prototype.findRightChildNode = function (i) {
        return 2 * i + 1;
    };
    PriorityQueue.prototype.getArr = function () {
        return this.arr;
    };
    PriorityQueue.prototype.output = function () {
        console.log(this.arr);
    };
    return PriorityQueue;
}());

