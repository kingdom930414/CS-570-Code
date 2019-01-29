
var fs = require("graceful-fs");
var path = require("path");
//var graph_1 = require("./arr");
var arr = (function () {
    function arr() {
        this.Arr_List = {};
    }
    arr.prototype.createsGraph = function (nodes_num, edges_num, mapping) {
        for (var i = 0; i < nodes_num; i++) {
            this.Arr_List[i] = [];
        }
        for (var j in mapping) {
            var node_1 = mapping[j].split(" ")[0];
            var node_2 = mapping[j].split(" ")[1];
            if(node_2.indexOf('\r')){
                node_2 = node_2.replace(/\r/,'');
            }
            this.Arr_List[node_1].push(node_2);
        }
    };
    arr.prototype.createsGraph2 = function (nodes_num, mapping) {
        for (var i = 0; i <= nodes_num; i++) {
            this.Arr_List[i] = [];
        }
        for (var j in mapping) {
            var node_1 = mapping[j].split(" ")[0];
            var node_2 = mapping[j].split(" ")[1];
            if(node_2.indexOf('\r')){
                node_2 = node_2.replace(/\r/,'');
            }
            this.Arr_List[node_1].push(node_2);
        }
    };
    arr.prototype.topological1 = function () {
        var arr = {};
        for (var i in this.Arr_List) {
            arr[i] = this.Arr_List[i];
        }
        var topological_table = [];
        var topological_index = 0;
        while (!this.isGraphEmpty(arr)) {
            var table1 = {};
            var node_zero = [];
            for (var i in arr) {
                table1[i] = 0;
            }
            for (var i in arr) {
                for (var j in arr[i]) {
                    table1[arr[i][j]]++;
                }
            }
            for (var i in table1) {
                if (table1[i] === 0) {
                    node_zero.push(i);
                }
            }
            if (node_zero.length == 0) {
                throw "this Graph is not acyclic";
            }
            topological_index++;
            topological_table[topological_index] = node_zero[node_zero.length - 1];
            delete (arr[node_zero[node_zero.length - 1]]);
            for (var i in arr) {
                for (var j in arr[i]) {
                    if (arr[i][j] === node_zero[node_zero.length - 1]) {
                        arr[i].splice(j, 1);
                    }
                }
            }
        }
        //console.log('topological_table');
        return topological_table;
    };
    arr.prototype.topological2 = function () {
        var arr = {};
        for (var i in this.Arr_List) {
            arr[i] = this.Arr_List[i];
        }
        var topological_table = [null];
        var topological_index = 0;
        while (!this.isGraphEmpty(arr)) {
            var table1 = {};
            var node_zero = [];
            for (var i in arr) {
                table1[i] = 0;
            }
            for (var i in arr) {
                for (var j in arr[i]) {
                    table1[arr[i][j]]++;
                }
            }
            for (var i in table1) {
                if (table1[i] === 0) {
                    node_zero.push(i);
                }
            }
            if (node_zero.length == 0) {
                throw "this Graph is not acyclic";
            }
            topological_index++;
            topological_table[topological_index] = node_zero[0];
            delete (arr[node_zero[0]]);
            for (var i in arr) {
                for (var j in arr[i]) {
                    if (arr[i][j] === node_zero[0]) {
                        arr[i].splice(j, 1);
                    }
                }
            }
        }
        return topological_table;
    };
    arr.prototype.isGraphEmpty = function (arr) {
        var count = 0;
        for (var i in arr) {
            count++;
        }
        if (count == 0) {
            return true;
        }
        else {
            return false;
        }
    };
    arr.prototype.check = function (arr) {
        var count = 0;
        for (var i in arr) {
            count++;
        }
        if (count == 0) {
            return true;
        }
        else {
            return false;
        }
    };
    arr.prototype.output = function () {
        return this.Arr_List;
    };
    arr.prototype.add = function () {
        return this.Arr_List.push;
    };
    return arr;
}());
var input = fs.readFileSync(path.join(__dirname,'infile.dat'), "utf8");
var input_arr = input.split("\n");
var nodes_edge_num = input_arr[0];
var nodes_num = input_arr[0].split(" ")[0];
var edges_num = input_arr[0].split(" ")[1];
let input_r = input_arr;
input_arr.splice(0, 1);
var mapping = input_arr;
var DG = new arr();
let dg = new arr();
DG.createsGraph(nodes_num, edges_num, mapping);
//don't have edge
dg.createsGraph2(nodes_num, input_r);
try {
    var talbe1 = DG.topological1();
    var talbe2 = DG.topological2();
    console.log('have edge');
    talbe1 = talbe1.filter((i)=>{if(i){return i;}});
    talbe2 = talbe2.filter((i)=>{if(i){return i;}});
    console.log(talbe1);
    console.log(talbe2);
    console.log('not have edge');
    console.log(dg.topological1().filter((i)=>{if(i){return i;}}));
    console.log(dg.topological2().filter((i)=>{if(i){return i;}}));        
}
catch (error) {
    console.log(error);
}

