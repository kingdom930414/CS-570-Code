"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.trie = trie;
