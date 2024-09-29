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

// Create a task
router.post("/createtask", fetchuser, async (req, res) => {
  try {
    if (!req.data.id) {
      return res.status(404).json({ success: false, message: "User not found", code: "unf" });
    }
    const { title, description, tags, assigneeemail, deadline } = req.body;
    if (!(title && description && assigneeemail)) {
      return res.status(404).json({ success: false, message: "Invalid Input", code: "ii" });
    }
    const assignee = await User.findOne({ email: assigneeemail });
    if (!assignee) {
      return res.status(404).json({ success: false, message: "Invalid assignee", code: "inva" });
    }
    const newTask = await Task.create({
      title,
      description,
      tags,
      assigneeId: assignee.id,
      deadline: new Date(deadline),
      status: 0,
      reportedId: req.data.id,
    });
    res.status(200).json({ success: true, newTask });
  } catch (error) {
    return res.status(500).json({ success: false, error, message: "Internal server error" });
  }
});

// Get tasks assigned by the user
router.get("/tasksyouassigned", fetchuser, async (req, res) => {
  try {
    if (!req.data.id) {
      return res.status(404).json({ success: false, message: "User not found", code: "unf" });
    }
    const tasks = await Task.find({ reportedId: req.data.id });
    if (!tasks.length) {
      return res.status(200).json({ success: true, message: "No tasks assigned" });
    }
    return res.status(200).json({ success: true, tasks });
  } catch (error) {
    return res.status(500).json({ success: false, error, message: "Internal server error" });
  }
});

// Get tasks assigned to the user
router.get("/mytasks", fetchuser, async (req, res) => {
  try {
    if (!req.data.id) {
      return res.status(404).json({ success: false, message: "User not found", code: "unf" });
    }
    const tasks = await Task.find({ assigneeId: req.data.id });
    if (!tasks.length) {
      return res.status(200).json({ success: true, message: "No tasks assigned to you" });
    }
    return res.status(200).json({ success: true, tasks });
  } catch (error) {
    return res.status(500).json({ success: false, error, message: "Internal server error" });
  }
});

// Get a task by ID
router.get("/taskbyid/:id", async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(404).json({ success: false, message: "no input", code: "ni" });
    }
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "task not found", code: "tnf" });
    }
    return res.status(200).json({ success: true, task });
  } catch (error) {
    return res.status(500).json({ success: false, error, message: "Internal server error" });
  }
});

// Update a task by ID
router.put("/updatebyid/:id", fetchuser, async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(404).json({ success: false, message: "no input", code: "ni" });
    }
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "task not found", code: "tnf" });
    }
    const userid = req.data.id;
    if (task.reportedId.toString() != userid) {
      return res.status(404).json({ success: false, message: "Restricted access", code: "ri" });
    }
    const { title, description, tags, status, assigneeId, deadline } = req.body;
    const uptask = {};
    if (title) uptask.title = title;
    if (description) uptask.description = description;
    if (tags) uptask.tags = tags;
    if (status) uptask.status = status;
    if (assigneeId) uptask.assigneeId = assigneeId;
    if (deadline) uptask.deadline = new Date(deadline);

    const updatedtask = await Task.findByIdAndUpdate(req.params.id, { $set: uptask }, { new: true });
    return res.status(200).json({ success: true, updated: updatedtask });
  } catch (error) {
    return res.status(500).json({ success: false, error, message: "Internal server error" });
  }
});

// Delete a task by ID
router.delete("/deletebyid/:id", fetchuser, async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(404).json({ success: false, message: "no input", code: "ni" });
    }
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "task not found", code: "tnf" });
    }
    const userid = req.data.id;
    if (task.reportedId.toString() != userid) {
      return res.status(404).json({ success: false, message: "Restricted access", code: "ri" });
    }
    await Task.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: "deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error, message: "Internal server error" });
  }
});

router.patch('/status/:id', fetchuser, async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(404).json({ success: false, message: "no input", code: "ni" });
    }
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "task not found", code: "tnf" });
    }
    const userid = req.data.id;
    if (task.reportedId.toString() != userid) {
      return res.status(404).json({ success: false, message: "Restricted access", code: "ri" });
    }
    const { status } = req.body;
    await Task.findByIdAndUpdate(req.params.id, { status: status });
    return res.status(200).json({ success: true, message: "Updated" });
  }
  catch (error) {
    return res.status(500).json({ success: false, error, message: "Internal server error" });
  }
});

module.exports = router;
