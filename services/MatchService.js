const Repository = require("../repository/jsonRepo.js");
const fs = require("fs");

// Batting Points
// --
// Run						 +1
// Boundary Bonus			 +1
// Six Bonus				 +2
// 30 Run Bonus			     +4
// Half-century Bonus	     +8
// Century Bonus			 +16
// Dismissal for a duck 	 -2 (Batter, Wicket-Keeper & All-Rounder only)


// Bowling Points
// --
// Wicket (Excluding Run Out)	+25
// Bonus (LBW / Bowled)		    +8
// 3 Wicket Bonus				      +4
// 4 Wicket Bonus				      +8
// 5 Wicket Bonus				      +16
// Maiden Over					        +12


// Fielding Points
// --
// Catch				  +8
// 3 Catch Bonus		  +4
// Stumping			  +12
// Run out 	          +6

class chainOfResp{
    constructor(next,teamA,teamB){
        this.next = next;
        this.teamA = teamA;
        this.teamB = teamB;
        const data = fs.readFileSync("D:/nodetask-1/data/players.json", 'utf8');
        const jsonData = JSON.parse(data);
        this.playerData = jsonData;
        this.playerHashed = {};
        for (let player of this.playerData) {
            this.playerHashed[player["Player"]] = player;
        }
        this.playerPts = {
        };
    }
    
    handle(ball){
        if (this.next) {
            this.next.handle(ball);   
        }
    }
    
    getScore() {
        console.log("player points : ", this.playerPts);
        let scoreA = 0;
        let scoreB = 0;
        for (let kys of Object.keys(this.playerPts)) {
            if (this.playerPts[kys]["team"] === this.teamA) {
                for (let kys2 of Object.keys(this.playerPts[kys])) {
                    if (typeof(this.playerPts[kys][kys2])==="number") {
                        scoreA += this.playerPts[kys][kys2];
                    }
                }  
            }
            else {
                for (let kys2 of Object.keys(this.playerPts[kys])) {
                    if (typeof(this.playerPts[kys][kys2])==="number") {
                        scoreB += this.playerPts[kys][kys2];
                    }
                }  
            }
        }

        console.log("scoreA : ", scoreA, "scoreB : ", scoreB);
        return {scoreA,scoreB};
    }
}

class batsmenHandler extends chainOfResp{
    constructor(next,matchPts,teamA,teamB){
        super(next, teamA, teamB);
        this.scoreTeamA = 0;
        this.scoreTeamB = 0;
        this.match = matchPts;
        this.obj = {
            "ID": 1304114,
            "innings": 2,
            "overs": 16,
            "ballnumber": 1,
            "batter": "SO Hetmyer",
            "bowler": "PH Solanki",
            "non-striker": "R Ashwin",
            "extra_type": "NA",
            "batsman_run": 4,
            "extras_run": 0,
            "total_run": 4,
            "non_boundary": 0,
            "isWicketDelivery": 0,
            "player_out": "NA",
            "kind": "NA",
            "fielders_involved": "NA",
            "BattingTeam": "Rajasthan Royals"
        }
    }

    handle(ball) {
        console.log("batsmen name : ", ball);
        if (!this.playerPts[ball["batter"]]) {

            console.log("first time player");

            this.playerPts[ball["batter"]] = {
                "Run":0,
                "Boundary":0,			
                "Six":0	,		
                "30":0 ,		    
                "50":0,    
                "100":0,		
                "Duck": 0,
                "role": this.playerHashed[ball["batter"]],
                "team": ball["BattingTeam"]
            }
        }
        if (!this.playerPts[ball["non-striker"]]) {
            this.playerPts[ball["non-striker"]] = {
                "Run":0,
                "Boundary":0,			
                "Six":0	,		
                "30":0 ,		    
                "50":0,    
                "100":0,		
                "Duck": 0,
                "role": this.playerHashed[ball["non-striker"]],
                "team": ball["BattingTeam"]
            }
        }
        

        if (ball["batsman_run"]) {
            this.playerPts[ball["batter"]]["Run"] += ball["batsman_run"];
        }
        if (ball["batsman_run"] === 4) {
            this.playerPts[ball["batter"]]["Boundary"] += 1;
        }
        if (ball["batsman_run"] === 6){
            this.playerPts[ball["batter"]]["Six"] += 2;
        }
        if (!this.playerPts[ball["batter"]]["30"] && ball["batsman_run"] >= 30){
            this.playerPts[ball["batter"]]["30"] = 4;
        }
        if (!this.playerPts[ball["batter"]]["50"] && ball["batsman_run"] >= 50){
            this.playerPts[ball["batter"]]["50"] = 8;
        }
        if (!this.playerPts[ball["batter"]]["100"] && ball["batsman_run"] >= 100){
            this.playerPts[ball["batter"]]["100"] = 16;
        }
        if (ball["isWicketDelivery"]) {
            if (this.playerPts[ball["player_out"]]["Run"] === 0 && this.canBat(this.playerPts[ball["player_out"]]["role"]) ){
                this.playerPts[ball["player_out"]]["Duck"] = -2;
            }
        }

        // console.log("batsmen playerPts : ", this.playerPts);

        super.handle(ball);
    }

    canBat(role){
        return role === "Batter" || role === "Wicket-Keeper" || role === "All-Rounder";
    }

    getScore() {
        let {scoreA,scoreB} = super.getScore();
        this.scoreTeamA += scoreA;
        this.scoreTeamB += scoreB;
        console.log("batsmen : ", this.scoreTeamA, " : ", this.scoreTeamB);
    }
}

class bowlingHandler extends chainOfResp{
    constructor(next,matchPts,teamA,teamB){
        super(next,teamA,teamB);
        this.match = matchPts;
        this.scoreTeamA = 0;
        this.scoreTeamB = 0;
        this.obj = {
            "ID": 1304114,
            "innings": 2,
            "overs": 16,
            "ballnumber": 1,
            "batter": "SO Hetmyer",
            "bowler": "PH Solanki",
            "non-striker": "R Ashwin",
            "extra_type": "NA",
            "batsman_run": 4,
            "extras_run": 0,
            "total_run": 4,
            "non_boundary": 0,
            "isWicketDelivery": 0,
            "player_out": "NA",
            "kind": "NA",
            "fielders_involved": "NA",
            "BattingTeam": "Rajasthan Royals"
        }
    }

    handle(ball) {

    // Wicket (Excluding Run Out)	+25
    // Bonus (LBW / Bowled)		    +8
    // 3 Wicket Bonus				      +4
    // 4 Wicket Bonus				      +8
    // 5 Wicket Bonus				      +16
        // Maiden Over					        +12
        
        if (!this.playerPts[ball["bowler"]]) {
            this.playerPts[ball["bowler"]] = {
                "Wicket":0,
                "Bonus":0,				
                "3Wicket":0 ,		    
                "4Wicket": 0,
                "5Wicket": 0,
                "Maiden": 0,
                "overs": {},
                "team": ball["BattingTeam"]
            }
        }

        if (!this.playerPts[ball["bowler"]]["overs"][ball["overs"]]) {
            this.playerPts[ball["bowler"]]["overs"][ball["overs"]] = {run:0,balls:0};
        }

        let runs = ball["batsman_run"];
        let balls = 1;
        if (ball["extra_type"] != "legbyes") {
            runs += ball["extras_run"];
            balls = 0;
        }
        this.playerPts[ball["bowler"]]["overs"][ball["overs"]]["run"] += runs;
        this.playerPts[ball["bowler"]]["overs"][ball["overs"]]["balls"] += balls;

        if (ball["isWicketDelivery"] && ball["kind"] != "runout"){
        
            this.playerPts[ball["bowler"]]["Wicket"] += 25;
            //legbyes
            if (ball["kind"] === "lbw" || ball["kind"] === "bowled"){
                this.playerPts[ball["bowler"]]["Bonus"] += 8;
            }

            if (!this.playerPts[ball["bowler"]]["3Wicket"] && this.playerPts[ball["bowler"]]["Wicket"] >= 75){
                this.playerPts[ball["bowler"]]["3Wicket"] = 4;
            }
            if (!this.playerPts[ball["bowler"]]["4Wicket"] && this.playerPts[ball["bowler"]]["Wicket"] >= 100){
                this.playerPts[ball["bowler"]]["4Wicket"] = 8;
            }
            if (!this.playerPts[ball["bowler"]]["5Wicket"] && this.playerPts[ball["bowler"]]["Wicket"] >= 125){
                this.playerPts[ball["bowler"]]["5Wicket"] = 16;
            }
       
        }

        if (this.playerPts[ball["bowler"]]["overs"][ball["overs"]]["run"] === 0 && this.playerPts[ball["bowler"]]["overs"][ball["overs"]]["balls"] === 6){
            this.playerPts[ball["bowler"]]["Maiden"] += 16;
        }

        // console.log("bowler playerPts : ", this.playerPts);

        super.handle(ball);
    }
    getScore() {
        let {scoreA,scoreB} = super.getScore();
        this.scoreTeamA += scoreB;
        this.scoreTeamB += scoreA;

        console.log("bowler : ", this.scoreTeamA, " : ", this.scoreTeamB);
    }
 
}


class fieldingHandler extends chainOfResp{
    constructor(next,matchPts,teamA,teamB){
        super(next,teamA,teamB);
        this.match = matchPts;
        this.scoreTeamA = 0;
        this.scoreTeamB = 0;
        this.obj = {
            "ID": 1304114,
            "innings": 2,
            "overs": 16,
            "ballnumber": 1,
            "batter": "SO Hetmyer",
            "bowler": "PH Solanki",
            "non-striker": "R Ashwin",
            "extra_type": "NA",
            "batsman_run": 4,
            "extras_run": 0,
            "total_run": 4,
            "non_boundary": 0,
            "isWicketDelivery": 0,
            "player_out": "NA",
            "kind": "NA",
            "fielders_involved": "NA",
            "BattingTeam": "Rajasthan Royals"
        }
    }

    handle(ball) {

        // Catch		      +8
        // 3 Catch Bonus	  +4
        // Stumping			  +12
        // Run out 	          +6

        if (ball["isWicketDelivery"] && ball["fielders_involved"] != "NA"){
            if (!this.playerPts[ball["fielders_involved"]]) {
                this.playerPts[ball["fielders_involved"]] = {
                    "Catch":0,
                    "3Catch":0,				
                    "Stumping":0,		    
                    "Runout": 0,
                    "team": ball["BattingTeam"]
                }
            }
            if (ball["kind"] === "caught"){
                this.playerPts[ball["fielders_involved"]]["Catch"] += 8;
            }
            if (ball["kind"] === "runout"){
                this.playerPts[ball["fielders_involved"]]["Runout"] += 6;
            }

            if (ball["kind"] === "stumping"){
                this.playerPts[ball["fielders_involved"]]["Stumping"] += 12;
            }

            if (this.playerPts[ball["fielders_involved"]]["3Catch"] && this.playerPts[ball["fielders_involved"]]["Catch"] >= 24) {
                this.playerPts[ball["fielders_involved"]]["3Catch"] = 4;
            }
       
        }

        // console.log("fielder playerPts : ", this.playerPts);

        super.handle(ball);
    }

    getScore() {
        let {scoreA,scoreB} = super.getScore();
        this.scoreTeamA += scoreB;
        this.scoreTeamB += scoreA;
        console.log("fielder : ", this.scoreTeamA, " : ", this.scoreTeamB);
    }
}


class Service{
    constructor(repository){
        this.repository = repository;
    };

    getResult(teamA,teamB){
        try {
            let matchData = this.repository.getResult();
            let fieldHandler = new fieldingHandler(null, teamA, teamB);
            let bowlHandler = new bowlingHandler(fieldHandler,teamA,teamB);
            let batHandler = new batsmenHandler(bowlHandler, teamA, teamB);

            for (let ball of matchData) {
                batHandler.handle(ball);
            }

            batHandler.getScore();
            bowlHandler.getScore();
            fieldHandler.getScore();

            let scoreA = 0;
            let scoreB = 0;

            scoreA += batHandler.scoreTeamA;
            scoreA += bowlHandler.scoreTeamA;
            scoreA += fieldHandler.scoreTeamA;

            scoreB += batHandler.scoreTeamB;
            scoreB += bowlHandler.scoreTeamB;
            scoreB += fieldHandler.scoreTeamB;

            console.log("final scores  teamA : ", scoreA, " teamB : ", scoreB);


            let scoreObj = {};

            scoreObj[teamA] = scoreA;
            scoreObj[teamB] = scoreB;

            return scoreObj;
        }
        catch (err) {
            console.log("error in service : ", err);
            throw new Error("error fetching the match data");
        }
    }
}

module.exports = new Service(Repository);