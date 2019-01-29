"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lsp_1 = require("./lsp");
var base_1 = require("./base");
var s_1 = require("./short");
var rout = (function () {
    function rout() {
        this.TICK_CHECK = 1;
        this.id = null;
        this.status = "start";
        this.network = null;
        this.network_cost = null;
        this.tick = 0;
        this.connected_routers_list = {};
        this.packets_copy = null;
        this.ori_packet = null;
        this.sequence = 0;
        this.recieved_list = {};
        this.ohsr_list = {};
        this.adjacent_list = {};
        this.router_network_mapping = {};
        this.routing_table = {};
    }
    rout.prototype.receivePacket = function (packet) {
        if (this.status === "start") {
            packet.TTL = packet.TTL - 1;
            if (!this.checkDiscard(packet)) {
                this.piecePuzzleTogether(packet);
                s_1.SPF.init(this.id, this.adjacent_list);
                s_1.SPF.computeSPF();
                this.updateRoutingTable();
                for (var prop in this.connected_routers_list) {
                    var new_packet = this.copyPacket(packet);
                    new_packet.send_from = this.id;
                    if (base_1.base.routers[prop].receivePacket(new_packet) == true) {
                        if (this.recieved_list[this.tick] == undefined) {
                            this.recieved_list[this.tick] = {};
                        }
                        this.recieved_list[this.tick][prop] = 1;
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
    rout.prototype.originatePacket = function () {
        if (this.status === "start") {
            this.generateLSP();
            this.tick = this.tick + 1;
            this.recieved_list[this.tick] = {};
            for (var prop in this.connected_routers_list) {
                var new_packet = this.copyPacket(this.ori_packet);
                new_packet.send_from = this.id;
                if (base_1.base.routers[prop].receivePacket(new_packet) == true) {
                    this.recieved_list[this.tick][prop] = 1;
                }
            }
            if (this.tick >= this.TICK_CHECK) {
                this.checkTicks();
            }
        }
        console.log(base_1.base.routers[3].connected_routers_list);
    };

    rout.prototype.generateLSP = function () {
        this.sequence = this.sequence + 1;
        this.ori_packet = new lsp_1.LSP();
        this.ori_packet.router_id = this.id;
        this.ori_packet.sequence = this.sequence;
        this.ori_packet.list = {};
        this.ori_packet.TTL = 10;
        for (var prop in this.connected_routers_list) {
            this.ori_packet.list[prop] = {};
            this.ori_packet.list[prop].cost = this.connected_routers_list[prop];
            this.ori_packet.list[prop].network = base_1.base.routers[prop].network;
        }
    };

    rout.prototype.checkTicks = function () {
        for (var prop in this.connected_routers_list) {
            if (this.recieved_list[this.tick][prop] == undefined && this.recieved_list[this.tick - 1][prop] == undefined) {
                this.setCostInfinite(prop);
            }
            if (this.recieved_list[this.tick][prop] != undefined) {
                this.connected_routers_list[prop] = 1;
                if (this.connected_routers_list[prop] == Number.MAX_VALUE) {
                    this.connected_routers_list[prop] = base_1.base.routers[prop].connected_routers_list[this.id];
                }
            }
        }
    };
    rout.prototype.setCostInfinite = function (router_id) {
        this.connected_routers_list[router_id] = Number.MAX_VALUE;
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

    rout.prototype.piecePuzzleTogether = function (packet) {
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
        for (var i in s_1.SPF.D) {
            if (this.routing_table[base_1.base.routers[i].network] == undefined) {
                this.routing_table[base_1.base.routers[i].network] = {};
            }
            if (typeof s_1.SPF.D[i] != "number") {
                s_1.SPF.D[i] = parseInt(s_1.SPF.D[i]);
            }
            if (typeof base_1.base.routers[i].network_cost != "number") {
                base_1.base.routers[i].network_cost = parseInt(base_1.base.routers[i].network_cost);
            }
            this.routing_table[base_1.base.routers[i].network].cost = s_1.SPF.D[i] + base_1.base.routers[i].network_cost;
            this.routing_table[base_1.base.routers[i].network].outgoing_link = s_1.SPF.outgoing_link[i][1];
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
        var new_packet = new lsp_1.LSP();
        for (var i in packet) {
            new_packet[i] = packet[i];
        }
        return new_packet;
    };
    return rout;
}());
exports.rout = rout;