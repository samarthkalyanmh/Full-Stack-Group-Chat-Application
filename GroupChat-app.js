const express = require('express')
const bodyParser = require('body-parser')
// app.use(express.static('public'))
require('dotenv').config()
const path = require('path')

const fs = require('fs')

//Import all models
const User = require('./Models/user-model')

const sequelize = require('./util/database')
const cors = require('cors')

const app = express()

app.use(cors({
    origin: 'http://localhost:4000',
    // origin: 'http://127.0.0.1:5500/'    
    //origin: '*'
}))

app.use(bodyParser.json({extended:false}))

//Import all routes
const signupRoute = require('./Routes/signup-route')

//app.use all routes in ORDER
app.use(signupRoute)

app.use((req, res) => {
    // console.log(req.url)
    res.sendFile(path.join(__dirname, `public/${req.url}`))
})

//Relations between tables in database

//{force: true}

sequelize.sync()
.then(() => {
    app.listen(4000)
}) 
.catch(err => {
    console.log(err)
})