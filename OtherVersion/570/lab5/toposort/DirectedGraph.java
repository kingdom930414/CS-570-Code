import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;

/*
 * 用来实现拓扑排序的有向无环图
 */
public class DirectedGraph {

    private class Vertex{
        private String vertexLabel;
        private List<Edge> adjEdges;
        private int inDegree;

        public Vertex(String verTtexLabel) {
            this.vertexLabel = verTtexLabel;
            inDegree = 0;
            adjEdges = new LinkedList<Edge>();
        }
    }

    private class Edge {
        private Vertex endVertex;

        
        public Edge(Vertex endVertex) {
            this.endVertex = endVertex;
        }
    }

    private Map<String, Vertex> directedGraph;

    public DirectedGraph(String graphContent) {
        directedGraph = new LinkedHashMap<String, DirectedGraph.Vertex>();
        buildGraph(graphContent);
    }

    private void buildGraph(String graphContent) {
        String[] lines = graphContent.split("\n");
        Vertex startNode, endNode;
        String startNodeLabel, endNodeLabel;
        Edge e;
        for (int i = 0; i < lines.length; i++) {
            String[] nodesInfo = lines[i].split(",");
            startNodeLabel = nodesInfo[1];
            endNodeLabel = nodesInfo[2];
            startNode = directedGraph.get(startNodeLabel);
            if(startNode == null){
                startNode = new Vertex(startNodeLabel);
                directedGraph.put(startNodeLabel, startNode);
            }
            endNode = directedGraph.get(endNodeLabel);
            if(endNode == null){
                endNode = new Vertex(endNodeLabel);
                directedGraph.put(endNodeLabel, endNode);
            }
            
            e = new Edge(endNode);
            startNode.adjEdges.add(e);
            endNode.inDegree++;
        }
    }

    public void topoSort() throws Exception{
        int count = 0;
        
        Queue<Vertex> queue = new LinkedList<>();

        Collection<Vertex> vertexs = directedGraph.values();
        for (Vertex vertex : vertexs)
            if(vertex.inDegree == 0)
                queue.offer(vertex);
        
        while(!queue.isEmpty()){
            Vertex v = queue.poll();
            System.out.print(v.vertexLabel + " ");
            count++;
            for (Edge e : v.adjEdges) 
                if(--e.endVertex.inDegree == 0)
                    queue.offer(e.endVertex);
        }
        if(count != directedGraph.size())
            throw new Exception("Graph has circle");
    }
}