const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const Task = require("../models/task");
const router = express.Router();
const User = require("../models/user");

/**
 * status 0: assigned
 *        1: doing
 *        2: completed
 */

router.post("/createtask", fetchuser, async (req, res) => {
  try {
    if (!req.data.id) {
      return res
        .status(404)
        .json({ success: false, message: "User not found", code: "unf" });
    }
    const { title, description, tags, assigneeId, deadline } = req.body;
    if (!(title && description && assigneeId)) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Input", code: "ii" });
    }
    const assignee = await User.findById(assigneeId);
    if (!assignee) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid assignee", code: "inva" });
    }
    const newTask = await Task.create({
      title,
      description,
      tags,
      assigneeId,
      deadline: new Date(deadline),
      status: 0,
      reportedId: req.data.id,
    });
    res.status(200).json({ success: true, newTask });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: error, message: "Internal server error" });
  }
});

router.get("/tasksyouassigned", fetchuser, async (req, res) => {
  try {
    if (!req.data.id) {
      return res
        .status(404)
        .json({ success: false, message: "User not found", code: "unf" });
    }
    const tasks = await Task.find({ reportedId: req.data.id });
    if (!tasks) {
      return res
        .status(200)
        .json({ success: "true", message: "No tasks assigned" });
    }
    return res.status(200).json({ success: true, tasks });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: error, message: "Internal server error" });
  }
});

router.get("/mytasks", fetchuser, async (req, res) => {
  try {
    if (!req.data.id) {
      return res
        .status(404)
        .json({ success: false, message: "User not found", code: "unf" });
    }
    const tasks = await Task.find({ assigneeId: req.data.id });
    if (!tasks) {
      return res
        .status(200)
        .json({ success: "true", message: "No tasks assigned to you" });
    }
    return res.status(200).json({ success: true, tasks });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: error, message: "Internal server error" });
  }
});

module.exports = router;
