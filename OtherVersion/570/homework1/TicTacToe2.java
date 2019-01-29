import java.io.*;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.swing.JOptionPane;


public class TicTacToe {
    private static final int ROWS = 0;
	private static final int COLS = 0;
	private final int MAX_BOARD_LIMIT = 999;

    public static void main(String[] args) {
        TicTacToe tic = new TicTacToe();
        tic.getstarted();
    }
    
    public void getstarted() {
    	try{
        	
        }catch(ArithmeticException e){
        	
        }

        Scanner sc = new Scanner(System.in);
        
        while(true) {
            System.out.println("Tic Tac Toe\n");
            System.out.println("Enter 1 to start a new game\n");
            System.out.println("Enter 2 to read a game from text\n");

            int choice = sc.nextInt();
            if(choice == 1) {
                System.out.println("Enter row(col), players number and win sequence(seperated by space)");
                int RowNum = sc.nextInt();
                int ColNum = RowNum;
                int playersNum = sc.nextInt();
                int winSequence = sc.nextInt();
                
                if (!isWrong(RowNum, ColNum, playersNum, winSequence)) {
                    System.out.println("Game exit");
                    return;
                }
                GameBoard board = new GameBoard(RowNum, ColNum, playersNum, winSequence);
                this.processGame(board, false);
            }

            if(choice == 2) {
                System.out.println("Read last game state ");
                GameBoard board = this.readFromFile();
                if(board == null || board.isEmptyGameBoard()) {
                    System.out.println("No last game state found, please start a new game");
                    continue;
                }
                board.drawBoard();
                this.processGame(board, true);
            }

            System.out.println("Play again? Y/N");
            String ch = sc.next();
            if(!ch.equals("Y") && !ch.equals("y")) {
                break;
            }
        }
        sc.close();
    }

    public boolean isWrong(int RowNum, int ColNum, int playersNum, int winSequence) {
        if(ColNum < 0 || RowNum < 0 || playersNum <= 0 || winSequence <= 0) {
            System.out.println("Error: Input parameter must larger than 0");
            return false;
        }

        if(ColNum > this.MAX_BOARD_LIMIT || RowNum > this.MAX_BOARD_LIMIT) {
            System.out.println("Error: Game board row or column exceed the max value");
            return false;
        }

        if(RowNum < winSequence && ColNum < winSequence) {
            System.out.println("Error: No winning condition available");
            return false;
        }

        if(playersNum * (winSequence - 1) + 1 > ColNum * RowNum) {
            System.out.println("Error: No winning condition available");
            return false;
        }

        return true;
    }

    private void processGame(GameBoard board, boolean resumeTag) {
        Scanner in = new Scanner(System.in);
        while(!board.isFull()) {
            for (int i = 0; i < board.getPlayerAmount(); i++) {
                if(resumeTag) {
                    i = board.getCurrentPlayer() + 1;
                    resumeTag = false;
                }

                System.out.println("Player " + (i + 1) + "'s  turn, input a row and col number to place symbol");
                int rowNum = in.nextInt();
                int colNum = in.nextInt();
                while (!board.drawStep(rowNum - 1, colNum - 1, i)) {
                    System.out.println("invalid row or col, try again");
                    rowNum = in.nextInt();
                    colNum = in.nextInt();
                }

                if(board.isWin()) {
                    break;
                }

                System.out.println("Save game for next time? Y/N");
                String ch = in.next();
                if(ch.equals("Y") || ch.equals("y")) {
                    this.writeToFile(board);
                    System.out.println("Save complete, game exit");
                    return;
                }
            }

            if(board.isWin()) {
                break;
            }
        }

        if(board.isFull()) {
            System.out.println("tie!! No Winner!");
        }
    }

    public void writeToFile(GameBoard board) {
        try {
            String fileName = System.getProperty("user.dir") + "/" + "gameState.txt";
            FileOutputStream fos = new FileOutputStream(fileName);
            ObjectOutputStream oos = new ObjectOutputStream(fos);
            oos.writeObject(board);
            oos.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public GameBoard readFromFile() {
        GameBoard board = new GameBoard();
        try {
            FileInputStream fi = new FileInputStream(new File("gameState.txt"));
            ObjectInputStream oi = new ObjectInputStream(fi);
            board = (GameBoard) oi.readObject();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        return board;
    }

    private static class GameBoard implements Serializable {
        private int row;
        private int col;
        private int playersNum;
        private int winSequence;
        private int[][] boardStatus;
        private char[] playSymbol;
        private int boardOccupied;
        private boolean isWin;
        private boolean emptyGameBoard;
        private int currentPlayer;

        public GameBoard() {
            this.emptyGameBoard = true;
        }

        public GameBoard(final int row, final int col, final int playersNum, final int winSequence) {
            this.row = row;
            this.col = col;
            this.playersNum = playersNum;
            this.winSequence = winSequence;
            this.boardOccupied = 0;
            this.isWin = false;
            this.emptyGameBoard = false;

            playSymbol = new char[playersNum + 1];
            playSymbol[0] = 'X';
            playSymbol[1] = 'O';
            playSymbol[playersNum] = ' ';
            int index = 2;
            for(int i = 2; i < playersNum + 2 && index < playersNum; i++) {
                if (i != 25 && i != 16) {
                    playSymbol[index++] = (char) ('A' + (i - 2));
                }
            }

            boardStatus = new int[row][col];
            for(int i = 0; i < row; i++) {
                for(int j = 0; j < col; j++) {
                    boardStatus[i][j] = playersNum;
                }
            }

            this.drawBoard();

        }

        public boolean isFull(){
            return this.boardOccupied == this.row * this.col;
        }

        public boolean isEmptyGameBoard() {
            return this.emptyGameBoard;
        }

        public void drawBoard(){
            StringBuilder line = new StringBuilder();
            for(int i = 0; i < this.col - 1; i++) {
                line.append("---+");
            }
            line.append("---");
            String lineMarker = line.toString();

            System.out.print("    ");
            for(int i = 0; i < this.col; i++) {
                System.out.print(" " + (i + 1) + "  ");
            }
            System.out.println();

            for(int i = 0; i < this.row; i++) {
                System.out.print(" " + (i + 1) + "  ");
                for(int j = 0; j < this.col; j++) {
                    System.out.print(" " + playSymbol[boardStatus[i][j]]);
                    if(j != this.col - 1) {
                        System.out.print(" |");
                    }
                }

                System.out.println();
                if(i != this.row - 1) {
                    System.out.println("    " + lineMarker);
                }
            }
            System.out.println();
        }

        public boolean drawStep(int i, int j, int player) {
            if(!isWrong(i, j, player)) {
                return false;
            }
            this.currentPlayer = player;
            this.boardStatus[i][j] = player;
            this.drawBoard();
            this.boardOccupied += 1;
            if(this.isWin(i, j, player)) {
                this.isWin = true;
                System.out.println("Player " + (player + 1)+ " is win");
            }

            return true;
        }

        public boolean isWin() {
            return this.isWin;
        }

        public int getPlayerAmount() {
            return this.playersNum;
        }

        private boolean isWrong(final int cx, final int cy, final int player) {
            return !(cx > this.row || cx < 0 || cy > this.col || cy < 0)
                    && this.boardStatus[cx][cy] == this.playersNum;
        }

        private boolean isWin(int cx, int cy, int player) {
            int count = 0;
            for(int i = cx; i >= 0; i--){
                if(this.boardStatus[i][cy] == player) {
                    count++;
                } else {
                    break;
                }
            }

            for(int i = cx; i < this.row; i++){
                if(this.boardStatus[i][cy] == player) {
                    count++;
                } else {
                    break;
                }
            }

            if(count - 1 >= this.winSequence) {
                return true;
            }

            count = 0;
            for(int i = cy; i >= 0; i--){
                if(this.boardStatus[cx][i] == player) {
                    count++;
                } else {
                    break;
                }
            }

            for(int i = cy; i < this.col; i++){
                if(this.boardStatus[cx][i] == player) {
                    count++;
                } else {
                    break;
                }
            }

            if(count - 1 >= this.winSequence) {
                return true;
            }

            count = 0;
            for(int i = cx, j = cy; i >= 0 && j >= 0; i--, j--){
                if(this.boardStatus[i][j] == player) {
                    count++;
                } else {
                    break;
                }
            }

            for(int i = cx, j = cy; i < this.row && j < this.col; i++, j++){
                if(this.boardStatus[i][j] == player) {
                    count++;
                } else {
                    break;
                }
            }

            if(count - 1 >= this.winSequence) {
                return true;
            }

            count = 0;
            for(int i = cx, j = cy; i >= 0 && j < this.col; i--, j++){
                if(this.boardStatus[i][j] == player) {
                    count++;
                } else {
                    break;
                }
            }

            for(int i = cx, j = cy; i < this.row && j >= 0; i++, j--){
                if(this.boardStatus[i][j] == player) {
                    count++;
                } else {
                    break;
                }
            }

            if(count - 1 >= this.winSequence) {
                return true;
            }

            return false;
        }

        public int getCurrentPlayer() {
            return this.currentPlayer;
        }

        @Override
        public String toString(){
            return "Row: " + this.row + "\nCol:" + this.col + "\nPlayerAmount:" + this.playersNum
                    + "\nWinSequence:" + this.winSequence + "\nBoardOccupied:" + this.boardOccupied
                    + "\nIsWin:" + this.isWin + "\nEmptyGameBoard:" + this.emptyGameBoard
                    + "\nBoardStatus:" + this.boardStatus + "\nCurrentPlayer" + this.currentPlayer;
        }
    }

    private void test(){
    	int num = 0;				//number of players
    	int ROWS = 0;
		int COLS = 0; 		//number of rows and columns
    	int rules = 0;			//number of winning pieces
    	int counter = 1;			//count the pieces in one line
    	int nextplayer = 0;		//who will do the next step from a saved game
    	int[] s = new int[1];		//Array container of the coordinate
    	String[][] board = new String[999][999];	//define the whole board
    	String start;				//resume or new
    	Scanner st = new Scanner(System.in);
    	Scanner in = new Scanner(System.in);
    	int moveCount;			//total step
    	int boardsize = 0;			//board size

    		while (true) {//to ask if players want to resume or new a game
    			try {
    				System.out.println("would like to resume a saved game?(enter 'Y' or 'N')");
    				start = st.nextLine();
    				if ("Y".equals(start) || "y".equals(start) || "n".equals(start) || "N".equals(start))
    					break;
    				System.out.println("Error! Please enter 'Y' or 'N'");
    			} catch (Exception e) {
    				System.out.println("Error! Please enter 'Y' or 'N'");
    			}
    		}
    		
    		if ("Y".equals(start) || "y".equals(start)) {//if player want to resume a game
    			System.out.println("Enter the name of your file");
    			resume();
    			printBoard();// print last board
    			do {		//for the round which may not start from the first player
    				nextplayer++;
    				s = getLocation(nextplayer, boardsize); 				//get the coordinate
    				board[s[0] - 1][s[1] - 1] = symbol(nextplayer);			//put the piece on the board
    				if (win(s[0] - 1, s[1] - 1, symbol(nextplayer)) == 1) {	//for winning
    					printBoard();
    					System.out.println("Player " + nextplayer + " win!");
    					System.exit(0);
    				}
    				if (win(s[0] - 1, s[1] - 1, symbol(nextplayer)) == 2) {	//for draw
    					printBoard();
    					System.out.println("-----Game is Draw-----");
    					System.exit(0);
    				}
    				printBoard();
    			} while (nextplayer < num);
    			do {//game from the first player
    				for (int o = 1; o <= num; o++) {
    					s = getLocation(o, boardsize);					//get the coordinate
    					board[s[0] - 1][s[1] - 1] = symbol(o);			//put the piece on the board
    					if (win(s[0] - 1, s[1] - 1, symbol(o)) == 1) {	//for winning
    						printBoard();
    						System.out.println("Player " + o + " win!");
    						System.exit(0);
    					}
    					if (win(s[0] - 1, s[1] - 1, symbol(o)) == 2) {	//for draw
    						printBoard();
    						System.out.println("-----Game is Draw-----");
    						System.exit(0);
    					}
    					printBoard();
    				}
    			} while (true);
    		}

    		if ("N".equals(start) || "n".equals(start)) {// new a game
    			do { 														//// judgement(rules,num,ROWS)
    				num = players(); // player number
    				ROWS = boardsize(); // board size
    				COLS = ROWS;
    				rules = rule(); // win sequence count
    			} while (judgement(rules, num, ROWS) != 1);

    			for (int x = 0; x < ROWS; x++) {// Initialize array
    				for (int y = 0; y < COLS; y++) {
    					board[y][x] = " ";
    				}
    			}
    			printBoard();// print the empty board
    			do {// win or tie, save quit and resume
    				for (int o = 1; o <= num; o++) {
    					s = getLocation(o, boardsize);
    					board[s[0] - 1][s[1] - 1] = symbol(o);
    					if (win(s[0] - 1, s[1] - 1, symbol(o)) == 1) {
    						printBoard();
    						System.out.println("Player " + o + " win!");
    						System.exit(0);
    					}
    					if (win(s[0] - 1, s[1] - 1, symbol(o)) == 2) {
    						printBoard();
    						System.out.println("-----Game is Draw-----");
    						System.exit(0);
    					}
    					printBoard();
    				}
    			} while (true);
    		}
    	}

    	public static int[] getLocation(int player, int boardsize) {		//function for getting coordinates
    		String[] arr = new String[1];		//array container
    		int[] tmp = new int[3];				//value container of coordinates and symbol
    		while (true) {
    			try {
    				System.out.println("It is player " + player + "'s turn !" + "\n" + "You can press S to save or Q to Save and Quit" + "\n"
    						+ "Or " + "you can enter the numbers of row and column you want : ");
    				Scanner in = new Scanner(System.in);
    				String str0 = in.nextLine();
    				String check = "^([0-9]*[1-9][0-9]*)\\s([0-9]*[1-9][0-9]*)$";
    		        Pattern regex = Pattern.compile(check);
    		        Matcher matcher = regex.matcher(str0);
    				if (matcher.matches() == true){
    					arr = str0.split(" ");
    					int r = Integer.parseInt(arr[0]);
    					int c = Integer.parseInt(arr[1]);
    					Object[][] board = null;
						if(r>=1 && r<=boardsize && c>=1 && c<=boardsize && board[r-1][c-1].equals(" ") == true){
    						tmp[0] = r;
    						tmp[1] = c;
    						tmp[2] = player;
    						break;
    					}
    					else
    						System.out.println("Wrong coordinate ! Please enter again!");
    				}
    				else if(str0.matches("^[Qq]+$")){ //save and quit game
    					save();
    					System.out.println("Game has been saved. " + "Game over");
    					System.exit(0);
    				}
    				else if(str0.matches("^[Ss]+$")){// save game
    					save();
    					System.out.println("Game has been saved. " + "Continue");
    				}
    				else
    					System.out.println("Error! Please enter two integer separated by spaces representing coordinate(rows and columns) you want : ");
    			} catch (Exception e) {
    				System.out.println("Error! Please enter two integer separated by spaces representing coordinate(rows and columns) you want : ");
    			}
    		}
    		int moveCount = 0;
			moveCount++;
    		return tmp;
    	}

    	public static void save() {
    		System.out.println("Saving... Enter the name of your file");
    		Scanner st = null;
			String filename = st.nextLine();
    		try {
    			File f = new File("c:\\"+filename+".txt");
    			FileWriter fww = new FileWriter(f);
    			fww.write("");
    			fww.close();

    			File locationfile = new File("c:\\"+filename+".txt");
    			FileWriter fw = new FileWriter(locationfile, true);
    			String num = null;
				String boardsize = null;
				String rules = null;
				String moveCount = null;
				fw.write(num + " " + boardsize + " " + rules + " " + moveCount + "\r\n"); // write the game frame on first line
    			fw.close();
    		} catch (Exception e) {
    			JOptionPane.showMessageDialog(null, "cannot create file");
    			e.printStackTrace();
    		}
    		String[][] board = null;
			for (int row = 0; row < ROWS; row++)
    			for (int col = 0; col < COLS; col++)
    				if (board[row][col] != " ") {	//write the coordinate and symbol on next line
    					try {
    						File locationfile = new File("d:\\" + filename + ".txt");
    						FileWriter fw = new FileWriter(locationfile, true);
    						fw.write(row + " " + col + " " + board[row][col] + "\r\n");
    						fw.close();
    					} catch (Exception e) {
    						JOptionPane.showMessageDialog(null, "cannot create file");
    						e.printStackTrace();
    					}
    				}
    	}

    	public static void resume() {
    		int count = 0;
    		while (true) {
    			try {
    				Scanner st = null;
					String filename = st.nextLine();
    				File file = new File("c:\\" + filename + ".txt");
    				if (file.isFile() && file.exists()) { //to judge if the file exists
    					InputStreamReader read = new InputStreamReader(new FileInputStream(file), "GBK");
    					BufferedReader bufferedReader = new BufferedReader(read);
    					String lineTxt = null;
    					while ((lineTxt = bufferedReader.readLine()) != null) {//read the file
    						count++;
    						String[][] board = null;
							if (count == 1) {//the first line is the game frame
    							String[] ss = lineTxt.split(" ");
    							int num = Integer.parseInt(ss[0]);
    							int boardsize = Integer.parseInt(ss[1]);
    							int row = boardsize;
    							int COL = boardsize;
    							int rules = Integer.parseInt(ss[2]);
    							int moveCount = Integer.parseInt(ss[3]);
    							int nextplayer = moveCount % num;
    							for (int x = 0; x < ROWS; x++) {// Initialize array
    								for (int y = 0; y < COLS; y++) {
    									board[y][x] = " ";
    								}
    							}
    						}
    						if (count > 1) {//other line is the coordinate and symbol of player
    							String[] ss = lineTxt.split(" ");
    							int num1 = Integer.parseInt(ss[0]);
    							int num2 = Integer.parseInt(ss[1]);
    							String playersymbol = ss[2];
    							board[num1][num2] = playersymbol;
    						}
    					}
    					read.close();
    					break;
    				} else {
    					System.out.println("Can't find the file. Please Enter the name again");
    				}
    			} catch (Exception e) {
    				System.out.println("Error!");
    				e.printStackTrace();
    			}
    		}
    	}

    	public static int win(int ROW, int COL, String symbol) {
    		//Win for Column
    		int deltarow = 0;
    		int deltacol = 0;
    		Object[][] board = null;
			int counter = 0;
			if (COL < COLS - 1) {
    			if (board[ROW][COL + 1].equals(symbol)) {
    				counter++;
    				deltarow = 0;
    				deltacol = 1;
    				next(ROW, COL + 1, deltarow, deltacol, counter, symbol);
    			}
    		}
    		if (COL >= 1) {
    			if (board[ROW][COL - 1].equals(symbol)) {
    				counter++;
    				deltarow = 0;
    				deltacol = -1;
    				next(ROW, COL - 1, deltarow, deltacol, counter, symbol);
    			}
    		}
    		if (counter == rule())
    			return 1;

    		//Win for Rows
    		counter = 1;//count the pieces
    		deltarow = 0;
    		deltacol = 0;
    		if (ROW < ROWS - 1) {
    			if (board[ROW + 1][COL].equals(symbol) && ROW >= 0 && COL >= 0) {
    				counter++;
    				deltarow = 1;
    				deltacol = 0;
    				next(ROW + 1, COL, deltarow, deltacol, counter, symbol);
    			}
    		}
    		if (ROW >= 1) {
    			if (board[ROW - 1][COL].equals(symbol) && ROW >= 1 && COL >= 0) {
    				counter++;
    				deltarow = -1;
    				deltacol = 0;
    				next(ROW - 1, COL, deltarow, deltacol, counter, symbol);
    			}
    		}
    		if (counter == rule())
    			return 1;

    		//Win for diagonal
    		counter = 1;//count the pieces
    		deltarow = 0;
    		deltacol = 0;
    		if (ROW < ROWS - 1 && COL < COLS - 1) {
    			if (board[ROW + 1][COL + 1].equals(symbol) && ROW >= 0 && COL >= 0) {
    				counter++;
    				deltarow = 1;
    				deltacol = 1;
    				next(ROW + 1, COL + 1, deltarow, deltacol, counter, symbol);
    			}
    		}
    		if (ROW >= 1 && COL >= 1)
    			if (board[ROW - 1][COL - 1].equals(symbol)) {
    				counter++;
    				deltarow = -1;
    				deltacol = -1;
    				next(ROW - 1, COL - 1, deltarow, deltacol, counter, symbol);
    			}
    		if (counter == rule())
    			return 1;

    		// Win for back-diagonal
    		counter = 1;//count the pieces
    		deltarow = 0;
    		deltacol = 0;
    		if (ROW >= 1 && COL < COLS - 1) {
    			if (board[ROW - 1][COL + 1].equals(symbol) && COL >= 0) {
    				counter++;
    				deltarow = -1;
    				deltacol = 1;
    				next(ROW - 1, COL + 1, deltarow, deltacol, counter, symbol);
    			}
    		}
    		if (COL >= 1 && ROW < ROWS - 1) {
    			if (board[ROW + 1][COL - 1].equals(symbol) && ROW >= 0 && COL >= 1) {
    				counter++;
    				deltarow = 1;
    				deltacol = -1;
    				next(ROW + 1, COL - 1, deltarow, deltacol, counter, symbol);
    			}
    		}
    		if (counter == rule())
    			return 1;

    		counter = 1;
    		
			if (0 == (boardsize() * boardsize()))// draw
    			return 2;

    		return 0;
    	}

    	public static void next(int ROW, int COL, int deltarow, int deltacol, int count, String symbol) {//recursive function for counting pieces
    		Object[][] board = null;
			if (ROW + deltarow >= 0 && COL + deltacol >= 0)
    			if (board[ROW][COL].equals(board[ROW + deltarow][COL + deltacol])) {
    				int counter = 0;
					counter++;
    				ROW = ROW + deltarow;
    				COL = COL + deltacol;
    				next(ROW, COL, deltarow, deltacol, counter, symbol);
    			}
    	}

    	public static int players() {//get number of players
    		int num;
			while (true) {
    			try {
    				Scanner in = new Scanner(System.in);
    				System.out.println("Please enter the number of players (must between 2 and 26): ");
    				String str1 = in.nextLine();
    				if (str1.matches("^+?[1-9][0-9]*$") && Integer.parseInt(str1)>=2 && Integer.parseInt(str1)<=26 ){
    					num = Integer.parseInt(str1);
    					break;
    				}
    				System.out.println("Error! Please enter a integer between 2 and 26 !");
    			} catch (Exception e) {
    				System.out.println("Error! Please enter a integer ");
    			}
    		}
    		return num;
    	}

    	public static int boardsize() {// get size of board
    		int boardsize;
			while (true) {
    			try {
    				Scanner in = new Scanner(System.in);
    				System.out.println("Please enter the number of rows(columns) (must between 3 and 999) : ");
    				String str2 = in.nextLine();
    				if (str2.matches("^+?[1-9][0-9]*$") && Integer.parseInt(str2)>=3 && Integer.parseInt(str2)<=999 ){
    					boardsize = Integer.parseInt(str2);
    					break;
    				}
    				System.out.println("Error! Please enter the number of rows(columns) (must between 3 and 999) : ");
    			} catch (Exception e) {
    				System.out.println("Error! Please enter a integer ! ");
    			}
    		}
    		return boardsize;
    	}

    	public static int rule() {// get rules
    		int rules;
			while (true) {
    			try {
    				Scanner in = new Scanner(System.in);
    				System.out.println("Please enter the win sequence count(>=3) : ");
    				String str3 = in.nextLine();
    				if (str3.matches("^+?[1-9][0-9]*$") && Integer.parseInt(str3)>=3){
    					rules = Integer.parseInt(str3);
    					break;
    				}
    				System.out.println("Error! Please enter a integer greater than 3! ");
    			} catch (Exception e) {
    				System.out.println("Error! Please enter a integer! ");
    			}
    		}
    		return rules;
    	}

    	public static void printBoard() {// print the board
    		System.out.print("   ");// print orders of col on the first row
    		for (int col = 0; col < COLS; col++) {
    			if (col < 8)
    				System.out.print(" " + (col + 1) + "  ");
    			else if (col <= 99 && col >= 8)
    				System.out.print(" " + (col + 1) + " ");
    			else
    				System.out.print((col + 1) + " ");
    		}

    		System.out.println();// first row end

    		String[][] board = null;
			for (int row = 0; row < ROWS - 1; row++) {// start from the second row:
    													// print row
    													// orders,space,-,+ and |
    			if (row <= 8) {// the orders of row
    				System.out.print("  " + (row + 1));
    			} else if (row > 8 && row < 99) {
    				System.out.print(" " + (row + 1));
    			} else
    				System.out.print(row + 1);

    			for (int col = 0; col < COLS - 1; ++col) {// the board of every
    														// column on one row
    				System.out.print(" " + board[row][col] + " |");
    			}
    			System.out.print(" " + board[row][COLS - 1] + " ");
    			System.out.println();// end this row(has order)
    			System.out.print("   ");
    			for (int col = 0; col < ROWS - 1; ++col) {// the board of every
    														// column on the '---'
              										// row
    				System.out.print("---+");
    			}
    			System.out.print("---");
    			System.out.println();// end this row(no order)
    		}
    		if (ROWS - 1 <= 8) {// the orders of row
    			System.out.print("  " + ROWS);
    		} else if (ROWS - 1 > 8 && ROWS - 1 < 99) {
    			System.out.print(" " + (ROWS));
    		} else
    			System.out.print(ROWS);
    		for (int col = 0; col < COLS - 1; ++col) {// the board of every Column
    													// on LAST row
    			System.out.print(" " + board[ROWS - 1][col] + " |");
    		}
    		System.out.print(" " + board[ROWS - 1][COLS - 1] + " ");
    		System.out.println();
    		System.out.print("   ");
    		System.out.println();
    	}

    	public static String symbol(int player) {// symbol of players
    		switch (player) { // only for the a board
    		case 1:
    			return "O";
    		case 2:
    			return "X";
    		case 3:
    			return "A";
    		case 4:
    			return "B";
    		case 5:
    			return "C";
    		case 6:
    			return "D";
    		case 7:
    			return "E";
    		case 8:
    			return "F";
    		case 9:
    			return "G";
    		case 10:
    			return "H";
    		case 11:
    			return "I";
    		case 12:
    			return "J";
    		case 13:
    			return "K";
    		case 14:
    			return "L";
    		case 15:
    			return "M";
    		case 16:
    			return "N";
    		case 17:
    			return "P";
    		case 18:
    			return "Q";
    		case 19:
    			return "R";
    		case 20:
    			return "S";
    		case 21:
    			return "T";
    		case 22:
    			return "U";
    		case 23:
    			return "V";
    		case 24:
    			return "W";
    		case 25:
    			return "Y";
    		case 26:
    			return "Z";
    		}
    		return null;
    	}

    	public static int judgement(int winnumber, int player, int sizeofboard) {
    		if (winnumber > sizeofboard || winnumber < 3) {
    			System.out.println("Out of boardsize! Please enter again!");
    			return -1;
    		} else if (player * (winnumber - 1) + 1 > sizeofboard * sizeofboard) {
    			String rules = null;
				String num = null;
				String boardsize = null;
				System.out.println("Winning is impossible if we need " + rules + " marks in line on a " + boardsize + "X"
    					+ boardsize + " board with " + num + " players. Please enter again!");
    			return -1;
    		} else
    			return 1;
    	}
}

