"use strict";
import * as prompt from "prompt";
import * as readline from "readline";
//import prompt = require('prompt');
//import readline = require('readline');

class Queue<T>{
    public arr: T[];
    constructor() {
        this.arr = [];    
    }
    public enqueue(value: T) {
        this.arr.push(value);
    }
    public dequeue() {
        this.arr.shift();
    }
    public front(): T {
        return this.arr[0];
    }
    public isEmpty(): boolean {
        if (this.arr.length === 0) return true;
        else return false;
    }
    public print() {
        console.log(this.arr.join(""));
    }
    public output() {
        for (let i = 0; i < this.arr.length; i++) {
            console.log(this.arr[i]);
        }
    }
}

class Stack<T> {
    private arr: T[];
    constructor() {
        this.arr = [];
    }
    public push(value: T) {
        this.arr.push(value);
    }
    public pop(): T {
        return this.arr.pop();
    }
    public top(): T {
        return this.arr[this.arr.length - 1];
    }
    public isEmpty(): boolean {
        if (this.arr.length == 0) return true;
        else return false;
    }
    public print() {
        for(let i = this.arr.length - 1; i >= 0; i--) {
            console.log(this.arr[i]);
        }
    }
}
prompt.start();
prompt.get(["Enter infix expression"], (err, res) => {

    let str = res["Enter infix expression"];
    let infixQ = new Queue(), postQ = new Queue();

    for (let x of str.trim().split("")) {
        
        if (parseInt(x) < 0) throw Error("Should not input negative number!");
     
        if (x == "O" || x == "W") continue;
        infixQ.enqueue(x);
    }
  
    console.log("The input infix expression is <'POW' is replaced by 'P'>: "
               , infixQ.arr.join(""));
  
    postQ = convert(infixQ);
    console.log("The postfix expression is: ", postQ.arr.join(""));

    console.log("Your expression answer is: " + calculate(postQ));


    let i = readline.createInterface(process.stdin, process.stdout);
    let prefix1 = "Enter Q for quit or N for next step >> ", prefix2 = "Enter another infix math problem: >> ";
    i.setPrompt(prefix1);
    i.prompt();
    i.on("line", (line) => {
        if (line == "quit" || line =="Quit" || line == "Q" || line == "q") i.close();
        else if (line == "N" || line == "n") {
            i.setPrompt(prefix2);
            i.prompt();
        }
        else {
            let infixQ = new Queue(), postQ = new Queue();
            for (let x of line.trim().split("")) {
             
                if (parseInt(x) < 0) throw Error("Should not input negative number!");
        
                if (x == "O" || x == "W") continue;
                infixQ.enqueue(x);
            }
         
            console.log("The input infix expression is <'POW' is replaced by 'P'>: "
            , infixQ.arr.join(""));
          
            postQ = convert(infixQ);
            console.log("The postfix expression is: ", postQ.arr.join(""));
          
            console.log("Your expression answer is: " + calculate(postQ));
            i.setPrompt(prefix1);
            i.prompt();
        }
    });
    i.on("close", () => {
        console.log("Input interface is closed, programme is done!");
    });

    if (err) console.error(err);
});

function convert (infixQ) {
    let opstack = new Stack();
    let postQ = new Queue();
    let t; 
    while(!infixQ.isEmpty()) {
        t = infixQ.front(); infixQ.dequeue();
    
        if (t.charCodeAt(0) >= 48 && t.charCodeAt(0) <= 57 || t == ".") postQ.enqueue(t);
        else {
     
            postQ.enqueue(" ");
            // ignore the space
            if (t == " ") continue;
            else if (t == "(") opstack.push(t);
            else if (opstack.isEmpty()) opstack.push(t);
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

function calculate (postQ) {
    let calstack = new Stack<string>();
    let t, topNum, nextNum, answer;
    while(!postQ.isEmpty()) {
        t = postQ.front(); postQ.dequeue();
       
        if (t == " " && postQ.front() == " ") continue;
        else if (t == " ") calstack.push(t);
     
        else if (t.charCodeAt(0) >= 48 && t.charCodeAt(0) <= 57 || t == ".") {
          
            let temp = new Stack<string>();
            while (!calstack.isEmpty() && calstack.top().charCodeAt(0) >= 48 
                  && calstack.top().charCodeAt(0) <= 57 || calstack.top() == ".") {
                temp.push(calstack.pop());
            }
            calstack.push(t);
            while(!temp.isEmpty()) {
                calstack.push(temp.pop());
            }    
        }
        else {
          
            while (calstack.top() == " ") calstack.pop();
            let str = "";
            while(calstack.top() != " ") {
                let x = calstack.top(); calstack.pop();
                str += x;
            }
            topNum = parseFloat(str);
          
            while (calstack.top() == " ") calstack.pop();
            str = "";
            while(!calstack.isEmpty() && calstack.top() != " ") {
                let x = calstack.top(); calstack.pop();
                str += x;
            }
            nextNum = parseFloat(str);
            
            switch (t) {
                case "P": if (nextNum == 0 && topNum == 0 ) 
                          {
                              answer = 0;
                              break;
                          }
                          else 
                          {
                              answer = Math.pow(nextNum, topNum);
                              break;
                          }
                case "*": answer = nextNum * topNum; break;
                case "/": if (topNum == 0) throw Error("Divisor can not be zero!");
                          else answer = nextNum / topNum;
                          break;
                case "+": answer = nextNum + topNum; break;
                case "-": answer = nextNum - topNum; break;
                default:  throw Error("this postfix expression is invild!");
            }
          
            let arr = answer.toString().split("");
            for (let i = arr.length - 1; i >= 0; i--) {
                calstack.push(arr[i]);
            }
            calstack.push(" ");            
        }
    }
 
    let str = "";
    while(!calstack.isEmpty()) {
        let x = calstack.top(); calstack.pop();
        str += x;
    }
    return parseFloat(str); 
}


function higherPriority (a, b) {
    if (priority(a) > priority(b)) return true;
    else return false;
}

function priority(a): number {
    switch (a) {
        case "P": return 2;
        case "*": return 1;
        case "/": return 1;
        case "+": return 0;
        case "-": return 0;
        default: throw Error("there is a non-operator!");
    }
}
