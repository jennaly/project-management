const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const Board = require('../models/Board')
const Task = require('../models/Task')


// @desc    Show add page
// @route   GET /board/add
router.get('/add', ensureAuth, (req, res) => {
 res.render('boards/add')
})


// @desc    Process add form
// @route   POST /boards
router.post('/', ensureAuth, async (req, res) => {
    try {
      req.body.user = req.user.id;
      const newBoard = await Board.create(req.body);
      res.redirect(`/boards/${newBoard._id}`)
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
})



//TASKS

//@desc Show a board and its tasks
//@route GET / boards/:boardId
router.get('/:boardId', ensureAuth, async (req, res) => { 
  try {
      const boards = await Board.find( {user: req.user.id }).lean();
      const board = await Board.findOne({ _id: req.params.boardId });
      const tasks = await Task.find({ user: req.user.id, board: req.params.boardId }).lean();
      
      res.render('boards/show', {
          name: req.user.firstName,
          boardName: board.title,
          boardId: board._id,
          tasks,
          boards
      })
  } catch (err) {
      console.error(err)
      res.render('error/500')
  }
});

//@desc Show add-task page
//@route GET / boards/:boardId/add
router.get('/:boardId/add', ensureAuth, async (req, res) => {
  try {
    const board = await Board.findOne({ _id: req.params.boardId });

    res.render('boards/add-task', {
      boardId: board._id,
    });
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

//@desc Process form for adding tasks to a board
//@route POST / boards/:boardId
router.post('/:boardId', ensureAuth, async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      board: req.params.boardId,
      user: req.user.id,
    });

    return res.redirect(`/boards/${req.params.boardId}`);
  } catch (err) {
    console.error(err);
    res.render('error/500')
    
  }
})

module.exports = router