const express = require('express')
const bodyParser = require('body-parser')
// app.use(express.static('public'))
require('dotenv').config()
const path = require('path')

const fs = require('fs')

//Import all models
const User = require('./Models/user-model')
const Chat = require('./Models/chat-model')
// const Group = require('./Models/group-model')
// const UserToGroup = require('./Models/userToGroup-model')

const sequelize = require('./util/database')
const cors = require('cors')

const app = express()

// app.use(cors({
//     origin: 'http://localhost:4000',
//     // origin: 'http://127.0.0.1:5500/'    
//     //origin: '*'
// }))
app.use(cors())

app.use(bodyParser.json({extended:false}))

//Import all routes
const signupRoute = require('./Routes/signup-route')
const loginRoute = require('./Routes/login-route')
const chatRoute = require('./Routes/chat-route')


//app.use all routes in ORDER
app.use(signupRoute)
app.use(loginRoute)
app.use(chatRoute)

app.use((req, res) => {
    // console.log(req.url)
    res.sendFile(path.join(__dirname, `public/${req.url}`))
})

//Relations between tables in database
User.hasMany(Chat)
Chat.belongsTo(User)

// Group.hasMany(Chat)
// Chat.belongsTo(Group)

// User.belongsToMany(Group, {through : UserToGroup})
// Group.belongsToMany(User, {through : UserToGroup})


//{force: true} 
sequelize.sync()
.then(() => {
    app.listen(4000)
}) 
.catch(err => {
    console.log(err)
})