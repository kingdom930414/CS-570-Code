const fs = require('fs');
// fs.readFile('input.txt', function (err, data) {
//     if (err) {
//         return console.error(err);
//     } else {
//         console.log(typeof data);
//         console.log(data.toString());
//         if (typeof data != "object") {
//             throw 'input type must be string';
//         } else {
//             // console.log(data.toString());
//             // console.log(data[0]);
//             console.log(data.toString());
//             return rot13(data);
//         }
//     }
//     console.log(": " + data.toString());
// });

fs.readFile('input.txt', function (err, data) {
    if (err) {
        return console.error(err);
    } else {
        //sconsole.log(typeof data);
        console.log(data.toString());
        if (typeof data != "object") {
            throw 'input type must be string';
        } else {

            //console.log(data.toString());
            //console.log(data.toString());
            //return rot13(data.toString());
            const str = rot13(data.toString());
            const str2 = code2(data.toString(), 5);
            //console.log(str2);
            fs.writeFile('input.txt', str2, function (err) {
                if (err) {
                    return console.error(err);
                }


            });
        }
    }
    //console.log(": " + data.toString());
});


//  function rot13(str) { // LBH QVQ VG!

//     return str.replace(/[A-Z]/g, L => String.fromCharCode((L.charCodeAt(0) % 26) + 65));
// }

function rot13(str) {
    if (typeof str == 'string') {
        var strup = str.toUpperCase();
        var charcodearr = [];
        var rotcodearr = [];
        for (var i = 0; i < strup.length; i++) {
            var strcode = (strup.charCodeAt(i));
            charcodearr.push(strcode);
        }
        for (var j = 0; j < charcodearr.length; j++) {
            if (charcodearr[j] < 65) { rotcodearr.push(charcodearr[j]); }
            else if (charcodearr[j] < 78) { rotcodearr.push(charcodearr[j] + 13); }
            else if (charcodearr[j] < 91) { rotcodearr.push(charcodearr[j] - 13); }
            else if (charcodearr[j] > 91) { rotcodearr.push(charcodearr[j]); }
        }


        // var encodestr = rotcodearr.toString();
        // return String.fromCharCode(encodestr);
        return String.fromCharCode.apply(this, rotcodearr)
    } else {
        return;
    }

}

function code(str, number) {
    let result = "";
    if (number == null) {
        number = 3;
    }
    const og = number;
    debugger;
    if (typeof str == 'string') {
        str = str.split(" ");
        for (let i = 0; i < str.length; i++) {
            for (let j = 0; j < str[i].length; j++) {
                if (str[i][j]) {
                    if (str[i][j].charCodeAt() <= 90) {
                        
                        if (j % 3 == 0 && j != 0 && i==0) {
                            number += 2;
                        }
                        if (str[i][j].charCodeAt() >= 65 + number) {
                            result += String.fromCharCode(str[i][j].charCodeAt() - number);
                        } else if (str[i][j].charCodeAt() >= 65 && str[i][j].charCodeAt() < (65 + number)) {
                            result += String.fromCharCode(str[i][j].charCodeAt() + 26 - number);
                        } else {
                            result += str[i][j];
                        }

                    } else {
                        // if (j == 0) {

                        //     number = og;
                        // }
                        if (j % 3 == 0) {
                            number += 2;
                        }
                        if (str[i][j].charCodeAt() >= 97 + number) {
                            result += String.fromCharCode(str[i][j].charCodeAt() - number);
                        } else {
                            result += String.fromCharCode(str[i][j].charCodeAt() + 26 - number);
                        }
                        //number = og;

                    }
                } else {
                    result += " ";

                }
            }
        }
        return result;
    } else {
        throw 'input must be string'
    }
}

function code2(str, number) {
    let result = "";
    if (number == null) {
        number = 3;
    }
    const og = number;
    debugger;
    if (typeof str == 'string') {
        //str = str.split(" ");
        for (let i = 0; i < str.length; i++) {
            
                if (str[i]) {
                    if (str[i].charCodeAt() <= 90) {
                        
                        if (i % 3 == 0 && i != 0) {
                            number += 2;
                        }
                        if (str[i].charCodeAt() >= 65 + number) {
                            result += String.fromCharCode(str[i].charCodeAt() - number);
                        } else if (str[i].charCodeAt() >= 65 && str[i].charCodeAt() < (65 + number)) {
                            result += String.fromCharCode(str[i].charCodeAt() + 26 - number);
                        } else {
                            result += str[i];
                        }

                    } else {
                        // if (j == 0) {

                        //     number = og;
                        // }
                        if (i % 3 == 0) {
                            number += 2;
                        }
                        if (str[i].charCodeAt() >= 97 + number) {
                            result += String.fromCharCode(str[i].charCodeAt() - number);
                        } else {
                            result += String.fromCharCode(str[i].charCodeAt() + 26 - number);
                        }
                        //number = og;

                    }
                } else {
                    result += " ";

                }
            
        }
        return result;
    } else {
        throw 'input must be string'
    }
}