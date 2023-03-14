const User = require('../Models/user-model')
const Chat = require('../Models/chat-model')

const messageReceived = async (req, res, next) => {

    try{
        console.log(req.body.message)
        const message = req.body.message
        const groupId = 0

        const data = await Chat.create({chat: message, GroupId: groupId, UserId: req.user.id})

    } catch(err){
        console.log(err)
    }
    
}

module.exports = {
    messageReceived
}