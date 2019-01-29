
var fs = require("graceful-fs");
var path = require("path");
var graph_1 = require("./arr");
var input = fs.readFileSync(path.join(__dirname,'infile.dat'), "utf8");
var input_arr = input.split("\n");
var nodes_edge_num = input_arr[0];
var nodes_num = input_arr[0].split(" ")[0];
var edges_num = input_arr[0].split(" ")[1];
var input_r = input_arr;
input_arr.splice(0, 1);
var mapping = input_arr;
var DG = new graph_1.arr();
let dg = new graph_1.arr();
DG.createsGraph(nodes_num, edges_num, mapping);
dg.createsGraph2(nodes_num, edges_num, input_r);
try {
    var topological_talbe1 = DG.topological1();
    var topological_talbe2 = DG.topological2();
    topological_talbe1 = topological_talbe1.filter((i)=>{if(i){return i;}});
    topological_talbe2 = topological_talbe2.filter((i)=>{if(i){return i;}});
    console.log(topological_talbe1);
    console.log(topological_talbe2);
    console.log(dg.topological1().filter((i)=>{if(i){return i;}}));
    console.log(dg.topological2().filter((i)=>{if(i){return i;}}));    
}
catch (error) {
    console.log(error);
}
