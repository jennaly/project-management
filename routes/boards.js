const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const Board = require('../models/Board')
const Task = require('../models/Task')

//@desc Individual Board
//@route GET / board/:boardId
router.get('/boards/:boardId', ensureAuth, async (req, res) => { 
    try {
        const board = await Board.findOne({ _id: req.params.boardId });
        const tasks = await Task.find({ user: req.user.id, board: req.params.boardId }).lean();
        
        res.render('board', {
            name: req.user.firstName,
            boardName: board.title,
            tasks,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
});