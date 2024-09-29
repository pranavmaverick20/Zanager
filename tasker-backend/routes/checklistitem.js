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
        return res.status(500).json({ success: false, error, message: "Internal server error", code: "ise" });
    }
});

//to get by taskid

//try to use patch for changing checklist items
router.get('/getitems/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: "task not found", code: "tnf" });
        }
        const items = await Check.find({ taskId: taskId });
        if (items.length == 0) {
            return res.status(404).json({ success: false, message: "items not found", code: "inf" });
        }
        return res.status(200).json({ success: true, items });
    } catch (error) {
        return res.status(500).json({ success: false, error, message: "Internal server error", code: "ise" });
    }
});


//taskId cannot be changed
router.put('/updateitem/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const item = await Check.findById(id);
        if (!item) {
            return res.status(404).json({ success: false, message: "item not found", code: "inf" });
        }
        const { status, rank, text } = req.body;
        const nitem = {};
        if (status) {
            nitem.status = status;
        }
        if (rank) {
            nitem.rank = rank;
        }
        if (text) {
            nitem.text = text;
        }
        const upitem = await Check.findByIdAndUpdate(id, { $set: nitem }, { new: true });
        return res.status(200).json({ success: true, upitem });
    } catch (error) {
        return res.status(500).json({ success: false, error, message: "Internal server error", code: "ise" });
    }
});

router.patch('/status/:id/:s', async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.params.s;
        const item = await Check.findById(id);
        if (!item) {
            return res.status(404).json({ success: false, message: "item not found", code: "inf" });
        }
        const nitem = {};
        nitem.status = status;
        const upitem = await Check.findByIdAndUpdate(id, { $set: nitem }, { new: true });
        return res.status(200).json({ success: true, upitem });
    } catch (error) {
        return res.status(500).json({ success: false, error, message: "Internal server error", code: "ise" });
    }
});

router.delete('/deleteitem/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const item = await Check.findById(id);
        if (!item) {
            return res.status(404).json({ success: false, message: "item not found", code: "inf" });
        }
        await Check.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Deleted" });
    } catch (error) {
        return res.status(500).json({ success: false, error, message: "Internal server error", code: "ise" });
    }
});

module.exports = router;
