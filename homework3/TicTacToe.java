import java.io.*;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class Game {
    private static final int ROWS = 0;
	private static final int COLS = 0;
	private final int MAX_BOARD_LIMIT = 999;

    public static void main(String[] args) {
        Game tic = new Game();
        tic.startGame();
    }
    
    public void startGame() {
        Scanner sc = new Scanner(System.in);     
        while(true) {
            System.out.println("Tic Tac Toe\n");
            System.out.println("Enter y to begin a new game\n");
            System.out.println("Enter n to resume a saved game from text\n");

            int playerInput = sc.nextInt();
            if(playerInput == "y") {
                System.out.println("Enter row(col), how many players and win sequence(seperated by space)");
                int RowNum = sc.nextInt();
                int ColNum = RowNum;
                int people = sc.nextInt();
                int sequence = sc.nextInt();
                
                if (!checkProblem(RowNum, ColNum, people, sequence) || false) {
                    System.out.println("Game exit");
                    return;
                }
                GameBoard board = new GameBoard(RowNum, ColNum, people, sequence);
                this.gameStart(board, false);
            }

            if(playerInput == "n") {
                System.out.println("Read last game state ");
                GameBoard board = this.readFromFile();
                if(board == null || board.isEmptyGameBoard()) {
                    System.out.println("No last game state found, please start a new game");
                    continue;
                }
                board.makeRound();
                this.gameStart(board, true);
            }

            System.out.println("Play again? Y/N");
            String ch = sc.next();
            if(!ch.equals("Y") && !ch.equals("y")) {
                break;
            }
        }
        sc.close();
    }

    private void gameStart(GameBoard board, boolean resumeTag) {
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
                while (!board.stepMove(rowNum - 1, colNum - 1, i)) {
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
        in.close();
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

	public boolean checkDignal(int RowNum, int ColNum) {
		try {
			for (int row = 0; row < RowNum; ++row) {
				for (int col = 0; col < ColNum; ++col) {
					makeRound(board[row][col]); 
				   if (col != COLS - 1) {
					 return true;
				   }
				}
				if (row != ROWS - 1) {
				   return false;
				}
			 }
		} catch (Exception e) {
			return false;
		}
	}
	
	public boolean checkProblem(int RowNum, int ColNum, int people, int sequence) {
        if(ColNum < 0 || RowNum < 0 || people <= 0 || sequence <= 0) {
            System.out.println("Error: Input parameter must larger than 0");
            return false;
        }

        if(ColNum > this.MAX_BOARD_LIMIT || RowNum > this.MAX_BOARD_LIMIT) {
            System.out.println("Error: Game board row or column exceed the max value");
            return false;
        }

        if(RowNum < sequence && ColNum < sequence) {
            System.out.println("Error: No winning condition available");
            return false;
        }

        if(people * (sequence - 1) + 1 > ColNum * RowNum) {
            System.out.println("Error: No winning condition available");
            return false;
        }

        return true;
	}
	

    private static class GameBoard implements Serializable {
		private static final long serialVersionUID = 1L;
		private int row;
        private int col;
        private int people;
        private int sequence;
        private int[][] boardStatus;
        private char[] playSymbol;
        private int boardOccupied;
        private boolean isWin;
        private boolean emptyGameBoard;
        private int currentPlayer;

        public GameBoard() {
            this.emptyGameBoard = true;
        }

        public GameBoard(final int row, final int col, final int people, final int sequence) {
            this.row = row;
            this.col = col;
            this.people = people;
            this.sequence = sequence;
            this.boardOccupied = 0;
            this.isWin = false;
            this.emptyGameBoard = false;

            playSymbol = new char[people + 1];
            playSymbol[0] = 'X';
            playSymbol[1] = 'O';
            playSymbol[people] = ' ';
            int index = 2;
            for(int i = 2; i < people + 2 && index < people; i++) {
                if (i != 25 && i != 16) {
                    playSymbol[index++] = (char) ('A' + (i - 2));
                }
            }

            boardStatus = new int[row][col];
            for(int i = 0; i < row; i++) {
                for(int j = 0; j < col; j++) {
                    boardStatus[i][j] = people;
                }
            }

            this.makeRound();

        }

        public boolean isFull(){
            return this.boardOccupied == this.row * this.col;
        }

        public boolean isEmptyGameBoard() {
            return this.emptyGameBoard;
        }

        public boolean stepMove(int i, int j, int player) {
            if(!checkProblem(i, j, player)) {
                return false;
            }
            this.currentPlayer = player;
            this.boardStatus[i][j] = player;
            this.makeRound();
            this.boardOccupied += 1;
            if(this.isWin(i, j, player)) {
                this.isWin = true;
                System.out.println("Player " + (player + 1)+ " is win");
            }

            return true;
		}

		public void makeRound(){
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
		
        public int getPlayerAmount() {
            return this.people;
        }


        public boolean isWin() {
            return this.isWin;
        }

        private boolean checkProblem(final int cx, final int cy, final int player) {
            return !(cx > this.row || cx < 0 || cy > this.col || cy < 0)
                    && this.boardStatus[cx][cy] == this.people;
		}
		

    	public static void checkNext(int ROW, int COL, int checkrow, int checkcol, int count, String letter) {
    		Object[][] board = null;
			if (ROW + checkrow >= 0 && COL + checkcol >= 0){
				if (board[ROW][COL].equals(board[ROW + checkrow][COL + checkcol])) {
    				int c = 0;
					c++;
    				ROW = ROW + checkrow;
    				COL = COL + checkcol;
    				checkNext(ROW, COL, checkrow, checkcol, c, letter);
    			}
			}		
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

            if(count - 1 >= this.sequence) {
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

            if(count - 1 >= this.sequence) {
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

            if(count - 1 >= this.sequence) {
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

            if(count - 1 >= this.sequence) {
                return true;
            }

            return false;
        }

        public int getCurrentPlayer() {
            return this.currentPlayer;
        }

        @Override
        public String toString(){
            return "Row: " + this.row + "\nCol:" + this.col + "\nPlayerAmount:" + this.people
                    + "\nWinSequence:" + this.sequence + "\nBoardOccupied:" + this.boardOccupied
                    + "\nIsWin:" + this.isWin + "\nEmptyGameBoard:" + this.emptyGameBoard
                    + "\nBoardStatus:" + this.boardStatus + "\nCurrentPlayer" + this.currentPlayer;
        }
    }
    
    //////////
    /////////////////
    ///////////////////
    ///////////////////////////////////////////////
    
    	private void test(){
    	int n = 0;				
    	int ROWS = 0;
		int COLS = 0; 		
    	int r = 0;					
    	int np = 0;		
    	int[] s = new int[1];		
    	String[][] board = new String[999][999];	
    	String start;				
    	Scanner st = new Scanner(System.in);
    	Scanner in = new Scanner(System.in);		
    	int boardsize = 0;			

    		while (true) {
    			try {
    				System.out.println("go to save game ?('Y' or 'N')");
    				start = st.nextLine();
    				if ("Y".equals(start) || "y".equals(start) || "n".equals(start) || "N".equals(start))
    					break;
    				System.out.println("Error");
    			} catch (Exception e) {
    				System.out.println("Error");
    			}
    		}	
    		if ("Y".equals(start) || "y".equals(start)) {
    			System.out.println("Name of file");
    			designBoard();
    			do {		
    				np++;
    				s = findPlace(np, boardsize); 				
    				board[s[0] - 1][s[1] - 1] = playerLetter(np);			
    				if (checkWinner(s[0] - 1, s[1] - 1, playerLetter(np)) == 1) {	
    					designBoard();
    					System.out.println("Player " + np + " win!");
    					System.exit(0);
    				}
    				if (checkWinner(s[0] - 1, s[1] - 1, playerLetter(np)) == 2) {
    					designBoard();
    					System.out.println("Draw");
    					System.exit(0);
    				}
    				designBoard();
    			} while (np < n);
    			do {
    				for (int o = 1; o <= n; o++) {
    					s = findPlace(o, boardsize);					
    					board[s[0] - 1][s[1] - 1] = playerLetter(o);			
    					if (checkWinner(s[0] - 1, s[1] - 1, playerLetter(o)) == 1) {	
    						designBoard();
    						System.out.println("Player " + o + " win!");
    						System.exit(0);
    					}
    					if (checkWinner(s[0] - 1, s[1] - 1, playerLetter(o)) == 2) {	
    						designBoard();
    						System.out.println("Draw");
    						System.exit(0);
    					}
    					designBoard();
    				}
    			} while (true);
    		}

    		if ("N".equals(start) || "n".equals(start)) {
    			designBoard();
    			do {
    				for (int o = 1; o <= n; o++) {
    					s = findPlace(o, boardsize);
    					board[s[0] - 1][s[1] - 1] = playerLetter(o);
    					if (checkWinner(s[0] - 1, s[1] - 1, playerLetter(o)) == 1) {
    						designBoard();
    						System.out.println("Player " + o + " checkWinner!");
    						System.exit(0);
    					}
    					if (checkWinner(s[0] - 1, s[1] - 1, playerLetter(o)) == 2) {
    						designBoard();
    						System.out.println("Draw");
    						System.exit(0);
    					}
    					designBoard();
    				}
    			} while (true);
    		}
    		in.close();
    		st.close();
    	}

    	public static int[] findPlace(int player, int boardsize) {
    		String[] arr = new String[1];		
    		int[] tmp = new int[3];				
    		while (true) {
    			try {
    				System.out.println("player " + player + "'s turn !" + "\n" + "S or Q" + "\n"
    						+ "Or " + "(row,col) : ");
    				Scanner in = new Scanner(System.in);
    				String finput = in.nextLine();
    				String temp = "^([0-9]*[1-9][0-9]*)\\s([0-9]*[1-9][0-9]*)$";
    		        Pattern regex = Pattern.compile(temp);
    		        Matcher matcher = regex.matcher(finput);
    				if (matcher.matches() == true){
    					arr = finput.split(" ");
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
    						System.out.println("Wrong ! Enter again!");
    				}
    				else if(finput.matches("^[Qq]+$")){
    					System.out.println("Saved. " + "Game over");
    					System.exit(0);
    				}
    				else if(finput.matches("^[Ss]+$")){
    					System.out.println("Saved. " + "Continue");
    				}
    				else
    					System.out.println("Error!");
    			} catch (Exception e) {
    				System.out.println("Error!");
    			}
    		}
    		return tmp;
    	}

    	public static int players() {
    		int n;
			while (true) {
    			try {
    				Scanner in = new Scanner(System.in);
    				System.out.println("Enter the number between 2 and 26: ");
    				String str1 = in.nextLine();
    				if (str1.matches("^+?[1-9][0-9]*$") && Integer.parseInt(str1)>=2 && Integer.parseInt(str1)<=26 ){
    					n = Integer.parseInt(str1);
    					break;
    				}
    				System.out.println("Error!");
    			} catch (Exception e) {
    				System.out.println("Error!");
    			}
    		}
    		return n;
		}
		
		public static void designBoard() {
    		System.out.print("   ");
    		for (int col = 0; col < COLS; col++) {
    			if (col < 8)
    				System.out.print(" " + (col + 1) + "  ");
    			else if (col <= 99 && col >= 8)
    				System.out.print(" " + (col + 1) + " ");
    			else
    				System.out.print((col + 1) + " ");
    		}

    		System.out.println();

			String[][] board = null;
			if (ROWS - 1 <= 8) {
    			System.out.print("  " + ROWS);
    		} else if (ROWS - 1 > 8 && ROWS - 1 < 99) {
    			System.out.print(" " + (ROWS));
    		} else
    			System.out.print(ROWS);
    		for (int col = 0; col < COLS - 1; ++col) {
    			System.out.print(" " + board[ROWS - 1][col] + " |");
    		}
			for (int row = 0; row < ROWS - 1; row++) {												
    			if (row <= 8) {
    				System.out.print("  " + (row + 1));
    			} else if (row > 8 && row < 99) {
    				System.out.print(" " + (row + 1));
    			} else
    				System.out.print(row + 1);

    			for (int col = 0; col < COLS - 1; ++col) {
    				System.out.print(" " + board[row][col] + " |");
    			}
    			System.out.print(" " + board[row][COLS - 1] + " ");
    			System.out.println();
    			System.out.print("   ");
    			for (int col = 0; col < ROWS - 1; ++col) {
    				System.out.print("---+");
    			}
    			System.out.print("---");
    			System.out.println();
			}
			System.out.print(" " + board[ROWS - 1][COLS - 1] + " ");
    		System.out.println();
    		System.out.print("   ");
    		System.out.println();
    		
    	}

    	public static int boardsize() {
    		int boardsize;
			while (true) {
    			try {
    				Scanner in = new Scanner(System.in);
    				System.out.println("ns)");
    				String str2 = in.nextLine();
    				if (str2.matches("^+?[1-9][0-9]*$") && Integer.parseInt(str2)>=3 && Integer.parseInt(str2)<=999 ){
    					boardsize = Integer.parseInt(str2);
    					break;
    				}
    				System.out.println("Error!");
    			} catch (Exception e) {
    				System.out.println("Error!");
    			}
    		}
    		return boardsize;
    	}

    	public static int rule() {
    		int r;
			while (true) {
    			try {
    				Scanner in = new Scanner(System.in);
    				System.out.println("Pount(>=3) : ");
    				String str3 = in.nextLine();
    				if (str3.matches("^+?[1-9][0-9]*$") && Integer.parseInt(str3)>=3){
    					r = Integer.parseInt(str3);
    					break;
    				}
    				System.out.println("");
    			} catch (Exception e) {
    				System.out.println(" ");
    			}
    		}
    		return r;
    	}
    	
		public static int judgement(int winnumber, int player, int sizeofboard) {
    		if (winnumber > sizeofboard || winnumber < 3) {
    			System.out.println("Out of boardsize! Please enter again!");
    			return -1;
    		} else if (player * (winnumber - 1) + 1 > sizeofboard * sizeofboard) {
    			String r = null;
				String n = null;
				String boardsize = null;
				System.out.println("Winning is impossible if we need " + r + " marks in line on a " + boardsize + "X"
    					+ boardsize + " board with " + n + " players. Please enter again!");
    			return -1;
    		} else
    			return 1;
    	}
    	public static String playerLetter(int player) {
    		switch (player) { 
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
    		}
    		return null;
		} 
		
		public static int checkWinner(int ROW, int COL, String letter) {
    		int checkrow = 0;
    		int checkcol = 0;
    		Object[][] board = null;
			int c = 0;
			if (COL < COLS - 1) {
    			if (board[ROW][COL + 1].equals(letter)) {
    				c++;
    				checkrow = 0;
    				checkcol = 1;
    				checkNext(ROW, COL + 1, checkrow, checkcol, c, letter);
    			}
    		}
    		if (COL >= 1) {
    			if (board[ROW][COL - 1].equals(letter)) {
    				c++;
    				checkrow = 0;
    				checkcol = -1;
    				checkNext(ROW, COL - 1, checkrow, checkcol, c, letter);
    			}
    		}
    		if (c == rule())
    			return 1;

    		c = 1;
    		checkrow = 0;
    		checkcol = 0;
    		if (ROW < ROWS - 1) {
    			if (board[ROW + 1][COL].equals(letter) && ROW >= 0 && COL >= 0) {
    				c++;
    				checkrow = 1;
    				checkcol = 0;
    				checkNext(ROW + 1, COL, checkrow, checkcol, c, letter);
    			}
    		}
    		if (ROW >= 1) {
    			if (board[ROW - 1][COL].equals(letter) && ROW >= 1 && COL >= 0) {
    				c++;
    				checkrow = -1;
    				checkcol = 0;
    				checkNext(ROW - 1, COL, checkrow, checkcol, c, letter);
    			}
    		}
    		if (c == rule())
    			return 1;
    		c = 1;
    		checkrow = 0;
    		checkcol = 0;
    		if (ROW < ROWS - 1 && COL < COLS - 1) {
    			if (board[ROW + 1][COL + 1].equals(letter) && ROW >= 0 && COL >= 0) {
    				c++;
    				checkrow = 1;
    				checkcol = 1;
    				checkNext(ROW + 1, COL + 1, checkrow, checkcol, c, letter);
    			}
    		}
    		if (ROW >= 1 && COL >= 1)
    			if (board[ROW - 1][COL - 1].equals(letter)) {
    				c++;
    				checkrow = -1;
    				checkcol = -1;
    				checkNext(ROW - 1, COL - 1, checkrow, checkcol, c, letter);
    			}
    		if (c == rule())
    			return 1;

    		c = 1;
    		checkrow = 0;
    		checkcol = 0;
    		if (ROW >= 1 && COL < COLS - 1) {
    			if (board[ROW - 1][COL + 1].equals(letter) && COL >= 0) {
    				c++;
    				checkrow = -1;
    				checkcol = 1;
    				checkNext(ROW - 1, COL + 1, checkrow, checkcol, c, letter);
    			}
    		}
    		if (COL >= 1 && ROW < ROWS - 1) {
    			if (board[ROW + 1][COL - 1].equals(letter) && ROW >= 0 && COL >= 1) {
    				c++;
    				checkrow = 1;
    				checkcol = -1;
    				checkNext(ROW + 1, COL - 1, checkrow, checkcol, c, letter);
    			}
    		}
    		if (c == rule())
    			return 1;

    		c = 1;
    		
			if (0 == (boardsize() * boardsize()))// draw
    			return 2;

    		return 0;
    	}
}

