const { extname } = require("path");
const error = require("../error/error");
const fs = require("fs");
const  types = require("../utils/constants");
// const path = require('path');

// Use path.join to create the absolute path
// const filePath = path.join(__dirname, 'data','players.json');



class ValidationStrategy{
    constructor(teamObj) {
        this.team = teamObj;
    }

    initialise(){
        try {
            const data = fs.readFileSync("D:/nodetask-1/data/players.json", 'utf8');
            const jsonData = JSON.parse(data);
            this.playerData = jsonData;
            // console.log(jsonData);
          } catch (err) {
            console.error(err);
        }
     };
    
    validateIt(player) {};
}

class Dream11RuleStrategy extends ValidationStrategy{
    constructor(teamObj) {
        super(teamObj);
    }

    initialise() {
        super.initialise();
        this.playerHashed = {};
        for (let player of this.playerData) {
            this.playerHashed[player["Player"]] = player;
        }
        // console.log("player hash is : ", this.playerHashed);
    };
    
    validateIt() {
        
        let teams = {};

        let teamComb = {};

        for (let kys of Object.keys(types)) {
            teamComb[types[kys]] = 0;
        }
    
        for (let plr of this.team.players) {
            console.log("player : ", plr," : ",this.playerHashed[plr]);
            if (this.playerHashed[plr]) {
                if (!teams.hasOwnProperty(this.playerHashed[plr]["Team"])){
                    teams[this.playerHashed[plr]["Team"]] = 1;
                }
                else{
                    
                    teams[this.playerHashed[plr]["Team"]] += 1;
                }
               
                let plrType = this.playerHashed[plr]["Role"];
                let roleLocal = types[plrType];
                teamComb[roleLocal] += 1;
            }
        }

        console.log("teams and players : ", teams);

        if (Object.keys(teams).length !== 2){
            throw new Error("2 teams have to be selected");
        }

        for (let key of Object.keys(teams)) {
            if (teams[key] > 10) {
                throw new Error("At max 10 players can be from 1 team");
            }
        }

        console.log("team combn : ", teamComb);
        
     

        for (let kys of Object.keys(teamComb)) {
            if (!(teamComb[kys] >= 1 && teamComb[kys] <= 8)){
                throw new Error(`no of ${kys}'s is not correct`);
            }
        }

    };
}

class CricketRuleStrategy extends ValidationStrategy{
    constructor(teamObj) {
        super(teamObj);
    }

    initialise() {
        super.initialise();
        this.playerHashed = {};
        for (let player of this.playerData) {
            this.playerHashed[player["Player"]] = player;
        }
        // console.log("player hash is : ", this.playerHashed);
    };
    
    validateIt() {
        
        if (this.team.captain === this.team.viceCaptain) {
            throw new Error("Captain and vicecaptain should be different !!!");
        }

        if (this.team.players.length !== 11) {
            throw new Error("invalid team size !!!");
        }
        let unique = {};
        for (let plr of this.team.players) {
            if (unique[plr]) {
                throw new Error("unique players are not provided !!!");
            }
            unique[plr] = 1;
        }

        if (!unique[this.team.captain] || !unique[this.team.viceCaptain]) {
            throw new Error("Captain and vice captain shoudl be from the same team !!!");
        }

    };
}






class CricketEngine{
    constructor(...strategies) {
        this.localStrategies = strategies;
    }

    validate(){
        try {
            for (let str of this.localStrategies) {
                str.validateIt();
            }
        }
        catch (err) {
            throw new Error(err);
        }
    }
}



class Validator{
    constructor() { };

    validateAddTeam(Obj){
        const { name, players, captain, viceCaptain } = Obj;
        if (!name || !players || !captain || !viceCaptain) {
            throw new Error("Bad request 400");
        }
        return Obj;
    }

    validateRules(obj) {

        try {
            let dream11RuleStrategy = new Dream11RuleStrategy(obj);
        
            dream11RuleStrategy.initialise();
    
            let cricketStrategy = new CricketRuleStrategy(obj);
            
            cricketStrategy.initialise();
            
            let cricketEngine = new CricketEngine(cricketStrategy, dream11RuleStrategy);
    
            cricketEngine.validate();
        }
        catch (err) {
            throw new Error("cricket related error " + err);
        }
        


    }
}


module.exports = new Validator();