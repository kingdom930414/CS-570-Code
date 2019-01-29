public class TestAMWGraph {
    public static void main(String args[]) {
        int n=4,e=4;
        String labels[]={"V1","V1","V3","V4"};
        AMWGraph graph=new AMWGraph(n);
        for(String label:labels) {
            graph.insertVertex(label);
        }
       
        graph.insertEdge(0, 1, 2);
        graph.insertEdge(0, 2, 5);
        graph.insertEdge(2, 3, 8);
        graph.insertEdge(3, 0, 7);

        System.out.println("node number："+graph.getNumOfVertex());
        System.out.println("edge number："+graph.getNumOfEdges());

        graph.deleteEdge(0, 1);
        System.out.println("delete<V1,V2>edge...");
        System.out.println("node number："+graph.getNumOfVertex());
        System.out.println("edge number："+graph.getNumOfEdges());
    }
}