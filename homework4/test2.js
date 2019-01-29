var RLS = require("readline-sync");
var fs = require("graceful-fs");
var rds = require('fs');
var path = require('path');
var cbdata = {};
var totalword = 0;
var totalcomp = 0;

function TrieNode(key) {
    this.key = key;
    this.hit = 0;
    this.son = [];
}

function companyNode(data,number) {
    this.name = data;
    this.hit = number;
}

function companytree() {
    this.company = {};
}
companytree.prototype = {
    addcompany: function (key,number) {
        if (this.getcompany(key)) {
            this.getcompanynum(key,number);
        } else {
            this.company[key] = new companyNode(key,number)
        }
    },
    getcompany: function (key) {
        if (this.company[key]) {
            return this.company[key];
        } else {
            return false;
        }
    },
    getcompanynum: function (key,number) {
        if (this.company[key]) {
            this.company[key]['hit'] += number;
        } else {
            return false;
        }
    }
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
            node.hit += 1;
            //this.getNum(node) += 1;
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

    },
    getSon: function (node) {
        return node.son;
    },
    getNum: function (node) {
        return node.hit;
    },
    printdata1: function (node, data) {

        if (node.son.length == 0 || node.hit > 0) {
            console.log('ddddd', data.join(''), node.hit);
            if (!cbdata[data.join('')]) {
                cbdata[data.join('')] = node.hit;
            }

            //continue;
        }
        for (var i in node.son) {
            data.push(node.son[i].key);
            this.printdata1(node.son[i], data);
            data.pop();
        }
    },
    printData: function () {
        for (var i in this.root.son) {
            this.printdata1(this.root.son[i], [this.root.son[i].key]);
        }

    },
    isExit: function (node, queryData) {
        if (node.key == queryData[0]) {

        }
    }

};

var trie = new Trie();

//trie.printData();

var input = rds.readFileSync(path.join(__dirname, 'companies.dat'), "utf8");

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

var file = rds.readFileSync(path.join(__dirname, 'infile.dat'), "utf8");
file = file.replace(/\r\n/g, ' ').split(" ");
totalword = file.length;
for (let num in file) {
    if (file[num] === 'a' || file[num] === 'an' || file[num] === 'the' || file[num] === 'and' || file[num] === 'or' || file[num] === 'but') {
        file.splice(num, 1);
    }
}

//console.log(file);

// for(let i in file){
//     trie.insertData(i);
// }

file.forEach((i) => {
    trie.insertData(i);
})

trie.printData();
//console.log(cbdata);
//console.log(trie);
let companyoutput = new companytree();
Object.keys(cbdata).forEach((indata) => {
    for (j in companies) {
        if (indata == j) {
            //continue;
            companyoutput.addcompany(companies[j],cbdata[indata]);
            //companies[j][hit] = cbdata[indata];
            //let company = new companytree(j);
        }
    }
})

//console.log(companies);

//company.addcompany('apple');
//console.log(companyoutput);
console.log('Company	Hit Count	Relevance');
for (data in companyoutput.company) {
    totalcomp += companyoutput.company[data]['hit'];
    console.log(companyoutput.company[data]['name'],"    ", companyoutput.company[data]['hit'],"    ", (companyoutput.company[data]['hit']*100 / totalword).toFixed(3),'%');
}

console.log("Total   ",totalcomp,"   ",(totalcomp*100 / totalword).toFixed(3),'%')
console.log("Total Words     ",totalword);
