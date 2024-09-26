const Team = require("../models/team");
const UserTeam = require("../models/userteam");
const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const otp_gen = require("otp-generator");

//create personal team for user
//the  user who creates the team is automatically a part of the team
router.post("/createteam", fetchuser, async (req, res) => {
  try {
    if (!req.data.id) {
      return res
        .status(404)
        .json({ success: false, message: "User not found", code: "unf" });
    }
    const { name, description } = req.body;
    if (!name || !description) {
      return res
        .status(422)
        .json({ success: false, message: "Invalid Input", code: "ii" });
    }
    let code = otp_gen.generate(6, {
      upperCaseAlphabets: true,
      specialChars: false,
      lowerCaseAlphabets: true,
    });
    while (await Team.findOne({ code })) {
      //if code is already taken by another team
      code = otp_gen.generate(6, {
        upperCaseAlphabets: true,
        specialChars: false,
        lowerCaseAlphabets: true,
      });
    }
    const team = await Team.create({ name, description, code });
    const userteam = await UserTeam.create({
      userId: req.data.id,
      teamId: team.id,
    });
    return res
      .status(200)
      .json({ success: true, message: "team created", team, userteam });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error, message: "Internal server error" });
  }
});

router.get("/userteams", fetchuser, async (req, res) => {
  try {
    if (!req.data.id) {
      return res
        .status(404)
        .json({ success: false, message: "User not found", code: "unf" });
    }
    const userteams = await UserTeam.find({ userId: req.data.id });
    const teamids = userteams.map((userteam) => userteam.teamId);
    const teams = [];
    for (let i of teamids) {
      teams.push(await Team.findById(i));
    }
    return res.status(200).json({ success: true, teams });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error, message: "Internal server error" });
  }
});

router.post("/jointeam", fetchuser, async (req, res) => {
  try {
    const userId = req.data.id;
    const code = req.body.code;
    if (!userId || !code) {
      return res.status(404).json({
        success: false,
        message: "User or team not found",
        code: "utnf",
      });
    }
    const team = await Team.findOne({ code });
    if (!team) {
      return res
        .status(404)
        .send({ success: false, message: "Incorrect code", code: "ic" });
    }
    let userteam = await UserTeam.findOne({ userId, teamId: team.id });
    if (userteam) {
      return res.status(400).send({
        success: false,
        message: "User already in team",
        code: "uait",
      });
    }
    userteam = await UserTeam.create({ userId, teamId: team.id });
    return res.status(200).json({ success: true, userteam });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error, message: "Internal server error" });
  }
});

router.put("/updateteambyid", async (req, res) => {
  try {
    let newteam = {};
    if (req.body.name) {
      newteam = await Team.findByIdAndUpdate(
        req.body.id,
        { name: req.body.name },
        { new: true }
      );
    }
    if (req.body.description) {
      newteam = await Team.findByIdAndUpdate(
        req.body.id,
        { description: req.body.description },
        { new: true }
      );
    }
    return res.status(200).json({ success: true, newteam });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error, message: "Internal server error" });
  }
});

router.delete("/leaveteam", fetchuser, async (req, res) => {
  try {
    const userId = req.data.id;
    const teamId = req.body.id;
    if (!userId || !teamId) {
      return res.status(404).json({
        success: false,
        message: "User or team not found",
        code: "utnf",
      });
    }
    await UserTeam.findOneAndDelete({ userId, teamId });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error, message: "Internal server error" });
  }
});

module.exports = router;
