const express = require('express')
const User = require('../models/user')
const Product = require('../models/product')
const router = express.Router()
const auth = require('../middleware/auth')
const miniauth = require('../middleware/miniauth')
const jwt = require('jsonwebtoken')
const {isEmail, isNumeric} = require('validator')

router.get('', miniauth, async (req ,res) => {
    if(req.user !== null){
        const products = await Product.find({})
        res.render('index', {
            author: 'Andrey Raychev',
            username: req.user.username,
            products
        })
    }else{
        const products = await Product.find({})
        res.render('index', {
            author: 'Andrey Raychev',
            products
        })
    }
})
router.post('/registration', async (req ,res) => {
    const user = await new User(req.body)
    const token = await user.generateAuthToken()
    await user.save()
    res.cookie('auth_token', token)
    res.redirect('/')
})

router.get('/register', (req ,res) => {
    res.render('register', {
        author: "Andrew Raychev"
    })
})

router.get('/login', (req, res) => {
    res.render('login',{
        author: "Andrey Raychev"
    })
})

router.post('/login/user', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        if(!user){
            return res.status(404).send('Пользователь не найден!')
        }
        const token = await user.generateAuthToken()
        res.cookie('auth_token', token)
        res.redirect('/')
    } catch (e) {
        res.status(400).send(e.message)
    }

})

router.get('/profile', auth, (req, res) => {
    res.render('edit',{
        username: req.user.username,
        email: req.user.email,
        phone: req.user.phone,
        author: 'Andrey Raychev'
    })
})

router.post('/user/edit', auth, async (req, res) => {
    try{
        if(isEmail(req.body.email) && isNumeric(req.body.phone)){
            await req.user.updateOne(req.body)
            await req.user.save()
            res.redirect('/')
        }else{
            res.status(400).send('Проверьте правильность почты и телефона')
        }
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.post('/user/logout',auth , async (req, res) => {
    try{
        req.user.tokens = await req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()
        res.redirect('/login')
    } catch (e) {
        res.status(400).send(e.message)
    }
})

module.exports = router