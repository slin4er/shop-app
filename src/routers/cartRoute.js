const express = require('express')
const miniauth = require('../middleware/miniauth')
const router = express.Router()

router.get('/cart',miniauth, (req, res) => {
    if(req.user !== null){
        res.render('cart', {
            author: 'Andrey Raychev',
            username: req.user.username
        })
    }else{
        res.render('cart', {
            author: 'Andrey Raychev'
        })
    }
})

module.exports = router