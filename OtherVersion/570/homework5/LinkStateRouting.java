package cs570hw5;

import java.util.regex.Pattern;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.BufferedReader;
import java.util.*;

public class LinkStateRouting {

    public static void main(String[] args) throws IOException {
        NetWork netWork = new NetWork();
        Scanner input = new Scanner(System.in);
        boolean isContinue = true;

        System.out.println("Network all set.");
        System.out.println("Would you like to continue?(C/Q)");
        while (isContinue) {
        	//input = input.nextLine().replace
        	//String[] user_input = input.nextLine().split("\\s+");
            String[] user_input = input.nextLine().replace(" ", "").split("");
            switch (user_input[0].toLowerCase()) {
                case "c":

                    netWork.con();
                    break;
                case "q":
                    input.close();
                    System.exit(0);
                    break;
                case "p":
             
                    if (user_input.length == 1) {
                        System.out.println("Need more arguments.Please try again.");
                        break;
                    }
                    netWork.con();
                    netWork.con();
                    netWork.printRoutingTable(user_input[1]);
                    break;

                case "s":

                    if (user_input.length == 1) {
                        System.out.println("Need more arguments.Please try again.");
                        break;
                    }
                    netWork.con();
                    netWork.con();
                    netWork.shutDownRouter(user_input[1]);
                    break;
                case "t":

                    if (user_input.length == 1) {
                        System.out.println("Need more arguments.Please try again.");
                        break;
                    }
                    netWork.con();
                    netWork.con();
                    netWork.startUpRouter(user_input[1]);
                    break;
                default:
                    System.out.println("Wrong Command, try again.");
            }
            System.out.println("Continue(C)/Quit(Q)/Shut Down(S)/Start Up(T)/Print(P)?");
            System.out.println("command S/T/P should be followed with a router ID, separated by at least one space.");
        }
    }

}

class LinkEdge {
    private HashMap<String, Router> routerLinkTable;
    private int router_id;
    private int sequence;
    private String status = "start";
    private HashMap<String, Router> router_network;
    private int network_cost;
    private int tick;
    private HashMap<String, Router> router_connect_list;
    private String packets_copy;
    private String pkt_node;
    String source;
    String dest;
    int cost;
    String network;

    public LinkEdge(String source, String dest, int cost, String network) {
        this.source = source;
        this.dest = dest;
        this.cost = cost;
        this.network = network;
    }
    
    public int getCost(){
    	return network_cost;
    }
    
    public HashMap<String, Router> getConnect(){
    	return router_connect_list;
    }
    
    public HashMap<String, Router> getNetWork(){
    	return router_network;
    }
    
    public HashMap<String, Router> getLink(){
    	return routerLinkTable;
    }
    
    public int get_id(){
    	return router_id;
    }
    
    public int get_sequence(){
    	return sequence;
    }

}

class NetWork {
	
    private Map<String, Router> network;

    public NetWork() throws IOException {
        readFile();
    }

    private void readFile() throws IOException {
        network = new TreeMap<>();
        File file = new File("infile.dat");
        try (FileReader input_file = new FileReader(file);
             BufferedReader buffer_input = new BufferedReader(input_file)) {
            String input_line;
            String router_id = "";
            String router_name = "";
            Map<String, Integer> router_connect = new TreeMap<>();
            while ((input_line = buffer_input.readLine()) != null) {
                if (Pattern.matches("\\s", input_line.charAt(0) + "")) {
                    String[] strings = input_line.split("\\s+");
                    int distance;
                    if (strings.length == 2) distance = 1;
                    else distance = Integer.parseInt(strings[2]);
                    router_connect.put(strings[1], distance);
                } else {
                    if (!"".equals(router_id)) {
                        network.put(router_id, new Router(router_id, router_name, router_connect));
                    }
                    router_connect = new TreeMap<>();
                    String[] strings = input_line.split("\\s+");
                    router_id = strings[0];
                    router_name = strings[1];
                    router_connect.put(router_id, 0);
                }
            }
            if (!"".equals(router_id))
                network.put(router_id, new Router(router_id, router_name, router_connect));
        }
    }

    public void shutDownRouter(String router_id) {
        Router router = network.get(router_id);
        if (router == null) {
            System.out.println("Invalid router ID. Pls Try Again.");
            return;
        }
        router.shutDown();
        System.out.println("Router " + router_id + " has been Shut Down.");
        network.put(router_id, router);
    }

    public void startUpRouter(String router_id) {
        Router router = network.get(router_id);
        if (router == null) {
            System.out.println("Invalid router ID. Pls Try Again.");
            return;
        }
        router.startUp();
        System.out.println("Router " + router_id + " has been Start up.");
        network.put(router_id, router);
    }

    public void con() {
        for (String router_id : network.keySet()) {
            Router router = network.get(router_id);
            LinkStatePackage linkStatePackage = router.originatePacket();
            forward(linkStatePackage);
        }
    }

    private void forward(LinkStatePackage linkStatePackage) {
        if (linkStatePackage == null) return;
        for (String router_id : linkStatePackage.getReceiver()) {
            Router router = network.get(router_id);
            LinkStatePackage newLinkStatePackage = router.receivePacket(linkStatePackage, linkStatePackage.getForwardBy());
            network.put(router_id, router);
            forward(newLinkStatePackage);
        }
    }

    public void printRoutingTable(String router_id) {
        Router router = network.get(router_id);
        if (router == null) {
            System.out.println("Invalid router ID. Pls Try Again.");
            return;
        }

        //router.shutDown();
        if(router.on == false){
        	System.out.println("this router"+  router_id +"is shut down");
        	return;
        }

        Map<String, String> routing_table = router.getRoutingTable();

        System.out.println("The routing table for " + router_id + " is:");

        for (String r : routing_table.keySet()) {
            System.out.println(network.get(r).getNetworkName() + ", " + routing_table.get(r));
        }
    }
}

class Router {
    private String id;
    private String networkName;
    public boolean on;
    private Map<String, Integer> connections;
    private Map<String, Integer> tickCounter;
    private Map<String, String> routing_table;
    private Map<String, Map<String, Integer>> router_network;
    private int router_sequence;
    private Map<String, Integer> sequenceNumberMap;

    public Router(String id, String networkName, Map<String, Integer> connections) {
        on = true;
        this.id = id;
        this.networkName = networkName;
        router_sequence = 0;
        this.connections = connections;
        tickCounter = new HashMap<>();
        router_network = new HashMap<>();

        // init private network and tick counter.
        for (String router_id : connections.keySet()) {
            // init tickCounter, all set 0;
            tickCounter.put(router_id, 0);

            // init the cost from the reverse way.
            if (router_id.equals(id)) continue;
            Map<String, Integer> networkCost = new HashMap<>();
            networkCost.put(id, connections.get(router_id));
            router_network.put(router_id, networkCost);
        }
        router_network.put(id, connections);

        sequenceNumberMap = new HashMap<>();
    }
    	
    public String getNetworkName() {
        return networkName;
    }

    public String getId() {
        return id;
    }

    public Map<String, String> getRoutingTable() {
        return routing_table;
    }

    public void shutDown() {
        on = false;
    }

    public void startUp() {
        for (String router : tickCounter.keySet())
            tickCounter.put(router, 0);
        on = true;
    }

    public boolean check(){
    	return on;
    }

    public LinkStatePackage receivePacket(LinkStatePackage linkStatePackage, String forwardRouterId) {
        // if closed return null;
        if (!on) return null;
        if (linkStatePackage.getOriginate().equals(id)) return null;


        tickCounter.put(linkStatePackage.getOriginate(), 0);

        int sn = linkStatePackage.getSequenceNumber();
        if (sequenceNumberMap.get(linkStatePackage.getOriginate()) != null && sequenceNumberMap.get(linkStatePackage.getOriginate()) >= sn)
            return null;

        sequenceNumberMap.put(linkStatePackage.getOriginate(), sn);

        linkStatePackage.visit();

        Map<String, Map<String, Integer>> network = linkStatePackage.getPrivateNetwork();
        for (String routerA : network.keySet()) {
            if (router_network.containsKey(routerA)) {
                Map<String, Integer> costs = router_network.get(routerA);
                costs.put(routerA, 0);
                router_network.put(routerA, costs);
            } else {
                Map<String, Integer> costs = new HashMap<>();
                costs.put(routerA, 0);
                router_network.put(routerA, costs);
            }
            for (String routerB : network.get(routerA).keySet()) {
                Map<String, Integer> costs;
                if (router_network.containsKey(routerA)) {
                    costs = router_network.get(routerA);
                } else {
                    costs = new TreeMap<>();
                }
                costs.put(routerB, network.get(routerA).get(routerB));
                router_network.put(routerA, costs);
            }
        }

        generateRoutingTable();

        if (linkStatePackage.getTtl() <= 0) return null;
        List<String> receivers = new ArrayList<>();


        for (String router : router_network.get(id).keySet()) {
            if (router_network.get(id).get(router) != null) receivers.add(router);
        }
        linkStatePackage.setReceiver(receivers);
        linkStatePackage.setForwardBy(id);
        return linkStatePackage;
    }

    public LinkStatePackage originatePacket() {
        // if shut down ,return null;
        if (!on) return null;
        router_sequence++;
        
        for (String router_id : connections.keySet()) {
            if (router_id.equals(id)) continue;
            int ticks = tickCounter.get(router_id) + 1;
            tickCounter.put(router_id, ticks);
            if (ticks >= 2) {
                Map<String, Integer> disconnectedRouterCosts = router_network.get(router_id);
                for (String routerId1 : disconnectedRouterCosts.keySet()) {
                    disconnectedRouterCosts.put(router_id, null);
                    Map<String, Integer> networkCost = router_network.get(routerId1);
                    networkCost.put(router_id, null);
                    router_network.put(routerId1, networkCost);
                }
                router_network.put(router_id, disconnectedRouterCosts);
            }
        }

        List<String> receivers = new ArrayList<>();
        for (String router : router_network.get(id).keySet()) {
            if (router_network.get(id).get(router) != null) receivers.add(router);
        }
        return new LinkStatePackage(id, router_sequence, router_network, receivers);
    }
    
    private void generateRoutingTable() {
        Set<String> v = new HashSet<>(router_network.keySet());
        Map<String, Integer> router_distance = new HashMap<>();
        Map<String, List<String>> path = new HashMap<>();

        for (String router_id : router_network.get(id).keySet()) {
            
            router_distance.put(router_id, router_network.get(id).get(router_id));
            
            if (router_distance.get(router_id) != null) {
                List<String> route = new ArrayList<>();
                route.add(router_id);
                path.put(router_id, route);
            }
        }

        v.remove(id);
        while (!v.isEmpty()) {
            // find out the nearest v in V.
            String nearest = null;
            Integer nearestDistance = null;
            for (String router : router_distance.keySet()) {
                if (!v.contains(router)) continue;
                Integer d = router_distance.get(router);
                if (d == null) continue;
                if (nearestDistance == null || nearestDistance > d) {
                    nearestDistance = d;
                    nearest = router;
                }
            }

            if (nearest == null) break;

            v.remove(nearest);

            Map<String, Integer> subDistance = router_network.get(nearest);
            int distanceTo = router_distance.get(nearest);
            List<String> pathTo = path.get(nearest);
            for (String router : subDistance.keySet()) {
                if (subDistance.get(router) == null) continue;
                Integer currentDistance = router_distance.get(router);
                Integer newDistance = distanceTo + subDistance.get(router);
                if (currentDistance == null || currentDistance > newDistance) {
                   
                    router_distance.put(router, newDistance);
                    List<String> newPath = new ArrayList<>(pathTo);
                    newPath.add(router);
                    path.put(router, newPath);
                }
            }
        }
       
        routing_table = new HashMap<>();
        for (String router : path.keySet()) {
            routing_table.put(router, path.get(router).get(0));
        }
    }
}

class LinkStatePackage {
    private String originate;
    private int router_sequence;
    private List<String> receiver;
    private String router_outlink;
    private int ttl;
    private Map<String, Map<String, Integer>> router_network;
    

    public LinkStatePackage(String originate, int router_sequence, Map<String, Map<String, Integer>> router_network, List<String> receiver) {
        this.originate = originate;
        router_outlink = originate;
        this.router_sequence = router_sequence;
        this.router_network = router_network;
        ttl = 10;
        this.receiver = receiver;
    }

    public String getForwardBy() {
        return router_outlink;
    }

    public void setForwardBy(String router_outlink) {
        this.router_outlink = router_outlink;
    }

    public void setReceiver(List<String> receiver) {
        this.receiver = receiver;
    }

    public int getTtl() {
        return ttl;
    }

    public int getSequenceNumber() {
        return router_sequence;
    }

    public Map<String, Map<String, Integer>> getPrivateNetwork() {
        return router_network;
    }

    public void visit() {
        ttl--;
    }

    public List<String> getReceiver() {
        return receiver;
    }

    public String getOriginate() {
        return originate;
    }

}