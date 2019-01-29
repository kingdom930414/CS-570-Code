const fs = require('fs');
const path = require('path');
const readline = require('readline');
const filedata = readline.createInterface(process.stdin, process.stdout);

main();

function StartGameQuestions(filepath) {

    fs.readFile(path.join(filepath, "infile.dat"), (err, data) => {
        if (err) {
            console.error("Error, choose a different save, this has something wrong", err);
        }
        else {
            try {
                console.log('--------huffman code run---------');
                let arrlow = [], arrup = [], result = [], arrresult = [], haff = []; huff_code_table = {}; total = 0; total_bits = 0; total_string = 0;
                let objlow = {}, objup = {}, obj = {}, objhuff = {};
                let arr = data.toString().replace(/\W/g, "").split('');

                var pq = new HuffQuene([], function (e1, e2) { return e1.symbol_info.frequency > e2.symbol_info.frequency; });

                arrlow = arr.sort().filter(i => { if (i.charCodeAt() >= 97 && i.charCodeAt() <= 122) { return i } });

                arrup = arr.sort().filter(i => { if (i.charCodeAt() >= 65 && i.charCodeAt() <= 90) { return i } });
                arrlow.forEach(i => { if (objlow[i]) { objlow[i]++ } else { objlow[i] = 1 } });
                arrup.forEach(i => { if (objup[i]) { objup[i]++ } else { objup[i] = 1 } });
                for (let i = 0; i < Object.keys(objup).length; i++) {
                    objlow[Object.keys(objup)[i]] = objup[Object.keys(objup)[i]];
                }
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
                    var treeNode = new attribute_node(null, null, null, sym);
                    total_string += objhuff[prop];
                    pq.Insert(treeNode);
                    haff.push(sym);
                }
                result.sort((a, b) => { return b - a });
                haff.sort((a, b) => { return b.frequency - a.frequency });
                for (let j = 0; j < result.length; j++) {
                    for (let i = 0; i < Object.keys(objlow).length; i++) {
                        if (objlow[Object.keys(objlow)[i]] == result[j]) {
                            obj[Object.keys(objlow)[i]] = result[j];
                        }
                    }
                }

                while (pq.GetSize() > 1) {
                    var least = pq.DeleteMin();
                    var second = pq.DeleteMin();
                    var sym = new symbol_info(null, least.symbol_info.frequency + second.symbol_info.frequency);
                    var new_attribute_node = new attribute_node(least, second, null, sym);
                    least.parent = new_attribute_node;
                    second.parent = new_attribute_node;
                    pq.Insert(new_attribute_node);
                }
                var root = pq.getArr()[1];
                DFnode(root, "");
                console.log(this.total_string);
                var output_string = "";
                output_string = "Symbol|Frequency|Huffman Codes\n";
                for (var i = 0; i < haff.length; i++) {
                    this.total_bits = this.total_bits + (haff[i].frequency * this.huff_code_table[haff[i].symbol].split("").length);
                    output_string += haff[i].symbol + '|' + parseFloat(((haff[i].frequency / total_string) * 100)) + '%' + '|' + this.huff_code_table[haff[i].symbol] + "\n";
                }
                output_string += "Total Bits:" + this.total_bits;
                writeSquence(obj, total, output_string);
            } catch (e) {
            }
        }
    })
}

function main() {
    filedata.question('input filepath, press enter to run in defalut path\n', data => {
        console.log(data);
        if (data) {
            StartGameQuestions(data);
        } else {
            StartGameQuestions(__dirname);
        }
    })

}

const DFnode = function (root, path) {
    if (root.leftchild == null && root.rightchild == null) {
        huff_code_table[root.symbol_info.symbol] = path;
        return;
    }
    else if (root.leftchild != null && root.rightchild == null) {
        DFnode(root.leftchild, path + "0");
    }
    else if (root.leftchild == null && root.rightchild != null) {
        DFnode(root.rightchild, path + "1");
    }
    else {
        DFnode(root.leftchild, path + "0");
        DFnode(root.rightchild, path + "1");
    }
};

var symbol_info = (function () {
    function symbol_info(s, f) {
        this.symbol = s;
        this.frequency = f;
    }
    return symbol_info;
}());

var attribute_node = (function () {
    function attribute_node(l, r, p, s) {
        this.leftchild = l;
        this.rightchild = r;
        this.parent = p;
        this.symbol_info = s;
    }
    return attribute_node;
}());


function writeSquence(data, total, file) {
    //console.log(total);
    let result = 'Symbol||frequency||Huffman Codes\n';
    //var pq = new HuffQuene([], compare(a, b, data))
    for (let i = 0; i < Object.keys(data).length; i++) {
        result += `${Object.keys(data)[i]}||${((data[Object.keys(data)[i]] / total) * 100).toFixed(2)}%\n`;
    }
    filedata.question('input output file dir, press enter to use the default path\n',(outputpath)=>{
        if(outputpath){
            askFilePath(outputpath,file);
        }else{
            askFilePath(__dirname,file)
        }
    })
   

}

const compare = function (a, b, data) {
    return data[a] > data[b];
}

const askFilePath = function (outputpath,filecontent) {
    // if (err) {
    //         console.error("Error, choose a different save, this has something wrong", err);
    //     }
    fs.writeFile(path.join(outputpath, 'outfile.dat'), filecontent, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log('-------success-------');
        }
    })
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

var HuffQuene = (function () {
    function HuffQuene(arr, compare) {
        if (compare === void 0) { compare = HuffQuene.compareFunction; }
        this.arr = arr || [];
        this.arr.push(null);
        this.compare = compare;
    }
    HuffQuene.compareFunction = function (e1, e2) {
        return e1.weight > e2.weight;
    };

    HuffQuene.prototype.isEmpty = function () {
        return this.arr.length == 1;
    };

    HuffQuene.prototype.GetSize = function () {
        return this.arr.length - 1;
    };

    HuffQuene.prototype.Insert = function (value) {
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

    HuffQuene.prototype.DeleteMin = function () {
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
    HuffQuene.prototype.swap = function (i, j) {
        var temp = this.arr[i];
        this.arr[i] = this.arr[j];
        this.arr[j] = temp;
    };
    HuffQuene.prototype.findParentNode = function (i) {
        return Math.floor(i / 2);
    };
    HuffQuene.prototype.findLeftChildNode = function (i) {
        return 2 * i;
    };
    HuffQuene.prototype.findRightChildNode = function (i) {
        return 2 * i + 1;
    };
    HuffQuene.prototype.getArr = function () {
        return this.arr;
    };
    HuffQuene.prototype.output = function () {
        console.log(this.arr);
    };
    return HuffQuene;
}());