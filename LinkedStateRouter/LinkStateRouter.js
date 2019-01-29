const fs= require('fs');
const readline = require("readline-sync");

class Lsp{
    constructor(id,seqNum,network,receiver,ttl=10){
        this.id=id;
        this.seqNum=seqNum;
        this.network=network;
        this.ttl = ttl;
        this.receiver =receiver;
    }
    handled(){
        this.ttl--;
    }
}
const network = {};
const addRouter = function(id,name,connections){
    var router = new Router();
    router.Router(id,name,connections);
    network[id]= router;
}
const getRouter = function(id){
    //console.log(network)
    var router = new Router();
    // console.log("???????")
    // console.log(network[id])
    router = network[id];
    return router;
}
const shutdown = function(id){
    var router = getRouter(id);
    if(router!=null)
    router.shutDown();
    console.log("Router "+id+" has been shut down.\n")
    network[id]= router;
}
const startup =function(id){
    var router = new Router();
    router=getRouter(id);
    if(router!= null&&router!=undefined)
        router.startUp();
    console.log("Router "+id+" has been start up.\n")
    network[id]=router;
    runTick();
}
const runTick = function(){
     console.log(network)
    //Object.getOwnPropertyNames(network).forEach(function(val, idx, array) {
    for(var val in network){
    //console.log(val+"---"+getRouter(val))
        var router= new Router();
        router= getRouter(val);
        var lsp = new Lsp();
        // console.log("routerId   "+val)
        if(router!=null&&router!=undefined)
            lsp=router.originatePacket();
        else
            lsp = null;
        forward(lsp);
    }
}
const forward = function(lsp){
    if(lsp == null||lsp == undefined){
        return;
    }
    Object.getOwnPropertyNames(lsp.receiver).forEach(function(val, idx, array) {
        var router = new Router();
        var routerId = lsp.receiver[val];
        //console.log("routerId"+routerId)
        router = getRouter(routerId);
        var newLSP = new Lsp();
        if(router!=undefined&&router!=null)
            newLSP = router.receivePacket(lsp);
        else
            newLSP = null;
        
        if(routerId!=undefined&&router!=undefined)
        network[routerId]=router;
        forward(newLSP);
    });
}
    
const print = function(id){
    var router = getRouter(id);
    if(router == undefined||router == null){
        console.log("Invalid router ID. Please try again.\n");
        return;
    }
    router.print();
}




class Router{
    constructor(){
        this.started = true;
        this.id = "";
        this.name = "";
        this.connections = {};
        this.tickRouterMap = {};
        this.routingTable = {};
        this.networkMap = {};
        this.seqNum;
        this.seqNumMap = {};
    }

    Router(id,name,connections){
        this.started = true;
        this.id = id;
        this.name = name;
        this.seqNum = 0;
        this.connections = connections;
        this.tickRouterMap = {};
        this.routingTable = {};
        this.networkMap = {};
        this.seqNumMap = {};

        
        for(var val in this.connections){

            this.tickRouterMap[val]=0;
            if(val!=this.id){
                var networkCost = {};
                //console.log('netwirkMap '+val+":"+t.networkMap[val])
                networkCost[this.id]=this.connections[val];
                this.networkMap[val]=networkCost;
            }
        }
        this.networkMap[this.id]=this.connections;
        this.seqNumMap = {};
    }
    print(){
        if(!this.started){
            console.log("Router has been shut down. Please try again.")
            return;
        }
        console.log("The routing table for "+this.id +" is :")
        var t = this;
        Object.getOwnPropertyNames(this.routingTable).forEach(function(val, idx, array) {
            //console.log(network[val]+","+t.routingTable[val]);
            console.log(network[val].name+","+t.routingTable[val]);
        });
    }
    shutDown(){
        this.started = false;
    }
    startUp(){
        console.log(this.tickRouterMap)
        for(var val in this.tickRouterMap) {
            this.tickRouterMap[val]=0;
            var costs = this.networkMap[val];
            if(costs != null&&costs != undefined){
                for(var val1 in this.tickRouterMap){
                    if(val1==this.id){
                        costs[val1]=0;
                    }
                }
            }
        }
        this.started = true
    }
    receivePacket(lsp){
        if(!this.started)
            return null;

        var lspId=lsp.id;
        //console.log("?????"+lsp.id)
        if(lspId==this.id){
           // console.log("oooooooooooooooooooooooooooo")
            return null;
        }
            
        this.tickRouterMap[lspId]=0;
        var packetSeqNum =lsp.seqNum;
        if(this.seqNumMap[lspId]!= null&& this.seqNumMap[lspId]>=packetSeqNum){
            return null;
        }
        this.seqNumMap[lspId]=packetSeqNum;
        lsp.handled();
        this.updateCost(lsp.network);
        this.genRoutingTable();

        if(lsp.ttl<=0)
        return null;
        var receiver = this.genReceivers();
        return new Lsp(lsp.id,lsp.seqNum,lsp.network,receiver,lsp.ttl)
    }
    updateCost(network){
        var t=this;
        Object.getOwnPropertyNames(network).forEach(function(val, idx, array) {
            var costs = {};
            var tof =false;
            for(var i in t.networkMap){
                if(i==val)
                tof=true;
            }
            //console.log(tof)
            if(tof){
                costs = t.networkMap[val];
                //console.log(costs)
            }
            costs[val]=0;
            t.networkMap[val]=costs;

            var networkCostMap = network[val];
            var t1=t;
            // console.log("---------------------")
            // console.log(networkCostMap)
            Object.getOwnPropertyNames(networkCostMap).forEach(function(val1, idx, array) {
                costs = t1.networkMap[val];
                if(val1!=t1.id||networkCostMap[val1]!=null){
                    costs[val1]=networkCostMap[val1];
                    //console.log(networkCostMap[val1])
                }
                t1.networkMap[val]=costs;
            });
            // console.log("=====================")
            // console.log(t.networkMap)
        });
    }
    genReceivers(){
        var receivers = [];
        var map = this.networkMap[this.id];
        Object.getOwnPropertyNames(map).forEach(function(val, idx, array) {
            receivers.push(val);
        });
        return receivers;
    }

    genDisMap(){
        var disMap = {};
        var map = this.networkMap[this.id];
        Object.getOwnPropertyNames(map).forEach(function(val, idx, array) {
            if(map[val]!=undefined&&map[val]!=null){
                disMap[val]=map[val];
            }
        });
        return disMap;
    }
    genPathMap(){
        var pathMap = {};
        var map = this.networkMap[this.id];
        // console.log("+_+_+_+_+_+_++")
        // console.log(this.networkMap)
        Object.getOwnPropertyNames(map).forEach(function(val, idx, array) {
            // console.log("+_+_+_+_+_+_++")
            // console.log(map)
            if(map[val]!=undefined&&map[val]!=null){
                var path = [];
                path.push(val);
                pathMap[val]=path;
            }
        });
        return pathMap;
    }
    findNearest(distanceMap,filter){
        var  nearest = null;
        var nearestDistance = null;
        Object.getOwnPropertyNames(distanceMap).forEach(function(val, idx, array) {
            if(containsValue(filter,val)||distanceMap[val]==null)
                return;
            var d = distanceMap[val];
            if(nearestDistance == null|| nearestDistance > d){
                nearestDistance = d;
                nearest = val;
            }
        });
        return nearest;
    }
    updateDistanceMap(curRouter,pathMap,distanceMap){
        var distanceTo = distanceMap[curRouter];
        var pathTo = pathMap[curRouter];
        var subDisMap = this.networkMap[curRouter];
        Object.getOwnPropertyNames(subDisMap).forEach(function(val, idx, array) {
            if(subDisMap[val]==undefined)
                return;
            var curDis = distanceMap[val];
            var newDis = distanceTo + subDisMap[val];
            if(curDis==null||curDis == undefined|| curDis > newDis){
                distanceMap[val]=newDis;

                var newPath = [];
                for(var i in pathTo){
                    newPath[i]=pathTo[i];
                }
                newPath.push(val);
                pathMap[val]=newPath;
            }
        });
    }
    genRoutingTable(){
        var allRouterSet = new Set();
        //console.log(this.networkMap)
        Object.getOwnPropertyNames(this.networkMap).forEach(function(val, idx, array) {
            allRouterSet.add(val);
        });
        //console.log(allRouterSet)
        allRouterSet.delete(this.id);
        //console.log(allRouterSet)
        var distance = this.genDisMap();
        var pathMap = this.genPathMap();

        while(allRouterSet.length!=0){
            var nearest = this.findNearest(distance,allRouterSet);
            if(nearest ==null||nearest == undefined){
                break;
            }
            allRouterSet.delete(nearest);
            // console.log(allRouterSet)
            // console.log("????"+nearest)
            this.updateDistanceMap(nearest,pathMap,distance);
        }
        this.routingTable = {};
        var t= this;
        Object.getOwnPropertyNames(pathMap).forEach(function(val, idx, array) {
            // console.log("++++++++++++++++++++")
            // console.log(t.routingTable[val])
            t.routingTable[val]=pathMap[val][0];
            // console.log("--------------------")
            // console.log(t.routingTable[val])
            // console.log("++++++++++++++++++++")
        });
    }
    countTicks(){
        //  console.log("////////////////////////")
        //  console.log(this.connections)
        //Object.getOwnPropertyNames(this.connections).forEach(function(val, idx, array) {
        for(var val in this.connections){
            if(val==this.id){
                continue;
            }     
            var ticks = this.tickRouterMap[val]+1;
            this.tickRouterMap[val]=ticks;
            //console.log(ticks)
           // console.log(this.networkMap[val])
            if(ticks>=2){
                var stopedRouterCost = this.networkMap[val];
                // stopedRouterCost[val]=null;
                for(var val1 in stopedRouterCost){
                    var networkCost = this.networkMap[val1];
                    // console.log("_______________________")
                    // console.log(val+"   "+val1)
                    // console.log(networkCost)
                    networkCost[val]=null;
                }
            }
        }
    }
    generatePacket(){
        this.seqNum++;
        var receiviers = this.genReceivers();
        var lsp = new Lsp(this.id,this.seqNum,this.networkMap,receiviers);
        return lsp;
    }
    originatePacket(){
        if(!this.started)
            return null;
        this.countTicks();
        var lsp =new Lsp();
        lsp= this.generatePacket();
        this.genRoutingTable();
       // console.log(lsp.network)
        var des = "";
        Object.getOwnPropertyNames(lsp.network).forEach(function(val, idx, array) {
            //console.log(val+"  "+idx+" "+array)
            //console.log(lsp.network[val])
            var curNetwork = lsp.network[val];
            if(curNetwork!=null){
                Object.getOwnPropertyNames(curNetwork).forEach(function(val1, idx, array) {
                    des = des +" "+val +"->"+val1+"="+curNetwork[val1];
                });
            }
        });
        //console.log("lsp from "+des)
        return lsp;
    }
}
function containsValue(hash, value) {
    var flag = true;
    hash.forEach(i=>{
        if (i == value) {
            flag = false;
        }
    })
    return flag;
}

function main(){
    console.log("Network start,please input your command.\n")
    console.log("-----------------------------------------")
    readfile();
    while(true){
         var order =  readline.question("Please enter C to continue,P to print,Q to quit,S to shutdown, and T to start.\n");
        // var order ="s 1";
        var flag=execute(order);
        if(flag!=-1)
            continue;
        else
            break;
    }
}
function readfile(){
    var file = fs.readFileSync('infile.dat',"utf-8")
    console.log(file)
    var inputArr = file.split("\n");
    //console.log(inputArr)
    var connections= {};
    var routerId = null;
    var routerName = null;
    for(var i=0;i<inputArr.length;i++){
        var s =inputArr[i];
        var firstString = s.substring(0,1);
        if(firstString==' '){
            var rets = s.split(' ');
            var cost = 1;
            if(rets.length>1){
                cost =parseInt(rets[1]);
            }
            connections[rets[1]]=cost;

        }else{
            if(routerId!=null&&routerId!=undefined){
                //console.log(routerId+" "+routerName+" "+connections)
                addRouter(routerId,routerName,connections);
                connections= {};
            }
            var rets = s.split(" ");
            routerId = rets[0];
            routerName = rets[1];
        }
    }
    if(routerId!=null&&routerId!=undefined){
        addRouter(routerId,routerName,connections);
        connections = {};
    }
    runTick();

}
function execute(order){
    var orderArgs=order.trim().split(" ");
    var instruct = orderArgs[0].toUpperCase();
    var routerId = orderArgs[1];
    switch(instruct){
        case 'C':
            runTick();
            break;
        case 'Q':
            console.log("LinkedStateRouring exit.")
            return -1;
        case 'P':
            if(orderArgs.length<= 1){
                console.log("'P' should followed by the router's id number!\n")
                return;
            }
            print(routerId);
            break;
        case 'S':
            if(orderArgs.length<= 1){
                console.log("'S' should followed by the router's id number!\n")
                return;
            }
            shutdown(routerId);
            runTick();
            runTick();
            break;
        case 'T':
            if(orderArgs.length<= 1){
                console.log("'T' should followed by the router's id number!\n")
                return;
            }
            startup(routerId);
            break;
        default:
            console.log("Invalid instruct!\n")
    }

}

main();