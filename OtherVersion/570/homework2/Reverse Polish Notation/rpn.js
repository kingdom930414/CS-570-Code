"use strict";
exports.__esModule = true;
var prompt = require("prompt");
var readline = require("readline");
//import prompt = require('prompt');
//import readline = require('readline');
var Queue = /** @class */ (function () {
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
var Stack = /** @class */ (function () {
    function Stack() {
        this.arr = [];
    }
    Stack.prototype.push = function (value) {
        this.arr.push(value);
    };
    Stack.prototype.pop = function () {
        return this.arr.pop();
    };
    Stack.prototype.top = function () {
        return this.arr[this.arr.length - 1];
    };
    Stack.prototype.isEmpty = function () {
        if (this.arr.length == 0)
            return true;
        else
            return false;
    };
    Stack.prototype.print = function () {
        for (var i = this.arr.length - 1; i >= 0; i--) {
            console.log(this.arr[i]);
        }
    };
    return Stack;
}());
prompt.start();
prompt.get(["Enter infix expression"], function (err, res) {
    var str = res["Enter infix expression"];
    var infixQ = new Queue(), postQ = new Queue();
    for (var _i = 0, _a = str.trim().split(""); _i < _a.length; _i++) {
        var x = _a[_i];
        if (parseInt(x) < 0)
            throw Error("Should not input negative number!");
        if (x == "O" || x == "W")
            continue;
        infixQ.enqueue(x);
    }
    console.log("The input infix expression is <'POW' is replaced by 'P'>: ", infixQ.arr.join(""));
    postQ = convert(infixQ);
    console.log("The postfix expression is: ", postQ.arr.join(""));
    console.log("Your expression answer is: " + calculate(postQ));
    var i = readline.createInterface(process.stdin, process.stdout);
    var prefix1 = "Enter Q for quit or N for next step >> ", prefix2 = "Enter another infix math problem: >> ";
    i.setPrompt(prefix1);
    i.prompt();
    i.on("line", function (line) {
        if (line == "quit" || line == "Quit" || line == "Q" || line == "q")
            i.close();
        else if (line == "N" || line == "n") {
            i.setPrompt(prefix2);
            i.prompt();
        }
        else {
            var infixQ_1 = new Queue(), postQ_1 = new Queue();
            for (var _i = 0, _a = line.trim().split(""); _i < _a.length; _i++) {
                var x = _a[_i];
                if (parseInt(x) < 0)
                    throw Error("Should not input negative number!");
                if (x == "O" || x == "W")
                    continue;
                infixQ_1.enqueue(x);
            }
            console.log("The input infix expression is <'POW' is replaced by 'P'>: ", infixQ_1.arr.join(""));
            postQ_1 = convert(infixQ_1);
            console.log("The postfix expression is: ", postQ_1.arr.join(""));
            console.log("Your expression answer is: " + calculate(postQ_1));
            i.setPrompt(prefix1);
            i.prompt();
        }
    });
    i.on("close", function () {
        console.log("Input interface is closed, programme is done!");
    });
    if (err)
        console.error(err);
});
function convert(infixQ) {
    var opstack = new Stack();
    var postQ = new Queue();
    var t;
    while (!infixQ.isEmpty()) {
        t = infixQ.front();
        infixQ.dequeue();
        if (t.charCodeAt(0) >= 48 && t.charCodeAt(0) <= 57 || t == ".")
            postQ.enqueue(t);
        else {
            postQ.enqueue(" ");
            // ignore the space
            if (t == " ")
                continue;
            else if (t == "(")
                opstack.push(t);
            else if (opstack.isEmpty())
                opstack.push(t);
            else if (t == ")") {
                while (opstack.top() != "(") {
                    postQ.enqueue(opstack.top());
                    opstack.pop();
                }
                opstack.pop();
            }
            else {
                while (!opstack.isEmpty() && opstack.top() != "(" && !higherPriority(t, opstack.top())) {
                    postQ.enqueue(opstack.top());
                    opstack.pop();
                }
                opstack.push(t);
            }
        }
    }
    while (!opstack.isEmpty()) {
        postQ.enqueue(opstack.top());
        opstack.pop();
    }
    return postQ;
}
function calculate(postQ) {
    var calstack = new Stack();
    var t, topNum, nextNum, answer;
    while (!postQ.isEmpty()) {
        t = postQ.front();
        postQ.dequeue();
        if (t == " " && postQ.front() == " ")
            continue;
        else if (t == " ")
            calstack.push(t);
        else if (t.charCodeAt(0) >= 48 && t.charCodeAt(0) <= 57 || t == ".") {
            var temp = new Stack();
            while (!calstack.isEmpty() && calstack.top().charCodeAt(0) >= 48
                && calstack.top().charCodeAt(0) <= 57 || calstack.top() == ".") {
                temp.push(calstack.pop());
            }
            calstack.push(t);
            while (!temp.isEmpty()) {
                calstack.push(temp.pop());
            }
        }
        else {
            while (calstack.top() == " ")
                calstack.pop();
            var str_1 = "";
            while (calstack.top() != " ") {
                var x = calstack.top();
                calstack.pop();
                str_1 += x;
            }
            topNum = parseFloat(str_1);
            while (calstack.top() == " ")
                calstack.pop();
            str_1 = "";
            while (!calstack.isEmpty() && calstack.top() != " ") {
                var x = calstack.top();
                calstack.pop();
                str_1 += x;
            }
            nextNum = parseFloat(str_1);
            switch (t) {
                case "P": if (nextNum == 0 && topNum == 0) {
                    answer = 0;
                    break;
                }
                else {
                    answer = Math.pow(nextNum, topNum);
                    break;
                }
                case "*":
                    answer = nextNum * topNum;
                    break;
                case "/":
                    if (topNum == 0)
                        throw Error("Divisor can not be zero!");
                    else
                        answer = nextNum / topNum;
                    break;
                case "+":
                    answer = nextNum + topNum;
                    break;
                case "-":
                    answer = nextNum - topNum;
                    break;
                default: throw Error("this postfix expression is invild!");
            }
            var arr = answer.toString().split("");
            for (var i = arr.length - 1; i >= 0; i--) {
                calstack.push(arr[i]);
            }
            calstack.push(" ");
        }
    }
    var str = "";
    while (!calstack.isEmpty()) {
        var x = calstack.top();
        calstack.pop();
        str += x;
    }
    return parseFloat(str);
}
function higherPriority(a, b) {
    if (priority(a) > priority(b))
        return true;
    else
        return false;
}
function priority(a) {
    switch (a) {
        case "P": return 2;
        case "*": return 1;
        case "/": return 1;
        case "+": return 0;
        case "-": return 0;
        default: throw Error("there is a non-operator!");
    }
}
