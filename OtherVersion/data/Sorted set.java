 import java.util.*;
  
  class BSTNode{
      BSTNode left, right;
      int data;
  
      public BSTNode(){
          left = null;
          right = null;
          data = 0;
      }
      public BSTNode(int n){
          left = null;
          right = null;
          data = n;
      }
      public void setLeft(BSTNode n){
          left = n;
      }
      public void setRight(BSTNode n){
          right = n;
      }
      public BSTNode getLeft(){
          return left;
      }
      public BSTNode getRight(){
          return right;
      }
      public void setData(int d){
          data = d;
      }
      public int getData(){
          return data;
      }     
  }
  
  class BST{
      private BSTNode root;
      public BST(){
          root = null;
      }
      public void insert(int data){
          root = insert(root, data);
      }
      private BSTNode insert(BSTNode node, int data){
          if (node == null)
              node = new BSTNode(data);
          else
          {
              if (data <= node.getData())
                  node.left = insert(node.left, data);
              else
                  node.right = insert(node.right, data);
          }
          return node;
      }
      public boolean search(int val){
          return search(root, val);
      }
      private boolean search(BSTNode r, int val){
          boolean found = false;
          while ((r != null) && !found)
          {
              int rval = r.getData();
              if (val < rval)
                  r = r.getLeft();
              else if (val > rval)
                  r = r.getRight();
              else
              {
                  found = true;
                  break;
              }
              found = search(r, val);
          }
          return found;
      }
      
      public void inorder(){
          inorder(root);
      }
      private void inorder(BSTNode r){
          if (r != null)
          {
              inorder(r.getLeft());
              System.out.print(r.getData() +" ");
              inorder(r.getRight());
          }
      }

  public void preorder(){
      preorder(root);
  }
  private void preorder(BSTNode r){
      if (r != null)
      {
          System.out.print(r.getData() +" ");
          preorder(r.getLeft());             
          preorder(r.getRight());
      }
  	}
  }
 
  public class Sorted{
      public static void main(String[] args){                 
    	  Scanner scan = new Scanner(System.in);
    	  BST bst = new BST();
    	  char ch;
         do    {
             System.out.println("\nBinary Search Tree Operations");
             System.out.println("1. insert ");
             System.out.println("2. search");
             int choice = scan.nextInt();            
             switch (choice)
             {
             case 1 : 
                 System.out.println("Enter integer element to insert");
                 bst.insert( scan.nextInt() );                     
                 break;                                              
             case 2 : 
                 System.out.println("Enter integer element to search");
                 String ans = "";
                 if (bst.search(scan.nextInt()) == true){
               	 ans = "Yes";
                 }else{
               	  ans = "No";
                 }
                 System.out.println("\n"+ans);
                 break;                                                   
             default : 
                 System.out.println("Wrong Entry \n ");
                 break;   
             }
             System.out.print("\nPre order : ");
             bst.preorder();
             System.out.print("\nIn order : ");
             bst.inorder();
             ch='y';
         } while (ch != 'n');     
     }
  }