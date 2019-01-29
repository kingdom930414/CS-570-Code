var RLS = require("readline-sync");
var fs = require("graceful-fs");
var rds = require('fs');
var path = require('path');

function Node(data, left, right) {
    this.data = data;
    this.left = left;
    this.right = right;
    this.show = show;
    function show() {
        return this.data;
    }
};
function Bst() {
    this.root = null;
    this.add = add;//
    this.isEmpty = isEmpty;
    this.inOrder = inOrder;//
    this.inOrderDesc = inOrderDesc;//  
    this.preOrder = preOrder;//  
    this.postOrder = postOrder;//
    this.getMin = getMin;// 
    this.getMax = getMax;//  
    this.find = find;//  
    this.remove = remove;//  
    this.count = count;//
    function add(data) {
        //  
        var newNode = new Node(data, null, null);
        //  
        if (this.root == null) {
            this.root = newNode;
        } else {
            //
            var current = this.root;
            var parent;
            while (true) {
                //
                parent = current;
                //
                if (data < current.data) {
                    // 
                    //
                    current = current.left;
                    if (current == null) {
                        //  
                        parent.left = newNode;
                        break;
                    }
                } else {
                    current = current.right;
                    if (current == null) {
                        parent.right = newNode;
                        break;
                    }
                }
            }
        }

    }
    function inOrder(node) {
        var data = [];
        _inOrder(node, data);
        return data;
    }
    function inOrderDesc(node) {
        var data = [];
        _inOrderDesc(node, data);
        return data;
    }

    function preOrder(node) {
        var data = [];
        _preOrder(node, data);
        return data;
    }

    function isEmpty() {
        if(this.root.length == 0){
            return true;
        }else{
            return false;
        }
    }

    function postOrder(node) {
        var data = [];
        _postOrder(node, data);
        return data;
    }

    function _inOrder(node, data) {

        if (!(node == null)) {
            _inOrder(node.left, data);
            data.push(node.show());
            _inOrder(node.right, data);
        }
    }
    function _inOrderDesc(node, data) {
        debugger;
        if (!(node == null)) {
            _inOrderDesc(node.right, data);
            data.push(node.show());
            _inOrderDesc(node.left, data);
        }
    }
    function _preOrder(node, data) {
        if (!(node == null)) {
            data.push(node.show());
            _preOrder(node.left, data);
            _preOrder(node.right, data);
        }
    }

    function _postOrder(node, data) {
        if (!(node == null)) {
            _postOrder(node.left, data);
            _postOrder(node.right, data);
            data.push(node.show());
        }
    }

    function getMin() {
        var current = this.root;
        while (!(current.left == null)) {
            current = current.left;
        }
        return current.data;
    }
    function getMax() {
        var current = this.root;
        while (!(current.right == null)) {
            current = current.right;
        }
        return current.data;
    }
    function find(data) {
        var current = this.root;
        while (current != null) {
            if (data == current.data) {
                return current;
            } else if (data < current.data) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        return null;
    }
    function getSmallest(node) {
        var current = node;
        while (!(current.left == null)) {
            current = current.left;
        }
        return current;
    }
    function remove(data) {
        root = removeNode(this.root, data);
    }
    function removeNode(node, data) {
        if (node == null) {
            return null;
        }
        if (data == node.data) {
            //如果没有只节点  
            if (node.left == null && node.right) {
                return null;
            }
            //如果没有左节点  
            if (node.left == null) {
                return node.right;
            }
            //如果没有右节点  
            if (node.right == null) {
                return node.left;
            }

            //有两节点  
            var tempNode = getSmallest(node.right);
            node.data = tempNode.data;
            node.right = removeNode(node.right, tempNode.data);
            return node;
        } else if (data < node.data) {
            node.left = removeNode(node.left, data);
            return node;
        } else {
            node.right = removeNode(node.right, data);
            return node;
        }
    }

    function count() {
        var counts = 0;
        var current = this.root;
        if (current == null) {
            return counts;
        }
        return _count(current, counts);
    }
    function _count(node, counts) {
        debugger;
        if (!(node == null)) {
            counts++;
            counts = _count(node.left, counts);;
            counts = _count(node.right, counts);
        }
        return counts;
    }
}

var data = new Bst();
// data.insert(1);
// data.insert(2);
// data.insert(3);
// data.insert(4);
// data.insert(5);
// data.insert(6);
// data.insert(7);
// data.insert(8);

var input = rds.readFileSync(path.join(__dirname, 'infile.dat'), "utf8");
console.log(input)
input = input.split(',');
for (i in input) {
    data.add(parseInt(i)+1);
}

data.isEmpty();

// console.log(data.find(1));
// console.log(data.find(7));
// console.log(data.find(9));
var check = true;
let on = true;

while(on){
    try {
        check = RLS.question('User Input :(input e to end) ');
        check = check.replace(/^[\s\n\t]+/g,'');
        if(check == 'e'){
            console.log('program end');
            on = false;
            break;
        }
        if(data.find(parseInt(check))){
            console.log('yes');
        }else if(check == ""){
            console.log('input should not be empty!');
            //check = false;
        }else{
            console.log('no');
            //check = false;
        }
    } catch (error) {
        throw error;
    }  
}
