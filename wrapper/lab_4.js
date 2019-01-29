class Vector {

 constructor(list) {
    this.list=list;
    this.setLength();
 }
  get(num) {
    return this.list[num];
 };
  set(num, x){
  	this.list[num]=x;
 };
  push(x){
 	this.list.push(x);
  this.setLength();
 };
  pop(){
 	this.list.pop();
  this.setLength();
 };
  insert(num, x){
 	this.list.splice(num,num-1,x);
  this.setLength();
 };
  setLength(){
 	this.length=this.list.length;
 };

* [Symbol.iterator]() {
	for (let x of this.list){
		yield x;
	}
 }
* generate() {
	for (let x of this.list){
		yield x;
	}
 }
}

const imp = new Vector(['a', 'b', 'c', 'd']);
print('');

console.log('get(1): '+imp.get(1));

imp.set(1,'Z');
print('set(1,Z): ');

imp.setLength();
print('Length: '+ imp.setLength);

imp.push('e');
print('push(e): ');

imp.pop();
print('pop: ');

imp.insert(1,'X');
print('insert(1,X): ');

function print(Letter){
  console.log(Letter+imp.list);
}

var generate = imp.generate();

for (let x of imp) { 
    console.log(generate.next());
};

for (let x of imp) { 
    console.log(x); 
};