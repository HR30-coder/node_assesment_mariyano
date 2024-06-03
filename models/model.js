const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: String,
  type: String,
});

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  players: { type: [playerSchema], required: true },
  captain: { type: String, required: true },
  viceCaptain: { type: String, required: true },
  points: { type: Map, of: Number, default: {} },
  totalPoints: { type: Number, default: 0 },
});

const Team = mongoose.model('Team', teamSchema);

module.exports = { Team };