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

//@desc home
//@route GET / home
router.get('/home', ensureAuth, async (req, res) => { 
    try {
        const boards = await Board.find({ user: req.user.id }).lean();
        res.render('home', {
            name: req.user.firstName,
            boards
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
});


  
module.exports = router