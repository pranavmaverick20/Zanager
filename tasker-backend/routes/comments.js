const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const User = require('../models/user');
const Task = require('../models/task');
const Comment = require('../models/comment');

router.post('/writecomment', fetchuser, async (req, res) => {
    try {
        const taskid = req.body.id;
        const userid = req.data.id;
        const text = req.body.text;
        const task = await Task.findById(taskid);
        const user = await User.findById(userid);
        if (!(taskid && text)) {
            return res.status(404).json({ success: false, message: "invalid input", code: "ii" });
        }
        if (!(task && user)) {
            return res.status(401).json({ success: false, message: "user or task not found", code: "utnf" });
        }
        const comment = {};
        comment.taskId = taskid;
        comment.userId = userid;
        comment.text = text;
        const newcom = await Comment.create(comment);
        return res.status(200).json({ success: true, newcom });
    } catch (error) {
        return res.status(500).json({ success: false, error, message: "Internal server error", code: "ise" });
    }
});

router.get('/task/:id', async (req, res) => {
    try {
        const taskid = req.params.id;
        const task = await Task.findById(taskid);
        if (!task) {
            return res.status(404).json({ success: false, message: "task not found", code: "tnf" });
        }
        const comments = await Comment.find({ taskId: taskid });
        return res.status(200).json({ success: true, comments });
    } catch (error) {
        return res.status(500).json({ success: false, error, message: "Internal server error", code: "ise" });
    }
});

router.patch('/comment/:id', fetchuser, async (req, res) => {
    try {
        const text = req.body.text;
        if (!text) {
            return res.status(404).json({ success: false, message: "invalid input", code: "ii" });
        }
        const commentid = req.params.id;
        const comment = await Comment.findById(commentid);
        if (!comment) {
            return res.status(404).json({ success: false, message: "comment not found", code: "cnf" });
        }
        const userid = req.data.id;
        if (userid.toString() != comment.userId.toString()) {
            return res.status(403).json({ success: false, message: "Restricted access", code: "ra" });
        }
        await Comment.findByIdAndUpdate(commentid, { text: text });
        return res.status(200).json({ success: true, message: "Updated" });
    } catch (error) {
        return res.status(500).json({ success: false, error, message: "Internal server error", code: "ise" });
    }
});

router.delete('/comment/:id', fetchuser, async (req, res) => {
    try {
        const commentid = req.params.id;
        const comment = await Comment.findById(commentid);
        if (!comment) {
            return res.status(404).json({ success: false, message: "comment not found", code: "cnf" });
        }
        const userid = req.data.id;
        if (userid.toString() != comment.userId.toString()) {
            return res.status(403).json({ success: false, message: "Restricted access", code: "ra" });
        }
        await Comment.findByIdAndDelete(commentid);
        return res.status(200).json({ success: true, message: "Deleted" });
    } catch (error) {
        return res.status(500).json({ success: false, error, message: "Internal server error", code: "ise" });
    }
});

module.exports = router;