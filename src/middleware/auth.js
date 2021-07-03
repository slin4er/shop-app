const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try{
        const token = req.cookies['auth_token']
        const decoded = jwt.verify(token, 'budemjitdruzhno')
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
        if(!user){
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send('Вы не вошли!')
    }
}

module.exports = auth