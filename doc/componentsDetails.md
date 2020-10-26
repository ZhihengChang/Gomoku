# Components Details
This doc extends the Components part
### Component Tags
---
Each componet is followed by a tag within a parentheses(eg: info, button, etc). <br>
- info: Label or plain text
- time: Date time
- button: Clickable button contains certain functionality 
- page: New window or new interface
- In Place: Current component is in place with the previous component while reaching that component

### Components Overview
---
- ***Login Page***
- ***Home Page***
  - ***Game List***
    - List Item (info)
      - Game Owner ID 
      - Game setting 
        - Allow RLS (Regret Last Step) 
        - Allow Chat 
        - Board Size 
      - Players (eg: 0/1 or 1/1) 
      - Spectation (eg: 0/0, 4/10, etc.) 
      - Join (button)
      - Spectate (button)
  - ***Waiting Room Page (In Place)***
    - Wait Time (time)
    - Players' ID (info)
    - (if isOwner) Start (button)
  - ***Menu Bar***
    - Profile (page) 
      - Player ID, Nickname
      - Player Stat (info)
        - Player's Level
        - Player's Rank
        - Total Win
        - Win Rate
    - Friends (page)
    - Create (button)
    - Setting (page)
      - Player Nickname
      - Logout (button)
- ***Game Page***
  - ***Menu Bar***
    - Regret Last Step (button)
    - Surrender (button)
    - Setting (page)
  - ***Game Board*** (input)
  - ***Result Page (In Place)***
    - Winner ID, Nickname (info)
    - Game Stat (info)
      - Game Length (time)
      - Total Pieces
      - Rewards
      - View Board (button)
      - OK (button)
  - ***Chat Box***
    - Dialogue (info)
    - Text Box (input)
    - Send (button)