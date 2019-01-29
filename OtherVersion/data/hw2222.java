import java.util.*;

public class hw2222 {

    private static final String q = "quit";
    private static ArrayList<String> name = new ArrayList<String>();
    private static ArrayList<Double> number = new ArrayList<Double>();
    private static Stack<Double> stack = new Stack<Double>();

    public static void main(String[] args) {
        System.out.println("Input both operators and numbers with one space: ");
        Scanner in = new Scanner(System.in);
        System.out.print("> ");
        while(in.hasNextLine()) {
            String get = in.nextLine();
            guess(get);
            System.out.print("> ");
        }
        in.close();
    }

    public static void guess(String get) {

        if(get.equals(q)) {
            System.exit(0);
        } else {
            calc(get);
        }
    }

    public static void calc(String get) {
        ArrayList<String> input = new ArrayList<String>();
        Collections.addAll(input, get.trim().split(" "));
        input.removeAll(Arrays.asList(null, ""));
        
        if(input.size() == 1) {
            double x = getNumber(get);
            if(!Double.isNaN(x)){
            	System.out.println("\t" + x);
            }
            return;
        }
        
        for(int i = 0; i < input.size(); i++) {
            String n = input.get(i);
            if(oper(n)) {
                if(stack.size() > 1) {
                    stack.push(inside(n));
                } else {
                    System.out.println("\tinValid!");
                    return;
                }
            } else {
                double x = getNumber(n);
                if(!Double.isNaN(x)) {
                    stack.push(x);
                } else {
                    stack.clear();
                    return;
                }
            }
        }
        double result = stack.pop();
        if(stack.size() > 0) {
            System.out.println("\tinValid!");
            stack.clear();
            return;
        }

      
        System.out.println("\t" + result);
    }

    public static boolean oper(String get) {
        char c = get.charAt(0);
        return c == '+' || c == '-' || c == '/' || c == '*'|| c == '%' || c == '^';
    }
    
    public static double inside(String get) {
        char ab = get.charAt(0);
        double a = stack.pop();
        double b = stack.pop();
        
        switch (ab) {
            case '+':
                return b + a;
            case '-':
                return b - a;
            case '*':
                return b * a;
            case '/':
                return b / a;
            case '%':
            	return b % a;
            case '^':
            	return Math.pow(b, a);
            default:
                return Double.NaN;
        }
    }

    public static double getNumber(String get) {
        try {
            return Double.parseDouble(get);
        } catch (NumberFormatException ex) {
            try {
                return number.get(name.indexOf(get));
            } catch (Exception e) {
                System.out.printf("\t%inValid \n", get);
                return Double.NaN;
            }
        }
    }
}

