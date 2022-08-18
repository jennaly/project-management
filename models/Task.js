const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        require: true
    },
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true,
    },
    status: {
        type: String,
        default: 'todo',
        enum: ['todo', 'doing','done']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        //required because app will break if user is not present
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

//will automatically create a collection called "Tasks" in the database
module.exports = mongoose.model('Task', TaskSchema)