const mongoose = require('mongoose');
const checklistitem_schema = mongoose.Schema({
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    rank: {
        type: Number,
        required: true
    },
    text: {
        type: String,
        required: true
    }
});
const checklistitem_model = mongoose.model("Checklistitem", checklistitem_schema);
module.exports = checklistitem_model;