"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SE_1 = require("./SE");
var fs = require("fs");
const path = require('path');
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
var HaffmanCode = (function () {
    function HaffmanCode() {
    }
    HaffmanCode.main = function () {
        var input = fs.readFileSync(path.join(__dirname,'infile.dat'), "utf8");
        input = input.replace(/\W/g, "");
        this.total_string = input.split("").length;
        var pq = new SE_1.PriorityQueue([], function (e1, e2) { return e1.symbol_info.frequency > e2.symbol_info.frequency; });
        var map = {};
        var Alphabet = [];
        var output;
        for (var i = 0; i < input.length; i++) {
            var char = input[i];
            if (map[char] == null) {
                map[char] = 1;
            }
            else {
                map[char]++;
            }
        }
        var freq_table = [];
        for (var prop in map) {
            var sym = new symbol_info(prop, map[prop]);
            var treeNode = new tree_node(null, null, null, sym);
            pq.Insert(treeNode);
            freq_table.push(sym);
        }
        freq_table.sort(function (a, b) {
            if (a.frequency > b.frequency) {
                return -1;
            }
            else if (a.frequency == b.frequency) {
                return 0;
            }
            else {
                return 1;
            }
        });
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
        this.DFS(root, "");
        console.log(this.total_string);
        var output_string = "";
        output_string = "Symbol|Frequency|Huffman Codes\n";
        for (var i = 0; i < freq_table.length; i++) {
            this.total_bits = this.total_bits + (freq_table[i].frequency * this.huff_code_table[freq_table[i].symbol].split("").length);
            output_string += freq_table[i].symbol + '|' + parseFloat((freq_table[i].frequency / this.total_string).toFixed(4)) * 100 + '%' + '|' + this.huff_code_table[freq_table[i].symbol] + "\n";
        }
        output_string += "Total Bits:" + this.total_bits;
        fs.writeFileSync("outfile.dat", output_string);
    };
    HaffmanCode.DFS = function (root, path) {
        if (root.leftchild == null && root.rightchild == null) {
            this.huff_code_table[root.symbol_info.symbol] = path;
            return;
        }
        else if (root.leftchild != null && root.rightchild == null) {
            this.DFS(root.leftchild, path + "0");
        }
        else if (root.leftchild == null && root.rightchild != null) {
            this.DFS(root.rightchild, path + "1");
        }
        else {
            this.DFS(root.leftchild, path + "0");
            this.DFS(root.rightchild, path + "1");
        }
    };
    return HaffmanCode;
}());
HaffmanCode.huff_code_table = {};
HaffmanCode.total_bits = 0;
HaffmanCode.total_string = 0;
HaffmanCode.main();
