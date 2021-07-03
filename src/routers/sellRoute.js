const express = require('express')
const miniauth = require('../middleware/miniauth')
const router = express.Router()

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

module.exports = router
