const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
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
module.exports = mongoose.model('Board', BoardSchema)