var fs = require("graceful-fs");
var path = require('path');
var prompt = require("prompt-sync");
prompt = prompt();
var uuidV4 = require("uuid/v4");
//const readline = require('readline');
//const prompt = readline.createInterface(process.stdin, process.stdout);
var lst_node = (function(){
    function node(id,link){
        this.id = id;
        this.link = link;
        this.list = {};
        this.router_id = 0;
    }
    return node;
}());

var SPF = (function () {
    function SPF() {
    }
    SPF.init = function (s, adjacent_list) {
        this.s = s;
        this.adjacent_list = adjacent_list;
        this.S = {};
        this.VS = {};
        this.D = {};
        this.outgoing_link = {};
        for (var i in this.adjacent_list) {
            if (i == s) {
                this.S[i] = 1;
            }
            else {
                this.VS[i] = 1;
                if (this.adjacent_list[s] != undefined) {
                    if (this.adjacent_list[s][i] == undefined) {
                        this.D[i] = Number.MAX_VALUE;
                    }
                    else {
                        if (typeof this.adjacent_list[s][i] == "number") {
                            this.D[i] = this.adjacent_list[s][i];
                        }
                        else {
                            this.D[i] = parseInt(this.adjacent_list[s][i]);
                        }
                    }
                    this.outgoing_link[i] = [s, i];
                }
            }
        }
    };
    SPF.computeSPF = function () {
        if (Object.getOwnPropertyNames(this.D).length != 0) {
            while (Object.getOwnPropertyNames(this.VS).length != 0) {
                var v = this.selectMinDFromVS();
                delete this.VS[v];
                this.S[v] = 1;
                for (var w in this.VS) {
                    var cost_v_w;
                    if (this.adjacent_list[v] == undefined) {
                        cost_v_w = Number.MAX_VALUE;
                    }
                    else {
                        if (this.adjacent_list[v][w] == undefined) {
                            cost_v_w = Number.MAX_VALUE;
                        }
                        else {
                            if (typeof this.adjacent_list[v][w] == "number") {
                                cost_v_w = this.adjacent_list[v][w];
                            }
                            else {
                                cost_v_w = parseInt(this.adjacent_list[v][w]);
                            }
                        }
                    }
                    if (typeof this.D[w] != "number") {
                        this.D[w] = parseInt(this.D[w]);
                    }
                    if (typeof this.D[v] != "number") {
                        this.D[v] = parseInt(this.D[v]);
                    }
                    if (this.D[v] + cost_v_w < this.D[w]) {
                        for (var j = 0; j < this.outgoing_link[v].length; j++) {
                            this.outgoing_link[w].push(this.outgoing_link[v][j]);
                        }
                        this.outgoing_link[w].push(w);
                    }
                    this.D[w] = Math.min(this.D[w], this.D[v] + cost_v_w);
                }
            }
        }
    };

    SPF.selectMinDFromVS = function () {
        var minVex = null;
        for (var i in this.VS) {
            if (minVex == null) {
                minVex = i;
            }
            else {
                if (typeof this.D[i] != "number") {
                    this.D[i] = parseInt(this.D[i]);
                }
                if (typeof this.D[minVex] != "number") {
                    this.D[minVex] = parseInt(this.D[minVex]);
                }
                if (this.D[i] < this.D[minVex]) {
                    minVex = i;
                }
            }
        }
        return minVex;
    };
    return SPF;
}());
SPF.adjacent_list = {};
SPF.S = {}; 
SPF.VS = {};
SPF.D = {};
SPF.outgoing_link = {};

var LSP = (function () {
    function LSP() {
        this.id = uuidV4();
        this.router_id = null;
        this.sequence = null;
        this.TTL = 10;
        this.list = null;
        this.send_from = null;
    }
    return LSP;
}());

var rout = (function () {
    function rout() {
        this.TICK_CHECK = 1;
        this.id = null;
        this.status = "start";
        this.network = null;
        this.network_cost = null;
        this.tick = 0;
        this.router_connect_list = {};
        this.packets_copy = null;
        this.pkt_node = null;
        this.sequence = 0;
        this.get_lists = {};
        this.ohsr_list = {};
        this.adjacent_list = {};
        this.router_network_mapping = {};
        this.routing_table = {};
    }
    rout.prototype.receivePacket = function (packet) {
        if (this.status === "start") {
            packet.TTL = packet.TTL - 1;
            if (!this.checkDiscard(packet)) {
                this.insert_adjacent(packet);
                SPF.init(this.id, this.adjacent_list);
                SPF.computeSPF();
                this.updateRoutingTable();
                for (var prop in this.router_connect_list) {
                    var new_packet = this.copyPacket(packet);
                    new_packet.send_from = this.id;
                    if (base.routers[prop].receivePacket(new_packet) == true) {
                        if (this.get_lists[this.tick] == undefined) {
                            this.get_lists[this.tick] = {};
                        }
                        this.get_lists[this.tick][prop] = 1;
                    }
                }
            }
            else {
            }
            return true;
        }
        else {
            return false;
        }
    };
    rout.prototype.beginPacket = function () {
        if (this.status === "start") {
            this.getnodelink();
            this.tick = this.tick + 1;
            this.get_lists[this.tick] = {};
            for (var prop in this.router_connect_list) {
                var new_packet = this.copyPacket(this.pkt_node);
                new_packet.send_from = this.id;
                // the first resive node 
                if (base.routers[prop].receivePacket(new_packet) == true) {
                    this.get_lists[this.tick][prop] = 1;
                }
            }
            if (this.tick >= this.TICK_CHECK) {
                this.checkTicks();
            }
        }
        // for(i in base.routers){
        //     console.log(base.routers[i].router_connect_list);
        // }
        console.log(this.router_connect_list);
        //console.log(base.routers[3].router_connect_list);
    };

    rout.prototype.getnodelink = function () {
        this.sequence = this.sequence + 1;
        this.pkt_node = new LSP();
        this.pkt_node.router_id = this.id;
        this.pkt_node.sequence = this.sequence;
        this.pkt_node.list = {};
        this.pkt_node.TTL = 10;
        for (var node in this.router_connect_list) {
            this.pkt_node.list[node] = {};
            //have some problem here
            this.pkt_node.list[node].cost = this.router_connect_list[node];
            this.pkt_node.list[node].network = base.routers[node].network;
        }
    };

    rout.prototype.checkTicks = function () {
        for (var prop in this.router_connect_list) {
            if (this.get_lists[this.tick][prop] == undefined && this.get_lists[this.tick - 1][prop] == undefined) {
                this.setCostInfinite(prop);
            }
            if (this.get_lists[this.tick][prop] != undefined) {
                this.router_connect_list[prop] = 1;
                if (this.router_connect_list[prop] == Number.MAX_VALUE) {
                    this.router_connect_list[prop] = base.routers[prop].router_connect_list[this.id];
                }
            }
        }
    };
    rout.prototype.setCostInfinite = function (router_id) {
        this.router_connect_list[router_id] = Number.MAX_VALUE;
    };
    rout.prototype.checkDiscard = function (packet) {
        if (packet.TTL <= 0) {
            return true;
        }
        if (this.ohsr_list[packet.router_id] == null) {
            this.ohsr_list[packet.router_id] = packet.sequence;
        }
        else {
            if (this.ohsr_list[packet.router_id] >= packet.sequence) {
                return true;
            }
        }
        return false;
    };

    rout.prototype.insert_adjacent = function (packet) {
        for (var i in packet.list) {
            if (this.adjacent_list[packet.router_id] == null) {
                this.adjacent_list[packet.router_id] = {};
            }
            if (this.adjacent_list[i] == null) {
                this.adjacent_list[i] = {};
            }
            this.adjacent_list[packet.router_id][i] = packet.list[i].cost;
            this.adjacent_list[i][packet.router_id] = packet.list[i].cost;
            this.router_network_mapping[i] = packet.list[i].network;
        }
    };

    rout.prototype.updateRoutingTable = function () {
        for (var i in SPF.D) {
            if (this.routing_table[base.routers[i].network] == undefined) {
                this.routing_table[base.routers[i].network] = {};
            }
            if (typeof SPF.D[i] != "number") {
                SPF.D[i] = parseInt(SPF.D[i]);
            }
            if(isNaN(SPF.D[i])){
                SPF.D[i] = 0;
            }
            if (typeof base.routers[i].network_cost != "number") {
                base.routers[i].network_cost = parseInt(base.routers[i].network_cost);
            }
            this.routing_table[base.routers[i].network].cost = SPF.D[i] + base.routers[i].network_cost;
            this.routing_table[base.routers[i].network].outgoing_link = SPF.outgoing_link[i][1];
            this.routing_table[this.network] = {};
            if (typeof this.network_cost == "number") {
                this.routing_table[this.network].cost = this.network_cost;
            }
            else {
                this.routing_table[this.network].cost = parseInt(this.network_cost);
            }
            this.routing_table[this.network].outgoing_link = null;
        }
    };
    rout.prototype.copyPacket = function (packet) {
        var new_packet = new LSP();
        for (var i in packet) {
            new_packet[i] = packet[i];
        }
        return new_packet;
    };
    return rout;
}());

var base = (function () {
    function base() {
    }
    base.main = function () {
        this.initFileRouter();
        console.log(this.routers);
        while (true) {
            console.log("\n C: continue\n Q: quit\n P followed by the routers id number: print the routing table of a router\n S followed by the id number: shut down a router\n T followed by the id : start up a router\n enter your choose:");
           // var p = prompt('');
            //console.log('111');
            var p = "p1";
            //console.log(p);
            for (var prop in this.routers) {
                this.routers[prop].beginPacket();
            }

            if(p == null){
                return false;
            }
            if (p.toLowerCase() == "c") {
                // for (var i = 0; i < 2; i++) {
                //     for (var prop in this.routers) {
                //         this.routers[prop].beginPacket();
                //     }
                // }
                for (var i = 0; i < 1; i++) {
                    for (var prop in this.routers) {
                        this.routers[prop].beginPacket();
                    }
                }
            }
            else if (p.toLowerCase() == "q") {
                console.log('program close!');
                break;
            }
            else if (p.charAt(0).toLowerCase() == "p") {
                if(p.split('').length != 2 || parseInt(p.charAt(1)) > 6){
                    console.log('\nyou input wrong router id');
                    continue;
                }
                if (base.routers[p.charAt(1)].status == "start") {
                    console.log(base.routers[p.charAt(1)].routing_table);
                }
                else {
                    console.log(p + " is shutdown now");
                }
            }
            else if (p.charAt(0).toLowerCase() == "s") {
                if(p.split('').length != 2 || parseInt(p.charAt(1)) > 6){
                    console.log('\nyou input wrong router id');
                    continue;
                }
                base.routers[p.charAt(1)].status = "stop";
            }
            else if (p.charAt(0).toLowerCase() == "t") {
                base.routers[p.charAt(1)].status = "start";
            }
        }
    };

    base.initFileRouter = function () {
        var input = fs.readFileSync(path.join(__dirname,"infile.dat"), "utf8");
        var input_arr = input.split("\n");
        var new_router;
        for (var i in input_arr) {
            var input_line = input_arr[i];
            var input_line_arr = input_arr[i].split(/\s+/);
            if (input_line_arr[0] !== '') {
                new_router = new rout();
                new_router.id = input_line_arr[0];
                new_router.network = input_line_arr[1];
                if (input_line_arr[2] != undefined) {
                    new_router.network_cost = input_line_arr[2];
                }
                else {
                    new_router.network_cost = 1;
                }
                this.routers[new_router.id] = new_router;
            }
            else {
                // like routes
                if (input_line_arr[2] != undefined) {
                    this.routers[new_router.id].router_connect_list[input_line_arr[1]] = input_line_arr[2];
                }
                else {
                    this.routers[new_router.id].router_connect_list[input_line_arr[1]] = 1;
                }
            }
        }
    };
    return base;
}());
base.routers = {};

base.main();


