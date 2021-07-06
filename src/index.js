//Imports
const express = require('express')
const port = process.env.PORT || 3000
const app = express()
require('./db/mongoose')
const path = require('path')
const hbs = require('hbs')
const cartRoute = require('./routers/cartRoute')
const sellRoute = require('./routers/sellRoute')
const userRoute = require('./routers/userRoute')
const productRoute = require('./routers/productRoute')
const cookieParser = require('cookie-parser')
const { rename } = require('fs')

//Directories
const publicDirectory = path.join(__dirname, '../public')
const viewDirectory = path.join(__dirname, '../templates/views')
const partialDirectory = path.join(__dirname, '../templates/partials')

//Setting routes and views
hbs.registerPartials(partialDirectory)
app.set('view engine', 'hbs')
app.set('views', viewDirectory)
app.use(express.static(publicDirectory))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(userRoute)
app.use(cartRoute)
app.use(sellRoute)
app.use(productRoute)

//Listening to the port
app.listen(port,() => {
    console.log('server is up on port ' + port)
})