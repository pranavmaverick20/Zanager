const express = require('express');
const router = express.Router();
const Check = require('../models/checklistitem');
const Task = require('../models/task');

router.post('/createitem/:taskid', async (req, res) => {
    try {
        const taskId = req.params.taskid;
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: "task not found", code: "tnf" });
        }
        const { status, rank, text } = req.body;
        if (!(status && rank && text)) {
            return res.status(404).json({ success: false, message: "Invalid Input", code: "ii" });
        }
        const check = await Check.create({ taskId, status, rank, text });
        res.status(200).json({ success: true, check });
    }
    catch (error) {
        return res.status(500).json({ success: false, error, message: "Internal server error" });
    }
});

//to get by taskid

//try to use patch for changing status of tasks and checklist items
router.get('/getitems/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: "task not found", code: "tnf" });
        }
        const items = await Check.find({ taskId: taskId });
        return res.status(200).json({ success: true, items });
    } catch (error) {
        return res.status(500).json({ success: false, error, message: "Internal server error" });
    }
});

router.put('/updateitem/:id', async (req, res) => {

});

module.exports = router;
