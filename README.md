# Gomoku
Gomoku, also called Five in a Row, is an abstract strategy, 2 players board game. <br>
# General Process and Basic UI
For detailed process: [Process Details](https://github.com/ZhihengChang/Gomoku/blob/main/doc/processDetails.md) <br>
For detailed program flow: [flow Details](https://github.com/ZhihengChang/Gomoku/blob/main/doc/flowDetails.md)
#### 1. Login
Require Player's username and password. Upon successful login, proceed to Home Page. <br>
Forgot Username and Password is supported. By clicking on these two option, the user will be proceed to Account Recovery process.
By default, the user will have total of 5 login attempts. If exceeds attempts limit, proceed to Account Recovery automatically.

#### 2. Home
The player can joins/creates/spectates games in this page. <br>
If the player clicks on ```Create``` button to create a game, proceed to step 3. <br>
Otherwise, for ```Join``` and ```Spectate```, proceed to the Waiting Room (step 4).
<br><br>
<img src="https://github.com/ZhihengChang/Gomoku/blob/main/doc/img/UI/homePageUI.png" width="600"> <br>

#### 3. Creating Game
The player can set game settings in this step. (e.g. board size, piece's color, Allow Undo, Allow Chat, etc.) <br>
By default, the board size is 15X15, Allow Undo is OFF, and Allow Chat is OFF. <br>
Click ```Create``` button at the bottom of the page to create the game. <br>
When the game is successfully created, proceed to In Game (4) and waiting for another player to join. <br>
<img src="https://github.com/ZhihengChang/Gomoku/blob/main/doc/img/UI/createGameUI.png" width="650"> <br>
***NOTE:*** Missing Back/Cancel Button. <br>
***NOTE:*** Waiting Room is deprecated: [Waiting Room (DEPRECATED)](https://github.com/ZhihengChang/Gomoku/edit/main/doc/deprecated/waitingRoom.md). <br>

#### 4. In Game
The game page where both players plays the game. If one of the player won or surrendered, then proceed to End Game Page.
#### 5. End Game
The game ends and shows the result.

# Components
For detailed components: [Components Details](https://github.com/ZhihengChang/Gomoku/blob/main/doc/componentsDetails.md)
- ***Login Page***
- ***Home Page***
  - ***Game List / Waiting Room Page***
  - ***Menu Bar***
- ***Game Page***
  - ***Menu Bar***
  - ***Game Board / Result Page***
  - ***Chat Box***
  
# Game Rule
Player who get 5 pieces in line win the game (horizontally or vertically or diagonally) <br>
# Features
#### UI Features:
custom chessboard size
can change piece's color <br>
sound effects when placing pieces <br>
#### Game Features:
Player Profile System <br>
Friends <br>
Regret Last Step game mode <br>
Allow player to spectate others <br>
chat box (run with the game Simultaneous）<br>

