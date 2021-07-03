const mongoose = require('mongoose')
const {isEmail, isNumeric} = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value){
            if(!isNumeric(value)){
                throw new Error('Телефон должен состоять только из цифр')
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value){
            if(!isEmail(value)){
                throw new Error('Неверно введена почта,попробуйте снова!')
            }
        }
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
})

userSchema.virtual('products',{
    ref: 'Product',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.virtual('cart', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'buyer'
})

userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Такого пользователя не существует!')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Логин или пароль введены неверно!')
    }
    return user
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id}, 'budemjitdruzhno')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})
const User = mongoose.model('User', userSchema)

module.exports = User