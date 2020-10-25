# Gomoku
Gomoku, also called Five in a Row, is an abstract strategy, 2 players board game. <br>
# Process
#### **1. Login** <br>
- A login window will open when launching the game. The login window will ask (username and password) input from the player. 
- After the palyer enter the valid username and password, then click login button to proceed to Home Page (2).
#### **2. Home page** 
  - The main page contains a list of games the player can join or spectate. 
  - If the player click on ```Join``` button on one of the list item (game), then the palyer will enter the game (4) with the owner of the game (the opponent) and following players in the spectate list. 
  - If the player click on ```Spectate``` button on one of the list item (game), then the palyer will enter the Waiting room page waiting for the owner to finds a player to start the game (3). 
  - The player can also create a game by press ```Create``` botton on the left side menu bar. 
  - When creating a game, the player can chose the size of the Go Board and some other game settings. 
  - Some other setting such as ```Allow Regret Last Step``` and ```Allow Sepectate``` 
  - Once the game is created, the palyer will enter the waiting room waiting for another player (3). 
#### **3. Waiting Room Page** 
- While the player in the waiting room as spectator, the player can see other players who spectate this game in the waiting room. 
- If the player click on ```Back``` button will exit the waiting room, no longer spectate the game. <br>
- While the player in the waiting room as game owner, the player can see the spectation list and a ```Start``` button on the bottom. 
- Once another player joins the game, the ```Start``` button (Start the game) on the buttom will be available to click (4). 
- While in the waiting room page few options will be restricted such as ```Create``` (create a game). There is exceptions such as ```Setting```. 
#### **4. In Game** 
- When both players enter the game page, the game will automatically start, the game owner will make the first move. 
- There is a chat box on the right side to chat with the opponent if the setting ```Allow Chat``` is on. 
- There is a menu bar on the left. The player can ```Regret Last Step```, ```Surrender```, ```See Spectator List``` etc. 
- To place a piece on the Go Board by simply click on the intersection of two lines on the board. 
- The player can only place a piece on the board in his/her turn. 
- If the player click on ```Regret Last Step```, then will send a confirm to the opponent. If the opponent agrees, the move will be cancel and the Go Board will be restored to previous step.
- If the player click on ```Surrender```, the opponent will win the game and derict to End Game result page (5). 
- If one of the players have 5 pieces in a line, the player will win, game ends and derict to End Game result page (5). 
#### **5. End Game** 


# Graphic User Interface
<img src="https://github.com/ZhihengChang/Gomoku/blob/main/doc/img/UI_design.jpg" width="650"> <br>
#### A: Menu Bar (Tool Bar)
- Regret Last Step
- Surrender
- spectate
- setting
#### B: Game Board (Go Board)
The area to place Go pieces 
#### C: Chat Box
The area to chat (send and recieve messages) with opponents
# Game Rule
Player who get 5 pieces in line win the game (horizontally or vertically or diagonally) <br>
# Features
#### UI Features:
custom chessboard size
can change piece's color <br>
sound effects when placing pieces <br>
#### Game Features:
Regret Last Step game mode <br>
Allow player to spectate others <br>
chat box (run with the game Simultaneous）<br>

a
