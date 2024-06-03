const Validator = require("../services/Validator");
const MyService = require("../services/MatchService");
const { Team } = require('../models/model.js');

exports.addTeam = async (req, res) => {
    const teamData = req.body;

    console.log(teamData);

    try {
        console.log(teamData);
        const { name, players, captain, viceCaptain } = Validator.validateAddTeam(teamData);

        console.log("name : ", name, "\nplayers : ", players, "\ncaptain : ", captain, "\nvicecaptain : ", viceCaptain);

        Validator.validateRules(teamData);



        //create the record in mongodb with team name and players data

        const newTeam = new Team({ teamName: name, players, captain, viceCaptain });
        await newTeam.save();


        res.status(401).json({ message: "successfully created the team" });
    }
    catch (err) {

        res.status(500).json({ error: err.message });
    }
}

exports.evaluateMatch = async (req, res) => {


    let teamA = "Chennai Super Kings";
    let teamB = "Rajasthan Royals";

    try {

        let scoreObj = MyService.getResult(teamA, teamB);

        const teams = await Team.find({ teamName: { $in: [teamA, teamB] } });

        for (const team of teams) {
            if (team.teamName === teamA) {
                team.points = scoreObj[teamA];
            }
            else if (team.teamName === teamB) {
                team.points = scoreObj[teamB];
            }
            await team.save();
        }

        //mongodb insert service logic

        res.status(200).json(scoreObj);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.topTeams = async (req, res) => {


    let teamA = "Chennai Super Kings";
    let teamB = "Rajasthan Royals";

    try {
        const tms = await Team.find();
        const sortedTeams = tms.sort((t1, t2) => t2.points - t1.points);
        let topTeams = [];
        if (sortedTeams.length) {
            let maxPt = sortedTeams[0].points;
            for (tm of sortedTeams) {
                if (tm.points === maxPt) {
                    topTeams.push(tm);
                }
                else {
                    break;
                }
            }
        }
        // let scoreObj = MyService.getResult(teamA, teamB);
        res.status(200).json(topTeams);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

