const User = require('../Models/user-model')
const Chat = require('../Models/chat-model')    


//ADD CODE TO STORE ONLY 1000 messages in localstorage
const getAllChats = async (req, res, next) => {
    try{
            // const allChats = await Chat.findAll()

            const lastMessageId = req.query.lastmessageid

            // console.log('Last message id>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ', lastMessageId)

            let chatsWithUsersName
            if(lastMessageId === '0'){

                console.log('All chats sending>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
                chatsWithUsersName = await Chat.findAll({
                    attributes: ['id','chat'],    
                    include: [{     
                        model : User,
                        attributes : ['name'],
                        required : true
                    }],
                  order : ['id']
                })
                return res.status(200).json(chatsWithUsersName)
            } else{
                //Replace below line with countAll
                let allChats = await Chat.findAll()

                let lastMessageIdInDB = allChats[allChats.length - 1].id
                lastMessageIdInDB = lastMessageIdInDB.toString()

                // console.log('lastMessageIdInDB>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', lastMessageIdInDB)

                if(lastMessageIdInDB === lastMessageId){
                    return res.status(200).json({update: false})

                } else{
                    console.log('Updates chats sending>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
                    chatsWithUsersName = await Chat.findAll({
                        offset: parseInt(lastMessageId),  
                        attributes: ['id','chat'],    
                        include: [{     
                            model : User,
                            attributes : ['name'],
                            required : true
                        }],
                      order : ['id']
                    })
                    // console.log('sending chatsWithUsersName>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', chatsWithUsersName)

                    return res.status(200).json({update: true, newChats: chatsWithUsersName})
                }  
            }

            /* To access name: chatsWithUsersName[i].User.name */

    } catch(err){
        console.log('Error in getAllChats function>>>>>>>>>>>>>>>>>>>>>>', err)
        res.status(500).json({message: 'Internal server error 500', err: err})
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