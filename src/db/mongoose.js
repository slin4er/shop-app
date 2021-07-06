//Imports
const express = require('express')
const mongoose = require('mongoose')

//Connection to the database
mongoose.connect('mongodb://127.0.0.1:27017/shop-app',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})