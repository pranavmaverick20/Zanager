const mongoose = require('mongoose');
const task_schema = mongoose.Schema(
    {
        title: {
            required: true,
            type: String
        },
        description: {
            required: true,
            type: String
        },
        tags: {
            required: false,
            type: String
        },
        status: {
            required: true,
            type: Number
        },
        assigneeId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        reportedId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        deadline: {
            required: false,
            type: Date
        }
    },
    {
        timestamps: true
    }
);
const task_model = mongoose.model("Task", task_schema);
module.exports = task_model;