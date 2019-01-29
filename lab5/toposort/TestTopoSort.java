public class TestTopoSort {
    public static void main(String[] args) {
        String graphFilePath;
        if(args.length == 0)
            graphFilePath = "./infile.dat";
        else
            graphFilePath = args[0];
        
        String graphContent = FileUtil.read(graphFilePath, null);
        DirectedGraph directedGraph = new DirectedGraph(graphContent);
        try{
            directedGraph.topoSort();
        }catch(Exception e){
            System.out.println("graph has circle");
            e.printStackTrace();
        }
    }
}