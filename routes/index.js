const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Board = require('../models/Board')

//@desc Login/landing page
//@route GET /
router.get('/', ensureGuest, (req,res) => {
    res.render('login', {
        layout: 'login'
    })
})

//@desc Dashboard
//@route GET / dashboard
router.get('/dashboard', ensureAuth, async (req, res) => { 
    try {
        const boards = await Board.find({ user: req.user.id }).lean();

        if (boards.length >= 1) {
            return res.redirect(`/boards/${boards[0].id}`);
        } else {
            return res.render('dashboard', {
                name: req.user.firstName
            })
        }

    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
 
  
});


  
module.exports = router