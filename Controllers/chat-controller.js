const User = require('../Models/user-model')
const Chat = require('../Models/chat-model')

const getAllChats = async (req, res, next) => {
    try{
            const allChats = await Chat.findAll()
            res.status(200).json(allChats)
    } catch(err){
        console.log('Error in getAllChats function>>>>>>>>>>>>>>>>>>>>>>', err)
        res.status(500).json(err, {message: 'Internal server error'})
    }
}

const messageReceived = async (req, res, next) => {

    try{
        console.log(req.body.message)
        const message = req.body.message
        const groupId = 0

        const data = await Chat.create({chat: message, GroupId: groupId, UserId: req.user.id})

        res.status(200).json({message: 'successfully saved'})

    } catch(err){
        console.log('error in messageReceived', err)
        res.status(500).json({message: 'Internal server error 500'})
    }
    
}

module.exports = {
    messageReceived,
    getAllChats
}