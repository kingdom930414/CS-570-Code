var prompt = require("prompt");
var rl = require("readline");
function queue(){
    var list = [];
    this.enqueue = function (value){
        list.push(value);
    }
    this.dequeue = function(){
        list.shift();
    }
    this.front = function(){
        return list[0];
    }
    this.isEmpty = function(){
        var tof = (list.length == 0)?true:false;
        return tof;
    }
    this.printf = function (){
        console.log(list.join(""));
    }
    this.output = function (){
        for(var i = 0; i < list.length ; i++ ) {
            console.log(list[i]);
        } 
    }
    this.list = function () {
        return list;
    }
}

function stack(){
    var list = [];
    this.push = function (value) {
        list.push(value);
    }
    this.pop = function (){
        return list.pop();
    }
    this.top = function (){
        return list[list.length-1];
    }
    this.isEmpty = function(){
        var tof = (list.length == 0)?true:false;
        return tof;
    }
    this.printf = function (){
        for(var i = list.length - 1; i >=0;i--){
            console.log(list[i]);
        }
    }
    this.list = function () {
        return list;
    }
}

// function transfer(input) {
//     let opstack = new stack();
//     let postQ = new queue();
//     let temp;
//     while (!input.isEmpty()) {
//         temp = input.front();
//         input.dequeue();
//         if (temp.charCodeAt(0) >= 48 && temp.charCodeAt(0) <= 57 || temp == ".")
//             postQ.enqueue(temp);
//         else {
//             postQ.enqueue(" ");
//             if (temp == " ")
//                 continue; 
//             else if (temp == "(")
//                 opstack.push(temp);
//             else if (opstack.isEmpty())
//                 opstack.push(temp);
//             else if (temp == ")") {
//                 while (opstack.top() != "(") {
//                     postQ.enqueue(opstack.top());
//                     opstack.pop();
//                 }
//                 opstack.pop();
//             }
//             else {
//                 while (!opstack.isEmpty() && opstack.top() != "(" && prior(temp)<prior( opstack.top())) {
//                     postQ.enqueue(opstack.top());
//                     opstack.pop();
//                 }
//                 opstack.push(temp);
//             }
//         }
//     }
//     while (!opstack.isEmpty()) {
//         postQ.enqueue(opstack.top());
//         opstack.pop();
//     }
//     return postQ;
// }

var postfix = (function(entry){

    var s = new stack();
    var q = new queue();
    var cur;
    while(!entry.isEmpty()){
        cur = entry.front();
        // console.log("----curEntry--: "+cur)
        entry.dequeue();
        if(cur.charCodeAt(0) >= 48 && cur.charCodeAt(0) <= 57 || cur == ".")
            q.enqueue(cur);
        else {
            q.enqueue(" ");
            if (cur == " ")
                continue;
            else if(cur == "(")
                s.push(cur);
            else if(s.isEmpty())
                s.push(cur);
            else if(cur == ")"){
                do{
                    q.enqueue(s.top());
                    s.pop();
                }while(s.top()!="(")
            }
            else{
                do{
                    s.push(cur);
                    q.enqueue(s.top());
                    s.pop();
                }while(!s.isEmpty() && s.top() != "(" && prior(cur) < prior(s.top()))
            }
        }
    }
    q.output();
    do{
        q.enqueue(s.top());
        s.pop();
    }while(!s.isEmpty())
    return q;
});

function prior(entry){
    switch (entry){
        case "P": return 3;
        case "*": return 2;
        case "/": return 2;
        case "%": return 2;
        case "+": return 1;
        case "-": return 1;
        default: throw Error("Input must be +, -, *, /, % , POW or number");

    }
}

// function eval(entry){
//     var s = new stack();
//     var curEntry,top,next,result;
//     while(!entry.isEmpty()){
//         curEntry =  entry.front();
//         entry.dequeue();
//         if(curEntry == " " && entry.front() == " " )
//             continue;
//         else if(curEntry == " ")
//             s.push(curEntry);
//         else if (curEntry.charCodeAt(0) >= 48 && curEntry.charCodeAt(0) <= 57 || curEntry == "."){
//             var t = new stack();
//             while(!s.isEmpty() && s.top().charCodeAt(0) >= 48 && s.top().charCodeAt(0) <=57 || s.top() == "."){
//                 t.push(s.pop());
//             }
//             s.push(curEntry);
//             while(!t.isEmpty()){
//                 s.push(t.pop());
//             }
//         }
//         else{
//             while (s.top() == " "){
//                 s.pop();
//             }
//             var digit = "";
//             while(!s.top() != " " && s.top() != undefined){
//                 var p=s.top();
//                 s.pop();
//                 digit += p;
//             }
//             top = parseFloat(digit);
//             while(s.top() == " "){
//                 s.pop();
//             }
//             digit = "";
//             while(!s.isEmpty() && s.top() != " "){
//                 var p = s.top();
//                 s.pop();
//                 digit += p;
//             }
//             next = parseFloat(digit);
//             switch (curEntry){
//                 case "P": 
//                     if (next == 0 && top == 0){
//                         result = 0;
//                         break;
//                     }
//                     else {
//                         result = next * top;
//                         break;
//                     }
//                 case "*":
//                     result = next * top;
//                     break;
//                 case "%":
//                     if(top ==0)
//                         throw Error("The divisor cannot be 0!");
//                     else 
//                         result = next % top;
//                     break;
//                 case "/":
//                     if(top == 0)
//                         throw Error("The divisor cannot be 0!");
//                     else 
//                         result = next / top;
//                     break;
//                 case "+":
//                     result = next + top;
//                     break;
//                 case "-":
//                     result = next - top;
//                     break;
//                 default: throw Error("This expresstion is not valid!");
//             }
//             var digitArr = result.toString().split("");
//             for(var i = digitArr.length - 1;i >= 0; i-- ){
//                 s.push(digitArr[i]);
//             }
//             s.push(" ");
//         }
//     }
//     var s_str = "";
//     while(!s.isEmpty()){
//         var p = s.top();
//         s.pop();
//         s_str += p;
//     }

//     return parseFloat(s_str);
// }
function eval(input) {
    let calstack = new stack();
    debugger;
    let temp, topNum, nextNum, answer;
    while (!input.isEmpty()) {
        temp = input.front();
        input.dequeue();
        if (temp == " " && input.front() == " ")
            continue;
        else if (temp == " ")
            calstack.push(temp);
        else if (temp.charCodeAt(0) >= 48 && temp.charCodeAt(0) <= 57 || temp == ".") {
            var template = new stack();
            while (!calstack.isEmpty() && calstack.top().charCodeAt(0) >= 48
                && calstack.top().charCodeAt(0) <= 57 || calstack.top() == ".") {
                template.push(calstack.pop());
            }
            calstack.push(temp);
            while (!template.isEmpty()) {
                calstack.push(template.pop());
            }
        }
        else {
            while (calstack.top() == " ") {
                calstack.pop();
            }
            var change = "";
            while (calstack.top() != " " && calstack.top() != undefined) {
                var x = calstack.top();
                calstack.pop();
                change += x;
            }
            topNum = parseFloat(change);
            while (calstack.top() == " ")
                calstack.pop(); 
            change = "";
            while (!calstack.isEmpty() && calstack.top() != " ") {
                var x = calstack.top();
                calstack.pop();
                change += x;
            }
            nextNum = parseFloat(change);
            switch (temp) {
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
                case "%":
                    if (topNum == 0)
                        throw Error("expression is wrong!");
                    else if (nextNum > topNum)
                        answer = nextNum % topNum;
                    else
                        answer = nextNum % topNum;
                    break;
                case "/":
                    if (topNum == 0)
                        throw Error("expression is wrong!");
                    else
                        answer = nextNum / topNum;
                    break;
                case "+":
                    answer = nextNum + topNum;
                    break;
                case "-":
                    answer = nextNum - topNum;
                    break;
                default: throw Error("this postfix expression is not valid!");
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
prompt.start();

prompt.get(["Enter infix expression"], function (err, res) {
    const str = res["Enter infix expression"];
    var infix = new queue();
    var q = new queue();
    var a = str.trim().split("")
    for (var i = 0; i < a.length; i++) {
        var x = a[i];
        if (parseInt(x) < 0)
            throw Error("Should not input negative number!");
        if (x == "O" || x == "W")
            continue;
        infix.enqueue(x);
    }
    infix.output();
    console.log("The input infix expression 'POW' is replaced by 'P': ", infix.list().join(""));
    q = postfix(infix);
    console.log("The postfix expression is: ", q.list().join(""));
    var answer = eval(q);
    console.log(answer);
    !(answer==null) ? console.log("Your expression answer is: " + answer) : console.log("Your expression have some problem");


    if (eval(q) == null) {
        conosole.log("may be there is some mistake in your input argumentss")
    }
    var result = rl.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const prefix1 = "Enter Q for quit or N for next step or continue input expression: ";
    const prefix2 = "Enter another infix math problem: ";
    result.setPrompt(prefix1);
    result.prompt();

    result.on("line", function (input) {
        if (input == "quit"  || input == "q")
            result.close();
        else if (input == "next"  || input == "n") {
            result.setPrompt(prefix2);
            result.prompt();
        }
        else {
            var before = new queue(), after = new queue();
            for (var i = 0, a = input.trim().split(""); i < a.length; i++) {
                var x = a[i];
                if (parseInt(x) < 0)
                    throw Error("Should not input negative number!");
                if (x == "O" || x == "W")
                    continue;
                before.enqueue(x);
            }
            console.log("The input infix expression 'POW' is replaced by 'P'>: ", before.list().join(""));
            after = postfix(before);
            console.log("The postfix expression is: ", after.list().join(""));
            var answer = eval(after);
            !(answer==null) ? console.log("Your expression answer is: " + answer) : console.log("Your expression have some problem");
            result.setPrompt(prefix1);
            result.prompt();
        }
        result.on("close", function () {
        });
        if (err)
            console.error(err);
    });
})

var before = new queue(), after = new queue();
var input ="1+2+3/1";
for (var i = 0, a = input.trim().split(""); i < a.length; i++) {
    var x = a[i];
    if (parseInt(x) < 0)
        throw Error("Should not input negative number!");
    if (x == "O" || x == "W")
        continue;
    before.enqueue(x);
}
console.log("The input infix expression 'POW' is replaced by 'P'>: ", before.list().join(""));
after = postfix(before);
console.log("The postfix expression is: ", after.list().join(""));
var answer = eval(after);
!(answer==null) ? console.log("Your expression answer is: " + answer) : console.log("Your expression have some problem");
// result.setPrompt(prefix1);
// result.prompt();


