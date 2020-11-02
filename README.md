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
Otherwise, for ```Join``` and ```Spectate```, proceed to the Waiting Room (step 4).<br>
<img src="https://github.com/ZhihengChang/Gomoku/blob/main/doc/img/UI/homeUI.png" width="650"> <br>
***NOTE:*** Add a Refresh Button. <br>

#### 3. Creating Game
The player can set game settings in this step. (e.g. board size, piece's color, Allow Undo, Allow Chat, etc.) <br>
By default, the board size is 15X15, Allow Undo is OFF, and Allow Chat is OFF. <br>
Click ```Create``` button at the bottom of the page to create the game. <br>
When the game is successfully created, proceed to In Game (4) and waiting for another player to join. <br>
<img src="https://github.com/ZhihengChang/Gomoku/blob/main/doc/img/UI/createGameUI.png" width="650"> <br>
***NOTE:*** Missing Back/Cancel Button. <br>
***NOTE:*** Waiting Room is deprecated: [Waiting Room (DEPRECATED)](https://github.com/ZhihengChang/Gomoku/edit/main/doc/deprecated/waitingRoom.md). <br>

#### 4. In Game
In Game is where both players plays the game. <br>
The player will have (by default) 60 second time limit per turn to place the piece on the board. <br>
If the player does NOT place a piece on the board by the end of the time limit, then the opponent wins, proceeds to the End Game. <br>
The player can Undo last step by clicking ```Undo``` when ```Allow Undo``` is ```ON``` and the opponent confirmed. <br> 
The player can Quit the game by clicking ```Quit``` back to the Home, the opponent wins (NO exp/rewards gain). <br>
The player can Surrender by clicking ```Surrender```, the opponent wins, proceed to the End Game (PARTIAL exp/rewards gain). <br>
The player can Chat with the opponent if ```Allow Chat``` is ```ON```. <br>
If one of the player won, then proceed to End Game Page.<br><br>
<img src="https://github.com/ZhihengChang/Gomoku/blob/main/doc/img/UI/inGameUI.png" width="700"> <br>

##### Friends Tab
The ```Friends``` shows the player's friends list. <br>
The player can invite friend that is currently online and NOT waiting or in game to join the game. <br>
The player can spectate friend's match if the player is still waiting. <br>
<img src="https://github.com/ZhihengChang/Gomoku/blob/main/doc/img/UI/inGame_friends.png" width="700"> <br>

##### Spectate Tab
The ```Spectate``` is similar to the ```Friends``` above. <br>
There is NO interaction buttons in this tab.

#### 5. End Game
The End Game shows which player wins <br>
The Game status (e.g. match time, number of pieces the player placed, exp/rewards gains, etc.) is also shown in the End Game. <br>
The player can view the game board again by clicking ```View Board``` button at the bottom of the page. <br>
The player can go back to Home by clicking ```Quit``` or ```HOME``` button. <br>
<img src="https://github.com/ZhihengChang/Gomoku/blob/main/doc/img/UI/endGameUI.png" width="650"> <br>

#### 6. Miscellaneous
Below are other sub pages that include in this program. <br>
- **Profile:** everything about the player
- **Friends:** player's friends list
- **Settings:** program settings and game settings
##### 6.1 Player Profile
The Profile shows the basic info / game stat of the player. <br>
The basic info contains: player's avatar, player's level, player ID, birthday, and personal signature. <br>
The player info (except ID) can be changed in the Settings. <br>
The game stat contains: player's rank, total wins, win rate, and match histories. <br>
The player can view the game board by clicking ```View``` button on each match entry in match history. <br>
The player can go back to previous page by clicking ```Back``` button in the Menu Bar. <br>
<img src="https://github.com/ZhihengChang/Gomoku/blob/main/doc/img/UI/profileUI.png" width="650"> <br>

# Components
For detailed components: [Components Details](https://github.com/ZhihengChang/Gomoku/blob/main/doc/componentsDetails.md)
- **Login Page**
- **Home Page**
  - **Game List / Waiting Room Page**
  - **Menu Bar**
- **Game Page**
  - **Menu Bar**
  - **Game Board / Result Page**
  - **Chat Box**
  
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

