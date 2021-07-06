const express = require('express')
const miniauth = require('../middleware/miniauth')
const router = express.Router()
const auth = require('../middleware/auth')

//Sells page
router.get('/sells',miniauth, (req, res) => {
    if(req.user !== null){
        res.render('sells', {
            author: 'Andrey Raychev',
            username: req.user.username
        })
    }else{
        res.render('sells', {
            author: 'Andrey Raychev'
        })
    }
})

//Set the product for sell
router.get('/product/sell', auth, async (req, res) => {
    try{
        const form = true
        res.render('sells',{
        username: req.user.username,
        form,
        author: "Andrey Raychev"
        })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

module.exports = router
