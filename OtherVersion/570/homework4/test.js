var RLS = require("readline-sync");
var fs = require("graceful-fs");
var rds = require('fs');
var path = require('path');

function TrieNode(key) {
    this.key = key;
    this.son = [];
}
function Trie() {
    this.root = new TrieNode(null);
}
Trie.prototype = {
    insertData: function (stringData) {
        this.insert(stringData, this.root);
    },
    insert: function (stringData, node) {
        if (stringData == '') {
            return;
        }
        var son = this.getSon(node);
        var haveData = null;
        for (var i in son) {
            if (son[i].key == stringData[0]) {
                haveData = son[i];
            }
        }
        if (haveData) {
            this.insert(stringData.substring(1), haveData);//说明找到了对应的元素，那如果没有找到了？
        } else {
            if (son.length == 0) {
                //当前没有子元素，所以应该判断一下
                var node = new TrieNode(stringData[0]);
                son.push(node);
                this.insert(stringData.substring(1), node);//对吧，此时应该将该元素插入子元素中
            } else {//当前子元素的长度不为零，需要查找一个合适的位置去插入元素
                var validPosition = 0;
                for (var j in son) {
                    if (son[j].key < stringData[0]) {
                        validPosition++;
                    }
                }
                var node = new TrieNode(stringData[0]);
                son.splice(validPosition, 0, node);
                this.insert(stringData.substring(1), node);//对吧，此时应该将该元素插入子元素中
            }
        }

    },
    delete: function (stringData) {

    },
    query: function (stringData) {

    }, getSon: function (node) {
        return node.son;
    }
    , printdata1: function (node,data) {
        if (node.son.length==0){
            console.log('ddddd',data.join(''));
            return;
        }
        for (var i in node.son) {
            data.push(node.son[i].key);
            this.printdata1(node.son[i],data);
            data.pop();
        }
    }, printData: function () {
        for (var i in this.root.son){
            this.printdata1(this.root.son[i],[this.root.son[i].key]);
        }

    },
    isExit:function (node,queryData) {
        if (node.key==queryData[0]){

        }
    }

};

var treeNode = (function () {
    function treeNode(val, end) {
        this.childNodes = {
            A: null, B: null, C: null, D: null, E: null, F: null, G: null, H: null, I: null, J: null, K: null, L: null, M: null, N: null, O: null, P: null, R: null, S: null, T: null, U: null, V: null, W: null, X: null, Y: null, Z: null,
            a: null, b: null, c: null, d: null, e: null, f: null, g: null, h: null, i: null, j: null, k: null, l: null, m: null, n: null, o: null, p: null, r: null, s: null, t: null, u: null, v: null, w: null, x: null, y: null, z: null,
            ' ': null
        };
        this.val = null;
        this.end = false;
        this.hit = 0;
        this.val = val;
        this.end = end;
    }
    return treeNode;
}());

var trie = (function () {
    function trie() {
        this.freq = [];
        this.statistics = {};
        this.root = new treeNode(null, false);
    }
    trie.prototype.insert = function (str) {
        if (str.length == 0) {
            return;
        }
        var current = this.root;
        var word = '';
        for (var i = 0; i < str.length; i++) {
            var c = str.charAt(i);
            word += c;
            if (current.childNodes[c] != null) {
                current = current.childNodes[c];
            }
            else {
                if (i == str.length - 1) {
                    var newNode = new treeNode(word, true);
                }
                else {
                    var newNode = new treeNode(word, false);
                }
                current.childNodes[c] = newNode;
                current = current.childNodes[c];
            }
        }
    };
    trie.prototype.getFreqTable = function (text) {
        this.freq = [];
        for (var i = 0; i < text.length; i++) {
            this.freq[i] = new Array();
            this.freq[i].push(this.root);
        }
        for (var i = 0; i < text.length; i++) {
            for (var j = 0; j < this.freq[i].length; j++) {
                if (this.freq[i][j].childNodes[text.charAt(i)] != null) {
                    this.freq[i][j].childNodes[text.charAt(i)].hit++;
                    if (i < text.length - 1) {
                        this.freq[i + 1].push(this.freq[i][j].childNodes[text.charAt(i)]);
                    }
                }
            }
        }
        this.DFS(this.root);
    };
    trie.prototype.getFreqArrTable = function (arr) {
        this.freq = [];
        for (var i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[i].length; j++) {
                this.freq[j] = [];
                this.freq[j].push(this.root);
            }
        }
        for (var i = 0; i < text.length; i++) {
            for (var j = 0; j < this.freq[i].length; j++) {
                if (this.freq[i][j].childNodes[text.charAt(i)] != null) {
                    this.freq[i][j].childNodes[text.charAt(i)].hit++;
                    if (i < text.length - 1) {
                        this.freq[i + 1].push(this.freq[i][j].childNodes[text.charAt(i)]);
                    }
                }
            }
        }
        this.DFS(this.root);
    };
    trie.prototype.getRoot = function () {
        return this.root;
    };
    trie.prototype.output = function () {
        console.log(this.root);
    };
    trie.prototype.DFS = function (node) {
        var prop;
        if (node.end == true) {
            this.statistics[node.val] = node.hit;
        }
        for (prop in node.childNodes) {
            if (node.childNodes[prop] != null) {
                this.DFS(node.childNodes[prop]);
            }
        }
    };
    return trie;
}());

//var tree = new trie();
var input = rds.readFileSync(path.join(__dirname, 'companies.dat'), "utf8");
//var input = 'Microsoft	Microsoft Corporation	XBox';
var readdata = input.split("\n");
var companies = {};
var totalarr = [];
for (let i = 0; i < readdata.length; i++) {
    let alias = readdata[i].split("\t");
    //companies[alias[0]] = alias;
    for (let j = 0; j < alias.length; j++) {
        companies[alias[j]] = alias[0]
    }
}
//console.log(companies);
var tree = new trie();
for (i in companies) {
    tree.insert(i);
}

var file = rds.readFileSync(path.join(__dirname, 'infile.dat'), "utf8");
let fileread = file;
file = file.split(" ");

for (let num in file) {
    if (file[num] === 'a' || file[num] === 'an' || file[num] === 'the' || file[num] === 'and' || file[num] === 'or' || file[num] === 'but') {
        file.splice(num, 1);
    }
}


tree.getFreqTable(fileread);
