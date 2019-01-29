function fizzBuzz(start,end) {
    let arr=[]
    if (start == null && end == null) {
        start = 74;
        end = 291;
        arr=mArr(start,end);
        for (var i = arr[0]; i <= arr[arr.length-1]; i++) {
            if (i % 15 == 0)
                console.log('buzzfizz');
            if ((i % 3) == 0 && (i % 5) != 0)
                console.log('buzz');
            if ((i % 5) == 0 && (i % 3) != 0)
                console.log('fizz');
            else
                console.log(i);
        }
    } if (start < end && typeof start == "number" && typeof end == "number") {
        for (var i = start; i <= end; i++) {
            if ((i % 3) == 0 && (i % 5) != 0)
                console.log('buzz');
            if ((i % 5) == 0 && (i % 3) != 0)
                console.log('fizz');
            if (i % 15 == 0)
                console.log('buzzfizz');
            else
                console.log(i);
        }
    } else {
        throw "input arguments must be number and start number need to samll than end number";
    }
}

fizzBuzz();
//if you want to add some arguments
//fizzBuzz(1,100);

function mArr(a, b) {
    let arr = [];
    if (a < b) {
        for (let i = a; i < b; i++) {
            arr[a];
        }
        return arr;
    } else {
        throw 'error number'
    }
}