"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var arr = (function () {
    function arr() {
        this.Adjacency_List = {};
    }
    arr.prototype.createsGraph = function (nodes_num, edges_num, mapping) {
        for (var i = 0; i < nodes_num; i++) {
            this.Adjacency_List[i] = [];
        }
        for (var j in mapping) {
            var edge_end_node_1 = mapping[j].split(" ")[0];
            var edge_end_node_2 = mapping[j].split(" ")[1];
            this.Adjacency_List[edge_end_node_1].push(edge_end_node_2);
        }
    };
    arr.prototype.topological1 = function () {
        var arr = {};
        for (var i in this.Adjacency_List) {
            arr[i] = this.Adjacency_List[i];
        }
        var topological_table = [null];
        var topological_index = 0;
        while (!this.isGraphEmpty(arr)) {
            var in_degree_table = {};
            var set_of_node_u_degree_zero = [];
            for (var i in arr) {
                in_degree_table[i] = 0;
            }
            for (var i in arr) {
                for (var j in arr[i]) {
                    in_degree_table[arr[i][j]]++;
                }
            }
            for (var i in in_degree_table) {
                if (in_degree_table[i] === 0) {
                    set_of_node_u_degree_zero.push(i);
                }
            }
            if (set_of_node_u_degree_zero.length == 0) {
                throw "this Graph is not acyclic";
            }
            topological_index++;
            topological_table[topological_index] = set_of_node_u_degree_zero[set_of_node_u_degree_zero.length - 1];
            delete (arr[set_of_node_u_degree_zero[set_of_node_u_degree_zero.length - 1]]);
            for (var i in arr) {
                for (var j in arr[i]) {
                    if (arr[i][j] === set_of_node_u_degree_zero[set_of_node_u_degree_zero.length - 1]) {
                        arr[i].splice(j, 1);
                    }
                }
            }
        }
        return topological_table;
    };
    arr.prototype.topological2 = function () {
        var arr = {};
        for (var i in this.Adjacency_List) {
            arr[i] = this.Adjacency_List[i];
        }
        var topological_table = [null];
        var topological_index = 0;
        while (!this.isGraphEmpty(arr)) {
            var in_degree_table = {};
            var set_of_node_u_degree_zero = [];
            for (var i in arr) {
                in_degree_table[i] = 0;
            }
            for (var i in arr) {
                for (var j in arr[i]) {
                    in_degree_table[arr[i][j]]++;
                }
            }
            for (var i in in_degree_table) {
                if (in_degree_table[i] === 0) {
                    set_of_node_u_degree_zero.push(i);
                }
            }
            if (set_of_node_u_degree_zero.length == 0) {
                throw "this Graph is not acyclic";
            }
            topological_index++;
            topological_table[topological_index] = set_of_node_u_degree_zero[0];
            delete (arr[set_of_node_u_degree_zero[0]]);
            for (var i in arr) {
                for (var j in arr[i]) {
                    if (arr[i][j] === set_of_node_u_degree_zero[0]) {
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
    return arr;
}());
exports.arr = arr;
