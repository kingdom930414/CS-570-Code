
const fs = require('fs');
const readline = require('readline');
const test = readline.createInterface(process.stdin, process.stdout);

function Queue(size) {
    var list = [];
    var arr = [];
    var index = 0;

    this.enqueue = function (data) {
        if (data == null) {
            return false;
        }
        if (size != null && !isNaN(size)) {
            if (list.length == size) {
                list.unshift(data);
                this.pop();
                return true;
            }
        }
        list.push(data);
        //list.unshift(data);
        return true;
    }

    this.enqueuec = function (data) {
        if (data == null) {
            return false;
        }
        if (size != null && !isNaN(size)) {
            if (arr.length == size) {
                arr.splice(index,1,data);
                arr[index]=data;
                index++;
                if (index == 12) {
                    index = 0;
                }
                return true;
            }
        }
        arr.push(data);
        return true;
    }

    this.pop = function () {
        return list.pop();
    }

    this.popc = function () {
        return arr.pop();
    }

    this.dequeue = function () {
        return list.shift();
    }

    this.dequeuec = function () {
        return arr.shift();
    }

    this.size = function () {
        return list.length;
    }

    this.sizec = function () {
        return arr.length;
    }

    this.quere = function () {
        return list;
    }

    this.querec = function () {
        return arr;
    }
}

var test1 = new Queue(12);
//console.log(test1.size());
for (let i = 0; i < 5; i++) {
    test1.enqueue(i);
}
//console.log(test1.quere());
let que = new Queue(12);

function start() {
    test.question('please input ', (data) => {
        if (data.toLocaleLowerCase() == "quit") {
            //console.log(que.quere());
            //output(que.quere());
            output(que.querec());
            test.close();
        } else {
            que.enqueue(data);
            que.enqueuec(data);
            start();
        }
    })
}

function output(data) {
    console.log('the list input', data);
    for (let i = 0; i < data.length; i++) {
        console.log(`${data[i]}`);
    }
}

start();
