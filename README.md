# Gomoku
Gomoku, also called Five in a Row, is an abstract strategy, 2 players board game. <br>
# General Process and Basic UI
For detailed process: [Process Details](https://github.com/ZhihengChang/Gomoku/blob/main/doc/processDetails.md) <br>
For detailed program flow: [flow Details](https://github.com/ZhihengChang/Gomoku/blob/main/doc/flowDetails.md)
#### **1. Login** <br>
Require Player's username and password. Upon successful login, proceed to Home Page. <br>
Forgot Username and Password is supported. <br><br>&nbsp;
<img src="https://github.com/ZhihengChang/Gomoku/blob/main/doc/img/UI/loginUI.png" style="" width="300"> <br>
#### **2. Home page** 
Player can joins/creates/spectates games in this page. If any action above is taken, proceed to Waiting Room Page. <br><br>
<img src="https://github.com/ZhihengChang/Gomoku/blob/main/doc/img/UI/homePageUI.png" width="600"> <br>
#### **3. Waiting Room Page** 
Pre game page, waiting for game starts. When the game starts, proceed to In Game Page
#### **4. In Game** 
The game page where both players plays the game. If one of the player won or surrendered, then proceed to End Game Page.
#### **5. End Game** 
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

