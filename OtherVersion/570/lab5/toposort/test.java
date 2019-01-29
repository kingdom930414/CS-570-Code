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