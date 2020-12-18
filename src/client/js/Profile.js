'use strict';
export default class Profile{

    /**
     * Create Profile object based on specified user
     * @param {object} user 
     */
    constructor(user){
        this._user = user;
    }

    loadProfile(profileDisplay){
        //Player level
        profileDisplay.p_level.textContent += this.getLevel();
        //Player username
        profileDisplay.p_name.textContent = this._user.username;
        //Player ID
        profileDisplay.p_id.textContent += this._user.userId;
        //Player Birthday
        profileDisplay.p_birthday.textContent = this._user.birthday;
        //Player Rank
        profileDisplay.p_rank_value = this.getRank();
        //Player Wins
        profileDisplay.p_wins_value = this._user.totalWins;
        //Player Winrate
        profileDisplay.p_winrate_value = `${this.getWinrate()}%`;

        this._profile = profileDisplay;
    }

    getLevel(){
        return 1 + Math.floor(this._user.exp / 10);
    }

    getRank(){
        let rank = Math.floor(this._user.rankPoints / 100);
        switch(rank){
            case 0 : return 'BRONZE';
            case 1 : return 'SILVER';
            case 2 : return 'GOLD';
            case 3 : return 'PLATINUM';
            case 4 : return 'DIAMOND';
            case 5 : return 'MASTER';
            default: return 'SUPREME';
        }
    }

    getWinrate(){
        return (this._user.totalWins / this._user.totalMatches) * 100;
    }

}