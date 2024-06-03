const express = require("express");
const { addTeam, topTeams, evaluateMatch } = require("../controllers/TeamController");
const router = express.Router();



router.post("/add-team", addTeam);

router.get("/process-result", evaluateMatch);

router.get("/team-result", topTeams);

module.exports = router;