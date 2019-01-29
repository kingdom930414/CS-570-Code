class Vector {

    constructor(list) {
        this.list = list;
        let length = this.setLength();
    }
    get(num) {
        return this.list[num];
    };
    set(num, x) {
        this.list[num] = x;
    };
    push(x) {
        this.list.push(x);
        this.setLength();
    };
    pop() {
        this.list.pop();
        this.setLength();
    };
    insert(num, x) {
        this.list.splice(num, num - 1, x);
        this.setLength();
    };
    setLength() {
        this.length = this.list.length;
    };

    *[Symbol.iterator]() {
        for (let x of this.list) {
            yield x;
        }
    }
    * generate() {
        for (let x of this.list) {
            yield x;
        }
    }
}
//Vector class ends here
//test begins

const imp = new Vector(['a', 'b', 'c', 'd']);

console.log(imp);
//console.log('vector length',imp.length);

function print(Letter) {
    console.log(Letter + imp.list);
}

var generate = imp.generate();

for (let x of imp) {
    //console.log(x);
    console.log(generate.next());
};

for (let x of imp) {
    console.log(x);
};

//define

print('');

console.log('get(1): ' + imp.get(1));

imp.set(1, 'Z');
print('set(1,Z): ');

imp.push('e');
print('push(e): ');

imp.pop();
print('pop: ');

imp.insert(1, 'X');
print('insert(1,X): ');