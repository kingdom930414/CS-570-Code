var lst_node = (function(id,link){
    function node(id,link){
        this.id = id;
        this.link = link;
        this.list = {};
        this.router_id = 0;
    }
    return node(id,link);
}());

var LSP = (function () {
    function LSP() {
        //this.id = uuidV4();
        this.router_id = null;
        this.sequence = null;
        this.TTL = 10;
        this.list = null;
        this.send_from = null;
    }
    return LSP;
}());

var test = new lst_node(1,1);
var h = new LSP();
console.log(test);