const jwt = require('jsonwebtoken')
const User = require('../models/user')
const isEmpty = (token) => {
    return !Object.keys(token).length > 0
}

//Mini authentication,even if user is not authenticated, he can still view the page
const miniauth = async (req, res, next) => {
    try{
        const token = req.cookies['auth_token']
        if(token === undefined)
        {
            req.token = false
            req.user = false
            next()
        }else{
            const decoded = jwt.verify(token, 'budemjitdruzhno')
            const user = await User.findOne({_id: decoded._id, 'tokens.token': token})   
            req.token = token
            req.user = user
            next()
        }
    } catch (e) {
        res.status(401).send(e.message)
    }
}

//Exports modules
module.exports = miniauth