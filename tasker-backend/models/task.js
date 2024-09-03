const mongoose = require('mongoose');
const taskSchema = mongoose.Schema(
    {
        title: {
            requied: true,
            type: String
        }
    }
)