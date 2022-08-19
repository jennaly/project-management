const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const Board = require('../models/Board')
const Task = require('../models/Task')


// @desc    Show add board page
// @route   GET /boards/add
router.get('/add', ensureAuth, async (req, res) => {
  try {
    const boards = await Board.find({ user: req.user.id }).lean();
    res.render('boards/add-board', {
      boards
    })

  } catch (err) {
    console.err(error);
    res.render('error/500')
  }

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

// @desc Show board edit page
// @route GET /boards/boardId/edit
router.get('/:boardId/edit', ensureAuth, async (req,res) => {
  try {
    const board = await Board.findOne({ _id: req.params.boardId }).lean();
    
    res.render('boards/edit-board', {
      boardId: board._id,
      title: board.title
    })

  } catch (err) {
      console.error(err)
      res.render('error/500')
  }

})

// @desc Process form that edits board
// @route POST /boards/boardId
router.post('/:boardId', ensureAuth, async (req, res) => {
  try {
    await Board.findOneAndUpdate({ _id: req.params.boardId }, {
      title: req.body.title
    }).lean();

    res.redirect('/')

  } catch (err) {
    console.err(error);
    res.render('error/500')
  }
})

// @desc Process form that deletes board
// @route DELETE /boards/boardId
router.delete('/:boardId', ensureAuth, async (req, res) => {
  try {
    await Board.remove({ _id: req.params.boardId })
    res.redirect('/home')

  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

//TASKS

//@desc Show a board and its tasks
//@route GET / boards/:boardId
router.get('/:boardId', ensureAuth, async (req, res) => { 
  try {
      const boards = await Board.find({ user: req.user.id }).lean();
      const board = await Board.findOne({ _id: req.params.boardId });
      const todo = await Task.find({ user: req.user.id, board: req.params.boardId, status: 'todo'}).lean();
      const doing = await Task.find({ user: req.user.id, board: req.params.boardId, status: 'doing'}).lean();
      const done = await Task.find({ user: req.user.id, board: req.params.boardId, status: 'done'}).lean();

      res.render('boards/show', {
          name: req.user.firstName,
          boardName: board.title,
          boardId: board._id,
          boards,
          todo,
          doing,
          done
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
    const board = await Board.findOne({ _id: req.params.boardId }).lean();

    res.render('boards/add-task', {
      boardId: board._id,
    });

  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

//@desc Process form for adding tasks to a board
//@route POST /boards/:boardId
router.post('/:boardId/add', ensureAuth, async (req, res) => {
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

//@desc Show task edit page
//@route GET /boards/boardId/taskId/edit
router.get('/:boardId/:taskId/edit', ensureAuth, async (req,res) => {
  try {
    const boards = await Board.find({ user: req.user.id }).lean();
    const board = await Board.findOne({ _id: req.params.boardId }).lean();
    const task = await Task.findOne({ _id: req.params.taskId }).lean();

    res.render('boards/edit-task', {
      boardId: board._id,
      taskId: task._id,
      title: task.title,
      description: task.description,
      status: task.status,
      boards,
    });

  } catch (err) {
    console.err(error);
    res.render('error/500')
  }
})


// @desc Process form for editing tasks
// @route POST /boards/boardId/taskId
router.post('/:boardId/:taskId', ensureAuth, async (req,res) => {
  try {
    await Task.findOneAndUpdate({ _id: req.params.taskId }, {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
    }).lean();

    res.redirect(`/boards/${req.params.boardId}`)

  } catch (err) {
    console.error(err);
    res.render('error/500')
  }
})

// @desc Process form for deleting tasks
// @route DELETE /boards/boardId/taskId
router.delete('/:boardId/:taskId', ensureAuth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.taskId })
    await task.remove();

    res.redirect(`/boards/${task.board}`)

  } catch (err) {
    console.error(err);
    res.render('error/500')
  }
})

module.exports = router
